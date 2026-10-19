(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-19";

  sources.push({ id: "surveyreview-v1-leaderboard", vendorId: "zai", publisher: "SurveyReview authors / Z.ai",
    kind: "benchmark", date: "2026", tier: "official",
    title: "SurveyReview v1.0 — Official 7-model leaderboard (2026-10-19 audit)",
    url: "https://github.com/zai-org/SurveyReview/blob/f2352dc2eef4a52a6943002f40a4902cc0d84879/README.md" });

  models.push({ id: "surveyreviewer-v1", name: "SurveyReviewer (SurveyReview v1.0 label)",
    vendorId: "zai", vendor: "SurveyReview authors", releaseDate: "2026 or earlier",
    modality: "language", modalityDetail: "Text-based survey evaluation; exact checkpoint and native capabilities are not identified by the leaderboard",
    context: "Not reported", access: "Not reported", aliases: ["SurveyReviewer"],
    sourceId: "surveyreview-v1-leaderboard", scoreStatus: "comparison-only",
    summary: "Published SurveyReview v1.0 leaderboard system; its relationship to the paper's SurveyAlign name is not established by the table." });
  models.push({ id: "qwen3-32b-surveyreview", name: "Qwen3-32B (SurveyReview v1.0 label)",
    vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026 or earlier",
    modality: "language", modalityDetail: "Text-based survey evaluation; exact checkpoint and serving configuration are not identified by the leaderboard",
    context: "Not reported", access: "Not reported", aliases: ["Qwen3-32B"],
    sourceId: "surveyreview-v1-leaderboard", scoreStatus: "comparison-only",
    summary: "Benchmark-owner comparison label; kept separate from checkpoint-specific releases." });
  models.push({ id: "glm-4-7-surveyreview", name: "GLM-4.7 (SurveyReview v1.0 label)",
    vendorId: "zai", vendor: "Z.ai", releaseDate: "2026 or earlier",
    modality: "language", modalityDetail: "Text-based survey evaluation; exact API snapshot is not identified by the leaderboard",
    context: "Not reported", access: "Not reported", aliases: ["GLM-4.7"],
    sourceId: "surveyreview-v1-leaderboard", scoreStatus: "comparison-only",
    summary: "Benchmark-owner comparison label; kept separate from the CL-bench-only GLM-4.7 record because neither board identifies a common snapshot." });

  const metrics = [
    ["has", "Overall · Human-aligned Score", "higher", "Composite alignment of reviewer-score prediction and rationale quality."],
    ["read-mse", "Readability · MSE", "lower", "Mean squared error for readability scores."],
    ["read-mae", "Readability · MAE", "lower", "Mean absolute error for readability scores."],
    ["crit-mse", "Criticalness · MSE", "lower", "Mean squared error for criticalness scores."],
    ["crit-mae", "Criticalness · MAE", "lower", "Mean absolute error for criticalness scores."],
    ["comp-mse", "Comprehensiveness · MSE", "lower", "Mean squared error for comprehensiveness scores."],
    ["comp-mae", "Comprehensiveness · MAE", "lower", "Mean absolute error for comprehensiveness scores."],
    ["stru-mse", "Structure · MSE", "lower", "Mean squared error for structure scores."],
    ["stru-mae", "Structure · MAE", "lower", "Mean absolute error for structure scores."],
    ["average-mse", "Four dimensions · Average MSE", "lower", "Published average mean squared error across the four review dimensions."],
    ["average-mae", "Four dimensions · Average MAE", "lower", "Published average mean absolute error across the four review dimensions."],
    ["rqs", "Overall · Reason Quality Score", "higher", "Semantic consistency of generated rationales with human-review-based reference rationales."]
  ];
  const variants = [];
  for (const [key, name, direction, meaning] of metrics) {
    const benchmarkId = `surveyreview-v1-${key}`;
    benchmarks.push({ id: benchmarkId, name: `SurveyReview v1.0 · ${name}`,
      category: "专业工作", direction,
      description: `${meaning} SurveyReview v1.0 evaluates text-based survey-paper reviews against human peer-review labels; v1.1 cleaned-text results are not included.` });
    variants.push({ benchmarkId, label: name });
  }
  benchmarkFamilies.push({ id: "surveyreview-v1", name: "SurveyReview v1.0", variants });

  // The twelve values in each row follow the official README table exactly:
  // HAS, four dimension MSE/MAE pairs, average MSE/MAE, then RQS.
  const rows = [
    ["surveyreviewer-v1", "SurveyReviewer", 1, 0.74, 1.43, 0.72, 1.52, 0.82, 1.26, 0.56, 1.29, 0.65, 1.38, 0.69, 0.36],
    ["gpt-5-2", "GPT-5.2", 2, 0.68, 2.13, 1.07, 1.97, 0.97, 2.04, 1.08, 2.98, 1.47, 2.28, 1.15, 0.42],
    ["claude-opus-4-5", "Claude-Opus-4.5", 3, 0.68, 2.91, 1.29, 1.88, 0.88, 2.66, 1.23, 3.65, 1.58, 2.77, 1.25, 0.48],
    ["qwen3-32b-surveyreview", "Qwen3-32B", 4, 0.61, 3.05, 1.45, 3.24, 1.51, 3.22, 1.54, 3.35, 1.53, 3.21, 1.51, 0.36],
    ["glm-4-7-surveyreview", "GLM-4.7", 5, 0.60, 3.43, 1.50, 2.58, 1.21, 3.66, 1.57, 4.83, 1.95, 3.62, 1.56, 0.37],
    ["gemini-3-pro", "gemini-3-pro", 6, 0.58, 3.84, 1.52, 2.25, 1.00, 3.91, 1.49, 5.76, 2.11, 3.94, 1.53, 0.29],
    ["deepseek-v3-2", "DeepSeek-v3.2", 7, 0.58, 4.78, 1.88, 2.49, 1.15, 4.59, 1.82, 4.02, 1.76, 3.97, 1.65, 0.37],
  ];
  for (const [modelId, label, rank, ...values] of rows) {
    for (const [index, value] of values.entries()) {
      observations.push({ id: `o${observations.length + 1}`, sourceIds: ["surveyreview-v1-leaderboard"],
        benchmarkId: variants[index].benchmarkId, modelId, value, unit: "score",
        setting: "SurveyReview v1.0 published leaderboard · text survey-paper evaluation · exact candidate snapshot, reasoning effort, prompt, run count, and harness are not specified in the summary table",
        note: `Original leaderboard label: ${label}; published row rank ${rank}. The repository and project page print the same value.` });
    }
  }
  sourceAudits.push({ sourceId: "surveyreview-v1-leaderboard", status: "complete", scopeLabel: "v1.0 主榜已核",
    auditedAt: "2026-10-19", expectedObservationCount: 84,
    auditScope: "Official README v1.0 leaderboard: seven model labels × HAS, eight dimension errors, two average errors, and RQS (84 cells).",
    benchmarkIds: variants.map((variant) => variant.benchmarkId),
    note: "All 84 values independently match the official project page. The public table does not establish exact candidate snapshots, reasoning effort, prompt/harness, run counts, or whether its SurveyReviewer label is the same system called SurveyAlign in the project abstract. v1.1 cleaned-text release has no published leaderboard here and is not merged." });
})();
