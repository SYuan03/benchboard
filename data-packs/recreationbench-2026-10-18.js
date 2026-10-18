(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-18";

  sources.push({ id: "recreationworld-paper-leaderboard", vendorId: "alibaba", publisher: "QwenLM / RecreationWorld authors",
    kind: "benchmark", date: "2026-09-21", tier: "official",
    title: "RecreationBench — Official Paper Leaderboard Data (2026-10-18 snapshot)",
    url: "https://recreation-bench.cc/data/leaderboard.json" });

  const earlier = benchmarks.find((benchmark) => benchmark.id === "recreationbench");
  Object.assign(earlier, { name: "RecreationBench · Qwen release metric (unspecified)",
    description: "Provider-reported RecreationBench scores from Qwen3.8 release sources. Metric and run protocol were not documented well enough to merge with the benchmark-owner paper leaderboard." });

  const metrics = [
    ["prog", "Programmatic assertion score", "%", "higher", "Mean reference-validated programmatic assertion score."],
    ["vlm", "Visual assertion score", "%", "higher", "Mean reference-validated visual assertion score."],
    ["average", "Programmatic + visual mean", "%", "higher", "Unweighted mean of programmatic and visual scores."],
    ["prog_ge90", "Applications with Prog ≥90%", "% apps", "higher", "Share of applications reaching at least 90% programmatic score."],
    ["prog_eq100", "Applications with Prog =100%", "% apps", "higher", "Share of applications with a perfect programmatic score."],
    ["cost", "Estimated API cost per task", "USD/task", "lower", "Estimated mean API cost per task, assuming 90% cache reads."]
  ];
  const platforms = [["overall", "Overall", "250 held-out tasks"], ["linux", "Ubuntu", "nominal 50-task split"],
    ["macos", "macOS", "nominal 50-task split"], ["windows", "Windows", "nominal 50-task split"],
    ["android", "Android", "nominal 50-task split"], ["web", "Web", "nominal 50-task split"]];
  const variants = [{ benchmarkId: "recreationbench", label: "Earlier Qwen release metric · protocol unspecified" }];
  for (const [scope, platform, taskScope] of platforms) {
    for (const [key, label, unit, direction, meaning] of metrics) {
      if (scope !== "overall" && (key === "average" || key === "cost")) continue;
      const benchmarkId = `recreationbench-paper-${scope}-${key}`;
      benchmarks.push({ id: benchmarkId, name: `RecreationBench paper · ${platform} · ${label}`,
        category: "计算机操作", direction,
        description: `${meaning} ${scope === "overall" ? "Scores are macro-averaged within platforms and equally weighted across the five platforms." : "This platform is scored separately from the overall macro average."} ${taskScope} across hybrid GUI exploration, coding, and visual verification.`,
        inputModalities: ["文本", "图像"] });
      variants.push({ benchmarkId, label: `${platform} · ${label}` });
    }
  }
  benchmarkFamilies.push({ id: "recreationbench-paper", name: "RecreationBench", variants });

  // Display values from the maintainer's frozen JSON; each fraction is converted to percent.
  // Row layout: model ID, label, source ID, effort, context, max output, cost,
  // overall [Prog, Visual, Average, ≥90%, =100%], then five platform arrays
  // [Prog, Visual, ≥90%, =100%] in Ubuntu/macOS/Windows/Android/Web order.
  const rows = [
  [
    "gpt-6-astra",
    "GPT-6 Astra",
    "gpt6-astra-gpt-6-astra-max",
    "max",
    "272k",
    "128k",
    115.8,
    [
      58.19,
      57.92,
      58.06,
      17.6,
      2.8
    ],
    [
      54.34,
      52.64,
      14.0,
      2.0
    ],
    [
      53.71,
      42.65,
      20.0,
      6.0
    ],
    [
      61.41,
      57.8,
      22.0,
      4.0
    ],
    [
      62.95,
      64.98,
      26.0,
      2.0
    ],
    [
      58.54,
      71.55,
      6.0,
      0.0
    ]
  ],
  [
    "claude-opus-5",
    "Claude Opus 5",
    "opus5-claude-opus-5-max",
    "max",
    "1m",
    "128k",
    117.17,
    [
      45.99,
      42.34,
      44.16,
      5.53,
      0.8
    ],
    [
      35.83,
      30.75,
      2.0,
      0.0
    ],
    [
      39.8,
      26.44,
      2.0,
      0.0
    ],
    [
      50.33,
      46.28,
      8.0,
      4.0
    ],
    [
      50.56,
      56.74,
      2.0,
      0.0
    ],
    [
      53.44,
      51.47,
      13.64,
      0.0
    ]
  ],
  [
    "gpt-5-6-sol",
    "GPT-5.6 Sol",
    "gpt5-6-sol-gpt-5-6-sol-max",
    "max",
    "272k",
    "128k",
    25.46,
    [
      40.63,
      43.49,
      42.06,
      5.2,
      0.4
    ],
    [
      37.45,
      35.91,
      8.0,
      0.0
    ],
    [
      40.62,
      34.53,
      4.0,
      2.0
    ],
    [
      47.85,
      46.59,
      10.0,
      0.0
    ],
    [
      50.0,
      56.93,
      2.0,
      0.0
    ],
    [
      27.22,
      43.47,
      2.0,
      0.0
    ]
  ],
  [
    "grok-4-6",
    "Grok 4.6",
    "grok4-6-grok-4-6-xhigh",
    "xhigh",
    "500k",
    "128k",
    12.58,
    [
      39.02,
      34.45,
      36.73,
      1.6,
      0.0
    ],
    [
      28.25,
      26.64,
      2.0,
      0.0
    ],
    [
      33.63,
      24.06,
      0.0,
      0.0
    ],
    [
      36.13,
      32.13,
      4.0,
      0.0
    ],
    [
      51.6,
      57.84,
      0.0,
      0.0
    ],
    [
      45.5,
      31.56,
      2.0,
      0.0
    ]
  ],
  [
    "qwen3-8-max-0902",
    "Qwen3.8-Max-0902",
    "qwen3-8-max-0902-qwen3-8-max-0902-xhigh",
    "xhigh",
    "256k",
    "32k",
    38.76,
    [
      35.53,
      34.07,
      34.8,
      2.0,
      0.0
    ],
    [
      29.15,
      28.71,
      2.0,
      0.0
    ],
    [
      41.41,
      29.19,
      2.0,
      0.0
    ],
    [
      31.47,
      26.27,
      4.0,
      0.0
    ],
    [
      41.09,
      48.2,
      2.0,
      0.0
    ],
    [
      34.54,
      37.99,
      0.0,
      0.0
    ]
  ],
  [
    "kimi-k3",
    "Kimi K3",
    "k3-kimi-k3-max",
    "max",
    "1m",
    "128k",
    63.1,
    [
      32.07,
      30.74,
      31.41,
      2.0,
      0.0
    ],
    [
      28.03,
      23.39,
      0.0,
      0.0
    ],
    [
      30.79,
      19.94,
      4.0,
      0.0
    ],
    [
      29.31,
      26.6,
      2.0,
      0.0
    ],
    [
      43.32,
      50.55,
      2.0,
      0.0
    ],
    [
      28.9,
      33.23,
      2.0,
      0.0
    ]
  ],
  [
    "claude-opus-4-8",
    "Claude Opus 4.8",
    "opus48-claude-opus-4-8-max",
    "max",
    "1m",
    "128k",
    69.16,
    [
      32.4,
      29.81,
      31.1,
      1.6,
      0.4
    ],
    [
      24.04,
      18.15,
      2.0,
      2.0
    ],
    [
      33.35,
      25.81,
      0.0,
      0.0
    ],
    [
      35.05,
      31.0,
      4.0,
      0.0
    ],
    [
      33.01,
      40.51,
      0.0,
      0.0
    ],
    [
      36.54,
      33.57,
      2.0,
      0.0
    ]
  ],
  [
    "glm-5-3",
    "GLM-5.3",
    "glm5-3-glm-5-3-max",
    "max",
    "1m",
    "128k",
    70.98,
    [
      26.3,
      22.46,
      24.38,
      2.0,
      0.0
    ],
    [
      15.33,
      10.46,
      0.0,
      0.0
    ],
    [
      27.83,
      20.88,
      0.0,
      0.0
    ],
    [
      23.16,
      16.08,
      2.0,
      0.0
    ],
    [
      20.54,
      22.34,
      2.0,
      0.0
    ],
    [
      44.66,
      42.52,
      6.0,
      0.0
    ]
  ],
  [
    "gemini-3-7-flash",
    "Gemini 3.7 Flash",
    "gemini-3-7-flash-gemini-3-7-flash-high",
    "high",
    "1m",
    "64k",
    null,
    [
      24.91,
      17.34,
      21.12,
      2.4,
      0.0
    ],
    [
      18.15,
      6.92,
      0.0,
      0.0
    ],
    [
      24.26,
      13.04,
      0.0,
      0.0
    ],
    [
      13.29,
      7.54,
      0.0,
      0.0
    ],
    [
      34.46,
      34.05,
      0.0,
      0.0
    ],
    [
      34.38,
      25.14,
      12.0,
      0.0
    ]
  ],
  [
    "qwen3-7-plus",
    "Qwen3.7-Plus",
    "qwen3-7-plus-qwen3-7-plus-enabled",
    "enabled",
    "256k",
    "32k",
    1.23,
    [
      9.18,
      9.12,
      9.15,
      0.0,
      0.0
    ],
    [
      9.28,
      2.23,
      0.0,
      0.0
    ],
    [
      9.58,
      5.92,
      0.0,
      0.0
    ],
    [
      9.06,
      7.09,
      0.0,
      0.0
    ],
    [
      9.23,
      18.82,
      0.0,
      0.0
    ],
    [
      8.74,
      11.56,
      0.0,
      0.0
    ]
  ]
];
  for (const [modelId, label, sourceModelId, effort, context, maxOutput, cost, overall, ...splits] of rows) {
    const reasoning = effort === "enabled" ? "thinking enabled" : `${effort} reasoning effort`;
    const run = `RecreationWorld benchmark-owner paper run · 250 held-out tasks · GUI exploration + coding tools + visual verification · ${reasoning} per site data · ${context} context · ${maxOutput} max output tokens`;
    const note = `Original leaderboard label: ${label}; site model ID: ${sourceModelId}. Exact model API snapshot and run count are not stated.`;
    for (let index = 0; index < platforms.length; index++) {
      const [scope, platform, taskScope] = platforms[index];
      const values = index === 0 ? overall : splits[index - 1];
      const keys = index === 0 ? ["prog", "vlm", "average", "prog_ge90", "prog_eq100"] : ["prog", "vlm", "prog_ge90", "prog_eq100"];
      for (const [metricIndex, key] of keys.entries()) {
        const unit = key === "prog_ge90" || key === "prog_eq100" ? "% apps" : "%";
        observations.push({ id: `o${observations.length + 1}`, sourceIds: ["recreationworld-paper-leaderboard"],
          benchmarkId: `recreationbench-paper-${scope}-${key}`, modelId,
          value: values[metricIndex], unit,
          setting: `${run} · ${platform} · ${taskScope} · ${scope === "overall" ? "equal-weight platform macro average" : "platform-specific score"}`,
          note });
      }
    }
    if (cost !== null) observations.push({ id: `o${observations.length + 1}`, sourceIds: ["recreationworld-paper-leaderboard"],
      benchmarkId: "recreationbench-paper-overall-cost", modelId, value: cost, unit: "USD/task",
      setting: `${run} · estimated mean API cost per task · 90% cache reads assumed`, note });
  }

  sourceAudits.push({ sourceId: "recreationworld-paper-leaderboard", status: "complete", scopeLabel: "论文榜单及五平台分项已核",
    auditedAt: "2026-10-18", expectedObservationCount: 259,
    auditScope: "Official frozen paper leaderboard JSON: ten model labels × five overall performance/coverage measures, four measures on each of five platforms, plus nine published cost estimates (259 cells).",
    benchmarkIds: variants.slice(1).map((variant) => variant.benchmarkId),
    note: "Site JSON SHA-256: 550f44f7b13947bc96b958422c94769d7ee7dcfafe8aa84174c1fe7f05f03abc. The 59 displayed overall values match the official repository README. The paper's Qwen3.8-Max-0902 is separate from the later unversioned Qwen3.8-Max release. Exact candidate API snapshots and run counts are not public; cost assumes 90% cache reads. Earlier Qwen release RecreationBench scores retain their separately specified metric view." });
})();
