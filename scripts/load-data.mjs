import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const context = { window: {} };
for (const filename of [
  "data.js",
  "data-packs/openai-anthropic.js",
  "data-packs/xai.js",
  "data-packs/qwen.js",
  "data-packs/google-deepseek-others.js",
  "data-packs/google-history.js",
  "data-packs/families.js",
  "data-packs/official-benchmarks.js",
  "data-packs/missing-firstparty.js",
  "data-packs/source-surfaces.js",
  "data-packs/source-audit-followups.js",
  "data-packs/anthropic-history.js",
  "data-packs/anthropic-claude4.js",
  "data-packs/sensetime.js",
  "data-packs/xiaomi.js",
  "data-packs/xiaomi-v2.js",
  "data-packs/comparison-west.js",
  "data-packs/minimax.js",
  "data-packs/frontier-firstparty-followups.js",
  "data-packs/deepseek-v32-audit.js",
  "data-packs/normalize.js"
]) {
  const source = fs.readFileSync(path.join(root, filename), "utf8");
  vm.runInNewContext(source, context, { filename });
}

export { root };
export const data = context.window.BENCH_DATA;
