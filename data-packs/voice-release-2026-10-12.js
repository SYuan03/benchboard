(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-12";

  const sourceRows = [
    { id: "openai-gpt-live-1-api", vendorId: "openai", publisher: "OpenAI", date: "2026-09-10", tier: "official", title: "Build more natural voice experiences with GPT-Live-1 in the API", url: "https://openai.com/index/introducing-gpt-live-1-in-the-api/" },
    { id: "openai-gpt-realtime-2-api", vendorId: "openai", publisher: "OpenAI", date: "2026-05-07", tier: "official", title: "Advancing voice intelligence with new models in the API", url: "https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/" }
  ];
  sources.push(...sourceRows);

  models.push(
    { id: "gpt-live-1", name: "GPT-Live-1", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-09-10", modality: "omni", modalityDetail: "同时接收和生成音频；可输出转录文本，并委托后端模型推理与工具调用", context: "未在来源中单列", access: "闭源 API", aliases: ["gpt-live-1"], sourceId: "openai-gpt-live-1-api", summary: "全双工语音前端；Tau3 与部分 Full Duplex 结果搭配指定后端模型。" },
    { id: "gpt-realtime-2", name: "GPT-Realtime-2", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-05-07", modality: "omni", modalityDetail: "实时语音输入与输出；支持工具调用", context: "128K", access: "闭源 API", aliases: ["gpt-realtime-2"], sourceId: "openai-gpt-realtime-2-api", referenceSourceIds: ["openai-gpt-live-1-api"], summary: "OpenAI 实时语音模型，来源中的 high 与 xhigh 推理设置分开保存。" },
    { id: "gpt-realtime-2-1", name: "GPT-Realtime-2.1", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-09-10 or earlier", modality: "omni", modalityDetail: "实时语音输入与输出；来源未单列配置", context: "未核实", access: "闭源 API", aliases: ["gpt-realtime-2.1"], sourceId: "openai-gpt-live-1-api", scoreStatus: "comparison-only", summary: "GPT-Live-1 官方图表中的精确对照版本；独立发布日期未核实。" },
    { id: "gpt-realtime-1-5", name: "GPT-Realtime-1.5", vendorId: "openai", vendor: "OpenAI", releaseDate: "2026-05-07 or earlier", modality: "omni", modalityDetail: "实时语音输入与输出；来源未单列配置", context: "未核实", access: "闭源 API", aliases: ["gpt-realtime-1.5"], sourceId: "openai-gpt-realtime-2-api", scoreStatus: "comparison-only", summary: "GPT-Realtime-2 官方图表中的精确对照版本；独立发布日期未核实。" }
  );

  const benchmarkRows = [
    { id: "tau3-voice", name: "Tau3 (Voice) Intelligence", category: "音频", direction: "higher", description: "航空、零售和电信语音客服任务的等权平均 Pass@1；语音前端与后端模型按来源设置区分。" },
    { id: "tau-banking-voice", name: "Tau Banking (Voice) Knowledge", category: "音频", direction: "higher", description: "97 个 banking_knowledge 语音任务的 Pass@1，含知识检索与账户工具。" },
    { id: "aa-conversational-dynamics", name: "Artificial Analysis Conversational Dynamics", category: "音频", direction: "higher", description: "语音暂停、轮流发言、打断和简短回应的对话动态评测。" },
    { id: "full-duplex-1-5-interactivity", name: "Full Duplex Bench v1.5 · Interactivity", category: "音频", direction: "higher", description: "背景说话、对他人说话、听者简短回应和打断的交互评测。" },
    { id: "full-duplex-1-turn-latency", name: "Full Duplex Bench v1 · Turn-taking Latency", category: "音频", direction: "lower", description: "用户结束一轮发言后，语音代理开始回答的时间。" },
    { id: "full-duplex-3-tool-calling", name: "Full Duplex Bench v3 · Tool Calling", category: "音频", direction: "higher", description: "含自然停顿、犹豫和自我纠正的语音请求；工具调用序列 Pass@1。" },
    { id: "full-duplex-3-response-quality", name: "Full Duplex Bench v3 · Response Quality", category: "音频", direction: "higher", description: "含工具使用的语音请求；口头回答与参考意图的一致程度。" },
    { id: "big-bench-audio", name: "Big Bench Audio · Intelligence", category: "音频", direction: "higher", description: "OpenAI GPT-Realtime-2 发布图表中的音频推理能力结果。" },
    { id: "audio-multichallenge-instruction", name: "Audio MultiChallenge · Instruction Following", category: "音频", direction: "higher", description: "OpenAI GPT-Realtime-2 发布图表中的多轮语音指令遵循结果。" }
  ];
  benchmarks.push(...benchmarkRows);

  const addVariant = (familyId, familyName, variantRows) => {
    let family = benchmarkFamilies.find((item) => item.id === familyId);
    if (!family) {
      family = { id: familyId, name: familyName, variants: [] };
      benchmarkFamilies.push(family);
    }
    for (const [benchmarkId, label] of variantRows) {
      if (!family.variants.some((item) => item.benchmarkId === benchmarkId)) family.variants.push({ benchmarkId, label });
    }
  };
  addVariant("tau3-family", "τ³-bench", [["tau3-voice", "Voice · airline/retail/telecom"], ["tau-banking-voice", "Voice · banking knowledge"]]);
  addVariant("full-duplex-family", "Full Duplex Bench", [["full-duplex-1-5-interactivity", "v1.5 · interactivity"], ["full-duplex-1-turn-latency", "v1 · turn-taking latency"], ["full-duplex-3-tool-calling", "v3 · tool calling"], ["full-duplex-3-response-quality", "v3 · response quality"]]);
  addVariant("audio-multichallenge-family", "Audio MultiChallenge", [["audio-multichallenge", "Published audio result"], ["audio-multichallenge-instruction", "Instruction following"]]);

  const liveModels = ["gpt-live-1", "gpt-realtime-2-1", "gpt-realtime-2"];
  const liveRows = [
    ["tau3-voice", [86.2, 45.7, 42.4], "%", "spoken airline/retail/telecom · equal-weight Pass@1", "GPT-6 Astra · medium reasoning"],
    ["tau-banking-voice", [32.0, 12.4, 10.3], "%", "97 banking_knowledge tasks · Pass@1", "GPT-6 Astra · medium reasoning"],
    ["aa-conversational-dynamics", [97.3, 95.7, 95.3], "%", "Artificial Analysis · pause/turn-taking/interruption/backchannel evaluation", null],
    ["full-duplex-1-5-interactivity", [80.1, 45.4, 47.8], "%", "background speech and interruption evaluation", null],
    ["full-duplex-1-turn-latency", [0.798, 1.41, 1.63], "s", "time from end of user turn to start of reply · displayed chart labels", null],
    ["full-duplex-3-tool-calling", [87.0, 60.0, 58.0], "%", "spoken requests with pauses/corrections · tool-call sequence Pass@1", "GPT-5.6 Terra · low reasoning"],
    ["full-duplex-3-response-quality", [90.0, 88.0, 81.0], "%", "spoken tool-using requests · answer/reference-intent match", "GPT-5.6 Terra · low reasoning"]
  ];
  for (const [benchmarkId, values, unit, detail, liveBackend] of liveRows) {
    values.forEach((value, index) => {
      const setting = ["OpenAI release chart", detail, index === 0 && liveBackend ? `GPT-Live-1 backend: ${liveBackend}` : null].filter(Boolean).join(" · ");
      observations.push({ id: `o${observations.length + 1}`, sourceIds: ["openai-gpt-live-1-api"], benchmarkId, modelId: liveModels[index], value, unit, setting, note: "Values use the chart's displayed labels; realtime comparison configurations are not specified on the page." });
    });
  }

  for (const [benchmarkId, modelId, value, setting] of [
    ["big-bench-audio", "gpt-realtime-2", 96.6, "OpenAI release chart · high reasoning"],
    ["big-bench-audio", "gpt-realtime-1-5", 81.4, "OpenAI release chart · reasoning setting unspecified"],
    ["audio-multichallenge-instruction", "gpt-realtime-2", 48.5, "OpenAI release chart · xhigh reasoning"],
    ["audio-multichallenge-instruction", "gpt-realtime-1-5", 34.7, "OpenAI release chart · reasoning setting unspecified"]
  ]) {
    observations.push({ id: `o${observations.length + 1}`, sourceIds: ["openai-gpt-realtime-2-api"], benchmarkId, modelId, value, unit: "%", setting, note: "Exact percentage from the official embedded chart data." });
  }

  sourceAudits.push(
    { sourceId: "openai-gpt-live-1-api", status: "complete", scopeLabel: "公开语音能力图表已核", auditedAt: "2026-10-12", auditScope: "All seven published voice benchmark charts, three exact model labels per chart; chart versions, metrics, backend footnotes and latency unit retained.", expectedObservationCount: 21, benchmarkIds: liveRows.map((row) => row[0]), note: "All 21 displayed chart values were checked against the official page's embedded chart data and captions. Approximate marketing deltas and customer anecdotes were excluded." },
    { sourceId: "openai-gpt-realtime-2-api", status: "complete", scopeLabel: "公开语音能力图表已核", auditedAt: "2026-10-12", auditScope: "Both published Big Bench Audio and Audio MultiChallenge charts, two exact model labels per chart.", expectedObservationCount: 4, benchmarkIds: ["big-bench-audio", "audio-multichallenge-instruction"], note: "Both chart target and comparison columns were checked; high and xhigh reasoning are attached only to the GPT-Realtime-2 rows. Customer-specific and relative-only claims were excluded." }
  );
})();
