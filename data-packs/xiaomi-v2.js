(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const upsertModel = (id, values) => {
    let model = models.find((item) => item.id === id);
    if (!model) {
      model = { id };
      models.push(model);
    }
    const aliases = [...new Set([...(model.aliases || []), ...(values.aliases || [])])];
    const references = [...new Set([...(model.referenceSourceIds || []), ...(values.referenceSourceIds || [])])];
    Object.assign(model, values, { aliases, referenceSourceIds: references });
    if (!Object.hasOwn(values, "scoreStatus")) delete model.scoreStatus;
    return model;
  };
  const upsertAudit = (sourceId, values) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    if (audit) Object.assign(audit, values);
    else sourceAudits.push({ sourceId, ...values });
  };
  const mergeFamily = (id, name, variants) => {
    let family = benchmarkFamilies.find((item) => item.id === id);
    if (!family) {
      family = { id, name, variants: [] };
      benchmarkFamilies.push(family);
    }
    family.name = name;
    for (const variant of variants) {
      if (!family.variants.some((item) => item.benchmarkId === variant.benchmarkId)) family.variants.push(variant);
    }
  };
  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    const normalizedSources = [...new Set(sourceIds)];
    const existing = observations.find((item) =>
      item.benchmarkId === benchmarkId &&
      item.modelId === modelId &&
      item.value === value &&
      item.unit === unit &&
      (item.setting || "") === setting
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
      setting
    };
    if (note) observation.note = note;
    observations.push(observation);
    return observation;
  };
  const sourceTarget = (sourceId, modelId) => ({
    modelId,
    expectedObservationCount: observations.filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId)).length,
    benchmarkIds: [...new Set(observations
      .filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId))
      .map((item) => item.benchmarkId))]
  });

  appendUnique(sources, [
    { id: "xiaomi-mimo-v2-flash-blog", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2025-12-16", tier: "official", surface: "release", title: "Introducing MiMo-V2-Flash", url: "https://mimo.xiaomi.com/blog/mimo-v2-flash" },
    { id: "xiaomi-mimo-v2-flash-hf", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2025-12-17", tier: "official", surface: "model-card", title: "MiMo-V2-Flash — Official Hugging Face Model Card", url: "https://huggingface.co/XiaomiMiMo/MiMo-V2-Flash" },
    { id: "xiaomi-mimo-v2-flash-base-hf", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2025-12-17", tier: "official", surface: "model-card", title: "MiMo-V2-Flash-Base — Official Hugging Face Model Card", url: "https://huggingface.co/XiaomiMiMo/MiMo-V2-Flash-Base" },
    { id: "xiaomi-mimo-v2-flash-modelscope", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2025-12-17", tier: "official", surface: "model-card", title: "MiMo-V2-Flash — Official ModelScope Card", url: "https://modelscope.cn/models/XiaomiMiMo/MiMo-V2-Flash" },
    { id: "xiaomi-mimo-v2-flash-base-modelscope", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2025-12-17", tier: "official", surface: "model-card", title: "MiMo-V2-Flash-Base — Official ModelScope Card", url: "https://modelscope.cn/models/XiaomiMiMo/MiMo-V2-Flash-Base" },
    { id: "xiaomi-mimo-v2-flash-github", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2025-12-17", tier: "official", surface: "repository", title: "MiMo-V2-Flash — Official GitHub Repository", url: "https://github.com/XiaomiMiMo/MiMo-V2-Flash" },
    { id: "xiaomi-mimo-v2-flash-report", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-01-08", tier: "official", surface: "technical-report", title: "MiMo-V2-Flash Technical Report", url: "https://arxiv.org/abs/2601.02780" },
    { id: "xiaomi-mimo-v2-pro", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-03-18", tier: "official", surface: "release", title: "Xiaomi MiMo-V2-Pro", url: "https://mimo.xiaomi.com/mimo-v2-pro" },
    { id: "xiaomi-mimo-v2-omni", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-03-18", tier: "official", surface: "release", title: "Xiaomi MiMo-V2-Omni", url: "https://mimo.xiaomi.com/mimo-v2-omni" }
  ]);

  upsertModel("mimo-v2-flash", {
    name: "MiMo V2 Flash", vendorId: "xiaomi", vendor: "Xiaomi", releaseDate: "2025-12-16",
    modality: "language", modalityDetail: "文本、代码与工具调用 → 文本；官方模型卡未声明原生图像、音频或视频输入",
    context: "256K", access: "开放权重 / API", aliases: ["MiMo-V2-Flash", "mimo-v2-flash"],
    sourceId: "xiaomi-mimo-v2-flash-blog",
    referenceSourceIds: ["xiaomi-mimo-v2-flash-hf", "xiaomi-mimo-v2-flash-github", "xiaomi-mimo-v2-flash-report", "xiaomi-mimo-v2-flash-modelscope"],
    summary: "309B 总参数、15B 激活参数的纯语言 MoE，面向推理、编码和 Agent 工作流。"
  });
  upsertModel("mimo-v2-flash-base", {
    name: "MiMo V2 Flash Base", vendorId: "xiaomi", vendor: "Xiaomi", releaseDate: "2025-12-17",
    modality: "language", modalityDetail: "文本 → 文本；Base 预训练快照",
    context: "256K", access: "开放权重", aliases: ["MiMo-V2-Flash-Base", "mimo-v2-flash-base"],
    sourceId: "xiaomi-mimo-v2-flash-base-hf",
    referenceSourceIds: ["xiaomi-mimo-v2-flash-hf", "xiaomi-mimo-v2-flash-base-modelscope", "xiaomi-mimo-v2-flash-modelscope", "xiaomi-mimo-v2-flash-github", "xiaomi-mimo-v2-flash-report"],
    scoreStatus: "base-model",
    summary: "MiMo V2 Flash 的 309B/15B Base 快照；与经过 MOPD 和 Agentic RL 后训练的服务模型分开。"
  });
  upsertModel("mimo-v2-pro", {
    name: "MiMo V2 Pro", vendorId: "xiaomi", vendor: "Xiaomi", releaseDate: "2026-03-18",
    modality: "language", modalityDetail: "文本、代码与工具调用 → 文本；官方发布页未声明原生图像、音频或视频输入",
    context: "1M", access: "闭源 API", aliases: ["MiMo-V2-Pro", "mimo-v2-pro", "Hunter Alpha"],
    sourceId: "xiaomi-mimo-v2-pro", referenceSourceIds: [],
    summary: "超过 1T 总参数、42B 激活参数的语言 Agent 模型；官方表覆盖 OpenClaw、编码与检索任务。"
  });
  upsertModel("mimo-v2-omni", {
    name: "MiMo V2 Omni", vendorId: "xiaomi", vendor: "Xiaomi", releaseDate: "2026-03-18",
    modality: "omni", modalityDetail: "文本、图像、视频、音频 → 文本与工具调用 / UI grounding",
    context: "未披露；官方称支持超过 10 小时连续音频", access: "闭源 API", aliases: ["MiMo-V2-Omni", "mimo-v2-omni"],
    sourceId: "xiaomi-mimo-v2-omni", referenceSourceIds: [],
    summary: "统一图像、视频、音频与文本感知的全模态 Agent 模型。"
  });

  appendUnique(benchmarks, [
    { id: "simpleqa", name: "SimpleQA", category: "知识 / 推理", direction: "higher", description: "OpenAI SimpleQA 原始事实问答集；不与 SimpleQA-Verified 混排。" },
    { id: "multiple-humaneval", name: "MultiPL-E · HumanEval", category: "编码", direction: "higher", description: "MultiPL-E 的 HumanEval 多语言代码生成子集。" },
    { id: "multiple-mbpp", name: "MultiPL-E · MBPP", category: "编码", direction: "higher", description: "MultiPL-E 的 MBPP 多语言代码生成子集。" },
    { id: "niah-multi", name: "NIAH-Multi", category: "长上下文", direction: "higher", description: "多 needle 长上下文检索；上下文长度写入 setting。" },
    { id: "gsm-infinite-hard", name: "GSM-Infinite Hard", category: "长上下文", direction: "higher", description: "长上下文数学推理压力测试；长度与 Hard Ops 设置写入 setting。" },
    { id: "arena-hard-hard-prompt", name: "Arena-Hard · Hard Prompt", category: "知识 / 推理", direction: "higher", description: "Arena-Hard 的困难提示口径。" },
    { id: "arena-hard-creative-writing", name: "Arena-Hard · Creative Writing", category: "知识 / 推理", direction: "higher", description: "Arena-Hard 的创意写作口径。" },
    { id: "mrcr-128k-248-needle", name: "MRCR · ≤128K · 2/4/8-needle", category: "长上下文", direction: "higher", description: "MiMo-V2-Flash 报告的 MRCR 口径：2、4、8 needles，最长 128K。" },
    { id: "terminal-bench-hard", name: "Terminal-Bench Hard", category: "编码", direction: "higher", description: "MiMo-V2-Flash 官方资料使用的 Terminal-Bench Hard 口径；harness 未披露。" },
    { id: "pinchbench-average-unspecified", name: "PinchBench · Average · Version Unspecified", category: "Agent / 工作", direction: "higher", description: "厂商只注明 PinchBench 平均分，未给版本；不与 v2 自动合并。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["OpenClaw"], inputModalities: ["图片", "视频任务"] },
    { id: "mmau-pro", name: "MMAU-Pro", category: "音频", direction: "higher", description: "专业音频理解与推理基准；不与 MMAU 自动合并。" },
    { id: "bigbench-audio", name: "BigBench Audio", category: "音频", direction: "higher", description: "语音推理评测；以厂商发布页原始名称登记。" },
    { id: "futureomni", name: "FutureOmni", category: "多模态", direction: "higher", description: "多模态未来事件预测评测。" },
    { id: "mm-browsercomp", name: "MM-BrowserComp", category: "计算机操作", direction: "higher", description: "多模态网页浏览与信息检索 Agent 评测。" },
    { id: "gdpval-unspecified-elo", name: "GDPVal · Version Unspecified", category: "专业工作", direction: "higher", description: "来源只标注 GDPVal 的 Elo 风格分数，未明确 AA 版本；不与 GDPval-AA 自动合并。" }
  ]);

  mergeFamily("simpleqa-family", "SimpleQA", [
    { benchmarkId: "simpleqa", label: "Original" },
    { benchmarkId: "simpleqa-verified", label: "Verified" }
  ]);
  mergeFamily("multiple-family", "MultiPL-E", [
    { benchmarkId: "multiple", label: "Aggregate / Unspecified" },
    { benchmarkId: "multiple-humaneval", label: "HumanEval" },
    { benchmarkId: "multiple-mbpp", label: "MBPP" }
  ]);
  mergeFamily("arena-hard-family", "Arena-Hard", [
    { benchmarkId: "arena-hard-hard-prompt", label: "Hard Prompt" },
    { benchmarkId: "arena-hard-creative-writing", label: "Creative Writing" }
  ]);
  mergeFamily("mrcr-v2", "MRCR", [{ benchmarkId: "mrcr-128k-248-needle", label: "≤128K · 2/4/8-needle" }]);
  mergeFamily("terminal-bench", "Terminal-Bench", [{ benchmarkId: "terminal-bench-hard", label: "Hard · Harness unspecified" }]);
  mergeFamily("pinchbench-v2", "PinchBench", [{ benchmarkId: "pinchbench-average-unspecified", label: "Average · Version unspecified" }]);
  mergeFamily("gdpval-aa-family", "GDPval / GDPval-AA", [{ benchmarkId: "gdpval-unspecified-elo", label: "GDPVal · Version unspecified" }]);
  mergeFamily("mmau-family", "MMAU", [
    { benchmarkId: "mmau", label: "MMAU" },
    { benchmarkId: "mmau-pro", label: "MMAU-Pro" }
  ]);

  const flashBaseSources = [
    "xiaomi-mimo-v2-flash-hf",
    "xiaomi-mimo-v2-flash-base-hf",
    "xiaomi-mimo-v2-flash-modelscope",
    "xiaomi-mimo-v2-flash-base-modelscope",
    "xiaomi-mimo-v2-flash-github",
    "xiaomi-mimo-v2-flash-report"
  ];
  const baseRows = [
    ["bbh", 88.5, "3-shot"], ["mmlu", 86.7, "5-shot"], ["mmlu-redux", 90.6, "5-shot"],
    ["mmlu-pro", 73.2, "5-shot"], ["drop", 84.7, "3-shot"], ["arc-challenge", 95.9, "25-shot"],
    ["hellaswag", 88.5, "10-shot"], ["winogrande", 83.8, "5-shot"], ["triviaqa", 80.3, "5-shot"],
    ["gpqa-diamond", 55.1, "5-shot"], ["supergpqa", 41.1, "5-shot"], ["simpleqa", 20.6, "5-shot"],
    ["gsm8k", 92.3, "8-shot"], ["math", 71.0, "4-shot"], ["aime-2024-2025", 35.3, "2-shot"],
    ["humaneval-plus", 70.7, "1-shot"], ["mbpp-plus", 71.4, "3-shot"], ["crux-i", 67.5, "1-shot"],
    ["crux-o", 79.1, "1-shot"], ["multiple-humaneval", 59.5, "0-shot"], ["multiple-mbpp", 56.7, "0-shot"],
    ["bigcodebench", 70.1, "0-shot"], ["livecodebench-v6", 30.8, "1-shot"], ["swe-agentless", 30.8, "3-shot · AgentLess Repair"],
    ["c-eval", 87.9, "5-shot"], ["cmmlu", 87.4, "5-shot"], ["chinese-simpleqa", 61.5, "5-shot · C-SimpleQA"],
    ["gmmlu", 76.6, "5-shot · GlobalMMLU"], ["include", 71.4, "5-shot"]
  ];
  for (const [benchmarkId, value, detail] of baseRows) {
    add(flashBaseSources, benchmarkId, "mimo-v2-flash-base", value, "%", `official Base table · ${detail}`);
  }
  [["32K", 99.3], ["64K", 99.9], ["128K", 98.6], ["256K", 96.7]].forEach(([length, value]) => {
    add(flashBaseSources, "niah-multi", "mimo-v2-flash-base", value, "%", `official Base long-context table · ${length}`);
  });
  [["16K", 37.7], ["32K", 33.7], ["64K", 31.5], ["128K", 29.0]].forEach(([length, value]) => {
    add(flashBaseSources, "gsm-infinite-hard", "mimo-v2-flash-base", value, "%", `official Base long-context table · 5-shot · Hard Ops-{2,4,6,8,10} · ${length}`);
  });

  const flashSharedSources = [
    "xiaomi-mimo-v2-flash-blog",
    "xiaomi-mimo-v2-flash-hf",
    "xiaomi-mimo-v2-flash-modelscope",
    "xiaomi-mimo-v2-flash-github"
  ];
  const flashReportShared = [...flashSharedSources, "xiaomi-mimo-v2-flash-report"];
  const postRows = [
    ["mmlu-pro", 84.9, "published post-training table"],
    ["hle", 22.1, "text-only · no tools"],
    ["aime-2025", 94.1, "published post-training table"],
    ["hmmt-2025-02", 84.4, "February 2025"],
    ["arena-hard-hard-prompt", 54.1, "Hard Prompt"],
    ["arena-hard-creative-writing", 86.2, "Creative Writing"],
    ["longbench-v2", 60.6, "published post-training table"],
    ["mrcr-128k-248-needle", 45.7, "2/4/8-needle · maximum 128K"],
    ["swe-bench-verified", 73.4, "published code-agent setting · harness unspecified"],
    ["swe-multilingual", 71.7, "published code-agent setting · harness unspecified"],
    ["terminal-bench-hard", 30.5, "harness unspecified"],
    ["terminal-bench-2-0-unspecified-harness", 38.5, "version 2.0 · harness unspecified"],
    ["browsecomp", 45.4, "standard"],
    ["browsecomp", 58.3, "with context management"],
    ["tau2-bench", 80.3, "aggregate · DeepSeek-V3.2 user agent"]
  ];
  for (const [benchmarkId, value, detail] of postRows) {
    add(flashReportShared, benchmarkId, "mimo-v2-flash", value, "%", `MiMo-V2-Flash final evaluation · ${detail}`);
  }
  add(flashSharedSources, "gpqa-diamond", "mimo-v2-flash", 83.7, "%", "official release/model-card table", "The technical report reports 84.3 under its final-evaluation table; both official values are retained.");
  add(["xiaomi-mimo-v2-flash-report"], "gpqa-diamond", "mimo-v2-flash", 84.3, "%", "technical report Table 9 · final evaluation", "The release blog/model cards report 83.7; both official values are retained.");
  add(flashSharedSources, "livecodebench-v6", "mimo-v2-flash", 80.6, "%", "official release/model-card table", "The technical report reports 85.1 in Table 9 and 83.2 for its post-MOPD student in Table 7; all official values are retained by setting.");
  add(["xiaomi-mimo-v2-flash-report"], "livecodebench-v6", "mimo-v2-flash", 85.1, "%", "technical report Table 9 · final evaluation", "The release blog/model cards report 80.6; both official final-table values are retained.");
  add(["xiaomi-mimo-v2-flash-report"], "livecodebench", "mimo-v2-flash", 83.2, "%", "technical report Table 7 · student after MOPD · benchmark version unspecified");
  add(flashReportShared, "tau2-telecom", "mimo-v2-flash", 95.3, "%", "DeepSeek-V3.2 user agent · Telecom");
  add(flashReportShared, "tau2-retail", "mimo-v2-flash", 79.5, "%", "DeepSeek-V3.2 user agent · Retail");
  add(flashReportShared, "tau2-airline", "mimo-v2-flash", 66.0, "%", "DeepSeek-V3.2 user agent · Airline");

  const proRows = [
    ["claweval", 61.5, "%", "OpenClaw · version/subset unspecified"],
    ["pinchbench-average-unspecified", 81.0, "%", "OpenClaw · average · version unspecified"],
    ["gdpval-aa", 1426, "Elo", "Artificial Analysis GDPVal-AA · snapshot/date unspecified"],
    ["tau2-telecom", 96.8, "%", "Telecom"],
    ["swe-bench-verified", 78.0, "%", "harness unspecified"],
    ["swe-multilingual", 71.7, "%", "harness unspecified"],
    ["terminal-bench-2-0-unspecified-harness", 57.1, "%", "version 2.0 · harness unspecified"],
    ["deepsearchqa", 86.7, "F1", "search-agent setting · harness unspecified"]
  ];
  for (const [benchmarkId, value, unit, detail] of proRows) {
    add(["xiaomi-mimo-v2-pro"], benchmarkId, "mimo-v2-pro", value, unit, `Xiaomi MiMo-V2-Pro release table · ${detail}`);
  }

  const omniRows = [
    ["mmau-pro", 69.4, "%", "audio understanding and reasoning"],
    ["mmmu-pro", 76.8, "%", "multimodal understanding and reasoning"],
    ["videomme", 85.3, "%", "native audio-video input · exact benchmark version unspecified"],
    ["bigbench-audio", 94.0, "%", "speech reasoning"],
    ["charxiv-rq", 80.1, "%", "chart understanding · Code Interpreter setting unspecified"],
    ["futureomni", 66.7, "%", "future-event forecasting"],
    ["mm-browsercomp", 52.0, "%", "multimodal web browsing and information retrieval · harness unspecified"],
    ["omnigaia", 49.8, "%", "multimodal perception and reasoning · harness unspecified"],
    ["claweval", 54.8, "%", "real and complex interactions · version/subset/harness unspecified"],
    ["swe-bench-verified", 74.8, "%", "code-and-text agent table · harness unspecified"],
    ["gdpval-unspecified-elo", 1410, "Elo", "page label: GDPVal · exact AA version unspecified"],
    ["pinchbench-average-unspecified", 81.2, "%", "OpenClaw environment evaluation · average · version unspecified"]
  ];
  for (const [benchmarkId, value, unit, detail] of omniRows) {
    add(["xiaomi-mimo-v2-omni"], benchmarkId, "mimo-v2-omni", value, unit, `Xiaomi MiMo-V2-Omni release table · ${detail}`);
  }

  upsertAudit("xiaomi-mimo-v2-flash-blog", {
    status: "target-complete", scopeLabel: "目标列已核", auditedAt: "2026-09-21",
    targetModels: [sourceTarget("xiaomi-mimo-v2-flash-blog", "mimo-v2-flash")],
    note: "官方博客后训练表目标列及正文补充的 τ²-bench Telecom/Retail/Airline 均已录入；效率散点图不是能力 Benchmark，未混入排行榜。"
  });
  upsertAudit("xiaomi-mimo-v2-flash-hf", {
    status: "target-complete", scopeLabel: "目标列已核", auditedAt: "2026-09-21",
    targetModels: [sourceTarget("xiaomi-mimo-v2-flash-hf", "mimo-v2-flash"), sourceTarget("xiaomi-mimo-v2-flash-hf", "mimo-v2-flash-base")],
    note: "官方模型卡的 Base 与 post-training 两个目标列已逐格录入；与技术报告冲突的 GPQA/LiveCodeBench 未覆盖，按来源分列保留。"
  });
  upsertAudit("xiaomi-mimo-v2-flash-base-hf", {
    status: "target-complete", scopeLabel: "目标列已核", auditedAt: "2026-09-21",
    targetModels: [sourceTarget("xiaomi-mimo-v2-flash-base-hf", "mimo-v2-flash-base")],
    note: "Base 权重卡镜像系列表；MiMo-V2-Flash-Base 的全部 37 个公开结果已逐格录入。"
  });
  upsertAudit("xiaomi-mimo-v2-flash-modelscope", {
    status: "target-complete", scopeLabel: "目标列已核", auditedAt: "2026-09-21",
    targetModels: [sourceTarget("xiaomi-mimo-v2-flash-modelscope", "mimo-v2-flash"), sourceTarget("xiaomi-mimo-v2-flash-modelscope", "mimo-v2-flash-base")],
    note: "ModelScope 官方镜像逐表核对，与 Hugging Face 卡一致。"
  });
  upsertAudit("xiaomi-mimo-v2-flash-base-modelscope", {
    status: "target-complete", scopeLabel: "目标列已核", auditedAt: "2026-09-21",
    targetModels: [sourceTarget("xiaomi-mimo-v2-flash-base-modelscope", "mimo-v2-flash-base")],
    note: "Base ModelScope 官方镜像逐表核对；只将 Base 列归给 Base 模型。"
  });
  upsertAudit("xiaomi-mimo-v2-flash-github", {
    status: "target-complete", scopeLabel: "目标列已核", auditedAt: "2026-09-21",
    targetModels: [sourceTarget("xiaomi-mimo-v2-flash-github", "mimo-v2-flash"), sourceTarget("xiaomi-mimo-v2-flash-github", "mimo-v2-flash-base")],
    note: "GitHub README 的 Base 与 post-training 目标列已逐格核对；内容与 Hugging Face 主卡一致。"
  });
  upsertAudit("xiaomi-mimo-v2-flash-report", {
    status: "target-complete", scopeLabel: "目标列已核", auditedAt: "2026-09-21",
    targetModels: [sourceTarget("xiaomi-mimo-v2-flash-report", "mimo-v2-flash"), sourceTarget("xiaomi-mimo-v2-flash-report", "mimo-v2-flash-base")],
    note: "技术报告 Table 5/6/7/9 的发布模型目标值已核。架构消融与训练曲线不是发布模型成绩，未混入；GPQA 84.3、LiveCodeBench-v6 85.1 及 Table 7 的 LiveCodeBench 83.2 与模型卡冲突，均按 setting 保留。"
  });
  upsertAudit("xiaomi-mimo-v2-pro", {
    status: "target-complete", scopeLabel: "目标列已核", auditedAt: "2026-09-21",
    targetModels: [sourceTarget("xiaomi-mimo-v2-pro", "mimo-v2-pro")],
    note: "发布页主对照表的 8 个目标数值已录入；页面未链接模型卡、公开仓库或技术报告，精确 HF URL 返回 404。"
  });
  upsertAudit("xiaomi-mimo-v2-omni", {
    status: "target-complete", scopeLabel: "目标列已核", auditedAt: "2026-09-21",
    targetModels: [sourceTarget("xiaomi-mimo-v2-omni", "mimo-v2-omni")],
    note: "发布页三组对照表的 12 个目标数值已录入；演示案例不冒充 Benchmark。页面未链接模型卡、公开仓库或技术报告。"
  });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
