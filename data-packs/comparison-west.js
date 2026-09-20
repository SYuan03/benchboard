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
    Object.assign(model, values);
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

  appendUnique(sources, [
    { id: "openai-gptoss-launch", vendorId: "openai", publisher: "OpenAI", date: "2025-08-05", tier: "official", title: "Introducing gpt-oss", url: "https://openai.com/index/introducing-gpt-oss/" },
    { id: "openai-gptoss-report", vendorId: "openai", publisher: "OpenAI", date: "2025-08-05", tier: "official", title: "gpt-oss-120b & gpt-oss-20b Model Card", url: "https://arxiv.org/abs/2508.10925" },
    { id: "openai-gptoss-120b-hf", vendorId: "openai", publisher: "OpenAI", date: "2025-08-05", tier: "official", title: "gpt-oss-120b — Official Model Card", url: "https://huggingface.co/openai/gpt-oss-120b" },
    { id: "openai-gptoss-20b-hf", vendorId: "openai", publisher: "OpenAI", date: "2025-08-05", tier: "official", title: "gpt-oss-20b — Official Model Card", url: "https://huggingface.co/openai/gpt-oss-20b" },
    { id: "openai-gptoss-github", vendorId: "openai", publisher: "OpenAI", date: "2025-08-05", tier: "official", title: "gpt-oss — Official GitHub Repository", url: "https://github.com/openai/gpt-oss" }
  ]);

  patchModel("gpt-oss-120b", {
    name: "gpt-oss-120b",
    releaseDate: "2025-08-05",
    modality: "language",
    modalityDetail: "文本 → 文本与工具调用；不支持图像、音频或视频输入",
    context: "131,072",
    access: "开放权重（Apache 2.0）",
    sourceId: "openai-gptoss-120b-hf",
    referenceSourceIds: ["openai-gptoss-launch", "openai-gptoss-report", "openai-gptoss-github"],
    scoreStatus: undefined,
    summary: "OpenAI 开放权重推理模型；117B 总参数、5.1B 激活参数，支持 low/medium/high 三档推理强度。"
  });
  patchModel("gpt-oss-20b", {
    name: "gpt-oss-20b",
    releaseDate: "2025-08-05",
    modality: "language",
    modalityDetail: "文本 → 文本与工具调用；不支持图像、音频或视频输入",
    context: "131,072",
    access: "开放权重（Apache 2.0）",
    sourceId: "openai-gptoss-20b-hf",
    referenceSourceIds: ["openai-gptoss-launch", "openai-gptoss-report", "openai-gptoss-github"],
    scoreStatus: undefined,
    summary: "OpenAI 开放权重推理模型；21B 总参数、3.6B 激活参数，支持 low/medium/high 三档推理强度。"
  });

  appendUnique(benchmarks, [
    { id: "aime-2024", name: "AIME 2024", category: "数学", direction: "higher", description: "AIME 2024 竞赛数学评测；工具与推理强度写入 setting。" },
    { id: "tau-bench-retail", name: "τ-bench Retail", category: "Agent / 工作", direction: "higher", description: "原始 τ-bench 零售工具调用任务；不与 τ²-bench 合并。" },
    { id: "tau-bench-airline", name: "τ-bench Airline", category: "Agent / 工作", direction: "higher", description: "原始 τ-bench 航空工具调用任务；不与 τ²-bench 合并。" }
  ]);
  if (!benchmarkFamilies.some((item) => item.id === "tau-bench-family")) {
    benchmarkFamilies.push({
      id: "tau-bench-family",
      name: "τ-bench",
      variants: [
        { benchmarkId: "tau-bench-retail", label: "Retail" },
        { benchmarkId: "tau-bench-airline", label: "Airline" }
      ]
    });
  }

  const report = ["openai-gptoss-report"];
  const reasoningLevels = ["low", "medium", "high"];
  const modelSeries = {
    "gpt-oss-120b": {
      "aime-2024:no-tools": [56.3, 80.4, 95.8],
      "aime-2024:with-tools": [75.4, 87.9, 96.6],
      "aime-2025:no-tools": [50.4, 80.0, 92.5],
      "aime-2025:with-tools": [72.9, 91.6, 97.9],
      "gpqa-diamond:no-tools": [67.1, 73.1, 80.1],
      "gpqa-diamond:with-tools": [68.1, 73.5, 80.9],
      "hle:no-tools": [5.2, 8.6, 14.9],
      "hle-tools:with-tools": [9.1, 11.3, 19.0],
      "mmlu:published": [85.9, 88.0, 90.0],
      "swe-bench-verified:published": [47.9, 52.6, 62.4],
      "tau-bench-retail:functions": [49.4, 62.0, 67.8],
      "tau-bench-airline:functions": [42.6, 48.6, 49.2],
      "aider-polyglot:published": [24.0, 34.2, 44.4],
      "mmmlu:average": [74.1, 79.3, 81.3],
      "healthbench:published": [53.0, 55.9, 57.6],
      "healthbench-hard:published": [22.8, 26.9, 30.0],
      "healthbench-consensus:published": [90.6, 90.8, 89.9],
      "codeforces-rating:no-tools": [1595, 2205, 2463],
      "codeforces-rating:with-tools": [1653, 2365, 2622]
    },
    "gpt-oss-20b": {
      "aime-2024:no-tools": [42.1, 80.0, 92.1],
      "aime-2024:with-tools": [61.2, 86.0, 96.0],
      "aime-2025:no-tools": [37.1, 72.1, 91.7],
      "aime-2025:with-tools": [57.5, 90.4, 98.7],
      "gpqa-diamond:no-tools": [56.8, 66.0, 71.5],
      "gpqa-diamond:with-tools": [58.0, 67.1, 74.2],
      "hle:no-tools": [4.2, 7.0, 10.9],
      "hle-tools:with-tools": [6.3, 8.8, 17.3],
      "mmlu:published": [80.4, 84.0, 85.3],
      "swe-bench-verified:published": [37.4, 53.2, 60.7],
      "tau-bench-retail:functions": [35.0, 47.3, 54.8],
      "tau-bench-airline:functions": [32.0, 42.6, 38.0],
      "aider-polyglot:published": [16.6, 26.6, 34.2],
      "mmmlu:average": [67.0, 73.5, 75.7],
      "healthbench:published": [40.4, 41.8, 42.5],
      "healthbench-hard:published": [9.0, 12.9, 10.8],
      "healthbench-consensus:published": [84.9, 83.0, 82.6],
      "codeforces-rating:no-tools": [1366, 1998, 2230],
      "codeforces-rating:with-tools": [1251, 2064, 2516]
    }
  };

  const settingSuffix = {
    "no-tools": "no tools",
    "with-tools": "with tools; Table 3 does not name the exact tool",
    functions: "developer functions",
    average: "14-language average",
    published: "published setting; Table 3 does not further specify tool access"
  };
  Object.entries(modelSeries).forEach(([modelId, series]) => {
    Object.entries(series).forEach(([key, values]) => {
      const separator = key.indexOf(":");
      const benchmarkId = key.slice(0, separator);
      const mode = key.slice(separator + 1);
      values.forEach((value, index) => {
        const unit = benchmarkId === "codeforces-rating" ? "Rating" : "%";
        add(
          report,
          benchmarkId,
          modelId,
          value,
          unit,
          `official model card Table 3 · reasoning ${reasoningLevels[index]} · ${settingSuffix[mode]} · pass@1`
        );
      });
    });
  });

  const mmmlu = {
    Arabic: { "gpt-oss-120b": [75.0, 80.4, 82.7], "gpt-oss-20b": [65.6, 73.4, 76.3] },
    Bengali: { "gpt-oss-120b": [71.5, 78.3, 80.9], "gpt-oss-20b": [68.3, 74.9, 77.1] },
    Chinese: { "gpt-oss-120b": [77.9, 82.1, 83.6], "gpt-oss-20b": [72.1, 78.0, 79.4] },
    French: { "gpt-oss-120b": [79.6, 83.3, 84.6], "gpt-oss-20b": [73.2, 78.6, 80.2] },
    German: { "gpt-oss-120b": [78.6, 81.7, 83.0], "gpt-oss-20b": [71.4, 77.2, 78.7] },
    Hindi: { "gpt-oss-120b": [74.2, 80.0, 82.2], "gpt-oss-20b": [70.2, 76.6, 78.8] },
    Indonesian: { "gpt-oss-120b": [78.3, 82.8, 84.3], "gpt-oss-20b": [71.2, 77.4, 79.5] },
    Italian: { "gpt-oss-120b": [79.5, 83.7, 85.0], "gpt-oss-20b": [73.6, 79.0, 80.5] },
    Japanese: { "gpt-oss-120b": [77.0, 82.0, 83.5], "gpt-oss-20b": [70.4, 76.9, 78.8] },
    Korean: { "gpt-oss-120b": [75.2, 80.9, 82.9], "gpt-oss-20b": [69.8, 75.7, 77.6] },
    Portuguese: { "gpt-oss-120b": [80.0, 83.3, 85.3], "gpt-oss-20b": [73.3, 79.2, 80.5] },
    Spanish: { "gpt-oss-120b": [80.6, 84.6, 85.9], "gpt-oss-20b": [75.0, 79.7, 81.2] },
    Swahili: { "gpt-oss-120b": [59.9, 69.3, 72.3], "gpt-oss-20b": [46.2, 56.6, 60.7] },
    Yoruba: { "gpt-oss-120b": [49.7, 58.1, 62.4], "gpt-oss-20b": [38.4, 45.8, 50.1] }
  };
  Object.entries(mmmlu).forEach(([language, byModel]) => {
    Object.entries(byModel).forEach(([modelId, values]) => {
      values.forEach((value, index) => add(
        report,
        "mmmlu",
        modelId,
        value,
        "%",
        `official model card Table 2 · ${language} · reasoning ${reasoningLevels[index]} · translated-answer parser`
      ));
    });
  });

  const targetBenchmarkIds = [
    "aider-polyglot", "aime-2024", "aime-2025", "codeforces-rating",
    "gpqa-diamond", "healthbench", "healthbench-consensus", "healthbench-hard",
    "hle", "hle-tools", "mmlu", "mmmlu", "swe-bench-verified",
    "tau-bench-airline", "tau-bench-retail"
  ];
  upsertAudit("openai-gptoss-report", {
    status: "target-complete",
    scopeLabel: "能力评测 Table 2–3 的两个目标模型已逐格录入",
    auditedAt: "2026-09-21",
    targetModels: ["gpt-oss-120b", "gpt-oss-20b"].map((modelId) => ({
      modelId,
      expectedObservationCount: 99,
      benchmarkIds: targetBenchmarkIds
    })),
    note: "Table 2 的 14 种 MMMLU 语言 × 3 推理档，以及 Table 3 的 19 行 × 3 推理档全部录入；安全、偏见、越狱与 Preparedness 风险评测不混入通用能力榜。"
  });
  upsertAudit("openai-gptoss-launch", {
    status: "partial",
    auditedAt: "2026-09-21",
    note: "发布页正文、模型定位与公开评测范围已核；能力数值统一引用更完整且带三档推理明细的官方模型卡，不把页面中的定性比较重复伪装成独立分数。"
  });
  upsertAudit("openai-gptoss-120b-hf", {
    status: "metadata-only",
    auditedAt: "2026-09-21",
    note: "官方 HF 卡提供权重、许可证、参数规模、上下文与模型卡链接；当前卡片未重复列出能力分数表。"
  });
  upsertAudit("openai-gptoss-20b-hf", {
    status: "metadata-only",
    auditedAt: "2026-09-21",
    note: "官方 HF 卡提供权重、许可证、参数规模、上下文与模型卡链接；当前卡片未重复列出能力分数表。"
  });
  upsertAudit("openai-gptoss-github", {
    status: "metadata-only",
    auditedAt: "2026-09-21",
    note: "官方仓库用于实现、推理与工具说明；能力表以官方模型卡为准。"
  });

  // GPT-5.4 mini / nano: every unique cell from the official launch-page
  // capability tables. The five-row overview repeats rows from the detailed
  // sections, so repeated cells are stored once rather than double-counted.
  appendUnique(sources, [
    { id: "openai-gpt54-mini-nano", vendorId: "openai", publisher: "OpenAI", date: "2026-03-17", tier: "official", title: "Introducing GPT-5.4 mini and nano", url: "https://openai.com/index/introducing-gpt-5-4-mini-and-nano/" },
    { id: "openai-gpt54-mini-docs", vendorId: "openai", publisher: "OpenAI Developers", date: "2026-03-17", tier: "official", title: "GPT-5.4 Mini Model", url: "https://developers.openai.com/api/docs/models/gpt-5.4-mini" },
    { id: "openai-gpt54-nano-docs", vendorId: "openai", publisher: "OpenAI Developers", date: "2026-03-17", tier: "official", title: "GPT-5.4 nano Model", url: "https://developers.openai.com/api/docs/models/gpt-5.4-nano" },
    { id: "openai-gpt54-mini-safety", vendorId: "openai", publisher: "OpenAI Deployment Safety Hub", date: "2026-03-17", tier: "official", title: "GPT-5.4 mini System Card Addendum", url: "https://deploymentsafety.openai.com/gpt-5-4-thinking/appendix-gpt-5.4-mini" }
  ]);
  patchModel("gpt-5-4-mini", {
    releaseDate: "2026-03-17",
    modality: "vision",
    modalityDetail: "文本、图像 → 文本；支持工具、函数调用、Web/File Search、Computer Use 与 Skills；不支持音频或视频输入",
    context: "400K",
    access: "闭源 API / Codex / ChatGPT",
    sourceId: "openai-gpt54-mini-nano",
    referenceSourceIds: ["openai-gpt54-mini-docs", "openai-gpt54-mini-safety"],
    scoreStatus: undefined,
    summary: "GPT-5.4 小型视觉语言模型，面向高吞吐编码、子 Agent 与计算机操作。"
  });
  patchModel("gpt-5-4-nano", {
    releaseDate: "2026-03-17",
    modality: "vision",
    modalityDetail: "文本、图像 → 文本；支持工具与函数调用；不支持音频或视频输入",
    context: "400K",
    access: "闭源 API",
    sourceId: "openai-gpt54-mini-nano",
    referenceSourceIds: ["openai-gpt54-nano-docs", "openai-gpt54-mini-safety"],
    scoreStatus: undefined,
    summary: "GPT-5.4 系列最小模型，面向分类、抽取、排序与轻量编码子 Agent。"
  });

  const gpt54SmallRows = [
    ["swe-bench-pro", 54.4, 52.4, "%", "Public"],
    ["terminal-bench-2-0-unspecified-harness", 60.0, 46.3, "%", "publisher did not name the harness"],
    ["mcp-atlas", 57.7, 56.1, "%", "published setting"],
    ["toolathlon", 42.9, 35.5, "%", "published setting"],
    ["tau2-telecom", 93.4, 92.5, "%", "telecom domain"],
    ["gpqa-diamond", 88.0, 82.8, "%", "published setting"],
    ["hle-tools", 41.5, 37.7, "%", "with tool"],
    ["hle", 28.2, 24.3, "%", "without tools"],
    ["osworld-verified", 72.1, 39.0, "%", "published setting"],
    ["mmmu-pro", 78.0, 69.5, "%", "with Python"],
    ["mmmu-pro", 76.6, 66.1, "%", "without Python"],
    ["omnidocbench", 0.1263, 0.2419, "NED", "OmniDocBench 1.5 · no tools · reasoning_effort none · overall edit distance"],
    ["mrcr-v2-8needle", 47.7, 44.2, "%", "8-needle · 64K–128K"],
    ["mrcr-v2-8needle", 33.6, 33.1, "%", "8-needle · 128K–256K"],
    ["graphwalks-bfs", 76.3, 73.4, "%", "0K–128K"],
    ["graphwalks-parents", 71.5, 50.8, "%", "0K–128K · accuracy"]
  ];
  gpt54SmallRows.forEach(([benchmarkId, mini, nano, unit, detail]) => {
    add(["openai-gpt54-mini-nano"], benchmarkId, "gpt-5-4-mini", mini, unit, `xhigh · ${detail}`);
    add(["openai-gpt54-mini-nano"], benchmarkId, "gpt-5-4-nano", nano, unit, `xhigh · ${detail}`);
  });
  const gpt54SmallBenchmarks = [...new Set(gpt54SmallRows.map(([benchmarkId]) => benchmarkId))];
  upsertAudit("openai-gpt54-mini-nano", {
    status: "target-complete",
    scopeLabel: "发布页 mini/nano 全部非空能力单元格已录入",
    auditedAt: "2026-09-21",
    targetModels: ["gpt-5-4-mini", "gpt-5-4-nano"].map((modelId) => ({
      modelId,
      expectedObservationCount: 16,
      benchmarkIds: gpt54SmallBenchmarks
    })),
    note: "覆盖 Coding、Tool-calling、Intelligence、MM/Vision/CUA 与 Long context 五组表；顶部五行总览是明细重复项，按同一来源去重保存。"
  });
  upsertAudit("openai-gpt54-mini-docs", {
    status: "metadata-only",
    auditedAt: "2026-09-21",
    note: "官方 API 模型页核实 400K 上下文、128K 最大输出、文本输入输出、图像输入以及音频/视频不支持；无独立能力分数表。"
  });
  upsertAudit("openai-gpt54-nano-docs", {
    status: "metadata-only",
    auditedAt: "2026-09-21",
    note: "官方 API 模型页核实 400K 上下文、128K 最大输出、文本输入输出、图像输入以及音频/视频不支持；无独立能力分数表。"
  });
  upsertAudit("openai-gpt54-mini-safety", {
    status: "metadata-only",
    auditedAt: "2026-09-21",
    note: "System Card addendum 已核；其中能力数字服务于 Preparedness/安全风险评估，按项目口径不混入通用能力榜。"
  });

  // NVIDIA Nemotron 3 Super. The HF card and technical report disagree on
  // three RULER cells; both first-party values are retained. The report also
  // contains a few Table 5 / Table 8 label or rounding conflicts, preserved as
  // separate settings instead of silently choosing one.
  appendUnique(sources, [
    { id: "nvidia-n3-super-hf", vendorId: "nvidia", publisher: "NVIDIA", date: "2026-03-11", tier: "official", title: "NVIDIA Nemotron 3 Super 120B-A12B BF16 — Official Model Card", url: "https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16" },
    { id: "nvidia-n3-super-build", vendorId: "nvidia", publisher: "NVIDIA", date: "2026-03-11", tier: "official", title: "Nemotron 3 Super 120B-A12B — NVIDIA Build Model Card", url: "https://build.nvidia.com/nvidia/nemotron-3-super-120b-a12b/modelcard" },
    { id: "nvidia-n3-super-research", vendorId: "nvidia", publisher: "NVIDIA Research", date: "2026-03-10", tier: "official", title: "NVIDIA Nemotron 3 Super", url: "https://research.nvidia.com/labs/nemotron/Nemotron-3-Super/" },
    { id: "nvidia-n3-super-blog", vendorId: "nvidia", publisher: "NVIDIA Developer", date: "2026-03-11", tier: "official", title: "Introducing Nemotron 3 Super", url: "https://developer.nvidia.com/blog/introducing-nemotron-3-super-an-open-hybrid-mamba-transformer-moe-for-agentic-reasoning/" },
    { id: "nvidia-n3-super-report", vendorId: "nvidia", publisher: "NVIDIA", date: "2026-04-03", tier: "official", title: "Nemotron 3 Super Technical Report", url: "https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Super-Technical-Report.pdf" },
    { id: "nvidia-nemotron-github", vendorId: "nvidia", publisher: "NVIDIA NeMo", date: "2026", tier: "official", title: "Nemotron — Official Developer Repository", url: "https://github.com/NVIDIA-NeMo/Nemotron" }
  ]);
  patchModel("nemotron-3-super-120b-a12b", {
    releaseDate: "2026-03-11",
    modality: "language",
    modalityDetail: "文本 → 文本与工具调用；官方模型卡明确 Input Type 为 Text",
    context: "1M",
    access: "开放权重（NVIDIA Nemotron Open Model License）",
    sourceId: "nvidia-n3-super-hf",
    referenceSourceIds: ["nvidia-n3-super-build", "nvidia-n3-super-research", "nvidia-n3-super-blog", "nvidia-n3-super-report", "nvidia-nemotron-github"],
    scoreStatus: undefined,
    summary: "120B 总参数、12B 激活的 LatentMoE Mamba-Transformer 混合推理模型；纯文本输入。"
  });
  appendUnique(benchmarks, [
    { id: "terminal-bench-hard-48", name: "Terminal-Bench · Hard 48", category: "Agent / 工作", direction: "higher", description: "NVIDIA 使用的 48 题 Terminal-Bench hard subset；不与完整 Terminal-Bench 2.x 混排。" },
    { id: "terminal-bench-core-2-0", name: "Terminal-Bench Core 2.0", category: "Agent / 工作", direction: "higher", description: "NVIDIA 报告的 Terminal-Bench Core 2.0 / Harbor 口径。" },
    { id: "bird-bench", name: "BIRD Bench", category: "Agent / 工作", direction: "higher", description: "文本到 SQL 数据库任务；具体执行与工具设置见成绩。" },
    { id: "scale-multichallenge", name: "Scale AI Multi-Challenge", category: "指令遵循", direction: "higher", description: "Scale AI 多轮指令遵循评测。" },
    { id: "arena-hard-v2", name: "Arena-Hard v2", category: "对话 / 指令", direction: "higher", description: "Arena-Hard v2 对话能力评测；prompt 与 judge 设置写入成绩。" },
    { id: "ruler-128k", name: "RULER · 128K", category: "长上下文", direction: "higher", description: "RULER 128K 长上下文能力。" },
    { id: "ruler-256k", name: "RULER · 256K", category: "长上下文", direction: "higher", description: "RULER 256K 长上下文能力。" },
    { id: "ruler-512k", name: "RULER · 512K", category: "长上下文", direction: "higher", description: "RULER 512K 长上下文能力。" },
    { id: "ruler-1m", name: "RULER · 1M", category: "长上下文", direction: "higher", description: "RULER 1M 长上下文能力。" },
    { id: "pinchbench-unspecified", name: "PinchBench · Version/Metric Unspecified", category: "Agent / 工作", direction: "higher", description: "厂商只写 PinchBench 单值、未披露版本或 best/average 口径时使用；不与 PinchBench v2 混排。" }
  ]);
  if (!benchmarkFamilies.some((item) => item.id === "ruler-family")) {
    benchmarkFamilies.push({
      id: "ruler-family",
      name: "RULER",
      variants: [
        { benchmarkId: "ruler-128k", label: "128K" },
        { benchmarkId: "ruler-256k", label: "256K" },
        { benchmarkId: "ruler-512k", label: "512K" },
        { benchmarkId: "ruler-1m", label: "1M" }
      ]
    });
  }

  const superShared = ["nvidia-n3-super-hf", "nvidia-n3-super-report"];
  const superRows = [
    ["mmlu-pro", 83.73, "published setting"],
    ["aime-2025", 90.21, "no tools"],
    ["hmmt-2025-02", 93.67, "no tools"],
    ["hmmt-2025-02", 94.73, "with tools"],
    ["gpqa", 79.23, "no tools"],
    ["gpqa", 82.70, "with tools"],
    ["livecodebench", 81.19, "v5 · 2024-07↔2024-12"],
    ["scicode", 42.05, "subtask"],
    ["hle", 18.26, "no tools"],
    ["hle-tools", 22.82, "with tools"],
    ["terminal-bench-hard-48", 25.78, "dedicated open-source container · 48 tasks"],
    ["terminal-bench-core-2-0", 31.00, "Harbor · internal scaffolding"],
    ["swe-bench-verified", 60.47, "OpenHands"],
    ["swe-bench-verified", 59.20, "OpenCode"],
    ["swe-bench-verified", 53.73, "Codex"],
    ["swe-multilingual", 45.78, "OpenHands"],
    ["tau2-airline", 56.25, "default prompt"],
    ["tau2-retail", 62.83, "default prompt"],
    ["tau2-telecom", 64.36, "default prompt"],
    ["tau2-bench", 61.15, "Airline/Retail/Telecom average · default prompt"],
    ["browsecomp", 31.28, "with Search · internal SerpAPI implementation"],
    ["bird-bench", 41.80, "published setting"],
    ["ifbench", 72.56, "prompt"],
    ["scale-multichallenge", 55.23, "Scale AI multi-turn instruction following"],
    ["arena-hard-v2", 73.88, "Hard Prompt"],
    ["aa-lcr", 58.31, "published setting"],
    ["mmlu-prox", 79.36, "average over languages"],
    ["wmt24pp", 86.67, "en→xx"]
  ];
  superRows.forEach(([benchmarkId, value, detail]) => add(
    superShared,
    benchmarkId,
    "nemotron-3-super-120b-a12b",
    value,
    "%",
    `NeMo Evaluator / mostly NeMo Skills · ${detail}`
  ));
  [
    ["ruler-256k", 96.30], ["ruler-512k", 95.67], ["ruler-1m", 91.75]
  ].forEach(([benchmarkId, value]) => add(
    ["nvidia-n3-super-hf"], benchmarkId, "nemotron-3-super-120b-a12b", value, "%",
    "official HF model card · dedicated RULER container",
    "The technical report publishes a different value for the same context length; both are retained."
  ));
  [
    ["ruler-256k", 96.83], ["ruler-512k", 95.22], ["ruler-1m", 91.64]
  ].forEach(([benchmarkId, value]) => add(
    ["nvidia-n3-super-report"], benchmarkId, "nemotron-3-super-120b-a12b", value, "%",
    "technical report Table 5/8 · dedicated RULER container",
    "The official HF model card publishes a different value for the same context length; both are retained."
  ));
  [
    ["livecodebench-v6", 78.69, "v6 · 2024-08↔2025-05 · report Table 8 BF16"],
    ["ruler-128k", 97.04, "report Table 8 BF16 · dedicated RULER container"],
    ["swe-bench-verified", 60.47, "OpenCode · report Table 8 BF16", "Table 8 labels 60.47 as OpenCode, while Table 5 labels the same value OpenHands and gives OpenCode 59.20."],
    ["ifbench", 72.58, "prompt · report Table 8 BF16", "Table 5/HF card report 72.56; both first-party values are retained."],
    ["mmlu-prox", 79.35, "average over languages · report Table 8 BF16", "Table 5/HF card report 79.36; both first-party values are retained."]
  ].forEach(([benchmarkId, value, detail, note = ""]) => add(
    ["nvidia-n3-super-report"], benchmarkId, "nemotron-3-super-120b-a12b", value, "%",
    `NeMo Evaluator / mostly NeMo Skills · ${detail}`, note
  ));
  [
    ["ifbench", 72.6, "official blog Figure 3 · rounded"],
    ["hmmt-2025-02", 94.7, "official blog Figure 3 · rounded · tool setting not labeled"],
    ["swe-bench-verified", 60.5, "official blog Figure 3 · rounded · harness not labeled"],
    ["hle-tools", 22.8, "official blog Figure 3 · rounded · +tools"],
    ["terminal-bench-hard-48", 25.8, "official blog Figure 3 · rounded"],
    ["tau2-bench", 61.9, "official blog Figure 3 · rounded · aggregate"],
    ["ruler-1m", 91.8, "official blog Figure 3 · rounded"],
    ["pinchbench-unspecified", 85.6, "official blog prose · OpenClaw · version and metric not specified"]
  ].forEach(([benchmarkId, value, detail]) => add(
    ["nvidia-n3-super-blog"], benchmarkId, "nemotron-3-super-120b-a12b", value, "%", detail,
    /rounded/.test(detail) ? "Rounded chart label is retained separately from the more precise HF/report value." : ""
  ));

  const superHfBenchmarks = [...new Set([...superRows.map(([id]) => id), "ruler-256k", "ruler-512k", "ruler-1m"] )];
  const superReportBenchmarks = [...new Set([...superRows.map(([id]) => id), "ruler-128k", "ruler-256k", "ruler-512k", "ruler-1m", "livecodebench-v6"] )];
  upsertAudit("nvidia-n3-super-hf", {
    status: "target-complete", scopeLabel: "HF 模型卡目标列已逐格录入", auditedAt: "2026-09-21",
    targetModels: [{ modelId: "nemotron-3-super-120b-a12b", expectedObservationCount: 31, benchmarkIds: superHfBenchmarks }],
    note: "模型卡完整 Benchmark 表目标列已录入；RULER 三项与技术报告冲突，未覆盖。"
  });
  upsertAudit("nvidia-n3-super-report", {
    status: "target-complete", scopeLabel: "技术报告能力 Table 5/8 目标列已核", auditedAt: "2026-09-21",
    targetModels: [{ modelId: "nemotron-3-super-120b-a12b", expectedObservationCount: 36, benchmarkIds: superReportBenchmarks }],
    note: "Table 5 全部 31 个目标值及 Table 8 的新增/冲突目标值已录入；预训练、量化消融和安全数据不混入通用后训练能力榜。"
  });
  upsertAudit("nvidia-n3-super-blog", {
    status: "target-complete", scopeLabel: "博客正文与 Figure 3 精确标签已核", auditedAt: "2026-09-21",
    targetModels: [{ modelId: "nemotron-3-super-120b-a12b", expectedObservationCount: 8, benchmarkIds: ["ifbench", "hmmt-2025-02", "swe-bench-verified", "hle-tools", "terminal-bench-hard-48", "tau2-bench", "ruler-1m", "pinchbench-unspecified"] }],
    note: "正文 PinchBench 85.6 与 Figure 3 七个带数值标签的 BF16 柱均已录入；图表四舍五入值不替代模型卡/报告精确值。"
  });
  upsertAudit("nvidia-n3-super-build", { status: "pending", auditedAt: "2026-09-21", note: "NVIDIA Build 模型卡已登记；动态页面当前只渲染外壳，待与 HF 表逐单元格确认后再提升审计状态。" });
  upsertAudit("nvidia-n3-super-research", { status: "metadata-only", auditedAt: "2026-09-21", note: "研究主页核实发布日期、参数、1M 上下文及所有官方权重/报告/仓库入口；页面无独立数值表。" });
  upsertAudit("nvidia-nemotron-github", { status: "metadata-only", auditedAt: "2026-09-21", note: "官方开发仓库提供训练与部署 recipe；能力数值以具体型号 HF 卡和技术报告为准。" });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
