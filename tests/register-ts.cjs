// Use the existing TypeScript dependency; no test framework is added.
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const original = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  return original.call(
    this,
    request.startsWith("@/")
      ? path.resolve(__dirname, "..", request.slice(2))
      : request,
    parent,
    ...rest,
  );
};
require.extensions[".ts"] = function (module, filename) {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
      },
      fileName: filename,
    }).outputText,
    filename,
  );
};

require.extensions[".tsx"] = require.extensions[".ts"];
