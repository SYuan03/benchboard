(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, observations } = data;
  data.meta.updated = "2026-10-11";

  const source = {
    id: "terminal-bench-4-official",
    vendorId: "terminal-bench",
    publisher: "Terminal-Bench / Stanford / Harbor / Laude Institute",
    kind: "benchmark",
    date: "2026-10-18",
    tier: "official",
    title: "Terminal-Bench 4.0 — Official Leaderboard (2026-10-18 recheck)",
    url: "https://www.tbench.ai/"
  };
  const currentSource = sources.find((item) => item.id === source.id);
  if (currentSource) Object.assign(currentSource, source);
  else sources.push(source);

  const rows = [
    ["claude-opus-5-5", 64.8, "Claude Code", "max", 3.1, "Sep 22, 2026", "8.0B", "$4.7k"],
    ["claude-sonnet-5-5", 61.8, "Claude Code", "max", 2.9, "Sep 28, 2026", "19.4B", "$7.3k"],
    ["gpt-6-astra", 58.2, "Codex", "max", 2.8, "Sep 3, 2026", "1.5B", "$3.3k"],
    ["gpt-6-1-sol", 58.2, "Codex", "max", 3.1, "Sep 29, 2026", "1.5B", "$634.24"],
    ["claude-fable-5-1", 57.9, "Claude Code", "max", 3.8, "Sep 1, 2026", "2.7B", "$6.2k"],
    ["gpt-6-astra", 57.9, "Codex", "xhigh", 2.7, "Sep 3, 2026", "1.2B", "$2.4k"],
    ["gpt-6-astra", 57.9, "Codex", "high", 3.0, "Sep 3, 2026", "1.2B", "$2.3k"],
    ["claude-fable-5-1", 57.9, "Claude Code", "xhigh", 3.4, "Sep 1, 2026", "2.3B", "$4.9k"],
    ["claude-fable-5-1", 54.5, "Claude Code", "high", 3.4, "Sep 1, 2026", "2.2B", "$4.0k"],
    ["gpt-6-astra", 54.2, "Codex", "medium", 2.7, "Sep 3, 2026", "1.1B", "$1.9k"],
    ["claude-fable-5-1", 53.9, "Claude Code", "medium", 3.4, "Sep 1, 2026", "1.6B", "$2.8k"],
    ["claude-opus-5", 53.9, "Claude Code", "xhigh", 3.2, "Jul 24, 2026", "6.9B", "$6.1k"],
    ["claude-opus-5", 51.8, "Claude Code", "max", 3.4, "Jul 24, 2026", "6.5B", "$6.0k"],
    ["gpt-6-astra", 50.6, "Codex", "low", 2.8, "Sep 3, 2026", "889.8M", "$1.6k"],
    ["claude-opus-5", 50.3, "Claude Code", "high", 3.7, "Jul 24, 2026", "5.5B", "$4.7k"],
    ["gpt-6-sol", 49.4, "Codex", "max", 3.2, "Sep 22, 2026", "5.0B", "$1.5k"],
    ["claude-opus-5", 44.8, "Claude Code", "medium", 3.8, "Jul 24, 2026", "3.7B", "$3.2k"],
    ["claude-fable-5", 44.5, "Claude Code", "max", 3.8, "Jun 9, 2026", "3.8B", "$7.3k"],
    ["claude-fable-5-1", 43.3, "Claude Code", "low", 3.6, "Sep 1, 2026", "1.3B", "$2.4k"],
    ["glm-5-3", 41.8, "Claude Code", "max", 3.2, "Aug 14, 2026", "8.7B", "$2.7k"],
    ["grok-4-7", 37.6, "Grok Build", "xhigh", 3.5, "Sep 21, 2026", "5.5B", "$3.68k (cost partial: 324/330 trials)"],
    ["gpt-5-6-sol", 37.3, "Codex", "max", 3.8, "Jun 26, 2026", "4.4B", "$2.5k"],
    ["glm-5-3-flash", 35.8, "Claude Code", "none", 3.5, "Aug 26, 2026", "2.9B", "$2.9k"],
    ["claude-opus-5", 34.8, "Claude Code", "low", 3.9, "Jul 24, 2026", "2.7B", "$2.4k"],
    ["qwen3-8-max-0902", 27.0, "Claude Code", "max", 3.8, "Sep 2, 2026", "3.0B", "$4.6k"],
    ["claude-opus-4-8", 23.6, "Claude Code", "max", 3.6, "May 28, 2026", "6.4B", "$6.5k"],
    ["gpt-5-6-terra", 21.5, "Codex", "max", 3.3, "Jun 26, 2026", "5.7B", "$1.7k"],
    ["grok-4-6", 20.3, "Grok Build", "high", 3.1, "Aug 12, 2026", "4.0B", "$3.6k"],
    ["gemini-3-8-flash", 19.1, "mini-SWE-agent", "high", 3.4, "Sep 2, 2026", "17.2B", "$1.8k"],
    ["gpt-5-6-luna", 17.3, "Codex", "max", 2.8, "Jun 26, 2026", "11.6B", "$346.67"],
    ["gpt-6-luna", 16.4, "Codex", "max", 2.7, "Sep 22, 2026", "3.9B", "$72.14"],
    ["muse-spark-1-3", 14.5, "Muse Code", "xhigh", 2.9, "Sep 2, 2026", "9.0B", "$0.00 as displayed"],
    ["grok-4-5", 12.4, "Grok Build", "high", 2.6, "Jul 16, 2026", "3.4B", "$2.1k"],
    ["claude-sonnet-5", 12.4, "Claude Code", "max", 3.1, "Jun 30, 2026", "21.6B", "$9.6k"],
    ["gemini-3-7-flash", 11.2, "mini-SWE-agent", "high", 2.4, "Aug 13, 2026", "11.1B", "$1.3k"]
  ];

  for (const [modelId, value, harness, effort, ci, displayDate, tokens, cost] of rows) {
    const setting = `Terminal-Bench 4.0 official leaderboard · ${harness} · ${effort} effort · 95% CI ±${ci} · ${tokens} tokens · ${cost}`;
    const existing = observations.find((item) =>
      item.benchmarkId === "terminal-bench-4-0" &&
      item.modelId === modelId &&
      item.value === value &&
      item.unit === "%" &&
      (item.setting || "") === setting
    );
    if (existing) {
      existing.sourceIds = [...new Set([...(existing.sourceIds || []), source.id])];
      continue;
    }
    observations.push({
      id: `o${observations.length + 1}`,
      sourceIds: [source.id],
      benchmarkId: "terminal-bench-4-0",
      modelId,
      value,
      unit: "%",
      setting,
      note: `Official maintainer leaderboard snapshot; date shown as ${displayDate}.`
    });
  }

  const audit = {
    sourceId: source.id,
    status: "complete",
    scopeLabel: "4.0 主榜已核",
    auditedAt: "2026-10-18",
    auditScope: "Current Terminal-Bench 4.0 official leaderboard: resolution rate for all 35 displayed model–agent–effort rows; confidence intervals, token totals, and cost labels retained in each setting.",
    expectedObservationCount: rows.length,
    benchmarkIds: ["terminal-bench-4-0"],
    note: "Rechecked 2026-10-18: all 35 displayed rows still match stored score, CI, agent, effort, date, token, and cost labels, including multiple effort settings for GPT-6 Astra, Claude Fable 5.1, and Claude Opus 5. These measurements remain separate from provider-reported runs because harness, effort, and execution settings can differ."
  };
  const currentAudit = sourceAudits.find((item) => item.sourceId === source.id);
  if (currentAudit) Object.assign(currentAudit, audit);
  else sourceAudits.push(audit);
})();
