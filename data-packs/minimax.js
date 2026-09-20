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
      item.modelId === modelId && item.benchmarkId === benchmarkId
      && typeof item.value === typeof value && String(item.value) === String(value)
      && item.unit === unit && (item.setting || "") === setting
    ));
    if (existing) {
      existing.sourceIds = [...new Set([...(existing.sourceIds || []), ...sourceIds])];
      if (note && !existing.note) existing.note = note;
      return existing;
    }
    const observation = {
      id: `o${observations.length + 1}`, sourceIds: [...new Set(sourceIds)],
      benchmarkId, modelId, value, unit, setting, note
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

  appendUnique(sources, [
    { id: "minimax-m27-github", vendorId: "minimax", publisher: "MiniMax", date: "2026-03-18", tier: "official", title: "MiniMax-M2.7 — Official Repository", url: "https://github.com/MiniMax-AI/MiniMax-M2.7" },
    { id: "minimax-m27-blog", vendorId: "minimax", publisher: "MiniMax", date: "2026-03-18", tier: "official", title: "MiniMax M2.7: Early Echoes of Self-Evolution", url: "https://www.minimax.io/news/minimax-m27-en" },
    { id: "minimax-m27-hf", vendorId: "minimax", publisher: "MiniMax", date: "2026-03-18", tier: "official", title: "MiniMax-M2.7 — Official Model Card", url: "https://huggingface.co/MiniMaxAI/MiniMax-M2.7" },
    { id: "minimax-m27-modelscope", vendorId: "minimax", publisher: "MiniMax", date: "2026-03-18", tier: "official", title: "MiniMax-M2.7 — Official ModelScope Card", url: "https://modelscope.cn/models/MiniMax/MiniMax-M2.7" }
  ]);

  patchModel("minimax-m2-7", {
    releaseDate: "2026-03-18",
    modality: "language",
    modalityDetail: "文本与工具调用 → 文本；办公文件能力通过 Agent harness 与 Skills 实现",
    context: "未披露",
    access: "开放权重 / API",
    sourceId: "minimax-m27-github",
    referenceSourceIds: ["minimax-m27-blog", "minimax-m27-hf", "minimax-m27-modelscope"],
    scoreStatus: undefined,
    summary: "MiniMax 的开放权重 Agent 模型；官方发布材料覆盖软件工程、ML 工程、工具与办公任务。"
  });

  appendUnique(benchmarks, [
    { id: "multi-swe-bench", name: "Multi-SWE-Bench", category: "编码", direction: "higher", description: "多仓库软件工程评测；具体 agent harness 与快照按来源保留。" },
    { id: "vibe-pro", name: "VIBE-Pro", category: "编码", direction: "higher", description: "端到端项目交付评测，覆盖 Web、Android、iOS 与仿真任务。" },
    { id: "mle-bench-lite", name: "MLE-Bench Lite", category: "编码", direction: "higher", description: "22 个机器学习竞赛任务的 medal rate；与完整 MLE-Bench 分开。" },
    { id: "gdpval-aa-score", name: "GDPval-AA · Published Score", category: "专业工作", direction: "higher", description: "MiniMax 发布图中的百分制 GDPval-AA 口径；与同页另报的 Elo 1495 分榜。" },
    { id: "mm-clawbench", name: "MM-ClawBench", category: "Agent / 工作", direction: "higher", description: "MiniMax 发布材料中的端到端 Agent/Skills 任务；名称中的 MM 不据此推定为多模态输入。" },
    { id: "mm-claw-skill-compliance", name: "MM Claw · Skill Compliance", category: "Agent / 工作", direction: "higher", description: "MiniMax 在 40+ 个复杂 Skills 上报告的指令/技能遵循率。" },
    { id: "artificial-analysis-unspecified", name: "Artificial Analysis · Version Unspecified", category: "综合", direction: "higher", description: "厂商图仅标注 Artificial Analysis、未给出指数版本；不得自动并入 v4.1 或 v4.3。" }
  ]);
  mergeFamily("mle-bench-family", "MLE-Bench", [
    { benchmarkId: "mle-bench", label: "Full / unspecified" },
    { benchmarkId: "mle-bench-lite", label: "Lite · 22 competitions" }
  ]);
  mergeFamily("gdpval-aa-family", "GDPval-AA", [
    { benchmarkId: "gdpval-aa", label: "Original · Elo" },
    { benchmarkId: "gdpval-aa-score", label: "Published percentage score" },
    { benchmarkId: "gdpval-aa-v2", label: "v2" }
  ]);
  mergeFamily("artificial-analysis-intelligence-index", "Artificial Analysis Intelligence Index", [
    { benchmarkId: "artificial-analysis-unspecified", label: "Version unspecified" }
  ]);

  const github = "minimax-m27-github";
  const mirrored = [github, "minimax-m27-blog", "minimax-m27-hf"];
  const chart = "MiniMax M2.7 official benchmark overview · exact harness/version not stated";
  const chartRows = [
    ["swe-bench-pro", [["minimax-m2-7", 56.22], ["minimax-m2-5", 55.4], ["gemini-3-1-pro", 54.2], ["claude-sonnet-4-6", 57.2], ["claude-opus-4-6", 57.3], ["gpt-5-4", 57.7]], "MiniMax prose reports 56.22%; the overview chart rounds it to 56.2."],
    ["multi-swe-bench", [["minimax-m2-7", 52.7], ["minimax-m2-5", 51.3], ["claude-sonnet-4-6", 51.0], ["claude-opus-4-6", 50.3], ["gpt-5-4", 49.0]]],
    ["vibe-pro", [["minimax-m2-7", 55.6], ["minimax-m2-5", 54.2], ["gemini-3-1-pro", 41.0], ["claude-sonnet-4-6", 56.1], ["claude-opus-4-6", 55.6]]],
    ["mle-bench-lite", [["minimax-m2-7", 66.6], ["minimax-m2-5", 51.5], ["gemini-3-1-pro", 66.6], ["claude-sonnet-4-6", 72.7], ["claude-opus-4-6", 75.7], ["gpt-5-4", 71.2]], "22 ML competitions · medal rate"],
    ["gdpval-aa-score", [["minimax-m2-7", 50.0], ["minimax-m2-5", 35.0], ["gemini-3-1-pro", 41.0], ["claude-sonnet-4-6", 57.0], ["claude-opus-4-6", 55.0], ["gpt-5-4", 58.0]], "percentage-scale chart metric; not Elo"],
    ["toolathlon", [["minimax-m2-7", 46.3], ["minimax-m2-5", 38.3], ["gemini-3-1-pro", 48.8], ["claude-sonnet-4-6", 44.8], ["claude-opus-4-6", 47.2], ["gpt-5-4", 54.6]]],
    ["mm-clawbench", [["minimax-m2-7", 62.7], ["minimax-m2-5", 57.6], ["gemini-3-1-pro", 61.8], ["claude-sonnet-4-6", 64.2], ["claude-opus-4-6", 75.4], ["gpt-5-4", 73.6]], "end-to-end score"],
    ["artificial-analysis-unspecified", [["minimax-m2-7", 50.0], ["minimax-m2-5", 42.0], ["gemini-3-1-pro", 57.0], ["claude-sonnet-4-6", 52.0], ["claude-opus-4-6", 53.0], ["gpt-5-4", 57.0]], "chart does not identify the index version"]
  ];
  for (const [benchmarkId, modelRows, note = ""] of chartRows) {
    for (const [modelId, value] of modelRows) {
      add(modelId === "minimax-m2-7" ? mirrored : [github], benchmarkId, modelId, value, "%", chart, note);
    }
  }

  const proseSetting = "MiniMax M2.7 official release prose";
  add(mirrored, "swe-multilingual", "minimax-m2-7", 76.5, "%", proseSetting);
  add(mirrored, "terminal-bench-2-0-unspecified-harness", "minimax-m2-7", 57.0, "%", `${proseSetting} · Terminal Bench 2 · harness unspecified`);
  add(mirrored, "nl2repo", "minimax-m2-7", 39.8, "%", proseSetting);
  add(mirrored, "gdpval-aa", "minimax-m2-7", 1495, "Elo", proseSetting, "The same release also shows a separate percentage-scale GDPval-AA chart; both are retained.");
  add(mirrored, "mm-claw-skill-compliance", "minimax-m2-7", 97.0, "%", `${proseSetting} · 40+ complex skills`);

  const sourceTarget = (sourceId) => ({
    modelId: "minimax-m2-7",
    expectedObservationCount: observations.filter((item) => item.modelId === "minimax-m2-7" && item.sourceIds.includes(sourceId)).length,
    benchmarkIds: [...new Set(observations.filter((item) => item.modelId === "minimax-m2-7" && item.sourceIds.includes(sourceId)).map((item) => item.benchmarkId))]
  });
  upsertAudit(github, {
    status: "complete",
    scopeLabel: "官方能力总图与正文已核",
    auditedAt: "2026-09-21",
    expectedObservationCount: 51,
    benchmarkIds: [...new Set([...chartRows.map(([benchmarkId]) => benchmarkId), "swe-multilingual", "terminal-bench-2-0-unspecified-harness", "nl2repo", "gdpval-aa", "mm-claw-skill-compliance"])],
    note: "官方 README 的 8 组 overview 图共 46 个精确标注单元格全部录入，并补入正文独有的 SWE Multilingual、Terminal Bench 2、NL2Repo、GDPval-AA Elo 与 MM Claw skill-compliance 五项。SWE-Pro 使用正文精确值 56.22，图中 56.2 记为四舍五入而不重复造行。"
  });
  for (const sourceId of ["minimax-m27-blog", "minimax-m27-hf"]) {
    upsertAudit(sourceId, {
      status: "target-complete",
      scopeLabel: "目标模型结果已核",
      auditedAt: "2026-09-21",
      targetModels: [sourceTarget(sourceId)],
      note: "该 surface 与官方仓库重复 MiniMax-M2.7 的 overview/正文目标结果；比较模型的完整图表 provenance 由官方仓库 source 保留。"
    });
  }
  upsertAudit("minimax-m27-modelscope", {
    status: "pending",
    scopeLabel: "镜像卡待独立复核",
    auditedAt: "2026-09-21",
    note: "官方发布材料给出精确 ModelScope 链接；页面在本轮持续加载失败。未假定其成绩与 GitHub/Hugging Face 卡完全相同。"
  });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
