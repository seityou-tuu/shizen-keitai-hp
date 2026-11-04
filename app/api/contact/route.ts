import { NextResponse } from "next/server";
import { getFormspreeEndpoint } from "@/lib/contact-config";
import { validateContact } from "@/lib/contact-validation";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 16_384;
const uncertain =
  "送信結果を確認できませんでした。受信済みの可能性もあるため、再送信の前に電話でお問い合わせください。";
const reply = (body: object, status: number) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export async function POST(request: Request) {
  // Accept only same-origin browser requests; no third-party CORS access is enabled.
  const origin = request.headers.get("origin");
  if (
    !origin ||
    origin !== new URL(request.url).origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return reply(
      { ok: false, message: "このページから送信し直してください。" },
      403,
    );
  }
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  ) {
    return reply({ ok: false, message: "送信形式を確認してください。" }, 415);
  }
  const endpoint = getFormspreeEndpoint();
  if (!endpoint)
    return reply(
      {
        ok: false,
        message: "フォーム送信は準備中です。電話でお問い合わせください。",
      },
      503,
    );

  let input: unknown;
  try {
    if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
      return reply({ ok: false, message: "入力内容が長すぎます。" }, 413);
    const reader = request.body?.getReader();
    if (!reader)
      return reply({ ok: false, message: "入力内容がありません。" }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        return reply({ ok: false, message: "入力内容が長すぎます。" }, 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return reply({ ok: false, message: "入力内容を確認してください。" }, 400);
  }
  const { data, errors } = validateContact(input);
  if (!data)
    return reply(
      { ok: false, message: "入力内容を確認してください。", errors },
      400,
    );

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      redirect: "error",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: new URL(request.url).origin,
        Referer: new URL("/", request.url).href,
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        category: data.category,
        message: data.message,
        privacy_consent: "同意済み",
        _subject: `自然形体療法HP：${data.category}`,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (response.status === 429)
      return reply(
        {
          ok: false,
          message:
            "送信が混み合っています。時間をおくか、電話でお問い合わせください。",
        },
        429,
      );
    if (!response.ok)
      return reply(
        {
          ok: false,
          message:
            "フォーム送信を受け付けられませんでした。時間をおくか、電話でお問い合わせください。",
        },
        502,
      );
    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      !("ok" in result) ||
      result.ok !== true
    )
      return reply({ ok: false, message: uncertain }, 502);
    return reply(
      {
        ok: true,
        message:
          "お問い合わせを受け付けました。これは正式な受講申込みや決済の受付ではありません。",
      },
      200,
    );
  } catch {
    // Never log names, messages, addresses, provider responses, or request bodies.
    return reply({ ok: false, message: uncertain }, 502);
  }
}
