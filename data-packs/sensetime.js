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
    if (Object.prototype.hasOwnProperty.call(values, "scoreStatus") && values.scoreStatus === undefined) delete model.scoreStatus;
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
      if (note && !existing.note) existing.note = note;
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

  appendUnique(sources, [{
    id: "sensetime-sensenova67-github",
    vendorId: "sensetime",
    publisher: "SenseTime / OpenSenseNova",
    date: "2026-04-23",
    tier: "official",
    title: "SenseNova 6.7 Flash-Lite — Official Repository",
    url: "https://github.com/OpenSenseNova/SenseNova6.7"
  }]);

  patchModel("sensenova-6-7-flash-lite", {
    releaseDate: "2026-04-23",
    modality: "vision",
    modalityDetail: "文本、图像、表格与办公文档 → 文本及可编辑办公交付物",
    context: "未披露",
    access: "闭源 API",
    sourceId: "sensetime-sensenova67-github",
    scoreStatus: undefined,
    summary: "SenseTime 的轻量原生多模态 Agent 模型；官方仓库公开了十项能力与办公任务评测。"
  });

  appendUnique(benchmarks, [
    { id: "claweval-pass3-unspecified", name: "ClawEval · Pass³ · Version Unspecified", category: "Agent / 工作", direction: "higher", description: "厂商图表明确报告 Pass³，但没有注明 Claw-Eval 版本或完整 harness；不与 v1.1 自动合并。" },
    { id: "tau3-bench-unspecified", name: "τ³-bench · Domain Unspecified", category: "Agent / 工作", direction: "higher", description: "τ³-bench 总体/未注明 domain 的厂商结果；用户模型与评测设置保留在 setting。" },
    { id: "novapptbench", name: "NovaPPTBench", category: "Agent / 工作", direction: "higher", description: "SenseTime 内部 PPT 生成评测；官方说明将开源，当前仅与同一图表设置下结果比较。" },
    { id: "aidabench", name: "AIDABench", category: "Agent / 工作", direction: "higher", description: "数据分析与办公 Agent 评测；精确设置随来源保留。" }
  ]);
  mergeFamily("claweval-family", "Claw-Eval", [{ benchmarkId: "claweval-pass3-unspecified", label: "Pass³ · Version unspecified" }]);
  mergeFamily("tau3-family", "τ³-bench", [
    { benchmarkId: "tau3-bench-unspecified", label: "Domain unspecified" },
    { benchmarkId: "tau3-banking", label: "Banking" }
  ]);

  const sourceIds = ["sensetime-sensenova67-github"];
  const chartSetting = "SenseNova 6.7 Flash-Lite official benchmark chart";
  const rows = [
    ["pinchbench-v2-best", [["sensenova-6-7-flash-lite", 92.0], ["step-3-5-flash", 85.3], ["glm-5", 86.4], ["gpt-5-4", 90.5], ["claude-opus-4-6", 93.3]], "best result · chart does not restate benchmark version"],
    ["claweval-pass3-unspecified", [["sensenova-6-7-flash-lite", 60.8], ["glm-5", 55.8], ["step-3-5-flash", 56.7], ["gemini-3-1-pro", 57.8], ["gpt-5-4", 60.3]], "Pass³ · exact Claw-Eval version and harness not stated"],
    ["tau3-bench-unspecified", [["sensenova-6-7-flash-lite", 67.2], ["step-3-5-flash", 58.3], ["gpt-5-4", 58.4], ["glm-5", 63.2], ["claude-opus-4-6", 66.0]], "evaluated with GPT-5.2 as the user model · consistent with leaderboard settings"],
    ["deep-planning", [["sensenova-6-7-flash-lite", 26.9], ["kimi-k2-5", 14.3], ["glm-5", 14.6], ["step-3-5-flash", 15.6], ["gemini-3-1-pro", 31.3]], "chart setting"],
    ["novapptbench", [["sensenova-6-7-flash-lite", 90.7], ["kimi-k2-6", 87.0], ["gpt-5-4", 87.6], ["gemini-3-1-pro", 91.2], ["claude-opus-4-6", 92.4]], "internal benchmark · provider states it will be open-sourced"],
    ["aidabench", [["sensenova-6-7-flash-lite", 58.2], ["step-3-5-flash", 53.3], ["gemini-3-1-pro", 54.6], ["kimi-k2-5", 57.0], ["gpt-5-4", 58.5]], "chart setting"],
    ["gpqa-diamond", [["sensenova-6-7-flash-lite", 86.2], ["glm-5", 82.0], ["step-3-5-flash", 83.1], ["claude-opus-4-6", 89.6], ["gemini-3-pro", 90.8]], "chart setting"],
    ["aa-lcr", [["sensenova-6-7-flash-lite", 66.0], ["glm-5", 63.3], ["kimi-k2-5", 65.3], ["claude-opus-4-6", 70.7], ["gpt-5-4", 74.0]], "chart setting"],
    ["mathvision", [["sensenova-6-7-flash-lite", 85.5], ["claude-opus-4-6", 72.1], ["gpt-5-4", 82.4], ["kimi-k2-5", 84.2], ["gemini-3-1-pro", 85.3]], "fixed boxed-answer prompt · peers use the higher reported boxed/unboxed run"],
    ["ocrbench-v2", [["sensenova-6-7-flash-lite", 65.4], ["claude-opus-4-6", 60.3], ["gemini-3-1-pro", 63.0], ["gpt-5-4", 64.1], ["kimi-k2-5", 66.3]], "chart setting"]
  ];
  for (const [benchmarkId, modelRows, detail] of rows) {
    for (const [modelId, value] of modelRows) add(sourceIds, benchmarkId, modelId, value, "%", `${chartSetting} · ${detail}`);
  }

  upsertAudit("sensetime-sensenova67-github", {
    status: "complete",
    scopeLabel: "官方能力图完整核对",
    auditedAt: "2026-09-20",
    expectedObservationCount: 50,
    benchmarkIds: rows.map(([benchmarkId]) => benchmarkId),
    note: "官方 README 的 benchmark_en.jpg 共 10 组、每组 5 个精确标注值，50 个数值全部录入。脚注中的 GPT-5.2 user-model、NovaPPTBench 内部评测和 MathVision boxed-prompt 口径均保留；token savings、用户规模和产品宣传数字不作为能力分数。"
  });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
