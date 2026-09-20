(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const upsertModel = (id, values) => {
    let model = models.find((item) => item.id === id);
    if (!model) {
      model = { id };
      models.push(model);
    }
    const aliases = [...new Set([...(model.aliases || []), ...(values.aliases || [])])];
    Object.assign(model, values, { aliases });
    delete model.scoreStatus;
    return model;
  };
  const upsertAudit = (sourceId, values) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    if (audit) Object.assign(audit, values);
    else sourceAudits.push({ sourceId, ...values });
  };
  const mergeFamily = (id, name, variants) => {
    let family = benchmarkFamilies.find((item) => item.id === id);
    if (!family) {
      family = { id, name, variants: [] };
      benchmarkFamilies.push(family);
    }
    family.name = name;
    for (const variant of variants) {
      if (!family.variants.some((item) => item.benchmarkId === variant.benchmarkId)) family.variants.push(variant);
    }
  };
  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    const normalizedSources = [...new Set(sourceIds)];
    const existing = observations.find((item) =>
      item.benchmarkId === benchmarkId &&
      item.modelId === modelId &&
      item.value === value &&
      item.unit === unit &&
      (item.setting || "") === setting
    );
    if (existing) {
      existing.sourceIds = [...new Set([...(existing.sourceIds || []), ...normalizedSources])];
      if (note && !existing.note) existing.note = note;
      return existing;
    }
    const observation = {
      id: `o${observations.length + 1}`,
      sourceIds: normalizedSources,
      benchmarkId,
      modelId,
      value,
      unit,
      setting
    };
    if (note) observation.note = note;
    observations.push(observation);
    return observation;
  };
  const sourceTarget = (sourceId, modelId) => ({
    modelId,
    expectedObservationCount: observations.filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId)).length,
    benchmarkIds: [...new Set(observations
      .filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId))
      .map((item) => item.benchmarkId))]
  });

  appendUnique(sources, [
    { id: "xiaomi-mimo25-launch", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-04-22", tier: "official", title: "Introducing MiMo-V2.5", url: "https://mimo.xiaomi.com/mimo-v2-5" },
    { id: "xiaomi-mimo25-hf", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-04-22", tier: "official", title: "MiMo-V2.5 — Official Hugging Face Model Card", url: "https://huggingface.co/XiaomiMiMo/MiMo-V2.5" },
    { id: "xiaomi-mimo25-base-hf", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-04-22", tier: "official", title: "MiMo-V2.5-Base — Official Hugging Face Model Card", url: "https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Base" },
    { id: "xiaomi-mimo25-modelscope", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-04-22", tier: "official", title: "MiMo-V2.5 — Official ModelScope Card", url: "https://modelscope.cn/models/XiaomiMiMo/MiMo-V2.5" },
    { id: "xiaomi-mimo25-base-modelscope", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-04-22", tier: "official", title: "MiMo-V2.5-Base — Official ModelScope Card", url: "https://modelscope.cn/models/XiaomiMiMo/MiMo-V2.5-Base" },
    { id: "xiaomi-mimo25-pro-launch", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-04-27", tier: "official", title: "Introducing MiMo-V2.5-Pro", url: "https://mimo.xiaomi.com/mimo-v2-5-pro" },
    { id: "xiaomi-mimo25-pro-hf", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-04-27", tier: "official", title: "MiMo-V2.5-Pro — Official Hugging Face Model Card", url: "https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro" },
    { id: "xiaomi-mimo25-pro-base-hf", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-04-27", tier: "official", title: "MiMo-V2.5-Pro-Base — Official Hugging Face Model Card", url: "https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro-Base" },
    { id: "xiaomi-mimo25-pro-modelscope", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-04-27", tier: "official", title: "MiMo-V2.5-Pro — Official ModelScope Card", url: "https://modelscope.cn/models/XiaomiMiMo/MiMo-V2.5-Pro" },
    { id: "xiaomi-mimo25-pro-base-modelscope", vendorId: "xiaomi", publisher: "Xiaomi MiMo", date: "2026-04-27", tier: "official", title: "MiMo-V2.5-Pro-Base — Official ModelScope Card", url: "https://modelscope.cn/models/XiaomiMiMo/MiMo-V2.5-Pro-Base" }
  ]);

  upsertModel("mimo-v2-5", {
    name: "MiMo V2.5", vendorId: "xiaomi", vendor: "Xiaomi", releaseDate: "2026-04-22",
    modality: "omni", modalityDetail: "文本、图像、视频、音频 → 文本与工具调用",
    context: "1M", access: "开源权重 / API", aliases: ["MiMo-V2.5", "mimo-v2.5", "xiaomi/mimo-v2.5"],
    sourceId: "xiaomi-mimo25-launch",
    referenceSourceIds: ["xiaomi-mimo25-hf", "xiaomi-mimo25-modelscope"],
    summary: "310B 总参数、15B 激活参数的原生全模态 MoE；官方发布页覆盖视觉、音视频、Agent 与编码评测。"
  });
  upsertModel("mimo-v2-5-base", {
    name: "MiMo V2.5 Base", vendorId: "xiaomi", vendor: "Xiaomi", releaseDate: "2026-04-22",
    modality: "omni", modalityDetail: "文本、图像、视频、音频 → 文本；Base 预训练快照",
    context: "256K", access: "开源权重", aliases: ["MiMo-V2.5-Base", "mimo-v2.5-base"],
    sourceId: "xiaomi-mimo25-base-hf",
    referenceSourceIds: ["xiaomi-mimo25-launch", "xiaomi-mimo25-pro-hf", "xiaomi-mimo25-base-modelscope"],
    summary: "MiMo V2.5 的 310B/15B Base 快照；与经过 Agent/指令后训练、支持 1M 上下文的 MiMo V2.5 分开。"
  });
  upsertModel("mimo-v2-5-pro", {
    name: "MiMo V2.5 Pro", vendorId: "xiaomi", vendor: "Xiaomi", releaseDate: "2026-04-27",
    modality: "language", modalityDetail: "文本、代码与工具调用 → 文本；官方资料未声明原生图像、音频或视频输入",
    context: "1M", access: "开源权重 / API", aliases: ["MiMo-V2.5-Pro", "mimo-v2.5-pro", "xiaomi/mimo-v2.5-pro"],
    sourceId: "xiaomi-mimo25-pro-launch",
    referenceSourceIds: ["xiaomi-mimo25-pro-hf", "xiaomi-mimo25-pro-modelscope"],
    summary: "1.02T 总参数、42B 激活参数的长上下文 Agent/编码模型；公开权重与 API 均支持 1M 上下文。"
  });
  upsertModel("mimo-v2-5-pro-base", {
    name: "MiMo V2.5 Pro Base", vendorId: "xiaomi", vendor: "Xiaomi", releaseDate: "2026-04-27",
    modality: "language", modalityDetail: "文本 → 文本；Base 预训练快照",
    context: "256K", access: "开源权重", aliases: ["MiMo-V2.5-Pro-Base", "mimo-v2.5-pro-base"],
    sourceId: "xiaomi-mimo25-pro-base-hf",
    referenceSourceIds: ["xiaomi-mimo25-pro-launch", "xiaomi-mimo25-pro-hf", "xiaomi-mimo25-pro-base-modelscope"],
    summary: "MiMo V2.5 Pro 的 1.02T/42B Base 快照；与 1M 上下文的后训练服务模型分开。"
  });

  appendUnique(benchmarks, [
    { id: "hr-bench-4k", name: "HR-Bench · 4K", category: "多模态", direction: "higher", description: "高分辨率图像理解；4K 分辨率设置。" },
    { id: "mimo-coding-bench", name: "MiMo Coding Bench", category: "编码", direction: "higher", description: "Xiaomi 内部编码 Agent 评测；涵盖仓库理解、项目构建、代码审查与 SWE 等任务。" },
    { id: "tau3-bench", name: "τ³-bench", category: "Agent / 工作", direction: "higher", description: "长程工具使用 Agent 基准；子域与 harness 依来源 setting 区分。" },
    { id: "frontierswe-implementation-rank", name: "FrontierSWE · Implementation Rank", category: "编码", direction: "lower", description: "FrontierSWE implementation 榜名次；数值越低越好，不与完成率混排。" },
    { id: "arc-challenge", name: "ARC-Challenge", category: "知识 / 推理", direction: "higher", description: "AI2 Reasoning Challenge 的 Challenge 子集。" },
    { id: "winogrande", name: "WinoGrande", category: "知识 / 推理", direction: "higher", description: "常识共指推理评测。" },
    { id: "triviaqa", name: "TriviaQA", category: "知识 / 推理", direction: "higher", description: "开放域事实问答评测。" },
    { id: "aime-2024-2025", name: "AIME 2024 & 2025", category: "数学", direction: "higher", description: "AIME 2024 与 2025 的合并口径；不与单年榜自动合并。" },
    { id: "humaneval-plus", name: "HumanEval+", category: "编码", direction: "higher", description: "EvalPlus 扩展版 HumanEval。" },
    { id: "mbpp-plus", name: "MBPP+", category: "编码", direction: "higher", description: "EvalPlus 扩展版 MBPP。" },
    { id: "cmmlu", name: "CMMLU", category: "知识 / 推理", direction: "higher", description: "中文多任务语言理解评测。" }
  ]);
  mergeFamily("tau3-family", "τ³-bench", [
    { benchmarkId: "tau3-bench", label: "Aggregate / domain unspecified" },
    { benchmarkId: "tau3-banking", label: "Banking" }
  ]);
  mergeFamily("frontierswe-family", "FrontierSWE", [
    { benchmarkId: "frontierswe", label: "Score / completion" },
    { benchmarkId: "frontierswe-implementation-rank", label: "Implementation rank · Lower is better" }
  ]);
  mergeFamily("aime-family", "AIME", [{ benchmarkId: "aime-2024-2025", label: "2024 & 2025 combined" }]);
  mergeFamily("humaneval-family", "HumanEval", [
    { benchmarkId: "humaneval", label: "Original" },
    { benchmarkId: "humaneval-plus", label: "EvalPlus" }
  ]);
  mergeFamily("swe-bench-family", "SWE-Bench", [{ benchmarkId: "swe-agentless", label: "AgentLess" }]);

  const mimo25Shared = ["xiaomi-mimo25-launch", "xiaomi-mimo25-hf"];
  const mimo25Setting = "Xiaomi MiMo-V2.5 official release/model card";
  [
    ["charxiv-rq", 81.0, "%", "RQ · Code Interpreter setting unspecified"],
    ["mmmu-pro", 77.9, "%", "published multimodal setting"],
    ["hr-bench-4k", 88.5, "%", "4K"],
    ["omnidocbench-score", 87.2, "%", "higher-is-better score · version unspecified"],
    ["claweval-mm-pass3", 23.8, "%", "multimodal subset · Pass³ · exact benchmark version/harness unspecified"],
    ["videomme", 87.7, "%", "subtitle/audio setting unspecified"],
    ["dailyomni", 83.5, "%", "published multimodal setting"],
    ["videoholmes", 64.0, "%", "published multimodal setting"],
    ["mimo-coding-bench", 71.8, "%", "Xiaomi internal coding-agent evaluation"],
    ["claweval", 62.3, "%", "text/general subset · Pass³ · exact benchmark version/harness unspecified"],
    ["terminal-bench-2-0-unspecified-harness", 65.8, "%", "version 2.0 · harness unspecified"],
    ["swe-bench-pro", 56.1, "%", "published coding-agent setting"]
  ].forEach(([benchmarkId, value, unit, detail]) => add(mimo25Shared, benchmarkId, "mimo-v2-5", value, unit, `${mimo25Setting} · ${detail}`));

  const graphLengths = ["32K", "64K", "128K", "256K", "512K", "1M"];
  const addGraphSeries = (sourceId, modelId, task, values, detail) => values.forEach((value, index) => {
    add([sourceId], `graphwalks-${task}`, modelId, value, "%", `${detail} · ${graphLengths[index]} input tokens`);
  });
  addGraphSeries("xiaomi-mimo25-hf", "mimo-v2-5", "bfs", [86, 85, 75, 78, 58, 54], "official model-card chart · F1");
  addGraphSeries("xiaomi-mimo25-hf", "mimo-v2-5", "parents", [100, 100, 100, 98, 97, 87], "official model-card chart · accuracy");

  const mimo25ProSetting = "Xiaomi MiMo-V2.5-Pro official launch table";
  [
    ["gdpval-aa", 1581, "Elo", "provider-reported comparison table"],
    ["tau3-bench", 72.9, "%", "aggregate/domain and harness unspecified"],
    ["claweval", 63.8, "%", "Pass³ · exact benchmark version/subset/harness unspecified"],
    ["hle-tools", 48.0, "%", "with tools"],
    ["hle", 34.0, "%", "without tools"],
    ["swe-bench-pro", 57.2, "%", "published coding-agent setting"],
    ["swe-bench-verified", 78.9, "%", "published coding-agent setting"],
    ["terminal-bench-2-0-unspecified-harness", 68.4, "%", "version 2.0 · harness unspecified"],
    ["frontierswe-implementation-rank", 3.4, "rank", "implementation leaderboard snapshot"],
    ["mimo-coding-bench", 73.7, "%", "Xiaomi internal coding-agent evaluation · frameworks such as Claude Code"]
  ].forEach(([benchmarkId, value, unit, detail]) => add(["xiaomi-mimo25-pro-launch"], benchmarkId, "mimo-v2-5-pro", value, unit, `${mimo25ProSetting} · ${detail}`));
  addGraphSeries("xiaomi-mimo25-pro-hf", "mimo-v2-5-pro", "bfs", [81, 79, 82, 77, 56, 37], "official model-card chart · F1");
  addGraphSeries("xiaomi-mimo25-pro-hf", "mimo-v2-5-pro", "parents", [98, 98, 99, 97, 92, 62], "official model-card chart · accuracy");

  const baseBenchmarks = [
    ["bbh", "3-shot"], ["mmlu", "5-shot"], ["mmlu-redux", "5-shot"], ["mmlu-pro", "5-shot"],
    ["drop", "3-shot"], ["arc-challenge", "25-shot"], ["hellaswag", "10-shot"], ["winogrande", "5-shot"],
    ["triviaqa", "5-shot"], ["gpqa-diamond", "5-shot"], ["gsm8k", "8-shot"], ["math", "4-shot"],
    ["aime-2024-2025", "2-shot"], ["humaneval-plus", "1-shot"], ["mbpp-plus", "3-shot"], ["livecodebench-v6", "1-shot"],
    ["swe-agentless", "3-shot"], ["c-eval", "5-shot"], ["cmmlu", "5-shot"], ["gmmlu", "5-shot"]
  ];
  const baseValues = {
    "mimo-v2-5-pro-base": [88.4, 89.4, 92.8, 68.5, 86.3, 97.2, 89.8, 85.6, 81.3, 66.7, 99.6, 86.2, 37.3, 75.6, 74.1, 39.6, 35.7, 91.5, 90.2, 83.6],
    "mimo-v2-5-base": [87.2, 86.3, 89.8, 65.8, 83.7, 96.5, 88.6, 84.7, 80.7, 58.1, 83.3, 67.7, 36.9, 71.3, 70.9, 35.5, 30.8, 88.6, 88.2, 77.4]
  };
  for (const [modelId, values] of Object.entries(baseValues)) {
    baseBenchmarks.forEach(([benchmarkId, shot], index) => {
      add(["xiaomi-mimo25-pro-hf"], benchmarkId, modelId, values[index], "%", `MiMo-V2.5-Pro official model-card base-model table · ${shot}`);
    });
  }

  upsertAudit("xiaomi-mimo25-launch", {
    status: "target-complete", scopeLabel: "目标成绩已核", auditedAt: "2026-09-20",
    targetModels: [sourceTarget("xiaomi-mimo25-launch", "mimo-v2-5")],
    note: "发布页的 MiMo-V2.5 目标模型列已逐格录入：8 个多模态项目与 4 个编码/Agent 项目。图表未注明的版本、harness、字幕或 Code Interpreter 条件均保留为 unspecified。"
  });
  upsertAudit("xiaomi-mimo25-hf", {
    status: "target-complete", scopeLabel: "目标成绩已核", auditedAt: "2026-09-20",
    targetModels: [sourceTarget("xiaomi-mimo25-hf", "mimo-v2-5")],
    note: "模型卡的多模态与编码/Agent 图表和发布页一致，并补充 32K–1M GraphWalks 两项曲线；目标模型 24 个数值已录入。"
  });
  upsertAudit("xiaomi-mimo25-base-hf", {
    status: "metadata-only", scopeLabel: "模型元数据", auditedAt: "2026-09-20",
    note: "该仓库用于发布 MiMo-V2.5-Base 权重与配置；页面复用系列说明和后训练模型图表，没有把那些分数错误归给 Base。Base 的精确 20 项对照列来自 Pro 模型卡。"
  });
  upsertAudit("xiaomi-mimo25-modelscope", {
    status: "pending", scopeLabel: "待复核", auditedAt: "2026-09-20",
    note: "官方 ModelScope 镜像已登记，但页面加载未完成；当前不从该镜像新增或合并成绩。"
  });
  upsertAudit("xiaomi-mimo25-base-modelscope", {
    status: "pending", scopeLabel: "待复核", auditedAt: "2026-09-20",
    note: "官方 Base ModelScope 镜像已登记，但页面加载未完成；当前不从该镜像借用成绩。"
  });
  upsertAudit("xiaomi-mimo25-pro-launch", {
    status: "target-complete", scopeLabel: "目标成绩已核", auditedAt: "2026-09-20",
    targetModels: [sourceTarget("xiaomi-mimo25-pro-launch", "mimo-v2-5-pro")],
    note: "发布页主结果表的 10 个 MiMo-V2.5-Pro 目标数值已录入。Claw-Eval、Terminal-Bench 与 τ³-bench 未声明的版本或 harness 不与更具体口径合并。"
  });
  upsertAudit("xiaomi-mimo25-pro-hf", {
    status: "target-complete", scopeLabel: "目标列已核", auditedAt: "2026-09-20",
    targetModels: [
      sourceTarget("xiaomi-mimo25-pro-hf", "mimo-v2-5-pro"),
      sourceTarget("xiaomi-mimo25-pro-hf", "mimo-v2-5-pro-base"),
      sourceTarget("xiaomi-mimo25-pro-hf", "mimo-v2-5-base")
    ],
    note: "模型卡的 MiMo-V2.5-Pro GraphWalks 32K–1M 两项曲线，以及 Base Model Evaluation 中 MiMo-V2.5-Pro Base 与 MiMo-V2.5 Base 的两个完整 20 项列均已逐格录入。"
  });
  upsertAudit("xiaomi-mimo25-pro-base-hf", {
    status: "pending", scopeLabel: "待复核", auditedAt: "2026-09-20",
    note: "官方 Base 权重仓库已登记；其卡片是否逐字镜像 Pro 模型卡仍待独立核对，当前不重复归入成绩来源。"
  });
  upsertAudit("xiaomi-mimo25-pro-modelscope", {
    status: "pending", scopeLabel: "待复核", auditedAt: "2026-09-20",
    note: "官方 ModelScope 镜像已登记，但页面加载未完成；当前不从该镜像新增或合并成绩。"
  });
  upsertAudit("xiaomi-mimo25-pro-base-modelscope", {
    status: "pending", scopeLabel: "待复核", auditedAt: "2026-09-20",
    note: "官方 Base ModelScope 镜像已登记，但页面加载未完成；当前不从该镜像借用成绩。"
  });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
