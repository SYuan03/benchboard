(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-20";

  const sourceId = "codememorybench-paper";
  sources.push({ id: sourceId, vendorId: "tencent", publisher: "Tencent Hunyuan",
    kind: "benchmark", date: "2026-10-16", tier: "official",
    title: "CodeMemoryBench — Official paper, Tables 2 and 3 (repository snapshot)",
    url: "https://github.com/Tencent-Hunyuan/Hy-Memory/blob/fba347ad8d04eefbc51a466fa4cbd7d4e1936109/docs/papers/CMB_A_Coding_Memory_Benchmark_for_Long_Horizon_and_Interleaved_Coding_Agents.pdf" });

  // The paper names model families but does not identify candidate API snapshots or reasoning effort.
  // In particular, its DeepSeek V4 Flash row cannot be assigned to the original or 0731 checkpoint.
  models.push({ id: "claude-sonnet-5-cmb", name: "Claude Sonnet 5 (CMB paper label)",
    vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-10-16 or earlier",
    modality: "vision", modalityDetail: "Paper evaluates text and tool-based coding; exact Sonnet 5 API snapshot is not stated",
    context: "Not reported by the benchmark authors", access: "Not reported by the benchmark authors",
    aliases: ["claude-sonnet-5 (CMB)"], sourceId, scoreStatus: "comparison-only",
    summary: "CMB paper comparison label; kept separate from a specific Sonnet 5 release snapshot." });
  models.push({ id: "deepseek-v4-flash-cmb", name: "DeepSeek V4 Flash (CMB paper label)",
    vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026-10-16 or earlier",
    modality: "language", modalityDetail: "Paper evaluates text and tool-based coding; exact V4 Flash checkpoint is not stated",
    context: "Not reported by the benchmark authors", access: "Not reported by the benchmark authors",
    aliases: ["deepseek-v4-flash (CMB)"], sourceId, scoreStatus: "comparison-only",
    summary: "CMB paper comparison label; not assigned to the original or 0731 V4 Flash checkpoint." });

  benchmarks.push(
    { id: "codememorybench-code-resolved", name: "CodeMemoryBench · Code resolved",
      category: "Agent / 工作", direction: "higher",
      description: "216 execution-graded coding tasks across nine repositories. Resolution requires both F2P and P2P tests to pass; paper Table 2, Code column." },
    { id: "codememorybench-qa-score", name: "CodeMemoryBench · QA score",
      category: "Agent / 工作", direction: "higher",
      description: "Mean judge-derived requirement-match score across 750 open questions about frozen coding histories; paper Table 2, QA column. Separate from code resolution." },
    { id: "swe-contextbench-lite-related-cmb-resolved", name: "SWE-ContextBench Lite Related · Resolved · CMB paper run",
      category: "Agent / 工作", direction: "higher",
      description: "99 related coding tasks under the CMB authors' mini-swe-agent and memory-plugin protocol. This harness determines resolution from F2P; P2P is reported separately. Paper Table 3." }
  );
  benchmarkFamilies.push({ id: "codememorybench", name: "CodeMemoryBench",
    variants: [
      { benchmarkId: "codememorybench-code-resolved", label: "Code · Resolved" },
      { benchmarkId: "codememorybench-qa-score", label: "QA · Judge requirement match" }
    ] });

  // Table 2: Code Resolved and QA percentages. FullContext is a raw-history reference;
  // the other rows are distinct memory configurations on the same frozen histories.
  const cmbRows = [
    ["claude-sonnet-5-cmb", "FullContext", 58.8, 56.1],
    ["claude-sonnet-5-cmb", "RAG", 34.7, 48.0],
    ["claude-sonnet-5-cmb", "Mem0", 36.6, 37.8],
    ["claude-sonnet-5-cmb", "MemOS", 34.7, 51.9],
    ["claude-sonnet-5-cmb", "OpenViking", 29.2, 46.8],
    ["claude-sonnet-5-cmb", "RepoMemory", 17.6, 18.7],
    ["claude-sonnet-5-cmb", "TriLink", 43.1, 58.2],
    ["deepseek-v4-flash-cmb", "FullContext", 28.2, 53.4],
    ["deepseek-v4-flash-cmb", "RAG", 26.9, 62.2],
    ["deepseek-v4-flash-cmb", "Mem0", 21.8, 40.0],
    ["deepseek-v4-flash-cmb", "MemOS", 28.2, 51.4],
    ["deepseek-v4-flash-cmb", "OpenViking", 13.0, 38.6],
    ["deepseek-v4-flash-cmb", "RepoMemory", 11.6, 9.6],
    ["deepseek-v4-flash-cmb", "TriLink", 35.6, 64.2]
  ];
  for (const [modelId, memory, code, qa] of cmbRows) {
    const common = `CodeMemoryBench paper run · mini-swe-agent · frozen histories · memory: ${memory} · candidate snapshot, reasoning effort, and run count not stated`;
    for (const [benchmarkId, value, scope] of [
      ["codememorybench-code-resolved", code, "216 Code tasks; F2P and P2P required"],
      ["codememorybench-qa-score", qa, "750 QA questions; judge-derived requirement-match mean"]
    ]) {
      observations.push({ id: `o${observations.length + 1}`, sourceIds: [sourceId],
        benchmarkId, modelId, value, unit: "%", setting: `${common} · ${scope}`,
        note: "Official paper Table 2, overall column. The frozen construction histories used Claude Sonnet 5 for both evaluated backbones." });
    }
  }

  // Table 3: only its headline Resolved column. The other F2P/P2P diagnostics remain outside this audit scope.
  const contextRows = [
    ["claude-sonnet-5-cmb", "FullContext", 37.4],
    ["claude-sonnet-5-cmb", "NoMemory", 43.4],
    ["claude-sonnet-5-cmb", "Mem0", 38.4],
    ["claude-sonnet-5-cmb", "MemOS", 39.4],
    ["claude-sonnet-5-cmb", "OpenViking", 36.4],
    ["claude-sonnet-5-cmb", "RepoMemory", 45.5],
    ["claude-sonnet-5-cmb", "TriLink", 47.5],
    ["deepseek-v4-flash-cmb", "FullContext", 23.2],
    ["deepseek-v4-flash-cmb", "NoMemory", 20.2],
    ["deepseek-v4-flash-cmb", "Mem0", 25.3],
    ["deepseek-v4-flash-cmb", "MemOS", 25.3],
    ["deepseek-v4-flash-cmb", "OpenViking", 19.2],
    ["deepseek-v4-flash-cmb", "RepoMemory", 19.2],
    ["deepseek-v4-flash-cmb", "TriLink", 28.3]
  ];
  for (const [modelId, memory, value] of contextRows) {
    observations.push({ id: `o${observations.length + 1}`, sourceIds: [sourceId],
      benchmarkId: "swe-contextbench-lite-related-cmb-resolved", modelId, value, unit: "%",
      setting: `SWE-ContextBench Lite Related · CMB paper run · 99 tasks · mini-swe-agent · memory: ${memory} · F2P-based resolution · candidate snapshot, reasoning effort, and run count not stated`,
      note: "Official paper Table 3, Resolved column. P2P and test-level diagnostics are separate measures and are not imported here." });
  }

  sourceAudits.push({ sourceId, status: "partial", scopeLabel: "主结果已核", auditedAt: "2026-10-20",
    expectedObservationCount: 42,
    auditScope: "Paper Table 2 overall Code Resolved and QA percentages (14 model-method rows × two metrics), plus Table 3 SWE-ContextBench Lite Related Resolved (14 rows): 42 headline values.",
    benchmarkIds: ["codememorybench-code-resolved", "codememorybench-qa-score", "swe-contextbench-lite-related-cmb-resolved"],
    note: "All 42 headline cells checked against the rendered official PDF. Table 2 repository resolved counts, Table 3 Patch N/A/F2P/P2P diagnostics, and appendix ablations are outside this audited scope. CMB requires both F2P and P2P; the separate SWE-ContextBench run uses F2P for Resolved. The README describes a September release; this pinned repository PDF first appeared on 2026-10-16. Exact candidate snapshots, efforts, and run counts are not stated, so paper labels use comparison-only records." });
})();
