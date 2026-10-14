(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-14";

  sources.push(
    { id: "perceptionbench-official-repository", vendorId: "moonshot", publisher: "Moonshot AI / PerceptionBench authors", kind: "benchmark", date: "2026-07-27", tier: "official", title: "PerceptionBench — Official Repository Leaderboard", url: "https://github.com/MoonshotAI/PerceptionBench" },
    { id: "perceptionbench-paper", vendorId: "moonshot", publisher: "Moonshot AI / PerceptionBench authors", kind: "benchmark", date: "2026-07", tier: "official", title: "PerceptionBench: Evaluating Atomic Visual Perception in Multimodal Large Language Models", url: "https://arxiv.org/abs/2607.24957" }
  );

  // The authors name this model Gemma-4-31B without a checkpoint suffix.
  // Keep that label apart from BenchBoard's Gemma 4 31B IT record.
  models.push({
    id: "gemma-4-31b-perceptionbench",
    name: "Gemma 4 31B (PerceptionBench label)",
    vendorId: "google",
    vendor: "Google",
    releaseDate: "2026-07-27 or earlier",
    modality: "vision",
    modalityDetail: "Text and image input evaluated; exact checkpoint suffix not stated by benchmark authors",
    context: "Not reported by benchmark",
    access: "Open-source model evaluated by benchmark authors",
    aliases: ["Gemma-4-31B (PerceptionBench)"],
    sourceId: "perceptionbench-official-repository",
    scoreStatus: "comparison-only",
    summary: "The benchmark names Gemma-4-31B and reports thinking mode, but does not identify an IT checkpoint."
  });
  models.push({
    id: "glm-4-6v",
    name: "GLM-4.6V",
    vendorId: "zai",
    vendor: "Z.ai",
    releaseDate: "2026-07-27 or earlier",
    modality: "vision",
    modalityDetail: "Text and image input evaluated by PerceptionBench",
    context: "Not reported by benchmark",
    access: "Open-source model evaluated by benchmark authors",
    aliases: ["GLM-4.6V"],
    sourceId: "perceptionbench-official-repository",
    scoreStatus: "comparison-only",
    summary: "Open-source visual-language comparison model in the PerceptionBench authors' main table."
  });

  const metrics = [
    ["overall", "Overall accuracy", "All 3,000 questions"],
    ["vrel", "Visual relation accuracy", "Visual relation"],
    ["count", "Counting accuracy", "Counting"],
    ["attr", "Attribute accuracy", "Attribute"],
    ["depth", "Depth and 3D perception accuracy", "Depth and 3D perception"],
    ["loc", "Localization accuracy", "Localization"],
    ["comp", "Comparison accuracy", "Comparison"],
    ["fgr", "Fine-grained recognition accuracy", "Fine-grained recognition"],
    ["ctx", "Contextual integration accuracy", "Contextual integration"],
    ["ocr", "OCR accuracy", "Optical character recognition"],
    ["hallu", "Perception-related hallucination accuracy", "Perception-related hallucination"]
  ];
  const variants = [];
  for (const [key, label, scope] of metrics) {
    const benchmarkId = key === "overall" ? "perceptionbench" : `perceptionbench-${key}`;
    if (key === "overall") {
      const existing = benchmarks.find((benchmark) => benchmark.id === benchmarkId);
      existing.name = "PerceptionBench · Overall accuracy";
      existing.description = "Accuracy across 3,000 verified, open-ended visual perception questions. Benchmark-owner run; GPT-oss-120B judge. Category scores have separate views.";
      existing.inputModalities = ["文本", "图像"];
    } else {
      benchmarks.push({
        id: benchmarkId,
        name: `PerceptionBench · ${label}`,
        category: "多模态",
        direction: "higher",
        description: `${scope} subset accuracy within the official 3,000-question PerceptionBench; GPT-oss-120B judge. This is not the overall score.`,
        inputModalities: ["文本", "图像"]
      });
    }
    variants.push({ benchmarkId, label: key === "overall" ? "Overall · 3,000 questions" : scope });
  }
  benchmarkFamilies.push({ id: "perceptionbench", name: "PerceptionBench", variants });

  // Main-table columns: overall, visual relation, counting, attribute, depth,
  // localization, comparison, fine-grained recognition, context, OCR, hallucination.
  // Values match both the official repository README and Table 1 of the paper.
  const rows = [
    ["glm-5v-turbo",39.6,41.2,40.0,41.2,41.2,43.9,45.2,36.6,32.9,43.5,28.0],
    ["grok-4-5",41.0,47.0,35.2,39.4,41.2,39.7,43.7,36.2,39.6,43.9,44.7],
    ["claude-opus-4-8",47.2,51.4,44.2,49.4,40.6,58.8,48.4,40.7,44.7,54.1,38.7],
    ["qwen3-7-plus",51.1,59.1,53.3,55.8,48.5,52.7,55.9,46.8,52.2,54.5,29.5],
    ["gemini-3-5-flash",52.0,53.6,43.6,54.5,49.7,50.6,54.8,51.7,53.3,59.6,50.6],
    ["seed2-1-pro",55.0,57.6,51.2,58.2,43.6,50.0,59.5,56.6,60.4,66.7,49.8],
    ["gpt-5-5",55.8,61.9,55.8,60.9,48.8,65.8,65.6,47.2,58.0,56.5,34.7],
    ["gemini-3-1-pro",56.2,58.8,56.9,61.8,50.0,52.7,61.7,54.8,61.2,64.3,40.6],
    ["claude-fable-5",57.2,58.5,52.9,60.9,51.5,70.4,56.1,51.6,59.8,64.3,45.0],
    ["gpt-5-6-sol",59.7,69.7,62.4,62.1,55.5,76.7,67.0,55.9,60.0,54.9,26.9],
    ["glm-4-6v",32.5,35.2,31.8,35.2,29.1,30.6,34.8,29.3,33.7,39.2,26.9],
    ["minimax-m3",33.1,40.0,30.3,34.6,36.7,33.3,31.2,26.6,31.0,35.7,29.9],
    ["gemma-4-31b-perceptionbench",40.7,42.7,33.9,40.3,39.1,44.9,43.7,39.0,45.9,46.7,32.1],
    ["kimi-k2-6",42.6,50.9,45.2,43.6,42.4,45.2,39.1,34.5,40.4,40.8,41.0],
    ["qwen3-5-397b-a17b",47.5,55.2,49.1,53.0,44.6,46.7,49.8,44.8,50.2,52.9,26.9],
    ["kimi-k3",58.5,68.2,59.7,59.4,52.4,70.3,59.1,55.9,53.3,61.2,41.7]
  ];
  const efforts = {
    "gpt-5-5": "xhigh reasoning",
    "gpt-5-6-sol": "max reasoning",
    "claude-fable-5": "max reasoning",
    "claude-opus-4-8": "max reasoning",
    "kimi-k3": "max reasoning",
    "gemini-3-5-flash": "high reasoning",
    "gemini-3-1-pro": "high reasoning",
    "seed2-1-pro": "high reasoning",
    "gemma-4-31b-perceptionbench": "thinking mode enabled"
  };
  for (const [modelId, ...values] of rows) {
    for (const [index, value] of values.entries()) {
      const [key] = metrics[index];
      const benchmarkId = key === "overall" ? "perceptionbench" : `perceptionbench-${key}`;
      const setting = [
        "benchmark-owner evaluation",
        "3,000 verified questions total",
        "open-ended short answers",
        "unified prompts",
        efforts[modelId] || "highest available reasoning budget; level not specified",
        key === "overall" && ["gpt-5-6-sol", "gemini-3-5-flash", "kimi-k3"].includes(modelId)
          ? "four-run mean per paper Table 2"
          : "main-table result; run count not specified",
        "GPT-oss-120B judge"
      ].join(" · ");
      observations.push({
        id: `o${observations.length + 1}`,
        sourceIds: ["perceptionbench-official-repository", "perceptionbench-paper"],
        benchmarkId,
        modelId,
        value,
        unit: "%",
        setting,
        note: modelId === "claude-fable-5"
          ? "The paper says Claude Opus 4.8 answered queries refused by Claude Fable 5's safety filter."
          : modelId === "gemma-4-31b-perceptionbench"
            ? "The benchmark names Gemma-4-31B without a checkpoint suffix."
            : ""
      });
    }
  }

  sourceAudits.push(
    { sourceId: "perceptionbench-official-repository", status: "complete", scopeLabel: "主榜 16 模型与 11 指标已核", auditedAt: "2026-10-14", auditScope: "Official repository README leaderboard: 16 model labels × overall accuracy and 10 separate atomic visual-perception categories.", expectedObservationCount: 176, benchmarkIds: variants.map(({ benchmarkId }) => benchmarkId), note: "All 176 cells match the authors' paper Table 1. The repository's evaluation instructions, 3,000-question scope, unified prompts, and GPT-oss-120B judge were checked. Provider-reported PerceptionBench runs remain separate." },
    { sourceId: "perceptionbench-paper", status: "partial", scopeLabel: "论文主表 176 格已核", auditedAt: "2026-10-14", auditScope: "Paper Table 1 only: the same 16 × 11 main results as the official repository leaderboard.", expectedObservationCount: 176, benchmarkIds: variants.map(({ benchmarkId }) => benchmarkId), note: "Table 2 contains separate run-level consistency diagnostics for three models and is outside this import scope. The paper supplies reasoning settings and the Claude Fable 5 fallback protocol." }
  );
})();
