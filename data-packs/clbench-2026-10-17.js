(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-17";

  const boardSources = [
    { id: "clbench-main-leaderboard", vendorId: "tencent", publisher: "Tencent Hunyuan / Fudan NLP Group", kind: "benchmark", date: "2026-02", tier: "official", title: "CL-bench — Official Context Learning Leaderboard (2026-10-17 snapshot)", url: "https://www.clbench.com/#section-clb" },
    { id: "clbench-life-leaderboard", vendorId: "tencent", publisher: "Tencent Hunyuan / Fudan NLP Group", kind: "benchmark", date: "2026-04", tier: "official", title: "CL-bench Life — Official Real-life Context Learning Leaderboard (2026-10-17 snapshot)", url: "https://www.clbench.com/#section-life" }
  ];
  sources.push(...boardSources);

  // These labels either lack a model record or do not identify the same snapshot as an
  // existing record (notably Hy3 Preview and the unspecified DeepSeek V4 Pro).
  const comparisonModels = [
    ["gpt-5-1-clbench","GPT-5.1 (CL-bench label)","openai","OpenAI","GPT 5.1"],
    ["hy3-preview-clbench","Hy3 Preview (CL-bench label)","tencent","Tencent Hy","Hy3 preview"],
    ["seed2-0-unspecified-clbench","Seed 2.0 (CL-bench label)","bytedance","ByteDance Seed","SEED 2.0"],
    ["o3-clbench","o3 (CL-bench label)","openai","OpenAI","o3"],
    ["kimi-k2-clbench","Kimi K2 (CL-bench label)","moonshot","Moonshot AI","Kimi K2"],
    ["hy2-0-clbench","Hy2.0 (CL-bench label)","tencent","Tencent Hy","Hy2.0"],
    ["seed1-8-clbench","Seed 1.8 (CL-bench label)","bytedance","ByteDance Seed","SEED 1.8"],
    ["glm-4-7-clbench","GLM-4.7 (CL-bench label)","zai","Z.ai","GLM 4.7"],
    ["qwen3-max-clbench","Qwen 3 Max (CL-bench label)","alibaba","Alibaba Qwen","Qwen 3 Max"],
    ["doubao1-6-clbench","Doubao 1.6 (CL-bench label)","bytedance","ByteDance Seed","Doubao 1.6"],
    ["polyphony-clbench","Polyphony (CL-bench label)","mininglamp","Mininglamp","Polyphony"],
    ["seed2-0-pro-clbench","Seed 2.0 Pro (CL-bench label)","bytedance","ByteDance Seed","Seed 2.0 Pro"],
    ["deepseek-v4-pro-unspecified-clbench","DeepSeek V4 Pro (CL-bench label)","deepseek","DeepSeek","DeepSeek V4 Pro"]
  ];
  for (const [id, name, vendorId, vendor, label] of comparisonModels) {
    models.push({ id, name, vendorId, vendor, releaseDate: "2026-10-17 or earlier",
      modality: "language", modalityDetail: "Text context-learning tasks; exact model snapshot and native modalities are not specified by the benchmark owner",
      context: "Not reported by the benchmark owner", access: "Not reported by the benchmark owner",
      aliases: [label], sourceId: id === "seed2-0-pro-clbench" || id === "deepseek-v4-pro-unspecified-clbench" ? "clbench-life-leaderboard" : "clbench-main-leaderboard",
      scoreStatus: "comparison-only", summary: "Official CL-bench leaderboard label; kept separate from any differently specified release or snapshot." });
  }

  // Correct the older provider-report benchmark descriptions before adding the owner runs.
  const mainOverall = benchmarks.find((item) => item.id === "cl-bench");
  Object.assign(mainOverall, { name: "CL-bench · Overall", category: "知识 / 推理", direction: "higher",
    description: "Context learning from professional and domain-specific knowledge; 1,899 tasks, all-rubrics-pass success rate. Provider-reported runs retain their own settings." });
  const lifeOverall = benchmarks.find((item) => item.id === "cl-bench-life");
  Object.assign(lifeOverall, { name: "CL-bench Life · Overall", category: "知识 / 推理", direction: "higher",
    description: "Context learning from messy real-life records; 405 context-task pairs, all-rubrics-pass success rate. Separate from LifeSciBench." });
  const mainMetrics = [
    ["overall", "cl-bench", "Overall", "1,899 professional and domain-specific tasks"],
    ["domain", "cl-bench-domain", "Domain Knowledge Reasoning", "domain knowledge category"],
    ["rule", "cl-bench-rule", "Rule System Application", "rule-system category"],
    ["procedural", "cl-bench-procedural", "Procedural Task Execution", "procedural category"],
    ["pattern", "cl-bench-pattern", "Empirical Discovery & Simulation", "empirical discovery category"]
  ];
  const lifeMetrics = [
    ["overall", "cl-bench-life", "Overall", "405 real-life context-task pairs"],
    ["interpersonal", "cl-bench-life-interpersonal", "Communication & Social Interactions", "communication and social-interaction category"],
    ["thought", "cl-bench-life-revisions", "Fragmented Information & Revisions", "fragmented information and revision category"],
    ["behavior", "cl-bench-life-behavior", "Behavioral Records & Activity Trails", "behavioral-record category"]
  ];
  for (const [key, id, label, scope] of [...mainMetrics.slice(1), ...lifeMetrics.slice(1)]) {
    benchmarks.push({ id, name: `${id.startsWith("cl-bench-life") ? "CL-bench Life" : "CL-bench"} · ${label}`,
      category: "知识 / 推理", direction: "higher", description: `All-rubrics-pass task success rate for the ${scope}; GPT-5.1 judge, with the published benchmark-specific reasoning setting.` });
  }
  benchmarkFamilies.push({ id: "clbench-context-learning", name: "CL-bench", variants: mainMetrics.map(([, benchmarkId, label]) => ({ benchmarkId, label })) });
  benchmarkFamilies.push({ id: "clbench-life-context-learning", name: "CL-bench Life", variants: lifeMetrics.map(([, benchmarkId, label]) => ({ benchmarkId, label })) });

  // Values and standard deviations are copied from the benchmark owner's public JSON.
  // Each raw fraction is converted to the one-decimal percentage displayed on the site.
  const mainRows = [
    ["gpt-5-4","GPT-5.4 (xhigh)","OpenAI",0.279,0.288,0.267,0.301,0.228,0,0,0,0,0],
    ["gpt-5-1-clbench","GPT 5.1 (High)","OpenAI",0.237,0.253,0.237,0.238,0.181,0.005,0.013,0.013,0.014,0.031],
    ["hy3-preview-clbench","Hy3 preview","Tencent",0.228,0.252,0.216,0.223,0.196,0,0,0,0,0],
    ["grok-4-20","Grok 4.20 (reasoning)","xAI",0.222,0.239,0.227,0.234,0.123,0,0,0,0,0],
    ["gpt-5-1-clbench","GPT 5.1","OpenAI",0.211,0.224,0.21,0.228,0.136,0.002,0.007,0.007,0.013,0.01],
    ["claude-opus-4-5","Claude Opus 4.5 Thinking","Anthropic",0.211,0.237,0.19,0.226,0.151,0.014,0.012,0.015,0.015,0.023],
    ["gemini-3-1-pro","Gemini 3.1 Pro (high)","Google",0.208,0.211,0.202,0.238,0.145,0,0,0,0,0],
    ["claude-opus-4-6","Claude Opus 4.6","Anthropic",0.207,0.204,0.214,0.244,0.109,0,0,0,0,0],
    ["seed2-0-unspecified-clbench","SEED 2.0 (high)","ByteDance",0.206,0.21,0.207,0.214,0.172,0,0,0,0,0],
    ["qwen3-6-plus","Qwen 3.6 Plus","Alibaba",0.203,0.222,0.196,0.213,0.135,0,0,0,0,0],
    ["qwen3-5-plus","Qwen 3.5 Plus (thinking)","Alibaba",0.198,0.22,0.189,0.19,0.167,0,0,0,0,0],
    ["kimi-k2-5","Kimi K2.5","Moonshot",0.193,0.208,0.179,0.195,0.181,0,0,0,0,0],
    ["claude-opus-4-5","Claude Opus 4.5","Anthropic",0.191,0.21,0.191,0.195,0.114,0.004,0.005,0.004,0.016,0.013],
    ["seed2-0-unspecified-clbench","SEED 2.0 (medium)","ByteDance",0.187,0.201,0.193,0.183,0.139,0,0,0,0,0],
    ["glm-5","GLM 5.0","Zhipu",0.187,0.208,0.164,0.216,0.115,0,0,0,0,0],
    ["gpt-5-2","GPT 5.2","OpenAI",0.182,0.195,0.18,0.191,0.121,0.005,0.015,0.019,0.011,0.015],
    ["gpt-5-2","GPT 5.2 (High)","OpenAI",0.181,0.186,0.172,0.214,0.117,0.008,0.009,0.013,0.011,0.018],
    ["o3-clbench","o3 (High)","OpenAI",0.178,0.18,0.176,0.195,0.137,0.002,0.014,0.011,0.004,0.008],
    ["grok-4-20","Grok 4.20 (non-reasoning)","xAI",0.177,0.195,0.176,0.183,0.104,0,0,0,0,0],
    ["kimi-k2-clbench","Kimi K2 Thinking","Moonshot",0.176,0.187,0.17,0.188,0.126,0.006,0.006,0.015,0.007,0.04],
    ["hy2-0-clbench","Hy2.0 Thinking","Tencent",0.172,0.18,0.173,0.194,0.089,0.006,0.01,0.005,0.011,0.003],
    ["seed1-8-clbench","SEED 1.8","ByteDance",0.161,0.169,0.169,0.158,0.114,0,0,0,0,0],
    ["glm-4-7-clbench","GLM 4.7","Zhipu",0.159,0.179,0.169,0.144,0.098,0,0,0,0,0],
    ["gemini-3-pro","Gemini 3 Pro (High)","Google",0.158,0.155,0.177,0.164,0.101,0.003,0.011,0.017,0.016,0.031],
    ["mimo-v2-pro","MiMo V2 Pro","Xiaomi",0.157,0.177,0.14,0.176,0.093,0,0,0,0,0],
    ["hy2-0-clbench","Hy2.0","Tencent",0.15,0.143,0.163,0.173,0.085,0.008,0.009,0.009,0.011,0.009],
    ["gemini-3-pro","Gemini 3 Pro","Google",0.148,0.139,0.165,0.155,0.112,0.004,0.003,0.007,0.014,0.01],
    ["qwen3-max-clbench","Qwen 3 Max","Alibaba",0.145,0.146,0.161,0.149,0.089,0.006,0.01,0.006,0.016,0.015],
    ["qwen3-max-clbench","Qwen 3 Max Thinking","Alibaba",0.141,0.135,0.156,0.152,0.09,0.001,0.005,0.01,0.014,0.01],
    ["doubao1-6-clbench","Doubao 1.6 Thinking","ByteDance",0.134,0.137,0.142,0.139,0.094,0.001,0.001,0.014,0.015,0.003],
    ["deepseek-v3-2","DeepSeek V3.2 Thinking","DeepSeek",0.132,0.136,0.138,0.142,0.08,0.004,0.006,0.006,0.001,0.015],
    ["doubao1-6-clbench","Doubao 1.6","ByteDance",0.131,0.119,0.147,0.151,0.079,0.001,0.005,0.007,0.005,0.008],
    ["deepseek-v3-2","DeepSeek V3.2","DeepSeek",0.124,0.123,0.134,0.135,0.07,0.005,0.008,0.01,0.004,0.005],
    ["kimi-k2-clbench","Kimi K2","Moonshot",0.119,0.123,0.127,0.132,0.057,0.005,0.011,0.005,0.011,0.008],
    ["minimax-m2-5","MiniMax M2.5","MiniMax",0.114,0.122,0.106,0.137,0.051,0,0,0,0,0],
    ["polyphony-clbench","Polyphony","Mininglamp",0.234,0.251,0.227,0.267,0.117,0.004,0.01,0.005,0.009,0.006]
  ];
  const lifeRows = [
    ["gpt-5-5","GPT 5.5 (High)","OpenAI",0.222,0.235,0.178,0.254,0.005,0.007,0.006,0.025],
    ["gpt-5-4","GPT 5.4 (xHigh)","OpenAI",0.217,0.23,0.174,0.246,0.0,0.0,0.0,0.0],
    ["gpt-5-4","GPT 5.4 (High)","OpenAI",0.193,0.222,0.158,0.2,0.005,0.007,0.009,0.007],
    ["gpt-5-1-clbench","GPT 5.1 (High)","OpenAI",0.173,0.215,0.119,0.185,0.0,0.0,0.0,0.0],
    ["claude-opus-4-6","Claude Opus 4.6 (High)","Anthropic",0.17,0.217,0.165,0.128,0.013,0.033,0.009,0.015],
    ["gemini-3-1-pro","Gemini 3.1 Pro (High)","Google",0.169,0.188,0.136,0.183,0.012,0.017,0.019,0.015],
    ["hy3-preview-clbench","Hy3 preview (High)","Tencent",0.157,0.17,0.159,0.141,0.009,0.021,0.016,0.021],
    ["seed2-0-pro-clbench","Seed 2.0 Pro (High)","ByteDance",0.155,0.198,0.121,0.146,0.017,0.023,0.024,0.011],
    ["deepseek-v4-pro-unspecified-clbench","DeepSeek V4 Pro (High)","DeepSeek",0.135,0.126,0.121,0.158,0.014,0.016,0.024,0.003],
    ["kimi-k2-5","Kimi K2.5 (High)","Moonshot",0.132,0.153,0.114,0.128,0.008,0.011,0.015,0.004],
    ["hy3-preview-clbench","Hy3 preview (Low)","Tencent",0.128,0.185,0.104,0.096,0.0,0.0,0.0,0.0],
    ["qwen3-5-plus","Qwen 3.5 Plus (High)","Alibaba",0.124,0.131,0.101,0.141,0.001,0.009,0.011,0.007],
    ["seed2-0-pro-clbench","Seed 2.0 Pro (Low)","ByteDance",0.121,0.133,0.119,0.111,0.0,0.0,0.0,0.0],
    ["grok-4-20","Grok 4.20 (High)","xAI",0.119,0.128,0.119,0.109,0.004,0.009,0.015,0.026],
    ["seed2-0-pro-clbench","Seed 2.0 Pro (Medium)","ByteDance",0.114,0.119,0.104,0.119,0.0,0.0,0.0,0.0],
    ["glm-4-7-clbench","GLM-4.7 (High)","Zhipu",0.109,0.126,0.111,0.089,0.0,0.0,0.0,0.0],
    ["deepseek-v3-2","DeepSeek V3.2 Thinking","DeepSeek",0.095,0.123,0.077,0.086,0.004,0.011,0.011,0.017],
    ["hy2-0-clbench","Hy2.0 Thinking","Tencent",0.084,0.094,0.094,0.064,0.007,0.015,0.015,0.004],
    ["mimo-v2-pro","MiMo v2 Pro (High)","Xiaomi",0.069,0.096,0.052,0.059,0.0,0.0,0.0,0.0],
    ["minimax-m2-5","MiniMax M2.5 (Thinking)","MiniMax",0.063,0.086,0.052,0.052,0.01,0.021,0.013,0.013],
    ["gemini-3-1-pro","Gemini 3.1 Pro","Google",0.16,0.215,0.133,0.133,0.0,0.0,0.0,0.0],
    ["gpt-5-4","GPT 5.4","OpenAI",0.138,0.17,0.104,0.141,0.0,0.0,0.0,0.0],
    ["claude-opus-4-6","Claude Opus 4.6","Anthropic",0.136,0.207,0.111,0.089,0.0,0.0,0.0,0.0],
    ["kimi-k2-5","Kimi K2.5","Moonshot",0.096,0.104,0.119,0.067,0.0,0.0,0.0,0.0],
    ["hy3-preview-clbench","Hy3 preview (NoThink)","Tencent",0.094,0.133,0.089,0.059,0.0,0.0,0.0,0.0],
    ["grok-4-20","Grok 4.20","xAI",0.086,0.096,0.089,0.074,0.0,0.0,0.0,0.0],
    ["seed2-0-pro-clbench","Seed 2.0 Pro","ByteDance",0.084,0.081,0.104,0.067,0.0,0.0,0.0,0.0],
    ["qwen3-5-plus","Qwen 3.5 Plus","Alibaba",0.081,0.111,0.074,0.059,0.0,0.0,0.0,0.0],
    ["deepseek-v3-2","DeepSeek V3.2","DeepSeek",0.074,0.104,0.059,0.059,0.0,0.0,0.0,0.0]
  ];
  function importBoard(rows, metrics, sourceId, taskCount, judgeEffort) {
    for (const [modelId, label, organization, ...values] of rows) {
      const scores = values.slice(0, metrics.length);
      const spreads = values.slice(metrics.length);
      const singleRun = spreads.every((value) => value === 0);
      for (const [index, [, benchmarkId]] of metrics.entries()) {
        const spread = Math.round(spreads[index] * 1000) / 10;
        const setting = ["benchmark-owner leaderboard run", `site model-mode label: ${label}`, `${taskCount} tasks`,
          `GPT-5.1 judge · ${judgeEffort} reasoning effort`,
          singleRun ? "single run; no standard deviation" : `site standard deviation ±${spread} percentage points`,
          "candidate API snapshot and exact candidate harness not specified on public leaderboard"].join(" · ");
        observations.push({ id: `o${observations.length + 1}`, sourceIds: [sourceId], benchmarkId,
          modelId, value: Math.round(scores[index] * 1000) / 10, unit: "%", setting,
          note: `Original leaderboard label: ${label} (${organization}). Candidate reasoning mode follows the original label; different label modes share this model record but retain separate settings.` });
      }
    }
  }
  importBoard(mainRows, mainMetrics, "clbench-main-leaderboard", 1899, "low");
  importBoard(lifeRows, lifeMetrics, "clbench-life-leaderboard", 405, "high");
  sourceAudits.push({ sourceId: "clbench-main-leaderboard", status: "complete", scopeLabel: "五列成绩已核", auditedAt: "2026-10-17",
    auditScope: "Official CL-bench board: 36 model-mode rows × overall and four category success rates (180 scored cells). Published standard deviations are retained in settings; task examples and raw graded files are outside this score audit.",
    expectedObservationCount: 180, benchmarkIds: mainMetrics.map(([, id]) => id),
    note: "All 180 scored cells match the official published JSON. The 1,899-task all-rubrics-pass benchmark uses GPT-5.1 low-effort judging; 16 rows are single runs. Hy3 Preview remains distinct from the later Hy3 release." });
  sourceAudits.push({ sourceId: "clbench-life-leaderboard", status: "complete", scopeLabel: "四列成绩已核", auditedAt: "2026-10-17",
    auditScope: "Official CL-bench Life board: 29 model-mode rows × overall and three category success rates (116 scored cells). Published standard deviations are retained in settings; task examples and raw graded files are outside this score audit.",
    expectedObservationCount: 116, benchmarkIds: lifeMetrics.map(([, id]) => id),
    note: "All 116 scored cells match the official published JSON. The 405-context-task-pair all-rubrics-pass benchmark uses GPT-5.1 high-effort judging; 16 rows are single runs. The unversioned DeepSeek V4 Pro remains distinct from the known 0813 release." });
})();
