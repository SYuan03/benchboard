import { data } from "./load-data.mjs";

const errors = [];
const duplicateIds = (items) => items.map((item) => item.id).filter((id, index, ids) => ids.indexOf(id) !== index);
const modelIds = new Set(data.models.map((item) => item.id));
const benchmarkIds = new Set(data.benchmarks.map((item) => item.id));
const sourceIds = new Set(data.sources.map((item) => item.id));

for (const [label, items] of [["model", data.models], ["benchmark", data.benchmarks], ["source", data.sources]]) {
  for (const id of duplicateIds(items)) errors.push(`duplicate ${label} id: ${id}`);
}

for (const model of data.models) {
  if (!new Set(["language", "vision", "omni"]).has(model.modality)) errors.push(`invalid modality: ${model.id}`);
  if (!sourceIds.has(model.sourceId)) errors.push(`missing model source: ${model.id} -> ${model.sourceId}`);
}

for (const observation of data.observations) {
  if (!modelIds.has(observation.modelId)) errors.push(`missing model: ${observation.id} -> ${observation.modelId}`);
  if (!benchmarkIds.has(observation.benchmarkId)) errors.push(`missing benchmark: ${observation.id} -> ${observation.benchmarkId}`);
  if (observation.value === "" || observation.value == null) errors.push(`empty score: ${observation.id}`);
  for (const sourceId of observation.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`missing source: ${observation.id} -> ${sourceId}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`ok: ${data.models.length} models, ${data.benchmarks.length} benchmarks, ${data.observations.length} scores, ${data.sources.length} sources`);
