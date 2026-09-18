import fs from "node:fs";
import path from "node:path";
import { data, root } from "./load-data.mjs";

const readmePath = path.join(root, "README.md");
const current = fs.readFileSync(readmePath, "utf8");
const summary = `<!-- DATA_SUMMARY_START -->
- ${data.models.length} ä¸ªæ¨¡åæçæ¬
- ${data.benchmarks.length} ä¸ªå·²ç»è®° Benchmark
- ${data.observations.length} æ¡å¯è¿½æº¯æç»©
- ${data.sources.length} ä¸ªå®æ¹æ¥æº
<!-- DATA_SUMMARY_END -->`;
const next = current.replace(/<!-- DATA_SUMMARY_START -->[\s\S]*?<!-- DATA_SUMMARY_END -->/, summary);

if (process.argv.includes("--check")) {
  if (next !== current) {
    console.error("README data summary is stale. Run npm run sync-readme.");
    process.exit(1);
  }
  console.log("ok: README data summary is current");
} else {
  fs.writeFileSync(readmePath, next);
  console.log("updated README data summary");
}
