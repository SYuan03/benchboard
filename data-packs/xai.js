(() => {
  const { sources, sourceAudits, models, benchmarks, observations } = window.BENCH_DATA;
  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((existing) => existing.id === row.id)) target.push(row);
  });
  const add = (benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    observations.push({ id: `o${observations.length + 1}`, sourceIds: ["xai-grok45"], benchmarkId, modelId, value, unit, setting, note });
  };
  const batch = (benchmarkId, rows, unit = "%", setting = "") => {
    rows.forEach(([modelId, value, rowSetting = setting, note = ""]) => add(benchmarkId, modelId, value, unit, rowSetting, note));
  };

  appendUnique(models, [
    { id: "glm-5-2", name: "GLM-5.2", vendorId: "zai", vendor: "Z.ai", releaseDate: "2026", modality: "language", modalityDetail: "文本 → 文本；xAI 官方表中的精确对照版本", context: "未核实", access: "未核实", aliases: ["GLM 5.2", "glm-5.2"], sourceId: "xai-grok45", scoreStatus: "comparison-only", summary: "Grok 4.5 官方发布表中的对照模型；等待 Z.ai 一手模型页补证。" }
  ]);
  appendUnique(benchmarks, [
    { id: "deepswe-v1-0", name: "DeepSWE v1.0", category: "编码", direction: "higher", description: "Datacurve 软件工程评测 v1.0；与 v1.1 分榜。" },
    { id: "swe-marathon", name: "SWE Marathon", category: "编码", direction: "higher", description: "长程软件工程任务；报告 resolution rate / pass@1。" },
    { id: "swe-bench-pro-output-tokens", name: "SWE-Bench Pro · Average Output Tokens", category: "编码效率", direction: "lower", description: "每个 SWE-Bench Pro 任务的平均输出 token 数；越低越好，但需结合成功率阅读。" }
  ]);

  batch("deepswe-v1-0", [
    ["claude-fable-5", 66.1, "Fable · max"], ["gpt-5-5", 64.31, "xhigh"],
    ["grok-4-5", 62.0], ["claude-opus-4-8", 55.75, "max"], ["claude-opus-4-7", 40.12, "max"]
  ], "%", "Datacurve eval · each provider's harness · pass@1");
  batch("deepswe-v1-1", [
    ["claude-fable-5", 70.0, "max"], ["gpt-5-5", 67.0, "xhigh"],
    ["claude-opus-4-8", 59.0, "max"], ["grok-4-5", 53.0], ["glm-5-2", 44.0]
  ], "%", "Datacurve mini-swe-agent harness");
  batch("swe-marathon", [
    ["grok-4-5", 29.0], ["claude-opus-4-8", 26.0, "max"],
    ["claude-fable-5", 24.0, "max"], ["claude-opus-4-7", 16.0, "max"]
  ], "%", "resolution rate · pass@1");
  batch("terminal-bench-2-1", [
    ["claude-fable-5", 84.3, "max"], ["gpt-5-5", 83.4, "xhigh"], ["grok-4-5", 83.3],
    ["claude-opus-4-8", 78.9, "max"], ["claude-opus-4-7", 78.9, "max"]
  ], "%", "xAI launch comparison table");
  batch("swe-bench-pro", [
    ["claude-fable-5", 80.4, "max"], ["claude-opus-4-8", 69.2, "max"], ["grok-4-5", 64.7],
    ["claude-opus-4-7", 64.3, "max"], ["glm-5-2", 62.1], ["gpt-5-5", 58.6, "xhigh"]
  ], "%", "resolve rate");
  batch("swe-bench-pro-output-tokens", [
    ["grok-4-5", 15954], ["claude-opus-4-8", 67020, "max"]
  ], "tokens", "average output tokens per task");

  const audit = sourceAudits.find((item) => item.sourceId === "xai-grok45");
  Object.assign(audit, {
    status: "complete",
    auditedAt: "2026-09-20",
    expectedObservationCount: 27,
    benchmarkIds: ["deepswe-v1-0", "deepswe-v1-1", "swe-marathon", "terminal-bench-2-1", "swe-bench-pro", "swe-bench-pro-output-tokens"],
    note: "Grok 4.5 发布页五组能力图与 SWE-Bench Pro token-efficiency 图的全部 27 个公开数值已录入。"
  });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
