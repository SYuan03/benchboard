(() => {
  const { sources, sourceAudits, models, benchmarks, observations } = window.BENCH_DATA;
  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    observations.push({ id: `o${observations.length + 1}`, sourceIds, benchmarkId, modelId, value, unit, setting, note });
  };
  const batch = (sourceIds, benchmarkId, rows, unit = "%", setting = "") => {
    rows.forEach(([modelId, value, rowSetting = setting, note = ""]) => add(sourceIds, benchmarkId, modelId, value, unit, rowSetting, note));
  };

  /*
   * BenchBoard OpenAI + Anthropic capability-source patch draft
   * Audit date: 2026-09-20
   *
   * Intended placement: inside the BENCH_DATA IIFE, after add()/batch() are defined
   * and before `return { ... }`.
   *
   * This intentionally excludes safety/alignment appendices. It includes all numeric
   * capability cells from the three audited OpenAI launch pages and the capability
   * summary tables of the audited Anthropic System Cards.
   */
  
  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((existing) => existing.id === row.id)) target.push(row);
  });
  
  // ---------------------------------------------------------------------------
  // 1. First-party sources
  // ---------------------------------------------------------------------------
  
  appendUnique(sources, [
    { id: "openai-gpt54", vendorId: "openai", publisher: "OpenAI", date: "2026-03-05", tier: "official", title: "Introducing GPT-5.4", url: "https://openai.com/index/introducing-gpt-5-4/" },
    { id: "openai-gpt54-system-card", vendorId: "openai", publisher: "OpenAI", date: "2026-03-05", tier: "official", title: "GPT-5.4 Thinking System Card", url: "https://deploymentsafety.openai.com/gpt-5-4-thinking" },
    { id: "openai-gpt56-system-card", vendorId: "openai", publisher: "OpenAI", date: "2026-07-09", tier: "official", title: "GPT-5.6 System Card", url: "https://deploymentsafety.openai.com/gpt-5-6" },
    { id: "openai-astra-system-card", vendorId: "openai", publisher: "OpenAI", date: "2026-09-01", tier: "official", title: "GPT-6 Astra System Card", url: "https://deploymentsafety.openai.com/gpt-6-astra" },
    { id: "anthropic-fable51-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-09-01", tier: "official", title: "Claude Fable 5.1 & Claude Mythos 5.1 System Card", url: "https://www-cdn.anthropic.com/0339e6a7c5c7b87f5c07798616dc32c215d14235/Claude%20Fable%205.1%20&%20Claude%20Mythos%205.1%20System%20Card.pdf" },
    { id: "anthropic-opus5", vendorId: "anthropic", publisher: "Anthropic", date: "2026-07-24", tier: "official", title: "Introducing Claude Opus 5", url: "https://www.anthropic.com/news/claude-opus-5" },
    { id: "anthropic-opus5-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-07-24", tier: "official", title: "Claude Opus 5 System Card", url: "https://www-cdn.anthropic.com/ceaf5c7ff2783855203fde8208ec311252dced5b/Claude%20Opus%205%20System%20Card.pdf" },
    { id: "anthropic-fable5", vendorId: "anthropic", publisher: "Anthropic", date: "2026-06-09", tier: "official", title: "Claude Fable 5 and Claude Mythos 5", url: "https://www.anthropic.com/news/claude-fable-5-mythos-5" },
    { id: "anthropic-fable5-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-06-09", tier: "official", title: "Claude Fable 5 & Claude Mythos 5 System Card", url: "https://www-cdn.anthropic.com/57a52ea7d8f0e54e8a542e908266086df425cdf5/Claude%20Fable%205%20&%20Claude%20Mythos%205%20System%20Card.pdf" },
    { id: "anthropic-opus48", vendorId: "anthropic", publisher: "Anthropic", date: "2026-05-28", tier: "official", title: "Introducing Claude Opus 4.8", url: "https://www.anthropic.com/news/claude-opus-4-8" },
    { id: "anthropic-opus48-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-05-28", tier: "official", title: "Claude Opus 4.8 System Card", url: "https://www-cdn.anthropic.com/0f0c97ad20d8005706296bd92aa1c27c6b2f4f61/Claude%20Opus%204.8%20System%20Card.pdf" },
    { id: "anthropic-opus46", vendorId: "anthropic", publisher: "Anthropic", date: "2026-02-04", tier: "official", title: "Claude Opus 4.6", url: "https://www.anthropic.com/news/claude-opus-4-6" },
    { id: "anthropic-opus46-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-02-04", tier: "official", title: "Claude Opus 4.6 System Card", url: "https://www-cdn.anthropic.com/6a5fa276ac68b9aeb0c8b6af5fa36326e0e166dd/Claude%20Opus%204.6%20System%20Card.pdf" }
  ]);
  
  // ---------------------------------------------------------------------------
  // 2. Model identity fixes and comparison-only model records
  // ---------------------------------------------------------------------------
  
  const patchModel = (id, values) => {
    const model = models.find((item) => item.id === id);
    if (model) Object.assign(model, values);
  };
  
  patchModel("gpt-6-astra", { referenceSourceIds: ["openai-astra-work", "openai-astra-system-card"] });
  patchModel("gpt-5-6-sol", { referenceSourceIds: ["openai-gpt56-system-card"] });
  patchModel("gpt-5-6-terra", { releaseDate: "2026-07-09", sourceId: "openai-gpt56", referenceSourceIds: ["openai-gpt56-system-card"] });
  patchModel("gpt-5-6-luna", { releaseDate: "2026-07-09", sourceId: "openai-gpt56", referenceSourceIds: ["openai-gpt56-system-card"] });
  patchModel("gpt-5-4", { releaseDate: "2026-03-05", sourceId: "openai-gpt54", referenceSourceIds: ["openai-gpt54-system-card"] });
  patchModel("claude-fable-5-1", { referenceSourceIds: ["anthropic-fable51-system-card"] });
  patchModel("claude-mythos-5-1", { referenceSourceIds: ["anthropic-fable51-system-card"] });
  patchModel("claude-opus-5", { sourceId: "anthropic-opus5", referenceSourceIds: ["anthropic-opus5-system-card"] });
  patchModel("claude-fable-5", { sourceId: "anthropic-fable5", referenceSourceIds: ["anthropic-fable5-system-card"] });
  patchModel("claude-opus-4-8", { releaseDate: "2026-05-28", sourceId: "anthropic-opus48", referenceSourceIds: ["anthropic-opus48-system-card"] });
  
  // `Max` is an effort setting, not a model. Rewrite all existing references.
  for (const observation of observations) {
    if (observation.modelId === "claude-opus-4-6-max") {
      observation.modelId = "claude-opus-4-6";
      if (!/max/i.test(observation.setting || "")) {
        observation.setting = [observation.setting, "max effort"].filter(Boolean).join(" · ");
      }
    }
    // `Fast` is a route/service mode, not a foundation model.
    if (observation.modelId === "claude-opus-4-8-fast") {
      observation.modelId = "claude-opus-4-8";
      if (!/fast/i.test(observation.setting || "")) {
        observation.setting = [observation.setting, "fast route"].filter(Boolean).join(" · ");
      }
    }
  }
  
  const obsoleteModelIds = new Set(["claude-opus-4-6-max", "claude-opus-4-8-fast"]);
  for (let index = models.length - 1; index >= 0; index -= 1) {
    if (obsoleteModelIds.has(models[index].id)) models.splice(index, 1);
  }
  
  appendUnique(models, [
    { id: "gpt-5-4-pro", name: "GPT-5.4 Pro", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-03-05", modality: "vision", modalityDetail: "文本、图像 → 文本", context: "未核实", access: "闭源 API", aliases: ["gpt-5.4-pro"], sourceId: "openai-gpt54", referenceSourceIds: ["openai-gpt54-system-card"], scoreStatus: "comparison-only", summary: "GPT-5.4 发布页中的 Pro 推理配置。" },
    { id: "gpt-5-3-codex", name: "GPT-5.3 Codex", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、代码与工具 → 文本", context: "未核实", access: "闭源", aliases: ["gpt-5.3-codex"], sourceId: "openai-gpt54", scoreStatus: "comparison-only", summary: "GPT-5.4 发布页中的官方对照模型。" },
    { id: "gpt-5-5", name: "GPT-5.5", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、工具 → 文本", context: "未核实", access: "闭源 API", aliases: ["gpt-5.5"], sourceId: "openai-gpt56", scoreStatus: "comparison-only", summary: "GPT-5.6 发布页中的官方对照模型。" },
    { id: "gpt-5-2", name: "GPT-5.2", vendorId: "openai", vendor: "OpenAI", releaseDate: "2025", modality: "vision", modalityDetail: "文本、图像、工具 → 文本", context: "未核实", access: "闭源 API", aliases: ["gpt-5.2", "gpt-5.2-thinking"], sourceId: "openai-gpt54", scoreStatus: "comparison-only", summary: "GPT-5.4 发布页中的官方对照模型。" },
    { id: "gpt-5-2-pro", name: "GPT-5.2 Pro", vendorId: "openai", vendor: "OpenAI", releaseDate: "2025", modality: "vision", modalityDetail: "文本、图像、工具 → 文本", context: "未核实", access: "闭源 API", aliases: ["gpt-5.2-pro"], sourceId: "openai-gpt54", scoreStatus: "comparison-only", summary: "GPT-5.4 发布页中的官方对照模型。" },
    { id: "claude-mythos-5", name: "Claude Mythos 5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-06-09", modality: "vision", modalityDetail: "与 Fable 5 同权重；不同安全策略", context: "未披露", access: "受限访问", aliases: ["claude-mythos-5"], sourceId: "anthropic-fable5", referenceSourceIds: ["anthropic-fable5-system-card"], summary: "与 Fable 5 同权重、不同 safeguard；官方表需独立保留。" },
    { id: "claude-mythos-preview", name: "Claude Mythos Preview", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、工具 → 文本", context: "未披露", access: "受限预览", aliases: ["claude-mythos-preview"], sourceId: "anthropic-fable5-system-card", scoreStatus: "comparison-only", summary: "Fable/Mythos 5 System Card 中的预览检查点。" },
    { id: "claude-opus-4-7", name: "Claude Opus 4.7", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、工具 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-opus-4-7"], sourceId: "anthropic-opus48-system-card", scoreStatus: "comparison-only", summary: "Opus 4.8 System Card 中的前代对照模型。" },
    { id: "claude-opus-4-6", name: "Claude Opus 4.6", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-02-04", modality: "vision", modalityDetail: "文本、图像、工具与计算机操作 → 文本", context: "最高 1M（评测依赖）", access: "闭源 API", aliases: ["claude-opus-4-6", "Claude-Opus-4.6 (Max)"], sourceId: "anthropic-opus46", referenceSourceIds: ["anthropic-opus46-system-card"], summary: "Opus 4.6；Max 应保留为 reasoning-effort setting。" },
    { id: "claude-opus-4-5", name: "Claude Opus 4.5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2025", modality: "vision", modalityDetail: "文本、图像、工具 → 文本", context: "未核实", access: "闭源 API", aliases: ["claude-opus-4-5"], sourceId: "anthropic-opus46-system-card", scoreStatus: "comparison-only", summary: "Opus 4.6 System Card 中的官方对照模型。" },
    { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2025", modality: "vision", modalityDetail: "文本、图像、工具 → 文本", context: "未核实", access: "闭源 API", aliases: ["claude-sonnet-4-5"], sourceId: "anthropic-opus46-system-card", scoreStatus: "comparison-only", summary: "Opus 4.6 System Card 中的官方对照模型。" },
    { id: "gemini-3-5-flash", name: "Gemini 3.5 Flash", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "未核实", access: "闭源 API", aliases: ["gemini-3.5-flash"], sourceId: "openai-gpt56", scoreStatus: "comparison-only", summary: "OpenAI 与 Anthropic 官方表中的对照模型。" },
    { id: "gemini-3-pro", name: "Gemini 3 Pro", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2025", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "未核实", access: "闭源 API", aliases: ["gemini-3-pro"], sourceId: "anthropic-opus46-system-card", scoreStatus: "comparison-only", summary: "Opus 4.6 System Card 中的官方对照模型。" }
  ]);
  
  // ---------------------------------------------------------------------------
  // 3. Canonical benchmark records missing from the current registry
  // ---------------------------------------------------------------------------
  
  appendUnique(benchmarks, [
    { id: "frontiercode-1-1-main", name: "FrontierCode 1.1 Main", category: "编码", direction: "higher", description: "FrontierCode 主任务集；reasoning effort 与 harness 必须随成绩保留。" },
    { id: "frontiercode-diamond", name: "FrontierCode Diamond", category: "编码", direction: "higher", description: "FrontierCode Diamond 子集；不要与 Main 或 Extended 合并。" },
    { id: "openscore-string-quartets", name: "OpenScore String Quartets", category: "专业工作", direction: "higher", description: "弦乐四重奏乐谱转录；OpenAI 报告 1 - OMR-NED。" },
    { id: "internal-design-tasks", name: "OpenAI Internal Design Tasks", category: "专业工作", direction: "higher", description: "OpenAI 内部设计任务。" },
    { id: "internal-data-science-tasks", name: "OpenAI Internal Data Science Tasks", category: "专业工作", direction: "higher", description: "OpenAI 内部数据科学任务。" },
    { id: "internal-database-migration", name: "OpenAI Internal Database Migration Tasks", category: "编码", direction: "higher", description: "OpenAI 内部数据库迁移任务。" },
    { id: "frontiermath-t1-3", name: "FrontierMath Tier 1-3 (v2)", category: "知识 / 推理", direction: "higher", description: "FrontierMath v2 的 Tier 1-3。" },
    { id: "arc-agi-1", name: "ARC-AGI-1", category: "抽象推理", direction: "higher", description: "ARC-AGI 第一代任务；verified、effort 等口径需保留。" },
    { id: "arc-agi-2", name: "ARC-AGI-2", category: "抽象推理", direction: "higher", description: "ARC-AGI 第二代任务；verified、token budget 与 effort 需保留。" },
    { id: "osworld-2", name: "OSWorld 2.0", category: "计算机操作", direction: "higher", description: "OSWorld 2.0 未注明 partial/strict 的发布口径；不要擅自归入任一子口径。" },
    { id: "osworld-verified", name: "OSWorld-Verified", category: "计算机操作", direction: "higher", description: "OSWorld Verified 版本；与 OSWorld 2.0 的 partial/strict 口径分开。" },
    { id: "management-consulting-tasks", name: "Management Consulting Tasks", category: "专业工作", direction: "higher", description: "OpenAI 内部管理咨询任务。" },
    { id: "big-finance-bench", name: "Big Finance Bench", category: "专业工作", direction: "higher", description: "金融专业任务评测。" },
    { id: "internal-research-debugging", name: "OpenAI Internal Research Debugging", category: "科研", direction: "higher", description: "研究实验调试任务。" },
    { id: "kernelgen-1p", name: "KernelGen 1P", category: "编码", direction: "higher", description: "内核生成与性能优化评测。" },
    { id: "nanogpt", name: "NanoGPT", category: "科研", direction: "higher", description: "受限算力下优化小型语言模型训练。" },
    { id: "posttrainbench-lite", name: "PostTrainBench Lite", category: "科研", direction: "higher", description: "后训练与强化学习方案设计。" },
    { id: "rsi-index", name: "RSI Index", category: "科研", direction: "higher", description: "AI self-improvement 综合指数。" },
    { id: "gdp-pdf", name: "gdp.pdf", category: "多模态", direction: "higher", description: "PDF 文档理解与专业工作评测。", inputModalities: ["文本", "PDF"] },
    { id: "capture-the-flag", name: "Capture-the-Flag Challenges", category: "网络安全", direction: "higher", description: "专业级 CTF 任务；pass@k 与 harness 必须保留。" },
    { id: "mrcr-v2-8needle", name: "OpenAI MRCR v2 · 8-needle", category: "长上下文", direction: "higher", description: "MRCR v2 八针长上下文检索；上下文区间写入 setting。" },
    { id: "graphwalks-bfs", name: "GraphWalks BFS", category: "长上下文", direction: "higher", description: "图遍历 BFS；上下文长度和 F1 口径写入 setting。" },
    { id: "graphwalks-parents", name: "GraphWalks Parents", category: "长上下文", direction: "higher", description: "图父节点追踪；上下文长度和 accuracy 口径写入 setting。" },
    { id: "gdpval", name: "GDPval", category: "专业工作", direction: "higher", description: "真实职业任务；不要与 GDPval-AA Elo 合并。" },
    { id: "financeagent-v1-1", name: "FinanceAgent v1.1", category: "专业工作", direction: "higher", description: "金融 Agent 评测。" },
    { id: "investment-banking-modeling", name: "Investment Banking Modeling Tasks", category: "专业工作", direction: "higher", description: "OpenAI 内部投行建模任务。" },
    { id: "officeqa", name: "OfficeQA", category: "专业工作", direction: "higher", description: "办公文档问答评测。" },
    { id: "mcp-atlas", name: "MCP-Atlas", category: "Agent / 工作", direction: "higher", description: "MCP 工具使用评测。" },
    { id: "tau2-retail", name: "τ²-bench Retail", category: "Agent / 工作", direction: "higher", description: "零售场景工具 Agent 评测。" },
    { id: "tau2-telecom", name: "τ²-bench Telecom", category: "Agent / 工作", direction: "higher", description: "电信场景工具 Agent 评测。" },
    { id: "frontier-science-research", name: "Frontier Science Research", category: "科研", direction: "higher", description: "前沿科学研究任务。" },
    { id: "omnidocbench", name: "OmniDocBench", category: "多模态", direction: "lower", description: "文档解析；OpenAI 报告 normalized edit distance。", inputModalities: ["文本", "图像", "PDF"] },
    { id: "webarena-verified", name: "WebArena-Verified", category: "计算机操作", direction: "higher", description: "浏览器任务；DOM 与截图交互方式写入 setting。" },
    { id: "online-mind2web", name: "Online-Mind2Web", category: "计算机操作", direction: "higher", description: "在线浏览器任务；观察模态写入 setting。" },
    { id: "biglaw-bench", name: "BigLaw Bench", category: "专业工作", direction: "higher", description: "Harvey 法律工作评测；OpenAI 页面引用第三方结果。" },
    { id: "swe-bench-verified", name: "SWE-Bench Verified", category: "编码", direction: "higher", description: "SWE-Bench 人工验证子集；harness 与试验次数写入 setting。" },
    { id: "swe-multimodal", name: "SWE-Bench Multimodal", category: "编码", direction: "higher", description: "包含多模态输入的软件工程任务。", inputModalities: ["文本", "图像"] },
    { id: "aa-briefcase", name: "AA-Briefcase", category: "专业工作", direction: "higher", description: "Artificial Analysis 专业工作评测。" },
    { id: "frontierbench-v0-1", name: "FrontierBench v0.1", category: "编码", direction: "higher", description: "长程软件工程 Agent 任务；运行方和 effort 必须保留。" },
    { id: "biomysterybench", name: "BioMysteryBench", category: "科研", direction: "higher", description: "生物学推理任务；Human/Hard 子集写入 setting。" },
    { id: "critpt", name: "CritPt", category: "知识 / 推理", direction: "higher", description: "批判性推理评测；工具开关写入 setting。" },
    { id: "arxivmath", name: "ArxivMath", category: "知识 / 推理", direction: "higher", description: "研究级数学问题评测。" },
    { id: "riemannbench", name: "RiemannBench", category: "知识 / 推理", direction: "higher", description: "数学推理评测。" },
    { id: "blueprint-bench-2", name: "Blueprint-Bench 2", category: "专业工作", direction: "higher", description: "专业文档/蓝图任务评测。" },
    { id: "legal-agent-public", name: "Legal Agent Full Public Benchmark", category: "专业工作", direction: "higher", description: "公开法律 Agent 任务集。" },
    { id: "harvey-legal-heldout", name: "Harvey Held-Out Legal Set", category: "专业工作", direction: "higher", description: "Harvey 私有法律任务集。" },
    { id: "chartqapro", name: "ChartQAPro", category: "多模态", direction: "higher", description: "图表问答；工具开关写入 setting。", inputModalities: ["文本", "图像"] },
    { id: "financeagent-v2", name: "Finance Agent v2", category: "专业工作", direction: "higher", description: "金融 Agent 评测。" },
    { id: "openrca", name: "OpenRCA", category: "编码", direction: "higher", description: "软件故障根因分析；行业子集写入 setting。" },
    { id: "mmmlu", name: "MMMLU", category: "知识 / 推理", direction: "higher", description: "多语言大规模知识评测。" }
  ]);
  
  // The existing `mrcr-256k` and `mrcr-512k` records are legacy display variants.
  // New official rows below use one canonical benchmark plus an explicit context-range setting.
  
  // ---------------------------------------------------------------------------
  // 4. Remove stale direct-source observations before inserting audited matrices.
  // Other source provenance on a multi-source observation is preserved.
  // ---------------------------------------------------------------------------
  
  const rebuiltCapabilitySources = new Set(["openai-astra", "openai-gpt56", "anthropic-fable51"]);
  for (let index = observations.length - 1; index >= 0; index -= 1) {
    const observation = observations[index];
    const keptSources = (observation.sourceIds || []).filter((sourceId) => !rebuiltCapabilitySources.has(sourceId));
    if (keptSources.length === 0) observations.splice(index, 1);
    else observation.sourceIds = keptSources;
  }
  
  // ---------------------------------------------------------------------------
  // 5. OpenAI launch-page capability matrices
  // ---------------------------------------------------------------------------
  
  const oaAstra = ["openai-astra"];
  
  batch(oaAstra, "agents-last-exam-score", [
    ["gpt-6-astra", 59.3], ["gpt-5-6-sol", 53.6], ["claude-fable-5", 48.7], ["claude-opus-5", 55.5]
  ], "Score", "OpenAI launch table · highest published effort");
  batch(oaAstra, "osworld-2-partial", [
    ["gpt-6-astra", 72.6], ["gpt-5-6-sol", 65.7], ["claude-opus-5", 70.2]
  ], "%", "v2026.08.08 · offline set · partial score");
  batch(oaAstra, "screenspot-pro", [
    ["gpt-6-astra", 92.7], ["gpt-5-6-sol", 76.9],
    ["claude-fable-5", 87.3, "no tools · Mythos-derived comparison per OpenAI footnote"]
  ], "%", "no tools");
  
  batch(oaAstra, "automationbench", [
    ["gpt-6-astra", 41.4], ["gpt-5-6-sol", 18.1], ["claude-fable-5-1", 31.4],
    ["claude-fable-5", 17.4], ["claude-opus-5", 26.9]
  ], "%", "OpenAI launch table");
  batch(oaAstra, "benchcad", [
    ["gpt-6-astra", 95.9], ["gpt-5-6-sol", 83.3], ["claude-fable-5-1", 84.3],
    ["claude-fable-5", 67.5], ["claude-opus-5", 82.1]
  ], "%", "OpenAI launch table");
  batch(oaAstra, "browsecomp", [
    ["gpt-6-astra", 91.5], ["gpt-5-6-sol", 90.4], ["claude-fable-5", 87.4], ["claude-opus-5", 90.8]
  ], "%", "OpenAI launch table");
  batch(oaAstra, "openscore-string-quartets", [
    ["gpt-6-astra", 0.84], ["gpt-5-6-sol", 0.19]
  ], "1 - OMR-NED", "OpenAI launch table");
  batch(oaAstra, "internal-design-tasks", [
    ["gpt-6-astra", 50.0], ["gpt-5-6-sol", 47.4], ["claude-fable-5", 35.8]
  ], "%", "OpenAI internal benchmark");
  batch(oaAstra, "internal-data-science-tasks", [
    ["gpt-6-astra", 40.9], ["gpt-5-6-sol", 30.5], ["claude-fable-5", 34.7]
  ], "%", "OpenAI internal benchmark");
  batch(oaAstra, "artificial-intelligence-index", [
    ["gpt-6-astra", 61.2], ["gpt-5-6-sol", 60.9], ["claude-fable-5-1", 65.7],
    ["claude-fable-5", 62.1], ["claude-opus-5", 63.1], ["gemini-3-8-flash", 58.7]
  ], "Index", "Artificial Analysis Intelligence Index v4.1.1");
  
  batch(oaAstra, "terminal-bench-4-0", [
    ["gpt-6-astra", 57.9], ["gpt-5-6-sol", 37.3], ["claude-fable-5-1", 55.8],
    ["claude-fable-5", 44.5], ["claude-opus-5", 52.6], ["gemini-3-8-flash", 19.1]
  ], "%", "OpenAI launch table");
  batch(oaAstra, "deepswe-v1-1", [
    ["gpt-6-astra", 74.1], ["gpt-5-6-sol", 72.7], ["claude-fable-5-1", 67.4],
    ["claude-fable-5", 69.9], ["claude-opus-5", 73.7], ["gemini-3-8-flash", 73.8]
  ], "%", "OpenAI launch table");
  batch(oaAstra, "frontiercode-1-1-extended", [
    ["gpt-6-astra", 64.5, "highest effort"], ["gpt-5-6-sol", 60.6], ["claude-fable-5-1", 63.6],
    ["claude-fable-5", 64.9], ["claude-opus-5", 63.6], ["gemini-3-8-flash", 56.3]
  ], "%", "OpenAI launch table");
  batch(oaAstra, "frontiercode-1-1-main", [
    ["gpt-6-astra", 53.3, "highest effort"], ["gpt-5-6-sol", 47.5], ["claude-fable-5-1", 50.9],
    ["claude-fable-5", 53.5], ["claude-opus-5", 53.4], ["gemini-3-8-flash", 43.6]
  ], "%", "OpenAI launch table");
  batch(oaAstra, "internal-database-migration", [
    ["gpt-6-astra", 63.9], ["gpt-5-6-sol", 42.7], ["claude-fable-5-1", 57.8], ["claude-fable-5", 50.3]
  ], "%", "OpenAI internal benchmark");
  batch(oaAstra, "artificial-coding-index", [
    ["gpt-6-astra", 67.0], ["gpt-5-6-sol", 65.1], ["claude-fable-5", 67.2],
    ["claude-opus-5", 68.1], ["gemini-3-8-flash", 61.2]
  ], "Index", "Artificial Analysis Coding Agent Index v1.4");
  
  batch(oaAstra, "terminal-bench-science", [
    ["gpt-6-astra", 64.6, "highest effort"], ["gpt-5-6-sol", 22.4], ["claude-fable-5-1", 52.6],
    ["claude-fable-5", 21.4], ["claude-opus-5", 30.0]
  ], "%", "OpenAI launch table");
  add(oaAstra, "terminal-bench-science", "gpt-6-astra", 61.1, "%", "lower-cost setting", "Prose result; keep alongside 64.6 highest-effort result");
  batch(oaAstra, "frontiermath-t4", [
    ["gpt-6-astra", 97.6], ["gpt-5-6-sol", 83.0], ["claude-fable-5-1", 87.8],
    ["claude-fable-5", 90.2], ["claude-opus-5", 73.2]
  ], "%", "v2");
  batch(oaAstra, "gpqa-diamond", [
    ["gpt-6-astra", 96.0, "highest effort"], ["gpt-5-6-sol", 94.6], ["claude-fable-5-1", 93.7],
    ["claude-fable-5", 92.6], ["claude-opus-5", 93.7], ["gemini-3-8-flash", 95.3]
  ], "%", "OpenAI launch table");
  add(oaAstra, "gpqa-diamond", "gpt-6-astra", 94.9, "%", "lower-cost setting", "Prose result; keep alongside 96.0 highest-effort result");
  batch(oaAstra, "hle-tools", [
    ["gpt-6-astra", 57.2], ["claude-fable-5-1", 65.0], ["claude-fable-5", 63.8], ["claude-opus-5", 63.6]
  ], "%", "with tools");
  
  batch(oaAstra, "genebench-pro", [["gpt-6-astra", 37.1], ["gpt-5-6-sol", 32.3]], "%", "accuracy");
  batch(oaAstra, "medchembench", [["gpt-6-astra", 49.3], ["gpt-5-6-sol", 47.4]], "%", "internal · weighted score");
  batch(oaAstra, "lifescibench", [["gpt-6-astra", 60.3], ["gpt-5-6-sol", 59.9]], "%", "OpenAI launch table");
  batch(oaAstra, "healthbench-professional", [
    ["gpt-6-astra", 63.4], ["gpt-5-6-sol", 60.5], ["claude-fable-5-1", 58.1],
    ["claude-fable-5", 60.9], ["claude-opus-5", 56.4], ["gemini-3-8-flash", 52.1]
  ], "%", "length-adjusted");
  
  batch(oaAstra, "exploitbench", [
    ["gpt-6-astra", 100.0], ["gpt-5-6-sol", 78.5], ["claude-opus-5", 70.0]
  ], "%", "OpenAI launch table");
  batch(oaAstra, "exploitgym-rate", [
    ["gpt-6-astra", 42.4], ["gpt-5-6-sol", 30.3], ["claude-fable-5-1", 30.4, "Mythos-derived comparison per OpenAI footnote"],
    ["claude-fable-5", 28.4, "Mythos-derived comparison per OpenAI footnote"], ["claude-opus-5", 22.0]
  ], "%", "OpenAI launch table");
  batch(oaAstra, "exploitbench-2026-jun-aug", [["gpt-6-astra", 39.0], ["gpt-5-6-sol", 5.5]], "%", "June-August 2026 · 300-turn limit");
  add(oaAstra, "exploitbench-2026-jun-aug", "gpt-5-6-sol", 11.5, "%", "similar settings · fewer 300-turn-limit hits", "Prose/footnote result; do not overwrite 5.5");
  batch(oaAstra, "sre-bench-1", [["gpt-6-astra", 88.0], ["gpt-5-6-sol", 55.9], ["claude-opus-5", 12.5]], "%", "1 attempt");
  batch(oaAstra, "sec-bench-pro", [["gpt-6-astra", 85.4], ["gpt-5-6-sol", 79.1]], "%", "OpenAI launch table");
  
  batch(oaAstra, "mrcr-v2-8needle", [["gpt-6-astra", 100.0], ["gpt-5-6-sol", 91.5]], "%", "256K-512K");
  batch(oaAstra, "mrcr-v2-8needle", [["gpt-6-astra", 96.3], ["gpt-5-6-sol", 73.8]], "%", "512K-1M");
  batch(oaAstra, "arc-agi-3", [["gpt-6-astra", 99.9], ["gpt-5-6-sol", 7.8], ["claude-opus-5", 30.2]], "%", "OpenAI launch table");
  batch(oaAstra, "arc-agi-2", [
    ["gpt-6-astra", 95.0], ["gpt-5-6-sol", 92.5], ["claude-fable-5-1", 90.0],
    ["claude-fable-5", 89.2], ["claude-opus-5", 90.4]
  ], "%", "OpenAI launch table");
  batch(oaAstra, "arc-agi-1", [
    ["gpt-6-astra", 98.5], ["gpt-5-6-sol", 97.5], ["claude-fable-5-1", 97.5],
    ["claude-fable-5", 98.5], ["claude-opus-5", 97.5]
  ], "%", "OpenAI launch table");
  
  const oa56 = ["openai-gpt56"];
  
  batch(oa56, "agents-last-exam-score", [
    ["gpt-5-6-sol", 52.7], ["gpt-5-6-terra", 50.4], ["gpt-5-6-luna", 50.3], ["gpt-5-5", 46.9],
    ["claude-fable-5", 40.5], ["claude-opus-4-8", 45.2], ["gemini-3-1-pro", 32.1]
  ], "Score", "OpenAI GPT-5.6 launch table");
  batch(oa56, "gdpval-aa-v2", [
    ["gpt-5-6-sol", 1747.8], ["gpt-5-6-terra", 1593], ["gpt-5-6-luna", 1591.8], ["gpt-5-5", 1493.7],
    ["claude-fable-5", 1759.6], ["claude-opus-4-8", 1600.1], ["gemini-3-1-pro", 962.3], ["gemini-3-5-flash", 1348.8]
  ], "Elo", "OpenAI GPT-5.6 launch table");
  batch(oa56, "management-consulting-tasks", [
    ["gpt-5-6-sol", 43.2], ["gpt-5-6-terra", 37.2], ["gpt-5-6-luna", 35.4], ["gpt-5-5", 31.3],
    ["claude-fable-5", 35.5], ["claude-opus-4-8", 31.6], ["gemini-3-1-pro", 13.2]
  ], "%", "OpenAI internal benchmark");
  batch(oa56, "big-finance-bench", [
    ["gpt-5-6-sol", 53], ["gpt-5-6-terra", 51], ["gpt-5-6-luna", 36], ["gpt-5-5", 49], ["claude-opus-4-8", 44]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "artificial-intelligence-index", [
    ["gpt-5-6-sol", 58.9], ["gpt-5-6-terra", 55], ["gpt-5-6-luna", 51.2], ["gpt-5-5", 54.8],
    ["claude-fable-5", 59.9], ["claude-opus-4-8", 55.7], ["gemini-3-1-pro", 46.5], ["gemini-3-5-flash", 50.2]
  ], "Index", "Artificial Analysis Intelligence Index v4.1");
  
  batch(oa56, "artificial-coding-index", [
    ["gpt-5-6-sol", 80], ["gpt-5-6-terra", 77.4], ["gpt-5-6-luna", 74.6], ["gpt-5-5", 76.4],
    ["claude-fable-5", 77.2], ["claude-opus-4-8", 72.5], ["gemini-3-1-pro", 42.7]
  ], "Index", "Artificial Analysis Coding Agent Index v1.1");
  batch(oa56, "swe-bench-pro", [
    ["gpt-5-6-sol", 64.6], ["gpt-5-6-terra", 63.4], ["gpt-5-6-luna", 62.7], ["gpt-5-5", 59.4],
    ["claude-mythos-5", 80.3], ["claude-mythos-preview", 77.8], ["claude-fable-5", 80.0],
    ["claude-opus-4-8", 69.2], ["gemini-3-1-pro", 54.2]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "deepswe-v1-1", [
    ["gpt-5-6-sol", 72.7], ["gpt-5-6-terra", 69.6], ["gpt-5-6-luna", 67.2], ["gpt-5-5", 67.0],
    ["claude-fable-5", 69.7], ["claude-opus-4-8", 59.0], ["gemini-3-1-pro", 11.8]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "terminal-bench-2-1", [
    ["gpt-5-6-sol", 88.8], ["gpt-5-6-sol", 91.9, "Ultra effort"], ["gpt-5-6-terra", 87.4],
    ["gpt-5-6-luna", 84.7], ["gpt-5-5", 85.6], ["claude-mythos-5", 88.0],
    ["claude-fable-5", 83.1], ["claude-opus-4-8", 78.9], ["gemini-3-1-pro", 70.7]
  ], "%", "OpenAI GPT-5.6 launch table");
  
  batch(oa56, "genebench-pro", [
    ["gpt-5-6-sol", 28.7], ["gpt-5-6-terra", 23.3], ["gpt-5-6-luna", 10.8], ["gpt-5-5", 12.0],
    ["claude-opus-4-8", 16.0], ["gemini-3-1-pro", 3.1], ["gemini-3-5-flash", 8.14]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "lifescibench", [
    ["gpt-5-6-sol", 59.9], ["gpt-5-6-terra", 56.0], ["gpt-5-6-luna", 51.2], ["gpt-5-5", 50.4], ["claude-opus-4-8", 53.6]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "medchembench", [
    ["gpt-5-6-sol", 48.3], ["gpt-5-6-terra", 35.0], ["gpt-5-6-luna", 30.4], ["gpt-5-5", 35.5]
  ], "%", "internal");
  batch(oa56, "healthbench-professional", [
    ["gpt-5-6-sol", 60.5], ["gpt-5-6-terra", 57.7], ["gpt-5-6-luna", 55.7], ["gpt-5-5", 49.5],
    ["claude-fable-5", 60.9], ["claude-opus-4-8", 53.0]
  ], "%", "OpenAI GPT-5.6 launch table");
  
  batch(oa56, "osworld-2", [
    ["gpt-5-6-sol", 62.6], ["gpt-5-6-terra", 50.2], ["gpt-5-6-luna", 45.6], ["gpt-5-5", 47.5], ["claude-opus-4-8", 54.8]
  ], "%", "OSWorld 2.0 · OpenAI GPT-5.6 launch table");
  batch(oa56, "browsecomp", [
    ["gpt-5-6-sol", 90.4], ["gpt-5-6-sol", 92.2, "Ultra effort"], ["gpt-5-6-terra", 87.5],
    ["gpt-5-6-luna", 83.3], ["gpt-5-5", 84.4], ["claude-mythos-5", 88.0],
    ["claude-mythos-preview", 87.9], ["claude-opus-4-8", 84.3], ["gemini-3-1-pro", 85.9]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "benchcad", [
    ["gpt-5-6-sol", 70.6], ["gpt-5-6-terra", 62.3], ["gpt-5-6-luna", 63.1], ["gpt-5-5", 44.4],
    ["claude-mythos-5", 38.4], ["claude-mythos-preview", 35.5], ["claude-opus-4-8", 27.3]
  ], "%", "no Python tool");
  batch(oa56, "benchcad", [
    ["gpt-5-6-sol", 83.4], ["gpt-5-6-terra", 78.2], ["gpt-5-6-luna", 73.9], ["gpt-5-5", 55.8],
    ["claude-mythos-5", 65.0], ["claude-mythos-preview", 61.0], ["claude-opus-4-8", 51.8]
  ], "%", "Python tool enabled");
  
  batch(oa56, "capture-the-flag", [
    ["gpt-5-6-sol", 96.7], ["gpt-5-6-terra", 91.8], ["gpt-5-6-luna", 85.2], ["gpt-5-5", 88.1]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "sec-bench-pro", [
    ["gpt-5-6-sol", 71.2], ["gpt-5-6-sol", 74.3, "Ultra effort"], ["gpt-5-6-terra", 57.7],
    ["gpt-5-6-luna", 48.9], ["gpt-5-5", 45.8]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "exploitbench", [
    ["gpt-5-6-sol", 73.5], ["gpt-5-6-terra", 52.9], ["gpt-5-6-luna", 33.2], ["gpt-5-5", 47.9],
    ["claude-mythos-5", 78.0], ["claude-mythos-preview", 74.2], ["claude-opus-4-8", 40.0]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "exploitgym-rate", [
    ["gpt-5-6-sol", 33.7], ["gpt-5-6-terra", 23.2], ["gpt-5-6-luna", 12.4], ["gpt-5-5", 15.1]
  ], "%", "OpenAI GPT-5.6 launch table");
  
  batch(oa56, "internal-research-debugging", [["gpt-5-6-sol", 68.3], ["gpt-5-6-terra", 67.8], ["gpt-5-6-luna", 50.8], ["gpt-5-5", 50.0]], "%", "OpenAI internal benchmark");
  batch(oa56, "kernelgen-1p", [["gpt-5-6-sol", 61.1], ["gpt-5-6-terra", 49.2], ["gpt-5-6-luna", 22.4], ["gpt-5-5", 29.3]], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "nanogpt", [["gpt-5-6-sol", 9.69], ["gpt-5-6-terra", 14.5], ["gpt-5-6-luna", 1.66], ["gpt-5-5", 2.65]], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "posttrainbench-lite", [["gpt-5-6-sol", 50.3], ["gpt-5-6-terra", 51.5], ["gpt-5-6-luna", 29.6], ["gpt-5-5", 38.8]], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "rsi-index", [["gpt-5-6-sol", 57.9], ["gpt-5-6-terra", 56.3], ["gpt-5-6-luna", 41.9], ["gpt-5-5", 41.7]], "Index", "OpenAI GPT-5.6 launch table");
  
  batch(oa56, "mmmu-pro", [
    ["gpt-5-6-sol", 83.0], ["gpt-5-6-terra", 80.7], ["gpt-5-6-luna", 78.4], ["gpt-5-5", 81.2], ["gemini-3-1-pro", 80.5]
  ], "%", "no tools");
  batch(oa56, "mmmu-pro", [
    ["gpt-5-6-sol", 84.6], ["gpt-5-6-terra", 82.0], ["gpt-5-6-luna", 79.5], ["gpt-5-5", 83.2]
  ], "%", "with tools");
  batch(oa56, "gdp-pdf", [
    ["gpt-5-6-sol", 30.7], ["gpt-5-6-terra", 24.7], ["gpt-5-6-luna", 22.7], ["gpt-5-5", 26.0],
    ["claude-fable-5", 29.8], ["claude-opus-4-8", 22.5], ["gemini-3-1-pro", 16.7]
  ], "%", "OpenAI GPT-5.6 launch table");
  
  batch(oa56, "gpqa-diamond", [
    ["gpt-5-6-sol", 94.6], ["gpt-5-6-terra", 92.9], ["gpt-5-6-luna", 92.3], ["gpt-5-5", 93.6],
    ["claude-mythos-5", 94.1], ["claude-mythos-preview", 94.6], ["claude-fable-5", 92.6],
    ["claude-opus-4-8", 92.0], ["gemini-3-1-pro", 94.3]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "frontiermath-t1-3", [
    ["gpt-5-6-sol", 89.0], ["gpt-5-6-terra", 84.9], ["gpt-5-6-luna", 78.6], ["gpt-5-5", 85.3],
    ["claude-fable-5", 87.0], ["claude-opus-4-8", 80.0], ["gemini-3-1-pro", 59.6]
  ], "%", "v2");
  batch(oa56, "frontiermath-t4", [
    ["gpt-5-6-sol", 83.0], ["gpt-5-6-terra", 68.3], ["gpt-5-6-luna", 58.5], ["gpt-5-5", 72.5],
    ["claude-fable-5", 87.8], ["claude-opus-4-8", 56.1]
  ], "%", "v2");
  
  batch(oa56, "automationbench", [
    ["gpt-5-6-sol", 18.1], ["gpt-5-6-terra", 15.2], ["gpt-5-6-luna", 14.9], ["gpt-5-5", 12.9],
    ["claude-fable-5", 17.4], ["claude-opus-4-8", 15.5], ["gemini-3-5-flash", 14.5]
  ], "%", "OpenAI GPT-5.6 launch table");
  batch(oa56, "toolathlon", [
    ["gpt-5-6-sol", 58.0], ["gpt-5-6-terra", 53.1], ["gpt-5-6-luna", 53.4], ["gpt-5-5", 55.6],
    ["claude-mythos-5", 61.7], ["claude-mythos-preview", 61.1], ["claude-fable-5", 61.7],
    ["claude-opus-4-8", 59.9], ["gemini-3-1-pro", 48.8]
  ], "%", "OpenAI GPT-5.6 launch table");
  
  batch(oa56, "mrcr-v2-8needle", [
    ["gpt-5-6-sol", 91.5], ["gpt-5-6-terra", 89.6], ["gpt-5-6-luna", 41.3], ["gpt-5-5", 81.5]
  ], "%", "256K-512K");
  batch(oa56, "mrcr-v2-8needle", [
    ["gpt-5-6-sol", 73.8], ["gpt-5-6-terra", 72.5], ["gpt-5-6-luna", 41.3], ["gpt-5-5", 74.0]
  ], "%", "512K-1M");
  batch(oa56, "graphwalks-bfs", [
    ["gpt-5-6-sol", 90.7], ["gpt-5-6-terra", 76.9], ["gpt-5-6-luna", 81.3], ["gpt-5-5", 73.7],
    ["claude-mythos-5", 91.1], ["claude-mythos-preview", 85.7], ["claude-opus-4-8", 85.9]
  ], "%", "256K · F1");
  batch(oa56, "graphwalks-bfs", [
    ["gpt-5-6-sol", 77.1], ["gpt-5-6-terra", 71.2], ["gpt-5-6-luna", 51.2], ["gpt-5-5", 45.4],
    ["claude-mythos-5", 79.4], ["claude-mythos-preview", 74.3], ["claude-opus-4-8", 68.1]
  ], "%", "1M · F1");
  batch(oa56, "arc-agi-3", [
    ["gpt-5-6-sol", 7.78], ["gpt-5-6-terra", 0.8], ["gpt-5-6-luna", 0.18], ["gpt-5-5", 0.43],
    ["claude-opus-4-8", 1.5], ["gemini-3-1-pro", 0.42]
  ], "%", "OpenAI GPT-5.6 launch table");
  
  const oa54 = ["openai-gpt54"];
  
  batch(oa54, "gdpval", [["gpt-5-4", 83.0], ["gpt-5-4-pro", 82.0], ["gpt-5-3-codex", 70.9], ["gpt-5-2", 70.9], ["gpt-5-2-pro", 74.1]], "%", "wins or ties");
  batch(oa54, "financeagent-v1-1", [["gpt-5-4", 56.0], ["gpt-5-4-pro", 61.5], ["gpt-5-3-codex", 54.0], ["gpt-5-2", 59.5]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "investment-banking-modeling", [["gpt-5-4", 87.3], ["gpt-5-4-pro", 83.6], ["gpt-5-3-codex", 79.3], ["gpt-5-2", 68.4], ["gpt-5-2-pro", 71.7]], "%", "OpenAI internal benchmark");
  batch(oa54, "officeqa", [["gpt-5-4", 68.1], ["gpt-5-3-codex", 65.1], ["gpt-5-2", 63.1]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "swe-bench-pro", [["gpt-5-4", 57.7], ["gpt-5-3-codex", 56.8], ["gpt-5-2", 55.6]], "%", "Public");
  batch(oa54, "terminal-bench-2-0", [["gpt-5-4", 75.1], ["gpt-5-3-codex", 77.3], ["gpt-5-2", 62.2]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "osworld-verified", [["gpt-5-4", 75.0], ["gpt-5-3-codex", 74.0], ["gpt-5-2", 47.3]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "mmmu-pro", [["gpt-5-4", 81.2], ["gpt-5-2", 79.5]], "%", "no tools");
  batch(oa54, "mmmu-pro", [["gpt-5-4", 82.1], ["gpt-5-2", 80.4]], "%", "with tools");
  batch(oa54, "browsecomp", [["gpt-5-4", 82.7], ["gpt-5-4-pro", 89.3], ["gpt-5-3-codex", 77.3], ["gpt-5-2", 65.8], ["gpt-5-2-pro", 77.9]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "mcp-atlas", [["gpt-5-4", 67.2], ["gpt-5-2", 60.6]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "toolathlon", [["gpt-5-4", 54.6], ["gpt-5-3-codex", 51.9], ["gpt-5-2", 45.7]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "tau2-telecom", [["gpt-5-4", 98.9], ["gpt-5-2", 98.7]], "%", "reasoning enabled");
  batch(oa54, "frontier-science-research", [["gpt-5-4", 33.0], ["gpt-5-4-pro", 36.7], ["gpt-5-2", 25.2]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "frontiermath-t1-3", [["gpt-5-4", 47.6], ["gpt-5-4-pro", 50.0], ["gpt-5-2", 40.7]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "frontiermath-t4", [["gpt-5-4", 27.1], ["gpt-5-4-pro", 38.0], ["gpt-5-2", 18.8], ["gpt-5-2-pro", 31.3]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "gpqa-diamond", [["gpt-5-4", 92.8], ["gpt-5-4-pro", 94.4], ["gpt-5-3-codex", 92.6], ["gpt-5-2", 92.4], ["gpt-5-2-pro", 93.2]], "%", "OpenAI GPT-5.4 launch table");
  batch(oa54, "hle", [["gpt-5-4", 39.8], ["gpt-5-4-pro", 42.7], ["gpt-5-2", 34.5], ["gpt-5-2-pro", 36.6]], "%", "no tools");
  batch(oa54, "hle-tools", [["gpt-5-4", 52.1], ["gpt-5-4-pro", 58.7], ["gpt-5-2", 45.5], ["gpt-5-2-pro", 50.0]], "%", "with tools");
  
  batch(oa54, "graphwalks-bfs", [["gpt-5-4", 93.0], ["gpt-5-2", 94.0]], "%", "0K-128K · F1");
  add(oa54, "graphwalks-bfs", "gpt-5-4", 21.4, "%", "256K-1M · F1");
  batch(oa54, "graphwalks-parents", [["gpt-5-4", 89.8], ["gpt-5-2", 89.0]], "%", "0K-128K · accuracy");
  add(oa54, "graphwalks-parents", "gpt-5-4", 32.4, "%", "256K-1M · accuracy");
  for (const [range, score54, score52] of [
    ["4K-8K", 97.3, 98.2], ["8K-16K", 91.4, 89.3], ["16K-32K", 97.2, 95.3],
    ["32K-64K", 90.5, 92.0], ["64K-128K", 86.0, 85.6], ["128K-256K", 79.3, 77.0]
  ]) {
    batch(oa54, "mrcr-v2-8needle", [["gpt-5-4", score54], ["gpt-5-2", score52]], "%", range);
  }
  add(oa54, "mrcr-v2-8needle", "gpt-5-4", 57.5, "%", "256K-512K");
  add(oa54, "mrcr-v2-8needle", "gpt-5-4", 36.6, "%", "512K-1M");
  
  batch(oa54, "arc-agi-1", [["gpt-5-4", 93.7], ["gpt-5-4-pro", 94.5], ["gpt-5-2", 86.2], ["gpt-5-2-pro", 90.5]], "%", "Verified");
  batch(oa54, "arc-agi-2", [["gpt-5-4", 73.3], ["gpt-5-4-pro", 83.3], ["gpt-5-2", 52.9], ["gpt-5-2-pro", 54.2, "Verified · high effort"]], "%", "Verified");
  batch(oa54, "omnidocbench", [["gpt-5-4", 0.109], ["gpt-5-2", 0.140]], "NED", "no reasoning");
  batch(oa54, "tau2-telecom", [["gpt-5-4", 64.3], ["gpt-5-2", 57.2]], "%", "no reasoning");
  
  add(oa54, "webarena-verified", "gpt-5-4", 67.3, "%", "DOM + screenshot interaction", "Scored prose statement");
  add(oa54, "webarena-verified", "gpt-5-2", 65.4, "%", "DOM + screenshot interaction", "Scored prose comparison");
  add(oa54, "online-mind2web", "gpt-5-4", 92.8, "%", "screenshot observations only", "Scored prose statement");
  add(oa54, "biglaw-bench", "gpt-5-4", 91.0, "%", "Harvey evaluation", "Third-party result quoted on the OpenAI launch page");
  
  appendUnique(benchmarks, [
    { id: "cursorbench-3-2", name: "CursorBench 3.2", category: "编码", direction: "higher", description: "Cursor 发布的软件工程 Agent 评测；版本与 harness 写入 setting。" }
  ]);
  
  // ---------------------------------------------------------------------------
  // 6. Anthropic first-party launch and System Card capability results
  // ---------------------------------------------------------------------------
  
  const an51Launch = ["anthropic-fable51"];
  batch(an51Launch, "terminal-bench-4-0", [
    ["claude-fable-5-1", 55.8, "Fable · Anthropic launch setting"],
    ["claude-mythos-5-1", 60.9, "Mythos · Anthropic launch setting"],
    ["claude-fable-5", 42.0], ["claude-opus-5", 52.3], ["gpt-5-6-sol", 37.3]
  ], "%", "Anthropic Fable/Mythos 5.1 launch table");
  batch(an51Launch, "terminal-bench-science", [
    ["claude-fable-5-1", 52.6], ["claude-fable-5", 24.7], ["claude-opus-5", 29.0], ["gpt-5-6-sol", 22.4]
  ], "%", "Claude Code harness");
  batch(an51Launch, "gdpval-aa-v2", [
    ["claude-fable-5-1", 1853], ["claude-fable-5", 1723], ["claude-opus-5", 1824], ["gpt-5-6-sol", 1711]
  ], "Elo", "Anthropic Fable/Mythos 5.1 launch table");
  batch(an51Launch, "osworld-2-partial", [["claude-fable-5-1", 77.9], ["claude-fable-5", 72.9], ["claude-opus-5", 75.4]], "%", "2026-08 task set · partial");
  batch(an51Launch, "osworld-2-strict", [["claude-fable-5-1", 41.7], ["claude-fable-5", 36.1], ["claude-opus-5", 39.6]], "%", "2026-08 task set · strict");
  batch(an51Launch, "hle", [["claude-fable-5-1", 60.9], ["claude-fable-5", 57.8], ["claude-opus-5", 56.6]], "%", "no tools");
  batch(an51Launch, "hle-tools", [["claude-fable-5-1", 65.0], ["claude-fable-5", 63.8], ["claude-opus-5", 63.6]], "%", "with tools");
  batch(an51Launch, "automationbench", [["claude-fable-5-1", 31.4], ["claude-fable-5", 17.1], ["claude-opus-5", 26.9], ["gpt-5-6-sol", 19.6]], "%", "Anthropic Fable/Mythos 5.1 launch table");
  batch(an51Launch, "cursorbench-3-2", [["claude-fable-5-1", 73.4], ["claude-fable-5", 70.5], ["claude-opus-5", 70.0], ["gpt-5-6-sol", 67.2]], "%", "Anthropic Fable/Mythos 5.1 launch table");
  
  const an51 = ["anthropic-fable51-system-card"];
  const an51Setting = "System Card capability summary · adaptive thinking · max effort · default sampling · 5 trials · context ≤1M unless noted";
  
  batch(an51, "swe-bench-pro", [
    ["claude-fable-5-1", 81.2], ["claude-mythos-5-1", 81.2], ["claude-fable-5", 80.0],
    ["claude-mythos-5", 80.0], ["claude-opus-5", 79.2], ["gpt-5-6-sol", 64.6]
  ], "%", an51Setting);
  batch(an51, "swe-multilingual", [
    ["claude-fable-5-1", 89.1], ["claude-mythos-5-1", 89.1], ["claude-fable-5", 86.6],
    ["claude-mythos-5", 86.6], ["claude-opus-5", 89.5]
  ], "%", an51Setting);
  batch(an51, "swe-multimodal", [
    ["claude-fable-5-1", 54.7], ["claude-mythos-5-1", 54.7], ["claude-fable-5", 54.1],
    ["claude-mythos-5", 54.1], ["claude-opus-5", 59.4]
  ], "%", an51Setting);
  batch(an51, "terminal-bench-4-0", [
    ["claude-fable-5-1", 56.0, `${an51Setting} · Fable`],
    ["claude-mythos-5-1", 61.0, `${an51Setting} · Mythos`],
    ["claude-fable-5", 42.0, `${an51Setting} · Fable`],
    ["claude-mythos-5", 45.0, `${an51Setting} · Mythos`],
    ["claude-opus-5", 52.0, an51Setting], ["gpt-5-6-sol", 37.0, an51Setting]
  ]);
  batch(an51, "terminal-bench-science", [
    ["claude-fable-5-1", 52.6], ["claude-mythos-5-1", 52.6], ["claude-fable-5", 24.7],
    ["claude-mythos-5", 24.7], ["claude-opus-5", 29.0], ["gpt-5-6-sol", 22.4]
  ], "%", an51Setting);
  batch(an51, "hle", [
    ["claude-fable-5-1", 60.9], ["claude-mythos-5-1", 60.9], ["claude-fable-5", 57.8],
    ["claude-mythos-5", 57.8], ["claude-opus-5", 56.6]
  ], "%", `${an51Setting} · no tools`);
  batch(an51, "hle-tools", [
    ["claude-fable-5-1", 65.0], ["claude-mythos-5-1", 65.0], ["claude-fable-5", 63.8],
    ["claude-mythos-5", 63.8], ["claude-opus-5", 63.6]
  ], "%", `${an51Setting} · with tools`);
  batch(an51, "osworld-2-partial", [
    ["claude-fable-5-1", 77.9], ["claude-mythos-5-1", 77.9], ["claude-fable-5", 72.9],
    ["claude-mythos-5", 72.9], ["claude-opus-5", 75.4]
  ], "%", `${an51Setting} · partial`);
  batch(an51, "osworld-2-strict", [
    ["claude-fable-5-1", 41.7], ["claude-mythos-5-1", 41.7], ["claude-fable-5", 36.1],
    ["claude-mythos-5", 36.1], ["claude-opus-5", 39.6]
  ], "%", `${an51Setting} · strict`);
  batch(an51, "healthbench-professional", [
    ["claude-fable-5-1", 62.1], ["claude-mythos-5-1", 62.1], ["claude-fable-5", 63.3],
    ["claude-mythos-5", 63.3], ["claude-opus-5", 59.8]
  ], "%", an51Setting);
  batch(an51, "gdpval-aa-v2", [
    ["claude-fable-5-1", 1853], ["claude-mythos-5-1", 1853], ["claude-fable-5", 1723],
    ["claude-mythos-5", 1723], ["claude-opus-5", 1824], ["gpt-5-6-sol", 1711]
  ], "Elo", an51Setting);
  batch(an51, "aa-briefcase", [
    ["claude-fable-5-1", 1694], ["claude-mythos-5-1", 1694], ["claude-fable-5", 1572],
    ["claude-mythos-5", 1572], ["claude-opus-5", 1685], ["gpt-5-6-sol", 1502]
  ], "Score", an51Setting);
  batch(an51, "automationbench", [
    ["claude-fable-5-1", 31.4], ["claude-mythos-5-1", 31.4], ["claude-fable-5", 17.1],
    ["claude-mythos-5", 17.1], ["claude-opus-5", 26.9], ["gpt-5-6-sol", 19.6]
  ], "%", an51Setting);
  batch(an51, "arc-agi-1", [
    ["claude-fable-5-1", 97.5], ["claude-mythos-5-1", 97.5], ["claude-fable-5", 98.5],
    ["claude-mythos-5", 98.5], ["claude-opus-5", 97.5], ["gpt-5-6-sol", 96.5]
  ], "%", an51Setting);
  batch(an51, "arc-agi-2", [
    ["claude-fable-5-1", 90.0], ["claude-mythos-5-1", 90.0], ["claude-fable-5", 89.2],
    ["claude-mythos-5", 89.2], ["claude-opus-5", 90.42], ["gpt-5-6-sol", 92.5]
  ], "%", an51Setting);
  
  const anOpus5 = ["anthropic-opus5-system-card"];
  const anOpus5Setting = "Opus 5 System Card capability summary · adaptive thinking · max effort unless noted";
  
  batch(anOpus5, "swe-bench-pro", [["claude-opus-5", 79.2], ["claude-opus-4-8", 69.2], ["claude-fable-5", 80.0], ["gpt-5-6-sol", 64.6]], "%", anOpus5Setting);
  batch(anOpus5, "swe-multilingual", [["claude-opus-5", 89.5], ["claude-opus-4-8", 84.4], ["claude-fable-5", 86.6]], "%", anOpus5Setting);
  batch(anOpus5, "swe-multimodal", [["claude-opus-5", 59.4], ["claude-opus-4-8", 38.4], ["claude-fable-5", 54.1]], "%", anOpus5Setting);
  batch(anOpus5, "deepswe-v1-1", [["claude-opus-5", 68.8], ["claude-opus-4-8", 59.0], ["claude-fable-5", 69.7], ["gpt-5-6-sol", 72.7]], "%", anOpus5Setting);
  batch(anOpus5, "frontiercode-1-1-main", [["claude-opus-5", 53.4], ["claude-opus-4-8", 46.5], ["claude-fable-5", 53.5], ["gpt-5-6-sol", 47.5]], "%", anOpus5Setting);
  batch(anOpus5, "frontierbench-v0-1", [
    ["claude-opus-5", 43.3, "Harbor-reported"], ["claude-opus-5", 44.4, "Anthropic self-run · xhigh"],
    ["claude-opus-4-8", 21.1], ["claude-fable-5", 33.8], ["gpt-5-6-sol", 34.4, "Codex"]
  ], "%", anOpus5Setting);
  batch(anOpus5, "browsecomp", [["claude-opus-5", 90.8], ["claude-opus-4-8", 84.3], ["claude-fable-5", 87.4], ["gpt-5-6-sol", 90.4]], "%", anOpus5Setting);
  batch(anOpus5, "hle", [["claude-opus-5", 56.3], ["claude-opus-4-8", 49.8], ["claude-fable-5", 56.5]], "%", `${anOpus5Setting} · no tools`);
  batch(anOpus5, "hle-tools", [["claude-opus-5", 64.7], ["claude-opus-4-8", 57.9], ["claude-fable-5", 63.9]], "%", `${anOpus5Setting} · with tools`);
  batch(anOpus5, "osworld-2", [["claude-opus-5", 70.6], ["claude-opus-4-8", 55.7], ["claude-fable-5", 66.1], ["gpt-5-6-sol", 62.6]], "%", "Opus 5 System Card setting");
  batch(anOpus5, "healthbench-professional", [["claude-opus-5", 59.8], ["claude-opus-4-8", 57.4], ["claude-fable-5", 66.0], ["gpt-5-6-sol", 60.5]], "%", anOpus5Setting);
  batch(anOpus5, "gdpval-aa-v2", [["claude-opus-5", 1861], ["claude-opus-4-8", 1593], ["claude-fable-5", 1747], ["gpt-5-6-sol", 1736]], "Elo", anOpus5Setting);
  batch(anOpus5, "aa-briefcase", [["claude-opus-5", 1720], ["claude-opus-4-8", 1346], ["claude-fable-5", 1574], ["gpt-5-6-sol", 1505]], "Score", anOpus5Setting);
  batch(anOpus5, "automationbench", [["claude-opus-5", 26.0], ["claude-opus-4-8", 17.0], ["claude-fable-5", 17.4], ["gpt-5-6-sol", 18.1]], "%", anOpus5Setting);
  batch(anOpus5, "arc-agi-1", [["claude-opus-5", 97.5], ["claude-opus-4-8", 92.5], ["gpt-5-6-sol", 97.5, "xhigh"]], "%", anOpus5Setting);
  batch(anOpus5, "arc-agi-2", [["claude-opus-5", 90.4], ["claude-opus-4-8", 72.1], ["gpt-5-6-sol", 92.5]], "%", anOpus5Setting);
  
  const anFable5 = ["anthropic-fable5-system-card"];
  const anFable5Setting = "Fable/Mythos 5 System Card capability summary · adaptive thinking · max effort · 5 trials unless noted";
  
  batch(anFable5, "swe-bench-pro", [["claude-mythos-5", 80.3], ["claude-fable-5", 80.0], ["claude-mythos-preview", 77.8], ["claude-opus-4-8", 69.2], ["gpt-5-5", 58.6], ["gemini-3-1-pro", 54.2]], "%", anFable5Setting);
  batch(anFable5, "swe-bench-verified", [["claude-mythos-5", 95.5], ["claude-fable-5", 95.0], ["claude-mythos-preview", 93.9], ["claude-opus-4-8", 88.6], ["gemini-3-1-pro", 80.6]], "%", anFable5Setting);
  batch(anFable5, "terminal-bench-2-1", [["claude-mythos-5", 88.0], ["claude-fable-5", 84.3], ["claude-opus-4-8", 82.7], ["gpt-5-5", 83.4, "Codex CLI"], ["gemini-3-1-pro", 70.7, "Gemini CLI"]], "%", anFable5Setting);
  batch(anFable5, "browsecomp", [
    ["claude-mythos-5", 88.0, "single-agent"], ["claude-mythos-5", 93.3, "multi-agent"],
    ["claude-mythos-preview", 87.9], ["claude-opus-4-8", 84.3, "single-agent"],
    ["claude-opus-4-8", 88.5, "multi-agent"], ["gpt-5-5", 84.4], ["gemini-3-1-pro", 85.9]
  ], "%", anFable5Setting);
  batch(anFable5, "hle", [["claude-mythos-5", 59.0], ["claude-mythos-preview", 56.8], ["claude-opus-4-8", 49.8], ["gpt-5-5", 41.4], ["gemini-3-1-pro", 44.4]], "%", `${anFable5Setting} · no tools`);
  batch(anFable5, "hle-tools", [["claude-mythos-5", 64.5], ["claude-mythos-preview", 64.7], ["claude-opus-4-8", 57.9], ["gpt-5-5", 52.2], ["gemini-3-1-pro", 51.4]], "%", `${anFable5Setting} · with tools`);
  batch(anFable5, "charxiv", [["claude-mythos-5", 88.9], ["claude-mythos-preview", 86.2], ["claude-opus-4-8", 80.5]], "%", `${anFable5Setting} · reasoning · no tools`);
  batch(anFable5, "charxiv", [["claude-mythos-5", 93.5], ["claude-mythos-preview", 92.5], ["claude-opus-4-8", 89.9]], "%", `${anFable5Setting} · reasoning · with tools`);
  batch(anFable5, "biomysterybench", [["claude-mythos-5", 83.9], ["claude-mythos-preview", 82.6], ["claude-opus-4-8", 80.4]], "%", `${anFable5Setting} · Human`);
  batch(anFable5, "biomysterybench", [["claude-mythos-5", 46.1], ["claude-mythos-preview", 29.6], ["claude-opus-4-8", 40.0]], "%", `${anFable5Setting} · Hard`);
  batch(anFable5, "osworld-verified", [["claude-mythos-5", 85.0], ["claude-fable-5", 85.0], ["claude-mythos-preview", 85.4], ["claude-opus-4-8", 83.4], ["gpt-5-5", 78.7], ["gemini-3-1-pro", 76.2], ["gemini-3-5-flash", 78.4]], "%", "Fable/Mythos 5 System Card setting");
  batch(anFable5, "critpt", [["claude-mythos-5", 28.6], ["claude-mythos-preview", 20.9], ["claude-opus-4-8", 27.1], ["gpt-5-5", 17.7]], "%", anFable5Setting);
  batch(anFable5, "arxivmath", [["claude-mythos-5", 78.5], ["claude-mythos-preview", 68.7], ["claude-opus-4-8", 71.8], ["gpt-5-5", 71.5], ["gemini-3-1-pro", 64.8]], "%", anFable5Setting);
  batch(anFable5, "riemannbench", [["claude-mythos-5", 55.0], ["claude-mythos-preview", 43.0], ["claude-opus-4-8", 34.0]], "%", anFable5Setting);
  batch(anFable5, "graphwalks-bfs", [["claude-mythos-5", 91.1], ["claude-mythos-preview", 85.7], ["claude-opus-4-8", 85.9], ["gpt-5-5", 73.7]], "%", `${anFable5Setting} · 256K · F1`);
  batch(anFable5, "graphwalks-parents", [["claude-mythos-5", 99.96], ["claude-mythos-preview", 99.9], ["claude-opus-4-8", 99.3], ["gpt-5-5", 90.1]], "%", `${anFable5Setting} · 256K · accuracy`);
  batch(anFable5, "frontiercode-diamond", [["claude-fable-5", 29.3], ["claude-opus-4-8", 13.4], ["gpt-5-5", 5.7]], "%", `${anFable5Setting} · Diamond subset`);
  batch(anFable5, "gdpval-aa-v2", [["claude-fable-5", 1932], ["claude-opus-4-8", 1890], ["gpt-5-5", 1769], ["gemini-3-1-pro", 1314]], "Elo", anFable5Setting);
  batch(anFable5, "gdp-pdf", [["claude-fable-5", 29.8], ["claude-opus-4-8", 22.5], ["gpt-5-5", 24.9], ["gemini-3-1-pro", 16.7]], "%", anFable5Setting);
  batch(anFable5, "officeqa-pro", [["claude-fable-5", 57.9], ["claude-opus-4-8", 48.1], ["gpt-5-5", 52.6], ["gemini-3-1-pro", 18.1]], "%", anFable5Setting);
  batch(anFable5, "automationbench", [["claude-fable-5", 17.4], ["claude-opus-4-8", 15.5], ["gpt-5-5", 12.9], ["gemini-3-1-pro", 9.6], ["gemini-3-5-flash", 14.5]], "%", anFable5Setting);
  batch(anFable5, "blueprint-bench-2", [["claude-fable-5", 38.6], ["claude-opus-4-8", 14.5], ["gpt-5-5", 36.2], ["gemini-3-1-pro", 26.5], ["gemini-3-5-flash", 33.6]], "%", anFable5Setting);
  batch(anFable5, "legal-agent-public", [["claude-mythos-5", 16.9], ["claude-mythos-preview", 13.4], ["claude-opus-4-8", 9.6]], "%", anFable5Setting);
  batch(anFable5, "harvey-legal-heldout", [["claude-fable-5", 13.3], ["claude-opus-4-8", 10.4], ["gpt-5-5", 2.1], ["gemini-3-1-pro", 0.0], ["gemini-3-5-flash", 0.8]], "%", anFable5Setting);
  batch(anFable5, "healthbench", [["claude-mythos-5", 62.7], ["claude-mythos-preview", 61.1], ["claude-opus-4-8", 59.3], ["gpt-5-5", 56.5]], "%", anFable5Setting);
  batch(anFable5, "healthbench-professional", [["claude-mythos-5", 66.0], ["claude-mythos-preview", 64.7], ["claude-opus-4-8", 56.9], ["gpt-5-5", 51.8]], "%", anFable5Setting);
  
  const anOpus48 = ["anthropic-opus48-system-card"];
  const anOpus48Setting = "Opus 4.8 System Card capability summary · adaptive thinking · max effort · 5 trials unless noted";
  
  batch(anOpus48, "swe-bench-verified", [["claude-opus-4-8", 88.6], ["claude-opus-4-7", 87.6], ["gemini-3-1-pro", 80.6]], "%", anOpus48Setting);
  batch(anOpus48, "swe-bench-pro", [["claude-opus-4-8", 69.2], ["claude-opus-4-7", 64.3], ["gpt-5-5", 58.6], ["gemini-3-1-pro", 54.2]], "%", anOpus48Setting);
  batch(anOpus48, "swe-multilingual", [["claude-opus-4-8", 84.4], ["claude-opus-4-7", 80.5]], "%", anOpus48Setting);
  batch(anOpus48, "swe-multimodal", [["claude-opus-4-8", 38.4], ["claude-opus-4-7", 34.5]], "%", anOpus48Setting);
  batch(anOpus48, "browsecomp", [["claude-opus-4-8", 84.3, "single-agent"], ["claude-opus-4-8", 88.5, "multi-agent"], ["claude-opus-4-7", 79.8], ["gpt-5-5", 84.4], ["gemini-3-1-pro", 85.9]], "%", anOpus48Setting);
  batch(anOpus48, "terminal-bench-2-1", [["claude-opus-4-8", 74.6], ["claude-opus-4-7", 66.1], ["gpt-5-5", 78.2], ["gemini-3-1-pro", 70.3]], "%", anOpus48Setting);
  batch(anOpus48, "hle", [["claude-opus-4-8", 49.8], ["claude-opus-4-7", 46.9], ["gpt-5-5", 41.4], ["gemini-3-1-pro", 44.4]], "%", `${anOpus48Setting} · no tools`);
  batch(anOpus48, "hle-tools", [["claude-opus-4-8", 57.9], ["claude-opus-4-7", 54.7], ["gpt-5-5", 52.2], ["gemini-3-1-pro", 51.4]], "%", `${anOpus48Setting} · with tools`);
  batch(anOpus48, "chartqapro", [["claude-opus-4-8", 69.4], ["claude-opus-4-7", 67.6]], "%", `${anOpus48Setting} · no tools`);
  batch(anOpus48, "chartqapro", [["claude-opus-4-8", 72.3], ["claude-opus-4-7", 69.8]], "%", `${anOpus48Setting} · with tools`);
  batch(anOpus48, "osworld-verified", [["claude-opus-4-8", 83.4], ["claude-opus-4-7", 82.8], ["gpt-5-5", 78.7], ["gemini-3-1-pro", 76.2], ["gemini-3-5-flash", 78.4]], "%", "Opus 4.8 System Card setting");
  batch(anOpus48, "gpqa-diamond", [["claude-opus-4-8", 93.6], ["claude-opus-4-7", 94.2], ["gemini-3-1-pro", 94.3]], "%", anOpus48Setting);
  batch(anOpus48, "screenspot-pro", [["claude-opus-4-8", 82.3], ["claude-opus-4-7", 79.5]], "%", `${anOpus48Setting} · no tools`);
  batch(anOpus48, "screenspot-pro", [["claude-opus-4-8", 87.9], ["claude-opus-4-7", 87.6]], "%", `${anOpus48Setting} · with tools`);
  batch(anOpus48, "financeagent-v2", [["claude-opus-4-8", 53.9], ["claude-opus-4-7", 51.5], ["gpt-5-5", 51.8], ["gemini-3-1-pro", 43.0], ["gemini-3-5-flash", 57.9]], "%", anOpus48Setting);
  batch(anOpus48, "gdpval-aa-v2", [["claude-opus-4-8", 1890], ["claude-opus-4-7", 1753], ["gpt-5-5", 1769], ["gemini-3-1-pro", 1314]], "Elo", anOpus48Setting);
  batch(anOpus48, "mcp-atlas", [["claude-opus-4-8", 82.2], ["claude-opus-4-7", 79.1], ["gpt-5-5", 75.3], ["gemini-3-1-pro", 78.2], ["gemini-3-5-flash", 83.6]], "%", anOpus48Setting);
  batch(anOpus48, "automationbench", [["claude-opus-4-8", 15.5], ["claude-opus-4-7", 9.9], ["gpt-5-5", 12.9], ["gemini-3-1-pro", 9.6], ["gemini-3-5-flash", 14.5]], "%", anOpus48Setting);
  batch(anOpus48, "graphwalks-bfs", [["claude-opus-4-8", 85.9], ["claude-opus-4-7", 76.9], ["gpt-5-5", 73.7]], "%", `${anOpus48Setting} · 256K · F1`);
  batch(anOpus48, "graphwalks-parents", [["claude-opus-4-8", 99.3], ["claude-opus-4-7", 93.6], ["gpt-5-5", 90.1]], "%", `${anOpus48Setting} · 256K · accuracy`);
  
  const anOpus46 = ["anthropic-opus46-system-card"];
  const anOpus46Setting = "Opus 4.6 System Card capability summary · adaptive thinking · max effort · default sampling · 5 trials unless noted";
  
  batch(anOpus46, "swe-bench-verified", [["claude-opus-4-6", 80.8], ["claude-opus-4-5", 80.9], ["claude-sonnet-4-5", 77.2], ["gemini-3-pro", 76.2], ["gpt-5-2", 80.0]], "%", anOpus46Setting);
  batch(anOpus46, "terminal-bench-2-0", [["claude-opus-4-6", 65.4], ["claude-opus-4-5", 59.8], ["claude-sonnet-4-5", 51.0], ["gemini-3-pro", 56.2], ["gpt-5-2", 64.7]], "%", anOpus46Setting);
  batch(anOpus46, "tau2-retail", [["claude-opus-4-6", 91.9], ["claude-opus-4-5", 88.9], ["claude-sonnet-4-5", 86.2], ["gemini-3-pro", 85.3], ["gpt-5-2", 82.0]], "%", anOpus46Setting);
  batch(anOpus46, "tau2-telecom", [["claude-opus-4-6", 99.3], ["claude-opus-4-5", 98.2], ["claude-sonnet-4-5", 98.0], ["gemini-3-pro", 98.0], ["gpt-5-2", 98.7]], "%", anOpus46Setting);
  batch(anOpus46, "mcp-atlas", [["claude-opus-4-6", 59.5], ["claude-opus-4-5", 62.3], ["claude-sonnet-4-5", 43.8], ["gemini-3-pro", 54.1], ["gpt-5-2", 60.6]], "%", anOpus46Setting);
  batch(anOpus46, "osworld-verified", [["claude-opus-4-6", 72.7], ["claude-opus-4-5", 66.3], ["claude-sonnet-4-5", 61.4]], "%", "Opus 4.6 System Card setting");
  batch(anOpus46, "arc-agi-2", [["claude-opus-4-6", 68.8], ["claude-opus-4-5", 37.6], ["claude-sonnet-4-5", 13.6], ["gemini-3-pro", 45.1, "Deep Thinking"], ["gpt-5-2", 54.2]], "%", `${anOpus46Setting} · Verified`);
  batch(anOpus46, "gpqa-diamond", [["claude-opus-4-6", 91.3], ["claude-opus-4-5", 87.0], ["claude-sonnet-4-5", 83.4], ["gemini-3-pro", 91.9], ["gpt-5-2", 93.2]], "%", anOpus46Setting);
  batch(anOpus46, "mmmu-pro", [["claude-opus-4-6", 73.9], ["claude-opus-4-5", 70.6], ["claude-sonnet-4-5", 63.4], ["gemini-3-pro", 81.0], ["gpt-5-2", 79.5]], "%", `${anOpus46Setting} · no tools`);
  batch(anOpus46, "mmmu-pro", [["claude-opus-4-6", 77.3], ["claude-opus-4-5", 73.9], ["claude-sonnet-4-5", 68.9], ["gpt-5-2", 80.4]], "%", `${anOpus46Setting} · with tools`);
  batch(anOpus46, "mmmlu", [["claude-opus-4-6", 91.1], ["claude-opus-4-5", 90.8], ["claude-sonnet-4-5", 89.5], ["gemini-3-pro", 91.8], ["gpt-5-2", 89.6]], "%", anOpus46Setting);
  batch(anOpus46, "openrca", [["claude-opus-4-6", 33.6]], "%", `${anOpus46Setting} · Market`);
  batch(anOpus46, "openrca", [["claude-opus-4-6", 37.3]], "%", `${anOpus46Setting} · Banking`);
  batch(anOpus46, "openrca", [["claude-opus-4-6", 32.7]], "%", `${anOpus46Setting} · Telecom`);
  batch(anOpus46, "openrca", [["claude-opus-4-6", 34.9]], "%", `${anOpus46Setting} · Overall`);
  add(anOpus46, "arc-agi-1", "claude-opus-4-6", 94.00, "%", "high effort", "System Card prose result");
  add(anOpus46, "arc-agi-2", "claude-opus-4-6", 69.17, "%", "120K thinking tokens · high effort", "System Card prose result; retain separately from 68.8 summary-table setting");

  // ---------------------------------------------------------------------------
  // 7. GPT-6 Astra for Work: hidden chart points + scored prose
  // ---------------------------------------------------------------------------

  // The page's Terminal-Bench chart identifies the three already-present headline
  // scores as High (Astra) and Max (Sol/Fable 5.1), with Code vs Non-code modes.
  for (const observation of observations) {
    if (!(observation.sourceIds || []).includes("openai-astra-work") || observation.benchmarkId !== "terminal-bench-4-0") continue;
    if (observation.modelId === "gpt-6-astra" && observation.value === 57.9) observation.setting = "Code · high effort · chart displays 57.9% (raw 57.8788%)";
    if (observation.modelId === "gpt-5-6-sol" && observation.value === 37.3) observation.setting = "Non-code · max effort · chart displays 37.3% (raw 37.2727%)";
    if (observation.modelId === "claude-fable-5-1" && observation.value === 55.8) observation.setting = "Non-code · max effort";
  }

  batch(["openai-astra-work"], "terminal-bench-4-0", [
    ["gpt-6-astra", 49.7, "Code · low effort", "Raw chart value: 49.696969696969695%"],
    ["gpt-6-astra", 53.9, "Code · medium effort", "Raw chart value: 53.93939393939394%"],
    ["gpt-6-astra", 57.6, "Code · x-high effort", "Raw chart value: 57.57575757575758%"],
    ["gpt-6-astra", 56.7, "Code · max effort", "Raw chart value: 56.66666666666667%"],
    ["gpt-5-6-sol", 7.9, "Non-code · low effort", "Raw chart value: 7.878787879%"],
    ["gpt-5-6-sol", 20.9, "Non-code · medium effort", "Raw chart value: 20.909090909%"],
    ["gpt-5-6-sol", 26.1, "Non-code · high effort", "Raw chart value: 26.060606061%"],
    ["gpt-5-6-sol", 28.5, "Non-code · x-high effort", "Raw chart value: 28.484848485%"],
    ["claude-fable-5-1", 40.2, "Non-code · low effort"],
    ["claude-fable-5-1", 43.4, "Non-code · medium effort"],
    ["claude-fable-5-1", 49.4, "Non-code · high effort"],
    ["claude-fable-5-1", 51.3, "Non-code · x-high effort"],
    ["claude-fable-5", 44.5, "Non-code · max effort", "Raw chart value: 44.545454545454544%; description also states 44.55%"],
    ["claude-opus-5", 52.6, "Non-code · max effort", "Raw chart value: 52.58358662613982%"]
  ], "%", "GPT-6 Astra for Work · Terminal-Bench 4.0 chart");

  add(["openai-astra-work"], "deepswe-v1-1", "gpt-6-astra", 74, "%", "rounded prose result", "Page quote: ‘Astra sets a new record on DeepSWE v1.1 at 74%.’ The main Astra launch page reports 74.1%, so retain both source-specific values.");
  
  // Re-number generated observation IDs after replacing stale source-specific rows.
  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });

  const auditedSourceNotes = {
    "openai-gpt54": "发布页能力表已录入；Deployment/System Card 的安全与稳健性表另行审计。",
    "openai-gpt54-system-card": "已登记并核对能力相关条目；安全、对齐与稳健性附录尚未逐表录入。",
    "openai-gpt56-system-card": "已登记；安全、对齐与稳健性表尚未逐表录入。",
    "openai-astra-system-card": "已登记；安全、对齐与稳健性表尚未逐表录入。",
    "anthropic-fable51-system-card": "能力总表已录入；安全、对齐与行为附录尚未逐表录入。",
    "anthropic-opus5": "模型发布页已登记；能力成绩以同日 System Card 为主，页面其余数值仍待核。",
    "anthropic-opus5-system-card": "能力总表已录入；安全、对齐与行为附录尚未逐表录入。",
    "anthropic-fable5": "模型发布页已登记；能力成绩以同日 System Card 为主，页面其余数值仍待核。",
    "anthropic-fable5-system-card": "能力总表已录入；安全、对齐与行为附录尚未逐表录入。",
    "anthropic-opus48": "模型发布页已登记；能力成绩以同日 System Card 为主，页面其余数值仍待核。",
    "anthropic-opus48-system-card": "能力总表已录入；安全、对齐与行为附录尚未逐表录入。",
    "anthropic-opus46": "模型发布页已登记；能力成绩以同日 System Card 为主，页面其余数值仍待核。",
    "anthropic-opus46-system-card": "能力总表已录入；安全、对齐与行为附录尚未逐表录入。"
  };
  for (const [sourceId, note] of Object.entries(auditedSourceNotes)) {
    const current = sourceAudits.find((audit) => audit.sourceId === sourceId);
    if (current) Object.assign(current, { status: "partial", auditedAt: "2026-09-20", note });
    else sourceAudits.push({ sourceId, status: "partial", auditedAt: "2026-09-20", note });
  }
  for (const sourceId of ["openai-astra", "openai-gpt56", "anthropic-fable51"]) {
    const current = sourceAudits.find((audit) => audit.sourceId === sourceId);
    if (current) Object.assign(current, {
      status: "partial",
      auditedAt: "2026-09-20",
      note: "主要能力表已整表核对；安全、对齐或附录类数值尚未全部纳入，因此不标记整源完成。"
    });
  }
  const astraWorkAudit = sourceAudits.find((audit) => audit.sourceId === "openai-astra-work");
  if (astraWorkAudit) Object.assign(astraWorkAudit, {
    status: "complete",
    auditedAt: "2026-09-20",
    expectedObservationCount: 29,
    benchmarkIds: ["terminal-bench-4-0", "artificial-intelligence-index-v4-3", "deepswe-v1-1"],
    note: "发布页两张能力图与 DeepSWE 计分引文已完整核对，共 29 条成绩；Terminal-Bench 的 Code/Non-code 与 effort 原样保留，不推断工具可用性。"
  });

  const capabilityComplete = (sourceId, expectedObservationCount, benchmarkIds, note) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    Object.assign(audit, {
      status: "complete",
      scopeLabel: "能力成绩表已核",
      auditedAt: "2026-09-20",
      expectedObservationCount,
      benchmarkIds,
      note
    });
  };
  capabilityComplete("openai-astra", 138, ["agents-last-exam-score","osworld-2-partial","screenspot-pro","automationbench","benchcad","browsecomp","openscore-string-quartets","internal-design-tasks","internal-data-science-tasks","artificial-intelligence-index","terminal-bench-4-0","deepswe-v1-1","frontiercode-1-1-extended","frontiercode-1-1-main","internal-database-migration","artificial-coding-index","terminal-bench-science","frontiermath-t4","gpqa-diamond","hle-tools","genebench-pro","medchembench","lifescibench","healthbench-professional","exploitbench","exploitgym-rate","exploitbench-2026-jun-aug","sre-bench-1","sec-bench-pro","mrcr-v2-8needle","arc-agi-3","arc-agi-2","arc-agi-1"], "发布页的公开能力成绩表已逐格录入；安全、对齐与部署风险数据保留在 System Card 审计范围，不混入能力榜。");
  capabilityComplete("openai-gpt56", 239, ["frontiermath-t4","mrcr-v2-8needle","agents-last-exam-score","gdpval-aa-v2","management-consulting-tasks","big-finance-bench","artificial-intelligence-index","artificial-coding-index","swe-bench-pro","deepswe-v1-1","terminal-bench-2-1","genebench-pro","lifescibench","medchembench","healthbench-professional","osworld-2","browsecomp","benchcad","capture-the-flag","sec-bench-pro","exploitbench","exploitgym-rate","internal-research-debugging","kernelgen-1p","nanogpt","posttrainbench-lite","rsi-index","mmmu-pro","gdp-pdf","gpqa-diamond","frontiermath-t1-3","automationbench","toolathlon","graphwalks-bfs","arc-agi-3"], "发布页 11 组公开能力表的非空数值已逐格录入；安全、对齐与部署风险数据不混入能力榜。");
  capabilityComplete("openai-gpt54", 101, ["gdpval","financeagent-v1-1","investment-banking-modeling","officeqa","swe-bench-pro","terminal-bench-2-0","osworld-verified","mmmu-pro","browsecomp","mcp-atlas","toolathlon","tau2-telecom","frontier-science-research","frontiermath-t1-3","frontiermath-t4","gpqa-diamond","hle","hle-tools","graphwalks-bfs","graphwalks-parents","mrcr-v2-8needle","arc-agi-1","arc-agi-2","omnidocbench","webarena-verified","online-mind2web","biglaw-bench"], "发布页公开能力矩阵已逐格录入；安全、对齐与部署风险数据不混入能力榜。");
  capabilityComplete("anthropic-fable51", 33, ["hle-tools","terminal-bench-4-0","terminal-bench-science","gdpval-aa-v2","osworld-2-partial","osworld-2-strict","hle","automationbench","cursorbench-3-2"], "发布页公开能力表已逐格录入；安全、对齐与行为评估留在 System Card 范围。");
  capabilityComplete("anthropic-fable51-system-card", 83, ["swe-bench-pro","swe-multilingual","swe-multimodal","terminal-bench-4-0","terminal-bench-science","hle","hle-tools","osworld-2-partial","osworld-2-strict","healthbench-professional","gdpval-aa-v2","aa-briefcase","automationbench","arc-agi-1","arc-agi-2"], "System Card 的能力总表已逐格录入；安全、对齐与行为附录不混入能力榜。");
  capabilityComplete("anthropic-opus5-system-card", 59, ["swe-bench-pro","swe-multilingual","swe-multimodal","deepswe-v1-1","frontiercode-1-1-main","frontierbench-v0-1","browsecomp","hle","hle-tools","osworld-2","healthbench-professional","gdpval-aa-v2","aa-briefcase","automationbench","arc-agi-1","arc-agi-2"], "System Card 的能力总表已逐格录入；安全、对齐与行为附录不混入能力榜。");
  capabilityComplete("anthropic-fable5-system-card", 113, ["swe-bench-pro","swe-bench-verified","terminal-bench-2-1","browsecomp","hle","hle-tools","charxiv","biomysterybench","osworld-verified","critpt","arxivmath","riemannbench","graphwalks-bfs","graphwalks-parents","frontiercode-diamond","gdpval-aa-v2","gdp-pdf","officeqa-pro","automationbench","blueprint-bench-2","legal-agent-public","harvey-legal-heldout","healthbench","healthbench-professional"], "System Card 的能力总表已逐格录入；安全、对齐与行为附录不混入能力榜。");
  capabilityComplete("anthropic-opus48-system-card", 69, ["browsecomp","swe-bench-verified","swe-bench-pro","swe-multilingual","swe-multimodal","terminal-bench-2-1","hle","hle-tools","chartqapro","osworld-verified","gpqa-diamond","screenspot-pro","financeagent-v2","gdpval-aa-v2","mcp-atlas","automationbench","graphwalks-bfs","graphwalks-parents"], "System Card 的能力总表已逐格录入；安全、对齐与行为附录不混入能力榜。");
  capabilityComplete("anthropic-opus46-system-card", 58, ["swe-bench-verified","terminal-bench-2-0","tau2-retail","tau2-telecom","mcp-atlas","osworld-verified","arc-agi-2","gpqa-diamond","mmmu-pro","mmmlu","openrca","arc-agi-1"], "System Card 的能力总表已逐格录入；安全、对齐与行为附录不混入能力榜。");
})();
