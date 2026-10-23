(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-23";
  const release = "mistral-voxtral3-release";
  const specs = [
    ["voxtral-small-transcribe-3", "Voxtral Small Transcribe 3", "voxtral-small-transcribe-3-0", "音频 → 文本；转录与说话人分离", "32K"],
    ["voxtral-mini-transcribe-3", "Voxtral Mini Transcribe 3", "voxtral-mini-transcribe-3-0", "音频 → 文本；转录与说话人分离", "32K"],
    ["voxtral-mini-transcribe-realtime-3", "Voxtral Mini Transcribe Realtime 3", "voxtral-mini-transcribe-realtime-3-0", "流式音频 → 文本；可调延迟与轮次结束检测", "未公布"],
    ["voxtral-mini-tts-3", "Voxtral Mini TTS 3", "voxtral-mini-tts-3-0", "文本 → 音频；语音合成与声音适配", "未公布"]
  ];
  sources.push({ id: release, vendorId: "mistral", publisher: "Mistral AI", date: "2026-10-22", tier: "official", kind: "release",
    title: "Voxtral 3: Voice Agent SDK & Speech Models in 50+ Languages", url: "https://mistral.ai/news/voxtral-3/" });
  for (const [id, name, slug, modalityDetail, context] of specs) {
    const docId = `${id}-docs`;
    sources.push({ id: docId, vendorId: "mistral", publisher: "Mistral AI", date: "2026-10-20", tier: "official", kind: "documentation",
      title: `${name} — Official Model Documentation`, url: `https://docs.mistral.ai/models/${slug}` });
    models.push({ id, name, vendorId: "mistral", vendor: "Mistral AI", releaseDate: "2026-10-20",
      modality: "omni", modalityDetail, context, access: "API / 可自托管", aliases: [slug], sourceId: docId,
      referenceSourceIds: [release], summary: id === "voxtral-mini-tts-3"
        ? "Voxtral 3 语音合成模型；发布页称 35+ 语言，模型文档称 9 种语言，覆盖范围待澄清。"
        : "Voxtral 3 语音模型；发布页提供分语种、分说话人或延迟配置的准确成绩。" });
    sourceAudits.push({ sourceId: docId, status: "metadata-only", auditedAt: "2026-10-23", scopeLabel: "Model identity checked",
      note: "Official model documentation establishes the exact API identifier, October 20 preview date, and model identity. The scored comparison charts are on the October 22 release page." });
  }

  const newBenchmarks = [
    ["fleurs45-forced-wer-voxtral3", "FLEURS-45 · Forced language · Macro WER/CER", "语音 / 音频", "lower", "45-language intersection; WER except Japanese, Korean, Thai, and Chinese use CER; language supplied to model."],
    ["fleurs45-inferred-wer-voxtral3", "FLEURS-45 · Inferred language · Macro WER/CER", "语音 / 音频", "lower", "Same 45-language intersection, with language detected by model; WER except four languages use CER."],
    ["voxtral3-diarization-cpwer", "Diarization · Macro cpWER", "语音 / 音频", "lower", "Macro cpWER across AMI-IHM/SDM, Switchboard/CallHome, and AISHELL-4; 30-minute AMI/AISHELL versions."],
    ["earnings22-keyphrase-no-context", "Earnings-22 · Keyphrase recall · Without context", "语音 / 音频", "higher", "Keyphrase recall without contextual prompting; distinct from context-biased run."],
    ["earnings22-keyphrase-context", "Earnings-22 · Keyphrase recall · With context", "语音 / 音频", "higher", "Context bias includes keyterms and 0–100 randomly sampled distractors."],
    ["aa-wer-index-voxtral3", "Artificial Analysis WER Index · Mistral chart", "语音 / 音频", "lower", "Mistral release reproduces Artificial Analysis weighted WER across VoxPopuli, Earnings-22, and AgentTalk."],
    ["fleurs35-realtime-wer-voxtral3", "FLEURS-35 · Realtime macro WER/CER", "语音 / 音频", "lower", "35-language macro WER; Japanese, Korean, Chinese use CER. Offline Mini 3 appears as a labeled baseline."],
    ["voicecodebench-faithful-clips", "Voice Code Bench · Faithful clips", "语音 / 音频", "higher", "BeSimple AI's 300 English prompts, two voices per system; Gemini 3.8 Flash judge."],
    ["voxtral3-pronunciation-control", "Pronunciation control · Accurate clips", "语音 / 音频", "higher", "Internal 300-sentence rare-word set, two voices, intended IPA heard by Gemini 3.8 Flash judge."],
    ["voxtral3-multilingual-tts-judge", "Multilingual TTS · Mean judge score", "语音 / 音频", "higher", "Internal 377-prompt, 11-language subset; unweighted mean of per-language scores on 1–5 scale."],
    ["voxtral3-expressive-english-judge", "Expressive English TTS · Mean judge score", "语音 / 音频", "higher", "Internal one_eval 237-prompt subset, Sarah and James voices, judge score on 1–5 scale."]
  ];
  for (const [id, name, , direction, description] of newBenchmarks) benchmarks.push({ id, name, category: "音频", direction, description });
  benchmarkFamilies.push(
    { id: "fleurs45-voxtral3-family", name: "FLEURS-45 Transcription", variants: [
      { benchmarkId: "fleurs45-forced-wer-voxtral3", label: "Forced language · WER/CER" },
      { benchmarkId: "fleurs45-inferred-wer-voxtral3", label: "Inferred language · WER/CER" }] },
    { id: "earnings22-keyphrase-family", name: "Earnings-22 Keyphrase Recall", variants: [
      { benchmarkId: "earnings22-keyphrase-no-context", label: "Without context" },
      { benchmarkId: "earnings22-keyphrase-context", label: "With context" }] }
  );

  const rows = [
    ["voxtral-small-transcribe-3", "fleurs45-forced-wer-voxtral3", 4.0, "%", "macro WER/CER · 45 languages · forced language"],
    ["voxtral-small-transcribe-3", "fleurs45-inferred-wer-voxtral3", 4.1, "%", "macro WER/CER · 45 languages · inferred language"],
    ["voxtral-mini-transcribe-3", "fleurs45-forced-wer-voxtral3", 4.5, "%", "macro WER/CER · 45 languages · forced language"],
    ["voxtral-mini-transcribe-3", "fleurs45-inferred-wer-voxtral3", 4.6, "%", "macro WER/CER · 45 languages · inferred language"],
    ["voxtral-small-transcribe-3", "voxtral3-diarization-cpwer", 18.4, "%", "macro cpWER · AMI-IHM/SDM, Switchboard/CallHome, AISHELL-4"],
    ["voxtral-mini-transcribe-3", "voxtral3-diarization-cpwer", 18.6, "%", "macro cpWER · same public diarization set"],
    ["voxtral-small-transcribe-3", "earnings22-keyphrase-no-context", 81.4, "%", "keyphrase recall · without context bias"],
    ["voxtral-small-transcribe-3", "earnings22-keyphrase-context", 94.6, "%", "keyphrase recall · with keyterms and 0–100 distractors"],
    ["voxtral-small-transcribe-3", "aa-wer-index-voxtral3", 2.10, "%", "Artificial Analysis weighted WER · republished in Mistral chart"],
    ["voxtral-mini-transcribe-3", "aa-wer-index-voxtral3", 2.22, "%", "Artificial Analysis weighted WER · republished in Mistral chart"],
    ["voxtral-mini-transcribe-realtime-3", "fleurs35-realtime-wer-voxtral3", 5.7, "%", "realtime · 2,400 ms latency configuration"],
    ["voxtral-mini-transcribe-realtime-3", "fleurs35-realtime-wer-voxtral3", 6.0, "%", "realtime · 960 ms latency configuration"],
    ["voxtral-mini-transcribe-realtime-3", "fleurs35-realtime-wer-voxtral3", 6.4, "%", "realtime · 480 ms latency configuration"],
    ["voxtral-mini-transcribe-realtime-3", "fleurs35-realtime-wer-voxtral3", 7.4, "%", "realtime · 240 ms latency configuration"],
    ["voxtral-mini-transcribe-3", "fleurs35-realtime-wer-voxtral3", 4.0, "%", "offline Mini Transcribe 3 baseline on same 35-language set"],
    ["voxtral-mini-tts-3", "voicecodebench-faithful-clips", 79.6667, "%", "BeSimple AI · 300 English prompts · two voices · Gemini 3.8 Flash judge"],
    ["voxtral-mini-tts-3", "voxtral3-pronunciation-control", 86.83, "%", "internal · 300 English sentences / two voices · Gemini 3.8 Flash judge"],
    ["voxtral-mini-tts-3", "voxtral3-multilingual-tts-judge", 3.1632, "Score", "internal · 377 selected prompts / 11 languages · 1–5 judge scale · Gemini 3.8 Flash"],
    ["voxtral-mini-tts-3", "voxtral3-expressive-english-judge", 3.1266, "Score", "internal one_eval · 237 selected prompts / two voices · 1–5 judge scale · Gemini 3.8 Flash"]
  ];
  for (const [modelId, benchmarkId, value, unit, detail] of rows) {
    observations.push({ id: `o${observations.length + 1}`, sourceIds: [release], modelId, benchmarkId, value, unit,
      setting: `Voxtral 3 official release chart · ${detail}`,
      note: "Exact chart-spec value; source-specific model variant and evaluation configuration retained. Chart price x-axis is not a capability score." });
  }
  sourceAudits.push({ sourceId: release, status: "target-complete", auditedAt: "2026-10-23", scopeLabel: "Four Voxtral 3 target variants checked",
    targetModels: specs.map(([modelId]) => ({ modelId,
      expectedObservationCount: rows.filter(([id]) => id === modelId).length,
      benchmarkIds: [...new Set(rows.filter(([id]) => id === modelId).map(([, id]) => id))] })),
    auditScope: "All 19 exact scores for the four named Voxtral 3 models across nine embedded release-chart JSON specifications; comparison models and chart price axes excluded.",
    note: "The October 22 release embeds nine exact chart specs. FLEURS-45 forced/inferred, FLEURS-35 realtime latencies, offline Mini baseline, cpWER, Earnings-22 context conditions, Artificial Analysis WER Index, and four TTS quality metrics are distinct. TTS internal evaluations retain their judge and sample settings. The release says 35+ TTS languages, while the TTS model documentation says nine; this source conflict is documented without asserting either count as settled." });
})();
