(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const patchModelReferences = (modelId, sourceIds) => {
    const model = models.find((item) => item.id === modelId);
    if (!model) return;
    model.referenceSourceIds = [...new Set([...(model.referenceSourceIds || []), ...sourceIds])];
  };
  const upsertAudit = (sourceId, values) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    if (audit) Object.assign(audit, values);
    else sourceAudits.push({ sourceId, ...values });
  };
  const add = (sourceIds, benchmarkId, modelId, value, unit, setting, note = "") => {
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
      return;
    }
    observations.push({
      id: `o${observations.length + 1}`,
      sourceIds: normalizedSources,
      benchmarkId,
      modelId,
      value,
      unit,
      setting,
      note
    });
  };

  appendUnique(sources, [
    { id: "meta-muse-spark11", vendorId: "meta", publisher: "Meta", date: "2026-07-09", tier: "official", title: "Muse Spark 1.1 — Official Model Page", url: "https://developer.meta.com/ai/models/muse-spark-1-1/" },
    { id: "meta-muse-spark11-devblog", vendorId: "meta", publisher: "Meta", date: "2026-07-08", tier: "official", title: "Build with Muse Spark on Meta Model API", url: "https://developer.meta.com/ai/resources/blog/build-with-muse-spark/" },
    { id: "meta-muse-spark11-research", vendorId: "meta", publisher: "Meta Superintelligence Labs", date: "2026-07-09", tier: "official", title: "Introducing Muse Spark 1.1", url: "https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/" },
    { id: "meta-muse-spark11-report", vendorId: "meta", publisher: "Meta", date: "2026-07-09", tier: "official", title: "Muse Spark 1.1 Evaluation Report", url: "https://ai.meta.com/static-resource/muse-spark-1-1-evaluation-report/" },
    { id: "meta-muse-spark11-methodology", vendorId: "meta", publisher: "Meta", date: "2026-07-09", tier: "official", title: "Muse Spark 1.1 Evaluation Methodology", url: "https://ai.meta.com/static-resource/muse-spark-1-1-eval-methodology" },
    { id: "meta-muse-spark12-model", vendorId: "meta", publisher: "Meta", date: "2026-08-05", tier: "official", title: "Muse Spark 1.2 — Official Model Page", url: "https://developer.meta.com/ai/models/muse-spark-1-2/" },
    { id: "meta-muse-spark13-model", vendorId: "meta", publisher: "Meta", date: "2026-09-02", tier: "official", title: "Muse Spark 1.3 — Official Model Page", url: "https://developer.meta.com/ai/models/muse-spark/" },
    { id: "meta-muse-spark13-research", vendorId: "meta", publisher: "Meta AI Research", date: "2026-09-02", tier: "official", title: "Introducing Muse Spark 1.3", url: "https://research.meta.ai/blog/introducing-muse-spark-1-3" },
    { id: "meta-muse-spark13-methodology", vendorId: "meta", publisher: "Meta AI Research", date: "2026-09-02", tier: "official", title: "Muse Spark 1.3 Evaluation Methodology", url: "https://research.meta.ai/static/muse-spark-1-3-multimodal-evaluation-methodology" },
    { id: "hy4-research", vendorId: "tencent", publisher: "Tencent Hy", date: "2026-08-28", tier: "official", title: "Hy4 Preview — Official Research Page", url: "https://hy.tencent.ai/research/hy4-preview" },
    { id: "hy4-news", vendorId: "tencent", publisher: "Tencent", date: "2026-08-28", tier: "official", title: "Tencent Releases and Open Sources Hy4 Preview", url: "https://www.tencent.com/tencent-releases-and-open-sources-tencent-hy4-preview/" },
    { id: "hy4-github", vendorId: "tencent", publisher: "Tencent Hy", date: "2026-08-28", tier: "official", title: "Hy4 Preview — Official GitHub Repository", url: "https://github.com/Tencent-Hunyuan/Hy4-preview" },
    { id: "hy4-modelscope", vendorId: "tencent", publisher: "Tencent Hy", date: "2026-08-28", tier: "official", title: "Hy4 Preview — Official ModelScope Card", url: "https://modelscope.cn/models/Tencent-Hunyuan/Hy4-preview" },
    { id: "zai-glm53-hf", vendorId: "zai", publisher: "Z.ai", date: "2026-08-14", tier: "official", title: "GLM-5.3 — Official Model Card", url: "https://huggingface.co/zai-org/GLM-5.3" },
    { id: "zai-glm53-flash-hf", vendorId: "zai", publisher: "Z.ai", date: "2026-08-26", tier: "official", title: "GLM-5.3-Flash — Official Model Card", url: "https://huggingface.co/zai-org/GLM-5.3-Flash" },
    { id: "zai-glm5-github", vendorId: "zai", publisher: "Z.ai", date: "2026-02", tier: "official", title: "GLM-5 — Official GitHub Repository", url: "https://github.com/zai-org/GLM-5" },
    { id: "kimi-k3-github", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-07-17", tier: "official", title: "Kimi K3 — Official GitHub Repository", url: "https://github.com/MoonshotAI/Kimi-K3" },
    { id: "kimi-k3-modelscope", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026-07-17", tier: "official", title: "Kimi K3 — Official ModelScope Card", url: "https://modelscope.cn/models/moonshotai/Kimi-K3" },
    { id: "kimi-k25-github", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026", tier: "official", title: "Kimi K2.5 — Official GitHub Repository", url: "https://github.com/MoonshotAI/Kimi-K2.5" },
    { id: "kimi-k25-modelscope", vendorId: "moonshot", publisher: "Moonshot AI", date: "2026", tier: "official", title: "Kimi K2.5 — Official ModelScope Card", url: "https://modelscope.cn/models/moonshotai/Kimi-K2.5" },
    { id: "deepseek-v4-report", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-06", tier: "official", title: "DeepSeek V4 Technical Report", url: "https://arxiv.org/abs/2606.19348" },
    { id: "deepseek-v41-launch", vendorId: "deepseek", publisher: "DeepSeek", date: "2026-09-10", tier: "official", title: "Introducing DeepSeek-V4.1-Flash", url: "https://www.deepseek.com/en/news/deepseek-v4-1-flash/" },
    { id: "xai-grok45-model-docs", vendorId: "xai", publisher: "SpaceXAI", date: "2026-07-16", tier: "official", title: "Grok 4.5 — Official Model Documentation", url: "https://docs.x.ai/developers/models/grok-4.5" }
  ]);

  appendUnique(models, [
    {
      id: "muse-spark-1-3",
      name: "Muse Spark 1.3",
      vendorId: "meta",
      vendor: "Meta",
      releaseDate: "2026-09-02",
      modality: "vision",
      modalityDetail: "文本、图像、视频、文档 → 文本与工具调用；官方页未声明音频输入",
      context: "1M",
      access: "闭源 API / Muse Code",
      aliases: ["muse-spark-1.3", "muse-spark-1.3-contributor"],
      sourceId: "meta-muse-spark13-model",
      referenceSourceIds: ["meta-muse-spark13-research", "meta-muse-spark13-methodology"],
      summary: "Meta 面向长程 Agent 与编码工作流的视觉多模态模型；原生处理图像、视频和文档。"
    }
  ]);
  appendUnique(benchmarks, [
    { id: "agentic-if-index", name: "Agentic IF Index", category: "Agent / 工作", direction: "higher", description: "Meta 内部 Agent 指令遵循复合指标；不是单一固定任务集。" }
  ]);

  patchModelReferences("muse-spark-1-1", ["meta-muse-spark11-devblog", "meta-muse-spark11-research", "meta-muse-spark11-report", "meta-muse-spark11-methodology", "meta-muse-spark12"]);
  const muse11 = models.find((item) => item.id === "muse-spark-1-1");
  if (muse11) {
    muse11.sourceId = "meta-muse-spark11";
    muse11.releaseDate = "2026-07-09";
  }
  patchModelReferences("muse-spark-1-2", ["meta-muse-spark12-model"]);
  patchModelReferences("muse-spark-1-3", ["meta-muse-spark13-research", "meta-muse-spark13-methodology"]);
  patchModelReferences("hy4-preview", ["hy4-research", "hy4-news", "hy4-github", "hy4-modelscope"]);
  patchModelReferences("glm-5-3", ["zai-glm53-hf", "zai-glm5-github", "zai-glm5-report"]);
  patchModelReferences("glm-5-3-flash", ["zai-glm53-flash-hf", "zai-glm5-github", "zai-glm5-report"]);
  patchModelReferences("kimi-k3", ["kimi-k3-github", "kimi-k3-modelscope"]);
  patchModelReferences("kimi-k2-5", ["kimi-k25-github", "kimi-k25-modelscope"]);
  patchModelReferences("deepseek-v4-pro", ["deepseek-v4-report"]);
  patchModelReferences("deepseek-v4-flash-0731", ["deepseek-v4-report"]);
  patchModelReferences("deepseek-v4-1-flash", ["deepseek-v41-launch"]);
  patchModelReferences("deepseek-v4-1-flash-base", ["deepseek-v41-launch"]);
  patchModelReferences("grok-4-5", ["xai-grok45-model-docs"]);

  // Muse Spark 1.1 model page and Figure 44 of the evaluation report. The two
  // surfaces repeat eleven rows; those rows are stored once with both sources.
  const museModels = ["muse-spark-1-1", "muse-spark-unspecified", "gemini-3-1-pro", "claude-opus-4-8", "gpt-5-5"];
  const effort = {
    "muse-spark-1-1": "Meta Model API · xhigh",
    "muse-spark-unspecified": "Meta Model API · highest effort · version unspecified",
    "gemini-3-1-pro": "high",
    "claude-opus-4-8": "max",
    "gpt-5-5": "xhigh"
  };
  const addMuseRow = (sourceIds, benchmarkId, values, unit, detail, note = "") => {
    values.forEach((value, index) => {
      if (value == null) return;
      const modelId = museModels[index];
      add(sourceIds, benchmarkId, modelId, value, unit, `${effort[modelId]} · ${detail}`, note);
    });
  };
  const musePageAndReport = ["meta-muse-spark11", "meta-muse-spark11-devblog", "meta-muse-spark11-research", "meta-muse-spark11-report"];
  addMuseRow(musePageAndReport, "mcp-atlas", [88.1, 82.2, 78.2, 82.2, 75.3], "%", "Scale AI MCP Atlas");
  addMuseRow(musePageAndReport, "jobbench", [54.7, 17.0, 15.9, 48.4, 38.3], "%", "OpenCode · Grok 4.3 judge · official JobBench results");
  addMuseRow(musePageAndReport, "toolathlon", [75.6, 49.4, 61.1, 76.2, 73.5], "%", "Toolathlon-Verified · official harness");
  addMuseRow(musePageAndReport, "osworld-verified", [80.8, 53.3, 76.2, 83.4, 78.7], "%", "361-task split excluding Google Drive · GUI-only · 1920×1080 · 200 steps · pass@1");
  addMuseRow(musePageAndReport, "hle-tools", [62.1, 50.4, 51.4, 57.9, 52.2], "%", "full 2,500 questions · bash + browser tools · o3-mini judge");
  addMuseRow(musePageAndReport, "financeagent-v2", [57.2, null, 43.0, 53.9, 51.8], "%", "Vals AI result");
  addMuseRow(musePageAndReport, "terminal-bench-2-1", [80.0, 67.3, 70.3, 82.7, 83.4], "%", "89 tasks · bash-only · pass@1 · five-attempt mean");
  addMuseRow(musePageAndReport, "swe-bench-pro", [61.5, 55.0, 54.2, 69.2, 58.6], "%", "Scale AI · mini-swe-agent for Muse Spark 1.1");
  addMuseRow(musePageAndReport, "deepswe-v1-1", [53.3, 10.0, 12.0, 59.0, 67.0], "%", "mini-swe-agent fork · no internet · 64GB VM · pass@1 · five-attempt mean");
  addMuseRow(musePageAndReport, "charxiv", [88.4, 88.9, 81.6, 89.9, 84.8], "%", "with code execution · 1,000 validation questions · gpt-oss-120b high judge");
  addMuseRow(musePageAndReport, "babyvision", [76.3, 39.9, 51.5, 81.2, 83.6], "%", "with code execution · 388 questions · gpt-oss-120b high judge");

  const museReport = ["meta-muse-spark11-report"];
  addMuseRow(museReport, "hle", [52.2, 42.8, 45.4, 49.8, 44.8], "%", "no tools · full 2,500 questions · o3-mini judge");
  add(museReport, "hle", "gemini-3-1-pro", 44.4, "%", "high · no tools · self-reported value quoted beside Meta's 45.4 reproduction", "The report prints both values in the same cell; both are retained as separate settings.");
  add(museReport, "hle", "gpt-5-5", 41.4, "%", "xhigh · no tools · self-reported value quoted beside Meta's 44.8 reproduction", "The report prints both values in the same cell; both are retained as separate settings.");
  addMuseRow(museReport, "mrcr-v2-8needle-1m", [54.1, null, 26.3, null, 74.0], "%", "1M window · 512K–1M bin · 8-needle · mean sequence-matcher ratio");
  addMuseRow(museReport, "osworld-2-binary", [14.2, null, 7.8, 20.6, 13.9], "%", "108 tasks · GUI-only · no exec · 500 steps · binary completion");
  addMuseRow(museReport, "osworld-2-partial", [47.3, null, 30.6, 54.8, 47.5], "%", "108 tasks · GUI-only · no exec · 500 steps · partial reward");
  addMuseRow(museReport, "webarena-verified", [69.0, 59.0, 69.0, 71.2, 67.0], "%", "OpenClaw · DOM + screenshots · full 812 tasks · 150 tool calls · pass@1");
  addMuseRow(museReport, "deepsearchqa", [84.9, 76.8, 71.3, 84.3, 87.8], "F1", "browser search/open/find · gpt-oss-120b answer extraction");
  addMuseRow(museReport, "gdpval-aa-v2", [1381, 1145, 963, 1600, 1494], "Elo", "Artificial Analysis leaderboard");
  addMuseRow(museReport, "healthbench-professional", [59.3, 54.1, 41.6, 55.8, 51.8], "%", "525 items · length-normalized · GPT-5.4 low grader");

  // Muse Spark 1.3 official model page. The methodology report documents
  // settings but contains no numeric score table, so it remains a model
  // reference rather than being presented as a source for these values.
  const muse13Models = ["muse-spark-1-3", "muse-spark-1-2", "gpt-5-6-sol", "claude-opus-5"];
  const muse13Effort = {
    "muse-spark-1-3": "max",
    "muse-spark-1-2": "xhigh",
    "gpt-5-6-sol": "max",
    "claude-opus-5": "max"
  };
  const addMuse13Row = (benchmarkId, values, unit, detail, detailByModel = {}) => {
    values.forEach((value, index) => {
      if (value == null) return;
      const modelId = muse13Models[index];
      add(
        ["meta-muse-spark13-model"],
        benchmarkId,
        modelId,
        value,
        unit,
        `${muse13Effort[modelId]} · ${detailByModel[modelId] || detail}`
      );
    });
  };
  addMuse13Row("gdpval-aa-v2", [1754, 1615, 1710, 1824], "Elo", "Artificial Analysis Stirrup · 220 tasks · shell + web browsing · human baseline 1000");
  addMuse13Row("jobbench", [64.9, 61.6, 45.4, 65.7], "%", "65 tasks · official evaluation code · OpenCode · file-aware rubric grader · mean rubric score");
  addMuse13Row("osworld-2-partial", [66.9, 47.6, 62.7, 68.3], "%", "OSWorld 2.0 v08.08 · 108 tasks · common internal framework · partial reward", {
    "muse-spark-1-2": "OSWorld 2.0 v06.24 · 108 tasks · common internal framework · partial reward"
  });
  addMuse13Row("osworld-2-binary", [32.0, 17.9, 27.3, 31.4], "%", "OSWorld 2.0 v08.08 · 108 tasks · common internal framework · binary completion", {
    "muse-spark-1-2": "OSWorld 2.0 v06.24 · 108 tasks · common internal framework · binary completion"
  });
  addMuse13Row("deepsearchqa", [90.3, 85.9, 93.1, 90.4], "F1", "900 questions · common browser search/open/find harness · semantic answer matching");
  addMuse13Row("agentic-if-index", [57.8, 46.2, 60.5, 59.1], "Index", "Meta internal composite · agentic instruction following");
  addMuse13Row("automationbench", [49.6, 38.2, 46.7, 50.3], "%", "public v3 · 600 tasks · benchmark automation tools · pass@1");
  addMuse13Row("mrcr-v2-8needle", [98.5, 66.3, 91.5, null], "%", "256K–512K · 100 examples · 8-needle · no tools · mean sequence-matcher ratio");
  addMuse13Row("mrcr-v2-8needle", [98.1, 55.5, 73.8, null], "%", "512K–1M · 100 examples · 8-needle · no tools · mean sequence-matcher ratio");
  addMuse13Row("deepswe-v1-1", [75.4, 55.0, 73.0, 74.0], "%", "official Datacurve leaderboard · task pass rate", {
    "muse-spark-1-3": "mini-swe-agent · 113 tasks · task pass rate"
  });
  addMuse13Row("swe-atlas-codebase-qa", [59.4, 46.2, 53.5, 52.7], "%", "public QnA split · 124 tasks · mini-swe-agent · rubric grading · mean pass@1", {
    "gpt-5-6-sol": "provider model card · public QnA split · mean pass@1",
    "claude-opus-5": "provider model card · public QnA split · mean pass@1"
  });
  addMuse13Row("terminal-bench-2-1", [88.8, 82.9, 88.8, 86.7], "%", "89 tasks · native coding harness · isolated cloud sandbox · pass@1");

  // The GitHub README mirrors the official Hy4 model card. Extend provenance
  // for the already imported appendix before adding its omitted blind study.
  for (const observation of observations.filter((item) => item.sourceIds.includes("hy4"))) {
    observation.sourceIds = [...new Set([...observation.sourceIds, "hy4-github"])];
  }
  appendUnique(benchmarks, [
    { id: "hy4-expert-blind-average", name: "Hy4 Expert Blind Eval · Average", category: "专业工作", direction: "higher", description: "Tencent 内部 163 位专家在 203 个工程任务上的四分制盲评平均分。" },
    { id: "hy4-vs-glm53-win", name: "Hy4 vs GLM-5.3 · Win", category: "专业工作", direction: "higher", description: "同一 Tencent 专家盲评中的 Hy4 胜率。" },
    { id: "hy4-vs-glm53-tie", name: "Hy4 vs GLM-5.3 · Tie", category: "专业工作", direction: "higher", description: "同一 Tencent 专家盲评中的平局率；只用于描述结果，不应单独解释为能力越高越好。" },
    { id: "hy4-vs-glm53-loss", name: "Hy4 vs GLM-5.3 · Loss", category: "专业工作", direction: "lower", description: "同一 Tencent 专家盲评中的 Hy4 负率。" },
    { id: "hy4-vs-kimi-k3-win", name: "Hy4 vs Kimi K3 · Win", category: "专业工作", direction: "higher", description: "同一 Tencent 专家盲评中的 Hy4 胜率。" },
    { id: "hy4-vs-kimi-k3-tie", name: "Hy4 vs Kimi K3 · Tie", category: "专业工作", direction: "higher", description: "同一 Tencent 专家盲评中的平局率；只用于描述结果，不应单独解释为能力越高越好。" },
    { id: "hy4-vs-kimi-k3-loss", name: "Hy4 vs Kimi K3 · Loss", category: "专业工作", direction: "lower", description: "同一 Tencent 专家盲评中的 Hy4 负率。" }
  ]);
  if (!benchmarkFamilies.some((family) => family.id === "hy4-expert-blind-eval")) {
    benchmarkFamilies.push({
      id: "hy4-expert-blind-eval",
      name: "Hy4 Expert Blind Eval",
      variants: [
        { benchmarkId: "hy4-expert-blind-average", label: "4-point average" },
        { benchmarkId: "hy4-vs-glm53-win", label: "vs GLM-5.3 · Win" },
        { benchmarkId: "hy4-vs-glm53-tie", label: "vs GLM-5.3 · Tie" },
        { benchmarkId: "hy4-vs-glm53-loss", label: "vs GLM-5.3 · Loss" },
        { benchmarkId: "hy4-vs-kimi-k3-win", label: "vs Kimi K3 · Win" },
        { benchmarkId: "hy4-vs-kimi-k3-tie", label: "vs Kimi K3 · Tie" },
        { benchmarkId: "hy4-vs-kimi-k3-loss", label: "vs Kimi K3 · Loss" }
      ]
    });
  }
  const hyBlindSources = ["hy4", "hy4-github"];
  const hyBlindSetting = "163 internal experts · 203 engineering tasks · blind side-by-side evaluation";
  add(hyBlindSources, "hy4-expert-blind-average", "hy4-preview", 2.99, "/4", hyBlindSetting);
  add(hyBlindSources, "hy4-expert-blind-average", "glm-5-3", 2.92, "/4", hyBlindSetting);
  add(hyBlindSources, "hy4-expert-blind-average", "kimi-k3", 2.94, "/4", hyBlindSetting);
  add(hyBlindSources, "hy4-vs-glm53-win", "hy4-preview", 46.8, "%", hyBlindSetting);
  add(hyBlindSources, "hy4-vs-glm53-tie", "hy4-preview", 12.8, "%", hyBlindSetting);
  add(hyBlindSources, "hy4-vs-glm53-loss", "hy4-preview", 40.4, "%", hyBlindSetting);
  add(hyBlindSources, "hy4-vs-kimi-k3-win", "hy4-preview", 51.2, "%", hyBlindSetting);
  add(hyBlindSources, "hy4-vs-kimi-k3-tie", "hy4-preview", 7.9, "%", hyBlindSetting);
  add(hyBlindSources, "hy4-vs-kimi-k3-loss", "hy4-preview", 40.9, "%", hyBlindSetting);

  // Exact target columns duplicated on additional official cards/repositories.
  for (const [originalSourceId, mirrorSourceId, modelId] of [
    ["zai-glm53", "zai-glm53-hf", "glm-5-3"],
    ["zai-glm53-flash", "zai-glm53-flash-hf", "glm-5-3-flash"],
    ["kimi-k3", "kimi-k3-github", "kimi-k3"],
    ["kimi-k25", "kimi-k25-github", "kimi-k2-5"]
  ]) {
    for (const observation of observations.filter((item) => item.modelId === modelId && item.sourceIds.includes(originalSourceId))) {
      observation.sourceIds = [...new Set([...observation.sourceIds, mirrorSourceId])];
    }
  }

  const sourceBenchmarkIds = (sourceId) => [...new Set(observations
    .filter((item) => item.sourceIds.includes(sourceId))
    .map((item) => item.benchmarkId))];
  upsertAudit("meta-muse-spark11", {
    status: "complete", auditedAt: "2026-09-20", expectedObservationCount: 54,
    benchmarkIds: sourceBenchmarkIds("meta-muse-spark11"),
    targetModels: [{ modelId: "muse-spark-1-1", expectedObservationCount: 11 }],
    note: "官方模型页的 11 行能力表已逐个非空单元格录入；Finance Agent v2 的 Muse Spark（旧版）空值没有伪造成 0。"
  });
  upsertAudit("meta-muse-spark11-devblog", {
    status: "target-complete", auditedAt: "2026-09-20",
    targetModels: [{ modelId: "muse-spark-1-1", expectedObservationCount: 11 }],
    note: "开发者发布博客的能力对比图与官方模型页 11 行表一致；已合并同值来源，正文没有额外独立 Benchmark 分数。"
  });
  upsertAudit("meta-muse-spark11-research", {
    status: "complete", auditedAt: "2026-09-20", expectedObservationCount: 54,
    benchmarkIds: sourceBenchmarkIds("meta-muse-spark11-research"),
    targetModels: [{ modelId: "muse-spark-1-1", expectedObservationCount: 11 }],
    note: "Meta AI 发布页的完整能力对比图已视觉核对，与模型页 11 行表逐格一致；同值只存一条 observation，并合并来源。"
  });
  upsertAudit("meta-muse-spark11-report", {
    status: "target-complete", auditedAt: "2026-09-20",
    targetModels: [{ modelId: "muse-spark-1-1", expectedObservationCount: 19 }],
    note: "112 页官方 Evaluation Report 的 Figure 44 通用能力总表已视觉核对并拆为 19 条目标模型观测；复合 OSWorld 2.0 单元格拆为 binary/partial。安全、对齐和灾难风险章节尚未作为能力排行榜导入，因此不标 complete。"
  });
  upsertAudit("meta-muse-spark11-methodology", { status: "pending", auditedAt: "2026-09-20", note: "发布页链接的独立 methodology 资源已登记，但当前官方端点返回错误页；不可访问时不推断或复制分数。" });
  upsertAudit("meta-muse-spark12-model", { status: "pending", auditedAt: "2026-09-20", note: "独立官方模型页已登记；需与 1.2 发布博客的四张图逐项合并来源后再升级状态。" });
  upsertAudit("meta-muse-spark13-model", {
    status: "complete", auditedAt: "2026-09-20", expectedObservationCount: 46,
    benchmarkIds: sourceBenchmarkIds("meta-muse-spark13-model"),
    targetModels: [{
      modelId: "muse-spark-1-3",
      expectedObservationCount: 12,
      benchmarkIds: sourceBenchmarkIds("meta-muse-spark13-model").filter((benchmarkId) => observations.some((observation) =>
        observation.sourceIds.includes("meta-muse-spark13-model") &&
        observation.modelId === "muse-spark-1-3" &&
        observation.benchmarkId === benchmarkId
      ))
    }],
    note: "官方模型页的 12 行能力表已逐个非空单元格录入，共 46 条；Opus 5 的两个 MRCR 空值未伪造成零，OSWorld partial/binary 已拆分。"
  });
  upsertAudit("meta-muse-spark13-research", {
    status: "metadata-only", auditedAt: "2026-09-20",
    note: "官方研究博客确认 2026-09-02 发布、max reasoning、Muse Code / Meta Model API 可用性与视觉多模态应用，但正文没有数值成绩表。"
  });
  upsertAudit("meta-muse-spark13-methodology", {
    status: "metadata-only", auditedAt: "2026-09-20",
    note: "官方方法报告逐项说明 12 个 Benchmark 的任务数、Harness、metric、版本和模型 effort；报告不含数值表，因此只作为 setting 与方法参考，不冒充分数来源。"
  });
  upsertAudit("hy4", {
    status: "target-complete", auditedAt: "2026-09-20",
    targetModels: [{ modelId: "hy4-preview", expectedObservationCount: 53 }],
    note: "Hy4 官方模型卡目标列及 163 人/203 工程任务专家盲评已完整录入；盲评平均分与两组 win/tie/loss 均按独立指标保存。"
  });
  upsertAudit("hy4-github", {
    status: "target-complete", auditedAt: "2026-09-20",
    targetModels: [{ modelId: "hy4-preview", expectedObservationCount: 53 }],
    note: "官方仓库 README 与 Hugging Face 模型卡内容一致；目标模型 46 个附录指标和 7 个专家盲评指标均合并来源。"
  });
  upsertAudit("hy4-research", { status: "pending", auditedAt: "2026-09-20", note: "官方研究页已登记；尚未完成与 HF/GitHub 表格的逐单元格去重核对。" });
  upsertAudit("hy4-news", { status: "pending", auditedAt: "2026-09-20", note: "腾讯官方发布新闻已登记；尚未完成与模型卡的逐项分数核对。" });
  upsertAudit("hy4-modelscope", { status: "pending", auditedAt: "2026-09-20", note: "官方 ModelScope 镜像已登记；尚未完成与 HF/GitHub 卡片的逐项去重核对。" });
  upsertAudit("zai-glm53-hf", {
    status: "target-complete", auditedAt: "2026-09-20",
    targetModels: [{ modelId: "glm-5-3", expectedObservationCount: observations.filter((item) => item.modelId === "glm-5-3" && item.sourceIds.includes("zai-glm53-hf")).length }],
    note: "官方 Hugging Face 卡与发布页目标列一致；已合并目标模型来源，比较列仍待逐格录入。"
  });
  upsertAudit("zai-glm53-flash-hf", {
    status: "target-complete", auditedAt: "2026-09-20",
    targetModels: [{ modelId: "glm-5-3-flash", expectedObservationCount: observations.filter((item) => item.modelId === "glm-5-3-flash" && item.sourceIds.includes("zai-glm53-flash-hf")).length }],
    note: "官方 Hugging Face 卡嵌入仓库 bench_53.png；已合并目标模型来源，比较列仍待逐格录入。"
  });
  upsertAudit("zai-glm5-github", { status: "metadata-only", auditedAt: "2026-09-20", note: "GLM-5 系列官方仓库已登记；当前未发现超出已录博客/HF 目标表的 GLM-5.3 独立成绩。" });
  upsertAudit("kimi-k3-github", {
    status: "target-complete", auditedAt: "2026-09-20",
    targetModels: [{ modelId: "kimi-k3", expectedObservationCount: observations.filter((item) => item.modelId === "kimi-k3" && item.sourceIds.includes("kimi-k3-github")).length }],
    note: "官方仓库目标表与博客/HF 对齐；已合并目标模型来源，比较列仍待逐格导入。"
  });
  upsertAudit("kimi-k25-github", {
    status: "target-complete", auditedAt: "2026-09-20",
    targetModels: [{ modelId: "kimi-k2-5", expectedObservationCount: observations.filter((item) => item.modelId === "kimi-k2-5" && item.sourceIds.includes("kimi-k25-github")).length }],
    note: "官方仓库目标表与博客/HF 对齐；已合并目标模型来源，比较列仍待逐格导入。"
  });
  upsertAudit("kimi-k3-modelscope", { status: "pending", auditedAt: "2026-09-20", note: "官方 ModelScope 镜像已登记；尚未逐项核对是否含独立成绩或仅镜像模型卡。" });
  upsertAudit("kimi-k25-modelscope", { status: "pending", auditedAt: "2026-09-20", note: "官方 ModelScope 镜像已登记；尚未逐项核对是否含独立成绩或仅镜像模型卡。" });
  upsertAudit("deepseek-v4-report", { status: "metadata-only", auditedAt: "2026-09-20", note: "V4 Pro 0813 与 V4 Flash 0731 卡片共同链接此技术报告；报告早于两次快照，未把旧模型成绩冒充为快照成绩。" });
  upsertAudit("deepseek-v41-launch", { status: "pending", auditedAt: "2026-09-20", note: "官方发布页已登记；需与 V4.1 HF 卡及技术报告逐单元格合并来源。" });
  upsertAudit("xai-grok45-model-docs", { status: "metadata-only", auditedAt: "2026-09-20", note: "官方模型文档提供 API、上下文和价格信息；未发现独立 Benchmark 表或单独技术/系统报告。" });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
