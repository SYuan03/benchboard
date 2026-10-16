(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-16";

  sources.push({
    id: "ecommercebench-repository", vendorId: "alibaba", publisher: "E-Commerce Bench authors / Alibaba Qwen",
    kind: "benchmark", date: "2026-09-13", tier: "official",
    title: "E-Commerce Bench — Official Repository Table 1 (2026-09-13 revision)",
    url: "https://github.com/QwenLM/E-CommerceBench/blob/2c2fdedd382c0f2d507b6338ab80a5f7e0ddeb4c/README.md"
  });

  models.push(
    { id: "qwen3-8-max-preview-ecbench", name: "Qwen3.8 Max Preview (E-Commerce Bench)",
      vendorId: "alibaba", vendor: "Alibaba Qwen", releaseDate: "2026-08-28 or earlier",
      modality: "language", modalityDetail: "Text and tool tasks evaluated; exact Preview checkpoint not identified",
      context: "Not reported by benchmark", access: "Open-weight comparison label in the benchmark table",
      aliases: ["Qwen3.8-Max-Preview"], sourceId: "ecommercebench-repository", scoreStatus: "comparison-only",
      summary: "Kept apart from the later Qwen3.8-Max result and the identified 0902 snapshot." },
    { id: "deepseek-v4-pro-preview-ecbench", name: "DeepSeek V4 Pro Preview (E-Commerce Bench)",
      vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "2026-08-28 or earlier",
      modality: "language", modalityDetail: "Text and tool tasks evaluated; exact Preview snapshot not identified",
      context: "Not reported by benchmark", access: "Benchmark-author evaluation through a model gateway",
      aliases: ["DeepSeek-V4-Pro-Preview"], sourceId: "ecommercebench-repository", scoreStatus: "comparison-only",
      summary: "The Preview label is not assigned to the dated V4 Pro 0813 checkpoint." }
  );

  const metrics = [
    ["assets", "Mean final assets", "¥k", "higher", "End-of-year total assets in thousands of yuan, averaged across five 365-day episodes. Each episode begins with ¥100,000."],
    ["cse", "CSE+ · honest-deal negotiation", "ratio", "higher", "Share of the available bargaining range captured on honest supplier deals."],
    ["badspend", "BadSpend · fraudulent-supplier spend", "%", "lower", "Percent of procurement cash paid to fraudulent suppliers."],
    ["drawdown", "Drawdown / peak assets", "ratio", "lower", "Drawdown relative to peak assets, as reported in the authors' Table 1."],
    ["efficiency", "Yuan per tool call", "¥/tool call", "higher", "Table 1's efficiency measure; values may be negative."],
    ["returns", "Controllable return", "pp", "lower", "Table 1's controllable-return measure in percentage points; the authors mark lower as better."],
    ["anchor", "AnchorRatio · repeat-order pricing", "ratio", "lower", "Repeat-order prices above the agent's own best price with a supplier, relative to a random ordering of those prices; below one indicates improvement."]
  ];
  for (const [key, label, unit, direction, description] of metrics) {
    benchmarks.push({ id: `ecommercebench-${key}`, name: `E-Commerce Bench · ${label}`,
      category: "Agent / 工作", direction, description });
  }
  benchmarkFamilies.push({ id: "ecommercebench", name: "E-Commerce Bench",
    variants: metrics.map(([key, label]) => ({ benchmarkId: `ecommercebench-${key}`, label })) });

  // Official README Table 1: model label, effort, seven scored columns, assets std, bankrupt runs.
  const rows = [
    ["gpt-5-6-sol","GPT-5.6 Sol (max)","max",1431.0,0.672,18.48,0.278,363.0,4.46,1.217,"314","0/5"],
    ["claude-fable-5","Fable5 (max)","max",805.0,0.772,3.46,0.141,479.0,0.22,1.573,"188","0/5"],
    ["gpt-5-5","GPT-5.5",null,702.0,0.7,16.59,0.591,192.0,0.9,1.043,"616†","2/5"],
    ["claude-opus-4-8","Claude Opus 4.8 (max)","max",498.0,0.662,5.41,0.13,266.0,0.2,1.309,"231","0/5"],
    ["qwen3-8-max","Qwen3.8-Max",null,472.0,0.66,18.37,0.172,246.0,2.88,1.522,"165","0/5"],
    ["claude-opus-4-7","Claude Opus 4.7 (max)","max",259.0,0.811,0.12,0.189,156.0,1.75,1.421,"111","0/5"],
    ["claude-opus-4-6","Claude Opus 4.6 (max)","max",258.0,0.649,14.98,0.587,129.0,0.76,1.268,"266","2/5"],
    ["gemini-3-5-flash","Gemini 3.5 Flash",null,190.0,0.777,2.13,0.45,36.0,0.38,0.918,"79","0/5"],
    ["gemini-3-1-pro","Gemini 3.1 Pro",null,130.0,0.66,12.58,0.688,19.0,2.03,1.376,"130","2/5"],
    ["qwen3-8-max-preview-ecbench","Qwen3.8-Max-Preview",null,416.0,0.713,6.13,0.242,173.0,0.38,0.834,"111","0/5"],
    ["glm-5-3","GLM-5.3 (max)","max",391.0,0.668,16.71,0.78,193.0,0.34,1.493,"167","0/5"],
    ["glm-5-2","GLM 5.2 (high)","high",301.0,0.693,1.99,0.127,137.0,0.59,1.434,"124","0/5"],
    ["kimi-k3","Kimi K3",null,265.0,0.632,5.87,0.247,123.0,2.01,1.507,"110","0/5"],
    ["glm-5-3-flash","GLM-5.3-Flash (max)","max",258.0,0.729,27.92,0.533,136.0,2.81,1.46,"88","0/5"],
    ["glm-5-1","GLM 5.1",null,226.0,0.662,6.49,0.231,94.0,0.09,1.557,"192","0/5"],
    ["deepseek-v4-pro-preview-ecbench","DeepSeek-V4-Pro-Preview (max)","max",190.0,0.654,8.99,0.166,68.0,1.54,1.235,"100","0/5"],
    ["qwen3-7-max","Qwen3.7-Max",null,165.0,0.616,9.85,0.433,59.0,-0.05,1.433,"134","0/5"],
    ["glm-5-2","GLM 5.2 (max)","max",115.0,0.632,19.68,0.36,10.0,2.24,1.362,"71","0/5"],
    ["kimi-k2-6","Kimi K2.6",null,70.0,0.596,17.22,0.377,-27.0,0.42,1.548,"14","0/5"],
    ["qwen3-6-plus","Qwen3.6-Plus",null,47.0,0.625,10.68,0.583,-40.0,3.03,1.333,"28","0/5"],
    ["qwen3-5-plus","Qwen3.5-Plus",null,1.1,0.625,20.11,0.979,-92.0,5.88,1.86,"11","4/5"],
  ];
  for (const [modelId, label, effort, ...rest] of rows) {
    const values = rest.slice(0, 7);
    const [assetsStd, bankrupt] = rest.slice(7);
    const setting = [
      "benchmark-owner 365-day merchant simulation", "five independent episodes", "up to four stores",
      "initial balance ¥100,000", effort ? `${effort} reasoning` : "thinking enabled where supported; effort not specified",
      "exact API snapshot not stated for unversioned labels"
    ].join(" · ");
    for (const [index, value] of values.entries()) {
      const [key, , unit] = metrics[index];
      const note = [
        `Original table label: ${label}.`,
        `Bankrupt episodes: ${bankrupt}.`,
        key === "assets" ? `Reported assets std: ${assetsStd} ¥k.` : "",
        label === "GPT-5.5" && key === "assets" ? "The † spread is a population estimate; sample estimate is ¥689k." : "",
        label === "GPT-5.5" && key === "anchor" ? "The ‡ AnchorRatio averages three non-bankrupt episodes." : "",
        ["Qwen3.8-Max", "GLM-5.3 (max)", "GLM-5.3-Flash (max)"].includes(label) ? "Post-publication evaluation under the same protocol." : ""
      ].filter(Boolean).join(" ");
      observations.push({ id: `o${observations.length + 1}`, sourceIds: ["ecommercebench-repository"],
        benchmarkId: `ecommercebench-${key}`, modelId, value, unit, setting, note });
    }
  }
  sourceAudits.push({ sourceId: "ecommercebench-repository", status: "partial", scopeLabel: "主表七项评分指标已核",
    auditedAt: "2026-10-16", auditScope: "Official README Table 1: seven scored columns for all 21 model-effort rows (147 cells).",
    expectedObservationCount: 147, benchmarkIds: metrics.map(([key]) => `ecommercebench-${key}`),
    note: "The original 18 paper rows and three post-publication rows share the stated five-episode protocol. Assets std, tool-call and turn counts, and bankrupt-run counts are diagnostics excluded from ranked views; std and bankrupt counts are retained in notes. Qwen3.8 Max Preview and DeepSeek V4 Pro Preview stay distinct from other versions." });
})();
