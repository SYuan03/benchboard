(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-16";
  data.meta.scope = "领先通用、多模态与 Agent 模型公开成绩";

  sources.push({ id: "blenderworld-leaderboard", vendorId: "alibaba",
    publisher: "BlenderWorld authors / Alibaba Token Hub", kind: "benchmark", date: "2026-10",
    tier: "official", title: "BlenderWorld — Official Leaderboard and Published Site Data",
    url: "https://blenderworld.github.io/#leaderboard" });

  const seed = models.find((model) => model.id === "seed2-1-pro-0915");
  seed.modality = "vision";
  seed.modalityDetail = "Text, image, and video-reference BlenderWorld tasks evaluated for the 0915 snapshot; native input handling is not separately specified by the leaderboard";
  seed.summary = "The 0915 snapshot is identified by ExplorationBench and BlenderWorld; both sets of results stay separate from the earlier Seed2.1 Pro release.";

  const primary = [
    ["overall", "Overall score", "points / 100", "223 tasks", ["文本", "图像", "视频"], "Mean task score; each task combines weighted binary rubric and visual-quality dimensions 50:50."],
    ["text", "Text-only overall score", "points / 100", "78 text-only tasks", ["文本"], "Mean overall score for tasks with text briefs and no image or video reference."],
    ["mm", "Image/video-input overall score", "points / 100", "145 image or video reference tasks", ["文本", "图像", "视频"], "Mean overall score for 130 image-reference and 15 video-reference tasks."],
    ["rubric", "Weighted rubric score", "points / 100", "223 tasks", ["文本", "图像", "视频"], "Weighted pass rate over task-specific binary criteria; 2,651 criteria across the benchmark."],
    ["dimension", "Visual-quality dimension score", "points / 100", "223 tasks", ["文本", "图像", "视频"], "Eight visual quality ratings on a 0-100 scale, separate from task-specific rubric criteria."],
    ["fullpass", "Fully satisfied rubric", "%", "223 tasks", ["文本", "图像", "视频"], "Percent of tasks for which every binary rubric criterion was satisfied."]
  ];
  const categories = [["architecture-interiors","Architecture & Interiors",72],["art-animation","Art & Animation",30],["products-manufacturing","Products & Manufacturing",28],["characters-animals","Characters & Animals",25],["nature-landscapes","Nature & Landscapes",21],["rendering-simulation","Rendering & Simulation",17],["vehicles-machinery","Vehicles & Machinery",11],["procedural-game-assets","Procedural & Game Assets",10],["science-visualization","Science & Visualization",9]];
  const variants = [];
  for (const [key, label, unit, scope, inputModalities, description] of primary) {
    const benchmarkId = `blenderworld-${key}`;
    benchmarks.push({ id: benchmarkId, name: `BlenderWorld · ${label}`, category: "多模态",
      direction: "higher", description: `${description} ${scope}; GPT-5.6 Terra main judge.`, inputModalities });
    variants.push({ benchmarkId, label: `${label} · ${scope}` });
  }
  for (const [key, label, count] of categories) {
    const benchmarkId = `blenderworld-${key}`;
    benchmarks.push({ id: benchmarkId, name: `BlenderWorld · ${label}`, category: "多模态",
      direction: "higher", description: `Mean overall score across ${count} ${label} tasks; image, video, and text input modes are pooled. GPT-5.6 Terra main judge.`,
      inputModalities: ["文本", "图像", "视频"] });
    variants.push({ benchmarkId, label: `${label} · ${count} tasks` });
  }
  benchmarkFamilies.push({ id: "blenderworld", name: "BlenderWorld", variants });

  // Official leaderboard data/site-data.js: 13 model labels, six main-table metrics, nine category means.
  // Category means retain the unrounded numbers published by the site; the UI shows one decimal.
  const rows = [
    ["gpt-6-astra","GPT-6-Astra",79.9,78.6,80.7,87.3,72.6,42.2,81.3084,76.7932,83.8854,78.6973,78.401,71.1155,80.8875,86.8166,81.8893],
    ["claude-opus-5","Opus-5",73,74.8,72.1,80.9,65.1,25.6,77.1793,68.999,76.2438,62.0302,67.3766,74.5213,74.9242,79.4517,74.6936],
    ["gpt-5-6-sol","GPT-5.6-Sol",67.7,71.7,65.5,74.7,60.7,15.7,70.51,59.19,72.4972,58.6038,63.6025,68.737,71.7756,77.7513,74.6217],
    ["deepseek-v4-1-flash","DeepSeek-V4.1-Flash",65.7,66,65.5,72,59.4,11.7,69.4109,60.9833,69.0769,59.0143,54.9288,66.4862,69.0594,71.5275,72.2858],
    ["qwen3-8-max","Qwen3.8-Max",60.6,59.6,61.1,65.9,55.3,10.3,63.0924,55.4251,66.3031,55.6737,58.6494,59.8768,59.9112,60.1537,61.2548],
    ["glm-5-3-flash","GLM-5.3-Flash",59.7,63.1,57.8,64.8,54.4,6.28,62.3131,51.3396,68.6888,52.6987,50.3195,56.6776,62.1877,71.1425,69.3534],
    ["grok-4-6","Grok-4.6",57,60,55.4,61.4,52.7,6.73,61.1876,50.1601,62.1131,48.6934,47.1224,56.4877,54.8402,68.6481,68.1795],
    ["claude-opus-4-8","Opus-4.8",57,58.6,56.1,60.2,53.7,5.38,59.9333,50.946,64.2927,46.1531,51.7623,59.7408,56.4921,58.8699,66.143],
    ["seed2-1-pro-0915","Seed2.1pro-0915",51.3,54.7,49.5,54.9,47.7,3.59,54.2629,46.531,61.0091,42.7577,39.3201,51.5483,48.6281,61.0533,57.1228],
    ["qwen3-8-27b","Qwen3.8-27B",47.7,46.1,48.6,50,45.5,1.35,50.2455,46.246,48.8545,44.887,41.3107,40.9538,49.0874,56.4377,53.7538],
    ["kimi-k3","Kimi-K3",46.5,41.3,49.4,47.9,45.2,1.79,48.0153,54.8818,48.6133,48.0881,34.7952,31.0687,50.9464,56.0707,36.8425],
    ["gemini-3-8-flash","Gemini-3.8-Flash",34.2,35.9,33.2,29.8,38.5,0.45,38.3356,27.6188,37.1251,29.1052,24.948,37.4406,32.8988,40.3148,37.4986],
    ["minimax-m3","MiniMax-M3",31.8,34.1,30.6,28.9,34.7,0.45,37.0222,24.8877,36.4215,22.8634,29.2158,27.2411,31.8633,30.3176,40.3931],
  ];
  for (const [modelId, label, ...values] of rows) {
    for (const [index, value] of values.entries()) {
      const key = index < primary.length ? primary[index][0] : categories[index - primary.length][0];
      const scope = index < primary.length ? primary[index][3] : `${categories[index - primary.length][2]} category tasks`;
      const setting = ["benchmark-owner paper run", scope, "Blender 4.2.10 / Blender MCP paper setup",
        "GPT-5.6 Terra main judge", "generation-agent harness and reasoning effort not stated on public leaderboard"].join(" · ");
      observations.push({ id: `o${observations.length + 1}`, sourceIds: ["blenderworld-leaderboard"],
        benchmarkId: `blenderworld-${key}`, modelId, value,
        unit: index === 5 ? "%" : "points / 100", setting,
        note: `Original leaderboard label: ${label}. ${index >= primary.length ? "Unrounded category mean from the official site data." : "Main-table value as displayed."}` });
    }
  }
  sourceAudits.push({ sourceId: "blenderworld-leaderboard", status: "complete", scopeLabel: "主表与九类分项已核",
    auditedAt: "2026-10-16", auditScope: "Official completion leaderboard: 13 model labels × six main-table metrics and nine category means (195 cells).",
    expectedObservationCount: 195, benchmarkIds: variants.map((variant) => variant.benchmarkId),
    note: "All 78 main-table values match the visible official page and its site data. All 117 category means come from the official site data before the UI rounds them to one decimal. The separate rollout-resource table, examples, and judge-alignment study are outside this score scope. The public page does not state candidate reasoning effort or an exact generation-agent harness." });
})();
