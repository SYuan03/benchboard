(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const patchModel = (id, patch) => {
    const model = models.find((item) => item.id === id);
    if (!model) return;
    Object.assign(model, patch);
    if (patch.referenceSourceIds) {
      model.referenceSourceIds = [...new Set([...(model.referenceSourceIds || []), ...patch.referenceSourceIds])];
    }
    if (patch.scoreStatus === undefined) delete model.scoreStatus;
  };
  const ensureBenchmark = (row) => {
    const existing = benchmarks.find((item) => item.id === row.id);
    if (existing) Object.assign(existing, row);
    else benchmarks.push(row);
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
    observations.push({
      id: `o${observations.length + 1}`,
      sourceIds: normalizedSources,
      benchmarkId,
      modelId,
      value,
      unit,
      setting,
      note
    });
  };
  const addRows = (sourceIds, modelId, rows, common = "") => rows.forEach((row) => {
    const [benchmarkId, value, unit = "%", detail = "", note = ""] = row;
    add(sourceIds, benchmarkId, modelId, value, unit, [common, detail].filter(Boolean).join(" · "), note);
  });
  const sourceTarget = (sourceId, modelId) => {
    const rows = observations.filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId));
    return {
      modelId,
      expectedObservationCount: rows.length,
      benchmarkIds: [...new Set(rows.map((item) => item.benchmarkId))]
    };
  };
  const targetComplete = (sourceId, modelIds, note) => upsertAudit(sourceId, {
    status: "target-complete",
    scopeLabel: "目标模型列已核",
    auditedAt: "2026-09-20",
    targetModels: modelIds.map((modelId) => sourceTarget(sourceId, modelId)),
    note
  });

  appendUnique(sources, [
    { id: "qwen36-plus-blog", vendorId: "alibaba", publisher: "Alibaba Qwen", date: "2026-04-02", tier: "official", title: "Qwen3.6-Plus: Towards Real World Agents", url: "https://qwen.ai/blog?id=qwen3.6" },
    { id: "qwen36-27b-blog", vendorId: "alibaba", publisher: "Alibaba Qwen", date: "2026-04-22", tier: "official", title: "Qwen3.6-27B: Flagship-Level Coding in a 27B Dense Model", url: "https://qwen.ai/blog?id=qwen3.6-27b" },
    { id: "qwen36-27b-hf", vendorId: "alibaba", publisher: "Alibaba Qwen", date: "2026-04-21", tier: "official", title: "Qwen3.6-27B — Official Model Card", url: "https://huggingface.co/Qwen/Qwen3.6-27B" },
    { id: "qwen36-27b-modelscope", vendorId: "alibaba", publisher: "Alibaba Qwen", date: "2026-04-21", tier: "official", title: "Qwen3.6-27B — Official ModelScope Card", url: "https://modelscope.cn/models/Qwen/Qwen3.6-27B" },
    { id: "qwen36-35b-blog", vendorId: "alibaba", publisher: "Alibaba Qwen", date: "2026-04-15", tier: "official", title: "Qwen3.6-35B-A3B: Agentic Coding Power, Now Open to All", url: "https://qwen.ai/blog?id=qwen3.6-35b-a3b" },
    { id: "qwen36-35b-hf", vendorId: "alibaba", publisher: "Alibaba Qwen", date: "2026-04-15", tier: "official", title: "Qwen3.6-35B-A3B — Official Model Card", url: "https://huggingface.co/Qwen/Qwen3.6-35B-A3B" },
    { id: "qwen36-35b-modelscope", vendorId: "alibaba", publisher: "Alibaba Qwen", date: "2026-04-15", tier: "official", title: "Qwen3.6-35B-A3B — Official ModelScope Card", url: "https://modelscope.cn/models/Qwen/Qwen3.6-35B-A3B" },
    { id: "qwen-api-platform", vendorId: "alibaba", publisher: "Alibaba Qwen", date: "2026-09-20", tier: "official", title: "Qwen API Platform — Model Catalog", url: "https://qwen.ai/apiplatform" },

    { id: "deepseek-v32-hf", vendorId: "deepseek", publisher: "DeepSeek", date: "2025-12-01", tier: "official", title: "DeepSeek-V3.2 — Official Model Card", url: "https://huggingface.co/deepseek-ai/DeepSeek-V3.2" },
    { id: "deepseek-v32-report", vendorId: "deepseek", publisher: "DeepSeek", date: "2025-12-01", tier: "official", title: "DeepSeek-V3.2 Technical Report", url: "https://huggingface.co/deepseek-ai/DeepSeek-V3.2/blob/main/assets/paper.pdf" },
    { id: "deepseek-v32-launch", vendorId: "deepseek", publisher: "DeepSeek", date: "2025-12-01", tier: "official", title: "DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models", url: "https://www.deepseek.com/en/news/deepseek-v3-2/" },
    { id: "deepseek-v4-preview", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-04-24", tier: "official", title: "DeepSeek-V4 Preview: Entering the Era of Affordable Million-Token Context", url: "https://www.deepseek.com/en/news/v4-preview/" },
    { id: "deepseek-v4-flash-hf", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-04-24", tier: "official", title: "DeepSeek-V4-Flash — Official Model Card", url: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash" },
    { id: "deepseek-v4-flash-modelscope", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-04-24", tier: "official", title: "DeepSeek-V4-Flash — Official ModelScope Card", url: "https://modelscope.cn/models/deepseek-ai/DeepSeek-V4-Flash" },
    { id: "deepseek-api-changelog", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-09-10", tier: "official", title: "DeepSeek API Change Log", url: "https://api-docs.deepseek.com/updates/" },

    { id: "zai-glm5-blog", vendorId: "zai", publisher: "Z.ai", date: "2026-02-12", tier: "official", title: "GLM-5: From Vibe Coding to Agentic Engineering", url: "https://z.ai/blog/glm-5" },
    { id: "zai-glm5-hf", vendorId: "zai", publisher: "Z.ai", date: "2026-02-11", tier: "official", title: "GLM-5 — Official Model Card", url: "https://huggingface.co/zai-org/GLM-5" },
    { id: "zai-glm5-modelscope", vendorId: "zai", publisher: "Z.ai", date: "2026-02-12", tier: "official", title: "GLM-5 — Official ModelScope Card", url: "https://modelscope.cn/models/ZhipuAI/GLM-5" },
    { id: "zai-glm5-docs", vendorId: "zai", publisher: "Z.ai", date: "2026-02-12", tier: "official", title: "GLM-5 — Official API Documentation", url: "https://docs.z.ai/guides/llm/glm-5" },
    { id: "zai-glm51-blog", vendorId: "zai", publisher: "Z.ai", date: "2026-04-07", tier: "official", title: "GLM-5.1: Towards Long-Horizon Tasks", url: "https://z.ai/blog/glm-5.1" },
    { id: "zai-glm51-hf", vendorId: "zai", publisher: "Z.ai", date: "2026-04-03", tier: "official", title: "GLM-5.1 — Official Model Card", url: "https://huggingface.co/zai-org/GLM-5.1" },
    { id: "zai-glm51-modelscope", vendorId: "zai", publisher: "Z.ai", date: "2026-04-07", tier: "official", title: "GLM-5.1 — Official ModelScope Card", url: "https://modelscope.cn/models/ZhipuAI/GLM-5.1" },
    { id: "zai-glm51-docs", vendorId: "zai", publisher: "Z.ai", date: "2026-04-07", tier: "official", title: "GLM-5.1 — Official API Documentation", url: "https://docs.z.ai/guides/llm/glm-5.1" },
    { id: "zai-glm5-turbo-docs", vendorId: "zai", publisher: "Z.ai", date: "2026", tier: "official", title: "GLM-5-Turbo — Official API Documentation", url: "https://docs.z.ai/guides/llm/glm-5-turbo" },
    { id: "zai-glm5v-turbo-docs", vendorId: "zai", publisher: "Z.ai", date: "2026", tier: "official", title: "GLM-5V-Turbo — Official API Documentation", url: "https://docs.z.ai/guides/vlm/glm-5v-turbo" },

    { id: "kimi-k26-blog", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-04-20", tier: "official", title: "Kimi K2.6: Advancing Open-Source Coding", url: "https://www.kimi.com/en/blog/kimi-k2-6" },
    { id: "kimi-k26-hf", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-04-20", tier: "official", title: "Kimi K2.6 — Official Model Card", url: "https://huggingface.co/moonshotai/Kimi-K2.6" },
    { id: "kimi-k26-model-page", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026", tier: "official", title: "Kimi K2.6 — Official Model Page", url: "https://www.kimi.com/ai-models/kimi-k2-6" },
    { id: "kimi-k26-api", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026", tier: "official", title: "Kimi K2.6 — Official API Guide", url: "https://platform.kimi.com/docs/guide/kimi-k2-6-quickstart" },
    { id: "kimi-k26-modelscope", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-04-20", tier: "official", title: "Kimi K2.6 — Official ModelScope Card", url: "https://modelscope.cn/models/moonshotai/Kimi-K2.6" },
    { id: "kimi-k27-code-resource", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-09-14", tier: "official", title: "Kimi K2.7 Code: Open-Source Agentic Coding Model", url: "https://www.kimi.com/resources/kimi-k2-7-code" },
    { id: "kimi-k27-code-hf", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-06-12", tier: "official", title: "Kimi K2.7 Code — Official Model Card", url: "https://huggingface.co/moonshotai/Kimi-K2.7-Code" },
    { id: "kimi-k27-code-modelscope", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-06-12", tier: "official", title: "Kimi K2.7 Code — Official ModelScope Card", url: "https://modelscope.cn/models/moonshotai/Kimi-K2.7-Code" },
    { id: "kimi-k27-code-api", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026", tier: "official", title: "Kimi K2.7 Code — Official API Guide", url: "https://platform.kimi.com/docs/guide/kimi-k2-7-code-quickstart" },

    { id: "xai-grok420-docs", vendorId: "xai", publisher: "SpaceXAI", date: "2026-03-10", tier: "official", title: "Grok 4.20 — Official Model Documentation", url: "https://docs.x.ai/developers/models/grok-4.20" },
    { id: "xai-grok43-docs", vendorId: "xai", publisher: "SpaceXAI", date: "2026", tier: "official", title: "Grok 4.3 — Official Model Documentation", url: "https://docs.x.ai/developers/models/grok-4.3" },
    { id: "xai-release-notes", vendorId: "xai", publisher: "SpaceXAI", date: "2026", tier: "official", title: "SpaceXAI API Release Notes", url: "https://docs.x.ai/developers/release-notes" }
  ]);

  [
    ["qwenwebbench", "QwenWebBench", "编码", "Qwen 内部前端代码生成评测；BT/Elo。"],
    ["claweval-average", "Claw-Eval · Average", "Agent / 工作", "Claw-Eval 平均分；与 Pass³ 分开。"],
    ["tau3-bench", "TAU3-Bench", "Agent / 工作", "TAU3-Bench 总体结果；具体 user model 与检索设置写入 setting。"],
    ["tir-bench-with-ci", "TIR-Bench · With CI", "多模态", "TIR-Bench 使用 CI 的口径。"],
    ["tir-bench-without-ci", "TIR-Bench · Without CI", "多模态", "TIR-Bench 不使用 CI 的口径。"],
    ["corpusqa-1m", "CorpusQA · 1M", "长上下文", "DeepSeek V4 1M 长上下文评测。"],
    ["apex-shortlist", "Apex Shortlist", "知识 / 推理", "Apex shortlist 子集。"],
    ["chinese-simpleqa", "Chinese SimpleQA", "知识 / 推理", "中文事实问答；按来源保留 Verified、采样与判分设置。"],
    ["mrcr-1m-mmr", "MRCR · 1M · MMR", "长上下文", "DeepSeek V4 表中的 MRCR 1M MMR 口径；不与 OpenAI MRCR v2 pointwise 混排。"]
  ].forEach(([id, name, category, description]) => ensureBenchmark({ id, name, category, direction: "higher", description }));

  patchModel("qwen3-6-plus", {
    releaseDate: "2026-04-02", modality: "vision",
    modalityDetail: "文本、图像、视频 → 文本与工具调用",
    context: "1M", access: "闭源 API", sourceId: "qwen36-plus-blog",
    referenceSourceIds: ["qwen-api-platform"],
    summary: "面向真实世界 Agent 的原生多模态旗舰；官方发布表同时覆盖文本、视觉、视频和视觉 Agent。"
  });
  patchModel("qwen3-6-27b", {
    releaseDate: "2026-04-22", modality: "vision",
    modalityDetail: "文本、图像、视频 → 文本与工具调用",
    context: "131,072", access: "开放权重 · Apache-2.0 / API", sourceId: "qwen36-27b-blog",
    referenceSourceIds: ["qwen36-27b-hf", "qwen36-27b-modelscope"],
    summary: "27B 稠密原生多模态模型，支持思考与非思考模式。"
  });
  patchModel("qwen3-6-flash", {
    releaseDate: "2026-04-15", modality: "vision",
    modalityDetail: "文本、图像、视频 → 文本与工具调用；Qwen3.6-35B-A3B 的托管 API 名",
    context: "262,144 原生；可扩至 1,010,000", access: "开放权重 · Apache-2.0 / API", sourceId: "qwen36-35b-blog",
    referenceSourceIds: ["qwen36-35b-hf", "qwen36-35b-modelscope", "qwen-api-platform"],
    aliases: [...new Set([...(models.find((item) => item.id === "qwen3-6-flash")?.aliases || []), "Qwen3.6-35B-A3B", "qwen3.6-flash"])],
    summary: "Qwen3.6-35B-A3B（35B total / 3B active）的托管 Flash 名称；不把 27B 或 Plus 成绩混入。"
  });

  patchModel("deepseek-v3-2", {
    releaseDate: "2025-12-01", modality: "language", modalityDetail: "文本 → 文本与工具调用",
    context: "未在模型卡摘要中单独声明", access: "开放权重 · MIT / API", sourceId: "deepseek-v32-launch",
    referenceSourceIds: ["deepseek-v32-hf", "deepseek-v32-report"],
    summary: "DeepSeek-V3.2 基础发布模型；Thinking 是同一模型的推理模式，不是另一套权重。"
  });
  patchModel("deepseek-v3-2-thinking", {
    releaseDate: "2025-12-01", modality: "language", modalityDetail: "文本 → 文本与工具调用",
    context: "未在模型卡摘要中单独声明", access: "开放权重 · MIT / API", sourceId: "deepseek-v32-hf",
    referenceSourceIds: ["deepseek-v32-report", "deepseek-v32-launch"],
    summary: "DeepSeek-V3.2 的 Thinking 评测模式；单独保留是为了不把推理模式和非思考结果混排。"
  });
  patchModel("deepseek-v4-flash", {
    releaseDate: "2026-04-24", modality: "language", modalityDetail: "文本 → 文本与工具调用",
    context: "1M", access: "开放权重 · MIT / API（API 名已在 2026-09-10 路由至 V4.1 Flash）", sourceId: "deepseek-v4-preview",
    referenceSourceIds: ["deepseek-v4-flash-hf", "deepseek-v4-flash-modelscope", "deepseek-v4-report", "deepseek-api-changelog"],
    summary: "284B total / 13B active 的 V4 文本模型；Non-Think、High、Max 分数按 setting 分开。"
  });

  patchModel("glm-5", {
    releaseDate: "2026-02-12", modality: "language", modalityDetail: "文本 → 文本与工具调用",
    context: "200K", access: "开放权重 · MIT / API", sourceId: "zai-glm5-blog",
    referenceSourceIds: ["zai-glm5-hf", "zai-glm5-modelscope", "zai-glm5-github", "zai-glm5-report", "zai-glm5-docs"],
    summary: "744B/40B active 的 Agentic Engineering 旗舰。"
  });
  patchModel("glm-5-1", {
    releaseDate: "2026-04-07", modality: "language", modalityDetail: "文本 → 文本与工具调用",
    context: "200K", access: "开放权重 · MIT / API", sourceId: "zai-glm51-blog",
    referenceSourceIds: ["zai-glm51-hf", "zai-glm51-modelscope", "zai-glm5-github", "zai-glm5-report", "zai-glm51-docs"],
    summary: "面向 8 小时长程任务的 GLM-5 后续版本。"
  });
  patchModel("glm-5-turbo", {
    releaseDate: "2026", modality: "language", modalityDetail: "文本 → 文本与工具调用",
    context: "200K", access: "闭源 API", sourceId: "zai-glm5-turbo-docs",
    scoreStatus: "comparison-only",
    summary: "为 OpenClaw 长链任务优化的纯文本模型；官方页面公开 ZClawBench 图，但没有 HTML 数值表。"
  });
  patchModel("glm-5v-turbo", {
    releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、视频、文件 → 文本与工具调用",
    context: "200K", access: "闭源 API", sourceId: "zai-glm5v-turbo-docs",
    scoreStatus: "comparison-only",
    summary: "Z.ai 首个多模态编码基础模型，面向 Claude Code 与 OpenClaw 工作流。"
  });

  patchModel("kimi-k2-6", {
    releaseDate: "2026-04-20", modality: "vision",
    modalityDetail: "文本、图像、视频 → 文本与工具调用；官方 API 的视频输入仍标为实验性",
    context: "262,144", access: "开放权重 · Modified MIT / API", sourceId: "kimi-k26-hf",
    referenceSourceIds: ["kimi-k26-blog", "kimi-k26-model-page", "kimi-k26-api", "kimi-k26-modelscope", "kimi-k27-code-resource", "kimi-k27-code-hf"],
    summary: "1T total / 32B active 的原生多模态 Agent 模型；支持 Thinking、Instant 与多步工具调用。"
  });
  patchModel("kimi-k2-7-code", {
    releaseDate: "2026-06-12", modality: "vision",
    modalityDetail: "文本、图像、视频 → 文本与工具调用；仅支持 Thinking，强制 preserve_thinking",
    context: "262,144", access: "开放权重 · Modified MIT / API", sourceId: "kimi-k27-code-hf",
    referenceSourceIds: ["kimi-k27-code-resource", "kimi-k27-code-modelscope", "kimi-k27-code-api"],
    summary: "基于 K2.6 的原生多模态编码 Agent 模型；1T total / 32B active，官方称思考 token 约减少 30%。"
  });
  patchModel("grok-4-20", {
    releaseDate: "2026-03-10", modality: "vision", modalityDetail: "文本、图像 → 文本与工具调用",
    context: "1,000,000", access: "闭源 API", sourceId: "xai-grok420-docs",
    referenceSourceIds: ["xai-release-notes"],
    scoreStatus: "comparison-only",
    summary: "SpaceXAI 的 1M 上下文视觉语言模型，支持 reasoning、函数调用与结构化输出。"
  });
  patchModel("grok-4-20-beta", {
    releaseDate: "2026-03", modality: "vision", modalityDetail: "文本、图像 → 文本与工具调用",
    context: "1,000,000", access: "闭源 API beta alias", sourceId: "xai-grok420-docs",
    referenceSourceIds: ["xai-release-notes"],
    scoreStatus: "comparison-only",
    summary: "Grok 4.20 官方文档仍列出的 beta alias；与正式 Grok 4.20 的第三方榜单结果分开保存。"
  });
  patchModel("grok-4-3", {
    modality: "vision", modalityDetail: "文本、图像 → 文本与工具调用",
    context: "1,000,000", access: "闭源 API", sourceId: "xai-grok43-docs",
    referenceSourceIds: ["xai-release-notes"],
    scoreStatus: "comparison-only",
    summary: "支持 none/low/medium/high/xhigh reasoning effort、函数调用与结构化输出的视觉语言模型。"
  });

  [
    ["claweval-pass3", "Claw-Eval · Pass³", "Agent / 工作", "Claw-Eval 三次运行全部通过率；与平均分分开。"],
    ["skillsbench-self-contained", "SkillsBench · Self-contained subset", "Agent / 工作", "厂商复现的 78-task self-contained 子集；不得与 SkillsBench 1.1 官方 87-task 榜单混排。"],
    ["qwenclawbench-unspecified", "QwenClawBench · Version Unspecified", "Agent / 工作", "Qwen 发布时的内部版本；未声明与后续 v1.1 完全相同。"],
    ["vlms-are-blind", "VLMsAreBlind", "多模态", "视觉空间关系与物体计数评测。"]
  ].forEach(([id, name, category, description]) => ensureBenchmark({ id, name, category, direction: "higher", description }));

  [
    ["kimi-code-bench-unspecified", "Kimi Code Bench · Version Unspecified", "编码", "Kimi K2.6 2026-04-20 博客图中的内部版本；不与后续 Kimi Code Bench v2 混排。"],
    ["kimi-design-bench-preference", "Kimi Design Bench · Preference Share", "多模态", "Kimi K2.6 Agent 与 Google AI Studio 的两两偏好份额；对手与 harness 写入 setting。"],
    ["kimi-claw-bench-unspecified", "Kimi Claw Bench · Version Unspecified", "Agent / 工作", "Kimi K2.6 发布博客图中的内部 Claw Bench；不与 Kimi Claw 24/7 Bench 混排。"],
    ["mcpmark", "MCPMark", "Agent / 工作", "MCP 工具使用评测；不自动等同于后续 human-verified 版本。"],
    ["ojbench-python", "OJBench · Python", "编码", "OJBench Python 口径。"],
    ["program-bench", "Program Bench", "编码", "从可执行文件和文档重建程序行为的 200-task Agent 评测。"],
    ["kimi-claw-24-7-bench", "Kimi Claw 24/7 Bench", "Agent / 工作", "Moonshot 内部多日持续 Agent 评测：17 个场景、610 个检查点、OpenClaw harness。"]
  ].forEach(([id, name, category, description]) => ensureBenchmark({ id, name, category, direction: "higher", description }));

  const q36Agent = "Qwen official release table · thinking mode unless benchmark requires otherwise";
  const q36Plus = ["qwen36-plus-blog"];
  addRows(q36Plus, "qwen3-6-plus", [
    ["swe-bench-verified", 78.8, "%", "internal bash + file-edit scaffold · 200K · temp 1.0 · top_p .95"],
    ["swe-multilingual", 73.8, "%", "internal bash + file-edit scaffold · 200K · temp 1.0 · top_p .95"],
    ["swe-bench-pro", 56.6, "%", "refined public set · internal bash + file-edit scaffold · 200K"],
    ["terminal-bench-2-0", 61.6, "%", "Harbor/Terminus-2 · 3h · 32 CPU/48GB · 256K · five-run mean"],
    ["claweval-average", 74.8, "%", "temp .6 · 256K"],
    ["claweval-pass3", 58.7, "%", "temp .6 · 256K"],
    ["skillsbench-self-contained", 45.7, "%", "OpenCode · 78 self-contained tasks · five-run average"],
    ["qwenclawbench-unspecified", 57.2, "%", "internal pre-release set · temp .6 · 256K"],
    ["nl2repo", 37.9, "%", "Claude Code · temp 1.0 · top_p .95 · max_turns 900"],
    ["qwenwebbench", 1501.7, "Elo", "internal bilingual front-end benchmark · auto-render + multimodal judge"],
    ["tau3-bench", 70.7, "%", "official user model GPT-5.2 low · default BM25 retrieval"],
    ["vita-bench", 44.3, "%", "average subdomain score · Claude Sonnet 4 judge"],
    ["deep-planning", 41.5],
    ["tool-decathlon", 39.8],
    ["mcp-mark", 48.2, "%", "GitHub MCP v0.30.3 · Playwright responses truncated at 32K"],
    ["mcp-atlas", 74.1, "%", "public set · Gemini 2.5 Pro judge"],
    ["hle-tools", 50.6, "%", "256K · context folding"],
    ["wide-search", 74.3, "%", "256K · context management"],
    ["mmlu-pro", 88.5], ["mmlu-redux", 94.5], ["supergpqa", 71.6], ["c-eval", 93.3],
    ["ifeval", 94.3, "%", "strict prompt"], ["ifbench", 74.2], ["aa-lcr", 68.3], ["longbench-v2", 62.0],
    ["gpqa-diamond", 90.4], ["hle", 28.8], ["livecodebench-v6", 87.1],
    ["hmmt-2025-02", 96.7], ["hmmt-2025-11", 94.6], ["hmmt-2026-02", 87.8],
    ["imoanswerbench", 83.8], ["aime-2026", 95.3, "%", "full AIME 2026 I + II"],
    ["mmmlu", 89.5], ["mmlu-prox", 84.7, "%", "29-language average"], ["nova-63", 57.9],
    ["include", 85.1], ["global-piqa", 89.8], ["polymath", 77.4], ["wmt24pp", 84.3, "%", "55-language XCOMET-XXL average"], ["maxife", 88.2],
    ["mmmu", 86.0], ["mmmu-pro", 78.8], ["mathvision", 88.0], ["we-math", 89.0], ["dynamath", 88.0],
    ["realworldqa", 85.4], ["mmstar", 83.3], ["simplevqa", 67.3], ["omnidocbench-1-5-score", 91.2],
    ["charxiv-rq", 81.5], ["mmlongbench-doc", 62.0], ["cc-ocr", 83.4], ["ai2d-test", 94.4],
    ["countbench", 97.6], ["refcoco-avg", 93.5], ["odinw13", 51.8], ["erqa", 65.7],
    ["vstar-with-ci", 96.9, "%", "with CI"], ["vstar-without-ci", 90.5, "%", "without CI"],
    ["videomme", 87.8, "%", "with subtitles"], ["videomme", 84.2, "%", "without subtitles"],
    ["videommmu", 84.0], ["mlvu-m-avg", 86.7], ["screenspot-pro", 68.2],
    ["tir-bench-with-ci", 61.6], ["tir-bench-without-ci", 43.7], ["osworld-verified", 62.5]
  ], q36Agent);

  const q36Dense = ["qwen36-27b-blog"];
  addRows(q36Dense, "qwen3-6-27b", [
    ["swe-bench-verified", 77.2, "%", "internal bash + file-edit scaffold · 200K"],
    ["swe-bench-pro", 53.5, "%", "refined public set · internal scaffold · 200K"],
    ["swe-multilingual", 71.3, "%", "internal scaffold · 200K"],
    ["terminal-bench-2-0", 59.3, "%", "Harbor/Terminus-2 · 3h · 32 CPU/48GB · 256K · five-run mean"],
    ["skillsbench-self-contained", 48.2, "%", "OpenCode · 78 self-contained tasks · five-run average"],
    ["qwenwebbench", 1487, "Elo", "internal bilingual front-end benchmark · auto-render + multimodal judge"],
    ["nl2repo", 36.2, "%", "Claude Code · temp 1.0 · top_p .95 · max_turns 900"],
    ["claweval-average", 72.4, "%", "temp .6 · 256K"], ["claweval-pass3", 60.6, "%", "temp .6 · 256K"],
    ["qwenclawbench-unspecified", 53.4, "%", "internal pre-release set · temp .6 · 256K"],
    ["mmlu-pro", 86.2], ["mmlu-redux", 93.5], ["supergpqa", 66.0], ["c-eval", 91.4],
    ["gpqa-diamond", 87.8], ["hle", 24.0], ["livecodebench-v6", 83.9],
    ["hmmt-2025-02", 93.8], ["hmmt-2025-11", 90.7], ["hmmt-2026-02", 84.3],
    ["imoanswerbench", 80.8], ["aime-2026", 94.1, "%", "full AIME 2026 I + II"],
    ["mmmu", 82.9], ["mmmu-pro", 75.8], ["mathvista-mini", 87.4], ["dynamath", 85.6], ["vlms-are-blind", 97.0],
    ["realworldqa", 84.1], ["mmstar", 81.4], ["mmbench-en-dev-v1-1", 92.3, "%", "DEV v1.1"], ["simplevqa", 56.1],
    ["charxiv-rq", 78.4], ["cc-ocr", 81.2], ["ocrbench", 89.4], ["erqa", 62.5], ["countbench", 97.8],
    ["refcoco-avg", 92.5], ["embspatialbench", 84.6], ["refspatialbench", 70.0],
    ["videomme", 87.7, "%", "with subtitles"], ["videommmu", 84.4], ["mlvu-m-avg", 86.6], ["mvbench", 75.5],
    ["vstar-without-ci", 94.7, "%", "official table does not label CI for this row"], ["androidworld", 70.3]
  ], q36Agent);

  const q36FlashSources = ["qwen36-35b-hf"];
  addRows(q36FlashSources, "qwen3-6-flash", [
    ["swe-bench-verified", 73.4], ["swe-multilingual", 67.2], ["swe-bench-pro", 49.5],
    ["terminal-bench-2-0", 51.5], ["claweval-average", 68.7], ["claweval-pass3", 50.0],
    ["skillsbench-self-contained", 28.7], ["qwenclawbench-unspecified", 52.6], ["nl2repo", 29.4], ["qwenwebbench", 1397, "Elo"],
    ["tau3-bench", 67.2], ["vita-bench", 35.6], ["deep-planning", 25.9], ["tool-decathlon", 26.9],
    ["mcp-mark", 37.0], ["mcp-atlas", 62.8], ["wide-search", 60.1],
    ["mmlu-pro", 85.2], ["mmlu-redux", 93.3], ["supergpqa", 64.7], ["c-eval", 90.0],
    ["gpqa-diamond", 86.0], ["hle", 21.4], ["livecodebench-v6", 80.4], ["hmmt-2025-02", 90.7],
    ["hmmt-2025-11", 89.1], ["hmmt-2026-02", 83.6], ["imoanswerbench", 78.9], ["aime-2026", 92.7],
    ["mmmu", 81.7], ["mmmu-pro", 75.3], ["mathvista-mini", 86.4], ["zerobench-sub", 34.4],
    ["realworldqa", 85.3], ["mmbench-en-dev-v1-1", 92.8, "%", "DEV v1.1"], ["simplevqa", 58.9], ["hallusionbench", 69.8],
    ["omnidocbench-1-5-score", 89.9], ["charxiv-rq", 78.0], ["cc-ocr", 81.9], ["ai2d-test", 92.7],
    ["refcoco-avg", 92.0], ["odinw13", 50.8], ["embspatialbench", 84.3], ["refspatialbench", 64.3],
    ["videomme", 86.6, "%", "with subtitles"], ["videomme", 82.5, "%", "without subtitles"],
    ["videommmu", 83.7], ["mlvu-m-avg", 86.2], ["mvbench", 74.6], ["lvbench", 71.4]
  ], "Qwen3.6-35B-A3B official model card · hosted API name Qwen3.6-Flash");

  const ds32Sources = ["deepseek-v32-hf", "deepseek-v32-report"];
  addRows(ds32Sources, "deepseek-v3-2-thinking", [
    ["aime-2025", 93.1],
    ["hmmt-2025-11", 90.2],
    ["hle", 25.1],
    ["codeforces-rating", 2386, "Rating"],
    ["swe-bench-verified", 73.1],
    ["terminal-bench-2-0", 46.4, "%", "Claude Code"],
    ["tau2-bench", 80.3],
    ["tool-decathlon", 35.2]
  ], "DeepSeek-V3.2 official release evaluation · Thinking mode");

  const ds4Sources = ["deepseek-v4-flash-hf", "deepseek-v4-report"];
  const ds4Modes = [
    ["Non-Think", [
      ["mmlu-pro", 83.0], ["simpleqa-verified", 23.1], ["chinese-simpleqa", 71.5],
      ["gpqa-diamond", 71.2], ["hle", 8.1], ["livecodebench", 55.2],
      ["hmmt-2026-02", 40.8], ["imoanswerbench", 41.9], ["apex", 1.0],
      ["apex-shortlist", 9.3], ["mrcr-1m-mmr", 37.5], ["corpusqa-1m", 15.5],
      ["terminal-bench-2-0", 49.1], ["swe-bench-verified", 73.7],
      ["swe-bench-pro", 49.1], ["swe-multilingual", 69.7],
      ["mcp-atlas", 64.0], ["toolathlon", 40.7]
    ]],
    ["Think High", [
      ["mmlu-pro", 86.4], ["simpleqa-verified", 28.9], ["chinese-simpleqa", 73.2],
      ["gpqa-diamond", 87.4], ["hle", 29.4], ["livecodebench", 88.4],
      ["codeforces-rating", 2816, "Rating"], ["hmmt-2026-02", 91.9],
      ["imoanswerbench", 85.1], ["apex", 19.1], ["apex-shortlist", 72.1],
      ["mrcr-1m-mmr", 76.9], ["corpusqa-1m", 59.3], ["terminal-bench-2-0", 56.6],
      ["swe-bench-verified", 78.6], ["swe-bench-pro", 52.3], ["swe-multilingual", 70.2],
      ["browsecomp", 53.5], ["hle-tools", 40.3], ["mcp-atlas", 67.4], ["toolathlon", 43.5]
    ]],
    ["Think Max", [
      ["mmlu-pro", 86.2], ["simpleqa-verified", 34.1], ["chinese-simpleqa", 78.9],
      ["gpqa-diamond", 88.1], ["hle", 34.8], ["livecodebench", 91.6],
      ["codeforces-rating", 3052, "Rating"], ["hmmt-2026-02", 94.8],
      ["imoanswerbench", 88.4], ["apex", 33.0], ["apex-shortlist", 85.7],
      ["mrcr-1m-mmr", 78.7], ["corpusqa-1m", 60.5], ["terminal-bench-2-0", 56.9],
      ["swe-bench-verified", 79.0], ["swe-bench-pro", 52.6], ["swe-multilingual", 73.3],
      ["browsecomp", 73.2], ["hle-tools", 45.1], ["mcp-atlas", 69.0],
      ["gdpval-aa", 1395, "Elo"], ["toolathlon", 47.8]
    ]]
  ];
  ds4Modes.forEach(([mode, rows]) => addRows(ds4Sources, "deepseek-v4-flash", rows,
    `DeepSeek V4 official model card · ${mode}`));

  const glm5Sources = ["zai-glm5-blog", "zai-glm5-hf", "zai-glm5-github"];
  addRows(glm5Sources, "glm-5", [
    ["hle", 30.5], ["hle-tools", 50.4], ["aime-2026", 92.7, "%", "AIME 2026 I"],
    ["hmmt-2025-11", 96.9], ["imoanswerbench", 82.5], ["gpqa-diamond", 86.0],
    ["swe-bench-verified", 77.8], ["swe-multilingual", 73.3],
    ["terminal-bench-2-0", 56.2, "%", "Terminus-2 · original set"],
    ["terminal-bench-2-0", 60.7, "%", "Terminus-2 · Z.ai verified set"],
    ["terminal-bench-2-0", 56.2, "%", "Claude Code 2.1.14 · original set · five-run mean"],
    ["terminal-bench-2-0", 61.1, "%", "Claude Code 2.1.14 · Z.ai verified set · five-run mean"],
    ["cybergym", 43.2], ["browsecomp", 62.0, "%", "without context management"],
    ["browsecomp", 75.9, "%", "with context management"], ["browsecomp-zh", 72.7],
    ["tau2-bench", 89.7], ["mcp-atlas", 67.8, "%", "public set"],
    ["tool-decathlon", 38.0], ["vending-bench-2", 4432.12, "$", "average net assets"]
  ], "GLM-5 official release table");

  const glm51Sources = ["zai-glm51-blog", "zai-glm51-hf"];
  addRows(glm51Sources, "glm-5-1", [
    ["hle", 31.0], ["hle-tools", 52.3], ["aime-2026", 95.3, "%", "full AIME 2026"],
    ["hmmt-2025-11", 94.0], ["hmmt-2026-02", 82.6], ["imoanswerbench", 83.8],
    ["gpqa-diamond", 86.2], ["swe-bench-pro", 58.4], ["nl2repo", 42.7],
    ["terminal-bench-2-0", 63.5, "%", "Terminus-2"],
    ["terminal-bench-2-0", 69.0, "%", "best self-reported · Claude Code"],
    ["cybergym", 68.7], ["browsecomp", 68.0, "%", "without context management"],
    ["browsecomp", 79.3, "%", "with context management"], ["tau3-bench", 70.6],
    ["mcp-atlas", 71.8, "%", "public set"], ["tool-decathlon", 40.7],
    ["vending-bench-2", 5634.41, "$", "average net assets"]
  ], "GLM-5.1 official release table");

  const k26TableSources = ["kimi-k26-hf", "kimi-k26-blog"];
  const k26Common = "Kimi K2.6 official benchmark table · thinking · temp 1.0 · top_p 1.0 · 262,144 context";
  addRows(k26TableSources, "kimi-k2-6", [
    ["hle-tools", 54.0, "%", "full set · search + code interpreter + browser · 262,144 max generation · context management"],
    ["browsecomp", 83.2, "%", "context management · discard-all strategy"],
    ["browsecomp", 86.3, "%", "Agent Swarm"],
    ["deepsearchqa", 92.5, "F1", "no context management; over-length tasks counted failed"],
    ["deepsearchqa-accuracy", 83.0, "%", "no context management; over-length tasks counted failed"],
    ["wide-search-item-f1", 80.8, "F1", "hide-tool-result context management"],
    ["toolathlon", 50.0], ["mcpmark", 55.9], ["apex-agents", 27.9, "%", "452-task subset"],
    ["osworld-verified", 73.1],
    ["terminal-bench-2-0", 66.7, "%", "Terminus-2 · JSON parser · preserve thinking · avg@10"],
    ["swe-bench-pro", 58.6, "%", "in-house SWE-agent-derived harness · avg@10"],
    ["swe-multilingual", 76.7, "%", "in-house SWE-agent-derived harness · avg@10"],
    ["swe-bench-verified", 80.2, "%", "in-house SWE-agent-derived harness · avg@10"],
    ["scicode", 52.2, "%", "avg@10"], ["ojbench-python", 60.6, "%", "Python · avg@10"],
    ["livecodebench-v6", 89.6, "%", "v6 · avg@10"],
    ["hle", 34.7, "%", "full set · no tools · max generation 98,304"],
    ["hle", 36.4, "%", "text-only subset · no tools · footnote result"],
    ["hle-tools", 55.5, "%", "text-only subset · with tools · footnote result"],
    ["aime-2026", 96.4], ["hmmt-2026-02", 92.7], ["imoanswerbench", 86.0], ["gpqa-diamond", 90.5],
    ["mmmu-pro", 79.4, "%", "no Python · official protocol · avg@3"],
    ["mmmu-pro", 80.1, "%", "with Python · max 50 steps · avg@3"],
    ["charxiv-rq-without-ci", 80.4, "%", "RQ · no Python · avg@3"],
    ["charxiv-rq-with-ci", 86.7, "%", "RQ · with Python · max 50 steps · avg@3"],
    ["mathvision-without-ci", 87.4, "%", "no Python · avg@3"],
    ["mathvision-with-ci", 93.2, "%", "with Python · max 50 steps · avg@3"],
    ["babyvision-without-ci", 39.8, "%", "no Python · avg@3"],
    ["babyvision-with-ci", 68.5, "%", "with Python · max 50 steps · avg@3"],
    ["vstar-with-ci", 96.9, "%", "with Python · max 50 steps · avg@3"]
  ], k26Common);
  add(k26TableSources, "claweval-v1-1-overall-pass3", "kimi-k2-6", 62.3, "%",
    "Claw-Eval v1.1 · overall · 300 tasks · N=3 · grader: Gemini 3 Flash");
  add(k26TableSources, "claweval-v1-1-overall-passat3", "kimi-k2-6", 80.9, "%",
    "Claw-Eval v1.1 · overall · 300 tasks · N=3 · grader: Gemini 3 Flash");

  addRows(["kimi-k26-blog"], "kimi-k2-6", [
    ["kimi-code-bench-unspecified", 68.2, "%", "official blog chart · K2.5 comparison 57.4"],
    ["kimi-design-bench-preference", 47.5, "%", "Kimi K2.6 Agent via kimi.com harnesses vs Gemini 3.1 Pro via Google AI Studio · Kimi preferred; tie 21.1%, Google preferred 31.4%"],
    ["kimi-claw-bench-unspecified", 65.5, "%", "official blog chart · K2.5 comparison 59.6"],
    ["gpqa-diamond", 88.4, "%", "headline comparison table", "Same official blog also exposes 90.5 in its detailed table; both are retained because the page does not reconcile the settings."],
    ["aime-2026", 93.3, "%", "headline comparison table", "Same official blog also exposes 96.4 in its detailed table; both are retained because the page does not reconcile the settings."]
  ], "Kimi K2.6 official launch blog");

  const k27Sources = ["kimi-k27-code-hf", "kimi-k27-code-resource"];
  const k27Common = "Kimi K2.7 Code official table · Kimi Code CLI · thinking + preserve_thinking · temp 1.0 · top_p .95 · 262,144 context";
  addRows(k27Sources, "kimi-k2-7-code", [
    ["kimi-code-bench-2", 62.0], ["program-bench", 53.6], ["mls-bench-lite", 35.1, "%", "official 30-task subset · five-hour agent budget"],
    ["kimi-claw-24-7-bench", 46.9, "%", "OpenClaw · 17 scenarios · 610 checkpoints · avg@3"],
    ["mcp-atlas", 76.0, "%", "100 tool-call budget · 32K max tokens/step · avg@3"],
    ["mcpmark-verified", 81.1, "%", "100-step tool-call budget · 32K max tokens/step · avg@3"]
  ], k27Common);
  addRows(k27Sources, "kimi-k2-6", [
    ["kimi-code-bench-2", 50.9], ["program-bench", 48.3], ["mls-bench-lite", 26.7, "%", "official 30-task subset · five-hour agent budget"],
    ["kimi-claw-24-7-bench", 42.9, "%", "OpenClaw · 17 scenarios · 610 checkpoints · avg@3"],
    ["mcp-atlas", 69.4, "%", "100 tool-call budget · 32K max tokens/step · avg@3"],
    ["mcpmark-verified", 72.8, "%", "100-step tool-call budget · 32K max tokens/step · avg@3"]
  ], "Kimi K2.7 Code official comparison table · Kimi K2.6 · Kimi Code CLI · thinking · temp 1.0 · top_p .95 · 262,144 context");

  targetComplete("qwen36-plus-blog", ["qwen3-6-plus"], "Qwen3.6-Plus 发布表目标模型列已逐项录入；对照模型列另行审计。");
  targetComplete("qwen36-27b-blog", ["qwen3-6-27b"], "Qwen3.6-27B 发布表目标模型列已逐项录入；对照模型列另行审计。");
  targetComplete("qwen36-35b-hf", ["qwen3-6-flash"], "Qwen3.6-35B-A3B 模型卡目标模型列已逐项录入；托管 API 名为 Qwen3.6-Flash。");
  upsertAudit("qwen36-27b-hf", { status: "pending", auditedAt: "2026-09-20", note: "官方模型卡已登记；仍需与发布博客逐单元格合并来源。" });
  upsertAudit("qwen36-27b-modelscope", { status: "pending", auditedAt: "2026-09-20", note: "官方 ModelScope 镜像已登记；尚未逐单元格核对是否与 HF/博客完全一致。" });
  upsertAudit("qwen36-35b-blog", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方发布文章用于版本关系和发布时间核验；成绩目标列以官方 HF 模型卡为准。" });
  upsertAudit("qwen36-35b-modelscope", { status: "pending", auditedAt: "2026-09-20", note: "官方 ModelScope 镜像已登记；尚未逐单元格核对是否与 HF 模型卡完全一致。" });
  upsertAudit("qwen-api-platform", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方 API 目录用于核验 Qwen3.6-Flash 与 Qwen3.6-35B-A3B 的托管命名关系。" });

  targetComplete("deepseek-v32-hf", ["deepseek-v3-2-thinking"], "模型卡发布图中 DeepSeek-V3.2 Thinking 目标列已录入；Speciale 不混入普通 Thinking 模式。");
  targetComplete("deepseek-v32-report", ["deepseek-v3-2-thinking"], "技术报告中 DeepSeek-V3.2 Thinking 发布主表目标列已录入。");
  upsertAudit("deepseek-v32-launch", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方发布页用于确认版本关系；目标成绩来自模型卡与技术报告。" });
  targetComplete("deepseek-v4-flash-hf", ["deepseek-v4-flash"], "V4 Flash Non-Think、Think High、Think Max 三列的全部非空单元格已录入并分 setting 保存。");
  targetComplete("deepseek-v4-report", ["deepseek-v4-flash"], "V4 技术报告中 V4 Flash 三种 reasoning mode 的目标列已录入。");
  upsertAudit("deepseek-v4-preview", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方发布页用于核验发布时间、模型规模和纯文本模态；完整成绩以模型卡与技术报告为准。" });
  upsertAudit("deepseek-v4-flash-modelscope", { status: "pending", auditedAt: "2026-09-20", note: "官方 ModelScope 镜像已登记；尚未逐单元格核对是否与 HF 模型卡完全一致。" });
  upsertAudit("deepseek-api-changelog", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方 API 更新记录用于确认 V4 Flash 路由后续切换到 V4.1 Flash，不作为成绩来源。" });

  targetComplete("zai-glm5-blog", ["glm-5"], "GLM-5 官方发布表目标列已完整录入；Terminal-Bench 原始/修订数据集与 harness 分 setting 保存。");
  targetComplete("zai-glm5-hf", ["glm-5"], "GLM-5 官方模型卡目标列已完整录入。");
  targetComplete("zai-glm5-github", ["glm-5"], "GLM-5 官方仓库 README 的发布表目标列已完整录入。");
  upsertAudit("zai-glm5-modelscope", { status: "pending", auditedAt: "2026-09-20", note: "官方 ModelScope 镜像已登记；尚未逐单元格核对是否与 HF/GitHub 完全一致。" });
  upsertAudit("zai-glm5-docs", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方 API 文档用于核验上下文、访问方式和模型能力，没有独立成绩表。" });
  targetComplete("zai-glm51-blog", ["glm-5-1"], "GLM-5.1 官方发布表目标列已完整录入；不同 Terminal-Bench harness 分 setting 保存。");
  targetComplete("zai-glm51-hf", ["glm-5-1"], "GLM-5.1 官方模型卡目标列已完整录入。");
  upsertAudit("zai-glm51-modelscope", { status: "pending", auditedAt: "2026-09-20", note: "官方 ModelScope 镜像已登记；尚未逐单元格核对是否与 HF/博客完全一致。" });
  upsertAudit("zai-glm51-docs", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方 API 文档用于核验模型元数据，没有独立成绩表。" });
  upsertAudit("zai-glm5-turbo-docs", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方 API 文档已核验纯文本输入、上下文与 OpenClaw 定位；ZClawBench 仅以图形展示，未臆测数值。" });
  upsertAudit("zai-glm5v-turbo-docs", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方 API 文档已核验文本、图像、视频与文件输入；当前页面没有可可靠转录的独立数值表。" });

  targetComplete("kimi-k26-blog", ["kimi-k2-6"], "技术博客完整目标表、Kimi Code/Design/Claw 三张图及同时可见的 headline 数值均已录入；同页不一致的 GPQA/AIME 按不同 setting 并存。");
  targetComplete("kimi-k26-hf", ["kimi-k2-6"], "官方模型卡目标列与脚注补充的 HLE text-only 成绩已完整录入；Claw-Eval 与官方榜单同分项合并来源。");
  upsertAudit("kimi-k26-model-page", { status: "metadata-only", auditedAt: "2026-09-21", note: "官方模型介绍页用于核验原生多模态与产品定位；完整成绩以技术博客和 HF 模型卡为准。" });
  upsertAudit("kimi-k26-api", { status: "metadata-only", auditedAt: "2026-09-21", note: "官方 API 指南用于核验 256K 上下文、视觉输入与思考模式，没有独立成绩表。" });
  upsertAudit("kimi-k26-modelscope", { status: "pending", auditedAt: "2026-09-21", note: "官方 ModelScope 镜像已登记；尚未完成与 HF 模型卡的逐单元格一致性核对。" });
  targetComplete("kimi-k27-code-resource", ["kimi-k2-7-code", "kimi-k2-6"], "官方发布资源页六项目标列及 K2.6 对照列已逐项录入；页面更新时间与模型首发日期分开保存。");
  targetComplete("kimi-k27-code-hf", ["kimi-k2-7-code", "kimi-k2-6"], "官方模型卡六项目标列及 K2.6 对照列已逐项录入，并保留各 benchmark harness 与预算。" );
  upsertAudit("kimi-k27-code-modelscope", { status: "pending", auditedAt: "2026-09-21", note: "官方 ModelScope 镜像已登记；尚未完成与 HF 模型卡的逐单元格一致性核对。" });
  upsertAudit("kimi-k27-code-api", { status: "metadata-only", auditedAt: "2026-09-21", note: "官方 API 指南用于核验仅 Thinking 模式、256K 上下文与多模态输入，没有独立成绩表。" });

  upsertAudit("xai-grok420-docs", { status: "metadata-only", auditedAt: "2026-09-21", note: "官方文档确认 Grok 4.20 与 beta aliases 均支持文本、图像和 1M 上下文；页面没有独立 benchmark 表。" });
  upsertAudit("xai-grok43-docs", { status: "metadata-only", auditedAt: "2026-09-21", note: "官方文档确认 Grok 4.3 支持文本、图像、1M 上下文及可调 reasoning effort；页面没有独立 benchmark 表。" });
  upsertAudit("xai-release-notes", { status: "metadata-only", auditedAt: "2026-09-21", note: "官方更新记录用于核验 Grok 4.20 上线与型号生命周期；未发现 Grok 4.20、4.3 或 Grok Build 0.1 的独立能力成绩表。" });
})();
