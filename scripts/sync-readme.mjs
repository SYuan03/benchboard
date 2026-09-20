import fs from "node:fs";
import path from "node:path";
import { data, root } from "./load-data.mjs";

const readmePath = path.join(root, "README.md");
const current = fs.readFileSync(readmePath, "utf8");
const mergedObservationCount = new Set(data.observations.map((observation) => [
  observation.benchmarkId,
  observation.modelId,
  String(observation.value),
  observation.unit,
  observation.setting,
  observation.note
].join("||"))).size;
const groupedBenchmarkIds = new Set((data.benchmarkFamilies || []).flatMap((family) => family.variants.map((variant) => variant.benchmarkId)));
const benchmarkFamilyCount = data.benchmarks.length - groupedBenchmarkIds.size + (data.benchmarkFamilies || []).length;
const comparisonModelCount = data.models.filter((model) => model.scoreStatus === "comparison-only").length;
const curatedModelCount = data.models.length - comparisonModelCount;
const summary = `<!-- DATA_SUMMARY_START -->
- ${curatedModelCount} curated model releases
- ${comparisonModelCount} benchmark-only comparison models
- ${benchmarkFamilyCount} benchmark families
- ${data.benchmarks.length} separately ranked metrics and versions
- ${mergedObservationCount} deduplicated public results
- ${data.sources.length} primary sources
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
