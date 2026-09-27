import fs from "node:fs";
import path from "node:path";
import { data, root } from "./load-data.mjs";

const readmePath = path.join(root, "README.md");
const statsPath = path.join(root, "assets", "benchboard-stats.svg");
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
const format = (value) => new Intl.NumberFormat("en-US").format(value);
const stats = [
  [format(data.models.length), "MODELS + VERSIONS", "#2f66e9"],
  [format(benchmarkFamilyCount), "BENCHMARK FAMILIES", "#28a978"],
  [format(mergedObservationCount), "PUBLIC RESULTS", "#d57832"],
  [format(data.sources.length), "PRIMARY SOURCES", "#7656d6"]
];
const statsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="150" viewBox="0 0 1600 150" role="img" aria-labelledby="title desc">
  <title id="title">BenchBoard coverage</title>
  <desc id="desc">${stats.map(([value, label]) => `${value} ${label.toLowerCase()}`).join(", ")}.</desc>
  <rect x="1" y="1" width="1598" height="148" rx="22" fill="#f7f9fc" stroke="#dce3ed" stroke-width="2"/>
  ${stats.map(([value, label, color], index) => {
    const start = index * 400;
    const center = start + 200;
    const divider = index ? `<path d="M${start} 28V122" stroke="#dce3ed" stroke-width="2"/>` : "";
    return `${divider}<text x="${center}" y="69" text-anchor="middle" fill="#172033" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="46" font-weight="760">${value}</text><text x="${center}" y="108" text-anchor="middle" fill="${color}" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="17" font-weight="700" letter-spacing="1">${label}</text>`;
  }).join("")}
</svg>
`;
const summary = `<!-- DATA_SUMMARY_START -->
<p align="center"><img src="assets/benchboard-stats.svg" width="100%" alt="${format(data.models.length)} models and versions, ${format(benchmarkFamilyCount)} benchmark families, ${format(mergedObservationCount)} public results, ${format(data.sources.length)} primary sources"></p>
<p align="center"><sub>${format(curatedModelCount)} curated releases + ${format(comparisonModelCount)} comparison-only models · ${format(data.benchmarks.length)} separately ranked metric and version views</sub></p>
<!-- DATA_SUMMARY_END -->`;
const next = current.replace(/<!-- DATA_SUMMARY_START -->[\s\S]*?<!-- DATA_SUMMARY_END -->/, summary);

if (process.argv.includes("--check")) {
  const currentStats = fs.existsSync(statsPath) ? fs.readFileSync(statsPath, "utf8") : "";
  if (next !== current || currentStats !== statsSvg) {
    console.error("README data summary or stats image is stale. Run npm run sync-readme.");
    process.exit(1);
  }
  console.log("ok: README data summary and stats image are current");
} else {
  fs.writeFileSync(readmePath, next);
  fs.writeFileSync(statsPath, statsSvg);
  console.log("updated README data summary and stats image");
}
