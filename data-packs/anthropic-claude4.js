(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const patchModel = (modelId, values) => {
    const model = models.find((item) => item.id === modelId);
    if (!model) return;
    Object.assign(model, values);
    if (Object.prototype.hasOwnProperty.call(values, "scoreStatus") && values.scoreStatus === undefined) {
      delete model.scoreStatus;
    }
  };
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
    {
      id: "anthropic-claude4-launch",
      vendorId: "anthropic",
      publisher: "Anthropic",
      date: "2025-05-22",
      tier: "official",
      title: "Introducing Claude 4",
      url: "https://www.anthropic.com/news/claude-4"
    },
    {
      id: "anthropic-claude4-system-card",
      vendorId: "anthropic",
      publisher: "Anthropic",
      date: "2025-05-22",
      tier: "official",
      title: "System Card: Claude Opus 4 & Claude Sonnet 4",
      url: "https://www-cdn.anthropic.com/07b2a3f9902ee19fe39a36ca638e5ae987bc64dd.pdf"
    }
  ]);

  appendUnique(models, [{
    id: "claude-opus-4",
    name: "Claude Opus 4",
    vendorId: "anthropic",
    vendor: "Anthropic",
    releaseDate: "2025-05-22",
    modality: "vision",
    modalityDetail: "文本、图像、屏幕/计算机操作与工具 → 文本",
    context: "200K",
    access: "闭源 API",
    aliases: ["claude-opus-4"],
    sourceId: "anthropic-claude4-launch",
    referenceSourceIds: ["anthropic-claude4-system-card"],
    summary: "Anthropic Claude 4 系列的 Opus 型号；发布页的每一个目标分数及 setting 均单独保留。"
  }]);
  patchModel("claude-sonnet-4", {
    releaseDate: "2025-05-22",
    modality: "vision",
    modalityDetail: "文本、图像、屏幕/计算机操作与工具 → 文本",
    context: "200K",
    access: "闭源 API",
    sourceId: "anthropic-claude4-launch",
    referenceSourceIds: ["anthropic-claude4-system-card"],
    scoreStatus: undefined,
    summary: "Anthropic Claude 4 系列的 Sonnet 型号；发布页与独立 benchmark 维护方结果分开保留。"
  });

  appendUnique(benchmarks, [{
    id: "terminal-bench-claude4-launch",
    name: "Terminal-Bench · Claude 4 launch snapshot",
    category: "编码",
    direction: "higher",
    description: "Anthropic 2025-05-22 Claude 4 发布页的 Terminal-Bench 快照；原页未声明 2.x 版本，因此不与 Terminal-Bench 2.0/2.1 混排。"
  }]);
  const terminalFamily = benchmarkFamilies.find((item) => item.id === "terminal-bench");
  if (terminalFamily && !terminalFamily.variants.some((item) => item.benchmarkId === "terminal-bench-claude4-launch")) {
    terminalFamily.variants.unshift({ benchmarkId: "terminal-bench-claude4-launch", label: "Claude 4 launch snapshot" });
  }

  const source = ["anthropic-claude4-launch"];
  const rows = {
    "claude-opus-4": {
      swe: [72.5, 79.4],
      terminal: [43.2, 50.0, 39.2],
      gpqa: [79.6, 83.3, 74.9],
      retail: 81.4,
      airline: 59.6,
      mmmlu: [88.8, 87.4],
      mmmu: [76.5, 73.7],
      aime: [75.5, 90.0, 33.9]
    },
    "claude-sonnet-4": {
      swe: [72.7, 80.2],
      terminal: [35.5, 41.3, 33.5],
      gpqa: [75.4, 83.8, 70.0],
      retail: 80.5,
      airline: 60.0,
      mmmlu: [86.5, 85.4],
      mmmu: [74.4, 72.6],
      aime: [70.5, 85.0, 33.1]
    }
  };

  for (const [modelId, values] of Object.entries(rows)) {
    add(source, "swe-bench-verified", modelId, values.swe[0], "%", "pass@1 · bash/editor tools · no extended thinking · avg@10 · top_p 0.95");
    add(source, "swe-bench-verified", modelId, values.swe[1], "%", "parallel test-time compute · regression-test rejection · internal scoring model selects one patch");
    add(source, "terminal-bench-claude4-launch", modelId, values.terminal[0], "%", "pass@1 · Claude Code agent · no extended thinking");
    add(source, "terminal-bench-claude4-launch", modelId, values.terminal[1], "%", "Claude Code agent · parallel test-time compute");
    add(source, "terminal-bench-claude4-launch", modelId, values.terminal[2], "%", "pass@1 · same agent as non-Claude comparison models · no extended thinking", "Methodology footnote value; kept separate from the Claude Code result.");
    add(source, "gpqa-diamond", modelId, values.gpqa[0], "%", "extended thinking · up to 64K thinking tokens");
    add(source, "gpqa-diamond", modelId, values.gpqa[1], "%", "extended thinking · parallel test-time compute");
    add(source, "gpqa-diamond", modelId, values.gpqa[2], "%", "no extended thinking");
    add(source, "tau-bench-retail", modelId, values.retail, "%", "extended thinking + tool use · prompt addendum · max 100 model-completion steps");
    add(source, "tau-bench-airline", modelId, values.airline, "%", "extended thinking + tool use · prompt addendum · max 100 model-completion steps");
    add(source, "mmmlu", modelId, values.mmmlu[0], "%", "14 non-English languages · extended thinking up to 64K tokens");
    add(source, "mmmlu", modelId, values.mmmlu[1], "%", "14 non-English languages · no extended thinking");
    add(source, "mmmu", modelId, values.mmmu[0], "%", "validation split · extended thinking up to 64K tokens");
    add(source, "mmmu", modelId, values.mmmu[1], "%", "validation split · no extended thinking");
    add(source, "aime-2025", modelId, values.aime[0], "%", "extended thinking up to 64K tokens · top_p 0.95");
    add(source, "aime-2025", modelId, values.aime[1], "%", "extended thinking · parallel test-time compute · top_p 0.95");
    add(source, "aime-2025", modelId, values.aime[2], "%", "no extended thinking · top_p 0.95");
  }

  const target = (modelId) => ({
    modelId,
    expectedObservationCount: 17,
    benchmarkIds: [
      "aime-2025",
      "gpqa-diamond",
      "mmmlu",
      "mmmu",
      "swe-bench-verified",
      "tau-bench-airline",
      "tau-bench-retail",
      "terminal-bench-claude4-launch"
    ]
  });
  upsertAudit("anthropic-claude4-launch", {
    status: "target-complete",
    scopeLabel: "两个 Claude 4 目标列、方法附录与所有明确 setting 已核",
    auditedAt: "2026-09-21",
    targetModels: [target("claude-opus-4"), target("claude-sonnet-4")],
    note: "主表及附录中两个目标模型的数值已逐项核对。Terminal-Bench 的 Claude Code、统一 comparison agent 和并行高算力结果分开保留；发布页未声明 2.x 版本，不与后续 Terminal-Bench 2.x 混排。"
  });
  upsertAudit("anthropic-claude4-system-card", {
    status: "metadata-only",
    scopeLabel: "123 页系统卡已逐章核；无独立通用能力总表",
    auditedAt: "2026-09-21",
    note: "系统卡的标量结果均位于 safeguards、alignment、RSP、CBRN、autonomy 或 cyber-risk 章节；与本站对后续 Anthropic 系统卡的口径一致，不混入通用能力榜。LAB-Bench 图无精确点标，不从柱高猜数；发布页结果由独立来源完整承载。"
  });
})();
