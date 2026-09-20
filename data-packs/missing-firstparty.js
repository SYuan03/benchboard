(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
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
  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    const normalizedSources = [...new Set(sourceIds)].sort();
    const duplicate = observations.some((item) =>
      item.benchmarkId === benchmarkId &&
      item.modelId === modelId &&
      item.value === value &&
      item.unit === unit &&
      (item.setting || "") === setting &&
      (item.note || "") === note &&
      JSON.stringify([...(item.sourceIds || [])].sort()) === JSON.stringify(normalizedSources)
    );
    if (!duplicate) observations.push({
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
  const addRows = (sourceIds, modelId, rows) => rows.forEach((row) =>
    add(sourceIds, row[0], modelId, row[1], row[2] ?? "%", row[3] ?? "", row[4] ?? "")
  );

  appendUnique(sources, [
    { id: "deepmind-gemini3-flash-evals", vendorId: "google", publisher: "Google DeepMind", date: "2025-12", tier: "official", title: "Gemini 3 Flash — Evaluation Approach, Methodology & Results", url: "https://storage.googleapis.com/deepmind-media/gemini/gemini_3_flash_model_evaluation.pdf" },
    { id: "zai-glm52", vendorId: "zai", publisher: "Z.ai", date: "2026-06-16", tier: "official", title: "GLM-5.2: Built for Long-Horizon Tasks", url: "https://z.ai/blog/glm-5.2" },
    { id: "zai-glm52-hf", vendorId: "zai", publisher: "Z.ai", date: "2026-06-16", tier: "official", title: "GLM-5.2 — Hugging Face model card", url: "https://huggingface.co/zai-org/GLM-5.2" },
    { id: "zai-glm5-report", vendorId: "zai", publisher: "Z.ai", date: "2026-02", tier: "official", title: "GLM-5 Technical Report", url: "https://arxiv.org/abs/2602.15763" },
    { id: "openai-gpt52", vendorId: "openai", publisher: "OpenAI", date: "2025-12-11", tier: "official", title: "Introducing GPT-5.2", url: "https://openai.com/index/introducing-gpt-5-2/" },
    { id: "openai-gpt52-system-card", vendorId: "openai", publisher: "OpenAI", date: "2025-12-11", tier: "official", title: "GPT-5 System Card Update: GPT-5.2", url: "https://openai.com/index/gpt-5-system-card-update-gpt-5-2/" },
    { id: "openai-gpt53-codex", vendorId: "openai", publisher: "OpenAI", date: "2026-02-05", tier: "official", title: "Introducing GPT-5.3-Codex", url: "https://openai.com/index/introducing-gpt-5-3-codex/" },
    { id: "openai-gpt53-codex-system-card", vendorId: "openai", publisher: "OpenAI", date: "2026-02-05", tier: "official", title: "GPT-5.3-Codex System Card", url: "https://openai.com/index/gpt-5-3-codex-system-card/" },
    { id: "openai-gpt55", vendorId: "openai", publisher: "OpenAI", date: "2026-04-23", tier: "official", title: "Introducing GPT-5.5", url: "https://openai.com/index/introducing-gpt-5-5/" },
    { id: "openai-gpt55-system-card", vendorId: "openai", publisher: "OpenAI", date: "2026-04-23", tier: "official", title: "GPT-5.5 System Card", url: "https://openai.com/index/gpt-5-5-system-card/" },
    { id: "anthropic-sonnet46-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-02-17", tier: "official", title: "Claude Sonnet 4.6 System Card", url: "https://www.anthropic.com/claude-sonnet-4-6-system-card" },
    { id: "anthropic-sonnet5-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-06-30", tier: "official", title: "Claude Sonnet 5 System Card", url: "https://www.anthropic.com/claude-sonnet-5-system-card" }
  ]);

  appendUnique(models, [
    { id: "gpt-5-5-pro", name: "GPT-5.5 Pro", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-04-23", modality: "vision", modalityDetail: "文本、图像、工具与计算机操作 → 文本", context: "1M API", access: "闭源 API", aliases: ["gpt-5.5-pro"], sourceId: "openai-gpt55", referenceSourceIds: ["openai-gpt55-system-card"], summary: "GPT-5.5 的高精度 Pro 配置；与基础模型分开保留。" }
  ]);

  patchModel("gemini-3-flash", {
    releaseDate: "2025-12",
    modality: "omni",
    modalityDetail: "文本、图像、音频、视频 → 文本（64K 输出）",
    context: "1M",
    access: "闭源 API",
    sourceId: "deepmind-gemini3-flash",
    referenceSourceIds: ["deepmind-gemini3-flash-evals"]
  });
  patchModel("glm-5-2", {
    releaseDate: "2026-06-16",
    modality: "language",
    modalityDetail: "文本 → 文本；官方资料未声明原生图像、音频或视频输入",
    context: "1M",
    access: "开放权重 · MIT",
    sourceId: "zai-glm52",
    referenceSourceIds: ["zai-glm52-hf"],
    summary: "面向长程编码与 Agent 任务的开放权重旗舰模型。"
  });
  patchModel("gpt-5-2", {
    releaseDate: "2025-12-11", context: "400K", sourceId: "openai-gpt52",
    referenceSourceIds: ["openai-gpt52-system-card"],
    summary: "GPT-5.2 Thinking；发布页成绩通常为 xhigh，专业工作表使用 ChatGPT heavy。"
  });
  patchModel("gpt-5-2-pro", {
    releaseDate: "2025-12-11", context: "400K", sourceId: "openai-gpt52",
    referenceSourceIds: ["openai-gpt52-system-card"],
    summary: "GPT-5.2 Pro 高精度推理配置；与 Thinking 结果分开保留。"
  });
  patchModel("gpt-5-3-codex", {
    releaseDate: "2026-02-05", context: "400K", sourceId: "openai-gpt53-codex",
    referenceSourceIds: ["openai-gpt53-codex-system-card"],
    summary: "面向编码、终端、计算机操作与专业工作的 Codex 模型；发布表均为 xhigh。"
  });
  patchModel("gpt-5-5", {
    releaseDate: "2026-04-23", context: "1M API；Codex 400K", sourceId: "openai-gpt55",
    referenceSourceIds: ["openai-gpt55-system-card"],
    summary: "GPT-5.5 Thinking；能力表均为 xhigh，系统卡中的医疗能力口径另行保留。"
  });
  patchModel("gpt-5-5-pro", {
    releaseDate: "2026-04-23", modality: "vision",
    modalityDetail: "文本、图像、工具与计算机操作 → 文本",
    context: "1M API", access: "闭源 API", sourceId: "openai-gpt55",
    referenceSourceIds: ["openai-gpt55-system-card"],
    summary: "GPT-5.5 的高精度 Pro 配置；与 GPT-5.5 Thinking 分开保留。"
  });
  patchModel("claude-sonnet-4-6", {
    releaseDate: "2026-02-17", context: "1M", sourceId: "anthropic-sonnet46",
    referenceSourceIds: ["anthropic-sonnet46-system-card"],
    summary: "视觉与计算机操作模型；系统卡中的 effort、工具、上下文与 harness 设置逐条保留。"
  });
  patchModel("claude-sonnet-5", {
    releaseDate: "2026-06-30", context: "1M", sourceId: "anthropic-sonnet5",
    referenceSourceIds: ["anthropic-sonnet5-system-card"],
    modality: "vision",
    modalityDetail: "文本、图像、屏幕/计算机操作 → 文本",
    access: "闭源 API"
  });
  for (const id of ["gemini-3-flash", "glm-5-2", "gpt-5-2", "gpt-5-2-pro", "gpt-5-3-codex", "gpt-5-5", "gpt-5-5-pro", "claude-sonnet-4-6", "claude-sonnet-5"]) {
    const model = models.find((item) => item.id === id);
    if (model) delete model.scoreStatus;
  }

  appendUnique(benchmarks, [
    { id: "chatgpt-answers-without-errors", name: "ChatGPT Answers Without Errors", category: "事实性", direction: "higher", description: "OpenAI 生产型事实性评测；是否使用搜索写入 setting。" },
    { id: "expert-swe", name: "Expert-SWE", category: "编码", direction: "higher", description: "OpenAI 内部长程软件工程评测；任务的人类工时中位数约 20 小时。" },
    { id: "genebench", name: "GeneBench", category: "科研", direction: "higher", description: "OpenAI 发布页报告的遗传学能力评测；不要与 GeneBench Pro 合并。" },
    { id: "bixbench", name: "BixBench", category: "科研", direction: "higher", description: "科研/生物信息学任务评测。" },
    { id: "swe-lancer-ic-diamond", name: "SWE-Lancer IC Diamond", category: "编码", direction: "higher", description: "SWE-Lancer 独立承包软件任务 Diamond 子集。" },
    { id: "openrca", name: "OpenRCA", category: "编码", direction: "higher", description: "真实企业系统日志、指标与 traces 上的根因分析评测。" },
    { id: "real-world-finance", name: "Anthropic Real-World Finance", category: "专业工作", direction: "higher", description: "Anthropic 内部端到端金融分析与成品交付评测；版本和评分口径写入 setting。" },
    { id: "lab-bench-figqa", name: "LAB-Bench FigQA", category: "多模态", direction: "higher", description: "生物学论文复杂图形理解与推理。", inputModalities: ["文本", "图像"] },
    { id: "webarena", name: "WebArena", category: "计算机操作", direction: "higher", description: "自托管网站上的浏览器 Agent 任务；scaffold 与 grader 写入 setting。" },
    { id: "gmmlu", name: "Global MMLU (GMMLU)", category: "多语言", direction: "higher", description: "42 种语言的 MMLU 扩展；语言或资源层级写入 setting。" },
    { id: "milu", name: "MILU", category: "多语言", direction: "higher", description: "印度语言与文化知识评测；语言切片写入 setting。" },
    { id: "biopipelinebench", name: "BioPipelineBench", category: "科研", direction: "higher", description: "执行复杂生物信息学工作流的能力评测。" },
    { id: "structural-biology", name: "Structural Biology", category: "科研", direction: "higher", description: "从结构数据推断生物分子功能；题型写入 setting。" },
    { id: "organic-chemistry", name: "Organic Chemistry", category: "科研", direction: "higher", description: "有机化学结构、反应与合成能力评测。" },
    { id: "phylogenetics", name: "Phylogenetics", category: "科研", direction: "higher", description: "系统发育数据的定量与视觉解释评测。" },
    { id: "medcalc-bench-verified", name: "MedCalc-Bench Verified", category: "医疗", direction: "higher", description: "临床记录上的代码增强医学计算评测。" },
    { id: "frontiercode-v1", name: "FrontierCode v1", category: "编码", direction: "higher", description: "Cognition 的真实开源仓库长程软件工程评测。" },
    { id: "cursorbench", name: "CursorBench", category: "编码", direction: "higher", description: "Cursor 生产 Agent harness 中的真实编码任务。" },
    { id: "usamo-2026", name: "USAMO 2026", category: "知识 / 推理", direction: "higher", description: "2026 USA Mathematical Olympiad 证明题评测。" },
    { id: "chartmuseum", name: "ChartMuseum", category: "多模态", direction: "higher", description: "真实复杂图表上的视觉问答评测。", inputModalities: ["文本", "图像"] },
    { id: "benchcad-vision2code-iou", name: "BenchCAD · Vision2Code voxel IoU", category: "多模态", direction: "higher", description: "BenchCAD Vision2Code 子任务的 voxel IoU；与其他 BenchCAD 百分制指标分开。", inputModalities: ["文本", "图像"] },
    { id: "real-world-finance-v2", name: "Anthropic Real-World Finance v2", category: "专业工作", direction: "higher", description: "294 个定量金融任务的成对比较 Elo；与 v1 task-completion 百分比分开。" },
    { id: "healthbench-hard", name: "HealthBench Hard", category: "医疗", direction: "higher", description: "HealthBench 困难子集；长度校正等口径写入 setting。" },
    { id: "healthbench-consensus", name: "HealthBench Consensus", category: "医疗", direction: "higher", description: "HealthBench 共识子集；长度校正等口径写入 setting。" },
    { id: "spatialbench-verified", name: "SpatialBench Verified", category: "科研", direction: "higher", description: "空间转录组分析任务的外部验证子集。" },
    { id: "singlecellbench", name: "SingleCellBench", category: "科研", direction: "higher", description: "单细胞 RNA 测序分析任务。" },
    { id: "proteingym-hard", name: "ProteinGym Hard", category: "科研", direction: "higher", description: "困难蛋白突变效应预测任务。" },
    { id: "protocol-troubleshooting", name: "Protocol Troubleshooting", category: "科研", direction: "higher", description: "分子生物学实验 protocol 排错评测。" }
  ]);

  // Gemini 3 Flash: the model-card image and methodology PDF contain the same 24 target cells.
  const gemini3FlashSources = ["deepmind-gemini3-flash", "deepmind-gemini3-flash-evals"];
  addRows(gemini3FlashSources, "gemini-3-flash", [
    ["hle", 33.7, "%", "no tools · full text, text + multimodal set · pass@1"],
    ["hle-tools", 43.5, "%", "web search + code execution · pass@1"],
    ["arc-agi-2", 33.6, "%", "ARC Prize Verified · semi-private set"],
    ["gpqa-diamond", 90.4, "%", "no tools · pass@1"],
    ["aime-2025", 95.2, "%", "no tools · pass@1"],
    ["aime-2025", 99.7, "%", "code execution · pass@1"],
    ["mmmu-pro", 81.2, "%", "no tools · Standard and Vision average"],
    ["screenspot-pro", 69.1, "%", "no tools unless specified · media_resolution=ultra_high"],
    ["charxiv", 80.3, "%", "reasoning · no tools · 1,000 validation questions"],
    ["omnidocbench", 0.121, "NED", "OmniDocBench 1.5 · overall edit distance · lower is better"],
    ["videommmu", 86.9, "%", "media_resolution=HIGH · temperature=0"],
    ["livecodebench-pro", 2316, "Elo", "public leaderboard"],
    ["terminal-bench-2-0", 47.6, "%", "Terminus-2 harness · public leaderboard"],
    ["swe-bench-verified", 78.0, "%", "single attempt · internal bash/file/submit scaffold · mean of 5 runs"],
    ["tau2-bench", 90.2, "%", "Retail + Airline fixed + Telecom average · Sierra framework"],
    ["toolathlon", 49.4, "%", "official Toolathlon / Tool Decathlon result"],
    ["mcp-atlas", 57.4, "%", "Scale AI MCP Atlas"],
    ["vending-bench-2", 3635, "$", "mean final net worth"],
    ["facts-benchmark-suite", 61.9, "%", "FACTS Benchmark Suite aggregate"],
    ["simpleqa-verified", 68.7, "%", "official Kaggle leaderboard"],
    ["mmmlu", 91.8, "%", "multilingual Q&A"],
    ["global-piqa", 92.8, "%", "100 languages and cultures"],
    ["mrcr-v2-8needle", 67.2, "%", "128K cumulative average · 8-needle"],
    ["mrcr-v2-8needle-1m", 22.1, "%", "1M pointwise · 8-needle"]
  ]);

  // GLM-5.2: official blog and Hugging Face card repeat the same complete target column.
  const glm52Sources = ["zai-glm52", "zai-glm52-hf"];
  addRows(glm52Sources, "glm-5-2", [
    ["hle", 40.5, "%", "text-only subset · temperature=1 · top_p=.95 · max generation 163,840"],
    ["hle-tools", 54.7, "%", "tools · 300K context · no context management"],
    ["critpt", 20.9],
    ["aime-2026", 99.2, "%", "GPT-5.5 medium judge"],
    ["hmmt-2025-11", 94.4, "%", "GPT-5.5 medium judge"],
    ["hmmt-2026-02", 92.5, "%", "GPT-5.5 medium judge"],
    ["imoanswerbench", 91.0, "%", "GPT-5.5 medium judge"],
    ["gpqa-diamond", 91.2],
    ["swe-bench-pro", 62.1, "%", "OpenHands · tailored prompt · 400K context · 32K max output"],
    ["nl2repo", 48.9, "%", "400K context"],
    ["deepswe-v1-1", 46.2, "%", "mini-swe-agent · official pier framework · 400K context · 2h timeout"],
    ["programbench", 63.7, "%", "Claude Code 2.1.156 · max effort · 400K context"],
    ["terminal-bench-2-1", 81.0, "%", "Terminus-2 · parser=json · 256K context · 4h timeout"],
    ["terminal-bench-2-1", 82.7, "%", "best reported harness · Claude Code 2.1.167 · 5-run mean · 128K max output"],
    ["frontierswe", 74.4, "%", "Dominance · 1M context · max effort · 128K output · as of 2026-06-16"],
    ["posttrainbench", 34.3, "%", "1M context · max effort · 128K output"],
    ["swe-marathon", 13.0, "%", "1M context · max effort · 128K output"],
    ["mcp-atlas", 76.8, "%", "public 500-task subset · think mode · 10-minute timeout"],
    ["toolathlon", 48.2, "%", "Tool-Decathlon official evaluation service · 128K max tokens"]
  ]);

  // OpenAI GPT-5.2 launch appendix.
  const gpt52 = ["openai-gpt52"];
  addRows(gpt52, "gpt-5-2", [
    ["gdpval", 70.9, "%", "wins or ties · ties allowed · ChatGPT heavy"],
    ["gdpval", 49.8, "%", "clear wins · ties allowed · ChatGPT heavy"],
    ["gdpval", 61.0, "%", "wins · no ties · ChatGPT heavy"],
    ["investment-banking-modeling", 68.4, "%", "internal spreadsheet tasks · ChatGPT heavy"],
    ["swe-bench-pro", 55.6, "%", "Public · xhigh"],
    ["swe-bench-verified", 80.0, "%", "xhigh"],
    ["swe-lancer-ic-diamond", 74.6, "%", "xhigh · 40/237 infrastructure failures omitted"],
    ["chatgpt-answers-without-errors", 93.9, "%", "with search · xhigh"],
    ["chatgpt-answers-without-errors", 88.0, "%", "no search · xhigh"],
    ["mrcr-v2-8needle", 98.2, "%", "4K–8K · xhigh"],
    ["mrcr-v2-8needle", 89.3, "%", "8K–16K · xhigh"],
    ["mrcr-v2-8needle", 95.3, "%", "16K–32K · xhigh"],
    ["mrcr-v2-8needle", 92.0, "%", "32K–64K · xhigh"],
    ["mrcr-v2-8needle", 85.6, "%", "64K–128K · xhigh"],
    ["mrcr-v2-8needle", 77.0, "%", "128K–256K · xhigh"],
    ["browsecomp", 92.0, "%", "Long Context · 128K · xhigh"],
    ["browsecomp", 89.8, "%", "Long Context · 256K · xhigh"],
    ["graphwalks-bfs", 94.0, "%", "<128K · xhigh"],
    ["graphwalks-parents", 89.0, "%", "<128K · xhigh"],
    ["charxiv", 82.1, "%", "reasoning · no tools · xhigh"],
    ["charxiv", 88.7, "%", "reasoning · Python · xhigh"],
    ["mmmu-pro", 79.5, "%", "no tools · xhigh"],
    ["mmmu-pro", 80.4, "%", "Python · xhigh"],
    ["videommmu", 85.9, "%", "no tools · xhigh"],
    ["screenspot-pro", 86.3, "%", "Python · xhigh"],
    ["tau2-telecom", 98.7, "%", "xhigh"],
    ["tau2-retail", 82.0, "%", "xhigh"],
    ["browsecomp", 65.8, "%", "standard tool-use setup · xhigh"],
    ["mcp-atlas", 60.6, "%", "Scale MCP-Atlas · xhigh"],
    ["toolathlon", 46.3, "%", "xhigh"],
    ["gpqa-diamond", 92.4, "%", "no tools · xhigh"],
    ["hle", 34.5, "%", "no tools · xhigh"],
    ["hle-tools", 45.5, "%", "search + Python · xhigh"],
    ["mmmlu", 89.6, "%", "xhigh"],
    ["hmmt-2025-02", 99.4, "%", "no tools · xhigh"],
    ["aime-2025", 100.0, "%", "no tools · xhigh"],
    ["frontiermath-t1-3", 40.3, "%", "Python · xhigh"],
    ["frontiermath-t4", 14.6, "%", "Python · xhigh"],
    ["arc-agi-1", 86.2, "%", "Verified · xhigh"],
    ["arc-agi-2", 52.9, "%", "Verified · xhigh"]
  ]);
  addRows(gpt52, "gpt-5-2-pro", [
    ["gdpval", 74.1, "%", "wins or ties · ties allowed · ChatGPT heavy"],
    ["gdpval", 60.0, "%", "clear wins · ties allowed · ChatGPT heavy"],
    ["gdpval", 67.6, "%", "wins · no ties · ChatGPT heavy"],
    ["investment-banking-modeling", 71.7, "%", "internal spreadsheet tasks · ChatGPT heavy"],
    ["browsecomp", 77.9, "%", "standard tool-use setup · xhigh"],
    ["gpqa-diamond", 93.2, "%", "no tools · xhigh"],
    ["hle", 36.6, "%", "no tools · xhigh"],
    ["hle-tools", 50.0, "%", "search + Python · xhigh"],
    ["hmmt-2025-02", 100.0, "%", "no tools · xhigh"],
    ["aime-2025", 100.0, "%", "no tools · xhigh"],
    ["arc-agi-1", 90.5, "%", "Verified · xhigh"],
    ["arc-agi-2", 54.2, "%", "Verified · high effort"]
  ]);
  addRows(["openai-gpt52-system-card"], "gpt-5-2", [
    ["healthbench", 63.3379, "%", "GPT-5.2 Thinking · system-card implementation · raw score"],
    ["healthbench-hard", 42.0389, "%", "GPT-5.2 Thinking · system-card implementation · raw score"],
    ["healthbench-consensus", 94.5020, "%", "GPT-5.2 Thinking · system-card implementation · raw score"]
  ]);

  addRows(["openai-gpt53-codex"], "gpt-5-3-codex", [
    ["swe-bench-pro", 56.8, "%", "Public · xhigh"],
    ["terminal-bench-2-0", 77.3, "%", "xhigh"],
    ["osworld-verified", 64.7, "%", "xhigh"],
    ["gdpval", 70.9, "%", "wins or ties · custom skills · xhigh"],
    ["capture-the-flag", 77.6, "%", "Cybersecurity CTF challenges · xhigh"],
    ["swe-lancer-ic-diamond", 81.4, "%", "xhigh"]
  ]);

  // OpenAI GPT-5.5 launch matrix.
  const gpt55 = ["openai-gpt55"];
  addRows(gpt55, "gpt-5-5", [
    ["swe-bench-pro", 58.6, "%", "Public · single pass · xhigh"],
    ["terminal-bench-2-0", 82.7, "%", "xhigh"],
    ["expert-swe", 73.1, "%", "OpenAI internal · xhigh"],
    ["gdpval", 84.9, "%", "wins or ties · xhigh"],
    ["financeagent-v1-1", 60.0, "%", "xhigh"],
    ["investment-banking-modeling", 88.5, "%", "internal · xhigh"],
    ["officeqa-pro", 54.1, "%", "xhigh"],
    ["osworld-verified", 78.7, "%", "xhigh"],
    ["mmmu-pro", 81.2, "%", "no tools · xhigh"],
    ["mmmu-pro", 83.2, "%", "with tools · xhigh"],
    ["browsecomp", 84.4, "%", "xhigh"],
    ["mcp-atlas", 75.3, "%", "Scale AI · April 2026 update · xhigh"],
    ["toolathlon", 55.6, "%", "xhigh"],
    ["tau2-telecom", 98.0, "%", "original prompts · no prompt tuning · xhigh"],
    ["genebench", 25.0, "%", "xhigh"],
    ["frontiermath-t1-3", 51.7, "%", "v2 · xhigh"],
    ["frontiermath-t4", 35.4, "%", "v2 · xhigh"],
    ["bixbench", 80.5, "%", "xhigh"],
    ["gpqa-diamond", 93.6, "%", "xhigh"],
    ["hle", 41.4, "%", "no tools · xhigh"],
    ["hle-tools", 52.2, "%", "with tools · xhigh"],
    ["capture-the-flag", 88.1, "%", "expanded internal hardest CTF set · xhigh"],
    ["cybergym", 81.8, "%", "xhigh"],
    ["graphwalks-bfs", 73.7, "%", "256K · F1 · xhigh"],
    ["graphwalks-bfs", 45.4, "%", "1M · F1 · xhigh"],
    ["graphwalks-parents", 90.1, "%", "256K · F1 · xhigh"],
    ["graphwalks-parents", 58.5, "%", "1M · F1 · xhigh"],
    ["mrcr-v2-8needle", 98.1, "%", "4K–8K · xhigh"],
    ["mrcr-v2-8needle", 93.0, "%", "8K–16K · xhigh"],
    ["mrcr-v2-8needle", 96.5, "%", "16K–32K · xhigh"],
    ["mrcr-v2-8needle", 90.0, "%", "32K–64K · xhigh"],
    ["mrcr-v2-8needle", 83.1, "%", "64K–128K · xhigh"],
    ["mrcr-v2-8needle", 87.5, "%", "128K–256K · xhigh"],
    ["mrcr-v2-8needle", 81.5, "%", "256K–512K · xhigh"],
    ["mrcr-v2-8needle", 74.0, "%", "512K–1M · xhigh"],
    ["arc-agi-1", 95.0, "%", "Verified · xhigh"],
    ["arc-agi-2", 85.0, "%", "Verified · xhigh"]
  ]);
  addRows(gpt55, "gpt-5-5-pro", [
    ["gdpval", 82.3, "%", "wins or ties · xhigh"],
    ["investment-banking-modeling", 88.6, "%", "internal · xhigh"],
    ["browsecomp", 90.1, "%", "xhigh"],
    ["genebench", 33.2, "%", "xhigh"],
    ["frontiermath-t1-3", 52.4, "%", "v2 · xhigh"],
    ["frontiermath-t4", 39.6, "%", "v2 · xhigh"],
    ["hle", 43.1, "%", "no tools · xhigh"],
    ["hle-tools", 57.2, "%", "with tools · xhigh"]
  ]);
  addRows(["openai-gpt55-system-card"], "gpt-5-5", [
    ["healthbench", 56.5, "%", "length-adjusted · no tools · GPT-5.5 system-card implementation"],
    ["healthbench-hard", 31.5, "%", "length-adjusted · no tools · GPT-5.5 system-card implementation"],
    ["healthbench-consensus", 95.6, "%", "length-adjusted · no tools · GPT-5.5 system-card implementation"],
    ["healthbench-professional", 51.8, "%", "length-adjusted · no tools · GPT-5.5 system-card implementation"]
  ]);

  // Claude Sonnet 4.6 launch table. BrowseComp is deliberately kept separate from the revised card value.
  const sonnet46Shared = ["anthropic-sonnet46", "anthropic-sonnet46-system-card"];
  addRows(sonnet46Shared, "claude-sonnet-4-6", [
    ["terminal-bench-2-0", 59.1, "%", "Terminus-2 · max effort · no thinking · 5 runs"],
    ["swe-bench-verified", 79.6, "%", "adaptive thinking · max effort · 10 trials"],
    ["osworld-verified", 72.5, "%", "1080p · 100 steps · pass@1 · 5 runs"],
    ["tau2-retail", 91.7, "%", "adaptive thinking · max effort · 10 trials"],
    ["tau2-telecom", 97.9, "%", "adaptive thinking · max effort · 10 trials"],
    ["mcp-atlas", 61.3, "%", "max effort"],
    ["hle", 33.2, "%", "no tools · adaptive thinking · max effort"],
    ["hle-tools", 49.0, "%", "web search + web fetch + code · 3M total tokens · adaptive thinking"],
    ["financeagent-v1-1", 63.3, "%", "Vals AI · max thinking"],
    ["gdpval-aa", 1633, "Elo", "220 tasks · shell + web browsing"],
    ["arc-agi-2", 58.3, "%", "Verified · adaptive thinking · max effort"],
    ["gpqa-diamond", 89.9, "%", "adaptive thinking · max effort · 10 trials"],
    ["mmmu-pro", 74.5, "%", "no tools · adaptive thinking · max effort"],
    ["mmmu-pro", 75.6, "%", "image-cropping tool · adaptive thinking · max effort"],
    ["mmmlu", 89.3, "%", "14 non-English languages · adaptive thinking · max effort"]
  ]);
  add(["anthropic-sonnet46"], "browsecomp", "claude-sonnet-4-6", 74.7, "%", "launch-page figure · web search/fetch + code · no thinking", "Official launch figure; retained alongside the revised system-card value of 74.01%.");

  const sonnet46Card = ["anthropic-sonnet46-system-card"];
  addRows(sonnet46Card, "claude-sonnet-4-6", [
    ["swe-multilingual", 75.9, "%", "adaptive thinking · max effort · 10 trials"],
    ["swe-bench-verified", 80.2, "%", "prompt-modified ablation · >100 tool calls · own tests first"],
    ["openrca", 27.9, "%", "author harness · adaptive thinking · high effort · 3-run mean"],
    ["openrca", 26.4, "%", "author harness · adaptive thinking · max effort · 3-run mean"],
    ["arc-agi-1", 86.50, "%", "private set · 120K thinking tokens · high effort"],
    ["arc-agi-2", 60.42, "%", "private set · 120K thinking tokens · high effort"],
    ["aime-2025", 95.6, "%", "no tools · adaptive thinking · max effort · 10 trials"],
    ["financeagent-v1-1", 61.4, "%", "Vals AI · high thinking"],
    ["real-world-finance", 59.5, "%", "v1 · overall task completion · internal code/tool harness"],
    ["vending-bench-2", 7204.14, "$", "final balance · max effort"],
    ["vending-bench-2", 6625.10, "$", "final balance · high effort"],
    ["cybergym", 65.2, "%", "targeted vulnerability reproduction · pass@1 · no thinking · default effort"],
    ["mrcr-v2-8needle", 90.6, "%", "256K bin · mean match ratio · 64K extended thinking · 5 trials"],
    ["mrcr-v2-8needle", 90.3, "%", "256K bin · mean match ratio · adaptive thinking · max effort · 5 trials"],
    ["mrcr-v2-8needle-1m", 65.1, "%", "1M bin · full internal set · 64K extended thinking · 5 trials"],
    ["mrcr-v2-8needle-1m", 65.8, "%", "1M bin · full internal set · adaptive thinking · max effort · 5 trials"],
    ["mrcr-v2-8needle-1m", 71.3, "%", "<1M API-reproducible subset · 54 problems · 64K extended thinking"],
    ["mrcr-v2-8needle-1m", 77.8, "%", "<1M API-reproducible subset · 29 problems · max effort"],
    ["graphwalks-bfs", 68.4, "%", "1M set · F1 · 64K extended thinking · 5 trials"],
    ["graphwalks-bfs", 73.8, "%", "1M set · F1 · adaptive thinking · max effort · 5 trials"],
    ["graphwalks-bfs", 72.8, "%", "256K API-reproducible subset of 1M · F1 · 64K extended thinking"],
    ["graphwalks-bfs", 74.5, "%", "256K API-reproducible subset of 1M · F1 · max effort"],
    ["graphwalks-parents", 96.9, "%", "256K API-reproducible subset of 1M · F1 · 64K extended thinking"],
    ["graphwalks-parents", 97.9, "%", "256K API-reproducible subset of 1M · F1 · max effort"],
    ["lab-bench-figqa", 58.8, "%", "no tools · adaptive thinking · max effort · 5 runs"],
    ["lab-bench-figqa", 77.1, "%", "image-cropping tool · adaptive thinking · max effort · 5 runs"],
    ["charxiv", 72.4, "%", "no tools · adaptive thinking · max effort · 5 runs · original 4.6 card harness"],
    ["charxiv", 77.4, "%", "image-cropping tool · adaptive thinking · max effort · 5 runs · original 4.6 card harness"],
    ["webarena", 65.6, "%", "single policy · screenshot + DOM navigation · general prompts · Average@5"],
    ["webarena-verified", 66.4, "%", "full set · official prompt/grader · pass@1 · Average@5"],
    ["webarena-verified", 67.7, "%", "hard subset · 258 tasks · official prompt/grader · pass@1 · Average@5"],
    ["browsecomp", 64.69, "%", "single agent · 1M total sampled tokens · no thinking · max effort"],
    ["browsecomp", 69.67, "%", "single agent · 3M total sampled tokens · no thinking · max effort"],
    ["browsecomp", 74.01, "%", "single agent · 10M total sampled tokens · no thinking · max effort"],
    ["browsecomp", 82.07, "%", "multi-agent orchestrator · subagents with tools · compaction · max effort"],
    ["deepsearchqa", 89.2, "F1", "single agent · 10M total tokens · search/fetch/code · adaptive thinking · max effort"],
    ["deepsearchqa", 91.1, "F1", "multi-agent orchestrator · 3M tokens per agent · max effort"],
    ["gmmlu", 92.9, "%", "English · adaptive thinking · max effort"],
    ["gmmlu", 91.0, "%", "high-resource average · adaptive thinking · max effort"],
    ["gmmlu", 90.2, "%", "mid-resource average · adaptive thinking · max effort"],
    ["gmmlu", 83.8, "%", "low-resource average · adaptive thinking · max effort"],
    ["gmmlu", 76.7, "%", "Igbo · adaptive thinking · max effort"],
    ["gmmlu", 78.8, "%", "Chichewa · adaptive thinking · max effort"],
    ["gmmlu", 80.3, "%", "Yoruba · adaptive thinking · max effort"],
    ["gmmlu", 82.2, "%", "Shona · adaptive thinking · max effort"],
    ["gmmlu", 82.3, "%", "Somali · adaptive thinking · max effort"],
    ["gmmlu", 83.9, "%", "Malagasy · adaptive thinking · max effort"],
    ["gmmlu", 84.1, "%", "Hausa · adaptive thinking · max effort"],
    ["gmmlu", 86.7, "%", "Amharic · adaptive thinking · max effort"],
    ["gmmlu", 86.9, "%", "Kyrgyz · adaptive thinking · max effort"],
    ["gmmlu", 87.0, "%", "Swahili · adaptive thinking · max effort"],
    ["gmmlu", 88.1, "%", "Sinhala · adaptive thinking · max effort"],
    ["gmmlu", 89.1, "%", "Nepali · adaptive thinking · max effort"],
    ["gmmlu", 88.7, "%", "overall average · all languages · adaptive thinking · max effort"],
    ["milu", 91.7, "%", "English · adaptive thinking · max effort"],
    ["milu", 90.9, "%", "Bengali · adaptive thinking · max effort"],
    ["milu", 89.0, "%", "Gujarati · adaptive thinking · max effort"],
    ["milu", 92.8, "%", "Hindi · adaptive thinking · max effort"],
    ["milu", 91.5, "%", "Kannada · adaptive thinking · max effort"],
    ["milu", 87.0, "%", "Malayalam · adaptive thinking · max effort"],
    ["milu", 89.2, "%", "Marathi · adaptive thinking · max effort"],
    ["milu", 87.9, "%", "Odia · adaptive thinking · max effort"],
    ["milu", 87.2, "%", "Punjabi · adaptive thinking · max effort"],
    ["milu", 88.8, "%", "Tamil · adaptive thinking · max effort"],
    ["milu", 89.3, "%", "Telugu · adaptive thinking · max effort"],
    ["milu", 89.6, "%", "average · English + 10 Indic languages · adaptive thinking · max effort"],
    ["biopipelinebench", 52.1, "%", "bash/code/package tools · no extended thinking"],
    ["biomysterybench", 50.4, "%", "bash/code/package tools · no extended thinking"],
    ["structural-biology", 85.3, "%", "multiple choice · basic tools · no extended thinking"],
    ["structural-biology", 24.7, "%", "open ended · basic tools · no extended thinking"],
    ["organic-chemistry", 48.4, "%", "bash/code/package tools · no extended thinking"],
    ["phylogenetics", 49.1, "%", "quantitative + visual interpretation · no extended thinking"],
    ["medcalc-bench-verified", 86.24, "%", "Python REPL · code-augmented agent loop · max effort · 5 runs"]
  ]);

  // Claude Sonnet 5 launch page: six headline target cells also appear in the system card.
  const sonnet5Shared = ["anthropic-sonnet5", "anthropic-sonnet5-system-card"];
  addRows(sonnet5Shared, "claude-sonnet-5", [
    ["swe-bench-pro", 63.2, "%", "adaptive thinking · max effort · 5 trials"],
    ["terminal-bench-2-1", 80.4, "%", "mini-SWE-agent · xhigh · 89 tasks × 5 attempts"],
    ["hle", 43.2, "%", "no tools · auto thinking · 1M total tokens"],
    ["hle-tools", 57.4, "%", "search/fetch/code · max effort · 1M total tokens"],
    ["osworld-verified", 81.2, "%", "361 tasks · 1080p · 100 steps · pass@1 · 5 runs"],
    ["gdpval-aa-v2", 1618, "Elo", "Artificial Analysis · as of 2026-06-17"]
  ]);

  const sonnet5Card = ["anthropic-sonnet5-system-card"];
  addRows(sonnet5Card, "claude-sonnet-5", [
    ["swe-bench-verified", 85.2, "%", "adaptive thinking · max effort · 5 trials"],
    ["swe-multilingual", 78.3, "%", "adaptive thinking · max effort · 5 trials"],
    ["swe-multimodal", 28.1, "%", "internal harness · adaptive thinking · max effort · 5 trials"],
    ["frontiercode-v1", 38.8, "%", "Cognition production evaluation · max effort"],
    ["cursorbench", 61.2, "%", "Cursor production Agent harness"],
    ["usamo-2026", 79.5, "%", "high effort · 300K token limit · 10 attempts per problem"],
    ["arxivmath", 65.7, "%", "April + May 2026 · no tools · extended thinking · 4 attempts/problem"],
    ["arxivmath", 72.2, "%", "April + May 2026 · with tools · extended thinking · 4 attempts/problem"],
    ["hle-tools", 36.5, "%", "search/fetch/code · low effort · 1M total tokens"],
    ["hle-tools", 47.2, "%", "search/fetch/code · medium effort · 1M total tokens"],
    ["hle-tools", 52.8, "%", "search/fetch/code · high effort · 1M total tokens"],
    ["hle-tools", 54.6, "%", "search/fetch/code · xhigh effort · 1M total tokens"],
    ["browsecomp", 84.7, "%", "single agent · search/fetch/code · 10M token limit · max effort"],
    ["browsecomp", 86.6, "%", "multi-agent · max effort"],
    ["gdp-pdf", 67.5, "%", "mean criteria pass rate · no tools · base64 PDF · 5 runs"],
    ["gdp-pdf", 81.6, "%", "mean criteria pass rate · Python + image crop · 5 runs"],
    ["benchcad-vision2code-iou", 0.266, "voxel IoU", "1,000-file subset · no tools · 5 runs"],
    ["benchcad-vision2code-iou", 0.373, "voxel IoU", "1,000-file subset · Python + image crop · 5 runs"],
    ["chartmuseum", 70.1, "%", "test split · no tools · Sonnet 4.6 grader · 5 runs"],
    ["chartmuseum", 86.7, "%", "test split · Python + image crop · Sonnet 4.6 grader · 5 runs"],
    ["charxiv", 77.0, "%", "1,000 validation questions · no tools · Sonnet 4.6 grader · 5 runs"],
    ["charxiv", 88.3, "%", "1,000 validation questions · Python + image crop · Sonnet 4.6 grader · 5 runs"],
    ["officeqa", 73.3, "%", "extracted-text sandbox + code · exact match · max effort · 5 trials"],
    ["officeqa-pro", 59.4, "%", "133-question subset · extracted-text sandbox + code · max effort · 5 trials"],
    ["real-world-finance-v2", 1219, "Elo", "294 quantitative-finance tasks · Opus 4.8 grader"],
    ["legal-agent-public", 8.92, "%", "1,235-task public set · all-pass · internal reduced-tool harness · 5 trials"],
    ["legal-agent-public", 88.26, "%", "1,235-task public set · mean criterion pass · internal reduced-tool harness · 5 trials"],
    ["harvey-legal-heldout", 5.8, "%", "Harvey held-out set · all-pass"],
    ["harvey-legal-heldout", 91.2, "%", "Harvey held-out set · mean criterion pass"],
    ["toolathlon", 54.3, "%", "internal pinned harness · pass@1 · 3 trials · max effort"],
    ["toolathlon", 63.0, "%", "internal pinned harness · pass@3 · 3 trials · max effort"],
    ["toolathlon", 40.7, "%", "internal pinned harness · Pass³ · 3 trials · max effort"],
    ["automationbench", 13.5, "%", "Zapier private held-out set · max effort"],
    ["aa-briefcase", 1393, "Score", "Elo · Artificial Analysis independent evaluation"],
    ["healthbench", 58.7, "%", "length-adjusted · Opus 4.8 grader · no tools · 5 trials"],
    ["healthbench-professional", 57.8, "%", "length-adjusted · Opus 4.8 grader · no tools · 5 trials"],
    ["gmmlu", 89.0, "%", "overall average · adaptive thinking · max effort · 1 trial"],
    ["milu", 89.3, "%", "overall average · adaptive thinking · max effort · 5 trials"],
    ["include", 86.5, "%", "overall average · adaptive thinking · max effort · 5 trials"],
    ["biomysterybench", 82, "%", "human-solvable subset · source plots 0.82"],
    ["biomysterybench", 35, "%", "human-difficult subset · source plots 0.35"],
    ["spatialbench-verified", 0.70, "score", "LatchBio Bioinformatics"],
    ["singlecellbench", 0.56, "score", "LatchBio Bioinformatics"],
    ["structural-biology", 69, "%", "open ended · source plots 0.69 · Sonnet 5 system-card suite"],
    ["proteingym-hard", 0.37, "score", "hard subset"],
    ["organic-chemistry", 81, "%", "source plots 0.81 · Sonnet 5 system-card suite"],
    ["protocol-troubleshooting", 0.62, "score", "web search allowed"]
  ]);

  // Later Sonnet 5 card reruns of Sonnet 4.6 are kept as a distinct source/setting.
  addRows(sonnet5Card, "claude-sonnet-4-6", [
    ["terminal-bench-2-1", 67.0, "%", "mini-SWE-agent · high effort · Sonnet 5 card infrastructure"],
    ["hle", 34.6, "%", "no tools · Sonnet 5 card rerun"],
    ["hle-tools", 46.8, "%", "with tools · max effort · Sonnet 5 card rerun"],
    ["osworld-verified", 78.5, "%", "zoom-tool fix + 128K per-turn output · 361 tasks · 5 runs"],
    ["frontiercode-v1", 15.1, "%", "Cognition production evaluation"],
    ["gdpval-aa-v2", 1395, "Elo", "Artificial Analysis · as of 2026-06-17"],
    ["automationbench", 5.3, "%", "Zapier private held-out set · max effort"],
    ["gdp-pdf", 66.9, "%", "no tools · Sonnet 5 card rerun · 128K max output"],
    ["gdp-pdf", 78.6, "%", "Python + image crop · Sonnet 5 card rerun · 128K max output"],
    ["benchcad-vision2code-iou", 0.267, "voxel IoU", "1,000-file subset · no tools · Sonnet 5 card rerun"],
    ["benchcad-vision2code-iou", 0.327, "voxel IoU", "Python + image crop · Sonnet 5 card rerun"],
    ["chartmuseum", 59.3, "%", "no tools · Sonnet 5 card rerun"],
    ["chartmuseum", 80.9, "%", "Python + image crop · Sonnet 5 card rerun"],
    ["charxiv", 71.6, "%", "no tools · Sonnet 5 card rerun with Sonnet 4.6 grader"],
    ["charxiv", 85.3, "%", "Python + image crop · Sonnet 5 card rerun with Sonnet 4.6 grader"],
    ["officeqa", 68.7, "%", "extracted-text sandbox + code · max effort · Sonnet 5 card rerun"],
    ["officeqa-pro", 53.4, "%", "extracted-text sandbox + code · max effort · Sonnet 5 card rerun"],
    ["legal-agent-public", 8.00, "%", "1,235-task public set · all-pass · internal reduced-tool harness · 5 trials"],
    ["legal-agent-public", 88.48, "%", "1,235-task public set · mean criterion pass · internal reduced-tool harness · 5 trials"],
    ["toolathlon", 49.4, "%", "internal pinned harness · pass@1 · 3 trials · max effort"],
    ["healthbench", 49.9, "%", "length-adjusted · Opus 4.8 grader · no tools · Sonnet 5 card rerun"],
    ["healthbench-professional", 44.2, "%", "length-adjusted · Opus 4.8 grader · no tools · Sonnet 5 card rerun"],
    ["gmmlu", 88.4, "%", "overall average · Sonnet 5 card rerun" ]
  ]);

  const targetComplete = (sourceId, targetModels, note) => {
    const normalizedTargets = targetModels.map((modelId) => ({
      modelId,
      expectedObservationCount: observations.filter((observation) =>
        observation.modelId === modelId && observation.sourceIds.includes(sourceId)
      ).length,
      benchmarkIds: [...new Set(observations.filter((observation) =>
        observation.modelId === modelId && observation.sourceIds.includes(sourceId)
      ).map((observation) => observation.benchmarkId))]
    }));
    upsertAudit(sourceId, {
      status: "target-complete",
      scopeLabel: "目标模型列已核",
      auditedAt: "2026-09-20",
      targetModels: normalizedTargets,
      note
    });
  };

  targetComplete("deepmind-gemini3-flash", ["gemini-3-flash"], "模型卡第 3 页的嵌入式能力表已视觉核对，24 个目标成绩全部录入；安全相对变化表不混入能力榜。");
  targetComplete("deepmind-gemini3-flash-evals", ["gemini-3-flash"], "方法学 PDF 的 24 个目标成绩及关键 harness/工具口径已全部录入；与模型卡同值的单元格共享 observation 来源。");
  targetComplete("zai-glm52", ["glm-5-2"], "发布博客 Full Benchmark Table 的 GLM-5.2 目标列 19 个非空单元格全部录入。GLM-5 技术报告不是 GLM-5.2 成绩来源。");
  targetComplete("zai-glm52-hf", ["glm-5-2"], "Hugging Face 模型卡重复的 GLM-5.2 完整目标列 19 项已核；与博客同值的单元格共享来源。");
  upsertAudit("zai-glm5-report", { status: "metadata-only", auditedAt: "2026-09-20", note: "GLM-5.2 模型卡链接的技术报告实际描述 GLM-5，而非 GLM-5.2；未把其中数字错误归到 GLM-5.2。" });
  targetComplete("openai-gpt52", ["gpt-5-2", "gpt-5-2-pro"], "发布页 Appendix 的 GPT-5.2 Thinking 40 项与 GPT-5.2 Pro 12 项目标单元格全部录入；effort、工具、上下文 bin 均保留。");
  upsertAudit("openai-gpt52-system-card", { status: "partial", auditedAt: "2026-09-20", note: "系统卡一般能力部分新增的 GPT-5.2 Thinking HealthBench 三项已录入；安全、欺骗、越狱与 Preparedness 风险指标不进入通用能力榜。" });
  targetComplete("openai-gpt53-codex", ["gpt-5-3-codex"], "发布页 Appendix 的 6 个 GPT-5.3-Codex xhigh 目标单元格全部录入。" );
  upsertAudit("openai-gpt53-codex-system-card", { status: "metadata-only", auditedAt: "2026-09-20", note: "系统卡已核；公开数值集中在安全、Preparedness 与风险评估，没有独立新增的通用能力主表。" });
  targetComplete("openai-gpt55", ["gpt-5-5", "gpt-5-5-pro"], "发布页能力矩阵的 GPT-5.5 37 项与 GPT-5.5 Pro 8 项目标单元格全部录入，均保留 xhigh 与长上下文 bin。" );
  upsertAudit("openai-gpt55-system-card", { status: "partial", auditedAt: "2026-09-20", note: "系统卡一般医疗能力部分的四个长度校正 HealthBench 指标已录入；安全、心理健康、Preparedness 与高风险能力评估不混入通用能力榜。" });
  targetComplete("anthropic-sonnet46", ["claude-sonnet-4-6"], "发布页 16 个目标成绩已全部录入。BrowseComp 发布图为 74.7，修订系统卡为 74.01，两个官方值并列保留。" );
  targetComplete("anthropic-sonnet46-system-card", ["claude-sonnet-4-6"], "系统卡 Capabilities 部分所有可明确映射的标量目标成绩已录入；逐语言切片也保留。GraphWalks Parents 1M 源表错位、WebArena pass@k 无精确标签，未臆造；安全章节排除。" );
  targetComplete("anthropic-sonnet5", ["claude-sonnet-5"], "发布页 6 个目标成绩已全部录入，并与系统卡相同单元格共享来源。" );
  targetComplete("anthropic-sonnet5-system-card", ["claude-sonnet-5"], "系统卡 Capabilities 部分 53 个可明确映射的标量目标成绩已录入；ProgramBench 仅给 76–86% 区间，未伪装成精确点；价格、延迟、曲线成本点和安全章节排除。" );

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
