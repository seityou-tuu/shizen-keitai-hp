// Isolated component fixture, not an application route or deployment setting.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const { webpack } = require("next/dist/compiled/webpack/webpack");
const root = path.resolve(__dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "shizen-analytics-"));

(async () => {
  let browser;
  try {
    // Use already installed Next/TypeScript tools; no test dependency is added.
    fs.writeFileSync(path.join(temp, "typescript.cjs"), `module.exports=function(source){return require(${JSON.stringify(require.resolve("typescript"))}).transpileModule(source,{compilerOptions:{module:1,target:9,jsx:4,esModuleInterop:true}}).outputText}`);
    fs.writeFileSync(path.join(temp, "empty.cjs"), 'module.exports=function(){return ""}');
    fs.writeFileSync(path.join(temp, "fixture.cjs"), `
      const React = require('react');
      const {createRoot} = require('react-dom/client');
      const {AnalyticsConsent} = require(${JSON.stringify(path.join(root, "components/analytics-consent.tsx"))});
      const app = createRoot(document.getElementById('root'));
      window.unmountFixture = () => app.unmount();
      app.render(React.createElement(React.StrictMode, null, React.createElement(AnalyticsConsent, {measurementId: 'G-QATEST0001'})));
      document.getElementById('phone').addEventListener('click', event => event.preventDefault());
    `);
    await new Promise((resolve, reject) => {
      webpack({ mode: "development", devtool: false, target: "web", entry: path.join(temp, "fixture.cjs"),
        output: { path: temp, filename: "bundle.js" },
        resolve: { extensions: [".tsx", ".ts", ".js", ".cjs"], alias: { "@": root }, modules: [path.join(root, "node_modules")] },
        module: { rules: [{ test: /\.tsx?$/, use: path.join(temp, "typescript.cjs") }, { test: /\.css$/, use: path.join(temp, "empty.cjs") }] },
      }, (error, stats) => error || stats.hasErrors() ? reject(error || new Error(stats.toString({ all: false, errors: true }))) : resolve());
    });
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, args: ["--no-sandbox"] });
    const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const requests = [], errors = [];
    await context.route("**/*", route => {
      const url = new URL(route.request().url());
      if (url.pathname === "/__analytics_fixture") return route.fulfill({ contentType: "text/html; charset=utf-8", body: '<html lang="ja"><meta charset="utf-8"><div id="contact"><a id="phone" href="tel:0985747643">電話</a></div><div id="root"></div><script src="/fixture.js"></script></html>' });
      if (url.pathname === "/fixture.js") return route.fulfill({ contentType: "text/javascript", body: fs.readFileSync(path.join(temp, "bundle.js"), "utf8") });
      requests.push(url.href);
      return route.fulfill({ contentType: "text/javascript", body: "window.fixtureGoogleScriptLoaded=true;" });
    });
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("http://127.0.0.1:3100/__analytics_fixture?health=private", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "許可しない", exact: true }).click();
    assert.deepEqual(requests, []);
    assert.equal(await page.evaluate(() => window.dataLayer), undefined);
    await page.getByRole("button", { name: "アクセス解析を許可する", exact: true }).click();
    await page.waitForFunction(() => window.fixtureGoogleScriptLoaded === true);
    await page.locator("#phone").click();
    const events = () => page.evaluate(() => window.dataLayer.map(item => Array.from(item)).filter(item => item[0] === "event"));
    let captured = await events();
    assert.equal(captured.filter(item => item[1] === "phone_click").length, 1);
    assert.equal(captured.filter(item => item[1] === "page_view").length, 1);
    assert.ok(!JSON.stringify(captured).includes("health=private"));
    assert.ok(!JSON.stringify(captured).includes("0985747643"));
    await page.getByRole("button", { name: "アクセス解析を停止する", exact: true }).click();
    await page.waitForFunction(() => window["ga-disable-G-QATEST0001"] === true);
    await page.locator("#phone").click();
    assert.deepEqual(await events(), captured);
    await page.getByRole("button", { name: "アクセス解析を許可する", exact: true }).click();
    await page.waitForFunction(() => window["ga-disable-G-QATEST0001"] === false);
    await page.locator("#phone").click();
    captured = await events();
    assert.equal(captured.filter(item => item[1] === "phone_click").length, 2);
    assert.equal(captured.filter(item => item[1] === "page_view").length, 1);
    assert.equal(requests.length, 1);
    await page.evaluate(() => window.unmountFixture());
    assert.equal(await page.evaluate(() => window["ga-disable-G-QATEST0001"]), true);
    await page.locator("#phone").click();
    assert.deepEqual(await events(), captured);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ passed: true, conditions: "Isolated React StrictMode fixture; synthetic ID only in tests; all external requests intercepted; no Google delivery verified", noRequestBeforeConsent: true, scriptLoads: requests.length, phoneEvents: 2, pageViews: 1, withdrawalAndUnmount: true, errors }, null, 2));
  } finally {
    await browser?.close();
    fs.rmSync(temp, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exit(1); });
