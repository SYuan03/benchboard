import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "data.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context, { filename: "data.js" });

export { root };
export const data = context.window.BENCH_DATA;
