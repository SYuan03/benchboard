(() => {
  const data = window.BENCH_DATA;
  const { benchmarks, benchmarkFamilies, models, observations, sourceAudits } = data;
  data.meta.updated = "2026-10-23";

  const variants = [
    ["deepsearchqa-atria-paper", "DeepSearchQA · Atria paper score", "Agent / 工作", "Atria paper does not name the score subtype; keep its reported percentage separate from labeled F1 and accuracy views."],
    ["wide-search-atria-paper", "WideSearch · Atria paper score", "Agent / 工作", "Atria paper does not name the score subtype; keep its reported percentage separate from identified item-F1 runs."],
    ["deepresearch-bench-ii", "DeepResearch Bench II", "Agent / 工作", "Claude Code research-agent run judged by GPT-5.5; distinct from earlier Deep Research Bench labels."],
    ["mle-bench-lite-humanrank", "MLE-Bench Lite · HumanRank", "代码 / 软件工程", "HumanRank score, not the medal-rate measure used by other MLE-Bench Lite results."],
    ["tau3-banking-knowledge-atria", "τ³-Bench · Banking Knowledge · Atria run", "Agent / 工作", "97 Banking Knowledge tasks with the paper's alltools retrieval configuration and modified Tau2/Tau3 runner."],
    ["workspace-bench-full-atria", "Workspace-Bench · English Full · Atria run", "专业工作", "AgentCompass English Full run; paper does not state that it matches the 388-task provider setting."],
    ["workspace-bench-lite-atria", "Workspace-Bench · English Lite · Atria run", "专业工作", "AgentCompass English Lite run; paper does not identify the public 100-task rubric-pass variant."],
    ["gdpval-atria-elo", "GDPval · Atria paper Elo", "专业工作", "Elo from 220 rubric-judged tasks; separate from percentage GDPval and GDPval-AA results."]
  ];
  for (const [id, name, category, description] of variants) {
    benchmarks.push({ id, name, category, direction: "higher", description });
  }
  const familyRows = [
    ["deepsearchqa-family", "DeepSearchQA", [["deepsearchqa", "F1"], ["deepsearchqa-accuracy", "Accuracy"], ["deepsearchqa-atria-paper", "Atria paper score · subtype unspecified"]]],
    ["wide-search-family", "WideSearch", [["wide-search-atria-paper", "Atria paper score · subtype unspecified"]]],
    ["deepresearch-bench-family", "Deep Research Bench", [["deep-research-bench", "Earlier published setting"], ["deepresearch-bench-ii", "II · Atria paper run"]]],
    ["mle-bench-family", "MLE-Bench", [["mle-bench-lite-humanrank", "Lite · HumanRank"]]],
    ["tau3-family", "τ³-bench", [["tau3-banking-knowledge-atria", "Banking Knowledge · Atria paper run"]]],
    ["workspace-bench", "Workspace-Bench", [["workspace-bench-full-atria", "English Full · Atria paper run"], ["workspace-bench-lite-atria", "English Lite · Atria paper run"]]],
    ["gdpval-family", "GDPval", [["gdpval", "Percentage · published settings"], ["gdpval-atria-elo", "Elo · Atria paper run"]]]
  ];
  for (const [id, name, rows] of familyRows) {
    let family = benchmarkFamilies.find((item) => item.id === id);
    if (!family) { family = { id, name, variants: [] }; benchmarkFamilies.push(family); }
    for (const [benchmarkId, label] of rows) {
      if (!family.variants.some((item) => item.benchmarkId === benchmarkId)) family.variants.push({ benchmarkId, label });
    }
  }

  const card = "atria-dawn-preview-hf";
  const report = "atria-dawn-preview-report";
  const modelIds = ["atria-dawn-preview", "deepseek-v4-pro", "kimi-k3", "qwen3-8-max", "glm-5-3", "gpt-5-6-sol", "claude-opus-5"];
  const common = "Atria Dawn Preview official card / report Table 1 · published comparison run · model snapshots and reasoning tiers not specified unless stated";
  const rows = [
    ["deepsearchqa-atria-paper", [96.0, null, 95.9, null, 94.7, 93.2, null], "%", "in-house search/visit/python harness · 500 steps · 256K context / 64K max output · score subtype unstated"],
    ["browsecomp", [92.5, 83.4, 91.2, null, null, 92.2, 90.8], "%", "in-house search/visit/python harness · 500 steps · discard-all context strategy"],
    ["wide-search-atria-paper", [81.9, null, 79.6, 81.9, 82.7, 83.3, null], "%", "in-house search/visit/python harness · 500 steps · 256K context / 64K max output · score subtype unstated"],
    ["deepresearch-bench-ii", [51.1, 46.6, 51.3, 49.2, 52.7, 50.7, 54.1], "%", "Claude Code · identical search tools · four-hour task limit · GPT-5.5 judge · three independent scoring passes"],
    ["mle-bench-lite-humanrank", [86.2, 86.8, 85.8, 81.3, 80.8, 88.9, 88.0], "HumanRank", "Claude Code · 12-hour task limit · HumanRank score"],
    ["swe-bench-pro", [59.6, 58.3, 61.6, 65.1, 60.3, 61.4, 74.7], "%", "OpenHands v1.23.0 · 4.5-hour limit · 250 interaction steps · network disabled and Git history removed"],
    ["terminal-bench-2-1", [78.3, 78.7, null, 89.3, 85.4, 85.1, 90.2], "%", "four-run mean · 12× timeout multiplier capped at 12 hours · 500 turns · Claude Code v2.1.224 except GPT models use Terminus 2"],
    ["bfcl-v4", [77.0, 71.4, 69.1, null, 74.1, null, null], "%", "official BFCL V4 harness commit 6ea5797 · 5,217 cases · temperature 0.001 · weighted overall score"],
    ["automationbench-v1-0-6", [53.8, 41.7, 45.9, 49.7, 49.2, 45.7, 49.4], "%", "v1.0.6 with null-type fix from PR #13 · candidate harness and task count unstated"],
    ["tau3-banking-knowledge-atria", [41.2, 44.3, 37.1, 55.2, 40.2, 46.9, 48.7], "%", "97 Banking Knowledge tasks · modified Tau2/Tau3 runner from commit a2c0247 · alltools BM25/dense/shell retrieval · GPT-5.2 low judge and simulator · 200-step limit"],
    ["workspace-bench-full-atria", [65.0, 55.7, 60.6, 63.9, 63.9, 56.0, 65.8], "%", "AgentCompass · English Full · two-hour limit · 2 CPUs / 8 GiB · Seed 2.0 Lite judge · GPT in Codex, others in Claude Code · metric subtype unstated"],
    ["workspace-bench-lite-atria", [68.2, 58.1, 65.8, 67.4, 67.7, 60.5, 70.1], "%", "AgentCompass · English Lite · two-hour limit · 2 CPUs / 8 GiB · Seed 2.0 Lite judge · GPT in Codex, others in Claude Code · metric subtype unstated"],
    ["gdpval-atria-elo", [1583, 1517, 1611, 1722, 1667, 1682, 1768], "Elo", "220 tasks · AgentCompass / OpenHands · four-hour limit · 250 steps · GLM-5.3 rubric judge · pairwise Elo"],
    ["jobbench", [50.3, 54.1, 54.3, 52.7, 58.2, 45.4, 68.0], "%", "official OpenCode harness · main split / 65 tasks · 7,200-second limit · two attempts · Grok-4.3 judge · mean task score"],
    ["cybergym", [86.5, 83.3, 78.7, 73.8, 84.5, 83.6, null], "%", "Claude Code v2.1.119 · high thinking effort · four-hour-ten-minute limit · 2 CPUs / 4 GB"]
  ];
  for (const [benchmarkId, values, unit, detail] of rows) {
    values.forEach((value, index) => {
      if (value == null) return;
      const modelId = modelIds[index];
      let setting = `${common} · ${detail}`;
      if (benchmarkId === "terminal-bench-2-1" && modelId === "claude-opus-5") setting += " · Opus 4.8 fallback on a subset of tasks";
      observations.push({ id: `o${observations.length + 1}`, sourceIds: [card, report], benchmarkId, modelId, value, unit, setting,
        note: "The official card and paper Table 1 print the same exact value; model-specific snapshot not otherwise identified in this table." });
    });
  }

  const model = models.find((item) => item.id === "atria-dawn-preview");
  model.summary = "GLM-5.2-based 744B MoE agent model; all 16 public evaluation-table results are linked with the paper's per-benchmark protocols.";
  const benchmarkIds = ["skillsbench-text-79-openhands", ...rows.map(([id]) => id)];
  for (const sourceId of [card, report]) {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    Object.assign(audit, { status: "complete", scopeLabel: "16-row main table checked", auditedAt: "2026-10-23",
      expectedObservationCount: 100, benchmarkIds,
      targetModels: [{ modelId: "atria-dawn-preview", expectedObservationCount: 16, benchmarkIds }],
      auditScope: "Every numeric cell in the 16-row, seven-model main evaluation table, with per-benchmark protocols from Appendix B; excludes narrative case-study measurements and chart duplicates.",
      note: "All 100 printed numeric cells are recorded across 16 distinct benchmark views. The SkillsBench row was already present. HumanRank and GDPval Elo are separate from medal rates and percentages; DeepSearchQA, WideSearch, Workspace-Bench, and Banking Knowledge use source-specific views where metric or task identity is insufficiently specified. Source labels, harnesses, judge settings, run counts, and the Opus fallback remain explicit." });
  }
})();
