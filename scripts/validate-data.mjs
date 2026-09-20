import { data } from "./load-data.mjs";

const errors = [];
const duplicateIds = (items) => items.map((item) => item.id).filter((id, index, ids) => ids.indexOf(id) !== index);
const modelIds = new Set(data.models.map((item) => item.id));
const benchmarkIds = new Set(data.benchmarks.map((item) => item.id));
const sourceIds = new Set(data.sources.map((item) => item.id));
const benchmarkFamilyIds = new Set((data.benchmarkFamilies || []).map((item) => item.id));
const validUrl = /^https:\/\//;

for (const [label, items] of [["model", data.models], ["benchmark", data.benchmarks], ["source", data.sources]]) {
  for (const id of duplicateIds(items)) errors.push(`duplicate ${label} id: ${id}`);
}

for (const model of data.models) {
  if (!new Set(["language", "vision", "omni"]).has(model.modality)) errors.push(`invalid modality: ${model.id}`);
  if (!sourceIds.has(model.sourceId)) errors.push(`missing model source: ${model.id} -> ${model.sourceId}`);
  if (!data.observations.some((observation) => observation.modelId === model.id) && !model.scoreStatus) errors.push(`model has no scoreStatus and no observations: ${model.id}`);
}

for (const source of data.sources) {
  if (!validUrl.test(source.url)) errors.push(`source must use https: ${source.id}`);
  if (source.tier !== "official") errors.push(`unexpected source tier: ${source.id} -> ${source.tier}`);
}

for (const audit of data.sourceAudits || []) {
  if (!sourceIds.has(audit.sourceId)) errors.push(`audit has missing source: ${audit.sourceId}`);
  if (audit.status !== "complete") continue;
  const sourceObservations = data.observations.filter((observation) => observation.sourceIds.includes(audit.sourceId));
  if (sourceObservations.length !== audit.expectedObservationCount) {
    errors.push(`source audit count mismatch: ${audit.sourceId} -> expected ${audit.expectedObservationCount}, got ${sourceObservations.length}`);
  }
  const observedBenchmarks = new Set(sourceObservations.map((observation) => observation.benchmarkId));
  for (const benchmarkId of audit.benchmarkIds || []) {
    if (!observedBenchmarks.has(benchmarkId)) errors.push(`source audit missing benchmark: ${audit.sourceId} -> ${benchmarkId}`);
  }
  if (observedBenchmarks.size !== (audit.benchmarkIds || []).length) {
    errors.push(`source audit benchmark count mismatch: ${audit.sourceId} -> expected ${(audit.benchmarkIds || []).length}, got ${observedBenchmarks.size}`);
  }
}

for (const benchmark of data.benchmarks) {
  if (!new Set(["higher", "lower"]).has(benchmark.direction)) errors.push(`invalid benchmark direction: ${benchmark.id}`);
  if (benchmark.collections?.includes("multimodal-harness")) {
    if (!new Set(["dedicated", "mixed"]).has(benchmark.collectionScope)) errors.push(`invalid multimodal-harness scope: ${benchmark.id}`);
    if (!Array.isArray(benchmark.harnesses) || benchmark.harnesses.length === 0) errors.push(`missing harness names: ${benchmark.id}`);
    if (!Array.isArray(benchmark.inputModalities) || benchmark.inputModalities.length === 0) errors.push(`missing multimodal inputs: ${benchmark.id}`);
    if (benchmark.collectionMode && !new Set(["benchmark", "observation"]).has(benchmark.collectionMode)) errors.push(`invalid collection mode: ${benchmark.id}`);
  }
}

const familyBenchmarkIds = new Set();
if (benchmarkFamilyIds.size !== (data.benchmarkFamilies || []).length) errors.push("duplicate benchmark family id");
for (const family of data.benchmarkFamilies || []) {
  if (!family.id || !family.name || !Array.isArray(family.variants) || family.variants.length < 2) {
    errors.push(`invalid benchmark family: ${family.id || "(missing id)"}`);
    continue;
  }
  for (const variant of family.variants) {
    if (!benchmarkIds.has(variant.benchmarkId)) errors.push(`missing family benchmark: ${family.id} -> ${variant.benchmarkId}`);
    if (!variant.label) errors.push(`missing family variant label: ${family.id} -> ${variant.benchmarkId}`);
    if (familyBenchmarkIds.has(variant.benchmarkId)) errors.push(`benchmark belongs to multiple families: ${variant.benchmarkId}`);
    familyBenchmarkIds.add(variant.benchmarkId);
  }
}

for (const observation of data.observations) {
  if (!modelIds.has(observation.modelId)) errors.push(`missing model: ${observation.id} -> ${observation.modelId}`);
  if (!benchmarkIds.has(observation.benchmarkId)) errors.push(`missing benchmark: ${observation.id} -> ${observation.benchmarkId}`);
  if (observation.value === "" || observation.value == null) errors.push(`empty score: ${observation.id}`);
  if (typeof observation.value === "number" && !Number.isFinite(observation.value)) errors.push(`non-finite score: ${observation.id}`);
  if (!observation.unit) errors.push(`score has no unit: ${observation.id}`);
  if (!observation.sourceIds.length) errors.push(`score has no source: ${observation.id}`);
  for (const sourceId of observation.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`missing source: ${observation.id} -> ${sourceId}`);
  }
  if (/未归入/.test(observation.setting) || /未归入/.test(observation.note)) {
    errors.push(`score is attached to the wrong model version: ${observation.id}`);
  }
}


for (const benchmark of data.benchmarks) {
  const units = new Set(data.observations.filter((observation) => observation.benchmarkId === benchmark.id).map((observation) => observation.unit));
  if (units.size > 1) errors.push(`mixed units in benchmark: ${benchmark.id} -> ${[...units].join(", ")}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`ok: ${data.models.length} models, ${data.benchmarks.length} benchmarks, ${data.observations.length} scores, ${data.sources.length} sources`);
