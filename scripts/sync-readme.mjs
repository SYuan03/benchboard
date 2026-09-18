import fs from "node:fs";
import path from "node:path";
import { data, root } from "./load-data.mjs";

const readmePath = path.join(root, "README.md");
const current = fs.readFileSync(readmePath, "utf8");
const summary = `<!-- DATA_SUMMARY_START -->
- ${data.models.length} 个模型或版本
- ${data.benchmarks.length} 个已登记 Benchmark
- ${data.observations.length} 条可追溯成绩
- ${data.sources.length} 个官方来源
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
