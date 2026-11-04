export const CONTACT_PHONE = "0985-74-7643";
export const CONTACT_TEL = "tel:0985747643";
export const CONTACT_CATEGORIES = [
  "受講相談",
  "資料請求",
  "一般的なお問い合わせ",
] as const;
export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  consent: boolean;
  website: string;
};
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;
export const EMPTY_CONTACT: ContactFields = {
  name: "",
  email: "",
  phone: "",
  category: "受講相談",
  message: "",
  consent: false,
  website: "",
};

// Shared validation; the server validates again without trusting the browser.
export function validateContact(input: unknown): {
  data?: ContactFields;
  errors: ContactErrors;
} {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { errors: { message: "入力内容を確認してください。" } };
  }
  const raw = input as Record<string, unknown>;
  const text = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  const data: ContactFields = {
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    category: text("category"),
    message: text("message"),
    consent: raw.consent === true,
    website: text("website"),
  };
  const errors: ContactErrors = {};
  const singleLine = (value: string) => !/[\u0000-\u001f\u007f]/.test(value);
  if (!data.name || data.name.length > 100 || !singleLine(data.name))
    errors.name = "お名前を100文字以内で入力してください。";
  if (
    data.email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email) ||
    !singleLine(data.email)
  )
    errors.email = "メールアドレスを正しい形式で入力してください。";
  if (
    data.phone &&
    (data.phone.length > 30 ||
      !/^[0-9+()\-\s]+$/.test(data.phone) ||
      !singleLine(data.phone) ||
      data.phone.replace(/\D/g, "").length < 7)
  )
    errors.phone = "電話番号を半角数字とハイフンなどで入力してください。";
  if (!CONTACT_CATEGORIES.some((category) => category === data.category))
    errors.category = "お問い合わせの種類を選択してください。";
  if (
    !data.message ||
    data.message.length > 3000 ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(data.message)
  )
    errors.message = "お問い合わせ内容を3,000文字以内で入力してください。";
  if (!data.consent)
    errors.consent = "プライバシーポリシーをご確認のうえ、同意してください。";
  if (
    data.website ||
    (raw.website !== undefined && typeof raw.website !== "string")
  )
    errors.website = "送信できませんでした。電話でお問い合わせください。";
  return Object.keys(errors).length ? { errors } : { data, errors };
}
