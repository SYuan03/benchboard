(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, benchmarks, benchmarkFamilies, observations } = data;
  const sourceId = "vals-minimax-m31f-2026-10-20";
  const modelId = "minimax-m3-1-flash";
  sources.push({ id: sourceId, vendorId: "vals", publisher: "Vals AI", date: "2026-10-20", tier: "official", kind: "benchmark",
    title: "MiniMax-M3.1-Flash — Vals AI Model Benchmark Page", url: "https://www.vals-ai.com/models/minimax_MiniMax-M3.1-flash" });
  const newBenchmarks = [
    ["vals-index-v2-2", "Vals Index v2.2", "综合指数"],
    ["vals-finance-index-2026-10", "Vals Finance Index · October 2026", "专业工作"],
    ["emb-v1-1", "EMB v1.1", "专业工作"],
    ["financeagent-v2-1", "Finance Agent v2.1", "专业工作"],
    ["tax-agent-bench", "Tax Agent Bench", "专业工作"],
    ["vibe-code-bench-v1-1", "Vibe Code Bench v1.1", "代码 / 软件工程"],
    ["hlab-vals-v1-1", "HLAB-Vals-1.1", "Agent / 工作"]
  ];
  for (const [id, name, category] of newBenchmarks) benchmarks.push({ id, name, category, direction: "higher",
    description: "Vals AI published model-page accuracy; evaluation protocol and candidate settings remain source-specific." });
  const financeFamily = benchmarkFamilies.find((item) => item.id === "financeagent-family");
  financeFamily.variants.push({ benchmarkId: "financeagent-v2-1", label: "v2.1 · Vals" });
  const rows = [
    ["vals-index-v2-2", 53.78, 1.07],
    ["vals-finance-index-2026-10", 55.91, 1.42],
    ["emb-v1-1", 67.84, 2.29],
    ["financeagent-v2-1", 58.83, 2.07],
    ["legal-research-bench", 34.13, 3.30],
    ["tax-agent-bench", 32.14, 3.34],
    ["vibe-code-bench-v1-1", 73.94, 4.25],
    ["hlab-vals-v1-1", 7.50, 2.27],
    ["terminal-bench-4-0", 25.25, 1.01]
  ];
  for (const [benchmarkId, value, ci] of rows) observations.push({ id: `o${observations.length + 1}`,
    sourceIds: [sourceId], benchmarkId, modelId, value, unit: "%",
    setting: `Vals AI October 20 model evaluation · official MiniMax API · temperature 1 / top_p 0.95 / compute effort max · displayed uncertainty ±${ci} percentage points · output cap inconsistent across the page`,
    note: "Benchmark-maintainer result. The page's dated update says 262K maximum output, while its current settings panel says 524,288; neither is assigned to this observation. The page also conflicts on cost per test. Vals Terminal-Bench run is separate from provider and Terminal-Bench maintainer runs." });
  sourceAudits.push({ sourceId, status: "target-complete", auditedAt: "2026-10-23", scopeLabel: "MiniMax target accuracy rows checked",
    targetModels: [{ modelId, expectedObservationCount: 9, benchmarkIds: rows.map(([id]) => id) }],
    auditScope: "All nine current Vals AI model-page benchmark accuracy values and their displayed uncertainty ranges; cost and latency excluded.",
    note: "The dated October 20 update corroborates the nine accuracies. The page has unresolved internal metadata conflicts: current summary cost/test $0.660 versus dated update $4.46, and settings panel 524,288 max output tokens versus dated update 262K. Neither disputed field is imported. The page dates release October 20, but MiniMax's own launch is October 19; the first-party release date is retained." });
})();
