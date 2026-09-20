(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const patchModel = (id, patch, clearScoreStatus = true) => {
    const model = models.find((item) => item.id === id);
    if (!model) return;
    const references = [...new Set([...(model.referenceSourceIds || []), ...(patch.referenceSourceIds || [])])];
    Object.assign(model, patch);
    if (references.length) model.referenceSourceIds = references;
    if (clearScoreStatus) delete model.scoreStatus;
  };
  const ensureBenchmark = (row) => {
    const existing = benchmarks.find((item) => item.id === row.id);
    if (existing) Object.assign(existing, row);
    else benchmarks.push(row);
  };
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
      return;
    }
    observations.push({ id: `o${observations.length + 1}`, sourceIds: normalizedSources, benchmarkId, modelId, value, unit, setting, note });
  };
  const addRows = (sourceIds, modelId, rows, common = "") => rows.forEach((row) => {
    const [benchmarkId, value, unit = "%", detail = "", note = ""] = row;
    add(sourceIds, benchmarkId, modelId, value, unit, [common, detail].filter(Boolean).join(" · "), note);
  });
  const sourceTarget = (sourceId, modelId) => {
    const rows = observations.filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId));
    return { modelId, expectedObservationCount: rows.length, benchmarkIds: [...new Set(rows.map((item) => item.benchmarkId))] };
  };
  const targetComplete = (sourceId, modelIds, note) => upsertAudit(sourceId, {
    status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-21",
    targetModels: modelIds.map((modelId) => sourceTarget(sourceId, modelId)), note
  });
  const metadataOnly = (sourceId, note) => upsertAudit(sourceId, {
    status: "metadata-only", scopeLabel: "模型元数据已核", auditedAt: "2026-09-21", note
  });

  appendUnique(sources, [
    { id: "arcee-trinity-preview-hf", vendorId: "arcee", publisher: "Arcee AI", date: "2026", tier: "official", title: "Trinity-Large-Preview — Official Model Card", url: "https://huggingface.co/arcee-ai/Trinity-Large-Preview" },
    { id: "arcee-trinity-thinking-hf", vendorId: "arcee", publisher: "Arcee AI", date: "2026", tier: "official", title: "Trinity-Large-Thinking — Official Model Card", url: "https://huggingface.co/arcee-ai/Trinity-Large-Thinking" },
    { id: "arcee-trinity-report", vendorId: "arcee", publisher: "Arcee AI", date: "2026-02", tier: "official", title: "Arcee Trinity Large Technical Report", url: "https://arxiv.org/abs/2602.17004" },
    { id: "step35-hf", vendorId: "stepfun", publisher: "StepFun", date: "2026-02", tier: "official", title: "Step 3.5 Flash — Official Model Card", url: "https://huggingface.co/stepfun-ai/Step-3.5-Flash" },
    { id: "step35-github", vendorId: "stepfun", publisher: "StepFun", date: "2026-02", tier: "official", title: "Step 3.5 Flash — Official GitHub Repository", url: "https://github.com/stepfun-ai/Step-3.5-Flash" },
    { id: "step35-blog", vendorId: "stepfun", publisher: "StepFun", date: "2026-02", tier: "official", title: "Step 3.5 Flash — Official Release Page", url: "https://static.stepfun.com/blog/step-3.5-flash/" },
    { id: "step35-report", vendorId: "stepfun", publisher: "StepFun", date: "2026-02", tier: "official", title: "Step 3.5 Flash: Open Frontier-Level Intelligence with 11B Active Parameters", url: "https://arxiv.org/abs/2602.10604" },
    { id: "step35-modelscope", vendorId: "stepfun", publisher: "StepFun", date: "2026-02", tier: "official", title: "Step 3.5 Flash — Official ModelScope Card", url: "https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash" },
    { id: "step37-hf", vendorId: "stepfun", publisher: "StepFun", date: "2026-09", tier: "official", title: "Step 3.7 Flash — Official Model Card", url: "https://huggingface.co/stepfun-ai/Step-3.7-Flash" },
    { id: "step37-blog", vendorId: "stepfun", publisher: "StepFun", date: "2026-09", tier: "official", title: "Step 3.7 Flash — Official Release Page", url: "https://static.stepfun.com/blog/step-3.7-flash/" },
    { id: "step37-github", vendorId: "stepfun", publisher: "StepFun", date: "2026-09", tier: "official", title: "Step 3.7 Flash — Official Repository", url: "https://github.com/stepfun-ai/Step-3.7-Flash" },
    { id: "aion3-docs", vendorId: "aion", publisher: "Aion Labs", date: "2026-05-05", tier: "official", title: "Aion Labs Models — Aion 3.0", url: "https://www.aionlabs.ai/docs/models/" },
    { id: "fugu-release", vendorId: "sakana", publisher: "Sakana AI", date: "2026-06-22", tier: "official", title: "Fugu: A New Intelligence That Evolves Through Experience", url: "https://sakana.ai/fugu-release/" },
    { id: "fugu-report", vendorId: "sakana", publisher: "Sakana AI", date: "2026-06", tier: "official", title: "Fugu: The Internet as a Training Environment", url: "https://arxiv.org/abs/2606.21228" },
    { id: "fugu-github", vendorId: "sakana", publisher: "Sakana AI", date: "2026-06-22", tier: "official", title: "Fugu — Official Repository", url: "https://github.com/SakanaAI/fugu" },
    { id: "mercury2-release", vendorId: "inception", publisher: "Inception Labs", date: "2026", tier: "official", title: "Introducing Mercury 2", url: "https://www.inceptionlabs.ai/blog/introducing-mercury-2" },
    { id: "mercury2-pinchbench", vendorId: "inception", publisher: "Inception Labs", date: "2026", tier: "official", title: "Mercury 2 on PinchBench", url: "https://www.inceptionlabs.ai/blog/mercury-2-on-pinchbench" },
    { id: "mercury2-search", vendorId: "inception", publisher: "Inception Labs", date: "2026", tier: "official", title: "Mercury 2 for Search", url: "https://www.inceptionlabs.ai/blog/mercury-2-for-search" },
    { id: "mercury2-voice", vendorId: "inception", publisher: "Inception Labs", date: "2026", tier: "official", title: "Mercury 2: The First Reasoning Model Fast Enough to Pick Up the Phone", url: "https://www.inceptionlabs.ai/blog/mercury-2-the-first-reasoning-model-fast-enough-to-pick-up-the-phone" },
    { id: "agnes20-docs", vendorId: "agnes", publisher: "Agnes AI", date: "2026", tier: "official", title: "Agnes 2.0 Flash — Official Documentation", url: "https://wiki.agnes-ai.cn/en/docs/agnes-20-flash.md" },
    { id: "agnes-models-github", vendorId: "agnes", publisher: "Agnes AI", date: "2026", tier: "official", title: "AgnesAI Models — Official GitHub Repository", url: "https://github.com/AgnesAI-Labs/AgnesAI-Models" },
    { id: "hy3-github", vendorId: "tencent", publisher: "Tencent Hunyuan", date: "2026", tier: "official", title: "Hy3 — Official Repository", url: "https://github.com/Tencent-Hunyuan/Hy3" },
    { id: "hy3-research", vendorId: "tencent", publisher: "Tencent Hunyuan", date: "2026", tier: "official", title: "Hy3 — Official Research Page", url: "https://hy.tencent.com/research/hy3?langVersion=en" },
    { id: "hy3-hf", vendorId: "tencent", publisher: "Tencent Hunyuan", date: "2026", tier: "official", title: "Hy3 — Official Model Card", url: "https://huggingface.co/tencent/Hy3" },
    { id: "hy3-modelscope", vendorId: "tencent", publisher: "Tencent Hunyuan", date: "2026", tier: "official", title: "Hy3 — Official ModelScope Card", url: "https://modelscope.cn/models/Tencent-Hunyuan/Hy3" },
    { id: "grok-build-github", vendorId: "xai", publisher: "SpaceXAI", date: "2026", tier: "official", title: "Grok Build — Official Repository", url: "https://github.com/xai-org/grok-build" },
    { id: "grok-build-docs", vendorId: "xai", publisher: "SpaceXAI", date: "2026", tier: "official", title: "Grok Build — Official Documentation", url: "https://docs.x.ai/build/overview" },
    { id: "inclusionai-official", vendorId: "inclusionai", publisher: "InclusionAI", date: "2026", tier: "official", title: "InclusionAI Official Model Site", url: "https://www.ant-ling.com/zh/" },
    { id: "internlm-official-org", vendorId: "internlm", publisher: "InternLM", date: "2026", tier: "official", title: "InternLM Official Repository Organization", url: "https://github.com/InternLM" }
  ]);

  [
    ["gaia", "GAIA", "Agent / 工作", "通用 AI 助手真实任务评测；文件是否提供、工具和 Agent scaffold 写入 setting。", "higher"],
    ["xbench-deepsearch-2505", "xbench-DeepSearch · 2025.05", "Agent / 工作", "xbench DeepSearch 2025.05 快照；与 2025.10 分榜。", "higher"],
    ["xbench-deepsearch-2510", "xbench-DeepSearch · 2025.10", "Agent / 工作", "xbench DeepSearch 2025.10 快照；与 2025.05 分榜。", "higher"],
    ["cf-div2-stepfun", "CF-Div2-Stepfun", "编码", "StepFun 构建的 Codeforces Div.2 竞赛编程评测；语言、avg@k 与 PaCoRe 写入 setting。", "higher"],
    ["frames-oracle", "FRAMES · Oracle", "长上下文", "FRAMES 在 oracle 文档设置下的长上下文推理结果。", "higher"],
    ["repoqa", "RepoQA", "长上下文", "仓库级代码理解和检索评测。", "higher"],
    ["browsecomp-tool-gain", "BrowseComp · Tool Gain", "Agent / 工作", "工具增益诊断，单位为百分点；不与最终正确率混排。", "higher"],
    ["browsecomp-zh-tool-gain", "BrowseComp-ZH · Tool Gain", "Agent / 工作", "工具增益诊断，单位为百分点。", "higher"],
    ["gaia-tool-gain", "GAIA · Tool Gain", "Agent / 工作", "工具增益诊断，单位为百分点。", "higher"],
    ["xbench-deepsearch-2505-tool-gain", "xbench-DeepSearch 2025.05 · Tool Gain", "Agent / 工作", "工具增益诊断，单位为百分点。", "higher"],
    ["xbench-deepsearch-2510-tool-gain", "xbench-DeepSearch 2025.10 · Tool Gain", "Agent / 工作", "工具增益诊断，单位为百分点。", "higher"],
    ["step35-search-agent-tool-gain", "Step 3.5 Search Agent · Average Tool Gain", "Agent / 工作", "五项搜索评测的平均工具增益。", "higher"],
    ["stepfun-data-analysis", "StepFun Data Analysis Benchmark", "专业工作", "Step 3.5 技术报告内部数据分析任务。", "higher"],
    ["stepfun-consulting", "StepFun Consulting & Recommendations", "专业工作", "Step 3.5 技术报告内部咨询与推荐任务。", "higher"],
    ["androiddaily-hard", "AndroidDaily Hard", "编码", "Android 应用工程困难任务。", "higher"],
    ["simplevqa-search", "SimpleVQA · Search", "多模态", "允许搜索的 SimpleVQA 视觉问答设置。", "higher"],
    ["claweval-v1-1-unspecified", "Claw-Eval v1.1 · Metric Unspecified", "Agent / 工作", "厂商仅写 ClawEval-1.1 单值，未说明 Pass³、Pass@3 或子集时使用。", "higher"],
    ["frames-agent-score", "FRAMES · Agent Score", "Agent / 工作", "端到端检索 Agent 在 FRAMES 上的原始 0–1 得分。", "higher"],
    ["deepsearchqa-ratio", "DeepSearchQA · F1 Ratio", "Agent / 工作", "DeepSearchQA 的 0–1 F1 表述；与百分制 F1 分开保存。", "higher"],
    ["wide-search-ratio", "WideSearch · Score Ratio", "Agent / 工作", "WideSearch 的 0–1 比例表述；与百分制 item-F1 分开保存。", "higher"],
    ["deepswe-unspecified", "DeepSWE · Version Unspecified", "编码", "厂商没有声明 DeepSWE 版本时使用。", "higher"],
    ["hy-swe-max", "Hy-SWE Max", "编码", "腾讯混元内部软件工程评测；来源未写 Verified 或版本号。", "higher"],
    ["hy-companybench", "Hy-CompanyBench", "编码", "腾讯混元内部企业代码库评测；来源未写版本号。", "higher"],
    ["apex-agent-pass1", "Apex-Agent · Pass@1", "Agent / 工作", "Apex-Agent 的 pass@1 口径。", "higher"],
    ["claweval-20260325-pass3", "Claw-Eval · 20260325 · Pass³", "Agent / 工作", "105 queries、内部 harness、Gemini 3.5 Flash judge；与 v1.1 分榜。", "higher"],
    ["wildclawbench-text-35", "WildClawBench · Text-only (35 tasks)", "Agent / 工作", "厂商复现的 35 道纯文本子集；不与当前官方 34-task 子榜混排。", "higher"],
    ["skillsbench-text-79", "SkillsBench · Text-only (79 tasks)", "Agent / 工作", "厂商复现的 79 道 self-contained 纯文本任务；不与 v1.1 87-task 榜单或 78-task 子集混排。", "higher"],
    ["hy-finmodelbench", "Hy-FinModelBench", "专业工作", "腾讯混元内部金融模型评测；来源未写版本号。", "higher"],
    ["prodbench-pass3", "ProdBench · Pass³", "Agent / 工作", "腾讯混元内部生产任务评测的三次全通过率。", "higher"],
    ["hy-skillsworld", "Hy-SkillsWorld", "Agent / 工作", "腾讯混元内部 Skills 环境评测。", "higher"],
    ["hy-euler-pro", "Hy-Euler Pro", "知识 / 推理", "腾讯混元内部数学/科学推理评测。", "higher"],
    ["hy-math", "Hy-Math", "知识 / 推理", "腾讯混元内部数学评测。", "higher"],
    ["phybench", "PHYBench", "科研", "物理学知识与推理评测。", "higher"],
    ["cmt-benchmark", "CMT-Benchmark", "科研", "复杂科学推理评测。", "higher"],
    ["cl-bench-life", "CL-Bench · Life", "知识 / 推理", "CL-Bench 生命科学子集。", "higher"],
    ["hy-expert-blind-average", "Hy Expert Blind Evaluation · Average", "专业工作", "270 位专家盲评的平均分，满分 4。", "higher"],
    ["hy-hallucination-rate", "Hy Internal Evaluation · Hallucination Rate", "事实性", "内部评测幻觉率，越低越好。", "lower"],
    ["hy-commonsense-error-rate", "Hy Internal Evaluation · Commonsense Error Rate", "事实性", "内部评测常识错误率，越低越好。", "lower"],
    ["hy-multiturn-issue-rate", "Hy Internal Evaluation · Multi-turn Issue Rate", "对话 / 指令", "内部评测多轮问题率，越低越好。", "lower"],
    ["cti-realm", "CTI-REALM", "Agent / 工作", "网络安全威胁情报 Agent 评测。", "higher"],
    ["autoresearch-bpb", "AutoResearch · Validation BPB", "科研", "最佳验证 bits-per-byte，越低越好。", "lower"],
    ["classical-kana-reading-order", "Classical Kana Reading Order · NED", "多模态", "古典日文页面读序预测 NED，越低越好。", "lower"]
  ].forEach(([id, name, category, description, direction]) => ensureBenchmark({ id, name, category, direction, description }));

  mergeFamily("xbench-deepsearch-family", "xbench-DeepSearch", [
    { benchmarkId: "xbench-deepsearch-2505", label: "2025.05" },
    { benchmarkId: "xbench-deepsearch-2510", label: "2025.10" }
  ]);
  mergeFamily("pinchbench-v2", "PinchBench", [{ benchmarkId: "pinchbench-unspecified", label: "Version / metric unspecified" }]);
  mergeFamily("claweval-family", "Claw-Eval", [
    { benchmarkId: "claweval-v1-1-unspecified", label: "v1.1 · Metric unspecified" },
    { benchmarkId: "claweval-20260325-pass3", label: "20260325 · Pass³" }
  ]);
  mergeFamily("wildclawbench", "WildClawBench", [{ benchmarkId: "wildclawbench-text-35", label: "Text-only · 35 tasks" }]);
  mergeFamily("skillsbench-1-1-family", "SkillsBench", [{ benchmarkId: "skillsbench-text-79", label: "Text-only · 79 tasks" }]);

  patchModel("trinity-large-preview", { releaseDate: "2026", modality: "language", modalityDetail: "文本 → 文本与工具调用", context: "512K", access: "开放权重 · OpenMDW-1.1 / API", sourceId: "arcee-trinity-preview-hf", referenceSourceIds: ["arcee-trinity-report"], summary: "398B total / 13B active；Model Card 舍入值与技术报告精确值并列保留。" });
  patchModel("trinity-large-thinking", { releaseDate: "2026", modality: "language", modalityDetail: "文本 → 文本、推理轨迹与工具调用", context: "512K", access: "开放权重 · OpenMDW-1.1 / API", sourceId: "arcee-trinity-thinking-hf", referenceSourceIds: ["arcee-trinity-report"], summary: "398B total / 13B active 的推理与 Agent 版本。" });
  patchModel("step-3-5-flash", { releaseDate: "2026-02", modality: "language", modalityDetail: "文本 → 文本与工具调用", context: "256K", access: "开放权重 · Apache-2.0 / API", sourceId: "step35-hf", referenceSourceIds: ["step35-github", "step35-blog", "step35-report", "step35-modelscope"], summary: "196B total / 11B active；PaCoRe、工具与消融口径分别保留。" });
  patchModel("step-3-7-flash", { releaseDate: "2026-09", modality: "vision", modalityDetail: "文本、图像 → 文本与工具调用", context: "256K", access: "开放权重 · Apache-2.0 / API", sourceId: "step37-hf", referenceSourceIds: ["step37-blog", "step37-github"], summary: "198B total / 约 11B active 的原生视觉语言 Agent 模型。" });
  patchModel("aion-3-0", { releaseDate: "2026-05-05", modality: "language", modalityDetail: "文本 → 文本与推理；多模型 GLM-family 系统", context: "128K", access: "闭源 API", referenceSourceIds: ["aion3-docs"], summary: "官方文档确认的 Aion 3.0 推理系统；官方页面未发布独立 benchmark 表，现有成绩仍仅来自 PinchBench。" }, false);
  patchModel("fugu-ultra", { releaseDate: "2026-06-22", modality: "vision", modalityDetail: "编排式系统：文本与图像任务由动态选择的 worker 模型处理 → 文本、代码与工具调用", context: "按 worker 与任务设置；主表 MRCR 评测至 128K", access: "研究预览", sourceId: "fugu-release", referenceSourceIds: ["fugu-report", "fugu-github"], summary: "Sakana AI 自适应多模型编排系统；不是单一基础权重。" });
  patchModel("mercury-2", { releaseDate: "2026", modality: "language", modalityDetail: "文本 → 文本、JSON 与原生工具调用", context: "128K", access: "闭源 API", sourceId: "mercury2-release", referenceSourceIds: ["mercury2-pinchbench", "mercury2-search", "mercury2-voice"], summary: "Inception Labs 扩散语言模型；不同 Search/PinchBench 评测口径分别保留。" });
  patchModel("agnes-2-0-flash", { vendorId: "agnes", vendor: "Agnes AI", releaseDate: "2026", modality: "vision", modalityDetail: "文本、公开图片 URL → 文本", context: "官方文档写 512K；GitHub 说明 2026 年 6 月回退为 256K", access: "闭源 API", sourceId: "agnes20-docs", referenceSourceIds: ["agnes-models-github"], summary: "两个官方页面的上下文长度冲突原样保留。" });
  patchModel("hy3", { releaseDate: "2026", modality: "language", modalityDetail: "文本 → 文本、代码与工具调用；295B total / 21B active", context: "256K", access: "开放权重 · Apache-2.0 / API", sourceId: "hy3-github", referenceSourceIds: ["hy3-research", "hy3-hf", "hy3-modelscope"], summary: "腾讯混元 295B/21B active MoE 语言模型；所有内部 benchmark 与 harness 口径按官方附录逐项保存。" });
  patchModel("grok-build-0-1", { referenceSourceIds: ["grok-build-github", "grok-build-docs"], summary: "PinchBench 的原始标签写作 Grok Build 0.1；xAI 一手资料确认 Grok Build 是编码 Agent/CLI，而非名为 0.1 的基础模型，因此不与其他 Grok 模型合并。" }, false);
  patchModel("ling-2-6-1t", { referenceSourceIds: ["inclusionai-official"], summary: "已核 InclusionAI 官方模型站：可确认的是 Ring-2.6-1T，未找到与 PinchBench 原始标签完全一致的 Ling-2.6-1T 一手模型页；保留原榜单身份，避免静默改名。" }, false);
  patchModel("intern-s2-preview-397b", { referenceSourceIds: ["internlm-official-org"], summary: "已核 InternLM 官方项目入口，未找到可独立确认 Intern-S2 Preview 397B 的发布页；不得与 Intern-S2-Mobius 35B 混并。" }, false);
  patchModel("mach-mind-4-pro", { summary: "Claw-Eval 的原始标签无法可靠对应到一手厂商发布页；厂商身份、版本与模态均保持待确认，不猜测归并。" }, false);

  addRows(["arcee-trinity-preview-hf"], "trinity-large-preview", [
    ["mmlu", 87.2], ["mmlu-pro", 75.2], ["gpqa-diamond", 63.3], ["aime-2025", 24.0]
  ], "Trinity-Large-Preview Model Card · rounded to one decimal");
  addRows(["arcee-trinity-report"], "trinity-large-preview", [
    ["mmlu", 87.21], ["mmlu-pro", 75.25], ["gpqa-diamond", 63.32], ["simpleqa", 23.92], ["aime-2025", 24.36]
  ], "Trinity technical report · Table 4 · exact reported precision");
  addRows(["arcee-trinity-thinking-hf"], "trinity-large-thinking", [
    ["ifbench", 52.3], ["gpqa-diamond", 76.3], ["tau2-airline", 88.0], ["tau2-telecom", 94.7],
    ["pinchbench-unspecified", 91.9, "%", "Model Card labels only ‘PinchBench’"], ["aime-2025", 96.3],
    ["bfcl-v4", 70.1, "%", "card row is misspelled ‘BCFLv4’"], ["mmlu-pro", 83.4],
    ["swe-bench-verified", 63.2, "%", "mini-swe-agent-v2"]
  ], "Trinity-Large-Thinking Model Card");

  const step35HeadlineSources = ["step35-hf", "step35-github", "step35-blog", "step35-modelscope", "step35-report"];
  addRows(step35HeadlineSources, "step-3-5-flash", [
    ["tau2-bench", 88.2], ["browsecomp", 51.6], ["browsecomp", 69.0, "%", "with Context Manager"],
    ["browsecomp-zh", 66.9], ["browsecomp-zh", 73.7, "%", "with Context Manager"],
    ["gaia", 84.5, "%", "no file"], ["xbench-deepsearch-2505", 83.7], ["xbench-deepsearch-2510", 56.3],
    ["researchrubrics", 65.3], ["aime-2025", 97.3], ["hmmt-2025-02", 98.4], ["hmmt-2025-11", 94.0],
    ["imoanswerbench", 85.4], ["livecodebench-v6", 86.4], ["swe-bench-verified", 74.4], ["terminal-bench-2-0", 51.0]
  ], "Step 3.5 Flash official headline table · vanilla");

  addRows(["step35-report"], "step-3-5-flash", [
    ["aime-2025", 99.9, "%", "PaCoRe"], ["hmmt-2025-02", 100.0, "%", "PaCoRe"],
    ["hmmt-2025-11", 97.8, "%", "PaCoRe"], ["imoanswerbench", 88.8, "%", "PaCoRe"],
    ["livecodebench-v6", 88.9, "%", "PaCoRe"], ["cf-div2-stepfun", 86.1, "%", "C++ · vanilla"],
    ["cf-div2-stepfun", 93.3, "%", "C++ · PaCoRe"], ["mmlu-pro", 84.4, "%", "vanilla"],
    ["mmlu-pro", 84.8, "%", "PaCoRe"], ["gpqa-diamond", 83.5, "%", "vanilla"],
    ["gpqa-diamond", 85.0, "%", "PaCoRe"], ["hle", 23.1, "%", "text-only · vanilla"],
    ["hle", 27.9, "%", "text-only · PaCoRe"], ["arena-hard-v2", 74.0, "%", "vanilla"],
    ["arena-hard-v2", 93.1, "%", "PaCoRe"], ["multichallenge", 55.7, "%", "vanilla"],
    ["multichallenge", 60.8, "%", "PaCoRe"], ["ifbench", 67.4, "%", "vanilla"],
    ["ifbench", 56.8, "%", "PaCoRe"], ["longbench-v2", 57.5, "%", "short + medium subsets · vanilla"],
    ["longbench-v2", 62.0, "%", "short + medium subsets · PaCoRe"],
    ["mrcr-v2-8needle", 28.8, "%", "8-needle · vanilla"], ["mrcr-v2-8needle", 26.3, "%", "8-needle · PaCoRe"],
    ["frames-oracle", 76.5, "%", "vanilla"], ["frames-oracle", 77.2, "%", "PaCoRe"],
    ["repoqa", 88.5, "%", "vanilla"], ["repoqa", 88.7, "%", "PaCoRe"]
  ], "Step 3.5 technical report · Table 5");
  addRows(["step35-report"], "step-3-5-flash", [
    ["browsecomp", 1.5, "%", "no-tools baseline"], ["browsecomp-tool-gain", 50.1, "pp", "tool gain"],
    ["browsecomp-zh", 25.0, "%", "no-tools baseline"], ["browsecomp-zh-tool-gain", 41.9, "pp", "tool gain"],
    ["gaia", 17.0, "%", "no-tools baseline"], ["gaia-tool-gain", 67.5, "pp", "tool gain"],
    ["xbench-deepsearch-2505", 26.0, "%", "no-tools baseline"], ["xbench-deepsearch-2505-tool-gain", 57.7, "pp", "tool gain"],
    ["xbench-deepsearch-2510", 11.3, "%", "no-tools baseline"], ["xbench-deepsearch-2510-tool-gain", 42.7, "pp", "tool gain"],
    ["step35-search-agent-tool-gain", 52.0, "pp", "mean across five search benchmarks"]
  ], "Step 3.5 technical report · Table 11 · 256K");
  addRows(["step35-report"], "step-3-5-flash", [
    ["aime-2025", 99.8, "%", "Python tool"], ["hmmt-2025-02", 98.7, "%", "Python tool"],
    ["hmmt-2025-11", 98.0, "%", "Python tool"], ["imoanswerbench", 86.7, "%", "Python tool"],
    ["gpqa-diamond", 84.4, "%", "Python tool"], ["hle", 26.5, "%", "text-only · Python tool"],
    ["arc-agi-1", 56.5, "%", "Python tool"], ["arc-agi-1", 54.8, "%", "vanilla"],
    ["gpqa-diamond", 85.7, "%", "Python tool + PaCoRe"], ["hle", 28.2, "%", "text-only · Python tool + PaCoRe"]
  ], "Step 3.5 technical report · Tables 12–13");
  addRows(["step35-report"], "step-3-5-flash", [
    ["cf-div2-stepfun", 86.1, "%", "C++ · accuracy avg@8"], ["cf-div2-stepfun", 81.5, "%", "Python · accuracy avg@8"],
    ["cf-div2-stepfun", 77.1, "%", "Java · accuracy avg@8"], ["codeforces-rating", 2489, "Rating", "CF-Div2-Stepfun · pass@8 rating"]
  ], "Step 3.5 technical report · Table 15");
  addRows(["step35-report"], "step-3-5-flash", [
    ["terminal-bench-2-0", 50.98, "%", "baseline · avg@8"], ["terminal-bench-2-0", 48.03, "%", "16K output · avg@8"],
    ["terminal-bench-2-0", 45.22, "%", "16K output without pruning · avg@8"],
    ["terminal-bench-2-0", 50.42, "%", "100 rounds · avg@8"], ["terminal-bench-2-0", 49.72, "%", "2-hour timeout · avg@8"]
  ], "Step 3.5 technical report · Table 16");
  addRows(["step35-report"], "step-3-5-flash", [
    ["browsecomp", 49.5, "%", "200-item subset · plain context · 86 real steps"],
    ["browsecomp", 57.0, "%", "200-item subset · summary · 131 real steps"],
    ["browsecomp", 58.0, "%", "200-item subset · keep-first-and-last-K · 244 real steps"],
    ["browsecomp", 66.0, "%", "200-item subset · discard-all · 302 real steps"],
    ["browsecomp", 68.5, "%", "200-item subset · multi-agent · 721 real steps"]
  ], "Step 3.5 technical report · Table 17");
  addRows(["step35-report"], "step-3-5-flash", [
    ["stepfun-data-analysis", 39.6, "%", "Claude Code · avg@3"],
    ["stepfun-data-analysis", 39.58, "%", "Claude Code · avg@3 · prose precision", "The report table rounds the same result to 39.6%; both official precisions are retained."],
    ["stepfun-consulting", 70.5, "%", "average"], ["stepfun-consulting", 73.3, "%", "usefulness"],
    ["stepfun-consulting", 62.1, "%", "logic"], ["stepfun-consulting", 72.4, "%", "tone"],
    ["stepfun-consulting", 74.2, "%", "instruction following"], ["androiddaily-hard", 57.0, "%", "Step 3.5 Flash + Step-GUI"]
  ], "Step 3.5 technical report · internal evaluations");

  const step37Card = ["step37-hf", "step37-github"];
  addRows(step37Card, "step-3-7-flash", [
    ["swe-bench-pro", 56.3], ["terminal-bench-2-1", 59.5],
    ["simplevqa-search", 79.2, "%", "with tool/search"], ["vstar-with-ci", 95.3, "%", "with Python"],
    ["gdpval-aa-score", 45.8, "%", "published percentage score; not Elo"], ["toolathlon", 49.5],
    ["claweval-v1-1-unspecified", 67.1, "%", "source does not identify metric/subset"],
    ["hle-tools", 48.1, "%", "with tools · prose value", "The same official page's figure labels 47.2; both are retained."],
    ["hle-tools", 47.2, "%", "with tools · figure value", "The same official page's prose states 48.1; both are retained."],
    ["gpqa-diamond", 77.81, "%", "avg@16 · NVFP4 + MTP"],
    ["gpqa-diamond", 78.41, "%", "avg@16 · NVFP4 · MTP disabled"]
  ], "Step 3.7 Flash official README/figure");

  const hy3Mirrors = ["hy3-github", "hy3-hf", "hy3-modelscope"];
  addRows(hy3Mirrors, "hy3", [
    ["swe-multilingual", 75.8], ["swe-bench-verified", 78.0], ["swe-bench-pro", 57.9],
    ["terminal-bench-2-1", 71.7, "%", "Terminus-2 · XML parser · 4-hour timeout · 500 episodes"],
    ["nl2repo", 45.6, "%", "Claude Code · 250 turns · 12,000s"], ["deepswe-unspecified", 28.0],
    ["hy-backend-2", 25.0], ["hy-swe-max", 49.0], ["hy-companybench", 41.7],
    ["browsecomp", 84.2], ["wide-search", 76.4], ["deepsearchqa", 91.0, "F1"],
    ["mcp-atlas", 79.1, "%", "public · Scale April 2026 methodology · 100 calls/task · 500 tasks"],
    ["toolathlon", 48.5], ["apex-agent-pass1", 25.6, "%", "pass@1"],
    ["claweval-20260325-pass3", 68.5, "%", "internal harness · 105 queries · Gemini 3.5 Flash judge"],
    ["wildclawbench-text-35", 53.6, "%", "OpenClaw · 35 text-only tasks"],
    ["skillsbench-text-79", 55.3, "%", "Claude Code · 79 text-only self-contained tasks · three-run average"],
    ["e-bench", 50.2, "%", "internal"], ["hy-finmodelbench", 69.0, "%", "internal"],
    ["prodbench-pass3", 23.0, "%", "internal · Pass³"], ["hy-skillsworld", 45.8],
    ["hle-tools", 53.2, "%", "text-only · with tools"], ["hy-euler-pro", 24.2, "%", "with tools"],
    ["gpqa-diamond", 90.4], ["hle", 37.0, "%", "text-only · no tools"],
    ["frontier-science-research", 21.3], ["frontier-science-olympiad", 74.8], ["usamo-2026", 72.0],
    ["matharena-apex", 38.7], ["arxivmath", 52.2], ["horizonmath", 7.1, "%", "pass@12"],
    ["hy-math", 60.9, "%", "internal"], ["phybench", 77.4], ["cmt-benchmark", 37.8],
    ["imoanswerbench", 90.0], ["superchem", 54.9], ["cl-bench", 23.8], ["cl-bench-life", 17.0],
    ["aa-lcr", 73.4], ["hy-expert-blind-average", 2.67, "/4", "270-expert blind evaluation"],
    ["hy-hallucination-rate", 5.4], ["hy-commonsense-error-rate", 12.7], ["hy-multiturn-issue-rate", 7.9]
  ], "Hy3 official Benchmark Appendix · highest reasoning tier unless noted");

  const fuguHeadline = [
    ["terminal-bench-2-1", 82.1], ["charxiv", 86.6, "%", "Reasoning"], ["gpqa-diamond", 95.5],
    ["livecodebench", 93.2], ["scicode", 58.7], ["swe-bench-pro", 73.7],
    ["hle", 50.0, "%", "text-only"], ["cti-realm", 69.4]
  ];
  addRows(["fugu-release", "fugu-github", "fugu-report"], "fugu-ultra", fuguHeadline, "Fugu official headline evaluation");
  addRows(["fugu-report"], "fugu-ultra", [
    ["autoresearch-bpb", 0.9774, "BPB", "mean best validation · ±0.0019"],
    ["autoresearch-bpb", 0.9748, "BPB", "best single seed"],
    ["classical-kana-reading-order", 0.776, "NED", "mean"]
  ], "Fugu technical report");

  addRows(["mercury2-pinchbench"], "mercury-2", [
    ["pinchbench-unspecified", 78.0, "%", "OpenClaw · success rate · version not stated"]
  ], "Mercury 2 official PinchBench evaluation");
  addRows(["mercury2-search"], "mercury-2", [
    ["frames-agent-score", 0.78, "Score", "n=100 · medium reasoning · Exa loop · 25 calls · GPT-5.4 judge"],
    ["deepsearchqa-ratio", 0.34, "F1", "n=100 · medium reasoning · Exa loop · 30 calls · Gemini 2.5 Flash judge"],
    ["wide-search-ratio", 0.923, "Score", "post-cutoff WideSearch"]
  ], "Mercury 2 official search evaluation");

  addRows(["agnes20-docs"], "agnes-2-0-flash", [
    ["claweval-pass3-unspecified", 60.9, "%", "general · Pass³ · exact version not stated"]
  ], "Agnes 2.0 Flash official documentation");

  targetComplete("arcee-trinity-preview-hf", ["trinity-large-preview"], "模型卡四个舍入目标值已完整录入；技术报告高精度值另存。");
  targetComplete("arcee-trinity-thinking-hf", ["trinity-large-thinking"], "模型卡九个公开目标结果全部录入；BCFLv4 原文拼写规范到 BFCL v4。");
  targetComplete("arcee-trinity-report", ["trinity-large-preview"], "技术报告 Table 4 的五个 Trinity Large Preview 目标值已逐格录入。");

  for (const sourceId of ["step35-hf", "step35-github", "step35-blog", "step35-modelscope"]) {
    targetComplete(sourceId, ["step-3-5-flash"], "官方发布表的 16 个 headline 目标值已完整录入并共享 provenance。");
  }
  targetComplete("step35-report", ["step-3-5-flash"], "技术报告的 headline、能力、工具增益、PaCoRe、消融、上下文管理与内部评测目标值已逐表录入。");
  for (const sourceId of step37Card) targetComplete(sourceId, ["step-3-7-flash"], "官方 README/卡的 11 个目标观测已录入；HLE prose 48.1 与 figure 47.2 并存。");
  metadataOnly("step37-blog", "发布身份与原生视觉定位已核；精确表由内容相同且可逐项核验的官方模型卡与仓库承载。");
  metadataOnly("aion3-docs", "确认 2026-05-05 发布、128K context、32K max output、reasoning 与 GLM-family 多模型系统；页面没有独立 benchmark 表。");

  for (const sourceId of ["fugu-release", "fugu-github"]) targetComplete(sourceId, ["fugu-ultra"], "八个 headline benchmark 目标值已全部录入。");
  targetComplete("fugu-report", ["fugu-ultra"], "八个 headline 结果及 AutoResearch 两个 BPB 口径和 Classical Kana Reading Order NED 已录入。");
  metadataOnly("mercury2-release", "发布页用于核对模型身份、扩散架构与 API 定位；独立成绩来自后续官方 PinchBench 与 Search 文章。");
  targetComplete("mercury2-pinchbench", ["mercury-2"], "唯一明确成绩为 OpenClaw 78% success rate；未声明版本，未并入 v2 best/average。");
  targetComplete("mercury2-search", ["mercury-2"], "FRAMES、DeepSearchQA 与 post-cutoff WideSearch 三个明确目标值和设置已录入。");
  upsertAudit("mercury2-voice", { status: "inaccessible", scopeLabel: "图表数值不可可靠读取", auditedAt: "2026-09-21", note: "正文确认 IFBench 与 Tau3 Telecom 评测，但精确 Mercury 数值仅存在于当前无法可靠转录的图表中；未依据柱高猜数。" });
  targetComplete("agnes20-docs", ["agnes-2-0-flash"], "唯一明确能力值 Claw-Eval general Pass³ 60.9% 已录入；文档未写版本，因此不并入 v1.1。");
  metadataOnly("agnes-models-github", "确认视觉输入能力，并说明 2026 年 6 月将 context 从文档所写 512K 回退为 256K；无独立成绩表。");
  for (const sourceId of hy3Mirrors) targetComplete(sourceId, ["hy3"], "官方 README/Appendix 的 44 个目标观测已逐项录入；各 task-count、版本和 harness 均保持独立 setting。");
  metadataOnly("hy3-research", "核对 295B/21B active、256K、语言模型定位与仓库入口；完整数值由官方 README/模型卡附录承载。");
  metadataOnly("grok-build-github", "官方仓库明确 Grok Build 是终端编码 Agent/CLI，而不是名为 0.1 的基础模型；无可归给该 PinchBench 标签的独立模型成绩表。");
  metadataOnly("grok-build-docs", "官方文档描述 Grok Build harness 与工具，没有确认 PinchBench 中 0.1 标签对应的底层模型版本。");
  metadataOnly("inclusionai-official", "官方模型站可确认 Ring-2.6-1T，而非 PinchBench 所写 Ling-2.6-1T；命名冲突未解决，未静默合并。");
  metadataOnly("internlm-official-org", "官方项目入口未找到 Intern-S2 Preview 397B 的独立发布页；明确排除名称相近但参数规模不同的 Intern-S2-Mobius 35B。");

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
