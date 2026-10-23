# First-party source-surface audit

## 2026-10-23 follow-up: Voxtral 3 speech models

Mistral's [Voxtral 3 release](https://mistral.ai/news/voxtral-3/) was published October 22 and embeds nine exact chart specifications. We imported 19 target-model cells for four separately named variants: [Small Transcribe 3](https://docs.mistral.ai/models/voxtral-small-transcribe-3-0), [Mini Transcribe 3](https://docs.mistral.ai/models/voxtral-mini-transcribe-3-0), [Mini Transcribe Realtime 3](https://docs.mistral.ai/models/voxtral-mini-transcribe-realtime-3-0), and [Mini TTS 3](https://docs.mistral.ai/models/voxtral-mini-tts-3-0). Their official model docs date the previews October 20. FLEURS-45 forced and inferred language settings, FLEURS-35 streaming latency settings, an explicitly offline baseline, diarization cpWER, Earnings-22 keyphrase recall with and without context, and Artificial Analysis WER Index are separate views. The four TTS quality measures retain their published sample sets, judge, and 1–5 versus percent scales. Chart price axes are excluded from capability scores, and comparison-model columns remain outside this target audit. The release describes TTS support for 35+ languages, while the TTS model docs say nine; neither claim is silently substituted for the other.

## 2026-10-23 follow-up: Ling-3.0-flash-Sante

