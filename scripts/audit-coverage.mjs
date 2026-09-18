import { data } from "./load-data.mjs";

const distinct = (items) => new Set(items).size;
const scoreCount = (modelId) => distinct(data.observations
  .filter((observation) => observation.modelId === modelId)
  .map((observation) => observation.benchmarkId));
const benchmarkCount = (benchmarkId) => distinct(data.observations
  .filter((observation) => observation.benchmarkId === benchmarkId)
  .map((observation) => observation.modelId));

const modelCoverage = data.models
  .map((model) => ({ name: model.name, count: scoreCount(model.id), status: model.scoreStatus || "active" }))
  .sort((a, b) => a.count - b.count || a.name.localeCompare(b.name));
const sparseBenchmarks = data.benchmarks
  .map((benchmark) => ({ name: benchmark.name, count: benchmarkCount(benchmark.id) }))
  .filter((benchmark) => benchmark.count < 3)
  .sort((a, b) => a.count - b.count || a.name.localeCompare(b.name));

console.log("Model coverage (distinct benchmarks)");
for (const model of modelCoverage) console.log(`${String(model.count).padStart(3)}  ${model.name}${model.status === "active" ? "" : `  [${model.status}]`}`);
console.log("\nSparse benchmarks (<3 models)");
for (const benchmark of sparseBenchmarks) console.log(`${String(benchmark.count).padStart(3)}  ${benchmark.name}`);
console.log(`\n${data.models.length} models · ${data.benchmarks.length} benchmarks · ${data.observations.length} raw observations · ${data.sources.length} sources`);
