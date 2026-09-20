window.BENCH_DATA = (() => {
  const meta = {
    title: "BenchBoard",
    updated: "2026-09-21",
    scope: "截至 2026-09-21 的领先通用/Agent 模型公开成绩"
  };

  const sources = [
    { id: "openai-astra", vendorId: "openai", publisher: "OpenAI", date: "2026-09-01", tier: "official", title: "GPT-6 Astra: A new generation of intelligence", url: "https://openai.com/index/gpt-6-astra/" },
    { id: "openai-astra-work", vendorId: "openai", publisher: "OpenAI", date: "2026-09-09", tier: "official", title: "GPT-6 Astra: The next generation in intelligence for work", url: "https://openai.com/index/gpt-6-astra-next-generation-work/" },
    { id: "openai-gpt56", vendorId: "openai", publisher: "OpenAI", date: "2026-07-09", tier: "official", title: "GPT-5.6: Frontier intelligence that scales with your ambition", url: "https://openai.com/index/gpt-5-6/" },
    { id: "anthropic-fable51", vendorId: "anthropic", publisher: "Anthropic", date: "2026-09-01", tier: "official", title: "Introducing Claude Fable 5.1 and Claude Mythos 5.1", url: "https://www.anthropic.com/claude-fable-and-mythos-5-1" },
    { id: "deepmind-gemini38", vendorId: "google", publisher: "Google DeepMind", date: "2026-09-02", tier: "official", title: "Gemini 3.8 Flash — Model Card", url: "https://deepmind.google/models/model-cards/gemini-3-8-flash/" },
    { id: "deepseek-v41", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-09-10", tier: "official", title: "DeepSeek-V4.1-Flash — Official Model Card", url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash" },
    { id: "zai-glm53", vendorId: "zai", publisher: "Z.ai", date: "2026-08-14", tier: "official", title: "GLM-5.3: Frontier Coding with Emergent Cyber Capabilities", url: "https://z.ai/blog/glm-5.3" },
    { id: "zai-glm53-flash", vendorId: "zai", publisher: "Z.ai", date: "2026-08-26", tier: "official", title: "GLM-5.3-Flash: Frontier Intelligence, Flash Cost", url: "https://z.ai/blog/glm-5.3-flash" },
    { id: "qwen38", vendorId: "alibaba", publisher: "Qwen / Alibaba Cloud", date: "2026-08-03", tier: "official", title: "Qwen3.8-Max: A New Bar for Coding and Cowork", url: "https://qwen.ai/blog?id=qwen3.8" },
    { id: "qwen38-hf", vendorId: "alibaba", publisher: "Qwen", date: "2026-08-13", tier: "official", title: "Qwen3.8-2.4T-A95B — Official Model Card", url: "https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B" },
    { id: "qwen38-omni", vendorId: "alibaba", publisher: "Qwen", date: "2026-09-18", tier: "official", title: "Qwen3.8-Omni-Flash: Omni Senses. Agentic Delivery.", url: "https://qwen.ai/blog?id=qwen3.8-omni-flash" },
    { id: "qwen37", vendorId: "alibaba", publisher: "Qwen / Alibaba Cloud", date: "2026-05-21", tier: "official", title: "Qwen3.7: The Agent Frontier", url: "https://www.alibabacloud.com/blog/qwen3-7-the-agent-frontier_603154" },
    { id: "qwen37-plus", vendorId: "alibaba", publisher: "Qwen / Alibaba Cloud", date: "2026-06-03", tier: "official", title: "Qwen3.7-Plus: Multimodal Agent Intelligence", url: "https://www.alibabacloud.com/blog/qwen3-7-plus-multimodal-agent-intelligence_603206" },
    { id: "meta-muse-spark12", vendorId: "meta", publisher: "Meta", date: "2026-08-05", tier: "official", title: "Meet Muse Spark 1.2 and Muse Code, the first coding agent from Meta", url: "https://developer.meta.com/ai/resources/blog/build-with-muse-code/" },
    { id: "xai-grok45", vendorId: "xai", publisher: "SpaceXAI", date: "2026-07-16", tier: "official", title: "Introducing Grok 4.5", url: "https://x.ai/news/grok-4-5" },
    { id: "wildclawbench", vendorId: "wildclawbench", kind: "benchmark", publisher: "WildClawBench / InternLM", date: "2026-07-20", tier: "official", title: "WildClawBench Official Leaderboard", url: "https://internlm.github.io/WildClawBench/" },
    { id: "alibaba-lifecycle", vendorId: "alibaba", publisher: "Alibaba Cloud Model Studio", date: "2026-09-18", tier: "official", title: "模型上下架与更新", url: "https://help.aliyun.com/zh/model-studio/newly-released-models" },
    { id: "seed21", vendorId: "bytedance", publisher: "ByteDance Seed", date: "2026-06-23", tier: "official", title: "Seed2.1 — Model Card", url: "https://seed.bytedance.com/en/seed2_1" },
    { id: "hy4", vendorId: "tencent", publisher: "Tencent Hy", date: "2026-08-28", tier: "official", title: "Hy4-preview — Official Model Card", url: "https://huggingface.co/tencent/Hy4-preview" },
    { id: "skillsbench-1-1", vendorId: "benchflow", kind: "benchmark", publisher: "SkillsBench / BenchFlow", date: "2026-07-16", tier: "official", title: "SkillsBench 1.1 Official Leaderboard", url: "https://www.skillsbench.ai/" },
    { id: "pinchbench-v2", vendorId: "pinchbench", kind: "benchmark", publisher: "PinchBench", date: "2026-08-18", tier: "official", title: "PinchBench v2 — OpenClaw Benchmark Leaderboard", url: "https://pinchbench.com/" },
    { id: "rngbench", vendorId: "rngbench", kind: "benchmark", publisher: "RNG-Bench / InternLM", date: "2026-07-07", tier: "official", title: "RNG-Bench Official Results", url: "https://internlm.github.io/RNGBench/" },
    { id: "qwenclawbench", vendorId: "qwenclawbench", kind: "benchmark", publisher: "QwenClawBench / Qwen Team", date: "2026-04", tier: "official", title: "QwenClawBench v1.1", url: "https://github.com/SKYLENAGE-AI/QwenClawBench" },
    { id: "workspacebench", vendorId: "workspacebench", kind: "benchmark", publisher: "Workspace-Bench", date: "2026-05-05", tier: "official", title: "Workspace-Bench 1.0", url: "https://github.com/OpenDataBox/Workspace-Bench" },
    { id: "claweval", vendorId: "claweval", kind: "benchmark", publisher: "Claw-Eval", date: "2026", tier: "official", title: "Claw-Eval Official Benchmark", url: "https://github.com/claw-eval/claw-eval" }
  ];

  const sourceAudits = [
    {
      sourceId: "qwen38-omni",
      status: "complete",
      auditedAt: "2026-09-20",
      expectedObservationCount: 302,
      benchmarkIds: ["wildclawbench-mm", "uniclawbench", "agenticvbench", "omnigaia", "dailyomni", "worldsense", "avut", "joinavbench", "omnivideobench", "video-mme-v2", "lvomnibench", "omnicloze", "omnicap-if-csr", "omnicap-if-isr", "qivd", "streamingbench", "alimeeting-der", "alimeeting-cpwer", "aishell4-der", "aishell4-cpwer", "magicdata-ramc-der", "magicdata-ramc-cpwer", "mlc-slm-en-der", "mlc-slm-en-cpwer", "wenetspeech-net-wer", "wenetspeech-meeting-wer", "fleurs-asr-wer", "fleurs-s2tt-bleu", "spotsoundbench", "mmau", "mmar", "mmsu", "longaudiospan-accuracy", "longaudiospan-rubric", "longaudiospan-chain", "muchomusic-rul", "hummusqa", "mustbench", "audio-multichallenge", "wildspeech", "voicebench", "deepswe-v1-1", "swe-bench-pro", "swe-multilingual", "nl2repo", "coworkbench", "ifbench", "gpqa-diamond", "hle", "livecodebench-v6", "claweval-mm-pass3", "claweval-mm-average", "androidworld", "vision2web", "erqa", "lvbench", "realworldqa", "mathvision-without-ci", "mathvision-with-ci", "charxiv-rq-without-ci", "charxiv-rq-with-ci"],
      note: "Omni、Agentic Omni Understanding、Text、Vision 四个结果区块的全部公开数值单元格已录入；空白/-- 不伪造为零。"
    },
    {
      sourceId: "meta-muse-spark12",
      status: "complete",
      auditedAt: "2026-09-20",
      expectedObservationCount: 23,
      benchmarkIds: ["terminal-bench-2-1", "deepswe-v1-1", "meta-internal-coding-bench", "gdpval-aa-v2"],
      note: "Meta 官方模型页和同日博客中的四张 Benchmark 图已逐图核对；共 23 个公开数值单元格，Harness 标签按图保留。"
    },
    ...["openai-astra", "openai-astra-work", "openai-gpt56", "anthropic-fable51", "deepmind-gemini38", "deepseek-v41", "zai-glm53", "zai-glm53-flash", "qwen38", "qwen38-hf", "qwen37", "qwen37-plus", "xai-grok45", "seed21", "hy4", "skillsbench-1-1", "pinchbench-v2", "rngbench", "qwenclawbench", "workspacebench", "claweval", "wildclawbench"].map((sourceId) => ({
      sourceId,
      status: "pending",
      note: "已引用其中部分成绩；尚未完成逐表、逐单元格覆盖核对。"
    })),
    {
      sourceId: "alibaba-lifecycle",
      status: "metadata-only",
      auditedAt: "2026-09-20",
      note: "模型版本上架、升级与下架信息页，不是 Benchmark 成绩表。"
    }
  ];

  const models = [
    { id: "gpt-6-astra", name: "GPT-6 Astra", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-09-01", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["gpt-6-astra"], sourceId: "openai-astra", summary: "当前 OpenAI 前沿旗舰，突出计算机使用、科学、代码与网络安全。" },
    { id: "gpt-5-6-sol", name: "GPT-5.6 Sol", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-07-09", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "1M 档长上下文评测", access: "闭源 API", aliases: ["gpt-5.6-sol", "GPT-5.6 Sol"], sourceId: "openai-gpt56", summary: "GPT-5.6 家族旗舰，覆盖编码、知识工作、科研和多模态。" },
    { id: "gpt-5-6-terra", name: "GPT-5.6 Terra", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026", modality: "vision", modalityDetail: "多模态模型；当前仅收录 Z.ai 官方表中的精确版本名与对照成绩", context: "未核实", access: "闭源 API", aliases: ["gpt-5.6-terra", "GPT-5.6 Terra"], sourceId: "zai-glm53-flash", summary: "GLM-5.3 Flash 官方表使用的独立对照版本；不与 GPT-5.6 Sol 合并。" },
    { id: "gpt-5-6-luna", name: "GPT-5.6 Luna", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、工具调用 → 文本", context: "未披露", access: "闭源 API", aliases: ["openai/gpt-5.6-luna"], sourceId: "openai-gpt56", summary: "GPT-5.6 家族的低延迟版本；PinchBench v2 当前榜单中的前沿模型。" },
    { id: "gpt-5-4", name: "GPT-5.4", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像 → 文本；RNGBench 官方主榜使用的精确模型名", context: "未核实", access: "API", aliases: ["gpt-5.4", "GPT-5.4"], sourceId: "rngbench", summary: "RNG-Bench 官方主榜中的多模态对照模型；不与 GPT-5.6 系列合并。" },
    { id: "claude-fable-5-1", name: "Claude Fable 5.1", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-09-01", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-fable-5-1"], sourceId: "anthropic-fable51", summary: "面向编码、知识工作与长程任务的最新 Fable 模型。" },
    { id: "claude-mythos-5-1", name: "Claude Mythos 5.1", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-09-01", modality: "vision", modalityDetail: "与 Fable 5.1 同模型，安全策略更宽松", context: "未披露", access: "受限访问", aliases: ["claude-mythos-5-1"], sourceId: "anthropic-fable51", summary: "与 Fable 5.1 权重相同，面向经审核的网络安全与生命科学用户。" },
    { id: "claude-opus-5", name: "Claude Opus 5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-07-24", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-opus-5"], sourceId: "anthropic-fable51", summary: "Anthropic Opus 系列前沿模型，作为多份同期官方表的强基线。" },
    { id: "claude-fable-5", name: "Claude Fable 5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-06-09", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-fable-5"], sourceId: "anthropic-fable51", summary: "Fable 5.1 的前代；保留是为了正确承接同期厂商表中的对照分数。" },
    { id: "claude-opus-4-8", name: "Claude Opus 4.8", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作 → 文本", context: "未披露", access: "闭源 API", aliases: ["claude-opus-4-8"], sourceId: "anthropic-fable51", summary: "多份 2026 年中厂商表使用的强基线；与 Opus 5 分开保存。" },
    { id: "claude-opus-4-8-fast", name: "Claude Opus 4.8 Fast", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、工具调用 → 文本", context: "未披露", access: "闭源 API 路由", aliases: ["anthropic/claude-opus-4.8-fast"], sourceId: "pinchbench-v2", summary: "PinchBench 单独列出的 Opus 4.8 快速路由；不与标准 Opus 4.8 合并。" },
    { id: "gemini-3-8-flash", name: "Gemini 3.8 Flash", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026-09-02", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API", aliases: ["gemini-3.8-flash"], sourceId: "deepmind-gemini38", summary: "原生全模态 Flash 模型，面向低成本 Agent、软件工程和知识工作。" },
    { id: "gemini-3-6-flash", name: "Gemini 3.6 Flash", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本；Meta 官方表使用 high 设置", context: "未核实", access: "闭源 API", aliases: ["gemini-3.6-flash", "Gemini 3.6 Flash (high)"], sourceId: "meta-muse-spark12", summary: "Meta Muse Spark 1.2 官方发布表中的全模态对照模型；保留 high 推理设置。" },
    { id: "gemini-3-7-flash", name: "Gemini 3.7 Flash", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026", modality: "omni", modalityDetail: "全模态模型；当前仅收录 Z.ai 官方表中的精确版本名与对照成绩", context: "未核实", access: "闭源 API", aliases: ["gemini-3.7-flash"], sourceId: "zai-glm53-flash", summary: "GLM-5.3 Flash 官方表使用的独立对照版本；不与 Gemini 3.8 Flash 合并。" },
    { id: "gemini-3-1-pro", name: "Gemini 3.1 Pro", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026-02", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API", aliases: ["gemini-3.1-pro"], sourceId: "deepmind-gemini38", summary: "Gemini 3 系列 Pro 模型，多份厂商表中的多模态对照基线。" },
    { id: "deepseek-v4-1-flash", name: "DeepSeek V4.1 Flash", vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026-09-10", modality: "vision", modalityDetail: "文本、图像 → 文本", context: "1M", access: "开放权重 / API", aliases: ["deepseek-v4.1-flash", "deepseek-flash"], sourceId: "deepseek-v41", summary: "552B MoE、输入激活 8B/输出 16B，原生视觉理解。" },
    { id: "deepseek-v4-vision-exp", name: "DeepSeek V4 Vision Exp", vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026", modality: "vision", modalityDetail: "视觉语言实验版本；当前仅收录 Z.ai 官方表中的精确版本名与对照成绩", context: "未核实", access: "实验版本", aliases: ["DeepSeek V4 Vision Exp"], sourceId: "zai-glm53-flash", summary: "GLM-5.3 Flash 官方表使用的独立对照版本；不与 DeepSeek V4.1 Flash 合并。" },
    { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro 0813", vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026-08-13", modality: "language", modalityDetail: "文本 → 文本", context: "1M", access: "API（已进入迁移期）", aliases: ["deepseek-v4-pro-0813"], sourceId: "alibaba-lifecycle", summary: "1.6T MoE 旗舰快照；官方已宣布流量逐步迁移至 V4.1 Flash。" },
    { id: "qwen3-8-max", name: "Qwen3.8 Max", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-02", modality: "vision", modalityDetail: "服务版：文本、图像 → 文本；官方卡另列内置工具与非思考模式", context: "1M", access: "闭源 API（基于开放权重底座）", aliases: ["qwen3.8-max"], sourceId: "qwen38-hf", summary: "Qwen3.8 的官方托管服务版；模型卡 Benchmark 表中的 Qwen3.8-Max 均归到这里。" },
    { id: "qwen3-8-2-4t-a95b", name: "Qwen3.8-2.4T-A95B", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-13", modality: "language", modalityDetail: "文本 → 文本；仅思考模式，不支持多模态输入", context: "262K 原生 / 可扩展至 1.01M", access: "开放权重", aliases: ["Qwen/Qwen3.8-2.4T-A95B"], sourceId: "qwen38-hf", scoreStatus: "base-model", summary: "2.4T 总参数、95B 激活的纯语言开放权重底座；与支持视觉的 Qwen3.8-Max 服务版分开登记。" },
    { id: "qwen3-7-max", name: "Qwen3.7 Max", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-05-21", modality: "vision", modalityDetail: "文本、图像 → 文本；支持主流 Agent Harness", context: "未披露", access: "闭源 API", aliases: ["qwen3.7-max"], sourceId: "qwen37", summary: "Qwen3.7 旗舰 Agent 模型；官方报告了 OpenClaw、Claude Code 与 Hermes 跨 Harness 成绩。" },
    { id: "qwen3-7-plus", name: "Qwen3.7 Plus", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-06-03", modality: "vision", modalityDetail: "文本、图像、视频、屏幕/GUI → 文本与工具调用", context: "未披露", access: "闭源 API", aliases: ["qwen3.7-plus"], sourceId: "qwen37-plus", summary: "面向 GUI、CLI 与多模态交互的 Agent 模型，官方报告 QwenClawBench、ClawEval 与 SkillsBench 等成绩。" },
    { id: "qwen3-8-max-0902", name: "Qwen3.8 Max 0902", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-09-02", modality: "vision", modalityDetail: "文本、图像、长视频 → 文本", context: "1M", access: "API 快照", aliases: ["qwen3.8-max-0902", "qwen3.8-max-2026-09-02"], sourceId: "alibaba-lifecycle", scoreStatus: "pending", summary: "9 月 2 日升级快照；官方尚未披露独立完整 Benchmark 表。" },
    { id: "qwen3-8-flash", name: "Qwen3.8 Flash", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-26", modality: "vision", modalityDetail: "文本、图像、长视频 → 文本", context: "1M", access: "API", aliases: ["qwen3.8-flash"], sourceId: "qwen38-omni", summary: "多模态高并发版本；Qwen3.8 Omni Flash 发布页提供了完整对照成绩。" },
    { id: "qwen3-8-omni-flash", name: "Qwen3.8 Omni Flash", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-09-18", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API", aliases: ["qwen3.8-omni-flash"], sourceId: "qwen38-omni", summary: "Qwen3.8 的原生全模态版本，面向音视频 Agent、编码和长程任务。" },
    { id: "qwen3-5-omni-plus", name: "Qwen3.5 Omni Plus", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "未核实", access: "闭源 API", aliases: ["qwen3.5-omni-plus"], sourceId: "qwen38-omni", summary: "Qwen3.8 Omni Flash 官方发布表中的上一代全模态对照模型。" },
    { id: "qwen3-8-27b", name: "Qwen3.8 27B", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、视频 → 文本；以 Qwen 官方表原始标签登记", context: "未核实", access: "未核实", aliases: ["Qwen3.8-27B", "qwen3.8-27b"], sourceId: "qwen38-omni", summary: "Qwen3.8 Omni Flash 官方 Text 与 Vision 表中的 27B 对照模型。" },
    { id: "deepseek-v4-flash-0731", name: "DeepSeek V4 Flash 0731", vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026-07-31", modality: "vision", modalityDetail: "以 Qwen 官方表原始版本标签登记；输入模态待 DeepSeek 一手资料补证", context: "未核实", access: "未核实", aliases: ["DeepSeek-V4-Flash-0731"], sourceId: "qwen38-omni", summary: "Qwen3.8 Omni Flash 官方 Text 表中的 DeepSeek 对照快照；不与 V4.1 Flash 合并。" },
    { id: "claude-opus-4-6-max", name: "Claude Opus 4.6 Max", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像 → 文本；以 Qwen 官方表原始 Max 标签登记", context: "未核实", access: "闭源 API", aliases: ["Claude-Opus-4.6 (Max)"], sourceId: "qwen38-omni", summary: "Qwen3.8 Omni Flash 官方 Text 与 Vision 表中的 Max-effort 对照。" },
    { id: "muse-spark-1-2", name: "Muse Spark 1.2", vendorId: "meta", vendor: "Meta", releaseDate: "2026-08-05", modality: "omni", modalityDetail: "文本、图像、音频、视频、PDF → 文本", context: "1M", access: "闭源 API", aliases: ["muse-spark-1.2", "muse-spark-1.2-contributor"], sourceId: "meta-muse-spark12", summary: "Meta 的全模态编码与长程 Agent 模型，与 Muse Code 协同训练。" },
    { id: "muse-spark-1-1", name: "Muse Spark 1.1", vendorId: "meta", vendor: "Meta", releaseDate: "2026", modality: "omni", modalityDetail: "文本、图像、音频、视频、PDF → 文本", context: "1M", access: "闭源 API", aliases: ["muse-spark-1.1"], sourceId: "meta-muse-spark12", summary: "Muse Spark 1.2 官方发布表中的上一代全模态对照模型。" },
    { id: "grok-4-5", name: "Grok 4.5", vendorId: "xai", vendor: "SpaceXAI", releaseDate: "2026-07-16", modality: "vision", modalityDetail: "文本、图像 → 文本", context: "500K", access: "闭源 API", aliases: ["grok-4.5", "grok-4.5-latest", "grok-build-latest"], sourceId: "xai-grok45", summary: "面向编码、Agent 软件工程和知识工作的视觉语言模型。" },
    { id: "qwen3-5-397b", name: "Qwen3.5-397B", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像 → 文本；RNGBench 官方主榜使用的精确模型名", context: "未核实", access: "具体快照未核实", aliases: ["Qwen3.5-397B", "qwen3.5-397b"], sourceId: "rngbench", summary: "RNG-Bench 官方主榜中的多模态对照模型；保留其原始版本标签。" },
    { id: "glm-5-3", name: "GLM-5.3", vendorId: "zai", vendor: "Z.ai", releaseDate: "2026-08-14", modality: "language", modalityDetail: "文本 → 文本", context: "1M", access: "开放权重 / API", aliases: ["glm-5.3"], sourceId: "zai-glm53", summary: "纯语言长程 Agent 旗舰，突出编码与网络安全。" },
    { id: "glm-5-3-flash", name: "GLM-5.3 Flash", vendorId: "zai", vendor: "Z.ai", releaseDate: "2026-08-26", modality: "vision", modalityDetail: "文本、图像、视频、文件 → 文本", context: "1M", access: "开放权重 / API", aliases: ["glm-5.3-flash", "ox-alpha"], sourceId: "zai-glm53-flash", summary: "GLM-5 系列首个原生多模态模型，320B/18B active。" },
    { id: "seed2-0-lite", name: "Seed-2.0-Lite", vendorId: "bytedance", vendor: "ByteDance Seed", releaseDate: "2026", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本；Qwen 对照表直接报告音频与音视频输入结果", context: "未核实", access: "API", aliases: ["Seed-2.0-Lite", "seed-2.0-lite"], sourceId: "rngbench", summary: "RNG-Bench 与 Qwen3.8 Omni 官方表中的全模态对照模型；与 Seed2.1 系列分开保存。" },
    { id: "seed2-1-pro", name: "Seed2.1 Pro", vendorId: "bytedance", vendor: "ByteDance Seed", releaseDate: "2026-06-23", modality: "vision", modalityDetail: "文本、图像、视频 → 文本", context: "128K+ 多模态长上下文评测", access: "闭源 API", aliases: ["seed2.1-pro", "Doubao Seed 2.1 Pro"], sourceId: "seed21", summary: "面向现实生产力、编码交付和视觉/视频理解的 Pro 版本。" },
    { id: "seed2-1-turbo", name: "Seed2.1 Turbo", vendorId: "bytedance", vendor: "ByteDance Seed", releaseDate: "2026-06-23", modality: "vision", modalityDetail: "文本、图像、视频 → 文本", context: "128K+ 多模态长上下文评测", access: "闭源 API", aliases: ["seed2.1-turbo", "Doubao Seed 2.1 Turbo"], sourceId: "seed21", summary: "Seed2.1 家族效率版本，保留 Agent、编码和多模态能力。" },
    { id: "kimi-k2-5", name: "Kimi-K2.5", vendorId: "moonshot", vendor: "Moonshot AI", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像 → 文本；RNGBench 官方主榜使用的精确模型名", context: "未核实", access: "具体快照未核实", aliases: ["Kimi-K2.5", "kimi-k2.5"], sourceId: "rngbench", summary: "RNG-Bench 官方主榜中的多模态对照模型；与 Kimi K3 分开保存。" },
    { id: "kimi-k3", name: "Kimi K3", vendorId: "moonshot", vendor: "Moonshot AI", releaseDate: "2026-07-17", modality: "vision", modalityDetail: "文本、图像 → 文本", context: "1M", access: "开放权重 / API", aliases: ["kimi-k3", "K3"], sourceId: "alibaba-lifecycle", summary: "2.8T KDA 混合线性注意力旗舰，原生视觉理解。" },
    { id: "hy4-preview", name: "Hy4 Preview", vendorId: "tencent", vendor: "Tencent Hy", releaseDate: "2026-08-28", modality: "language", modalityDetail: "文本 → 文本", context: "1M", access: "开放权重", aliases: ["hy4-preview", "Tencent Hy4"], sourceId: "hy4", summary: "770B/49B active 的纯语言 MoE 旗舰预览版。" }
  ];

  const benchmarks = [
    { id: "agents-last-exam-pass", name: "Agents' Last Exam · Pass Rate", category: "Agent / 工作", direction: "higher", description: "混合任务集。ALE 官方公开任务包含视频+DOCX、MP3、荧光 TIFF 等输入，并通过 Claude Code、Codex、OpenClaw 或 ALE-Claw 执行。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["Claude Code", "Codex", "OpenClaw", "ALE-Claw"], inputModalities: ["图片", "音频", "视频", "文档", "屏幕"] },
    { id: "agents-last-exam-score", name: "Agents' Last Exam · Overall Score", category: "Agent / 工作", direction: "higher", description: "ALE 总体得分；与 Pass Rate 分榜。官方公开任务证实任务输入含图片、音频、视频与文档。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["Claude Code", "Codex", "OpenClaw", "ALE-Claw"], inputModalities: ["图片", "音频", "视频", "文档", "屏幕"] },
    { id: "automationbench", name: "AutomationBench", category: "Agent / 工作", direction: "higher", description: "真实自动化工作流；版本与 Harness 差异会显著影响分数。" },
    { id: "gdpval-aa-v2", name: "GDPval-AA v2", category: "Agent / 工作", direction: "higher", description: "高经济价值知识工作，常报告 Elo。" },
    { id: "toolathlon", name: "Toolathlon Verified", category: "Agent / 工作", direction: "higher", description: "工具调用与长程 Agent 能力。" },
    { id: "terminal-bench-2-0", name: "Terminal-Bench 2.0 · Terminus-2", category: "编码", direction: "higher", description: "Qwen3.7 Plus 官方表使用 Harbor / Terminus-2 Harness；与 2.1、3.0、4.0 分榜。" },
    { id: "terminal-bench-2-1", name: "Terminal-Bench 2.1", category: "编码", direction: "higher", description: "终端环境 Agent 编码；Harness 与运行版本会显著影响成绩。" },
    { id: "terminal-bench-3-0", name: "Terminal-Bench 3.0", category: "编码", direction: "higher", description: "更高难度终端任务。" },
    { id: "terminal-bench-4-0", name: "Terminal-Bench 4.0", category: "编码", direction: "higher", description: "新一代通用终端 Agent 任务。" },
    { id: "terminal-bench-science", name: "Terminal-Bench Science 0.1", category: "科研", direction: "higher", description: "使用代码与终端完成科学研究工作流；Anthropic 官方表明确使用 Claude Code Harness。" },
    { id: "meta-internal-coding-bench", name: "Meta Internal Coding Bench", category: "编码", direction: "higher", description: "Meta 在 Muse Spark 1.2 发布页报告的内部编码基准；仅在相同发布设置下横向比较。" },
    { id: "deepswe-v1-1", name: "DeepSWE v1.1", category: "编码", direction: "higher", description: "长程软件工程；不同 Agent Scaffold 会产生不同结果。" },
    { id: "frontiercode-1-1-extended", name: "FrontierCode 1.1 Extended", category: "编码", direction: "higher", description: "真实软件工程任务的扩展版；不同推理档位和成本点分别保留。" },
    { id: "swe-bench-pro", name: "SWE-Bench Pro", category: "编码", direction: "higher", description: "真实仓库软件工程；Harness 与修订版本必须随成绩保留。" },
    { id: "nl2repo", name: "NL2Repo-Bench", category: "编码", direction: "higher", description: "从自然语言需求构建仓库级实现；Qwen 官方表明确使用 Claude Code。" },
    { id: "frontierswe", name: "FrontierSWE", category: "编码", direction: "higher", description: "前沿软件工程任务；Qwen 通过 Claude Code 报告 MEAN@5，并说明对照值来自官方榜。" },
    { id: "mls-bench-lite", name: "MLS-Bench-Lite", category: "编码", direction: "higher", description: "机器学习工程 Agent 任务；Qwen 官方表使用 Claude Code、5 小时超时。" },
    { id: "paperbench", name: "PaperBench", category: "科研", direction: "higher", description: "复现论文与科研工程交付；需注明 Agent、评判模型和运行预算。" },
    { id: "androidbench", name: "AndroidBench", category: "编码", direction: "higher", description: "Android 工程任务；Qwen 表使用 95 题公开子集并报告 avg@3。" },
    { id: "qwen-swe-bench", name: "QwenSWEBench", category: "编码", direction: "higher", description: "Qwen 内部软件工程基准；Claude Code harness，avg@3。" },
    { id: "qwen-qoder-bench", name: "QwenQoderBench", category: "编码", direction: "higher", description: "Qwen 内部 Qoder 用户体验基准；Claude Code harness，avg@5。" },
    { id: "qwen-react-bench", name: "QwenReactBench", category: "编码", direction: "higher", description: "Claude Code 驱动的双语 React 项目构建；任务输入为文本，自动渲染和多模态评判只发生在输出侧，因此不属于多模态输入专题。" },
    { id: "qwen-svg-bench", name: "QwenSVGBench", category: "编码", direction: "higher", description: "双语 SVG 代码生成基准；自动渲染与多模态评判，报告 Elo。" },
    { id: "programbench-almost", name: "ProgramBench · Almost Solved", category: "编码", direction: "higher", description: "从零完成系统级工程任务的 Almost Solved 口径。" },
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
    { id: "artificial-intelligence-index-v4-3", name: "Artificial Analysis Intelligence Index v4.3", category: "综合指数", direction: "higher", description: "Artificial Analysis v4.3 综合指数；与 v4.1.1 分榜，推理档位分别保留。" },
    { id: "artificial-coding-index", name: "Artificial Analysis Coding Agent Index", category: "编码", direction: "higher", description: "第三方编码 Agent 综合指数，注意版本号。" },
    { id: "mmmu-pro", name: "MMMU-Pro", category: "多模态", direction: "higher", description: "多模态大学级理解；有无工具需分开。" },
    { id: "charxiv", name: "CharXiv Reasoning", category: "多模态", direction: "higher", description: "复杂图表与科学图形推理。" },
    { id: "babyvision", name: "BabyVision", category: "多模态", direction: "higher", description: "视觉感知与推理；有无工具口径并存。" },
    { id: "videomme", name: "VideoMME", category: "多模态", direction: "higher", description: "长视频理解。" },
    { id: "lvbench", name: "LVBench", category: "多模态", direction: "higher", description: "长视频理解；静态与 Agentic 设置可能不同。" },
    { id: "worldvqa", name: "WorldVQA", category: "多模态", direction: "higher", description: "视觉世界知识。" },
    { id: "erqa", name: "ERQA", category: "多模态", direction: "higher", description: "空间推理。" },
    { id: "mathvision", name: "MathVision", category: "多模态", direction: "higher", description: "视觉数学推理；工具设置需注明。" },
    { id: "mathvision-without-ci", name: "MathVision · Without CI", category: "多模态", direction: "higher", description: "Qwen3.8 Omni 官方视觉表的无 Code Interpreter 口径。" },
    { id: "mathvision-with-ci", name: "MathVision · With CI", category: "多模态", direction: "higher", description: "Qwen3.8 Omni 官方视觉表的 Code Interpreter 口径。" },
    { id: "charxiv-rq-without-ci", name: "CharXiv (RQ) · Without CI", category: "多模态", direction: "higher", description: "科学图表推理；无 Code Interpreter。" },
    { id: "charxiv-rq-with-ci", name: "CharXiv (RQ) · With CI", category: "多模态", direction: "higher", description: "科学图表推理；使用 Code Interpreter。" },
    { id: "uniclawbench", name: "UniClawBench", category: "Agent / 工作", direction: "higher", description: "专门的多模态 Agent 基准；官方含 80 个中英文多模态任务，Qwen 表使用 OpenClaw。", collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["OpenClaw"], inputModalities: ["图片", "音频", "视频", "文件", "屏幕"] },
    { id: "agenticvbench", name: "AgenticVBench", category: "Agent / 工作", direction: "higher", description: "多模态工具使用基准；Qwen 官方表明确使用 Claude Code。", collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["Claude Code"], inputModalities: ["视频", "音频", "图片"] },
    { id: "omnigaia", name: "OmniGAIA", category: "Agent / 工作", direction: "higher", description: "音视频 Web Search Agent 评测；Qwen 官方明确注明不使用 Harness，因此不进入多模态输入 × Harness 专题。" },
    { id: "dailyomni", name: "DailyOmni", category: "多模态", direction: "higher", description: "日常场景音视频理解。" },
    { id: "worldsense", name: "WorldSense", category: "多模态", direction: "higher", description: "音视频世界理解。" },
    { id: "avut", name: "AVUT", category: "多模态", direction: "higher", description: "音视频理解。" },
    { id: "joinavbench", name: "JoinAVBench", category: "多模态", direction: "higher", description: "联合音视频理解；结果表写作 JoinAVBench，同页总览图与脚注写作 JointAVBench，75.9 等数值一致，因此合并为同一 Benchmark。" },
    { id: "omnivideobench", name: "OmniVideoBench", category: "多模态", direction: "higher", description: "音视频推理；Static 与 Qwen Code Agent 设置分别保留。" },
    { id: "video-mme-v2", name: "Video-MME-v2", category: "多模态", direction: "higher", description: "音视频推理；Static 与 Qwen Code Agent 设置分别保留。" },
    { id: "lvomnibench", name: "LVOmniBench", category: "多模态", direction: "higher", description: "长视频推理；Static 与 Qwen Code Agent 设置分别保留。" },
    { id: "omnicloze", name: "OmniCloze", category: "多模态", direction: "higher", description: "音视频描述与完形能力。" },
    { id: "omnicap-if-csr", name: "OmniCap-IF · CSR", category: "多模态", direction: "higher", description: "音视频指令描述的 CSR 口径。" },
    { id: "omnicap-if-isr", name: "OmniCap-IF · ISR", category: "多模态", direction: "higher", description: "音视频指令描述的 ISR 口径。" },
    { id: "qivd", name: "QIVD", category: "多模态", direction: "higher", description: "音视频交互。" },
    { id: "streamingbench", name: "StreamingBench", category: "多模态", direction: "higher", description: "流式音视频交互。" },
    { id: "alimeeting-der", name: "AliMeeting Test · DER", category: "音频", direction: "lower", description: "多说话人 ASR 的 diarization error rate；越低越好。" },
    { id: "alimeeting-cpwer", name: "AliMeeting Test · cpWER", category: "音频", direction: "lower", description: "多说话人 ASR 的 cpWER；越低越好。" },
    { id: "aishell4-der", name: "AISHELL-4 · DER", category: "音频", direction: "lower", description: "多说话人 ASR 的 DER；越低越好。" },
    { id: "aishell4-cpwer", name: "AISHELL-4 · cpWER", category: "音频", direction: "lower", description: "多说话人 ASR 的 cpWER；越低越好。" },
    { id: "magicdata-ramc-der", name: "MagicData-RAMC · DER", category: "音频", direction: "lower", description: "多说话人 ASR 的 DER；越低越好。" },
    { id: "magicdata-ramc-cpwer", name: "MagicData-RAMC · cpWER", category: "音频", direction: "lower", description: "多说话人 ASR 的 cpWER；越低越好。" },
    { id: "mlc-slm-en-der", name: "MLC-SLM (en) · DER", category: "音频", direction: "lower", description: "英文多说话人 ASR 的 DER；越低越好。" },
    { id: "mlc-slm-en-cpwer", name: "MLC-SLM (en) · cpWER", category: "音频", direction: "lower", description: "英文多说话人 ASR 的 cpWER；越低越好。" },
    { id: "wenetspeech-net-wer", name: "WenetSpeech · Net WER", category: "音频", direction: "lower", description: "网络语音识别 WER；越低越好。" },
    { id: "wenetspeech-meeting-wer", name: "WenetSpeech · Meeting WER", category: "音频", direction: "lower", description: "会议语音识别 WER；越低越好。" },
    { id: "fleurs-asr-wer", name: "FLEURS-60 · ASR WER", category: "音频", direction: "lower", description: "60 语种 ASR WER；越低越好。" },
    { id: "fleurs-s2tt-bleu", name: "FLEURS-60 · S2TT BLEU", category: "音频", direction: "higher", description: "60 语种语音到文本翻译 BLEU。" },
    { id: "spotsoundbench", name: "SpotSoundBench", category: "音频", direction: "higher", description: "音频定位。" },
    { id: "mmau", name: "MMAU", category: "音频", direction: "higher", description: "音频理解。" },
    { id: "mmar", name: "MMAR", category: "音频", direction: "higher", description: "音频理解。" },
    { id: "mmsu", name: "MMSU", category: "音频", direction: "higher", description: "音频理解。" },
    { id: "longaudiospan-accuracy", name: "LongAudioSpan · Accuracy", category: "音频", direction: "higher", description: "长音频推理准确率。" },
    { id: "longaudiospan-rubric", name: "LongAudioSpan · Rubric", category: "音频", direction: "higher", description: "长音频推理 rubric 得分。" },
    { id: "longaudiospan-chain", name: "LongAudioSpan · Chain", category: "音频", direction: "higher", description: "长音频推理 chain 得分。" },
    { id: "muchomusic-rul", name: "MuchoMusic-RUL", category: "音频", direction: "higher", description: "音乐理解。" },
    { id: "hummusqa", name: "HumMusQA", category: "音频", direction: "higher", description: "音乐理解问答。" },
    { id: "mustbench", name: "MusTBench", category: "音频", direction: "higher", description: "音乐理解。" },
    { id: "audio-multichallenge", name: "Audio MultiChallenge", category: "音频", direction: "higher", description: "音频交互。" },
    { id: "wildspeech", name: "WildSpeech", category: "音频", direction: "higher", description: "开放场景语音交互。" },
    { id: "voicebench", name: "VoiceBench", category: "音频", direction: "higher", description: "语音交互。" },
    { id: "livecodebench-v6", name: "LiveCodeBench v6", category: "编码", direction: "higher", description: "竞争性编程。" },
    { id: "claweval-mm-pass3", name: "ClawEval-MM · Pass@3", category: "Agent / 工作", direction: "higher", description: "ClawEval 独立 multimodal split；101 个任务含网页生成、视频问答和文档抽取，官方将 Claw-Eval 定义为 evaluation harness。", collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["Claw-Eval"], inputModalities: ["图片", "视频", "文档", "网页"] },
    { id: "claweval-mm-average", name: "ClawEval-MM · Average", category: "Agent / 工作", direction: "higher", description: "ClawEval multimodal split 三次运行的平均分；与 Pass@3 分榜。", collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["Claw-Eval"], inputModalities: ["图片", "视频", "文档", "网页"] },
    { id: "androidworld", name: "AndroidWorld", category: "计算机操作", direction: "higher", description: "移动设备操作。" },
    { id: "vision2web", name: "Vision2Web", category: "计算机操作", direction: "higher", description: "视觉网页开发；Qwen 表使用 Claude Code，并由 gpt-5.4-2026-03-05 评判。" },
    { id: "realworldqa", name: "RealWorldQA", category: "多模态", direction: "higher", description: "真实世界视觉感知。" },
    { id: "rngbench-matching-pf", name: "RNG-Bench · Matching Pairs Parse Failure", category: "多模态", direction: "lower", description: "10×10 图像棋盘、noise theme 的解析失败率；数值越低越好。" },
    { id: "rngbench-matching-ia", name: "RNG-Bench · Matching Pairs Invalid Action", category: "多模态", direction: "lower", description: "10×10 图像棋盘、noise theme 的无效动作率；数值越低越好。" },
    { id: "rngbench-matching-responses", name: "RNG-Bench · Matching Pairs Responses per Score", category: "多模态", direction: "lower", description: "10×10 图像棋盘、noise theme 中每成功匹配一对卡牌所需的响应数；数值越低越好。" },
    { id: "rngbench-matching-pairs", name: "RNG-Bench · Matching Pairs Score", category: "多模态", direction: "higher", description: "重构式非马尔可夫记忆任务；10×10 图像棋盘、noise theme，Score 为成功匹配的卡牌对比例。" },
    { id: "rngbench-maze-sr", name: "RNG-Bench · 3D Maze Success Rate", category: "多模态", direction: "higher", description: "13×13、无 minimap 的 3D Maze 成功率。" },
    { id: "rngbench-maze-explore", name: "RNG-Bench · 3D Maze Explore Rate", category: "多模态", direction: "higher", description: "13×13、无 minimap 的 3D Maze 探索率。" },
    { id: "rngbench-maze-walls", name: "RNG-Bench · 3D Maze Wall Collisions", category: "多模态", direction: "lower", description: "13×13、无 minimap 的 3D Maze 撞墙次数；数值越低越好。" },
    { id: "rngbench-maze-efficiency", name: "RNG-Bench · 3D Maze Efficiency", category: "多模态", direction: "higher", description: "13×13、无 minimap 的成功 episode 路径效率。" },
    { id: "rngbench-maze", name: "RNG-Bench · 3D Maze Game Score", category: "多模态", direction: "higher", description: "重构式空间记忆任务；13×13、无 minimap，GS 综合成功率、效率与探索率。" },
    { id: "rngbench-duel-win", name: "RNG-Bench · Duel Win Rate", category: "多模态", direction: "higher", description: "Matching Pairs 双模型对战胜率；每个模型与其余四个模型进行 16 局。" },
    { id: "rngbench-duel-score", name: "RNG-Bench · Duel Score", category: "多模态", direction: "higher", description: "Matching Pairs 双模型对战中的平均匹配得分比例。" },
    { id: "rngbench-duel-elo", name: "RNG-Bench · Duel Elo", category: "多模态", direction: "higher", description: "Matching Pairs 双模型对战 Elo；与胜率和得分分榜展示。" },
    { id: "exploitbench", name: "ExploitBench", category: "网络安全", direction: "higher", description: "真实漏洞利用；安全策略、时间预算和 Harness 影响很大。" },
    { id: "exploitbench-2026-jun-aug", name: "ExploitBench · June–August 2026", category: "网络安全", direction: "higher", description: "OpenAI 使用 2026 年 6–8 月新漏洞构建的独立评测；不与历史 ExploitBench 混排。" },
    { id: "exploitgym-rate", name: "ExploitGym · Success Rate", category: "网络安全", direction: "higher", description: "漏洞利用成功率；不与完成任务数混排。" },
    { id: "exploitgym-tasks", name: "ExploitGym · Solved Tasks", category: "网络安全", direction: "higher", description: "在给定时间预算内完成的任务数；分母保留在设置中。" },
    { id: "cybergym", name: "CyberGym", category: "网络安全", direction: "higher", description: "白盒漏洞发现与验证；Z.ai 官方表使用 Claude Code 且关闭 Web 工具。" },
    { id: "sec-bench-pro", name: "SEC-Bench Pro", category: "网络安全", direction: "higher", description: "复杂软件 PoC 生成；DeepSeek 官方记录使用 Claude Code Harness。" },
    { id: "sre-bench-1", name: "SRE-Bench · 1 Attempt", category: "网络安全", direction: "higher", description: "二进制逆向任务的单次尝试成功率；与四次尝试分榜。" },
    { id: "sre-bench-4", name: "SRE-Bench · 4 Attempts", category: "网络安全", direction: "higher", description: "二进制逆向任务四次尝试内的累计成功率；与单次尝试分榜。" },
    { id: "mrcr-256k", name: "MRCR v2 · 256K", category: "长上下文", direction: "higher", description: "8-needle、256K 长上下文检索。" },
    { id: "longbench-v2", name: "LongBench v2", category: "长上下文", direction: "higher", description: "真实长上下文理解与推理任务。" },
    { id: "mmlongbench", name: "MMLongBench-128K", category: "长上下文", direction: "higher", description: "128K 多模态长上下文。" },
    { id: "coworkbench", name: "CoWorkBench", category: "专业工作", direction: "higher", description: "覆盖计算机、金融、法律、医疗等领域的长程协作任务；Qwen3.7 官方提供跨 Harness 对照，但未证明输入侧包含非文本模态。" },
    { id: "workspace-bench", name: "Workspace-Bench 1.0", category: "专业工作", direction: "higher", description: "混合任务集。官方数据说明明确将 PNG、JPG、WebP 等图片作为 workspace data 输入；厂商表未逐行披露具体 Harness。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["Codex", "OpenClaw", "DeepAgent", "Claude Code", "DeepSeek Harness"], inputModalities: ["图片"] },
    { id: "jobbench", name: "JobBench", category: "专业工作", direction: "higher", description: "真实职业任务与交付质量评测。" },
    { id: "wide-search", name: "WideSearch", category: "Agent / 工作", direction: "higher", description: "宽域检索 Agent；Qwen 表报告 Claude Code / Qwen-Agent 四次运行的平均 item-F1。" },
    { id: "agent-startup-bench", name: "Agent Startup Bench", category: "专业工作", direction: "higher", description: "AI 原生创业公司真实工作流。" },
    { id: "officeqa-pro", name: "OfficeQA Pro", category: "专业工作", direction: "higher", description: "复杂办公文档问答与检索。" },
    { id: "supergpqa", name: "SuperGPQA", category: "知识 / 推理", direction: "higher", description: "广覆盖专业知识问答。" },
    { id: "beyondaime", name: "BeyondAIME", category: "知识 / 推理", direction: "higher", description: "高难数学推理。" },
    { id: "swe-multilingual", name: "SWE-bench Multilingual", category: "编码", direction: "higher", description: "多语言仓库问题修复。" },
    { id: "apex-agents", name: "Apex Agents", category: "Agent / 工作", direction: "higher", description: "Agent 综合任务。" },
    { id: "skillsbench-1-1", name: "SkillsBench 1.1", category: "Agent / 工作", direction: "higher", description: "混合任务集。官方任务元数据明确标注图片、视频和 3D 输入任务；with Skills、without Skills 与 Agent Harness 必须分开看。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["OpenHands", "Claude Code", "Codex", "OpenCode", "Gemini CLI"], inputModalities: ["图片", "视频", "3D 模型"] },
    { id: "ifbench", name: "IFBench", category: "知识 / 推理", direction: "higher", description: "指令遵循能力评测。" },
    { id: "one-million-bench", name: "$OneMillion-Bench · Expert Score", category: "专业工作", direction: "higher", description: "高价值专家任务；Qwen 表使用 Gemini 3.1 Pro Preview 评判。" },
    { id: "healthbench", name: "HealthBench", category: "专业工作", direction: "higher", description: "医疗健康对话与专业能力评测。" },
    { id: "healthbench-professional", name: "HealthBench Professional", category: "专业工作", direction: "higher", description: "专业医疗任务评测；与普通 HealthBench 分榜，代码与非代码模式保留在设置中。" },
    { id: "lifescibench", name: "LifeSciBench", category: "科研", direction: "higher", description: "生命科学推理与研究任务；推理档位会影响结果。" },
    { id: "genebench-pro", name: "GeneBench Pro", category: "科研", direction: "higher", description: "专业基因组学任务准确率。" },
    { id: "medchembench", name: "MedChemBench", category: "科研", direction: "higher", description: "药物化学任务的加权得分。" },
    { id: "plawbench", name: "PLawBench", category: "专业工作", direction: "higher", description: "法律专业任务；Qwen 表使用 Gemini 3.1 Pro Preview 评判。" },
    { id: "prbench-legal", name: "PRBench-Legal", category: "专业工作", direction: "higher", description: "法律专业研究与交付任务。" },
    { id: "prbench-finance", name: "PRBench-Finance", category: "专业工作", direction: "higher", description: "金融专业研究与交付任务。" },
    { id: "qwenclawbench", name: "QwenClawBench · Qwen3.7 Snapshot", category: "Agent / 工作", direction: "higher", description: "Qwen 官方发布时的 Claw Agent 快照未写明多模态输入；后续开源 v1.1 的任务元数据标注为 text-only，因此不推断该快照属于多模态输入测试。" },
    { id: "claweval", name: "ClawEval · General/Unspecified", category: "Agent / 工作", direction: "higher", description: "Qwen3.7 Plus 的旧分数未注明 general 或 multimodal split，暂不与 ClawEval-MM 混排。" },
    { id: "wildclawbench-overall", name: "WildClawBench · Overall", category: "Agent / 工作", direction: "higher", description: "混合任务集。完整 60 题包含要求处理视频、音频与图像素材的输入任务；与纯文本和 MM 子榜并列发布。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["OpenClaw"], inputModalities: ["图片", "音频", "视频"] },
    { id: "wildclawbench-time", name: "WildClawBench · Elapsed Time", category: "Agent / 工作", direction: "lower", description: "OpenClaw 完整 60 题的总用时，单位为分钟；数值越低越好。" },
    { id: "wildclawbench-cost", name: "WildClawBench · Total Cost", category: "Agent / 工作", direction: "lower", description: "OpenClaw 完整 60 题的总成本，单位为美元；数值越低越好。" },
    { id: "wildclawbench-mm", name: "WildClawBench-MM", category: "Agent / 工作", direction: "higher", description: "专门多模态输入子榜；官方榜使用 OpenClaw，Qwen3.8 Omni 发布表明确使用 Claude Code。", collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["OpenClaw", "Claude Code"], inputModalities: ["图片", "音频", "视频"] },
    { id: "pinchbench-v2-best", name: "PinchBench v2 · Best Success Rate", category: "Agent / 工作", direction: "higher", description: "混合任务集。官方任务清单含直接读取三个 JPG 文件并分类的输入任务，也含视频处理任务；与平均成功率分榜。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["OpenClaw"], inputModalities: ["图片", "视频任务"] },
    { id: "pinchbench-v2-average", name: "PinchBench v2 · Average Success Rate", category: "Agent / 工作", direction: "higher", description: "混合任务集。官方任务清单含图片识别和视频处理输入；页面徽标显示 147 tasks、620 runs，v2.0.0 release notes 写 148 tasks，两个官方口径均保留。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["OpenClaw"], inputModalities: ["图片", "视频任务"] }
  ];

  // One benchmark can publish several versions, subsets, or metrics. They stay
  // separate above for ranking and export, but share one user-facing family.
  const benchmarkFamilies = [
    { id: "agents-last-exam", name: "Agents' Last Exam", variants: [
      { benchmarkId: "agents-last-exam-pass", label: "Pass Rate" },
      { benchmarkId: "agents-last-exam-score", label: "Overall Score" }
    ] },
    { id: "terminal-bench", name: "Terminal-Bench", variants: [
      { benchmarkId: "terminal-bench-2-0", label: "2.0 · Terminus-2" },
      { benchmarkId: "terminal-bench-2-1", label: "2.1" },
      { benchmarkId: "terminal-bench-3-0", label: "3.0" },
      { benchmarkId: "terminal-bench-4-0", label: "4.0" },
      { benchmarkId: "terminal-bench-science", label: "Science 0.1" }
    ] },
    { id: "programbench", name: "ProgramBench", variants: [
      { benchmarkId: "programbench-almost", label: "Almost Solved" },
    ] },
    { id: "hle", name: "Humanity's Last Exam", variants: [
      { benchmarkId: "hle", label: "No Tools" },
      { benchmarkId: "hle-tools", label: "With Tools" }
    ] },
    { id: "osworld-2", name: "OSWorld 2.0", variants: [
      { benchmarkId: "osworld-2-partial", label: "Partial" },
      { benchmarkId: "osworld-2-strict", label: "Strict" },
      { benchmarkId: "osworld-2-binary", label: "Binary" }
    ] },
    { id: "artificial-analysis-intelligence-index", name: "Artificial Analysis Intelligence Index", variants: [
      { benchmarkId: "artificial-intelligence-index", label: "v4.1" },
      { benchmarkId: "artificial-intelligence-index-v4-3", label: "v4.3" }
    ] },
    { id: "rng-bench", name: "RNG-Bench", variants: [
      { benchmarkId: "rngbench-matching-pairs", label: "Matching Pairs · Score" },
      { benchmarkId: "rngbench-matching-pf", label: "Matching Pairs · Parse Failure" },
      { benchmarkId: "rngbench-matching-ia", label: "Matching Pairs · Invalid Action" },
      { benchmarkId: "rngbench-matching-responses", label: "Matching Pairs · Responses / Score" },
      { benchmarkId: "rngbench-maze", label: "3D Maze · Game Score" },
      { benchmarkId: "rngbench-maze-sr", label: "3D Maze · Success Rate" },
      { benchmarkId: "rngbench-maze-explore", label: "3D Maze · Explore Rate" },
      { benchmarkId: "rngbench-maze-walls", label: "3D Maze · Wall Collisions" },
      { benchmarkId: "rngbench-maze-efficiency", label: "3D Maze · Efficiency" },
      { benchmarkId: "rngbench-duel-win", label: "Duel · Win Rate" },
      { benchmarkId: "rngbench-duel-score", label: "Duel · Score" },
      { benchmarkId: "rngbench-duel-elo", label: "Duel · Elo" }
    ] },
    { id: "exploitbench", name: "ExploitBench", variants: [
      { benchmarkId: "exploitbench", label: "Main Set" },
      { benchmarkId: "exploitbench-2026-jun-aug", label: "June–August 2026" }
    ] },
    { id: "exploitgym", name: "ExploitGym", variants: [
      { benchmarkId: "exploitgym-rate", label: "Success Rate" },
      { benchmarkId: "exploitgym-tasks", label: "Solved Tasks" }
    ] },
    { id: "sre-bench", name: "SRE-Bench", variants: [
      { benchmarkId: "sre-bench-1", label: "1 Attempt" },
      { benchmarkId: "sre-bench-4", label: "4 Attempts" }
    ] },
    { id: "mrcr-v2", name: "MRCR v2", variants: [
      { benchmarkId: "mrcr-256k", label: "256K" },
    ] },
    { id: "healthbench", name: "HealthBench", variants: [
      { benchmarkId: "healthbench", label: "Standard" },
      { benchmarkId: "healthbench-professional", label: "Professional" }
    ] },
    { id: "prbench", name: "PRBench", variants: [
      { benchmarkId: "prbench-legal", label: "Legal" },
      { benchmarkId: "prbench-finance", label: "Finance" }
    ] },
    { id: "claweval-family", name: "ClawEval", variants: [
      { benchmarkId: "claweval", label: "General / Unspecified" },
      { benchmarkId: "claweval-mm-pass3", label: "MM · Pass@3" },
      { benchmarkId: "claweval-mm-average", label: "MM · Average" }
    ] },
    { id: "omnicap-if", name: "OmniCap-IF", variants: [
      { benchmarkId: "omnicap-if-csr", label: "CSR" },
      { benchmarkId: "omnicap-if-isr", label: "ISR" }
    ] },
    { id: "alimeeting", name: "AliMeeting Test", variants: [
      { benchmarkId: "alimeeting-der", label: "DER" },
      { benchmarkId: "alimeeting-cpwer", label: "cpWER" }
    ] },
    { id: "aishell4", name: "AISHELL-4", variants: [
      { benchmarkId: "aishell4-der", label: "DER" },
      { benchmarkId: "aishell4-cpwer", label: "cpWER" }
    ] },
    { id: "magicdata-ramc", name: "MagicData-RAMC", variants: [
      { benchmarkId: "magicdata-ramc-der", label: "DER" },
      { benchmarkId: "magicdata-ramc-cpwer", label: "cpWER" }
    ] },
    { id: "mlc-slm-en", name: "MLC-SLM (en)", variants: [
      { benchmarkId: "mlc-slm-en-der", label: "DER" },
      { benchmarkId: "mlc-slm-en-cpwer", label: "cpWER" }
    ] },
    { id: "wenetspeech", name: "WenetSpeech", variants: [
      { benchmarkId: "wenetspeech-net-wer", label: "Net · WER" },
      { benchmarkId: "wenetspeech-meeting-wer", label: "Meeting · WER" }
    ] },
    { id: "fleurs", name: "FLEURS-60", variants: [
      { benchmarkId: "fleurs-asr-wer", label: "ASR · WER" },
      { benchmarkId: "fleurs-s2tt-bleu", label: "S2TT · BLEU" }
    ] },
    { id: "longaudiospan", name: "LongAudioSpan", variants: [
      { benchmarkId: "longaudiospan-accuracy", label: "Accuracy" },
      { benchmarkId: "longaudiospan-rubric", label: "Rubric" },
      { benchmarkId: "longaudiospan-chain", label: "Chain" }
    ] },
    { id: "mathvision-family", name: "MathVision", variants: [
      { benchmarkId: "mathvision", label: "Earlier / Composite" },
      { benchmarkId: "mathvision-without-ci", label: "Without CI" },
      { benchmarkId: "mathvision-with-ci", label: "With CI" }
    ] },
    { id: "charxiv-family", name: "CharXiv", variants: [
      { benchmarkId: "charxiv", label: "Earlier / Reasoning" },
      { benchmarkId: "charxiv-rq-without-ci", label: "RQ · Without CI" },
      { benchmarkId: "charxiv-rq-with-ci", label: "RQ · With CI" }
    ] },
    { id: "wildclawbench", name: "WildClawBench", variants: [
      { benchmarkId: "wildclawbench-overall", label: "Overall" },
      { benchmarkId: "wildclawbench-mm", label: "MM" },
      { benchmarkId: "wildclawbench-time", label: "Elapsed Time" },
      { benchmarkId: "wildclawbench-cost", label: "Total Cost" }
    ] },
    { id: "pinchbench-v2", name: "PinchBench v2", variants: [
      { benchmarkId: "pinchbench-v2-best", label: "Best Success Rate" },
      { benchmarkId: "pinchbench-v2-average", label: "Average Success Rate" }
    ] }
  ];

  const observations = [];
  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    observations.push({ id: `o${observations.length + 1}`, sourceIds, benchmarkId, modelId, value, unit, setting, note });
  };
  const batch = (sourceIds, benchmarkId, rows, unit = "%", setting = "") => {
    rows.forEach(([modelId, value, rowSetting = setting, note = ""]) => add(sourceIds, benchmarkId, modelId, value, unit, rowSetting, note));
  };
  const qwenComparisonModels = ["claude-opus-4-8", "claude-fable-5", "gpt-5-6-sol", "qwen3-7-max", "qwen3-8-max"];
  const qwenCompare = (benchmarkId, values, unit = "%", setting = "Qwen3.8 官方模型卡对照表", note = "", sourceIds = ["qwen38-hf"]) => {
    values.forEach((value, index) => {
      if (value !== null) add(sourceIds, benchmarkId, qwenComparisonModels[index], value, unit, setting, note);
    });
  };

  // Meta Muse Spark 1.2 official model page and launch blog: all four
  // published benchmark charts, including every displayed comparison bar.
  batch(["meta-muse-spark12"], "terminal-bench-2-1", [
    ["claude-opus-5", 86.7, "Claude Code · max"],
    ["muse-spark-1-2", 82.9, "Muse Code"],
    ["gpt-5-6-terra", 81.8, "Codex · max"],
    ["grok-4-5", 81.6, "Grok Build"],
    ["gemini-3-6-flash", 78.9, "Antigravity CLI · high"],
    ["muse-spark-1-1", 76.2, "mini-swe-agent"]
  ], "%", "Meta 官方发布图");
  batch(["meta-muse-spark12"], "deepswe-v1-1", [
    ["claude-opus-5", 65.0, "Claude Code · max"],
    ["gpt-5-6-terra", 64.8, "Codex · max"],
    ["muse-spark-1-2", 59.3, "Muse Code"],
    ["grok-4-5", 56.6, "Grok Build"],
    ["muse-spark-1-1", 53.0, "mini-swe-agent"],
    ["gemini-3-6-flash", 40.0, "Antigravity CLI · high"]
  ], "%", "Meta 官方发布图");
  batch(["meta-muse-spark12"], "meta-internal-coding-bench", [
    ["claude-opus-5", 79.4, "max"],
    ["muse-spark-1-2", 70.6],
    ["muse-spark-1-1", 68.3],
    ["gpt-5-6-terra", 65.4, "max"],
    ["gemini-3-6-flash", 63.9, "high"]
  ], "%", "Meta 官方发布图");
  batch(["meta-muse-spark12"], "gdpval-aa-v2", [
    ["claude-opus-5", 1852, "max"],
    ["muse-spark-1-2", 1631],
    ["gpt-5-6-terra", 1577, "max"],
    ["grok-4-5", 1526, "high"],
    ["gemini-3-6-flash", 1423, "high"],
    ["muse-spark-1-1", 1371]
  ], "Elo", "Meta 官方发布图");

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

  batch(["openai-gpt56","zai-glm53","deepseek-v41"], "terminal-bench-2-1", [["gpt-5-6-sol",88.8,"厂商公开表共同值"]]);
  batch(["deepmind-gemini38"], "terminal-bench-2-1", [["gemini-3-8-flash",89.4],["claude-opus-5",89.1],["gpt-5-6-sol",88.8]], "%", "Google Model Card");
  batch(["zai-glm53"], "terminal-bench-2-1", [["glm-5-3",88.2],["kimi-k3",88.3],["deepseek-v4-pro",87.9],["qwen3-8-max",86.6],["claude-opus-4-8",85.0,"Z.ai复现"]]);
  batch(["zai-glm53-flash"], "terminal-bench-2-1", [["glm-5-3-flash",84.3],["deepseek-v4-vision-exp",83.9]]);
  batch(["deepseek-v41"], "terminal-bench-2-1", [["deepseek-v4-1-flash",90.6]], "%", "DSH Minimal / max effort");
  add(["qwen38"], "terminal-bench-2-1", "qwen3-8-max", 86.6, "%", "Claude Code harness");
  add(["seed21"], "terminal-bench-2-1", "seed2-1-pro", 71.0, "%", "Seed model card");
  add(["seed21"], "terminal-bench-2-1", "seed2-1-turbo", 67.6, "%", "Seed model card");
  add(["hy4"], "terminal-bench-2-1", "hy4-preview", 85.4, "%", "HF Eval Result");

  add(["qwen37-plus"], "terminal-bench-2-0", "qwen3-7-plus", 70.3, "%", "Qwen3.7 Plus 官方表 · Harbor / Terminus-2 · 5h · 5次平均");

  batch(["zai-glm53"], "terminal-bench-3-0", [["glm-5-3",28.3],["kimi-k3",17.4],["claude-opus-4-8",21.1],["gpt-5-6-sol",34.6]]);
  batch(["deepseek-v41"], "terminal-bench-3-0", [["deepseek-v4-1-flash",30.0],["glm-5-3",28.3],["kimi-k3",17.7],["claude-opus-5",43.3],["gpt-5-6-sol",34.4]], "%", "DeepSeek Harness / max effort");

  batch(["openai-astra", "openai-astra-work"], "terminal-bench-4-0", [["gpt-6-astra",57.9],["gpt-5-6-sol",37.3],["claude-fable-5-1",55.8]], "%", "OpenAI公开设置");
  add(["openai-astra"], "terminal-bench-4-0", "claude-opus-5", 52.6, "%", "OpenAI公开设置");
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

  batch(["openai-astra"], "frontiercode-1-1-extended", [
    ["gpt-6-astra", 64], ["gpt-5-6-sol", 61], ["claude-fable-5-1", 62],
    ["claude-fable-5", 64], ["claude-opus-5", 59]
  ], "%", "OpenAI图表 · 最高推理档位");

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

  batch(["openai-astra"], "gpqa-diamond", [["gpt-6-astra",96.0],["gpt-5-6-sol",94.6],["claude-fable-5-1",93.7],["claude-opus-5",93.7],["gemini-3-8-flash",95.3]], "%", "最高 effort");
  batch(["deepseek-v41"], "gpqa-diamond", [["deepseek-v4-1-flash",90.9],["glm-5-3",88.1],["kimi-k3",92.9],["deepseek-v4-pro",92.4],["claude-opus-5",93.4],["gpt-5-6-sol",94.1]], "%", "Pass@1 / max effort");
  add(["qwen38"], "gpqa-diamond", "qwen3-8-max", 92.6, "%", "Qwen官方表");
  add(["hy4"], "gpqa-diamond", "hy4-preview", 92.3, "%", "HF Eval Result");

  batch(["openai-astra"], "healthbench-professional", [
    ["gpt-6-astra", 63, "OpenAI图表 · 最高推理档位 · Code"],
    ["gpt-5-6-sol", 61, "OpenAI图表 · 最高推理档位 · Non-code"],
    ["claude-fable-5-1", 57, "OpenAI图表 · 最高推理档位 · Non-code"],
    ["claude-fable-5", 61, "OpenAI图表 · 最高推理档位 · Non-code"],
    ["claude-opus-5", 55, "OpenAI图表 · 最高推理档位 · Non-code"],
    ["gemini-3-8-flash", 52, "OpenAI图表 · 单一公开档位 · Non-code"]
  ]);
  batch(["openai-astra"], "lifescibench", [["gpt-6-astra",60.3],["gpt-5-6-sol",59.9]], "%", "OpenAI图表 · 最高推理档位");
  batch(["openai-astra"], "genebench-pro", [["gpt-6-astra",36.7],["gpt-5-6-sol",32.3]], "%", "OpenAI图表 · 最高推理档位 · Accuracy");
  batch(["openai-astra"], "medchembench", [["gpt-6-astra",49.1],["gpt-5-6-sol",47.4]], "%", "OpenAI图表 · 最高推理档位 · Weighted score");

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
  batch(["openai-astra-work"], "artificial-intelligence-index-v4-3", [
    ["gpt-6-astra", 46, "v4.3 · low effort"],
    ["gpt-6-astra", 50, "v4.3 · medium effort"],
    ["gpt-6-astra", 51, "v4.3 · high effort"],
    ["gpt-6-astra", 53, "v4.3 · x-high effort"],
    ["gpt-6-astra", 53, "v4.3 · max effort"],
    ["gpt-5-6-sol", 47, "v4.3 · max effort"],
    ["claude-fable-5-1", 53, "v4.3 · x-high effort"],
    ["claude-fable-5-1", 53, "v4.3 · max effort"],
    ["claude-fable-5", 50, "v4.3 · max effort"],
    ["claude-opus-5", 51, "v4.3 · max effort"],
    ["gemini-3-8-flash", 41, "v4.3 · max effort"]
  ], "Index");
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

  batch(["rngbench"], "rngbench-matching-pairs", [
    ["seed2-1-pro", 64.6], ["gpt-5-4", 62.3], ["gemini-3-1-pro", 50.0],
    ["seed2-0-lite", 43.2], ["kimi-k2-5", 38.0], ["qwen3-5-397b", 25.3]
  ], "%", "single-player · 10×10 · image · noise theme");
  batch(["rngbench"], "rngbench-matching-pf", [
    ["seed2-1-pro", 6.3], ["gpt-5-4", 0.0], ["gemini-3-1-pro", 0.4],
    ["seed2-0-lite", 1.2], ["kimi-k2-5", 1.8], ["qwen3-5-397b", 0.0]
  ], "%", "single-player · 10×10 · image · noise theme");
  batch(["rngbench"], "rngbench-matching-ia", [
    ["seed2-1-pro", 4.1], ["gpt-5-4", 4.3], ["gemini-3-1-pro", 2.5],
    ["seed2-0-lite", 4.3], ["kimi-k2-5", 2.8], ["qwen3-5-397b", 3.0]
  ], "%", "single-player · 10×10 · image · noise theme");
  batch(["rngbench"], "rngbench-matching-responses", [
    ["seed2-1-pro", 7.9], ["gpt-5-4", 8.0], ["gemini-3-1-pro", 10.0],
    ["seed2-0-lite", 11.6], ["kimi-k2-5", 13.2], ["qwen3-5-397b", 19.7]
  ], "resp/score", "single-player · 10×10 · image · noise theme");
  batch(["rngbench"], "rngbench-maze", [
    ["gemini-3-1-pro", 49.7], ["seed2-1-pro", 32.0], ["gpt-5-4", 30.5],
    ["seed2-0-lite", 21.7], ["kimi-k2-5", 16.1], ["qwen3-5-397b", 10.5]
  ], "%", "single-player · 13×13 · no minimap · mean optimal path 60 steps");
  batch(["rngbench"], "rngbench-maze-sr", [
    ["gemini-3-1-pro", 50.0], ["seed2-1-pro", 30.0], ["gpt-5-4", 20.0],
    ["seed2-0-lite", 20.0], ["kimi-k2-5", 10.0], ["qwen3-5-397b", 0.0]
  ], "%", "single-player · 13×13 · no minimap · mean optimal path 60 steps");
  batch(["rngbench"], "rngbench-maze-explore", [
    ["gemini-3-1-pro", 36.4], ["seed2-1-pro", 35.4], ["gpt-5-4", 32.3],
    ["qwen3-5-397b", 21.0], ["seed2-0-lite", 19.4], ["kimi-k2-5", 17.9]
  ], "%", "single-player · 13×13 · no minimap · mean optimal path 60 steps");
  batch(["rngbench"], "rngbench-maze-walls", [
    ["gemini-3-1-pro", 0.1], ["gpt-5-4", 3.2], ["kimi-k2-5", 7.1],
    ["qwen3-5-397b", 9.9], ["seed2-1-pro", 12.9], ["seed2-0-lite", 16.6]
  ], "walls", "single-player · 13×13 · no minimap · mean optimal path 60 steps");
  batch(["rngbench"], "rngbench-maze-efficiency", [
    ["gpt-5-4", 75.7], ["gemini-3-1-pro", 62.5], ["kimi-k2-5", 61.1],
    ["seed2-0-lite", 38.9], ["seed2-1-pro", 29.1], ["qwen3-5-397b", 0.0]
  ], "%", "successful episodes only · 13×13 · no minimap · mean optimal path 60 steps");
  batch(["rngbench"], "rngbench-duel-win", [
    ["gemini-3-1-pro", 100.0], ["gpt-5-4", 50.0], ["qwen3-5-397b", 46.7],
    ["kimi-k2-5", 37.5], ["seed2-0-lite", 15.6]
  ], "%", "Matching Pairs · image · poker theme · 16 games per model");
  batch(["rngbench"], "rngbench-duel-score", [
    ["gemini-3-1-pro", 36.5], ["gpt-5-4", 25.3], ["qwen3-5-397b", 18.0],
    ["kimi-k2-5", 18.0], ["seed2-0-lite", 12.3]
  ], "%", "Matching Pairs · image · poker theme · 16 games per model");
  batch(["rngbench"], "rngbench-duel-elo", [
    ["gemini-3-1-pro", 1803], ["gpt-5-4", 1492], ["qwen3-5-397b", 1476],
    ["kimi-k2-5", 1423], ["seed2-0-lite", 1306]
  ], "Elo", "Matching Pairs · image · poker theme · 16 games per model");

  batch(["openai-astra"], "exploitbench", [["gpt-6-astra",100.0],["gpt-5-6-sol",78.5],["claude-opus-5",70.0]], "%", "无生产安全策略");
  batch(["zai-glm53"], "exploitbench", [["glm-5-3",54.4],["kimi-k3",32.2],["qwen3-8-max",28.8],["claude-fable-5",78.0],["gpt-5-6-sol",76.5]], "%", "Z.ai设置");
  add(["deepseek-v41"], "exploitbench", "deepseek-v4-1-flash", 73.5, "%", "ExploitBench API harness / 5 seeds");
  batch(["openai-astra"], "exploitbench-2026-jun-aug", [["gpt-6-astra",39.0],["gpt-5-6-sol",5.5]], "%", "2026年6–8月漏洞 · max effort · 无生产安全策略");

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
  batch(["openai-astra"], "sre-bench-1", [["gpt-6-astra",88.0],["gpt-5-6-sol",55.9]], "%", "max effort · 1 attempt");
  batch(["openai-astra"], "sre-bench-4", [["gpt-6-astra",99.2],["gpt-5-6-sol",68.7]], "%", "max effort · within 4 attempts");

  add(["qwen38", "qwen38-hf"], "mrcr-256k", "qwen3-8-max", 92.9, "%", "MRCR v2 256K / 8-needle");
  add(["seed21"], "mmlongbench", "seed2-1-pro", 78.3, "%", "128K");
  add(["seed21"], "mmlongbench", "seed2-1-turbo", 76.9, "%", "128K");

  add(["seed21", "workspacebench"], "workspace-bench", "seed2-1-pro", 53.0, "%", "High-Economic-Value");
  add(["seed21", "workspacebench"], "workspace-bench", "seed2-1-turbo", 54.7, "%", "High-Economic-Value");
  add(["qwen38", "workspacebench"], "workspace-bench", "qwen3-8-max", 67.7, "%", "Qwen官方表");
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
  qwenCompare("qwen-react-bench", [1694, 1770, 1564, 1538, 1724], "Elo", "Qwen内部双语 React 基准 · Claude Code harness · 自动渲染 + 多模态评判 · BT/Elo");
  qwenCompare("qwen-svg-bench", [1648, 1690, 1758, 1499, 1713], "Elo", "Qwen内部双语 SVG 基准 · 自动渲染 + 多模态评判 · BT/Elo");

  qwenCompare("coworkbench", [72.3, 75.9, 71.5, 64.6, 74.8], "%", "Qwen内部 CoWorkBench");
  qwenCompare("workspace-bench", [66.8, 68.7, 65.6, 61.4, 67.7], "%", "Qwen3.8 官方模型卡对照表 · Workspace-Bench 1.0", "Benchmark 使用 ClaudeCode、DeepAgent、Hermes 与 OpenClaw；厂商表未逐行披露 Harness", ["qwen38-hf", "workspacebench"]);
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

  batch(["qwen37", "qwenclawbench"], "qwenclawbench", [
    ["qwen3-7-max", 64.3, "Qwen3.7 官方跨 Harness 图表 · OpenClaw · launch snapshot"],
    ["qwen3-7-max", 68.5, "Qwen3.7 官方跨 Harness 图表 · Claude Code (CC) · launch snapshot"],
    ["qwen3-7-max", 70.7, "Qwen3.7 官方跨 Harness 图表 · Hermes · launch snapshot"]
  ]);
  add(["qwen37-plus", "qwenclawbench"], "qwenclawbench", "qwen3-7-plus", 61.8, "%", "Qwen3.7 Plus 官方表 · OpenClaw benchmark · exact harness row not separately disclosed");

  batch(["qwen37"], "coworkbench", [
    ["qwen3-7-max", 67.2, "Qwen3.7 官方跨 Harness 图表 · OpenClaw"],
    ["qwen3-7-max", 66.0, "Qwen3.7 官方跨 Harness 图表 · Claude Code (CC)"],
    ["qwen3-7-max", 68.3, "Qwen3.7 官方跨 Harness 图表 · Hermes"]
  ]);
  add(["qwen37-plus"], "coworkbench", "qwen3-7-plus", 65.1, "%", "Qwen3.7 Plus 官方表 · Harness 未逐行披露");
  add(["qwen37-plus", "claweval"], "claweval", "qwen3-7-plus", 62.7, "%", "Qwen3.7 Plus 官方表 · ClawEval");
  add(["qwen37-plus"], "skillsbench-1-1", "qwen3-7-plus", 54.9, "%", "OpenCode · 78 tasks（排除9个外部 API 任务）· 5次平均");

  add(["qwen38-hf"], "wildclawbench-overall", "qwen3-8-max", 56.2, "%", "Hugging Face Eval Results");
  add(["qwen38-hf"], "wildclawbench-time", "qwen3-8-max", 708, "min", "Hugging Face Eval Results");
  batch(["wildclawbench"], "wildclawbench-overall", [
    ["gpt-5-6-sol", 67.2], ["claude-opus-4-8", 64.7], ["claude-fable-5", 62.0],
    ["qwen3-8-max", 56.2], ["kimi-k3", 54.5], ["gpt-5-4", 50.3],
    ["deepseek-v4-pro", 43.7], ["gemini-3-1-pro", 40.8, "OpenClaw · 60 tasks · low-effort"],
    ["qwen3-5-397b", 34.5], ["kimi-k2-5", 30.8]
  ], "%", "OpenClaw · 完整60题");
  batch(["wildclawbench"], "wildclawbench-time", [
    ["gpt-5-6-sol", 222], ["claude-opus-4-8", 400], ["claude-fable-5", 324],
    ["qwen3-8-max", 708], ["kimi-k3", 488], ["gpt-5-4", 350],
    ["deepseek-v4-pro", 605], ["gemini-3-1-pro", 240], ["qwen3-5-397b", 459], ["kimi-k2-5", 406]
  ], "min", "OpenClaw · 完整60题总用时");
  batch(["wildclawbench"], "wildclawbench-cost", [
    ["gpt-5-6-sol", 56.78], ["claude-opus-4-8", 95.95], ["claude-fable-5", 87.71],
    ["qwen3-8-max", 24.70], ["kimi-k3", 40.08], ["gpt-5-4", 19.80],
    ["deepseek-v4-pro", 12.00], ["gemini-3-1-pro", 18.00], ["qwen3-5-397b", 22.20], ["kimi-k2-5", 6.60]
  ], "USD", "OpenClaw · 完整60题总成本");

  // Qwen3.8 Omni Flash official release: every reported numeric cell from
  // the Omni, agentic-understanding, Text, and Vision result tables.
  const omniModels = ["qwen3-8-omni-flash", "qwen3-5-omni-plus", "gemini-3-8-flash", "seed2-0-lite", "muse-spark-1-2"];
  const textModels = ["qwen3-8-omni-flash", "qwen3-8-flash", "qwen3-8-27b", "qwen3-7-plus", "deepseek-v4-flash-0731", "claude-opus-4-6-max"];
  const visionModels = ["qwen3-8-omni-flash", "qwen3-8-flash", "qwen3-8-27b", "qwen3-7-plus", "claude-opus-4-6-max"];
  const sourceTable = (benchmarkId, modelIds, values, unit = "%", setting = "Qwen3.8 Omni Flash 官方发布表") => {
    values.forEach((value, index) => {
      if (value !== null) add(["qwen38-omni"], benchmarkId, modelIds[index], value, unit, setting);
    });
  };

  sourceTable("wildclawbench-mm", omniModels, [71.0, 34.5, 58.9, 41.9, null], "%", "多模态任务子集 · Claude Code");
  sourceTable("uniclawbench", omniModels, [69.6, 67.1, 69.0, 61.2, null], "%", "多模态工具使用 · OpenClaw");
  sourceTable("agenticvbench", omniModels, [36.8, 14.5, 45.0, 10.0, null], "%", "多模态工具使用 · Claude Code");
  sourceTable("omnigaia", omniModels, [74.0, 57.2, 78.6, 64.4, null], "%", "Web Search · 无 Harness");
  sourceTable("dailyomni", omniModels, [85.1, 85.1, 84.0, 81.4, 79.6]);
  sourceTable("worldsense", omniModels, [68.5, 63.9, 69.6, 67.3, 65.0]);
  sourceTable("avut", omniModels, [86.6, 85.9, 88.0, 81.5, 82.4]);
  sourceTable("joinavbench", omniModels, [75.9, 74.1, 70.4, 70.6, 71.8]);
  sourceTable("omnivideobench", omniModels, [63.4, 53.8, 65.2, 58.5, 62.2], "%", "Static");
  sourceTable("video-mme-v2", omniModels, [65.0, 47.9, 71.0, 64.9, null], "%", "Static");
  sourceTable("lvomnibench", omniModels, [63.3, 53.2, 70.7, null, null], "%", "Static");
  sourceTable("omnicloze", omniModels, [63.2, 64.2, 60.9, 56.3, 65.3]);
  sourceTable("omnicap-if-csr", omniModels, [80.6, 72.1, 81.9, 74.6, 77.9]);
  sourceTable("omnicap-if-isr", omniModels, [28.2, 14.1, 28.3, 18.1, 26.8]);
  sourceTable("qivd", omniModels, [69.6, 65.6, 69.1, 62.0, 62.0]);
  sourceTable("streamingbench", omniModels, [80.8, 57.1, 79.9, 77.2, 77.8]);
  sourceTable("alimeeting-der", omniModels, [3.35, 88.11, 72.6, 75.1, 93.7], "%", "Qwen3.8 Omni Flash 官方发布页 · Qwen 两列采用正文精确值，表格四舍五入为 3.4 / 88.1");
  sourceTable("alimeeting-cpwer", omniModels, [17.18, 89.61, 53.1, 76.1, 92.7], "%", "Qwen3.8 Omni Flash 官方发布页 · Qwen 两列采用正文精确值，表格四舍五入为 17.2 / 89.6");
  sourceTable("aishell4-der", omniModels, [2.8, 100.0, 66.4, 64.8, 91.3]);
  sourceTable("aishell4-cpwer", omniModels, [11.2, 100.0, 56.9, 64.2, 86.0]);
  sourceTable("magicdata-ramc-der", omniModels, [5.7, 98.4, 67.9, 43.4, 82.1]);
  sourceTable("magicdata-ramc-cpwer", omniModels, [14.1, 97.1, 33.8, 35.1, 75.3]);
  sourceTable("mlc-slm-en-der", omniModels, [4.0, 68.6, 60.8, 40.4, 74.3]);
  sourceTable("mlc-slm-en-cpwer", omniModels, [14.2, 63.9, 26.6, 45.5, 52.9]);
  sourceTable("wenetspeech-net-wer", omniModels, [4.8, 3.7, 14.2, 4.3, 68.2]);
  sourceTable("wenetspeech-meeting-wer", omniModels, [4.6, 4.8, 16.7, 4.7, 42.6]);
  sourceTable("fleurs-asr-wer", omniModels, [9.3, 7.2, 7.9, 32.1, 23.6]);
  sourceTable("fleurs-s2tt-bleu", omniModels, [31.8, 32.2, 33.0, 24.8, 28.8], "BLEU");
  sourceTable("spotsoundbench", omniModels, [67.2, 64.2, 39.7, 59.6, 16.9]);
  sourceTable("mmau", omniModels, [81.8, 81.9, 76.9, 77.2, 63.5]);
  sourceTable("mmar", omniModels, [79.8, 79.8, 78.5, 77.7, 67.3]);
  sourceTable("mmsu", omniModels, [82.1, 83.0, 83.3, 80.2, 59.9]);
  sourceTable("longaudiospan-accuracy", omniModels, [82.7, 74.4, 79.3, null, null]);
  sourceTable("longaudiospan-rubric", omniModels, [71.8, 49.8, 65.5, null, null]);
  sourceTable("longaudiospan-chain", omniModels, [48.2, 45.1, 64.6, null, null]);
  sourceTable("muchomusic-rul", omniModels, [72.6, 71.6, 53.7, 61.7, 40.1]);
  sourceTable("hummusqa", omniModels, [75.8, 75.5, 71.2, 66.0, 63.3]);
  sourceTable("mustbench", omniModels, [50.6, 49.1, 40.3, 44.0, 29.4]);
  sourceTable("audio-multichallenge", omniModels, [71.5, 57.6, 71.9, 63.4, 57.9]);
  sourceTable("wildspeech", omniModels, [74.3, 75.7, 76.4, 74.5, 73.4]);
  sourceTable("voicebench", omniModels, [91.6, 92.9, 92.3, 84.1, 79.8]);

  sourceTable("omnivideobench", ["qwen3-8-omni-flash", "gemini-3-8-flash"], [67.8, 70.1], "%", "Agent mode · Qwen Code");
  sourceTable("video-mme-v2", ["qwen3-8-omni-flash", "gemini-3-8-flash"], [71.3, 72.7], "%", "Agent mode · Qwen Code");
  sourceTable("lvomnibench", ["qwen3-8-omni-flash", "gemini-3-8-flash"], [73.6, 70.7], "%", "Agent mode · Qwen Code");

  sourceTable("deepswe-v1-1", textModels, [57.8, 58.7, 42.2, 16.5, 54.4, null], "%", "Claude Code / mini-SWE-agent 取较高值 · temp 1.0 · top_p 0.95 · 256K");
  sourceTable("swe-bench-pro", textModels, [63.3, 62.5, 61.7, 55.8, 56.0, 53.4], "%", "Claude Code · temp 1.0 · top_p 0.95 · 256K · refined tasks；Claude 对照为官方值");
  sourceTable("swe-multilingual", textModels, [80.5, 81.0, 73.8, 75.8, null, 77.5], "%", "mini-SWE-agent · temp 1.0 · top_p 0.95 · 256K");
  sourceTable("nl2repo", textModels, [48.9, 48.1, 42.3, 41.1, 54.2, 47.6], "%", "Claude Code · 禁止访问目标仓库的 Bash 命令");
  sourceTable("coworkbench", textModels, [75.3, 73.9, 70.7, 65.1, 45.1, 68.2], "%", "Qwen 内部长程办公与生产力任务");
  sourceTable("ifbench", textModels, [81.5, 81.3, 79.5, 79.1, 79.2, 62.5]);
  sourceTable("gpqa-diamond", textModels, [91.0, 91.7, 89.2, 90.3, 90.8, 91.3]);
  sourceTable("hle", textModels, [36.5, 35.9, 30.8, 34.7, 33.8, 40.0], "%", "GPT-4o judge");
  sourceTable("livecodebench-v6", textModels, [92.6, 91.9, 90.3, 89.6, 90.6, 88.8]);

  sourceTable("claweval-mm-passat3", visionModels, [60.4, 64.4, 57.4, 57.4, 52.5], "%", "ClawEval multimodal split · 三次运行中至少一次通过");
  sourceTable("claweval-mm-average", visionModels, [61.9, 60.4, 56.9, 60.1, 54.7], "%", "ClawEval multimodal split · 三次运行平均分");
  sourceTable("androidworld", visionModels, [87.1, 84.5, 81.9, 81.0, 62.0]);
  sourceTable("vision2web", visionModels, [62.9, 64.0, 62.9, 42.1, null], "%", "Frontend/Webpage/Website 平均 · Claude Code · gpt-5.4-2026-03-05 judge");
  sourceTable("erqa", visionModels, [71.0, 72.3, 65.5, 69.8, 40.8]);
  sourceTable("lvbench", visionModels, [76.9, 76.6, 72.4, 76.2, 63.0]);
  sourceTable("realworldqa", visionModels, [87.7, 88.5, 85.9, 86.9, 73.9]);
  sourceTable("mathvision-without-ci", visionModels, [91.8, 90.6, 90.0, 90.3, 65.5], "%", "Without Code Interpreter · Qwen 固定 boxed prompt；其他模型取有/无 boxed 较高值");
  sourceTable("mathvision-with-ci", visionModels, [96.2, 95.7, 94.6, 88.4, null], "%", "With Code Interpreter");
  sourceTable("charxiv-rq-without-ci", visionModels, [83.5, 84.6, 83.7, 85.8, 66.0], "%", "RQ · Without Code Interpreter");
  sourceTable("charxiv-rq-with-ci", visionModels, [91.4, 90.6, 90.2, 85.9, null], "%", "RQ · With Code Interpreter");

  batch(["pinchbench-v2"], "pinchbench-v2-best", [
    ["claude-opus-4-8-fast", 94.5], ["qwen3-7-max", 93.4], ["claude-opus-4-8", 91.8],
    ["gpt-5-6-luna", 90.8], ["seed2-0-lite", 89.7], ["gpt-5-4", 88.4],
    ["gpt-5-6-sol", 87.0], ["gemini-3-1-pro", 82.9], ["kimi-k2-5", 81.9],
    ["deepseek-v4-pro", 81.6], ["gpt-5-6-terra", 81.4], ["claude-fable-5", 59.6]
  ], "%", "PinchBench v2 官方榜 · Best % · 147 tasks");
  batch(["pinchbench-v2"], "pinchbench-v2-average", [
    ["claude-opus-4-8-fast", 93.5], ["qwen3-7-max", 92.5], ["claude-opus-4-8", 90.5],
    ["seed2-0-lite", 75.0], ["gpt-5-4", 75.7], ["gpt-5-6-luna", 88.7],
    ["gpt-5-6-sol", 84.2], ["gemini-3-1-pro", 81.0], ["kimi-k2-5", 54.6],
    ["deepseek-v4-pro", 61.1], ["gpt-5-6-terra", 75.9], ["claude-fable-5", 54.8]
  ], "%", "PinchBench v2 官方榜 · Avg % · 620 runs");

  add(["skillsbench-1-1"], "skillsbench-1-1", "claude-opus-4-8", 54.1, "%", "with Skills · OpenHands · 87 tasks · up to 3 trials", "without Skills: 45.7% · official v1.1 leaderboard");
  add(["skillsbench-1-1"], "skillsbench-1-1", "gemini-3-1-pro", 52.8, "%", "with Skills · OpenHands · 87 tasks · up to 3 trials", "without Skills: 33.8% · official v1.1 leaderboard");
  add(["skillsbench-1-1"], "skillsbench-1-1", "gemini-3-1-pro", 60.8, "%", "with Skills · Gemini CLI · 87 tasks · up to 3 trials", "without Skills: 36.0% · official v1.1 leaderboard");
  add(["skillsbench-1-1"], "skillsbench-1-1", "deepseek-v4-pro", 50.1, "%", "with Skills · OpenHands · 87 tasks · up to 3 trials", "official row label: DeepSeek V4 Pro · without Skills: 26.9%");

  return { meta, sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations };
})();
