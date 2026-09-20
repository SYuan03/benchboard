(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const upsertAudit = (sourceId, values) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    if (audit) Object.assign(audit, values);
    else sourceAudits.push({ sourceId, ...values });
  };
  const patchModel = (modelId, values) => {
    const model = models.find((item) => item.id === modelId);
    if (!model) return;
    const oldReferences = model.referenceSourceIds || [];
    Object.assign(model, values);
    if (values.referenceSourceIds) {
      model.referenceSourceIds = [...new Set([...oldReferences, ...values.referenceSourceIds])];
    }
    if (Object.prototype.hasOwnProperty.call(values, "scoreStatus") && values.scoreStatus === undefined) {
      delete model.scoreStatus;
    }
  };
  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    const existing = observations.find((item) => (
      item.modelId === modelId
      && item.benchmarkId === benchmarkId
      && typeof item.value === typeof value
      && String(item.value) === String(value)
      && item.unit === unit
      && (item.setting || "") === setting
    ));
    if (existing) {
      existing.sourceIds = [...new Set([...(existing.sourceIds || []), ...sourceIds])];
      if (note && !String(existing.note || "").split(" · ").includes(note)) {
        existing.note = [existing.note, note].filter(Boolean).join(" · ");
      }
      return existing;
    }
    const observation = {
      id: `o${observations.length + 1}`,
      sourceIds: [...new Set(sourceIds)],
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
  const targetFor = (sourceId, modelId) => {
    const rows = observations.filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId));
    return {
      modelId,
      expectedObservationCount: rows.length,
      benchmarkIds: [...new Set(rows.map((item) => item.benchmarkId))]
    };
  };
  const targetComplete = (sourceId, modelId, scopeLabel, note) => upsertAudit(sourceId, {
    status: "target-complete",
    scopeLabel,
    auditedAt: "2026-09-21",
    targetModels: [targetFor(sourceId, modelId)],
    note
  });

  appendUnique(sources, [
    { id: "meta-llama31-70b-hf", vendorId: "meta", publisher: "Meta", date: "2024-07-23", tier: "official", title: "Llama 3.1 70B Instruct — Official Model Card", url: "https://huggingface.co/meta-llama/Llama-3.1-70B-Instruct" },
    { id: "meta-llama4-scout-hf", vendorId: "meta", publisher: "Meta", date: "2025-04-05", tier: "official", title: "Llama 4 Scout 17B-16E Instruct — Official Model Card", url: "https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct" },
    { id: "meta-muse-glimmer-model", vendorId: "meta", publisher: "Meta for Developers", date: "2026-08", tier: "official", title: "Muse Glimmer — Official Model Page", url: "https://developer.meta.com/ai/models/muse-glimmer/" },
    { id: "meta-muse-glimmer-hf", vendorId: "meta", publisher: "Meta", date: "2026-08", tier: "official", title: "Muse Glimmer 30B — Official Model Card", url: "https://huggingface.co/meta-models/Muse-Glimmer-30B" },
    { id: "meta-muse-glimmer-methodology", vendorId: "meta", publisher: "Meta AI", date: "2026-08", tier: "official", title: "Muse Glimmer Methodology", url: "https://research.meta.ai/static/muse-glimmer-methodology" },
    { id: "minimax-m25-hf", vendorId: "minimax", publisher: "MiniMax", date: "2026", tier: "official", title: "MiniMax-M2.5 — Official Model Card", url: "https://huggingface.co/MiniMaxAI/MiniMax-M2.5" },
    { id: "minimax-m25-github", vendorId: "minimax", publisher: "MiniMax", date: "2026", tier: "official", title: "MiniMax-M2.5 — Official Repository", url: "https://github.com/MiniMax-AI/MiniMax-M2.5" },
    { id: "minimax-m25-modelscope", vendorId: "minimax", publisher: "MiniMax", date: "2026", tier: "official", title: "MiniMax-M2.5 — Official ModelScope Card", url: "https://modelscope.cn/models/MiniMax/MiniMax-M2.5" },
    { id: "minimax-m3-model", vendorId: "minimax", publisher: "MiniMax", date: "2026-06-01", tier: "official", title: "MiniMax M3 — Official Model Page", url: "https://www.minimax.io/models/text/m3" },
    { id: "minimax-m3-report", vendorId: "minimax", publisher: "MiniMax Research", date: "2026-06-01", tier: "official", title: "MiniMax M3: Frontier Coding, 1M Context, Native Multimodality", url: "https://www.minimax.io/blog/minimax-m3" },
    { id: "minimax-model-catalog", vendorId: "minimax", publisher: "MiniMax API Docs", date: "2026-09-21", tier: "official", title: "MiniMax Models", url: "https://platform.minimax.io/docs/guides/models-intro" },
    { id: "mistral-devstral2-hf", vendorId: "mistral", publisher: "Mistral AI", date: "2025-12-09", tier: "official", title: "Devstral 2 123B Instruct 2512 — Official Model Card", url: "https://huggingface.co/mistralai/Devstral-2-123B-Instruct-2512" },
    { id: "mistral-large3-hf", vendorId: "mistral", publisher: "Mistral AI", date: "2025-12-02", tier: "official", title: "Mistral Large 3 675B Instruct 2512 — Official Model Card", url: "https://huggingface.co/mistralai/Mistral-Large-3-675B-Instruct-2512" },
    { id: "mistral3-blog", vendorId: "mistral", publisher: "Mistral AI", date: "2025-12-02", tier: "official", title: "Introducing Mistral 3", url: "https://mistral.ai/news/mistral-3" },
    { id: "mistral-small4-hf", vendorId: "mistral", publisher: "Mistral AI", date: "2026-03-16", tier: "official", title: "Mistral Small 4 119B-6.5B 2603 — Official Model Card", url: "https://huggingface.co/mistralai/Mistral-Small-4-119B-2603" },
    { id: "nvidia-n3-ultra-hf", vendorId: "nvidia", publisher: "NVIDIA", date: "2026-06-04", tier: "official", title: "NVIDIA Nemotron 3 Ultra 550B-A55B BF16 — Official Model Card", url: "https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16" },
    { id: "nvidia-n3-ultra-build", vendorId: "nvidia", publisher: "NVIDIA", date: "2026-06-04", tier: "official", title: "Nemotron 3 Ultra — NVIDIA Build Model Card", url: "https://build.nvidia.com/nvidia/nemotron-3-ultra-550b-a55b/modelcard" },
    { id: "nvidia-n3-ultra-research", vendorId: "nvidia", publisher: "NVIDIA Research", date: "2026-06-04", tier: "official", title: "NVIDIA Nemotron 3 Ultra", url: "https://research.nvidia.com/labs/nemotron/Nemotron-3-Ultra/" },
    { id: "nvidia-n3-ultra-report", vendorId: "nvidia", publisher: "NVIDIA", date: "2026-06-04", tier: "official", title: "NVIDIA Nemotron 3 Ultra Technical Report", url: "https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Ultra-Technical-Report.pdf" },
    { id: "nvidia-n35-lightning-hf", vendorId: "nvidia", publisher: "NVIDIA", date: "2026-08-11", tier: "official", title: "NVIDIA Nemotron 3.5 Lightning 30B-A3B BF16 — Official Model Card", url: "https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16" },
    { id: "nvidia-n35-lightning-build", vendorId: "nvidia", publisher: "NVIDIA", date: "2026-08-11", tier: "official", title: "Nemotron 3.5 Lightning — NVIDIA Build Model Card", url: "https://build.nvidia.com/nvidia/nemotron-3.5-lightning-30b-a3b/modelcard" },
    { id: "nvidia-n35-lightning-overview-image", vendorId: "nvidia", publisher: "NVIDIA", date: "2026-08-11", tier: "official", title: "Nemotron 3.5 Lightning Accuracy Overview", url: "https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16/resolve/main/accuracy_plot.png" }
  ]);

  appendUnique(benchmarks, [
    { id: "api-bank", name: "API-Bank", category: "Agent / 工作", direction: "higher", description: "API 使用与工具调用能力评测。" },
    { id: "bfcl", name: "BFCL · Version Unspecified", category: "Agent / 工作", direction: "higher", description: "厂商未声明版本的 Berkeley Function Calling Leaderboard 结果。" },
    { id: "gorilla-api-bench", name: "Gorilla API Bench", category: "Agent / 工作", direction: "higher", description: "Gorilla API 调用基准。" },
    { id: "nexus", name: "Nexus", category: "Agent / 工作", direction: "higher", description: "工具/API 调用能力评测。" },
    { id: "chartqa", name: "ChartQA", category: "多模态", direction: "higher", description: "图表问答评测。" },
    { id: "mtob", name: "MTOB", category: "多语言", direction: "higher", description: "低资源机器翻译评测；语向与 half/full-book 写入 setting。" },
    { id: "gaia2", name: "GAIA2", category: "Agent / 工作", direction: "higher", description: "GAIA2 通用 Agent 任务。" },
    { id: "beam128k", name: "Beam128K", category: "长上下文", direction: "higher", description: "128K 长上下文评测。" },
    { id: "gdpval-mm", name: "GDPval-MM", category: "专业工作", direction: "higher", description: "MiniMax 发布材料中的 GDPval-MM 平均胜率。" },
    { id: "vibe-pro-web", name: "VIBE-Pro · Web", category: "编码", direction: "higher", description: "VIBE-Pro Web 子集。" },
    { id: "vibe-pro-simulation", name: "VIBE-Pro · Simulation", category: "编码", direction: "higher", description: "VIBE-Pro Simulation 子集。" },
    { id: "vibe-pro-android", name: "VIBE-Pro · Android", category: "编码", direction: "higher", description: "VIBE-Pro Android 子集。" },
    { id: "vibe-pro-ios", name: "VIBE-Pro · iOS", category: "编码", direction: "higher", description: "VIBE-Pro iOS 子集。" },
    { id: "bfcl-multiturn", name: "BFCL · Multi-turn", category: "Agent / 工作", direction: "higher", description: "BFCL 多轮工具调用口径。" },
    { id: "mewc", name: "MEWC", category: "专业工作", direction: "higher", description: "MiniMax 发布材料中的办公/专业工作评测。" },
    { id: "rise", name: "RISE", category: "Agent / 工作", direction: "higher", description: "检索与搜索 Agent 评测。" },
    { id: "finance-modeling", name: "Finance Modeling", category: "专业工作", direction: "higher", description: "财务建模任务。" },
    { id: "swe-efficiency", name: "SWE-fficiency", category: "编码", direction: "higher", description: "软件工程效率评测。" },
    { id: "livesqlbench", name: "LiveSQLBench", category: "编码", direction: "higher", description: "实时 SQL 生成与执行评测。" },
    { id: "vibe-v2", name: "VIBE-V2", category: "编码", direction: "higher", description: "Web、Android、iOS 等端到端项目交付评测。" },
    { id: "svg-bench", name: "SVG-Bench", category: "编码", direction: "higher", description: "文本/图像条件下的 SVG 创建与编辑评测。" },
    { id: "kernelbench-hard", name: "KernelBench Hard", category: "编码", direction: "higher", description: "GPU kernel 优化困难子集。" },
    { id: "gdpval-rubrics", name: "GDPval Rubrics", category: "专业工作", direction: "higher", description: "基于公开 GDPval 案例与 rubric 的 pointwise 评分。" },
    { id: "yc-bench", name: "YC-Bench", category: "专业工作", direction: "higher", description: "YC-Bench 最终资产（fund）指标。" },
    { id: "loca-bench-256k", name: "LOCA-Bench · 256K", category: "长上下文", direction: "higher", description: "LOCA-Bench 官方 react 模式，环境描述长度 256K。" },
    { id: "usamo-2026-raw-points", name: "USAMO 2026 · Raw Points", category: "知识 / 推理", direction: "higher", description: "USAMO 2026 六题原始得分，满分 42；不与百分制结果混排。" },
    { id: "human-preference-general", name: "Human Preference · General", category: "对话 / 指令", direction: "higher", description: "通用提示上的人类偏好胜率；对手写入 setting。" },
    { id: "human-preference-multilingual", name: "Human Preference · Multilingual", category: "多语言", direction: "higher", description: "多语言提示上的人类偏好胜率；对手写入 setting。" },
    { id: "lmarena-elo", name: "LMArena Elo", category: "对话 / 指令", direction: "higher", description: "LMArena Elo；误差范围写入 setting。" },
    { id: "collie", name: "Collie", category: "知识 / 推理", direction: "higher", description: "Mistral 发布材料中的 Collie 评测。" },
    { id: "aa-lcr-ratio", name: "AA-LCR · Ratio", category: "长上下文", direction: "higher", description: "AA-LCR 的 0–1 ratio 表述；与百分制图值分开保存。" },
    { id: "tau3-airline", name: "τ³-bench Airline", category: "Agent / 工作", direction: "higher", description: "τ³-bench 航空领域。" },
    { id: "tau3-retail", name: "τ³-bench Retail", category: "Agent / 工作", direction: "higher", description: "τ³-bench 零售领域。" },
    { id: "tau3-telecom", name: "τ³-bench Telecom", category: "Agent / 工作", direction: "higher", description: "τ³-bench 电信领域。" },
    { id: "profbench-search", name: "ProfBench · Search", category: "Agent / 工作", direction: "higher", description: "带搜索的 ProfBench。" },
    { id: "omniscience-accuracy", name: "OmniScience · Accuracy", category: "知识 / 推理", direction: "higher", description: "OmniScience 准确率。" },
    { id: "omniscience-non-hallucination", name: "OmniScience · Non-Hallucination", category: "事实性", direction: "higher", description: "OmniScience 非幻觉率。" }
  ]);

  mergeFamily("vibe-pro-family", "VIBE-Pro", [
    { benchmarkId: "vibe-pro", label: "Average" },
    { benchmarkId: "vibe-pro-web", label: "Web" },
    { benchmarkId: "vibe-pro-simulation", label: "Simulation" },
    { benchmarkId: "vibe-pro-android", label: "Android" },
    { benchmarkId: "vibe-pro-ios", label: "iOS" }
  ]);
  mergeFamily("tau3-family", "τ³-bench", [
    { benchmarkId: "tau3-airline", label: "Airline" },
    { benchmarkId: "tau3-retail", label: "Retail" },
    { benchmarkId: "tau3-telecom", label: "Telecom" }
  ]);

  // Two already-complete primary sources contained target-model columns that
  // were still marked comparison-only. Add explicit per-target count gates.
  patchModel("gpt-5-4-pro", {
    scoreStatus: undefined,
    summary: "GPT-5.4 发布页中的 Pro 推理配置；官方能力矩阵已有 12 个精确结果。"
  });
  upsertAudit("openai-gpt54", {
    auditedAt: "2026-09-21",
    targetModels: [targetFor("openai-gpt54", "gpt-5-4-pro")],
    note: "发布页公开能力矩阵已逐格录入；其中 GPT-5.4 Pro 目标列 12 个单元格已单独计数。安全、对齐与部署风险数据不混入能力榜。"
  });
  patchModel("claude-mythos-preview", {
    scoreStatus: undefined,
    summary: "Fable/Mythos 5 System Card 中的预览检查点；18 个第一方能力单元格已接入，另保留 OpenAI 对比表观测。"
  });
  upsertAudit("anthropic-fable5-system-card", {
    auditedAt: "2026-09-21",
    targetModels: [targetFor("anthropic-fable5-system-card", "claude-mythos-preview")],
    note: "System Card 的能力总表已逐格录入；Claude Mythos Preview 目标列 18 个单元格已单独计数。安全、对齐与行为附录不混入能力榜。"
  });

  patchModel("llama-3-1-70b-instruct", {
    releaseDate: "2024-07-23",
    modality: "language",
    modalityDetail: "文本 → 文本；官方卡将该 checkpoint 与 base 模型分表",
    context: "128K",
    access: "开放权重（Llama 3.1 Community License）",
    sourceId: "meta-llama31-70b-hf",
    referenceSourceIds: [],
    scoreStatus: undefined,
    summary: "Llama 3.1 的 70B 指令微调版本；这里只录入 instruct 列，不混入 base-model 表。"
  });
  const llama31 = ["meta-llama31-70b-hf"];
  [
    ["mmlu", 83.6, "5-shot · macro_avg/acc"],
    ["mmlu", 86.0, "0-shot · chain of thought"],
    ["mmlu-pro", 66.4, "5-shot · chain of thought"],
    ["ifeval", 87.5, "official instruction-tuned table"],
    ["arc-challenge", 94.8, "0-shot"],
    ["gpqa", 46.7, "0-shot"],
    ["humaneval", 80.5, "official instruction-tuned table"],
    ["mbpp-plus", 86.0, "base split · EvalPlus"],
    ["multiple-humaneval", 65.5, "official instruction-tuned table"],
    ["multiple-mbpp", 62.0, "official instruction-tuned table"],
    ["gsm8k", 95.1, "8-shot · chain of thought"],
    ["math", 68.0, "0-shot · chain of thought"],
    ["api-bank", 90.0, "official instruction-tuned table"],
    ["bfcl", 84.8, "official card does not state BFCL version"],
    ["gorilla-api-bench", 29.7, "official instruction-tuned table"],
    ["nexus", 56.7, "official instruction-tuned table"],
    ["mgsm", 86.9, "multilingual average"]
  ].forEach(([benchmarkId, value, setting]) => add(llama31, benchmarkId, "llama-3-1-70b-instruct", value, "%", setting));

  patchModel("llama-4-scout", {
    releaseDate: "2025-04-05",
    modality: "vision",
    modalityDetail: "文本、图像 → 文本；17B 激活 / 109B 总参数",
    context: "10M",
    access: "开放权重（Llama 4 Community License）",
    sourceId: "meta-llama4-scout-hf",
    referenceSourceIds: [],
    scoreStatus: undefined,
    summary: "Llama 4 Scout 17B-16E Instruct；原生多模态、10M 上下文。这里只录入 instruction-tuned 表。"
  });
  const scout = ["meta-llama4-scout-hf"];
  [
    ["mmmu", 69.4, "instruction-tuned table"],
    ["mmmu-pro", 52.2, "Standard/Vision average"],
    ["mathvista", 70.7, "instruction-tuned table"],
    ["chartqa", 88.8, "instruction-tuned table"],
    ["docvqa", 94.4, "test split"],
    ["livecodebench", 32.8, "2024-10-01–2025-02-01 · pass@1"],
    ["mmlu-pro", 74.3, "0-shot"],
    ["gpqa-diamond", 57.2, "instruction-tuned table"],
    ["mgsm", 90.6, "instruction-tuned table"]
  ].forEach(([benchmarkId, value, setting]) => add(scout, benchmarkId, "llama-4-scout", value, "%", setting));
  [
    [42.2, "half-book · en→kgv"], [36.6, "half-book · kgv→en"],
    [39.7, "full-book · en→kgv"], [36.3, "full-book · kgv→en"]
  ].forEach(([value, setting]) => add(scout, "mtob", "llama-4-scout", value, "chrF", setting));

  patchModel("muse-glimmer-30b", {
    releaseDate: "2026-08",
    modality: "vision",
    modalityDetail: "文本、图像 → 文本；约 29.6B 参数（含 1.8B 视觉编码器）",
    context: "131,072+",
    access: "开放权重（Apache 2.0）",
    sourceId: "meta-muse-glimmer-hf",
    referenceSourceIds: ["meta-muse-glimmer-model", "meta-muse-glimmer-methodology"],
    scoreStatus: undefined,
    summary: "Meta 开放权重视觉语言模型；知识截止 2026-01-04。安全、隐私与 Preparedness 指标未混入能力榜。"
  });
  const glimmer = ["meta-muse-glimmer-hf"];
  [
    ["mcp-atlas", 75.5, "%", "high reasoning"],
    ["deepsearchqa", 74.6, "F1", "high reasoning"],
    ["tau3-banking", 23.5, "%", "high reasoning"],
    ["wildclawbench-overall", 47.6, "%", "high reasoning"],
    ["gdpval-aa-v2", 953, "Elo", "high reasoning"],
    ["gaia2", 43.3, "%", "high reasoning"],
    ["skillsbench", 44.3, "%", "with skills · high reasoning"],
    ["osworld-verified", 65.9, "%", "high reasoning"],
    ["swe-bench-pro", 51.2, "%", "high reasoning"],
    ["swe-bench-verified", 76.0, "%", "high reasoning"],
    ["terminal-bench-2-1", 51.7, "%", "Terminus 2 · high reasoning"],
    ["scicode", 43.6, "%", "high reasoning"],
    ["charxiv", 78.8, "%", "reasoning · high reasoning"],
    ["screenspot-pro", 75.4, "%", "high reasoning"],
    ["omnidocbench-1-5-score", 75.8, "%", "v1.5 · high reasoning"],
    ["mmmu-pro", 74.0, "%", "high reasoning"],
    ["ifbench", 77.0, "%", "high reasoning"],
    ["aime-2026", 94.7, "%", "high reasoning"],
    ["gpqa-diamond", 83.5, "%", "AA · high reasoning"],
    ["hle", 22.0, "%", "Text · AA · high reasoning"],
    ["aa-lcr", 80.0, "%", "high reasoning"],
    ["beam128k", 65.1, "%", "high reasoning"]
  ].forEach(([benchmarkId, value, unit, setting]) => add(glimmer, benchmarkId, "muse-glimmer-30b", value, unit, setting));

  // The leaderboard label omits the Muse Spark version. It must not be
  // silently collapsed into 1.1, 1.2, or 1.3, even though Meta comparison
  // tables already provide exact values for a similarly unlabeled column.
  patchModel("muse-spark-unspecified", {
    referenceSourceIds: [
      "meta-muse-spark11", "meta-muse-spark11-devblog", "meta-muse-spark11-research",
      "meta-muse-spark11-report", "meta-muse-spark12", "meta-muse-spark12-model",
      "meta-muse-spark13-model", "meta-muse-spark13-research", "meta-muse-spark13-methodology"
    ],
    scoreStatus: "comparison-only",
    summary: "Claw-Eval 只写 Muse Spark，未披露 1.1/1.2/1.3；保留独立身份。Meta 一手对比表中的同名列已留作证据，但不据此强行定版。"
  });

  patchModel("minimax-m2-5", {
    releaseDate: "2026",
    modality: "language",
    modalityDetail: "文本与工具调用 → 文本；229B 参数",
    context: "官方已核材料未单独披露",
    access: "开放权重（Modified MIT）/ API",
    sourceId: "minimax-m25-hf",
    referenceSourceIds: ["minimax-m25-github", "minimax-m25-modelscope"],
    scoreStatus: undefined,
    summary: "MiniMax 的开放权重 Agent 模型；三处官方卡片镜像的能力图、分项图、附录与正文均已拆录。"
  });
  const m25 = ["minimax-m25-hf", "minimax-m25-github", "minimax-m25-modelscope"];
  const m25Rows = [
    ["swe-bench-verified", 80.2, "%", "main capability figure"],
    ["swe-bench-pro", 55.4, "%", "main capability figure"],
    ["terminal-bench-2", 51.7, "%", "main capability figure · Terminal Bench 2"],
    ["multi-swe-bench", 51.3, "%", "main capability figure"],
    ["swe-multilingual", 74.1, "%", "main capability figure"],
    ["vibe-pro", 54.2, "%", "main capability figure · average"],
    ["browsecomp", 76.3, "%", "main capability figure · with context"],
    ["bfcl-multiturn", 76.8, "%", "main capability figure"],
    ["mewc", 74.4, "%", "main capability figure"],
    ["gdpval-mm", 59.0, "%", "main capability figure"],
    ["vibe-pro-web", 36.9, "%", "VIBE-Pro split figure"],
    ["vibe-pro-simulation", 81.4, "%", "VIBE-Pro split figure"],
    ["vibe-pro-android", 50.6, "%", "VIBE-Pro split figure"],
    ["vibe-pro-ios", 47.9, "%", "VIBE-Pro split figure"],
    ["browsecomp", 75.1, "%", "search/tool figure · with context"],
    ["wide-search", 70.3, "%", "search/tool figure"],
    ["rise", 50.2, "%", "search/tool figure"],
    ["bfcl-multiturn", 76.8, "%", "search/tool figure"],
    ["tau2-telecom", 97.8, "%", "search/tool figure"],
    ["gdpval-mm", 59.0, "%", "office figure"],
    ["mewc", 74.4, "%", "office figure"],
    ["finance-modeling", 21.6, "%", "office figure"],
    ["aime-2025", 86.3, "%", "official appendix"],
    ["gpqa-diamond", 85.2, "%", "official appendix"],
    ["hle", 19.4, "%", "official appendix · no tools"],
    ["scicode", 44.4, "%", "official appendix"],
    ["ifbench", 70.0, "%", "official appendix"],
    ["aa-lcr", 69.5, "%", "official appendix"],
    ["swe-bench-verified", 79.7, "%", "official prose · Droid · default prompt"],
    ["swe-bench-verified", 76.1, "%", "official prose · OpenCode · default prompt"],
    ["gdpval-mm", 59.0, "%", "official prose · average win rate"]
  ];
  m25Rows.forEach(([benchmarkId, value, unit, setting]) => add(m25, benchmarkId, "minimax-m2-5", value, unit, setting));

  patchModel("minimax-m3", {
    releaseDate: "2026-06-01",
    modality: "vision",
    modalityDetail: "文本、图像、视频 → 文本与工具调用；支持计算机操作",
    context: "1M（API 至少保证 512K）",
    access: "API / MiniMax Code；官方称开放权重，具体权重仓库未在发布页列出",
    sourceId: "minimax-m3-model",
    referenceSourceIds: ["minimax-m3-report", "minimax-model-catalog"],
    scoreStatus: undefined,
    summary: "采用 MiniMax Sparse Attention 的原生多模态编码与 Agent 模型；官方长表 32 行及模型页 10 项总览均已录入。"
  });
  const m3ReportRows = [
    ["swe-bench-verified", 80.5, "%", "Claude Code · four-run mean"],
    ["swe-bench-pro", 59.0, "%", "Claude Code · official-aligned evaluation"],
    ["terminal-bench-2-1", 66.0, "%", "Terminus 2 · 8C16G · 2h timeout · 128K max output"],
    ["swe-atlas-codebase-qa", 37.9, "%", "Mini-SWE-Agent · 4C8G · 3h timeout"],
    ["nl2repo", 42.13, "%", "Claude Code · restricted sandbox"],
    ["swe-atlas-test-writing", 30.83, "%", "Claude Code · 4C8G · 3h · four-run mean"],
    ["swe-efficiency", 34.8, "%", "Claude Code · 1C2G · 2h"],
    ["livesqlbench", 40.17, "%", "LiveSQLBench-Base-Full v1 · 600 questions · Claude Code"],
    ["cl-bench", 20.48, "%", "official-aligned procedure"],
    ["vibe-v2", 50.12, "%", "Claude Code · three-run mean"],
    ["svg-bench", 63.7, "%", "text/image inputs · VLM rendering verifier · three-run mean"],
    ["posttrainbench", 37.1, "%", "Claude Code · Ralph-Loop · 12h", "正文另以 0.37 归一化表述；这里保留完整表的百分制值。"],
    ["kernelbench-hard", 28.8, "%", "Claude Code · NVIDIA Blackwell sm_120 · 9-task mean"],
    ["paperbench", 52.6, "%", "Claude Code · Ralph-Loop · 12h · 19 papers · Opus 4.6 grader"],
    ["browsecomp", 83.52, "%", "WebExplorer-style agent · history discarded beyond 64K"],
    ["draco", 73.23, "%", "MiniMax Code Deep Research Skill · official rubrics · Opus 4.6 grader"],
    ["gdpval-rubrics", 74.78, "%", "public GDPval cases · pointwise public rubrics"],
    ["bankertoolbench", 76.12, "%", "Claude Code · MiniMax M2.7 grader"],
    ["officeqa-pro", 45.1, "%", "Claude Code · filesystem delivery · exact match"],
    ["spreadsheetbench-v1", 89.35, "%", "public dataset · Claude Code"],
    ["yc-bench", 2.10, "M fund", "official code/config · final assets"],
    ["loca-bench-256k", 49.3, "%", "official react mode · environment description 256K"],
    ["mcp-atlas", 74.2, "%", "public set · Gemini 2.5 Pro grader"],
    ["apex-agents", 27.7, "%", "Archipelago · ReAct Toolbelt · Claude Sonnet 4.6 grader"],
    ["claweval-pass3-unspecified", 74.5, "%", "General group · 161 tasks · Pass³ · Gemini 3.0 Flash grader"],
    ["osworld-verified", 70.06, "%", "nogdrive 361 · 1920×1080 · 200 steps"],
    ["omnidocbench-1-5-score", 91.6, "%", "v1.5 · official logic · long edge ≤3584"],
    ["mmmu-pro", 78.1, "%", "official-aligned prompt"],
    ["videommmu", 84.6, "%", "1 FPS · ≤512 frames · judge scoring"],
    ["videomme", 85.4, "%", "with subtitles · 1 FPS · ≤1024 frames"],
    ["imo-2025-points", 35, "points", "max 42 · test-time scaling ≤10 iterations"],
    ["usamo-2026-raw-points", 36, "points", "max 42 · test-time scaling ≤10 iterations"]
  ];
  m3ReportRows.forEach(([benchmarkId, value, unit, setting, note = ""]) => add(
    ["minimax-m3-report"], benchmarkId, "minimax-m3", value, unit, setting, note
  ));
  [
    ["swe-bench-pro", 59.0, "official model-page overview figure"],
    ["terminal-bench-2-1", 66.0, "official model-page overview figure"],
    ["vibe-v2", 50.1, "official model-page overview figure · rounded"],
    ["svg-bench", 63.7, "official model-page overview figure"],
    ["kernelbench-hard", 28.8, "official model-page overview figure"],
    ["browsecomp", 83.5, "official model-page overview figure · rounded"],
    ["gdpval-rubrics", 74.7, "official model-page overview figure · rounded"],
    ["bankertoolbench", 76.1, "official model-page overview figure · rounded"],
    ["mcp-atlas", 74.2, "official model-page overview figure"],
    ["osworld-verified", 75.2, "official model-page overview figure · setting not stated"]
  ].forEach(([benchmarkId, value, setting]) => add(
    ["minimax-m3-model"], benchmarkId, "minimax-m3", value, "%", setting,
    /rounded/.test(setting) ? "The full report table contains a more precise value; both official surface labels are retained." : ""
  ));

  patchModel("devstral-2512", {
    name: "Devstral 2 123B Instruct 2512",
    releaseDate: "2025-12-09",
    modality: "language",
    modalityDetail: "文本 → 文本与工具调用；123B 参数",
    context: "256K",
    access: "开放权重（Modified MIT）",
    sourceId: "mistral-devstral2-hf",
    referenceSourceIds: [],
    scoreStatus: undefined,
    summary: "排行榜的 Devstral 2512 标签对应官方 Devstral 2 123B Instruct 2512。"
  });
  [
    ["swe-bench-verified", 72.2], ["swe-multilingual", 61.3], ["terminal-bench-2", 32.6]
  ].forEach(([benchmarkId, value]) => add(
    ["mistral-devstral2-hf"], benchmarkId, "devstral-2512", value, "%", "official model card"
  ));

  patchModel("mistral-large-2512", {
    name: "Mistral Large 3 675B Instruct 2512",
    releaseDate: "2025-12-02",
    modality: "vision",
    modalityDetail: "文本、图像 → 文本；41B 激活 / 675B 总参数",
    context: "256K",
    access: "开放权重（Apache 2.0）",
    sourceId: "mistral-large3-hf",
    referenceSourceIds: ["mistral3-blog"],
    scoreStatus: undefined,
    summary: "排行榜 Mistral Large 2512 对应 Mistral Large 3 675B Instruct 2512；不混入 base-model 表。"
  });
  [
    ["human-preference-general", 53, "%", "win rate vs DeepSeek V3.1"],
    ["human-preference-general", 55, "%", "win rate vs Kimi K2"],
    ["human-preference-multilingual", 57, "%", "win rate vs DeepSeek V3.1"],
    ["human-preference-multilingual", 60, "%", "win rate vs Kimi K2"],
    ["lmarena-elo", 1418, "Elo", "±11"]
  ].forEach(([benchmarkId, value, unit, setting]) => add(
    ["mistral-large3-hf"], benchmarkId, "mistral-large-2512", value, unit, setting
  ));

  patchModel("mistral-small-2603", {
    name: "Mistral Small 4 119B-A6.5B 2603",
    releaseDate: "2026-03-16",
    modality: "vision",
    modalityDetail: "文本、图像 → 文本；6.5B 激活 / 119B 总参数",
    context: "256K",
    access: "开放权重（Apache 2.0）",
    sourceId: "mistral-small4-hf",
    referenceSourceIds: [],
    scoreStatus: undefined,
    summary: "排行榜 Mistral Small 2603 对应 Mistral Small 4；官方卡的 instruct、reasoning 与高推理图均按原始设置分开保存。"
  });
  [
    ["aa-lcr", 71.2, "%", "internal high-reasoning chart"],
    ["aime-2025", 83.8, "%", "internal high-reasoning chart"],
    ["collie", 62.9, "%", "internal high-reasoning chart"],
    ["livecodebench", 63.6, "%", "internal high-reasoning chart"],
    ["livecodebench", 32, "%", "public comparison chart · instruct"],
    ["livecodebench", 64, "%", "public comparison chart · reasoning · rounded"],
    ["aa-lcr-ratio", 0.72, "ratio", "official prose", "The same card's chart labels AA-LCR as 71.2%; the ratio and percentage surfaces are kept separate."]
  ].forEach(([benchmarkId, value, unit, setting, note = ""]) => add(
    ["mistral-small4-hf"], benchmarkId, "mistral-small-2603", value, unit, setting, note
  ));
  for (const [benchmarkId, instruct, reasoning] of [
    ["gpqa-diamond", 59.1, 71.2],
    ["mmlu-pro", 73.5, 78.0],
    ["ifbench", 35.7, 48.0],
    ["arena-hard-v2", 55.8, 58.3],
    ["mmmu-pro", 46.3, 60.0],
    ["aa-lcr", 44.0, 72.0],
    ["aime-2025", 36.0, 84.0]
  ]) {
    add(["mistral-small4-hf"], benchmarkId, "mistral-small-2603", instruct, "%", "official comparison table · instruct");
    add(["mistral-small4-hf"], benchmarkId, "mistral-small-2603", reasoning, "%", "official comparison table · reasoning");
  }

  patchModel("nemotron-3-ultra-550b-a55b", {
    releaseDate: "2026-06-04",
    modality: "language",
    modalityDetail: "文本 → 文本与工具调用；55B 激活 / 550B 总参数",
    context: "1M",
    access: "开放权重（OpenMDW 1.1）",
    sourceId: "nvidia-n3-ultra-hf",
    referenceSourceIds: ["nvidia-n3-ultra-build", "nvidia-n3-ultra-research", "nvidia-n3-ultra-report"],
    scoreStatus: undefined,
    summary: "NVIDIA 的 550B LatentMoE Mamba-Transformer 混合模型；官方 HF 目标列 35 项已逐格录入。"
  });
  const ultraRows = [
    ["terminal-bench-2-1", 56.4, "%", "official table"],
    ["gdpval", 46.7, "%", "official table"],
    ["swe-bench-verified", 70.7, "%", "official table"],
    ["swe-multilingual", 67.7, "%", "official table"],
    ["profbench-search", 56.0, "%", "with search · internal scaffolding"],
    ["pinchbench-unspecified", 90.0, "%", "official table · version/metric not stated"],
    ["tau3-airline", 81.5, "%", "TauBench v3"],
    ["tau3-retail", 86.4, "%", "TauBench v3"],
    ["tau3-telecom", 92.9, "%", "TauBench v3"],
    ["tau3-banking", 22.6, "%", "TauBench v3"],
    ["tau3-bench", 70.9, "%", "TauBench v3 · four-domain average"],
    ["browsecomp", 44.4, "%", "official table"],
    ["financeagent-v1-1", 60.1, "%", "Vals.ai Financial Agent 1.1 · without web search"],
    ["financeagent-v1-1", 53.7, "%", "Vals.ai Financial Agent 1.1 · with web search"],
    ["ioi-2025", 570.0, "points", "official table"],
    ["livecodebench-v6", 89.0, "%", "v6"],
    ["imoanswerbench", 88.6, "%", "no tools"],
    ["imoanswerbench", 92.3, "%", "with tools"],
    ["apex-shortlist", 74.9, "%", "no tools"],
    ["apex-shortlist", 84.8, "%", "with tools"],
    ["gpqa", 87.0, "%", "no tools"],
    ["scicode", 44.6, "%", "subtask"],
    ["hle", 26.7, "%", "no tools"],
    ["hle-tools", 37.4, "%", "with tools"],
    ["critpt", 3.1, "%", "no tools"],
    ["mmlu-pro", 86.8, "%", "official table"],
    ["omniscience-accuracy", 24.1, "%", "official table"],
    ["omniscience-non-hallucination", 78.7, "%", "official table"],
    ["ifbench", 81.7, "%", "prompt loose"],
    ["scale-multichallenge", 63.8, "%", "official table"],
    ["aa-lcr", 65.4, "%", "official table"],
    ["ruler-1m", 94.7, "%", "1M"],
    ["longbench-v2", 61.9, "%", "≤1M"],
    ["mmlu-prox", 83.0, "%", "average en/de/fr/es/it/ja/zh/hi/pt/ko"],
    ["wmt24pp", 83.7, "%", "en→xx"]
  ];
  ultraRows.forEach(([benchmarkId, value, unit, setting]) => add(
    ["nvidia-n3-ultra-hf"], benchmarkId, "nemotron-3-ultra-550b-a55b", value, unit,
    `NeMo Evaluator SDK · ${setting}`
  ));

  patchModel("nemotron-3-5-lightning-30b-a3b", {
    releaseDate: "2026-08-11",
    modality: "language",
    modalityDetail: "文本 → 文本与工具调用；3B 激活 / 30B 总参数",
    context: "1M（单 H100 BF16 验证至 256K）",
    access: "开放权重（OpenMDW 1.1）",
    sourceId: "nvidia-n35-lightning-hf",
    referenceSourceIds: ["nvidia-n35-lightning-build", "nvidia-n35-lightning-overview-image"],
    scoreStatus: undefined,
    summary: "NVIDIA 的 30B-A3B Mamba-2/MoE/Attention 混合模型；HTML 表和 Agentic Coding 附图共 30 个目标值已录入。"
  });
  const lightning = ["nvidia-n35-lightning-hf"];
  [
    ["mmlu-pro", 81.94, "official release table"],
    ["omniscience-accuracy", 17.50, "AA-Omniscience"],
    ["gpqa-diamond", 75.44, "no tools"],
    ["hle", 11.72, "text-only · no tools"],
    ["scicode", 32.60, "official release table"],
    ["swe-bench-verified", 51.56, "NeMo Evaluator release-table setting"],
    ["swe-multilingual", 39.33, "NeMo Evaluator release-table setting"],
    ["terminal-bench-2-1", 24.58, "NeMo Evaluator release-table setting"],
    ["pinchbench-unspecified", 85.37, "official table · version/metric not stated"],
    ["browsecomp", 36.97, "official release table"],
    ["tau3-banking", 9.28, "official release table"],
    ["gdpval-aa-v2", 832, "GDPval-AA-V2 · official release table"],
    ["ifbench", 71.88, "loose"],
    ["aa-lcr", 52.00, "official release table"]
  ].forEach(([benchmarkId, value, setting]) => add(
    lightning, benchmarkId, "nemotron-3-5-lightning-30b-a3b", value,
    benchmarkId === "gdpval-aa-v2" ? "Elo" : "%", setting
  ));
  const lightningHarnesses = {
    "swe-bench-verified": [
      ["OpenCode v1.17.8", 60.0], ["Copilot v1.0.71", 58.4], ["Claude v2.1.126", 57.4],
      ["Pi v0.80.10", 54.5], ["Mini-SWE-Agent v2.4.5", 50.7], ["OpenHands v1.36.1", 48.7],
      ["Hermes v0.18.2", 45.7], ["Codex v0.144.6", 11.0]
    ],
    "terminal-bench-2-1": [
      ["Mini-SWE-Agent v2.4.5", 29.7], ["OpenCode v1.17.8", 29.1], ["Claude v2.1.126", 29.0],
      ["Copilot v1.0.71", 27.0], ["OpenHands v1.36.1", 26.1], ["Hermes v0.18.2", 25.8],
      ["Pi v0.80.10", 24.5], ["Codex v0.144.6", 2.9]
    ]
  };
  Object.entries(lightningHarnesses).forEach(([benchmarkId, rows]) => rows.forEach(([harness, value]) => add(
    lightning, benchmarkId, "nemotron-3-5-lightning-30b-a3b", value, "%",
    `agentic-coding figure · ${harness} · unmodified system prompt · standard harness configuration`
  )));

  // Claw-Eval only says “Nemotron 3 Super”; the exact 120B-A12B model has
  // extensive first-party coverage elsewhere, but the leaderboard identity is
  // still not sufficiently specific to merge.
  patchModel("nemotron-3-super-unspecified", {
    referenceSourceIds: [
      "nvidia-n3-super-hf", "nvidia-n3-super-build", "nvidia-n3-super-research",
      "nvidia-n3-super-blog", "nvidia-n3-super-report", "nvidia-nemotron-github"
    ],
    scoreStatus: "comparison-only",
    summary: "Claw-Eval 原始标签未写 120B-A12B、精度或服务端变体；保留独立身份，不把其成绩并入已核的 Nemotron 3 Super 120B-A12B。"
  });

  targetComplete("meta-llama31-70b-hf", "llama-3-1-70b-instruct", "Instruct 目标列已逐格录入", "官方卡 instruct 表 17 个能力值全部录入；base-model 表未混入。" );
  targetComplete("meta-llama4-scout-hf", "llama-4-scout", "Instruct 目标列已逐格录入", "官方卡 instruction-tuned 表 13 个目标值全部录入；MTOB 的斜杠复合单元格已按语向拆开。" );
  targetComplete("meta-muse-glimmer-hf", "muse-glimmer-30b", "能力表目标列已逐格录入", "高推理能力表 22 个目标值全部录入；Security/Privacy 与 Preparedness 风险项未混入通用能力榜。" );
  upsertAudit("meta-muse-glimmer-model", { status: "metadata-only", auditedAt: "2026-09-21", note: "官方开发者页用于核实模型定位、模态与官方卡入口；精确能力数值来自官方 Hugging Face 卡。" });
  upsertAudit("meta-muse-glimmer-methodology", { status: "inaccessible", auditedAt: "2026-09-21", note: "官方 methodology PDF 在本轮隔离浏览器中仅呈现空白画布，无法可靠逐格读取；未复制或推断其中可能存在的数值。" });

  for (const sourceId of m25) targetComplete(sourceId, "minimax-m2-5", "官方能力图、附录与正文目标值已核", "31 个目标观测覆盖主图、VIBE 分项、搜索/工具图、办公图、附录与正文 scaffold 结果；同值但不同图/设置分别保留。" );
  targetComplete("minimax-m3-model", "minimax-m3", "模型页十项能力总览已核", "总览图 10 个目标标签已视觉核对；其中 OSWorld 75.2 与报告长表的 70.06 设置不同，未互相覆盖。" );
  targetComplete("minimax-m3-report", "minimax-m3", "完整 Benchmark 长表目标列已逐格录入", "官方报告长表 32 个目标单元格全部录入；原始 35/42、36/42 已拆为数值与满分 setting，未保存复合字符串。" );
  upsertAudit("minimax-model-catalog", { status: "metadata-only", auditedAt: "2026-09-21", note: "官方 API 目录确认 MiniMax-M3、原生多模态与 1M context；页面无独立能力矩阵。" });

  targetComplete("mistral-devstral2-hf", "devstral-2512", "模型卡目标结果已核", "Devstral 2 123B Instruct 2512 的三个公开能力值已录入。" );
  targetComplete("mistral-large3-hf", "mistral-large-2512", "Instruct 结果已核", "四个人类偏好胜率和一个 LMArena Elo 已录入；base-model chart 未混入。" );
  upsertAudit("mistral3-blog", { status: "metadata-only", auditedAt: "2026-09-21", note: "发布博客用于核实 Mistral 3 系列定位、开放许可与模型入口；本包的精确 Instruct 数值引用官方模型卡。" });
  targetComplete("mistral-small4-hf", "mistral-small-2603", "目标模型列已逐格录入", "官方卡 instruct/reasoning 对比表 16 个目标值、高推理图 4 个值及 AA-LCR 正文 ratio 均已录入；同一 benchmark 在不同官方图中的舍入差异分别保留。" );

  targetComplete("nvidia-n3-ultra-hf", "nemotron-3-ultra-550b-a55b", "HF 完整 Benchmark 目标列已逐格录入", "35 个目标单元格全部录入；比较模型列未扩张导入。评测主要由 NeMo Evaluator SDK、NeMo Gym、NeMo Skills 与 Harbor 运行。" );
  upsertAudit("nvidia-n3-ultra-research", { status: "metadata-only", auditedAt: "2026-09-21", note: "研究主页核实 2026-06-04 发布、550B/55B、1M context、检查点与技术报告入口；无独立数值表。" });
  upsertAudit("nvidia-n3-ultra-build", { status: "inaccessible", auditedAt: "2026-09-21", note: "NVIDIA Build 动态模型卡在当前隔离浏览器中未提供可读成绩 DOM；不假定其与 HF 表逐单元格完全相同。" });
  upsertAudit("nvidia-n3-ultra-report", { status: "inaccessible", auditedAt: "2026-09-21", note: "官方 PDF 在当前隔离浏览器中只暴露空白 PDF 画布，无法可靠逐表提取；已完整录入可读 HF 模型卡目标列。" });

  targetComplete("nvidia-n35-lightning-hf", "nemotron-3-5-lightning-30b-a3b", "HTML 表与 Agentic Coding 附图目标值已核", "HTML release table 14 项，加两张 harness 柱图 16 项，共 30 个目标观测；图中每个 harness/version 与原始分数均保留。" );
  upsertAudit("nvidia-n35-lightning-build", { status: "inaccessible", auditedAt: "2026-09-21", note: "NVIDIA Build 动态卡在当前隔离浏览器中未提供可读成绩 DOM；未复制 HF 数值冒充已核 Build 表。" });
  upsertAudit("nvidia-n35-lightning-overview-image", { status: "inaccessible", auditedAt: "2026-09-21", note: "accuracy_plot.png 在隔离浏览器中渲染为纯黑图；可读的 agentic_coding_benchmarks.png 已通过 HF 主卡 source 逐柱录入。" });

  // Resolve earlier ambiguous audit states to explicit outcomes.
  upsertAudit("meta-muse-spark11-methodology", { status: "inaccessible", auditedAt: "2026-09-21", note: "官方独立 methodology 端点在本轮返回错误/空白页面，无法读取；不从其他 surface 复制分数冒充该来源。" });
  upsertAudit("meta-muse-spark12-model", { status: "inaccessible", auditedAt: "2026-09-21", note: "独立动态模型页在本轮无法形成可读成绩 DOM；1.2 发布博客中已核的四张图仍由其原 source 保留。" });
  upsertAudit("nvidia-n3-super-build", { status: "inaccessible", auditedAt: "2026-09-21", note: "NVIDIA Build 动态模型卡当前只渲染页面外壳，无法逐格核对；HF 卡、博客和技术报告的已核结果保持独立 provenance。" });
  upsertAudit("openai-gptoss-launch", { status: "metadata-only", auditedAt: "2026-09-21", note: "发布页的模型定位与公开评测范围已核；能力数值全部以更完整且带三档推理明细的官方 Model Card 为准，发布页不另造重复分数。" });
  upsertAudit("claweval", {
    auditedAt: "2026-09-21",
    note: "87 displayed model/subset rows × two headline pass metrics. The UI control labeled Image is 'Download as image', not a benchmark split. Muse Spark and Nemotron 3 Super labels omit their exact version/variant, so both remain separate comparison-only identities rather than being silently merged into a first-party checkpoint."
  });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
