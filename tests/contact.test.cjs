require("./register-ts.cjs");
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const {
  validateContact,
  EMPTY_CONTACT,
} = require("../lib/contact-validation.ts");
const { getFormspreeEndpoint } = require("../lib/contact-config.ts");
const { POST } = require("../app/api/contact/route.ts");
const originalFetch = global.fetch;
const previousId = process.env.FORMSPREE_FORM_ID;
after(() => {
  global.fetch = originalFetch;
  if (previousId === undefined) delete process.env.FORMSPREE_FORM_ID;
  else process.env.FORMSPREE_FORM_ID = previousId;
});
// Synthetic data is used only with a mocked provider; no email is sent.
const valid = () => ({
  ...EMPTY_CONTACT,
  name: "テスト利用者",
  email: "test@example.invalid",
  message: "研修内容についてのテストです。",
  consent: true,
});
function request(body = valid(), extra = {}) {
  return new Request("https://preview.example.invalid/api/contact", {
    method: "POST",
    headers: {
      origin: "https://preview.example.invalid",
      "content-type": "application/json",
      ...extra,
    },
    body: JSON.stringify(body),
  });
}
function provider(handler) {
  process.env.FORMSPREE_FORM_ID = "testabcd";
  global.fetch = handler;
}

test("required fields, email, consent and limits are enforced", () => {
  const errors = validateContact({ ...EMPTY_CONTACT }).errors;
  assert.ok(errors.name && errors.email && errors.message && errors.consent);
  assert.ok(validateContact({ ...valid(), consent: "true" }).errors.consent);
  assert.ok(validateContact({ ...valid(), email: "invalid" }).errors.email);
  assert.ok(
    validateContact({ ...valid(), email: "x@y.invalid\nBcc:z@z.invalid" })
      .errors.email,
  );
  assert.ok(validateContact({ ...valid(), name: "x".repeat(101) }).errors.name);
  assert.ok(
    validateContact({ ...valid(), message: "x".repeat(3001) }).errors.message,
  );
  assert.ok(validateContact({ ...valid(), phone: "abc" }).errors.phone);
  assert.ok(
    validateContact({ ...valid(), category: "正式な申込" }).errors.category,
  );
  assert.ok(validateContact({ ...valid(), website: "spam" }).errors.website);
  assert.equal(
    validateContact({ ...valid(), phone: "+81 (985) 74-7643" }).data.phone,
    "+81 (985) 74-7643",
  );
  assert.equal(
    validateContact({
      ...valid(),
      name: " テスト ",
      email: " test@example.invalid ",
    }).data.name,
    "テスト",
  );
  assert.ok(validateContact(null).errors.message);
});
test("unconfigured or invalid IDs never attempt delivery", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls++;
    throw Error("must not call");
  };
  for (const id of ["", "https://formspree.io/f/something", "your-form-id"]) {
    process.env.FORMSPREE_FORM_ID = id;
    assert.equal(getFormspreeEndpoint(), null);
    const result = await POST(request());
    assert.equal(result.status, 503);
    assert.equal((await result.json()).ok, false);
  }
  assert.equal(calls, 0);
});
test("cross-origin, invalid content types, malformed JSON and oversized bodies are rejected", async () => {
  let calls = 0;
  provider(async () => {
    calls++;
    throw Error("must not call");
  });
  assert.equal(
    (await POST(request(valid(), { origin: "https://other.example.invalid" })))
      .status,
    403,
  );
  assert.equal(
    (await POST(request(valid(), { "content-type": "text/plain" }))).status,
    415,
  );
  assert.equal(
    (
      await POST(
        new Request("https://preview.example.invalid/api/contact", {
          method: "POST",
          headers: {
            origin: "https://preview.example.invalid",
            "content-type": "application/json",
          },
          body: "{",
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await POST(request({ ...valid(), message: "x".repeat(20_000) }))).status,
    413,
  );
  assert.equal(calls, 0);
});
test("server rejects invalid values and honeypot without forwarding them", async () => {
  let calls = 0;
  provider(async () => {
    calls++;
    throw Error("must not call");
  });
  for (const values of [
    { ...valid(), consent: false },
    { ...valid(), website: "bot" },
    { ...valid(), email: "bad" },
  ]) {
    const result = await POST(request(values));
    assert.equal(result.status, 400);
    assert.equal((await result.json()).ok, false);
  }
  assert.equal(calls, 0);
});
test("success requires an explicit successful provider acknowledgement", async () => {
  let calls = 0;
  provider(async (url, options) => {
    calls++;
    assert.equal(url, "https://formspree.io/f/testabcd");
    assert.equal(options.redirect, "error");
    assert.equal(options.headers.Origin, "https://preview.example.invalid");
    assert.equal(options.headers.Referer, "https://preview.example.invalid/");
    const body = JSON.parse(options.body);
    assert.equal(body.email, valid().email);
    assert.equal(body._subject, "自然形体療法HP：受講相談");
    assert.equal(body.privacy_consent, "同意済み");
    assert.equal(body.secret, undefined);
    return Response.json({ ok: true });
  });
  const result = await POST(request({ ...valid(), secret: "not forwarded" }));
  assert.equal(result.status, 200);
  assert.equal((await result.json()).ok, true);
  assert.equal(result.headers.get("cache-control"), "no-store");
  assert.equal(calls, 1);
});
test("provider failures, quota, non-JSON responses and connection errors never report success", async () => {
  for (const [upstream, expected] of [
    [
      () =>
        Response.json(
          { errors: [{ message: "private provider message" }] },
          { status: 400 },
        ),
      502,
    ],
    [() => Response.json({}, { status: 429 }), 429],
    [() => Response.json({ ok: false }), 502],
    [() => Response.json({}), 502],
    [() => new Response("not-json"), 502],
    [
      () => {
        throw new Error("timeout with private data");
      },
      502,
    ],
  ]) {
    provider(async () => upstream());
    const result = await POST(request());
    assert.equal(result.status, expected);
    const body = await result.json();
    assert.equal(body.ok, false);
    assert.ok(!JSON.stringify(body).includes("private"));
  }
});
