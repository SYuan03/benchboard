(() => {
  const { benchmarkFamilies } = window.BENCH_DATA;

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

  mergeFamily("osworld-2", "OSWorld", [
    { benchmarkId: "osworld", label: "Version unspecified" },
    { benchmarkId: "osworld-average-steps", label: "Version unspecified · Average steps" },
    { benchmarkId: "osworld-2", label: "2.0 · Overall" },
    { benchmarkId: "osworld-2-partial", label: "2.0 · Partial" },
    { benchmarkId: "osworld-2-strict", label: "2.0 · Strict" },
    { benchmarkId: "osworld-2-binary", label: "2.0 · Binary" },
    { benchmarkId: "osworld-verified", label: "Verified" }
  ]);
  mergeFamily("zerobench", "ZeroBench", [
    { benchmarkId: "zerobench", label: "Score / setting unspecified" },
    { benchmarkId: "zerobench-main", label: "Main" },
    { benchmarkId: "zerobench-sub", label: "Sub" },
    { benchmarkId: "zerobench-pass5-without-ci", label: "Pass@5 · Without CI" },
    { benchmarkId: "zerobench-pass5-with-ci", label: "Pass@5 · With CI" }
  ]);
  mergeFamily("omnidocbench-family", "OmniDocBench", [
    { benchmarkId: "omnidocbench", label: "NED · Lower is better" },
    { benchmarkId: "omnidocbench-score", label: "Score · Version unspecified" },
    { benchmarkId: "omnidocbench-1-5-score", label: "v1.5 score" }
  ]);
  mergeFamily("deepswe-family", "DeepSWE", [
    { benchmarkId: "deepswe-v1-0", label: "v1.0" },
    { benchmarkId: "deepswe-v1-1", label: "v1.1" }
  ]);
  mergeFamily("skillsbench-family", "SkillsBench", [
    { benchmarkId: "skillsbench", label: "Version unspecified" },
    { benchmarkId: "skillsbench-1-1", label: "v1.1" }
  ]);
  mergeFamily("posttrainbench-family", "PostTrainBench", [
    { benchmarkId: "posttrainbench", label: "Version unspecified" },
    { benchmarkId: "posttrainbench-v1-1", label: "v1.1" },
    { benchmarkId: "posttrainbench-lite", label: "Lite" }
  ]);
  mergeFamily("mcp-mark-family", "MCP-Mark", [
    { benchmarkId: "mcp-mark", label: "Version unspecified" },
    { benchmarkId: "mcpmark-verified", label: "Verified" }
  ]);
  mergeFamily("webarena-family", "WebArena", [
    { benchmarkId: "webarena", label: "Original" },
    { benchmarkId: "webarena-verified", label: "Verified" }
  ]);
  mergeFamily("cursorbench-family", "CursorBench", [
    { benchmarkId: "cursorbench", label: "Version unspecified" },
    { benchmarkId: "cursorbench-3-2", label: "v3.2" }
  ]);
  mergeFamily("spreadsheetbench-family", "SpreadsheetBench", [
    { benchmarkId: "spreadsheetbench-v1", label: "v1" },
    { benchmarkId: "spreadsheetbench-2", label: "v2" }
  ]);
  mergeFamily("videomme-family", "VideoMME", [
    { benchmarkId: "videomme", label: "Version unspecified" },
    { benchmarkId: "videomme-audio", label: "Version unspecified · With audio" },
    { benchmarkId: "video-mme-v2", label: "v2" }
  ]);
  mergeFamily("real-world-finance-family", "Anthropic Real-World Finance", [
    { benchmarkId: "real-world-finance", label: "v1" },
    { benchmarkId: "real-world-finance-v2", label: "v2" }
  ]);
  mergeFamily("livecodebench-family", "LiveCodeBench", [
    { benchmarkId: "livecodebench", label: "Version unspecified" },
    { benchmarkId: "livecodebench-v6", label: "v6" },
    { benchmarkId: "livecodebench-pro", label: "Pro · Elo" }
  ]);
  mergeFamily("ocr-bench-v2", "OCRBench", [
    { benchmarkId: "ocrbench", label: "Original" },
    { benchmarkId: "ocrbench-v2", label: "v2 · Overall" },
    { benchmarkId: "ocr-bench-v2-en", label: "v2 · English" },
    { benchmarkId: "ocr-bench-v2-zh", label: "v2 · Chinese" }
  ]);
  mergeFamily("healthbench", "HealthBench", [
    { benchmarkId: "healthbench", label: "Standard" },
    { benchmarkId: "healthbench-hard", label: "Hard" },
    { benchmarkId: "healthbench-consensus", label: "Consensus" },
    { benchmarkId: "healthbench-professional", label: "Professional" }
  ]);
  mergeFamily("officeqa-family", "OfficeQA", [
    { benchmarkId: "officeqa", label: "Original" },
    { benchmarkId: "officeqa-pro", label: "Pro" },
    { benchmarkId: "officeqa-pro-mm", label: "Pro · Multimodal" }
  ]);
  mergeFamily("mathvista-family", "MathVista", [
    { benchmarkId: "mathvista", label: "Full" },
    { benchmarkId: "mathvista-mini", label: "Mini" }
  ]);
  mergeFamily("wide-search-family", "WideSearch", [
    { benchmarkId: "wide-search", label: "Published score" },
    { benchmarkId: "wide-search-item-f1", label: "Item F1" }
  ]);
  mergeFamily("programbench", "ProgramBench", [
    { benchmarkId: "programbench", label: "Main score" },
    { benchmarkId: "programbench-resolved", label: "Resolved" },
    { benchmarkId: "programbench-almost", label: "Almost resolved" },
    { benchmarkId: "programbench-average-pass", label: "Average pass rate" },
    { benchmarkId: "programbench-tiers", label: "Solved tiers" }
  ]);
  mergeFamily("hle", "Humanity's Last Exam", [
    { benchmarkId: "hle", label: "No tools" },
    { benchmarkId: "hle-tools", label: "With tools" },
    { benchmarkId: "hle-vl-tools", label: "Vision-language · With tools" },
    { benchmarkId: "hle-verified", label: "Verified" }
  ]);
  mergeFamily("swe-bench-family", "SWE-Bench", [
    { benchmarkId: "swe-bench-verified", label: "Verified" },
    { benchmarkId: "swe-multilingual", label: "Multilingual" },
    { benchmarkId: "swe-multimodal", label: "Multimodal" },
    { benchmarkId: "swe-bench-pro", label: "Pro · Resolved" },
    { benchmarkId: "swe-bench-pro-output-tokens", label: "Pro · Average output tokens" }
  ]);
  mergeFamily("frontiercode-family", "FrontierCode", [
    { benchmarkId: "frontiercode-v1", label: "v1" },
    { benchmarkId: "frontiercode-1-1-main", label: "v1.1 · Main" },
    { benchmarkId: "frontiercode-1-1-extended", label: "v1.1 · Extended" },
    { benchmarkId: "frontiercode-diamond", label: "Diamond" }
  ]);
  mergeFamily("arc-agi-family", "ARC-AGI", [
    { benchmarkId: "arc-agi-1", label: "1" },
    { benchmarkId: "arc-agi-2", label: "2" },
    { benchmarkId: "arc-agi-3", label: "3" }
  ]);
  mergeFamily("tau2-family", "τ²-bench", [
    { benchmarkId: "tau2-bench", label: "Aggregate / domain unspecified" },
    { benchmarkId: "tau2-retail", label: "Retail" },
    { benchmarkId: "tau2-telecom", label: "Telecom" }
  ]);
  mergeFamily("songformbench-family", "SongFormBench", [
    { benchmarkId: "songform-harmonix-accuracy", label: "HarmonixSet · Accuracy" },
    { benchmarkId: "songform-harmonix-hr-5f", label: "HarmonixSet · HR@0.5F" },
    { benchmarkId: "songform-harmonix-hr-3f", label: "HarmonixSet · HR@3F" },
    { benchmarkId: "songform-cn-accuracy", label: "CN · Accuracy" },
    { benchmarkId: "songform-cn-hr-5f", label: "CN · HR@0.5F" },
    { benchmarkId: "songform-cn-hr-3f", label: "CN · HR@3F" }
  ]);
  mergeFamily("uro-bench-pro-family", "URO-Bench-Pro", [
    { benchmarkId: "uro-bench-pro-understanding", label: "Understanding" },
    { benchmarkId: "uro-bench-pro-reasoning", label: "Reasoning" },
    { benchmarkId: "uro-bench-pro-oral", label: "Oral conversation" }
  ]);
  mergeFamily("aime-family", "AIME", [
    { benchmarkId: "aime-2025", label: "2025" },
    { benchmarkId: "aime-2026", label: "2026" }
  ]);
  mergeFamily("browsecomp-family", "BrowseComp", [
    { benchmarkId: "browsecomp", label: "English / original" },
    { benchmarkId: "browsecomp-zh", label: "Chinese" }
  ]);
  mergeFamily("frontiermath-family", "FrontierMath", [
    { benchmarkId: "frontiermath-t1-3", label: "v2 · Tier 1–3" },
    { benchmarkId: "frontiermath-t4", label: "v2 · Tier 4" }
  ]);
  mergeFamily("common-voice-15-family", "Common Voice 15", [
    { benchmarkId: "cv15-en-wer", label: "English · WER" },
    { benchmarkId: "cv15-zh-wer", label: "Mandarin · WER/CER" },
    { benchmarkId: "cv15-zh-tw-wer", label: "Traditional Chinese · WER/CER" },
    { benchmarkId: "cv15-yue-wer", label: "Cantonese · WER/CER" }
  ]);
  mergeFamily("librispeech-family", "LibriSpeech", [
    { benchmarkId: "librispeech-clean-wer", label: "Clean · WER" },
    { benchmarkId: "librispeech-other-wer", label: "Other · WER" }
  ]);
  mergeFamily("trae-agent-bench-family", "Trae Agent Bench", [
    { benchmarkId: "trae-web-bench", label: "Web Bench" },
    { benchmarkId: "trae-repo-env", label: "Repo Env" },
    { benchmarkId: "trae-artifacts", label: "Artifacts" },
    { benchmarkId: "trae-error-fix-python", label: "Error Fix · Python" },
    { benchmarkId: "trae-error-fix-js", label: "Error Fix · JavaScript" },
    { benchmarkId: "trae-error-fix-java", label: "Error Fix · Java" },
    { benchmarkId: "trae-error-fix-go", label: "Error Fix · Go" },
    { benchmarkId: "trae-codegen-python", label: "Code Gen · Python" },
    { benchmarkId: "trae-codegen-js", label: "Code Gen · JavaScript" }
  ]);
  mergeFamily("benchcad-family", "BenchCAD", [
    { benchmarkId: "benchcad", label: "Main score" },
    { benchmarkId: "benchcad-vision2code-iou", label: "Vision2Code · Voxel IoU" }
  ]);
  mergeFamily("charxiv-family", "CharXiv", [
    { benchmarkId: "charxiv", label: "Earlier / Reasoning" },
    { benchmarkId: "charxiv-dq", label: "DQ" },
    { benchmarkId: "charxiv-rq-without-ci", label: "RQ · Without CI" },
    { benchmarkId: "charxiv-rq-with-ci", label: "RQ · With CI" }
  ]);
  mergeFamily("swe-atlas-family", "SWE-Atlas", [
    { benchmarkId: "swe-atlas", label: "Overall / setting unspecified" },
    { benchmarkId: "swe-atlas-codebase-qa", label: "Codebase Q&A" },
    { benchmarkId: "swe-atlas-test-writing", label: "Test Writing" },
    { benchmarkId: "swe-atlas-refactoring", label: "Refactoring" }
  ]);
})();
