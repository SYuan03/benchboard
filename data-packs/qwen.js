(() => {
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = window.BENCH_DATA;
  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((existing) => existing.id === row.id)) target.push(row);
  });
  const patchModel = (id, values) => {
    const model = models.find((item) => item.id === id);
    if (model) Object.assign(model, values);
  };
  const patchBenchmark = (id, values) => {
    const benchmark = benchmarks.find((item) => item.id === id);
    if (benchmark) Object.assign(benchmark, values);
  };
  const setAudit = (sourceId, values) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    if (audit) Object.assign(audit, values);
    else sourceAudits.push({ sourceId, ...values });
  };
  const add = (sourceIds, benchmarkId, modelId, value, unit, setting, note = "") => {
    observations.push({ id: `o${observations.length + 1}`, sourceIds, benchmarkId, modelId, value, unit, setting, note });
  };

  appendUnique(sources, [
    { id: "qwen38-omni-model-info", vendorId: "alibaba", publisher: "Alibaba Cloud Model Studio", date: "2026-09-18", tier: "official", title: "Qwen3.8-Omni-Flash — Official Model Info", url: "https://www.alibabacloud.com/help/en/model-studio/qwen3-8-omni-flash" },
    { id: "qwen38-omni-qwencloud", vendorId: "alibaba", publisher: "QwenCloud", date: "2026-09-18", tier: "official", title: "Qwen3.8-Omni-Flash — QwenCloud Model Page", url: "https://www.qwencloud.com/models/qwen3.8-omni-flash" },
    { id: "qwen38-omni-x", vendorId: "alibaba", publisher: "Qwen", date: "2026-09-18", tier: "official", title: "Qwen3.8-Omni-Flash — Official Launch Post", url: "https://x.com/Alibaba_Qwen/status/2100785962414702599" },
    { id: "qwen38-flash-next", vendorId: "alibaba", publisher: "Qwen", date: "2026-08-26", tier: "official", title: "Qwen3.8-Flash-Next: A New Architecture, Towards Ultimate Cost-Efficiency", url: "https://qwen.ai/blog?id=qwen3.8-flash-next" },
    { id: "qwen38-flash-next-hf", vendorId: "alibaba", publisher: "Qwen", date: "2026-08-26", tier: "official", title: "Qwen3.8-Flash-Next — Official Model Card", url: "https://huggingface.co/Qwen/Qwen3.8-Flash-Next" },
    { id: "qwen38-flash-next-report", vendorId: "alibaba", publisher: "Qwen", date: "2026-08-26", tier: "official", title: "Qwen3.8-Flash-Next Technical Report", url: "https://github.com/QwenLM/Qwen3.8-Flash-Next/blob/main/tech_report.pdf" },
    { id: "qwen38-27b-hf", vendorId: "alibaba", publisher: "Qwen", date: "2026-08-17", tier: "official", title: "Qwen3.8-27B — Official Model Card", url: "https://huggingface.co/Qwen/Qwen3.8-27B" },
    { id: "qwen35", vendorId: "alibaba", publisher: "Qwen", date: "2026-02-16", tier: "official", title: "Qwen3.5: Towards Native Multimodal Agents", url: "https://qwen.ai/blog?id=qwen3.5" },
    { id: "qwen35-hf", vendorId: "alibaba", publisher: "Qwen", date: "2026-02-16", tier: "official", title: "Qwen3.5-397B-A17B — Official Model Card", url: "https://huggingface.co/Qwen/Qwen3.5-397B-A17B" },
    { id: "qwen35-omni", vendorId: "alibaba", publisher: "Qwen", date: "2026-03-30", tier: "official", title: "Qwen3.5-Omni: Scaling Up, Toward Native Omni-Modal AGI", url: "https://qwen.ai/blog?id=qwen3.5-omni" },
    { id: "qwen35-omni-report", vendorId: "alibaba", publisher: "Qwen Team", date: "2026-04-21", tier: "official", title: "Qwen3.5-Omni Technical Report (v2)", url: "https://arxiv.org/abs/2604.15804v2" },
    { id: "qwen35-github", vendorId: "alibaba", publisher: "Qwen", date: "2026-02-16", tier: "official", title: "Qwen3.5 — Official GitHub Repository", url: "https://github.com/QwenLM/Qwen3.5" }
  ]);

  const qwen38Source = sources.find((source) => source.id === "qwen38");
  if (qwen38Source) Object.assign(qwen38Source, { publisher: "Qwen", url: "https://qwen.ai/blog?id=qwen3.8" });
  const qwen37Source = sources.find((source) => source.id === "qwen37");
  if (qwen37Source) Object.assign(qwen37Source, { publisher: "Qwen", url: "https://qwen.ai/blog?id=qwen3.7" });
  const qwen37PlusSource = sources.find((source) => source.id === "qwen37-plus");
  if (qwen37PlusSource) Object.assign(qwen37PlusSource, { publisher: "Qwen", url: "https://qwen.ai/blog?id=qwen3.7-plus" });

  // Correct the exact 397B model identity everywhere, including benchmark-owned rows.
  for (const observation of observations) {
    if (observation.modelId === "qwen3-5-397b") observation.modelId = "qwen3-5-397b-a17b";
  }
  const old397b = models.find((model) => model.id === "qwen3-5-397b");
  if (old397b) old397b.id = "qwen3-5-397b-a17b";

  patchModel("qwen3-8-max", {
    sourceId: "qwen38", referenceSourceIds: ["qwen38-hf", "alibaba-lifecycle"],
    modality: "vision", modalityDetail: "文本、图像、视频 → 文本；服务版支持内置工具与可调 reasoning_effort",
    context: "1M", access: "闭源 API（基于开放权重底座）"
  });
  patchModel("qwen3-8-2-4t-a95b", {
    referenceSourceIds: ["alibaba-lifecycle"], modality: "language",
    modalityDetail: "文本 → 文本；仅思考模式，不支持图像、音频或视频输入",
    context: "262,144 原生 / 可扩展至 1,010,000", access: "开放权重"
  });
  patchModel("qwen3-7-max", {
    modality: "language", modalityDetail: "2026-05-21 首发版本：文本 → 文本；官方 OpenClaw 配置声明 input=[text]",
    context: "1M", referenceSourceIds: ["alibaba-lifecycle"]
  });
  patchModel("qwen3-7-plus", {
    modality: "vision", modalityDetail: "文本、图像、视频、GUI → 文本与工具调用",
    context: "1M", referenceSourceIds: ["alibaba-lifecycle"]
  });
  patchModel("qwen3-8-flash", {
    releaseDate: "2026-08-26", modality: "vision", modalityDetail: "文本、图像、视频 → 文本；托管 API 名，基于 Flash-Next",
    context: "1M", referenceSourceIds: ["qwen38-flash-next", "qwen38-flash-next-hf"],
    summary: "托管 qwen3.8-flash API 名；官方材料未明确宣告它与开放权重 Qwen3.8-Flash-Next 是同一 checkpoint，因此暂按独立部署实体保存。"
  });
  patchModel("qwen3-8-omni-flash", {
    modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本；Realtime 变体还可输出音频",
    context: "1M", referenceSourceIds: ["qwen38-omni-model-info", "qwen38-omni-qwencloud", "qwen38-omni-x", "alibaba-lifecycle"]
  });
  patchModel("qwen3-8-27b", {
    releaseDate: "2026-08-17", sourceId: "qwen38-27b-hf", referenceSourceIds: ["alibaba-lifecycle"],
    modality: "vision", modalityDetail: "文本、图像、视频 → 文本；原生视觉语言 Dense 模型",
    context: "262,144 原生 / 可扩展至 1,000,000", access: "开放权重 / API"
  });
  patchModel("qwen3-5-omni-plus", {
    releaseDate: "2026-03-30", sourceId: "qwen35-omni", modality: "omni",
    modalityDetail: "文本、图像、音频、视频 → 文本与音频", context: "256K", access: "闭源 API",
    referenceSourceIds: ["qwen35-omni-report"]
  });
  patchModel("qwen3-5-397b-a17b", {
    name: "Qwen3.5-397B-A17B", releaseDate: "2026-02-16", sourceId: "qwen35", referenceSourceIds: ["qwen35-hf", "qwen35-github"],
    modality: "vision", modalityDetail: "文本、图像、视频 → 文本；原生视觉语言 MoE",
    context: "262,144 原生 / 可扩展至 1,010,000", access: "开放权重 / API",
    aliases: ["Qwen3.5-397B-A17B", "Qwen3.5-397B", "qwen3.5-397b"],
    summary: "397B 总参数、17B 激活的原生视觉语言模型；第三方榜单中的 Qwen3.5-397B 标签归并为此精确型号。"
  });

  appendUnique(models, [
    { id: "qwen3-7-max-0608", name: "Qwen3.7 Max 0608", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-06-08", modality: "vision", modalityDetail: "文本、图像 → 文本；与 5 月纯文本首发版本分开登记", context: "1M", access: "API 快照", aliases: ["qwen3.7-max-2026-06-08"], sourceId: "alibaba-lifecycle", scoreStatus: "metadata-only", summary: "2026-06-08 增加视觉输入的日期快照；当前未发现独立成绩表。" },
    { id: "qwen3-8-flash-next", name: "Qwen3.8-Flash-Next", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-26", modality: "vision", modalityDetail: "文本、图像、视频 → 文本", context: "262,144 原生 / 可扩展至 1M", access: "开放权重", aliases: ["Qwen/Qwen3.8-Flash-Next"], sourceId: "qwen38-flash-next", referenceSourceIds: ["qwen38-flash-next-hf", "qwen38-flash-next-report"], summary: "125B 总参数、6B 激活的原生视觉语言 MoE；官方材料未明确宣告它与托管 qwen3.8-flash API 名是同一 checkpoint，因此暂分开保存。" },
    { id: "qwen3-8-flash-next-base", name: "Qwen3.8-Flash-Next-Base", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-26", modality: "vision", modalityDetail: "文本、图像、视频 → 文本；Base checkpoint", context: "262,144 原生 / 可扩展至 1M", access: "开放权重", aliases: ["Qwen/Qwen3.8-Flash-Next-Base"], sourceId: "qwen38-flash-next", referenceSourceIds: ["qwen38-flash-next-hf", "qwen38-flash-next-report"], scoreStatus: "base-model", summary: "Flash-Next 的预训练 Base checkpoint；成绩不与后训练模型混合。" },
    { id: "qwen3-8-27b-base", name: "Qwen3.8-27B-Base", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-17", modality: "vision", modalityDetail: "文本、图像、视频 → 文本；Base checkpoint", context: "262,144 原生 / 可扩展至 1M", access: "开放权重", aliases: ["Qwen3.8-27B-Base"], sourceId: "qwen38-flash-next", referenceSourceIds: ["qwen38-flash-next-hf", "qwen38-flash-next-report"], scoreStatus: "base-model", summary: "Qwen3.8-27B 的 Base checkpoint；仅承接 Base 模型评测表。" },
    { id: "qwen3-7-plus-base", name: "Qwen3.7-Plus-Base", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像、视频 → 文本；Base checkpoint", context: "1M", access: "未公开独立权重", aliases: ["Qwen3.7-Plus-Base"], sourceId: "qwen38-flash-next", referenceSourceIds: ["qwen38-flash-next-hf", "qwen38-flash-next-report"], scoreStatus: "base-model", summary: "Flash-Next 发布表中的 Base 对照检查点。" },
    { id: "qwen3-5-397b-a17b-base", name: "Qwen3.5-397B-A17B-Base", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-02-16", modality: "vision", modalityDetail: "文本、图像、视频 → 文本；Base checkpoint", context: "262,144 原生 / 可扩展至 1,010,000", access: "开放权重", aliases: ["Qwen3.5-397B-A17B-Base"], sourceId: "qwen35", referenceSourceIds: ["qwen35-hf"], scoreStatus: "base-model", summary: "Qwen3.5-397B-A17B 的 Base checkpoint；与后训练模型成绩分开。" },
    { id: "qwen3-5-omni-flash", name: "Qwen3.5-Omni-Flash", vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-03-30", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本与音频", context: "256K", access: "闭源 API", aliases: ["qwen3.5-omni-flash"], sourceId: "qwen35-omni", referenceSourceIds: ["qwen35-omni-report"], summary: "Qwen3.5-Omni 的低延迟全模态版本；官方发布表提供音频、视觉与文本结果。" }
  ]);

  appendUnique(benchmarks, [
  {
    "id": "mmmu-pro",
    "name": "MMMU-Pro",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mathvision-without-ci",
    "name": "MathVision",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mathvision-with-ci",
    "name": "MathVision",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "babyvision-without-ci",
    "name": "BabyVision · Without CI",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "babyvision-with-ci",
    "name": "BabyVision · With CI",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "hle-vl-tools",
    "name": "HLE-VL (w/ Tools)",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "zerobench-pass5-without-ci",
    "name": "ZeroBench Pass@5 · Without CI",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "zerobench-pass5-with-ci",
    "name": "ZeroBench Pass@5 · With CI",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "zerobench-sub",
    "name": "ZEROBench_sub",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "logicvista",
    "name": "LogicVista",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "hipho",
    "name": "HiPhO",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "phyx",
    "name": "PhyX",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "slake",
    "name": "SLAKE",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "medxpertqa-mm",
    "name": "MedXpertQA-MM",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "pmc-vqa",
    "name": "PMC-VQA",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "osworld-verified",
    "name": "OSWorld-Verified",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "osworld-2-binary",
    "name": "OSWorld 2.0 · Binary",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "osworld-2-partial",
    "name": "OSWorld 2.0 · Partial",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "screenspot-pro",
    "name": "ScreenSpot Pro",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "webarena-verified",
    "name": "WebArena-Verified",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "androidworld",
    "name": "AndroidWorld",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mobileworld",
    "name": "MobileWorld",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "claweval-mm-passat3",
    "name": "ClawEval-MM · Pass@3",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表的 Pass@3：三次独立运行中至少一次成功；不与三次全成功的 Pass³ 混排。"
  },
  {
    "id": "claweval-mm-average",
    "name": "ClawEval-MM · Average",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "vision2web",
    "name": "Vision2Web",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "qwen-blender-bench",
    "name": "QwenBlenderBench",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "parametric-cad-bench",
    "name": "Parametric CAD Bench",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "recreationbench",
    "name": "RecreationBench",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "presentbench",
    "name": "PresentBench",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "charxiv-rq-without-ci",
    "name": "CharXiv (RQ) · Without CI",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "charxiv-rq-with-ci",
    "name": "CharXiv (RQ) · With CI",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "omnidocbench-1-5-score",
    "name": "OmniDocBench 1.5 · Score",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "ocr-bench-v2-en",
    "name": "OCR-Bench-V2 · English",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "ocr-bench-v2-zh",
    "name": "OCR-Bench-V2 · Chinese",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "cc-ocr-bench-v2",
    "name": "CC-OCR-Bench-V2",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mtvqa-test",
    "name": "MTVQA-Test",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "madqa",
    "name": "MADQA",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "qwen-visual-office",
    "name": "QwenVisualOffice",
    "category": "计算机操作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "realworldqa",
    "name": "RealWorldQA",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "erqa",
    "name": "ERQA",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "lingoqa",
    "name": "LingoQA",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "surds",
    "name": "SURDS",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "simplevqa",
    "name": "SimpleVQA",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "worldvqa",
    "name": "WorldVQA",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmstar",
    "name": "MMStar",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "perceptionbench",
    "name": "PerceptionBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "countqa",
    "name": "CountQA",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "refadv-s",
    "name": "RefAdv-S",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "dense200",
    "name": "Dense200",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "coco",
    "name": "COCO",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "visfactor",
    "name": "VisFactor",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "vlms-are-biased",
    "name": "VLMsAreBiased",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "videomme",
    "name": "VideoMME(w/o sub.)",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "video-mme-v2",
    "name": "VideoMME v2 (w/ Sub.)",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "videommmu",
    "name": "VideoMMMU",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmvu",
    "name": "MMVU",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mlvu-m-avg",
    "name": "MLVU(M-Avg)",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "tvbench",
    "name": "TVBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "lvbench",
    "name": "LVBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "egolife",
    "name": "EgoLife (w/ Mem.)",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "videodr-search",
    "name": "VideoDR (w/ Search)",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "terminal-bench-2-0",
    "name": "Terminal Bench 2.0-Terminus",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "swe-bench-verified",
    "name": "SWE-bench Verified",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "swe-bench-pro",
    "name": "SWE-bench Pro",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "swe-multilingual",
    "name": "SWE-bench Multilingual",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "nl2repo",
    "name": "NL2Repo-Bench",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "scicode",
    "name": "SciCode",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "qwen-webdev",
    "name": "QwenWebDev",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "qwen-svg-bench",
    "name": "QwenSVG",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "qwenclawbench",
    "name": "Qwenclaw",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "coworkbench",
    "name": "CoWorkBench",
    "category": "专业工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "claweval",
    "name": "ClawEval",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "skillsbench-1-1",
    "name": "Skillsbench",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "bfcl-v4",
    "name": "BFCL-V4",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mcp-mark",
    "name": "MCPMark · Version Unspecified",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "MCPMark 原始或未注明 Verified 版本的结果；具体 harness、工具和版本见每条成绩。"
  },
  {
    "id": "mcp-atlas",
    "name": "MCP-Atlas",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "vita-bench",
    "name": "VITA-Bench",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "spreadsheetbench-v1",
    "name": "SpreadSheetBench-v1",
    "category": "专业工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "kernel-bench-l3-speedup",
    "name": "Kernel Bench L3 · Median Speedup",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "kernel-bench-l3-win-rate",
    "name": "Kernel Bench L3 · Win Rate",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "hle-tools",
    "name": "HLE w/ tool",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "qwen-world-bench",
    "name": "QwenWorldBench",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "gpqa-diamond",
    "name": "GPQA Diamond",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "hle",
    "name": "HLE",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "livecodebench",
    "name": "LiveCodeBench",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "hmmt-2026-02",
    "name": "HMMT 2026 Feb",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "imoanswerbench",
    "name": "IMOAnswerBench",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "critpt",
    "name": "CritPT",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "apex",
    "name": "Apex",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmlu-pro",
    "name": "MMLU-Pro",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmlu-redux",
    "name": "MMLU-Redux",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "supergpqa",
    "name": "SuperGPQA",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "ifeval",
    "name": "IFEval",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "ifbench",
    "name": "IFBench",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mrcr-v2-8needle",
    "name": "MRCR v2 · 8-needle",
    "category": "长上下文",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "wmt24pp",
    "name": "WMT24++",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "maxife",
    "name": "MAXIFE",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmmlu",
    "name": "MMMLU",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmlu-prox",
    "name": "MMLU-ProX",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "nova-63",
    "name": "NOVA-63",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "include",
    "name": "INCLUDE",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "global-piqa",
    "name": "Global PIQA",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "polymath",
    "name": "PolyMATH",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "deep-planning",
    "name": "DeepPlanning",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mathvision",
    "name": "MathVision",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "qwen-vision2code",
    "name": "QwenVision2Code",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "claweval-mm",
    "name": "ClawEval-MM",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmsearchplus",
    "name": "MMSearchPlus",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "bc-vl",
    "name": "BC-VL",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmbc",
    "name": "MMBC",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "odinw13",
    "name": "ODInW13",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "ego3d-bench",
    "name": "Ego3D-Bench",
    "category": "知识 / 推理",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "vladbench",
    "name": "VLADBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "deepswe-v1-1",
    "name": "DeepSWE 1.1",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "jobbench",
    "name": "JobBench",
    "category": "专业工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "agents-last-exam-pass",
    "name": "Agents' Last Exam · Pass@1",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "agents-last-exam-score",
    "name": "Agents' Last Exam · Overall Score",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "toolathlon",
    "name": "Toolathlon Verified (Pass@1)",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "livecodebench-v6",
    "name": "LiveCodeBench v6",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmlu",
    "name": "MMLU",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "bbh",
    "name": "BBH",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "gpqa",
    "name": "GPQA",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "gsm8k",
    "name": "GSM8K",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "math",
    "name": "MATH",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "evalplus",
    "name": "Evalplus",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "multiple",
    "name": "MultiPL-E",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "swebench-pretrain",
    "name": "SWEBench-Pretrain",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mgsm",
    "name": "MGSM",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "terminal-bench-2-1",
    "name": "Terminal Bench 2.1 (Terminus)",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "qwen-swe-bench",
    "name": "QwenSWEBench",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "swe-multimodal",
    "name": "SWE-MM",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "c-eval",
    "name": "C-Eval",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "multichallenge",
    "name": "MultiChallenge",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "aa-lcr",
    "name": "AA-LCR",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "longbench-v2",
    "name": "LongBench v2",
    "category": "长上下文",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "hle-verified",
    "name": "HLE-Verified¹",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "hmmt-2025-02",
    "name": "HMMT Feb 25",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "hmmt-2025-11",
    "name": "HMMT Nov 25",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "aime-2026",
    "name": "AIME26",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "tau2-bench",
    "name": "TAU2Bench",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "tool-decathlon",
    "name": "Tool Decathlon",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "browsecomp",
    "name": "BrowseComp",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "browsecomp-zh",
    "name": "BrowseComp-zh",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "wide-search",
    "name": "WideSearch",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "seal-0",
    "name": "Seal-0",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "seccodebench",
    "name": "SecCodeBench",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "terminal-bench-2",
    "name": "Terminal-Bench 2 · Version Unspecified",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmmu",
    "name": "MMMU",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mathvista-mini",
    "name": "Mathvista (mini)",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "we-math",
    "name": "We-Math",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "dynamath",
    "name": "DynaMath",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "zerobench",
    "name": "ZEROBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "hallusionbench",
    "name": "HallusionBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmbench-en-dev-v1-1",
    "name": "MMBenchEN-DEV-v1.1",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "charxiv",
    "name": "CharXiv (RQ)",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmlongbench-doc",
    "name": "MMLongBench-Doc",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "cc-ocr",
    "name": "CC-OCR",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "ai2d-test",
    "name": "AI2D_TEST",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "ocrbench",
    "name": "OCRBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "countbench",
    "name": "CountBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "refcoco-avg",
    "name": "RefCOCO(avg)",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "embspatialbench",
    "name": "EmbSpatialBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "refspatialbench",
    "name": "RefSpatialBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "vstar-with-ci",
    "name": "V* · With CI",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "vstar-without-ci",
    "name": "V* · Without CI",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "hypersim",
    "name": "Hypersim",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "sunrgbd",
    "name": "SUNRGBD",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "nuscenes",
    "name": "nuScenes",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mvbench",
    "name": "MVBench",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "nova",
    "name": "Nova",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "korbench",
    "name": "KoRBench",
    "category": "知识 / 推理",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "swe-agentless",
    "name": "SWE-agentless",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "crux-i",
    "name": "CRUX-I",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "crux-o",
    "name": "CRUX-O",
    "category": "编码",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "dailyomni",
    "name": "DailyOmni",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "worldsense",
    "name": "WorldSense",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "avut",
    "name": "AVUT",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "av-speakerbench",
    "name": "AV-SpeakerBench",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "videomme-audio",
    "name": "VideoMME · With Audio",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "qualcomm-interactive",
    "name": "QualcommInteractive",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "omnicloze",
    "name": "Omni-Cloze",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "omnigaia",
    "name": "OmniGAIA",
    "category": "Agent / 工作",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmau",
    "name": "MMAU",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmar",
    "name": "MMAR",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mmsu",
    "name": "MMSU",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "muchomusic-rul",
    "name": "RUL-MuchoMusic",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "songform-harmonix-accuracy",
    "name": "SongFormBench HarmonixSet · Accuracy",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "songform-harmonix-hr-5f",
    "name": "SongFormBench HarmonixSet · HR@0.5F",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "songform-harmonix-hr-3f",
    "name": "SongFormBench HarmonixSet · HR@3F",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "songform-cn-accuracy",
    "name": "SongFormBench-CN · Accuracy",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "songform-cn-hr-5f",
    "name": "SongFormBench-CN · HR@0.5F",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "songform-cn-hr-3f",
    "name": "SongFormBench-CN · HR@3F",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "voicebench",
    "name": "VoiceBench",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "uro-bench-pro-understanding",
    "name": "URO-Bench-Pro · Understanding",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "uro-bench-pro-reasoning",
    "name": "URO-Bench-Pro · Reasoning",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "uro-bench-pro-oral",
    "name": "URO-Bench-Pro · Oral Conversation",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "speechrole",
    "name": "SpeechRole",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "wildspeech",
    "name": "WildSpeech-Bench",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "fleurs-s2tt-zh",
    "name": "FLEURS Top-59 · xx↔zh S2TT",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "fleurs-s2tt-en",
    "name": "FLEURS Top-59 · xx↔en S2TT",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "fleurs-s2tt-zh-en",
    "name": "FLEURS Top-59 · xx↔zh/en S2TT",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "fleurs-asr-wer",
    "name": "Fleurs(top60)",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "cv15-zh-wer",
    "name": "Common Voice 15 · Mandarin WER/CER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "cv15-yue-wer",
    "name": "Common Voice 15 · Cantonese WER/CER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "cv15-zh-tw-wer",
    "name": "Common Voice 15 · Traditional Chinese WER/CER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "cv15-en-wer",
    "name": "Common Voice 15 · English WER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "librispeech-clean-wer",
    "name": "LibriSpeech · Clean WER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "librispeech-other-wer",
    "name": "LibriSpeech · Other WER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "wenetspeech-net-wer",
    "name": "Wenetspeech(net|meeting)",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "wenetspeech-meeting-wer",
    "name": "Wenetspeech(net|meeting)",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "kespeech-wer",
    "name": "KeSpeech · WER/CER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mir1k-wer",
    "name": "MIR-1K Vocal-only · WER/CER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "opencpop-wer",
    "name": "Opencpop · WER/CER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "mme-videoocr",
    "name": "MME-VideoOCR",
    "category": "多模态",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "tts-custom-seed-zh-wer",
    "name": "Custom Voice Stability · Seed-zh WER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "tts-custom-seed-en-wer",
    "name": "Custom Voice Stability · Seed-en WER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "tts-custom-seed-hard-wer",
    "name": "Custom Voice Stability · Seed-hard WER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "tts-custom-public-wer",
    "name": "Custom Voice Stability · Public Multilingual WER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "tts-custom-inhouse-wer",
    "name": "Custom Voice Stability · In-house Multilingual WER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "voice-clone-public-wer",
    "name": "Voice Clone Stability · Public Multilingual WER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "voice-clone-inhouse-wer",
    "name": "Voice Clone Stability · In-house Multilingual WER",
    "category": "音频",
    "direction": "lower",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "voice-clone-public-sim",
    "name": "Voice Clone Similarity · Public Multilingual",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "voice-clone-inhouse-sim",
    "name": "Voice Clone Similarity · In-house Multilingual",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen 第一方发布表公开指标；具体 harness、工具、版本和评测设置见每条成绩。"
  },
  {
    "id": "omnivideobench-tokens-per-query",
    "name": "OmniVideoBench · Tokens per query",
    "category": "多模态",
    "direction": "lower",
    "description": "Qwen3.8-Omni-Flash 官方发布页的 OmniVideoBench 推理效率指标；与准确率分开展示，数值越低越好。"
  },
  {
    "id": "omnivideobench-token-reduction",
    "name": "OmniVideoBench · Token reduction",
    "category": "多模态",
    "direction": "higher",
    "description": "Static 到 Qwen Code Agentic Understanding 的 token 降幅。官方博客与官方 X 帖数值冲突，两条来源均保留。"
  },
  {
    "id": "alimeeting-summary-score",
    "name": "AliMeeting Test · Summary score",
    "category": "音频",
    "direction": "higher",
    "description": "Qwen3.8-Omni-Flash 发布页官方总览图报告的 AliMeeting-test 单值指标；图中脚注公式为 100 × [1 − (0.5 × DER + 0.5 × cpWER)]。"
  }
]);
  patchBenchmark("swe-multimodal", { collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["Claude Code"], inputModalities: ["文本", "图像"] });
  patchBenchmark("vision2web", { collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["Claude Code"], inputModalities: ["文本", "图像"] });
  patchBenchmark("claweval-mm", {
    category: "Agent / 工作",
    description: "ClawEval 多模态子榜；Qwen3.7 Plus 发布表未说明 Pass@3 或 Average 口径，因此保留为 Setting Unspecified。",
    collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark",
    harnesses: ["Claw-Eval"], inputModalities: ["图片", "视频", "文档", "网页"]
  });
  patchBenchmark("mathvista-mini", { category: "多模态" });
  patchBenchmark("vstar-without-ci", { category: "多模态" });
  patchBenchmark("vstar-with-ci", { category: "多模态" });

  const appendFamily = (family) => {
    const current = benchmarkFamilies.find((item) => item.id === family.id);
    if (!current) benchmarkFamilies.push(family);
    else for (const variant of family.variants) {
      if (!current.variants.some((item) => item.benchmarkId === variant.benchmarkId)) current.variants.push(variant);
    }
  };
  appendFamily({ id: "babyvision-family", name: "BabyVision", variants: [
    { benchmarkId: "babyvision", label: "Setting Unspecified" },
    { benchmarkId: "babyvision-without-ci", label: "Without CI" },
    { benchmarkId: "babyvision-with-ci", label: "With CI" }
  ] });
  appendFamily({ id: "kernel-bench-l3", name: "Kernel Bench L3", variants: [
    { benchmarkId: "kernel-bench-l3-speedup", label: "Median Speedup" },
    { benchmarkId: "kernel-bench-l3-win-rate", label: "Win Rate" }
  ] });
  appendFamily({ id: "zerobench", name: "ZeroBench", variants: [
    { benchmarkId: "zerobench", label: "Score / Setting Unspecified" },
    { benchmarkId: "zerobench-pass5-without-ci", label: "Pass@5 · Without CI" },
    { benchmarkId: "zerobench-pass5-with-ci", label: "Pass@5 · With CI" },
    { benchmarkId: "zerobench-sub", label: "Sub" }
  ] });
  appendFamily({ id: "ocr-bench-v2", name: "OCR-Bench-V2", variants: [
    { benchmarkId: "ocr-bench-v2-en", label: "English" },
    { benchmarkId: "ocr-bench-v2-zh", label: "Chinese" }
  ] });
  appendFamily({ id: "omnidocbench-family", name: "OmniDocBench", variants: [
    { benchmarkId: "omnidocbench", label: "NED · Lower Is Better" },
    { benchmarkId: "omnidocbench-1-5-score", label: "v1.5 Score · Higher Is Better" }
  ] });
  appendFamily({ id: "vstar-family", name: "V*", variants: [
    { benchmarkId: "vstar-without-ci", label: "Without CI" },
    { benchmarkId: "vstar-with-ci", label: "With CI" }
  ] });
  appendFamily({ id: "omnivideobench-family", name: "OmniVideoBench", variants: [
    { benchmarkId: "omnivideobench", label: "Accuracy" },
    { benchmarkId: "omnivideobench-tokens-per-query", label: "Tokens per query" },
    { benchmarkId: "omnivideobench-token-reduction", label: "Token reduction" }
  ] });
  const clawEvalFamily = benchmarkFamilies.find((family) => family.id === "claweval-family");
  if (clawEvalFamily && !clawEvalFamily.variants.some((variant) => variant.benchmarkId === "claweval-mm")) {
    clawEvalFamily.variants.unshift({ benchmarkId: "claweval-mm", label: "MM · Setting Unspecified" });
  }
  if (clawEvalFamily && !clawEvalFamily.variants.some((variant) => variant.benchmarkId === "claweval-mm-passat3")) {
    clawEvalFamily.variants.push({ benchmarkId: "claweval-mm-passat3", label: "MM · Pass@3 (at least one pass)" });
  }
  const aliMeetingFamily = benchmarkFamilies.find((family) => family.id === "alimeeting");
  if (aliMeetingFamily && !aliMeetingFamily.variants.some((variant) => variant.benchmarkId === "alimeeting-summary-score")) {
    aliMeetingFamily.variants.unshift({ benchmarkId: "alimeeting-summary-score", label: "Official overview score" });
  }
  const terminalFamily = benchmarkFamilies.find((family) => family.id === "terminal-bench");
  if (terminalFamily && !terminalFamily.variants.some((variant) => variant.benchmarkId === "terminal-bench-2")) terminalFamily.variants.unshift({ benchmarkId: "terminal-bench-2", label: "2 · Version Unspecified" });
  const mrcrFamily = benchmarkFamilies.find((family) => family.id === "mrcr-v2");
  if (mrcrFamily && !mrcrFamily.variants.some((variant) => variant.benchmarkId === "mrcr-v2-8needle")) mrcrFamily.variants.push({ benchmarkId: "mrcr-v2-8needle", label: "128K · 8-needle" });
  const hleFamily = benchmarkFamilies.find((family) => family.id === "hle");
  if (hleFamily && !hleFamily.variants.some((variant) => variant.benchmarkId === "hle-vl-tools")) hleFamily.variants.push({ benchmarkId: "hle-vl-tools", label: "Vision-Language · With Tools" });

  // Remove the earlier partial direct-source rows. Other provenance on a
  // multi-source observation is preserved. WildClaw rows were incorrectly
  // tagged as coming from the A95B model card, so that tag is removed too.
  const rebuiltSources = new Set(["qwen38", "qwen37", "qwen37-plus"]);
  for (let index = observations.length - 1; index >= 0; index -= 1) {
    const observation = observations[index];
    let keptSources = (observation.sourceIds || []).filter((sourceId) => !rebuiltSources.has(sourceId));
    if (["wildclawbench-overall", "wildclawbench-time"].includes(observation.benchmarkId)) {
      keptSources = keptSources.filter((sourceId) => sourceId !== "qwen38-hf");
    }
    if (keptSources.length === 0) observations.splice(index, 1);
    else observation.sourceIds = [...new Set(keptSources)];
  }

  // Three legacy rows duplicated cells that also appear in the complete HF
  // matrix. Keep the richer matrix entries and collapse identical evidence.
  const qwen38HfDuplicateKeys = new Set();
  for (let index = observations.length - 1; index >= 0; index -= 1) {
    const observation = observations[index];
    if (!observation.sourceIds.includes("qwen38-hf") || observation.modelId !== "qwen3-8-max") continue;
    if (!["agents-last-exam-pass", "agents-last-exam-score", "mrcr-256k"].includes(observation.benchmarkId)) continue;
    const key = `${observation.modelId}|${observation.benchmarkId}|${observation.value}`;
    if (!qwen38HfDuplicateKeys.has(key)) {
      qwen38HfDuplicateKeys.add(key);
      continue;
    }
    const keptSources = observation.sourceIds.filter((sourceId) => sourceId !== "qwen38-hf");
    if (keptSources.length === 0) observations.splice(index, 1);
    else observation.sourceIds = keptSources;
  }

  // The A95B HF card repeats the complete Qwen3.8-Max text table from the
  // release article. Merge provenance on the same observations.
  for (const observation of observations) {
    if (observation.sourceIds.includes("qwen38-hf") && !observation.sourceIds.includes("qwen38")) observation.sourceIds.push("qwen38");
  }

  const auditedRows = [
  [
    [
      "qwen38"
    ],
    "mmmu-pro",
    "qwen3-8-max",
    82.3,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "mathvision-without-ci",
    "qwen3-8-max",
    95.2,
    "%",
    "Qwen3.8-Max release vision/video table · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "mathvision-with-ci",
    "qwen3-8-max",
    97.7,
    "%",
    "Qwen3.8-Max release vision/video table · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "babyvision-without-ci",
    "qwen3-8-max",
    82,
    "%",
    "Qwen3.8-Max release vision/video table · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "babyvision-with-ci",
    "qwen3-8-max",
    91.3,
    "%",
    "Qwen3.8-Max release vision/video table · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "hle-vl-tools",
    "qwen3-8-max",
    52.2,
    "%",
    "Qwen3.8-Max release vision/video table · Code Interpreter + Search",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "zerobench-pass5-without-ci",
    "qwen3-8-max",
    24,
    "%",
    "Qwen3.8-Max release vision/video table · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "zerobench-pass5-with-ci",
    "qwen3-8-max",
    49,
    "%",
    "Qwen3.8-Max release vision/video table · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "zerobench-sub",
    "qwen3-8-max",
    48.5,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "logicvista",
    "qwen3-8-max",
    91.9,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "hipho",
    "qwen3-8-max",
    90,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "phyx",
    "qwen3-8-max",
    83.5,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "slake",
    "qwen3-8-max",
    90.8,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "medxpertqa-mm",
    "qwen3-8-max",
    80.4,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "pmc-vqa",
    "qwen3-8-max",
    66.2,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "osworld-verified",
    "qwen3-8-max",
    86.1,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "osworld-2-binary",
    "qwen3-8-max",
    19.4,
    "%",
    "Qwen3.8-Max release vision/video table · binary full-task reward",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "osworld-2-partial",
    "qwen3-8-max",
    46.7,
    "%",
    "Qwen3.8-Max release vision/video table · aggregate partial reward",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "screenspot-pro",
    "qwen3-8-max",
    84.5,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "webarena-verified",
    "qwen3-8-max",
    66.8,
    "%",
    "Qwen3.8-Max release vision/video table · official WebArena grader · OSWorld scaffold",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "androidworld",
    "qwen3-8-max",
    85.3,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "mobileworld",
    "qwen3-8-max",
    77.8,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "claweval-mm-passat3",
    "qwen3-8-max",
    77.2,
    "%",
    "Qwen3.8-Max release vision/video table · Pass@3 · at least one pass in three trials",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "claweval-mm-average",
    "qwen3-8-max",
    74.8,
    "%",
    "Qwen3.8-Max release vision/video table · mean score across three trials",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "vision2web",
    "qwen3-8-max",
    69,
    "%",
    "Qwen3.8-Max release vision/video table · frontend/webpage/website average · Claude Code · gpt-5.4-2026-03-05 judge",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "qwen-blender-bench",
    "qwen3-8-max",
    69.9,
    "%",
    "Qwen3.8-Max release vision/video table · Qwen internal benchmark",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "parametric-cad-bench",
    "qwen3-8-max",
    91.5,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "recreationbench",
    "qwen3-8-max",
    51.7,
    "%",
    "Qwen3.8-Max release vision/video table · internal benchmark · Ubuntu/macOS/Windows/Android/web",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "presentbench",
    "qwen3-8-max",
    79.6,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "charxiv-rq-without-ci",
    "qwen3-8-max",
    88.4,
    "%",
    "Qwen3.8-Max release vision/video table · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "charxiv-rq-with-ci",
    "qwen3-8-max",
    93.5,
    "%",
    "Qwen3.8-Max release vision/video table · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "omnidocbench-1-5-score",
    "qwen3-8-max",
    92.1,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "ocr-bench-v2-en",
    "qwen3-8-max",
    74.2,
    "%",
    "Qwen3.8-Max release vision/video table · English",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "ocr-bench-v2-zh",
    "qwen3-8-max",
    68.3,
    "%",
    "Qwen3.8-Max release vision/video table · Chinese",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "cc-ocr-bench-v2",
    "qwen3-8-max",
    79.6,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "mtvqa-test",
    "qwen3-8-max",
    56.6,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "madqa",
    "qwen3-8-max",
    91.8,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "qwen-visual-office",
    "qwen3-8-max",
    44.6,
    "%",
    "Qwen3.8-Max release vision/video table · Qwen internal benchmark",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "realworldqa",
    "qwen3-8-max",
    88,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "erqa",
    "qwen3-8-max",
    77.8,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "lingoqa",
    "qwen3-8-max",
    84.8,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "surds",
    "qwen3-8-max",
    77.8,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "simplevqa",
    "qwen3-8-max",
    75,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "worldvqa",
    "qwen3-8-max",
    53.2,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "mmstar",
    "qwen3-8-max",
    85.9,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "perceptionbench",
    "qwen3-8-max",
    63.5,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "countqa",
    "qwen3-8-max",
    82.4,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "refadv-s",
    "qwen3-8-max",
    80.2,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "dense200",
    "qwen3-8-max",
    87,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "coco",
    "qwen3-8-max",
    78.7,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "visfactor",
    "qwen3-8-max",
    60.8,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "vlms-are-biased",
    "qwen3-8-max",
    88.3,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "videomme",
    "qwen3-8-max",
    90.4,
    "%",
    "Qwen3.8-Max release vision/video table · subtitles enabled",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "video-mme-v2",
    "qwen3-8-max",
    68.3,
    "%",
    "Qwen3.8-Max release vision/video table · subtitles enabled",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "videommmu",
    "qwen3-8-max",
    88.7,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "mmvu",
    "qwen3-8-max",
    82.4,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "mlvu-m-avg",
    "qwen3-8-max",
    90.8,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "tvbench",
    "qwen3-8-max",
    81.9,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "lvbench",
    "qwen3-8-max",
    81.8,
    "%",
    "Qwen3.8-Max release vision/video table · published setting",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "lvbench",
    "qwen3-8-max",
    85.6,
    "%",
    "Qwen3.8-Max release vision/video table · Qwen-MM-Plugins memory system",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "egolife",
    "qwen3-8-max",
    80.3,
    "%",
    "Qwen3.8-Max release vision/video table · Qwen-MM-Plugins memory system",
    ""
  ],
  [
    [
      "qwen38"
    ],
    "videodr-search",
    "qwen3-8-max",
    73.2,
    "%",
    "Qwen3.8-Max release vision/video table · search tool enabled",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "terminal-bench-2-0",
    "qwen3-7-max",
    69.7,
    "%",
    "Qwen3.7-Max release · Harbor/Terminus-2 · 5h · 12 CPU/24 GB · temp 1.0 · top_p 0.95 · top_k 20 · max_tokens 80K · 256K · avg@5",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "swe-bench-verified",
    "qwen3-7-max",
    80.4,
    "%",
    "Qwen3.7-Max release · internal bash + file-edit agent scaffold · temp 1.0 · top_p 0.95 · 200K",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "swe-bench-pro",
    "qwen3-7-max",
    60.6,
    "%",
    "Qwen3.7-Max release · internal bash + file-edit agent scaffold · temp 1.0 · top_p 0.95 · 200K · corrected/refined tasks",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "swe-multilingual",
    "qwen3-7-max",
    78.3,
    "%",
    "Qwen3.7-Max release · internal bash + file-edit agent scaffold · temp 1.0 · top_p 0.95 · 200K",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "nl2repo",
    "qwen3-7-max",
    47.2,
    "%",
    "Qwen3.7-Max release · Claude Code · repository-download commands disabled",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "scicode",
    "qwen3-7-max",
    53.5,
    "%",
    "Qwen3.7-Max release · published setting",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "qwen-webdev",
    "qwen3-7-max",
    1568,
    "Elo",
    "Qwen3.7-Max release · internal bilingual frontend benchmark · auto-render + multimodal judge · BT/Elo",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "qwen-svg-bench",
    "qwen3-7-max",
    1608,
    "Elo",
    "Qwen3.7-Max release · QwenSVG · BT/Elo",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "qwenclawbench",
    "qwen3-7-max",
    64.3,
    "%",
    "Qwen3.7-Max release · OpenClaw · release table and cross-harness figure",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "coworkbench",
    "qwen3-7-max",
    67.2,
    "%",
    "Qwen3.7-Max release · OpenClaw · release table and cross-harness figure",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "claweval",
    "qwen3-7-max",
    65.2,
    "%",
    "Qwen3.7-Max release · published setting",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "skillsbench-1-1",
    "qwen3-7-max",
    59.2,
    "%",
    "Qwen3.7-Max release · OpenCode · 78 tasks after excluding 9 external-API tasks · avg@5",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "bfcl-v4",
    "qwen3-7-max",
    75,
    "%",
    "Qwen3.7-Max release · published setting",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "mcp-mark",
    "qwen3-7-max",
    60.8,
    "%",
    "Qwen3.7-Max release · GitHub MCP v0.30.3 · Playwright responses truncated at 32K",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "mcp-atlas",
    "qwen3-7-max",
    76.4,
    "%",
    "Qwen3.7-Max release · public set · Gemini 2.5 Pro judge",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "vita-bench",
    "qwen3-7-max",
    47.9,
    "%",
    "Qwen3.7-Max release · subdomain average · Claude 4.5 Sonnet judge",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "spreadsheetbench-v1",
    "qwen3-7-max",
    87,
    "%",
    "Qwen3.7-Max release · published setting",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "kernel-bench-l3-speedup",
    "qwen3-7-max",
    1.98,
    "×",
    "Qwen3.7-Max release · 50 problems · isolated H100 80GB container · CUTLASS/CUDA docs only · 500 tool-call cap · median per-problem speedup over PyTorch eager",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "kernel-bench-l3-win-rate",
    "qwen3-7-max",
    96,
    "%",
    "Qwen3.7-Max release · 50 problems · isolated H100 80GB container · CUTLASS/CUDA docs only · 500 tool-call cap · fraction faster than torch.compile",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "hle-tools",
    "qwen3-7-max",
    53.5,
    "%",
    "Qwen3.7-Max release · published setting",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "qwen-world-bench",
    "qwen3-7-max",
    57.3,
    "%",
    "Qwen3.7-Max release · internal 7-domain world-model benchmark · rubric judge grounded in environment feedback",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "gpqa-diamond",
    "qwen3-7-max",
    92.4,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "hle",
    "qwen3-7-max",
    41.4,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "livecodebench",
    "qwen3-7-max",
    91.6,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "hmmt-2026-02",
    "qwen3-7-max",
    97.1,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "imoanswerbench",
    "qwen3-7-max",
    90,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "critpt",
    "qwen3-7-max",
    11.4,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "apex",
    "qwen3-7-max",
    44.5,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "mmlu-pro",
    "qwen3-7-max",
    89.6,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "mmlu-redux",
    "qwen3-7-max",
    95,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "supergpqa",
    "qwen3-7-max",
    73.6,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "ifeval",
    "qwen3-7-max",
    94.3,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "ifbench",
    "qwen3-7-max",
    79.1,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "mrcr-v2-8needle",
    "qwen3-7-max",
    90.4,
    "%",
    "Qwen3.7-Max release · 128K · 8 needles · Google DeepMind eval_hub protocol",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "wmt24pp",
    "qwen3-7-max",
    85.8,
    "%",
    "Qwen3.7-Max release · 55-language average · XCOMET-XXL",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "maxife",
    "qwen3-7-max",
    89.2,
    "%",
    "Qwen3.7-Max release · English + multilingual prompts · 23 settings",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "mmmlu",
    "qwen3-7-max",
    90.3,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "mmlu-prox",
    "qwen3-7-max",
    87,
    "%",
    "Qwen3.7-Max release · 29-language average",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "nova-63",
    "qwen3-7-max",
    59,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "include",
    "qwen3-7-max",
    86.2,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "global-piqa",
    "qwen3-7-max",
    91.4,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37"
    ],
    "polymath",
    "qwen3-7-max",
    86.5,
    "%",
    "Qwen3.7-Max release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "terminal-bench-2-0",
    "qwen3-7-plus",
    70.3,
    "%",
    "Qwen3.7-Plus release · Harbor/Terminus-2 · 5h · 12 CPU/24 GB · temp 1.0 · top_p 0.95 · top_k 20 · max_tokens 80K · 256K · avg@5",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "swe-bench-verified",
    "qwen3-7-plus",
    77.7,
    "%",
    "Qwen3.7-Plus release · internal bash + file-edit agent scaffold · temp 1.0 · top_p 0.95 · 200K",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "swe-bench-pro",
    "qwen3-7-plus",
    57.6,
    "%",
    "Qwen3.7-Plus release · internal bash + file-edit agent scaffold · temp 1.0 · top_p 0.95 · 200K · corrected/refined tasks",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "swe-multilingual",
    "qwen3-7-plus",
    75.8,
    "%",
    "Qwen3.7-Plus release · internal bash + file-edit agent scaffold · temp 1.0 · top_p 0.95 · 200K",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "nl2repo",
    "qwen3-7-plus",
    41.1,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "scicode",
    "qwen3-7-plus",
    51.3,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "qwen-webdev",
    "qwen3-7-plus",
    1536,
    "Elo",
    "Qwen3.7-Plus release · internal bilingual frontend benchmark · auto-render + multimodal judge · BT/Elo",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "qwen-svg-bench",
    "qwen3-7-plus",
    1588,
    "Elo",
    "Qwen3.7-Plus release · QwenSVG · BT/Elo",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "qwenclawbench",
    "qwen3-7-plus",
    61.8,
    "%",
    "Qwen3.7-Plus release · release table · harness not separately disclosed",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "coworkbench",
    "qwen3-7-plus",
    65.1,
    "%",
    "Qwen3.7-Plus release · release table · harness not separately disclosed",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "claweval",
    "qwen3-7-plus",
    62.7,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "skillsbench-1-1",
    "qwen3-7-plus",
    54.9,
    "%",
    "Qwen3.7-Plus release · OpenCode · 78 tasks after excluding 9 external-API tasks · avg@5",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "bfcl-v4",
    "qwen3-7-plus",
    72.9,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mcp-mark",
    "qwen3-7-plus",
    58.7,
    "%",
    "Qwen3.7-Plus release · GitHub MCP v0.30.3 · Playwright responses truncated at 32K",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mcp-atlas",
    "qwen3-7-plus",
    73.2,
    "%",
    "Qwen3.7-Plus release · public set · Gemini 2.5 Pro judge",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "vita-bench",
    "qwen3-7-plus",
    45.6,
    "%",
    "Qwen3.7-Plus release · subdomain average · Claude 4.5 Sonnet judge",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "deep-planning",
    "qwen3-7-plus",
    62.3,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "spreadsheetbench-v1",
    "qwen3-7-plus",
    86.3,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "kernel-bench-l3-speedup",
    "qwen3-7-plus",
    2.06,
    "×",
    "Qwen3.7-Plus release · 50 problems · isolated H100 80GB container · CUTLASS/CUDA docs only · 500 tool-call cap · median per-problem speedup over PyTorch eager",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "kernel-bench-l3-win-rate",
    "qwen3-7-plus",
    98,
    "%",
    "Qwen3.7-Plus release · 50 problems · isolated H100 80GB container · CUTLASS/CUDA docs only · 500 tool-call cap · fraction faster than torch.compile",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "qwen-world-bench",
    "qwen3-7-plus",
    62.1,
    "%",
    "Qwen3.7-Plus release · internal 7-domain world-model benchmark · rubric judge grounded in environment feedback",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "gpqa-diamond",
    "qwen3-7-plus",
    90.3,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "hle",
    "qwen3-7-plus",
    34.7,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "livecodebench",
    "qwen3-7-plus",
    89.6,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "hmmt-2026-02",
    "qwen3-7-plus",
    92.9,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "imoanswerbench",
    "qwen3-7-plus",
    86,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "critpt",
    "qwen3-7-plus",
    6,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "apex",
    "qwen3-7-plus",
    22.7,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mmlu-pro",
    "qwen3-7-plus",
    88.5,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mmlu-redux",
    "qwen3-7-plus",
    94.5,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "supergpqa",
    "qwen3-7-plus",
    71.4,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "ifeval",
    "qwen3-7-plus",
    94.6,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "ifbench",
    "qwen3-7-plus",
    79.1,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mrcr-v2-8needle",
    "qwen3-7-plus",
    91.7,
    "%",
    "Qwen3.7-Plus release · 128K · 8 needles · Google DeepMind eval_hub protocol",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "wmt24pp",
    "qwen3-7-plus",
    84.6,
    "%",
    "Qwen3.7-Plus release · 55-language average · XCOMET-XXL",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "maxife",
    "qwen3-7-plus",
    88.8,
    "%",
    "Qwen3.7-Plus release · English + multilingual prompts · 23 settings",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mmmlu",
    "qwen3-7-plus",
    89,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mmlu-prox",
    "qwen3-7-plus",
    85.4,
    "%",
    "Qwen3.7-Plus release · 29-language average",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "nova-63",
    "qwen3-7-plus",
    58.8,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "include",
    "qwen3-7-plus",
    83,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "global-piqa",
    "qwen3-7-plus",
    90.3,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "polymath",
    "qwen3-7-plus",
    84,
    "%",
    "Qwen3.7-Plus release · recommended reasoning-effort=xhigh system prompt",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mmmu-pro",
    "qwen3-7-plus",
    79,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mathvision",
    "qwen3-7-plus",
    90.3,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "babyvision-with-ci",
    "qwen3-7-plus",
    70.4,
    "%",
    "Qwen3.7-Plus release · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "babyvision-without-ci",
    "qwen3-7-plus",
    64.7,
    "%",
    "Qwen3.7-Plus release · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "charxiv-rq-with-ci",
    "qwen3-7-plus",
    85.9,
    "%",
    "Qwen3.7-Plus release · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "charxiv-rq-without-ci",
    "qwen3-7-plus",
    84.4,
    "%",
    "Qwen3.7-Plus release · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "hipho",
    "qwen3-7-plus",
    84.1,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "erqa",
    "qwen3-7-plus",
    69.8,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "visfactor",
    "qwen3-7-plus",
    42.8,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "medxpertqa-mm",
    "qwen3-7-plus",
    71,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "screenspot-pro",
    "qwen3-7-plus",
    79,
    "%",
    "Qwen3.7-Plus release · enable_thinking=false",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "osworld-verified",
    "qwen3-7-plus",
    73.3,
    "%",
    "Qwen3.7-Plus release · enable_thinking=false",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "androidworld",
    "qwen3-7-plus",
    81,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "qwen-vision2code",
    "qwen3-7-plus",
    1772,
    "Elo",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "claweval-mm",
    "qwen3-7-plus",
    55.7,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "simplevqa",
    "qwen3-7-plus",
    81.7,
    "%",
    "Qwen3.7-Plus release · search augmentation enabled",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "worldvqa",
    "qwen3-7-plus",
    61.1,
    "%",
    "Qwen3.7-Plus release · search augmentation enabled",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mmsearchplus",
    "qwen3-7-plus",
    41.4,
    "%",
    "Qwen3.7-Plus release · search augmentation enabled",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "bc-vl",
    "qwen3-7-plus",
    51.1,
    "%",
    "Qwen3.7-Plus release · search augmentation enabled · presence_penalty 1.5",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mmbc",
    "qwen3-7-plus",
    46.3,
    "%",
    "Qwen3.7-Plus release · search augmentation enabled · presence_penalty 1.5",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "realworldqa",
    "qwen3-7-plus",
    86.9,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "countqa",
    "qwen3-7-plus",
    77,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "omnidocbench-1-5-score",
    "qwen3-7-plus",
    91.4,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "ocr-bench-v2-en",
    "qwen3-7-plus",
    70.7,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "ocr-bench-v2-zh",
    "qwen3-7-plus",
    67.1,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "odinw13",
    "qwen3-7-plus",
    51.1,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "lingoqa",
    "qwen3-7-plus",
    83.4,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "ego3d-bench",
    "qwen3-7-plus",
    5.9,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "surds",
    "qwen3-7-plus",
    77.2,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "vladbench",
    "qwen3-7-plus",
    77.2,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "videomme",
    "qwen3-7-plus",
    88,
    "%",
    "Qwen3.7-Plus release · subtitles enabled",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "videommmu",
    "qwen3-7-plus",
    85.4,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "mlvu-m-avg",
    "qwen3-7-plus",
    87.4,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "tvbench",
    "qwen3-7-plus",
    78.2,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen37-plus"
    ],
    "lvbench",
    "qwen3-7-plus",
    76.2,
    "%",
    "Qwen3.7-Plus release · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "deepswe-v1-1",
    "qwen3-8-flash-next",
    58.7,
    "%",
    "Qwen3.8-Flash-Next release/model card · best of Claude Code and mini-SWE-agent · temp 1.0 · top_p 0.95 · 256K",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "swe-bench-pro",
    "qwen3-8-flash-next",
    62.5,
    "%",
    "Qwen3.8-Flash-Next release/model card · Claude Code · temp 1.0 · top_p 0.95 · 256K · corrected/refined tasks",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "swe-multilingual",
    "qwen3-8-flash-next",
    81,
    "%",
    "Qwen3.8-Flash-Next release/model card · mini-SWE-agent · temp 1.0 · top_p 0.95 · 256K",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "nl2repo",
    "qwen3-8-flash-next",
    48.1,
    "%",
    "Qwen3.8-Flash-Next release/model card · Claude Code · repository-download commands disabled",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "coworkbench",
    "qwen3-8-flash-next",
    73.9,
    "%",
    "Qwen3.8-Flash-Next release/model card · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "jobbench",
    "qwen3-8-flash-next",
    55.7,
    "%",
    "Qwen3.8-Flash-Next release/model card · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "agents-last-exam-pass",
    "qwen3-8-flash-next",
    24.3,
    "%",
    "Qwen3.8-Flash-Next release/model card · Pass@1",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "agents-last-exam-score",
    "qwen3-8-flash-next",
    51.2,
    "Score",
    "Qwen3.8-Flash-Next release/model card · Overall Score",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "toolathlon",
    "qwen3-8-flash-next",
    73.5,
    "%",
    "Qwen3.8-Flash-Next release/model card · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "ifbench",
    "qwen3-8-flash-next",
    81.3,
    "%",
    "Qwen3.8-Flash-Next release/model card · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "gpqa-diamond",
    "qwen3-8-flash-next",
    91.7,
    "%",
    "Qwen3.8-Flash-Next release/model card · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "hle",
    "qwen3-8-flash-next",
    35.9,
    "%",
    "Qwen3.8-Flash-Next release/model card · GPT-4o judge",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "livecodebench-v6",
    "qwen3-8-flash-next",
    91.9,
    "%",
    "Qwen3.8-Flash-Next release/model card · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "claweval-mm-passat3",
    "qwen3-8-flash-next",
    64.4,
    "%",
    "Qwen3.8-Flash-Next release/model card · Pass@3 · at least one pass in three trials",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "claweval-mm-average",
    "qwen3-8-flash-next",
    60.4,
    "%",
    "Qwen3.8-Flash-Next release/model card · mean score across three trials",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "recreationbench",
    "qwen3-8-flash-next",
    49.9,
    "%",
    "Qwen3.8-Flash-Next release/model card · internal benchmark · Ubuntu/macOS/Windows/Android/web",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "androidworld",
    "qwen3-8-flash-next",
    84.5,
    "%",
    "Qwen3.8-Flash-Next release/model card · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "osworld-2-binary",
    "qwen3-8-flash-next",
    19.4,
    "%",
    "Qwen3.8-Flash-Next release/model card · binary full-task reward",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "osworld-2-partial",
    "qwen3-8-flash-next",
    52.3,
    "%",
    "Qwen3.8-Flash-Next release/model card · aggregate partial reward",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "vision2web",
    "qwen3-8-flash-next",
    64,
    "%",
    "Qwen3.8-Flash-Next release/model card · frontend/webpage/website average · Claude Code · gpt-5.4-2026-03-05 judge",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "erqa",
    "qwen3-8-flash-next",
    72.3,
    "%",
    "Qwen3.8-Flash-Next release/model card · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "lvbench",
    "qwen3-8-flash-next",
    76.6,
    "%",
    "Qwen3.8-Flash-Next release/model card · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "realworldqa",
    "qwen3-8-flash-next",
    88.5,
    "%",
    "Qwen3.8-Flash-Next release/model card · published setting",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "mathvision-without-ci",
    "qwen3-8-flash-next",
    90.6,
    "%",
    "Qwen3.8-Flash-Next release/model card · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "mathvision-with-ci",
    "qwen3-8-flash-next",
    95.7,
    "%",
    "Qwen3.8-Flash-Next release/model card · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "charxiv-rq-without-ci",
    "qwen3-8-flash-next",
    84.6,
    "%",
    "Qwen3.8-Flash-Next release/model card · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf"
    ],
    "charxiv-rq-with-ci",
    "qwen3-8-flash-next",
    90.6,
    "%",
    "Qwen3.8-Flash-Next release/model card · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmlu",
    "qwen3-8-flash-next-base",
    90.36,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmlu-redux",
    "qwen3-8-flash-next-base",
    90.68,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmlu-pro",
    "qwen3-8-flash-next-base",
    73.23,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "supergpqa",
    "qwen3-8-flash-next-base",
    51.36,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "bbh",
    "qwen3-8-flash-next-base",
    90.87,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "gpqa",
    "qwen3-8-flash-next-base",
    51.42,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "gsm8k",
    "qwen3-8-flash-next-base",
    93.29,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "math",
    "qwen3-8-flash-next-base",
    72.78,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "evalplus",
    "qwen3-8-flash-next-base",
    78.76,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "multiple",
    "qwen3-8-flash-next-base",
    79.09,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "swebench-pretrain",
    "qwen3-8-flash-next-base",
    50.99,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mgsm",
    "qwen3-8-flash-next-base",
    89.33,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmmlu",
    "qwen3-8-flash-next-base",
    84.86,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "include",
    "qwen3-8-flash-next-base",
    78.4,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmlu",
    "qwen3-8-27b-base",
    87.51,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmlu-redux",
    "qwen3-8-27b-base",
    87.26,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmlu-pro",
    "qwen3-8-27b-base",
    68.6,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "supergpqa",
    "qwen3-8-27b-base",
    44.86,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "bbh",
    "qwen3-8-27b-base",
    89.56,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "gpqa",
    "qwen3-8-27b-base",
    45.01,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "gsm8k",
    "qwen3-8-27b-base",
    93.18,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "math",
    "qwen3-8-27b-base",
    60.54,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "evalplus",
    "qwen3-8-27b-base",
    76.05,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "multiple",
    "qwen3-8-27b-base",
    74.5,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "swebench-pretrain",
    "qwen3-8-27b-base",
    41.66,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mgsm",
    "qwen3-8-27b-base",
    86.37,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmmlu",
    "qwen3-8-27b-base",
    79.74,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "include",
    "qwen3-8-27b-base",
    74.37,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmlu",
    "qwen3-7-plus-base",
    90.43,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmlu-redux",
    "qwen3-7-plus-base",
    91.47,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmlu-pro",
    "qwen3-7-plus-base",
    70.9,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "supergpqa",
    "qwen3-7-plus-base",
    48.42,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "bbh",
    "qwen3-7-plus-base",
    89.41,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "gpqa",
    "qwen3-7-plus-base",
    51.52,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "gsm8k",
    "qwen3-7-plus-base",
    92.95,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "math",
    "qwen3-7-plus-base",
    74.38,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "evalplus",
    "qwen3-7-plus-base",
    78.06,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "multiple",
    "qwen3-7-plus-base",
    81.68,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "swebench-pretrain",
    "qwen3-7-plus-base",
    49.24,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mgsm",
    "qwen3-7-plus-base",
    85.42,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "mmmlu",
    "qwen3-7-plus-base",
    84.53,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-flash-next",
      "qwen38-flash-next-hf",
      "qwen38-flash-next-report"
    ],
    "include",
    "qwen3-7-plus-base",
    78.9,
    "%",
    "Qwen3.8-Flash-Next release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "terminal-bench-2-1",
    "qwen3-8-27b",
    73,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "swe-bench-pro",
    "qwen3-8-27b",
    61.7,
    "%",
    "Qwen3.8-27B model card · Claude Code · temp 1.0 · top_p 0.95 · 256K · corrected/refined tasks",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "nl2repo",
    "qwen3-8-27b",
    42.3,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "deepswe-v1-1",
    "qwen3-8-27b",
    42.2,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "qwen-swe-bench",
    "qwen3-8-27b",
    79,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "coworkbench",
    "qwen3-8-27b",
    70.7,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "jobbench",
    "qwen3-8-27b",
    33.4,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "agents-last-exam-pass",
    "qwen3-8-27b",
    20.4,
    "%",
    "Qwen3.8-27B model card · Pass@1",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "agents-last-exam-score",
    "qwen3-8-27b",
    42.9,
    "Score",
    "Qwen3.8-27B model card · Overall Score",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "ifbench",
    "qwen3-8-27b",
    79.5,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "gpqa-diamond",
    "qwen3-8-27b",
    89.2,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "hle",
    "qwen3-8-27b",
    30.8,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "livecodebench-v6",
    "qwen3-8-27b",
    90.3,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "osworld-verified",
    "qwen3-8-27b",
    84.3,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "webarena-verified",
    "qwen3-8-27b",
    64.8,
    "%",
    "Qwen3.8-27B model card · official WebArena grader · OSWorld scaffold",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "androidworld",
    "qwen3-8-27b",
    81.9,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "recreationbench",
    "qwen3-8-27b",
    47.1,
    "%",
    "Qwen3.8-27B model card · internal benchmark · Ubuntu/macOS/Windows/Android/web",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "claweval-mm-passat3",
    "qwen3-8-27b",
    57.4,
    "%",
    "Qwen3.8-27B model card · Pass@3 · at least one pass in three trials",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "claweval-mm-average",
    "qwen3-8-27b",
    56.9,
    "%",
    "Qwen3.8-27B model card · mean score across three trials",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "swe-multimodal",
    "qwen3-8-27b",
    38.6,
    "%",
    "Qwen3.8-27B model card · Claude Code · public dev split · Opus 4.7 System Card Appendix 8.3 modifications",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "vision2web",
    "qwen3-8-27b",
    62.9,
    "%",
    "Qwen3.8-27B model card · frontend/webpage/website average · Claude Code · gpt-5.4-2026-03-05 judge",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "mathvision-without-ci",
    "qwen3-8-27b",
    90,
    "%",
    "Qwen3.8-27B model card · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "mathvision-with-ci",
    "qwen3-8-27b",
    94.6,
    "%",
    "Qwen3.8-27B model card · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "babyvision-without-ci",
    "qwen3-8-27b",
    65.7,
    "%",
    "Qwen3.8-27B model card · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "babyvision-with-ci",
    "qwen3-8-27b",
    85.6,
    "%",
    "Qwen3.8-27B model card · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "charxiv-rq-without-ci",
    "qwen3-8-27b",
    83.7,
    "%",
    "Qwen3.8-27B model card · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "charxiv-rq-with-ci",
    "qwen3-8-27b",
    90.2,
    "%",
    "Qwen3.8-27B model card · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "omnidocbench-1-5-score",
    "qwen3-8-27b",
    91.1,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "realworldqa",
    "qwen3-8-27b",
    85.9,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen38-27b-hf"
    ],
    "erqa",
    "qwen3-8-27b",
    65.5,
    "%",
    "Qwen3.8-27B model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmlu-pro",
    "qwen3-5-397b-a17b",
    87.8,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmlu-redux",
    "qwen3-5-397b-a17b",
    94.9,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "supergpqa",
    "qwen3-5-397b-a17b",
    70.4,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "c-eval",
    "qwen3-5-397b-a17b",
    93,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "ifeval",
    "qwen3-5-397b-a17b",
    92.6,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "ifbench",
    "qwen3-5-397b-a17b",
    76.5,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "multichallenge",
    "qwen3-5-397b-a17b",
    67.6,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "aa-lcr",
    "qwen3-5-397b-a17b",
    68.7,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "longbench-v2",
    "qwen3-5-397b-a17b",
    63.2,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "gpqa",
    "qwen3-5-397b-a17b",
    88.4,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "hle",
    "qwen3-5-397b-a17b",
    28.7,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "hle-verified",
    "qwen3-5-397b-a17b",
    37.6,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "livecodebench-v6",
    "qwen3-5-397b-a17b",
    83.6,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "hmmt-2025-02",
    "qwen3-5-397b-a17b",
    94.8,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "hmmt-2025-11",
    "qwen3-5-397b-a17b",
    92.7,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "imoanswerbench",
    "qwen3-5-397b-a17b",
    80.9,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "aime-2026",
    "qwen3-5-397b-a17b",
    91.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "bfcl-v4",
    "qwen3-5-397b-a17b",
    72.9,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "tau2-bench",
    "qwen3-5-397b-a17b",
    86.7,
    "%",
    "Qwen3.5 release/model card · official setup except airline fixes from Claude Opus 4.5 System Card",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "vita-bench",
    "qwen3-5-397b-a17b",
    49.7,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "deep-planning",
    "qwen3-5-397b-a17b",
    34.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "tool-decathlon",
    "qwen3-5-397b-a17b",
    38.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mcp-mark",
    "qwen3-5-397b-a17b",
    46.1,
    "%",
    "Qwen3.5 release/model card · GitHub MCP v0.30.3 · Playwright responses truncated at 32K",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "hle-tools",
    "qwen3-5-397b-a17b",
    48.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "browsecomp",
    "qwen3-5-397b-a17b",
    69,
    "%",
    "Qwen3.5 release/model card · simple context folding · 256K",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "browsecomp",
    "qwen3-5-397b-a17b",
    78.6,
    "%",
    "Qwen3.5 release/model card · discard-all strategy used by DeepSeek-V3.2 and Kimi K2.5",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "browsecomp-zh",
    "qwen3-5-397b-a17b",
    70.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "wide-search",
    "qwen3-5-397b-a17b",
    74,
    "%",
    "Qwen3.5 release/model card · 256K · no context management",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "seal-0",
    "qwen3-5-397b-a17b",
    46.9,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmmlu",
    "qwen3-5-397b-a17b",
    88.5,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmlu-prox",
    "qwen3-5-397b-a17b",
    84.7,
    "%",
    "Qwen3.5 release/model card · 29-language average",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "nova-63",
    "qwen3-5-397b-a17b",
    59.1,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "include",
    "qwen3-5-397b-a17b",
    85.6,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "global-piqa",
    "qwen3-5-397b-a17b",
    89.8,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "polymath",
    "qwen3-5-397b-a17b",
    73.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "wmt24pp",
    "qwen3-5-397b-a17b",
    78.9,
    "%",
    "Qwen3.5 release/model card · 55-language average · XCOMET-XXL",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "maxife",
    "qwen3-5-397b-a17b",
    88.2,
    "%",
    "Qwen3.5 release/model card · English + multilingual prompts · 23 settings",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "swe-bench-verified",
    "qwen3-5-397b-a17b",
    76.4,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "swe-multilingual",
    "qwen3-5-397b-a17b",
    69.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "seccodebench",
    "qwen3-5-397b-a17b",
    68.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "terminal-bench-2",
    "qwen3-5-397b-a17b",
    52.5,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmmu",
    "qwen3-5-397b-a17b",
    85,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmmu-pro",
    "qwen3-5-397b-a17b",
    79,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mathvision",
    "qwen3-5-397b-a17b",
    88.6,
    "%",
    "Qwen3.5 release/model card · fixed boxed-answer prompt",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mathvista-mini",
    "qwen3-5-397b-a17b",
    90.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "we-math",
    "qwen3-5-397b-a17b",
    87.9,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "dynamath",
    "qwen3-5-397b-a17b",
    86.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "zerobench",
    "qwen3-5-397b-a17b",
    12,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "zerobench-sub",
    "qwen3-5-397b-a17b",
    41,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "babyvision-with-ci",
    "qwen3-5-397b-a17b",
    52.3,
    "%",
    "Qwen3.5 release/model card · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "babyvision-without-ci",
    "qwen3-5-397b-a17b",
    43.3,
    "%",
    "Qwen3.5 release/model card · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "realworldqa",
    "qwen3-5-397b-a17b",
    83.9,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmstar",
    "qwen3-5-397b-a17b",
    83.8,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "hallusionbench",
    "qwen3-5-397b-a17b",
    71.4,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmbench-en-dev-v1-1",
    "qwen3-5-397b-a17b",
    93.7,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "simplevqa",
    "qwen3-5-397b-a17b",
    67.1,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "omnidocbench-1-5-score",
    "qwen3-5-397b-a17b",
    90.8,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "charxiv",
    "qwen3-5-397b-a17b",
    80.8,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmlongbench-doc",
    "qwen3-5-397b-a17b",
    61.5,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "cc-ocr",
    "qwen3-5-397b-a17b",
    82,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "ai2d-test",
    "qwen3-5-397b-a17b",
    93.9,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "ocrbench",
    "qwen3-5-397b-a17b",
    93.1,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "erqa",
    "qwen3-5-397b-a17b",
    67.5,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "countbench",
    "qwen3-5-397b-a17b",
    97.2,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "refcoco-avg",
    "qwen3-5-397b-a17b",
    92.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "odinw13",
    "qwen3-5-397b-a17b",
    47,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "embspatialbench",
    "qwen3-5-397b-a17b",
    84.5,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "refspatialbench",
    "qwen3-5-397b-a17b",
    73.6,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "lingoqa",
    "qwen3-5-397b-a17b",
    81.6,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "vstar-with-ci",
    "qwen3-5-397b-a17b",
    95.8,
    "%",
    "Qwen3.5 release/model card · with Code Interpreter",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "vstar-without-ci",
    "qwen3-5-397b-a17b",
    91.1,
    "%",
    "Qwen3.5 release/model card · without Code Interpreter",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "hypersim",
    "qwen3-5-397b-a17b",
    12.5,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "sunrgbd",
    "qwen3-5-397b-a17b",
    38.3,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "nuscenes",
    "qwen3-5-397b-a17b",
    16,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "videomme",
    "qwen3-5-397b-a17b",
    87.5,
    "%",
    "Qwen3.5 release/model card · with subtitles",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "videomme",
    "qwen3-5-397b-a17b",
    83.7,
    "%",
    "Qwen3.5 release/model card · without subtitles",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "videommmu",
    "qwen3-5-397b-a17b",
    84.7,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mlvu-m-avg",
    "qwen3-5-397b-a17b",
    86.7,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mvbench",
    "qwen3-5-397b-a17b",
    77.6,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "lvbench",
    "qwen3-5-397b-a17b",
    75.5,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmvu",
    "qwen3-5-397b-a17b",
    75.4,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "screenspot-pro",
    "qwen3-5-397b-a17b",
    65.6,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "osworld-verified",
    "qwen3-5-397b-a17b",
    62.2,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "androidworld",
    "qwen3-5-397b-a17b",
    66.8,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "slake",
    "qwen3-5-397b-a17b",
    79.9,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "pmc-vqa",
    "qwen3-5-397b-a17b",
    64.2,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "medxpertqa-mm",
    "qwen3-5-397b-a17b",
    70,
    "%",
    "Qwen3.5 release/model card · published setting",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmlu",
    "qwen3-5-397b-a17b-base",
    88.61,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmlu-pro",
    "qwen3-5-397b-a17b-base",
    76.01,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmlu-redux",
    "qwen3-5-397b-a17b-base",
    89.09,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "supergpqa",
    "qwen3-5-397b-a17b-base",
    57.96,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "c-eval",
    "qwen3-5-397b-a17b-base",
    91.82,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "mmmlu",
    "qwen3-5-397b-a17b-base",
    85.82,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "include",
    "qwen3-5-397b-a17b-base",
    79.27,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "nova",
    "qwen3-5-397b-a17b-base",
    67.55,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "bbh",
    "qwen3-5-397b-a17b-base",
    90.98,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "korbench",
    "qwen3-5-397b-a17b-base",
    54.08,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "gpqa",
    "qwen3-5-397b-a17b-base",
    54.64,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "math",
    "qwen3-5-397b-a17b-base",
    74.14,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "gsm8k",
    "qwen3-5-397b-a17b-base",
    93.71,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "evalplus",
    "qwen3-5-397b-a17b-base",
    79.32,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "multiple",
    "qwen3-5-397b-a17b-base",
    79.39,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "swe-agentless",
    "qwen3-5-397b-a17b-base",
    43.26,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "crux-i",
    "qwen3-5-397b-a17b-base",
    71.13,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35",
      "qwen35-hf"
    ],
    "crux-o",
    "qwen3-5-397b-a17b-base",
    82.38,
    "%",
    "Qwen3.5 release/model card · base-model table",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "dailyomni",
    "qwen3-5-omni-flash",
    81.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "worldsense",
    "qwen3-5-omni-flash",
    57.9,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "avut",
    "qwen3-5-omni-flash",
    81.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "av-speakerbench",
    "qwen3-5-omni-flash",
    65.2,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "videomme-audio",
    "qwen3-5-omni-flash",
    79.3,
    "%",
    "Qwen3.5-Omni release · use_audio_in_video=true",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "qualcomm-interactive",
    "qwen3-5-omni-flash",
    66.3,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "omnicloze",
    "qwen3-5-omni-flash",
    63,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "omnigaia",
    "qwen3-5-omni-flash",
    33.9,
    "%",
    "Qwen3.5-Omni release · no thinking prompt · no <answer> formatting · DeepSeek-V3.2-Thinking judge",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "dailyomni",
    "qwen3-5-omni-plus",
    84.6,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "worldsense",
    "qwen3-5-omni-plus",
    62.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "avut",
    "qwen3-5-omni-plus",
    85,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "av-speakerbench",
    "qwen3-5-omni-plus",
    71.3,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "videomme-audio",
    "qwen3-5-omni-plus",
    83.7,
    "%",
    "Qwen3.5-Omni release · use_audio_in_video=true",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "qualcomm-interactive",
    "qwen3-5-omni-plus",
    68.5,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "omnicloze",
    "qwen3-5-omni-plus",
    64.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "omnigaia",
    "qwen3-5-omni-plus",
    57.2,
    "%",
    "Qwen3.5-Omni release · no thinking prompt · no <answer> formatting · DeepSeek-V3.2-Thinking judge",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmau",
    "qwen3-5-omni-flash",
    80.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmar",
    "qwen3-5-omni-flash",
    74,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmsu",
    "qwen3-5-omni-flash",
    72.2,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "muchomusic-rul",
    "qwen3-5-omni-flash",
    60.5,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-harmonix-accuracy",
    "qwen3-5-omni-flash",
    80.6,
    "%",
    "Qwen3.5-Omni release · accuracy · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-harmonix-hr-5f",
    "qwen3-5-omni-flash",
    67.8,
    "%",
    "Qwen3.5-Omni release · HR@0.5F · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-harmonix-hr-3f",
    "qwen3-5-omni-flash",
    83.4,
    "%",
    "Qwen3.5-Omni release · HR@3F · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-cn-accuracy",
    "qwen3-5-omni-flash",
    86.7,
    "%",
    "Qwen3.5-Omni release · accuracy · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-cn-hr-5f",
    "qwen3-5-omni-flash",
    66.4,
    "%",
    "Qwen3.5-Omni release · HR@0.5F · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-cn-hr-3f",
    "qwen3-5-omni-flash",
    84.6,
    "%",
    "Qwen3.5-Omni release · HR@3F · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "voicebench",
    "qwen3-5-omni-flash",
    87.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "uro-bench-pro-understanding",
    "qwen3-5-omni-flash",
    64.1,
    "%",
    "Qwen3.5-Omni release · Pro track · Understanding",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "uro-bench-pro-reasoning",
    "qwen3-5-omni-flash",
    83.8,
    "%",
    "Qwen3.5-Omni release · Pro track · Reasoning",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "uro-bench-pro-oral",
    "qwen3-5-omni-flash",
    98.7,
    "%",
    "Qwen3.5-Omni release · Pro track · Oral Conversation · GenStyle-en/zh/multilingual",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "speechrole",
    "qwen3-5-omni-flash",
    119.8,
    "Score",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "wildspeech",
    "qwen3-5-omni-flash",
    72.2,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "fleurs-s2tt-zh",
    "qwen3-5-omni-flash",
    26.9,
    "BLEU",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "fleurs-s2tt-en",
    "qwen3-5-omni-flash",
    32,
    "BLEU",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "fleurs-s2tt-zh-en",
    "qwen3-5-omni-flash",
    29.4,
    "BLEU",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "fleurs-asr-wer",
    "qwen3-5-omni-flash",
    10.75,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "cv15-zh-wer",
    "qwen3-5-omni-flash",
    4.25,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · Mandarin",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "cv15-yue-wer",
    "qwen3-5-omni-flash",
    3.45,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · Cantonese",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "cv15-zh-tw-wer",
    "qwen3-5-omni-flash",
    2.68,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · Traditional Chinese",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "cv15-en-wer",
    "qwen3-5-omni-flash",
    5.9,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "librispeech-clean-wer",
    "qwen3-5-omni-flash",
    1.3,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · clean split",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "librispeech-other-wer",
    "qwen3-5-omni-flash",
    2.43,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · other split",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "wenetspeech-net-wer",
    "qwen3-5-omni-flash",
    4.41,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · Net split",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "wenetspeech-meeting-wer",
    "qwen3-5-omni-flash",
    5.51,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · Meeting split",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "kespeech-wer",
    "qwen3-5-omni-flash",
    4.47,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mir1k-wer",
    "qwen3-5-omni-flash",
    4.94,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "opencpop-wer",
    "qwen3-5-omni-flash",
    1.11,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmau",
    "qwen3-5-omni-plus",
    82.2,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmar",
    "qwen3-5-omni-plus",
    80,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmsu",
    "qwen3-5-omni-plus",
    82.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "muchomusic-rul",
    "qwen3-5-omni-plus",
    72.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-harmonix-accuracy",
    "qwen3-5-omni-plus",
    81.1,
    "%",
    "Qwen3.5-Omni release · accuracy · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-harmonix-hr-5f",
    "qwen3-5-omni-plus",
    72.9,
    "%",
    "Qwen3.5-Omni release · HR@0.5F · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-harmonix-hr-3f",
    "qwen3-5-omni-plus",
    85.3,
    "%",
    "Qwen3.5-Omni release · HR@3F · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-cn-accuracy",
    "qwen3-5-omni-plus",
    87.1,
    "%",
    "Qwen3.5-Omni release · accuracy · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-cn-hr-5f",
    "qwen3-5-omni-plus",
    65.7,
    "%",
    "Qwen3.5-Omni release · HR@0.5F · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "songform-cn-hr-3f",
    "qwen3-5-omni-plus",
    84.2,
    "%",
    "Qwen3.5-Omni release · HR@3F · unified SRT-like timestamp prompt",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "voicebench",
    "qwen3-5-omni-plus",
    93.1,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "uro-bench-pro-understanding",
    "qwen3-5-omni-plus",
    66.3,
    "%",
    "Qwen3.5-Omni release · Pro track · Understanding",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "uro-bench-pro-reasoning",
    "qwen3-5-omni-plus",
    86.3,
    "%",
    "Qwen3.5-Omni release · Pro track · Reasoning",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "uro-bench-pro-oral",
    "qwen3-5-omni-plus",
    99.8,
    "%",
    "Qwen3.5-Omni release · Pro track · Oral Conversation · GenStyle-en/zh/multilingual",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "speechrole",
    "qwen3-5-omni-plus",
    123.5,
    "Score",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "wildspeech",
    "qwen3-5-omni-plus",
    75.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "fleurs-s2tt-zh",
    "qwen3-5-omni-plus",
    30.2,
    "BLEU",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "fleurs-s2tt-en",
    "qwen3-5-omni-plus",
    35.4,
    "BLEU",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "fleurs-s2tt-zh-en",
    "qwen3-5-omni-plus",
    32.8,
    "BLEU",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "fleurs-asr-wer",
    "qwen3-5-omni-plus",
    6.55,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "cv15-zh-wer",
    "qwen3-5-omni-plus",
    3.46,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · Mandarin",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "cv15-yue-wer",
    "qwen3-5-omni-plus",
    1.95,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · Cantonese",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "cv15-zh-tw-wer",
    "qwen3-5-omni-plus",
    2.27,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · Traditional Chinese",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "cv15-en-wer",
    "qwen3-5-omni-plus",
    4.83,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "librispeech-clean-wer",
    "qwen3-5-omni-plus",
    1.11,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · clean split",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "librispeech-other-wer",
    "qwen3-5-omni-plus",
    2.23,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · other split",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "wenetspeech-net-wer",
    "qwen3-5-omni-plus",
    4.3,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · Net split",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "wenetspeech-meeting-wer",
    "qwen3-5-omni-plus",
    5.84,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better · Meeting split",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "kespeech-wer",
    "qwen3-5-omni-plus",
    3.46,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mir1k-wer",
    "qwen3-5-omni-plus",
    4.56,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "opencpop-wer",
    "qwen3-5-omni-plus",
    1.49,
    "%",
    "Qwen3.5-Omni release · ASR WER/CER · lower is better",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmmu",
    "qwen3-5-omni-flash",
    76.9,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmmu-pro",
    "qwen3-5-omni-flash",
    68.2,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mathvision",
    "qwen3-5-omni-flash",
    65.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mathvista-mini",
    "qwen3-5-omni-flash",
    82.9,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "dynamath",
    "qwen3-5-omni-flash",
    79.3,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "zerobench",
    "qwen3-5-omni-flash",
    1,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "zerobench-sub",
    "qwen3-5-omni-flash",
    26,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "realworldqa",
    "qwen3-5-omni-flash",
    77.5,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmstar",
    "qwen3-5-omni-flash",
    75.7,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmbench-en-dev-v1-1",
    "qwen3-5-omni-flash",
    88.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "simplevqa",
    "qwen3-5-omni-flash",
    54.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "charxiv",
    "qwen3-5-omni-flash",
    64.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "cc-ocr",
    "qwen3-5-omni-flash",
    80.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "ai2d-test",
    "qwen3-5-omni-flash",
    89,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmlongbench-doc",
    "qwen3-5-omni-flash",
    53.6,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "ocrbench",
    "qwen3-5-omni-flash",
    89.1,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "erqa",
    "qwen3-5-omni-flash",
    50,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "countbench",
    "qwen3-5-omni-flash",
    88.2,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "refcoco-avg",
    "qwen3-5-omni-flash",
    92.6,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "odinw13",
    "qwen3-5-omni-flash",
    46.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "embspatialbench",
    "qwen3-5-omni-flash",
    82.7,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "videomme",
    "qwen3-5-omni-flash",
    77,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mlvu-m-avg",
    "qwen3-5-omni-flash",
    81.9,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mvbench",
    "qwen3-5-omni-flash",
    70.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "lvbench",
    "qwen3-5-omni-flash",
    65.7,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmvu",
    "qwen3-5-omni-flash",
    62.7,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mme-videoocr",
    "qwen3-5-omni-flash",
    70.5,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "slake",
    "qwen3-5-omni-flash",
    73.1,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "pmc-vqa",
    "qwen3-5-omni-flash",
    58.7,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "medxpertqa-mm",
    "qwen3-5-omni-flash",
    44.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmmu",
    "qwen3-5-omni-plus",
    80.1,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmmu-pro",
    "qwen3-5-omni-plus",
    73.9,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mathvision",
    "qwen3-5-omni-plus",
    73,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mathvista-mini",
    "qwen3-5-omni-plus",
    86.1,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "dynamath",
    "qwen3-5-omni-plus",
    83.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "zerobench",
    "qwen3-5-omni-plus",
    5,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "zerobench-sub",
    "qwen3-5-omni-plus",
    34.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "realworldqa",
    "qwen3-5-omni-plus",
    84.1,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmstar",
    "qwen3-5-omni-plus",
    79.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmbench-en-dev-v1-1",
    "qwen3-5-omni-plus",
    92.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "simplevqa",
    "qwen3-5-omni-plus",
    65.3,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "charxiv",
    "qwen3-5-omni-plus",
    72.5,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "cc-ocr",
    "qwen3-5-omni-plus",
    83.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "ai2d-test",
    "qwen3-5-omni-plus",
    91.2,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmlongbench-doc",
    "qwen3-5-omni-plus",
    57.5,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "ocrbench",
    "qwen3-5-omni-plus",
    91.3,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "erqa",
    "qwen3-5-omni-plus",
    54.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "countbench",
    "qwen3-5-omni-plus",
    95.1,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "refcoco-avg",
    "qwen3-5-omni-plus",
    95,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "odinw13",
    "qwen3-5-omni-plus",
    49.5,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "embspatialbench",
    "qwen3-5-omni-plus",
    85.4,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "videomme",
    "qwen3-5-omni-plus",
    81.9,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mlvu-m-avg",
    "qwen3-5-omni-plus",
    86.8,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mvbench",
    "qwen3-5-omni-plus",
    79,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "lvbench",
    "qwen3-5-omni-plus",
    71.2,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmvu",
    "qwen3-5-omni-plus",
    67.5,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mme-videoocr",
    "qwen3-5-omni-plus",
    77,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "slake",
    "qwen3-5-omni-plus",
    84.7,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "pmc-vqa",
    "qwen3-5-omni-plus",
    62.7,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "medxpertqa-mm",
    "qwen3-5-omni-plus",
    54.7,
    "%",
    "Qwen3.5-Omni release · published setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmlu-pro",
    "qwen3-5-omni-flash",
    79.9,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmlu-redux",
    "qwen3-5-omni-flash",
    90,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "supergpqa",
    "qwen3-5-omni-flash",
    54.9,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "c-eval",
    "qwen3-5-omni-flash",
    86,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "ifeval",
    "qwen3-5-omni-flash",
    85.2,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "ifbench",
    "qwen3-5-omni-flash",
    38.4,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "aa-lcr",
    "qwen3-5-omni-flash",
    46,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "longbench-v2",
    "qwen3-5-omni-flash",
    46.4,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "gpqa",
    "qwen3-5-omni-flash",
    76.4,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "livecodebench-v6",
    "qwen3-5-omni-flash",
    56.6,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "hmmt-2025-11",
    "qwen3-5-omni-flash",
    59,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "imoanswerbench",
    "qwen3-5-omni-flash",
    51.5,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "bfcl-v4",
    "qwen3-5-omni-flash",
    55.3,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "tau2-bench",
    "qwen3-5-omni-flash",
    78,
    "%",
    "Qwen3.5-Omni release · no-thinking setting · airline fixes from Claude Opus 4.5 System Card",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmlu-pro",
    "qwen3-5-omni-plus",
    85.9,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "mmlu-redux",
    "qwen3-5-omni-plus",
    94.2,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "supergpqa",
    "qwen3-5-omni-plus",
    66.4,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "c-eval",
    "qwen3-5-omni-plus",
    92,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "ifeval",
    "qwen3-5-omni-plus",
    89.7,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "ifbench",
    "qwen3-5-omni-plus",
    52.6,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "aa-lcr",
    "qwen3-5-omni-plus",
    57,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "longbench-v2",
    "qwen3-5-omni-plus",
    59.6,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "gpqa",
    "qwen3-5-omni-plus",
    83.9,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "livecodebench-v6",
    "qwen3-5-omni-plus",
    65.6,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "hmmt-2025-11",
    "qwen3-5-omni-plus",
    84.4,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "imoanswerbench",
    "qwen3-5-omni-plus",
    65.5,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "bfcl-v4",
    "qwen3-5-omni-plus",
    63.3,
    "%",
    "Qwen3.5-Omni release · no-thinking setting",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "tau2-bench",
    "qwen3-5-omni-plus",
    81,
    "%",
    "Qwen3.5-Omni release · no-thinking setting · airline fixes from Claude Opus 4.5 System Card",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "tts-custom-seed-zh-wer",
    "qwen3-5-omni-plus",
    1.07,
    "%",
    "Qwen3.5-Omni release · custom voice stability · WER",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "tts-custom-seed-en-wer",
    "qwen3-5-omni-plus",
    1.35,
    "%",
    "Qwen3.5-Omni release · custom voice stability · WER",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "tts-custom-seed-hard-wer",
    "qwen3-5-omni-plus",
    6.24,
    "%",
    "Qwen3.5-Omni release · custom voice stability · WER",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "tts-custom-public-wer",
    "qwen3-5-omni-plus",
    2.06,
    "%",
    "Qwen3.5-Omni release · custom voice stability · WER",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "tts-custom-inhouse-wer",
    "qwen3-5-omni-plus",
    5.82,
    "%",
    "Qwen3.5-Omni release · custom voice stability · WER",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "voice-clone-public-wer",
    "qwen3-5-omni-plus",
    1.87,
    "%",
    "Qwen3.5-Omni release · voice clone stability · WER · 20-language public set",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "voice-clone-inhouse-wer",
    "qwen3-5-omni-plus",
    7.04,
    "%",
    "Qwen3.5-Omni release · voice clone stability · WER · 9-language in-house set",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "voice-clone-public-sim",
    "qwen3-5-omni-plus",
    0.79,
    "SIM",
    "Qwen3.5-Omni release · voice clone similarity · cosine similarity · 20-language public set",
    ""
  ],
  [
    [
      "qwen35-omni"
    ],
    "voice-clone-inhouse-sim",
    "qwen3-5-omni-plus",
    0.8,
    "SIM",
    "Qwen3.5-Omni release · voice clone similarity · cosine similarity · 9-language in-house set",
    ""
  ]
];
  for (const row of auditedRows) add(...row);

  // Preserve the first-party attribution conflict instead of silently moving
  // these four claims from A95B to Max or vice versa.
  const attributionNote = "Alibaba lifecycle page attributes this value to qwen3.8-2.4t-a95b; the A95B HF card is text-only and its benchmark table heads the same value under Qwen3.8-Max.";
  add(["alibaba-lifecycle"], "gpqa-diamond", "qwen3-8-2-4t-a95b", 92.6, "%", "lifecycle-page core-benchmark claim", attributionNote);
  add(["alibaba-lifecycle"], "paperbench", "qwen3-8-2-4t-a95b", 93.0, "%", "lifecycle-page core-benchmark claim", attributionNote);
  add(["alibaba-lifecycle"], "osworld-verified", "qwen3-8-2-4t-a95b", 86.1, "%", "lifecycle-page core-benchmark claim", attributionNote);
  add(["alibaba-lifecycle"], "babyvision", "qwen3-8-2-4t-a95b", 82.0, "%", "lifecycle-page core-benchmark claim · CI setting not stated", attributionNote);

  // Cross-harness points shown outside the Qwen3.7 main table.
  add(["qwen37"], "qwenclawbench", "qwen3-7-max", 68.5, "%", "Qwen3.7 release cross-harness chart · Claude Code");
  add(["qwen37"], "qwenclawbench", "qwen3-7-max", 70.7, "%", "Qwen3.7 release cross-harness chart · Hermes");
  add(["qwen37"], "coworkbench", "qwen3-7-max", 66.0, "%", "Qwen3.7 release cross-harness chart · Claude Code");
  add(["qwen37"], "coworkbench", "qwen3-7-max", 68.3, "%", "Qwen3.7 release cross-harness chart · Hermes");

  // The article's earlier OmniVideoBench comparison repeats the two accuracy
  // values from the benchmark tables, but also publishes a distinct efficiency
  // metric. Keep that metric without duplicating the accuracy observations.
  add(["qwen38-omni"], "omnivideobench-tokens-per-query", "qwen3-8-omni-flash", 145736, "tokens/query", "Static", "Official OmniVideoBench efficiency comparison.");
  add(["qwen38-omni"], "omnivideobench-tokens-per-query", "qwen3-8-omni-flash", 79117, "tokens/query", "Agent mode · Qwen Code", "Agentic mode preserves context across turns.");

  // The release-page overview image contains one additional AliMeeting-test
  // aggregate that is not printed in the HTML result tables. Footnote 4 in
  // the image defines it as 100 × [1 − (0.5 × DER + 0.5 × cpWER)].
  const aliMeetingOverviewNote = "Official launch overview image · footnote 4 formula: 100 × [1 − (0.5 × DER + 0.5 × cpWER)].";
  for (const [modelId, value] of [
    ["qwen3-8-omni-flash", 89.7],
    ["qwen3-5-omni-plus", 11.1],
    ["gemini-3-8-flash", 37.1],
    ["seed2-0-lite", 24.4],
    ["muse-spark-1-2", 6.8]
  ]) add(["qwen38-omni"], "alimeeting-summary-score", modelId, value, "%", "Official launch overview figure", aliMeetingOverviewNote);

  // Preserve the publisher's own disagreement. The release article states
  // 45.7%, which agrees with 145,736 -> 79,117; the official launch post says
  // 51.8%. Keeping both makes the conflict visible instead of normalizing it.
  add(["qwen38-omni"], "omnivideobench-token-reduction", "qwen3-8-omni-flash", 45.7, "%", "Static → Agent mode · Qwen Code · release article · 2026-09-18", "Official release article; reproducible from 145,736 → 79,117 tokens/query.");
  add(["qwen38-omni-x"], "omnivideobench-token-reduction", "qwen3-8-omni-flash", 51.8, "%", "Static → Agent mode · Qwen Code · official X post · 2026-09-18", "Official Qwen launch post; conflicts with the release article and its raw token counts.");

  setAudit("qwen38-hf", {
    status: "complete", auditedAt: "2026-09-20", expectedObservationCount: 151,
    benchmarkIds: [...new Set(observations.filter((observation) => observation.sourceIds.includes("qwen38-hf")).map((observation) => observation.benchmarkId))],
    note: "A95B 模型卡中以 Qwen3.8-Max 为表头的完整文本/Agent 表已逐格录入，共 151 个拆分后的数值；卡片没有把该表归到 A95B 本体。"
  });
  setAudit("qwen38", { status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20", targetModels: [
    { modelId: "qwen3-8-max", expectedObservationCount: 94 }
  ], note: "Qwen3.8-Max 目标模型列已完整：31 个文本/Agent 原始单元格和 55 个视觉/视频原始单元格均已录入并拆分为 94 条观测；视觉表比较列尚未全录。" });
  setAudit("qwen37", { status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20", targetModels: [
    { modelId: "qwen3-7-max", expectedObservationCount: 46 }
  ], note: "Qwen3.7-Max 目标模型主表列已完整，并保留 4 个额外跨 Harness 点；比较列尚未全录。5 月首发按纯文本版本登记。" });
  setAudit("qwen37-plus", { status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20", targetModels: [
    { modelId: "qwen3-7-plus", expectedObservationCount: 77 }
  ], note: "Qwen3.7-Plus 的 41 个文本/Agent 与 33 个多模态目标单元格已完整录入并拆分为 77 条观测；比较列尚未全录。" });
  setAudit("qwen38-flash-next", { status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20", targetModels: [
    { modelId: "qwen3-8-flash-next", expectedObservationCount: 27 },
    { modelId: "qwen3-8-flash-next-base", expectedObservationCount: 14 },
    { modelId: "qwen3-8-27b-base", expectedObservationCount: 14 },
    { modelId: "qwen3-7-plus-base", expectedObservationCount: 14 }
  ], note: "Flash-Next 后训练目标列和三组 Base 目标列已完整录入；后训练比较列尚未全录。" });
  setAudit("qwen38-flash-next-hf", { status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20", targetModels: [
    { modelId: "qwen3-8-flash-next", expectedObservationCount: 27 },
    { modelId: "qwen3-8-flash-next-base", expectedObservationCount: 14 },
    { modelId: "qwen3-8-27b-base", expectedObservationCount: 14 },
    { modelId: "qwen3-7-plus-base", expectedObservationCount: 14 }
  ], note: "模型卡中 Flash-Next 后训练目标列和 Base 表目标列已完整录入；比较列尚未全录。" });
  setAudit("qwen38-flash-next-report", { status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20", targetModels: [
    { modelId: "qwen3-8-flash-next-base", expectedObservationCount: 14 },
    { modelId: "qwen3-8-27b-base", expectedObservationCount: 14 },
    { modelId: "qwen3-7-plus-base", expectedObservationCount: 14 }
  ], note: "技术报告第 22 页 Table 11 的三组 Base 模型列已完整录入；其余训练与消融数值不属于模型能力排行榜。" });
  setAudit("qwen38-27b-hf", { status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20", targetModels: [
    { modelId: "qwen3-8-27b", expectedObservationCount: 30 }
  ], note: "Qwen3.8-27B 的 12 个文本/Agent 与 13 个多模态目标单元格已完整录入并拆分为 30 条观测；比较列尚未全录。" });
  setAudit("qwen35", { status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20", targetModels: [
    { modelId: "qwen3-5-397b-a17b", expectedObservationCount: 87 },
    { modelId: "qwen3-5-397b-a17b-base", expectedObservationCount: 18 }
  ], note: "Qwen3.5-397B-A17B 的 40 个文本/Agent、44 个多模态目标单元格及 18 个 Base 单元格已完整录入并拆分；比较列尚未全录。" });
  setAudit("qwen35-hf", { status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20", targetModels: [
    { modelId: "qwen3-5-397b-a17b", expectedObservationCount: 87 },
    { modelId: "qwen3-5-397b-a17b-base", expectedObservationCount: 18 }
  ], note: "模型卡中的 Qwen3.5-397B-A17B 后训练目标列和 Base 目标列已完整录入并拆分；比较列尚未全录。" });
  setAudit("qwen35-omni", { status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20", targetModels: [
    { modelId: "qwen3-5-omni-plus", expectedObservationCount: 92 },
    { modelId: "qwen3-5-omni-flash", expectedObservationCount: 83 }
  ], note: "六张结果表中的 Qwen3.5-Omni-Plus 目标列（82 个原始单元格）与前四表 Flash 目标列（73 个原始单元格）已完整录入并拆分；比较列尚未全录。" });
  const qwen35OmniBlogOnlyAggregates = new Set([
    "tts-custom-inhouse-wer", "tts-custom-public-wer", "tts-custom-seed-en-wer",
    "tts-custom-seed-hard-wer", "tts-custom-seed-zh-wer", "voice-clone-inhouse-sim",
    "voice-clone-inhouse-wer", "voice-clone-public-sim", "voice-clone-public-wer"
  ]);
  for (const observation of observations) {
    if (!observation.sourceIds.includes("qwen35-omni")) continue;
    if (!["qwen3-5-omni-plus", "qwen3-5-omni-flash"].includes(observation.modelId)) continue;
    if (qwen35OmniBlogOnlyAggregates.has(observation.benchmarkId)) continue;
    if (!observation.sourceIds.includes("qwen35-omni-report")) observation.sourceIds.push("qwen35-omni-report");
  }

  // Qwen3.5-Omni Technical Report v2, Tables 8–15. Keep every published
  // target-model cell independently addressable: language, translation
  // direction, metric, test-set scope, and generation mode are never folded
  // into slash-combined values. A dash in the paper remains absent data.
  const qwen35OmniReportBaseBenchmarkIds = [
    "aa-lcr", "ai2d-test", "av-speakerbench", "avut", "bfcl-v4", "c-eval", "cc-ocr", "charxiv", "countbench",
    "cv15-en-wer", "cv15-yue-wer", "cv15-zh-tw-wer", "cv15-zh-wer", "dailyomni", "dynamath", "embspatialbench",
    "erqa", "fleurs-asr-wer", "fleurs-s2tt-en", "fleurs-s2tt-zh", "fleurs-s2tt-zh-en", "gpqa", "hmmt-2025-11",
    "ifbench", "ifeval", "imoanswerbench", "kespeech-wer", "librispeech-clean-wer", "librispeech-other-wer",
    "livecodebench-v6", "longbench-v2", "lvbench", "mathvision", "mathvista-mini", "medxpertqa-mm", "mir1k-wer",
    "mlvu-m-avg", "mmar", "mmau", "mmbench-en-dev-v1-1", "mme-videoocr", "mmlongbench-doc", "mmlu-pro",
    "mmlu-redux", "mmmu", "mmmu-pro", "mmstar", "mmsu", "mmvu", "muchomusic-rul", "mvbench", "ocrbench",
    "odinw13", "omnicloze", "omnigaia", "opencpop-wer", "pmc-vqa", "qualcomm-interactive", "realworldqa",
    "refcoco-avg", "simplevqa", "slake", "songform-cn-accuracy", "songform-cn-hr-3f", "songform-cn-hr-5f",
    "songform-harmonix-accuracy", "songform-harmonix-hr-3f", "songform-harmonix-hr-5f", "speechrole", "supergpqa",
    "tau2-bench", "uro-bench-pro-oral", "uro-bench-pro-reasoning", "uro-bench-pro-understanding", "videomme",
    "videomme-audio", "voicebench", "wenetspeech-meeting-wer", "wenetspeech-net-wer", "wildspeech", "worldsense",
    "zerobench", "zerobench-sub"
  ];
  const qwen35OmniReportExpectedBenchmarks = {
    "qwen3-5-omni-plus": new Set(qwen35OmniReportBaseBenchmarkIds),
    "qwen3-5-omni-flash": new Set(qwen35OmniReportBaseBenchmarkIds)
  };
  const addReportTarget = (benchmarkId, modelId, value, unit, setting, note = "") => {
    add(["qwen35-omni-report"], benchmarkId, modelId, value, unit, setting, note);
    qwen35OmniReportExpectedBenchmarks[modelId].add(benchmarkId);
  };
  const parseReportRows = (text) => text.trim().split("\n").map((row) => row.split("|"));
  const reportSlug = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const reportLanguageSlug = (label) => ({ Chinese: "zh", English: "en" })[label] || reportSlug(label);
  const reportFamilies = new Map([
    ["seed-tts-zero-shot", { id: "seed-tts-zero-shot", name: "SEED-TTS · Zero-shot", variants: [] }],
    ["voice-clone-public", { id: "voice-clone-public", name: "Voice Clone · Public Multilingual", variants: [] }],
    ["voice-clone-inhouse", { id: "voice-clone-inhouse", name: "Voice Clone · In-house Multilingual", variants: [] }],
    ["cross-lingual-speech", { id: "cross-lingual-speech", name: "Cross-Lingual Speech Generation", variants: [] }],
    ["tts-custom-voice", { id: "tts-custom-voice", name: "Custom-Voice Speech Generation", variants: [] }],
    ["fleurs", { id: "fleurs", name: "FLEURS-60", variants: [] }]
  ]);
  const includeReportVariant = (familyId, benchmarkId, label) => {
    const family = reportFamilies.get(familyId);
    if (!family.variants.some((variant) => variant.benchmarkId === benchmarkId)) family.variants.push({ benchmarkId, label });
  };
  const addReportBenchmark = (familyId, id, name, label, direction, table) => {
    appendUnique(benchmarks, [{
      id, name, category: "音频", direction,
      description: `Qwen3.5-Omni Technical Report v2 · Table ${table}; language, direction, metric, and test-set scope are preserved in this view.`
    }]);
    includeReportVariant(familyId, id, label);
  };
  const reportSetting = (table, detail) => `Technical report v2 · Table ${table} · ${detail}`;

  // Existing release-page aggregates belong to the same families as the new
  // per-language report rows. Adding them here prevents duplicate nav entries.
  for (const [benchmarkId, label] of [
    ["voice-clone-public-wer", "20-language average · WER"],
    ["voice-clone-public-sim", "20-language average · SIM"]
  ]) includeReportVariant("voice-clone-public", benchmarkId, label);
  for (const [benchmarkId, label] of [
    ["voice-clone-inhouse-wer", "9-language average · WER"],
    ["voice-clone-inhouse-sim", "9-language average · SIM"]
  ]) includeReportVariant("voice-clone-inhouse", benchmarkId, label);
  for (const [benchmarkId, label] of [
    ["tts-custom-seed-zh-wer", "SEED · zh · WER"],
    ["tts-custom-seed-en-wer", "SEED · en · WER"],
    ["tts-custom-seed-hard-wer", "SEED · hard · WER"],
    ["tts-custom-public-wer", "Public multilingual average · WER"],
    ["tts-custom-inhouse-wer", "In-house multilingual average · WER"]
  ]) includeReportVariant("tts-custom-voice", benchmarkId, label);
  for (const [benchmarkId, label] of [
    ["fleurs-asr-wer", "ASR · 60-language aggregate"],
    ["fleurs-s2tt-bleu", "S2TT · Aggregate"],
    ["fleurs-s2tt-en", "S2TT · xx↔en aggregate"],
    ["fleurs-s2tt-zh", "S2TT · xx↔zh aggregate"],
    ["fleurs-s2tt-zh-en", "S2TT · xx↔zh/en aggregate"]
  ]) includeReportVariant("fleurs", benchmarkId, label);

  // Table 8 — the paper prints test-zh and test-en in one cell; split them.
  for (const [slug, language, value] of [
    ["zh", "Chinese", 0.99],
    ["en", "English", 1.26]
  ]) {
    const benchmarkId = `seed-tts-zero-shot-${slug}-wer`;
    addReportBenchmark("seed-tts-zero-shot", benchmarkId, `SEED-TTS · Zero-shot · ${language} WER`, `${language} · WER`, "lower", 8);
    addReportTarget(benchmarkId, "qwen3-5-omni-plus", value, "%", reportSetting(8, `SEED-TTS test-${slug} · zero-shot TTS · WER`));
  }

  // Table 9 — public 20-language zero-shot voice cloning.
  const voiceClonePublicRows = parseReportRows(`
Chinese|0.695|0.800
English|0.631|0.833
German|0.447|0.757
Italian|0.503|0.785
Portuguese|1.221|0.792
Spanish|0.862|0.797
Japanese|3.479|0.788
Korean|1.458|0.747
French|2.430|0.730
Russian|3.182|0.790
Thai|2.170|0.788
Indonesian|0.823|0.780
Arabic|2.602|0.745
Vietnamese|1.143|0.767
Turkish|0.938|0.747
Finnish|2.784|0.859
Polish|1.427|0.839
Hindi|6.444|0.797
Dutch|1.238|0.762
Czech|2.929|0.802`);
  for (const [language, wer, sim] of voiceClonePublicRows) {
    const slug = reportSlug(language);
    const werId = `voice-clone-public-${slug}-wer`;
    const simId = `voice-clone-public-${slug}-sim`;
    addReportBenchmark("voice-clone-public", werId, `Voice Clone · Public · ${language} WER`, `${language} · WER`, "lower", 9);
    addReportBenchmark("voice-clone-public", simId, `Voice Clone · Public · ${language} SIM`, `${language} · SIM`, "higher", 9);
    addReportTarget(werId, "qwen3-5-omni-plus", Number(wer), "%", reportSetting(9, `${language} · public multilingual TTS set · WER`));
    addReportTarget(simId, "qwen3-5-omni-plus", Number(sim), "SIM", reportSetting(9, `${language} · public multilingual TTS set · cosine speaker similarity`));
  }

  // Table 10 — internal nine-language zero-shot voice cloning.
  const voiceCloneInhouseRows = parseReportRows(`
Urdu|14.819|0.775
Tagalog|5.193|0.870
Swedish|3.760|0.822
Danish|3.636|0.775
Hebrew|7.860|0.760
Icelandic|10.244|0.764
Malay|3.142|0.794
Norwegian|3.613|0.825
Persian|11.113|0.800`);
  for (const [language, wer, sim] of voiceCloneInhouseRows) {
    const slug = reportSlug(language);
    const werId = `voice-clone-inhouse-${slug}-wer`;
    const simId = `voice-clone-inhouse-${slug}-sim`;
    addReportBenchmark("voice-clone-inhouse", werId, `Voice Clone · In-house · ${language} WER`, `${language} · WER`, "lower", 10);
    addReportBenchmark("voice-clone-inhouse", simId, `Voice Clone · In-house · ${language} SIM`, `${language} · SIM`, "higher", 10);
    addReportTarget(werId, "qwen3-5-omni-plus", Number(wer), "%", reportSetting(10, `${language} · internal FLEURS-derived set · WER`));
    addReportTarget(simId, "qwen3-5-omni-plus", Number(sim), "SIM", reportSetting(10, `${language} · internal FLEURS-derived set · cosine speaker similarity`));
  }

  // Table 11 — CV3-Eval cross-lingual voice cloning. The paper uses WER
  // for English targets and CER for every other target language.
  const crossLingualRows = parseReportRows(`
English|Chinese|4.86
Japanese|Chinese|3.55
Korean|Chinese|0.84
Chinese|English|2.18
Japanese|English|2.18
Korean|English|2.51
Chinese|Japanese|5.92
English|Japanese|5.12
Korean|Japanese|2.16
Chinese|Korean|4.03
English|Korean|3.72
Japanese|Korean|5.12`);
  for (const [sourceLanguage, targetLanguage, value] of crossLingualRows) {
    const metric = targetLanguage === "English" ? "WER" : "CER";
    const benchmarkId = `cross-lingual-speech-${reportSlug(sourceLanguage)}-to-${reportSlug(targetLanguage)}-${metric.toLowerCase()}`;
    addReportBenchmark("cross-lingual-speech", benchmarkId, `Cross-Lingual Speech · ${sourceLanguage}→${targetLanguage} ${metric}`, `${sourceLanguage}→${targetLanguage} · ${metric}`, "lower", 11);
    addReportTarget(benchmarkId, "qwen3-5-omni-plus", Number(value), "%", reportSetting(11, `CV3-Eval · ${sourceLanguage}→${targetLanguage} · ${metric}`));
  }

  // Table 12 — custom-voice generation. The first 20 languages are the
  // public multilingual set; the final nine are the internal set.
  const customVoiceRows = parseReportRows(`
public|Chinese|0.785
public|English|0.839
public|German|0.182
public|Italian|0.458
public|Portuguese|1.581
public|Spanish|0.768
public|Japanese|3.306
public|Korean|1.309
public|French|2.724
public|Russian|4.723
public|Thai|1.653
public|Indonesian|1.596
public|Arabic|3.183
public|Vietnamese|1.320
public|Turkish|1.309
public|Finnish|4.039
public|Polish|1.462
public|Hindi|6.776
public|Dutch|1.135
public|Czech|3.769
inhouse|Urdu|14.916
inhouse|Tagalog|5.090
inhouse|Swedish|3.588
inhouse|Danish|7.183
inhouse|Hebrew|7.680
inhouse|Icelandic|10.322
inhouse|Malay|3.738
inhouse|Norwegian|5.576
inhouse|Persian|12.140`);
  for (const [scope, language, value] of customVoiceRows) {
    const scopeLabel = scope === "public" ? "Public" : "In-house";
    const benchmarkId = `tts-custom-${scope}-${reportSlug(language)}-wer`;
    addReportBenchmark("tts-custom-voice", benchmarkId, `Custom Voice · ${scopeLabel} · ${language} WER`, `${scopeLabel} · ${language} · WER`, "lower", 12);
    addReportTarget(benchmarkId, "qwen3-5-omni-plus", Number(value), "%", reportSetting(12, `${scopeLabel.toLowerCase()} multilingual set · ${language} · WER`));
  }

  // Table 13 — FLEURS ASR. Chinese, Cantonese, Korean, Thai, Vietnamese,
  // and Japanese are italicized in the source table and therefore use CER;
  // every other language uses WER. The rounded mixed average is kept apart
  // from the more precise overview aggregate (6.55 / 10.75).
  const fleursCerLanguages = new Set(["Chinese", "Cantonese", "Korean", "Thai", "Vietnamese", "Japanese"]);
  const fleursAsrRows = parseReportRows(`
Chinese|2.9|2.9
English|3.2|3.7
Cantonese|2.2|3.1
Arabic|11.7|13.6
German|2.0|2.5
French|2.6|3.3
Spanish|2.2|2.4
Portuguese|2.1|2.2
Indonesian|1.6|2.4
Italian|0.8|1.0
Korean|1.7|2.1
Russian|3.1|3.6
Thai|2.8|3.2
Vietnamese|1.9|2.5
Japanese|1.9|2.5
Turkish|3.1|4.4
Hindi|9.7|9.9
Malay|2.7|4.2
Dutch|2.8|3.5
Urdu|20.8|31.9
Norwegian|3.9|5.2
Swedish|3.1|5.0
Danish|3.5|5.3
Hebrew|12.5|16.6
Finnish|2.4|4.5
Polish|1.9|3.1
Icelandic|3.6|8.9
Czech|2.6|4.5
Filipino|5.1|7.1
Persian|12.0|12.1
Greek|4.7|8.1
Afrikaans|10.6|13.7
Asturian|15.8|25.9
Belarusian|6.7|12.2
Bulgarian|6.2|10.7
Bengali|16.2|19.8
Bosnian|5.4|9.5
Catalan|2.8|6.3
Cebuano|10.5|16.6
Estonian|6.7|16.6
Galician|5.0|8.6
Gujarati|13.9|18.4
Croatian|5.4|9.0
Hungarian|4.9|10.6
Javanese|11.8|18.3
Kazakh|6.3|16.6
Kannada|16.0|23.8
Kyrgyz|10.0|19.7
Latvian|6.7|17.8
Macedonian|4.1|7.9
Malayalam|18.8|27.0
Marathi|16.3|23.6
Punjabi|13.7|24.6
Romanian|3.2|6.1
Slovak|3.3|5.5
Slovenian|6.1|14.3
Swahili|9.4|17.5
Tajik|10.0|41.1
Azerbaijani|7.2|13.0
Ukrainian|3.2|5.4
Average|6.6|10.8`);
  for (const [language, plus, flash] of fleursAsrRows) {
    const metric = language === "Average" ? "mixed WER/CER" : (fleursCerLanguages.has(language) ? "CER" : "WER");
    const benchmarkId = language === "Average" ? "fleurs-asr-mixed-average-v2" : `fleurs-asr-${reportSlug(language)}-${metric.toLowerCase()}`;
    const label = language === "Average" ? "ASR · 60-language average · WER/CER (rounded)" : `ASR · ${language} · ${metric}`;
    addReportBenchmark("fleurs", benchmarkId, `FLEURS · ${label}`, label, "lower", 13);
    const detail = language === "Average" ? "60-language mixed WER/CER average · one-decimal table value" : `${language} · ${metric}`;
    addReportTarget(benchmarkId, "qwen3-5-omni-plus", Number(plus), "%", reportSetting(13, detail));
    addReportTarget(benchmarkId, "qwen3-5-omni-flash", Number(flash), "%", reportSetting(13, detail));
  }

  // Table 14 — speech translation from English or Chinese into each target.
  const fleursIntoOtherRows = parseReportRows(`
Chinese|47.8|46.6|–|–
English|–|–|32.2|31.2
Cantonese|40.1|37.3|36.7|35.9
Arabic|31.1|28.2|16.1|13.9
German|43.2|39.6|23.2|20.8
French|50.9|48.8|30.7|28.8
Spanish|29.1|28.9|22.2|20.4
Portuguese|51.2|48.6|28.5|26.8
Indonesian|45.3|43.7|28.8|26.9
Italian|32.7|30.7|23.1|21.1
Korean|33.9|31.8|25.1|23.4
Russian|33.8|31.8|21.5|18.9
Thai|65.4|62.9|58.0|55.5
Vietnamese|43.0|41.8|31.6|30.5
Japanese|53.2|50.6|45.6|41.6
Turkish|30.4|27.6|16.8|14.6
Hindi|33.1|29.1|19.1|14.3
Malay|39.6|37.2|24.1|21.7
Dutch|30.1|28.2|21.0|18.8
Urdu|25.0|22.1|15.5|8.6
Norwegian|35.3|32.8|20.3|17.8
Swedish|47.5|44.1|25.4|23.0
Danish|48.4|45.2|25.7|22.8
Hebrew|36.4|29.9|18.2|14.5
Finnish|30.1|26.0|18.1|15.3
Polish|25.2|22.5|17.5|15.0
Icelandic|28.5|27.2|16.2|13.5
Czech|35.9|32.5|20.4|18.1
Filipino|35.0|32.0|22.3|19.0
Persian|30.7|27.3|19.5|16.4
Greek|30.0|27.8|18.4|15.9
Asturian|32.4|27.9|20.4|16.2
Belarusian|16.4|14.7|12.6|10.8
Bulgarian|45.0|40.7|25.6|23.0
Bengali|18.6|15.7|10.6|9.2
Bosnian|37.5|34.0|21.4|18.6
Catalan|43.9|41.5|26.6|17.2
Cebuano|28.5|12.7|19.0|5.6
Estonian|30.8|26.3|18.9|13.6
Galician|37.4|35.4|23.9|22.0
Gujarati|23.8|20.9|14.3|10.8
Croatian|33.3|30.7|21.3|18.5
Hungarian|29.5|24.9|18.8|15.8
Javanese|26.8|24.4|16.5|14.8
Kazakh|24.9|21.1|15.0|12.4
Kannada|20.0|17.0|11.7|6.9
Kyrgyz|15.3|12.6|10.4|7.8
Latvian|36.1|31.0|21.9|17.8
Macedonian|38.1|34.0|22.3|20.1
Malayalam|19.3|11.1|10.4|5.2
Marathi|17.7|11.6|11.3|8.1
Punjabi|26.1|23.1|15.7|8.9
Romanian|42.0|39.9|25.6|22.8
Slovak|35.3|31.4|19.6|16.4
Slovenian|32.8|28.5|20.1|17.7
Swahili|36.3|30.9|20.4|9.3
Tajik|23.8|18.3|14.6|10.9
Azerbaijani|13.7|9.8|11.5|9.7
Ukrainian|31.7|29.2|19.5|15.0
Average|33.8|30.4|21.4|18.1`);
  for (const [language, enPlus, enFlash, zhPlus, zhFlash] of fleursIntoOtherRows) {
    const targetSlug = language === "Average" ? "average" : reportLanguageSlug(language);
    for (const [sourceSlug, sourceLabel, plus, flash] of [
      ["en", "English", enPlus, enFlash],
      ["zh", "Chinese", zhPlus, zhFlash]
    ]) {
      if (plus === "–") continue;
      const benchmarkId = `fleurs-s2tt-${sourceSlug}-to-${targetSlug}-bleu`;
      const directionLabel = language === "Average" ? `${sourceLabel}→other · average` : `${sourceLabel}→${language}`;
      const label = `S2TT · ${directionLabel} · BLEU`;
      addReportBenchmark("fleurs", benchmarkId, `FLEURS · ${label}`, label, "higher", 14);
      const tableLabel = ((sourceSlug === "en" && targetSlug === "zh") || (sourceSlug === "zh" && targetSlug === "en")) ? "14 & 15" : "14";
      addReportTarget(benchmarkId, "qwen3-5-omni-plus", Number(plus), "BLEU", reportSetting(tableLabel, directionLabel));
      addReportTarget(benchmarkId, "qwen3-5-omni-flash", Number(flash), "BLEU", reportSetting(tableLabel, directionLabel));
    }
  }

  // Table 15 — speech translation from each source into English or Chinese.
  const fleursFromOtherRows = parseReportRows(`
Chinese|32.2|31.2|–|–
English|–|–|47.8|46.6
Cantonese|30.3|29.9|36.8|37.5
Arabic|42.9|40.0|40.2|37.3
German|44.6|44.1|43.3|42.8
French|43.5|42.0|41.6|40.3
Spanish|32.3|31.3|38.8|38.5
Portuguese|49.4|48.2|43.6|41.8
Indonesian|45.7|43.1|43.5|41.4
Italian|34.4|31.9|40.8|39.5
Korean|34.1|32.4|39.9|37.5
Russian|38.6|37.2|41.7|39.5
Thai|34.1|32.4|40.2|37.9
Vietnamese|36.4|34.9|38.7|36.3
Japanese|30.4|29.2|38.0|35.7
Turkish|40.3|39.1|41.8|40.3
Hindi|38.8|36.2|38.9|36.9
Malay|42.9|41.1|41.0|39.5
Dutch|33.3|32.2|40.1|38.5
Urdu|35.5|31.5|37.2|33.8
Norwegian|43.5|42.1|42.2|39.6
Swedish|47.2|45.2|42.9|40.7
Danish|45.4|44.0|43.4|41.1
Hebrew|39.7|36.4|36.7|34.1
Finnish|36.9|35.0|40.8|38.7
Polish|32.1|30.5|38.4|36.0
Icelandic|31.5|27.5|38.2|31.8
Czech|42.1|39.3|40.6|39.4
Filipino|42.7|40.9|41.0|38.0
Persian|40.2|36.8|40.2|37.0
Greek|36.0|32.5|38.0|32.8
Asturian|37.0|35.1|37.7|34.0
Belarusian|23.1|19.9|33.3|31.2
Bulgarian|39.6|36.0|40.9|36.6
Bengali|32.0|27.6|35.8|32.4
Bosnian|43.1|40.8|41.5|39.1
Catalan|46.6|42.3|42.2|38.9
Cebuano|37.3|26.3|34.0|26.5
Estonian|35.7|28.3|38.0|32.2
Galician|40.8|38.6|40.9|39.1
Gujarati|33.4|28.3|35.8|31.4
Croatian|39.5|36.3|40.0|37.7
Hungarian|35.5|29.6|39.1|33.9
Javanese|35.9|28.4|34.9|28.3
Kazakh|34.4|26.9|37.1|31.4
Kannada|26.4|19.8|32.3|26.1
Kyrgyz|22.2|17.1|29.9|24.8
Latvian|33.7|25.2|37.1|30.0
Macedonian|43.3|39.6|41.6|38.0
Malayalam|31.2|25.7|36.1|31.5
Marathi|33.5|25.7|34.6|29.4
Punjabi|33.0|26.9|35.1|29.9
Romanian|43.5|39.7|42.0|38.7
Slovak|39.7|38.4|39.2|38.1
Slovenian|31.7|26.5|34.5|30.1
Swahili|35.0|27.4|33.9|26.8
Tajik|33.9|29.0|36.7|32.7
Azerbaijani|25.0|22.0|33.4|30.5
Ukrainian|42.0|40.1|41.7|39.7
Average|37.0|33.5|38.9|35.7`);
  for (const [language, enPlus, enFlash, zhPlus, zhFlash] of fleursFromOtherRows) {
    const sourceSlug = language === "Average" ? "average" : reportLanguageSlug(language);
    for (const [targetSlug, targetLabel, plus, flash] of [
      ["en", "English", enPlus, enFlash],
      ["zh", "Chinese", zhPlus, zhFlash]
    ]) {
      if (plus === "–") continue;
      // English→Chinese and Chinese→English are printed identically in both
      // Tables 14 and 15. Table 14 already records them with dual provenance.
      if ((sourceSlug === "en" && targetSlug === "zh") || (sourceSlug === "zh" && targetSlug === "en")) continue;
      const benchmarkId = `fleurs-s2tt-${sourceSlug}-to-${targetSlug}-bleu`;
      const directionLabel = language === "Average" ? `other→${targetLabel} · average` : `${language}→${targetLabel}`;
      const label = `S2TT · ${directionLabel} · BLEU`;
      addReportBenchmark("fleurs", benchmarkId, `FLEURS · ${label}`, label, "higher", 15);
      addReportTarget(benchmarkId, "qwen3-5-omni-plus", Number(plus), "BLEU", reportSetting(15, directionLabel));
      addReportTarget(benchmarkId, "qwen3-5-omni-flash", Number(flash), "BLEU", reportSetting(15, directionLabel));
    }
  }

  for (const family of reportFamilies.values()) appendFamily(family);

  setAudit("qwen35-omni-report", {
    status: "target-complete", scopeLabel: "目标模型列已核", auditedAt: "2026-09-20",
    targetModels: [
      { modelId: "qwen3-5-omni-plus", expectedObservationCount: 479, benchmarkIds: [...qwen35OmniReportExpectedBenchmarks["qwen3-5-omni-plus"]] },
      { modelId: "qwen3-5-omni-flash", expectedObservationCount: 378, benchmarkIds: [...qwen35OmniReportExpectedBenchmarks["qwen3-5-omni-flash"]] }
    ],
    note: "技术报告 v2 Tables 4–15 的 Qwen3.5-Omni-Plus 与 Flash 目标列已完整录入：Tables 4–7 的 166 条结果与发布博客逐项一致并保留共同来源；Tables 8–15 新增 691 条非重复的逐语言、逐方向、逐指标观测。复合单元格均已拆分，破折号不伪造为零；Tables 14/15 重复印刷的 English→Chinese 与 Chinese→English 相同单元格各归并一次并在 setting 标注双表。Table 13 的逐语言 WER/CER 及一位小数平均值与概览表中的更精确聚合值分别保留。系统 latency、throughput、支持语言数量及训练/消融统计不属于能力排行榜，明确排除。比较模型列尚未全录。"
  });
  setAudit("qwen35-github", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方仓库的 Benchmark 章节链接回模型卡与发布文章，没有独立新增成绩表。" });
  setAudit("alibaba-lifecycle", { status: "partial", auditedAt: "2026-09-20", note: "版本生命周期元数据已核；页面另将 4 个核心成绩归到 A95B，与 HF 卡片表头存在归属冲突，已作为独立证据保留。页面覆盖的其他历史模型尚未逐项录入。" });
  setAudit("qwen38-omni-model-info", {
    status: "metadata-only", auditedAt: "2026-09-20",
    note: "Alibaba Cloud Model Studio 精确模型页已核：文本/图像/音频/视频输入、文本输出、1M context、工具调用与缓存等元数据；页面没有 Benchmark 成绩表。"
  });
  setAudit("qwen38-omni-qwencloud", {
    status: "metadata-only", auditedAt: "2026-09-20",
    note: "QwenCloud 官方模型页及 Compare 视图已核：模态、上下文、价格、限流和工具能力；没有 Benchmark 成绩表。"
  });
  setAudit("qwen38-omni-x", {
    status: "target-complete", auditedAt: "2026-09-20",
    targetModels: [{ modelId: "qwen3-8-omni-flash", expectedObservationCount: 1, benchmarkIds: ["omnivideobench-token-reduction"] }],
    note: "官方发布帖唯一可作为同一 Benchmark 效率指标的数值为 OmniVideoBench token 降幅 51.8%，已保留并与博客的 45.7% 并列显示。帖子另写的 +19.5 points 是跨 WildClawBench-MM 与 UniClawBench 的营销聚合增幅，不作为单一 Benchmark 排名项。"
  });

  const omniAudit = sourceAudits.find((audit) => audit.sourceId === "qwen38-omni");
  const omniBenchmarkIds = [...new Set(observations
    .filter((observation) => observation.sourceIds.includes("qwen38-omni"))
    .map((observation) => observation.benchmarkId))];
  if (omniAudit) Object.assign(omniAudit, {
    status: "complete", auditedAt: "2026-09-20", expectedObservationCount: 310,
    benchmarkIds: omniBenchmarkIds,
    targetModelId: "qwen3-8-omni-flash", expectedTargetObservationCount: 68,
    targetBenchmarkIds: omniBenchmarkIds,
    note: "发布页四个 Benchmark 区块、OmniVideoBench 效率表、总览图中独有的 AliMeeting-test 汇总值及正文 token 降幅均已核，共 310 条非重复 observation，其中目标模型 68 条。总览图其余成绩与正文表重复，不重复录入。Realtime API 的 TPS/TTFT/RTF、价格和语言数量不是模型 Benchmark；WenetSpeech-Chuan 25.79→15.30 是 Qwen2.5-Omni-3B 微调案例，不冒充 Qwen3.8-Omni-Flash 成绩；Vision 脚注提到 RecreationBench / OSWorld 2.0，但公开表无分数，未臆造。HF 与 ModelScope 精确模型页均为 404；Qwen GitHub 仅有插件引用，未发现独立成绩表或技术报告；Model Studio 与 QwenCloud 页面仅提供元数据。Cross-check: current SkillsBench 1.1, PinchBench v2, WildClawBench, QwenClawBench v1.1, Workspace-Bench-Lite, Claw-Eval v1.1, and RNG-Bench leaderboards contain no Qwen3.8-Omni-Flash row, so these scores remain publisher-reported."
  });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
