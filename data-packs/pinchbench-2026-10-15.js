(() => {
  const data = window.BENCH_DATA;
  const { models, observations, sourceAudits } = data;
  data.meta.updated = "2026-10-15";

  const rows = [
    ["nemotron-3-5-bolt-74b-a9b-bf16", "Nemotron 3.5 Bolt 74B-A9B BF16", "nvidia/nemotron-3.5-bolt-74b-a9b-bf16", "2026-10-08", 91.7, 90.4, 10],
    ["nemotron-3-5-bolt-74b-a9b-24gb", "Nemotron 3.5 Bolt 74B-A9B 24GB", "nvidia/nemotron-3.5-bolt-74b-a9b-24gb", "2026-10-10", 90.1, 87.8, 10]
  ];
  for (const [id, name, label, date, best, average, runs] of rows) {
    models.push({ id, name, vendorId: "nvidia", vendor: "NVIDIA", releaseDate: `${date} or earlier`,
      modality: "language", modalityDetail: "OpenClaw text and tool tasks; exact checkpoint details not stated on the leaderboard",
      context: "Not reported by the benchmark maintainer", access: "Open weights according to the maintainer leaderboard",
      aliases: [label], sourceId: "pinchbench-v2", scoreStatus: "comparison-only",
      summary: "PinchBench v2 maintainer submission; the BF16 and 24GB variants are kept separate." });
    const common = "OpenClaw · PinchBench v2.0.0 · task count: 147 on live leaderboard / 148 in v2.0.0 release notes";
    observations.push({ id: `o${observations.length + 1}`, sourceIds: ["pinchbench-v2"], benchmarkId: "pinchbench-v2-best",
      modelId: id, value: best, unit: "%", setting: `${common} · best run`, note: `leaderboard submission ${date}` });
    observations.push({ id: `o${observations.length + 1}`, sourceIds: ["pinchbench-v2"], benchmarkId: "pinchbench-v2-average",
      modelId: id, value: average, unit: "%", setting: `${common} · average across ${runs} runs`, note: `leaderboard submission ${date}` });
  }

  const audit = sourceAudits.find((item) => item.sourceId === "pinchbench-v2");
  audit.auditedAt = "2026-10-22";
  audit.expectedObservationCount = 122;
  audit.auditScope = "Current PinchBench v2.0.0 success-rate leaderboard: Best and Average for all 61 listed model labels; excludes speed, cost, value, category awards, and per-run pages.";
  audit.note = "Rechecked 2026-10-22: all 61 model labels and 122 stored headline values still match the live data. The two Nemotron 3.5 Bolt variants use separate records. The live leaderboard previously displayed 147 tasks, while the official v2.0.0 release notes say 148; both counts remain in each result setting pending a confirmed reconciliation.";
})();
