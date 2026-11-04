"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  CONTACT_CATEGORIES,
  CONTACT_PHONE,
  CONTACT_TEL,
  EMPTY_CONTACT,
  validateContact,
  type ContactErrors,
  type ContactFields,
} from "@/lib/contact-validation";

type Status = {
  kind: "idle" | "sending" | "success" | "error";
  message: string;
};
export function ContactForm({ configured }: { configured: boolean }) {
  const [fields, setFields] = useState<ContactFields>({ ...EMPTY_CONTACT });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const sending = useRef(false);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  function update(key: keyof ContactFields, value: string | boolean) {
    setFields((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || sending.current || status.kind === "success") return;
    const checked = validateContact(fields);
    setErrors(checked.errors);
    if (!checked.data) {
      setStatus({
        kind: "error",
        message: "入力に誤りがあります。各項目をご確認ください。",
      });
      const first = Object.keys(checked.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    sending.current = true;
    setStatus({
      kind: "sending",
      message: "送信中です。このままお待ちください。",
    });
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        credentials: "same-origin",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(checked.data),
      });
      const result = await response.json();
      if (response.ok && result.ok === true) {
        setStatus({
          kind: "success",
          message:
            "お問い合わせを受け付けました。これは正式な受講申込みや決済の受付ではありません。",
        });
        setFields({ ...EMPTY_CONTACT });
      } else {
        setErrors(
          result.errors && typeof result.errors === "object"
            ? result.errors
            : {},
        );
        setStatus({
          kind: "error",
          message:
            typeof result.message === "string"
              ? result.message
              : "送信を確認できませんでした。電話でお問い合わせください。",
        });
      }
    } catch {
      setStatus({
        kind: "error",
        message:
          "送信結果を確認できませんでした。受信済みの可能性もあるため、再送信の前に電話でお問い合わせください。",
      });
    } finally {
      window.clearTimeout(timeout);
      sending.current = false;
      window.setTimeout(() => statusRef.current?.focus(), 0);
    }
  }
  const error = (key: keyof ContactFields) =>
    errors[key] ? (
      <p id={`contact-${key}-error`} className="field-error">
        {errors[key]}
      </p>
    ) : null;
  const described = (key: keyof ContactFields) =>
    errors[key] ? `contact-${key}-error` : undefined;
  const disabled =
    !configured || status.kind === "sending" || status.kind === "success";
  return (
    <div className="contact-form-panel" data-contact-configured={configured}>
      <h3>フォームでお問い合わせ</h3>
      <p id="contact-purpose">
        受講相談・資料請求・一般的なお問い合わせを承ります。正式な受講申込み・契約・決済は受け付けていません。
      </p>
      {!configured && (
        <p className="form-unavailable" role="status">
          フォーム送信は現在準備中です。こちらからは送信できません。
          <br />
          お電話 <a href={CONTACT_TEL}>{CONTACT_PHONE}</a>{" "}
          でお問い合わせください。
        </p>
      )}
      <noscript>
        <p className="form-unavailable">
          フォームの送信にはJavaScriptが必要です。電話でお問い合わせください。
        </p>
      </noscript>
      <form
        ref={formRef}
        onSubmit={submit}
        method="post"
        action="/api/contact"
        noValidate
        aria-describedby="contact-purpose contact-data-note"
        aria-busy={status.kind === "sending"}
      >
        <fieldset disabled={disabled}>
          <legend className="sr-only">お問い合わせの入力項目</legend>
          <div className="form-field">
            <label htmlFor="contact-category">お問い合わせの種類</label>
            <select
              id="contact-category"
              name="category"
              value={fields.category}
              onChange={(e) => update("category", e.target.value)}
              aria-invalid={!!errors.category}
              aria-describedby={described("category")}
            >
              {CONTACT_CATEGORIES.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            {error("category")}
          </div>
          <div className="form-field">
            <label htmlFor="contact-name">
              お名前 <span>必須</span>
            </label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              value={fields.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={described("name")}
            />
            {error("name")}
          </div>
          <div className="form-field">
            <label htmlFor="contact-email">
              メールアドレス <span>必須</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={254}
              value={fields.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={described("email")}
            />
            {error("email")}
          </div>
          <div className="form-field">
            <label htmlFor="contact-phone">
              電話番号 <small>任意</small>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={30}
              value={fields.phone}
              onChange={(e) => update("phone", e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby={described("phone")}
            />
            {error("phone")}
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">
              お問い合わせ内容 <span>必須</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={7}
              required
              maxLength={3000}
              value={fields.message}
              onChange={(e) => update("message", e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={["contact-message-hint", described("message")]
                .filter(Boolean)
                .join(" ")}
            />
            <p id="contact-message-hint" className="form-hint">
              3,000文字以内。資料請求の場合は、知りたい内容をお知らせください。病歴などの詳しい健康情報、カード番号等は入力しないでください。
            </p>
            {error("message")}
          </div>
          <div className="contact-trap" aria-hidden="true">
            <label htmlFor="contact-website">
              この項目は空欄にしてください
            </label>
            <input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={fields.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>
          <div className="consent-field">
            <input
              id="contact-consent"
              name="consent"
              type="checkbox"
              required
              checked={fields.consent}
              onChange={(e) => update("consent", e.target.checked)}
              aria-invalid={!!errors.consent}
              aria-describedby={described("consent")}
            />
            <label htmlFor="contact-consent">
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                プライバシーポリシー（別タブ）
              </a>
              を確認し、同意します。<span>必須</span>
            </label>
          </div>
          {error("consent")}
        </fieldset>
        <p id="contact-data-note" className="form-hint">
          送信を有効にした後は、入力内容をお問い合わせ対応のためFormspree経由で主催者へ送信します。このフォームの処理では、入力内容をサイト内に保存したり、ログへ出力したりしません。
        </p>
        <button
          className="renewal-button form-submit"
          type="submit"
          disabled={disabled}
        >
          {!configured
            ? "フォーム送信は準備中です"
            : status.kind === "sending"
              ? "送信中…"
              : status.kind === "success"
                ? "受付完了"
                : "お問い合わせを送信する"}
        </button>
        <p
          ref={statusRef}
          tabIndex={-1}
          className={`form-result result-${status.kind}`}
          role={status.kind === "error" ? "alert" : "status"}
          aria-live={status.kind === "error" ? "assertive" : "polite"}
        >
          {status.message}
        </p>
      </form>
    </div>
  );
}
