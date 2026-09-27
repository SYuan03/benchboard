(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const ensureBenchmark = (row) => {
    const current = benchmarks.find((item) => item.id === row.id);
    if (current) Object.assign(current, row);
    else benchmarks.push(row);
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
      item.benchmarkId === benchmarkId && item.modelId === modelId &&
      item.value === value && item.unit === unit && (item.setting || "") === setting
    );
    if (existing) {
      existing.sourceIds = [...new Set([...(existing.sourceIds || []), ...normalizedSources])];
      if (note && !existing.note) existing.note = note;
      return;
    }
    observations.push({ id: `o${observations.length + 1}`, sourceIds: normalizedSources, benchmarkId, modelId, value, unit, setting, note });
  };
  const addRows = (sourceIds, rows, common = "") => rows.forEach(([benchmarkId, modelId, value, unit = "%", setting = "", note = ""]) => {
    add(sourceIds, benchmarkId, modelId, value, unit, [common, setting].filter(Boolean).join(" · "), note);
  });
  const setAudit = (sourceId, status, note, extra = {}) => {
    const current = sourceAudits.find((item) => item.sourceId === sourceId);
    const patch = { sourceId, status, auditedAt: "2026-09-28", note, ...extra };
    if (current) Object.assign(current, patch);
    else sourceAudits.push(patch);
  };
  const completeAudit = (sourceId, note, scopeLabel = "能力结果整表已核") => {
    const rows = observations.filter((item) => item.sourceIds.includes(sourceId));
    setAudit(sourceId, "complete", note, {
      scopeLabel,
      expectedObservationCount: rows.length,
      benchmarkIds: [...new Set(rows.map((item) => item.benchmarkId))]
    });
  };
  const targetAudit = (sourceId, modelId, note, scopeLabel = "目标模型能力项已核") => {
    const rows = observations.filter((item) => item.sourceIds.includes(sourceId) && item.modelId === modelId);
    setAudit(sourceId, "target-complete", note, {
      scopeLabel,
      targetModels: [{
        modelId,
        expectedObservationCount: rows.length,
        benchmarkIds: [...new Set(rows.map((item) => item.benchmarkId))]
      }]
    });
  };

  appendUnique(sources, [
    { id: "anthropic-opus55", vendorId: "anthropic", publisher: "Anthropic", date: "2026-09-22", tier: "official", title: "Introducing Claude Opus 5.5", url: "https://www.anthropic.com/claude-opus-5-5" },
    { id: "anthropic-opus55-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-09-22", tier: "official", title: "Claude Opus 5.5 System Card", url: "https://www-cdn.anthropic.com/fc1b44717c85dc068bc6ba5024219938094694bd/Claude%20Opus%205.5%20System%20Card.pdf" },
    { id: "xai-grok47", vendorId: "xai", publisher: "SpaceXAI", date: "2026-09-21", tier: "official", title: "Introducing Grok 4.7", url: "https://x.ai/news/grok-4-7" },
    { id: "xai-grok47-model-card", vendorId: "xai", publisher: "SpaceXAI", date: "2026-09-21", tier: "official", title: "Grok 4.7 Model Card", url: "https://media.x.ai/v1/website/4p7card-5eccc980.pdf" },
    { id: "openai-gpt6-sol-luna", vendorId: "openai", publisher: "OpenAI", date: "2026-09-24", tier: "official", title: "Introducing GPT-6 Sol and Luna", url: "https://openai.com/index/introducing-gpt-6-sol-and-luna/" },
    { id: "openai-mentalhealthbench", vendorId: "openai", publisher: "OpenAI", date: "2026-09-24", tier: "official", kind: "benchmark", title: "Introducing MentalHealthBench", url: "https://openai.com/index/introducing-mentalhealthbench/" },
    { id: "cursorbench", vendorId: "cursor", publisher: "Cursor", date: "2026-09-10", tier: "official", kind: "benchmark", title: "CursorBench 4.0", url: "https://cursor.com/cursorbench" }
  ]);

  appendUnique(models, [
    { id: "claude-opus-5-5", name: "Claude Opus 5.5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-09-22", modality: "vision", modalityDetail: "文本、图像、工具与计算机操作 → 文本", context: "最高 1M（评测依赖）", access: "闭源 API", aliases: ["claude-opus-5-5", "opus-5.5"], sourceId: "anthropic-opus55", referenceSourceIds: ["anthropic-opus55-system-card"], summary: "Anthropic 的高能力编码、计算机操作和专业工作模型。" },
    { id: "grok-4-7", name: "Grok 4.7", vendorId: "xai", vendor: "SpaceXAI", releaseDate: "2026-09-21", modality: "vision", modalityDetail: "文本、图像 → 文本；支持工具与 Grok Build", context: "Model Card 未单列", access: "闭源 API", aliases: ["grok-4.7"], sourceId: "xai-grok47", referenceSourceIds: ["xai-grok47-model-card"], summary: "面向编码、工程和办公 Agent 工作的视觉语言模型。" },
    { id: "gpt-6-sol", name: "GPT-6 Sol", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-09-24", modality: "vision", modalityDetail: "文本、图像、代码与工具 → 文本", context: "发布页未单列", access: "闭源 API", aliases: ["gpt-6-sol"], sourceId: "openai-gpt6-sol-luna", referenceSourceIds: ["openai-astra-system-card"], summary: "GPT-6 系列的高性能通用与 Agent 模型。" },
    { id: "gpt-6-luna", name: "GPT-6 Luna", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-09-24", modality: "vision", modalityDetail: "文本、图像、代码与工具 → 文本", context: "发布页未单列", access: "闭源 API", aliases: ["gpt-6-luna"], sourceId: "openai-gpt6-sol-luna", referenceSourceIds: ["openai-astra-system-card"], summary: "GPT-6 系列的低成本通用与 Agent 模型。" },
    { id: "grok-4-6", name: "Grok 4.6", vendorId: "xai", vendor: "SpaceXAI", releaseDate: "2026", modality: "vision", modalityDetail: "文本、图像 → 文本；以 Grok 4.7 Model Card 标签登记", context: "未核实", access: "闭源 API", aliases: ["grok-4.6"], sourceId: "xai-grok47-model-card", scoreStatus: "comparison-only", summary: "Grok 4.7 Model Card 与 CursorBench 4.0 的官方对照模型。" },
    { id: "cursor-composer-2-5", name: "Composer 2.5", vendorId: "cursor", vendor: "Cursor", releaseDate: "2026", modality: "vision", modalityDetail: "Cursor Agent 模型；输入模态未在榜单单列", context: "未核实", access: "闭源", aliases: ["Composer 2.5"], sourceId: "cursorbench", scoreStatus: "comparison-only", summary: "CursorBench 4.0 榜单中的 Cursor 模型。" },
    { id: "claude-fable-5-1-opus-5-fallback", name: "Claude Fable 5.1 with Opus 5 fallback", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026", modality: "vision", modalityDetail: "组合路由：Fable 5.1，必要时回退 Opus 5", context: "按评测设置", access: "闭源", aliases: ["Claude Fable 5.1 w/ Opus 5 Fallback", "Fable 5.1 max with fallback"], sourceId: "openai-gpt6-sol-luna", scoreStatus: "comparison-only", summary: "官方评测中的组合路由，不能并入单独的 Fable 5.1。" },
    { id: "claude-fable-5-opus-4-8-fallback", name: "Claude Fable 5 with Opus 4.8 fallback", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026", modality: "vision", modalityDetail: "组合路由：Fable 5，必要时回退 Opus 4.8", context: "按评测设置", access: "闭源", aliases: ["Claude Fable 5 w/ Opus 4.8 fallback", "Fable 5 max with fallback"], sourceId: "openai-gpt6-sol-luna", scoreStatus: "comparison-only", summary: "官方评测中的组合路由，不能并入单独的 Fable 5。" },
    { id: "gpt-5-6-sol-aug-2026", name: "GPT-5.6 Sol (Aug 2026)", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-08", modality: "vision", modalityDetail: "文本、图像与工具 → 文本；MentalHealthBench 快照", context: "未单列", access: "闭源 API", aliases: ["gpt-5.6-sol-aug-2026"], sourceId: "openai-mentalhealthbench", scoreStatus: "comparison-only", summary: "MentalHealthBench 使用的 2026 年 8 月快照，与稳定别名分开。" },
    { id: "gpt-5-6-luna-aug-2026", name: "GPT-5.6 Luna (Aug 2026)", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-08", modality: "vision", modalityDetail: "文本、图像与工具 → 文本；MentalHealthBench 快照", context: "未单列", access: "闭源 API", aliases: ["gpt-5.6-luna-aug-2026"], sourceId: "openai-mentalhealthbench", scoreStatus: "comparison-only", summary: "MentalHealthBench 使用的 2026 年 8 月快照，与稳定别名分开。" },
    { id: "gpt-4o-march-2025", name: "GPT-4o (March 2025)", vendorId: "openai", vendor: "OpenAI", releaseDate: "2025-03", modality: "omni", modalityDetail: "文本、图像、音频 → 文本与音频；MentalHealthBench 快照", context: "未单列", access: "闭源 API", aliases: ["gpt-4o-march-2025"], sourceId: "openai-mentalhealthbench", scoreStatus: "comparison-only", summary: "MentalHealthBench 使用的 2025 年 3 月 GPT-4o 快照。" },
    { id: "gemini-2-5-pro", name: "Gemini 2.5 Pro", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2025", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本", context: "未在本次来源单列", access: "闭源 API", aliases: ["gemini-2.5-pro"], sourceId: "openai-mentalhealthbench", scoreStatus: "comparison-only", summary: "MentalHealthBench 官方表中的对照模型。" }
  ]);

  const benchmarkRows = [
    ["cursorbench-4-0", "CursorBench 4.0", "编码", "Cursor 生产 Agent 中的长程、多文件真实编码任务。"],
    ["frontierswe-v2", "FrontierSWE v2", "编码", "34 个超长程工程与研究任务；Proximus harness、mean@5。"],
    ["swe-marathon-v1-1", "SWE-Marathon v1.1", "编码", "20 个多小时软件工程任务；八次运行，全部 verifier 通过才算解决。"],
    ["eebench", "EEBench", "工程", "电气工程与芯片设计 Agent 任务；报告 reward。"],
    ["cadgenbench", "CADGenBench · Generation", "工程", "从设计提示生成可执行且几何正确的 CAD。"],
    ["latchbio-capabilities-v1", "LatchBio Capabilities v1.0", "科研", "11 个生物数据分析能力基准的等权平均。"],
    ["arxivmath-tools", "ArxivMath · With tools", "知识 / 推理", "研究级数学题，提供代码执行工具。"],
    ["chartography-tools", "Chartography · With tools", "多模态", "图表理解，提供容器、图像裁剪与标准库。"],
    ["benchcad-vision2code-iou-tools", "BenchCAD · Vision2Code voxel IoU · With tools", "多模态", "Vision2Code voxel IoU，提供代码与视觉核验工具。"],
    ["harvey-legal-heldout-criterion-pass", "Harvey Held-Out Legal Set · Criterion pass", "专业工作", "120 个 held-out 法律任务的平均 rubric criterion 通过率。"],
    ["toolathlon-pass3", "Toolathlon Verified · Pass@3", "Agent / 工作", "三次尝试至少一次通过。"],
    ["toolathlon-pass-cubed", "Toolathlon Verified · Pass³", "Agent / 工作", "三次尝试全部通过。"],
    ["toolathlon-average-turns", "Toolathlon Verified · Average turns", "Agent / 工作", "每条轨迹的平均 assistant turns；仅作效率信息。", "lower"],
    ["morphology-molecule-matching", "Morphology-to-molecule matching", "科研", "将多通道细胞图像与分子剂量扰动匹配。"],
    ["medicinal-chemistry-adme", "Medicinal chemistry · ADME", "科研", "根据化学结构判断药物分子的 ADME 性质。"],
    ["protein-design-sequence", "Protein design · Sequence generation", "科研", "按约束生成蛋白序列。"],
    ["protein-design-library-ranking", "Protein design · Library ranking", "科研", "对蛋白设计库进行机会校正的优先级排序。"],
    ["protein-binder-design", "De novo protein binder design", "科研", "15 个目标、每次 24 小时的蛋白 binder 设计。"],
    ["biomedical-image-analysis", "Biomedical image analysis", "科研", "91 个公开生物医学图像分析案例。"],
    ["protocol-understanding-v2", "Protocols · Understanding v2", "科研", "Benchling 的 119 个 held-out 实验协议理解任务。"]
  ];
  benchmarkRows.forEach(([id, name, category, description, direction = "higher"]) => ensureBenchmark({ id, name, category, direction, description }));

  const mhbViews = [
    ["overall", "Overall"],
    ["acuity-emergent", "Acuity · Emergent"],
    ["acuity-high-acuity", "Acuity · High acuity"],
    ["acuity-non-acute", "Acuity · Non-acute"],
    ["persona-caregiver", "User profile · Caregiver"],
    ["persona-clinician-user", "User profile · Clinician"],
    ["persona-layperson", "User profile · Layperson"],
    ["persona-teen", "User profile · Teen"],
    ["behavior-context-seeking-and-assessment", "Behavior · Context seeking and assessment"],
    ["behavior-actionable-guidance-and-coping-strategies", "Behavior · Actionable guidance and coping"],
    ["behavior-clinical-reasoning-and-health-accuracy", "Behavior · Clinical reasoning and health accuracy"],
    ["behavior-interpretation-and-cognitive-reframing", "Behavior · Interpretation and cognitive reframing"],
    ["behavior-empathy-emotional-attunement-and-support", "Behavior · Empathy and emotional support"],
    ["behavior-unsupported-belief-and-reality-testing-calibration", "Behavior · Reality-testing calibration"],
    ["behavior-over-alarmism-and-under-response", "Behavior · Alarmism and under-response"],
    ["behavior-dual-use-refusals-and-harm-avoidance", "Behavior · Refusals and harm avoidance"],
    ["behavior-collaboration-and-user-agency", "Behavior · Collaboration and user agency"],
    ["behavior-communication-and-writing", "Behavior · Communication and writing"]
  ];
  mhbViews.forEach(([id, label]) => ensureBenchmark({
    id: `mentalhealthbench-${id}`,
    name: `MentalHealthBench · ${label}`,
    category: "医疗",
    direction: "higher",
    description: "OpenAI MentalHealthBench 的多轮心理健康对话评分；视图和模型快照分别保留。"
  }));

  mergeFamily("cursorbench-family", "CursorBench", [{ benchmarkId: "cursorbench-4-0", label: "v4.0" }]);
  mergeFamily("swe-marathon-family", "SWE-Marathon", [
    { benchmarkId: "swe-marathon", label: "Version unspecified" },
    { benchmarkId: "swe-marathon-v1-1", label: "v1.1" }
  ]);
  mergeFamily("arxivmath-family", "ArxivMath", [
    { benchmarkId: "arxivmath", label: "No tools / setting specified per row" },
    { benchmarkId: "arxivmath-tools", label: "With tools" }
  ]);
  mergeFamily("chartography-family", "Chartography", [
    { benchmarkId: "chartography", label: "No tools" },
    { benchmarkId: "chartography-tools", label: "With tools" }
  ]);
  mergeFamily("benchcad-family", "BenchCAD", [
    { benchmarkId: "benchcad", label: "Published score" },
    { benchmarkId: "benchcad-vision2code-iou", label: "Vision2Code voxel IoU" },
    { benchmarkId: "benchcad-vision2code-iou-tools", label: "Vision2Code voxel IoU · With tools" }
  ]);
  mergeFamily("harvey-legal-heldout-family", "Harvey Held-Out Legal Set", [
    { benchmarkId: "harvey-legal-heldout", label: "All-pass rate" },
    { benchmarkId: "harvey-legal-heldout-criterion-pass", label: "Mean criterion-pass rate" }
  ]);
  mergeFamily("toolathlon-family", "Toolathlon Verified", [
    { benchmarkId: "toolathlon", label: "Pass@1 / published setting" },
    { benchmarkId: "toolathlon-pass3", label: "Pass@3" },
    { benchmarkId: "toolathlon-pass-cubed", label: "Pass³" },
    { benchmarkId: "toolathlon-average-turns", label: "Average turns" }
  ]);
  mergeFamily("mentalhealthbench-family", "MentalHealthBench", mhbViews.map(([id, label]) => ({ benchmarkId: `mentalhealthbench-${id}`, label })));

  const openAiModelMap = {
    "Claude Fable 5.1 w/ Opus 5 Fallback": "claude-fable-5-1-opus-5-fallback",
    "Claude Fable 5 w/ Opus 4.8 fallback": "claude-fable-5-opus-4-8-fallback",
    "Claude Fable 5.1": "claude-fable-5-1",
    "Claude Fable 5": "claude-fable-5",
    "Claude Opus 5": "claude-opus-5",
    "GPT-5.6 Luna": "gpt-5-6-luna",
    "GPT-5.6 Sol": "gpt-5-6-sol",
    "GPT-6 Astra": "gpt-6-astra",
    "GPT-6 Luna": "gpt-6-luna",
    "GPT-6 Sol": "gpt-6-sol"
  };
  const openAiBenchmarkMap = {
    automationbench: ["automationbench", "%"],
    "agents-last-exam": ["agents-last-exam-score", "Score"],
    "frontiercode-extended": ["frontiercode-1-1-main", "%"],
    deepswe: ["deepswe-v1-1", "%"],
    osworld: ["osworld-2-partial", "%"]
  };
  const openAiRows = [
    ["automationbench","Claude Fable 5.1 w/ Opus 5 Fallback","max",31.4,2.45],
    ["automationbench","Claude Opus 5","low",20.4,1.64],
    ["automationbench","Claude Opus 5","medium",23.9,2.22],
    ["automationbench","Claude Opus 5","high",20.5,2.27],
    ["automationbench","Claude Opus 5","xhigh",25.3,2.71],
    ["automationbench","Claude Opus 5","max",26.9,3.05],
    ["automationbench","GPT-5.6 Luna","low",1.8,0.01],
    ["automationbench","GPT-5.6 Luna","medium",4.3,0.02],
    ["automationbench","GPT-5.6 Luna","high",9.1,0.05],
    ["automationbench","GPT-5.6 Luna","xhigh",12.9,0.06],
    ["automationbench","GPT-5.6 Luna","max",17,0.07],
    ["automationbench","GPT-5.6 Sol","low",11.7,0.31],
    ["automationbench","GPT-5.6 Sol","medium",19.6,0.42],
    ["automationbench","GPT-5.6 Sol","high",24.8,0.47],
    ["automationbench","GPT-5.6 Sol","xhigh",26.3,0.54],
    ["automationbench","GPT-5.6 Sol","max",28.8,0.67],
    ["automationbench","GPT-6 Astra","low",30.3,1.08],
    ["automationbench","GPT-6 Astra","medium",34.1,1.27],
    ["automationbench","GPT-6 Astra","high",37.1,1.44],
    ["automationbench","GPT-6 Astra","xhigh",39,1.5],
    ["automationbench","GPT-6 Astra","max",41.4,1.73],
    ["automationbench","GPT-6 Luna","low",1.2,0.006],
    ["automationbench","GPT-6 Luna","medium",9.4,0.0163],
    ["automationbench","GPT-6 Luna","high",14.5,0.0208],
    ["automationbench","GPT-6 Luna","xhigh",12.6,0.0245],
    ["automationbench","GPT-6 Luna","max",20.7,0.0367],
    ["automationbench","GPT-6 Sol","low",21.16,0.1861],
    ["automationbench","GPT-6 Sol","medium",26.94,0.2098],
    ["automationbench","GPT-6 Sol","high",31.2,0.2368],
    ["automationbench","GPT-6 Sol","xhigh",33.18,0.2746],
    ["automationbench","GPT-6 Sol","max",31.96,0.3406],
    ["agents-last-exam","Claude Fable 5 w/ Opus 4.8 fallback","adaptive",41.29,15.2285],
    ["agents-last-exam","Claude Fable 5 w/ Opus 4.8 fallback","xhigh",48.7,28.5542],
    ["agents-last-exam","Claude Opus 5","low",51.9,4.0619],
    ["agents-last-exam","Claude Opus 5","medium",53.03,5.2907],
    ["agents-last-exam","Claude Opus 5","high",55.86,7.2917],
    ["agents-last-exam","Claude Opus 5","xhigh",55.53,10.0226],
    ["agents-last-exam","Claude Opus 5","max",52.67,9.7583],
    ["agents-last-exam","GPT-5.6 Luna","low",31.02,0.1761],
    ["agents-last-exam","GPT-5.6 Luna","medium",38.5,0.375],
    ["agents-last-exam","GPT-5.6 Luna","high",46.13,0.8389],
    ["agents-last-exam","GPT-5.6 Luna","xhigh",49.41,1.5468],
    ["agents-last-exam","GPT-5.6 Luna","max",50.37,2.5698],
    ["agents-last-exam","GPT-5.6 Sol","low",45.1,1.6324],
    ["agents-last-exam","GPT-5.6 Sol","medium",52.1,3.4126],
    ["agents-last-exam","GPT-5.6 Sol","high",52.37,3.7874],
    ["agents-last-exam","GPT-5.6 Sol","xhigh",53.62,5.0764],
    ["agents-last-exam","GPT-5.6 Sol","max",52.76,7.1322],
    ["agents-last-exam","GPT-6 Astra","low",53.4,3.0726],
    ["agents-last-exam","GPT-6 Astra","medium",57.62,4.1046],
    ["agents-last-exam","GPT-6 Astra","high",57.78,4.6396],
    ["agents-last-exam","GPT-6 Astra","xhigh",58.29,5.397],
    ["agents-last-exam","GPT-6 Astra","max",59.26,6.2337],
    ["agents-last-exam","GPT-6 Luna","low",36.32,0.0247],
    ["agents-last-exam","GPT-6 Luna","medium",46.84,0.1054],
    ["agents-last-exam","GPT-6 Luna","high",43.6,0.1117],
    ["agents-last-exam","GPT-6 Luna","xhigh",47.89,0.1105],
    ["agents-last-exam","GPT-6 Luna","max",50.89,0.1545],
    ["agents-last-exam","GPT-6 Sol","low",48.68,0.8641],
    ["agents-last-exam","GPT-6 Sol","medium",53.06,1.2664],
    ["agents-last-exam","GPT-6 Sol","high",52.58,1.5302],
    ["agents-last-exam","GPT-6 Sol","xhigh",55.39,1.668],
    ["agents-last-exam","GPT-6 Sol","max",56.36,2.9313],
    ["frontiercode-extended","Claude Fable 5.1","low",49.8,2.38],
    ["frontiercode-extended","Claude Fable 5.1","medium",50.9,3.28],
    ["frontiercode-extended","Claude Fable 5.1","high",50.3,5.27],
    ["frontiercode-extended","Claude Fable 5.1","xhigh",48.7,9.27],
    ["frontiercode-extended","Claude Fable 5.1","max",50.3,12.83],
    ["frontiercode-extended","Claude Opus 5","low",41.9,2.68],
    ["frontiercode-extended","Claude Opus 5","medium",53.4,4.31],
    ["frontiercode-extended","Claude Opus 5","high",48,7.24],
    ["frontiercode-extended","Claude Opus 5","xhigh",43.6,9.14],
    ["frontiercode-extended","Claude Opus 5","max",48,11.42],
    ["frontiercode-extended","GPT-5.6 Luna","low",15.4,0.06],
    ["frontiercode-extended","GPT-5.6 Luna","medium",25.7,0.13],
    ["frontiercode-extended","GPT-5.6 Luna","high",35.9,0.23],
    ["frontiercode-extended","GPT-5.6 Luna","xhigh",38.9,0.31],
    ["frontiercode-extended","GPT-5.6 Luna","max",39.8,0.37],
    ["frontiercode-extended","GPT-5.6 Sol","low",35.4,1.89],
    ["frontiercode-extended","GPT-5.6 Sol","medium",39.9,2.69],
    ["frontiercode-extended","GPT-5.6 Sol","high",45.1,3.48],
    ["frontiercode-extended","GPT-5.6 Sol","xhigh",46.8,4.15],
    ["frontiercode-extended","GPT-5.6 Sol","max",47.5,5.19],
    ["frontiercode-extended","GPT-6 Astra","low",45.3,1.7],
    ["frontiercode-extended","GPT-6 Astra","medium",48.8,2.43],
    ["frontiercode-extended","GPT-6 Astra","high",50.9,3.01],
    ["frontiercode-extended","GPT-6 Astra","xhigh",50.6,3.28],
    ["frontiercode-extended","GPT-6 Astra","max",53.3,4.59],
    ["frontiercode-extended","GPT-6 Luna","low",25.66,0.021],
    ["frontiercode-extended","GPT-6 Luna","medium",35.53,0.0533],
    ["frontiercode-extended","GPT-6 Luna","high",37.26,0.0672],
    ["frontiercode-extended","GPT-6 Luna","xhigh",37.1,0.0728],
    ["frontiercode-extended","GPT-6 Luna","max",42.42,0.1072],
    ["frontiercode-extended","GPT-6 Sol","low",37.28,0.453],
    ["frontiercode-extended","GPT-6 Sol","medium",45.92,0.7966],
    ["frontiercode-extended","GPT-6 Sol","high",47.7,1.0793],
    ["frontiercode-extended","GPT-6 Sol","xhigh",48.45,1.3748],
    ["frontiercode-extended","GPT-6 Sol","max",49.27,2.137],
    ["deepswe","Claude Fable 5","low",59.58,3.7579],
    ["deepswe","Claude Fable 5","medium",65.37,6.0882],
    ["deepswe","Claude Fable 5","high",68.6,9.1776],
    ["deepswe","Claude Fable 5","xhigh",69.91,13.4145],
    ["deepswe","Claude Fable 5","max",69.72,21.6347],
    ["deepswe","Claude Opus 5","low",58.13,1.66],
    ["deepswe","Claude Opus 5","medium",68.9,3.29],
    ["deepswe","Claude Opus 5","high",72.83,6.08],
    ["deepswe","Claude Opus 5","xhigh",73.15,9.07],
    ["deepswe","Claude Opus 5","max",73.65,11.84],
    ["deepswe","GPT-5.6 Luna","low",1.22,0.0106],
    ["deepswe","GPT-5.6 Luna","medium",9.29,0.0313],
    ["deepswe","GPT-5.6 Luna","high",42.37,0.1272],
    ["deepswe","GPT-5.6 Luna","xhigh",56.19,0.2737],
    ["deepswe","GPT-5.6 Luna","max",62.17,0.532],
    ["deepswe","GPT-5.6 Sol","low",45.35,0.82],
    ["deepswe","GPT-5.6 Sol","medium",61.06,1.42],
    ["deepswe","GPT-5.6 Sol","high",69.4,2.66],
    ["deepswe","GPT-5.6 Sol","xhigh",70.73,3.6],
    ["deepswe","GPT-5.6 Sol","max",72.67,6.46],
    ["deepswe","GPT-6 Astra","low",67.04,1.5952],
    ["deepswe","GPT-6 Astra","medium",72.79,3.0755],
    ["deepswe","GPT-6 Astra","high",73.23,3.9237],
    ["deepswe","GPT-6 Astra","xhigh",74.12,4.4291],
    ["deepswe","GPT-6 Astra","max",73.23,7.4978],
    ["deepswe","GPT-6 Luna","low",2.43,0.0057],
    ["deepswe","GPT-6 Luna","medium",44.47,0.0518],
    ["deepswe","GPT-6 Luna","high",59.29,0.0838],
    ["deepswe","GPT-6 Luna","xhigh",61.28,0.1096],
    ["deepswe","GPT-6 Luna","max",66.59,0.2169],
    ["deepswe","GPT-6 Sol","low",37.17,0.1623],
    ["deepswe","GPT-6 Sol","medium",56.64,0.3798],
    ["deepswe","GPT-6 Sol","high",65.27,0.6404],
    ["deepswe","GPT-6 Sol","xhigh",66.59,1.0033],
    ["deepswe","GPT-6 Sol","max",68.81,2.7439],
    ["osworld","Claude Opus 5","low",55.22,9.88],
    ["osworld","Claude Opus 5","medium",60.26,12.67],
    ["osworld","Claude Opus 5","high",65.92,15.95],
    ["osworld","Claude Opus 5","xhigh",70.14,23.91],
    ["osworld","Claude Opus 5","max",70.19,24.11],
    ["osworld","GPT-5.6 Luna","low",11.97,0.0185],
    ["osworld","GPT-5.6 Luna","medium",22.73,0.0516],
    ["osworld","GPT-5.6 Luna","high",35.91,0.1614],
    ["osworld","GPT-5.6 Luna","xhigh",48.01,0.3573],
    ["osworld","GPT-5.6 Luna","max",52.71,0.4909],
    ["osworld","GPT-5.6 Sol","low",29.82,0.9086],
    ["osworld","GPT-5.6 Sol","medium",49.74,2.7275],
    ["osworld","GPT-5.6 Sol","high",56.47,4.4613],
    ["osworld","GPT-5.6 Sol","xhigh",60.92,5.9257],
    ["osworld","GPT-5.6 Sol","max",66.24,7.7105],
    ["osworld","GPT-6 Astra","low",62.17,2.5457],
    ["osworld","GPT-6 Astra","medium",69.25,5.1009],
    ["osworld","GPT-6 Astra","high",70.02,6.6024],
    ["osworld","GPT-6 Astra","xhigh",71.27,7.1744],
    ["osworld","GPT-6 Astra","max",73.49,9.0733],
    ["osworld","GPT-6 Luna","low",8.26,0.0297],
    ["osworld","GPT-6 Luna","medium",31.54,0.0624],
    ["osworld","GPT-6 Luna","high",41.43,0.1227],
    ["osworld","GPT-6 Luna","xhigh",46.7,0.1639],
    ["osworld","GPT-6 Luna","max",52.68,0.2678],
    ["osworld","GPT-6 Sol","low",43.9,0.9675],
    ["osworld","GPT-6 Sol","medium",54,1.3169],
    ["osworld","GPT-6 Sol","high",58.29,1.6379],
    ["osworld","GPT-6 Sol","xhigh",60.54,2.2127],
    ["osworld","GPT-6 Sol","max",64.43,3.2543]
  ];
  openAiRows.forEach(([sourceBenchmark, sourceModel, effort, score, cost]) => {
    const [benchmarkId, unit] = openAiBenchmarkMap[sourceBenchmark];
    const version = sourceBenchmark === "osworld" ? "OSWorld 2.0 offline v2026.08.08 · " : "";
    add(["openai-gpt6-sol-luna"], benchmarkId, openAiModelMap[sourceModel], score, unit, `${version}${effort} effort · $${cost} average cost/task`);
  });

  const cursorRows = [
    ["Opus 5.5 Max",57.8,13.43,218363,185],
    ["Opus 5.5 Extra High",56,6.98,101083,109],
    ["Opus 5.5 High",56,3.97,53078,68],
    ["Opus 5.5 Medium",52.5,2.91,37954,54],
    ["Fable 5.1 Max",51.8,17.28,117236,128],
    ["Fable 5.1 Extra High",51.6,13.01,87294,101],
    ["Fable 5.1 High",49.2,9.08,58438,77],
    ["Fable 5.1 Medium",46.8,7.05,45411,63],
    ["Opus 5 Max",46.6,11.95,85384,106],
    ["Grok 4.7 Extra High",46.3,6.01,70141,88],
    ["Opus 5 Extra High",46.1,11.43,80094,103],
    ["Fable 5.1 Low",45.1,5.44,34795,51],
    ["Opus 5 High",44.7,9,61405,86],
    ["Grok 4.7 High",43.9,4.69,56382,71],
    ["Opus 5.5 Low",43.7,1.17,15811,28],
    ["Opus 5 Medium",43.3,6.94,45272,72],
    ["GPT-5.6 Sol Max",41.7,8.23,42944,99],
    ["Grok 4.7 Medium",41.6,3.49,36683,60],
    ["Muse Spark 1.3 Max",41.6,2.64,52005,98],
    ["Grok 4.6 Extra High",41.4,6.1,49814,56],
    ["GPT-5.6 Terra Max",41.3,5.14,60814,107],
    ["Opus 5 Low",40.7,4.87,31995,57],
    ["Grok 4.6 High",40.4,5.2,41387,48],
    ["Gemini 3.8 Flash High",39.6,4.7,162565,324],
    ["GPT-5.6 Sol Extra High",37.7,4.4,24729,55],
    ["Muse Spark 1.3 Extra High",37.5,2.1,40891,83],
    ["Gemini 3.8 Flash Medium",37.3,4.06,128364,290],
    ["Grok 4.6 Medium",36.1,3.48,24893,40],
    ["GPT-5.6 Luna Max",35.9,1.03,87284,208],
    ["GPT-5.6 Sol High",35.7,2.85,16174,41],
    ["Sonnet 5 Max",34.1,7.17,149257,140],
    ["GPT-5.6 Terra Extra High",33.6,1.81,23436,43],
    ["Grok 4.6 Low",33.4,2.25,16307,32],
    ["Muse Spark 1.3 High",33.4,1.66,30654,69],
    ["Grok 4.7 Low",33.1,1.58,15677,40],
    ["GPT-5.6 Luna Extra High",33,0.44,40598,98],
    ["Muse Spark 1.3 Medium",32.6,1.49,27255,64],
    ["Sonnet 5 Extra High",32,4.55,83373,102],
    ["GPT-5.6 Sol Medium",31.1,1.77,10111,32],
    ["Sonnet 5 High",30.8,3.48,61146,85],
    ["GPT-5.6 Terra High",30.7,1.11,13162,33],
    ["GPT-5.6 Luna High",29.4,0.25,23368,64],
    ["Muse Spark 1.3 Low",29.3,0.93,17483,47],
    ["Sonnet 5 Medium",28,2.31,39114,65],
    ["Composer 2.5",27.7,0.68,17347,41],
    ["GPT-5.6 Terra Medium",27.6,0.64,7307,25],
    ["GPT-5.6 Terra Low",25.2,0.52,5914,23],
    ["GPT-5.6 Sol Low",24.6,0.87,4885,21],
    ["Muse Spark 1.3 Minimal",24.3,0.56,10620,34],
    ["Sonnet 5 Low",24.1,1.39,23772,46],
    ["GPT-5.6 Luna Medium",22.2,0.08,7642,32],
    ["GPT-5.6 Luna Low",16,0.03,3288,18]
  ];
  const cursorModels = [
    [/^Opus 5\.5 /, "claude-opus-5-5"], [/^Fable 5\.1 /, "claude-fable-5-1"], [/^Opus 5 /, "claude-opus-5"],
    [/^Grok 4\.7 /, "grok-4-7"], [/^Grok 4\.6 /, "grok-4-6"], [/^GPT-5\.6 Sol /, "gpt-5-6-sol"],
    [/^GPT-5\.6 Terra /, "gpt-5-6-terra"], [/^GPT-5\.6 Luna /, "gpt-5-6-luna"], [/^Muse Spark 1\.3 /, "muse-spark-1-3"],
    [/^Gemini 3\.8 Flash /, "gemini-3-8-flash"], [/^Sonnet 5 /, "claude-sonnet-5"], [/^Composer 2\.5$/, "cursor-composer-2-5"]
  ];
  cursorRows.forEach(([label, score, cost, tokens, steps]) => {
    const mapping = cursorModels.find(([pattern]) => pattern.test(label));
    if (!mapping) throw new Error(`Unmapped CursorBench model: ${label}`);
    const effort = label.match(/(Minimal|Low|Medium|High|Extra High|Max)$/)?.[1] || "default";
    add(["cursorbench"], "cursorbench-4-0", mapping[1], score, "%", `Cursor production agent · ${effort.toLowerCase()} effort · $${cost}/task · ${tokens.toLocaleString("en-US")} tokens · ${steps} steps`);
  });

  const opus = ["anthropic-opus55-system-card"];
  addRows(opus, [
    ["swe-bench-pro", "claude-opus-5-5", 89.9], ["swe-multilingual", "claude-opus-5-5", 93.9], ["swe-multimodal", "claude-opus-5-5", 61.4],
    ["swe-bench-pro", "claude-opus-5", 79.2], ["swe-multilingual", "claude-opus-5", 89.5], ["swe-multimodal", "claude-opus-5", 59.4],
    ["swe-bench-pro", "claude-fable-5-1", 81.2], ["swe-multilingual", "claude-fable-5-1", 89.1], ["swe-multimodal", "claude-fable-5-1", 54.7],
    ["deepswe-v1-1", "claude-opus-5-5", 74.2, "%", "five-trial average"],
    ["frontiercode-1-1-main", "claude-opus-5-5", 54.6, "%", "Claude Code · medium effort · mean@5"],
    ["frontiercode-1-1-main", "claude-opus-5-5", 54.4, "%", "Claude Code · max effort · mean@5"],
    ["frontiercode-1-1-extended", "claude-opus-5-5", 65.3, "%", "Claude Code · medium effort · mean@5"],
    ["frontiercode-1-1-extended", "claude-opus-5-5", 63.6, "%", "Claude Code · max effort · mean@5"],
    ["frontiercode-1-1-main", "claude-opus-5", 53.4, "%", "best reported effort"],
    ["frontiercode-1-1-main", "claude-fable-5", 53.5, "%", "best reported effort"],
    ["frontiercode-1-1-main", "gpt-6-astra", 53.3, "%", "best reported effort"],
    ["frontiercode-1-1-main", "claude-fable-5-1", 52.8, "%", "best reported effort"],
    ["frontiercode-1-1-extended", "claude-opus-5", 63.6, "%", "best reported effort"],
    ["frontiercode-1-1-extended", "claude-fable-5", 64.9, "%", "best reported effort"],
    ["frontiercode-1-1-extended", "gpt-6-astra", 64.5, "%", "best reported effort"],
    ["frontiercode-1-1-extended", "claude-fable-5-1", 63.6, "%", "best reported effort"],
    ["terminal-bench-4-0", "claude-opus-5-5", 66.36, "%", "Claude Code --bare · xhigh · safeguards with fallback · 5 trials/task"],
    ["terminal-bench-4-0", "claude-opus-5-5", 64.8, "%", "Claude Code --bare · max · safeguards with fallback · 5 trials/task"],
    ["terminal-bench-4-0", "claude-mythos-5-1", 60.9, "%", "Claude Code --bare · max"],
    ["terminal-bench-4-0", "claude-fable-5-1", 55.8, "%", "Claude Code --bare · max"],
    ["terminal-bench-4-0", "claude-opus-5", 52.3, "%", "Claude Code --bare · max"],
    ["terminal-bench-4-0", "gpt-6-astra", 57.9, "%", "Codex · high effort · OpenAI-reported"],
    ["terminal-bench-science", "claude-opus-5-5", 58.7, "%", "Claude Code --bare · max · safeguards with fallback · 10 trials/task"],
    ["terminal-bench-science", "claude-fable-5-1", 52.6, "%", "Claude Code --bare · max · 10 trials/task"],
    ["terminal-bench-science", "claude-opus-5", 29.0, "%", "Claude Code --bare · max · 12 trials/task"],
    ["terminal-bench-science", "claude-fable-5", 24.7, "%", "Claude Code --bare · max · 10 trials/task"],
    ["terminal-bench-science", "gpt-6-astra", 64.6, "%", "OpenAI-reported · max effort"],
    ["frontierswe-v2", "claude-opus-5-5", 62.3], ["frontierswe-v2", "gpt-6-astra", 65.5],
    ["frontierswe-v2", "claude-fable-5-1", 56.3], ["frontierswe-v2", "gpt-5-6-sol", 32.2]
  ], "Opus 5.5 System Card capability section");

  const cursorFromOpus = [
    ["claude-opus-5-5", 57.8, "max"], ["claude-opus-5-5", 56.0, "extra high"], ["claude-opus-5-5", 56.0, "high"],
    ["claude-opus-5-5", 52.5, "medium"], ["claude-fable-5-1", 51.8, "max"], ["claude-opus-5", 46.6, "max"], ["gpt-5-6-sol", 41.7, "max"]
  ];
  cursorFromOpus.forEach(([modelId, value, effort]) => add(opus, "cursorbench-4-0", modelId, value, "%", `Cursor production agent · ${effort} effort`));

  addRows(opus, [
    ["arxivmath", "claude-opus-5-5", 91.2, "%", "August 2026 · no tools · max · 4 attempts/problem"],
    ["arxivmath-tools", "claude-opus-5-5", 96.9, "%", "August 2026 · code sandbox · no internet · max · 4 attempts/problem"],
    ["arxivmath", "claude-fable-5-1", 82.9, "%", "August 2026 · no tools"], ["arxivmath-tools", "claude-fable-5-1", 92.1, "%", "August 2026 · code sandbox · no internet"],
    ["arxivmath", "claude-opus-5", 78.1, "%", "August 2026 · no tools"], ["arxivmath-tools", "claude-opus-5", 90.4, "%", "August 2026 · code sandbox · no internet"],
    ["arxivmath-tools", "gpt-6-astra", 88.6, "%", "MathArena vendor harness · max · 2 attempts/problem · LLM judge"],
    ["programbench-average-pass", "claude-opus-5-5", 91.2, "%", "166 golden tasks · mini-swe-agent · no 6-hour timeout"],
    ["programbench-average-pass", "claude-fable-5-1", 87.6, "%", "166 golden tasks · mini-swe-agent · no 6-hour timeout"],
    ["programbench-average-pass", "claude-opus-5", 85.4, "%", "166 golden tasks · mini-swe-agent · no 6-hour timeout"],
    ["hle", "claude-opus-5-5", 64.4, "%", "no tools · auto thinking · 1M total-token cap"],
    ["hle-tools", "claude-opus-5-5", 67.7, "%", "web search/fetch + programmatic tools + code · auto thinking · 1M total-token cap"],
    ["hle", "claude-opus-5", 56.6, "%", "no tools"], ["hle-tools", "claude-opus-5", 63.6, "%", "with tools"],
    ["hle", "claude-fable-5-1", 60.9, "%", "no tools"], ["hle-tools", "claude-fable-5-1", 65.6, "%", "with tools"],
    ["hle-tools", "gpt-6-astra", 57.2, "%", "with tools · provider-reported"],
    ["chartography", "claude-opus-5-5", 64.4, "%", "no tools · adaptive thinking · max · 5 runs · Gemini 3.5 Flash judge"],
    ["chartography-tools", "claude-opus-5-5", 89.0, "%", "container + crop tool · adaptive thinking · max · 5 runs"],
    ["chartography", "claude-fable-5-1", 44.8, "%", "no tools"], ["chartography-tools", "claude-fable-5-1", 88.4, "%", "with tools"],
    ["chartography", "claude-opus-5", 29.8, "%", "no tools"], ["chartography-tools", "claude-opus-5", 83.4, "%", "with tools"],
    ["benchcad-vision2code-iou", "claude-opus-5-5", 0.730, "voxel IoU", "1,000-file subset · 256×256 renders · no tools · max · 5 runs"],
    ["benchcad-vision2code-iou-tools", "claude-opus-5-5", 0.962, "voxel IoU", "1,000-file subset · 256×256 renders · tools · max · 5 runs"],
    ["benchcad-vision2code-iou", "claude-fable-5-1", 0.606, "voxel IoU", "1,000-file subset · 256×256 renders · no tools"],
    ["benchcad-vision2code-iou-tools", "claude-fable-5-1", 0.926, "voxel IoU", "1,000-file subset · 256×256 renders · tools"],
    ["benchcad-vision2code-iou", "claude-opus-5", 0.497, "voxel IoU", "1,000-file subset · 256×256 renders · no tools"],
    ["benchcad-vision2code-iou-tools", "claude-opus-5", 0.899, "voxel IoU", "1,000-file subset · 256×256 renders · tools"],
    ["osworld-2-partial", "claude-opus-5-5", 81.8, "%", "2026-09-10 task/assets · 1080p · 500 steps · max · 5 runs"],
    ["osworld-2-strict", "claude-opus-5-5", 48.7, "%", "2026-09-10 task/assets · 1080p · 500 steps · max · 5 runs"],
    ["osworld-2-partial", "claude-fable-5-1", 80.7, "%", "2026-09-10 task/assets · updated harness · max · 5 runs"],
    ["osworld-2-strict", "claude-fable-5-1", 42.8, "%", "2026-09-10 task/assets · updated harness · max · 5 runs"],
    ["osworld-2-partial", "claude-opus-5", 74.0, "%", "2026-09-10 task/assets · updated harness · max · 5 runs"],
    ["osworld-2-strict", "claude-opus-5", 37.2, "%", "2026-09-10 task/assets · updated harness · max · 5 runs"],
    ["officeqa", "claude-opus-5-5", 78.9, "%", "extracted-text sandbox + code · max · 5 runs"],
    ["officeqa-pro", "claude-opus-5-5", 67.7, "%", "133-question subset · extracted-text sandbox + code · max · 5 runs"],
    ["officeqa", "claude-opus-5", 78.1, "%", "same Opus 5.5 card setup"], ["officeqa-pro", "claude-opus-5", 66.9, "%", "same Opus 5.5 card setup"],
    ["officeqa", "claude-fable-5-1", 80.2, "%", "same Opus 5.5 card setup"], ["officeqa-pro", "claude-fable-5-1", 69.0, "%", "same Opus 5.5 card setup"],
    ["harvey-legal-heldout", "claude-opus-5-5", 8.3, "%", "120-task held-out set · max · Artificial Analysis harness · all-pass"],
    ["harvey-legal-heldout-criterion-pass", "claude-opus-5-5", 91.2, "%", "120-task held-out set · max · mean criterion-pass"],
    ["gdpval-aa-v2", "claude-opus-5-5", 1846, "Elo", "Artificial Analysis · max effort"],
    ["gdpval-aa-v2", "claude-opus-5-5", 1820, "Elo", "Artificial Analysis · xhigh effort"],
    ["gdpval-aa-v2", "claude-fable-5-1", 1735, "Elo", "Artificial Analysis · max effort"],
    ["gdpval-aa-v2", "claude-opus-5", 1708, "Elo", "Artificial Analysis · max effort"],
    ["aa-briefcase", "claude-opus-5-5", 1822, "Elo", "v1.1 · Artificial Analysis · max effort"],
    ["aa-briefcase", "claude-opus-5-5", 1780, "Elo", "v1.1 · Artificial Analysis · xhigh effort"],
    ["aa-briefcase", "claude-opus-5-5", 1705, "Elo", "v1.1 · Artificial Analysis · high effort"],
    ["aa-briefcase", "claude-fable-5-1", 1678, "Elo", "v1.1 · Artificial Analysis · max effort"],
    ["aa-briefcase", "claude-opus-5", 1673, "Elo", "v1.1 · Artificial Analysis · max effort"]
  ], "Opus 5.5 System Card capability section");

  const toolathlonRows = [
    ["claude-opus-5-5", 77.8, 82.4, 72.2, 26.9], ["claude-fable-5-1", 77.8, 81.5, 73.1, 23.7],
    ["claude-opus-5", 80.6, 87.0, 73.1, 23.5], ["claude-mythos-5", 79.3, 86.1, 73.1, 19.8],
    ["claude-opus-4-8", 79.9, 88.0, 71.3, 20.4], ["claude-sonnet-5", 74.7, 84.3, 65.7, 24.5]
  ];
  toolathlonRows.forEach(([modelId, pass1, pass3, passCubed, turns]) => {
    const setting = "internal pinned harness · adaptive thinking · max · 108 tasks · 3 trials";
    add(opus, "toolathlon", modelId, pass1, "%", `${setting} · Pass@1`);
    add(opus, "toolathlon-pass3", modelId, pass3, "%", setting);
    add(opus, "toolathlon-pass-cubed", modelId, passCubed, "%", setting);
    add(opus, "toolathlon-average-turns", modelId, turns, "turns", setting);
  });

  addRows(opus, [
    ["automationbench", "claude-opus-5-5", 40.0, "%", "v1.0.6 leaderboard · max effort"],
    ["automationbench", "claude-fable-5-1", 31.4, "%", "v1.0.6 leaderboard · max effort"],
    ["automationbench", "claude-opus-5", 26.9, "%", "v1.0.6 leaderboard · max effort"],
    ["healthbench", "claude-opus-5-5", 68.1, "%", "raw · no tools · Opus 4.8 grader · max · 5 trials"],
    ["healthbench", "claude-opus-5-5", 60.6, "%", "length-adjusted · no tools · Opus 4.8 grader · max · 5 trials"],
    ["healthbench", "claude-fable-5-1", 66.7, "%", "raw · same Opus 5.5 card setup"],
    ["healthbench", "claude-sonnet-5", 59.2, "%", "raw · same Opus 5.5 card setup"],
    ["healthbench", "claude-opus-5", 67.1, "%", "raw · same Opus 5.5 card setup"],
    ["healthbench-professional", "claude-opus-5-5", 77.1, "%", "raw · no tools · Opus 4.8 grader · max · 5 trials"],
    ["healthbench-professional", "claude-opus-5-5", 65.6, "%", "length-adjusted · no tools · Opus 4.8 grader · max · 5 trials"],
    ["healthbench-professional", "claude-opus-5", 73.4, "%", "raw · same Opus 5.5 card setup"],
    ["healthbench-professional", "claude-opus-5", 59.8, "%", "length-adjusted · same Opus 5.5 card setup"],
    ["healthbench-professional", "claude-fable-5-1", 74.2, "%", "raw · same Opus 5.5 card setup"],
    ["healthbench-professional", "claude-fable-5-1", 62.1, "%", "length-adjusted · same Opus 5.5 card setup"],
    ["healthbench-professional", "claude-sonnet-5", 62.4, "%", "raw · same Opus 5.5 card setup"],
    ["gmmlu", "claude-opus-5-5", 94.3], ["gmmlu", "claude-fable-5-1", 94.0], ["gmmlu", "claude-opus-5", 92.5], ["gmmlu", "claude-sonnet-5", 89.2],
    ["milu", "claude-opus-5-5", 93.1], ["milu", "claude-fable-5-1", 93.0], ["milu", "claude-opus-5", 92.1], ["milu", "claude-sonnet-5", 89.3],
    ["biomysterybench", "claude-opus-5-5", 89.3, "%", "Human Solvable · 73 tasks"], ["biomysterybench", "claude-opus-5-5", 50.0, "%", "Human Difficult · 17 tasks"],
    ["biomysterybench", "claude-opus-5", 91.4, "%", "Human Solvable · 73 tasks"], ["biomysterybench", "claude-opus-5", 51.8, "%", "Human Difficult · 17 tasks"],
    ["biomysterybench", "claude-mythos-5-1", 90.3, "%", "Human Solvable · 73 tasks"], ["biomysterybench", "claude-mythos-5-1", 44.1, "%", "Human Difficult · 17 tasks"],
    ["biomysterybench", "claude-sonnet-5", 84.9, "%", "Human Solvable · 73 tasks"], ["biomysterybench", "claude-sonnet-5", 39.4, "%", "Human Difficult · 17 tasks"],
    ["spatialbench-verified", "claude-opus-5-5", 72.0, "score"], ["spatialbench-verified", "claude-mythos-5-1", 77.6, "score"], ["spatialbench-verified", "claude-opus-5", 71.7, "score"], ["spatialbench-verified", "claude-sonnet-5", 68.9, "score"],
    ["singlecellbench", "claude-opus-5-5", 61.2, "score"], ["singlecellbench", "claude-mythos-5-1", 61.8, "score"], ["singlecellbench", "claude-opus-5", 60.5, "score"], ["singlecellbench", "claude-sonnet-5", 56.5, "score"],
    ["morphology-molecule-matching", "claude-opus-5-5", 34.0], ["morphology-molecule-matching", "claude-mythos-5-1", 25.8], ["morphology-molecule-matching", "claude-opus-5", 25.0], ["morphology-molecule-matching", "claude-sonnet-5", 6.8], ["morphology-molecule-matching", "gpt-6-astra", 22.8],
    ["medicinal-chemistry-adme", "claude-opus-5-5", 63.5], ["medicinal-chemistry-adme", "claude-opus-5", 57.9], ["medicinal-chemistry-adme", "claude-mythos-5-1", 57.7], ["medicinal-chemistry-adme", "gpt-6-astra", 56.6], ["medicinal-chemistry-adme", "claude-sonnet-5", 41.3],
    ["protein-design-sequence", "claude-opus-5-5", 60.2], ["protein-design-sequence", "claude-mythos-5-1", 46.0], ["protein-design-sequence", "claude-opus-5", 42.4], ["protein-design-sequence", "claude-sonnet-5", 20.2],
    ["protein-design-library-ranking", "claude-opus-5-5", 56.0], ["protein-design-library-ranking", "claude-mythos-5-1", 56.9], ["protein-design-library-ranking", "claude-opus-5", 53.5], ["protein-design-library-ranking", "claude-sonnet-5", 44.0],
    ["protein-binder-design", "claude-opus-5-5", 82.6], ["protein-binder-design", "claude-mythos-5-1", 79.1], ["protein-binder-design", "claude-opus-5", 78.9], ["protein-binder-design", "claude-sonnet-5", 72.6],
    ["biomedical-image-analysis", "claude-opus-5-5", 71.4], ["biomedical-image-analysis", "gpt-6-astra", 77.5], ["biomedical-image-analysis", "claude-mythos-5-1", 67.1], ["biomedical-image-analysis", "claude-opus-5", 61.0], ["biomedical-image-analysis", "claude-sonnet-5", 42.3],
    ["protocol-troubleshooting", "claude-opus-5-5", 73.7, "score"], ["protocol-troubleshooting", "claude-mythos-5-1", 70.2, "score"], ["protocol-troubleshooting", "claude-opus-5", 68.9, "score"], ["protocol-troubleshooting", "gpt-6-astra", 66.0, "score"], ["protocol-troubleshooting", "claude-sonnet-5", 49.9, "score"],
    ["protocol-understanding-v2", "claude-opus-5-5", 69.0], ["protocol-understanding-v2", "claude-mythos-5-1", 69.6], ["protocol-understanding-v2", "claude-opus-5", 71.8], ["protocol-understanding-v2", "gpt-6-astra", 61.9], ["protocol-understanding-v2", "claude-sonnet-5", 58.9]
  ], "Opus 5.5 System Card · adaptive thinking · max effort unless stated");

  const grokCard = ["xai-grok47-model-card"];
  const grokRows = [
    ["deepswe-v1-1", [["gpt-5-6-sol",72.7,"max"],["grok-4-7",71.0,"high"],["claude-fable-5-opus-4-8-fallback",69.7,"max"],["grok-4-6",65.2,"high"],["claude-sonnet-5",54.0,"max"]], "Datacurve mini-SWE-agent · Pass@1"],
    ["terminal-bench-4-0", [["claude-fable-5-1",57.9,"max"],["grok-4-7",38.0,"xhigh"],["gpt-5-6-sol",37.3,"max"],["gpt-5-6-terra",21.5,"max"],["grok-4-6",20.3,"high"],["grok-4-5",12.4,"high"],["claude-sonnet-5",12.4,"max"]], "Harbor · provider harness · task success rate"],
    ["frontierswe-v2", [["claude-fable-5-1",56.3,"max"],["gpt-5-6-sol",32.2,"max"],["grok-4-7",29.0,"xhigh"],["kimi-k3",25.9,"max"],["grok-4-6",25.3,"xhigh"]], "Proximal Proximus harness · mean@5"],
    ["swe-marathon-v1-1", [["claude-opus-5",50.0,"max"],["grok-4-7",46.0,"high"],["claude-fable-5-opus-4-8-fallback",45.0,"max"],["gpt-5-6-sol",42.5,"max"],["gpt-5-6-terra",32.5,"max"],["grok-4-6",31.9,"high"],["claude-sonnet-5",30.0,"max"]], "native provider harnesses · 8 trials/task · resolution rate"],
    ["harvey-legal-agent", [["grok-4-7",19.6,"xhigh"],["grok-4-6",15.8,"high"],["claude-fable-5-opus-4-8-fallback",11.3,"max"],["claude-fable-5-1-opus-5-fallback",6.7,"max"],["claude-sonnet-5",5.0,"max"],["gpt-5-6-sol",2.5,"max"],["gpt-5-6-terra",0.8,"max"]], "Vals AI · 120-task held-out · Valkyrie · no internet · Harvey final score"],
    ["eebench", [["gpt-6-astra",69.3,"max"],["grok-4-7",66.0,"xhigh"],["claude-opus-5",61.6,"max"],["grok-4-6",60.0,"xhigh"],["claude-fable-5-opus-4-8-fallback",54.2,"max"],["grok-4-6",53.0,"high"],["gpt-5-6-sol",39.4,"max"]], "Atopile · provider harnesses · reward"],
    ["cadgenbench", [["grok-4-7",44.4,"high"],["grok-4-6",40.9,"high"],["gpt-5-6-sol",37.1,"xhigh"],["claude-opus-5",36.6,"max"]], "Mecado · generation split · provider harnesses · reward"],
    ["healthbench-professional", [["gpt-6-astra",63.4,"max"],["claude-fable-5-1",62.1,"max"],["gpt-5-6-sol",60.5,"max"],["grok-4-7",56.7,"xhigh"],["grok-4-6",48.5,"xhigh"]], "length-adjusted score · rejected requests scored zero"],
    ["latchbio-capabilities-v1", [["gpt-6-astra",47.4,"max"],["grok-4-7",44.5,"xhigh"],["grok-4-6",43.3,"high"],["gpt-5-6-terra",43.1,"max"],["claude-sonnet-5",40.2,"max"]], "11-benchmark live-suite snapshot · equally weighted overall"]
  ];
  grokRows.forEach(([benchmarkId, rows, common]) => rows.forEach(([modelId, value, effort]) => add(grokCard, benchmarkId, modelId, value, "%", `${common} · ${effort} effort`)));
  [["grok-4-7",46.3,"extra high"],["grok-4-7",43.9,"high"]].forEach(([modelId,value,effort]) => add(grokCard,"cursorbench-4-0",modelId,value,"%",`Cursor production agent · ${effort} effort`));

  addRows(["xai-grok47"], [
    ["terminal-bench-4-0", "grok-4-7", 37.6, "%", "Grok Build · release-page value"],
    ["eebench", "grok-4-7", 64.0, "%", "Grok Build · release-page value"],
    ["gdpval-aa-v2", "grok-4-7", 1695, "Elo", "release-page snapshot"],
    ["aa-briefcase", "grok-4-7", 1657, "Elo", "release-page snapshot"]
  ]);

  const mhbModelMap = {
    "gpt-6-astra": "gpt-6-astra", "gpt-6-sol": "gpt-6-sol", "claude-opus-5.5": "claude-opus-5-5", "gpt-6-luna": "gpt-6-luna",
    "gpt-5.6-sol-aug-2026": "gpt-5-6-sol-aug-2026", "muse-spark-1.3": "muse-spark-1-3", "claude-fable-5.1": "claude-fable-5-1",
    "gpt-5.6-luna-aug-2026": "gpt-5-6-luna-aug-2026", "claude-sonnet-5": "claude-sonnet-5", "claude-haiku-4.5": "claude-haiku-4-5",
    "grok-4.7": "grok-4-7", "gemini-3.8-flash": "gemini-3-8-flash", "gpt-4o-march-2025": "gpt-4o-march-2025",
    "gemini-3.1-pro": "gemini-3-1-pro", "gemini-2.5-pro": "gemini-2-5-pro"
  };
  const mentalHealthRows = [
    ["gpt-6-astra","overall",57.3337],
    ["gpt-6-sol","overall",53.9408],
    ["claude-opus-5.5","overall",52.3784],
    ["gpt-6-luna","overall",50.2101],
    ["gpt-5.6-sol-aug-2026","overall",46.9803],
    ["muse-spark-1.3","overall",48.5977],
    ["claude-fable-5.1","overall",46.3555],
    ["gpt-5.6-luna-aug-2026","overall",44.8898],
    ["claude-sonnet-5","overall",44.5402],
    ["claude-haiku-4.5","overall",41.7316],
    ["grok-4.7","overall",41.3023],
    ["gemini-3.8-flash","overall",35.5025],
    ["gpt-4o-march-2025","overall",32.0824],
    ["gemini-3.1-pro","overall",32.0566],
    ["gemini-2.5-pro","overall",29.5056],
    ["gpt-6-astra","acuity-emergent",58.2592],
    ["gpt-6-astra","acuity-high-acuity",57.9206],
    ["gpt-6-astra","acuity-non-acute",56.6443],
    ["gpt-6-sol","acuity-emergent",55.1394],
    ["gpt-6-sol","acuity-high-acuity",57.0049],
    ["gpt-6-sol","acuity-non-acute",52.2647],
    ["claude-opus-5.5","acuity-emergent",53.9053],
    ["claude-opus-5.5","acuity-high-acuity",52.8111],
    ["claude-opus-5.5","acuity-non-acute",51.4233],
    ["gpt-6-luna","acuity-emergent",52.6108],
    ["gpt-6-luna","acuity-high-acuity",53.3235],
    ["gpt-6-luna","acuity-non-acute",47.881],
    ["gpt-5.6-sol-aug-2026","acuity-emergent",46.0825],
    ["gpt-5.6-sol-aug-2026","acuity-high-acuity",53.5904],
    ["gpt-5.6-sol-aug-2026","acuity-non-acute",45.208],
    ["muse-spark-1.3","acuity-emergent",54.3485],
    ["muse-spark-1.3","acuity-high-acuity",55.5014],
    ["muse-spark-1.3","acuity-non-acute",43.207],
    ["claude-fable-5.1","acuity-emergent",47.769],
    ["claude-fable-5.1","acuity-high-acuity",50.528],
    ["claude-fable-5.1","acuity-non-acute",44.1887],
    ["gpt-5.6-luna-aug-2026","acuity-emergent",43.6652],
    ["gpt-5.6-luna-aug-2026","acuity-high-acuity",52.338],
    ["gpt-5.6-luna-aug-2026","acuity-non-acute",43.0055],
    ["claude-sonnet-5","acuity-emergent",43.0961],
    ["claude-sonnet-5","acuity-high-acuity",48.6621],
    ["claude-sonnet-5","acuity-non-acute",43.903],
    ["claude-haiku-4.5","acuity-emergent",41.0926],
    ["claude-haiku-4.5","acuity-high-acuity",43.7075],
    ["claude-haiku-4.5","acuity-non-acute",41.3979],
    ["grok-4.7","acuity-emergent",41.5478],
    ["grok-4.7","acuity-high-acuity",44.2775],
    ["grok-4.7","acuity-non-acute",40.1609],
    ["gemini-3.8-flash","acuity-emergent",37.8637],
    ["gemini-3.8-flash","acuity-high-acuity",41.3032],
    ["gemini-3.8-flash","acuity-non-acute",32.2807],
    ["gpt-4o-march-2025","acuity-emergent",24.0657],
    ["gpt-4o-march-2025","acuity-high-acuity",31.6846],
    ["gpt-4o-march-2025","acuity-non-acute",36.4604],
    ["gemini-3.1-pro","acuity-emergent",31.7792],
    ["gemini-3.1-pro","acuity-high-acuity",38.4878],
    ["gemini-3.1-pro","acuity-non-acute",30.0168],
    ["gemini-2.5-pro","acuity-emergent",27.7788],
    ["gemini-2.5-pro","acuity-high-acuity",33.7859],
    ["gemini-2.5-pro","acuity-non-acute",28.9642],
    ["gpt-6-astra","persona-caregiver",66.302],
    ["gpt-6-astra","persona-clinician-user",65.1494],
    ["gpt-6-astra","persona-layperson",56.4764],
    ["gpt-6-astra","persona-teen",55.873],
    ["gpt-6-sol","persona-caregiver",64.5966],
    ["gpt-6-sol","persona-clinician-user",58.1778],
    ["gpt-6-sol","persona-layperson",53.1873],
    ["gpt-6-sol","persona-teen",52.7266],
    ["claude-opus-5.5","persona-caregiver",62.9752],
    ["claude-opus-5.5","persona-clinician-user",52.5366],
    ["claude-opus-5.5","persona-layperson",50.1646],
    ["claude-opus-5.5","persona-teen",56.9939],
    ["gpt-6-luna","persona-caregiver",56.8958],
    ["gpt-6-luna","persona-clinician-user",56.2182],
    ["gpt-6-luna","persona-layperson",49.5833],
    ["gpt-6-luna","persona-teen",49.0323],
    ["gpt-5.6-sol-aug-2026","persona-caregiver",60.3141],
    ["gpt-5.6-sol-aug-2026","persona-clinician-user",55.7022],
    ["gpt-5.6-sol-aug-2026","persona-layperson",45.6596],
    ["gpt-5.6-sol-aug-2026","persona-teen",45.7469],
    ["muse-spark-1.3","persona-caregiver",61.5144],
    ["muse-spark-1.3","persona-clinician-user",53.4022],
    ["muse-spark-1.3","persona-layperson",45.7086],
    ["muse-spark-1.3","persona-teen",53.5816],
    ["claude-fable-5.1","persona-caregiver",57.6037],
    ["claude-fable-5.1","persona-clinician-user",47.7609],
    ["claude-fable-5.1","persona-layperson",44.6293],
    ["claude-fable-5.1","persona-teen",48.9078],
    ["gpt-5.6-luna-aug-2026","persona-caregiver",55.7721],
    ["gpt-5.6-luna-aug-2026","persona-clinician-user",49.4514],
    ["gpt-5.6-luna-aug-2026","persona-layperson",44.3621],
    ["gpt-5.6-luna-aug-2026","persona-teen",42.8069],
    ["claude-sonnet-5","persona-caregiver",55.6955],
    ["claude-sonnet-5","persona-clinician-user",46.2631],
    ["claude-sonnet-5","persona-layperson",42.0894],
    ["claude-sonnet-5","persona-teen",49.3625],
    ["claude-haiku-4.5","persona-caregiver",51.9652],
    ["claude-haiku-4.5","persona-clinician-user",39.3966],
    ["claude-haiku-4.5","persona-layperson",39.8524],
    ["claude-haiku-4.5","persona-teen",46.0328],
    ["grok-4.7","persona-caregiver",52.2416],
    ["grok-4.7","persona-clinician-user",56.0792],
    ["grok-4.7","persona-layperson",39.522],
    ["grok-4.7","persona-teen",40.4595],
    ["gemini-3.8-flash","persona-caregiver",45.0862],
    ["gemini-3.8-flash","persona-clinician-user",46.6216],
    ["gemini-3.8-flash","persona-layperson",33.6578],
    ["gemini-3.8-flash","persona-teen",36.1799],
    ["gpt-4o-march-2025","persona-caregiver",36.2655],
    ["gpt-4o-march-2025","persona-clinician-user",40.8611],
    ["gpt-4o-march-2025","persona-layperson",29.9956],
    ["gpt-4o-march-2025","persona-teen",35.4378],
    ["gemini-3.1-pro","persona-caregiver",41.6034],
    ["gemini-3.1-pro","persona-clinician-user",45.0876],
    ["gemini-3.1-pro","persona-layperson",29.3785],
    ["gemini-3.1-pro","persona-teen",34.907],
    ["gemini-2.5-pro","persona-caregiver",35.4303],
    ["gemini-2.5-pro","persona-clinician-user",47.4142],
    ["gemini-2.5-pro","persona-layperson",27.6801],
    ["gemini-2.5-pro","persona-teen",29.1261],
    ["gpt-6-astra","behavior-context-seeking-and-assessment",52.8336],
    ["gpt-6-astra","behavior-actionable-guidance-and-coping-strategies",72.2228],
    ["gpt-6-astra","behavior-clinical-reasoning-and-health-accuracy",82.6027],
    ["gpt-6-astra","behavior-interpretation-and-cognitive-reframing",79.3871],
    ["gpt-6-astra","behavior-empathy-emotional-attunement-and-support",82.2096],
    ["gpt-6-astra","behavior-unsupported-belief-and-reality-testing-calibration",91.6542],
    ["gpt-6-astra","behavior-over-alarmism-and-under-response",77.6565],
    ["gpt-6-astra","behavior-dual-use-refusals-and-harm-avoidance",70.84],
    ["gpt-6-astra","behavior-collaboration-and-user-agency",59.1809],
    ["gpt-6-astra","behavior-communication-and-writing",86.0515],
    ["gpt-6-sol","behavior-context-seeking-and-assessment",47.4325],
    ["gpt-6-sol","behavior-actionable-guidance-and-coping-strategies",71.2323],
    ["gpt-6-sol","behavior-clinical-reasoning-and-health-accuracy",79.9922],
    ["gpt-6-sol","behavior-interpretation-and-cognitive-reframing",78.9401],
    ["gpt-6-sol","behavior-empathy-emotional-attunement-and-support",84.1692],
    ["gpt-6-sol","behavior-unsupported-belief-and-reality-testing-calibration",87.1755],
    ["gpt-6-sol","behavior-over-alarmism-and-under-response",80.5344],
    ["gpt-6-sol","behavior-dual-use-refusals-and-harm-avoidance",72.3651],
    ["gpt-6-sol","behavior-collaboration-and-user-agency",58.3027],
    ["gpt-6-sol","behavior-communication-and-writing",89.2803],
    ["claude-opus-5.5","behavior-context-seeking-and-assessment",56.885],
    ["claude-opus-5.5","behavior-actionable-guidance-and-coping-strategies",69.4419],
    ["claude-opus-5.5","behavior-clinical-reasoning-and-health-accuracy",70.6909],
    ["claude-opus-5.5","behavior-interpretation-and-cognitive-reframing",63.0707],
    ["claude-opus-5.5","behavior-empathy-emotional-attunement-and-support",84.2489],
    ["claude-opus-5.5","behavior-unsupported-belief-and-reality-testing-calibration",72.5162],
    ["claude-opus-5.5","behavior-over-alarmism-and-under-response",73.974],
    ["claude-opus-5.5","behavior-dual-use-refusals-and-harm-avoidance",66.2189],
    ["claude-opus-5.5","behavior-collaboration-and-user-agency",63.5431],
    ["claude-opus-5.5","behavior-communication-and-writing",65.753],
    ["gpt-6-luna","behavior-context-seeking-and-assessment",36.2435],
    ["gpt-6-luna","behavior-actionable-guidance-and-coping-strategies",70.7672],
    ["gpt-6-luna","behavior-clinical-reasoning-and-health-accuracy",80.5504],
    ["gpt-6-luna","behavior-interpretation-and-cognitive-reframing",79.6247],
    ["gpt-6-luna","behavior-empathy-emotional-attunement-and-support",83.0764],
    ["gpt-6-luna","behavior-unsupported-belief-and-reality-testing-calibration",86.9114],
    ["gpt-6-luna","behavior-over-alarmism-and-under-response",76.7653],
    ["gpt-6-luna","behavior-dual-use-refusals-and-harm-avoidance",71.6082],
    ["gpt-6-luna","behavior-collaboration-and-user-agency",58.2552],
    ["gpt-6-luna","behavior-communication-and-writing",87.3045],
    ["gpt-5.6-sol-aug-2026","behavior-context-seeking-and-assessment",36.4764],
    ["gpt-5.6-sol-aug-2026","behavior-actionable-guidance-and-coping-strategies",70.8079],
    ["gpt-5.6-sol-aug-2026","behavior-clinical-reasoning-and-health-accuracy",76.2213],
    ["gpt-5.6-sol-aug-2026","behavior-interpretation-and-cognitive-reframing",69.2857],
    ["gpt-5.6-sol-aug-2026","behavior-empathy-emotional-attunement-and-support",82.118],
    ["gpt-5.6-sol-aug-2026","behavior-unsupported-belief-and-reality-testing-calibration",77.6621],
    ["gpt-5.6-sol-aug-2026","behavior-over-alarmism-and-under-response",77.2491],
    ["gpt-5.6-sol-aug-2026","behavior-dual-use-refusals-and-harm-avoidance",59.2698],
    ["gpt-5.6-sol-aug-2026","behavior-collaboration-and-user-agency",54.5068],
    ["gpt-5.6-sol-aug-2026","behavior-communication-and-writing",61.0603],
    ["muse-spark-1.3","behavior-context-seeking-and-assessment",52.2593],
    ["muse-spark-1.3","behavior-actionable-guidance-and-coping-strategies",68.6476],
    ["muse-spark-1.3","behavior-clinical-reasoning-and-health-accuracy",71.0515],
    ["muse-spark-1.3","behavior-interpretation-and-cognitive-reframing",48.9233],
    ["muse-spark-1.3","behavior-empathy-emotional-attunement-and-support",81.3601],
    ["muse-spark-1.3","behavior-unsupported-belief-and-reality-testing-calibration",54.9523],
    ["muse-spark-1.3","behavior-over-alarmism-and-under-response",74.8458],
    ["muse-spark-1.3","behavior-dual-use-refusals-and-harm-avoidance",82.2889],
    ["muse-spark-1.3","behavior-collaboration-and-user-agency",62.6897],
    ["muse-spark-1.3","behavior-communication-and-writing",51.9026],
    ["claude-fable-5.1","behavior-context-seeking-and-assessment",48.6219],
    ["claude-fable-5.1","behavior-actionable-guidance-and-coping-strategies",69.2545],
    ["claude-fable-5.1","behavior-clinical-reasoning-and-health-accuracy",66.4223],
    ["claude-fable-5.1","behavior-interpretation-and-cognitive-reframing",54.1479],
    ["claude-fable-5.1","behavior-empathy-emotional-attunement-and-support",79.7373],
    ["claude-fable-5.1","behavior-unsupported-belief-and-reality-testing-calibration",64.1348],
    ["claude-fable-5.1","behavior-over-alarmism-and-under-response",78.0791],
    ["claude-fable-5.1","behavior-dual-use-refusals-and-harm-avoidance",59.187],
    ["claude-fable-5.1","behavior-collaboration-and-user-agency",58.4908],
    ["claude-fable-5.1","behavior-communication-and-writing",61.7646],
    ["gpt-5.6-luna-aug-2026","behavior-context-seeking-and-assessment",34.1625],
    ["gpt-5.6-luna-aug-2026","behavior-actionable-guidance-and-coping-strategies",69.5069],
    ["gpt-5.6-luna-aug-2026","behavior-clinical-reasoning-and-health-accuracy",74.7252],
    ["gpt-5.6-luna-aug-2026","behavior-interpretation-and-cognitive-reframing",69.9117],
    ["gpt-5.6-luna-aug-2026","behavior-empathy-emotional-attunement-and-support",82.2071],
    ["gpt-5.6-luna-aug-2026","behavior-unsupported-belief-and-reality-testing-calibration",76.8485],
    ["gpt-5.6-luna-aug-2026","behavior-over-alarmism-and-under-response",75.6956],
    ["gpt-5.6-luna-aug-2026","behavior-dual-use-refusals-and-harm-avoidance",60.9125],
    ["gpt-5.6-luna-aug-2026","behavior-collaboration-and-user-agency",53.0158],
    ["gpt-5.6-luna-aug-2026","behavior-communication-and-writing",67.0597],
    ["claude-sonnet-5","behavior-context-seeking-and-assessment",46.1073],
    ["claude-sonnet-5","behavior-actionable-guidance-and-coping-strategies",69.3368],
    ["claude-sonnet-5","behavior-clinical-reasoning-and-health-accuracy",66.4707],
    ["claude-sonnet-5","behavior-interpretation-and-cognitive-reframing",58.7034],
    ["claude-sonnet-5","behavior-empathy-emotional-attunement-and-support",82.7213],
    ["claude-sonnet-5","behavior-unsupported-belief-and-reality-testing-calibration",65.3478],
    ["claude-sonnet-5","behavior-over-alarmism-and-under-response",75.3771],
    ["claude-sonnet-5","behavior-dual-use-refusals-and-harm-avoidance",48.5795],
    ["claude-sonnet-5","behavior-collaboration-and-user-agency",67.0919],
    ["claude-sonnet-5","behavior-communication-and-writing",61.6678],
    ["claude-haiku-4.5","behavior-context-seeking-and-assessment",35.9129],
    ["claude-haiku-4.5","behavior-actionable-guidance-and-coping-strategies",72.4274],
    ["claude-haiku-4.5","behavior-clinical-reasoning-and-health-accuracy",64.553],
    ["claude-haiku-4.5","behavior-interpretation-and-cognitive-reframing",54.5209],
    ["claude-haiku-4.5","behavior-empathy-emotional-attunement-and-support",81.378],
    ["claude-haiku-4.5","behavior-unsupported-belief-and-reality-testing-calibration",65.4779],
    ["claude-haiku-4.5","behavior-over-alarmism-and-under-response",69.9241],
    ["claude-haiku-4.5","behavior-dual-use-refusals-and-harm-avoidance",55.1596],
    ["claude-haiku-4.5","behavior-collaboration-and-user-agency",61.3995],
    ["claude-haiku-4.5","behavior-communication-and-writing",68.7291],
    ["grok-4.7","behavior-context-seeking-and-assessment",24.3074],
    ["grok-4.7","behavior-actionable-guidance-and-coping-strategies",69.6542],
    ["grok-4.7","behavior-clinical-reasoning-and-health-accuracy",75.33],
    ["grok-4.7","behavior-interpretation-and-cognitive-reframing",58.978],
    ["grok-4.7","behavior-empathy-emotional-attunement-and-support",80.9389],
    ["grok-4.7","behavior-unsupported-belief-and-reality-testing-calibration",71.3678],
    ["grok-4.7","behavior-over-alarmism-and-under-response",71.7241],
    ["grok-4.7","behavior-dual-use-refusals-and-harm-avoidance",79.3489],
    ["grok-4.7","behavior-collaboration-and-user-agency",55.8219],
    ["grok-4.7","behavior-communication-and-writing",65.5389],
    ["gemini-3.8-flash","behavior-context-seeking-and-assessment",25.3938],
    ["gemini-3.8-flash","behavior-actionable-guidance-and-coping-strategies",65.7635],
    ["gemini-3.8-flash","behavior-clinical-reasoning-and-health-accuracy",63.2978],
    ["gemini-3.8-flash","behavior-interpretation-and-cognitive-reframing",39.5762],
    ["gemini-3.8-flash","behavior-empathy-emotional-attunement-and-support",79.1428],
    ["gemini-3.8-flash","behavior-unsupported-belief-and-reality-testing-calibration",59.3629],
    ["gemini-3.8-flash","behavior-over-alarmism-and-under-response",81.435],
    ["gemini-3.8-flash","behavior-dual-use-refusals-and-harm-avoidance",61.5477],
    ["gemini-3.8-flash","behavior-collaboration-and-user-agency",50.4323],
    ["gemini-3.8-flash","behavior-communication-and-writing",51.1978],
    ["gpt-4o-march-2025","behavior-context-seeking-and-assessment",18.724],
    ["gpt-4o-march-2025","behavior-actionable-guidance-and-coping-strategies",64.7825],
    ["gpt-4o-march-2025","behavior-clinical-reasoning-and-health-accuracy",65.6855],
    ["gpt-4o-march-2025","behavior-interpretation-and-cognitive-reframing",56.9257],
    ["gpt-4o-march-2025","behavior-empathy-emotional-attunement-and-support",75.427],
    ["gpt-4o-march-2025","behavior-unsupported-belief-and-reality-testing-calibration",54.7866],
    ["gpt-4o-march-2025","behavior-over-alarmism-and-under-response",69.6518],
    ["gpt-4o-march-2025","behavior-dual-use-refusals-and-harm-avoidance",50.5557],
    ["gpt-4o-march-2025","behavior-collaboration-and-user-agency",59.5062],
    ["gpt-4o-march-2025","behavior-communication-and-writing",66.8366],
    ["gemini-3.1-pro","behavior-context-seeking-and-assessment",22.1115],
    ["gemini-3.1-pro","behavior-actionable-guidance-and-coping-strategies",61.6496],
    ["gemini-3.1-pro","behavior-clinical-reasoning-and-health-accuracy",61.5782],
    ["gemini-3.1-pro","behavior-interpretation-and-cognitive-reframing",36.3717],
    ["gemini-3.1-pro","behavior-empathy-emotional-attunement-and-support",79.6125],
    ["gemini-3.1-pro","behavior-unsupported-belief-and-reality-testing-calibration",49.2184],
    ["gemini-3.1-pro","behavior-over-alarmism-and-under-response",75.4326],
    ["gemini-3.1-pro","behavior-dual-use-refusals-and-harm-avoidance",45.2744],
    ["gemini-3.1-pro","behavior-collaboration-and-user-agency",45.3989],
    ["gemini-3.1-pro","behavior-communication-and-writing",45.002],
    ["gemini-2.5-pro","behavior-context-seeking-and-assessment",15.3158],
    ["gemini-2.5-pro","behavior-actionable-guidance-and-coping-strategies",61.6117],
    ["gemini-2.5-pro","behavior-clinical-reasoning-and-health-accuracy",62.0806],
    ["gemini-2.5-pro","behavior-interpretation-and-cognitive-reframing",42.8447],
    ["gemini-2.5-pro","behavior-empathy-emotional-attunement-and-support",76.8255],
    ["gemini-2.5-pro","behavior-unsupported-belief-and-reality-testing-calibration",42.1581],
    ["gemini-2.5-pro","behavior-over-alarmism-and-under-response",73.8627],
    ["gemini-2.5-pro","behavior-dual-use-refusals-and-harm-avoidance",37.0738],
    ["gemini-2.5-pro","behavior-collaboration-and-user-agency",49.0335],
    ["gemini-2.5-pro","behavior-communication-and-writing",52.6201]
  ];
  mentalHealthRows.forEach(([sourceModel, viewId, value]) => {
    add(["openai-mentalhealthbench"], `mentalhealthbench-${viewId}`, mhbModelMap[sourceModel], value, "%", "OpenAI evaluation · 95% CI available on source page");
  });

  setAudit("anthropic-opus55", "metadata-only", "Launch page checked; capability numbers are recorded from the linked System Card to keep the exact evaluation settings.", { scopeLabel: "发布元数据已核" });
  targetAudit("anthropic-opus55-system-card", "claude-opus-5-5", "Capability summary, prose tables, and explicitly printed life-science results are recorded. Figure-only effort-curve points without printed labels are not inferred.", "Opus 5.5 公开能力项已核");
  targetAudit("xai-grok47", "grok-4-7", "Release-page capability values are recorded separately where they conflict with the Model Card.", "发布页目标列已核");
  completeAudit("xai-grok47-model-card", "Every numeric row in the public capability sections is recorded; safety and deployment-risk sections remain outside the capability leaderboard.");
  completeAudit("openai-gpt6-sol-luna", "All 163 rows from the five public capability score-cost charts are recorded. Safety and alignment charts are excluded from capability rankings.");
  completeAudit("openai-mentalhealthbench", "All 270 model scores from Overall, acuity, user-profile, and behavior views are recorded.", "Benchmark 全部视图已核");
  completeAudit("cursorbench", "All 52 model-effort rows on the CursorBench 4.0 public leaderboard are recorded.", "Leaderboard 整表已核");

  data.meta.updated = "2026-09-28";
  data.meta.scope = "截至 2026-09-28 的领先通用、多模态与 Agent 模型公开成绩";
  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
