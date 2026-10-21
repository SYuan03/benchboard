(() => {
  const data = window.BENCH_DATA;
  const { sources, sourceAudits, models, benchmarks, benchmarkFamilies, observations } = data;
  data.meta.updated = "2026-10-21";

  const sourceId = "openai-low-resource-coding";
  sources.push({ id: sourceId, vendorId: "openai", publisher: "OpenAI",
    date: "2026-10-19", tier: "official", kind: "release",
    title: "Advancing coding in low-resource programming languages",
    url: "https://openai.com/index/low-resource-programming-languages/" });

  for (const modelId of ["gpt-6-astra", "gpt-6-luna", "gpt-5-6-sol", "gpt-6-1-sol"]) {
    const model = models.find((item) => item.id === modelId);
    model.referenceSourceIds = [...new Set([...(model.referenceSourceIds || []), sourceId])];
  }

  const languageViews = [
    ["overall", "20-language average"],
    ["cobol", "COBOL"],
    ["ocaml", "OCaml"],
    ["fortran", "Fortran"],
    ["visual-basic", "Visual Basic"]
  ];
  for (const [suffix, label] of languageViews) {
    benchmarks.push({ id: `multilangbench-${suffix}-pass`, name: `MultiLangBench · ${label} test pass rate`,
      category: "编码", direction: "higher",
      description: `SQLite 3.40.1 implementation from scratch; ${label} converted SQLite test pass rate. A solution in the wrong language scores zero.` });
  }
  benchmarks.push({ id: "multilangbench-average-api-cost", name: "MultiLangBench · Estimated average API cost",
    category: "编码", direction: "lower",
    description: "Estimated API cost per generated implementation across the 20-language evaluation; separate from test pass rate." });
  benchmarks.push({ id: "openai-cobol-migration-exact", name: "OpenAI COBOL migration · Exact behavior accuracy",
    category: "编码", direction: "higher",
    description: "Migration of COBOL programs into C++, Java, Kotlin, Python, or Rust; a migration succeeds only when every hidden byte-for-byte behavior test passes." });
  benchmarkFamilies.push({ id: "multilangbench", name: "MultiLangBench", variants: [
    ...languageViews.map(([suffix, label]) => ({ benchmarkId: `multilangbench-${suffix}-pass`, label: `${label} · test pass rate` })),
    { benchmarkId: "multilangbench-average-api-cost", label: "20-language mean · estimated API cost" }
  ] });

  // The publication text explicitly prints the mean and four selected language values.
  // It names the other 16 languages but does not print their exact scores in text.
  const passRows = [
    ["gpt-6-astra", [87.4, 72.1, 85.8, 83.5, 89.4]],
    ["gpt-5-6-sol", [26.8, 10.9, 25.6, 21.4, 27.5]],
    ["gpt-6-luna", [40.3, 17.1, 34.1, 31.4, 41.6]]
  ];
  for (const [modelId, values] of passRows) {
    languageViews.forEach(([suffix, label], index) => {
      observations.push({ id: `o${observations.length + 1}`, sourceIds: [sourceId],
        benchmarkId: `multilangbench-${suffix}-pass`, modelId, value: values[index], unit: "%",
        setting: `OpenAI publication · SQLite 3.40.1 from scratch · ${label} · maximum reasoning effort · 272-test recommended subset in public harness; exact publication test selection and API snapshot not stated`,
        note: "Exact percentage printed in the October 19 publication. The public harness supports a 272-test subset and optional full-suite runs; the article does not identify which was used for these figures." });
    });
  }
  for (const [modelId, value] of [["gpt-5-6-sol", 3.48], ["gpt-6-luna", 0.77]]) {
    observations.push({ id: `o${observations.length + 1}`, sourceIds: [sourceId],
      benchmarkId: "multilangbench-average-api-cost", modelId, value, unit: "USD/sample",
      setting: "OpenAI publication · 20-language average · maximum reasoning effort · estimated API cost per sample · exact API snapshot not stated",
      note: "Published estimate, not measured inference spend; the publication does not print a GPT-6 Astra cost." });
  }
  for (const [modelId, effort, value] of [
    ["gpt-6-1-sol", "low", 86.6],
    ["gpt-5-6-sol", "low", 5.4],
    ["gpt-6-1-sol", "higher level, exact tier not stated", 97.9]
  ]) {
    observations.push({ id: `o${observations.length + 1}`, sourceIds: [sourceId],
      benchmarkId: "openai-cobol-migration-exact", modelId, value, unit: "%",
      setting: `OpenAI publication · COBOL to C++/Java/Kotlin/Python/Rust · hidden byte-for-byte tests · reasoning: ${effort} · exact API snapshot and run count not stated`,
      note: "Published overall accuracy. The 39% lower cost claim for GPT-6.1 Sol at low effort is relative; no exact cost is inferred." });
  }

  sourceAudits.push({ sourceId, status: "partial", scopeLabel: "正文数值已核", auditedAt: "2026-10-21",
    expectedObservationCount: 20,
    auditScope: "All 20 exact scalar results stated in the publication prose: 15 MultiLangBench pass rates, two estimated mean API costs, and three COBOL migration accuracies.",
    benchmarkIds: [...languageViews.map(([suffix]) => `multilangbench-${suffix}-pass`), "multilangbench-average-api-cost", "openai-cobol-migration-exact"],
    note: "Publication text supplies the 20 stored values. The article's chart covers 20 languages, but only four per-language examples are printed in text; the other 16 language scores and any unprinted chart cost cells are outside this audit. OpenAI's public MultiLangBench repository describes the SQLite 3.40.1 harness, 24k converted tests, recommended 272-test subset, wrong-language zero rule, and no-internet setup; the publication does not specify exact test selection, model API snapshots, or run counts. COBOL migration uses a separate exact-behavior metric and its higher-effort tier is unnamed." });
})();
