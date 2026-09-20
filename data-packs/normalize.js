(() => {
  const data = window.BENCH_DATA;
  const groups = new Map();
  const benchmarkAliases = new Map([
    ["imo-answerbench", "imoanswerbench"],
    ["vlmsarebiased", "vlms-are-biased"],
    ["tool-decathlon", "toolathlon"]
  ]);

  for (const observation of data.observations) {
    observation.benchmarkId = benchmarkAliases.get(observation.benchmarkId) || observation.benchmarkId;
  }
  for (const family of data.benchmarkFamilies || []) {
    for (const variant of family.variants) {
      variant.benchmarkId = benchmarkAliases.get(variant.benchmarkId) || variant.benchmarkId;
    }
    family.variants = family.variants.filter((variant, index, variants) => (
      variants.findIndex((candidate) => candidate.benchmarkId === variant.benchmarkId) === index
    ));
  }
  for (const audit of data.sourceAudits || []) {
    if (audit.benchmarkIds) audit.benchmarkIds = [...new Set(audit.benchmarkIds.map((id) => benchmarkAliases.get(id) || id))];
    if (audit.targetBenchmarkIds) audit.targetBenchmarkIds = [...new Set(audit.targetBenchmarkIds.map((id) => benchmarkAliases.get(id) || id))];
    for (const target of audit.targetModels || []) {
      if (target.benchmarkIds) target.benchmarkIds = [...new Set(target.benchmarkIds.map((id) => benchmarkAliases.get(id) || id))];
    }
  }
  data.benchmarks = data.benchmarks.filter((benchmark) => !benchmarkAliases.has(benchmark.id));

  for (const observation of data.observations) {
    const key = [
      observation.modelId,
      observation.benchmarkId,
      typeof observation.value,
      String(observation.value),
      observation.unit,
      observation.setting || ""
    ].join("||");

    if (!groups.has(key)) {
      groups.set(key, {
        ...observation,
        sourceIds: [],
        notes: []
      });
    }

    const merged = groups.get(key);
    merged.sourceIds = [...new Set([...merged.sourceIds, ...observation.sourceIds])];
    if (observation.note) merged.notes.push(observation.note);
  }

  const normalized = [...groups.values()].map((observation, index) => {
    const { notes, ...rest } = observation;
    return {
      ...rest,
      id: `o${index + 1}`,
      note: [...new Set(notes)].join(" · ")
    };
  });

  data.observations.splice(0, data.observations.length, ...normalized);
})();
