(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((candidate) => {
    if (!target.some((item) => item.id === candidate.id)) target.push(candidate);
  });
  const patchModel = (id, values) => {
    const model = models.find((item) => item.id === id);
    if (model) Object.assign(model, values);
  };
  const upsertAudit = (sourceId, values) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    if (audit) Object.assign(audit, values);
    else sourceAudits.push({ sourceId, ...values });
  };
  const add = (sourceId, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    observations.push({
      id: `o${observations.length + 1}`,
      sourceIds: [sourceId],
      benchmarkId,
      modelId,
      value,
      unit,
      setting,
      note
    });
  };
  const table = (sourceId, benchmarkId, modelIds, values, unit = "%", setting = "") => {
    values.forEach((value, index) => {
      if (value != null) add(sourceId, benchmarkId, modelIds[index], value, unit, setting);
    });
  };

  appendUnique(sources, [
    { id: "deepmind-gemini3-pro", vendorId: "google", publisher: "Google DeepMind", date: "2026-05", tier: "official", title: "Gemini 3 Pro — Model Card", url: "https://deepmind.google/models/model-cards/gemini-3-pro/" },
    { id: "deepmind-gemini35", vendorId: "google", publisher: "Google DeepMind", date: "2026-05-19", tier: "official", title: "Gemini 3.5 Flash — Model Card", url: "https://deepmind.google/models/model-cards/gemini-3-5-flash/" },
    { id: "deepmind-gemini36", vendorId: "google", publisher: "Google DeepMind", date: "2026-07-21", tier: "official", title: "Gemini 3.6 Flash — Model Card", url: "https://deepmind.google/models/model-cards/gemini-3-6-flash/" },
    { id: "deepmind-gemini3-flash", vendorId: "google", publisher: "Google DeepMind", date: "2025", tier: "official", title: "Gemini 3 Flash — Model Card", url: "https://deepmind.google/models/model-cards/gemini-3-flash/" },
    { id: "anthropic-sonnet46", vendorId: "anthropic", publisher: "Anthropic", date: "2026-02-17", tier: "official", title: "Introducing Claude Sonnet 4.6", url: "https://www.anthropic.com/news/claude-sonnet-4-6" },
    { id: "anthropic-sonnet5", vendorId: "anthropic", publisher: "Anthropic", date: "2026-06-30", tier: "official", title: "Introducing Claude Sonnet 5", url: "https://www.anthropic.com/news/claude-sonnet-5" }
  ]);

  upsertAudit("deepmind-gemini35", {
    status: "complete",
    scopeLabel: "能力主表已核",
    auditedAt: "2026-09-20",
    expectedObservationCount: 76,
    benchmarkIds: ["terminal-bench-2-1", "swe-bench-pro", "mcp-atlas", "toolathlon", "osworld-verified", "financeagent-v2", "gdpval-aa", "charxiv", "mmmu-pro", "blueprint-bench-2", "mrcr-v2-8needle", "mrcr-v2-8needle-1m", "hle", "arc-agi-2"],
    note: "能力成绩主表的 76 个非空单元格已逐格录入。价格与相对安全变化表不计入通用能力榜。"
  });
  upsertAudit("deepmind-gemini3-pro", {
    status: "target-complete",
    scopeLabel: "目标模型列已核",
    auditedAt: "2026-09-20",
    targetModelId: "gemini-3-pro",
    expectedTargetObservationCount: 23,
    targetBenchmarkIds: ["hle", "hle-tools", "arc-agi-2", "gpqa-diamond", "aime-2025", "matharena-apex", "mmmu-pro", "screenspot-pro", "charxiv", "omnidocbench", "videommmu", "livecodebench-pro", "terminal-bench-2-0", "swe-bench-verified", "tau2-bench", "vending-bench-2", "facts-benchmark-suite", "simpleqa-verified", "mmmlu", "global-piqa", "mrcr-v2-8needle", "mrcr-v2-8needle-1m"],
    note: "Gemini 3 Pro 目标模型列的 23 个指标已从官方 PDF 第 5 页逐项核对；Gemini 2.5 Pro、Claude Sonnet 4.5 与 GPT-5.1 对照列尚未全部导入。"
  });
  upsertAudit("deepmind-gemini36", {
    status: "complete",
    scopeLabel: "能力主表已核",
    auditedAt: "2026-09-20",
    expectedObservationCount: 54,
    benchmarkIds: ["swe-bench-pro", "deepswe-v1-1", "terminal-bench-2-1", "mle-bench", "gdpval-aa-v2", "osworld-verified", "charxiv", "mrcr-v2-8needle", "mrcr-v2-8needle-1m"],
    note: "能力成绩主表的 54 个非空单元格已逐格录入。输入/输出价格与相对安全变化表不计入通用能力榜。"
  });
  ["deepmind-gemini3-flash", "anthropic-sonnet46", "anthropic-sonnet5"].forEach((sourceId) => upsertAudit(sourceId, {
    status: "pending",
    auditedAt: "2026-09-20",
    note: "已登记一手模型出处；该发布自身的完整成绩图表仍待逐格核对。"
  }));

  appendUnique(models, [
    { id: "gemini-3-flash", name: "Gemini 3 Flash", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2025", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API", aliases: ["gemini-3-flash"], sourceId: "deepmind-gemini3-flash", scoreStatus: "comparison-only", summary: "Gemini 3 系列 Flash 基线；保留官方后续模型卡中的对照成绩。" },
    { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-02-17", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "1M", access: "闭源 API", aliases: ["claude-sonnet-4-6"], sourceId: "anthropic-sonnet46", scoreStatus: "comparison-only", summary: "Anthropic Sonnet 4.6；保留 Google 官方模型卡中的精确对照成绩。" },
    { id: "claude-sonnet-5", name: "Claude Sonnet 5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-06-30", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未核实", access: "闭源 API", aliases: ["claude-sonnet-5"], sourceId: "anthropic-sonnet5", summary: "Anthropic Sonnet 5；当前先录入 Google 官方模型卡中的精确对照成绩。" }
  ]);

  patchModel("gemini-3-5-flash", {
    releaseDate: "2026-05-19",
    modality: "omni",
    modalityDetail: "文本、图像、音频、视频 → 文本",
    context: "1M",
    sourceId: "deepmind-gemini35"
  });
  patchModel("gemini-3-pro", {
    releaseDate: "2025-11",
    modality: "omni",
    modalityDetail: "文本、图像、音频、视频 → 文本",
    context: "1M",
    sourceId: "deepmind-gemini3-pro"
  });
  delete models.find((model) => model.id === "gemini-3-pro")?.scoreStatus;
  delete models.find((model) => model.id === "gemini-3-5-flash")?.scoreStatus;
  patchModel("gemini-3-6-flash", {
    releaseDate: "2026-07-21",
    modality: "omni",
    modalityDetail: "文本、图像、音频、视频 → 文本",
    context: "1M",
    sourceId: "deepmind-gemini36"
  });

  appendUnique(benchmarks, [
    { id: "mle-bench", name: "MLE-Bench", category: "编码", direction: "higher", description: "机器学习工程任务评测。" },
    { id: "vending-bench-2", name: "Vending-Bench 2", category: "Agent / 工作", direction: "higher", description: "长程经营 Agent 任务；报告平均净资产。" },
    { id: "facts-benchmark-suite", name: "FACTS Benchmark Suite", category: "知识 / 推理", direction: "higher", description: "内部 grounding、parametric、multimodal 与检索知识评测汇总。" },
    { id: "mrcr-v2-8needle-1m", name: "MRCR v2 · 1M Pointwise", category: "长上下文", direction: "higher", description: "8-needle、1M 上下文的 pointwise 成绩；与 128K 累计平均分开。" }
  ]);

  const mrcrFamily = benchmarkFamilies.find((family) => family.id === "mrcr-v2");
  if (mrcrFamily && !mrcrFamily.variants.some((variant) => variant.benchmarkId === "mrcr-v2-8needle-1m")) {
    mrcrFamily.variants.push({ benchmarkId: "mrcr-v2-8needle-1m", label: "1M · 8-needle" });
  }
  appendUnique(benchmarkFamilies, [
    { id: "gdpval-aa-family", name: "GDPval-AA", variants: [
      { benchmarkId: "gdpval-aa", label: "Original" },
      { benchmarkId: "gdpval-aa-v2", label: "v2" }
    ] },
    { id: "financeagent-family", name: "Finance Agent", variants: [
      { benchmarkId: "financeagent-v1-1", label: "v1.1" },
      { benchmarkId: "financeagent-v2", label: "v2" },
      { benchmarkId: "vals-finance-agent-v2", label: "Vals v2 · pass@1" }
    ] }
  ]);

  const g35 = "deepmind-gemini35";
  const g35Models = ["gemini-3-5-flash", "gemini-3-flash", "gemini-3-1-pro", "claude-sonnet-4-6", "claude-opus-4-7", "gpt-5-5"];
  const g35Setting = "Gemini 3.5 Flash Model Card · May 2026";
  table(g35, "terminal-bench-2-1", g35Models, [76.2, 58.0, 70.3, null, 66.1, 78.2], "%", `${g35Setting} · Terminus-2`);
  table(g35, "swe-bench-pro", g35Models, [55.1, 49.6, 54.2, null, 64.3, 58.6], "%", `${g35Setting} · Public · single attempt`);
  table(g35, "mcp-atlas", g35Models, [83.6, 62.0, 78.2, 69.5, 79.1, 75.3], "%", g35Setting);
  table(g35, "toolathlon", g35Models, [56.5, 49.4, null, null, null, 55.6], "%", g35Setting);
  table(g35, "osworld-verified", g35Models, [78.4, 65.1, 76.2, 72.5, 78.0, 78.7], "%", g35Setting);
  table(g35, "financeagent-v2", g35Models, [57.9, 42.6, 43.0, 51.0, 51.5, 51.8], "%", g35Setting);
  table(g35, "gdpval-aa", g35Models, [1656, 1204, 1314, 1676, 1753, 1769], "Elo", g35Setting);
  table(g35, "charxiv", g35Models, [84.2, 80.3, 83.3, 72.4, 82.1, 84.1], "%", `${g35Setting} · reasoning · no tools`);
  table(g35, "mmmu-pro", g35Models, [83.6, 81.2, 80.5, 74.5, 75.2, 81.2], "%", `${g35Setting} · no tools`);
  table(g35, "blueprint-bench-2", g35Models, [33.6, 0.0, 26.5, 6.7, 24.5, 36.2], "%", `${g35Setting} · normalized score`);
  table(g35, "mrcr-v2-8needle", g35Models, [77.3, 67.2, 84.9, 84.9, 59.3, 94.8], "%", `${g35Setting} · 128K cumulative average`);
  table(g35, "mrcr-v2-8needle-1m", g35Models, [26.6, 22.1, 26.3, null, null, null], "%", `${g35Setting} · 1M pointwise`);
  table(g35, "hle", g35Models, [40.2, 33.7, 44.4, 33.2, 46.9, 41.4], "%", `${g35Setting} · full text + multimodal set`);
  table(g35, "arc-agi-2", g35Models, [72.1, 33.6, 77.1, 58.3, 75.8, 84.6], "%", g35Setting);

  const g36 = "deepmind-gemini36";
  const g36Models = ["gemini-3-6-flash", "gemini-3-5-flash", "gemini-3-1-pro", "gpt-5-6-luna", "grok-4-5", "claude-sonnet-5"];
  const g36Setting = "Gemini 3.6 Flash Model Card · July 2026";
  table(g36, "swe-bench-pro", g36Models, [58.7, 55.1, 54.2, 62.7, 64.7, 63.2], "%", `${g36Setting} · Public`);
  table(g36, "deepswe-v1-1", g36Models, [49, 37, 12, 67, 54, 54], "%", g36Setting);
  table(g36, "terminal-bench-2-1", g36Models, [78.0, 76.2, 73.8, 84.7, 83.3, 80.4], "%", `${g36Setting} · Terminus-2`);
  table(g36, "mle-bench", g36Models, [63.9, 49.7, 42.6, 47.6, 43.2, 66.9], "%", g36Setting);
  table(g36, "gdpval-aa-v2", g36Models, [1421, 1349, 965, 1584, 1535, 1607], "Elo", g36Setting);
  table(g36, "osworld-verified", g36Models, [83.0, 78.4, 76.2, 72.6, null, 81.2], "%", g36Setting);
  table(g36, "charxiv", g36Models, [85.2, 84.2, 83.3, 82.7, 81.6, 77.0], "%", `${g36Setting} · reasoning · no tools`);
  table(g36, "charxiv", g36Models, [89.4, 84.9, 83.2, null, null, 88.3], "%", `${g36Setting} · reasoning · with tools`);
  table(g36, "mrcr-v2-8needle", g36Models, [91.8, 77.3, 84.9, 74.8, 81.4, 71.6], "%", `${g36Setting} · 128K cumulative average`);
  table(g36, "mrcr-v2-8needle-1m", g36Models, [54.0, 26.6, 26.3, null, null, null], "%", `${g36Setting} · 1M pointwise`);

  const g3p = "deepmind-gemini3-pro";
  const g3pSetting = "Gemini 3 Pro Model Card · results as of November 2025";
  add(g3p, "hle", "gemini-3-pro", 37.5, "%", `${g3pSetting} · no tools`);
  add(g3p, "hle-tools", "gemini-3-pro", 45.8, "%", `${g3pSetting} · search + code execution`);
  add(g3p, "arc-agi-2", "gemini-3-pro", 31.1, "%", `${g3pSetting} · ARC Prize Verified`);
  add(g3p, "gpqa-diamond", "gemini-3-pro", 91.9, "%", `${g3pSetting} · no tools`);
  add(g3p, "aime-2025", "gemini-3-pro", 95.0, "%", `${g3pSetting} · no tools`);
  add(g3p, "aime-2025", "gemini-3-pro", 100, "%", `${g3pSetting} · code execution`);
  add(g3p, "matharena-apex", "gemini-3-pro", 23.4, "%", g3pSetting);
  add(g3p, "mmmu-pro", "gemini-3-pro", 81.0, "%", g3pSetting);
  add(g3p, "screenspot-pro", "gemini-3-pro", 72.7, "%", g3pSetting);
  add(g3p, "charxiv", "gemini-3-pro", 81.4, "%", `${g3pSetting} · reasoning`);
  add(g3p, "omnidocbench", "gemini-3-pro", 0.115, "NED", `${g3pSetting} · overall edit distance · lower is better`);
  add(g3p, "videommmu", "gemini-3-pro", 87.6, "%", g3pSetting);
  add(g3p, "livecodebench-pro", "gemini-3-pro", 2439, "Elo", `${g3pSetting} · Codeforces, ICPC and IOI`);
  add(g3p, "terminal-bench-2-0", "gemini-3-pro", 54.2, "%", `${g3pSetting} · Terminus-2`);
  add(g3p, "swe-bench-verified", "gemini-3-pro", 76.2, "%", `${g3pSetting} · single attempt`);
  add(g3p, "tau2-bench", "gemini-3-pro", 85.4, "%", g3pSetting);
  add(g3p, "vending-bench-2", "gemini-3-pro", 5478.16, "$", `${g3pSetting} · mean net worth`);
  add(g3p, "facts-benchmark-suite", "gemini-3-pro", 70.5, "%", g3pSetting);
  add(g3p, "simpleqa-verified", "gemini-3-pro", 72.1, "%", g3pSetting);
  add(g3p, "mmmlu", "gemini-3-pro", 91.8, "%", g3pSetting);
  add(g3p, "global-piqa", "gemini-3-pro", 93.4, "%", `${g3pSetting} · 100 languages and cultures`);
  add(g3p, "mrcr-v2-8needle", "gemini-3-pro", 77.0, "%", `${g3pSetting} · 128K cumulative average`);
  add(g3p, "mrcr-v2-8needle-1m", "gemini-3-pro", 26.3, "%", `${g3pSetting} · 1M pointwise`);
})();
