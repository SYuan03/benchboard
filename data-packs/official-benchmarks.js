(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const sourceById = (id) => sources.find((item) => item.id === id);
  const auditById = (id) => sourceAudits.find((item) => item.sourceId === id);
  const benchmarkById = (id) => benchmarks.find((item) => item.id === id);
  const modelById = (id) => models.find((item) => item.id === id);

  const patchSource = (id, patch) => Object.assign(sourceById(id), patch);
  const patchAudit = (id, patch) => Object.assign(auditById(id), patch);
  const ensureBenchmark = (row) => {
    const current = benchmarkById(row.id);
    if (current) Object.assign(current, row);
    else benchmarks.push(row);
  };
  const ensureModel = ([id, name, vendorId, vendor, modality, sourceId, ...aliases]) => {
    const current = modelById(id);
    if (current) {
      current.aliases = [...new Set([...(current.aliases || []), name, ...aliases])];
      return;
    }
    models.push({
      id,
      name,
      vendorId,
      vendor,
      releaseDate: "2026",
      modality,
      modalityDetail: modality === "omni"
        ? "文本、图像、音频或视频输入；精确接口能力待模型一手资料补证"
        : modality === "vision"
          ? "文本、图像输入；精确接口能力待模型一手资料补证"
          : "文本输入；benchmark 维护方未声明原生视觉输入能力",
      context: "benchmark 维护方未披露",
      access: "benchmark 维护方未披露",
      aliases: [...new Set([name, ...aliases])],
      sourceId,
      scoreStatus: "comparison-only",
      summary: `按 ${sourceById(sourceId)?.publisher || "benchmark 维护方"} 榜单原始标签登记的对照模型；模型元数据等待一手模型页补证。`
    });
  };
  const setFamily = (id, name, variants) => {
    const claimed = new Set(variants.map((variant) => variant.benchmarkId));
    for (let index = benchmarkFamilies.length - 1; index >= 0; index -= 1) {
      const family = benchmarkFamilies[index];
      if (family.id === id) continue;
      family.variants = family.variants.filter((variant) => !claimed.has(variant.benchmarkId));
      if (family.variants.length < 2) benchmarkFamilies.splice(index, 1);
    }
    const current = benchmarkFamilies.find((family) => family.id === id);
    if (current) Object.assign(current, { name, variants });
    else benchmarkFamilies.push({ id, name, variants });
  };
  const detachSource = (sourceId) => {
    for (let index = observations.length - 1; index >= 0; index -= 1) {
      const observation = observations[index];
      if (!observation.sourceIds.includes(sourceId)) continue;
      if (observation.sourceIds.length === 1) observations.splice(index, 1);
      else observation.sourceIds = observation.sourceIds.filter((id) => id !== sourceId);
    }
  };
  const add = (sourceId, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    observations.push({
      id: `o${observations.length + 1}`,
      sourceIds: [sourceId],
      benchmarkId,
      modelId,
      value,
      unit,
      setting,
      note
    });
  };

  patchSource("skillsbench-1-1", {
    date: "2026-07-16",
    title: "SkillsBench 1.1 — Official Agent Leaderboard",
    url: "https://www.skillsbench.ai/leaderboard"
  });
  patchSource("pinchbench-v2", {
    date: "2026-08-18",
    title: "PinchBench v2.0.0 — Official OpenClaw Leaderboard",
    url: "https://pinchbench.com/"
  });
  patchSource("wildclawbench", {
    date: "2026-07-20",
    title: "WildClawBench — Official OpenClaw Leaderboard",
    url: "https://internlm.github.io/WildClawBench/"
  });
  patchSource("qwenclawbench", {
    date: "2026-04",
    title: "QwenClawBench v1.1 — Official Leaderboard",
    url: "https://skylenage-ai.github.io/QwenClawBench-Leaderboard/"
  });
  patchSource("workspacebench", {
    date: "2026-08-17",
    title: "Workspace-Bench — Official Lite Leaderboard",
    url: "https://workspace-bench.github.io/leaderboard.html"
  });
  patchSource("claweval", {
    date: "2026-05-09",
    title: "Claw-Eval v1.1 — Official Leaderboard",
    url: "https://claw-eval.github.io/"
  });
  patchSource("rngbench", {
    date: "2026-07-07",
    title: "RNG-Bench — Official Results",
    url: "https://internlm.github.io/RNGBench/"
  });

  [
    ["claude-sonnet-4-6", "Claude Sonnet 4.6", "anthropic", "Anthropic", "vision", "skillsbench-1-1", "Sonnet 4.6", "anthropic/claude-sonnet-4.6"],
    ["claude-haiku-4-5", "Claude Haiku 4.5", "anthropic", "Anthropic", "vision", "skillsbench-1-1", "Haiku 4.5", "anthropic/claude-haiku-4.5"],
    ["minimax-m3", "MiniMax M3", "minimax", "MiniMax", "language", "skillsbench-1-1", "MiniMax-M3"],
    ["hy3", "Hy3", "tencent", "Tencent Hy", "language", "skillsbench-1-1", "HY3"],
    ["nemotron-3-ultra-550b-a55b", "Nemotron 3 Ultra 550B-A55B", "nvidia", "NVIDIA", "language", "pinchbench-v2", "nvidia/nemotron-3-ultra-550b-a55b"],
    ["mimo-v2-5", "MiMo V2.5", "xiaomi", "Xiaomi", "vision", "pinchbench-v2", "xiaomi/mimo-v2.5"],
    ["grok-build-0-1", "Grok Build 0.1", "xai", "xAI", "language", "pinchbench-v2", "x-ai/grok-build-0.1"],
    ["qwen3-6-flash", "Qwen3.6 Flash", "alibaba", "Alibaba Qwen", "vision", "pinchbench-v2", "qwen/qwen3.6-flash"],
    ["mimo-v2-5-pro", "MiMo V2.5 Pro", "xiaomi", "Xiaomi", "vision", "pinchbench-v2", "xiaomi/mimo-v2.5-pro"],
    ["nemotron-3-5-lightning-30b-a3b", "Nemotron 3.5 Lightning 30B-A3B", "nvidia", "NVIDIA", "language", "pinchbench-v2", "nvidia/nemotron-3.5-lightning-30b-a3b"],
    ["ling-2-6-1t", "Ling 2.6 1T", "inclusionai", "InclusionAI", "language", "pinchbench-v2", "inclusionai/ling-2.6-1t"],
    ["deepseek-v4-flash", "DeepSeek V4 Flash", "deepseek", "DeepSeek", "language", "pinchbench-v2", "deepseek/deepseek-v4-flash"],
    ["gemini-3-1-pro", "Gemini 3.1 Pro Preview", "google", "Google DeepMind", "omni", "pinchbench-v2", "google/gemini-3.1-pro-preview", "gemini-3.1-pro-preview"],
    ["gemini-3-1-flash-lite", "Gemini 3.1 Flash Lite", "google", "Google DeepMind", "omni", "pinchbench-v2", "google/gemini-3.1-flash-lite"],
    ["grok-4-20", "Grok 4.20", "xai", "xAI", "vision", "pinchbench-v2", "x-ai/grok-4.20"],
    ["step-3-5-flash", "Step 3.5 Flash", "stepfun", "StepFun", "language", "pinchbench-v2", "stepfun/step-3.5-flash"],
    ["gpt-5-4-mini", "GPT-5.4 Mini", "openai", "OpenAI", "vision", "pinchbench-v2", "openai/gpt-5.4-mini"],
    ["kimi-k2-7-code", "Kimi K2.7 Code", "moonshot", "Moonshot AI", "language", "pinchbench-v2", "moonshotai/kimi-k2.7-code"],
    ["grok-4-3", "Grok 4.3", "xai", "xAI", "vision", "pinchbench-v2", "x-ai/grok-4.3"],
    ["qwen3-6-plus", "Qwen3.6 Plus", "alibaba", "Alibaba Qwen", "vision", "pinchbench-v2", "qwen/qwen3.6-plus", "Qwen 3.6 Plus", "Qwen-3.6-Plus"],
    ["gemini-3-flash", "Gemini 3 Flash", "google", "Google DeepMind", "omni", "skillsbench-1-1", "Gemini 3 Flash", "google/gemini-3-flash-preview"],
    ["glm-5-turbo", "GLM 5 Turbo", "zai", "Z.ai", "language", "pinchbench-v2", "z-ai/glm-5-turbo"],
    ["fugu-ultra", "Fugu Ultra", "sakana", "Sakana AI", "language", "pinchbench-v2", "sakana/fugu-ultra"],
    ["devstral-2512", "Devstral 2512", "mistral", "Mistral AI", "language", "pinchbench-v2", "mistralai/devstral-2512"],
    ["gpt-5-4-nano", "GPT-5.4 Nano", "openai", "OpenAI", "vision", "pinchbench-v2", "openai/gpt-5.4-nano"],
    ["glm-5v-turbo", "GLM 5V Turbo", "zai", "Z.ai", "vision", "pinchbench-v2", "z-ai/glm-5v-turbo"],
    ["minimax-m2-7", "MiniMax M2.7", "minimax", "MiniMax", "language", "pinchbench-v2", "minimax/minimax-m2.7", "MiniMax-M2.7"],
    ["trinity-large-thinking", "Trinity Large Thinking", "arcee", "Arcee AI", "language", "pinchbench-v2", "arcee-ai/trinity-large-thinking"],
    ["mistral-small-2603", "Mistral Small 2603", "mistral", "Mistral AI", "language", "pinchbench-v2", "mistralai/mistral-small-2603"],
    ["aion-3-0", "Aion 3.0", "aion", "Aion Labs", "language", "pinchbench-v2", "aion-labs/aion-3.0"],
    ["glm-5-1", "GLM 5.1", "zai", "Z.ai", "language", "pinchbench-v2", "z-ai/glm-5.1", "GLM-5.1"],
    ["gemma-4-26b-a4b-it", "Gemma 4 26B-A4B IT", "google", "Google DeepMind", "vision", "pinchbench-v2", "google/gemma-4-26b-a4b-it"],
    ["mistral-large-2512", "Mistral Large 2512", "mistral", "Mistral AI", "language", "pinchbench-v2", "mistralai/mistral-large-2512"],
    ["trinity-large-preview", "Trinity Large Preview", "arcee", "Arcee AI", "language", "pinchbench-v2", "arcee-ai/trinity-large-preview"],
    ["gemma-4-31b-it", "Gemma 4 31B IT", "google", "Google DeepMind", "vision", "pinchbench-v2", "google/gemma-4-31b-it"],
    ["claude-sonnet-4", "Claude Sonnet 4", "anthropic", "Anthropic", "vision", "pinchbench-v2", "anthropic/claude-sonnet-4"],
    ["gpt-oss-120b", "GPT-OSS 120B", "openai", "OpenAI", "language", "pinchbench-v2", "openai/gpt-oss-120b"],
    ["nemotron-3-super-120b-a12b", "Nemotron 3 Super 120B-A12B", "nvidia", "NVIDIA", "language", "pinchbench-v2", "nvidia/nemotron-3-super-120b-a12b"],
    ["mercury-2", "Mercury 2", "inception", "Inception", "language", "pinchbench-v2", "inception/mercury-2"],
    ["nova-2-lite-v1", "Nova 2 Lite v1", "amazon", "Amazon", "vision", "pinchbench-v2", "amazon/nova-2-lite-v1"],
    ["gpt-oss-20b", "GPT-OSS 20B", "openai", "OpenAI", "language", "pinchbench-v2", "openai/gpt-oss-20b"],
    ["gpt-5-5-pro", "GPT-5.5 Pro", "openai", "OpenAI", "vision", "pinchbench-v2", "openai/gpt-5.5-pro"],
    ["llama-3-1-70b-instruct", "Llama 3.1 70B Instruct", "meta", "Meta", "language", "pinchbench-v2", "meta-llama/llama-3.1-70b-instruct"],
    ["llama-4-scout", "Llama 4 Scout", "meta", "Meta", "vision", "pinchbench-v2", "meta-llama/llama-4-scout"],
    ["muse-glimmer-30b", "Muse Glimmer 30B", "meta", "Meta", "language", "wildclawbench"],
    ["qwen3-6-27b", "Qwen3.6 27B", "alibaba", "Alibaba Qwen", "vision", "wildclawbench"],
    ["intern-s2-preview-397b", "Intern-S2 Preview 397B", "internlm", "InternLM", "vision", "wildclawbench"],
    ["mimo-v2-pro", "MiMo V2 Pro", "xiaomi", "Xiaomi", "language", "wildclawbench", "MiMo-V2-Pro"],
    ["glm-5", "GLM 5", "zai", "Z.ai", "language", "wildclawbench", "GLM-5"],
    ["deepseek-v3-2", "DeepSeek V3.2", "deepseek", "DeepSeek", "language", "wildclawbench"],
    ["minimax-m2-5", "MiniMax M2.5", "minimax", "MiniMax", "language", "wildclawbench"],
    ["mimo-v2-flash", "MiMo V2 Flash", "xiaomi", "Xiaomi", "language", "wildclawbench"],
    ["grok-4-20-beta", "Grok 4.20 Beta", "xai", "xAI", "vision", "wildclawbench"],
    ["qwen3-5-plus", "Qwen3.5 Plus", "alibaba", "Alibaba Qwen", "vision", "qwenclawbench", "Qwen3.5-Plus"],
    ["deepseek-v3-2-thinking", "DeepSeek V3.2 Thinking", "deepseek", "DeepSeek", "language", "qwenclawbench", "DeepSeek-V3.2-Thinking"],
    ["seed2-0-code", "Seed-2.0-Code", "bytedance", "ByteDance Seed", "language", "workspacebench"],
    ["muse-spark-unspecified", "Muse Spark (version unspecified)", "meta", "Meta", "language", "claweval", "Muse Spark"],
    ["kimi-k2-6", "Kimi K2.6", "moonshot", "Moonshot AI", "vision", "claweval"],
    ["sensenova-6-7-flash-lite", "SenseNova 6.7 Flash-Lite", "sensetime", "SenseTime", "language", "claweval"],
    ["agnes-2-0-flash", "Agnes 2.0 Flash", "sapiensai", "SapiensAI", "language", "claweval", "Agnes-2.0-flash"],
    ["mach-mind-4-pro", "Mach-Mind 4 Pro", "li", "Li", "language", "claweval", "Mach-Mind-4-pro"],
    ["mimo-v2-omni", "MiMo V2 Omni", "xiaomi", "Xiaomi", "omni", "claweval"],
    ["nemotron-3-super-unspecified", "Nemotron 3 Super (variant unspecified)", "nvidia", "NVIDIA", "language", "claweval", "Nemotron 3 Super"],
    ["step-3-7-flash", "Step 3.7 Flash", "stepfun", "StepFun", "language", "claweval"]
  ].forEach(ensureModel);

  const modelId = new Map([
    ["GPT-5.5", "gpt-5-5"], ["GPT 5.4", "gpt-5-4"], ["GPT-5.4", "gpt-5-4"], ["GPT-5.6 Sol", "gpt-5-6-sol"],
    ["GPT-5.2", "gpt-5-2"], ["GPT-5.4 Mini", "gpt-5-4-mini"], ["GPT-5.4 Nano", "gpt-5-4-nano"],
    ["Claude Opus 4.8", "claude-opus-4-8"], ["Claude Opus 4.7", "claude-opus-4-7"], ["Claude Opus 4.6", "claude-opus-4-6"], ["Claude Opus 4.5", "claude-opus-4-5"],
    ["Claude Fable 5", "claude-fable-5"], ["Claude Sonnet 4.6", "claude-sonnet-4-6"], ["Sonnet 4.6", "claude-sonnet-4-6"], ["Sonnet 4.5", "claude-sonnet-4-5"], ["Haiku 4.5", "claude-haiku-4-5"],
    ["Gemini 3.1 Pro", "gemini-3-1-pro"], ["Gemini 3.5 Flash", "gemini-3-5-flash"], ["Gemini 3 Flash", "gemini-3-flash"],
    ["DeepSeek V4 Pro", "deepseek-v4-pro"], ["DeepSeek V4 Flash", "deepseek-v4-flash"], ["DeepSeek V3.2", "deepseek-v3-2"],
    ["GLM 5.2", "glm-5-2"], ["GLM-5.1", "glm-5-1"], ["GLM 5.1", "glm-5-1"], ["GLM-5", "glm-5"], ["GLM 5", "glm-5"], ["GLM 5 Turbo", "glm-5-turbo"], ["GLM 5V Turbo", "glm-5v-turbo"],
    ["Qwen3.8-Max", "qwen3-8-max"], ["Qwen3.8 27B", "qwen3-8-27b"], ["Qwen3.7 Max", "qwen3-7-max"], ["Qwen3.6-Plus", "qwen3-6-plus"], ["Qwen-3.6-Plus", "qwen3-6-plus"], ["Qwen 3.6 Plus", "qwen3-6-plus"], ["Qwen3.6 27B", "qwen3-6-27b"], ["Qwen3.5 397A17B", "qwen3-5-397b-a17b"], ["Qwen3.5 397B", "qwen3-5-397b-a17b"], ["Qwen3.5-Plus", "qwen3-5-plus"],
    ["Seed-2.0-Lite", "seed2-0-lite"], ["Seed-2.0-Code", "seed2-0-code"],
    ["Kimi K3", "kimi-k3"], ["Kimi K2.7 Code", "kimi-k2-7-code"], ["Kimi K2.6", "kimi-k2-6"], ["Kimi K2.5", "kimi-k2-5"], ["Kimi-2.5", "kimi-k2-5"],
    ["Grok 4.5", "grok-4-5"], ["Grok 4.20 Beta", "grok-4-20-beta"], ["Grok-4.3", "grok-4-3"],
    ["Step 3.5 Flash", "step-3-5-flash"],
    ["Muse Spark 1.1", "muse-spark-1-1"], ["Muse Spark", "muse-spark-unspecified"], ["Muse Glimmer 30B", "muse-glimmer-30b"],
    ["Hy3", "hy3"], ["HY3", "hy3"], ["MiMo V2.5 Pro", "mimo-v2-5-pro"], ["MiMo-V2-Pro", "mimo-v2-pro"], ["MiMo V2 Pro", "mimo-v2-pro"], ["MiMo V2.5", "mimo-v2-5"], ["MiMo V2 Flash", "mimo-v2-flash"], ["MiMo V2 Omni", "mimo-v2-omni"],
    ["MiniMax M3", "minimax-m3"], ["MiniMax-M2.7", "minimax-m2-7"], ["MiniMax M2.7", "minimax-m2-7"], ["MiniMax M2.5", "minimax-m2-5"],
    ["Gemma 4 31B IT", "gemma-4-31b-it"], ["Intern-S2 Preview 397B", "intern-s2-preview-397b"],
    ["SenseNova 6.7 Flash-Lite", "sensenova-6-7-flash-lite"], ["Agnes-2.0-flash", "agnes-2-0-flash"], ["Mach-Mind-4-pro", "mach-mind-4-pro"], ["Nemotron 3 Super", "nemotron-3-super-unspecified"], ["Step 3.7 Flash", "step-3-7-flash"]
  ]);

  const pinchModelIds = new Map([
    ["anthropic/claude-opus-4.8-fast", "claude-opus-4-8"], ["qwen/qwen3.7-max", "qwen3-7-max"], ["anthropic/claude-opus-4.8", "claude-opus-4-8"],
    ["nvidia/nemotron-3-ultra-550b-a55b", "nemotron-3-ultra-550b-a55b"], ["xiaomi/mimo-v2.5", "mimo-v2-5"], ["x-ai/grok-build-0.1", "grok-build-0-1"],
    ["openai/gpt-5.6-luna", "gpt-5-6-luna"], ["qwen/qwen3.6-flash", "qwen3-6-flash"], ["xiaomi/mimo-v2.5-pro", "mimo-v2-5-pro"], ["z-ai/glm-5.2", "glm-5-2"],
    ["nvidia/nemotron-3.5-lightning-30b-a3b", "nemotron-3-5-lightning-30b-a3b"], ["openai/gpt-5.6-sol", "gpt-5-6-sol"], ["inclusionai/ling-2.6-1t", "ling-2-6-1t"],
    ["deepseek/deepseek-v4-flash", "deepseek-v4-flash"], ["google/gemini-3.1-pro-preview", "gemini-3-1-pro"], ["google/gemini-3.1-flash-lite", "gemini-3-1-flash-lite"],
    ["x-ai/grok-4.20", "grok-4-20"], ["stepfun/step-3.5-flash", "step-3-5-flash"], ["openai/gpt-5.4-mini", "gpt-5-4-mini"], ["moonshotai/kimi-k2.7-code", "kimi-k2-7-code"],
    ["anthropic/claude-opus-4.7", "claude-opus-4-7"], ["openai/gpt-5.6-terra", "gpt-5-6-terra"], ["openai/gpt-5.4", "gpt-5-4"], ["openai/gpt-5.5", "gpt-5-5"],
    ["x-ai/grok-4.5", "grok-4-5"], ["bytedance-seed/seed-2.0-lite", "seed2-0-lite"], ["google/gemini-3.5-flash", "gemini-3-5-flash"], ["x-ai/grok-4.3", "grok-4-3"],
    ["qwen/qwen3.6-plus", "qwen3-6-plus"], ["google/gemini-3-flash-preview", "gemini-3-flash"], ["z-ai/glm-5-turbo", "glm-5-turbo"], ["anthropic/claude-opus-4.6", "claude-opus-4-6"],
    ["sakana/fugu-ultra", "fugu-ultra"], ["mistralai/devstral-2512", "devstral-2512"], ["openai/gpt-5.4-nano", "gpt-5-4-nano"], ["anthropic/claude-haiku-4.5", "claude-haiku-4-5"],
    ["z-ai/glm-5v-turbo", "glm-5v-turbo"], ["minimax/minimax-m2.7", "minimax-m2-7"], ["arcee-ai/trinity-large-thinking", "trinity-large-thinking"], ["mistralai/mistral-small-2603", "mistral-small-2603"],
    ["anthropic/claude-sonnet-4.6", "claude-sonnet-4-6"], ["deepseek/deepseek-v4-pro", "deepseek-v4-pro"], ["aion-labs/aion-3.0", "aion-3-0"], ["z-ai/glm-5.1", "glm-5-1"],
    ["google/gemma-4-26b-a4b-it", "gemma-4-26b-a4b-it"], ["anthropic/claude-fable-5", "claude-fable-5"], ["moonshotai/kimi-k2.5", "kimi-k2-5"], ["mistralai/mistral-large-2512", "mistral-large-2512"],
    ["arcee-ai/trinity-large-preview", "trinity-large-preview"], ["google/gemma-4-31b-it", "gemma-4-31b-it"], ["anthropic/claude-sonnet-4", "claude-sonnet-4"], ["openai/gpt-oss-120b", "gpt-oss-120b"],
    ["nvidia/nemotron-3-super-120b-a12b", "nemotron-3-super-120b-a12b"], ["inception/mercury-2", "mercury-2"], ["amazon/nova-2-lite-v1", "nova-2-lite-v1"], ["openai/gpt-oss-20b", "gpt-oss-20b"],
    ["openai/gpt-5.5-pro", "gpt-5-5-pro"], ["meta-llama/llama-3.1-70b-instruct", "llama-3-1-70b-instruct"], ["meta-llama/llama-4-scout", "llama-4-scout"]
  ]);

  ensureBenchmark({ id: "skillsbench-1-1", name: "SkillsBench 1.1 · With Skills", category: "Agent / 工作", direction: "higher", description: "87 tasks、3 trials/task、max reasoning effort；同一模型与 Harness 的 skill package 启用结果。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["OpenHands", "Claude Code", "Codex", "Gemini CLI"], inputModalities: ["图片", "视频", "3D 模型"] });
  ensureBenchmark({ id: "skillsbench-1-1-without-skills", name: "SkillsBench 1.1 · Without Skills", category: "Agent / 工作", direction: "higher", description: "87 tasks、3 trials/task、max reasoning effort；未加载 skill package 的配对基线。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["OpenHands", "Claude Code", "Codex", "Gemini CLI"], inputModalities: ["图片", "视频", "3D 模型"] });
  ensureBenchmark({ id: "wildclawbench-overall", name: "WildClawBench · Overall", category: "Agent / 工作", direction: "higher", description: "OpenClaw 完整 60 题加权总分；26 道多模态输入任务与 34 道纯文本任务。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["OpenClaw"], inputModalities: ["图片", "音频", "视频"] });
  ensureBenchmark({ id: "wildclawbench-mm", name: "WildClawBench · Multimodal (26 tasks)", category: "Agent / 工作", direction: "higher", description: "WildClawBench 官方 OpenClaw 多模态输入子集；Qwen 发布页另有 Claude Code 设置，按 setting 分开。", collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["OpenClaw", "Claude Code"], inputModalities: ["图片", "音频", "视频"] });
  ensureBenchmark({ id: "wildclawbench-text", name: "WildClawBench · Pure-text (34 tasks)", category: "Agent / 工作", direction: "higher", description: "WildClawBench 官方 OpenClaw 纯文本子集。" });
  ensureBenchmark({ id: "wildclawbench-time", name: "WildClawBench · Total Elapsed", category: "Agent / 工作", direction: "lower", description: "OpenClaw 完整 60 题总耗时，单位分钟。" });
  ensureBenchmark({ id: "wildclawbench-cost", name: "WildClawBench · Total Cost", category: "Agent / 工作", direction: "lower", description: "OpenClaw 完整 60 题总成本，单位美元；自托管免费端点可为 0。" });
  ensureBenchmark({ id: "qwenclawbench", name: "QwenClawBench v1.1 · Final Score", category: "Agent / 工作", direction: "higher", description: "100 tasks、8 domains、3 runs/task；自动、LLM judge 或 hybrid 后的最终分数。" });
  ensureBenchmark({ id: "workspace-bench", name: "Workspace-Bench 1.0 · Full", category: "专业工作", direction: "higher", description: "完整 388-task Workspace-Bench 1.0；不得与 100-task Lite 榜单混排。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["Claude Code", "Codex", "OpenClaw", "DeepAgent", "Hermes", "DeepSeek Harness"], inputModalities: ["图片", "文档", "表格", "演示文稿"] });
  ensureBenchmark({ id: "workspace-bench-lite", name: "Workspace-Bench-Lite · Total", category: "专业工作", direction: "higher", description: "当前官方公开榜的 100-task Lite rubric pass rate；按 Harness 分开。", collections: ["multimodal-harness"], collectionScope: "mixed", collectionMode: "benchmark", harnesses: ["Claude Code", "Codex", "OpenClaw", "DeepAgent", "Hermes"], inputModalities: ["图片", "文档", "表格", "演示文稿"] });

  for (const threshold of [30, 50, 70, 90, 100]) {
    const oldId = `workspace-bench-pass${threshold}`;
    const nextId = `workspace-bench-lite-pass${threshold}`;
    const benchmark = benchmarkById(oldId);
    if (benchmark) {
      benchmark.id = nextId;
      benchmark.name = `Workspace-Bench-Lite · Pass@${threshold}`;
      benchmark.description = `100-task Workspace-Bench-Lite；达到至少 ${threshold} 分的任务数比例。`;
    }
    for (const observation of observations) {
      if (observation.benchmarkId === oldId) observation.benchmarkId = nextId;
    }
  }
  for (const observation of observations) {
    if (observation.benchmarkId === "workspace-bench" && /100-task|100 task/i.test(observation.setting || "")) {
      observation.benchmarkId = "workspace-bench-lite";
    }
  }

  const clawVariants = [];
  for (const [scope, label, count, multimodal] of [
    ["overall", "Overall", 300, false],
    ["general", "General (161)", 161, false],
    ["multi-turn", "Multi-turn (38)", 38, false],
    ["multimodal", "Multimodal (101)", 101, true]
  ]) {
    for (const [metric, metricLabel, description] of [
      ["pass3", "Pass³", "三次独立运行全部通过的严格成功率。"],
      ["passat3", "Pass@3", "三次独立运行至少一次通过的成功率。"]
    ]) {
      const id = `claweval-v1-1-${scope}-${metric}`;
      ensureBenchmark({
        id,
        name: `Claw-Eval v1.1 · ${label} · ${metricLabel}`,
        category: "Agent / 工作",
        direction: "higher",
        description: `${count} tasks；${description}`,
        ...(multimodal ? { collections: ["multimodal-harness"], collectionScope: "dedicated", collectionMode: "benchmark", harnesses: ["Claw-Eval"], inputModalities: ["图片", "视频", "文档", "网页"] } : {})
      });
      clawVariants.push({ benchmarkId: id, label: `${label} · ${metricLabel}` });
    }
  }

  setFamily("skillsbench-1-1-family", "SkillsBench", [
    { benchmarkId: "skillsbench", label: "Version unspecified" },
    { benchmarkId: "skillsbench-1-1", label: "v1.1 · With Skills" },
    { benchmarkId: "skillsbench-1-1-without-skills", label: "v1.1 · Without Skills" }
  ]);
  setFamily("wildclawbench", "WildClawBench", [
    { benchmarkId: "wildclawbench-overall", label: "Overall · 60 tasks" },
    { benchmarkId: "wildclawbench-mm", label: "Multimodal · 26 tasks" },
    { benchmarkId: "wildclawbench-text", label: "Pure-text · 34 tasks" },
    { benchmarkId: "wildclawbench-time", label: "Total elapsed" },
    { benchmarkId: "wildclawbench-cost", label: "Total cost" }
  ]);
  setFamily("pinchbench-v2", "PinchBench v2", [
    { benchmarkId: "pinchbench-v2-best", label: "Best success rate" },
    { benchmarkId: "pinchbench-v2-average", label: "Average success rate" }
  ]);
  setFamily("workspace-bench", "Workspace-Bench", [
    { benchmarkId: "workspace-bench", label: "Full 1.0 · Total" },
    { benchmarkId: "workspace-bench-lite", label: "Lite · Total" },
    { benchmarkId: "workspace-bench-lite-pass30", label: "Lite · Pass@30" },
    { benchmarkId: "workspace-bench-lite-pass50", label: "Lite · Pass@50" },
    { benchmarkId: "workspace-bench-lite-pass70", label: "Lite · Pass@70" },
    { benchmarkId: "workspace-bench-lite-pass90", label: "Lite · Pass@90" },
    { benchmarkId: "workspace-bench-lite-pass100", label: "Lite · Pass@100" }
  ]);
  setFamily("claweval-family", "Claw-Eval", [
    { benchmarkId: "claweval", label: "Legacy / unspecified" },
    { benchmarkId: "claweval-mm", label: "MM · Setting unspecified" },
    { benchmarkId: "claweval-mm-passat3", label: "Reported MM snapshot · Pass@3" },
    { benchmarkId: "claweval-mm-pass3", label: "Reported MM snapshot · Pass³" },
    { benchmarkId: "claweval-mm-average", label: "Reported MM snapshot · Average" },
    ...clawVariants
  ]);

  for (const sourceId of ["skillsbench-1-1", "pinchbench-v2", "wildclawbench", "qwenclawbench", "workspacebench", "claweval"]) {
    detachSource(sourceId);
  }

  const skillsRows = [
    ["gpt-5-5", "OpenHands", 51.5, 67.3],
    ["gpt-5-5", "Codex", 46.8, 66.5],
    ["claude-opus-4-7", "Claude Code", 43.0, 61.2],
    ["gemini-3-1-pro", "Gemini CLI", 36.0, 60.8],
    ["glm-5-1", "OpenHands", 32.7, 58.4],
    ["hy3", "Claude Code", null, 55.9],
    ["gemini-3-flash", "Gemini CLI", 34.2, 54.6],
    ["claude-opus-4-8", "OpenHands", 45.7, 54.1],
    ["kimi-k2-6", "OpenHands", 33.4, 54.0],
    ["claude-opus-4-7", "OpenHands", 42.1, 53.1],
    ["minimax-m3", "OpenHands", 29.7, 53.0],
    ["gemini-3-1-pro", "OpenHands", 33.8, 52.8],
    ["gpt-5-2", "Codex", 29.7, 51.7],
    ["claude-opus-4-6", "Claude Code", 33.7, 50.2],
    ["deepseek-v4-pro", "OpenHands", 26.9, 50.1],
    ["claude-opus-4-5", "Claude Code", 23.8, 49.0],
    ["gemini-3-5-flash", "OpenHands", 41.1, 48.2],
    ["claude-sonnet-4-6", "OpenHands", 33.5, 47.2],
    ["deepseek-v4-flash", "OpenHands", 27.5, 44.7],
    ["grok-4-3", "OpenHands", 22.8, 41.7],
    ["gpt-5-4-mini", "OpenHands", 29.9, 41.4],
    ["claude-sonnet-4-5", "Claude Code", 16.7, 36.2],
    ["minimax-m2-7", "OpenHands", 18.1, 34.9],
    ["claude-haiku-4-5", "Claude Code", 8.8, 30.1],
    ["gemini-3-1-flash-lite", "OpenHands", 16.0, 20.1]
  ];
  for (const [model, harness, withoutSkills, withSkills] of skillsRows) {
    const setting = `${harness} · 87 tasks · 3 trials/task · max reasoning effort`;
    add("skillsbench-1-1", "skillsbench-1-1", model, withSkills, "%", `${setting} · with Skills`);
    if (withoutSkills !== null) add("skillsbench-1-1", "skillsbench-1-1-without-skills", model, withoutSkills, "%", `${setting} · without Skills`);
  }

  const pinchRows = [
    ["anthropic/claude-opus-4.8-fast", 94.5, 93.5, "2026-05-28", 5],
    ["qwen/qwen3.7-max", 93.4, 92.5, "2026-05-27", 6],
    ["anthropic/claude-opus-4.8", 91.8, 90.5, "2026-05-28", 5],
    ["nvidia/nemotron-3-ultra-550b-a55b", 90.6, 89.9, "2026-05-28", 5],
    ["xiaomi/mimo-v2.5", 91.9, 89.7, "2026-05-30", 6],
    ["x-ai/grok-build-0.1", 92.1, 88.9, "2026-05-24", 5],
    ["openai/gpt-5.6-luna", 90.8, 88.7, "2026-07-09", 5],
    ["qwen/qwen3.6-flash", 89.1, 88.1, "2026-05-27", 5],
    ["xiaomi/mimo-v2.5-pro", 89.5, 87.5, "2026-05-30", 6],
    ["z-ai/glm-5.2", 87.8, 87.0, "2026-06-16", 5],
    ["nvidia/nemotron-3.5-lightning-30b-a3b", 87.2, 86.4, "2026-08-18", 6],
    ["openai/gpt-5.6-sol", 87.0, 84.2, "2026-07-10", 5],
    ["inclusionai/ling-2.6-1t", 82.6, 82.6, "2026-05-11", 1],
    ["deepseek/deepseek-v4-flash", 91.5, 81.7, "2026-05-30", 7],
    ["google/gemini-3.1-pro-preview", 82.9, 81.0, "2026-05-30", 10],
    ["google/gemini-3.1-flash-lite", 80.5, 80.5, "2026-05-07", 1],
    ["x-ai/grok-4.20", 87.8, 80.3, "2026-05-30", 13],
    ["stepfun/step-3.5-flash", 84.7, 79.4, "2026-05-30", 12],
    ["openai/gpt-5.4-mini", 86.4, 79.2, "2026-05-30", 17],
    ["moonshotai/kimi-k2.7-code", 80.2, 76.1, "2026-06-12", 5],
    ["anthropic/claude-opus-4.7", 91.6, 76.0, "2026-05-30", 15],
    ["openai/gpt-5.6-terra", 81.4, 75.9, "2026-07-09", 5],
    ["openai/gpt-5.4", 88.4, 75.7, "2026-05-30", 17],
    ["openai/gpt-5.5", 89.0, 75.5, "2026-05-30", 16],
    ["x-ai/grok-4.5", 91.2, 75.2, "2026-07-09", 5],
    ["bytedance-seed/seed-2.0-lite", 89.7, 75.0, "2026-05-30", 25],
    ["google/gemini-3.5-flash", 76.3, 74.2, "2026-05-19", 5],
    ["x-ai/grok-4.3", 85.0, 73.7, "2026-05-30", 11],
    ["qwen/qwen3.6-plus", 85.9, 72.5, "2026-05-30", 20],
    ["google/gemini-3-flash-preview", 80.0, 72.1, "2026-05-30", 18],
    ["z-ai/glm-5-turbo", 88.2, 71.8, "2026-05-30", 18],
    ["anthropic/claude-opus-4.6", 100.0, 69.9, "2026-06-02", 24],
    ["sakana/fugu-ultra", 72.4, 69.5, "2026-06-24", 5],
    ["mistralai/devstral-2512", 83.2, 69.4, "2026-05-30", 16],
    ["openai/gpt-5.4-nano", 77.3, 69.0, "2026-05-30", 17],
    ["anthropic/claude-haiku-4.5", 90.4, 67.7, "2026-05-30", 17],
    ["z-ai/glm-5v-turbo", 86.6, 67.6, "2026-05-30", 16],
    ["minimax/minimax-m2.7", 84.5, 66.8, "2026-05-30", 13],
    ["arcee-ai/trinity-large-thinking", 71.2, 65.7, "2026-05-14", 9],
    ["mistralai/mistral-small-2603", 78.6, 64.6, "2026-05-30", 16],
    ["anthropic/claude-sonnet-4.6", 84.6, 62.7, "2026-05-30", 19],
    ["deepseek/deepseek-v4-pro", 81.6, 61.1, "2026-05-30", 7],
    ["aion-labs/aion-3.0", 62.4, 61.1, "2026-07-09", 5],
    ["z-ai/glm-5.1", 76.6, 59.9, "2026-05-30", 6],
    ["google/gemma-4-26b-a4b-it", 77.1, 56.4, "2026-05-30", 17],
    ["anthropic/claude-fable-5", 59.6, 54.8, "2026-06-09", 5],
    ["moonshotai/kimi-k2.5", 81.9, 54.6, "2026-05-30", 13],
    ["mistralai/mistral-large-2512", 72.9, 54.5, "2026-05-30", 17],
    ["arcee-ai/trinity-large-preview", 72.4, 53.0, "2026-05-14", 16],
    ["google/gemma-4-31b-it", 77.0, 52.7, "2026-05-30", 12],
    ["anthropic/claude-sonnet-4", 57.8, 48.8, "2026-05-05", 2],
    ["openai/gpt-oss-120b", 47.4, 44.8, "2026-05-30", 13],
    ["nvidia/nemotron-3-super-120b-a12b", 60.4, 42.2, "2026-05-14", 15],
    ["inception/mercury-2", 100.0, 39.6, "2026-06-02", 20],
    ["amazon/nova-2-lite-v1", 58.9, 37.6, "2026-05-30", 17],
    ["openai/gpt-oss-20b", 41.8, 36.3, "2026-05-14", 10],
    ["openai/gpt-5.5-pro", 37.1, 21.4, "2026-05-30", 6],
    ["meta-llama/llama-3.1-70b-instruct", 10.7, 10.7, "2026-05-04", 1],
    ["meta-llama/llama-4-scout", 3.2, 3.2, "2026-05-04", 1]
  ];
  for (const [label, best, average, date, runCount] of pinchRows) {
    const id = pinchModelIds.get(label);
    const route = label.endsWith("-fast") ? " · fast route" : "";
    const base = `OpenClaw · PinchBench v2.0.0 · 148 tasks${route}`;
    add("pinchbench-v2", "pinchbench-v2-best", id, best, "%", `${base} · best run`, `leaderboard submission ${date}`);
    add("pinchbench-v2", "pinchbench-v2-average", id, average, "%", `${base} · average across ${runCount} run${runCount === 1 ? "" : "s"}`, `leaderboard submission ${date}`);
  }

  const wildClawRows = [
    ["GPT-5.6 Sol", 67.2, 221.7, 56.77, 69.3, 65.6],
    ["Claude Opus 4.8", 64.7, 400.3, 95.95, 65.3, 64.3],
    ["Claude Opus 4.7", 62.2, 328.0, 77.40, 58.5, 65.0],
    ["Claude Fable 5", 62.0, 323.6, 87.71, 68.6, 57.0],
    ["GPT-5.5", 58.2, 262.0, 37.80, 63.0, 54.5],
    ["Grok 4.5", 57.5, 358.7, 28.43, 55.3, 59.2],
    ["Qwen3.8-Max", 56.2, 707.6, 24.70, 59.4, 53.7],
    ["Muse Spark 1.1", 54.8, 367.5, 23.59, 53.7, 55.7],
    ["Kimi K3", 54.5, 488.4, 40.08, 43.8, 62.7],
    ["GLM 5.2", 54.2, 441.8, 17.10, 50.9, 56.7],
    ["Claude Opus 4.6", 51.6, 508.0, 81.00, 47.7, 54.6],
    ["GPT-5.4", 50.3, 350.0, 19.80, 40.2, 58.0],
    ["Hy3", 49.7, 338.1, 2.13, 43.1, 54.8],
    ["GLM 5.1", 48.2, 515.0, 34.80, 40.7, 53.9],
    ["Qwen3.8 27B", 48.0, 516.2, null, 39.1, 54.8],
    ["Muse Glimmer 30B", 47.6, 351.7, 6.06, 46.6, 48.4],
    ["Kimi K2.7 Code", 46.9, 673.9, 72.31, 41.7, 50.9],
    ["Intern-S2 Preview 397B", 44.7, 541.4, 0.00, 34.2, 52.7],
    ["DeepSeek V4 Pro", 43.7, 605.0, 12.00, 33.6, 51.4],
    ["Qwen3.6 27B", 43.2, 420.6, 20.91, 38.2, 47.0],
    ["MiMo V2.5 Pro", 43.0, 451.0, 12.60, 36.2, 48.1],
    ["GLM 5", 42.6, 373.0, 11.40, 30.7, 51.7],
    ["Gemini 3.1 Pro", 40.8, 240.0, 18.00, 43.5, 38.7],
    ["MiMo V2 Pro", 40.2, 458.0, 26.40, 29.7, 48.2],
    ["Gemma 4 31B IT", 37.6, 384.3, 3.46, 34.7, 39.8],
    ["Qwen3.5 397B", 34.5, 459.0, 22.20, 23.8, 42.6],
    ["DeepSeek V3.2", 34.0, 549.0, 11.40, 26.1, 40.1],
    ["GLM 5 Turbo", 33.9, 499.0, 15.00, 24.5, 41.0],
    ["MiniMax M2.7", 33.8, 551.0, 7.20, 19.2, 44.9],
    ["Kimi K2.5", 30.8, 406.0, 6.60, 24.0, 36.0],
    ["MiMo V2 Flash", 30.8, 433.0, 10.20, 34.3, 28.1],
    ["MiniMax M2.5", 27.1, 542.0, 9.60, 16.3, 35.3],
    ["Step 3.5 Flash", 26.7, 430.0, 6.60, 12.6, 37.4],
    ["Grok 4.20 Beta", 19.3, 94.0, 9.60, 7.3, 28.4]
  ];
  for (const [label, overall, elapsed, cost, multimodal, pureText] of wildClawRows) {
    const id = modelId.get(label);
    const caveat = label === "Gemini 3.1 Pro" ? " · low-effort" : "";
    add("wildclawbench", "wildclawbench-overall", id, overall, "%", `OpenClaw · full 60-task suite${caveat}`);
    add("wildclawbench", "wildclawbench-mm", id, multimodal, "%", `OpenClaw · multimodal-input split · 26 tasks${caveat}`);
    add("wildclawbench", "wildclawbench-text", id, pureText, "%", `OpenClaw · pure-text split · 34 tasks${caveat}`);
    add("wildclawbench", "wildclawbench-time", id, elapsed, "min", `OpenClaw · full 60-task suite${caveat}`);
    if (cost !== null) add("wildclawbench", "wildclawbench-cost", id, cost, "USD", `OpenClaw · full 60-task suite${caveat}`);
  }

  const qwenClawRows = [
    ["Claude Sonnet 4.6", 60.5, ""],
    ["Claude Opus 4.6", 59.5, ""],
    ["GLM-5.1", 58.7, ""],
    ["Qwen3.6-Plus", 57.4, ""],
    ["GPT-5.4", 56.7, "high"],
    ["MiMo-V2-Pro", 56.5, ""],
    ["Claude Opus 4.5", 56.1, "high"],
    ["GLM-5", 54.9, ""],
    ["Qwen3.5-Plus", 53.0, ""],
    ["Kimi K2.5", 51.9, ""],
    ["DeepSeek-V3.2-Thinking", 50.7, ""],
    ["MiniMax-M2.7", 50.5, "high"]
  ];
  modelId.set("DeepSeek-V3.2-Thinking", "deepseek-v3-2-thinking");
  for (const [label, value, effort] of qwenClawRows) {
    add(
      "qwenclawbench",
      "qwenclawbench",
      modelId.get(label),
      value,
      "%",
      `OpenClaw · qwenclawbench-v1.1-100 · 100 tasks · 3 runs/task${effort ? ` · ${effort} effort` : ""}`,
      "Final task score after automated, LLM-judge, or hybrid grading; component averages are not duplicated as leaderboard metrics."
    );
  }

  const workspaceLiteRows = [
    ["Opus-4.7", "OpenClaw", 66.7],
    ["Opus-4.7", "ClaudeCode", 64.7],
    ["Opus-4.7", "Hermes", 64.5],
    ["GLM-5.1", "DeepAgent", 61.0],
    ["GLM-5.1", "Hermes", 57.7],
    ["GLM-5.1", "OpenClaw", 57.5],
    ["Qwen-3.6-Plus", "OpenClaw", 55.6],
    ["MiniMax-M2.7", "ClaudeCode", 54.6],
    ["Opus-4.7", "DeepAgent", 54.4],
    ["GLM-5.1", "Codex", 53.1],
    ["Seed-2.0-Lite", "ClaudeCode", 53.0],
    ["GLM-5.1", "ClaudeCode", 52.6],
    ["MiniMax-M2.7", "Hermes", 52.6],
    ["GPT-5.4", "ClaudeCode", 51.8],
    ["Qwen-3.6-Plus", "Hermes", 50.9],
    ["Kimi-2.5", "Hermes", 49.1],
    ["Kimi-2.5", "ClaudeCode", 48.3],
    ["GPT-5.4", "Codex", 47.7],
    ["Qwen-3.6-Plus", "Codex", 47.3],
    ["GPT-5.4", "OpenClaw", 47.1],
    ["Kimi-2.5", "Codex", 46.9],
    ["Seed-2.0-Lite", "OpenClaw", 46.6],
    ["Seed-2.0-Lite", "Hermes", 45.9],
    ["MiniMax-M2.7", "DeepAgent", 45.0],
    ["Kimi-2.5", "OpenClaw", 44.5],
    ["GPT-5.4", "Hermes", 44.3],
    ["MiniMax-M2.7", "OpenClaw", 44.1],
    ["MiniMax-M2.7", "Codex", 42.7],
    ["Seed-2.0-Code", "ClaudeCode", 42.3],
    ["Kimi-2.5", "DeepAgent", 41.6],
    ["Seed-2.0-Code", "OpenClaw", 40.1],
    ["Qwen-3.6-Plus", "DeepAgent", 39.4],
    ["Seed-2.0-Code", "Hermes", 38.6],
    ["Gemini-3.1-Pro", "ClaudeCode", 37.5],
    ["Gemini-3.1-Pro", "DeepAgent", 37.2],
    ["Grok-4.3", "Codex", 36.9],
    ["GPT-5.4", "DeepAgent", 36.2],
    ["Grok-4.3", "Hermes", 36.2],
    ["Seed-2.0-Lite", "DeepAgent", 36.0],
    ["Seed-2.0-Code", "DeepAgent", 34.6],
    ["Grok-4.3", "OpenClaw", 34.4],
    ["Gemini-3.1-Pro", "Codex", 31.9],
    ["Gemini-3.1-Pro", "OpenClaw", 31.6],
    ["Gemini-3.1-Pro", "Hermes", 27.1],
    ["Grok-4.3", "DeepAgent", 13.8]
  ];
  modelId.set("Opus-4.7", "claude-opus-4-7");
  modelId.set("MiniMax-M2.7", "minimax-m2-7");
  modelId.set("Gemini-3.1-Pro", "gemini-3-1-pro");
  for (const [label, harness, value] of workspaceLiteRows) {
    add("workspacebench", "workspace-bench-lite", modelId.get(label), value, "%", `${harness} · Workspace-Bench-Lite · 100 tasks · rubric pass rate`);
  }

  const clawEvalRows = {
    overall: [
      ["Claude Opus 4.6", 70.4, 82.4], ["Claude Sonnet 4.6", 67.8, 82.9], ["MiMo V2.5 Pro", 63.8, 80.9],
      ["Muse Spark", 63.8, 76.9], ["MiMo V2.5", 62.3, 80.9], ["Kimi K2.6", 62.3, 80.9],
      ["GLM 5.1", 62.3, 80.4], ["GPT 5.4", 60.3, 78.4], ["DeepSeek V4 Pro", 59.8, 82.9],
      ["SenseNova 6.7 Flash-Lite", 58.8, 80.9], ["Qwen 3.6 Plus", 58.8, 77.9], ["Gemini 3.1 Pro", 57.8, 82.9],
      ["DeepSeek V4 Flash", 57.8, 78.9], ["MiMo V2 Pro", 57.8, 76.4], ["Qwen3.5 397A17B", 56.8, 71.9],
      ["GLM 5 Turbo", 55.8, 75.9], ["GLM 5V Turbo", 53.8, 75.9], ["Kimi K2.5", 52.3, 75.4],
      ["Agnes-2.0-flash", 51.8, 71.9], ["Gemini 3 Flash", 49.2, 70.4], ["Mach-Mind-4-pro", 49.2, 69.3],
      ["MiniMax M2.7", 48.7, 74.4], ["MiMo V2 Omni", 45.2, 72.9], ["DeepSeek V3.2", 40.2, 69.3],
      ["Nemotron 3 Super", 5.5, 30.7]
    ],
    general: [
      ["Claude Opus 4.6", 70.8, 80.8], ["Step 3.7 Flash", 68.3, 83.9], ["Claude Sonnet 4.6", 68.3, 81.4],
      ["MiMo V2.5 Pro", 64.0, 79.5], ["GLM 5.1", 62.7, 80.1], ["Muse Spark", 62.7, 75.8],
      ["MiMo V2.5", 62.1, 78.3], ["Kimi K2.6", 61.5, 78.9], ["SenseNova 6.7 Flash-Lite", 60.9, 78.9],
      ["Agnes-2.0-flash", 60.9, 77.0], ["GPT 5.4", 60.2, 75.8], ["DeepSeek V4 Pro", 58.4, 81.4],
      ["DeepSeek V4 Flash", 57.8, 78.3], ["Qwen3.5 397A17B", 57.8, 70.8], ["Qwen 3.6 Plus", 57.1, 75.8],
      ["GLM 5 Turbo", 57.1, 73.9], ["MiMo V2 Pro", 57.1, 72.7], ["Gemini 3.1 Pro", 55.9, 80.8],
      ["Kimi K2.5", 52.8, 73.9], ["GLM 5V Turbo", 52.8, 73.3], ["MiMo V2 Omni", 52.2, 75.2],
      ["Mach-Mind-4-pro", 50.3, 68.9], ["MiniMax M2.7", 49.7, 72.0], ["Gemini 3 Flash", 48.4, 67.1],
      ["DeepSeek V3.2", 42.2, 71.4], ["Nemotron 3 Super", 6.8, 34.8]
    ],
    "multi-turn": [
      ["Claude Opus 4.6", 68.4, 89.5], ["Muse Spark", 68.4, 81.6], ["Gemini 3.1 Pro", 65.8, 92.1],
      ["Claude Sonnet 4.6", 65.8, 89.5], ["Kimi K2.6", 65.8, 89.5], ["DeepSeek V4 Pro", 65.8, 89.5],
      ["Qwen 3.6 Plus", 65.8, 86.8], ["MiMo V2.5", 63.2, 92.1], ["MiMo V2.5 Pro", 63.2, 86.8],
      ["MiMo V2 Pro", 60.5, 92.1], ["GPT 5.4", 60.5, 89.5], ["GLM 5.1", 60.5, 81.6],
      ["GLM 5V Turbo", 57.9, 86.8], ["DeepSeek V4 Flash", 57.9, 81.6], ["Gemini 3 Flash", 52.6, 84.2],
      ["Qwen3.5 397A17B", 52.6, 76.3], ["SenseNova 6.7 Flash-Lite", 50.0, 89.5], ["GLM 5 Turbo", 50.0, 84.2],
      ["Kimi K2.5", 50.0, 81.6], ["MiniMax M2.7", 44.7, 84.2], ["Mach-Mind-4-pro", 44.7, 71.1],
      ["DeepSeek V3.2", 31.6, 60.5], ["MiMo V2 Omni", 15.8, 63.2], ["Agnes-2.0-flash", 13.2, 50.0],
      ["Nemotron 3 Super", 0.0, 13.2]
    ],
    multimodal: [
      ["GPT 5.4", 25.7, 55.5], ["Claude Opus 4.6", 24.8, 52.5], ["Claude Sonnet 4.6", 23.8, 43.6],
      ["MiMo V2.5", 23.8, 38.6], ["Qwen3.5 397A17B", 20.8, 37.6], ["Kimi K2.6", 18.8, 44.6],
      ["Gemini 3.1 Pro", 15.8, 39.6], ["MiMo V2 Omni", 15.8, 34.6], ["Gemini 3 Flash", 14.8, 37.6],
      ["Kimi K2.5", 14.8, 36.6], ["GLM 5V Turbo", 13.9, 34.6]
    ]
  };
  const clawTaskCounts = { overall: 300, general: 161, "multi-turn": 38, multimodal: 101 };
  for (const [scope, rows] of Object.entries(clawEvalRows)) {
    const judge = scope === "multi-turn"
      ? "grader + user-agent: Claude Opus 4.6"
      : "grader: Gemini 3 Flash";
    const setting = `Claw-Eval v1.1 · ${scope} · ${clawTaskCounts[scope]} tasks · N=3 · ${judge}`;
    for (const [label, strictPass, passAt3] of rows) {
      add("claweval", `claweval-v1-1-${scope}-pass3`, modelId.get(label), strictPass, "%", setting);
      add("claweval", `claweval-v1-1-${scope}-passat3`, modelId.get(label), passAt3, "%", setting);
    }
  }

  patchAudit("skillsbench-1-1", {
    status: "complete",
    auditedAt: "2026-09-20",
    auditScope: "Current SkillsBench v1.1 main leaderboard: paired With Skills and Without Skills resolution rates for every published model–harness configuration; excludes derived delta/gain and wall-clock charts.",
    scopeLabel: "v1.1 主榜已核",
    expectedObservationCount: 49,
    benchmarkIds: ["skillsbench-1-1", "skillsbench-1-1-without-skills"],
    note: "25 with-Skills rows and 24 paired without-Skills rows (HY3 has no published baseline), 87 tasks, 3 trials per task."
  });
  patchAudit("pinchbench-v2", {
    status: "complete",
    auditedAt: "2026-09-20",
    auditScope: "Current PinchBench v2.0.0 success-rate leaderboard: Best and Average for all 59 listed models; excludes speed, cost, value, category awards, and per-run pages.",
    scopeLabel: "v2 主榜已核",
    expectedObservationCount: 118,
    benchmarkIds: ["pinchbench-v2-best", "pinchbench-v2-average"],
    note: "59 models × two headline success-rate metrics. The current v2 release notes say 148 tasks; older 147-task labels are not carried forward."
  });
  patchAudit("wildclawbench", {
    status: "complete",
    auditedAt: "2026-09-20",
    auditScope: "Current 34-model OpenClaw leaderboard: Overall, 26-task multimodal split, 34-task pure-text split, total elapsed time, and total cost; excludes category breakdowns and split-level time/cost derivatives.",
    scopeLabel: "主榜与输入子榜已核",
    expectedObservationCount: 169,
    benchmarkIds: ["wildclawbench-overall", "wildclawbench-mm", "wildclawbench-text", "wildclawbench-time", "wildclawbench-cost"],
    note: "34 models × Overall/MM/Pure-text/elapsed plus 33 published cost values; Qwen3.8 27B has no billing value. Gemini 3.1 Pro is explicitly low-effort."
  });
  patchAudit("qwenclawbench", {
    status: "complete",
    auditedAt: "2026-09-20",
    auditScope: "QwenClawBench v1.1 official 12-model leaderboard final score; excludes Auto/LLM component averages and per-task drill-downs.",
    scopeLabel: "v1.1 主榜已核",
    expectedObservationCount: 12,
    benchmarkIds: ["qwenclawbench"],
    note: "100 tasks across 8 domains, OpenClaw harness, 3 runs per task; high-effort labels retained for GPT-5.4, Claude Opus 4.5, and MiniMax M2.7."
  });
  patchAudit("workspacebench", {
    status: "complete",
    auditedAt: "2026-09-20",
    auditScope: "Current public Workspace-Bench-Lite leaderboard: Total rubric pass rate for all 45 harness/model rows; excludes Easy/Medium/Hard, threshold summaries, matrix duplication, and Full 1.0 vendor-reported rows.",
    scopeLabel: "Lite 主榜已核",
    expectedObservationCount: 45,
    benchmarkIds: ["workspace-bench-lite"],
    note: "Full Workspace-Bench 1.0 (388 tasks) and current Lite (100 tasks) are separate metric views. Full 1.0 comparison rows retain their original vendor sources."
  });
  patchAudit("claweval", {
    status: "complete",
    auditedAt: "2026-09-20",
    auditScope: "Current Claw-Eval v1.1 main leaderboard: Pass³ and Pass@3 for Overall, General, Multi-turn, and Multimodal tabs; excludes completion/robustness/safety/average diagnostics and token-efficiency chart.",
    scopeLabel: "v1.1 四榜已核",
    expectedObservationCount: 174,
    benchmarkIds: clawVariants.map((variant) => variant.benchmarkId),
    note: "87 displayed model/subset rows × two headline pass metrics. The UI control labeled Image is 'Download as image', not a benchmark split, so no duplicate Image leaderboard is created."
  });
  patchAudit("rngbench", {
    status: "complete",
    auditedAt: "2026-09-20",
    auditScope: "Official Results tables: all nine single-player metrics for six models and Win%, Score%, Elo for five duel models; excludes raw W/T/L counts.",
    scopeLabel: "结果表已核",
    expectedObservationCount: 69,
    benchmarkIds: [
      "rngbench-matching-pf", "rngbench-matching-ia", "rngbench-matching-responses", "rngbench-matching-pairs",
      "rngbench-maze-sr", "rngbench-maze-explore", "rngbench-maze-walls", "rngbench-maze-efficiency", "rngbench-maze",
      "rngbench-duel-win", "rngbench-duel-score", "rngbench-duel-elo"
    ],
    note: "Single-player settings are Matching Pairs 10×10 image/noise and 3D Maze 13×13/no minimap; duel is Matching Pairs image/poker, 16 games per model."
  });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
