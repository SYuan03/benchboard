(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const patchModel = (id, patch, clearScoreStatus = false) => {
    const model = models.find((item) => item.id === id);
    if (!model) return;
    const references = [...new Set([...(model.referenceSourceIds || []), ...(patch.referenceSourceIds || [])])];
    Object.assign(model, patch);
    if (references.length) model.referenceSourceIds = references;
    if (clearScoreStatus) delete model.scoreStatus;
  };
  const upsertAudit = (sourceId, patch) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    if (audit) Object.assign(audit, patch);
    else sourceAudits.push({ sourceId, ...patch });
  };
  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    const normalizedSources = [...new Set(sourceIds)];
    const existing = observations.find((item) =>
      item.benchmarkId === benchmarkId && item.modelId === modelId &&
      item.value === value && item.unit === unit && (item.setting || "") === setting
    );
    if (existing) {
      existing.sourceIds = [...new Set([...(existing.sourceIds || []), ...normalizedSources])];
      if (note && !existing.note) existing.note = note;
      return existing;
    }
    const observation = {
      id: `o${observations.length + 1}`,
      sourceIds: normalizedSources,
      benchmarkId,
      modelId,
      value,
      unit,
      setting,
      note
    };
    observations.push(observation);
    return observation;
  };
  const addRows = (sourceIds, modelId, rows, commonSetting = "") => rows.forEach((row) => {
    const [benchmarkId, value, unit = "%", detail = "", note = ""] = row;
    add(sourceIds, benchmarkId, modelId, value, unit, [commonSetting, detail].filter(Boolean).join(" · "), note);
  });
  const mergeFamily = (id, name, variants) => {
    let family = benchmarkFamilies.find((item) => item.id === id);
    if (!family) {
      family = { id, name, variants: [] };
      benchmarkFamilies.push(family);
    }
    for (const variant of variants) {
      if (!family.variants.some((item) => item.benchmarkId === variant.benchmarkId)) family.variants.push(variant);
    }
  };
  const sourceTarget = (sourceId, modelId) => {
    const rows = observations.filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId));
    return {
      modelId,
      expectedObservationCount: rows.length,
      benchmarkIds: [...new Set(rows.map((item) => item.benchmarkId))]
    };
  };
  const targetComplete = (sourceId, modelIds, scopeLabel, note) => upsertAudit(sourceId, {
    status: "target-complete",
    scopeLabel,
    auditedAt: "2026-09-21",
    targetModels: modelIds.map((modelId) => sourceTarget(sourceId, modelId)),
    note
  });

  appendUnique(sources, [
    {
      id: "amazon-nova2-lite-launch", vendorId: "amazon", publisher: "Amazon Web Services", date: "2025-12-02", tier: "official",
      title: "Introducing Amazon Nova 2 Lite, a fast, cost-effective reasoning model",
      url: "https://aws.amazon.com/blogs/aws/introducing-amazon-nova-2-lite-a-fast-cost-effective-reasoning-model/"
    },
    {
      id: "amazon-nova2-report", vendorId: "amazon", publisher: "Amazon AGI", date: "2025", tier: "official",
      title: "Amazon Nova 2: Multimodal reasoning and generation models",
      url: "https://www.amazon.science/publications/amazon-nova-2-multimodal-reasoning-and-generation-models"
    },
    {
      id: "deepmind-gemini31-flash-lite", vendorId: "google", publisher: "Google DeepMind", date: "2026-03-03", tier: "official",
      title: "Gemini 3.1 Flash-Lite — Model Card",
      url: "https://deepmind.google/models/model-cards/gemini-3-1-flash-lite/"
    },
    {
      id: "deepmind-gemini31-flash-lite-method", vendorId: "google", publisher: "Google DeepMind", date: "2026-03-03", tier: "official",
      title: "Gemini 3.1 Flash-Lite — Evaluation Methodology",
      url: "https://storage.googleapis.com/deepmind-media/gemini/gemini_3-1_flash-lite_model_evaluation.pdf"
    },
    {
      id: "gemma4-31b-hf", vendorId: "google", publisher: "Google DeepMind", date: "2026-04-02", tier: "official",
      title: "Gemma 4 31B IT — Official Model Card",
      url: "https://huggingface.co/google/gemma-4-31b-it"
    },
    {
      id: "gemma4-26b-hf", vendorId: "google", publisher: "Google DeepMind", date: "2026-04-02", tier: "official",
      title: "Gemma 4 26B-A4B IT — Official Model Card",
      url: "https://huggingface.co/google/gemma-4-26b-a4b-it"
    },
    {
      id: "gemma4-blog", vendorId: "google", publisher: "Google", date: "2026-04-02", tier: "official",
      title: "Gemma 4: Our most capable open models to date",
      url: "https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/"
    },
    {
      id: "gemma4-report", vendorId: "google", publisher: "Google DeepMind", date: "2026-07", tier: "official",
      title: "Gemma 4 Technical Report",
      url: "https://arxiv.org/abs/2607.02770"
    }
  ]);

  appendUnique(benchmarks, [
    { id: "longcodebench-1m", name: "LongCodeBench · 1M", category: "长上下文", direction: "higher", description: "一百万 token 上下文中的代码理解；报告 1M match。" },
    { id: "realkie-fcc-verified", name: "RealKIE-FCC Verified", category: "多模态", direction: "higher", description: "人工核验标注的文档关键信息抽取；以 ALNS 报告。", inputModalities: ["文本", "图像", "文档"] },
    { id: "qvhighlights", name: "QVHighlights", category: "多模态", direction: "higher", description: "查询驱动的视频片段定位；R@1、IoU 0.5。", inputModalities: ["文本", "视频"] },
    { id: "screenspot", name: "ScreenSpot", category: "计算机操作", direction: "higher", description: "屏幕 UI 元素定位；不要与 ScreenSpot-Pro 混排。", inputModalities: ["文本", "图像"] },
    { id: "terminal-bench-1-0", name: "Terminal-Bench 1.0", category: "编码", direction: "higher", description: "80 个手工且人工核验的终端任务。" },
    { id: "livecodebench-v5", name: "LiveCodeBench v5", category: "编码", direction: "higher", description: "Nova 2 报告使用的 2024-07-01 至 2025-01-01 子集。" },
    { id: "arena-text", name: "Arena Text", category: "对话 / 指令", direction: "higher", description: "盲测人类偏好 Elo；榜单日期写入 setting。" },
    { id: "ruler-32k", name: "RULER · 32K", category: "长上下文", direction: "higher", description: "RULER 32K 长上下文准确率。" },
    { id: "loft-text-retrieval", name: "LOFT · Text Retrieval", category: "长上下文", direction: "higher", description: "LOFT 文本检索 Recall@k。" },
    { id: "graphwalks-f1", name: "GraphWalks · F1", category: "长上下文", direction: "higher", description: "GraphWalks 图遍历 F1；不要与特定 BFS/Parents 分项混排。" },
    { id: "mtob", name: "MTOB", category: "长上下文", direction: "higher", description: "长书翻译 chrF；翻译方向与上下文长度写入 setting。" },
    { id: "infographicvqa", name: "InfographicVQA", category: "多模态", direction: "higher", description: "信息图视觉问答。", inputModalities: ["文本", "图像"] }
  ]);
  mergeFamily("terminal-bench", "Terminal-Bench", [{ benchmarkId: "terminal-bench-1-0", label: "1.0" }]);
  mergeFamily("livecodebench-family", "LiveCodeBench", [{ benchmarkId: "livecodebench-v5", label: "v5" }]);
  mergeFamily("ruler-family", "RULER", [{ benchmarkId: "ruler-32k", label: "32K" }]);

  patchModel("qwen3-5-plus", {
    releaseDate: "2026-02-16", modality: "vision",
    modalityDetail: "文本、图像、视频 → 文本；原生工具调用与 Agent 能力", context: "1M",
    access: "闭源 Model Studio API", sourceId: "qwen35",
    aliases: ["Qwen3.5 Plus", "Qwen3.5-Plus", "qwen3.5-plus"],
    summary: "Qwen3.5 系列的托管 Plus 版本；官方发布页未提供独立 Plus 成绩列，现有分数仅保留其原始 benchmark 来源。"
  });
  patchModel("nova-2-lite-v1", {
    releaseDate: "2025-12-02", modality: "vision",
    modalityDetail: "文本、图像、视频、文档 → 文本；内置 web grounding 与 code interpreter", context: "1M",
    access: "闭源 Amazon Bedrock API", sourceId: "amazon-nova2-lite-launch", referenceSourceIds: ["amazon-nova2-report"],
    aliases: ["Nova 2 Lite v1", "amazon/nova-2-lite-v1", "global.amazon.nova-2-lite-v1:0"],
    summary: "可切换 extended thinking，并提供 low、medium、high 三档推理预算。"
  }, true);
  patchModel("gemini-3-1-pro", {
    releaseDate: "2026-02-19", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M",
    access: "闭源 API（Preview）", sourceId: "deepmind-gemini31", referenceSourceIds: ["deepmind-gemini31-method"],
    aliases: ["Gemini 3.1 Pro", "Gemini 3.1 Pro Preview", "google/gemini-3.1-pro-preview", "gemini-3.1-pro", "gemini-3.1-pro-preview"],
    summary: "官方展示名为 Gemini 3.1 Pro，模型卡方法附件使用 API model-id gemini-3.1-pro-preview；两种名称指向同一模型记录。"
  }, true);
  patchModel("gemini-3-1-flash-lite", {
    releaseDate: "2026-03-03", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M",
    access: "闭源 API（Preview）", sourceId: "deepmind-gemini31-flash-lite", referenceSourceIds: ["deepmind-gemini31-flash-lite-method"],
    aliases: ["Gemini 3.1 Flash Lite", "google/gemini-3.1-flash-lite", "gemini-3.1-flash-lite-preview"],
    summary: "低成本 Gemini 3.1 模型；官方结果使用 high thinking、默认采样与 single-attempt/pass@1。"
  }, true);
  for (const id of ["gemma-4-31b-it", "gemma-4-26b-a4b-it"]) {
    patchModel(id, {
      releaseDate: "2026-04-02", modality: "vision", modalityDetail: "文本、图像、视频帧 → 文本；不支持音频输入", context: "256K",
      access: "开放权重 · Apache-2.0", sourceId: id === "gemma-4-31b-it" ? "gemma4-31b-hf" : "gemma4-26b-hf",
      referenceSourceIds: ["gemma4-blog", "gemma4-report"],
      summary: id === "gemma-4-31b-it" ? "Gemma 4 稠密旗舰指令模型。" : "Gemma 4 约 26B total / 3.8B active MoE 指令模型。"
    }, true);
  }
  patchModel("seed2-0-code", {
    summary: "Workspace-Bench 使用的未注明快照对照标签；Seed2.0 官方页没有名为 Seed-2.0-Code 的模型行，因此不与 Lite/Pro 快照合并。"
  });

  const flashLiteSources = ["deepmind-gemini31-flash-lite", "deepmind-gemini31-flash-lite-method"];
  addRows(flashLiteSources, "gemini-3-1-flash-lite", [
    ["hle", 16.0, "%", "no tools"],
    ["gpqa-diamond", 86.9, "%", "no tools"],
    ["mmmu-pro", 76.8, "%", "no tools"],
    ["charxiv", 73.2, "%", "reasoning · no tools"],
    ["videommmu", 84.8],
    ["simpleqa-verified", 43.3],
    ["facts-benchmark-suite", 40.6],
    ["mmmlu", 88.9],
    ["livecodebench", 72.0, "%", "175 problems · 2025-01-01 through 2025-05-01"],
    ["mrcr-v2-8needle", 60.1, "%", "128K cumulative average"],
    ["mrcr-v2-8needle-1m", 12.3, "%", "1M pointwise"]
  ], "Gemini 3.1 Flash-Lite Model Card · high thinking · default sampling · single attempt/pass@1");

  const novaBoth = ["amazon-nova2-lite-launch", "amazon-nova2-report"];
  const novaReport = ["amazon-nova2-report"];
  addRows(novaBoth, "nova-2-lite-v1", [
    ["mmlu-pro", 80.9, "%", "accuracy"],
    ["gpqa-diamond", 79.6, "%", "accuracy"],
    ["aime-2025", 91.0, "%", "accuracy"],
    ["ifbench", 70.8, "%", "prompt-loose accuracy"],
    ["multichallenge", 76.6, "%", "accuracy"],
    ["longcodebench-1m", 84.0, "%", "1M match"],
    ["mmmu-pro", 61.8, "%", "accuracy"],
    ["ocrbench-v2", 56.1, "%", "average accuracy"],
    ["realkie-fcc-verified", 62.1, "ALNS", "human-verified ground truth"],
    ["qvhighlights", 77.2, "%", "R@1 · IoU 0.5"],
    ["tau2-telecom", 76.0, "%", "Artificial Analysis setup"],
    ["tau2-retail", 76.5, "%", "Verified · avg@3"],
    ["tau2-airline", 64.8, "%", "Verified · avg@3"],
    ["bfcl-v4", 60.3, "%", "Overall FC"],
    ["mcp-atlas", 24.6, "%", "blind evaluation · pass rate"],
    ["screenspot", 83.3, "%", "point accuracy"],
    ["swe-bench-verified", 64.5, "%", "inference-time scaling · internal agentic scaffold"],
    ["terminal-bench-1-0", 32.5, "%", "overall · 80 tasks"],
    ["livecodebench-v5", 71.0, "%", "high reasoning · 2024-07-01 through 2025-01-01"]
  ], "Amazon Nova 2 Lite official launch chart / technical report");
  addRows(novaReport, "nova-2-lite-v1", [
    ["swe-bench-verified", 53.6, "%", "standard inference"],
    ["livecodebench-v5", 35.0, "%", "reasoning disabled · 2024-07-01 through 2025-01-01"],
    ["livecodebench-v5", 47.0, "%", "low reasoning · 2024-07-01 through 2025-01-01"],
    ["livecodebench-v5", 66.0, "%", "medium reasoning · 2024-07-01 through 2025-01-01"]
  ], "Amazon Nova 2 technical report");

  const gemmaModels = [
    ["gemma-4-31b-it", 0],
    ["gemma-4-26b-a4b-it", 1]
  ];
  const gemmaTable = (rows, setting) => {
    for (const [modelId, column] of gemmaModels) {
      addRows(["gemma4-report"], modelId, rows.map(([benchmarkId, values, unit = "%", detail = "", note = ""]) =>
        [benchmarkId, values[column], unit, detail, note]
      ), setting);
    }
  };
  gemmaTable([
    ["arena-text", [1451, 1438], "Elo", "leaderboard snapshot 2026-06-19"]
  ], "Gemma 4 Technical Report · Table 4 · blind human preference");
  gemmaTable([
    ["mmlu-pro", [85.2, 82.6]],
    ["aime-2026", [89.2, 88.3], "%", "no tools"],
    ["livecodebench-v6", [80.0, 77.1]],
    ["codeforces-rating", [2150, 1718], "Rating"],
    ["scicode", [43.0, 40.0]],
    ["gpqa-diamond", [84.3, 82.3]],
    ["bbeh", [74.4, 64.8], "%", "micro average"],
    ["hle-tools", [26.5, 17.2], "%", "with search"],
    ["ifbench", [76.0, 72.0]],
    ["ifeval", [98.9, 98.5]],
    ["mmmlu", [88.4, 86.3]],
    ["mrcr-v2-8needle", [66.4, 44.1], "%", "128K"],
    ["terminal-bench-hard", [36.0, 14.0]],
    ["tau2-airline", [75.0, 76.0]],
    ["tau2-retail", [86.4, 85.5]],
    ["tau2-telecom", [69.3, 43.0]]
  ], "Gemma 4 Technical Report · Table 5 · thinking mode unless noted");
  gemmaTable([
    ["mmmu-pro", [76.9, 73.8]],
    ["mathvision", [85.6, 82.4]],
    ["medxpertqa-mm", [61.3, 58.1]],
    ["infographicvqa", [92.0, 89.3]],
    ["omnidocbench", [0.131, 0.149], "NED", "lower is better"]
  ], "Gemma 4 Technical Report · Table 6 · thinking · 1120 vision tokens");
  gemmaTable([
    ["ruler-32k", [96.8, 97.3], "%", "accuracy · 32K"],
    ["ruler-128k", [96.4, 89.8], "%", "accuracy · 128K"],
    ["loft-text-retrieval", [79.5, 66.3], "%", "Recall@k · 128K"],
    ["graphwalks-f1", [82.3, 72.6], "%", "F1 · <128K"],
    ["mtob", [52.9, 50.0], "chrF", "English → KGV · half book · ~128K"],
    ["mtob", [54.3, 48.9], "chrF", "English → KGV · full book · ~256K"],
    ["mtob", [48.6, 45.0], "chrF", "KGV → English · half book · ~128K"],
    ["mtob", [46.2, 42.7], "chrF", "KGV → English · full book · ~256K"]
  ], "Gemma 4 Technical Report · Table 9 · without thinking");
  gemmaTable([
    ["mmmu-pro", [75.8, 73.2]],
    ["mathvision", [83.4, 80.3]],
    ["medxpertqa-mm", [60.7, 55.7]],
    ["infographicvqa", [82.8, 77.8]],
    ["omnidocbench", [0.201, 0.269], "NED", "lower is better"]
  ], "Gemma 4 Technical Report · Table 12 · thinking · 280 vision tokens");

  // The two Hugging Face cards repeat 13 report values and add two card-only
  // aggregate rows. Attach the card provenance to the matching report rows
  // instead of creating duplicate semantic observations.
  for (const [modelId, sourceId, column] of [
    ["gemma-4-31b-it", "gemma4-31b-hf", 0],
    ["gemma-4-26b-a4b-it", "gemma4-26b-hf", 1]
  ]) {
    addRows([sourceId], modelId, [
      ["mmlu-pro", [85.2, 82.6][column]],
      ["aime-2026", [89.2, 88.3][column], "%", "no tools"],
      ["livecodebench-v6", [80.0, 77.1][column]],
      ["codeforces-rating", [2150, 1718][column], "Rating"],
      ["gpqa-diamond", [84.3, 82.3][column]],
      ["hle-tools", [26.5, 17.2][column], "%", "with search"],
      ["bbeh", [74.4, 64.8][column], "%", "micro average"],
      ["mmmlu", [88.4, 86.3][column]],
      ["mrcr-v2-8needle", [66.4, 44.1][column], "%", "128K"]
    ], "Gemma 4 Technical Report · Table 5 · thinking mode unless noted");
    addRows([sourceId], modelId, [
      ["mmmu-pro", [76.9, 73.8][column]],
      ["mathvision", [85.6, 82.4][column]],
      ["medxpertqa-mm", [61.3, 58.1][column]],
      ["omnidocbench", [0.131, 0.149][column], "NED", "lower is better"]
    ], "Gemma 4 Technical Report · Table 6 · thinking · 1120 vision tokens");
    addRows([sourceId], modelId, [
      ["tau2-bench", [76.9, 68.2][column], "%", "aggregate"],
      ["hle", [19.5, 8.7][column], "%", "no tools"]
    ], "Gemma 4 official model card");
  }

  targetComplete(
    "amazon-nova2-lite-launch", ["nova-2-lite-v1"], "发布图目标列已核",
    "发布图 Nova 2 Lite 目标列的 19 个非空数值全部录入；SWE-Bench 64.5 是 inference-time scaling + internal agentic scaffold，LiveCodeBench 71.0 对应 high reasoning。"
  );
  targetComplete(
    "amazon-nova2-report", ["nova-2-lite-v1"], "技术报告目标列已核",
    "技术报告四张能力表和 LiveCodeBench reasoning-effort 图共 23 条 Nova 2 Lite 观测全部录入；图中的 high=71.0 与表格同值合并。"
  );
  targetComplete(
    "deepmind-gemini31-flash-lite", ["gemini-3-1-flash-lite"], "目标模型列已核",
    "模型卡 11 个非空目标结果全部录入；采用 high thinking、默认采样和 single-attempt/pass@1。"
  );
  upsertAudit("deepmind-gemini31-flash-lite-method", {
    status: "metadata-only", scopeLabel: "评测方法已核", auditedAt: "2026-09-21",
    note: "方法附件确认 API model-id、high thinking、默认采样与 single-attempt/pass@1；它提供设置而非独立分数表，作为 11 条卡片成绩的方法学来源。"
  });
  targetComplete(
    "deepmind-gemini31", ["gemini-3-1-pro"], "目标模型列已核",
    "模型卡 19 条公开设置已完整；方法附件中的 API model-id gemini-3.1-pro-preview 已作为同一模型的 alias 保存，不再重复占据排行榜。"
  );
  upsertAudit("deepmind-gemini31-method", {
    status: "metadata-only", scopeLabel: "评测方法已核", auditedAt: "2026-09-21",
    note: "方法学附件确认全部结果使用 API model-id gemini-3.1-pro-preview，并补充 harness、采样与工具设置；不作为独立分数表。"
  });
  targetComplete(
    "gemma4-report", ["gemma-4-31b-it", "gemma-4-26b-a4b-it"], "两款目标模型列已核",
    "技术报告 Tables 4/5/6/9/12 的 31B 与 26B-A4B 目标列完整录入，各 35 条；thinking、低分辨率视觉、长上下文方向与上下文长度均分 setting 保存。"
  );
  targetComplete(
    "gemma4-31b-hf", ["gemma-4-31b-it"], "模型卡目标列已核",
    "模型卡 15 个目标值全部录入；其中 13 个与技术报告同设置、同值的记录合并 provenance，Tau2 aggregate 与 HLE no-tools 为卡片补充项。"
  );
  targetComplete(
    "gemma4-26b-hf", ["gemma-4-26b-a4b-it"], "模型卡目标列已核",
    "模型卡 15 个目标值全部录入；其中 13 个与技术报告同设置、同值的记录合并 provenance，Tau2 aggregate 与 HLE no-tools 为卡片补充项。"
  );
  upsertAudit("gemma4-blog", {
    status: "metadata-only", scopeLabel: "发布元数据已核", auditedAt: "2026-09-21",
    note: "官方发布页用于核对发布日期、开放权重与产品定位；完整量化目标列由官方技术报告覆盖。"
  });

  const qwen35Audit = sourceAudits.find((item) => item.sourceId === "qwen35");
  if (qwen35Audit) {
    qwen35Audit.auditedAt = "2026-09-21";
    qwen35Audit.note = "Qwen3.5-397B-A17B 后训练与 Base 目标列已完整录入；同页发布的托管 Qwen3.5 Plus 没有独立成绩列，因此仅补官方模型元数据，不借用 397B-A17B 分数。";
  }
  const seed20Audit = sourceAudits.find((item) => item.sourceId === "seed20");
  if (seed20Audit) {
    seed20Audit.auditedAt = "2026-09-21";
    seed20Audit.note = "官方 Evaluation Results 表的 Seed2.0 Lite（0428）目标列 73 个非空单元格全部录入。0215 Lite/Pro 与未注明日期的外部行保持分离；官方页没有 Seed-2.0-Code 型号，因此不把 Workspace-Bench 的同名外部标签强行映射到 Lite/Pro 快照。";
  }
  targetComplete(
    "seed21-blog", ["seed2-1-turbo", "seed2-1-pro"], "博客独立目标数值已核",
    "Tech Blog 中可独立归因且与 73 页 Model Card 不同或补充的 Turbo/Pro 数值已全部登记；与 PDF 完全重复的表不重复制造 observation。"
  );

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
