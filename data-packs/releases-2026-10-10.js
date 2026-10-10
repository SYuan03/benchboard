(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-10";

  const upsertById = (target, row) => {
    const current = target.find((item) => item.id === row.id);
    if (current) Object.assign(current, row);
    else target.push(row);
  };
  const upsertAudit = (sourceId, patch) => {
    const current = sourceAudits.find((item) => item.sourceId === sourceId);
    if (current) Object.assign(current, { sourceId, ...patch });
    else sourceAudits.push({ sourceId, ...patch });
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
  const completeAudit = (sourceId, note, scopeLabel = "公开能力结果已核") => {
    const rows = observations.filter((item) => item.sourceIds.includes(sourceId));
    upsertAudit(sourceId, {
      status: "complete",
      scopeLabel,
      auditedAt: "2026-10-10",
      expectedObservationCount: rows.length,
      benchmarkIds: [...new Set(rows.map((item) => item.benchmarkId))],
      note
    });
  };
  const targetAudit = (sourceId, modelId, note, scopeLabel = "目标模型公开能力项已核") => {
    const rows = observations.filter((item) => item.sourceIds.includes(sourceId) && item.modelId === modelId);
    upsertAudit(sourceId, {
      status: "target-complete",
      scopeLabel,
      auditedAt: "2026-10-10",
      targetModels: [{
        modelId,
        expectedObservationCount: rows.length,
        benchmarkIds: [...new Set(rows.map((item) => item.benchmarkId))]
      }],
      note
    });
  };

  [
    { id: "anthropic-sonnet55", vendorId: "anthropic", publisher: "Anthropic", date: "2026-09-28", tier: "official", title: "Introducing Claude Sonnet 5.5", url: "https://www.anthropic.com/claude-sonnet-5-5" },
    { id: "anthropic-sonnet55-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-09-28", tier: "official", title: "Claude Sonnet 5.5 System Card", url: "https://www-cdn.anthropic.com/870c8f525702625d2c62fc6dd04c857e3250bec1/Claude%20Sonnet%205.5%20System%20Card.pdf" },
    { id: "anthropic-haiku55", vendorId: "anthropic", publisher: "Anthropic", date: "2026-10-07", tier: "official", title: "Introducing Claude Haiku 5.5", url: "https://www.anthropic.com/claude-haiku-5-5" },
    { id: "anthropic-haiku55-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-10-07", tier: "official", title: "Claude Haiku 5.5 System Card", url: "https://www-cdn.anthropic.com/e1080d6bf5ae2018ea3c2f414064be03232f5be5/Claude%20Haiku%205.5%20System%20Card.pdf" },
    { id: "google-gemini4-argon", vendorId: "google", publisher: "Google DeepMind", date: "2026-09-30", tier: "official", title: "Gemini 4 Argon: our next era of frontier intelligence", url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/" },
    { id: "mistral-large4", vendorId: "mistral", publisher: "Mistral AI", date: "2026-10-06", tier: "official", title: "Introducing Mistral Large 4", url: "https://mistral.ai/news/mistral-large-4/" },
    { id: "openai-gpt56-sol-preview", vendorId: "openai", publisher: "OpenAI", date: "2026-10-07", tier: "official", title: "Previewing GPT-5.6 Sol: a next-generation model", url: "https://openai.com/index/previewing-gpt-5-6-sol/" }
  ].forEach((row) => upsertById(sources, row));

  [
    { id: "claude-sonnet-5-5", name: "Claude Sonnet 5.5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-09-28", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作与工具 → 文本", context: "最高 1M（评测依赖）", access: "闭源 API", aliases: ["claude-sonnet-5-5", "sonnet-5.5"], sourceId: "anthropic-sonnet55", referenceSourceIds: ["anthropic-sonnet55-system-card"], summary: "Claude 5.5 系列的高性价比视觉语言与 Agent 模型。" },
    { id: "claude-haiku-5-5", name: "Claude Haiku 5.5", vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-10-07", modality: "vision", modalityDetail: "文本、图像、屏幕/计算机操作与工具 → 文本", context: "最高 1M（评测依赖）", access: "闭源 API", aliases: ["claude-haiku-5-5", "haiku-5.5"], sourceId: "anthropic-haiku55", referenceSourceIds: ["anthropic-haiku55-system-card"], summary: "Claude 5.5 系列面向高吞吐与低成本场景的小型视觉语言模型。" },
    { id: "gemini-4-argon", name: "Gemini 4 Argon", vendorId: "google", vendor: "Google DeepMind", releaseDate: "2026-09-30", modality: "vision", modalityDetail: "文本、图像、长视频与工具 → 文本；官方页面明确报告长视频理解", context: "官方发布页未单列", access: "受限预览", aliases: ["gemini-4-argon", "argon"], sourceId: "google-gemini4-argon", summary: "Google 面向长程软件工程、企业工作与防御性网络安全的预览模型。" },
    { id: "mistral-large-4", name: "Mistral Large 4 (Preview)", vendorId: "mistral", vendor: "Mistral AI", releaseDate: "2026-10-06", modality: "vision", modalityDetail: "文本、图像与工具 → 文本；原生多模态 MoE", context: "官方发布页未单列", access: "API 公开预览；开放权重计划于 2026-10 发布", aliases: ["mistral-large-4", "ml4", "le-chonk"], sourceId: "mistral-large4", summary: "1T 参数、52B 激活参数的原生多模态 Mistral Large 4 预览版。" },
    { id: "gpt-6-1-sol", name: "GPT-6.1 Sol", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-10", modality: "vision", modalityDetail: "Codex CLI 对照模型；输入模态未在引用榜单单列", context: "未核实", access: "闭源", aliases: ["gpt-6.1-sol"], sourceId: "anthropic-haiku55-system-card", scoreStatus: "comparison-only", summary: "Claude Haiku 5.5 System Card 引用的 Terminal-Bench 对照模型。" },
    { id: "gpt-6-sol-sonnet55-table", name: "GPT-6 Sol (Sonnet 5.5 table label)", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026", modality: "vision", modalityDetail: "发布表标签为 GPT-6 Sol；脚注引用 GPT-5.6 Sol 来源，身份待澄清", context: "未核实", access: "闭源", aliases: ["GPT-6 Sol as labeled in Sonnet 5.5 table"], sourceId: "anthropic-sonnet55", referenceSourceIds: ["anthropic-sonnet55-system-card"], scoreStatus: "comparison-only", summary: "为避免把来源中的版本歧义合并到任一正式模型，本条仅保存原表标签。" }
  ].forEach((row) => upsertById(models, row));

  const gpt56 = models.find((item) => item.id === "gpt-5-6-sol");
  if (gpt56) gpt56.referenceSourceIds = [...new Set([...(gpt56.referenceSourceIds || []), "openai-gpt56-sol-preview"])];

  [
    { id: "physicianbench", name: "PhysicianBench", category: "医疗", direction: "higher", description: "在电子健康记录环境中完成 100 个医生工作任务；setting 保留尝试次数与 effort。" },
    { id: "cwe-bench-v1", name: "CWE-bench v1", category: "网络安全", direction: "higher", description: "软件漏洞修复评测；与 CWE-bench v0 分开。" },
    { id: "cybergym-e2e", name: "CyberGym-E2E", category: "网络安全", direction: "higher", description: "端到端漏洞复现与修补任务；不与其他 CyberGym 口径合并。" },
    { id: "cybench", name: "Cybench", category: "网络安全", direction: "higher", description: "来自安全竞赛的 40 项网络安全挑战。" },
    { id: "coding-agent-index", name: "Coding Agent Index", category: "编码", direction: "higher", description: "Mistral 发布页报告的编码 Agent 综合指标。" },
    { id: "surge-blind-coding-quality", name: "Surge AI Blind Coding Quality", category: "编码", direction: "higher", description: "Surge AI 专业标注者对匿名模型编码输出的 1–5 分盲评。" }
  ].forEach((row) => upsertById(benchmarks, row));

  mergeFamily("cybergym-family", "CyberGym", [
    { benchmarkId: "cybergym", label: "Published CyberGym setting" },
    { benchmarkId: "cybergym-e2e", label: "E2E" }
  ]);

  const sonnetBoth = ["anthropic-sonnet55", "anthropic-sonnet55-system-card"];
  const sonnetCard = ["anthropic-sonnet55-system-card"];
  const sonnetStandard = "adaptive thinking · max effort · default sampling · 5-trial mean · context ≤1M unless noted";

  addRows(sonnetCard, [
    ["swe-bench-pro", "claude-sonnet-5-5", 81.3],
    ["swe-multilingual", "claude-sonnet-5-5", 90.3],
    ["swe-multimodal", "claude-sonnet-5-5", 54.3],
    ["deepswe-v1-1", "claude-sonnet-5-5", 71.0, "%", "five-trial average"],
    ["frontiercode-1-1-main", "claude-sonnet-5-5", 52.1, "%", "Claude Code · xhigh · mean@5"],
    ["frontiercode-1-1-extended", "claude-sonnet-5-5", 64.4, "%", "Claude Code · xhigh · mean@5"],
    ["frontiercode-1-1-extended", "claude-sonnet-5-5", 59.1, "%", "Claude Code · max · mean@5"],
    ["terminal-bench-science", "claude-sonnet-5-5", 59.9, "%", "Claude Code --bare · max · no internet · safeguards with no fallback activation"],
    ["frontierswe-v2", "claude-sonnet-5-5", 61.9, "%", "Proximus harness · max · 34 tasks · mean@5"],
    ["programbench-average-pass", "claude-sonnet-5-5", 79.7, "%", "166 golden tasks · mini-swe-agent · no 6-hour timeout"],
    ["programbench-average-pass", "claude-sonnet-5", 77.3, "%", "166 golden tasks · mini-swe-agent · no 6-hour timeout"],
    ["programbench-average-pass", "claude-opus-5-5", 91.2, "%", "166 golden tasks · mini-swe-agent · no 6-hour timeout"],
    ["hle", "claude-sonnet-5-5", 56.9, "%", "no tools · auto thinking · 980K task budget"],
    ["chartography-tools", "claude-sonnet-5-5", 90.2, "%", "container + crop tool · adaptive thinking · max · 5 runs"],
    ["benchcad-vision2code-iou", "claude-sonnet-5-5", 0.747, "voxel IoU", "1,000-file subset · no tools · max · 5 runs"],
    ["benchcad-vision2code-iou-tools", "claude-sonnet-5-5", 0.963, "voxel IoU", "1,000-file subset · tools · max · 5 runs"],
    ["osworld-2-strict", "claude-sonnet-5-5", 43.5, "%", "2026-09-10 tasks/assets · 1080p · 500 steps · max · 5 runs"],
    ["officeqa", "claude-sonnet-5-5", 76.9, "%", "preselected extracted text + code · max · 5 runs"],
    ["officeqa-pro", "claude-sonnet-5-5", 65.6, "%", "133-question subset · preselected extracted text + code · max · 5 runs"],
    ["harvey-legal-heldout", "claude-sonnet-5-5", 11.7, "%", "120-task held-out set · high effort · all-pass"],
    ["harvey-legal-heldout", "claude-sonnet-5-5", 10.0, "%", "120-task held-out set · max effort · all-pass"],
    ["harvey-legal-heldout-criterion-pass", "claude-sonnet-5-5", 92.1, "%", "120-task held-out set · high effort · mean criterion-pass"],
    ["harvey-legal-heldout-criterion-pass", "claude-sonnet-5-5", 93.1, "%", "120-task held-out set · max effort · mean criterion-pass"],
    ["gdpval-aa-v2", "claude-sonnet-5-5", 1725, "Elo", "Artificial Analysis · xhigh"],
    ["aa-briefcase", "claude-sonnet-5-5", 1746, "Elo", "v1.1 · Artificial Analysis · xhigh"],
    ["automationbench", "claude-opus-5-5", 42.5, "%", "v1.0.6 private set · max · default fallbacks enabled after refusal reruns"],
    ["healthbench", "claude-sonnet-5-5", 69.4, "%", "raw · no tools · Opus 4.8 grader · max · 5 trials"],
    ["healthbench-professional", "claude-sonnet-5-5", 77.1, "%", "raw · no tools · Opus 4.8 grader · max · 5 trials"],
    ["physicianbench", "claude-sonnet-5-5", 63.2, "%", "100 EHR tasks · max · five attempts/task"],
    ["physicianbench", "claude-sonnet-5", 37.4, "%", "100 EHR tasks · max · five attempts/task"],
    ["physicianbench", "claude-fable-5-1", 61.0, "%", "100 EHR tasks · max · five attempts/task"],
    ["physicianbench", "claude-opus-5", 57.6, "%", "100 EHR tasks · max · five attempts/task"],
    ["physicianbench", "claude-opus-5-5", 68.4, "%", "100 EHR tasks · max · five attempts/task"],
    ["gmmlu", "claude-sonnet-5-5", 92.1, "%", "42-language average · adaptive thinking · max · single trial"],
    ["milu", "claude-sonnet-5-5", 91.6, "%", "11-language average · adaptive thinking · max · 5 trials"],
    ["biomysterybench", "claude-sonnet-5-5", 89.2, "%", "Human Solvable subset"],
    ["biomysterybench", "claude-sonnet-5-5", 44.7, "%", "Human Difficult subset"],
    ["spatialbench-verified", "claude-sonnet-5-5", 72.5, "score"],
    ["singlecellbench", "claude-sonnet-5-5", 59.1, "score"],
    ["morphology-molecule-matching", "claude-sonnet-5-5", 25.0],
    ["medicinal-chemistry-adme", "claude-sonnet-5-5", 65.3],
    ["protein-design-sequence", "claude-sonnet-5-5", 51.0],
    ["protein-design-library-ranking", "claude-sonnet-5-5", 54.8],
    ["protein-binder-design", "claude-sonnet-5-5", 82.3],
    ["biomedical-image-analysis", "claude-sonnet-5-5", 72.2],
    ["protocol-troubleshooting", "claude-sonnet-5-5", 67.3, "score"],
    ["protocol-understanding-v2", "claude-sonnet-5-5", 66.6]
  ], sonnetStandard);

  addRows(sonnetBoth, [
    ["terminal-bench-4-0", "claude-sonnet-5-5", 70.6, "%", "Claude Code --bare · max · no internet · safeguards with default fallback"],
    ["frontiercode-1-1-main", "claude-sonnet-5-5", 46.2, "%", "Claude Code · max · mean@5"],
    ["cursorbench-4-0", "claude-sonnet-5-5", 55.5, "%", "Cursor production agent · max effort"],
    ["gdpval-aa-v2", "claude-sonnet-5-5", 1844, "Elo", "Artificial Analysis · max"],
    ["aa-briefcase", "claude-sonnet-5-5", 1811, "Elo", "v1.1 · Artificial Analysis · max"],
    ["hle-tools", "claude-sonnet-5-5", 64.5, "%", "web search/fetch + programmatic tools + code · auto thinking · 980K task budget"],
    ["osworld-2-partial", "claude-sonnet-5-5", 80.1, "%", "2026-09-10 tasks/assets · 1080p · 500 steps · max · 5 runs"],
    ["chartography", "claude-sonnet-5-5", 61.6, "%", "no tools · adaptive thinking · max · 5 runs · Gemini 3.5 Flash judge"],
    ["automationbench", "claude-sonnet-5-5", 44.7, "%", "v1.0.6 private set · max · default fallbacks enabled"],
    ["healthbench-professional", "claude-sonnet-5-5", 69.2, "%", "length-adjusted · no tools · Opus 4.8 grader · max · 5 trials"]
  ]);

  [["medium", 39.2], ["high", 47.8], ["xhigh", 53.1]].forEach(([effort, value]) => {
    add(sonnetCard, "cursorbench-4-0", "claude-sonnet-5-5", value, "%", `Cursor production agent · ${effort} effort`);
  });

  const ambiguousRows = [
    ["frontiercode-1-1-main", 49.3, "%", "source table label · max effort"],
    ["gdpval-aa-v2", 1487, "Elo", "source table label · max effort"],
    ["aa-briefcase", 1483, "Elo", "source table label · max effort"],
    ["chartography", 53.6, "%", "source table label · no tools"]
  ];
  ambiguousRows.forEach(([benchmarkId, value, unit, setting]) => add(sonnetBoth, benchmarkId, "gpt-6-sol-sonnet55-table", value, unit, setting, "The table labels this column GPT-6 Sol, while its footnote cites a GPT-5.6 Sol source. It remains a separate comparison label until the identity is clarified."));

  const toolathlonRows = [
    ["claude-sonnet-5-5", 77.8, 85.2, 68.5, 31.6],
    ["claude-opus-5-5", 77.8, 82.4, 72.2, 26.9],
    ["claude-fable-5-1", 77.8, 81.5, 73.1, 23.7],
    ["claude-opus-5", 80.6, 87.0, 73.1, 23.5],
    ["claude-mythos-5", 79.3, 86.1, 73.1, 19.8],
    ["claude-opus-4-8", 79.9, 88.0, 71.3, 20.4],
    ["claude-sonnet-5", 74.7, 84.3, 65.7, 24.5]
  ];
  toolathlonRows.forEach(([modelId, pass1, pass3, passCubed, turns]) => {
    const setting = "internal pinned harness · adaptive thinking · max · 108 tasks · 3 trials";
    add(sonnetCard, "toolathlon", modelId, pass1, "%", `${setting} · Pass@1`);
    add(sonnetCard, "toolathlon-pass3", modelId, pass3, "%", setting);
    add(sonnetCard, "toolathlon-pass-cubed", modelId, passCubed, "%", setting);
    add(sonnetCard, "toolathlon-average-turns", modelId, turns, "turns", setting);
  });

  const haikuBoth = ["anthropic-haiku55", "anthropic-haiku55-system-card"];
  const haikuCard = ["anthropic-haiku55-system-card"];
  const haikuStandard = "adaptive thinking · max effort · default sampling · 5-trial mean · context ≤1M unless noted";

  addRows(haikuCard, [
    ["swe-bench-pro", "claude-haiku-5-5", 64.8],
    ["swe-multilingual", "claude-haiku-5-5", 83.7],
    ["swe-multimodal", "claude-haiku-5-5", 30.7],
    ["frontiercode-1-1-main", "claude-haiku-5-5", 45.8, "%", "Claude Code · xhigh · mean@5"],
    ["frontiercode-1-1-extended", "claude-haiku-5-5", 58.4, "%", "Claude Code · max · mean@5"],
    ["terminal-bench-science", "claude-haiku-5-5", 20.6, "%", "Claude Code --bare · max · 10 trials/task · no internet · safeguards stop trial"],
    ["frontierswe-v2", "claude-haiku-5-5", 43.8, "%", "Proximus harness · max · 34 tasks · mean@5"],
    ["programbench-average-pass", "claude-haiku-5-5", 82.0, "%", "166 golden tasks · mini-swe-agent · no 6-hour timeout"],
    ["chartography-tools", "claude-haiku-5-5", 86.2, "%", "container + crop tool · adaptive thinking · max · 5 runs"],
    ["benchcad-vision2code-iou", "claude-haiku-5-5", 0.670, "voxel IoU", "1,000-file subset · no tools · max · 5 runs"],
    ["benchcad-vision2code-iou-tools", "claude-haiku-5-5", 0.870, "voxel IoU", "1,000-file subset · tools · max · 5 runs"],
    ["osworld-2-strict", "claude-haiku-5-5", 37.1, "%", "82-task offline subset · 1080p · 500 steps · max · 5 runs"],
    ["officeqa", "claude-haiku-5-5", 73.5, "%", "preselected extracted text + code · max · 5 runs"],
    ["officeqa-pro", "claude-haiku-5-5", 60.3, "%", "133-question subset · preselected extracted text + code · max · 5 runs"],
    ["gdpval-aa-v2", "claude-haiku-5-5", 1277, "Elo", "Artificial Analysis · medium"],
    ["aa-briefcase", "claude-haiku-5-5", 1372, "Elo", "v1.1 · Artificial Analysis · medium"],
    ["healthbench-professional", "claude-haiku-5-5", 71.0, "%", "raw · no tools · Opus 4.8 grader · max · 5 trials"],
    ["healthbench", "claude-haiku-5-5", 59.9, "%", "length-adjusted · low effort · single run"],
    ["healthbench", "claude-haiku-5-5", 60.2, "%", "length-adjusted · medium effort · single run"],
    ["healthbench", "claude-haiku-5-5", 60.3, "%", "length-adjusted · high effort · single run"],
    ["healthbench", "claude-haiku-5-5", 61.1, "%", "length-adjusted · xhigh effort · single run"],
    ["healthbench", "claude-haiku-5-5", 61.6, "%", "length-adjusted · max effort · 5-run mean"],
    ["physicianbench", "claude-haiku-5-5", 17.8, "%", "100 EHR tasks · low · five attempts/task"],
    ["physicianbench", "claude-haiku-5-5", 25.2, "%", "100 EHR tasks · medium · five attempts/task"],
    ["physicianbench", "claude-haiku-5-5", 31.6, "%", "100 EHR tasks · high · five attempts/task"],
    ["physicianbench", "claude-haiku-5-5", 35.8, "%", "100 EHR tasks · xhigh · five attempts/task"],
    ["physicianbench", "claude-haiku-5-5", 43.0, "%", "100 EHR tasks · max · five attempts/task"],
    ["gmmlu", "claude-haiku-5-5", 87.8, "%", "42-language average · adaptive thinking · max · single trial"],
    ["milu", "claude-haiku-5-5", 87.6, "%", "11-language average · adaptive thinking · max · 5 trials"],
    ["spatialbench-verified", "claude-haiku-5-5", 67.7, "score"],
    ["singlecellbench", "claude-haiku-5-5", 56.2, "score"],
    ["morphology-molecule-matching", "claude-haiku-5-5", 25.4],
    ["medicinal-chemistry-adme", "claude-haiku-5-5", 58.0],
    ["protein-design-sequence", "claude-haiku-5-5", 33.1],
    ["protein-design-library-ranking", "claude-haiku-5-5", 45.3],
    ["biomedical-image-analysis", "claude-haiku-5-5", 43.5],
    ["protocol-troubleshooting", "claude-haiku-5-5", 58.0, "score"],
    ["protocol-understanding-v2", "claude-haiku-5-5", 64.1]
  ], haikuStandard);

  addRows(haikuBoth, [
    ["frontiercode-1-1-main", "claude-haiku-5-5", 46.4, "%", "Claude Code · max · mean@5"],
    ["hle", "claude-haiku-5-5", 45.9, "%", "no tools · auto thinking · 980K task budget"],
    ["hle-tools", "claude-haiku-5-5", 57.4, "%", "web search/fetch + programmatic tools + code · auto thinking · 980K task budget"],
    ["terminal-bench-4-0", "claude-haiku-5-5", 39.2, "%", "Claude Code --bare · max · 10 trials/task · no internet · safeguards stop trial"],
    ["chartography", "claude-haiku-5-5", 46.4, "%", "no tools · adaptive thinking · max · 5 runs · Gemini 3.5 Flash judge"],
    ["osworld-2-partial", "claude-haiku-5-5", 72.4, "%", "82-task offline subset · 1080p · 500 steps · max · 5 runs"],
    ["gdpval-aa-v2", "claude-haiku-5-5", 1620, "Elo", "Artificial Analysis · max"],
    ["aa-briefcase", "claude-haiku-5-5", 1578, "Elo", "v1.1 · Artificial Analysis · max"],
    ["healthbench-professional", "claude-haiku-5-5", 64.8, "%", "length-adjusted · no tools · Opus 4.8 grader · max · 5 trials"]
  ]);

  addRows(haikuCard, [
    ["terminal-bench-4-0", "gpt-6-luna", 16.4, "%", "public leaderboard · Codex CLI · max"],
    ["terminal-bench-4-0", "gpt-6-sol", 49.4, "%", "public leaderboard · Codex CLI · max"],
    ["terminal-bench-4-0", "gpt-6-1-sol", 58.2, "%", "public leaderboard · Codex CLI · max"],
    ["terminal-bench-4-0", "gpt-6-astra", 58.2, "%", "public leaderboard · Codex CLI · max"],
    ["terminal-bench-science", "gpt-6-1-sol", 57.0, "%", "OpenAI-reported · max"],
    ["terminal-bench-science", "gpt-6-sol", 27.6, "%", "OpenAI-reported · max"],
    ["frontierswe-v2", "claude-fable-5", 47.0, "%", "Proximal public result · max · mean@5"],
    ["frontierswe-v2", "gpt-5-6-sol", 32.2, "%", "Proximal public result · max · mean@5"],
    ["chartography", "claude-haiku-4-5", 6.4, "%", "no tools · fixed thinking budget · 5 runs"],
    ["chartography-tools", "claude-haiku-4-5", 8.8, "%", "container + crop tool · fixed thinking budget · 5 runs"],
    ["benchcad-vision2code-iou", "claude-haiku-4-5", 0.155, "voxel IoU", "1,000-file subset · no tools · 5 runs"],
    ["benchcad-vision2code-iou-tools", "claude-haiku-4-5", 0.210, "voxel IoU", "1,000-file subset · tools · 5 runs"],
    ["osworld-2-partial", "claude-haiku-4-5", 15.7, "%", "82-task offline subset · fixed thinking budget · 5 runs"],
    ["osworld-2-partial", "gpt-6-luna", 48.9, "%", "82-task offline subset · OpenAI API · max · context compaction"],
    ["osworld-2-partial", "claude-sonnet-5-5", 83.9, "%", "82-task offline subset · max · 5 runs"],
    ["osworld-2-strict", "claude-sonnet-5-5", 48.8, "%", "82-task offline subset · max · 5 runs"],
    ["osworld-2-partial", "claude-opus-5-5", 87.2, "%", "82-task offline subset · max · 5 runs"],
    ["osworld-2-strict", "claude-opus-5-5", 53.2, "%", "82-task offline subset · max · 5 runs"],
    ["officeqa", "claude-haiku-4-5", 63.0, "%", "preselected extracted text + code · fixed thinking budget · 5 runs"],
    ["officeqa-pro", "claude-haiku-4-5", 47.1, "%", "133-question subset · preselected extracted text + code · fixed thinking budget · 5 runs"],
    ["gdpval-aa-v2", "claude-haiku-4-5", 735, "Elo", "Artificial Analysis · published setting"],
    ["gdpval-aa-v2", "claude-sonnet-5-5", 1840, "Elo", "Artificial Analysis · Haiku 5.5 card snapshot · max"],
    ["gdpval-aa-v2", "gpt-6-luna", 1437, "Elo", "Artificial Analysis · Haiku 5.5 card snapshot · max"],
    ["gdpval-aa-v2", "gemini-3-8-flash", 1435, "Elo", "Artificial Analysis · Haiku 5.5 card snapshot · highest thinking"],
    ["aa-briefcase", "claude-haiku-4-5", 614, "Elo", "v1.1 · Artificial Analysis · published setting"],
    ["aa-briefcase", "claude-sonnet-5-5", 1824, "Elo", "v1.1 · Artificial Analysis · Haiku 5.5 card snapshot · max"],
    ["aa-briefcase", "gpt-6-luna", 1336, "Elo", "v1.1 · Artificial Analysis · Haiku 5.5 card snapshot · max"],
    ["aa-briefcase", "gemini-3-8-flash", 1203, "Elo", "v1.1 · Artificial Analysis · Haiku 5.5 card snapshot · highest thinking"],
    ["physicianbench", "gpt-6-luna", 33.6, "%", "100 EHR tasks · max · five attempts/task"],
    ["medicinal-chemistry-adme", "claude-opus-5-5", 63.5],
    ["medicinal-chemistry-adme", "claude-sonnet-5-5", 65.3],
    ["protein-design-sequence", "claude-sonnet-5", 20.2],
    ["protein-design-sequence", "claude-sonnet-5-5", 51.0],
    ["protein-design-library-ranking", "claude-sonnet-5", 44.0],
    ["protein-design-library-ranking", "claude-sonnet-5-5", 54.8],
    ["protocol-troubleshooting", "claude-sonnet-5", 49.9, "score"],
    ["protocol-troubleshooting", "claude-sonnet-5-5", 67.3, "score"],
    ["protocol-understanding-v2", "claude-sonnet-5", 58.9],
    ["protocol-understanding-v2", "claude-sonnet-5-5", 66.6]
  ], haikuStandard);

  const geminiSource = ["google-gemini4-argon"];
  addRows(geminiSource, [
    ["deepswe-v1-1", "gemini-4-argon", 77.9, "%", "official launch-page result"],
    ["automationbench", "gemini-4-argon", 51.3, "%", "Zapier · official launch-page snapshot"],
    ["lvbench", "gemini-4-argon", 91.7, "%", "long-video understanding · official launch-page result"],
    ["cwe-bench-v1", "gemini-4-argon", 68.0, "%", "v1 · vulnerability remediation · tied first"]
  ]);

  const mistralSource = ["mistral-large4"];
  addRows(mistralSource, [
    ["cybergym-e2e", "mistral-large-4", 82.0, "%", "vulnerability reproduction and patching"],
    ["cybench", "mistral-large-4", 93.0, "%", "40 security competition challenges"],
    ["deepswe-v1-1", "mistral-large-4", 61.7, "%", "official launch-page result"],
    ["swe-atlas-codebase-qa", "mistral-large-4", 59.4, "%", "SWE-Atlas-QnA · official launch-page result"],
    ["terminal-bench-4-0", "mistral-large-4", 28.3, "%", "official launch-page result"],
    ["coding-agent-index", "mistral-large-4", 49.8, "%", "combined index · official launch-page result"],
    ["automationbench", "mistral-large-4", 59.9, "%", "657 business workflows · official launch-page result"],
    ["aa-briefcase", "mistral-large-4", 1393, "Elo", "version unspecified · official launch-page snapshot"],
    ["dense200", "mistral-large-4", 42.0, "%", "visual grounding · official launch-page result"],
    ["dense200", "gpt-6-astra", 41.0, "%", "Mistral-reported comparison"],
    ["surge-blind-coding-quality", "mistral-large-4", 3.74, "score", "1–5 blind human rating · Surge AI"],
    ["surge-blind-coding-quality", "kimi-k3", 3.59, "score", "1–5 blind human rating · Surge AI"],
    ["surge-blind-coding-quality", "glm-5-3", 3.60, "score", "1–5 blind human rating · Surge AI"],
    ["surge-blind-coding-quality", "glm-5-2", 3.40, "score", "1–5 blind human rating · Surge AI"],
    ["surge-blind-coding-quality", "claude-opus-5", 4.22, "score", "1–5 blind human rating · Surge AI"]
  ]);

  completeAudit("anthropic-sonnet55", "发布页的公开能力表已录入。GPT-6 Sol 表头与脚注引用的 GPT-5.6 Sol 来源存在版本歧义，因此保存为独立对照标签。", "发布页能力表已核");
  completeAudit("anthropic-sonnet55-system-card", "System Card 能力章节中可可靠转录的公开数值已录入；安全、对齐、越狱与部署风险评估不混入能力榜。", "System Card 能力章节已核");
  completeAudit("anthropic-haiku55", "发布页公开能力表已录入；正文图表中没有可可靠读取的额外精确点不作猜测。", "发布页能力表已核");
  completeAudit("anthropic-haiku55-system-card", "System Card 能力章节中可可靠转录的公开数值已录入；安全、对齐、越狱与部署风险评估不混入能力榜。", "System Card 能力章节已核");
  targetAudit("google-gemini4-argon", "gemini-4-argon", "发布页四项明确数值已录入；Vals Index、Finance Agent v2 与 Harvey Legal 仅给出领先描述，没有猜测数值。", "发布页明确能力数值已核");
  targetAudit("mistral-large4", "mistral-large-4", "发布页正文中的明确能力数值已录入；图表中未由正文明确标注的柱状值不按高度猜测。安全与拒答指标不混入能力榜。", "发布页明确能力数值已核");
  upsertAudit("openai-gpt56-sol-preview", { status: "metadata-only", scopeLabel: "发布元数据已核", auditedAt: "2026-10-10", note: "页面提到 Terminal-Bench 2.1、GeneBench v1、ExploitBench 与 ExploitGym，但正文未公开可可靠录入的精确成绩；该来源仅链接到 GPT-5.6 Sol 元数据。" });
})();
