# First-party source-surface audit

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
