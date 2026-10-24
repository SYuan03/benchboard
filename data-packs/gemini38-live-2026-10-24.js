(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-24";

  const release = "google-gemini38-live-release";
  const card = "deepmind-gemini38-audio-card";
  const method = "deepmind-gemini38-live-evals";
  sources.push(
    { id: release, vendorId: "google", publisher: "Google", kind: "release", date: "2026-09-15", tier: "official",
      title: "Introducing Gemini 3.8 Live and 3.8 Live Extended Thinking",
      url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/" },
    { id: card, vendorId: "google", publisher: "Google DeepMind", kind: "model-card", date: "2026-09-15", tier: "official",
      title: "Gemini 3.8 Audio Model Card",
      url: "https://deepmind.google/models/model-cards/gemini-3-8-audio/" },
    { id: method, vendorId: "google", publisher: "Google DeepMind", kind: "technical-report", date: "2026-09", tier: "official",
      title: "Gemini 3.8 Live and Live Extended Thinking — Model Evaluation",
      url: "https://deepmind.google/models/evals-methodology/gemini-3-8-live/" }
  );

  for (const [id, name, apiId, summary] of [
    ["gemini-3-8-live", "Gemini 3.8 Live", "gemini-3.8-live-preview", "Realtime multimodal voice model; its published minimal/default settings stay distinct from Extended Thinking."],
    ["gemini-3-8-live-extended-thinking", "Gemini 3.8 Live Extended Thinking", "gemini-3.8-live-extended-thinking", "Realtime multimodal voice model with high reasoning in the published Artificial Analysis and Sierra charts."]
  ]) {
    models.push({ id, name, vendorId: "google", vendor: "Google", releaseDate: "2026-09-15", modality: "omni",
      modalityDetail: "Audio, image, video, and text input; audio and text output; optional Live Avatar has video output",
      context: "128K input; 64K output without Live Avatar", access: "Google API / AI Studio",
      aliases: [apiId], sourceId: card, referenceSourceIds: id === "gemini-3-8-live" ? [method] : [release, method], summary });
  }

  benchmarks.push(
    { id: "aa-speech-to-speech-index", name: "Artificial Analysis Speech to Speech Quality Index", category: "音频", direction: "higher",
      description: "Artificial Analysis composite of speech reasoning, agentic performance, Arena preference, and task success; dated source settings must be kept separate." },
    { id: "aa-tau-voice-agentic", name: "Artificial Analysis τ-Voice · Agentic Performance", category: "音频", direction: "higher",
      description: "Artificial Analysis spoken agentic task completion; distinct from τ³-Bench banking knowledge and OpenAI's Tau3 voice average." },
    { id: "aa-input-audio-cost-bba", name: "Artificial Analysis · Input Audio Cost on Big Bench Audio Subset", category: "音频", direction: "lower",
      description: "Measured US dollars per hour of input audio on the Big Bench Audio subset; a cost measure, not a capability score." },
    { id: "sierra-tau3-banking-voice", name: "Sierra τ³-Banking · Voice", category: "音频", direction: "higher",
      description: "Sierra banking voice-agent task success with knowledge-base retrieval and multi-step tool calls; separate from other τ³ voice variants." }
  );
  benchmarkFamilies.push({ id: "aa-speech-to-speech-family", name: "Artificial Analysis Speech to Speech", variants: [
    { benchmarkId: "aa-speech-to-speech-index", label: "Quality Index" },
    { benchmarkId: "aa-tau-voice-agentic", label: "τ-Voice agentic performance" },
    { benchmarkId: "aa-input-audio-cost-bba", label: "Input audio cost · Big Bench Audio subset" }
  ] });

  const rows = [
    ["gemini-3-8-live-extended-thinking", "aa-tau-voice-agentic", 68.6, "%", "high thinking · Gemini API · pass@1"],
    ["gemini-3-8-live", "aa-tau-voice-agentic", 30.1, "%", "Gemini API · pass@1 · thinking level not printed on chart"],
    ["gemini-3-8-live-extended-thinking", "aa-speech-to-speech-index", 82.6, "%", "high thinking · Gemini API · Artificial Analysis composite"],
    ["gemini-3-8-live", "aa-speech-to-speech-index", 76.0, "%", "Gemini API · Artificial Analysis composite · thinking level not printed on chart"],
    ["gemini-3-8-live-extended-thinking", "aa-input-audio-cost-bba", 3.50, "USD/hour", "high thinking · Gemini API · Big Bench Audio subset"],
    ["gemini-3-8-live", "aa-input-audio-cost-bba", 0.84, "USD/hour", "Gemini API · Big Bench Audio subset · thinking level not printed on chart"],
    ["gemini-3-8-live-extended-thinking", "sierra-tau3-banking-voice", 35.1, "%", "high thinking · Gemini API · pass@1 · Sierra τ³-Banking"],
    ["gemini-3-8-live-extended-thinking", "big-bench-audio", 97.7, "%", "high thinking · Gemini API · pass@1 · Google release prose"]
  ];
  for (const [modelId, benchmarkId, value, unit, setting] of rows) {
    const headline = modelId === "gemini-3-8-live-extended-thinking" && benchmarkId !== "aa-input-audio-cost-bba";
    observations.push({ id: `o${observations.length + 1}`, sourceIds: benchmarkId === "big-bench-audio" ? [release] : headline ? [method, release] : [method],
      modelId, benchmarkId, value, unit, setting,
      note: benchmarkId === "big-bench-audio" ? "Exact result stated in Google's release article; task subset not specified." : "Exact label in the official September 2026 evaluation chart." });
  }

  sourceAudits.push(
    { sourceId: release, status: "target-complete", auditedAt: "2026-10-24", scopeLabel: "Live target scores checked",
      targetModels: [{ modelId: "gemini-3-8-live-extended-thinking", expectedObservationCount: 4, benchmarkIds: ["aa-tau-voice-agentic", "aa-speech-to-speech-index", "sierra-tau3-banking-voice", "big-bench-audio"] }],
      auditScope: "Four exact Extended Thinking capability scores in the release prose and linked evaluation charts; base Live chart scores are attributed to the method PDF.",
      note: "The article was published September 15 and updated September 17. The release's 82.6, 68.6, 35.1, and 97.7 target values match the linked evaluation material. EVA-Bench's scatter plot has no printed exact coordinates, so no value was inferred." },
    { sourceId: card, status: "metadata-only", auditedAt: "2026-10-24", scopeLabel: "Live model identities checked",
      note: "The card confirms the two Live variants, input/output modalities, context limits, and API access. It also covers two Flash TTS variants; their linked evaluation PDF labels its scored TTS target as Gemini 3.1 Flash TTS, so no 3.8 TTS score is attributed from that chart." },
    { sourceId: method, status: "target-complete", auditedAt: "2026-10-24", scopeLabel: "Live chart target values checked",
      auditScope: "Seven exact target values from the Artificial Analysis and Sierra charts for both Gemini 3.8 Live variants; excludes comparison models and the EVA-Bench scatter plot without exact point labels.",
      targetModels: [
        { modelId: "gemini-3-8-live-extended-thinking", expectedObservationCount: 4,
          benchmarkIds: ["aa-tau-voice-agentic", "aa-speech-to-speech-index", "aa-input-audio-cost-bba", "sierra-tau3-banking-voice"] },
        { modelId: "gemini-3-8-live", expectedObservationCount: 3,
          benchmarkIds: ["aa-tau-voice-agentic", "aa-speech-to-speech-index", "aa-input-audio-cost-bba"] }
      ],
      note: "The PDF identifies API model IDs, high thinking for Extended Thinking, default sampling, and pass@1 except where noted. The base Live chart omits a thinking-level label. Artificial Analysis input-audio cost is kept separate from capability scores." }
  );
})();
