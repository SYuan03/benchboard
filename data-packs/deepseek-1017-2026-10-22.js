(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-22";

  const card = "deepseek-v41-flash-1017-card";
  const changelog = "deepseek-v41-flash-1017-changelog";
  const modelId = "deepseek-v4-1-flash-1017";
  sources.push(
    { id: card, vendorId: "deepseek", publisher: "DeepSeek", date: "2026-10-17", tier: "official", kind: "model-card",
      title: "DeepSeek-V4.1-Flash-1017 — Official Model Card",
      url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017" },
    { id: changelog, vendorId: "deepseek", publisher: "DeepSeek", date: "2026-10-17", tier: "official", kind: "release",
      title: "DeepSeek-V4.1-Flash-1017 — API Change Log",
      url: "https://api-docs.deepseek.com/updates/" }
  );
  models.push({ id: modelId, name: "DeepSeek V4.1 Flash 1017", vendorId: "deepseek", vendor: "DeepSeek",
    releaseDate: "2026-10-17", modality: "vision", modalityDetail: "文本、图像 → 文本",
    context: "1M", access: "开放权重 / API", aliases: ["DeepSeek-V4.1-Flash-1017"],
    sourceId: card, referenceSourceIds: [changelog],
    summary: "V4.1 Flash 的 1017 更新快照；DeepSeek 于 10 月 17 日将滚动 API 别名 deepseek-flash 指向此版本。" });

  benchmarks.push(
    { id: "automationbench-v1-0-6", name: "Automation-Bench v1.0.6", category: "Agent / 工作", direction: "higher",
      description: "DeepSeek 1017 发布表明确标注的 v1.0.6；指标、任务子集和候选 harness 未进一步说明。" },
    { id: "apexbench-v1-1", name: "Apex Bench v1.1", category: "Agent / 工作", direction: "higher",
      description: "DeepSeek 1017 发布表明确标注的 v1.1；指标和候选 harness 未进一步说明。" }
  );
  benchmarkFamilies.push(
    { id: "automationbench-family", name: "AutomationBench", variants: [
      { benchmarkId: "automationbench", label: "Published settings / version unspecified" },
      { benchmarkId: "automationbench-v1-0-6", label: "v1.0.6" }
    ] },
    { id: "apexbench-family", name: "ApexBench", variants: [
      { benchmarkId: "apexbench", label: "Version unspecified" },
      { benchmarkId: "apexbench-v1-1", label: "v1.1" }
    ] }
  );

  const common = "DeepSeek 1017 first-party evaluation · reasoning effort, candidate sampling, exact run count, and unspecified harnesses not published";
  const rows = [
    ["hle", 42.6, "full HLE set · no tools"],
    ["hle", 44.0, "text-only HLE subset · no tools"],
    ["terminal-bench-4-0", 42.3, "Claude Code harness · provider run, distinct from maintainer leaderboard"],
    ["deepswe-v1-1", 77.0, "Mini-SWE-V2 harness"],
    ["programbench", 29.1, "published main score · metric subtype unspecified"],
    ["nl2repo", 68.2, "published main score · harness unspecified"],
    ["automationbench-v1-0-6", 60.5, "published main score · metric subtype and harness unspecified"],
    ["agents-last-exam-pass", 35.4, "published pass rate · harness unspecified"],
    ["apexbench-v1-1", 72.1, "published main score · metric subtype and harness unspecified"],
    ["chartography-tools", 83.0, "with tools · harness unspecified"],
    ["babyvision", 92.5, "with tools · harness unspecified"],
    ["zerobench-main", 51.0, "with tools · pass@5 · harness unspecified"]
  ];
  for (const [benchmarkId, value, detail] of rows) {
    observations.push({ id: `o${observations.length + 1}`, sourceIds: [card, changelog],
      benchmarkId, modelId, value, unit: "%", setting: `${common} · ${detail}` });
  }

  for (const sourceId of [card, changelog]) {
    sourceAudits.push({ sourceId, status: "target-complete", scopeLabel: "1017 目标模型列已核", auditedAt: "2026-10-22",
      targetModels: [{ modelId, expectedObservationCount: 12, benchmarkIds: [...new Set(rows.map(([id]) => id))] }],
      note: "1017 模型卡的 11 行含两项 HLE 数值，与 API 更新记录的 12 个目标模型数值逐项一致。仅导入 1017 目标列；模型卡其余对照列及发布页图中的运行时间、输出长度和成本仍在范围外。ZeroBench-main 的 pass@5、Terminal-Bench 的 Claude Code 和 DeepSWE 的 Mini-SWE-V2 来自 API 更新脚注；其他任务的 reasoning effort、精确采样与候选 harness 不明确。" });
  }
})();
