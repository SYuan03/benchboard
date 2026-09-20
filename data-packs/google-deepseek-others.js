(() => {
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = window.BENCH_DATA;

  const appendUnique = (target, rows) => rows.forEach((candidate) => {
    if (!target.some((item) => item.id === candidate.id)) target.push(candidate);
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

  const sameValue = (left, right) => (
    typeof left === "number" && typeof right === "number"
      ? Math.abs(left - right) < 1e-12
      : String(left) === String(right)
  );

  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    const duplicate = observations.some((item) => (
      item.benchmarkId === benchmarkId
      && item.modelId === modelId
      && sameValue(item.value, value)
      && item.unit === unit
      && (item.setting || "") === setting
      && sourceIds.every((sourceId) => item.sourceIds.includes(sourceId))
    ));
    if (!duplicate) {
      observations.push({
        id: "o" + (observations.length + 1),
        sourceIds,
        benchmarkId,
        modelId,
        value,
        unit,
        setting,
        note
      });
    }
  };

  const batch = (sourceIds, benchmarkId, rows, unit = "%", setting = "") => {
    rows.forEach(([modelId, value, rowSetting = setting, note = ""]) => {
      add(sourceIds, benchmarkId, modelId, value, unit, rowSetting, note);
    });
  };

  appendUnique(sources, [
    { id: "deepmind-gemini38-method", vendorId: "google", publisher: "Google DeepMind", date: "2026-09-02", tier: "official", title: "Gemini 3.8 Flash — Evaluation Methodology", url: "https://storage.googleapis.com/deepmind-media/gemini/gemini_3-8_flash_model_evaluation.pdf" },
    { id: "deepmind-gemini37", vendorId: "google", publisher: "Google DeepMind", date: "2026-08-13", tier: "official", title: "Gemini 3.7 Flash — Model Card", url: "https://deepmind.google/models/model-cards/gemini-3-7-flash/" },
    { id: "deepmind-gemini37-method", vendorId: "google", publisher: "Google DeepMind", date: "2026-08-13", tier: "official", title: "Gemini 3.7 Flash — Evaluation Methodology", url: "https://storage.googleapis.com/deepmind-media/gemini/gemini_3-7_flash_model_evaluation.pdf" },
    { id: "deepmind-gemini31", vendorId: "google", publisher: "Google DeepMind", date: "2026-02-19", tier: "official", title: "Gemini 3.1 Pro — Model Card", url: "https://deepmind.google/models/model-cards/gemini-3-1-pro/" },
    { id: "deepmind-gemini31-method", vendorId: "google", publisher: "Google DeepMind", date: "2026-02-19", tier: "official", title: "Gemini 3.1 Pro — Evaluation Methodology", url: "https://storage.googleapis.com/deepmind-media/gemini/gemini_3-1_pro_model_evaluation.pdf" },
    { id: "deepseek-v41-report", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-09-10", tier: "official", title: "DeepSeek V4.1 Technical Report", url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf" },
    { id: "deepseek-v4-vision-exp", vendorId: "deepseek", publisher: "DeepSeek", date: "2026", tier: "official", title: "DeepSeek-V4-Flash-Vision-Exp — Model Card", url: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-Vision-Exp" },
    { id: "deepseek-v4-pro-0813", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-08-13", tier: "official", title: "DeepSeek-V4-Pro-0813 — Model Card", url: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813" },
    { id: "deepseek-v4-flash-0731", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-07-31", tier: "official", title: "DeepSeek-V4-Flash-0731 — Model Card", url: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731" },
    { id: "seed21-pdf", vendorId: "bytedance", publisher: "ByteDance Seed", date: "2026-06-23", tier: "official", title: "Seed2.1 Model Card (PDF)", url: "https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2.1/Seed2_1_Model_Card.pdf" },
    { id: "seed21-blog", vendorId: "bytedance", publisher: "ByteDance Seed", date: "2026-06-23", tier: "official", title: "Seed2.1 Officially Released: Advancing AI Productivity", url: "https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity" },
    { id: "seed20", vendorId: "bytedance", publisher: "ByteDance Seed", date: "2026", tier: "official", title: "Seed2.0", url: "https://seed.bytedance.com/en/seed2" },
    { id: "kimi-k3", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-07-17", tier: "official", title: "Kimi K3: Open Frontier Intelligence", url: "https://www.kimi.com/en/blog/kimi-k3" },
    { id: "kimi-k3-hf", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-07-17", tier: "official", title: "Kimi K3 — Official Model Card", url: "https://huggingface.co/moonshotai/Kimi-K3" },
    { id: "kimi-k3-report", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-07", tier: "official", title: "Kimi K3 Technical Report", url: "https://arxiv.org/abs/2607.24653" },
    { id: "kimi-k25", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026", tier: "official", title: "Kimi K2.5: Visual Agentic Intelligence", url: "https://www.kimi.com/en/blog/kimi-k2-5" },
    { id: "kimi-k25-hf", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026", tier: "official", title: "Kimi K2.5 — Official Model Card", url: "https://huggingface.co/moonshotai/Kimi-K2.5" },
    { id: "kimi-k25-paper", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-02", tier: "official", title: "Kimi K2.5 Technical Report", url: "https://arxiv.org/abs/2602.02276" }
  ]);

  [
    ["deepmind-gemini38-method", "metadata-only", "方法学附件补充 harness、采样与工具设置，不作为独立成绩表。"],
    ["deepmind-gemini37-method", "metadata-only", "方法学附件补充 harness、采样与工具设置，不作为独立成绩表。"],
    ["deepmind-gemini31-method", "metadata-only", "方法学附件补充 harness、采样与工具设置，不作为独立成绩表。"],
    ["deepmind-gemini37", "partial", "已录入 Gemini 3.7 Flash 自身完整公开成绩列；对照模型单元格仍待逐格导入。"],
    ["deepmind-gemini31", "partial", "已录入 Gemini 3.1 Pro 自身完整公开成绩列；对照模型单元格仍待逐格导入。"],
    ["deepseek-v41-report", "partial", "已用于补全 V4.1 Flash 自身、跨 Harness 和 Base 表；对照列仍待逐格导入。"],
    ["deepseek-v4-vision-exp", "partial", "已录入模型自身公开成绩；对照模型单元格仍待逐格导入。"],
    ["deepseek-v4-pro-0813", "partial", "已录入模型自身公开成绩；对照模型单元格仍待逐格导入。"],
    ["deepseek-v4-flash-0731", "partial", "已录入模型自身公开成绩；对照模型单元格仍待逐格导入。"],
    ["seed21-pdf", "partial", "73 页 Model Card 的目标模型成绩已逐表核对；对照模型列尚未全录。"],
    ["seed21-blog", "partial", "已登记博客正文和图表中与 PDF 不同或 PDF 正文补充的数值；其他重复的模型表尚未逐单元格绑定双来源。"],
    ["seed20", "metadata-only", "用于核实 Seed-2.0-Lite 的原生全模态输入能力。"],
    ["kimi-k3", "partial", "已录入 Kimi K3 自身公开表；对照模型单元格仍待逐格导入。"],
    ["kimi-k3-hf", "partial", "与官方博客/技术报告交叉核对 Kimi K3 自身成绩与模型元数据。"],
    ["kimi-k3-report", "partial", "已录入公开主表和内部能力表中的 Kimi K3 自身列；其余对照列待导入。"],
    ["kimi-k25", "partial", "已录入 Kimi K2.5 自身公开成绩列；对照模型单元格仍待逐格导入。"],
    ["kimi-k25-hf", "partial", "与官方博客交叉核对 Kimi K2.5 自身成绩与模型元数据。"],
    ["kimi-k25-paper", "partial", "技术报告用于交叉核对；尚未声明逐表全部数值已覆盖。"]
  ].forEach(([sourceId, status, note]) => upsertAudit(sourceId, { status, auditedAt: "2026-09-20", note }));

  [
    ["deepmind-gemini38", "已补齐 Gemini 3.8 Flash 自身遗漏项；对照模型与全文数值仍未逐单元格宣告完整。"],
    ["deepseek-v41", "已补齐 V4.1 Flash 自身主表、八套 Harness 矩阵和 Base 自身列；对照列仍待逐格导入。"],
    ["zai-glm53", "已补齐 GLM-5.3 自身遗漏项并拆分 ExploitGym 时限；整张对照表仍未逐格宣告完整。"],
    ["zai-glm53-flash", "已补齐 GLM-5.3 Flash 自身遗漏项；整张对照表仍未逐格宣告完整。"],
    ["hy4", "已录入官方附录 Hy4 自身 44 个公开/内部指标；对照模型列仍待逐格导入。"],
    ["seed21", "官方页面与 73 页 PDF 已定位；11 张量化表仍在逐表规范化，不能标记完整。"]
  ].forEach(([sourceId, note]) => upsertAudit(sourceId, { status: "partial", auditedAt: "2026-09-20", note }));

  patchModel("gemini-3-7-flash", {
    releaseDate: "2026-08-13", modality: "omni",
    modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API",
    sourceId: "deepmind-gemini37", referenceSourceIds: ["deepmind-gemini37-method"]
  });
  patchModel("gemini-3-1-pro", {
    releaseDate: "2026-02-19", modality: "omni",
    modalityDetail: "文本、图像、音频、视频 → 文本", context: "1M", access: "闭源 API",
    sourceId: "deepmind-gemini31", referenceSourceIds: ["deepmind-gemini31-method"]
  });
  patchModel("gemini-3-8-flash", { referenceSourceIds: ["deepmind-gemini38-method"] });
  patchModel("deepseek-v4-vision-exp", {
    modality: "vision", modalityDetail: "文本、图像 → 文本",
    sourceId: "deepseek-v4-vision-exp"
  });
  patchModel("deepseek-v4-pro", {
    modality: "language", modalityDetail: "文本 → 文本", context: "1M",
    sourceId: "deepseek-v4-pro-0813"
  });
  patchModel("deepseek-v4-flash-0731", { sourceId: "deepseek-v4-flash-0731" });
  patchModel("deepseek-v4-1-flash", { referenceSourceIds: ["deepseek-v41-report"] });
  patchModel("seed2-0-lite", {
    modality: "omni", modalityDetail: "文本、图像、视频、音频 → 文本",
    sourceId: "seed20"
  });
  patchModel("seed2-1-pro", { referenceSourceIds: ["seed21-pdf", "seed21-blog"] });
  patchModel("seed2-1-turbo", { referenceSourceIds: ["seed21-pdf", "seed21-blog"] });
  patchModel("kimi-k3", {
    modality: "vision",
    modalityDetail: "文本、图像、视频 → 文本；官方博客明确列出视频，HF 摘要表仅列 Text/Image",
    context: "1,048,576", access: "开放权重 / API", sourceId: "kimi-k3",
    referenceSourceIds: ["kimi-k3-hf", "kimi-k3-report"]
  });
  patchModel("kimi-k2-5", {
    modality: "vision", modalityDetail: "原生视觉语言模型；文本、图像、视频 → 文本",
    context: "256K", access: "开放权重 / API", sourceId: "kimi-k25",
    referenceSourceIds: ["kimi-k25-hf", "kimi-k25-paper"]
  });

  appendUnique(models, [
    {
      id: "deepseek-v4-1-flash-base",
      name: "DeepSeek V4.1 Flash Base",
      vendorId: "deepseek",
      vendor: "DeepSeek",
      releaseDate: "2026-09-10",
      modality: "vision",
      modalityDetail: "文本、图像 → 文本；预训练 Base 检查点",
      context: "1M",
      access: "开放权重",
      aliases: ["DeepSeek-V4.1-Flash-Base"],
      sourceId: "deepseek-v41",
      referenceSourceIds: ["deepseek-v41-report"],
      scoreStatus: "base-model",
      summary: "V4.1 Flash 的 Base 检查点；与指令/Agent 模型成绩分开保存。"
    }
  ]);

  appendUnique(benchmarks, [
    { id: "vals-finance-agent-v2", name: "Vals Finance Agent v2", category: "专业工作", direction: "higher", description: "金融分析 Agent 任务；pass@1。" },
    { id: "harvey-legal-agent", name: "Harvey Legal Agent Benchmark", category: "专业工作", direction: "higher", description: "Harvey 法律 Agent 任务；Google 报告 all-pass rate。" },
    { id: "hle-verified", name: "HLE-Verified", category: "知识 / 推理", direction: "higher", description: "经过核验的 Humanity's Last Exam 子集；集合大小写入 setting。" },
    { id: "labbench2", name: "LABBench2", category: "科研", direction: "higher", description: "生命科学实验推理；子任务聚合方式写入 setting。" },
    { id: "code-arena", name: "Code Arena", category: "编码", direction: "higher", description: "Web 开发竞技场；以 Elo 报告。" },
    { id: "harvey-lab-aa", name: "Harvey LAB-AA", category: "专业工作", direction: "higher", description: "法律工作评测；criterion/all-pass 等口径写入 setting。" },
    { id: "livecodebench-pro", name: "LiveCodeBench Pro", category: "编码", direction: "higher", description: "LiveCodeBench Pro 竞技编程 Elo。" },
    { id: "scicode", name: "SciCode", category: "科研", direction: "higher", description: "科研代码生成与推理。" },
    { id: "gdpval-aa", name: "GDPval-AA", category: "专业工作", direction: "higher", description: "GDPval-AA Elo；不要与 GDPval-AA v2 合并。" },
    { id: "codeforces-rating", name: "Codeforces Rating", category: "编码", direction: "higher", description: "Codeforces 竞技编程 rating。" },
    { id: "matharena-apex", name: "MathArena Apex", category: "知识 / 推理", direction: "higher", description: "高难数学推理；pass@k 写入 setting。" },
    { id: "chartography", name: "Chartography", category: "多模态", direction: "higher", description: "图表与视觉资料推理；工具和 Harness 写入 setting。", inputModalities: ["文本", "图像"] },
    { id: "zerobench-main", name: "ZeroBench · Main", category: "多模态", direction: "higher", description: "ZeroBench main；工具开关和 pass@k 写入 setting。", inputModalities: ["文本", "图像"] },
    { id: "agieval", name: "AGIEval", category: "知识 / 推理", direction: "higher", description: "通用考试推理评测。" },
    { id: "mmlu-pro", name: "MMLU-Pro", category: "知识 / 推理", direction: "higher", description: "MMLU-Pro 多学科知识评测。" },
    { id: "c-eval", name: "C-Eval", category: "知识 / 推理", direction: "higher", description: "中文知识与考试评测。" },
    { id: "multiloko", name: "MultiLoKo", category: "多语言", direction: "higher", description: "多语言知识评测。" },
    { id: "simpleqa-verified", name: "SimpleQA-Verified", category: "知识 / 推理", direction: "higher", description: "核验版事实问答。" },
    { id: "bbh", name: "BBH", category: "知识 / 推理", direction: "higher", description: "BIG-Bench Hard。" },
    { id: "bbeh", name: "BBEH", category: "知识 / 推理", direction: "higher", description: "BIG-Bench Extra Hard。" },
    { id: "drop", name: "DROP", category: "知识 / 推理", direction: "higher", description: "离散文本推理。" },
    { id: "hellaswag", name: "HellaSwag", category: "知识 / 推理", direction: "higher", description: "常识补全评测。" },
    { id: "bigcodebench", name: "BigCodeBench", category: "编码", direction: "higher", description: "代码生成评测。" },
    { id: "humaneval", name: "HumanEval", category: "编码", direction: "higher", description: "函数级代码生成评测。" },
    { id: "gsm8k", name: "GSM8K", category: "知识 / 推理", direction: "higher", description: "小学数学推理。" },
    { id: "math", name: "MATH", category: "知识 / 推理", direction: "higher", description: "竞赛数学推理。" },
    { id: "mgsm", name: "MGSM", category: "多语言", direction: "higher", description: "多语言数学推理。" },
    { id: "cvbench", name: "CVBench", category: "多模态", direction: "higher", description: "视觉理解评测。", inputModalities: ["文本", "图像"] },
    { id: "docvqa", name: "DocVQA", category: "多模态", direction: "higher", description: "文档视觉问答。", inputModalities: ["文本", "图像", "文档"] },
    { id: "refcoco-avg", name: "RefCOCO · Average", category: "多模态", direction: "higher", description: "视觉指代表达定位平均分。", inputModalities: ["文本", "图像"] },
    { id: "dsbench-hard", name: "DSBench-Hard", category: "编码", direction: "higher", description: "数据科学 Agent 难题集。" },
    { id: "dsbench-fullstack", name: "DSBench-FullStack", category: "编码", direction: "higher", description: "全栈数据科学 Agent 评测。" },
    { id: "apexbench", name: "ApexBench", category: "Agent / 工作", direction: "higher", description: "多模态 Agent 评测；不要与 APEX-Agents 合并。" },
    { id: "posttrainbench", name: "PostTrainBench", category: "科研", direction: "higher", description: "后训练研究与实现；版本、硬件与 Harness 写入 setting。" },
    { id: "mvbench", name: "MVBench", category: "多模态", direction: "higher", description: "视频理解评测。", inputModalities: ["文本", "视频"] },
    { id: "mmvu", name: "MMVU", category: "多模态", direction: "higher", description: "多学科视频理解评测。", inputModalities: ["文本", "视频"] },
    { id: "programbench", name: "ProgramBench", category: "编码", direction: "higher", description: "ProgramBench 主分；resolved、almost-resolved、average-pass 等口径不得混合。" },
    { id: "swe-atlas-codebase-qa", name: "SWE-Atlas · Codebase Q&A", category: "编码", direction: "higher", description: "SWE-Atlas 代码库问答子项。" },
    { id: "swe-atlas-test-writing", name: "SWE-Atlas · Test Writing", category: "编码", direction: "higher", description: "SWE-Atlas 测试编写子项。" },
    { id: "swe-atlas-refactoring", name: "SWE-Atlas · Refactoring", category: "编码", direction: "higher", description: "SWE-Atlas 重构子项。" },
    { id: "posttrainbench-v1-1", name: "PostTrainBench v1.1", category: "科研", direction: "higher", description: "PostTrainBench v1.1；与未标版本的结果分开。" },
    { id: "harbor-index", name: "Harbor Index", category: "Agent / 工作", direction: "higher", description: "Harbor 综合 Agent 指标。" },
    { id: "hy-backend-2", name: "Hy-Backend 2.0", category: "编码", direction: "higher", description: "Tencent Hy 内部后端开发评测。" },
    { id: "hy-swe-max-verified", name: "Hy-SWE Max Verified", category: "编码", direction: "higher", description: "Tencent Hy 内部软件工程评测。" },
    { id: "hy-companybench-v2", name: "Hy-CompanyBench V2", category: "编码", direction: "higher", description: "Tencent Hy 内部公司场景评测。" },
    { id: "draco", name: "DRACO", category: "Agent / 工作", direction: "higher", description: "搜索与工具使用 Agent 评测。" },
    { id: "hy-lifesearch", name: "Hy-LifeSearch", category: "Agent / 工作", direction: "higher", description: "Tencent Hy 内部生活搜索评测。" },
    { id: "hy-browsecomp-pro2", name: "Hy-BrowseComp-Pro2", category: "Agent / 工作", direction: "higher", description: "Tencent Hy 内部浏览检索评测。" },
    { id: "bankertoolbench", name: "BankerToolBench", category: "专业工作", direction: "higher", description: "银行场景工具使用评测。" },
    { id: "e-bench", name: "E-Bench", category: "Agent / 工作", direction: "higher", description: "Tencent Hy 内部通用 Agent 评测。" },
    { id: "e-bench-code", name: "E-Bench-Code", category: "编码", direction: "higher", description: "Tencent Hy 内部编码 Agent 评测。" },
    { id: "hy-finagentbench", name: "Hy-FinAgentBench", category: "专业工作", direction: "higher", description: "Tencent Hy 内部金融 Agent 评测。" },
    { id: "hy-finmodelbench-v2", name: "Hy-FinmodelBench v2", category: "专业工作", direction: "higher", description: "Tencent Hy 内部金融模型评测。" },
    { id: "superchem", name: "SUPERChem", category: "科研", direction: "higher", description: "化学推理评测。" },
    { id: "horizonmath", name: "HorizonMath", category: "科研", direction: "higher", description: "研究级数学发现；pass@k 写入 setting。" },
    { id: "brokenarxiv", name: "BrokenArXiv", category: "科研", direction: "higher", description: "论文与科研推理评测。" },
    { id: "aa-lcr", name: "AA-LCR", category: "长上下文", direction: "higher", description: "Artificial Analysis 长上下文推理指标。" },
    { id: "kimi-code-bench-2", name: "Kimi Code Bench 2.0", category: "编码", direction: "higher", description: "Moonshot 内部端到端编码评测；Harness 写入 setting。" },
    { id: "deepsearchqa", name: "DeepSearchQA", category: "Agent / 工作", direction: "higher", description: "深度检索问答；以 F1 报告。" },
    { id: "deepsearchqa-accuracy", name: "DeepSearchQA · Accuracy", category: "Agent / 工作", direction: "higher", description: "DeepSearchQA 的题目级准确率；不要与 F1 混排。" },
    { id: "wide-search-item-f1", name: "WideSearch · Item F1", category: "Agent / 工作", direction: "higher", description: "WideSearch 的 item-F1 指标；单 Agent 与 Agent Swarm 作为 setting 保存。" },
    { id: "researchrubrics", name: "ResearchRubrics", category: "科研", direction: "higher", description: "深度研究任务 rubric 评测。" },
    { id: "mcpmark-verified", name: "MCPMark-Verified", category: "Agent / 工作", direction: "higher", description: "核验版 MCP 工具使用评测。" },
    { id: "spreadsheetbench-2", name: "SpreadsheetBench 2", category: "专业工作", direction: "higher", description: "电子表格工作流评测。" },
    { id: "saas-bench", name: "SaaS-Bench", category: "计算机操作", direction: "higher", description: "SaaS 应用操作评测。" },
    { id: "tau3-banking", name: "τ³-Banking", category: "Agent / 工作", direction: "higher", description: "银行场景长程工具 Agent 评测。" },
    { id: "corpfin-v2", name: "CorpFin v2", category: "专业工作", direction: "higher", description: "企业金融任务评测。" },
    { id: "legal-research-bench", name: "Legal Research Bench", category: "专业工作", direction: "higher", description: "法律检索与研究评测。" },
    { id: "omnidocbench-score", name: "OmniDocBench · Score", category: "多模态", direction: "higher", description: "文档解析质量分；不要与 normalized edit distance 混排。", inputModalities: ["文本", "图像", "文档"] },
    { id: "perceptionbench", name: "PerceptionBench", category: "多模态", direction: "higher", description: "视觉感知评测。", inputModalities: ["文本", "图像"] },
    { id: "clawbench-247-2", name: "24/7 ClawBench 2.0", category: "Agent / 工作", direction: "higher", description: "Moonshot 内部持续运行助手评测；Kimi K3 使用 OpenClaw。" },
    { id: "mira-bench", name: "MIRA Bench", category: "Agent / 工作", direction: "higher", description: "Moonshot 内部多 Agent 路由和分配评测。" },
    { id: "kaet", name: "KAET", category: "Agent / 工作", direction: "higher", description: "Kimi Autonomous Execution Tasks。" },
    { id: "clif-bench", name: "CLIF Bench", category: "编码", direction: "higher", description: "Moonshot 内部编码体验评测。" },
    { id: "agentic-vision-bench", name: "Agentic Vision Bench", category: "多模态", direction: "higher", description: "Moonshot 内部视觉 Agent 评测；Kimi Code。", inputModalities: ["文本", "图像"] },
    { id: "swarm-bench", name: "Swarm Bench", category: "Agent / 工作", direction: "higher", description: "Moonshot 内部多 Agent 协作评测。" },
    { id: "online-experience", name: "Online Experience", category: "Agent / 工作", direction: "higher", description: "Moonshot 内部在线使用体验评测。" },
    { id: "deep-research-bench", name: "Deep Research Bench", category: "科研", direction: "higher", description: "Moonshot 内部深度研究评测。" },
    { id: "finance-bench", name: "Finance Bench", category: "专业工作", direction: "higher", description: "Moonshot 内部金融评测。" },
    { id: "kwv-bench", name: "KWV Bench", category: "专业工作", direction: "higher", description: "Moonshot 内部知识工作评测。" },
    { id: "deck-bench", name: "DECK Bench", category: "专业工作", direction: "higher", description: "Moonshot 内部演示文稿工作评测。" },
    { id: "agent-behavior-bench", name: "Agent Behavior Bench", category: "Agent / 工作", direction: "higher", description: "Moonshot 内部 Agent 行为评测。" },
    { id: "faithfulness", name: "Faithfulness", category: "知识 / 推理", direction: "higher", description: "Moonshot 内部忠实性评测。" },
    { id: "chat-all-in-one", name: "Chat All-in-One", category: "知识 / 推理", direction: "higher", description: "Moonshot 内部综合对话评测。" },
    { id: "aime-2025", name: "AIME 2025", category: "知识 / 推理", direction: "higher", description: "2025 AIME 数学评测。" },
    { id: "hmmt-feb-2025", name: "HMMT February 2025", category: "知识 / 推理", direction: "higher", description: "2025 年 2 月 HMMT 数学评测。" },
    { id: "imo-answerbench", name: "IMO-AnswerBench", category: "知识 / 推理", direction: "higher", description: "IMO 级数学答案评测。" },
    { id: "mathvista-mini", name: "MathVista mini", category: "多模态", direction: "higher", description: "视觉数学推理 mini 子集。", inputModalities: ["文本", "图像"] },
    { id: "ocrbench", name: "OCRBench", category: "多模态", direction: "higher", description: "视觉文字识别评测。", inputModalities: ["文本", "图像"] },
    { id: "infovqa-val", name: "InfoVQA · Validation", category: "多模态", direction: "higher", description: "信息图问答验证集。", inputModalities: ["文本", "图像"] },
    { id: "simplevqa", name: "SimpleVQA", category: "多模态", direction: "higher", description: "视觉知识问答。", inputModalities: ["文本", "图像"] },
    { id: "videommmu", name: "VideoMMMU", category: "多模态", direction: "higher", description: "多学科视频理解。", inputModalities: ["文本", "视频"] },
    { id: "motionbench", name: "MotionBench", category: "多模态", direction: "higher", description: "视频运动理解。", inputModalities: ["文本", "视频"] },
    { id: "longvideobench", name: "LongVideoBench", category: "多模态", direction: "higher", description: "长视频理解。", inputModalities: ["文本", "视频"] },
    { id: "ojbench-cpp", name: "OJBench · C++", category: "编码", direction: "higher", description: "C++ 在线评测代码任务。" },
    { id: "finsearchcomp-t2-t3", name: "FinSearchComp · T2 & T3", category: "专业工作", direction: "higher", description: "金融检索复杂任务 T2/T3。" },
    { id: "seal-0", name: "Seal-0", category: "Agent / 工作", direction: "higher", description: "深度检索 Agent 评测。" }
  ]);

  appendUnique(benchmarks, [
    { id: "one-million-bench-overall", name: "$OneMillion-Bench · Overall", category: "专业工作", direction: "higher", description: "官方模型材料报告的整体百分制成绩；与 Qwen 表中的 Expert Score 分开排名。" },
    { id: "aa-briefcase-elo", name: "AA-Briefcase · Elo", category: "专业工作", direction: "higher", description: "Artificial Analysis Briefcase 的 Elo 口径；与标作 Score 的厂商表分开保存。" },
    { id: "workspace-bench-pass30", name: "Workspace-Bench · Pass@30", category: "专业工作", direction: "higher", description: "100-task OpenClaw setting；至少 30 分阈值。" },
    { id: "workspace-bench-pass50", name: "Workspace-Bench · Pass@50", category: "专业工作", direction: "higher", description: "100-task OpenClaw setting；至少 50 分阈值。" },
    { id: "workspace-bench-pass70", name: "Workspace-Bench · Pass@70", category: "专业工作", direction: "higher", description: "100-task OpenClaw setting；至少 70 分阈值。" },
    { id: "workspace-bench-pass90", name: "Workspace-Bench · Pass@90", category: "专业工作", direction: "higher", description: "100-task OpenClaw setting；至少 90 分阈值。" },
    { id: "workspace-bench-pass100", name: "Workspace-Bench · Pass@100", category: "专业工作", direction: "higher", description: "100-task OpenClaw setting；满分阈值。" },
    { id: "presentbench", name: "PresentBench", category: "专业工作", direction: "higher", description: "演示文稿交付任务评测。" },
    { id: "xdailybench", name: "xDailyBench", category: "Agent / 工作", direction: "higher", description: "ByteDance Seed 内部日常生活咨询评测。" },
    { id: "doubao-multiturn", name: "Doubao Multi-Turn Bench", category: "Agent / 工作", direction: "higher", description: "真实多轮对话质量评测。" },
    { id: "seedclawbench", name: "SeedClawBench", category: "Agent / 工作", direction: "higher", description: "Seed 内部 OpenClaw 风格用户任务；含异构产物与独立文本/多模态 judging pipelines。" },
    { id: "skillsbench", name: "SkillsBench", category: "Agent / 工作", direction: "higher", description: "未注明版本的 SkillsBench 结果；不要自动并入 1.1。" },
    { id: "officeqa-pro-mm", name: "OfficeQA Pro · Multimodal", category: "Agent / 工作", direction: "higher", description: "OfficeQA Pro 多模态 Agent 设置。", collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["Seed unified multimodal agent harness"], inputModalities: ["图片", "PDF", "幻灯片", "图表", "表格", "屏幕"] },
    { id: "image2floorplan", name: "Image2FloorPlan", category: "Agent / 工作", direction: "higher", description: "从多张室内照片重建结构化户型图；Seed 内部评测。", collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["Seed unified multimodal agent harness"], inputModalities: ["图片"] },
    { id: "osworld", name: "OSWorld", category: "计算机操作", direction: "higher", description: "OSWorld 未注明 2.0 口径的结果；与 OSWorld 2.0 子榜分开。" },
    { id: "mobileworld", name: "MobileWorld", category: "计算机操作", direction: "higher", description: "移动 GUI 操作；Seed 表排除 MCP test split。" },
    { id: "creativework", name: "CreativeWork", category: "计算机操作", direction: "higher", description: "Seed 内部 GUI + MCP 创意生产力任务。" },
    { id: "gameworld", name: "GameWorld", category: "计算机操作", direction: "higher", description: "交互式多模态浏览器游戏环境。" },
    { id: "osworld-average-steps", name: "OSWorld · Average Steps", category: "计算机操作", direction: "lower", description: "OSWorld 每任务平均操作步数；GUI-only 与 Generalist CUA 设置分行保留。" },
    { id: "swe-pro-bench", name: "SWE-Pro Bench", category: "编码", direction: "higher", description: "Seed Model Card 使用的 SWE-Pro Bench 名称；未与 SWE-Bench Pro 强行合并。" },
    { id: "programbench-resolved", name: "ProgramBench · Resolved", category: "编码", direction: "higher", description: "ProgramBench 完全解决比例。" },
    { id: "programbench-average-pass", name: "ProgramBench · Average Pass Rate", category: "编码", direction: "higher", description: "ProgramBench 平均测试通过率。" },
    { id: "swe-atlas", name: "SWE-Atlas", category: "编码", direction: "higher", description: "SWE-Atlas 综合分。" },
    { id: "trae-web-bench", name: "Trae Agent Bench · Web Bench", category: "编码", direction: "higher", description: "Seed/Trae 内部 Web 开发子项。" },
    { id: "seedkernelbench", name: "SeedKernelBench", category: "编码效率", direction: "higher", description: "平均 kernel speedup ratio。" },
    { id: "trae-repo-env", name: "Trae Agent Bench · Repo Env", category: "编码", direction: "higher", description: "Seed/Trae 内部仓库环境子项。" },
    { id: "trae-artifacts", name: "Trae Agent Bench · Artifacts", category: "编码", direction: "higher", description: "Seed/Trae 内部产物生成子项。" },
    { id: "trae-error-fix-python", name: "Trae Agent Bench · Error Fix Python", category: "编码", direction: "higher", description: "Seed/Trae 内部 Python 修复子项。" },
    { id: "trae-error-fix-js", name: "Trae Agent Bench · Error Fix JS", category: "编码", direction: "higher", description: "Seed/Trae 内部 JavaScript 修复子项。" },
    { id: "trae-error-fix-java", name: "Trae Agent Bench · Error Fix Java", category: "编码", direction: "higher", description: "Seed/Trae 内部 Java 修复子项。" },
    { id: "trae-error-fix-go", name: "Trae Agent Bench · Error Fix Go", category: "编码", direction: "higher", description: "Seed/Trae 内部 Go 修复子项。" },
    { id: "trae-codegen-python", name: "Trae Agent Bench · Code Gen Python", category: "编码", direction: "higher", description: "Seed/Trae 内部 Python 生成子项。" },
    { id: "trae-codegen-js", name: "Trae Agent Bench · Code Gen JS", category: "编码", direction: "higher", description: "Seed/Trae 内部 JavaScript 生成子项。" },
    { id: "crowdsourced-developer-preference", name: "Crowdsourced Developer Evaluation · Win Rate", category: "编码", direction: "higher", description: "真实代码库任务的匿名两两人类偏好评测；对手、样本数和 W/T/L 写入 setting/note。" },
    { id: "trae-human-win-rate", name: "Trae Human Evaluation · Win Rate", category: "编码", direction: "higher", description: "Trae 真实代码库任务匿名头对头偏好胜率。" },
    { id: "trae-human-mean-score", name: "Trae Human Evaluation · Mean Score", category: "编码", direction: "higher", description: "Trae 人评六个评分维度的平均分。" },
    { id: "trae-human-fully-correct", name: "Trae Human Evaluation · Fully Correct Pass@1", category: "编码", direction: "higher", description: "首次交付完全正确且可直接使用的任务比例。" },
    { id: "trae-human-acceptable-delivery", name: "Trae Human Evaluation · Acceptable Delivery", category: "编码", direction: "higher", description: "交付结果达到可接受标准的任务比例。" },
    { id: "trae-human-severely-broken", name: "Trae Human Evaluation · Severely Broken", category: "编码", direction: "lower", description: "交付结果严重损坏的任务比例；越低越好。" },
    { id: "trae-human-delivery-completeness", name: "Trae Human Evaluation · Delivery Completeness", category: "编码", direction: "higher", description: "交付完整性人评分。" },
    { id: "trae-human-fully-usable", name: "Trae Human Evaluation · Fully Usable", category: "编码", direction: "higher", description: "综合可用性评分中达到最高“完全可用”档的任务比例。" },
    { id: "trae-human-unusable", name: "Trae Human Evaluation · Unusable", category: "编码", direction: "lower", description: "综合可用性评分中落入“不可用”档的任务比例；越低越好。" },
    { id: "trae-human-instruction-following", name: "Trae Human Evaluation · Instruction Following", category: "编码", direction: "higher", description: "指令遵循人评分。" },
    { id: "trae-human-boundary-adherence", name: "Trae Human Evaluation · Boundary Adherence", category: "编码", direction: "higher", description: "任务范围与边界遵循人评分。" },
    { id: "imo-2025", name: "IMO 2025", category: "科研", direction: "higher", description: "2025 IMO 数学问题评测。" },
    { id: "imoproof-adv", name: "IMOProof-Adv", category: "科研", direction: "higher", description: "高难数学证明评测。" },
    { id: "ipho-2025", name: "IPhO 2025", category: "科研", direction: "higher", description: "2025 国际物理奥林匹克评测。" },
    { id: "ocrbench-v2", name: "OCRBench v2", category: "多模态", direction: "higher", description: "视觉文字识别 v2。", inputModalities: ["文本", "图像"] },
    { id: "charxiv-dq", name: "CharXiv · DQ", category: "多模态", direction: "higher", description: "CharXiv 描述性问答。", inputModalities: ["文本", "图像"] },
    { id: "mathvista", name: "MathVista", category: "多模态", direction: "higher", description: "视觉数学推理。", inputModalities: ["文本", "图像"] },
    { id: "dynamath", name: "DynaMath", category: "多模态", direction: "higher", description: "动态视觉数学推理。", inputModalities: ["文本", "图像"] },
    { id: "mathverse-vision-only", name: "MathVerse · Vision-Only", category: "多模态", direction: "higher", description: "MathVerse 纯视觉子集。", inputModalities: ["图像"] },
    { id: "emma", name: "EMMA", category: "多模态", direction: "higher", description: "多模态 STEM 推理。", inputModalities: ["文本", "图像"] },
    { id: "zerobench-sub", name: "ZeroBench · Sub", category: "多模态", direction: "higher", description: "ZeroBench sub；工具开关写入 setting。", inputModalities: ["文本", "图像"] },
    { id: "visulogic", name: "VisuLogic", category: "多模态", direction: "higher", description: "视觉逻辑推理。", inputModalities: ["文本", "图像"] },
    { id: "vlmsarebiased", name: "VLMsAreBiased", category: "多模态", direction: "higher", description: "视觉语言模型偏差/鲁棒性评测。", inputModalities: ["文本", "图像"] },
    { id: "visfactor", name: "VisFactor", category: "多模态", direction: "higher", description: "视觉因素理解评测。", inputModalities: ["文本", "图像"] },
    { id: "measurebench", name: "MeasureBench", category: "多模态", direction: "higher", description: "视觉测量能力评测。", inputModalities: ["文本", "图像"] },
    { id: "worldbench", name: "WorldBench", category: "多模态", direction: "higher", description: "真实世界视觉知识评测。", inputModalities: ["文本", "图像"] },
    { id: "blink", name: "BLINK", category: "多模态", direction: "higher", description: "细粒度视觉感知评测。", inputModalities: ["文本", "图像"] },
    { id: "mmsibench-circular", name: "MMSIBench · Circular", category: "多模态", direction: "higher", description: "空间智能 circular 设置。", inputModalities: ["文本", "图像"] },
    { id: "treebench", name: "TreeBench", category: "多模态", direction: "higher", description: "空间结构推理。", inputModalities: ["文本", "图像"] },
    { id: "embspatialbench", name: "EmbSpatialBench", category: "多模态", direction: "higher", description: "具身空间推理。", inputModalities: ["文本", "图像"] },
    { id: "dude", name: "DUDE", category: "多模态", direction: "higher", description: "长文档理解。", inputModalities: ["文本", "图像", "文档"] },
    { id: "videosimpleqa", name: "VideoSimpleQA", category: "多模态", direction: "higher", description: "视频知识问答。", inputModalities: ["文本", "视频"] },
    { id: "videoholmes", name: "VideoHolmes", category: "多模态", direction: "higher", description: "视频推理评测。", inputModalities: ["文本", "视频"] },
    { id: "minerva-video", name: "Minerva · Video", category: "多模态", direction: "higher", description: "视频知识与推理评测。", inputModalities: ["文本", "视频"] },
    { id: "tvbench", name: "TVBench", category: "多模态", direction: "higher", description: "视频理解评测。", inputModalities: ["文本", "视频"] },
    { id: "tomato", name: "TOMATO", category: "多模态", direction: "higher", description: "视频运动与时序理解。", inputModalities: ["文本", "视频"] },
    { id: "contphy", name: "ContPhy", category: "多模态", direction: "higher", description: "视频连续物理理解。", inputModalities: ["文本", "视频"] },
    { id: "crossvid", name: "CrossVid", category: "多模态", direction: "higher", description: "多视频理解。", inputModalities: ["文本", "视频"] },
    { id: "livesports-3k", name: "LiveSports-3K", category: "多模态", direction: "higher", description: "直播体育视频理解。", inputModalities: ["文本", "视频"] },
    { id: "ovobench", name: "OVOBench", category: "多模态", direction: "higher", description: "流式视频理解。", inputModalities: ["文本", "视频"] },
    { id: "ovbench", name: "OVBench", category: "多模态", direction: "higher", description: "流式视频理解。", inputModalities: ["文本", "视频"] },
    { id: "kina", name: "KINA", category: "多语言", direction: "higher", description: "文化语境事实知识评测。" },
    { id: "frontier-science-olympiad", name: "FrontierScience-Olympiad", category: "科研", direction: "higher", description: "奥赛级前沿科学推理。" },
    { id: "live-mathematician-bench", name: "LiveMathematicianBench", category: "科研", direction: "higher", description: "动态高难数学评测。" },
    { id: "aethercode", name: "AetherCode", category: "编码", direction: "higher", description: "高级代码推理评测。" },
    { id: "msqa", name: "MSQA", category: "多语言", direction: "higher", description: "Multicultural SimpleQA；多语言与文化事实知识。" },
    { id: "frontiercs-score-at-1", name: "FrontierCS · Score@1", category: "科研", direction: "higher", description: "FrontierCS 单次运行的总分。" },
    { id: "frontiercs-avg-at-5", name: "FrontierCS · Avg@5", category: "科研", direction: "higher", description: "FrontierCS 五次运行的平均分。" },
    { id: "frontiercs-score-at-5", name: "FrontierCS · Score@5", category: "科研", direction: "higher", description: "FrontierCS 五次运行中的聚合总分。" }
  ]);

  const programFamily = benchmarkFamilies.find((family) => family.id === "programbench");
  if (programFamily) {
    const variants = [
      { benchmarkId: "programbench", label: "Main score" },
      { benchmarkId: "programbench-resolved", label: "Resolved" },
      { benchmarkId: "programbench-almost", label: "Almost resolved" },
      { benchmarkId: "programbench-average-pass", label: "Average pass rate" }
    ];
    programFamily.variants = variants;
  }
  appendUnique(benchmarkFamilies, [
    { id: "one-million-bench-family", name: "$OneMillion-Bench", variants: [
      { benchmarkId: "one-million-bench", label: "Expert Score" },
      { benchmarkId: "one-million-bench-overall", label: "Overall" }
    ] },
    { id: "aa-briefcase-family", name: "AA-Briefcase", variants: [
      { benchmarkId: "aa-briefcase", label: "Score" },
      { benchmarkId: "aa-briefcase-elo", label: "Elo" }
    ] },
    { id: "workspace-bench", name: "Workspace-Bench", variants: [
      { benchmarkId: "workspace-bench", label: "Total" },
      { benchmarkId: "workspace-bench-pass30", label: "Pass@30" },
      { benchmarkId: "workspace-bench-pass50", label: "Pass@50" },
      { benchmarkId: "workspace-bench-pass70", label: "Pass@70" },
      { benchmarkId: "workspace-bench-pass90", label: "Pass@90" },
      { benchmarkId: "workspace-bench-pass100", label: "Pass@100" }
    ] },
    { id: "zerobench", name: "ZeroBench", variants: [
      { benchmarkId: "zerobench-main", label: "Main" },
      { benchmarkId: "zerobench-sub", label: "Sub" }
    ] },
    { id: "frontiercs", name: "FrontierCS", variants: [
      { benchmarkId: "frontiercs-score-at-1", label: "Score@1" },
      { benchmarkId: "frontiercs-avg-at-5", label: "Avg@5" },
      { benchmarkId: "frontiercs-score-at-5", label: "Score@5" }
    ] },
    { id: "trae-human-evaluation", name: "Trae Human Evaluation", variants: [
      { benchmarkId: "trae-human-win-rate", label: "Win rate" },
      { benchmarkId: "trae-human-mean-score", label: "Mean score" },
      { benchmarkId: "trae-human-fully-correct", label: "Fully correct Pass@1" },
      { benchmarkId: "trae-human-acceptable-delivery", label: "Acceptable delivery" },
      { benchmarkId: "trae-human-severely-broken", label: "Severely broken" },
      { benchmarkId: "trae-human-delivery-completeness", label: "Delivery completeness" },
      { benchmarkId: "trae-human-fully-usable", label: "Fully usable" },
      { benchmarkId: "trae-human-unusable", label: "Unusable" },
      { benchmarkId: "trae-human-instruction-following", label: "Instruction following" },
      { benchmarkId: "trae-human-boundary-adherence", label: "Boundary adherence" }
    ] }
  ]);

  const g38 = ["deepmind-gemini38", "deepmind-gemini38-method"];
  add(g38, "vals-finance-agent-v2", "gemini-3-8-flash", 61.4, "%", "financial analyst tasks · pass@1");
  add(g38, "harvey-legal-agent", "gemini-3-8-flash", 10.0, "%", "all-pass rate");
  add(g38, "gdp-pdf", "gemini-3-8-flash", 35.0, "%", "all-pass rate · self-computed");
  add(g38, "hle-verified", "gemini-3-8-flash", 54.9, "%", "full verified set · 1,811 items");
  add(g38, "biomysterybench", "gemini-3-8-flash", 88.8, "%", "Human Solvable subset");
  add(g38, "biomysterybench", "gemini-3-8-flash", 56.5, "%", "Human Difficult subset");
  add(g38, "labbench2", "gemini-3-8-flash", 86.2, "%", "macro-average across 11 subtasks");

  const g37 = ["deepmind-gemini37", "deepmind-gemini37-method"];
  batch(g37, "artificial-intelligence-index", [["gemini-3-7-flash", 56, "August 2026 snapshot"]], "Index");
  batch(g37, "frontiercode-1-1-main", [["gemini-3-7-flash", 43.6, "Score"]]);
  batch(g37, "deepswe-v1-1", [["gemini-3-7-flash", 65.3, "mini-swe-agent · LiteLLM 1.96 · high thinking"]]);
  batch(g37, "code-arena", [["gemini-3-7-flash", 1588, "Web development"]], "Elo");
  batch(g37, "terminal-bench-2-1", [["gemini-3-7-flash", 85.8, "Terminus 2"]]);
  batch(g37, "terminal-bench-3-0", [["gemini-3-7-flash", 14.9, "mini-swe-agent · highest thinking"]]);
  batch(g37, "automationbench", [["gemini-3-7-flash", 30.4, "private set"]]);
  batch(g37, "gdpval-aa-v2", [["gemini-3-7-flash", 1525]], "Elo");
  batch(g37, "harvey-lab-aa", [["gemini-3-7-flash", 90.7, "official model-card metric"]]);
  batch(g37, "gdp-pdf", [["gemini-3-7-flash", 34.0, "self-computed"]]);
  batch(g37, "charxiv", [
    ["gemini-3-7-flash", 84.5, "no tools"],
    ["gemini-3-7-flash", 88.7, "search + code tools"]
  ]);
  batch(g37, "lvbench", [["gemini-3-7-flash", 85.4, "no tools · 1,024 frames"]]);
  batch(g37, "mrcr-v2-8needle", [["gemini-3-7-flash", 97.0, "128K cumulative average"]]);
  batch(g37, "osworld-2-partial", [["gemini-3-7-flash", 47.9, "partial · max over 3 runs"]]);
  batch(g37, "agents-last-exam-pass", [["gemini-3-7-flash", 26.3, "ALE-Claw"]]);
  batch(g37, "hle-verified", [["gemini-3-7-flash", 53.6, "1,811 verified items"]]);
  batch(g37, "biomysterybench", [
    ["gemini-3-7-flash", 87.1, "Human Solvable subset"],
    ["gemini-3-7-flash", 43.5, "Human Difficult subset"]
  ]);
  batch(g37, "labbench2", [["gemini-3-7-flash", 82.1, "overall"]]);

  const g31 = ["deepmind-gemini31", "deepmind-gemini31-method"];
  batch(g31, "hle", [["gemini-3-1-pro", 44.4, "no tools"]]);
  batch(g31, "hle-tools", [["gemini-3-1-pro", 51.4, "search with blocklist + code"]]);
  batch(g31, "arc-agi-2", [["gemini-3-1-pro", 77.1, "ARC Prize Verified"]]);
  batch(g31, "gpqa-diamond", [["gemini-3-1-pro", 94.3, "no tools"]]);
  batch(g31, "terminal-bench-2-0", [["gemini-3-1-pro", 68.5, "Terminus-2"]]);
  batch(g31, "swe-bench-verified", [["gemini-3-1-pro", 80.6, "single attempt", "Includes Google's documented +0.6 correction for three harness bugs."]]);
  batch(g31, "swe-bench-pro", [["gemini-3-1-pro", 54.2, "public subset · single attempt"]]);
  batch(g31, "livecodebench-pro", [["gemini-3-1-pro", 2887]], "Elo");
  batch(g31, "scicode", [["gemini-3-1-pro", 59]]);
  batch(g31, "apex-agents", [["gemini-3-1-pro", 33.5]]);
  batch(g31, "gdpval-aa", [["gemini-3-1-pro", 1317]], "Elo");
  batch(g31, "tau2-retail", [["gemini-3-1-pro", 90.8]]);
  batch(g31, "tau2-telecom", [["gemini-3-1-pro", 99.3]]);
  batch(g31, "mcp-atlas", [["gemini-3-1-pro", 69.2, "public"]]);
  batch(g31, "browsecomp", [["gemini-3-1-pro", 85.9, "Search + Python + Browse"]]);
  batch(g31, "mmmlu", [["gemini-3-1-pro", 92.6]]);
  batch(g31, "mrcr-v2-8needle", [
    ["gemini-3-1-pro", 84.9, "128K cumulative average"],
    ["gemini-3-1-pro", 26.3, "1M pointwise"]
  ]);
  batch(g31, "mmmu-pro", [["gemini-3-1-pro", 80.5, "no tools · average of Standard (10 options) and Vision"]]);

  const ds41 = ["deepseek-v41", "deepseek-v41-report"];
  batch(ds41, "hle", [
    ["deepseek-v4-1-flash", 36.8, "full set · pass@1 · reasoning_effort 100 · temp 1.0 · top_p .95"],
    ["deepseek-v4-1-flash", 39.1, "text-only subset · pass@1 · reasoning_effort 100 · temp 1.0 · top_p .95"]
  ]);
  batch(ds41, "codeforces-rating", [["deepseek-v4-1-flash", 3471, "reasoning_effort 100"]], "Rating");
  batch(ds41, "matharena-apex", [["deepseek-v4-1-flash", 65.6, "pass@1 · reasoning_effort 100"]]);
  batch(ds41, "chartography", [["deepseek-v4-1-flash", 78.9, "with tools · Claude Code · 512K · pass@1"]]);
  batch(ds41, "babyvision", [["deepseek-v4-1-flash", 89.6, "with tools · Claude Code · 512K · pass@1"]]);
  batch(ds41, "zerobench-main", [["deepseek-v4-1-flash", 49.0, "with tools · Claude Code · 512K · pass@5"]]);

  // Replace the two generic rows already present in data.js with their exact
  // scaffold settings; keep every other scaffold as an independent row.
  const enrichDeepSeekRow = (benchmarkId, value, setting) => {
    const existing = observations.find((item) => (
      item.sourceIds.includes("deepseek-v41")
      && item.benchmarkId === benchmarkId
      && item.modelId === "deepseek-v4-1-flash"
      && sameValue(item.value, value)
    ));
    if (existing) {
      existing.sourceIds = [...new Set([...existing.sourceIds, "deepseek-v41-report"])];
      existing.setting = setting;
    } else {
      add(ds41, benchmarkId, "deepseek-v4-1-flash", value, "%", setting);
    }
  };
  enrichDeepSeekRow("deepswe-v1-1", 74.2, "mini-SWE · max effort · temp 1.0 · top_p .95 · 1M · max_steps 500 · N=8");
  enrichDeepSeekRow("terminal-bench-2-1", 90.6, "DSH Minimal · max effort · temp 1.0 · top_p .95 · 1M · max_steps 500 · N=3 · no network");
  [
    ["Claude Code", 69.8, 88.0],
    ["Codex", 65.6, 84.1],
    ["OpenCode", 65.5, 85.0],
    ["Pi", 66.2, 86.1],
    ["mini-SWE", 74.2, 90.3],
    ["DSH Minimal", 72.6, 90.6],
    ["DSH Standard", 70.5, 85.8],
    ["DSH PTC", 67.6, 85.8]
  ].forEach(([harness, deepSWE, terminal]) => {
    const common = harness + " · max effort · temp 1.0 · top_p .95 · 1M · max_steps 500";
    add(ds41, "deepswe-v1-1", "deepseek-v4-1-flash", deepSWE, "%", common + " · N=8");
    add(ds41, "terminal-bench-2-1", "deepseek-v4-1-flash", terminal, "%", common + " · N=3 · no network");
  });

  [
    ["agieval", 83.4, "EM · 3–5-shot"],
    ["mmlu-pro", 74.1, "EM · 5-shot"],
    ["c-eval", 92.1, "EM · 5-shot"],
    ["multiloko", 45.5, "LLM-Judge · 5-shot"],
    ["simpleqa-verified", 42.3, "EM · 25-shot"],
    ["supergpqa", 53.1, "EM · 5-shot"],
    ["bbh", 86.1, "EM · 3-shot"],
    ["bbeh", 27.2, "EM · 1-shot"],
    ["drop", 87.9, "F1 · 1-shot"],
    ["hellaswag", 87.2, "EM · 0-shot"],
    ["bigcodebench", 60.6, "pass@1 · 3-shot"],
    ["humaneval", 79.4, "pass@1 · 0-shot"],
    ["gsm8k", 93.0, "EM · 8-shot"],
    ["math", 61.1, "EM · 4-shot"],
    ["mgsm", 80.2, "EM · 8-shot"],
    ["longbench-v2", 45.2, "EM · 1-shot"],
    ["mmmu-pro", 56.5, "EM · 4-shot"],
    ["cvbench", 77.9, "EM · 4-shot"],
    ["docvqa", 95.6, "LLM-Judge · 4-shot"],
    ["refcoco-avg", 86.0, "Acc@0.5 · 0-shot"]
  ].forEach(([benchmarkId, value, setting]) => {
    add(ds41, benchmarkId, "deepseek-v4-1-flash-base", value, "%", setting);
  });

  const dsVision = ["deepseek-v4-vision-exp"];
  [
    ["nl2repo",57.7],["cybergym",75.3],["deepswe-v1-1",59.3],
    ["dsbench-hard",63.6],["automationbench",25.7]
  ].forEach(([benchmarkId, value]) => {
    add(dsVision, benchmarkId, "deepseek-v4-vision-exp", value, "%", "DeepSeek Harness Minimal · max effort · temp 1.0 · top_p .95");
  });
  add(dsVision, "apexbench", "deepseek-v4-vision-exp", 36.5, "%", "multimodal-agent · pass@1");
  add(dsVision, "agents-last-exam-pass", "deepseek-v4-vision-exp", 27.3, "%", "multimodal-agent");
  add(dsVision, "chartography", "deepseek-v4-vision-exp", 64.3, "%", "multimodal-agent");
  add(dsVision, "zerobench-main", "deepseek-v4-vision-exp", 35.0, "%", "multimodal-agent · pass@5");

  const dsPro = ["deepseek-v4-pro-0813"];
  add(dsPro, "hle", "deepseek-v4-pro", 42.7, "%", "no tools · pass@1");
  add(dsPro, "hle-tools", "deepseek-v4-pro", 60.0, "%", "with tools · pass@1");
  add(dsPro, "agents-last-exam-pass", "deepseek-v4-pro", 25.7, "%", "official scaffold · pass@1");
  add(dsPro, "automationbench", "deepseek-v4-pro", 31.8, "%", "public subset · pass@1");
  add(dsPro, "dsbench-fullstack", "deepseek-v4-pro", 71.1, "%", "official model-card setting");
  add(dsPro, "dsbench-hard", "deepseek-v4-pro", 67.2, "%", "official model-card setting");

  const ds0731 = ["deepseek-v4-flash-0731"];
  add(ds0731, "terminal-bench-2-1", "deepseek-v4-flash-0731", 82.7, "%", "official model-card setting");
  add(ds0731, "cybergym", "deepseek-v4-flash-0731", 76.7, "%", "official model-card setting");
  add(ds0731, "toolathlon", "deepseek-v4-flash-0731", 70.3, "%", "Verified");
  add(ds0731, "agents-last-exam-pass", "deepseek-v4-flash-0731", 25.2, "%", "multimodal inputs explicitly ignored", "Do not use this row as evidence of multimodal input handling.");
  add(ds0731, "automationbench", "deepseek-v4-flash-0731", 25.1, "%", "public subset");
  add(ds0731, "dsbench-fullstack", "deepseek-v4-flash-0731", 68.7, "%", "official model-card setting");
  add(ds0731, "dsbench-hard", "deepseek-v4-flash-0731", 59.6, "%", "official model-card setting");

  add(["zai-glm53"], "frontierswe", "glm-5-3", 78.1, "%", "Dominance · Proximal · 1M · max effort · 128K output · snapshot 2026-08-14");
  add(["zai-glm53"], "swe-marathon", "glm-5-3", 42.5, "%", "v1.1 · Claude Code 2.1.207 · max · temp 1.0 · top_p .95 · 1M · 128K output");
  add(["zai-glm53"], "posttrainbench", "glm-5-3", 39.8, "%", "Claude Code 2.1.207 · max · 3-run weighted average · documented H100 fallback");

  const exploitGymSixHour = new Map([
    ["glm-5-3", 130],
    ["kimi-k3", 70],
    ["qwen3-8-max", 26],
    ["claude-fable-5", 247],
    ["gpt-5-6-sol", 293]
  ]);
  for (const observation of observations.filter((item) => (
    item.sourceIds.includes("zai-glm53") && item.benchmarkId === "exploitgym-tasks"
  ))) {
    observation.setting = "2-hour normalized budget";
    const sixHour = exploitGymSixHour.get(observation.modelId);
    if (sixHour != null) {
      add(["zai-glm53"], "exploitgym-tasks", observation.modelId, sixHour, "tasks", "6-hour normalized budget");
    }
  }

  add(["zai-glm53-flash"], "agents-last-exam-pass", "glm-5-3-flash", 26.3, "%", "official ALE · Claude Code max · 1M · 64K output · Tool Search disabled");
  add(["zai-glm53-flash"], "chartography", "glm-5-3-flash", 78.0, "%", "with tools");
  add(["zai-glm53-flash"], "mvbench", "glm-5-3-flash", 77.8);
  add(["zai-glm53-flash"], "mmvu", "glm-5-3-flash", 80.5);
  add(["zai-glm53-flash"], "vision2web", "glm-5-3-flash", 77.8, "%", "official GLM-5.3 Flash release table");

  const hy = ["hy4"];
  add(hy, "swe-multilingual", "hy4-preview", 82.9, "%", "HF Eval Result / Resolved");
  add(hy, "swe-bench-pro", "hy4-preview", 65.7, "%", "HF Eval Result");
  add(hy, "deepswe-v1-1", "hy4-preview", 64.3, "%", "HF Eval Result");
  add(hy, "swe-atlas-codebase-qa", "hy4-preview", 64.0, "%", "official model-card appendix");
  add(hy, "swe-atlas-test-writing", "hy4-preview", 57.8, "%", "official model-card appendix");
  add(hy, "swe-atlas-refactoring", "hy4-preview", 53.3, "%", "official model-card appendix");
  add(hy, "swe-marathon", "hy4-preview", 31.9, "%", "official model-card appendix");
  add(hy, "terminal-bench-2-1", "hy4-preview", 85.4, "%", "HF Eval Result");
  add(hy, "nl2repo", "hy4-preview", 58.9, "%", "official model-card appendix");
  add(hy, "cybergym", "hy4-preview", 78.4, "%", "official model-card appendix");
  add(hy, "programbench", "hy4-preview", 17.5, "%", "official model-card appendix");
  add(hy, "posttrainbench-v1-1", "hy4-preview", 35.6, "%", "official model-card appendix");
  add(hy, "harbor-index", "hy4-preview", 39.6, "%", "official model-card appendix");
  add(hy, "hy-backend-2", "hy4-preview", 35.2, "%", "internal");
  add(hy, "hy-swe-max-verified", "hy4-preview", 64.2, "%", "internal");
  add(hy, "hy-companybench-v2", "hy4-preview", 62.4, "%", "internal");
  add(hy, "wide-search", "hy4-preview", 83.9, "%", "official model-card appendix");
  add(hy, "one-million-bench-overall", "hy4-preview", 65.4, "%", "with tools");
  add(hy, "draco", "hy4-preview", 77.2, "%", "official model-card appendix");
  add(hy, "hy-lifesearch", "hy4-preview", 49.2, "%", "internal");
  add(hy, "hy-browsecomp-pro2", "hy4-preview", 56.1, "%", "internal");
  add(hy, "officeqa-pro", "hy4-preview", 66.2, "%", "official model-card appendix");
  add(hy, "mcp-atlas", "hy4-preview", 83.7, "%", "public subset");
  add(hy, "toolathlon", "hy4-preview", 74.1, "%", "HF Eval Result / Verified");
  add(hy, "apex-agents", "hy4-preview", 37.1, "%", "HF Eval Result");
  add(hy, "skillsbench-1-1", "hy4-preview", 62.9, "%", "79-task text-only subset");
  add(hy, "jobbench", "hy4-preview", 61.7, "%", "official model-card appendix");
  add(hy, "workspace-bench", "hy4-preview", 60.2, "%", "official model-card appendix");
  add(hy, "agents-last-exam-pass", "hy4-preview", 22.8, "%", "CLI");
  add(hy, "gdpval-aa-v2", "hy4-preview", 1678, "Elo", "official model-card appendix");
  add(hy, "automationbench", "hy4-preview", 32.1, "%", "v1.0.6");
  add(hy, "bankertoolbench", "hy4-preview", 78.6, "%", "official model-card appendix");
  add(hy, "e-bench", "hy4-preview", 77.1, "%", "internal");
  add(hy, "e-bench-code", "hy4-preview", 79.0, "%", "internal");
  add(hy, "hy-finagentbench", "hy4-preview", 79.7, "%", "internal");
  add(hy, "hy-finmodelbench-v2", "hy4-preview", 57.0, "%", "internal");
  add(hy, "biomysterybench", "hy4-preview", 71.3, "%", "official model-card appendix");
  add(hy, "hle-tools", "hy4-preview", 55.4, "%", "text-only subset · with tools");
  add(hy, "critpt", "hy4-preview", 16.9, "%", "official");
  add(hy, "gpqa-diamond", "hy4-preview", 92.3, "%", "HF Eval Result");
  add(hy, "hle", "hy4-preview", 43.4, "%", "text-only subset · no tools");
  add(hy, "superchem", "hy4-preview", 66.4, "%", "official model-card appendix");
  add(hy, "arxivmath", "hy4-preview", 66.6, "%", "official model-card appendix");
  add(hy, "horizonmath", "hy4-preview", 8.8, "%", "pass@4");
  add(hy, "matharena-apex", "hy4-preview", 74.2, "%", "2025 set");
  add(hy, "brokenarxiv", "hy4-preview", 54.6, "%", "official model-card appendix");

  const k3 = ["kimi-k3", "kimi-k3-hf", "kimi-k3-report"];
  const k3Single = "max effort · temp 1.0 · top_p .95";
  const k3Agent = "max effort · temp 1.0 · top_p 1.0";
  add(k3, "gpqa-diamond", "kimi-k3", 93.5, "%", k3Single);
  add(k3, "critpt", "kimi-k3", 23.4, "%", k3Single, "Kimi cites Artificial Analysis, snapshot 2026-07-23.");
  add(k3, "aa-lcr", "kimi-k3", 74.7, "%", k3Single, "Kimi cites Artificial Analysis, snapshot 2026-07-23.");
  add(k3, "hle", "kimi-k3", 43.5, "%", "full set · no tools · " + k3Single);
  add(k3, "hle-tools", "kimi-k3", 56.0, "%", "full set · tools · max effort · temp 1.0");
  add(k3, "deepswe-v1-1", "kimi-k3", 67.5, "%", "Kimi Code · max effort");
  add(k3, "deepswe-v1-1", "kimi-k3", 67.3, "%", "mini-SWE-agent · official leaderboard snapshot");
  add(k3, "programbench", "kimi-k3", 77.8, "%", k3Agent);
  add(k3, "terminal-bench-2-1", "kimi-k3", 88.3, "%", "best score across harnesses · max effort");
  add(k3, "frontierswe", "kimi-k3", 81.2, "%", "Kimi Code · Dominance · snapshot 2026-07-16");
  add(k3, "swe-marathon", "kimi-k3", 42.0, "%", "H20-calibrated pre-v1.1 task snapshot · " + k3Agent);
  add(k3, "posttrainbench", "kimi-k3", 36.6, "%", "official Harbor · H100 · " + k3Agent);
  add(k3, "mls-bench-lite", "kimi-k3", 48.3, "%", k3Agent);
  add(k3, "scicode", "kimi-k3", 58.7, "%", k3Single, "Kimi cites Artificial Analysis, snapshot 2026-07-23.");
  add(k3, "kimi-code-bench-2", "kimi-k3", 72.9, "%", "Kimi Code · max effort");
  add(["kimi-k3-report"], "kimi-code-bench-2", "kimi-k3", 73.7, "%", "Claude Code · max effort");
  add(k3, "browsecomp", "kimi-k3", 91.2, "%", "context compaction at 300K · 1M context · " + k3Agent);
  add(k3, "browsecomp", "kimi-k3", 90.4, "%", "no context management · full 1M context · " + k3Agent);
  add(k3, "deepsearchqa", "kimi-k3", 95.0, "F1", k3Agent);
  add(k3, "researchrubrics", "kimi-k3", 76.2, "%", k3Agent);
  add(k3, "gdpval-aa-v2", "kimi-k3", 1686, "Elo", "snapshot 2026-07-23", "Kimi cites Artificial Analysis; preserve alongside Z.ai's 1682 snapshot.");
  add(k3, "toolathlon", "kimi-k3", 76.5, "%", "Verified · " + k3Agent);
  add(k3, "mcpmark-verified", "kimi-k3", 94.5, "%", k3Agent);
  add(k3, "mcp-atlas", "kimi-k3", 84.2, "%", "500-task public subset · 100-turn limit · Gemini 3.1 Pro judge");
  add(k3, "automationbench", "kimi-k3", 30.8, "%", "600-task public subset · " + k3Agent, "Preserve alongside Z.ai's 46.7 under its own source/setting.");
  add(k3, "jobbench", "kimi-k3", 54.3, "%", k3Agent);
  add(k3, "aa-briefcase-elo", "kimi-k3", 1548, "Elo", "snapshot 2026-07-23", "Kimi cites Artificial Analysis.");
  add(k3, "agents-last-exam-pass", "kimi-k3", 28.3, "%", "Kimi Code · official leaderboard snapshot 2026-07-23", "Preserve alongside Z.ai's 27.6 snapshot.");
  add(k3, "apex-agents", "kimi-k3", 41.0, "%", k3Agent, "Kimi cites Artificial Analysis.");
  add(k3, "officeqa-pro", "kimi-k3", 63.3, "%", k3Agent);
  add(k3, "spreadsheetbench-2", "kimi-k3", 34.8, "%", k3Agent);
  add(k3, "osworld-verified", "kimi-k3", 84.8, "%", k3Agent);
  add(k3, "osworld-2", "kimi-k3", 58.3, "%", k3Agent);
  add(k3, "saas-bench", "kimi-k3", 60.1, "%", k3Agent);
  add(k3, "tau3-banking", "kimi-k3", 33.4, "%", k3Agent, "Kimi cites Artificial Analysis.");
  add(k3, "harvey-lab-aa", "kimi-k3", 94.6, "%", "criterion pass rate · snapshot 2026-07-23", "Kimi cites Artificial Analysis.");
  add(k3, "corpfin-v2", "kimi-k3", 71.6, "%", k3Agent, "Kimi cites Vals AI.");
  add(k3, "financeagent-v2", "kimi-k3", 54.4, "%", k3Agent, "Kimi cites Vals AI.");
  add(k3, "legal-research-bench", "kimi-k3", 44.2, "%", k3Agent, "Kimi cites Vals AI.");
  add(k3, "worldvqa", "kimi-k3", 51.0, "%", "ForceAnswer prompting · three-run average · " + k3Single);
  add(k3, "omnidocbench-score", "kimi-k3", 91.1, "%", "three-run average · " + k3Single);
  add(k3, "perceptionbench", "kimi-k3", 58.5, "%", "three-run average · " + k3Single);
  add(k3, "videomme", "kimi-k3", 90.0, "%", "with subtitles · three-run average · " + k3Single);
  add(k3, "mmvu", "kimi-k3", 82.1, "%", "three-run average · " + k3Single);
  add(k3, "babyvision", "kimi-k3", 85.7, "%", "Python tool · three-run average · max effort");
  add(k3, "mmmu-pro", "kimi-k3", 81.6, "%", "no tools · three-run average · " + k3Single);
  add(k3, "mmmu-pro", "kimi-k3", 83.4, "%", "Python tool · three-run average · max effort");
  add(k3, "charxiv-rq-without-ci", "kimi-k3", 84.8, "%", "no tools · three-run average · " + k3Single);
  add(k3, "charxiv-rq-with-ci", "kimi-k3", 91.3, "%", "Python tool · three-run average · max effort");
  add(k3, "mathvision-without-ci", "kimi-k3", 94.3, "%", "no tools · three-run average · " + k3Single);
  add(k3, "mathvision-with-ci", "kimi-k3", 97.8, "%", "Python tool · three-run average · max effort");
  add(k3, "zerobench-main", "kimi-k3", 23.0, "%", "no tools · pass@5 · max effort");
  add(k3, "zerobench-main", "kimi-k3", 41.0, "%", "Python tool · pass@5 · max effort");

  const k3Report = ["kimi-k3-report"];
  add(k3Report, "clawbench-247-2", "kimi-k3", 48.3, "%", "OpenClaw · max effort · internal");
  add(k3Report, "mira-bench", "kimi-k3", 64.1, "%", "MIRA harness · max effort · internal");
  add(k3Report, "kaet", "kimi-k3", 83.5, "%", "Kimi Code · max effort · internal");
  add(k3Report, "clif-bench", "kimi-k3", 52.4, "%", "Kimi Code · max effort · internal");
  add(k3Report, "agentic-vision-bench", "kimi-k3", 78.3, "%", "Kimi Code · max effort · internal");
  add(k3Report, "swarm-bench", "kimi-k3", 76.3, "%", "Kimi Agent · max effort · internal");
  add(k3Report, "online-experience", "kimi-k3", 77.9, "%", "Kimi Agent · max effort · internal");
  add(k3Report, "deep-research-bench", "kimi-k3", 90.0, "%", "Kimi Agent · max effort · internal");
  add(k3Report, "finance-bench", "kimi-k3", 62.6, "%", "N/A harness · max effort · internal");
  add(k3Report, "kwv-bench", "kimi-k3", 64.7, "%", "N/A harness · max effort · internal");
  add(k3Report, "deck-bench", "kimi-k3", 73.5, "%", "N/A harness · max effort · internal");
  add(k3Report, "agent-behavior-bench", "kimi-k3", 65.0, "%", "Kimi Work · max effort · internal");
  add(k3Report, "faithfulness", "kimi-k3", 85.5, "%", "1 − hallucination rate · max effort · internal");
  add(k3Report, "chat-all-in-one", "kimi-k3", 85.2, "%", "Kimi Work · max effort · internal");

  const k25 = ["kimi-k25", "kimi-k25-hf", "kimi-k25-paper"];
  add(k25, "hle", "kimi-k2-5", 30.1, "%", "full set · no tools");
  add(k25, "hle-tools", "kimi-k2-5", 50.2, "%", "full set · tools");
  add(k25, "hle", "kimi-k2-5", 31.5, "%", "text subset · no tools");
  add(k25, "hle", "kimi-k2-5", 21.3, "%", "image subset · no tools");
  add(k25, "hle-tools", "kimi-k2-5", 51.8, "%", "text subset · tools");
  add(k25, "hle-tools", "kimi-k2-5", 39.8, "%", "image subset · tools");
  add(k25, "aime-2025", "kimi-k2-5", 96.1);
  add(k25, "hmmt-feb-2025", "kimi-k2-5", 95.4);
  add(k25, "imo-answerbench", "kimi-k2-5", 81.8);
  add(k25, "gpqa-diamond", "kimi-k2-5", 87.6);
  add(k25, "mmlu-pro", "kimi-k2-5", 87.1);
  add(k25, "mmmu-pro", "kimi-k2-5", 78.5, "%", "official model-card base evaluation");
  add(k25, "charxiv-rq-without-ci", "kimi-k2-5", 77.5, "%", "official model-card base evaluation");
  add(k25, "mathvision-without-ci", "kimi-k2-5", 84.2, "%", "official model-card base evaluation");
  add(k25, "mathvista-mini", "kimi-k2-5", 90.1);
  add(k25, "zerobench-main", "kimi-k2-5", 9, "%", "no tools");
  add(k25, "zerobench-main", "kimi-k2-5", 11, "%", "with tools");
  add(k25, "ocrbench", "kimi-k2-5", 92.3);
  add(k25, "omnidocbench-score", "kimi-k2-5", 88.8, "%", "OmniDocBench 1.5");
  add(k25, "infovqa-val", "kimi-k2-5", 92.6);
  add(k25, "simplevqa", "kimi-k2-5", 71.2);
  add(k25, "worldvqa", "kimi-k2-5", 46.3);
  add(k25, "videommmu", "kimi-k2-5", 86.6);
  add(k25, "mmvu", "kimi-k2-5", 80.4);
  add(k25, "motionbench", "kimi-k2-5", 70.4);
  add(k25, "videomme", "kimi-k2-5", 87.4);
  add(k25, "longvideobench", "kimi-k2-5", 79.8);
  add(k25, "lvbench", "kimi-k2-5", 75.9);
  add(k25, "swe-bench-verified", "kimi-k2-5", 76.8);
  add(k25, "swe-bench-pro", "kimi-k2-5", 50.7);
  add(k25, "swe-multilingual", "kimi-k2-5", 73.0);
  add(k25, "terminal-bench-2-0", "kimi-k2-5", 50.8);
  add(k25, "paperbench", "kimi-k2-5", 63.5);
  add(k25, "cybergym", "kimi-k2-5", 41.3);
  add(k25, "scicode", "kimi-k2-5", 48.7);
  add(k25, "ojbench-cpp", "kimi-k2-5", 57.4);
  add(k25, "livecodebench-v6", "kimi-k2-5", 85.0);
  add(k25, "longbench-v2", "kimi-k2-5", 61.0);
  add(k25, "aa-lcr", "kimi-k2-5", 70.0);
  add(k25, "browsecomp", "kimi-k2-5", 60.6, "%", "single agent · no context management");
  add(k25, "browsecomp", "kimi-k2-5", 74.9, "%", "single agent · context management");
  add(k25, "browsecomp", "kimi-k2-5", 78.4, "%", "Agent Swarm");
  add(k25, "wide-search-item-f1", "kimi-k2-5", 72.7, "F1", "single agent");
  add(k25, "wide-search-item-f1", "kimi-k2-5", 79.0, "F1", "Agent Swarm");
  add(k25, "deepsearchqa", "kimi-k2-5", 77.1, "F1");
  add(k25, "finsearchcomp-t2-t3", "kimi-k2-5", 67.8);
  add(k25, "seal-0", "kimi-k2-5", 57.4);

  // Rebuild the Seed2.1 self-model rows from the PDF's numeric tables. This
  // removes earlier slash/parenthesis strings that combined distinct metrics.
  for (let index = observations.length - 1; index >= 0; index -= 1) {
    const item = observations[index];
    if (!["seed2-1-pro", "seed2-1-turbo"].includes(item.modelId)) continue;
    if (!item.sourceIds.includes("seed21")) continue;
    const keptSources = item.sourceIds.filter((sourceId) => sourceId !== "seed21");
    if (keptSources.length) item.sourceIds = keptSources;
    else observations.splice(index, 1);
  }

  const seedPdf = ["seed21-pdf"];
  const seedBlog = ["seed21-blog"];
  const seedPdfBlog = ["seed21-pdf", "seed21-blog"];
  const seedRow = (benchmarkId, turbo, pro, unit = "%", setting = "", note = "") => {
    if (turbo != null) add(seedPdf, benchmarkId, "seed2-1-turbo", turbo, unit, setting, note);
    if (pro != null) add(seedPdf, benchmarkId, "seed2-1-pro", pro, unit, setting, note);
  };

  // Table 1 — general-agent automatic evaluation.
  seedRow("workspace-bench", 54.7, 53.0, "%", "Total · 100-task OpenClaw setting");
  seedRow("workspace-bench-pass30", 74.0, 78.0, "%", "100-task OpenClaw setting");
  seedRow("workspace-bench-pass50", 59.0, 60.0, "%", "100-task OpenClaw setting");
  seedRow("workspace-bench-pass70", 39.0, 38.0, "%", "100-task OpenClaw setting");
  seedRow("workspace-bench-pass90", 20.0, 25.0, "%", "100-task OpenClaw setting");
  seedRow("workspace-bench-pass100", 16.0, 20.0, "%", "100-task OpenClaw setting");
  seedRow("presentbench", 48.3, 54.6, "%", "Table 1");
  seedRow("agent-startup-bench", 54.0, 68.8, "%", "Table 1");
  add(seedPdf, "agents-last-exam-pass", "seed2-1-pro", 19.5, "%", "Table 1 · Pass@1");
  add(seedPdf, "agents-last-exam-score", "seed2-1-pro", 41.4, "Score", "Table 1 · Overall Score");
  seedRow("one-million-bench-overall", 66.6, 68.8, "%", "Table 1");
  seedRow("officeqa-pro", 62.8, 70.9, "%", "Table 1 · incorporates internal implementations/adaptations");
  seedRow("gdpval", 82.7, 87.9, "%", "Table 1");
  seedRow("financeagent-v1-1", 56.0, 60.7, "%", "Table 1");
  seedRow("apex-agents", 29.2, 33.8, "%", "Table 1");

  // Table 2 plus the prose-only SkillsBench claim.
  seedRow("xdailybench", 56.4, 61.0, "%", "Pass@1");
  seedRow("doubao-multiturn", 49.0, 52.5, "%", "Pass@1");
  seedRow("mcp-atlas", 80.3, 83.8, "%", "Pass@1");
  seedRow("toolathlon", 49.1, 50.6, "%", "Pass@1");
  seedRow("seedclawbench", 63.8, 66.6, "%", "Pass@1 · OpenClaw-style tasks · Agent-as-Judge");
  add(seedPdf, "skillsbench", "seed2-1-pro", 60.4, "%", "prose-only result · version not stated");

  // Table 3 — all use Seed's unified in-house multimodal agent harness.
  const clawPass3 = benchmarks.find((item) => item.id === "claweval-mm-pass3");
  if (clawPass3) {
    clawPass3.name = "ClawEval-MM · Pass³";
    clawPass3.description = "Claw-Eval multimodal split；Pass³ 表示三次运行全部成功，不是至少一次成功的 pass@3。";
  }
  const wildClaw = benchmarks.find((item) => item.id === "wildclawbench-overall");
  if (wildClaw) {
    wildClaw.harnesses = [...new Set([...(wildClaw.harnesses || []), "Seed unified multimodal agent harness"])];
  }
  seedRow("claweval-mm-pass3", 46.0, 51.0, "%", "all three runs pass · Seed unified multimodal agent harness");
  seedRow("officeqa-pro-mm", 71.1, 72.2, "%", "Avg Score · Seed unified multimodal agent harness");
  seedRow("wildclawbench-overall", 62.8, 61.7, "%", "Avg Score · Seed unified multimodal agent harness");
  seedRow("image2floorplan", 35.9, 48.0, "%", "Avg Score · Seed unified multimodal agent harness · internal");

  // Table 4 — Generalist Computer-Use Agent.
  seedRow("osworld", 76.4, 78.8, "%", "Generalist CUA · GUI + commands/tools · table value");
  add(seedPdf, "osworld", "seed2-1-pro", 78.2, "%", "Generalist CUA · prose value", "The model card conflicts with its table value 78.8; keep both.");
  seedRow("osworld", 73.2, 72.6, "%", "GUI-only · Figure 5");
  seedRow("osworld-average-steps", 27.5, 28.2, "Steps", "GUI-only · Figure 5");
  seedRow("osworld-average-steps", 22.3, 24.2, "Steps", "Generalist CUA · GUI + commands/tools · Figure 5");
  seedRow("mobileworld", 70.0, 73.1, "%", "Generalist CUA · GUI-only · MCP test split excluded · table value");
  add(seedPdf, "mobileworld", "seed2-1-pro", 73.3, "%", "Generalist CUA · GUI-only · prose value", "The model card conflicts with its table value 73.1; keep both.");
  seedRow("creativework", 34.5, 42.5, "%", "Generalist CUA · hybrid GUI + MCP · internal");
  seedRow("gameworld", 25.9, 31.2, "%", "Generalist CUA · browser-game environment");

  // Table 5 — coding agents.
  seedRow("terminal-bench-2-1", 67.6, 71.0, "%", "Table 5");
  seedRow("swe-pro-bench", 57.0, 57.5, "%", "Table 5");
  add(seedPdfBlog, "cybergym", "seed2-1-turbo", 67.0, "%", "Table 5 / Tech Blog open-benchmark figure");
  add(seedPdf, "cybergym", "seed2-1-pro", 70.2, "%", "Model Card · Table 5");
  add(seedBlog, "cybergym", "seed2-1-pro", 68.7, "%", "Tech Blog · open-benchmark figure", "The official Tech Blog conflicts with the Model Card's 70.2; keep both.");
  seedRow("programbench-resolved", 0, 0, "%", "Table 5 · resolved");
  seedRow("programbench-almost", 0, 1, "%", "Table 5 · almost resolved · at least 95% tests pass");
  seedRow("programbench-average-pass", 49.4, 50.3, "%", "Table 5 · average pass rate");
  seedRow("nl2repo", 43.7, 47.0, "%", "Table 5");
  seedRow("swe-atlas", 30.6, 35.2, "%", "Table 5");
  seedRow("deepswe-v1-1", 23.0, 32.7, "%", "Table 5");
  seedRow("trae-web-bench", 73.6, 78.4, "%", "Trae Agent Bench · internal");
  seedRow("seedkernelbench", 8.60, 9.21, "×", "average speedup ratio");
  seedRow("trae-repo-env", 46.7, 55.0, "%", "Trae Agent Bench · internal");
  seedRow("trae-artifacts", 47.0, 51.0, "%", "Trae Agent Bench · internal");
  seedRow("trae-error-fix-python", 74.0, 70.7, "%", "Trae Agent Bench · internal");
  seedRow("trae-error-fix-js", 69.4, 74.6, "%", "Trae Agent Bench · internal");
  seedRow("trae-error-fix-java", 66.7, 66.7, "%", "Trae Agent Bench · internal");
  seedRow("trae-error-fix-go", 56.7, 63.3, "%", "Trae Agent Bench · internal");
  seedRow("trae-codegen-python", 73.3, 75.6, "%", "Trae Agent Bench · internal");
  seedRow("trae-codegen-js", 59.7, 62.4, "%", "Trae Agent Bench · internal");

  // Prose and figure results adjacent to Table 5. These are separate human
  // evaluations rather than automatic benchmark rows.
  add(seedPdf, "crowdsourced-developer-preference", "seed2-1-turbo", 56.2, "%", "Claude Code · vs GLM 5.1 · 178 comparisons", "100 wins / 19 ties / 59 losses; net win rate +23.0 percentage points.");
  add(seedPdfBlog, "crowdsourced-developer-preference", "seed2-1-pro", 59.1, "%", "Claude Code · vs Claude Opus 4.6 · 230 comparisons", "136 wins / 26 ties / 68 losses; net win rate +29.6 percentage points.");
  add(seedPdfBlog, "code-arena", "seed2-1-pro", 1539, "Elo", "Seed2.1 Pro Preview · Frontend · rank #8", "Top 10 in five of seven frontend subcategories.");

  const traeHuman = "Trae · 167 valid head-to-head tasks · vs Claude Opus 4.7";
  add(seedPdf, "trae-human-win-rate", "seed2-1-pro", 48.5, "%", traeHuman, "Preferred in 81 tasks versus 86 for Claude Opus 4.7.");
  add(seedPdf, "trae-human-mean-score", "seed2-1-pro", 3.967, "Score", traeHuman, "Claude Opus 4.7: 3.967; mean across six rating dimensions.");
  add(seedPdf, "trae-human-fully-correct", "seed2-1-pro", 29.3, "%", traeHuman, "Claude Opus 4.7: 20.4%.");
  add(seedPdf, "trae-human-acceptable-delivery", "seed2-1-pro", 94.0, "%", traeHuman, "Claude Opus 4.7: 92.2%.");
  add(seedPdf, "trae-human-severely-broken", "seed2-1-pro", 0.0, "%", traeHuman, "Claude Opus 4.7: 2.4%; lower is better.");
  add(seedPdf, "trae-human-delivery-completeness", "seed2-1-pro", 3.97, "Score", traeHuman, "Claude Opus 4.7: 3.83.");
  add(seedPdf, "trae-human-fully-usable", "seed2-1-pro", 58.7, "%", traeHuman, "Claude Opus 4.7: 54.5%.");
  add(seedPdf, "trae-human-unusable", "seed2-1-pro", 11.4, "%", traeHuman, "Claude Opus 4.7: 7.8%; lower is better.");
  add(seedPdf, "trae-human-instruction-following", "seed2-1-pro", 3.96, "Score", traeHuman, "Claude Opus 4.7: 4.11.");
  add(seedPdf, "trae-human-boundary-adherence", "seed2-1-pro", 4.16, "Score", traeHuman, "Claude Opus 4.7: 4.38.");

  // Table 6 — frontier research. The Seed table omits FrontierCS's subheaders;
  // the benchmark paper and official leaderboard define them as Score@1,
  // Avg@5, and Score@5 in this order.
  seedRow("posttrainbench", 18.3, 16.5, "%", "Table 6");
  seedRow("frontier-science-research", 33.3, 28.3, "%", "Table 6");
  seedRow("frontiercs-score-at-1", 33.5, 29.1, "Score", "Table 6 · 2026-06-23 publisher snapshot");
  seedRow("frontiercs-avg-at-5", 33.4, 28.2, "Score", "Table 6 · 2026-06-23 publisher snapshot");
  seedRow("frontiercs-score-at-5", 50.8, 46.3, "Score", "Table 6 · 2026-06-23 publisher snapshot");
  add(seedPdf, "frontiercs-score-at-1", "gpt-5-5", 41.0, "Score", "Table 6 · 2026-06-23 publisher snapshot · comparison model");
  add(seedPdf, "frontiercs-avg-at-5", "gpt-5-5", 40.0, "Score", "Table 6 · 2026-06-23 publisher snapshot · comparison model");
  add(seedPdf, "frontiercs-score-at-5", "gpt-5-5", 58.6, "Score", "Table 6 · 2026-06-23 publisher snapshot · comparison model");
  add(seedPdf, "frontiercs-score-at-1", "gemini-3-1-pro", 43.8, "Score", "Table 6 · 2026-06-23 publisher snapshot · comparison model");
  add(seedPdf, "frontiercs-avg-at-5", "gemini-3-1-pro", 44.1, "Score", "Table 6 · 2026-06-23 publisher snapshot · comparison model");
  add(seedPdf, "frontiercs-score-at-5", "gemini-3-1-pro", 64.4, "Score", "Table 6 · 2026-06-23 publisher snapshot · comparison model");
  seedRow("horizonmath", 2.0, 2.0, "%", "Table 6");

  // Table 7 — Deep Think is an inference setting, not a separate model.
  add(seedPdf, "imo-2025", "seed2-1-pro", 65.2, "%", "standard inference");
  add(seedPdf, "imo-2025", "seed2-1-pro", 81.0, "%", "Deep Think · reason → verify → revise → select");
  add(seedPdf, "imoproof-adv", "seed2-1-pro", 54.3, "%", "standard inference");
  add(seedPdf, "imoproof-adv", "seed2-1-pro", 83.8, "%", "Deep Think · reason → verify → revise → select");
  add(seedPdf, "ipho-2025", "seed2-1-pro", 79.3, "%", "standard inference");
  add(seedPdf, "ipho-2025", "seed2-1-pro", 89.0, "%", "Deep Think · reason → verify → revise → select");
  add(seedPdf, "frontier-science-research", "seed2-1-pro", 33.3, "%", "Table 7 standard baseline", "Conflicts with Table 6's 28.3; retain both source-local rows.");
  add(seedPdf, "frontier-science-research", "seed2-1-pro", 40.7, "%", "Deep Think · reason → verify → revise → select");

  // Table 9 — fundamental vision. Asterisked tool results become separate
  // observations instead of slash/parenthesis strings.
  seedRow("chartqapro", 70.9, 70.9, "%", "no tools · pass@1");
  seedRow("ocrbench-v2", 62.8, 63.2, "%", "no tools · pass@1");
  seedRow("charxiv-dq", 94.6, 95.5, "%", "no tools · pass@1");
  seedRow("charxiv-rq-without-ci", 82.5, 85.4, "%", "no tools · pass@1");
  seedRow("charxiv-rq-with-ci", 83.6, 86.4, "%", "tools · pass@1");
  seedRow("mathvista", 90.5, 90.7, "%", "no tools · pass@1");
  seedRow("mathvision-without-ci", 90.1, 92.6, "%", "no tools · pass@1");
  seedRow("mathvision-with-ci", 92.7, 94.5, "%", "tools · pass@1");
  seedRow("dynamath", 68.1, 73.1, "%", "no tools · pass@1");
  seedRow("mathverse-vision-only", 89.2, 89.7, "%", "no tools · pass@1");
  seedRow("mmmu-pro", 80.1, 81.6, "%", "no tools · pass@1");
  seedRow("mmmu-pro", 82.2, 82.7, "%", "tools · pass@1");
  seedRow("emma", 78.4, 79.3, "%", "no tools · pass@1");
  seedRow("zerobench-main", 11.0, 18.0, "%", "no tools · pass@1");
  seedRow("zerobench-main", 20.0, 22.0, "%", "tools · pass@1");
  seedRow("zerobench-sub", 49.1, 49.4, "%", "no tools · pass@1");
  seedRow("zerobench-sub", 57.2, 56.3, "%", "tools · pass@1");
  seedRow("visulogic", 52.9, 54.3, "%", "no tools · pass@1");
  seedRow("vlmsarebiased", 68.3, 83.6, "%", "no tools · pass@1");
  seedRow("visfactor", 43.9, 51.4, "%", "no tools · pass@1");
  seedRow("realworldqa", 86.3, 86.7, "%", "no tools · pass@1");
  seedRow("babyvision", 62.9, 73.7, "%", "no tools · pass@1");
  seedRow("measurebench", 58.9, 62.9, "%", "no tools · pass@1");
  seedRow("simplevqa", 71.1, 74.5, "%", "no tools · pass@1");
  seedRow("worldvqa", 48.6, 53.0, "%", "no tools · pass@1");
  seedRow("worldbench", 63.7, 67.6, "%", "no tools · pass@1");
  seedRow("blink", 79.4, 81.4, "%", "no tools · pass@1");
  seedRow("mmsibench-circular", 31.4, 35.9, "%", "no tools · pass@1");
  seedRow("treebench", 71.1, 71.1, "%", "no tools · pass@1");
  seedRow("erqa", 71.3, 72.0, "%", "no tools · pass@1");
  seedRow("embspatialbench", 82.5, 83.4, "%", "no tools · pass@1");
  seedRow("dude", 83.1, 82.8, "%", "no tools · pass@1");
  seedRow("mmlongbench", 76.9, 78.3, "%", "128K · pass@1");

  // Table 10 — video understanding.
  seedRow("videosimpleqa", 71.4, 76.4, "%", "Table 10");
  add(seedPdf, "videosimpleqa", "seed2-1-pro", 75.5, "%", "prose value", "The model card prose conflicts with its table value 76.4; keep both.");
  seedRow("videoholmes", 67.6, 68.2, "%", "Table 10");
  seedRow("minerva-video", 65.9, 70.7, "%", "Table 10");
  seedRow("tvbench", 77.2, 80.5, "%", "Table 10");
  seedRow("tomato", 56.8, 79.5, "%", "Table 10");
  seedRow("motionbench", 74.8, 74.9, "%", "Table 10");
  seedRow("contphy", 61.1, 63.6, "%", "Table 10");
  seedRow("videomme", 89.0, 89.2, "%", "Table 10");
  seedRow("lvbench", 76.8, 78.0, "%", "Table 10");
  seedRow("longvideobench", 80.6, 80.6, "%", "Table 10");
  seedRow("crossvid", 63.2, 65.0, "%", "Table 10");
  seedRow("livesports-3k", 77.1, 76.8, "%", "Table 10");
  seedRow("ovobench", 79.2, 80.7, "%", "Table 10");
  seedRow("ovbench", 69.7, 70.0, "%", "Table 10");

  // Table 11 — language, reasoning, multilingual and search.
  seedRow("supergpqa", 67.4, 70.8, "%", "Table 11");
  seedRow("kina", 46.6, 48.3, "%", "Table 11");
  seedRow("hle-verified", 42.4, 42.9, "%", "no tools · Table 11");
  seedRow("superchem", 56.6, 59.8, "%", "Table 11");
  seedRow("arc-agi-2", 61.3, 62.5, "%", "Table 11");
  seedRow("scicode", 57.8, 59.8, "%", "Table 11");
  seedRow("frontier-science-olympiad", 76.0, 75.0, "%", "Table 11");
  seedRow("frontier-science-research", 23.3, 28.3, "%", "Table 11", "Turbo 23.3 conflicts with Table 6's 33.3; retain both.");
  seedRow("live-mathematician-bench", 27.7, 20.9, "%", "Table 11");
  seedRow("matharena-apex", 35.4, 31.3, "%", "Table 11");
  seedRow("aethercode", 67.9, 65.8, "%", "Table 11");
  seedRow("beyondaime", 88.0, 87.0, "%", "Table 11");
  seedRow("msqa", 42.0, 50.2, "%", "Table 11");
  seedRow("hle-tools", 54.6, 55.7, "%", "text-only · search");
  seedRow("browsecomp", 84.9, 86.2, "%", "with search");

  const targetComplete = (sourceId, targetModels, note) => upsertAudit(sourceId, {
    status: "target-complete",
    scopeLabel: "目标模型列已核",
    auditedAt: "2026-09-20",
    targetModels,
    note
  });

  targetComplete("deepmind-gemini38", [{ modelId: "gemini-3-8-flash", expectedObservationCount: 14 }], "Gemini 3.8 Flash 自身公开能力列已完整；同表对照模型仍在逐格补录。");
  targetComplete("deepmind-gemini37", [{ modelId: "gemini-3-7-flash", expectedObservationCount: 20 }], "Gemini 3.7 Flash 自身 20 条公开设置已完整；对照模型列尚未全录。");
  targetComplete("deepmind-gemini31", [{ modelId: "gemini-3-1-pro", expectedObservationCount: 19 }], "Gemini 3.1 Pro 自身 19 条公开设置已完整；对照模型列尚未全录。");
  targetComplete("deepseek-v41", [
    { modelId: "deepseek-v4-1-flash", expectedObservationCount: 35 },
    { modelId: "deepseek-v4-1-flash-base", expectedObservationCount: 20 }
  ], "V4.1 Flash 指令模型与独立 Base 模型目标列已完整；对照列尚未全录。");
  targetComplete("deepseek-v41-report", [
    { modelId: "deepseek-v4-1-flash", expectedObservationCount: 23 },
    { modelId: "deepseek-v4-1-flash-base", expectedObservationCount: 20 }
  ], "技术报告中 V4.1 Flash 与 Base 的公开目标列已完整；对照列尚未全录。");
  targetComplete("deepseek-v4-vision-exp", [{ modelId: "deepseek-v4-vision-exp", expectedObservationCount: 9 }], "Vision Exp 模型卡目标列已完整；对照列尚未全录。");
  targetComplete("deepseek-v4-pro-0813", [{ modelId: "deepseek-v4-pro", expectedObservationCount: 6 }], "V4 Pro 0813 模型卡目标列已完整；对照列尚未全录。");
  targetComplete("deepseek-v4-flash-0731", [{ modelId: "deepseek-v4-flash-0731", expectedObservationCount: 7 }], "V4 Flash 0731 模型卡目标列已完整；对照列尚未全录。");
  targetComplete("zai-glm53", [{ modelId: "glm-5-3", expectedObservationCount: 17 }], "GLM-5.3 发布表目标列已完整，ExploitGym 两个时限已拆分；对照列尚未全录。");
  targetComplete("zai-glm53-flash", [{ modelId: "glm-5-3-flash", expectedObservationCount: 17 }], "GLM-5.3 Flash 发布表目标列已完整；对照列尚未全录。");
  targetComplete("hy4", [{ modelId: "hy4-preview", expectedObservationCount: 46 }], "Hy4 官方模型卡附录中的公开与内部目标指标已完整；对照列尚未全录。");
  upsertAudit("seed21", {
    status: "metadata-only",
    auditedAt: "2026-09-20",
    note: "Seed2.1 产品发布页；成绩依其独立 73 页 Model Card 与官方 Tech Blog 分别引用。"
  });
  targetComplete("seed21-pdf", [
    { modelId: "seed2-1-turbo", expectedObservationCount: 117 },
    { modelId: "seed2-1-pro", expectedObservationCount: 142 }
  ], "73 页 PDF 中 10 张量化表、正文和数值图的 Turbo/Pro 目标成绩已核对；Table 8 是定性案例矩阵。FrontierCS 三项依原始论文/官方榜单正确标为 Score@1、Avg@5、Score@5；OSWorld 效率、Code Arena、匿名开发者众测与 Trae 人评数据已补录；正文/表格与官方博客冲突值均保留。对照模型列尚未全录。");
  targetComplete("kimi-k3", [{ modelId: "kimi-k3", expectedObservationCount: 52 }], "Kimi K3 官方博客目标列已完整；对照列尚未全录。");
  targetComplete("kimi-k3-hf", [{ modelId: "kimi-k3", expectedObservationCount: 52 }], "Kimi K3 官方模型卡目标列已完整；对照列尚未全录。");
  targetComplete("kimi-k3-report", [{ modelId: "kimi-k3", expectedObservationCount: 67 }], "Kimi K3 技术报告的目标模型公开能力列已完整；对照列尚未全录。");
  targetComplete("kimi-k25", [{ modelId: "kimi-k2-5", expectedObservationCount: 47 }], "Kimi K2.5 官方博客目标列已完整；对照列尚未全录。");
  targetComplete("kimi-k25-hf", [{ modelId: "kimi-k2-5", expectedObservationCount: 47 }], "Kimi K2.5 官方模型卡目标列已完整；对照列尚未全录。");
  targetComplete("kimi-k25-paper", [{ modelId: "kimi-k2-5", expectedObservationCount: 47 }], "Kimi K2.5 技术报告的目标模型公开能力列已完整；对照列尚未全录。");

  // Re-number after removals/additions so IDs remain unique and sequential.
  observations.forEach((observation, index) => {
    observation.id = "o" + (index + 1);
  });
})();
