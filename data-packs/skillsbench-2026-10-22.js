// Vals AI public results, fetched 2026-10-22. Exact JSON precision is retained.
// Original payload: https://www.vals.ai/_astro/benchmark_view_skillsbench.BE2TXB-M.json
// Each row is [BenchBoard model ID, evaluator system ID, with Skills, no Skills].
(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-22";
  const sourceId = "vals-skillsbench-2026-09-27";
  sources.push({ id: sourceId, vendorId: "vals", publisher: "Vals AI",
    date: "2026-09-27", tier: "official", kind: "evaluator",
    title: "SkillsBench — Vals AI paired evaluation (35 model–harness configurations)",
    url: "https://www.vals.ai/benchmarks/skillsbench" });

  const metadataSources = [
    ["inkling-hf", "thinkingmachines", "Thinking Machines Lab", "Inkling — Official Model Card", "https://huggingface.co/thinkingmachines/Inkling"],
    ["inkling-small-hf", "thinkingmachines", "Thinking Machines Lab", "Inkling-Small — Official Model Card", "https://huggingface.co/thinkingmachines/Inkling-Small"],
    ["ling30-flash-hf", "inclusionai", "Ant inclusionAI", "Ling-3.0-flash — Official Model Card", "https://huggingface.co/inclusionAI/Ling-3.0-flash"],
    ["mercury25-release", "inception", "Inception", "Introducing Mercury 2.5", "https://www.inceptionlabs.ai/blog/introducing-mercury-2-5"]
  ];
  for (const [id, vendorId, publisher, title, url] of metadataSources) {
    sources.push({ id, vendorId, publisher, title, url, date: "2026", tier: "official", kind: "model-card" });
    sourceAudits.push({ sourceId: id, status: "partial", auditedAt: "2026-10-22",
      scopeLabel: "模型信息已核",
      note: "Model identity and input modalities checked for the SkillsBench evaluation mapping. The model provider's full benchmark table is outside this focused audit." });
  }
  const addedModels = [
    { id: "inkling", name: "Inkling", vendorId: "thinkingmachines", vendor: "Thinking Machines",
      modality: "omni", modalityDetail: "文本、图像、音频输入 → 文本；官方模型卡明确列出三种输入",
      context: "本次模型卡核对未确认", access: "开放权重 / API", aliases: ["thinkingmachines/inkling"], sourceId: "inkling-hf" },
    { id: "inkling-small", name: "Inkling-Small", vendorId: "thinkingmachines", vendor: "Thinking Machines",
      modality: "omni", modalityDetail: "文本、图像、音频输入 → 文本；官方模型卡明确列出三种输入",
      context: "本次模型卡核对未确认", access: "开放权重 / API", aliases: ["thinkingmachines/inkling-small"], sourceId: "inkling-small-hf" },
    { id: "ling-3-0-flash", name: "Ling-3.0-Flash", vendorId: "inclusionai", vendor: "Ant inclusionAI",
      modality: "language", modalityDetail: "文本输入 → 文本 / 工具调用；官方卡为 text-generation",
      context: "256K", access: "开放权重 / API", aliases: ["ant/ling-3.0-flash-2607", "Ling 3.0 Flash"], sourceId: "ling30-flash-hf" },
    { id: "mercury-2-5", name: "Mercury 2.5", vendorId: "inception", vendor: "Inception",
      modality: "language", modalityDetail: "扩散语言模型；文本输入 → 文本 / JSON / 工具调用",
      context: "260K", access: "闭源 API", aliases: ["inception/mercury-2.5"], sourceId: "mercury25-release" }
  ];
  for (const model of addedModels) {
    models.push({ ...model, releaseDate: "2026", scoreStatus: "comparison-only",
      referenceSourceIds: [sourceId],
      summary: "SkillsBench 评测配置已核；厂商完整成绩表尚未完成审计。" });
  }

  const conditionViews = [
    ["with-skills", "With Skills"],
    ["without-skills", "Without Skills"]
  ];
  const metricViews = [
    ["accuracy", "Accuracy", "%", "higher"],
    ["cost", "Mean cost / test", "USD/test", "lower"],
    ["duration", "Mean duration / test", "s/test", "lower"]
  ];
  const family = benchmarkFamilies.find((item) => item.id === "skillsbench-1-1-family");
  for (const [condition, conditionLabel] of conditionViews) {
    for (const [metric, metricLabel, , direction] of metricViews) {
      const id = `skillsbench-vals-${condition}-${metric}`;
      benchmarks.push({ id, name: `SkillsBench · Vals · ${conditionLabel} · ${metricLabel}`,
        category: "Agent / 工作", direction,
        description: `Vals AI 2026-09-27 paired evaluation; evaluator metadata version 1, 87 tasks shown in trace charts, three trials per condition. ${metricLabel}; exact task-source commit is not disclosed, so this is separate from BenchFlow v1.1.` });
      family.variants.push({ benchmarkId: id, label: `Vals 09-27 · ${conditionLabel} · ${metricLabel}` });
    }
  }

  const rows = [
    ["deepseek-v4-1-flash","deepseek/deepseek-v4.1-flash",{"accuracy":69.802,"latency":223.451,"stderr":3.879,"cost_per_test":0.085117,"max_output_tokens":384000,"reasoning_effort":"high","provider":"DeepSeek","harness":"OpenHands"},{"accuracy":61.658,"latency":249.381,"stderr":3.871,"cost_per_test":0.092261,"max_output_tokens":384000,"reasoning_effort":"high","provider":"DeepSeek","harness":"OpenHands"}],
    ["grok-4-5","grok/grok-4.5",{"accuracy":66.034,"latency":135.652,"stderr":4.596,"cost_per_test":0.578155,"temperature":0.7,"top_p":0.95,"reasoning_effort":"high","provider":"SpaceXAI","harness":"OpenHands"},{"accuracy":48.808,"latency":164.363,"stderr":4.586,"cost_per_test":0.624629,"temperature":0.7,"top_p":0.95,"reasoning_effort":"high","provider":"SpaceXAI","harness":"OpenHands"}],
    ["gemini-3-7-flash","google/gemini-3.7-flash",{"accuracy":65.891,"latency":185.651,"stderr":4.554,"cost_per_test":1.799454,"temperature":1,"max_output_tokens":65536,"reasoning_effort":"high","provider":"Google","harness":"OpenHands"},{"accuracy":44.887,"latency":190.076,"stderr":4.836,"cost_per_test":1.850461,"temperature":1,"max_output_tokens":65536,"reasoning_effort":"high","provider":"Google","harness":"OpenHands"}],
    ["gpt-5-5","openai/gpt-5.5-codex",{"accuracy":62.555,"latency":279.51,"stderr":4.412,"cost_per_test":1.572689,"provider":"OpenAI","harness":"Codex"},{"accuracy":48.693,"latency":273.347,"stderr":4.692,"cost_per_test":1.459473,"provider":"OpenAI","harness":"Codex"}],
    ["gpt-5-5","openai/gpt-5.5",{"accuracy":62.209,"latency":414.615,"stderr":4.523,"cost_per_test":2.54346,"max_output_tokens":128000,"reasoning_effort":"xhigh","provider":"OpenAI","harness":"OpenHands"},{"accuracy":49.875,"latency":399.041,"stderr":4.761,"cost_per_test":2.535292,"max_output_tokens":128000,"reasoning_effort":"xhigh","provider":"OpenAI","harness":"OpenHands"}],
    ["claude-fable-5-1","anthropic/claude-fable-5-1",{"accuracy":61.552,"latency":661.978,"stderr":4.76,"cost_per_test":4.516559,"temperature":1,"max_output_tokens":128000,"compute_effort":"max","provider":"Anthropic","harness":"OpenHands"},{"accuracy":44.828,"latency":701.094,"stderr":4.622,"cost_per_test":4.54135,"temperature":1,"max_output_tokens":128000,"compute_effort":"max","provider":"Anthropic","harness":"OpenHands"}],
    ["gpt-5-6-luna","openai/gpt-5.6-luna",{"accuracy":60.447,"latency":320.466,"stderr":4.75,"cost_per_test":0.206587,"max_output_tokens":128000,"reasoning_effort":"max","provider":"OpenAI","harness":"OpenHands"},{"accuracy":45.189,"latency":346.964,"stderr":4.695,"cost_per_test":0.250725,"max_output_tokens":128000,"reasoning_effort":"max","provider":"OpenAI","harness":"OpenHands"}],
    ["claude-opus-5","anthropic/claude-opus-5",{"accuracy":60.441,"latency":505.008,"stderr":4.578,"cost_per_test":2.508594,"temperature":1,"max_output_tokens":128000,"compute_effort":"max","provider":"Anthropic","harness":"OpenHands"},{"accuracy":45.191,"latency":568.579,"stderr":4.661,"cost_per_test":2.81595,"temperature":1,"max_output_tokens":128000,"compute_effort":"max","provider":"Anthropic","harness":"OpenHands"}],
    ["claude-opus-4-8","anthropic/claude-opus-4-8",{"accuracy":59.227,"latency":930.403,"stderr":4.5,"cost_per_test":4.766601,"temperature":1,"max_output_tokens":128000,"compute_effort":"max","provider":"Anthropic","harness":"OpenHands"},{"accuracy":43.674,"latency":1012.31,"stderr":4.816,"cost_per_test":5.343307,"temperature":1,"max_output_tokens":128000,"compute_effort":"max","provider":"Anthropic","harness":"OpenHands"}],
    ["muse-spark-1-1","meta/muse_spark_1_1",{"accuracy":59.189,"latency":376.268,"stderr":4.444,"cost_per_test":0.449432,"max_output_tokens":256000,"reasoning_effort":"xhigh","provider":"Meta","harness":"OpenHands"},{"accuracy":46.266,"latency":364.452,"stderr":4.589,"cost_per_test":0.462228,"max_output_tokens":256000,"reasoning_effort":"xhigh","provider":"Meta","harness":"OpenHands"}],
    ["gpt-5-6-terra","openai/gpt-5.6-terra",{"accuracy":58.895,"latency":415.068,"stderr":4.472,"cost_per_test":1.75247,"max_output_tokens":128000,"reasoning_effort":"max","provider":"OpenAI","harness":"OpenHands"},{"accuracy":48.842,"latency":448.406,"stderr":4.572,"cost_per_test":1.932564,"max_output_tokens":128000,"reasoning_effort":"max","provider":"OpenAI","harness":"OpenHands"}],
    ["gemini-3-8-flash","google/gemini-3.8-flash",{"accuracy":57.985,"latency":235.201,"stderr":4.422,"cost_per_test":2.336944,"temperature":1,"max_output_tokens":65536,"reasoning_effort":"high","provider":"Google","harness":"OpenHands"},{"accuracy":41.046,"latency":276.145,"stderr":4.516,"cost_per_test":2.612455,"temperature":1,"max_output_tokens":65536,"reasoning_effort":"high","provider":"Google","harness":"OpenHands"}],
    ["grok-4-6","grok/grok-4.6",{"accuracy":55.766,"latency":808.117,"stderr":4.844,"cost_per_test":0.921477,"temperature":0.7,"top_p":0.95,"reasoning_effort":"high","provider":"SpaceXAI","harness":"OpenHands"},{"accuracy":38.167,"latency":923.375,"stderr":4.478,"cost_per_test":1.043785,"temperature":0.7,"top_p":0.95,"reasoning_effort":"high","provider":"SpaceXAI","harness":"OpenHands"}],
    ["qwen3-7-plus","alibaba/qwen3.7-plus",{"accuracy":54.296,"latency":724.46,"stderr":4.333,"cost_per_test":0.137331,"temperature":0.7,"max_output_tokens":65536,"provider":"Alibaba","harness":"OpenHands"},{"accuracy":31.145,"latency":811.189,"stderr":4.301,"cost_per_test":0.147401,"temperature":0.7,"max_output_tokens":65536,"provider":"Alibaba","harness":"OpenHands"}],
    ["gpt-5-6-sol","openai/gpt-5.6-sol",{"accuracy":54.1,"latency":787.486,"stderr":4.73,"cost_per_test":4.13999,"max_output_tokens":128000,"reasoning_effort":"max","provider":"OpenAI","harness":"OpenHands"},{"accuracy":43.312,"latency":799.069,"stderr":4.728,"cost_per_test":4.075143,"max_output_tokens":128000,"reasoning_effort":"max","provider":"OpenAI","harness":"OpenHands"}],
    ["deepseek-v4-pro","deepseek/deepseek-v4-pro-0813",{"accuracy":53.829,"latency":674.652,"stderr":4.49,"cost_per_test":0.374596,"max_output_tokens":384000,"reasoning_effort":"max","provider":"DeepSeek","harness":"OpenHands"},{"accuracy":42.056,"latency":794.407,"stderr":4.364,"cost_per_test":0.423503,"max_output_tokens":384000,"reasoning_effort":"max","provider":"DeepSeek","harness":"OpenHands"}],
    ["muse-spark-1-2","meta/muse_spark_1_2",{"accuracy":53.036,"latency":780.011,"stderr":4.42,"cost_per_test":0.648998,"temperature":1,"max_output_tokens":131072,"reasoning_effort":"xhigh","provider":"Meta","harness":"OpenHands"},{"accuracy":40.591,"latency":818.489,"stderr":4.547,"cost_per_test":0.696442,"temperature":1,"max_output_tokens":131072,"reasoning_effort":"xhigh","provider":"Meta","harness":"OpenHands"}],
    ["gemini-3-5-flash","google/gemini-3.5-flash",{"accuracy":52.737,"latency":435.011,"stderr":4.475,"cost_per_test":1.253121,"temperature":1,"max_output_tokens":65536,"reasoning_effort":"high","provider":"Google","harness":"OpenHands"},{"accuracy":40.971,"latency":478.715,"stderr":4.495,"cost_per_test":1.395394,"temperature":1,"max_output_tokens":65536,"reasoning_effort":"high","provider":"Google","harness":"OpenHands"}],
    ["gpt-5-4","openai/gpt-5.4-2026-03-05",{"accuracy":51.711,"latency":542.281,"stderr":4.721,"cost_per_test":2.044198,"max_output_tokens":128000,"reasoning_effort":"xhigh","provider":"OpenAI","harness":"OpenHands"},{"accuracy":48.905,"latency":529.018,"stderr":4.566,"cost_per_test":2.136352,"max_output_tokens":128000,"reasoning_effort":"xhigh","provider":"OpenAI","harness":"OpenHands"}],
    ["minimax-m3","minimax/MiniMax-M3",{"accuracy":51.497,"latency":927.977,"stderr":4.498,"cost_per_test":0.504553,"temperature":1,"top_p":0.95,"max_output_tokens":512000,"provider":"MiniMax","harness":"OpenHands"},{"accuracy":26.072,"latency":1063.092,"stderr":3.863,"cost_per_test":0.596591,"temperature":1,"top_p":0.95,"max_output_tokens":512000,"provider":"MiniMax","harness":"OpenHands"}],
    ["deepseek-v4-pro-unspecified","deepseek/deepseek-v4-pro",{"accuracy":51.274,"latency":495.558,"stderr":4.6,"cost_per_test":0.397123,"max_output_tokens":384000,"reasoning_effort":"max","provider":"DeepSeek","harness":"OpenHands"},{"accuracy":27.226,"latency":514.864,"stderr":4.006,"cost_per_test":0.416957,"max_output_tokens":384000,"reasoning_effort":"max","provider":"DeepSeek","harness":"OpenHands"}],
    ["deepseek-v4-flash-0731","deepseek/deepseek-v4-flash-0731",{"accuracy":50.668,"latency":411.963,"stderr":4.429,"cost_per_test":0.12607,"max_output_tokens":384000,"reasoning_effort":"high","provider":"DeepSeek","harness":"OpenHands"},{"accuracy":38.252,"latency":495.441,"stderr":4.242,"cost_per_test":0.151888,"max_output_tokens":384000,"reasoning_effort":"high","provider":"DeepSeek","harness":"OpenHands"}],
    ["kimi-k2-7-code","kimi/kimi-k2.7-code",{"accuracy":50.036,"latency":803.827,"stderr":4.237,"cost_per_test":0.443192,"top_p":0.95,"max_output_tokens":32768,"provider":"Moonshot AI","harness":"OpenHands"},{"accuracy":30.435,"latency":810.019,"stderr":3.89,"cost_per_test":0.437463,"top_p":0.95,"max_output_tokens":32768,"provider":"Moonshot AI","harness":"OpenHands"}],
    ["claude-sonnet-4-6","anthropic/claude-sonnet-4-6",{"accuracy":49.052,"latency":860.178,"stderr":4.64,"cost_per_test":1.382228,"temperature":1,"max_output_tokens":128000,"reasoning":true,"compute_effort":"max","provider":"Anthropic","harness":"OpenHands"},{"accuracy":27.827,"latency":899.527,"stderr":4.187,"cost_per_test":1.296656,"temperature":1,"max_output_tokens":128000,"reasoning":true,"compute_effort":"max","provider":"Anthropic","harness":"OpenHands"}],
    ["glm-5-3","zai/glm-5.3",{"accuracy":47.509,"latency":787.365,"stderr":4.522,"cost_per_test":0.71406,"temperature":1,"top_p":0.95,"max_output_tokens":128000,"reasoning_effort":"max","provider":"Zhipu AI","harness":"OpenHands"},{"accuracy":29.636,"latency":833.991,"stderr":4.252,"cost_per_test":0.745393,"temperature":1,"top_p":0.95,"max_output_tokens":128000,"reasoning_effort":"max","provider":"Zhipu AI","harness":"OpenHands"}],
    ["claude-sonnet-5","anthropic/claude-sonnet-5",{"accuracy":46.476,"latency":911.674,"stderr":4.491,"cost_per_test":2.89733,"temperature":1,"max_output_tokens":128000,"compute_effort":"max","provider":"Anthropic","harness":"OpenHands"},{"accuracy":35.123,"latency":1016.621,"stderr":4.513,"cost_per_test":3.852227,"temperature":1,"max_output_tokens":128000,"compute_effort":"max","provider":"Anthropic","harness":"OpenHands"}],
    ["glm-5-2","zai/glm-5.2",{"accuracy":45.077,"latency":1191.665,"stderr":4.392,"cost_per_test":0.811017,"temperature":1,"top_p":0.95,"max_output_tokens":131072,"reasoning_effort":"max","provider":"Zhipu AI","harness":"OpenHands"},{"accuracy":32.223,"latency":1271.286,"stderr":4.575,"cost_per_test":0.860085,"temperature":1,"top_p":0.95,"max_output_tokens":131072,"reasoning_effort":"max","provider":"Zhipu AI","harness":"OpenHands"}],
    ["qwen3-8-max","alibaba/qwen3.8-max",{"accuracy":42.011,"latency":948.433,"stderr":4.435,"cost_per_test":0.524988,"temperature":0.7,"max_output_tokens":128000,"provider":"Alibaba","harness":"OpenHands"},{"accuracy":30.255,"latency":997.703,"stderr":4.183,"cost_per_test":0.558577,"temperature":0.7,"max_output_tokens":128000,"provider":"Alibaba","harness":"OpenHands"}],
    ["grok-4-3","grok/grok-4.3",{"accuracy":40.638,"latency":277.173,"stderr":4.615,"cost_per_test":0.419712,"temperature":0.7,"top_p":0.95,"reasoning_effort":"high","provider":"SpaceXAI","harness":"OpenHands"},{"accuracy":19.305,"latency":278.486,"stderr":3.515,"cost_per_test":0.361569,"temperature":0.7,"top_p":0.95,"reasoning_effort":"high","provider":"SpaceXAI","harness":"OpenHands"}],
    ["glm-5-3-flash","zai/glm-5.3-flash",{"accuracy":40.159,"latency":728.997,"stderr":4.432,"cost_per_test":0.039052,"temperature":1,"top_p":0.95,"max_output_tokens":131072,"reasoning_effort":"max","provider":"Fireworks AI","harness":"OpenHands"},{"accuracy":32.516,"latency":835.02,"stderr":4.572,"cost_per_test":0.039878,"temperature":1,"top_p":0.95,"max_output_tokens":131072,"reasoning_effort":"max","provider":"Fireworks AI","harness":"OpenHands"}],
    ["qwen3-8-27b","alibaba/qwen3.8-27b",{"accuracy":38.106,"latency":401.009,"stderr":4.38,"cost_per_test":0.81809,"temperature":1,"top_p":0.95,"max_output_tokens":65536,"reasoning_effort":"xhigh","provider":"Alibaba","harness":"OpenHands"},{"accuracy":19.117,"latency":428.836,"stderr":3.555,"cost_per_test":0.829339,"temperature":1,"top_p":0.95,"max_output_tokens":65536,"reasoning_effort":"xhigh","provider":"Alibaba","harness":"OpenHands"}],
    ["inkling-small","thinkingmachines/inkling-small",{"accuracy":33.582,"latency":700.919,"stderr":3.66,"cost_per_test":0.148059,"temperature":1,"top_p":1,"max_output_tokens":262000,"reasoning_effort":"0.99","provider":"Thinkingmachines","harness":"OpenHands"},{"accuracy":21.893,"latency":724.796,"stderr":3.439,"cost_per_test":0.146387,"temperature":1,"top_p":1,"max_output_tokens":262000,"reasoning_effort":"0.99","provider":"Thinkingmachines","harness":"OpenHands"}],
    ["ling-3-0-flash","ant/ling-3.0-flash-2607",{"accuracy":27.946,"latency":292.431,"stderr":3.76,"cost_per_test":0.060905,"temperature":0.6,"top_p":0.95,"max_output_tokens":131072,"provider":"Ant","harness":"OpenHands"},{"accuracy":18.185,"latency":324.893,"stderr":3.221,"cost_per_test":0.064236,"temperature":0.6,"top_p":0.95,"max_output_tokens":131072,"provider":"Ant","harness":"OpenHands"}],
    ["inkling","thinkingmachines/inkling",{"accuracy":26.091,"latency":938.657,"stderr":3.863,"cost_per_test":0.826622,"temperature":1,"top_p":1,"max_output_tokens":256000,"reasoning_effort":"0.99","provider":"Thinkingmachines","harness":"OpenHands"},{"accuracy":18.522,"latency":993.183,"stderr":3.389,"cost_per_test":0.900978,"temperature":1,"top_p":1,"max_output_tokens":256000,"reasoning_effort":"0.99","provider":"Thinkingmachines","harness":"OpenHands"}],
    ["mercury-2-5","inception/mercury-2.5",{"accuracy":18.061,"latency":49.364,"stderr":3.079,"cost_per_test":0.101286,"max_output_tokens":65536,"reasoning_effort":"high","provider":"Inception","harness":"OpenHands"},{"accuracy":9.133,"latency":36.37,"stderr":2.183,"cost_per_test":0.074157,"max_output_tokens":65536,"reasoning_effort":"high","provider":"Inception","harness":"OpenHands"}]
  ];
  for (const [modelId, systemId, withSkills, withoutSkills] of rows) {
    const model = models.find((item) => item.id === modelId);
    model.referenceSourceIds = [...new Set([...(model.referenceSourceIds || []), sourceId])];
    for (const [condition, conditionLabel, result] of [
      ["with-skills", "With Skills", withSkills],
      ["without-skills", "Without Skills", withoutSkills]
    ]) {
      const config = [
        result.reasoning_effort != null ? `reasoning_effort=${result.reasoning_effort}` : "",
        result.compute_effort != null ? `compute_effort=${result.compute_effort}` : "",
        result.reasoning != null ? `reasoning=${result.reasoning}` : "",
        result.temperature != null ? `temperature=${result.temperature}` : "",
        result.top_p != null ? `top_p=${result.top_p}` : "",
        result.max_output_tokens != null ? `max_output_tokens=${result.max_output_tokens}` : ""
      ].filter(Boolean).join(" · ");
      const harness = result.harness === "OpenHands"
        ? "OpenHands-CLI@3ca17446c5d9c1e35e054803478a3501ec251ecf" : "Codex (version not stated)";
      const setting = `Vals AI · updated 2026-09-27 · metadata version 1 · 87 tasks in trace charts · 3 trials/task/condition · per-task mean then task average · ${harness} · ${conditionLabel} · system=${systemId} · provider=${result.provider}${config ? ` · ${config}` : ""}`;
      const notes = [
        "Exact published JSON precision retained; input/output token list prices are not benchmark outcomes.",
        systemId === "deepseek/deepseek-v4-pro" ? "Evaluator display label is DeepSeek V4; system ID identifies V4 Pro but gives no dated snapshot. Kept separate from 0813." : "",
        systemId === "alibaba/qwen3.8-max" ? "No 0902 snapshot is specified; kept on the undated model alias." : "",
        ["anthropic/claude-fable-5-1", "anthropic/claude-opus-5"].includes(systemId)
          ? "Vals flags provider refusals scored as failures. Its UI also exposes fallback flags, but does not name a fallback model; no route is inferred." : ""
      ].filter(Boolean);
      for (const [metric, , unit] of metricViews) {
        const value = metric === "accuracy" ? result.accuracy : metric === "cost" ? result.cost_per_test : result.latency;
        observations.push({ id: `o${observations.length + 1}`, sourceIds: [sourceId],
          benchmarkId: `skillsbench-vals-${condition}-${metric}`, modelId, value, unit, setting,
          ...(metric === "accuracy" ? { uncertainty: { type: "standard-error", value: result.stderr, unit: "percentage points" } } : {}),
          note: [...notes, metric === "accuracy" ? `Published standard error: ±${result.stderr} percentage points.` : "Mean measured test cost/duration; not an accuracy score."].join(" ") });
      }
    }
  }
  sourceAudits.push({ sourceId, status: "complete", auditedAt: "2026-10-22",
    scopeLabel: "35 配置双条件表已核", expectedObservationCount: 210,
    benchmarkIds: conditionViews.flatMap(([condition]) => metricViews.map(([metric]) => `skillsbench-vals-${condition}-${metric}`)),
    auditScope: "All 35 system IDs in the published JSON, paired With Skills and No Skills accuracy, cost_per_test, and latency. Standard errors and non-null generation configuration retained alongside accuracy.",
    note: "35 systems represent 34 models because GPT-5.5 has separate OpenHands and Codex configurations. Overall repeats With Skills and is not counted again. Vals metadata version 1 is not assumed to equal BenchFlow v1.1; the page locks OpenHands-CLI but does not publish a task-source commit. Derived gain, skill-use traces, refusal/fallback counts, and API list prices are outside this result-table scope." });
})();

