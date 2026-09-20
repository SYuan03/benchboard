import { data } from "./load-data.mjs";

const errors = [];
const duplicateIds = (items) => items.map((item) => item.id).filter((id, index, ids) => ids.indexOf(id) !== index);
const modelIds = new Set(data.models.map((item) => item.id));
const benchmarkIds = new Set(data.benchmarks.map((item) => item.id));
const sourceIds = new Set(data.sources.map((item) => item.id));
const sourceAuditIds = new Set((data.sourceAudits || []).map((item) => item.sourceId));
const benchmarkFamilyIds = new Set((data.benchmarkFamilies || []).map((item) => item.id));
const validUrl = /^https:\/\//;
const semanticObservationKeys = new Set();

for (const [label, items] of [["model", data.models], ["benchmark", data.benchmarks], ["source", data.sources]]) {
  for (const id of duplicateIds(items)) errors.push(`duplicate ${label} id: ${id}`);
}

for (const model of data.models) {
  if (!new Set(["language", "vision", "omni"]).has(model.modality)) errors.push(`invalid modality: ${model.id}`);
  if (!sourceIds.has(model.sourceId)) errors.push(`missing model source: ${model.id} -> ${model.sourceId}`);
  if (model.referenceSourceIds && !Array.isArray(model.referenceSourceIds)) errors.push(`model referenceSourceIds must be an array: ${model.id}`);
  for (const sourceId of model.referenceSourceIds || []) {
    if (!sourceIds.has(sourceId)) errors.push(`missing model reference source: ${model.id} -> ${sourceId}`);
  }
  if (!data.observations.some((observation) => observation.modelId === model.id) && !model.scoreStatus) errors.push(`model has no scoreStatus and no observations: ${model.id}`);
}

for (const source of data.sources) {
  if (!validUrl.test(source.url)) errors.push(`source must use https: ${source.id}`);
  if (source.tier !== "official") errors.push(`unexpected source tier: ${source.id} -> ${source.tier}`);
}

if (sourceAuditIds.size !== (data.sourceAudits || []).length) errors.push("duplicate source audit id");
for (const sourceId of sourceIds) {
  if (!sourceAuditIds.has(sourceId)) errors.push(`source has no coverage status: ${sourceId}`);
}
for (const audit of data.sourceAudits || []) {
  if (!sourceIds.has(audit.sourceId)) errors.push(`audit has missing source: ${audit.sourceId}`);
  if (!new Set(["complete", "target-complete", "partial", "pending", "metadata-only"]).has(audit.status)) errors.push(`invalid source audit status: ${audit.sourceId} -> ${audit.status}`);
  if (!audit.note) errors.push(`source audit has no note: ${audit.sourceId}`);
  const sourceObservations = data.observations.filter((observation) => observation.sourceIds.includes(audit.sourceId));
  if (audit.status === "complete") {
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
  const targetModels = audit.targetModels || (audit.targetModelId ? [{
    modelId: audit.targetModelId,
    expectedObservationCount: audit.expectedTargetObservationCount,
    benchmarkIds: audit.targetBenchmarkIds
  }] : []);
  if (audit.status === "target-complete" && targetModels.length === 0) errors.push(`target-complete audit has no target model: ${audit.sourceId}`);
  for (const target of targetModels) {
    if (!modelIds.has(target.modelId)) errors.push(`source audit has missing target model: ${audit.sourceId} -> ${target.modelId}`);
    const targetModel = data.models.find((model) => model.id === target.modelId);
    const auditSource = data.sources.find((source) => source.id === audit.sourceId);
    if (targetModel && auditSource?.vendorId === targetModel.vendorId && auditSource.kind !== "benchmark") {
      const references = new Set([targetModel.sourceId, ...(targetModel.referenceSourceIds || [])]);
      if (!references.has(audit.sourceId)) errors.push(`audited first-party source is not linked from model: ${audit.sourceId} -> ${target.modelId}`);
    }
    const targetObservations = sourceObservations.filter((observation) => observation.modelId === target.modelId);
    if (targetObservations.length !== target.expectedObservationCount) {
      errors.push(`source audit target count mismatch: ${audit.sourceId} / ${target.modelId} -> expected ${target.expectedObservationCount}, got ${targetObservations.length}`);
    }
    if (target.benchmarkIds) {
      const observedTargetBenchmarks = new Set(targetObservations.map((observation) => observation.benchmarkId));
      for (const benchmarkId of target.benchmarkIds) {
        if (!observedTargetBenchmarks.has(benchmarkId)) errors.push(`source audit target missing benchmark: ${audit.sourceId} / ${target.modelId} -> ${benchmarkId}`);
      }
      if (observedTargetBenchmarks.size !== target.benchmarkIds.length) {
        errors.push(`source audit target benchmark count mismatch: ${audit.sourceId} / ${target.modelId} -> expected ${target.benchmarkIds.length}, got ${observedTargetBenchmarks.size}`);
      }
    }
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
  if (typeof observation.value === "string" && /\d\s*[/|]\s*\d/.test(observation.value)) errors.push(`composite score must be split: ${observation.id} -> ${observation.value}`);
  if (!observation.unit) errors.push(`score has no unit: ${observation.id}`);
  if (!observation.sourceIds.length) errors.push(`score has no source: ${observation.id}`);
  for (const sourceId of observation.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`missing source: ${observation.id} -> ${sourceId}`);
  }
  if (/未归入/.test(observation.setting) || /未归入/.test(observation.note)) {
    errors.push(`score is attached to the wrong model version: ${observation.id}`);
  }
  const semanticKey = [
    observation.modelId,
    observation.benchmarkId,
    typeof observation.value,
    String(observation.value),
    observation.unit,
    observation.setting || ""
  ].join("||");
  if (semanticObservationKeys.has(semanticKey)) errors.push(`semantic duplicate observation: ${observation.id}`);
  semanticObservationKeys.add(semanticKey);
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
