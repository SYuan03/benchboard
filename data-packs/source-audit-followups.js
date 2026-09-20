(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;

  const appendUnique = (target, rows) => rows.forEach((row) => {
    if (!target.some((item) => item.id === row.id)) target.push(row);
  });
  const upsertAudit = (sourceId, values) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    if (audit) Object.assign(audit, values);
    else sourceAudits.push({ sourceId, ...values });
  };
  const add = (sourceIds, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    const normalizedSources = [...new Set(sourceIds)];
    const existing = observations.find((item) =>
      item.benchmarkId === benchmarkId &&
      item.modelId === modelId &&
      item.value === value &&
      item.unit === unit &&
      (item.setting || "") === setting
    );
    if (existing) {
      existing.sourceIds = [...new Set([...(existing.sourceIds || []), ...normalizedSources])];
      if (note && !existing.note) existing.note = note;
      return existing;
    }
    const observation = {
      id: `o${observations.length + 1}`,
      sourceIds: normalizedSources,
      benchmarkId,
      modelId,
      value,
      unit,
      setting,
      note
    };
    observations.push(observation);
    return observation;
  };
  const mergeExactSource = (sourceId, preferredSourceId, benchmarkId, modelId, value) => {
    const observation = observations.find((item) =>
      item.benchmarkId === benchmarkId &&
      item.modelId === modelId &&
      item.value === value &&
      item.sourceIds.includes(preferredSourceId)
    );
    if (!observation) return false;
    observation.sourceIds = [...new Set([...observation.sourceIds, sourceId])];
    return true;
  };
  const mergeFamily = (id, name, variants) => {
    let family = benchmarkFamilies.find((item) => item.id === id);
    if (!family) {
      family = { id, name, variants: [] };
      benchmarkFamilies.push(family);
    }
    family.name = name;
    for (const variant of variants) {
      if (!family.variants.some((item) => item.benchmarkId === variant.benchmarkId)) family.variants.push(variant);
    }
  };
  const sourceTarget = (sourceId, modelId) => ({
    modelId,
    expectedObservationCount: observations.filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId)).length,
    benchmarkIds: [...new Set(observations
      .filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId))
      .map((item) => item.benchmarkId))]
  });

  // -------------------------------------------------------------------------
  // Anthropic launch pages: keep their provenance distinct from the cards.
  // -------------------------------------------------------------------------

  appendUnique(benchmarks, [
    { id: "financeagent-unspecified", name: "Finance Agent · Version Unspecified", category: "专业工作", direction: "higher", description: "发布材料未注明 Finance Agent 版本；不要自动并入 v1.1 或 v2。" },
    { id: "oss-fuzz-vulnerability-identification", name: "OSS-Fuzz · Vulnerability Identification", category: "网络安全", direction: "higher", description: "在开源项目中识别可利用漏洞；保留厂商发布页的精确评测口径。" },
    { id: "oss-fuzz-exploitation-success", name: "OSS-Fuzz · Exploitation Success", category: "网络安全", direction: "higher", description: "成功生成 exploit 的 challenge 数；与漏洞识别通过率分开。" }
  ]);
  mergeFamily("financeagent-family", "Finance Agent", [
    { benchmarkId: "financeagent-unspecified", label: "Version unspecified" }
  ]);
  mergeFamily("oss-fuzz-family", "OSS-Fuzz", [
    { benchmarkId: "oss-fuzz-vulnerability-identification", label: "Vulnerability identification" },
    { benchmarkId: "oss-fuzz-exploitation-success", label: "Exploitation success" }
  ]);

  const opus46Source = "anthropic-opus46";
  for (const [benchmarkId, value] of [
    ["terminal-bench-2-0", 65.4], ["swe-bench-verified", 80.8], ["osworld-verified", 72.7],
    ["tau2-retail", 91.9], ["tau2-telecom", 99.3], ["mcp-atlas", 59.5],
    ["arc-agi-2", 68.8], ["gpqa-diamond", 91.3], ["mmmu-pro", 73.9],
    ["mmmu-pro", 77.3], ["mmmlu", 91.1], ["openrca", 34.9]
  ]) mergeExactSource(opus46Source, "anthropic-opus46-system-card", benchmarkId, "claude-opus-4-6", value);

  const opus46Setting = "Anthropic Opus 4.6 launch page · adaptive thinking · max effort unless noted";
  add([opus46Source], "swe-multilingual", "claude-opus-4-6", 77.8, "%", opus46Setting);
  add([opus46Source], "browsecomp", "claude-opus-4-6", 84.0, "%", `${opus46Setting} · single-agent`);
  add([opus46Source], "vending-bench-2", "claude-opus-4-6", 80017.59, "$", opus46Setting);
  add([opus46Source], "gdpval-aa", "claude-opus-4-6", 1606, "Elo", opus46Setting);
  add([opus46Source], "cybergym", "claude-opus-4-6", 66.6, "%", `${opus46Setting} · vulnerability reproduction success rate`);
  add([opus46Source], "graphwalks-parents", "claude-opus-4-6", 72.0, "%", `${opus46Setting} · 1M · Parents · F1`);
  add([opus46Source], "graphwalks-bfs", "claude-opus-4-6", 38.7, "%", `${opus46Setting} · 1M · BFS · F1`);
  add([opus46Source], "mrcr-v2-8needle", "claude-opus-4-6", 93.0, "%", `${opus46Setting} · 256K pointwise · 8-needle`);
  add([opus46Source], "mrcr-v2-8needle-1m", "claude-opus-4-6", 76.0, "%", `${opus46Setting} · 1M pointwise · 8-needle`);
  add([opus46Source], "hle", "claude-opus-4-6", 40.0, "%", `${opus46Setting} · no tools`);
  add([opus46Source], "hle-tools", "claude-opus-4-6", 53.0, "%", `${opus46Setting} · with tools · revised 2026-02-23`, "The launch page explicitly corrects the earlier 53.1 chart label to 53.0 after scoring an additional question.");
  add([opus46Source], "hle-tools", "claude-opus-4-6", 53.1, "%", `${opus46Setting} · with tools · original chart label`, "Retained because the same official page still exposes the pre-update chart while its dated note revises the score to 53.0.");
  add([opus46Source], "biopipelinebench", "claude-opus-4-6", 53.1, "%", opus46Setting);
  add([opus46Source], "financeagent-unspecified", "claude-opus-4-6", 60.7, "%", opus46Setting);
  add([opus46Source], "swe-bench-verified", "claude-opus-4-6", 81.42, "%", `${opus46Setting} · prompt modification · 25 trials`, "The launch-page methodology note reports this separately from the 80.8% headline setup.");
  add([opus46Source], "mcp-atlas", "claude-opus-4-6", 62.7, "%", `${opus46Setting} · high effort`, "The launch-page note reports 62.7% at high effort separately from the 59.5% max-effort table result.");

  const opus48Source = "anthropic-opus48";
  for (const [benchmarkId, value] of [
    ["swe-bench-pro", 69.2], ["terminal-bench-2-1", 74.6], ["hle", 49.8],
    ["hle-tools", 57.9], ["osworld-verified", 83.4], ["gdpval-aa-v2", 1890],
    ["financeagent-v2", 53.9]
  ]) mergeExactSource(opus48Source, "anthropic-opus48-system-card", benchmarkId, "claude-opus-4-8", value);

  const opus5Source = "anthropic-opus5";
  for (const [benchmarkId, value, preferredSourceId] of [
    ["frontierbench-v0-1", 43.3, "anthropic-opus5-system-card"],
    ["gdpval-aa-v2", 1861, "anthropic-opus5-system-card"],
    ["arc-agi-3", 30.2, "openai-astra"],
    ["browsecomp", 90.8, "anthropic-opus5-system-card"],
    ["hle", 56.3, "anthropic-opus5-system-card"],
    ["hle-tools", 64.7, "anthropic-opus5-system-card"],
    ["osworld-2", 70.6, "anthropic-opus5-system-card"],
    ["deepswe-v1-1", 68.8, "anthropic-opus5-system-card"],
    ["frontiercode-1-1-main", 53.4, "anthropic-opus5-system-card"],
    ["automationbench", 26.0, "anthropic-opus5-system-card"],
    ["healthbench-professional", 59.8, "anthropic-opus5-system-card"]
  ]) mergeExactSource(opus5Source, preferredSourceId, benchmarkId, "claude-opus-5", value);
  const opus5Setting = "Anthropic Opus 5 launch table · adaptive thinking · max effort unless noted";
  add([opus5Source], "harvey-legal-heldout", "claude-opus-5", 11.7, "%", opus5Setting);
  add([opus5Source], "biomysterybench", "claude-opus-5", 49.4, "%", `${opus5Setting} · hard subset`);
  add([opus5Source], "biomysterybench", "claude-opus-5", 90.1, "%", `${opus5Setting} · human-solvable subset`);
  add([opus5Source], "oss-fuzz-vulnerability-identification", "claude-opus-5", 79.4, "%", "Anthropic Opus 5 launch chart · OSS-Fuzz");
  add([opus5Source], "oss-fuzz-exploitation-success", "claude-opus-5", 4, "challenges", "Anthropic Opus 5 launch chart · OSS-Fuzz");

  upsertAudit(opus46Source, {
    status: "target-complete", scopeLabel: "目标模型发布页已核", auditedAt: "2026-09-20",
    targetModels: [sourceTarget(opus46Source, "claude-opus-4-6")],
    note: "发布页主表、能力图和可精确读取的正文数值均已核；28 条 Opus 4.6 目标观测保留 launch provenance。HLE with-tools 的旧图 53.1 与 2026-02-23 修订值 53.0 并存；SWE-Bench Verified prompt-modified 81.42 与 MCP Atlas high-effort 62.7 作为不同 setting 保留。安全/对齐图不进入能力榜。"
  });
  upsertAudit(opus48Source, {
    status: "target-complete", scopeLabel: "目标模型发布页已核", auditedAt: "2026-09-20",
    targetModels: [sourceTarget(opus48Source, "claude-opus-4-8")],
    note: "发布页能力主表的 7 个 Opus 4.8 非空目标单元格已与同日 System Card 同值项合并来源；对齐/安全图不进入能力榜。"
  });
  upsertAudit(opus5Source, {
    status: "target-complete", scopeLabel: "目标模型发布页已核", auditedAt: "2026-09-20",
    targetModels: [sourceTarget(opus5Source, "claude-opus-5")],
    note: "发布页主表 14 个 Opus 5 非空目标单元格和 OSS-Fuzz 图中 2 个精确标注值已录入或合并来源；effort/cost 曲线没有逐点标签，不反推数值；安全/对齐图不进入能力榜。"
  });
  upsertAudit("anthropic-fable5", {
    status: "complete", scopeLabel: "发布页已核；合并列不归因", auditedAt: "2026-09-20",
    expectedObservationCount: 0,
    note: "发布页能力表完整核对。目标列明确写作 ‘Claude Mythos 5 / Fable 5’，脚注说明逐行展示两者较高值；这些单元格无法无歧义归到单一模型，因此不另造 observation。精确的 Fable 与 Mythos 单模型值来自同日 System Card，已在对应来源下录入。"
  });

  // OpenAI deployment/system cards are audited independently from launch pages.
  // Safety, jailbreak, deception and Preparedness numbers are not general
  // capability benchmark results and are intentionally excluded.
  for (const sourceId of ["openai-astra-system-card", "openai-gpt54-system-card", "openai-gpt56-system-card"]) {
    upsertAudit(sourceId, {
      status: "metadata-only", scopeLabel: "能力榜无独立新增项", auditedAt: "2026-09-20",
      note: "Deployment/System Card 已核。其数值属于安全、对齐、越狱、Preparedness 或部署风险评估；未发现需要独立加入通用能力榜的目标模型成绩。发布页能力矩阵由独立 source audit 覆盖。"
    });
  }
  upsertAudit("openai-gpt52-system-card", {
    status: "target-complete", scopeLabel: "通用能力目标项已核", auditedAt: "2026-09-20",
    targetModels: [sourceTarget("openai-gpt52-system-card", "gpt-5-2")],
    note: "系统卡中可归入通用能力榜的 GPT-5.2 Thinking HealthBench 三项已录入；安全、欺骗、越狱与 Preparedness 风险指标明确排除。"
  });
  upsertAudit("openai-gpt55-system-card", {
    status: "target-complete", scopeLabel: "通用能力目标项已核", auditedAt: "2026-09-20",
    targetModels: [sourceTarget("openai-gpt55-system-card", "gpt-5-5")],
    note: "系统卡中可归入通用能力榜的四个长度校正 HealthBench 指标已录入；安全、心理健康、Preparedness 与高风险评估明确排除。"
  });

  // The Alibaba lifecycle page is complete for the explicitly attributed A95B
  // benchmark claims, while its broader role remains model-version metadata.
  upsertAudit("alibaba-lifecycle", {
    status: "target-complete", scopeLabel: "A95B 目标成绩已核", auditedAt: "2026-09-20",
    targetModels: [sourceTarget("alibaba-lifecycle", "qwen3-8-2-4t-a95b")],
    note: "版本生命周期元数据已核；页面明确归到 Qwen3.8-2.4T-A95B 的 4 个核心成绩已全部保留。它们与 HF 卡片表头存在归属冲突，因此作为独立证据而非覆盖值。其他模型仅使用该页核对生命周期，不把未标分数的条目视为遗漏。"
  });

  // -------------------------------------------------------------------------
  // Seed2.0: the official page contains a 73-row target column for the dated
  // 0428 Lite snapshot. Keep it separate from unversioned comparison rows.
  // -------------------------------------------------------------------------

  const seedUnversioned = models.find((item) => item.id === "seed2-0-lite");
  if (seedUnversioned) {
    seedUnversioned.scoreStatus = "comparison-only";
    seedUnversioned.summary = "厂商或 benchmark 对照表中的未注明日期 Seed-2.0-Lite；不与官方 0428 快照自动合并。";
  }
  appendUnique(models, [{
    id: "seed2-0-lite-0428", name: "Seed2.0 Lite 0428", vendorId: "bytedance", vendor: "ByteDance Seed",
    releaseDate: "2026-04-28", modality: "omni", modalityDetail: "文本、图像、音频、视频 → 文本",
    context: "未披露", access: "闭源 API", aliases: ["Seed2.0 Lite（0428）", "seed2.0-lite-0428"],
    sourceId: "seed20", summary: "Seed2.0 Lite 的 2026-04-28 全模态升级快照；与 0215 Lite/Pro 及未注明日期的对照行分开。"
  }]);

  appendUnique(benchmarks, [
    { id: "cl-bench", name: "CL-Bench", category: "指令遵循", direction: "higher", description: "复杂指令遵循评测。" },
    { id: "babe", name: "BABE", category: "知识 / 推理", direction: "higher", description: "Seed2.0 官方推理能力表中的 BABE 评测。" },
    { id: "xpert-bench", name: "XPert Bench", category: "Agent / 工作", direction: "higher", description: "搜索 Agent 评测；版本与 harness 按来源保留。" },
    { id: "finsearchcomp", name: "FinSearchComp · Version Unspecified", category: "专业工作", direction: "higher", description: "来源未注明 T1/T2/T3 子集，不能与特定子集自动合并。" },
    { id: "tob-agent", name: "Tob-Agent", category: "Agent / 工作", direction: "higher", description: "真实业务 Agent 工作流评测。" },
    { id: "vibe-coding-human", name: "Vibe Coding · Human Evaluation", category: "编码", direction: "higher", description: "Seed 官方人工编码评测。" },
    { id: "terminal-bench-2-0-unspecified-harness", name: "Terminal-Bench 2.0 · Harness Unspecified", category: "编码", direction: "higher", description: "明确为 Terminal-Bench 2.0，但来源未注明 Terminus-2、Codex CLI 等 harness。" },
    { id: "vlmbias", name: "VLMBias", category: "多模态", direction: "higher", description: "视觉语言偏差与感知评测。" },
    { id: "charxiv-rq", name: "CharXiv · RQ", category: "多模态", direction: "higher", description: "CharXiv reasoning-question 分项；来源未注明 code-interpreter setting。" },
    { id: "videosimpleqa-v2", name: "VideoSimpleQA v2", category: "多模态", direction: "higher", description: "VideoSimpleQA v2；与原版分开。" },
    { id: "scivideo", name: "SciVideo", category: "多模态", direction: "higher", description: "科学视频理解评测。" },
    { id: "videoreasonbench", name: "VideoReasonBench", category: "多模态", direction: "higher", description: "视频推理评测。" },
    { id: "egotempo", name: "EgoTempo", category: "多模态", direction: "higher", description: "第一视角视频时序理解。" },
    { id: "morese-500", name: "Morese-500", category: "多模态", direction: "higher", description: "动态与运动感知评测。" },
    { id: "cgbench", name: "CGBench", category: "多模态", direction: "higher", description: "长视频理解评测。" },
    { id: "videoeval-pro", name: "VideoEval-Pro", category: "多模态", direction: "higher", description: "长视频理解评测。" },
    { id: "odvbench", name: "ODVBench", category: "多模态", direction: "higher", description: "流式视频理解评测。" },
    { id: "vispeak", name: "ViSpeak", category: "多模态", direction: "higher", description: "流式视频语义理解评测。" },
    { id: "avmeme", name: "AVMeme", category: "多模态", direction: "higher", description: "联合视觉与音频理解评测。" },
    { id: "fleurs-15-s2tt-bleu", name: "FLEURS-15 · S2TT BLEU", category: "音频", direction: "higher", description: "15 语种、中文/英文与其他语言双向语音翻译平均 BLEU；不要与 FLEURS-60 合并。" }
  ]);
  mergeFamily("terminal-bench", "Terminal-Bench", [{ benchmarkId: "terminal-bench-2-0-unspecified-harness", label: "2.0 · Harness unspecified" }]);
  mergeFamily("financeagent-family", "Finance Agent", [{ benchmarkId: "financeagent-unspecified", label: "Version unspecified" }]);
  mergeFamily("charxiv-family", "CharXiv", [{ benchmarkId: "charxiv-rq", label: "RQ · CI unspecified" }]);
  mergeFamily("videosimpleqa-family", "VideoSimpleQA", [
    { benchmarkId: "videosimpleqa", label: "Original" },
    { benchmarkId: "videosimpleqa-v2", label: "v2" }
  ]);
  mergeFamily("fleurs", "FLEURS", [{ benchmarkId: "fleurs-15-s2tt-bleu", label: "15 languages · S2TT BLEU" }]);
  mergeFamily("finsearchcomp-family", "FinSearchComp", [
    { benchmarkId: "finsearchcomp", label: "Version/subset unspecified" },
    { benchmarkId: "finsearchcomp-t2-t3", label: "T2 & T3" }
  ]);

  const seedSource = ["seed20"];
  const seedSetting = "ByteDance Seed2.0 official evaluation table · Lite 0428 snapshot";
  const seedRows = [
    ["gpqa-diamond",88.4,"%"],["supergpqa",69.6,"%"],["hle",25.7,"%","no tools · text-only"],
    ["beyondaime",79.0,"%"],["frontier-science-olympiad",72.0,"%"],["superchem",55.0,"%","text-only"],["babe",57.9,"%"],
    ["cl-bench",20.1,"%"],["multichallenge",69.9,"%"],["wide-search",70.3,"%"],["browsecomp",64.0,"%"],
    ["researchrubrics",59.2,"%"],["xpert-bench",56.8,"%"],["skillsbench",43.7,"%"],["gdpval",53.1,"%"],
    ["finsearchcomp",63.8,"%"],["tob-agent",51.4,"%"],["swe-multilingual",66.6,"%"],["swe-bench-pro",46.6,"%"],
    ["nl2repo",28.7,"%"],["paperbench",52.5,"%"],["terminal-bench-2-0-unspecified-harness",43.3,"%"],["vibe-coding-human",49.4,"%"],
    ["mathvision",89.8,"%"],["mmmu-pro",78.4,"%"],["hipho",83.8,"%"],["medxpertqa-mm",79.6,"%"],
    ["babyvision",64.7,"%"],["vlmbias",80.6,"%"],["simplevqa",72.7,"%"],["worldvqa",50.2,"%"],
    ["charxiv-dq",94.5,"%"],["charxiv-rq",82.4,"%"],["erqa",71.5,"%"],["osworld-verified",64.4,"%"],["mobileworld",64.6,"%"],
    ["videommmu",88.3,"%"],["mmvu",76.7,"%"],["videosimpleqa-v2",69.0,"%"],["videosimpleqa",71.7,"%"],
    ["scivideo",70.3,"%"],["videoreasonbench",59.4,"%"],["videoholmes",67.4,"%"],["minerva-video",68.5,"%"],
    ["tvbench",80.4,"%"],["tomato",72.5,"%"],["egotempo",68.4,"%"],["motionbench",72.4,"%"],
    ["contphy",62.4,"%"],["morese-500",34.6,"%"],["videomme",89.0,"%"],["video-mme-v2",64.9,"%"],
    ["cgbench",65.5,"%"],["longvideobench",79.0,"%"],["lvbench",76.4,"%"],["videoeval-pro",49.5,"%"],
    ["ovbench",63.2,"%"],["odvbench",66.0,"%"],["livesports-3k",78.1,"%"],["ovobench",75.4,"%"],
    ["vispeak",87.0,"%"],["crossvid",63.7,"%"],["omnivideobench",61.7,"%"],["avmeme",69.5,"%"],
    ["joinavbench",69.5,"%"],["worldsense",67.3,"%"],["mmsu",86.54,"%"],["wildspeech",75.81,"%"],
    ["wenetspeech-net-wer",4.47,"%"],["wenetspeech-meeting-wer",5.31,"%"],
    ["librispeech-clean-wer",1.07,"%"],["librispeech-other-wer",2.17,"%"],
    ["fleurs-15-s2tt-bleu",74.70,"BLEU","15 languages · zh/en↔xx"]
  ];
  for (const [benchmarkId, value, unit, detail = ""] of seedRows) {
    add(seedSource, benchmarkId, "seed2-0-lite-0428", value, unit, [seedSetting, detail].filter(Boolean).join(" · "));
  }
  upsertAudit("seed20", {
    status: "target-complete", scopeLabel: "0428 目标列已核", auditedAt: "2026-09-20",
    targetModels: [sourceTarget("seed20", "seed2-0-lite-0428")],
    note: "官方 Evaluation Results 表的 Seed2.0 Lite（0428）目标列 73 个非空单元格全部录入。0215 Lite、0215 Pro 与比较模型列尚未导入；0428 快照与外部榜单中未注明日期的 Seed-2.0-Lite 分开建模。ASR 用 WER，FLEURS-15 用 BLEU，其余按官方百分制表项保存。"
  });

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
