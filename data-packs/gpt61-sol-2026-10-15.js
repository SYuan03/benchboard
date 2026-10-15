(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-15";

  sources.push(
    { id: "openai-gpt61-sol", vendorId: "openai", publisher: "OpenAI", date: "2026-09-29", tier: "official", title: "Introducing GPT-6.1 Sol", url: "https://openai.com/index/introducing-gpt-6-1-sol/" },
    { id: "openai-gpt61-sol-system-card", vendorId: "openai", publisher: "OpenAI", date: "2026-09-29", tier: "official", title: "Addendum to GPT-6 Astra System Card: GPT-6.1 Sol", url: "https://deploymentsafety.openai.com/gpt-6-1-sol" }
  );

  const target = models.find((model) => model.id === "gpt-6-1-sol");
  Object.assign(target, {
    releaseDate: "2026-09-29",
    modality: "vision",
    modalityDetail: "Text, images, PDFs, computer screens and tools → text; image input is evaluated in the system card",
    context: "Not stated on the release page or system card addendum",
    access: "Closed API and ChatGPT Work / Codex",
    sourceId: "openai-gpt61-sol",
    referenceSourceIds: [...new Set([...(target.referenceSourceIds || []), "anthropic-haiku55-system-card", "openai-gpt61-sol-system-card"])],
    summary: "GPT-6 Sol successor; first-party charts report five reasoning levels across six distinct evaluation views."
  });
  delete target.scoreStatus;

  models.push({
    id: "claude-opus-5-5-fallback-route",
    name: "Claude Opus 5.5 with fallbacks (OpenAI chart label)",
    vendorId: "anthropic", vendor: "Anthropic", releaseDate: "2026-09-29 or earlier",
    modality: "vision", modalityDetail: "Combined route with unspecified fallbacks; exact fallback model not named in the source",
    context: "Not reported for this route", access: "Closed API comparison route",
    aliases: ["Opus 5.5 w/ fallbacks"], sourceId: "openai-gpt61-sol", scoreStatus: "comparison-only",
    summary: "Kept separate from standalone Claude Opus 5.5 because the release charts explicitly enable fallbacks."
  });

  benchmarks.push(
    { id: "gdp-pdf-openai-task-score", name: "GDP.pdf · OpenAI chart score", category: "多模态", direction: "higher", description: "Score for professional PDF questions in the GPT-6.1 Sol release chart; the page does not specify an all-pass or criterion-pass formula.", inputModalities: ["文本", "PDF"] },
    { id: "factuality-flagged-error-rate", name: "Flagged-conversation factual error rate", category: "知识", direction: "lower", description: "Share of answers with any factual error on de-identified conversations in which users flagged an earlier model error; difficult prompts are not representative of normal use." }
  );
  benchmarkFamilies.push({ id: "gdp-pdf-family", name: "GDP.pdf", variants: [
    { benchmarkId: "gdp-pdf", label: "Previously published scores and settings" },
    { benchmarkId: "gdp-pdf-openai-task-score", label: "GPT-6.1 Sol release chart score" }
  ] });

  const chartMap = {
    "deepswe": ["deepswe-v1-1", "DeepSWE v1.1 · OpenAI release chart"],
    "gdp-pdf": ["gdp-pdf-openai-task-score", "GDP.pdf professional PDF tasks · OpenAI release chart"],
    "automationbench": ["automationbench", "AutomationBench v1.0.6 · 47 tools · OpenAI release chart"],
    "osworld": ["osworld-2-partial", "OSWorld 2.0 offline set · v2026.08.08 · partial reward · OpenAI release chart"],
    "terminal-bench-science": ["terminal-bench-science", "Terminal-Bench Science 0.1 · OpenAI release chart"],
    "factuality-results": ["factuality-flagged-error-rate", "de-identified ChatGPT conversations flagged for prior factual errors · share of answers with any factual error · OpenAI release chart"]
  };
  const modelMap = {
    "GPT-6.1 Sol": "gpt-6-1-sol", "GPT-6 Sol": "gpt-6-sol", "GPT-6 Astra": "gpt-6-astra",
    "Opus 5.5 w/ fallbacks": "claude-opus-5-5-fallback-route",
    "Fable 5.1 w/ Opus 5 fallback": "claude-fable-5-1-opus-5-fallback"
  };
  // Each row is the exact point tooltip: model label, effort, displayed USD/task, score percent.
  const chartRows = [
    ["deepswe", [
      ["GPT-6 Astra","Low",1.6,67],
      ["GPT-6 Astra","Medium",3.08,72.8],
      ["GPT-6 Astra","High",3.92,73.2],
      ["GPT-6 Astra","Xhigh",4.43,74.1],
      ["GPT-6 Astra","Max",7.5,73.2],
      ["GPT-6 Sol","Low",0.16,37.2],
      ["GPT-6 Sol","Medium",0.38,56.6],
      ["GPT-6 Sol","High",0.64,65.3],
      ["GPT-6 Sol","Xhigh",1,66.6],
      ["GPT-6 Sol","Max",2.74,68.8],
      ["GPT-6.1 Sol","Low",0.17,64.4],
      ["GPT-6.1 Sol","Medium",0.42,73],
      ["GPT-6.1 Sol","High",0.65,75.2],
      ["GPT-6.1 Sol","Xhigh",0.79,71.9],
      ["GPT-6.1 Sol","Max",1.57,71.9]
    ]],
    ["gdp-pdf", [
      ["Opus 5.5 w/ fallbacks","Low",0.76,25.6],
      ["Opus 5.5 w/ fallbacks","Medium",0.8,25.6],
      ["Opus 5.5 w/ fallbacks","High",0.83,28.8],
      ["Opus 5.5 w/ fallbacks","Xhigh",0.96,26.6],
      ["Opus 5.5 w/ fallbacks","Max",1.55,26.2],
      ["GPT-6 Astra","Low",1.7,30.4],
      ["GPT-6 Astra","Medium",1.72,30.4],
      ["GPT-6 Astra","High",1.79,31],
      ["GPT-6 Astra","Xhigh",1.91,32.2],
      ["GPT-6 Astra","Max",2.08,31],
      ["GPT-6 Sol","Low",0.33,21.8],
      ["GPT-6 Sol","Medium",0.34,25.4],
      ["GPT-6 Sol","High",0.35,28],
      ["GPT-6 Sol","Xhigh",0.37,23.8],
      ["GPT-6 Sol","Max",0.43,24.8],
      ["GPT-6.1 Sol","Low",0.33,27],
      ["GPT-6.1 Sol","Medium",0.34,30],
      ["GPT-6.1 Sol","High",0.35,32],
      ["GPT-6.1 Sol","Xhigh",0.37,31.8],
      ["GPT-6.1 Sol","Max",0.42,31]
    ]],
    ["automationbench", [
      ["Fable 5.1 w/ Opus 5 fallback","Max",2.45,31.4],
      ["Opus 5.5 w/ fallbacks","Low",0.51,24.2],
      ["Opus 5.5 w/ fallbacks","Medium",0.65,29.5],
      ["Opus 5.5 w/ fallbacks","High",0.71,33],
      ["Opus 5.5 w/ fallbacks","Xhigh",0.89,35.8],
      ["Opus 5.5 w/ fallbacks","Max",1.44,42.5],
      ["GPT-6 Astra","Low",1.08,30.3],
      ["GPT-6 Astra","Medium",1.27,34.1],
      ["GPT-6 Astra","High",1.44,37.1],
      ["GPT-6 Astra","Xhigh",1.5,39],
      ["GPT-6 Astra","Max",1.73,41.4],
      ["GPT-6 Sol","Low",0.19,21.2],
      ["GPT-6 Sol","Medium",0.21,26.9],
      ["GPT-6 Sol","High",0.24,31.2],
      ["GPT-6 Sol","Xhigh",0.27,33.2],
      ["GPT-6 Sol","Max",0.34,32],
      ["GPT-6.1 Sol","Low",0.16,24.7],
      ["GPT-6.1 Sol","Medium",0.19,31.7],
      ["GPT-6.1 Sol","High",0.23,33.2],
      ["GPT-6.1 Sol","Xhigh",0.25,35.5],
      ["GPT-6.1 Sol","Max",0.3,36.1]
    ]],
    ["osworld", [
      ["GPT-6 Astra","Low",2.72,62.2],
      ["GPT-6 Astra","Medium",5.36,69.3],
      ["GPT-6 Astra","High",6.91,70],
      ["GPT-6 Astra","Xhigh",7.49,71.3],
      ["GPT-6 Astra","Max",9.44,73.5],
      ["GPT-6 Sol","Low",1.01,43.9],
      ["GPT-6 Sol","Medium",1.38,54],
      ["GPT-6 Sol","High",1.71,58.3],
      ["GPT-6 Sol","Xhigh",2.3,60.5],
      ["GPT-6 Sol","Max",3.37,64.4],
      ["GPT-6.1 Sol","Low",0.42,59],
      ["GPT-6.1 Sol","Medium",0.77,66.8],
      ["GPT-6.1 Sol","High",0.96,69.6],
      ["GPT-6.1 Sol","Xhigh",1.05,69.4],
      ["GPT-6.1 Sol","Max",1.27,71.4]
    ]],
    ["terminal-bench-science", [
      ["Opus 5.5 w/ fallbacks","Max",23.21,63.3],
      ["GPT-6 Astra","Low",11.41,55.4],
      ["GPT-6 Astra","Medium",12.34,57.4],
      ["GPT-6 Astra","High",14.95,62],
      ["GPT-6 Astra","Xhigh",15.76,60.9],
      ["GPT-6 Astra","Max",23.8,68.1],
      ["GPT-6 Sol","Low",3,9.2],
      ["GPT-6 Sol","Medium",4.41,14.5],
      ["GPT-6 Sol","High",4.63,14.6],
      ["GPT-6 Sol","Xhigh",6.77,25.3],
      ["GPT-6 Sol","Max",12.18,27.6],
      ["GPT-6.1 Sol","Low",1.79,43.7],
      ["GPT-6.1 Sol","Medium",2.34,47.6],
      ["GPT-6.1 Sol","High",2.76,51.1],
      ["GPT-6.1 Sol","Xhigh",2.89,53.7],
      ["GPT-6.1 Sol","Max",5.47,57]
    ]],
    ["factuality-results", [
      ["GPT-6 Astra","Low",0.24,6.3],
      ["GPT-6 Astra","Medium",0.31,4.4],
      ["GPT-6 Astra","High",0.48,3.9],
      ["GPT-6 Astra","Xhigh",0.6,4],
      ["GPT-6 Astra","Max",0.79,3.9],
      ["GPT-6 Sol","Low",0.05,11.4],
      ["GPT-6 Sol","Medium",0.07,6.9],
      ["GPT-6 Sol","High",0.1,5.1],
      ["GPT-6 Sol","Xhigh",0.13,4.5],
      ["GPT-6 Sol","Max",0.18,4.6],
      ["GPT-6.1 Sol","Low",0.05,7.7],
      ["GPT-6.1 Sol","Medium",0.06,6.3],
      ["GPT-6.1 Sol","High",0.08,4.5],
      ["GPT-6.1 Sol","Xhigh",0.1,4.1],
      ["GPT-6.1 Sol","Max",0.13,4.6]
    ]]
  ];
  for (const [chartId, points] of chartRows) {
    const [benchmarkId, protocol] = chartMap[chartId];
    for (const [label, effort, cost, score] of points) {
      const note = chartId === "automationbench" && label.startsWith("Fable 5.1")
        ? "The official caption says this cost omits fallback cost; fallbacks occurred on about 40% of tasks."
        : "Score and cost are exact values shown in the official chart point tooltip; comparison versions may differ from prior launch snapshots.";
      observations.push({
        id: `o${observations.length + 1}`, sourceIds: ["openai-gpt61-sol"],
        benchmarkId, modelId: modelMap[label], value: score, unit: "%",
        setting: `${protocol} · ${effort.toLowerCase()} reasoning · displayed cost $${cost.toFixed(2)}/task`, note
      });
    }
  }

  const cardSource = "openai-gpt61-sol-system-card";
  const cardRows = [
    ["healthbench-professional", 64.2, "length-adjusted", "mean response length 3,038 characters"],
    ["healthbench-professional", 67.2, "unadjusted", "mean response length 3,038 characters"],
    ["healthbench", 58.5, "length-adjusted", "mean response length 1,701 characters"],
    ["healthbench", 56.7, "unadjusted", "mean response length 1,701 characters"],
    ["healthbench-hard", 36.2, "length-adjusted", "mean response length 1,646 characters"],
    ["healthbench-hard", 33.4, "unadjusted", "mean response length 1,646 characters"],
    ["healthbench-consensus", 96.0, "length-adjusted", "mean response length 1,686 characters"],
    ["healthbench-consensus", 95.9, "unadjusted", "mean response length 1,686 characters"],
    ["mentalhealthbench-overall", 57.9, "max reasoning · four-response task mean · 1,215 tasks", "standard error 1.0 percentage point"],
    ["mentalhealthbench-acuity-non-acute", 57.3, "max reasoning · four-response task mean · 650 tasks", "standard error 1.3 percentage points"],
    ["mentalhealthbench-acuity-high-acuity", 59.1, "max reasoning · four-response task mean · 221 tasks", "standard error 2.2 percentage points"],
    ["mentalhealthbench-acuity-emergent", 58.0, "max reasoning · four-response task mean · 344 tasks", "standard error 1.9 percentage points"]
  ];
  for (const [benchmarkId, value, setting, note] of cardRows) {
    observations.push({ id: `o${observations.length + 1}`, sourceIds: [cardSource], benchmarkId,
      modelId: "gpt-6-1-sol", value, unit: "%", setting: `GPT-6.1 Sol system card · ${setting}`, note });
  }

  sourceAudits.push(
    { sourceId: "openai-gpt61-sol", status: "complete", scopeLabel: "公开能力图表已核", auditedAt: "2026-10-15",
      auditScope: "Six release charts: all 102 point tooltips across exact model labels and five effort settings where published; cost is retained in each setting.",
      expectedObservationCount: 102, benchmarkIds: Object.values(chartMap).map(([id]) => id),
      note: "The GDP.pdf chart score has its own metric view; OSWorld offline partial reward and version remain explicit. Safety/alignment charts and price marketing claims are excluded." },
    { sourceId: cardSource, status: "target-complete", scopeLabel: "目标模型能力表已核", auditedAt: "2026-10-15",
      targetModels: [{ modelId: "gpt-6-1-sol", expectedObservationCount: 12, benchmarkIds: [...new Set(cardRows.map(([id]) => id))] }],
      note: "GPT-6.1 Sol target cells from HealthBench Table 7 (adjusted and raw metrics separately) and MentalHealthBench Table 9; other tables address safety, alignment, robustness, or deployment risk. Comparison columns are not audited here." }
  );
})();
