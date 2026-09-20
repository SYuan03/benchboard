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

  // Semantic upsert: one row per exact model + benchmark + value + unit + setting.
  // The final normalize pack repeats this guard globally, but doing it here also
  // makes this pack safe to load more than once during maintenance scripts.
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

  const batch = (sourceIds, benchmarkId, rows, unit = "%", setting = "") => {
    rows.forEach(([modelId, value, rowSetting = setting, note = ""]) => (
      add(sourceIds, benchmarkId, modelId, value, unit, rowSetting, note)
    ));
  };

  appendUnique(sources, [
    { id: "anthropic-opus47", vendorId: "anthropic", publisher: "Anthropic", date: "2026-04-16", tier: "official", title: "Introducing Claude Opus 4.7", url: "https://www.anthropic.com/news/claude-opus-4-7" },
    { id: "anthropic-opus47-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2026-04-16", tier: "official", title: "Claude Opus 4.7 System Card", url: "https://www.anthropic.com/claude-opus-4-7-system-card" },
    { id: "anthropic-opus45", vendorId: "anthropic", publisher: "Anthropic", date: "2025-11-24", tier: "official", title: "Introducing Claude Opus 4.5", url: "https://www.anthropic.com/news/claude-opus-4-5" },
    { id: "anthropic-opus45-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2025-11-24", tier: "official", title: "Claude Opus 4.5 System Card", url: "https://www.anthropic.com/claude-opus-4-5-system-card" },
    { id: "anthropic-sonnet45", vendorId: "anthropic", publisher: "Anthropic", date: "2025-09-29", tier: "official", title: "Introducing Claude Sonnet 4.5", url: "https://www.anthropic.com/news/claude-sonnet-4-5" },
    { id: "anthropic-sonnet45-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2025-09-29", tier: "official", title: "Claude Sonnet 4.5 System Card", url: "https://www.anthropic.com/claude-sonnet-4-5-system-card" },
    { id: "anthropic-haiku45", vendorId: "anthropic", publisher: "Anthropic", date: "2025-10-15", tier: "official", title: "Introducing Claude Haiku 4.5", url: "https://www.anthropic.com/news/claude-haiku-4-5" },
    { id: "anthropic-haiku45-system-card", vendorId: "anthropic", publisher: "Anthropic", date: "2025-10-15", tier: "official", title: "Claude Haiku 4.5 System Card", url: "https://www.anthropic.com/claude-haiku-4-5-system-card" }
  ]);

  patchModel("claude-opus-4-7", {
    releaseDate: "2026-04-16",
    modality: "vision",
    modalityDetail: "文本、图像、屏幕/计算机操作与工具 → 文本",
    context: "最高 1M（评测依赖）",
    sourceId: "anthropic-opus47",
    referenceSourceIds: ["anthropic-opus47-system-card"],
    scoreStatus: undefined,
    summary: "Anthropic 的高分辨率视觉与长程 Agent 模型；发布页和系统卡均有独立能力结果。"
  });
  patchModel("claude-opus-4-5", {
    releaseDate: "2025-11-24",
    modality: "vision",
    modalityDetail: "文本、图像、屏幕/计算机操作与工具 → 文本",
    context: "200K（部分评测使用扩展上下文）",
    sourceId: "anthropic-opus45",
    referenceSourceIds: ["anthropic-opus45-system-card"],
    scoreStatus: undefined,
    summary: "Anthropic Opus 4.5；发布页、能力章节与图表均已回查。"
  });
  patchModel("claude-sonnet-4-5", {
    releaseDate: "2025-09-29",
    modality: "vision",
    modalityDetail: "文本、图像、屏幕/计算机操作与工具 → 文本",
    context: "200K（平台与评测设置可能扩展）",
    sourceId: "anthropic-sonnet45",
    referenceSourceIds: ["anthropic-sonnet45-system-card", "anthropic-opus45-system-card"],
    scoreStatus: undefined,
    summary: "Anthropic Sonnet 4.5；自身发布成绩与后续官方对照结果均保留。"
  });
  patchModel("claude-haiku-4-5", {
    releaseDate: "2025-10-15",
    modality: "vision",
    modalityDetail: "文本、图像、屏幕/计算机操作与工具 → 文本",
    context: "200K",
    access: "闭源 API",
    sourceId: "anthropic-haiku45",
    referenceSourceIds: ["anthropic-haiku45-system-card", "anthropic-opus45-system-card"],
    scoreStatus: undefined,
    summary: "Anthropic Haiku 4.5；自身发布成绩与后续官方对照结果均保留。"
  });

  appendUnique(benchmarks, [
    { id: "aider-polyglot", name: "Aider Polyglot", category: "编码", direction: "higher", description: "Aider 多语言代码编辑题；模型、编辑格式与 harness 写入 setting。" },
    { id: "browsecomp-plus", name: "BrowseComp-Plus", category: "Agent / 工作", direction: "higher", description: "基于固定文档索引的深度检索评测；搜索器、fetch、记忆和上下文管理设置不可混比。" },
    { id: "tau2-airline", name: "τ²-bench Airline", category: "Agent / 工作", direction: "higher", description: "航空客服策略遵循；原始与修订任务口径分别保留。" },
    { id: "anthropic-multi-agent-search", name: "Anthropic Multi-Agent Search", category: "Agent / 工作", direction: "higher", description: "Anthropic 内部复杂信息检索评测；orchestrator 与 subagent 组合写入 setting。" },
    { id: "anthropic-real-world-law", name: "Anthropic Real-World Law", category: "专业工作", direction: "higher", description: "Anthropic 真实专业工作评测的法律任务；报告 win rate。" },
    { id: "anthropic-real-world-medicine", name: "Anthropic Real-World Medicine", category: "专业工作", direction: "higher", description: "Anthropic 真实专业工作评测的医疗任务；报告 win rate。" },
    { id: "anthropic-real-world-stem", name: "Anthropic Real-World STEM", category: "专业工作", direction: "higher", description: "Anthropic 真实专业工作评测的 STEM 任务；报告 win rate。" },
    { id: "xbow-visual-acuity", name: "XBOW Visual-Acuity Benchmark", category: "多模态", direction: "higher", description: "XBOW 面向计算机操作/安全 Agent 的内部视觉敏锐度评测；由 Anthropic 发布页转述。", inputModalities: ["文本", "图像", "屏幕"] },
    { id: "hex-research-agent", name: "Hex Internal Research-Agent", category: "Agent / 工作", direction: "higher", description: "Hex 六模块内部研究 Agent 综合分；由 Anthropic 发布页转述。" },
    { id: "hex-general-finance", name: "Hex General Finance", category: "专业工作", direction: "higher", description: "Hex 内部研究 Agent 的 General Finance 模块；由 Anthropic 发布页转述。" }
  ]);

  const tauFamily = benchmarkFamilies.find((item) => item.id === "tau2-family");
  if (tauFamily && !tauFamily.variants.some((item) => item.benchmarkId === "tau2-airline")) {
    tauFamily.variants.splice(1, 0, { benchmarkId: "tau2-airline", label: "Airline" });
  }
  const browseFamily = benchmarkFamilies.find((item) => item.id === "browsecomp-family");
  if (browseFamily && !browseFamily.variants.some((item) => item.benchmarkId === "browsecomp-plus")) {
    browseFamily.variants.push({ benchmarkId: "browsecomp-plus", label: "Plus / fixed corpus" });
  }

  // Claude Opus 4.7: launch page plus the complete scalar capability scope of
  // the system card. Safety, alignment, RSP and welfare results are excluded.
  const opus47Both = ["anthropic-opus47", "anthropic-opus47-system-card"];
  batch(opus47Both, "swe-bench-verified", [["claude-opus-4-7", 87.6]], "%", "adaptive thinking · max effort · avg@5");
  batch(opus47Both, "swe-bench-pro", [["claude-opus-4-7", 64.3]], "%", "adaptive thinking · max effort · avg@5");
  batch(opus47Both, "swe-multilingual", [["claude-opus-4-7", 80.5]], "%", "adaptive thinking · max effort · avg@5");
  batch(opus47Both, "swe-multimodal", [["claude-opus-4-7", 34.5]], "%", "internal harness · adaptive thinking · max effort · avg@5");
  batch(opus47Both, "terminal-bench-2-0", [["claude-opus-4-7", 69.4]], "%", "Harbor · Terminus-2 · thinking disabled · 89 tasks · avg@5");
  batch(opus47Both, "browsecomp", [["claude-opus-4-7", 79.3]], "%", "web search/fetch + code · thinking off · max effort · 10M total tokens · compaction at 200K");
  batch(opus47Both, "mmmlu", [["claude-opus-4-7", 91.5]], "%", "14 non-English languages · adaptive thinking · max effort · avg@3");
  batch(opus47Both, "hle", [["claude-opus-4-7", 46.9]], "%", "no tools · max effort · ≤1M total tokens · no compaction");
  batch(opus47Both, "hle-tools", [["claude-opus-4-7", 54.7]], "%", "web search/fetch + code · max effort · ≤1M total tokens · no compaction");
  batch(opus47Both, "charxiv", [["claude-opus-4-7", 82.1]], "%", "validation split · 1,000 questions · no tools · adaptive thinking · max effort · avg@5");
  batch(opus47Both, "charxiv", [["claude-opus-4-7", 91.0]], "%", "validation split · 1,000 questions · Python tools · adaptive thinking · max effort · avg@5");
  batch(opus47Both, "osworld-verified", [["claude-opus-4-7", 78.0]], "%", "1080p · max 100 actions · first-attempt success · updated Anthropic scaffold · avg@5");
  batch(opus47Both, "gpqa-diamond", [["claude-opus-4-7", 94.2]], "%", "198 questions · adaptive thinking · max effort · avg@10");
  batch(opus47Both, "screenspot-pro", [["claude-opus-4-7", 79.5]], "%", "new image resolution ≤2576px / 3.75MP · no tools · adaptive thinking · max effort · avg@5");
  batch(opus47Both, "screenspot-pro", [["claude-opus-4-7", 87.6]], "%", "new image resolution ≤2576px / 3.75MP · Python tools · adaptive thinking · max effort · avg@5");
  batch(["anthropic-opus47-system-card"], "officeqa", [["claude-opus-4-7", 86.3]], "%", "exact-match grading · 0% allowable relative error");
  batch(["anthropic-opus47-system-card"], "officeqa-pro", [["claude-opus-4-7", 80.6]], "%", "exact-match grading · 0% allowable relative error · system-card table");
  batch(opus47Both, "financeagent-v1-1", [["claude-opus-4-7", 64.4]], "%", "Vals AI external evaluation · adaptive thinking · high effort");
  batch(opus47Both, "mcp-atlas", [["claude-opus-4-7", 77.3]], "%", "refreshed April 2026 harness · leaderboard config · adaptive thinking · max effort");
  batch(opus47Both, "arc-agi-1", [["claude-opus-4-7", 92.0]], "%", "private validation · adaptive thinking · max effort · capability summary");
  batch(opus47Both, "arc-agi-2", [["claude-opus-4-7", 75.83]], "%", "private validation · adaptive thinking · max effort · capability summary");

  batch(["anthropic-opus47-system-card"], "usamo-2026", [["claude-opus-4-7", 69.3]], "%", "MathArena grading · medium effort · 300K token limit · avg@10 per problem");
  batch(opus47Both, "graphwalks-bfs", [["claude-opus-4-7", 58.6]], "%", "256K–1M aggregate · corrected F1 · avg@5");
  batch(opus47Both, "graphwalks-parents", [["claude-opus-4-7", 75.1]], "%", "256K–1M aggregate · accuracy · avg@5");
  batch(["anthropic-opus47-system-card"], "graphwalks-bfs", [["claude-opus-4-7", 76.91]], "%", "public-API-reproducible 256K subset · corrected F1 · avg@5");
  batch(["anthropic-opus47-system-card"], "graphwalks-parents", [["claude-opus-4-7", 93.57]], "%", "public-API-reproducible 256K subset · accuracy · avg@5");
  batch(["anthropic-opus47-system-card"], "deepsearchqa", [["claude-opus-4-7", 89.1]], "F1", "search/fetch + code · adaptive thinking · max effort · 10M total tokens · compaction at 200K");
  batch(["anthropic-opus47-system-card"], "draco", [["claude-opus-4-7", 77.7]], "%", "web search/fetch + code · adaptive thinking · max effort · 1M token limit · compaction at 200K");
  batch(["anthropic-opus47-system-card"], "lab-bench-figqa", [["claude-opus-4-7", 78.6]], "%", "new image resolution ≤2576px / 3.75MP · no tools · adaptive thinking · max effort · avg@5");
  batch(["anthropic-opus47-system-card"], "lab-bench-figqa", [["claude-opus-4-7", 86.4]], "%", "new image resolution ≤2576px / 3.75MP · Python tools · adaptive thinking · max effort · avg@5");
  batch(["anthropic-opus47-system-card"], "lab-bench-figqa", [["claude-opus-4-7", 74.0]], "%", "old image resolution ≤1568px / 1.15MP · no tools · adaptive thinking · max effort · avg@5");
  batch(["anthropic-opus47-system-card"], "lab-bench-figqa", [["claude-opus-4-7", 85.8]], "%", "old image resolution ≤1568px / 1.15MP · Python tools · adaptive thinking · max effort · avg@5");
  batch(["anthropic-opus47-system-card"], "screenspot-pro", [["claude-opus-4-7", 69.0]], "%", "old image resolution ≤1568px / 1.15MP · no tools · adaptive thinking · max effort · avg@5");
  batch(["anthropic-opus47-system-card"], "screenspot-pro", [["claude-opus-4-7", 85.9]], "%", "old image resolution ≤1568px / 1.15MP · Python tools · adaptive thinking · max effort · avg@5");
  batch(["anthropic-opus47-system-card"], "mcp-atlas", [["claude-opus-4-7", 79.5]], "%", "extended config · 256 turns / 100 tools · max effort");
  batch(["anthropic-opus47-system-card"], "mcp-atlas", [["claude-opus-4-7", 79.7]], "%", "extended config · 256 turns / 100 tools · high effort");
  batch(opus47Both, "vending-bench-2", [["claude-opus-4-7", 10937]], "$", "final balance · max effort · benchmark-native context management");
  batch(opus47Both, "vending-bench-2", [["claude-opus-4-7", 7971]], "$", "final balance · high effort · benchmark-native context management");
  batch(opus47Both, "gdpval-aa", [["claude-opus-4-7", 1753]], "Elo", "independent Artificial Analysis run · shell + web browsing");
  batch(["anthropic-opus47-system-card"], "arc-agi-1", [["claude-opus-4-7", 93.5]], "%", "private validation · high effort");
  batch(["anthropic-opus47-system-card"], "gmmlu", [["claude-opus-4-7", 89.9]], "%", "average across all evaluated languages");
  batch(["anthropic-opus47-system-card"], "milu", [["claude-opus-4-7", 89.9]], "%", "average across all evaluated languages");
  batch(["anthropic-opus47-system-card"], "include", [["claude-opus-4-7", 87.0]], "%", "unweighted average across 44 languages · parsed responses");
  batch(["anthropic-opus47-system-card"], "biopipelinebench", [["claude-opus-4-7", 83.6]], "%", "Verified subset · bash/package tools · thinking disabled");
  batch(["anthropic-opus47-system-card"], "biomysterybench", [["claude-opus-4-7", 78.9]], "%", "Verified subset · bash/package tools · thinking disabled");
  batch(["anthropic-opus47-system-card"], "biomysterybench", [["claude-opus-4-7", 20.9]], "%", "Hard subset · objective ground truth · unsolved by human experts · bash/package tools · thinking disabled");
  batch(opus47Both, "structural-biology", [["claude-opus-4-7", 98.3]], "%", "multiple-choice · structural data + basic tools · thinking disabled");
  batch(opus47Both, "structural-biology", [["claude-opus-4-7", 74.0]], "%", "open-ended · structural data + basic tools · thinking disabled");
  batch(["anthropic-opus47-system-card"], "organic-chemistry", [["claude-opus-4-7", 77.2]], "%", "bash/package tools · thinking disabled");
  batch(["anthropic-opus47-system-card"], "phylogenetics", [["claude-opus-4-7", 79.6]], "%", "quantitative + visual tasks · bash/package tools · thinking disabled");
  batch(["anthropic-opus47-system-card"], "protocol-troubleshooting", [["claude-opus-4-7", 0.518, "bash + web search tools", "Source reports 51.8%; normalized here to a 0–1 score to match the existing benchmark unit."]], "score");
  batch(opus47Both, "cybergym", [["claude-opus-4-7", 73.1]], "%", "pass@1 · aggregate suite");

  // Launch-page-only chart and partner-evaluation results. Partner-internal
  // benchmarks remain visibly labeled and are not treated as independent leaderboards.
  batch(["anthropic-opus47"], "officeqa-pro", [["claude-opus-4-7", 65.0]], "%", "launch-page office-tasks chart · published value conflicts with 80.6 in system card");
  batch(["anthropic-opus47"], "biglaw-bench", [["claude-opus-4-7", 90.9]], "%", "Harvey internal evaluation · high effort");
  batch(["anthropic-opus47"], "cursorbench", [["claude-opus-4-7", 70]], "%", "Cursor internal evaluation");
  batch(["anthropic-opus47"], "xbow-visual-acuity", [["claude-opus-4-7", 98.5]], "%", "XBOW internal computer-use evaluation");
  batch(["anthropic-opus47"], "hex-research-agent", [["claude-opus-4-7", 0.715]], "score", "Hex internal research-agent · overall across six modules");
  batch(["anthropic-opus47"], "hex-general-finance", [["claude-opus-4-7", 0.813]], "score", "Hex internal research-agent · General Finance module");

  // Claude Opus 4.5: the system card reproduces launch results and adds
  // exact values, additional settings, and comparison rows for Sonnet/Haiku.
  const opus45Both = ["anthropic-opus45", "anthropic-opus45-system-card"];
  batch(opus45Both, "swe-bench-verified", [["claude-opus-4-5", 80.9, "no extended thinking · 200K context · avg@5", "Launch chart reports 80.9%; system-card table reports 80.90%."]]);
  batch(["anthropic-opus45-system-card"], "swe-bench-verified", [["claude-opus-4-5", 80.6]], "%", "64K thinking budget · 200K context · avg@5");
  batch(["anthropic-opus45-system-card"], "swe-bench-pro", [["claude-opus-4-5", 51.6]], "%", "64K thinking budget · 200K context · avg@5");
  batch(["anthropic-opus45-system-card"], "swe-bench-pro", [["claude-opus-4-5", 52.0]], "%", "no extended thinking · 200K context · avg@5");
  batch(["anthropic-opus45-system-card"], "swe-multilingual", [["claude-opus-4-5", 76.2]], "%", "64K thinking budget · 200K context · avg@5");
  batch(["anthropic-opus45-system-card"], "swe-multilingual", [["claude-opus-4-5", 76.2]], "%", "no extended thinking · 200K context · avg@5");
  batch(opus45Both, "terminal-bench-2-0", [["claude-opus-4-5", 59.27, "Harbor · Terminus-2 · 128K thinking budget · 1,335 trials", "Launch chart rounds this result to 59.3%."]]);
  batch(["anthropic-opus45-system-card"], "terminal-bench-2-0", [["claude-opus-4-5", 57.76]], "%", "Harbor · Terminus-2 · 64K thinking budget · 2,225 trials");
  batch(opus45Both, "tau2-retail", [["claude-opus-4-5", 88.9]], "%", "Claude Opus 4.1 user simulator · prompt addendum");
  batch(opus45Both, "tau2-telecom", [["claude-opus-4-5", 98.2]], "%", "Claude Opus 4.1 user simulator · prompt addendum");
  batch(["anthropic-opus45-system-card"], "tau2-airline", [["claude-opus-4-5", 70.1, "original task set · Table 2.8.A", "The same PDF's Table 2.3 footnote instead reports 67.9%; both are retained."]]);
  batch(["anthropic-opus45-system-card"], "tau2-airline", [["claude-opus-4-5", 67.9, "original task set · Table 2.3 footnote", "Conflicts with 70.1% in Table 2.8.A of the same system card."]]);
  batch(["anthropic-opus45-system-card"], "tau2-airline", [["claude-opus-4-5", 87.8]], "%", "Anthropic-corrected task setup and grading · fixes submitted to benchmark authors");
  batch(opus45Both, "mcp-atlas", [["claude-opus-4-5", 62.3]], "%", "no extended thinking · 200K context · default sampling");
  batch(opus45Both, "osworld-verified", [["claude-opus-4-5", 66.26, "1080p · max 100 steps · pass@1 · avg@5 · 64K thinking · 200K context", "Launch chart rounds this result to 66.3%."]]);
  batch(opus45Both, "arc-agi-2", [["claude-opus-4-5", 37.6]], "%", "private validation · 64K thinking tokens");
  batch(opus45Both, "gpqa-diamond", [["claude-opus-4-5", 86.95, "64K thinking · interleaved scratchpads · 200K context · avg@5", "Launch chart rounds this result to 87.0%."]]);
  batch(opus45Both, "mmmu", [["claude-opus-4-5", 80.72, "validation · 64K thinking · interleaved scratchpads · 200K context · avg@5", "Launch chart rounds this result to 80.7%."]]);
  batch(opus45Both, "mmmlu", [["claude-opus-4-5", 90.77, "14 non-English languages · 64K thinking · 200K context · avg@10", "Launch chart rounds this result to 90.8%."]]);
  batch(["anthropic-opus45-system-card"], "arc-agi-1", [["claude-opus-4-5", 80.0]], "%", "private validation · 64K thinking tokens");
  batch(opus45Both, "aider-polyglot", [["claude-opus-4-5", 89.4]], "%", "launch-page coding chart");
  batch(opus45Both, "browsecomp-plus", [["claude-opus-4-5", 72.89, "Qwen3-Embedding-8B index · tool-result clearing + memory/context reset · Sonnet 4.5 grader", "Launch chart rounds to 72.9%."]]);
  batch(["anthropic-opus45-system-card"], "browsecomp-plus", [["claude-opus-4-5", 67.59]], "%", "Qwen3-Embedding-8B index · tool-result clearing · no fetch · Sonnet 4.5 grader");
  batch(["anthropic-opus45"], "browsecomp-plus", [["claude-opus-4-5", 70.48]], "%", "launch-page footnote · basic fetch configuration");
  batch(["anthropic-opus45"], "browsecomp-plus", [["claude-opus-4-5", 85.30]], "%", "launch-page footnote · full context-management configuration");
  batch(["anthropic-opus45-system-card"], "anthropic-multi-agent-search", [["claude-opus-4-5", 74.8]], "%", "single-agent baseline · Opus 4.5 orchestrator");
  batch(["anthropic-opus45-system-card"], "anthropic-multi-agent-search", [["claude-opus-4-5", 87.0]], "%", "Opus 4.5 orchestrator · Haiku 4.5 subagents");
  batch(["anthropic-opus45-system-card"], "anthropic-multi-agent-search", [["claude-opus-4-5", 85.4]], "%", "Opus 4.5 orchestrator · Sonnet 4.5 subagents");
  batch(["anthropic-opus45-system-card"], "anthropic-multi-agent-search", [["claude-opus-4-5", 92.3]], "%", "Opus 4.5 orchestrator · Opus 4.5 subagents");
  batch(opus45Both, "vending-bench-2", [["claude-opus-4-5", 4967.06]], "$", "final balance · high effort · 8,192 reasoning tokens/turn · benchmark-native context management");
  batch(["anthropic-opus45-system-card"], "financeagent-unspecified", [["claude-opus-4-5", 55.2]], "%", "Vals AI external · 64K thinking · 200K context · avg@8");
  batch(["anthropic-opus45-system-card"], "financeagent-unspecified", [["claude-opus-4-5", 61.07]], "%", "Anthropic internal · 64K thinking · 200K context · avg@8");
  batch(["anthropic-opus45-system-card"], "financeagent-unspecified", [["claude-opus-4-5", 61.03]], "%", "Anthropic internal · 64K thinking · 1M context · avg@4");
  batch(["anthropic-opus45-system-card"], "cybergym", [["claude-opus-4-5", 50.63]], "%", "pass@1 · 1,505 tasks · avg@5 · no thinking · 200K context · think tool");
  batch(["anthropic-opus45-system-card"], "spreadsheetbench-v1", [["claude-opus-4-5", 64.25]], "%", "full 912 tasks · custom bash/Python/LibreOffice harness · no extended thinking · 200K context · avg@5");
  batch(["anthropic-opus45-system-card"], "hle", [["claude-opus-4-5", 30.8]], "%", "reasoning only · without search/tools · decontaminated · Sonnet 4.5 grader");
  batch(["anthropic-opus45-system-card"], "hle-tools", [["claude-opus-4-5", 43.2]], "%", "web search/fetch + code · no reasoning · decontaminated · Sonnet 4.5 grader");
  batch(["anthropic-opus45-system-card"], "aime-2025", [["claude-opus-4-5", 92.77]], "%", "no tools · 64K thinking · 200K context · avg@5 · contamination caveat");
  batch(["anthropic-opus45-system-card"], "aime-2025", [["claude-opus-4-5", 100]], "%", "Python tools · 64K thinking · 200K context · avg@5 · contamination caveat");
  batch(["anthropic-opus45-system-card"], "lab-bench-figqa", [["claude-opus-4-5", 54.9]], "%", "0-shot · no tools · no extended thinking");
  batch(["anthropic-opus45-system-card"], "lab-bench-figqa", [["claude-opus-4-5", 69.2]], "%", "0-shot · image-crop tool · 32,768 reasoning-token budget");
  batch(["anthropic-opus45-system-card"], "webarena", [["claude-opus-4-5", 65.3]], "%", "pass@1 · Computer Use API + browser tools · single policy · general prompts · official grader · avg@5");
  batch(["anthropic-opus45-system-card"], "webarena", [["claude-opus-4-5", 69.5]], "%", "pass@2 · Computer Use API + browser tools · single policy · general prompts · official grader");
  batch(["anthropic-opus45-system-card"], "webarena", [["claude-opus-4-5", 71.2]], "%", "pass@3 · Computer Use API + browser tools · single policy · general prompts · official grader");
  batch(["anthropic-opus45-system-card"], "webarena", [["claude-opus-4-5", 72.4]], "%", "pass@4 · Computer Use API + browser tools · single policy · general prompts · official grader");

  // Claude Sonnet 4.5 first-party launch results.
  batch(["anthropic-sonnet45"], "swe-bench-verified", [["claude-sonnet-4-5", 77.2]], "%", "standard evaluation");
  batch(["anthropic-sonnet45"], "swe-bench-verified", [["claude-sonnet-4-5", 82.0]], "%", "parallel test-time compute");
  batch(["anthropic-sonnet45"], "terminal-bench-2-0", [["claude-sonnet-4-5", 50.0]], "%", "launch-page setting");
  batch(["anthropic-sonnet45", "anthropic-opus45-system-card"], "tau2-retail", [["claude-sonnet-4-5", 86.2]], "%", "Claude Opus 4.1 user simulator · prompt addendum");
  batch(["anthropic-sonnet45", "anthropic-opus45-system-card"], "tau2-airline", [["claude-sonnet-4-5", 70.0]], "%", "original task set");
  batch(["anthropic-opus45-system-card"], "tau2-airline", [["claude-sonnet-4-5", 77.4]], "%", "Anthropic-corrected task setup and grading · fixes submitted to benchmark authors");
  batch(["anthropic-sonnet45", "anthropic-opus45-system-card"], "tau2-telecom", [["claude-sonnet-4-5", 98.0]], "%", "Claude Opus 4.1 user simulator · prompt addendum");
  batch(["anthropic-sonnet45"], "osworld-verified", [["claude-sonnet-4-5", 61.4]], "%", "1080p · max 100 steps · pass@1");
  batch(["anthropic-sonnet45"], "aime-2025", [["claude-sonnet-4-5", 100]], "%", "Python tools");
  batch(["anthropic-sonnet45"], "aime-2025", [["claude-sonnet-4-5", 87]], "%", "no tools");
  batch(["anthropic-sonnet45"], "gpqa-diamond", [["claude-sonnet-4-5", 83.4]], "%", "launch-page setting");
  batch(["anthropic-sonnet45"], "mmmlu", [["claude-sonnet-4-5", 89.1]], "%", "launch-page setting");
  batch(["anthropic-sonnet45"], "mmmu", [["claude-sonnet-4-5", 77.8]], "%", "validation split");
  batch(["anthropic-sonnet45"], "financeagent-unspecified", [["claude-sonnet-4-5", 55.3]], "%", "launch-page FinanceAgent evaluation");
  batch(["anthropic-sonnet45"], "real-world-finance", [["claude-sonnet-4-5", 72]], "%", "professional-work win rate · 16K thinking budget");
  batch(["anthropic-sonnet45"], "real-world-finance", [["claude-sonnet-4-5", 68]], "%", "professional-work win rate · standard mode");
  batch(["anthropic-sonnet45"], "anthropic-real-world-law", [["claude-sonnet-4-5", 65]], "%", "professional-work win rate · 16K thinking budget");
  batch(["anthropic-sonnet45"], "anthropic-real-world-law", [["claude-sonnet-4-5", 57]], "%", "professional-work win rate · standard mode");
  batch(["anthropic-sonnet45"], "anthropic-real-world-medicine", [["claude-sonnet-4-5", 61]], "%", "professional-work win rate · 16K thinking budget");
  batch(["anthropic-sonnet45"], "anthropic-real-world-medicine", [["claude-sonnet-4-5", 53]], "%", "professional-work win rate · standard mode");
  batch(["anthropic-sonnet45"], "anthropic-real-world-stem", [["claude-sonnet-4-5", 69]], "%", "professional-work win rate · 16K thinking budget");
  batch(["anthropic-sonnet45"], "anthropic-real-world-stem", [["claude-sonnet-4-5", 58]], "%", "professional-work win rate · standard mode");

  // Sonnet/Haiku comparison cells published in the Opus 4.5 launch/card.
  batch(opus45Both, "aider-polyglot", [["claude-sonnet-4-5", 78.8]], "%", "launch-page coding chart");
  batch(opus45Both, "browsecomp-plus", [["claude-sonnet-4-5", 67.23, "Qwen3-Embedding-8B index · tool-result clearing + memory/context reset · Sonnet 4.5 grader", "Launch chart rounds to 67.2%."]]);
  batch(["anthropic-opus45-system-card"], "browsecomp-plus", [["claude-sonnet-4-5", 60.36]], "%", "Qwen3-Embedding-8B index · tool-result clearing · no fetch · Sonnet 4.5 grader");
  batch(["anthropic-opus45-system-card"], "browsecomp-plus", [["claude-haiku-4-5", 52.53]], "%", "Qwen3-Embedding-8B index · tool-result clearing · no fetch · Sonnet 4.5 grader");
  batch(["anthropic-opus45-system-card"], "browsecomp-plus", [["claude-haiku-4-5", 54.70]], "%", "Qwen3-Embedding-8B index · tool-result clearing + memory/context reset · Sonnet 4.5 grader");
  batch(["anthropic-opus45-system-card"], "anthropic-multi-agent-search", [["claude-sonnet-4-5", 66.5]], "%", "Sonnet 4.5 orchestrator · Sonnet 4.5 subagents");
  batch(["anthropic-opus45"], "vending-bench-2", [["claude-sonnet-4-5", 3849.74, "final balance · launch-page chart", "The Opus 4.5 system-card prose instead reports $3,838.74; both are retained."]], "$");
  batch(["anthropic-opus45-system-card"], "vending-bench-2", [["claude-sonnet-4-5", 3838.74, "final balance · system-card prose", "Conflicts with $3,849.74 in the launch-page chart."]], "$");
  batch(["anthropic-opus45-system-card"], "hle", [["claude-sonnet-4-5", 17.7]], "%", "reasoning only · without search/tools · decontaminated · Sonnet 4.5 grader");
  batch(["anthropic-opus45-system-card"], "hle-tools", [["claude-sonnet-4-5", 28.4]], "%", "web search/fetch + code · no reasoning · decontaminated · Sonnet 4.5 grader");
  batch(["anthropic-opus45-system-card"], "lab-bench-figqa", [["claude-sonnet-4-5", 52.3]], "%", "0-shot · no tools · no extended thinking");
  batch(["anthropic-opus45-system-card"], "lab-bench-figqa", [["claude-sonnet-4-5", 63.7]], "%", "0-shot · image-crop tool · 32,768 reasoning-token budget");
  batch(["anthropic-opus45-system-card"], "webarena", [["claude-sonnet-4-5", 58.5]], "%", "pass@1 · Computer Use API + browser tools · single policy · general prompts · official grader · avg@5");
  batch(["anthropic-opus45-system-card"], "webarena", [["claude-haiku-4-5", 53.1]], "%", "pass@1 · Computer Use API + browser tools · single policy · general prompts · official grader · avg@5");

  // Claude Haiku 4.5 first-party launch results.
  batch(["anthropic-haiku45"], "swe-bench-verified", [["claude-haiku-4-5", 73.3]], "%", "launch-page setting");
  batch(["anthropic-haiku45"], "terminal-bench-2-0", [["claude-haiku-4-5", 41.0]], "%", "launch-page setting");
  batch(["anthropic-haiku45"], "tau2-retail", [["claude-haiku-4-5", 83.2]], "%", "launch-page setting");
  batch(["anthropic-haiku45"], "tau2-airline", [["claude-haiku-4-5", 63.6]], "%", "original task set · launch-page setting");
  batch(["anthropic-haiku45"], "tau2-telecom", [["claude-haiku-4-5", 83.0]], "%", "launch-page setting");
  batch(["anthropic-haiku45"], "osworld-verified", [["claude-haiku-4-5", 50.7]], "%", "1080p · max 100 steps · pass@1");
  batch(["anthropic-haiku45"], "aime-2025", [["claude-haiku-4-5", 96.3]], "%", "Python tools");
  batch(["anthropic-haiku45"], "aime-2025", [["claude-haiku-4-5", 80.7]], "%", "no tools");
  batch(["anthropic-haiku45"], "gpqa-diamond", [["claude-haiku-4-5", 73.0]], "%", "launch-page setting");
  batch(["anthropic-haiku45"], "mmmlu", [["claude-haiku-4-5", 83.0]], "%", "launch-page setting");
  batch(["anthropic-haiku45"], "mmmu", [["claude-haiku-4-5", 73.2]], "%", "validation split");

  // Static expectations make CI fail if a later refactor silently drops a
  // previously audited row or benchmark family.
  const targetExpectations = {
    "anthropic-opus47:claude-opus-4-7": [33, ["arc-agi-1", "arc-agi-2", "biglaw-bench", "browsecomp", "charxiv", "cursorbench", "cybergym", "financeagent-v1-1", "gdpval-aa", "gpqa-diamond", "graphwalks-bfs", "graphwalks-parents", "hex-general-finance", "hex-research-agent", "hle", "hle-tools", "mcp-atlas", "mmmlu", "officeqa-pro", "osworld-verified", "screenspot-pro", "structural-biology", "swe-bench-pro", "swe-bench-verified", "swe-multilingual", "swe-multimodal", "terminal-bench-2-0", "vending-bench-2", "xbow-visual-acuity"]],
    "anthropic-opus47-system-card:claude-opus-4-7": [52, ["arc-agi-1", "arc-agi-2", "biomysterybench", "biopipelinebench", "browsecomp", "charxiv", "cybergym", "deepsearchqa", "draco", "financeagent-v1-1", "gdpval-aa", "gmmlu", "gpqa-diamond", "graphwalks-bfs", "graphwalks-parents", "hle", "hle-tools", "include", "lab-bench-figqa", "mcp-atlas", "milu", "mmmlu", "officeqa", "officeqa-pro", "organic-chemistry", "osworld-verified", "phylogenetics", "protocol-troubleshooting", "screenspot-pro", "structural-biology", "swe-bench-pro", "swe-bench-verified", "swe-multilingual", "swe-multimodal", "terminal-bench-2-0", "usamo-2026", "vending-bench-2"]],
    "anthropic-opus45:claude-opus-4-5": [15, ["aider-polyglot", "arc-agi-2", "browsecomp-plus", "gpqa-diamond", "mcp-atlas", "mmmlu", "mmmu", "osworld-verified", "swe-bench-verified", "tau2-retail", "tau2-telecom", "terminal-bench-2-0", "vending-bench-2"]],
    "anthropic-opus45-system-card:claude-opus-4-5": [43, ["aider-polyglot", "aime-2025", "anthropic-multi-agent-search", "arc-agi-1", "arc-agi-2", "browsecomp-plus", "cybergym", "financeagent-unspecified", "gpqa-diamond", "hle", "hle-tools", "lab-bench-figqa", "mcp-atlas", "mmmlu", "mmmu", "osworld-verified", "spreadsheetbench-v1", "swe-bench-pro", "swe-bench-verified", "swe-multilingual", "tau2-airline", "tau2-retail", "tau2-telecom", "terminal-bench-2-0", "vending-bench-2", "webarena"]],
    "anthropic-opus45-system-card:claude-sonnet-4-5": [14, ["aider-polyglot", "anthropic-multi-agent-search", "browsecomp-plus", "hle", "hle-tools", "lab-bench-figqa", "tau2-airline", "tau2-retail", "tau2-telecom", "vending-bench-2", "webarena"]],
    "anthropic-opus45-system-card:claude-haiku-4-5": [3, ["browsecomp-plus", "webarena"]],
    "anthropic-sonnet45:claude-sonnet-4-5": [21, ["aime-2025", "anthropic-real-world-law", "anthropic-real-world-medicine", "anthropic-real-world-stem", "financeagent-unspecified", "gpqa-diamond", "mmmlu", "mmmu", "osworld-verified", "real-world-finance", "swe-bench-verified", "tau2-airline", "tau2-retail", "tau2-telecom", "terminal-bench-2-0"]],
    "anthropic-haiku45:claude-haiku-4-5": [11, ["aime-2025", "gpqa-diamond", "mmmlu", "mmmu", "osworld-verified", "swe-bench-verified", "tau2-airline", "tau2-retail", "tau2-telecom", "terminal-bench-2-0"]]
  };
  const target = (sourceId, modelId) => {
    const [expectedObservationCount, benchmarkIds] = targetExpectations[`${sourceId}:${modelId}`];
    return { modelId, expectedObservationCount, benchmarkIds };
  };
  upsertAudit("anthropic-opus47", {
    status: "target-complete",
    scopeLabel: "发布页目标模型与带精确值的合作方评测已核",
    auditedAt: "2026-09-20",
    targetModels: [target("anthropic-opus47", "claude-opus-4-7")],
    note: "发布页正文、总表、七组能力图及带精确分数的合作方引语已核。相对提升、成本和无精确标签的图形不伪造为标量。"
  });
  upsertAudit("anthropic-opus47-system-card", {
    status: "target-complete",
    scopeLabel: "能力总表与能力章节目标项已核",
    auditedAt: "2026-09-20",
    targetModels: [target("anthropic-opus47-system-card", "claude-opus-4-7")],
    note: "覆盖第 8 章能力总表及可明确映射的标量能力结果；排除 safety、alignment、welfare、RSP 与风险阈值评测。"
  });
  upsertAudit("anthropic-opus45", {
    status: "target-complete",
    scopeLabel: "发布页目标模型列与精确脚注已核",
    auditedAt: "2026-09-20",
    targetModels: [target("anthropic-opus45", "claude-opus-4-5")],
    note: "覆盖发布总表、Aider/BrowseComp-Plus/Vending 图及页面脚注；图表四舍五入与系统卡精确值合并说明。"
  });
  upsertAudit("anthropic-opus45-system-card", {
    status: "target-complete",
    scopeLabel: "能力章节目标模型与明确对照项已核",
    auditedAt: "2026-09-20",
    targetModels: [
      target("anthropic-opus45-system-card", "claude-opus-4-5"),
      target("anthropic-opus45-system-card", "claude-sonnet-4-5"),
      target("anthropic-opus45-system-card", "claude-haiku-4-5")
    ],
    note: "覆盖第 2 章能力结果；排除 safeguards、alignment、RSP 和风险评测。PDF 内 τ² Airline 与 Sonnet Vending 数值冲突均原样并存。"
  });
  upsertAudit("anthropic-sonnet45", {
    status: "target-complete",
    scopeLabel: "发布页目标模型列已核",
    auditedAt: "2026-09-20",
    targetModels: [target("anthropic-sonnet45", "claude-sonnet-4-5")],
    note: "发布页目标模型总表、parallel test-time compute 与真实专业工作 win-rate 图已核。"
  });
  upsertAudit("anthropic-sonnet45-system-card", {
    status: "metadata-only",
    scopeLabel: "安全系统卡；能力榜无独立新增表",
    auditedAt: "2026-09-20",
    note: "系统卡以安全、对齐、RSP 与风险评估为主；不把这些指标混入通用能力榜。能力成绩来自同日发布页及后续 Opus 4.5 能力章节。"
  });
  upsertAudit("anthropic-haiku45", {
    status: "target-complete",
    scopeLabel: "发布页目标模型列已核",
    auditedAt: "2026-09-20",
    targetModels: [target("anthropic-haiku45", "claude-haiku-4-5")],
    note: "发布页目标模型总表已核；后续 Opus 4.5 系统卡中的 BrowseComp-Plus 与 WebArena 对照值另有来源。"
  });
  upsertAudit("anthropic-haiku45-system-card", {
    status: "metadata-only",
    scopeLabel: "安全系统卡；能力榜无独立新增表",
    auditedAt: "2026-09-20",
    note: "系统卡以安全与风险评估为主；不把安全指标混入通用能力榜。能力成绩来自同日发布页及后续 Opus 4.5 能力章节。"
  });
})();
