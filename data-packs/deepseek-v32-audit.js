(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const upsertAudit = (sourceId, values) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    if (audit) Object.assign(audit, values);
    else sourceAudits.push({ sourceId, ...values });
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
    { id: "deepseek-v32-speciale-hf", vendorId: "deepseek", publisher: "DeepSeek", date: "2025-12-01", tier: "official", title: "DeepSeek-V3.2-Speciale — Official Model Card", url: "https://huggingface.co/deepseek-ai/DeepSeek-V3.2-Speciale" },
    { id: "deepseek-v32-modelscope", vendorId: "deepseek", publisher: "DeepSeek", date: "2025-12-01", tier: "official", title: "DeepSeek-V3.2 — Official ModelScope Card", url: "https://www.modelscope.cn/models/deepseek-ai/DeepSeek-V3.2" },
    { id: "deepseek-v32-speciale-modelscope", vendorId: "deepseek", publisher: "DeepSeek", date: "2025-12-01", tier: "official", title: "DeepSeek-V3.2-Speciale — Official ModelScope Card", url: "https://www.modelscope.cn/models/deepseek-ai/DeepSeek-V3.2-Speciale" },
    { id: "deepseek-v32-exp-github", vendorId: "deepseek", publisher: "DeepSeek", date: "2025-09-29", tier: "official", title: "DeepSeek-V3.2-Exp — Official GitHub Repository", url: "https://github.com/deepseek-ai/DeepSeek-V3.2-Exp" }
  ]);

  const base = models.find((item) => item.id === "deepseek-v3-2");
  if (base) {
    Object.assign(base, {
      releaseDate: "2025-12-01",
      modality: "language",
      modalityDetail: "文本 → 文本与工具调用",
      context: "128K",
      access: "开放权重 · MIT / API",
      aliases: [...new Set([...(base.aliases || []), "DeepSeek-V3.2-Thinking", "DeepSeek V3.2 Thinking"])],
      sourceId: "deepseek-v32-hf",
      referenceSourceIds: [
        "deepseek-v32-speciale-hf",
        "deepseek-v32-modelscope",
        "deepseek-v32-speciale-modelscope",
        "deepseek-v32-report",
        "deepseek-v32-launch",
        "deepseek-v32-exp-github"
      ],
      summary: "DeepSeek-V3.2 同一套权重的 Thinking / Non-thinking 结果按 setting 展示；不再把 Thinking 误拆成另一个模型。"
    });
    delete base.scoreStatus;
  }

  // DeepSeek's own card states that Thinking is a mode of the same V3.2
  // weights. Consolidate the duplicate model so one drawer shows every mode.
  for (const observation of observations.filter((item) => item.modelId === "deepseek-v3-2-thinking")) {
    observation.modelId = "deepseek-v3-2";
    if (!/Thinking/i.test(observation.setting || "")) {
      observation.setting = ["Thinking mode", observation.setting].filter(Boolean).join(" · ");
    }
  }
  const duplicateIndex = models.findIndex((item) => item.id === "deepseek-v3-2-thinking");
  if (duplicateIndex >= 0) models.splice(duplicateIndex, 1);

  appendUnique(models, [{
    id: "deepseek-v3-2-speciale",
    name: "DeepSeek V3.2 Speciale",
    vendorId: "deepseek",
    vendor: "DeepSeek",
    releaseDate: "2025-12-01",
    modality: "language",
    modalityDetail: "文本 → 文本；不支持工具调用",
    context: "128K",
    access: "开放权重 · MIT / API",
    aliases: ["DeepSeek-V3.2-Speciale"],
    sourceId: "deepseek-v32-speciale-hf",
    referenceSourceIds: ["deepseek-v32-hf", "deepseek-v32-modelscope", "deepseek-v32-speciale-modelscope", "deepseek-v32-report", "deepseek-v32-launch"],
    summary: "DeepSeek-V3.2 的高算力深度推理变体；与普通 V3.2 分开，且不支持工具调用。"
  }]);

  appendUnique(benchmarks, [
    { id: "mcp-universe", name: "MCP-Universe", category: "Agent / 工作", direction: "higher", description: "MCP 工具使用评测；搜索、Playwright 环境与 tool-role 格式写入 setting。" },
    { id: "imo-2025-points", name: "IMO 2025 · Raw Points", category: "知识 / 推理", direction: "higher", description: "2025 International Mathematical Olympiad 原始总分；与百分比口径分开。" },
    { id: "cmo-2025", name: "CMO 2025", category: "知识 / 推理", direction: "higher", description: "2025 China Mathematical Olympiad 竞赛总分。" },
    { id: "ioi-2025", name: "IOI 2025", category: "编码", direction: "higher", description: "2025 International Olympiad in Informatics 竞赛总分。" },
    { id: "icpc-world-finals-2025", name: "ICPC World Finals 2025", category: "编码", direction: "higher", description: "2025 ICPC World Finals 解题数；提交筛选策略写入 setting。" }
  ]);

  const cardSources = [
    "deepseek-v32-hf",
    "deepseek-v32-speciale-hf",
    "deepseek-v32-modelscope",
    "deepseek-v32-speciale-modelscope"
  ];
  const reportSource = ["deepseek-v32-report"];
  const cardAndReport = [...cardSources, ...reportSource];
  const thinking = "Thinking mode · temperature 1.0 · 128K context";
  const nonThinking = "Non-thinking mode · temperature 1.0 · 128K context";
  const speciale = "Speciale high-compute reasoning · temperature 1.0 · 128K context";

  const replaceGeneric = (benchmarkId, value, setting, sourceIds = cardAndReport, unit = "%", note = "") => {
    const row = observations.find((item) => (
      item.modelId === "deepseek-v3-2"
      && item.benchmarkId === benchmarkId
      && String(item.value) === String(value)
      && item.unit === unit
      && item.sourceIds.some((sourceId) => sourceId === "deepseek-v32-hf" || sourceId === "deepseek-v32-report")
    ));
    if (!row) return add(sourceIds, benchmarkId, "deepseek-v3-2", value, unit, setting, note);
    row.setting = setting;
    row.sourceIds = [...new Set([...(row.sourceIds || []), ...sourceIds])];
    if (note) row.note = [...new Set([row.note, note].filter(Boolean))].join(" · ");
    return row;
  };

  replaceGeneric("aime-2025", 93.1, `${thinking} · custom step-by-step / boxed-answer prompt`);
  replaceGeneric("hmmt-2025-11", 90.2, `${thinking} · custom step-by-step / boxed-answer prompt`);
  replaceGeneric("hle", 25.1, `${thinking} · custom step-by-step / boxed-answer prompt`);
  replaceGeneric("codeforces-rating", 2386, `${thinking} · reported rating`, cardAndReport, "Rating");
  replaceGeneric("swe-bench-verified", 73.1, `${thinking} · DeepSeek internal code-agent framework`);
  replaceGeneric("terminal-bench-2-0", 46.4, `${thinking} · Claude Code framework`);
  replaceGeneric("tau2-bench", 80.3, `${thinking} · self-play user agent · Airline/Retail/Telecom average`);
  replaceGeneric("tool-decathlon", 35.2, `${thinking} · standard function-call format`);

  const reportRows = [
    ["mmlu-pro", 85.0, "%", `${thinking} · exact match`],
    ["gpqa-diamond", 82.4, "%", `${thinking} · pass@1`],
    ["hle", 23.9, "%", `${thinking} · official HLE template`, "The same report gives 25.1 with its custom step-by-step / boxed-answer template."],
    ["livecodebench", 83.3, "%", `${thinking} · pass@1-CoT`],
    ["hmmt-2025-02", 92.5, "%", `${thinking} · custom step-by-step / boxed-answer prompt`],
    ["imoanswerbench", 78.3, "%", `${thinking} · custom step-by-step / boxed-answer prompt`],
    ["swe-multilingual", 70.2, "%", `${thinking} · resolved`],
    ["browsecomp", 51.4, "%", `${thinking} · commercial search API · without context management · Table 2`, "Section 4.4 separately reports a 53.4 baseline; both official values are retained."],
    ["browsecomp", 53.4, "%", `${thinking} · commercial search API · baseline · Section 4.4`, "Table 2 separately reports 51.4 without context management; both official values are retained."],
    ["browsecomp", 60.2, "%", `${thinking} · Summary context management · average steps 140→364`],
    ["browsecomp", 67.6, "%", `${thinking} · Discard-all context management`],
    ["browsecomp-zh", 65.0, "%", `${thinking} · commercial search API`],
    ["hle-tools", 40.8, "%", `${thinking} · Search Agent · commercial search API`],
    ["tau2-airline", 63.8, "%", `${thinking} · model itself as user agent`],
    ["tau2-retail", 81.1, "%", `${thinking} · model itself as user agent`],
    ["tau2-telecom", 96.2, "%", `${thinking} · model itself as user agent`],
    ["mcp-universe", 45.9, "%", `${thinking} · internal search/Playwright environment · tool-role outputs`],
    ["mcp-mark", 38.0, "%", `${thinking} · internal search/Playwright environment · tool-role outputs`],
    ["terminal-bench-2-0", 37.1, "%", `${nonThinking} · Claude Code framework`],
    ["terminal-bench-2-0", 39.3, "%", `${nonThinking} · Terminus framework`],
    ["swe-bench-verified", 72.1, "%", `${nonThinking} · resolved`],
    ["swe-multilingual", 68.9, "%", `${nonThinking} · resolved`],
    ["tau2-bench", 77.2, "%", `${nonThinking} · pass@1`],
    ["mcp-universe", 38.6, "%", `${nonThinking} · internal search/Playwright environment · tool-role outputs`],
    ["mcp-mark", 26.5, "%", `${nonThinking} · internal search/Playwright environment · tool-role outputs`],
    ["tool-decathlon", 25.6, "%", `${nonThinking} · pass@1`]
  ];
  for (const [benchmarkId, value, unit, setting, note = ""] of reportRows) {
    add(reportSource, benchmarkId, "deepseek-v3-2", value, unit, setting, note);
  }

  const specialeRows = [
    ["aime-2025", 96.0, "%", "pass@1"],
    ["hmmt-2025-02", 99.2, "%", "pass@1"],
    ["hmmt-2025-11", 94.4, "%", "pass@1"],
    ["imoanswerbench", 84.5, "%", "pass@1"],
    ["livecodebench", 88.7, "%", "pass@1-CoT"],
    ["codeforces-rating", 2701, "Rating", "reported rating"],
    ["gpqa-diamond", 85.7, "%", "pass@1"],
    ["hle", 30.6, "%", "pass@1"]
  ];
  for (const [benchmarkId, value, unit, metric] of specialeRows) {
    const isCardValue = [
      "aime-2025",
      "hmmt-2025-02",
      "codeforces-rating",
      "hle"
    ].includes(benchmarkId);
    add(isCardValue ? cardAndReport : reportSource, benchmarkId, "deepseek-v3-2-speciale", value, unit, `${speciale} · ${metric}`);
  }
  add(reportSource, "imo-2025-points", "deepseek-v3-2-speciale", 35, "points", `${speciale} · 35/42 · generate-verify-refine · no tools/internet · official contest limits`, "Gold medal; problem scores P1–P6: 7, 7, 7, 7, 7, 0.");
  add(reportSource, "cmo-2025", "deepseek-v3-2-speciale", 102, "points", `${speciale} · 102/126 · English version · generate-verify-refine · no tools/internet`, "Gold medal; problem scores P1–P6: 18, 18, 9, 21, 18, 18.");
  add(reportSource, "ioi-2025", "deepseek-v3-2-speciale", 492, "points", `${speciale} · 492/600 · official time/attempt limits · no tools/internet`, "Gold medal, rank 10; problem scores P1–P6: 100, 82, 72, 100, 55, 83. 500 candidates per problem were filtered to 50 permitted submissions.");
  add(reportSource, "icpc-world-finals-2025", "deepseek-v3-2-speciale", 10, "problems", `${speciale} · 10/12 solved · official time/attempt limits · no tools/internet`, "Gold medal, rank 2; submission counts A–L: 3, –, 1, 1, 2, 2, –, 1, 1, 1, 1, 1.");

  const targetFor = (sourceId, modelId) => {
    const rows = observations.filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId));
    return {
      modelId,
      expectedObservationCount: rows.length,
      benchmarkIds: [...new Set(rows.map((item) => item.benchmarkId))].sort()
    };
  };
  for (const sourceId of cardSources) {
    upsertAudit(sourceId, {
      status: "target-complete",
      scopeLabel: "双模型卡发布图目标列已核",
      auditedAt: "2026-09-21",
      targetModels: [targetFor(sourceId, "deepseek-v3-2"), targetFor(sourceId, "deepseek-v3-2-speciale")],
      note: "HF 与 ModelScope 的 V3.2 / Speciale 卡片内容一致；发布图中 V3.2 Thinking 的 8 项和 Speciale 的 4 项已全部录入。Thinking 作为同一 V3.2 权重的 setting，不再单独拆模型。"
    });
  }
  upsertAudit("deepseek-v32-report", {
    status: "target-complete",
    scopeLabel: "技术报告最终 V3.2 / Speciale 表格与正文精确值已核",
    auditedAt: "2026-09-21",
    targetModels: [targetFor("deepseek-v32-report", "deepseek-v3-2"), targetFor("deepseek-v32-report", "deepseek-v3-2-speciale")],
    note: "已覆盖 Table 2–4、Appendix Table 9 及 Section 4.4 的最终模型精确结果；Thinking / Non-thinking、Claude Code / Terminus、BrowseComp 不同上下文策略均分 setting。Table 5/Figure 5 是 V3.2-Exp/SFT 训练消融，不冒充最终 V3.2 成绩；Table 3 的 output-token 消耗不作为能力分数。"
  });
  upsertAudit("deepseek-v32-launch", {
    status: "metadata-only",
    auditedAt: "2026-09-21",
    note: "官方发布页确认 V3.2 / Speciale 的版本、访问与模态关系，未单独嵌入数值表；分数来自同日模型卡和技术报告。"
  });
  upsertAudit("deepseek-v32-exp-github", {
    status: "metadata-only",
    auditedAt: "2026-09-21",
    note: "V3.2 模型卡链接的官方 GitHub 实际是前代 V3.2-Exp 架构/推理仓库；其 Exp 评测不冒充最终 V3.2 成绩。"
  });
})();
