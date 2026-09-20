import { data } from "./load-data.mjs";

const distinct = (items) => new Set(items).size;
const familyByBenchmarkId = new Map();
for (const family of data.benchmarkFamilies || []) {
  for (const variant of family.variants) familyByBenchmarkId.set(variant.benchmarkId, family.id);
}
const familyId = (benchmarkId) => familyByBenchmarkId.get(benchmarkId) || benchmarkId;
const scoreCount = (modelId) => distinct(data.observations
  .filter((observation) => observation.modelId === modelId)
  .map((observation) => familyId(observation.benchmarkId)));
const benchmarkCount = (benchmarkId) => distinct(data.observations
  .filter((observation) => observation.benchmarkId === benchmarkId)
  .map((observation) => observation.modelId));
const sourcesById = new Map(data.sources.map((source) => [source.id, source]));
const auditBySourceId = new Map((data.sourceAudits || []).map((audit) => [audit.sourceId, audit]));
const modelReferenceIds = (model) => [...new Set([model.sourceId, ...(model.referenceSourceIds || [])].filter(Boolean))];
const hasFirstPartyReference = (model) => modelReferenceIds(model).some((sourceId) => {
  const source = sourcesById.get(sourceId);
  return source && source.kind !== "benchmark" && source.vendorId === model.vendorId;
});
const firstPartyAuditStatus = (model) => modelReferenceIds(model)
  .filter((sourceId) => {
    const source = sourcesById.get(sourceId);
    return source && source.kind !== "benchmark" && source.vendorId === model.vendorId;
  })
  .map((sourceId) => {
    const audit = auditBySourceId.get(sourceId);
    if (!audit) return "missing";
    if (audit.status !== "target-complete") return audit.status;
    const targetModels = audit.targetModels || (audit.targetModelId ? [{ modelId: audit.targetModelId }] : []);
    return targetModels.some((target) => target.modelId === model.id) ? "target-complete" : "target-unchecked";
  });

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
console.log("\nSource coverage audit");
for (const source of [...data.sources].sort((a, b) => a.id.localeCompare(b.id))) {
  const audit = auditBySourceId.get(source.id);
  const count = data.observations.filter((observation) => observation.sourceIds.includes(source.id)).length;
  const targetCount = audit?.targetModelId
    ? data.observations.filter((observation) => observation.sourceIds.includes(source.id) && observation.modelId === audit.targetModelId).length
    : null;
  const targetSummary = targetCount == null ? "" : `  target ${audit.targetModelId}: ${targetCount}`;
  console.log(`${String(count).padStart(4)}  ${(audit?.status || "missing").padEnd(13)}  ${source.id}${targetSummary}`);
}
console.log("\nModels without a first-party reference");
for (const model of data.models.filter((model) => !["comparison-only", "metadata-only", "pending"].includes(model.scoreStatus) && !hasFirstPartyReference(model)).sort((a, b) => a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name))) {
  const refs = modelReferenceIds(model).join(", ") || "none";
  console.log(`${model.name}  [${model.vendor}]  refs: ${refs}`);
}
console.log("\nComparison-only models awaiting a first-party source audit");
for (const model of data.models.filter((model) => model.scoreStatus === "comparison-only" && !hasFirstPartyReference(model)).sort((a, b) => a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name))) {
  const refs = modelReferenceIds(model).join(", ") || "none";
  console.log(`${model.name}  [${model.vendor}]  refs: ${refs}`);
}
console.log("\nModels whose first-party result surfaces still need checking");
for (const model of data.models.filter((model) => {
  if (["comparison-only", "metadata-only", "pending"].includes(model.scoreStatus)) return false;
  const statuses = firstPartyAuditStatus(model);
  if (statuses.some((status) => status === "complete" || status === "target-complete")) return false;
  return true;
}).sort((a, b) => a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name))) {
  console.log(`${model.name}  [${model.vendor}]  audits: ${firstPartyAuditStatus(model).join(", ") || "none"}`);
}
const benchmarkFamilyCount = distinct(data.benchmarks.map((benchmark) => familyId(benchmark.id)));
console.log(`\n${data.models.length} models · ${benchmarkFamilyCount} benchmark families · ${data.benchmarks.length} metric/version views · ${data.observations.length} raw observations · ${data.sources.length} sources`);
