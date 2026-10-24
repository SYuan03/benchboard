(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-24";
  const release = "xai-grok-voice3-release";
  const live = "aa-speech-to-speech-2026-10-24";
  const docs = "xai-grok-voice-api-docs";

  sources.push(
    { id: release, vendorId: "xai", publisher: "SpaceXAI", kind: "release", date: "2026-10-14", tier: "official",
      title: "Introducing Grok Voice 3.0", url: "https://x.ai/news/grok-voice-3" },
    { id: live, vendorId: "artificial-analysis", publisher: "Artificial Analysis", kind: "benchmark", date: "2026-10-24", tier: "official",
      title: "Speech to Speech Models and Providers — October 24 Snapshot", url: "https://artificialanalysis.ai/speech-to-speech" },
    { id: docs, vendorId: "xai", publisher: "SpaceXAI", kind: "documentation", date: "2026-10-24", tier: "official",
      title: "Voice Overview — Speech to Speech API", url: "https://docs.x.ai/developers/model-capabilities/audio/voice" }
  );
  const modelId = "grok-voice-3-0";
  models.push({ id: modelId, name: "Grok Voice 3.0", vendorId: "xai", vendor: "SpaceXAI", releaseDate: "2026-10-14",
    modality: "omni", modalityDetail: "Realtime audio input and spoken output with tool use; additional native input modalities are not stated on the cited voice docs",
    context: "Not stated in official voice release or API overview", access: "Speech to Speech API",
    aliases: ["Grok Voice 3.0"], sourceId: release, referenceSourceIds: [live, docs],
    summary: "October 2026 speech-to-speech release. The grok-voice-latest API alias is mutable, so dated benchmark values stay on this version." });

  benchmarks.push(
    { id: "aa-speech-agent-arena-elo", name: "Artificial Analysis Speech Agent Arena · Elo", category: "音频", direction: "higher",
      description: "Live blind-pairwise voice preference rating; published snapshots can change with additional votes." },
    { id: "aa-voice-task-success", name: "Artificial Analysis Speech Agent Arena · Task Success", category: "音频", direction: "higher",
      description: "Task completion rate from blind voice calls; distinct from τ-Voice customer-support scenarios." },
    { id: "aa-full-duplex-dynamics", name: "Artificial Analysis Full Duplex Bench · Conversational Dynamics", category: "音频", direction: "higher",
      description: "Artificial Analysis subset of Full Duplex Bench v1 and v1.5 covering turn-taking, interruptions, pauses, and backchannels." },
    { id: "aa-time-to-first-audio", name: "Artificial Analysis · Time to First Audio", category: "音频", direction: "lower",
      description: "Seconds to first generated audio on Big Bench Audio prompts, as measured by the benchmark maintainer." },
    { id: "eva-bench-voice-accuracy", name: "ServiceNow EVA-Bench · Voice Agent Accuracy", category: "音频", direction: "higher",
      description: "Enterprise voice-agent task accuracy across 200+ scenarios; distinct from EVA-Bench conversational experience." }
  );
  const family = benchmarkFamilies.find((item) => item.id === "aa-speech-to-speech-family");
  for (const [benchmarkId, label] of [
    ["aa-speech-agent-arena-elo", "Speech Agent Arena · Elo"],
    ["aa-voice-task-success", "Speech Agent Arena · task success"],
    ["aa-full-duplex-dynamics", "Full Duplex · conversational dynamics"],
    ["aa-time-to-first-audio", "Time to first audio"]
  ]) family.variants.push({ benchmarkId, label });

  const rows = [
    ["aa-speech-to-speech-index", 86.9, "%", "October 13 release table · Artificial Analysis Speech to Speech Index", [release, live]],
    ["big-bench-audio", 98.5, "%", "October 13 release table · Artificial Analysis speech reasoning · 1,000 audio questions", [release, live]],
    ["aa-speech-agent-arena-elo", 1070, "Elo", "October 13 release table · Speech Agent Arena snapshot", [release]],
    ["aa-voice-task-success", 94.8, "%", "October 13 release table · blind-call task success", [release, live]],
    ["aa-full-duplex-dynamics", 97.0, "%", "October 13 release table · Artificial Analysis Full Duplex Bench subset", [release, live]],
    ["aa-tau-voice-agentic", 71.6, "%", "October 13 release article · Artificial Analysis τ-Voice customer-support tasks", [release, live]],
    ["eva-bench-voice-accuracy", 74.0, "%", "SpaceXAI release · ServiceNow EVA-Bench · 200+ enterprise scenarios", [release]],
    ["aa-speech-agent-arena-elo", 1064, "Elo", "Artificial Analysis live leaderboard · October 24 snapshot", [live]],
    ["aa-time-to-first-audio", 0.81, "s", "Artificial Analysis live leaderboard · October 24 snapshot · Big Bench Audio prompts", [live]],
    ["aa-input-audio-cost-bba", 4.80, "USD/hour", "Artificial Analysis live leaderboard · October 24 snapshot · 40-question Big Bench Audio subset", [live]]
  ];
  for (const [benchmarkId, value, unit, setting, sourceIds] of rows) {
    observations.push({ id: `o${observations.length + 1}`, sourceIds, modelId, benchmarkId, value, unit, setting,
      note: benchmarkId === "aa-speech-agent-arena-elo" ? "Arena Elo is dynamic: the October 13 release cited 1070; the October 24 maintainer page displayed 1064." :
        "Release-table values and benchmark-maintainer values share provenance when both sources publish the same exact result." });
  }
  observations.push({ id: `o${observations.length + 1}`, sourceIds: [live], modelId: "gemini-3-8-live",
    benchmarkId: "aa-speech-to-speech-index", value: 74.5, unit: "%",
    setting: "Artificial Analysis live leaderboard · October 24 snapshot · index methodology as displayed by maintainer",
    note: "The live 74.5% differs from Google's September evaluation chart (76.0%); these are separate dated observations, not a corrected value." });

  sourceAudits.push(
    { sourceId: release, status: "target-complete", auditedAt: "2026-10-24", scopeLabel: "Voice 3.0 target scores checked",
      targetModels: [{ modelId, expectedObservationCount: 7,
        benchmarkIds: ["aa-speech-to-speech-index", "big-bench-audio", "aa-speech-agent-arena-elo", "aa-voice-task-success", "aa-full-duplex-dynamics", "aa-tau-voice-agentic", "eva-bench-voice-accuracy"] }],
      auditScope: "All five exact Grok Voice 3.0 target cells in the October 13 Artificial Analysis comparison table, plus the exact τ-Voice and ServiceNow EVA-Bench percentages in the release prose.",
      note: "The release cites Artificial Analysis's October 13 snapshot. Its 1070 Speech Agent Arena Elo differs from the live maintainer's 1064 on October 24, so the two dated observations remain separate. Relative latency and cost comparisons without exact point values were excluded." },
    { sourceId: live, status: "partial", auditedAt: "2026-10-24", scopeLabel: "Voice target rows checked",
      expectedObservationCount: 9,
      benchmarkIds: ["aa-speech-to-speech-index", "big-bench-audio", "aa-speech-agent-arena-elo", "aa-voice-task-success", "aa-full-duplex-dynamics", "aa-tau-voice-agentic", "aa-time-to-first-audio", "aa-input-audio-cost-bba"],
      auditScope: "Grok Voice 3.0's eight exact performance, preference, latency, and measured-cost columns plus Gemini 3.8 Live's conflicting current Index value in the October 24 live maintainer table; other model rows excluded. Big Bench Audio exact 98.5% is corroborated by the maintainer FAQ because the table rounds to 99%.",
      note: "The live row agrees with the release on the five shared fixed scores but shows Arena Elo 1064 instead of the October 13 release's 1070. Live values are a dated snapshot. The same page currently displays Gemini 3.8 Live Index 74.5 versus 76.0 in Google's September evaluation PDF; those values must not be silently merged." },
    { sourceId: docs, status: "metadata-only", auditedAt: "2026-10-24", scopeLabel: "Voice API route checked",
      note: "The docs identify grok-voice-latest as a mutable realtime speech-to-speech API route with tool use and $0.08/min pricing; they do not publish a version-pinned capability table." }
  );
})();