(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  const family = benchmarkFamilies.find((item) => item.id === "skillsbench-1-1-family");
  family.variants.push({ benchmarkId: "skillsbench-self-contained", label: "Self-contained · 78 tasks" });
  family.variants.find((item) => item.benchmarkId === "skillsbench-text-79").label = "Text-only · 79 tasks · Claude Code";
  benchmarks.find((item) => item.id === "skillsbench-text-79").description = "Tencent Hy evaluation: Claude Code, 79 self-contained text-only tasks, three-run average. Separate from the 87-task main leaderboard, the 78-task subset, and Atria's OpenHands run.";
  benchmarks.push({ id: "skillsbench-text-79-openhands", name: "SkillsBench · Text-only (79 tasks) · OpenHands",
    category: "Agent / 工作", direction: "higher",
    description: "Atria evaluation in AgentCompass: OpenHands, 79 self-contained tasks excluding multimodal inputs, three-run average. Reasoning tiers and task-source commit not stated." });
  family.variants.push({ benchmarkId: "skillsbench-text-79-openhands", label: "Text-only · 79 tasks · OpenHands" });

  // Correct the subset assignments without dropping scores or their provenance.
  const moved = new Map();
  for (const observation of observations) {
    if (observation.sourceIds.includes("skillsbench-1-1") && observation.modelId === "deepseek-v4-pro") {
      observation.modelId = "deepseek-v4-pro-unspecified";
      observation.note = "BenchFlow's row says DeepSeek V4 Pro without a dated snapshot; leaderboard recomputed 2026-07-16, before the 0813 release. No 0813 mapping is inferred.";
    }
    let newId;
    if (observation.benchmarkId === "skillsbench-1-1" && /78 tasks/.test(observation.setting)) newId = "skillsbench-self-contained";
    if (observation.benchmarkId === "skillsbench-1-1" && observation.modelId === "hy4-preview" && /79-task/.test(observation.setting)) {
      newId = "skillsbench-text-79";
      observation.setting = "Hy4 official Benchmark Appendix · highest available reasoning setting · Claude Code · 79 self-contained text-only tasks · three-run average";
    }
    if (!newId) continue;
    for (const sourceId of observation.sourceIds) moved.set(sourceId, { oldId: observation.benchmarkId, newId });
    observation.benchmarkId = newId;
  }
  for (const audit of sourceAudits) {
    const change = moved.get(audit.sourceId);
    if (!change) continue;
    for (const target of [audit, ...(audit.targetModels || [])]) {
      for (const key of ["benchmarkIds", "targetBenchmarkIds"]) {
        if (target[key]) target[key] = [...new Set(target[key].map((id) => id === change.oldId ? change.newId : id))];
      }
    }
  }

  const addScore = (sourceIds, benchmarkId, modelId, value, setting, note = "") => {
    observations.push({ id: `o${observations.length + 1}`, sourceIds, benchmarkId, modelId, value, unit: "%", setting, note });
  };
  const hy4SourceId = "hy4-skillsbench-appendix";
  sources.push({ id: hy4SourceId, vendorId: "tencent", publisher: "Tencent Hy", date: "2026-08-28", tier: "official", kind: "report",
    title: "Hy4 Preview — SkillsBench comparison row and protocol notes (pinned appendix)",
    url: "https://github.com/Tencent-Hunyuan/Hy4-preview/blob/509799be8cc7bfeb63353e7322b2daddf7f73a28/README.md#benchmark-appendix" });
  models.find((item) => item.id === "hy4-preview").referenceSourceIds.push(hy4SourceId);
  const hy4Setting = "Hy4 official Benchmark Appendix · highest available reasoning setting · Claude Code · 79 self-contained text-only tasks · three-run average";
  const existingHy4 = observations.find((item) => item.modelId === "hy4-preview" && item.benchmarkId === "skillsbench-text-79");
  existingHy4.sourceIds.push(hy4SourceId);
  const existingHy3 = observations.find((item) => item.modelId === "hy3" && item.benchmarkId === "skillsbench-text-79");
  existingHy3.sourceIds.push(hy4SourceId);
  for (const [modelId, value] of [
    ["deepseek-v4-pro", 65.0], ["qwen3-8-max", 66.7], ["glm-5-3", 63.3],
    ["kimi-k3", 51.9], ["gpt-5-6-sol", 62.5], ["claude-opus-5", 63.7]
  ]) addScore([hy4SourceId], "skillsbench-text-79", modelId, value, hy4Setting,
    "Exact comparison cell in Tencent's appendix image. The appendix says models were evaluated with Claude Code; an undated Qwen3.8 Max label is not mapped to 0902.");
  sourceAudits.push({ sourceId: hy4SourceId, status: "complete", auditedAt: "2026-10-22",
    scopeLabel: "SkillsBench 整行已核", expectedObservationCount: 8, benchmarkIds: ["skillsbench-text-79"],
    auditScope: "All eight model cells in the SkillsBench row, with the adjacent evaluation protocol footnote.",
    note: "The pinned appendix explicitly states Claude Code, 79 self-contained tasks excluding multimodal tasks, and three runs. Hy4 62.9 and Hy3 55.3 add provenance to existing observations; the six comparison model cells were missing. This focused row audit does not mark the rest of Hy4's comparison appendix complete." });

  const atriaCard = "atria-dawn-preview-hf";
  const atriaReport = "atria-dawn-preview-report";
  sources.push({ id: atriaCard, vendorId: "internlm", publisher: "Shanghai AI Laboratory", date: "2026-09-11", tier: "official", kind: "model-card",
    title: "Atria Dawn Preview — Official Model Card",
    url: "https://huggingface.co/internlm/Atria-Dawn-Preview/blob/311a9b8c6c0e8dd4b00b2d7baff7a926c3415e78/README.md" });
  sources.push({ id: atriaReport, vendorId: "internlm", publisher: "Shanghai AI Laboratory", date: "2026-09-17", tier: "official", kind: "report",
    title: "Atria Dawn — Table 1 and Appendix B evaluation protocols",
    url: "https://arxiv.org/html/2609.15818v2" });
  models.push({ id: "atria-dawn-preview", name: "Atria Dawn Preview", vendorId: "internlm", vendor: "Shanghai AI Laboratory",
    releaseDate: "2026-09", modality: "language", modalityDetail: "文本输入 → 文本 / 工具调用；官方卡明确不接受多模态输入",
    context: "256K", access: "开放权重 / API", aliases: ["Atria-Dawn-Preview"], sourceId: atriaCard,
    referenceSourceIds: [atriaReport], summary: "GLM-5.2 基座上的 744B MoE；本次只核对 SkillsBench 行，其他成绩表仍待补录。" });
  const atriaSetting = "Atria Table 1 / Appendix B · OpenHands within AgentCompass · 79 self-contained text-only tasks · three-run average · reasoning tiers and task-source commit not stated";
  for (const [modelId, value] of [
    ["atria-dawn-preview", 66.4], ["deepseek-v4-pro", 65.0], ["kimi-k3", 51.9],
    ["qwen3-8-max", 66.7], ["glm-5-3", 63.3], ["gpt-5-6-sol", 62.5], ["claude-opus-5", 63.7]
  ]) addScore([atriaCard, atriaReport], "skillsbench-text-79-openhands", modelId, value, atriaSetting,
    "Model card and technical report agree on the exact row. Appendix B explicitly names OpenHands; identical values in Tencent's Claude Code table do not establish identical evaluation settings.");
  for (const sourceId of [atriaCard, atriaReport]) sourceAudits.push({ sourceId, status: "partial", auditedAt: "2026-10-22",
    scopeLabel: "SkillsBench 行已核", expectedObservationCount: 7, benchmarkIds: ["skillsbench-text-79-openhands"],
    auditScope: "Seven SkillsBench cells in Table 1 and the model card, with Appendix B's OpenHands protocol.",
    note: "All seven SkillsBench cells and the 79-task text-only OpenHands protocol are verified. Other model-card and report benchmarks are outside this focused audit and remain unimported; this is not a full Atria source audit." });

  const lingSourceId = "ling31-flash-hf";
  sources.push({ id: lingSourceId, vendorId: "inclusionai", publisher: "Ant inclusionAI", date: "2026-10-13", tier: "official", kind: "model-card",
    title: "Ling-3.1-flash — Official evaluation chart",
    url: "https://huggingface.co/inclusionAI/Ling-3.1-flash/blob/93e96ab91e800998388563295340a4238ff3e962/README.md" });
  models.push({ id: "ling-3-1-flash", name: "Ling-3.1-Flash", vendorId: "inclusionai", vendor: "Ant inclusionAI",
    releaseDate: "2026-10", modality: "language", modalityDetail: "文本输入 → 文本 / 工具调用；官方卡为 text-generation",
    context: "1M", access: "开放权重 / API", aliases: ["Ling-3.1-flash"], sourceId: lingSourceId,
    summary: "560B 总参数、25B 激活；本次核对 SkillsBench 整行，其他模型卡指标尚未完成审计。" });
  for (const [modelId, value] of [
    ["ling-3-1-flash", 68.7], ["deepseek-v4-1-flash", 71.3], ["kimi-k3", 63.6],
    ["glm-5-3", 59.4], ["glm-5-3-flash", 61.3], ["claude-opus-5", 63.7], ["gpt-5-6-sol", 73.5]
  ]) addScore([lingSourceId], "skillsbench", modelId, value,
    "Ling-3.1-flash official chart · SkillsBench · version, task count, harness, reasoning setting and run count not stated",
    "Exact cell read from the official model-card image. Its LingCode/Pi footnote applies to four named coding benchmarks, not SkillsBench; the prior Ling-3.0 Kilo Code protocol is not assumed to carry over.");
  sourceAudits.push({ sourceId: lingSourceId, status: "partial", auditedAt: "2026-10-22",
    scopeLabel: "SkillsBench 整行已核", expectedObservationCount: 7, benchmarkIds: ["skillsbench"],
    auditScope: "All seven model cells in the SkillsBench row of the official evaluation image, plus its footnotes.",
    note: "The chart reports GLM-5.3 59.4 and GLM-5.3-Flash 61.3. SkillsBench-specific harness, task count, version and run count are absent, so the row stays version unspecified and is not tagged multimodal × harness. Other benchmark rows remain outside this focused audit." });

  // Qwen's release table includes four comparison cells as well as its target column.
  const qwenSetting = "Qwen3.7 release comparison table · OpenCode · 78 tasks excluding 9 external-API tasks · five-run average";
  for (const [modelId, value, effort] of [
    ["kimi-k2-6", 56.2, "Thinking"], ["glm-5-1", 53.1, "Thinking"],
    ["deepseek-v4-pro-unspecified", 52.3, "Max"], ["qwen3-6-plus", 45.7, "not stated"]
  ]) addScore(["qwen37"], "skillsbench-self-contained", modelId, value, `${qwenSetting} · table effort=${effort}`,
    "The DeepSeek comparison column specifies V4 Pro Max without a snapshot, so it is not assigned to the later 0813 release.");
  const qwenAudit = sourceAudits.find((item) => item.sourceId === "qwen37");
  qwenAudit.note += " SkillsBench's four available comparison cells were added on 2026-10-22; the remaining benchmark comparison columns are still outside the completed target-column scope.";

  const panguSourceId = "openpangu20-flash-hf";
  sources.push({ id: panguSourceId, vendorId: "huawei", publisher: "Huawei openPangu", date: "2026-06-30", tier: "official", kind: "model-card",
    title: "openPangu-2.0-Flash — Official Model Card",
    url: "https://huggingface.co/openpangu/openPangu-2.0-Flash/blob/5b78fc70a06dd27c5c4c5e918c46c49531d357b4/README.md" });
  models.push({ id: "openpangu-2-0-flash", name: "openPangu-2.0-Flash", vendorId: "huawei", vendor: "Huawei openPangu",
    releaseDate: "2026-06-30", modality: "language", modalityDetail: "文本语言模型；思考与非思考模式分别保留",
    context: "512K", access: "开放权重", aliases: ["openPangu-2.0-Flash"], sourceId: panguSourceId,
    summary: "92B 总参数、6B 激活；本次只核对 SkillsBench 两种模式，其他模型卡成绩仍待审计。" });
  for (const [mode, value] of [["Thinking", 42.6], ["Non-Thinking", 40.0]]) {
    addScore([panguSourceId], "skillsbench", "openpangu-2-0-flash", value,
      `openPangu official table · ${mode} · Avg@5 · version, task subset, harness and detailed thinking budget not stated`);
  }
  sourceAudits.push({ sourceId: panguSourceId, status: "partial", auditedAt: "2026-10-22",
    scopeLabel: "SkillsBench 双模式已核", expectedObservationCount: 2, benchmarkIds: ["skillsbench"],
    note: "Both SkillsBench Avg@5 values are verified against the official model card, 42.6 Thinking and 40.0 Non-Thinking. Task count, harness and benchmark version are absent. All other model-card benchmarks remain outside this focused audit." });

  const dotsSourceId = "dots3-note-preview-hf";
  sources.push({ id: dotsSourceId, vendorId: "dots", publisher: "Dots Studio / Xiaohongshu", date: "2026-08-09", tier: "official", kind: "model-card",
    title: "dots3-note Preview — Official Benchmark Appendix",
    url: "https://huggingface.co/dots-studio/dots3-note-prev/blob/1e1e7b0cd37a3a48a6c8d7fa55d5f9d14377006b/README.md#benchmark-appendix" });
  models.push({ id: "dots3-note-preview", name: "dots3-note Preview", vendorId: "dots", vendor: "Dots Studio",
    releaseDate: "2026-08", modality: "omni", modalityDetail: "文本、图像、视频、音频输入 → 文本",
    context: "512K", access: "开放权重 / API", aliases: ["dots3-note-prev", "dots3-note Preview"], sourceId: dotsSourceId,
    summary: "280B 总参数、16B 激活；本次只核对 SkillsBench 行和 footnote 11，其他官方附录成绩仍待审计。" });
  models.push({ id: "deepseek-v4-pro-preview-skillsbench", name: "DeepSeek V4 Pro Preview (SkillsBench table label)",
    vendorId: "deepseek", vendor: "DeepSeek", releaseDate: "not stated", modality: "language",
    modalityDetail: "V4 Pro Preview 文本模型；附录未注明精确快照", context: "not stated", access: "not stated",
    aliases: ["DeepSeek-v4-pro-preview"], sourceId: dotsSourceId, scoreStatus: "comparison-only",
    summary: "保留 dots3 附录中的 Preview 标签；不与未注明版本的 Pro 或 0813 快照合并。" });
  const dotsBenchmarkId = "skillsbench-self-contained-79-claude-code";
  benchmarks.push({ id: dotsBenchmarkId, name: "SkillsBench · Self-contained (79 tasks) · Claude Code",
    category: "Agent / 工作", direction: "higher",
    description: "Dots Studio evaluation: 79 tasks excluding external API-dependent tasks, Claude Code, three-run average. The footnote does not say multimodal inputs were excluded; this is not assumed to equal Tencent's 79-task text-only subset." });
  family.variants.push({ benchmarkId: dotsBenchmarkId, label: "Self-contained · 79 tasks · Dots / Claude Code" });
  for (const [modelId, value] of [["dots3-note-preview", 52.8], ["glm-5-2", 51.9], ["deepseek-v4-flash-0731", 61.5], ["claude-opus-4-8", 64.6]]) {
    addScore([dotsSourceId], dotsBenchmarkId, modelId, value,
      "Dots Studio official appendix · footnote 11 · Claude Code · 79 tasks excluding external API-dependent tasks · three-run average · reasoning effort not stated",
      modelId === "dots3-note-preview" ? "Unstarred target-model cell; footnote 11 explicitly provides its evaluation protocol." : "Starred comparison cell; appendix legend identifies starred results as the publisher's own testing.");
  }
  for (const [modelId, value] of [["hy3", 55.3], ["deepseek-v4-flash", 44.7], ["deepseek-v4-pro-preview-skillsbench", 50.1], ["seed2-1-pro", 60.4], ["gpt-5-5", 66.5]]) {
    addScore([dotsSourceId], "skillsbench", modelId, value,
      "Dots Studio official appendix · unstarred comparison cell · version, task count, harness and reasoning setting not independently specified",
      "Footnote 11 describes the publisher's own evaluation; it is not applied to unstarred external comparison scores. No task subset, harness or dated model snapshot is inferred from matching values.");
  }
  sourceAudits.push({ sourceId: dotsSourceId, status: "partial", auditedAt: "2026-10-22",
    scopeLabel: "SkillsBench 整行已核", expectedObservationCount: 9, benchmarkIds: [dotsBenchmarkId, "skillsbench"],
    auditScope: "Nine available SkillsBench cells in the English reasoning/agent appendix and footnote 11; blank cells are not scores.",
    note: "Target and three starred own-test cells use the documented 79-task external-API-excluded Claude Code protocol. Five unstarred comparison cells keep settings unspecified. A community model-card discussion calls dots3 52.8 v1.1, but the primary appendix gives a 79-task subset; the primary protocol takes precedence. Other benchmark rows are outside this focused audit." });

  const copilotSourceId = "github-copilot-skillsbench";
  sources.push({ id: copilotSourceId, vendorId: "github", publisher: "GitHub", date: "2026-06-25", tier: "official", kind: "evaluator",
    title: "GitHub Copilot agentic harness — SkillsBench resolution and token-efficiency comparisons",
    url: "https://github.blog/ai-and-ml/github-copilot/evaluating-performance-and-efficiency-of-the-github-copilot-agentic-harness-across-models-and-tasks/" });
  for (const [id, label, direction] of [
    ["skillsbench-copilot-resolution-delta", "Copilot resolution-rate difference", "higher"],
    ["skillsbench-copilot-token-change", "Copilot relative median token change", "lower"]
  ]) {
    benchmarks.push({ id, name: `SkillsBench · ${label}`, category: "Agent / 工作", direction,
      description: "GitHub's June 20 weekly suite compares Copilot CLI with the same model on Claude Code or Codex CLI. These are relative changes, not absolute resolution rates; medium effort, five runs and best-scored run, adjusted task set." });
    family.variants.push({ benchmarkId: id, label: `Copilot · ${label}` });
  }
  for (const [modelId, vendorHarness, delta, tokenChange] of [
    ["claude-sonnet-4-6", "Claude Code", -5.4, -41], ["claude-opus-4-7", "Claude Code", -8.0, -47],
    ["gpt-5-4", "Codex CLI", 4.0, -39], ["gpt-5-5", "Codex CLI", 5.4, -26]
  ]) {
    const setting = `GitHub 2026-06-20 weekly suite · Copilot CLI vs ${vendorHarness} with the same model · medium reasoning effort · five independent runs, best-scored run · 2h timeout · no web tools/tool search/MCP servers · adjusted task set, exact task count and version not stated`;
    observations.push({ id: `o${observations.length + 1}`, sourceIds: [copilotSourceId], benchmarkId: "skillsbench-copilot-resolution-delta",
      modelId, value: delta, unit: "percentage points", setting, note: "Adjusted resolution-rate difference; positive means Copilot resolves more. No absolute accuracy is inferred." });
    observations.push({ id: `o${observations.length + 1}`, sourceIds: [copilotSourceId], benchmarkId: "skillsbench-copilot-token-change",
      modelId, value: tokenChange, unit: "%", setting, note: "Relative median (P50) tokens on the same task/model; negative means Copilot uses fewer tokens. This is not a resolution score." });
  }
  sourceAudits.push({ sourceId: copilotSourceId, status: "partial", auditedAt: "2026-10-22",
    scopeLabel: "SkillsBench 双指标已核", expectedObservationCount: 8,
    benchmarkIds: ["skillsbench-copilot-resolution-delta", "skillsbench-copilot-token-change"],
    auditScope: "Four SkillsBench resolution-rate differences and four SkillsBench relative median token changes, with publication methodology.",
    note: "All eight SkillsBench chart values verified visually. The charts report relative changes only; neither absolute scores nor absolute token counts are invented. Other benchmark charts are outside this focused SkillsBench audit." });

  sourceAudits.find((item) => item.sourceId === "skillsbench-1-1").auditedAt = "2026-10-22";
})();

