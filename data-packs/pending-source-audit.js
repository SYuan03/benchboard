(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, observations } = data;

  const upsertAudit = (sourceId, values) => {
    const audit = sourceAudits.find((item) => item.sourceId === sourceId);
    if (audit) Object.assign(audit, values);
    else sourceAudits.push({ sourceId, ...values });
  };
  const sourceTarget = (sourceId, modelId) => ({
    modelId,
    expectedObservationCount: observations.filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId)).length,
    benchmarkIds: [...new Set(observations
      .filter((item) => item.modelId === modelId && item.sourceIds.includes(sourceId))
      .map((item) => item.benchmarkId))]
  });
  const sourceBenchmarkIds = (sourceId) => [...new Set(observations
    .filter((item) => item.sourceIds.includes(sourceId))
    .map((item) => item.benchmarkId))];
  const attach = (sourceId, observation) => {
    observation.sourceIds = [...new Set([...(observation.sourceIds || []), sourceId])];
  };
  const mirrorSource = (sourceId, originalSourceId, predicate = () => true) => {
    for (const observation of observations.filter((item) => item.sourceIds.includes(originalSourceId) && predicate(item))) {
      attach(sourceId, observation);
    }
  };
  const addOrAttach = (sourceId, benchmarkId, modelId, value, unit = "%", setting = "", note = "") => {
    const matches = observations.filter((item) =>
      item.benchmarkId === benchmarkId &&
      item.modelId === modelId &&
      item.value === value &&
      item.unit === unit
    );
    const exact = matches.find((item) => (item.setting || "") === setting);
    if (exact) {
      attach(sourceId, exact);
      if (note && !exact.note) exact.note = note;
      return exact;
    }
    const observation = {
      id: `o${observations.length + 1}`,
      sourceIds: [sourceId], benchmarkId, modelId, value, unit, setting
    };
    if (note) observation.note = note;
    observations.push(observation);
    return observation;
  };
  const targetAudit = (sourceId, modelIds, note, scopeLabel = "目标模型列已核") => upsertAudit(sourceId, {
    status: "target-complete", scopeLabel, auditedAt: "2026-09-21",
    targetModels: modelIds.map((modelId) => sourceTarget(sourceId, modelId)), note
  });
  const completeAudit = (sourceId, note, scopeLabel = "公开成绩表已核") => upsertAudit(sourceId, {
    status: "complete", scopeLabel, auditedAt: "2026-09-21",
    expectedObservationCount: observations.filter((item) => item.sourceIds.includes(sourceId)).length,
    benchmarkIds: sourceBenchmarkIds(sourceId), note
  });

  const qwen38Max0902 = models.find((item) => item.id === "qwen3-8-max-0902");
  if (qwen38Max0902) {
    qwen38Max0902.scoreStatus = "metadata-only";
    qwen38Max0902.summary = "9 月 2 日升级快照已由阿里官方生命周期页确认；截至本轮审计没有独立公开 Benchmark 表，因此明确登记为 metadata-only，不借用无日期版或开放权重底座成绩。";
  }

  // Official ModelScope cards below are synchronized mirrors of the already
  // audited first-party HF/GitHub cards. Keep one semantic observation and
  // attach the mirror as additional provenance instead of duplicating rows.
  mirrorSource("hy4-modelscope", "hy4-github");
  targetAudit("hy4-modelscope", ["hy4-preview"],
    "ModelScope README、Benchmark Appendix 图片和专家盲评材料已与官方 GitHub/HF 卡逐项核对；目标列 53 条一致，同值合并为额外来源，不重复造行。");

  mirrorSource("kimi-k3-modelscope", "kimi-k3-hf");
  targetAudit("kimi-k3-modelscope", ["kimi-k3"],
    "ModelScope 卡与 Kimi K3 官方 HF 卡的目标表、脚注和设置一致；52 条目标观测已合并镜像来源。");
  mirrorSource("kimi-k25-modelscope", "kimi-k25-hf");
  targetAudit("kimi-k25-modelscope", ["kimi-k2-5"],
    "ModelScope 卡与 Kimi K2.5 官方 HF 卡的目标表、脚注和设置一致；47 条目标观测已合并镜像来源。");
  mirrorSource("kimi-k26-modelscope", "kimi-k26-hf");
  targetAudit("kimi-k26-modelscope", ["kimi-k2-6"],
    "ModelScope 卡与 Kimi K2.6 官方 HF 卡的目标列一致；35 条目标观测已合并镜像来源。");
  mirrorSource("kimi-k27-code-modelscope", "kimi-k27-code-hf");
  targetAudit("kimi-k27-code-modelscope", ["kimi-k2-7-code"],
    "ModelScope 卡与 Kimi K2.7 Code 官方 HF 卡的六项目标列及 K2.6 对照列一致；两列均保留镜像来源，审计目标列为 K2.7 Code。");

  mirrorSource("minimax-m27-modelscope", "minimax-m27-github");
  completeAudit("minimax-m27-modelscope",
    "ModelScope README 与官方 GitHub/HF 卡的四组公开能力材料一致；13 个 M2.7 数值及同图 38 个对照数值全部复用同一语义记录并合并来源。");

  mirrorSource("qwen36-27b-hf", "qwen36-27b-blog", (item) => item.modelId === "qwen3-6-27b");
  targetAudit("qwen36-27b-hf", ["qwen3-6-27b"],
    "HF 模型卡的 Language 与 Vision Language 两张 HTML 表已核；Qwen3.6-27B 的 45 个非空目标单元格与发布博客一致并合并来源。");
  mirrorSource("qwen36-27b-modelscope", "qwen36-27b-hf", (item) => item.modelId === "qwen3-6-27b");
  targetAudit("qwen36-27b-modelscope", ["qwen3-6-27b"],
    "ModelScope README 与官方 HF 卡的两张 HTML 结果表逐项一致；45 条目标观测合并镜像来源。");
  mirrorSource("qwen36-35b-modelscope", "qwen36-35b-hf", (item) => item.modelId === "qwen3-6-flash");
  targetAudit("qwen36-35b-modelscope", ["qwen3-6-flash"],
    "ModelScope README 与 Qwen3.6-35B-A3B 官方 HF 卡逐项一致；Qwen3.6-Flash 托管别名下的 51 条目标观测合并镜像来源。");

  mirrorSource("deepseek-v4-flash-modelscope", "deepseek-v4-flash-hf", (item) => item.modelId === "deepseek-v4-flash");
  targetAudit("deepseek-v4-flash-modelscope", ["deepseek-v4-flash"],
    "ModelScope 卡与 DeepSeek-V4-Flash 官方 HF 卡的 Non-Think、Think High、Think Max 三列逐项一致；61 条目标观测合并镜像来源。");
  mirrorSource("zai-glm5-modelscope", "zai-glm5-hf", (item) => item.modelId === "glm-5");
  targetAudit("zai-glm5-modelscope", ["glm-5"],
    "ModelScope 卡与 GLM-5 官方 HF/GitHub Benchmark 表逐项一致；20 条目标观测合并镜像来源。");
  mirrorSource("zai-glm51-modelscope", "zai-glm51-hf", (item) => item.modelId === "glm-5-1");
  targetAudit("zai-glm51-modelscope", ["glm-5-1"],
    "ModelScope 卡与 GLM-5.1 官方 HF/博客 Benchmark 表逐项一致；18 条目标观测合并镜像来源。");

  mirrorSource("xiaomi-mimo25-modelscope", "xiaomi-mimo25-hf", (item) => item.modelId === "mimo-v2-5");
  targetAudit("xiaomi-mimo25-modelscope", ["mimo-v2-5"],
    "ModelScope 卡与 MiMo-V2.5 官方 HF 卡一致：12 个发布结果和 12 个 GraphWalks 曲线点均已合并镜像来源。");
  upsertAudit("xiaomi-mimo25-base-modelscope", {
    status: "metadata-only", scopeLabel: "Base 卡无独立成绩", auditedAt: "2026-09-21",
    note: "ModelScope Base README 已完整核对。它复用 MiMo-V2.5 系列介绍和后训练模型图表，但没有把这些分数归给 Base；Base 的独立 20 项成绩由 Pro 模型卡提供。"
  });
  mirrorSource("xiaomi-mimo25-pro-modelscope", "xiaomi-mimo25-pro-hf");
  targetAudit("xiaomi-mimo25-pro-modelscope", ["mimo-v2-5-pro"],
    "ModelScope 卡与 MiMo-V2.5-Pro 官方 HF 卡逐项一致；Pro 的 12 条、Pro Base 的 20 条和 V2.5 Base 的 20 条观测均合并镜像来源。");
  for (const sourceId of ["xiaomi-mimo25-pro-base-hf", "xiaomi-mimo25-pro-base-modelscope"]) {
    mirrorSource(sourceId, "xiaomi-mimo25-pro-hf", (item) => item.modelId === "mimo-v2-5-pro-base");
    targetAudit(sourceId, ["mimo-v2-5-pro-base"],
      "Pro-Base 权重仓库 README 与 Pro 卡共享 Base Model Evaluation 表；MiMo-V2.5-Pro Base 的完整 20 项列已核并合并来源。",
      "Base 目标列已核");
  }

  // Tencent's corporate release contains three exact expert-evaluation
  // averages. It has no separate benchmark table beyond these claims.
  for (const [modelId, value] of [["hy4-preview", 2.99], ["glm-5-3", 2.92], ["kimi-k3", 2.94]]) {
    addOrAttach("hy4-news", "hy4-expert-blind-average", modelId, value, "/4", "163 internal experts · 203 engineering tasks · blind side-by-side evaluation");
  }
  completeAudit("hy4-news",
    "腾讯公司发布稿正文中的三项精确专家盲评平均分（Hy4 2.99、GLM-5.3 2.92、Kimi K3 2.94）已全部录入并与模型卡同值项合并；正文其余为定性能力描述。");
  upsertAudit("hy4-research", {
    status: "inaccessible", scopeLabel: "官方端点受限", auditedAt: "2026-09-21",
    note: "已分别检查官方研究页直连与文本代理；当前端点返回 Tencent EdgeOne 567 Restricted Access，无法可靠读取正文或判断是否有额外独立数值。没有从其他页面猜测或复制来源。"
  });

  // DeepSeek's launch page exposes two exact charts. Import every numeric
  // capability cell and retain its explicit 65.4 NL2Repo value alongside the
  // model-card value 64.0 instead of silently overwriting either source.
  const dsLaunchModels = ["deepseek-v4-1-flash", "deepseek-v4-pro", "deepseek-v4-flash-0731", "glm-5-3", "kimi-k3", "gpt-5-6-sol", "claude-opus-5"];
  const launchSetting = "DeepSeek V4.1 launch chart · exact public value · setting not further specified";
  const addLaunchRow = (benchmarkId, values, unit = "%", setting = launchSetting, note = "") => values.forEach((value, index) => {
    if (value == null) return;
    addOrAttach("deepseek-v41-launch", benchmarkId, dsLaunchModels[index], value, unit, setting, note);
  });
  addLaunchRow("gpqa-diamond", [90.9, 92.4, 89.9, 88.1, 92.9, 94.1, 93.4]);
  addOrAttach("deepseek-v41-launch", "hle", "deepseek-v4-1-flash", 36.8, "%", `${launchSetting} · full set`);
  for (const [modelId, value] of [["deepseek-v4-1-flash", 39.1], ["deepseek-v4-pro", 42.7], ["deepseek-v4-flash-0731", 37.8], ["glm-5-3", 42.0]]) {
    addOrAttach("deepseek-v41-launch", "hle", modelId, value, "%", `${launchSetting} · text-only subset`, "The launch chart marks this value with an asterisk denoting the text-only subset of HLE.");
  }
  for (const [modelId, value] of [["kimi-k3", 43.5], ["gpt-5-6-sol", 44.5], ["claude-opus-5", 56.3]]) {
    addOrAttach("deepseek-v41-launch", "hle", modelId, value, "%", `${launchSetting} · full set`);
  }
  addLaunchRow("codeforces-rating", [3471, 3348, 3289, null, null, null, null], "Rating");
  addLaunchRow("matharena-apex", [65.6, 65.3, 58.6, null, 65.6, null, null]);
  addLaunchRow("terminal-bench-2-1", [90.6, 87.9, 82.7, 88.2, 88.3, 88.8, 89.1]);
  addLaunchRow("terminal-bench-3-0", [30.0, 11.8, 7.6, 28.3, 17.7, 34.4, 43.3]);
  addLaunchRow("terminal-bench-4-0", [31.2, 12.4, 7.0, 37.9, 12.6, 39.9, 51.8]);
  addLaunchRow("deepswe-v1-1", [74.2, 62.7, 54.4, 66.9, 67.5, 73.0, 74.0]);
  addLaunchRow("programbench-almost", [20.3, 15.5, null, 19.0, 17.5, 23.0, 37.0]);
  addLaunchRow("nl2repo", [65.4, 61.5, 54.2, 58.0, 58.0, 56.8, 75.3], "%", `${launchSetting} · launch-page table`,
    "The launch page reports 65.4 for V4.1 Flash while the official model-card dataset contains 64.0 under a different stated setting; both are retained.");
  addLaunchRow("cybergym", [88.1, 83.3, 76.7, 84.5, 80.0, 84.5, null]);
  addLaunchRow("sec-bench-pro", [62.8, 56.4, 30.9, null, null, 74.3, null]);
  addLaunchRow("exploitgym-rate", [15.3, 5.4, 1.8, 15.0, null, 33.7, 22.1]);
  addLaunchRow("hle-tools", [63.9, 60.0, 51.5, 62.5, 59.8, null, 63.6]);
  addLaunchRow("automationbench", [54.8, 43.2, 37.7, 48.8, 46.7, 45.8, 50.3]);
  addLaunchRow("agents-last-exam-pass", [31.8, 25.7, 25.2, 28.5, 27.6, 26.7, 28.6]);
  addLaunchRow("chartography", [78.9, null, null, null, 68.1, 79.9, 84.0], "%", `${launchSetting} · with tools`);
  addLaunchRow("babyvision", [89.6, null, null, null, 85.7, 88.9, 94.1], "%", `${launchSetting} · with tools`);
  addLaunchRow("zerobench-main", [49.0, null, null, null, 41.0, 53.0, 52.0], "%", `${launchSetting} · with tools`);
  completeAudit("deepseek-v41-launch",
    "发布页 benchmark-en.png 与 agentic-benchmark.png 的全部公开数值单元格已转录；重复值合并来源。NL2Repo 的发布页 65.4 与模型卡 64.0 不一致，按不同来源/setting 并存。价格、KV cache 与架构图不作为能力成绩。");

  observations.forEach((observation, index) => { observation.id = `o${index + 1}`; });
})();
