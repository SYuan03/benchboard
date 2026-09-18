window.BENCH_DATA = (() => {
  const meta = {
    title: "FrontierBench",
    updated: "2026-09-18",
    scope: "截至 2026-09-18 的领先通用/Agent 模型公开成绩首版"
  };

  const sources = [
    { id: "openai-astra", vendorId: "openai", publisher: "OpenAI", date: "2026-09-01", tier: "official", title: "GPT-6 Astra: A new generation of intelligence", url: "https://openai.com/index/gpt-6-astra/" },
    { id: "openai-gpt56", vendorId: "openai", publisher: "OpenAI", date: "2026-07-09", tier: "official", title: "GPT-5.6: Frontier intelligence that scales with your ambition", url: "https://openai.com/index/gpt-5-6/" },
    { id: "anthropic-fable51", vendorId: "anthropic", publisher: "Anthropic", date: "2026-09-01", tier: "official", title: "Introducing Claude Fable 5.1 and Claude Mythos 5.1", url: "https://www.anthropic.com/claude-fable-and-mythos-5-1" },
    { id: "deepmind-gemini38", vendorId: "google", publisher: "Google DeepMind", date: "2026-09-02", tier: "official", title: "Gemini 3.8 Flash — Model Card", url: "https://deepmind.google/models/model-cards/gemini-3-8-flash/" },
    { id: "deepseek-v41", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-09-10", tier: "official", title: "DeepSeek-V4.1-Flash — Official Model Card", url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash" },
    { id: "zai-glm53", vendorId: "zai", publisher: "Z.ai", date: "2026-08-14", tier: "official", title: "GLM-5.3: Frontier Coding with Emergent Cyber Capabilities", url: "https://z.ai/blog/glm-5.3" },
    { id: "zai-glm53-flash", vendorId: "zai", publisher: "Z.ai", date: "2026-08-26", tier: "official", title: "GLM-5.3-Flash: Frontier Intelligence, Flash Cost", url: "https://z.ai/blog/glm-5.3-flash" },
    { id: "qwen38", vendorId: "alibaba", publisher: "Qwen / Alibaba Cloud", date: "2026-08-03", tier: "official", title: "Qwen3.8-Max: A New Bar for Coding and Cowork", url: "https://www.alibabacloud.com/blog/qwen3-8-max-a-new-bar-for-coding-and-cowork_603421" },
    { id: "alibaba-lifecycle", vendorId: "alibaba", publisher: "Alibaba Cloud Model Studio", date: "2026-09-18", tier: "official", title: "模型上下架与更新", url: "https://help.aliyun.com/zh/model-studio/newly-released-models" },
    { id: "seed21", vendorId: "bytedance", publisher: "ByteDance Seed", date: "2026-06-23", tier: "official", title: "Seed2.1 — Model Card", url: "https://seed.bytedance.com/en/seed2_1" },
    { id: "hy4", vendorId: "tencent", publisher: "Tencent Hy", date: "2026-08-28", tier: "official", title: "Hy4-preview — Official Model Card", url: "https://huggingface.co/tencent/Hy4-preview" },
    { id: "skillsbench-1-1", vendorId: "benchflow", publisher: "SkillsBench / BenchFlow", date: "2026-07-16", tier: "official", title: "SkillsBench 1.1 Official Leaderboard", url: "https://www.skillsbench.ai/" }
  ];

  const models = [
    { id: "gpt-6-astra", name: "GPT-6 Astra", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-09-01", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["gpt-6-astra"], sourceId: "openai-astra", summary: "当前 OpenAI 前沿旗舰，突出计算机使用、科学、代码与网络安全。" },
    { id: "gpt-5-6-sol", name: "GPT-5.6 Sol", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-07-09", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "1M 档长上下文评测", access: "闭源 API", aliases: ["gpt-5.6-sol", "GPT-5.6 Sol"], sourceId: "openai-gpt56", summary: "GPT-5.6 家族旗舰，覆盖编码、知识工作、科研和多模态。" },
    { id: "claude-fable-5-1", name: "Claude Fable 5.1", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-09-01", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-fable-5-1"], sourceId: "anthropic-fable51", summary: "面向编码、知识工作与长程任务的最新 Fable 模型。" },
    { id: "claude-mythos-5-1", name: "Claude Mythos 5.1", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-09-01", modality: "vision", modalityDetail: "与 Fable 5.1 同模型，安全策略更宽松", context: "未披露", access: "受限访问", aliases: ["claude-mythos-5-1"], sourceId: "anthropic-fable51", summary: "与 Fable 5.1 权重相同，面向经审核的网络安全与生命科学用户。" },
    { id: "claude-opus-5", name: "Claude Opus 5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-07-24", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-opus-5"], sourceId: "anthropic-fable51", summary: "Anthropic Opus 系列前沿模型，作为多份同期官方表的强基线。" },
    { id: "claude-fable-5", name: "Claude Fable 5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-06-09", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-fable-5"], sourceId: "anthropic-fable51", summary: "Fable 5.1 的前代；保留是为了正确承接同期厂商表中的对照分数。" },
    { id: "claude-opus-4-8", name: "Claude Opus 4.8", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-opus-4-8"], sourceId: "anthropic-fable51", summary: "多份 2026 年中厂商表使用的强基线；与 Opus 5 分开保存。" },
    { id: "gemini-3-8-flash", name: "Gemini 3.8 Flash", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026-09-02", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API", aliases: ["gemini-3.8-flash"], sourceId: "deepmind-gemini38", summary: "原生全模态 Flash 模型，面向低成本 Agent、软件工程和知识工作。" },
    { id: "gemini-3-1-pro", name: "Gemini 3.1 Pro", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026-02", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API", aliases: ["gemini-3.1-pro"], sourceId: "deepmind-gemini38", summary: "Gemini 3 系列 Pro 模型，多份厂商表中的多模态对照基线。" },
    { id: "deepseek-v4-1-flash", name: "DeepSeek V4.1 Flash", vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026-09-10", modality: "vision", modalityDetail: "文本、图像 → 文本", context: "1M", access: "开放权重 / API", aliases: ["deepseek-v4.1-flash", "deepseek-flash"], sourceId: "deepseek-v41", summary: "552B MoE、输入激活 8B/输出 16B，原生视觉理解。" },
    { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro 0813", vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026-08-13", modality: "language", modalityDetail: "文本 → 文本", context: "1M", access: "API（已进入迁移期）", aliases: ["deepseek-v4-pro-0813"], sourceId: "alibaba-lifecycle", summary: "1.6T MoE 旗舰快照；官方已宣布流量逐步迁移至 V4.1 Flash。" },
    { id: "qwen3-8-max", name: "Qwen3.8 Max", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-02", modality: "vision", modalityDetail: "文本、图像、长视频 → 文本", context: "1M", access: "API / 开放权重版本", aliases: ["qwen3.8-max"], sourceId: "qwen38", summary: "2.4T MoE 旗舰；官方完整成绩表对应此稳定模型名。" },
    { id: "qwen3-8-max-0902", name: "Qwen3.8 Max 0902", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-09-02", modality: "vision", modalityDetail: "文本、图像、长视频 → 文本", context: "1M", access: "API 快照", aliases: ["qwen3.8-max-0902", "qwen3.8-max-2026-09-02"], sourceId: "alibaba-lifecycle", scoreStatus: "pending", summary: "9 月 2 日升级快照；官方尚未披露独立完整 Benchmark 表。" },
    { id: "qwen3-8-flash", name: "Qwen3.8 Flash", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-26", modality: "vision", modalityDetail: "文本、图像、长视频 → 文本", context: "1M", access: "API", aliases: ["qwen3.8-flash"], sourceId: "alibaba-lifecycle", scoreStatus: "pending", summary: "多模态高并发版本，面向编程、Agent 与长上下文。" },
    { id: "qwen3-8-omni-flash", name: "Qwen3.8 Omni Flash", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-09-17", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "未披露", access: "API", aliases: ["qwen3.8-omni-flash"], sourceId: "alibaba-lifecycle", scoreStatus: "pending", summary: "最新全模态版本；当前官方生命周期页已上架，独立完整分数待补。" },
    { id: "glm-5-3", name: "GLM-5.3", vendorId: "zai", vendor: "Z.ai", releaseDate: "2026-08-14", modality: "language", modalityDetail: "文本 → 文本", context: "1M", access: "开放权重 / API", aliases: ["glm-5.3"], sourceId: "zai-glm53", summary: "纯语言长程 Agent 旗舰，突出编码与网络安全。" },
    { id: "glm-5-3-flash", name: "GLM-5.3 Flash", vendorId: "zai", vendor: "Z.ai", releaseDate: "2026-08-26", modality: "vision", modalityDetail: "文本、图像、视频、文件 → 文本", context: "1M", access: "开放权重 / API", aliases: ["glm-5.3-flash", "ox-alpha"], sourceId: "zai-glm53-flash", summary: "GLM-5 系列首个原生多模态模型，320B/18B active。" },
    { id: "seed2-1-pro", name: "Seed2.1 Pro", vendorId: "bytedance", vendor: "ByteDance Seed", releaseDate: "2026-06-23", modality: "vision", modalityDetail: "文本、图像、视频 → 文本", context: "128K+ 多模态长上下文评测", access: "闭源 API", aliases: ["seed2.1-pro", "Doubao Seed 2.1 Pro"], sourceId: "seed21", summary: "面向现实生产力、编码交付和视觉/视频理解的 Pro 版本。" },
    { id: "seed2-1-turbo", name: "Seed2.1 Turbo", vendorId: "bytedance", vendor: "ByteDance Seed", releaseDate: "2026-06-23", modality: "vision", modalityDetail: "文本、图像、视频 → 文本", context: "128K+ 多模态长上下文评测", access: "闭源 API", aliases: ["seed2.1-turbo", "Doubao Seed 2.1 Turbo"], sourceId: "seed21", summary: "Seed2.1 家族效率版本，保留 Agent、编码和多模态能力。" },
    { id: "kimi-k3", name: "Kimi K3", vendorId: "moonshot", vendor: "Moonshot AI", releaseDate: "2026-07-17", modality: "vision", modalityDetail: "文本、图像 → 文本", context: "1M", access: "开放权重 / API", aliases: ["kimi-k3", "K3"], sourceId: "alibaba-lifecycle", summary: "2.8T KDA 混合线性注意力旗舰，原生视觉理解。" },
    { id: "hy4-preview", name: "Hy4 Preview", vendorId: "tencent", vendor: "Tencent Hy", releaseDate: "2026-08-28", modality: "language", modalityDetail: "文本 → 文本", context: "1M", access: "开放权重", aliases: ["hy4-preview", "Tencent Hy4"], sourceId: "hy4", summary: "770B/49B active 的纯语言 MoE 旗舰预览版。" }
  ];

  const benchmarks = [
    { id: "agents-last-exam", name: "Agents' Last Exam", category: "Agent / 工作", direction: "higher", description: "跨专业长程工作流；注意 Pass Rate 与 Overall Score 两种指标。" },
    { id: "automationbench", name: "AutomationBench", category: "Agent / 工作", direction: "higher", description: "真实自动化工作流；版本与 Harness 差异会显著影响分数。" },
    { id: "gdpval-aa-v2", name: "GDPval-AA v2", category: "Agent / 工作", direction: "higher", description: "高经济价值知识工作，常报告 Elo。" },
    { id: "toolathlon", name: "Toolathlon Verified", category: "Agent / 工作", direction: "higher", description: "工具调用与长程 Agent 能力。" },
    { id: "terminal-bench-2-1", name: "Terminal-Bench 2.1", category: "编码", direction: "higher", description: "终端环境 Agent 编码；Harness、超时、联网策略很重要。" },
    { id: "terminal-bench-3-0", name: "Terminal-Bench 3.0", category: "编码", direction: "higher", description: "更高难度终端任务。" },
    { id: "terminal-bench-4-0", name: "Terminal-Bench 4.0", category: "编码", direction: "higher", description: "新一代通用终端 Agent 任务。" },
    { id: "terminal-bench-science", name: "Terminal-Bench Science 0.1", category: "科研", direction: "higher", description: "使用代码与终端完成科学研究工作流。" },
    { id: "deepswe-v1-1", name: "DeepSWE v1.1", category: "编码", direction: "higher", description: "长程软件工程；不同 Agent Scaffold 会产生不同结果。" },
    { id: "swe-bench-pro", name: "SWE-Bench Pro", category: "编码", direction: "higher", description: "真实仓库软件工程。" },
    { id: "nl2repo", name: "NL2Repo-Bench", category: "编码", direction: "higher", description: "从自然语言需求构建仓库级实现。" },
    { id: "programbench", name: "ProgramBench", category: "编码", direction: "higher", description: "从零完成系统级工程任务；有 Almost Solved 等口径。" },
    { id: "gpqa-diamond", name: "GPQA Diamond", category: "知识 / 推理", direction: "higher", description: "研究生级科学推理。" },
    { id: "hle", name: "Humanity's Last Exam", category: "知识 / 推理", direction: "higher", description: "跨学科专家级推理；有无工具不可直接混比。" },
    { id: "hle-tools", name: "Humanity's Last Exam (with tools)", category: "知识 / 推理", direction: "higher", description: "允许使用工具的 HLE。" },
    { id: "frontiermath-t4", name: "FrontierMath Tier 4 (v2)", category: "知识 / 推理", direction: "higher", description: "最高难度数学推理。" },
    { id: "arc-agi-3", name: "ARC-AGI-3", category: "抽象推理", direction: "higher", description: "交互式新环境抽象推理。" },
    { id: "osworld-2", name: "OSWorld 2.0", category: "计算机操作", direction: "higher", description: "桌面计算机操作；partial、strict、任务版本需分开看。" },
    { id: "browsecomp", name: "BrowseComp", category: "计算机操作", direction: "higher", description: "浏览器检索与复杂网页任务。" },
    { id: "screenspot-pro", name: "ScreenSpot-Pro", category: "计算机操作", direction: "higher", description: "屏幕视觉定位。" },
    { id: "benchcad", name: "BenchCAD", category: "专业工作", direction: "higher", description: "从多视图重建 3D 对象并生成 CAD。" },
    { id: "artificial-intelligence-index", name: "Artificial Analysis Intelligence Index v4.1", category: "综合指数", direction: "higher", description: "第三方综合智能指数；厂商发布页转载。" },
    { id: "artificial-coding-index", name: "Artificial Analysis Coding Agent Index", category: "编码", direction: "higher", description: "第三方编码 Agent 综合指数，注意版本号。" },
    { id: "mmmu-pro", name: "MMMU-Pro", category: "多模态", direction: "higher", description: "多模态大学级理解；有无工具需分开。" },
    { id: "charxiv", name: "CharXiv Reasoning", category: "多模态", direction: "higher", description: "复杂图表与科学图形推理。" },
    { id: "babyvision", name: "BabyVision", category: "多模态", direction: "higher", description: "视觉感知与推理；有无工具口径并存。" },
    { id: "videomme", name: "VideoMME", category: "多模态", direction: "higher", description: "长视频理解。" },
    { id: "lvbench", name: "LVBench", category: "多模态", direction: "higher", description: "长视频理解；静态与 Agentic 设置可能不同。" },
    { id: "worldvqa", name: "WorldVQA", category: "多模态", direction: "higher", description: "视觉世界知识。" },
    { id: "erqa", name: "ERQA", category: "多模态", direction: "higher", description: "空间推理。" },
    { id: "mathvision", name: "MathVision", category: "多模态", direction: "higher", description: "视觉数学推理；工具设置需注明。" },
    { id: "exploitbench", name: "ExploitBench", category: "网络安全", direction: "higher", description: "真实漏洞利用；安全策略、时间预算和 Harness 影响很大。" },
    { id: "exploitgym", name: "ExploitGym", category: "网络安全", direction: "higher", description: "漏洞利用任务；有成功率与完成任务数两种报告口径。" },
    { id: "cybergym", name: "CyberGym", category: "网络安全", direction: "higher", description: "白盒漏洞发现与验证。" },
    { id: "sec-bench-pro", name: "SEC-Bench Pro", category: "网络安全", direction: "higher", description: "复杂软件 PoC 生成。" },
    { id: "mrcr-512k", name: "OpenAI MRCR v2 · 512K–1M", category: "长上下文", direction: "higher", description: "8-needle 长上下文检索。" },
    { id: "mmlongbench", name: "MMLongBench-128K", category: "长上下文", direction: "higher", description: "128K 多模态长上下文。" },
    { id: "workspace-bench", name: "Workspace Bench", category: "专业工作", direction: "higher", description: "高经济价值文档与工作区任务。" },
    { id: "agent-startup-bench", name: "Agent Startup Bench", category: "专业工作", direction: "higher", description: "AI 原生创业公司真实工作流。" },
    { id: "officeqa-pro", name: "OfficeQA Pro", category: "专业工作", direction: "higher", description: "复杂办公文档问答与检索。" },
    { id: "supergpqa", name: "SuperGPQA", category: "知识 / 推理", direction: "higher", description: "广覆盖专业知识问答。" },
    { id: "beyondaime", name: "BeyondAIME", category: "知识 / 推理", direction: "higher", description: "高难数学推理。" },
    { id: "swe-multilingual", name: "SWE-bench Multilingual", category: "编码", direction: "higher", description: "多语言仓库问题修复。" },
    { id: "apex-agents", name: "Apex Agents", category: "Agent / 工作", direction: "higher", description: "Agent 综合任务。" },
    { id: "skillsbench-1-1", name: "SkillsBench 1.1", category: "Agent / 工作", direction: "higher", description: "87 个跨 8 个专业域的真实任务；with Skills 与 without Skills、Agent Harness 必须分开看。" }
  ];

  const observations = [];
  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    observations.push({ id: `o${observations.length + 1}`, sourceIds, benchmarkId, modelId, value, unit, setting, note });
  };
  const batch = (sourceIds, benchmarkId, rows, unit = "%", setting = "") => {
    rows.forEach(([modelId, value, rowSetting = setting, note = ""]) => add(sourceIds, benchmarkId, modelId, value, unit, rowSetting, note));
  };

  batch(["openai-astra"], "agents-last-exam", [["gpt-6-astra",59.3,"最高 effort"],["gpt-5-6-sol",53.6,"最高 effort"],["claude-opus-5",55.5,"最高 effort"]]);
  add(["qwen38"], "agents-last-exam", "qwen3-8-max", "27.0 / 52.4", "Pass / Score", "官方表：Pass Rate / Overall Score");
  add(["zai-glm53","deepseek-v41"], "agents-last-exam", "glm-5-3", 28.5, "%", "ALE-CLI / Pass@1");
  add(["zai-glm53","deepseek-v41"], "agents-last-exam", "kimi-k3", 27.6, "%", "ALE-CLI / Pass@1");
  add(["deepseek-v41"], "agents-last-exam", "deepseek-v4-1-flash", 31.8, "%", "官方 scaffold / Pass@1");

  batch(["openai-astra"], "automationbench", [["gpt-6-astra",41.4],["gpt-5-6-sol",18.1],["claude-fable-5-1",31.4],["claude-opus-5",26.9]]);
  batch(["zai-glm53"], "automationbench", [["glm-5-3",48.2],["kimi-k3",46.7],["deepseek-v4-pro",43.2],["gpt-5-6-sol",45.8,"v1.0.6 / Z.ai设置"],["claude-opus-4-8",41.0,"v1.0.6 / Z.ai设置"]]);
  batch(["zai-glm53-flash"], "automationbench", [["glm-5-3-flash",48.8],["gpt-5-6-sol",37.2,"v1.0.6 / Z.ai Flash表"],["gemini-3-8-flash",52.3,"Gemini 3.7 Flash 对照；未归入 3.8"]]);
  add(["qwen38"], "automationbench", "qwen3-8-max", 27.3, "%", "600-task public subset / Pass@1");
  add(["deepseek-v41"], "automationbench", "deepseek-v4-1-flash", 54.8, "%", "官方 scaffold / Pass@1");

  batch(["deepmind-gemini38"], "gdpval-aa-v2", [["gemini-3-8-flash",1545],["claude-opus-5",1824],["gpt-5-6-sol",1710]], "Elo", "Google Model Card");
  batch(["zai-glm53"], "gdpval-aa-v2", [["glm-5-3",1769],["kimi-k3",1682],["deepseek-v4-pro",1590],["qwen3-8-max",1739],["claude-opus-4-8",1588],["gpt-5-6-sol",1730]], "Elo", "Artificial Analysis / Z.ai转载");
  batch(["zai-glm53-flash"], "gdpval-aa-v2", [["glm-5-3-flash",1773],["gpt-5-6-sol",1571,"GPT-5.6 Terra 对照；未归入 Sol"],["gemini-3-8-flash",1527,"Gemini 3.7 Flash 对照；未归入 3.8"]], "Elo", "Artificial Analysis / Z.ai转载");

  batch(["zai-glm53"], "toolathlon", [["glm-5-3",73.0],["kimi-k3",76.5],["deepseek-v4-pro",74.1],["qwen3-8-max",72.5],["claude-opus-4-8",76.2],["gpt-5-6-sol",74.9]], "%", "Verified / Pass@1");
  batch(["zai-glm53-flash"], "toolathlon", [["glm-5-3-flash",78.4],["deepseek-v4-1-flash",75.9,"DeepSeek V4 Vision Exp 对照"],["claude-opus-4-8",76.2]], "%", "Verified / 三次运行均值");
  add(["hy4"], "toolathlon", "hy4-preview", 74.1, "%", "HF Eval Result / Verified");

  batch(["openai-gpt56","zai-glm53","deepseek-v41","deepmind-gemini38"], "terminal-bench-2-1", [["gpt-5-6-sol",88.8,"厂商公开表共同值"]]);
  batch(["deepmind-gemini38"], "terminal-bench-2-1", [["gemini-3-8-flash",89.4],["claude-opus-5",89.1],["gpt-5-6-sol",88.8]], "%", "Google Model Card");
  batch(["zai-glm53"], "terminal-bench-2-1", [["glm-5-3",88.2],["kimi-k3",88.3],["deepseek-v4-pro",87.9],["qwen3-8-max",86.6],["claude-opus-4-8",85.0,"Z.ai复现"]]);
  batch(["zai-glm53-flash"], "terminal-bench-2-1", [["glm-5-3-flash",84.3],["deepseek-v4-1-flash",83.9,"DeepSeek V4 Vision Exp 对照"]]);
  batch(["deepseek-v41"], "terminal-bench-2-1", [["deepseek-v4-1-flash",90.6]], "%", "DSH Minimal / max effort");
  add(["qwen38"], "terminal-bench-2-1", "qwen3-8-max", 86.6, "%", "Claude Code harness");
  add(["seed21"], "terminal-bench-2-1", "seed2-1-pro", 71.0, "%", "Seed model card");
  add(["seed21"], "terminal-bench-2-1", "seed2-1-turbo", 67.6, "%", "Seed model card");
  add(["hy4"], "terminal-bench-2-1", "hy4-preview", 85.4, "%", "HF Eval Result");

  batch(["zai-glm53"], "terminal-bench-3-0", [["glm-5-3",28.3],["kimi-k3",17.4],["claude-opus-4-8",21.1],["gpt-5-6-sol",34.6]]);
  batch(["deepseek-v41"], "terminal-bench-3-0", [["deepseek-v4-1-flash",30.0],["glm-5-3",28.3],["kimi-k3",17.7],["claude-opus-5",43.3],["gpt-5-6-sol",34.4]], "%", "DeepSeek Harness / max effort");

  batch(["openai-astra"], "terminal-bench-4-0", [["gpt-6-astra",57.9],["gpt-5-6-sol",37.3],["claude-fable-5-1",55.8],["claude-opus-5",52.6]], "%", "OpenAI公开设置");
  batch(["anthropic-fable51"], "terminal-bench-4-0", [["claude-fable-5-1",55.8],["claude-mythos-5-1",60.9],["claude-opus-5",52.3],["gpt-5-6-sol",37.3]], "%", "Anthropic公开设置");
  batch(["deepseek-v41"], "terminal-bench-4-0", [["deepseek-v4-1-flash",31.2],["glm-5-3",37.9],["kimi-k3",12.6],["claude-opus-5",51.8],["gpt-5-6-sol",39.9]], "%", "DeepSeek Harness / max effort");
  batch(["deepmind-gemini38"], "terminal-bench-4-0", [["gemini-3-8-flash",19.1],["claude-opus-5",51.8],["gpt-5-6-sol",37.3]], "%", "Google Model Card");

  batch(["openai-astra"], "terminal-bench-science", [["gpt-6-astra",64.6],["gpt-5-6-sol",22.4],["claude-fable-5-1",52.6],["claude-opus-5",30.0]], "%", "最高 effort");
  batch(["anthropic-fable51"], "terminal-bench-science", [["claude-fable-5-1",52.6],["gpt-5-6-sol",22.4],["claude-opus-5",29.0,"Anthropic复现；公开榜为30.0"]], "%", "Claude Code harness");

  batch(["openai-astra"], "deepswe-v1-1", [["gpt-6-astra",74.1],["gpt-5-6-sol",72.7],["claude-fable-5-1",67.4],["claude-opus-5",73.7]], "%", "OpenAI公开设置");
  batch(["deepmind-gemini38"], "deepswe-v1-1", [["gemini-3-8-flash",73.7],["claude-opus-5",74.0],["gpt-5-6-sol",72.7]], "%", "Google Model Card");
  batch(["zai-glm53"], "deepswe-v1-1", [["glm-5-3",66.9],["kimi-k3",67.5],["deepseek-v4-pro",62.7],["qwen3-8-max",56.6],["claude-opus-4-8",58.0],["gpt-5-6-sol",72.7]], "%", "mini-swe-agent / Z.ai设置");
  batch(["deepseek-v41"], "deepswe-v1-1", [["deepseek-v4-1-flash",74.2],["glm-5-3",66.9],["kimi-k3",67.5],["deepseek-v4-pro",62.7],["claude-opus-5",74.0],["gpt-5-6-sol",73.0]], "%", "mini-SWE / DeepSeek设置");
  add(["qwen38"], "deepswe-v1-1", "qwen3-8-max", 56.6, "%", "mini-SWE-Agent harness");
  add(["hy4"], "deepswe-v1-1", "hy4-preview", 64.3, "%", "HF Eval Result");
  add(["zai-glm53-flash"], "deepswe-v1-1", "glm-5-3-flash", 63.4, "%", "mini-swe-agent / 6h");

  batch(["openai-gpt56"], "swe-bench-pro", [["gpt-5-6-sol",64.6],["claude-fable-5",80.0],["claude-opus-4-8",69.2]], "%", "OpenAI GPT-5.6表");
  add(["qwen38"], "swe-bench-pro", "qwen3-8-max", 67.7, "%", "Claude Code harness");
  add(["hy4"], "swe-bench-pro", "hy4-preview", 65.7, "%", "HF Eval Result");

  batch(["zai-glm53"], "nl2repo", [["glm-5-3",58.0],["kimi-k3",58.0],["deepseek-v4-pro",61.1],["qwen3-8-max",55.9],["claude-opus-4-8",69.7]]);
  batch(["deepseek-v41"], "nl2repo", [["deepseek-v4-1-flash",64.0],["glm-5-3",58.0],["kimi-k3",58.0],["deepseek-v4-pro",61.5],["claude-opus-5",75.3],["gpt-5-6-sol",56.8]], "%", "DeepSeek Harness");
  add(["seed21"], "nl2repo", "seed2-1-pro", 47.0, "%", "Seed model card");
  add(["seed21"], "nl2repo", "seed2-1-turbo", 43.7, "%", "Seed model card");
  add(["zai-glm53-flash"], "nl2repo", "glm-5-3-flash", 56.3, "%", "Z.ai Flash设置");

  batch(["zai-glm53"], "programbench", [["glm-5-3",19.0],["kimi-k3",17.5],["qwen3-8-max",10.5],["claude-opus-4-8",15.5],["gpt-5-6-sol",23.0]], "%", "Almost Solved");
  add(["deepseek-v41"], "programbench", "deepseek-v4-1-flash", 20.3, "%", "Almost@1");
  add(["seed21"], "programbench", "seed2-1-pro", "0 / 1 / 50.3", "Solved tiers", "Seed官方复合指标");
  add(["seed21"], "programbench", "seed2-1-turbo", "0 / 0 / 49.4", "Solved tiers", "Seed官方复合指标");

  batch(["openai-astra"], "gpqa-diamond", [["gpt-6-astra",96.0],["gpt-5-6-sol",94.6],["claude-fable-5-1",93.7],["claude-opus-5",93.7],["gemini-3-8-flash",95.3]], "%", "最高 effort");
  batch(["deepseek-v41"], "gpqa-diamond", [["deepseek-v4-1-flash",90.9],["glm-5-3",88.1],["kimi-k3",92.9],["deepseek-v4-pro",92.4],["claude-opus-5",93.4],["gpt-5-6-sol",94.1]], "%", "Pass@1 / max effort");
  add(["qwen38"], "gpqa-diamond", "qwen3-8-max", 92.6, "%", "Qwen官方表");
  add(["hy4"], "gpqa-diamond", "hy4-preview", 92.3, "%", "HF Eval Result");

  batch(["qwen38"], "hle", [["qwen3-8-max",43.6],["gpt-5-6-sol",47.2],["claude-opus-4-8",45.7]], "%", "无工具 / Qwen表");
  batch(["anthropic-fable51"], "hle", [["claude-fable-5-1",60.9],["claude-opus-5",56.6]], "%", "无工具 / Anthropic设置");
  batch(["openai-astra"], "hle-tools", [["gpt-6-astra",57.2],["claude-fable-5-1",65.0],["claude-opus-5",63.6]], "%", "with tools");
  batch(["zai-glm53"], "hle-tools", [["glm-5-3",62.5],["kimi-k3",59.8],["deepseek-v4-pro",60.0],["qwen3-8-max",56.2],["claude-opus-4-8",57.9],["gpt-5-6-sol",64.5]], "%", "Z.ai设置");
  add(["deepseek-v41"], "hle-tools", "deepseek-v4-1-flash", 63.9, "%", "Pass@1 / tools");
  add(["zai-glm53-flash"], "hle-tools", "glm-5-3-flash", 55.3, "%", "full set / tools");

  batch(["openai-astra"], "frontiermath-t4", [["gpt-6-astra",97.6],["gpt-5-6-sol",83.0],["claude-fable-5-1",87.8],["claude-opus-5",73.2]], "%", "v2 / 最高 effort");
  batch(["openai-astra"], "arc-agi-3", [["gpt-6-astra",99.9],["gpt-5-6-sol",7.8],["claude-opus-5",30.2]], "%", "Responses API harness");

  batch(["openai-astra"], "osworld-2", [["gpt-6-astra",72.6],["gpt-5-6-sol",65.7],["claude-opus-5",70.2]], "%", "v2026.08.08 offline / partial");
  batch(["anthropic-fable51"], "osworld-2", [["claude-fable-5-1",77.9],["claude-opus-5",75.4]], "%", "2026-08任务集 / partial");
  add(["anthropic-fable51"], "osworld-2", "claude-fable-5-1", 41.7, "%", "2026-08任务集 / strict");
  add(["zai-glm53-flash"], "osworld-2", "glm-5-3-flash", 59.1, "%", "Z.ai Flash设置");
  add(["deepmind-gemini38"], "osworld-2", "gemini-3-8-flash", 59.0, "%", "partial / batch tool enabled");
  add(["qwen38"], "osworld-2", "qwen3-8-max", "19.4 / 46.7", "binary / partial", "Qwen官方表");

  batch(["openai-astra"], "browsecomp", [["gpt-6-astra",91.5],["gpt-5-6-sol",90.4],["claude-opus-5",90.8]]);
  add(["qwen38"], "screenspot-pro", "qwen3-8-max", 84.5, "%", "Qwen官方表");
  batch(["openai-astra"], "screenspot-pro", [["gpt-6-astra",92.7],["gpt-5-6-sol",76.9]], "%", "no tools");

  batch(["openai-astra"], "benchcad", [["gpt-6-astra",95.9],["gpt-5-6-sol",83.3],["claude-fable-5-1",84.3],["claude-opus-5",82.1]], "%", "with tools / geometric overlap");

  batch(["openai-astra"], "artificial-intelligence-index", [["gpt-6-astra",61.2],["gpt-5-6-sol",60.9],["claude-fable-5-1",65.7],["claude-opus-5",63.1],["gemini-3-8-flash",58.7]], "Index", "v4.1.1");
  add(["zai-glm53-flash"], "artificial-intelligence-index", "glm-5-3-flash", 57.0, "Index", "v4.1.1 / $0.045 per task（折后）");
  batch(["openai-astra"], "artificial-coding-index", [["gpt-6-astra",67.0],["gpt-5-6-sol",65.1],["claude-opus-5",68.1],["gemini-3-8-flash",61.2]], "Index", "v1.4");

  batch(["openai-gpt56"], "mmmu-pro", [["gpt-5-6-sol",83.0],["gemini-3-1-pro",80.5]], "%", "no tools");
  add(["qwen38"], "mmmu-pro", "qwen3-8-max", 82.3, "%", "无工具 / Qwen表");
  add(["seed21"], "mmmu-pro", "seed2-1-pro", "81.6 (82.7)", "%", "with tools；括号为修正后");
  add(["seed21"], "mmmu-pro", "seed2-1-turbo", "80.1 (82.2)", "%", "with tools；括号为修正后");

  batch(["deepmind-gemini38"], "charxiv", [["gemini-3-8-flash",86.2],["claude-opus-5",83.7],["gpt-5-6-sol",85.8]], "%", "no tools");
  add(["zai-glm53-flash"], "charxiv", "glm-5-3-flash", 89.4, "%", "with tools");
  add(["qwen38"], "charxiv", "qwen3-8-max", "88.4 / 93.5", "%", "without CI / with CI");
  add(["seed21"], "charxiv", "seed2-1-pro", "85.4 (86.4)", "%", "with tools；括号为修正后");

  add(["qwen38"], "babyvision", "qwen3-8-max", "82.0 / 91.3", "%", "without tools / with tools");
  add(["openai-gpt56"], "babyvision", "gpt-5-6-sol", 88.9, "%", "with tools");
  add(["zai-glm53-flash"], "babyvision", "glm-5-3-flash", 53.4, "%", "Z.ai Flash设置");
  add(["seed21"], "babyvision", "seed2-1-pro", 73.7, "%", "Seed model card");
  add(["seed21"], "babyvision", "seed2-1-turbo", 62.9, "%", "Seed model card");

  add(["qwen38"], "videomme", "qwen3-8-max", 90.4, "%", "with subtitles");
  add(["seed21"], "videomme", "seed2-1-pro", 89.2, "%", "Seed model card");
  add(["seed21"], "videomme", "seed2-1-turbo", 89.0, "%", "Seed model card");
  batch(["deepmind-gemini38"], "lvbench", [["gemini-3-8-flash",87.8],["gpt-5-6-sol",82.1],["claude-opus-5",75.4]], "%", "Gemini为agentic；跨模型设置见原卡");
  add(["qwen38"], "lvbench", "qwen3-8-max", 81.8, "%", "with subtitles");

  add(["seed21"], "worldvqa", "seed2-1-pro", 53.0, "%", "Seed model card");
  add(["seed21"], "worldvqa", "seed2-1-turbo", 48.6, "%", "Seed model card");
  add(["qwen38"], "worldvqa", "qwen3-8-max", 53.2, "%", "Qwen官方表");
  add(["seed21"], "erqa", "seed2-1-pro", 72.0, "%", "Seed model card");
  add(["seed21"], "erqa", "seed2-1-turbo", 71.3, "%", "Seed model card");
  add(["qwen38"], "erqa", "qwen3-8-max", 77.8, "%", "Qwen官方表");

  add(["seed21"], "mathvision", "seed2-1-pro", "92.6 (94.5)", "%", "with tools；括号为修正后");
  add(["seed21"], "mathvision", "seed2-1-turbo", "90.1 (92.7)", "%", "with tools；括号为修正后");
  add(["qwen38"], "mathvision", "qwen3-8-max", "95.2 / 97.7", "%", "without CI / with CI");

  batch(["openai-astra"], "exploitbench", [["gpt-6-astra",100.0],["gpt-5-6-sol",78.5],["claude-opus-5",70.0]], "%", "无生产安全策略");
  batch(["zai-glm53"], "exploitbench", [["glm-5-3",54.4],["kimi-k3",32.2],["qwen3-8-max",28.8],["claude-fable-5",78.0],["gpt-5-6-sol",76.5]], "%", "Z.ai设置");
  add(["deepseek-v41"], "exploitbench", "deepseek-v4-1-flash", 73.5, "%", "ExploitBench API harness / 5 seeds");

  batch(["openai-astra"], "exploitgym", [["gpt-6-astra",42.4],["gpt-5-6-sol",30.3],["claude-fable-5-1",30.4],["claude-opus-5",22.0]], "%", "成功率 / 无生产安全策略");
  batch(["zai-glm53"], "exploitgym", [["glm-5-3","105 / 130"],["kimi-k3","36 / 70"],["qwen3-8-max","14 / 26"],["claude-fable-5","181 / 247"],["gpt-5-6-sol","216 / 293"]], "tasks", "2h / 6h 时间归一化任务数");
  add(["deepseek-v41"], "exploitgym", "deepseek-v4-1-flash", 15.3, "%", "Pass@1");

  batch(["zai-glm53"], "cybergym", [["glm-5-3",84.5],["kimi-k3",80.0],["deepseek-v4-pro",83.3],["qwen3-8-max",78.5],["claude-fable-5",83.8],["gpt-5-6-sol",83.6]], "%", "Claude Code / 无Web工具");
  add(["deepseek-v41"], "cybergym", "deepseek-v4-1-flash", 88.1, "%", "Pass@1");
  batch(["openai-astra"], "sec-bench-pro", [["gpt-6-astra",85.4],["gpt-5-6-sol",79.1]], "%", "OpenAI公开设置");
  add(["deepseek-v41"], "sec-bench-pro", "deepseek-v4-1-flash", 62.8, "%", "Claude Code harness");

  batch(["openai-astra"], "mrcr-512k", [["gpt-6-astra",96.3],["gpt-5-6-sol",73.8]], "%", "8-needle / 512K–1M");
  add(["qwen38"], "mrcr-512k", "qwen3-8-max", 92.9, "%", "MRCR v2 256K 8-needle（不同长度，保留注记）");
  add(["seed21"], "mmlongbench", "seed2-1-pro", 78.3, "%", "128K");
  add(["seed21"], "mmlongbench", "seed2-1-turbo", 76.9, "%", "128K");

  add(["seed21"], "workspace-bench", "seed2-1-pro", 53.0, "%", "High-Economic-Value");
  add(["seed21"], "workspace-bench", "seed2-1-turbo", 54.7, "%", "High-Economic-Value");
  add(["qwen38"], "workspace-bench", "qwen3-8-max", 67.7, "%", "Qwen官方表");
  add(["seed21"], "agent-startup-bench", "seed2-1-pro", 68.8, "%", "High-Economic-Value");
  add(["seed21"], "agent-startup-bench", "seed2-1-turbo", 54.0, "%", "High-Economic-Value");
  add(["zai-glm53-flash"], "officeqa-pro", "glm-5-3-flash", 62.4, "%", "Treasury Bulletin / 无嵌入文本");

  add(["seed21"], "supergpqa", "seed2-1-pro", 70.8, "%", "Seed model card");
  add(["seed21"], "supergpqa", "seed2-1-turbo", 67.4, "%", "Seed model card");
  add(["seed21"], "beyondaime", "seed2-1-pro", 87.0, "%", "Seed model card");
  add(["seed21"], "beyondaime", "seed2-1-turbo", 88.0, "%", "Seed model card");

  add(["hy4"], "swe-multilingual", "hy4-preview", 82.9, "%", "HF Eval Result / Resolved");
  add(["hy4"], "apex-agents", "hy4-preview", 37.1, "%", "HF Eval Result");

  add(["skillsbench-1-1"], "skillsbench-1-1", "claude-opus-4-8", 54.1, "%", "with Skills · OpenHands · 87 tasks · up to 3 trials", "without Skills: 45.7% · official v1.1 leaderboard");
  add(["skillsbench-1-1"], "skillsbench-1-1", "gemini-3-1-pro", 52.8, "%", "with Skills · OpenHands · 87 tasks · up to 3 trials", "without Skills: 33.8% · official v1.1 leaderboard");
  add(["skillsbench-1-1"], "skillsbench-1-1", "gemini-3-1-pro", 60.8, "%", "with Skills · Gemini CLI · 87 tasks · up to 3 trials", "without Skills: 36.0% · official v1.1 leaderboard");
  add(["skillsbench-1-1"], "skillsbench-1-1", "deepseek-v4-pro", 50.1, "%", "with Skills · OpenHands · 87 tasks · up to 3 trials", "official row label: DeepSeek V4 Pro · without Skills: 26.9%");

  return { meta, sources, models, benchmarks, observations };
})();