The [pinned official Ling-3.0-flash-Sante model card](https://huggingface.co/inclusionAI/Ling-3.0-flash-Sante/blob/f74bd27bd26ffc71a50dd847805f8f7666ff0b43/README.md) embeds a 16-row evaluation image. All 16 target-model values were checked visually; the image SHA-256 was `ba59c1b830d83ff6e416b6871d015f961b04aefb54875a4eece98718a71e23f9`. The card identifies highest-tier reasoning and default temperature 1.0/top_p 0.95, plus particular BrowseComp, HLE, DeepSearchQA, MedMCQA, and Tau3-Banking settings. Its three AFU measures are explicitly internal, with task counts and metric definitions unpublished. Unlabeled score units are stored as “Score”; the GDPval-V2-AA and DeepSearchQA numbers therefore use their own source-specific views instead of being asserted as Elo or F1. The model's public repository and weights appeared October 19, while this substantive card revision was posted October 22; no API release date is inferred. Comparison columns and non-benchmark illustrations are outside the target-column audit.

## 2026-10-23 follow-up: MiniMax M3.1 Flash and Atria Dawn Preview

The [MiniMax M3.1 Flash official model card](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash/blob/54e4e69dfc452b1e94a426c24a4fdeeaa8e3ad5e/README.md) publishes 15 exact target-model cells. All 15 are recorded, with the card's benchmark versions and per-row harness notes. The [October 19 launch](https://www.minimax.io/blog/minimax-m31f) corroborates BankerToolBench 76.2, DeepSWE v1.1 73.7, OSWorld 2.0 61.7, and Agents' Last Exam 29.6. Its CyberGym 82% is rounded relative to the card's exact 82.2%, so no duplicate score was created. GDP.pdf AA is explicitly attributed to Artificial Analysis, and ALE uses its Overall score rather than the separate pass-rate view. HLE is the 2,158-question text-only subset without tools. The model-card target column is complete; comparison columns and release cost graphics are outside this pass. The card's general inference sampling guidance is not asserted as an evaluation setting.

The [Atria Dawn Preview pinned model card](https://huggingface.co/internlm/Atria-Dawn-Preview/blob/311a9b8c6c0e8dd4b00b2d7baff7a926c3415e78/README.md) and [technical report Table 1 and Appendix B](https://arxiv.org/html/2609.15818v2) print the same 100 numeric cells across 16 benchmark rows and seven model labels. The SkillsBench row's seven cells were already present; the other 93 cells are now recorded. The paper identifies 79 text-only SkillsBench tasks in OpenHands, 97 Banking Knowledge tasks, four independent Terminal-Bench 2.1 runs, the GPT Terminus 2 route and Claude Opus 4.8 fallback, and benchmark-specific harnesses and judges. GDPval Elo and MLE-Bench Lite HumanRank have separate metric views. DeepSearchQA, WideSearch, and Workspace-Bench results keep paper-specific views where the public table does not establish a directly comparable score subtype or task count. The source audits are complete for the main 16-row table; narrative case-study measurements and duplicate graphics are outside that declared scope.

## 2026-10-21 follow-up: low-resource coding evaluations

OpenAI's [October 19 publication](https://openai.com/index/low-resource-programming-languages/) prints 20 exact scalar results for two separate evaluations. MultiLangBench asks a model to build SQLite 3.40.1 from scratch in each of 20 languages. We imported the three published 20-language mean test pass rates and the four language examples printed for each model (COBOL, OCaml, Fortran, and Visual Basic), plus the two printed estimated average API costs. The publication says these MultiLangBench runs used maximum reasoning effort. GPT-6 Astra has no printed exact cost. The other 16 language scores shown only in the chart are outside this prose-value audit.

The separate COBOL migration evaluation checks byte-for-byte behavioral parity after rewriting into C++, Java, Kotlin, Python, or Rust. Its three printed accuracies are separate from SQLite test pass rates: GPT-6.1 Sol 86.6% and GPT-5.6 Sol 5.4% at low reasoning effort, and GPT-6.1 Sol 97.9% at a higher, unnamed effort level. The 39% cost reduction is relative, so no exact migration cost was inferred. OpenAI's [public MultiLangBench repository](https://github.com/openai/MultiLangBench) defines the SQLite 3.40.1 harness, 24,000 converted tests, a recommended 272-test subset, a wrong-language zero rule, and no internet access. The publication does not identify its exact test selection, API snapshots, or run counts; those details remain unspecified in each stored setting. Source coverage is partial for the full chart.

## 2026-10-15 follow-up: GPT-6.1 Sol

OpenAI's [GPT-6.1 Sol release page](https://openai.com/index/introducing-gpt-6-1-sol/) contains 102 exact points in six capability charts: DeepSWE v1.1 (15), GDP.pdf (20), AutomationBench v1.0.6 (21), OSWorld 2.0 offline partial reward on v2026.08.08 (15), Terminal-Bench Science 0.1 (16), and factual error rate on difficult flagged conversations (15). All five effort settings and displayed per-task costs are attached to each point. The chart's Opus 5.5 with fallbacks is a separate comparison route; its fallback model is not identified. AutomationBench's Fable 5.1 cost omits fallbacks on roughly 40% of tasks, as the caption warns. GDP.pdf has its own chart-score view because the page does not define it as the all-pass or criterion-pass metric used in other reports.

The [GPT-6.1 Sol system card addendum](https://deploymentsafety.openai.com/gpt-6-1-sol), published September 29, supplies eight target HealthBench values (four length-adjusted and four raw) and four target MentalHealthBench task means. MentalHealthBench reports four responses per task and separate task counts and standard errors for the overall and three acuity views. Its comparison columns were not transcribed in this pass. The remaining card tables and figures concern safety, robustness, alignment, monitoring, or deployment risk. The card notes that comparison values for earlier models can reflect later versions, so differing chart values from earlier launch pages retain their distinct source and setting.

Audited on 2026-09-20.

This pass covers Gemini 3 Flash, GLM-5.2, GPT-5.2 / Pro, GPT-5.3-Codex, GPT-5.5 / Pro, Claude Sonnet 4.6, and Claude Sonnet 5. It checks official release pages, model cards, and linked evaluation or system-card documents separately. A source marked target-complete guarantees the named model columns only; it does not imply that every comparison column was imported.

## Coverage by source surface

| Model | Official surface | Audit result | Imported target cells | Imported comparison cells | Notes |
| --- | --- | ---: | ---: | ---: | --- |
| Gemini 3 Flash | Google DeepMind model card | target-complete | 24 | 0 | The capability table is an embedded image and disappears from ordinary PDF text extraction. It was checked visually. |
| Gemini 3 Flash | Evaluation methodology PDF | target-complete | 24 | 0 | Same 24 target cells as the model card; shared provenance, not duplicate rows. Harness and tool notes are retained. |
| GLM-5.2 | Z.ai launch blog | target-complete | 19 | 0 | Full Benchmark Table target column. The complete table has 133 non-empty capability cells across eight model columns. |
| GLM-5.2 | Hugging Face model card | target-complete | 19 | 0 | Repeats the official target column; stored as shared provenance. |
| GLM-5.2 | Linked GLM-5 technical report | metadata-only | 0 | 0 | The report describes GLM-5, not GLM-5.2. Its numbers are not reassigned to the later model. |
| GPT-5.2 / Pro | OpenAI launch appendix | target-complete | 40 / 12 | 0 | Complete target columns. Effort, tools, and context bins remain separate. |
| GPT-5.2 | OpenAI system-card update | scoped | 3 | 0 | General HealthBench capability rows are included. Safety, deception, jailbreak, and Preparedness evaluations are excluded from capability rankings. |
| GPT-5.3-Codex | OpenAI launch appendix | target-complete | 6 | 0 | All six xhigh target cells. |
| GPT-5.3-Codex | OpenAI system card | metadata-only | 0 | 0 | No independent general-capability result table; numeric sections concern safety or Preparedness. |
| GPT-5.5 / Pro | OpenAI launch evaluation matrix | target-complete | 37 / 8 | 0 | Complete target columns, including distinct long-context bins. |
| GPT-5.5 | OpenAI system card | scoped | 4 | 0 | Four length-adjusted HealthBench capability metrics are included; safety and high-risk evaluations are excluded. |
| Claude Sonnet 4.6 | Anthropic launch page | target-complete | 16 | 0 | Complete launch target cells. BrowseComp 74.7 remains distinct from the revised system-card value 74.01. |
| Claude Sonnet 4.6 | Anthropic system card | target-complete | 88 | 0 | All clearly mapped scalar capability results, including GMMLU and MILU slices. |
| Claude Sonnet 5 | Anthropic launch page | target-complete | 6 | 0 | Complete headline target cells; identical card cells share provenance. |
| Claude Sonnet 5 | Anthropic system card | target-complete | 53 | 23 | Complete clearly mapped scalar capability results plus 23 explicit Sonnet 4.6 rerun/comparison cells. |

## Disagreements retained

- Claude Sonnet 4.6 BrowseComp is 74.7% in the launch image and 74.01% in the revised system card.
- Claude Sonnet 4.6 OSWorld-Verified is 72.5% in its launch/card setup and 78.5% in the later Sonnet 5 card after a zoom-tool fix and a per-turn output increase to 128K.
- Claude Sonnet 4.6 CharXiv is 72.4 / 77.4 in the original card and 71.6 / 85.3 in the Sonnet 5 card rerun with a revised grader/tool setup.
- HealthBench values are implementation-sensitive. GPT-5.2 raw scores, GPT-5.5 length-adjusted scores, and Anthropic reruns stay separate with their settings.

## Explicit exclusions

- Claude Sonnet 4.6 GraphWalks Parents 1M is visibly shifted or malformed in the source table, so no value is inferred. The unambiguous Parents 256K values are included.
- Claude Sonnet 4.6 WebArena-Verified pass@k has no exact point labels. Only labeled pass@1 results are included.
- Claude Sonnet 5 ProgramBench is published as a 76–86% range rather than an exact point; it is not converted into a scalar result.
- Cost, latency, output-token counts, relative safety deltas, alignment, jailbreak, Preparedness, and deployment-risk measurements are not mixed into capability leaderboards.

Every imported observation retains the metric and unit, model variant, evaluation setting, effort, tools, context or harness details, and its exact source IDs.
