(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-23";
  const sourceId = "ling-3-0-flash-sante-card";
  const modelId = "ling-3-0-flash-sante";
  sources.push({ id: sourceId, vendorId: "inclusionai", publisher: "Ant inclusionAI", date: "2026-10-22", tier: "official", kind: "model-card",
    title: "Ling-3.0-flash-Sante — Official Model Card and Evaluation Image",
    url: "https://huggingface.co/inclusionAI/Ling-3.0-flash-Sante/blob/f74bd27bd26ffc71a50dd847805f8f7666ff0b43/README.md" });
  models.push({ id: modelId, name: "Ling-3.0-flash-Sante", vendorId: "inclusionai", vendor: "Ant inclusionAI",
    releaseDate: "2026-10-19", modality: "language", modalityDetail: "文本 → 文本 / 工具调用；模型卡标为 text-generation",
    context: "256K", access: "开放权重", aliases: ["Ling-3.0-flash-Sante"], sourceId,
    summary: "基于 Ling-3.0 Flash 的 124B/5.1B active 医疗与研究 Agent 变体；官方图表给出 16 项目标模型成绩。" });

  const newBenchmarks = [
    ["diagnosisarena-mcq", "DiagnosisArena-MCQ", "知识 / 推理", "Model-card image reports a 0–100 score; metric subtype and task count are not stated."],
    ["redisqa-sante", "ReDisQA · Sante card score", "知识 / 推理", "Model-card image reports a 0–100 score; metric subtype and task count are not stated."],
    ["afumed-complex-internal", "AFUMED-ComplexReasoning · Internal", "知识 / 推理", "Internal medical-reasoning evaluation; task definition, count, and metric subtype are not published."],
    ["medxpertqa-text-sante", "MedXpertQA-Text · Sante card score", "知识 / 推理", "Text-only MedXpertQA setting; metric subtype and task count are not stated in the card."],
    ["medqa-usmle", "MedQA-USMLE", "知识 / 推理", "Medical-question evaluation; the card does not state its task count or score subtype."],
    ["medmcqa-standard-validation", "MedMCQA · Standard validation", "知识 / 推理", "Standard validation set, as specified in the card; task count and score subtype are not stated."],
    ["afusafe-medsce-internal", "AFUSAFE-MedSCE · Internal", "知识 / 推理", "Internal healthcare-safety evaluation; task definition, count, and metric subtype are not published."],
    ["afumed-drug-internal", "AFUMED-Drug · Internal", "知识 / 推理", "Internal medication-contraindication accuracy evaluation; task count is not published."],
    ["deepsearchqa-sante-score", "DeepSearchQA · Sante card score", "Agent / 工作", "The card does not name F1 or accuracy; keep its displayed score separate from identified metrics."],
    ["gdpval-v2-aa-sante-score", "GDPval-V2-AA · Sante card score", "专业工作", "Source image reports a 1,288-point score but does not explicitly label the unit Elo." ]
  ];
  for (const [id, name, category, description] of newBenchmarks) benchmarks.push({ id, name, category, direction: "higher", description });
  const families = [
    ["medxpertqa-family", "MedXpertQA", [["medxpertqa-mm", "Multimodal"], ["medxpertqa-text-sante", "Text · Sante card score"]]],
    ["deepsearchqa-family", "DeepSearchQA", [["deepsearchqa-sante-score", "Sante card score · subtype unspecified"]]],
    ["gdpval-aa-family", "GDPval / GDPval-AA", [["gdpval-v2-aa-sante-score", "V2-AA · Sante card score / unit unstated"]]]
  ];
  for (const [id, name, rows] of families) {
    let family = benchmarkFamilies.find((item) => item.id === id);
    if (!family) { family = { id, name, variants: [] }; benchmarkFamilies.push(family); }
    for (const [benchmarkId, label] of rows) {
      if (!family.variants.some((item) => item.benchmarkId === benchmarkId)) family.variants.push({ benchmarkId, label });
    }
  }

  const common = "Ling-3.0-flash-Sante official evaluation image · highest reasoning tier · temperature 1.0 / top_p 0.95 unless otherwise stated · exact API snapshot and run count not published";
  const rows = [
    ["healthbench-professional", 54.3, "%", "professional healthcare score"],
    ["diagnosisarena-mcq", 79.2, "Score", "medical multiple-choice · score subtype unstated"],
    ["redisqa-sante", 89.7, "Score", "score subtype unstated"],
    ["afumed-complex-internal", 76.9, "Score", "internal benchmark · metric and task count undisclosed"],
    ["medxpertqa-text-sante", 51.0, "Score", "text-only benchmark · metric subtype unstated"],
    ["medqa-usmle", 94.2, "Score", "medical-question score subtype unstated"],
    ["medmcqa-standard-validation", 80.3, "Score", "standard validation set · metric subtype unstated"],
    ["afusafe-medsce-internal", 80.1, "Score", "internal healthcare-safety benchmark · metric and task count undisclosed"],
    ["afumed-drug-internal", 90.6, "Score", "internal medication-contraindication accuracy · task count undisclosed"],
    ["browsecomp", 80.2, "%", "single agent with context · 256K · up to 1,000 turns · discard-all at 40% context usage"],
    ["deepsearchqa-sante-score", 90.8, "Score", "256K · no context-management strategy · metric subtype unstated"],
    ["hle-tools", 57.1, "%", "with tools · 256K · no context-management strategy"],
    ["gdpval-v2-aa-sante-score", 1288, "Score", "source image displays 1,288 without explicitly labeling the score unit"],
    ["tau3-banking", 44.3, "%", "official Tau evaluation set · terminal_use tool only"],
    ["mcp-atlas", 75.6, "%", "public benchmark label · task count and harness not stated in card"],
    ["aa-lcr", 70.5, "%", "Artificial Analysis long-context reasoning label · setting not further stated in card"]
  ];
  for (const [benchmarkId, value, unit, detail] of rows) {
    observations.push({ id: `o${observations.length + 1}`, sourceIds: [sourceId], benchmarkId, modelId, value, unit,
      setting: `${common} · ${detail}`, note: "Value read directly from the official model-card evaluation image; unavailable metric details are not inferred." });
  }
  sourceAudits.push({ sourceId, status: "target-complete", auditedAt: "2026-10-23", scopeLabel: "Sante target column checked",
    targetModels: [{ modelId, expectedObservationCount: 16, benchmarkIds: rows.map(([id]) => id) }],
    auditScope: "All 16 target-model values in the model-card evaluation image and adjacent evaluation settings; comparison columns and non-benchmark illustrations excluded.",
    note: "All 16 target values were visually checked against the official card image (SHA-256 ba59c1b830d83ff6e416b6871d015f961b04aefb54875a4eece98718a71e23f9). Three AFU benchmarks are explicitly internal; their task counts and metric definitions are undisclosed. GDPval-V2-AA and DeepSearchQA image values use separate source-specific views because the image does not state the score unit or metric subtype. The October 19 repository creation and October 22 substantive card update are not conflated with a newly dated API release." });
})();
