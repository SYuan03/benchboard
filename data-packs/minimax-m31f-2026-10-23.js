(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-23";

  const card = "minimax-m31f-card";
  const release = "minimax-m31f-release";
  const modelId = "minimax-m3-1-flash";
  sources.push(
    { id: card, vendorId: "minimax", publisher: "MiniMax", date: "2026-10-23", tier: "official", kind: "model-card",
      title: "MiniMax-M3.1-Flash — Official Model Card (October 23 revision)",
      url: "https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash/blob/54e4e69dfc452b1e94a426c24a4fdeeaa8e3ad5e/README.md" },
    { id: release, vendorId: "minimax", publisher: "MiniMax", date: "2026-10-19", tier: "official", kind: "release",
      title: "MiniMax M3.1 Flash: Redefining Agent Performance and Cost",
      url: "https://www.minimax.io/blog/minimax-m31f" }
  );
  models.push({ id: modelId, name: "MiniMax M3.1 Flash", vendorId: "minimax", vendor: "MiniMax",
    releaseDate: "2026-10-19", modality: "vision", modalityDetail: "文本、图像、视频 → 文本",
    context: "1M", access: "开放权重 / API", aliases: ["MiniMax-M3.1-Flash"], sourceId: card,
    referenceSourceIds: [release],
    summary: "428B 总参数 / 23B 激活的多模态 MoE；10 月 19 日发布 API，官方模型卡公开 15 项评测。" });
  benchmarks.push(
    { id: "gdp-pdf-aa", name: "GDP.pdf · Artificial Analysis", category: "专业工作", direction: "higher",
      description: "MiniMax 模型卡转引的 Artificial Analysis GDP.pdf score；与其他 GDP.pdf 工具和评分口径分榜。" },
    { id: "swe-refactor-bench", name: "SWE Refactor Bench", category: "代码 / 软件工程", direction: "higher",
      description: "软件重构任务；MiniMax 模型卡报告 Claude Code 运行，区别于 SWE-Atlas 重构子项。" }
  );
  const gdpFamily = benchmarkFamilies.find((item) => item.id === "gdp-pdf-family");
  gdpFamily.variants.push({ benchmarkId: "gdp-pdf-aa", label: "Artificial Analysis score" });

  const common = "MiniMax M3.1 Flash official-weights model-card run · reasoning effort, sampling, and run count not stated for this benchmark";
  const rows = [
    ["automationbench-v1-0-6", 62.8, "v1.0.6 · 600 publicly released tasks", false],
    ["bankertoolbench", 76.2, "OpenCode 1.17.18 · MiniMax M2.7 judge", true],
    ["gdp-pdf-aa", 20.8, "Artificial Analysis GDP.pdf AA result reproduced in provider card · evaluation harness not restated", false],
    ["terminal-bench-4-0", 38.1, "Codex 0.149.1 · provider-reported result, distinct from maintainer leaderboard", false],
    ["loca-bench-256k", 60.3, "official implementation · 256K", false],
    ["agents-last-exam-score", 29.6, "official ALE Overall full-set leaderboard result · CLI-only runs excluded", true],
    ["osworld-2", 61.7, "OSWorld 2.0 0808 Full release · highest reported at release · metric subtype unstated", true],
    ["posttrainbench-v1-1", 39.3, "Claude Code 2.1.251 · 512K context · otherwise official setup", false],
    ["deepswe-v1-1", 73.7, "mini-SWE-agent 2.4.5 · 512K context", true],
    ["nl2repo", 61.2, "Claude Code 2.1.233 · 512K context · reward hacking = 0 · two inconsistent tasks corrected", false],
    ["swe-refactor-bench", 23.0, "Claude Code 2.1.220 · 200K context · otherwise official setup", false],
    ["cybergym", 82.2, "Claude Code 2.1.263 · 1M context · launch prose rounds to 82%", false],
    ["babyvision", 91.0, "with tools · Claude Code 2.1.285 · minimum image side 1,500 px", false],
    ["hle", 43.4, "without tools · text-only subset / 2,158 questions", false],
    ["charxiv-rq", 82.5, "reasoning questions · GPT-5.5 judge · code-interpreter setting not stated", false]
  ];
  for (const [benchmarkId, value, detail, corroboratedByRelease] of rows) {
    observations.push({ id: `o${observations.length + 1}`, sourceIds: corroboratedByRelease ? [card, release] : [card],
      benchmarkId, modelId, value, unit: benchmarkId === "agents-last-exam-score" ? "Score" : "%", setting: `${common} · ${detail}`,
      note: benchmarkId === "cybergym" ? "Exact card value 82.2%; the October 19 release prose rounds it to 82%." : "Exact target-model cell in the official model card." });
  }

  sourceAudits.push(
    { sourceId: card, status: "target-complete", auditedAt: "2026-10-23", scopeLabel: "M3.1 Flash target column checked",
      targetModels: [{ modelId, expectedObservationCount: 15, benchmarkIds: rows.map(([id]) => id) }],
      auditScope: "All 15 public target-model cells in the official model-card benchmark table, with the card's per-benchmark evaluation notes; comparison columns and cost charts excluded.",
      note: "All 15 target cells matched the pinned card exactly. GDP.pdf AA is a cited Artificial Analysis result and uses a separate view; ALE Overall, HLE text-only/no-tools, OSWorld 0808 Full, tool-aided BabyVision, and per-benchmark harnesses stay distinct. Generic inference sampling advice is not assigned to these evaluations. October 19 launch prose rounds CyberGym 82.2 to 82%." },
    { sourceId: release, status: "partial", auditedAt: "2026-10-23", scopeLabel: "Release prose checked",
      expectedObservationCount: 4, benchmarkIds: ["bankertoolbench", "agents-last-exam-score", "osworld-2", "deepswe-v1-1"],
      auditScope: "Four exact headline scores in the October 19 release prose; cost and performance graphics are outside scope.",
      note: "The launch establishes the October 19 API release and four exact headline numbers matching the model card. Its CyberGym 82% is a rounded mention of the card's 82.2%, not a separate score. The card was revised on October 23 and now provides exact results plus evaluation notes; its comparison columns remain unaudited." }
  );
})();
