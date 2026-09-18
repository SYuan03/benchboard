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
    { id: "qwen38", vendorId: "alibaba", publisher: "Qwen / Alibaba Cloud", date: "2026-08-03", tier: "official", title: "Qwen3.8-Max: A New Bar for Coding and Cowork", url: "https://qwen.ai/blog?id=qwen3.8" },
    { id: "qwen38-hf", vendorId: "alibaba", publisher: "Qwen", date: "2026-08-13", tier: "official", title: "Qwen3.8-2.4T-A95B — Official Model Card", url: "https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B" },
    { id: "qwen38-omni", vendorId: "alibaba", publisher: "Qwen", date: "2026-09-18", tier: "official", title: "Qwen3.8-Omni-Flash: Omni Senses. Agentic Delivery.", url: "https://qwen.ai/blog?id=qwen3.8-omni-flash" },
    { id: "wildclawbench", vendorId: "wildclawbench", publisher: "WildClawBench / InternLM", date: "2026-07-20", tier: "official", title: "WildClawBench Official Leaderboard", url: "https://internlm.github.io/WildClawBench/" },
    { id: "alibaba-lifecycle", vendorId: "alibaba", publisher: "Alibaba Cloud Model Studio", date: "2026-09-18", tier: "official", title: "模型上下架与更新", url: "https://help.aliyun.com/zh/model-studio/newly-released-models" },
    { id: "seed21", vendorId: "bytedance", publisher: "ByteDance Seed", date: "2026-06-23", tier: "official", title: "Seed2.1 — Model Card", url: "https://seed.bytedance.com/en/seed2_1" },
    { id: "hy4", vendorId: "tencent", publisher: "Tencent Hy", date: "2026-08-28", tier: "official", title: "Hy4-preview — Official Model Card", url: "https://huggingface.co/tencent/Hy4-preview" },
    { id: "skillsbench-1-1", vendorId: "benchflow", publisher: "SkillsBench / BenchFlow", date: "2026-07-16", tier: "official", title: "SkillsBench 1.1 Official Leaderboard", url: "https://www.skillsbench.ai/" },
    { id: "pinchbench-v2", vendorId: "pinchbench", publisher: "PinchBench", date: "2026-09-18", tier: "official", title: "PinchBench v2 — OpenClaw Benchmark Leaderboard", url: "https://pinchbench.com/" }
  ];

  const models = [
    { id: "gpt-6-astra", name: "GPT-6 Astra", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-09-01", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["gpt-6-astra"], sourceId: "openai-astra", summary: "当前 OpenAI 前沿旗舰，突出计算机使用、科学、代码与网络安全。" },
    { id: "gpt-5-6-sol", name: "GPT-5.6 Sol", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-07-09", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "1M 档长上下文评测", access: "闭源 API", aliases: ["gpt-5.6-sol", "GPT-5.6 Sol"], sourceId: "openai-gpt56", summary: "GPT-5.6 家族旗舰，覆盖编码、知识工作、科研和多模态。" },
    { id: "gpt-5-6-terra", name: "GPT-5.6 Terra", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026", modality: "vision", modalityDetail: "多模态模型；当前仅收录 Z.ai 官方表中的精确版本名与对照成绩", context: "未核实", access: "闭源 API", aliases: ["gpt-5.6-terra", "GPT-5.6 Terra"], sourceId: "zai-glm53-flash", summary: "GLM-5.3 Flash 官方表使用的独立对照版本；不与 GPT-5.6 Sol 合并。" },
    { id: "gpt-5-6-luna", name: "GPT-5.6 Luna", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、工具调用 → 文本", context: "未披露", access: "闭源 API", aliases: ["openai/gpt-5.6-luna"], sourceId: "openai-gpt56", summary: "GPT-5.6 家族的低延迟版本；PinchBench v2 当前榜单中的前沿模型。" },
    { id: "claude-fable-5-1", name: "Claude Fable 5.1", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-09-01", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-fable-5-1"], sourceId: "anthropic-fable51", summary: "面向编码、知识工作与长程任务的最新 Fable 模型。" },
    { id: "claude-mythos-5-1", name: "Claude Mythos 5.1", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-09-01", modality: "vision", modalityDetail: "与 Fable 5.1 同模型，安全策略更宽松", context: "未披露", access: "受限访问", aliases: ["claude-mythos-5-1"], sourceId: "anthropic-fable51", summary: "与 Fable 5.1 权重相同，面向经审核的网络安全与生命科学用户。" },
    { id: "claude-opus-5", name: "Claude Opus 5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-07-24", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-opus-5"], sourceId: "anthropic-fable51", summary: "Anthropic Opus 系列前沿模型，作为多份同期官方表的强基线。" },
    { id: "claude-fable-5", name: "Claude Fable 5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-06-09", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-fable-5"], sourceId: "anthropic-fable51", summary: "Fable 5.1 的前代；保留是为了正确承接同期厂商表中的对照分数。" },
    { id: "claude-opus-4-8", name: "Claude Opus 4.8", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-opus-4-8"], sourceId: "anthropic-fable51", summary: "多份 2026 年中厂商表使用的强基线；与 Opus 5 分开保存。" },
    { id: "claude-opus-4-8-fast", name: "Claude Opus 4.8 Fast", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、工具调用 → 文本", context: "未披露", access: "闭源 API 路由", aliases: ["anthropic/claude-opus-4.8-fast"], sourceId: "pinchbench-v2", summary: "PinchBench 单独列出的 Opus 4.8 快速路由；不与标准 Opus 4.8 合并。" },
    { id: "gemini-3-8-flash", name: "Gemini 3.8 Flash", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026-09-02", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API", aliases: ["gemini-3.8-flash"], sourceId: "deepmind-gemini38", summary: "原生全模态 Flash 模型，面向低成本 Agent、软件工程和知识工作。" },
    { id: "gemini-3-7-flash", name: "Gemini 3.7 Flash", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026", modality: "omni", modalityDetail: "全模态模型；当前仅收录 Z.ai 官方表中的精确版本名与对照成绩", context: "未核实", access: "闭源 API", aliases: ["gemini-3.7-flash"], sourceId: "zai-glm53-flash", summary: "GLM-5.3 Flash 官方表使用的独立对照版本；不与 Gemini 3.8 Flash 合并。" },
    { id: "gemini-3-1-pro", name: "Gemini 3.1 Pro", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026-02", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API", aliases: ["gemini-3.1-pro"], sourceId: "deepmind-gemini38", summary: "Gemini 3 系列 Pro 模型，多份厂商表中的多模态对照基线。" },
    { id: "deepseek-v4-1-flash", name: "DeepSeek V4.1 Flash", vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026-09-10", modality: "vision", modalityDetail: "文本、图像 → 文本", context: "1M", access: "开放权重 / API", aliases: ["deepseek-v4.1-flash", "deepseek-flash"], sourceId: "deepseek-v41", summary: "552B MoE、输入激活 8B/输出 16B，原生视觉理解。" },
    { id: "deepseek-v4-vision-exp", name: "DeepSeek V4 Vision Exp", vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026", modality: "vision", modalityDetail: "视觉语言实验版本；当前仅收录 Z.ai 官方表中的精确版本名与对照成绩", context: "未核实", access: "实验版本", aliases: ["DeepSeek V4 Vision Exp"], sourceId: "zai-glm53-flash", summary: "GLM-5.3 Flash 官方表使用的独立对照版本；不与 DeepSeek V4.1 Flash 合并。" },
    { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro 0813", vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026-08-13", modality: "language", modalityDetail: "文本 → 文本", context: "1M", access: "API（已进入迁移期）", aliases: ["deepseek-v4-pro-0813"], sourceId: "alibaba-lifecycle", summary: "1.6T MoE 旗舰快照；官方已宣布流量逐步迁移至 V4.1 Flash。" },
    { id: "qwen3-8-max", name: "Qwen3.8 Max", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-02", modality: "vision", modalityDetail: "服务版：文本、图像 → 文本；官方卡另列内置工具与非思考模式", context: "1M", access: "闭源 API（基于开放权重底座）", aliases: ["qwen3.8-max"], sourceId: "qwen38-hf", summary: "Qwen3.8 的官方托管服务版；模型卡 Benchmark 表中的 Qwen3.8-Max 均归到这里。" },
    { id: "qwen3-8-2-4t-a95b", name: "Qwen3.8-2.4T-A95B", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-13", modality: "language", modalityDetail: "文本 → 文本；仅思考模式，不支持多模态输入", context: "262K 原生 / 可扩展至 1.01M", access: "开放权重", aliases: ["Qwen/Qwen3.8-2.4T-A95B"], sourceId: "qwen38-hf", scoreStatus: "base-model", summary: "2.4T 总参数、95B 激活的纯语言开放权重底座；与支持视觉的 Qwen3.8-Max 服务版分开登记。" },
    { id: "qwen3-7-max", name: "Qwen3.7 Max", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像 → 文本", context: "未披露", access: "闭源 API", aliases: ["qwen3.7-max"], sourceId: "qwen38-hf", summary: "Qwen3.8 官方模型卡中的上一代对照模型。" },
    { id: "qwen3-8-max-0902", name: "Qwen3.8 Max 0902", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-09-02", modality: "vision", modalityDetail: "文本、图像、长视频 → 文本", context: "1M", access: "API 快照", aliases: ["qwen3.8-max-0902", "qwen3.8-max-2026-09-02"], sourceId: "alibaba-lifecycle", scoreStatus: "pending", summary: "9 月 2 日升级快照；官方尚未披露独立完整 Benchmark 表。" },
    { id: "qwen3-8-flash", name: "Qwen3.8 Flash", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-26", modality: "vision", modalityDetail: "文本、图像、长视频 → 文本", context: "1M", access: "API", aliases: ["qwen3.8-flash"], sourceId: "alibaba-lifecycle", scoreStatus: "pending", summary: "多模态高并发版本，面向编程、Agent 与长上下文。" },
    { id: "qwen3-8-omni-flash", name: "Qwen3.8 Omni Flash", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-09-18", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API", aliases: ["qwen3.8-omni-flash"], sourceId: "qwen38-omni", summary: "Qwen3.8 的原生全模态版本，面向音视频 Agent、编码和长程任务。" },
    { id: "qwen3-5-omni-plus", name: "Qwen3.5 Omni Plus", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "未核实", access: "闭源 API", aliases: ["qwen3.5-omni-plus"], sourceId: "qwen38-omni", summary: "Qwen3.8 Omni Flash 官方发布表中的上一代全模态对照模型。" },
    { id: "glm-5-3", name: "GLM-5.3", vendorId: "zai", vendor: "Z.ai", releaseDate: "2026-08-14", modality: "language", modalityDetail: "文本 → 文本", context: "1M", access: "开放权重 / API", aliases: ["glm-5.3"], sourceId: "zai-glm53", summary: "纯语言长程 Agent 旗舰，突出编码与网络安全。" },
    { id: "glm-5-3-flash", name: "GLM-5.3 Flash", vendorId: "zai", vendor: "Z.ai", releaseDate: "2026-08-26", modality: "vision", modalityDetail: "文本、图像、视频、文件 → 文本", context: "1M", access: "开放权重 / API", aliases: ["glm-5.3-flash", "ox-alpha"], sourceId: "zai-glm53-flash", summary: "GLM-5 系列首个原生多模态模型，320B/18B active。" },
    { id: "seed2-1-pro", name: "Seed2.1 Pro", vendorId: "bytedance", vendor: "ByteDance Seed", releaseDate: "2026-06-23", modality: "vision", modalityDetail: "文本、图像、视频 → 文本", context: "128K+ 多模态长上下文评测", access: "闭源 API", aliases: ["seed2.1-pro", "Doubao Seed 2.1 Pro"], sourceId: "seed21", summary: "面向现实生产力、编码交付和视觉/视频理解的 Pro 版本。" },
    { id: "seed2-1-turbo", name: "Seed2.1 Turbo", vendorId: "bytedance", vendor: "ByteDance Seed", releaseDate: "2026-06-23", modality: "vision", modalityDetail: "文本、图像、视频 → 文本", context: "128K+ 多模态长上下文评测", access: "闭源 API", aliases: ["seed2.1-turbo", "Doubao Seed 2.1 Turbo"], sourceId: "seed21", summary: "Seed2.1 家族效率版本，保留 Agent、编码和多模态能力。" },
    { id: "kimi-k3", name: "Kimi K3", vendorId: "moonshot", vendor: "Moonshot AI", releaseDate: "2026-07-17", modality: "vision", modalityDetail: "文本、图像 → 文本", context: "1M", access: "开放权重 / API", aliases: ["kimi-k3", "K3"], sourceId: "alibaba-lifecycle", summary: "2.8T KDA 混合线性注意力旗舰，原生视觉理解。" },
    { id: "hy4-preview", name: "Hy4 Preview", vendorId: "tencent", vendor: "Tencent Hy", releaseDate: "2026-08-28", modality: "language", modalityDetail: "文本 → 文本", context: "1M", access: "开放权重", aliases: ["hy4-preview", "Tencent Hy4"], sourceId: "hy4", summary: "770B/49B active 的纯语言 MoE 旗舰预览版。" }
  ];

  const benchmarks = [
    { id: "agents-last-exam-pass", name: "Agents' Last Exam · Pass Rate", category: "Agent / 工作", direction: "higher", description: "跨专业长程工作流的任务通过率；与 Overall Score 分榜展示。" },
    { id: "agents-last-exam-score", name: "Agents' Last Exam · Overall Score", category: "Agent / 工作", direction: "higher", description: "跨专业长程工作流的总体得分；与 Pass Rate 分榜展示。" },
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
    { id: "frontierswe", name: "FrontierSWE", category: "编码", direction: "higher", description: "前沿软件工程任务；Qwen 表报告 MEAN@5，并说明对照值来自官方榜。" },
    { id: "mls-bench-lite", name: "MLS-Bench-Lite", category: "编码", direction: "higher", description: "机器学习工程 Agent 任务；Harness 与超时设置会影响结果。" },
    { id: "paperbench", name: "PaperBench", category: "科研", direction: "higher", description: "复现论文与科研工程交付；需注明 Agent、评判模型和运行预算。" },
    { id: "androidbench", name: "AndroidBench", category: "编码", direction: "higher", description: "Android 工程任务；Qwen 表使用 95 题公开子集并报告 avg@3。" },
    { id: "qwen-swe-bench", name: "QwenSWEBench", category: "编码", direction: "higher", description: "Qwen 内部软件工程基准；Claude Code harness，avg@3。" },
    { id: "qwen-qoder-bench", name: "QwenQoderBench", category: "编码", direction: "higher", description: "Qwen 内部 Qoder 用户体验基准；Claude Code harness，avg@5。" },
    { id: "qwen-react-bench", name: "QwenReactBench", category: "编码", direction: "higher", description: "双语 React 项目构建基准；自动渲染与多模态评判，报告 Elo。" },
    { id: "qwen-svg-bench", name: "QwenSVGBench", category: "编码", direction: "higher", description: "双语 SVG 代码生成基准；自动渲染与多模态评判，报告 Elo。" },
    { id: "programbench-almost", name: "ProgramBench · Almost Solved", category: "编码", direction: "higher", description: "从零完成系统级工程任务的 Almost Solved 口径。" },
    { id: "programbench-tiers", name: "ProgramBench · Solved Tiers", category: "编码", direction: "higher", description: "Seed 官方报告的多级 Solved 复合指标，仅陈列原值。" },
    { id: "gpqa-diamond", name: "GPQA Diamond", category: "知识 / 推理", direction: "higher", description: "研究生级科学推理。" },
    { id: "hle", name: "Humanity's Last Exam", category: "知识 / 推理", direction: "higher", description: "跨学科专家级推理；有无工具不可直接混比。" },
    { id: "hle-tools", name: "Humanity's Last Exam (with tools)", category: "知识 / 推理", direction: "higher", description: "允许使用工具的 HLE。" },
    { id: "frontiermath-t4", name: "FrontierMath Tier 4 (v2)", category: "知识 / 推理", direction: "higher", description: "最高难度数学推理。" },
    { id: "arc-agi-3", name: "ARC-AGI-3", category: "抽象推理", direction: "higher", description: "交互式新环境抽象推理。" },
    { id: "osworld-2-partial", name: "OSWorld 2.0 · Partial", category: "计算机操作", direction: "higher", description: "桌面计算机操作的 partial 口径；与 strict、binary 分榜。" },
    { id: "osworld-2-strict", name: "OSWorld 2.0 · Strict", category: "计算机操作", direction: "higher", description: "桌面计算机操作的 strict 口径。" },
    { id: "osworld-2-binary", name: "OSWorld 2.0 · Binary", category: "计算机操作", direction: "higher", description: "桌面计算机操作的 binary 口径。" },
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
    { id: "exploitgym-rate", name: "ExploitGym · Success Rate", category: "网络安全", direction: "higher", description: "漏洞利用成功率；不与完成任务数混排。" },
    { id: "exploitgym-tasks", name: "ExploitGym · Solved Tasks", category: "网络安全", direction: "higher", description: "在给定时间预算内完成的任务数；分母保留在设置中。" },
    { id: "cybergym", name: "CyberGym", category: "网络安全", direction: "higher", description: "白盒漏洞发现与验证。" },
    { id: "sec-bench-pro", name: "SEC-Bench Pro", category: "网络安全", direction: "higher", description: "复杂软件 PoC 生成。" },
    { id: "mrcr-256k", name: "MRCR v2 · 256K", category: "长上下文", direction: "higher", description: "8-needle、256K 长上下文检索。" },
    { id: "mrcr-512k", name: "OpenAI MRCR v2 · 512K–1M", category: "长上下文", direction: "higher", description: "8-needle、512K–1M 长上下文检索；不与 256K 分数混排。" },
    { id: "longbench-v2", name: "LongBench v2", category: "长上下文", direction: "higher", description: "真实长上下文理解与推理任务。" },
    { id: "mmlongbench", name: "MMLongBench-128K", category: "长上下文", direction: "higher", description: "128K 多模态长上下文。" },
    { id: "coworkbench", name: "CoWorkBench", category: "专业工作", direction: "higher", description: "覆盖计算机、金融、法律、医疗等领域的长程协作任务。" },
    { id: "workspace-bench", name: "WorkSpaceBench", category: "专业工作", direction: "higher", description: "高经济价值文档与工作区任务。" },
    { id: "jobbench", name: "JobBench", category: "专业工作", direction: "higher", description: "真实职业任务与交付质量评测。" },
    { id: "wide-search", name: "WideSearch", category: "Agent / 工作", direction: "higher", description: "宽域检索 Agent；Qwen 表报告四次运行的平均 item-F1。" },
    { id: "agent-startup-bench", name: "Agent Startup Bench", category: "专业工作", direction: "higher", description: "AI 原生创业公司真实工作流。" },
    { id: "officeqa-pro", name: "OfficeQA Pro", category: "专业工作", direction: "higher", description: "复杂办公文档问答与检索。" },
    { id: "supergpqa", name: "SuperGPQA", category: "知识 / 推理", direction: "higher", description: "广覆盖专业知识问答。" },
    { id: "beyondaime", name: "BeyondAIME", category: "知识 / 推理", direction: "higher", description: "高难数学推理。" },
    { id: "swe-multilingual", name: "SWE-bench Multilingual", category: "编码", direction: "higher", description: "多语言仓库问题修复。" },
    { id: "apex-agents", name: "Apex Agents", category: "Agent / 工作", direction: "higher", description: "Agent 综合任务。" },
    { id: "skillsbench-1-1", name: "SkillsBench 1.1", category: "Agent / 工作", direction: "higher", description: "87 个跨 8 个专业域的真实任务；with Skills 与 without Skills、Agent Harness 必须分开看。" },
    { id: "ifbench", name: "IFBench", category: "知识 / 推理", direction: "higher", description: "指令遵循能力评测。" },
    { id: "one-million-bench", name: "$OneMillion-Bench · Expert Score", category: "专业工作", direction: "higher", description: "高价值专家任务；Qwen 表使用 Gemini 3.1 Pro Preview 评判。" },
    { id: "healthbench", name: "HealthBench", category: "专业工作", direction: "higher", description: "医疗健康对话与专业能力评测。" },
    { id: "plawbench", name: "PLawBench", category: "专业工作", direction: "higher", description: "法律专业任务；Qwen 表使用 Gemini 3.1 Pro Preview 评判。" },
    { id: "prbench-legal", name: "PRBench-Legal", category: "专业工作", direction: "higher", description: "法律专业研究与交付任务。" },
    { id: "prbench-finance", name: "PRBench-Finance", category: "专业工作", direction: "higher", description: "金融专业研究与交付任务。" },
    { id: "wildclawbench-overall", name: "WildClawBench · Overall", category: "Agent / 工作", direction: "higher", description: "开放环境通用 Agent 总体成绩。" },
    { id: "wildclawbench-time", name: "WildClawBench · Elapsed Time", category: "Agent / 工作", direction: "lower", description: "OpenClaw 完整 60 题的总用时，单位为分钟；数值越低越好。" },
    { id: "wildclawbench-cost", name: "WildClawBench · Total Cost", category: "Agent / 工作", direction: "lower", description: "OpenClaw 完整 60 题的总成本，单位为美元；数值越低越好。" },
    { id: "wildclawbench-mm", name: "WildClawBench-MM", category: "Agent / 工作", direction: "higher", description: "多模态 Agent 子榜，评估视觉与音视频任务。与 WildClawBench Overall 分开排名。" },
    { id: "pinchbench-v2-best", name: "PinchBench v2 · Best Success Rate", category: "Agent / 工作", direction: "higher", description: "OpenClaw 真实 Agent 任务的单次最佳成功率；与平均成功率分榜。" },
    { id: "pinchbench-v2-average", name: "PinchBench v2 · Average Success Rate", category: "Agent / 工作", direction: "higher", description: "OpenClaw 真实 Agent 任务的平均成功率；官方榜当前含 147 tasks、620 runs。" }
  ];

  const observations = [];
  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    observations.push({ id: `o${observations.length + 1}`, sourceIds, benchmarkId, modelId, value, unit, setting, note });
  };
  const batch = (sourceIds, benchmarkId, rows, unit = "%", setting = "") => {
    rows.forEach(([modelId, value, rowSetting = setting, note = ""]) => add(sourceIds, benchmarkId, modelId, value, unit, rowSetting, note));
  };
  const qwenComparisonModels = ["claude-opus-4-8", "claude-fable-5", "gpt-5-6-sol", "qwen3-7-max", "qwen3-8-max"];
  const qwenCompare = (benchmarkId, values, unit = "%", setting = "Qwen3.8 官方模型卡对照表", note = "") => {
    values.forEach((value, index) => {
      if (value !== null) add(["qwen38-hf"], benchmarkId, qwenComparisonModels[index], value, unit, setting, note);
    });
  };

  batch(["openai-astra"], "agents-last-exam-score", [["gpt-6-astra",59.3,"最高 effort"],["gpt-5-6-sol",53.6,"最高 effort"],["claude-opus-5",55.5,"最高 effort"]], "Score");
  add(["qwen38", "qwen38-hf"], "agents-last-exam-pass", "qwen3-8-max", 27.0, "%", "Qwen 官方表 / Pass Rate");
  add(["qwen38", "qwen38-hf"], "agents-last-exam-score", "qwen3-8-max", 52.4, "Score", "Qwen 官方表 / Overall Score");
  add(["zai-glm53","deepseek-v41"], "agents-last-exam-pass", "glm-5-3", 28.5, "%", "ALE-CLI / Pass@1");
  add(["zai-glm53","deepseek-v41"], "agents-last-exam-pass", "kimi-k3", 27.6, "%", "ALE-CLI / Pass@1");
  add(["deepseek-v41"], "agents-last-exam-pass", "deepseek-v4-1-flash", 31.8, "%", "官方 scaffold / Pass@1");

  batch(["openai-astra"], "automationbench", [["gpt-6-astra",41.4],["gpt-5-6-sol",18.1],["claude-fable-5-1",31.4],["claude-opus-5",26.9]]);
  batch(["zai-glm53"], "automationbench", [["glm-5-3",48.2],["kimi-k3",46.7],["deepseek-v4-pro",43.2],["gpt-5-6-sol",45.8,"v1.0.6 / Z.ai设置"],["claude-opus-4-8",41.0,"v1.0.6 / Z.ai设置"]]);
  batch(["zai-glm53-flash"], "automationbench", [["glm-5-3-flash",48.8],["gpt-5-6-terra",37.2,"v1.0.6 / Z.ai Flash表"],["gemini-3-7-flash",52.3,"v1.0.6 / Z.ai Flash表"]]);
  add(["qwen38"], "automationbench", "qwen3-8-max", 27.3, "%", "600-task public subset / Pass@1");
  add(["deepseek-v41"], "automationbench", "deepseek-v4-1-flash", 54.8, "%", "官方 scaffold / Pass@1");

  batch(["deepmind-gemini38"], "gdpval-aa-v2", [["gemini-3-8-flash",1545],["claude-opus-5",1824],["gpt-5-6-sol",1710]], "Elo", "Google Model Card");
  batch(["zai-glm53"], "gdpval-aa-v2", [["glm-5-3",1769],["kimi-k3",1682],["deepseek-v4-pro",1590],["qwen3-8-max",1739],["claude-opus-4-8",1588],["gpt-5-6-sol",1730]], "Elo", "Artificial Analysis / Z.ai转载");
  batch(["zai-glm53-flash"], "gdpval-aa-v2", [["glm-5-3-flash",1773],["gpt-5-6-terra",1571],["gemini-3-7-flash",1527]], "Elo", "Artificial Analysis / Z.ai转载");

  batch(["zai-glm53"], "toolathlon", [["glm-5-3",73.0],["kimi-k3",76.5],["deepseek-v4-pro",74.1],["qwen3-8-max",72.5],["claude-opus-4-8",76.2],["gpt-5-6-sol",74.9]], "%", "Verified / Pass@1");
  batch(["zai-glm53-flash"], "toolathlon", [["glm-5-3-flash",78.4],["deepseek-v4-vision-exp",75.9],["claude-opus-4-8",76.2]], "%", "Verified / 三次运行均值");
  add(["hy4"], "toolathlon", "hy4-preview", 74.1, "%", "HF Eval Result / Verified");

  batch(["openai-gpt56","zai-glm53","deepseek-v41","deepmind-gemini38"], "terminal-bench-2-1", [["gpt-5-6-sol",88.8,"厂商公开表共同值"]]);
  batch(["deepmind-gemini38"], "terminal-bench-2-1", [["gemini-3-8-flash",89.4],["claude-opus-5",89.1],["gpt-5-6-sol",88.8]], "%", "Google Model Card");
  batch(["zai-glm53"], "terminal-bench-2-1", [["glm-5-3",88.2],["kimi-k3",88.3],["deepseek-v4-pro",87.9],["qwen3-8-max",86.6],["claude-opus-4-8",85.0,"Z.ai复现"]]);
  batch(["zai-glm53-flash"], "terminal-bench-2-1", [["glm-5-3-flash",84.3],["deepseek-v4-vision-exp",83.9]]);
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

  batch(["zai-glm53"], "programbench-almost", [["glm-5-3",19.0],["kimi-k3",17.5],["qwen3-8-max",10.5],["claude-opus-4-8",15.5],["gpt-5-6-sol",23.0]], "%", "Almost Solved");
  add(["deepseek-v41"], "programbench-almost", "deepseek-v4-1-flash", 20.3, "%", "Almost@1");
  add(["seed21"], "programbench-tiers", "seed2-1-pro", "0 / 1 / 50.3", "Solved tiers", "Seed官方复合指标");
  add(["seed21"], "programbench-tiers", "seed2-1-turbo", "0 / 0 / 49.4", "Solved tiers", "Seed官方复合指标");

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

  batch(["openai-astra"], "osworld-2-partial", [["gpt-6-astra",72.6],["gpt-5-6-sol",65.7],["claude-opus-5",70.2]], "%", "v2026.08.08 offline / partial");
  batch(["anthropic-fable51"], "osworld-2-partial", [["claude-fable-5-1",77.9],["claude-opus-5",75.4]], "%", "2026-08任务集 / partial");
  add(["anthropic-fable51"], "osworld-2-strict", "claude-fable-5-1", 41.7, "%", "2026-08任务集 / strict");
  add(["zai-glm53-flash"], "osworld-2-partial", "glm-5-3-flash", 59.1, "%", "Z.ai Flash设置 / partial");
  add(["deepmind-gemini38"], "osworld-2-partial", "gemini-3-8-flash", 59.0, "%", "partial / batch tool enabled");
  add(["qwen38"], "osworld-2-binary", "qwen3-8-max", 19.4, "%", "Qwen官方表 / binary");
  add(["qwen38"], "osworld-2-partial", "qwen3-8-max", 46.7, "%", "Qwen官方表 / partial");

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

  batch(["openai-astra"], "exploitgym-rate", [["gpt-6-astra",42.4],["gpt-5-6-sol",30.3],["claude-fable-5-1",30.4],["claude-opus-5",22.0]], "%", "成功率 / 无生产安全策略");
  add(["zai-glm53"], "exploitgym-tasks", "glm-5-3", 105, "tasks", "105 / 130 · 2h / 6h 时间归一化任务数");
  add(["zai-glm53"], "exploitgym-tasks", "kimi-k3", 36, "tasks", "36 / 70 · 2h / 6h 时间归一化任务数");
  add(["zai-glm53"], "exploitgym-tasks", "qwen3-8-max", 14, "tasks", "14 / 26 · 2h / 6h 时间归一化任务数");
  add(["zai-glm53"], "exploitgym-tasks", "claude-fable-5", 181, "tasks", "181 / 247 · 2h / 6h 时间归一化任务数");
  add(["zai-glm53"], "exploitgym-tasks", "gpt-5-6-sol", 216, "tasks", "216 / 293 · 2h / 6h 时间归一化任务数");
  add(["deepseek-v41"], "exploitgym-rate", "deepseek-v4-1-flash", 15.3, "%", "Pass@1");

  batch(["zai-glm53"], "cybergym", [["glm-5-3",84.5],["kimi-k3",80.0],["deepseek-v4-pro",83.3],["qwen3-8-max",78.5],["claude-fable-5",83.8],["gpt-5-6-sol",83.6]], "%", "Claude Code / 无Web工具");
  add(["deepseek-v41"], "cybergym", "deepseek-v4-1-flash", 88.1, "%", "Pass@1");
  batch(["openai-astra"], "sec-bench-pro", [["gpt-6-astra",85.4],["gpt-5-6-sol",79.1]], "%", "OpenAI公开设置");
  add(["deepseek-v41"], "sec-bench-pro", "deepseek-v4-1-flash", 62.8, "%", "Claude Code harness");

  batch(["openai-astra"], "mrcr-512k", [["gpt-6-astra",96.3],["gpt-5-6-sol",73.8]], "%", "8-needle / 512K–1M");
  add(["qwen38", "qwen38-hf"], "mrcr-256k", "qwen3-8-max", 92.9, "%", "MRCR v2 256K / 8-needle");
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

  // Qwen3.8 official model card: full comparison table, including cross-vendor rows.
  qwenCompare("terminal-bench-2-1", [84.6, 84.6, 88.8, 74.5, 86.6], "%", "Qwen表：Qwen 采用 Claude Code avg@10、5h、max_tokens 131072；友商取公开最高分");
  qwenCompare("swe-bench-pro", [69.2, 80.0, 64.6, 60.6, 67.7], "%", "Qwen表：Claude Code · temp 1.0 · top_p 0.95 · 256K · refined tasks");
  qwenCompare("deepswe-v1-1", [59.0, 70.0, 73.0, 21.6, 56.6], "%", "Qwen表：Claude Code / mini-SWE-agent 取较高值 · 256K");
  qwenCompare("nl2repo", [69.4, null, null, 47.2, 55.9], "%", "Qwen表：Claude Code · 禁止访问目标仓库的 Bash 命令");
  qwenCompare("frontierswe", [70.0, 88.8, null, 40.7, 73.5], "%", "Qwen表：Claude Code；对照为 2026-08-03 官方榜 MEAN@5");
  qwenCompare("mls-bench-lite", [42.8, 49.9, 46.2, 31.7, 41.0], "%", "Qwen表：Claude Code · 5h · max_tokens 131072；对照来自官方榜");
  qwenCompare("paperbench", [80.3, 88.8, 90.5, 64.8, 93.0], "%", "Qwen表：BasicAgent · Code-Dev · Claude Opus 4.6 judge · 3次均值 · 最长12h");
  qwenCompare("androidbench", [69.8, 84.5, 74.0, 56.5, 75.1], "%", "Qwen表：95题公开子集 · avg@3");
  qwenCompare("qwen-swe-bench", [84.0, 86.3, 73.5, 63.4, 80.7], "%", "Qwen内部基准：Claude Code · avg@3 · 8h · 256K");
  qwenCompare("qwen-qoder-bench", [62.7, 63.1, 53.8, 36.8, 58.4], "%", "Qwen内部基准：Claude Code · avg@5 · 6h · 256K");
  qwenCompare("qwen-react-bench", [1694, 1770, 1564, 1538, 1724], "Elo", "Qwen内部双语 React 基准 · 自动渲染 + 多模态评判 · BT/Elo");
  qwenCompare("qwen-svg-bench", [1648, 1690, 1758, 1499, 1713], "Elo", "Qwen内部双语 SVG 基准 · 自动渲染 + 多模态评判 · BT/Elo");

  qwenCompare("coworkbench", [72.3, 75.9, 71.5, 64.6, 74.8], "%", "Qwen内部 CoWorkBench");
  qwenCompare("workspace-bench", [66.8, 68.7, 65.6, 61.4, 67.7]);
  qwenCompare("jobbench", [48.4, 57.4, 45.4, 31.3, 53.4]);
  qwenCompare("skillsbench-1-1", [65.1, 70.9, 73.5, 61.2, 70.2], "%", "Qwen他测：v1.1 · 87 tasks · 每题3次均值；Opus/Fable=Claude Code，GPT=Codex，Qwen=OpenCode");
  qwenCompare("agents-last-exam-pass", [27.0, null, 30.6, 11.8, 27.0], "%", "Qwen表：Pass Rate");
  qwenCompare("agents-last-exam-score", [45.1, null, 53.6, 31.1, 52.4], "Score", "Qwen表：Overall Score");
  qwenCompare("automationbench", [27.2, 29.1, 29.7, 14.2, 27.3], "%", "Qwen表：600题公开子集 · Pass@1");
  qwenCompare("toolathlon", [76.2, 77.9, 74.9, 49.7, 72.5], "%", "Qwen表：Verified · Pass@1");
  qwenCompare("wide-search", [72.9, 81.2, null, 75.2, 81.9], "%", "Qwen表：友商=Claude Code，Qwen=Qwen-Agent · 4次平均 item-F1");
  qwenCompare("hle-tools", [57.9, 64.5, 58.0, 53.5, 56.2], "%", "Qwen表：with tools");

  qwenCompare("gpqa-diamond", [92.0, 92.6, 94.1, 92.4, 92.6]);
  qwenCompare("hle", [45.7, 53.3, 47.2, 41.4, 43.6], "%", "Qwen表：无工具");
  qwenCompare("ifbench", [62.2, 63.5, 72.7, 79.1, 82.8]);
  qwenCompare("one-million-bench", [41.8, 55.9, 53.8, 44.4, 52.5], "Score", "Qwen表：expert score · Gemini 3.1 Pro Preview judge");
  qwenCompare("healthbench", [52.4, null, 55.3, 54.5, 60.2]);
  qwenCompare("plawbench", [69.6, 70.2, 72.3, 58.9, 73.2], "%", "Qwen表：Gemini 3.1 Pro Preview judge");
  qwenCompare("prbench-legal", [52.7, 57.6, 57.6, 48.5, 57.6]);
  qwenCompare("prbench-finance", [51.9, 55.8, 55.5, 46.8, 58.3]);
  qwenCompare("mrcr-256k", [83.2, null, 93.8, 86.7, 92.9], "%", "Qwen表：MRCR v2 · 256K · 8-needle");
  qwenCompare("longbench-v2", [69.1, null, 67.1, 65.3, 66.3]);
  add(["qwen38-hf"], "wildclawbench-overall", "qwen3-8-max", 56.2, "%", "Hugging Face Eval Results");
  add(["qwen38-hf"], "wildclawbench-time", "qwen3-8-max", 708, "min", "Hugging Face Eval Results");
  batch(["wildclawbench"], "wildclawbench-overall", [
    ["gpt-5-6-sol", 67.2], ["claude-opus-4-8", 64.7], ["claude-fable-5", 62.0],
    ["qwen3-8-max", 56.2], ["kimi-k3", 54.5], ["deepseek-v4-pro", 43.7],
    ["gemini-3-1-pro", 40.8, "OpenClaw · 60 tasks · low-effort"]
  ], "%", "OpenClaw · 完整60题");
  batch(["wildclawbench"], "wildclawbench-time", [
    ["gpt-5-6-sol", 222], ["claude-opus-4-8", 400], ["claude-fable-5", 324],
    ["qwen3-8-max", 708], ["kimi-k3", 488], ["deepseek-v4-pro", 605], ["gemini-3-1-pro", 240]
  ], "min", "OpenClaw · 完整60题总用时");
  batch(["wildclawbench"], "wildclawbench-cost", [
    ["gpt-5-6-sol", 56.78], ["claude-opus-4-8", 95.95], ["claude-fable-5", 87.71],
    ["qwen3-8-max", 24.70], ["kimi-k3", 40.08], ["deepseek-v4-pro", 12.00], ["gemini-3-1-pro", 18.00]
  ], "USD", "OpenClaw · 完整60题总成本");

  batch(["qwen38-omni"], "wildclawbench-mm", [
    ["qwen3-8-omni-flash", 71.0], ["gemini-3-8-flash", 58.9], ["qwen3-5-omni-plus", 34.5]
  ], "%", "Qwen3.8 Omni Flash 官方发布表");

  batch(["pinchbench-v2"], "pinchbench-v2-best", [
    ["claude-opus-4-8-fast", 94.5], ["qwen3-7-max", 93.4], ["claude-opus-4-8", 91.8],
    ["gpt-5-6-luna", 90.8], ["gpt-5-6-sol", 87.0], ["gemini-3-1-pro", 82.9],
    ["deepseek-v4-pro", 81.6], ["claude-fable-5", 59.6]
  ], "%", "PinchBench v2 官方榜 · Best % · 147 tasks");
  batch(["pinchbench-v2"], "pinchbench-v2-average", [
    ["claude-opus-4-8-fast", 93.5], ["qwen3-7-max", 92.5], ["claude-opus-4-8", 90.5],
    ["gpt-5-6-luna", 88.7], ["gpt-5-6-sol", 84.2], ["gemini-3-1-pro", 81.0],
    ["deepseek-v4-pro", 61.1], ["claude-fable-5", 54.8]
  ], "%", "PinchBench v2 官方榜 · Avg % · 620 runs");

  add(["skillsbench-1-1"], "skillsbench-1-1", "claude-opus-4-8", 54.1, "%", "with Skills · OpenHands · 87 tasks · up to 3 trials", "without Skills: 45.7% · official v1.1 leaderboard");
  add(["skillsbench-1-1"], "skillsbench-1-1", "gemini-3-1-pro", 52.8, "%", "with Skills · OpenHands · 87 tasks · up to 3 trials", "without Skills: 33.8% · official v1.1 leaderboard");
  add(["skillsbench-1-1"], "skillsbench-1-1", "gemini-3-1-pro", 60.8, "%", "with Skills · Gemini CLI · 87 tasks · up to 3 trials", "without Skills: 36.0% · official v1.1 leaderboard");
  add(["skillsbench-1-1"], "skillsbench-1-1", "deepseek-v4-pro", 50.1, "%", "with Skills · OpenHands · 87 tasks · up to 3 trials", "official row label: DeepSeek V4 Pro · without Skills: 26.9%");

  return { meta, sources, models, benchmarks, observations };
})();
