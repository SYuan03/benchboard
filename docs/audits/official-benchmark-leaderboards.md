# Official benchmark leaderboard audit

## 2026-10-23 follow-up: Vals AI MiniMax M3.1 Flash

The [Vals AI model benchmark page](https://www.vals-ai.com/models/minimax_MiniMax-M3.1-flash) prints nine MiniMax M3.1 Flash accuracy values with uncertainty ranges. All nine are recorded across Vals Index v2.2, Finance Index, EMB v1.1, Finance Agent v2.1, Legal Research Bench, Tax Agent Bench, Vibe Code Bench v1.1, HLAB-Vals-1.1, and Terminal-Bench 4.0. Vals says it used the official MiniMax API at temperature 1, top_p 0.95, and max compute effort. The 25.25% Vals Terminal-Bench result remains separate from MiniMax's 38.1% provider run and the Terminal-Bench maintainer leaderboard because the evaluation settings differ. The Vals page conflicts internally on cost/test ($0.660 in the current summary versus $4.46 in its dated October 20 update) and max output tokens (524,288 versus 262K). Neither disputed metadata field was attached to the scores. Vals dates the model October 20; BenchBoard retains the provider's October 19 release date.

## 2026-10-23 follow-up: Terminal-Bench 4.0 cost correction

The [maintainer leaderboard](https://www.tbench.ai/) still publishes 35 model–agent–effort rows. Their scores, confidence intervals, agents, efforts, submission dates, and displayed token totals match BenchBoard. The existing GLM-5.3-Flash / Claude Code / none-effort row now displays a total cost of **$118.74**, not the previously stored $2.9k. Its row ID and 35.8% ±3.5% result remain the same, with 2.9B displayed tokens. The maintainer updated the row at 2026-10-23 00:29 UTC; this is a correction to the displayed cost, not a new benchmark result. The source audit date and setting have been refreshed. PinchBench v2 still has 61 model labels and 122 matching Best/Average values; its live 147-task count remains at odds with the v2.0.0 release note's 148. SkillsBench 1.1's 25 configurations and 49 published With/Without values also match.

## 2026-10-22 follow-up: DeepSeek V4.1 Flash 1017

The [official 1017 model card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017) and [DeepSeek API changelog](https://api-docs.deepseek.com/updates/) agree on all 12 exact target values: the full and text-only HLE results plus ten other benchmark results. The 1017 checkpoint, released 2026-10-17, is separate from the September V4.1 Flash checkpoint. Automation-Bench v1.0.6 and Apex Bench v1.1 have distinct views from version-unspecified results. The changelog identifies Claude Code for Terminal-Bench 4.0, Mini-SWE-V2 for DeepSWE v1.1, and pass@5 for ZeroBench-main; other candidate harnesses and reasoning effort are not specified. The provider-run 42.3 Terminal-Bench score is separate from the benchmark maintainer's published rows. Both source audits cover only the 1017 target column; the model card's comparison columns and release graphics' runtime, length, and cost points remain outside scope.

The live [PinchBench v2 leaderboard](https://pinchbench.com/) still has 61 model labels. All 122 stored Best/Average values match the current embedded leaderboard data as of October 22. The previously noted 147/148 task-count discrepancy remains documented; the task counter itself was not rechecked in this pass.

The [Terminal-Bench 4.0 maintainer leaderboard](https://www.tbench.ai/) still has 35 model–agent–effort rows. Their displayed scores, confidence intervals, agents, efforts, dates, token totals, and cost numbers match the stored results. Two stored cost labels retain explanatory wording beyond the site's display text.

## 2026-10-20 follow-up: CodeMemoryBench paper

Tencent Hunyuan's [official CodeMemoryBench paper](https://github.com/Tencent-Hunyuan/Hy-Memory/blob/fba347ad8d04eefbc51a466fa4cbd7d4e1936109/docs/papers/CMB_A_Coding_Memory_Benchmark_for_Long_Horizon_and_Interleaved_Coding_Agents.pdf) reports Claude Sonnet 5 and DeepSeek V4 Flash with distinct memory configurations in the same mini-swe-agent scaffold. We checked 42 headline percentages against rendered Tables 2 and 3: 14 model–method rows each for Code Resolved and QA score on CodeMemoryBench, plus 14 Resolved values on the separate SWE-ContextBench Lite Related evaluation. The Code track has 216 tasks across nine repositories and requires both F2P and P2P tests to pass. QA scores 750 open questions by mean judge-derived requirement matches. The 99-task SWE-ContextBench run determines Resolved from F2P, while reporting P2P separately; its scores do not share the CMB Code view.

FullContext, RAG, Mem0, MemOS, OpenViking, RepoMemory, TriLink, and the external run's NoMemory reference remain distinct settings. Both candidate labels lack exact snapshots, reasoning effort, and run counts in the paper. In particular, DeepSeek V4 Flash cannot be assigned to the original or 0731 checkpoint; both labels use comparison-only model records. The paper says the frozen construction histories were generated with Claude Sonnet 5 for both evaluated backbones. Table 2 repository task counts, Table 3 Patch N/A/F2P/P2P diagnostics, and appendix ablations remain outside this headline audit, so source coverage is partial. The repository README describes a September release, while the pinned PDF first entered the official repository on 2026-10-16.

## 2026-10-19 follow-up: SurveyReview v1.0

The [official SurveyReview repository leaderboard](https://github.com/zai-org/SurveyReview/blob/f2352dc2eef4a52a6943002f40a4902cc0d84879/README.md) and [project page](https://surveyreview.github.io/) publish the same 84 values: seven model labels across Human-aligned Score (HAS), MSE and MAE for readability, criticalness, comprehensiveness, and structure, their separate average errors, and Reason Quality Score (RQS). MSE and MAE are lower-is-better; HAS and RQS are higher-is-better. HAS combines reviewer-score alignment and rationale quality, while RQS measures semantic consistency with human-review-based reference rationales. The twelve measures have distinct ranked views.

These are v1.0 results. The repository also has a v1.1 cleaned-article-text release but does not publish a v1.1 leaderboard in this table. Its seven original labels are retained. SurveyReviewer and Qwen3-32B have no verified matching model record, so they use comparison-only records; SurveyReviewer is not equated with the project's SurveyAlign name. GLM-4.7 also has a separate comparison record because neither this board nor CL-bench identifies an exact common snapshot. The summary leaderboard does not specify candidate API snapshots, reasoning effort, prompts, run counts, or harness. The official README and project page agree on all 84 numeric cells.

On 2026-10-18, the current [Terminal-Bench 4.0](https://www.tbench.ai/) still had 35 model-agent-effort rows. All stored scores, confidence intervals, agents, efforts, dates, token totals, and cost numbers matched the maintainer data. The [PinchBench v2](https://pinchbench.com/) live data still had 61 model labels and all 122 stored Best/Average values matched; its visible count remains 147 tasks versus 148 in the v2.0.0 release notes.

## 2026-10-18 follow-up: RecreationBench

The QwenLM [RecreationWorld repository](https://github.com/QwenLM/RecreationWorld#recreationbench-results) prints ten model rows for a 250-task hybrid computer-use benchmark. The [official interactive leaderboard](https://recreation-bench.cc/#leaderboard) and its [frozen JSON](https://recreation-bench.cc/data/leaderboard.json) expose the overall scores and the five platform splits: Ubuntu, macOS, Windows, Android, and Web. We imported 259 displayed values: 25 performance or application-coverage measures per model, plus nine estimated API costs. Overall programmatic and visual scores are macro-averaged within each platform and equally weighted across platforms; Average is their unweighted mean. The cost estimates assume 90% cache reads. The official repository table agrees with all 59 published overall numeric cells; neither source reports a Gemini cost.

The site data names each candidate's reasoning effort and context/output limits, which stay in each result setting. It does not identify exact API snapshots or run counts. Qwen3.8-Max-0902 is separate from the later Qwen3.8 Max release, and earlier provider-reported RecreationBench scores remain in their own metric view because their run protocol is not documented well enough to merge. The benchmark's source JSON SHA-256 at audit was `550f44f7b13947bc96b958422c94769d7ee7dcfafe8aa84174c1fe7f05f03abc`.

## 2026-10-18 follow-up: OmniCapBench

The [OmniCapBench official project page](https://01yzzyu.github.io/OmniCapBench/#leaderboard) publishes two separate nine-model tables over 786 audio-video clips: 13 structural metrics and nine localized semantic measures. We imported all 198 values. The [maintainer metric reference](https://github.com/Tencent-Hunyuan/OmniCapBench/blob/main/docs/METRICS.md) defines each column and confirms that no aggregate across the two tables is reported. Structural scoring includes LLM-assisted reference matching; localized semantic scoring applies to structurally aligned units. The dialogue line score printed in the semantic table is specifically rule-based.

The leaderboard does not identify candidate API snapshots, reasoning effort, or the exact judge model for these published rows. Seed2.0, Qwen3-Omni-Instruct, Qwen3-Omni-Captioner, and MiniCPM-o-2.6 use comparison-only records because their labels cannot safely be attached to a verified version already in the index. OmniCapBench is separate from OmniCap-IF. The official leaderboard HTML SHA-256 at audit was `12145081b6d1204965a33f92b827bc772a218e637da49a0b15d164be8ae1f64d`; judge-sensitivity and failure-analysis tables are outside this main-leaderboard scope.

## 2026-10-17 follow-up: CL-bench and CL-bench Life

The official [CL-bench](https://www.clbench.com/#section-clb) and [CL-bench Life](https://www.clbench.com/#section-life) leaderboards publish 36 and 29 model-mode rows. Their [maintainer repository](https://github.com/Tencent-Hunyuan/CL-bench) describes the shared all-rubrics-pass scoring pipeline. CL-bench has 1,899 professional context-learning tasks and uses a GPT-5.1 judge at low reasoning effort; CL-bench Life has 405 real-life context-task pairs and uses the judge at high effort. We imported every scored cell from the site's [CL-bench data](https://www.clbench.com/data/clb-data.json) and [Life data](https://www.clbench.com/data/life-data.json): 180 and 116 results respectively. Overall and category rates form nine separate views; raw fractions were converted to the site's one-decimal percentages. Published standard deviations are retained in each result's setting, and the site's single-run rows are labeled as such (16 on each board). Candidate API snapshots and exact candidate harnesses are not specified by the public leaderboard.

The existing provider-reported CL-bench values remain distinct from these benchmark-owner runs. The official site's Hy3 Preview label is not assigned to the later Hy3 release, and its unversioned DeepSeek V4 Pro is not assigned to the known 0813 snapshot. Seed 2.0 and Seed 2.0 Pro also have separate comparison records. CL-bench Life tests context learning from everyday records; the earlier benchmark description calling it a life-science subset was corrected. Task examples and raw graded files are outside this scored-cell audit.

## 2026-10-16 follow-up: BlenderWorld

The [official BlenderWorld leaderboard](https://blenderworld.github.io/#leaderboard) publishes 13 model labels on the same 223 Blender creation tasks: 78 text-only, 130 image-reference, and 15 video-reference tasks. We imported all 78 visible main-table values: overall, text subset, image/video subset, weighted rubric, visual-quality dimension, and fully satisfied rubric. The [site's published data](https://blenderworld.github.io/data/site-data.js) supplies 117 unrounded category means across nine creative domains. Each measure has its own view; all 195 values retain the benchmark-owner paper-run setting and GPT-5.6 Terra main judge. The public leaderboard does not state each candidate's reasoning effort or exact generation-agent harness. The separate rollout-resource table, individual artifacts, and judge-alignment study are outside this score audit.

Seed2.1 Pro 0915 remains distinct from the earlier Seed2.1 Pro release. The text/image/video results establish that the 0915 system was evaluated on visual-reference tasks, without asserting its native input routing. The other model labels do not name exact API snapshots, so the observation settings say so; Qwen3.8 Max is not assigned to its identified 0902 snapshot.

## 2026-10-16 follow-up: E-Commerce Bench

The [official E-Commerce Bench repository Table 1](https://github.com/QwenLM/E-CommerceBench/blob/2c2fdedd382c0f2d507b6338ab80a5f7e0ddeb4c/README.md) prints 21 model-effort rows under a 365-day, five-episode merchant simulation. We imported 147 cells across seven scored columns: mean final assets, honest-deal negotiation, fraudulent-supplier spend, drawdown, yuan per tool call, controllable returns, and repeat-order AnchorRatio. The paper's original 18 rows and three later Qwen3.8 Max / GLM-5.3 evaluations retain the same stated protocol. Exact snapshot IDs are absent for unversioned labels; Qwen3.8 Max Preview and DeepSeek V4 Pro Preview have separate comparison records. GLM-5.2 high and max are separate settings on one model.

The repository also prints assets standard deviation, tool-call and turn counts, and bankrupt-run counts. These are excluded from the seven ranked views; the spread and bankruptcy counts are kept in score notes. GPT-5.5's population-spread and three-run AnchorRatio footnotes remain attached to those results. The source coverage entry is therefore marked partial for the full public table, with all 147 declared scored cells audited.

## 2026-10-15 follow-up: PinchBench v2

The [live maintainer leaderboard](https://pinchbench.com/) now lists 61 model labels. The 59 previously stored rows still match the displayed Best and Average scores. Two additional NVIDIA Nemotron 3.5 Bolt 74B-A9B labels contribute four new observations: BF16 (Best 91.7%, Average 90.4%; ten runs; submission 2026-10-08) and 24GB (Best 90.1%, Average 87.8%; ten runs; submission 2026-10-10). The variants remain separate because the maintainer labels them separately. The live page still says 147 tasks, while the v2.0.0 release note says 148; both counts stay attached to each result.

Audited on 2026-09-20.

Seven benchmark-owner leaderboards were transcribed at their current public versions. Their expected counts are enforced by the data validator.

| Source | Included result surface | Observations |
| --- | --- | ---: |
| SkillsBench 1.1 | With Skills and Without Skills resolution rates | 49 |
| PinchBench v2.0.0 | Best and average success rates | 122 |
| WildClawBench | Overall, multimodal, pure-text, elapsed time, and published cost | 169 |
| QwenClawBench v1.1 | Final task score | 12 |
| Workspace-Bench-Lite | Total rubric pass rate for every model and harness row | 45 |
| Claw-Eval v1.1 | Pass³ and Pass@3 for Overall, General, Multi-turn, and Multimodal | 174 |
| RNG-Bench | Nine single-player metrics plus Win%, Score%, and Elo for duel | 69 |

The seven sources contribute 640 observations.

## 2026-10-14 follow-up: PerceptionBench

The [official repository leaderboard](https://github.com/MoonshotAI/PerceptionBench) and [technical report, Table 1](https://arxiv.org/abs/2607.24957) agree on all 176 main-table cells: 16 model labels × overall accuracy and ten distinct atomic visual-perception categories. The 3,000 open-ended questions use unified prompts and a GPT-oss-120B judge. Each category has its own metric view; the overall score is not reused as a category score.

The report identifies xhigh reasoning for GPT-5.5; max for GPT-5.6 Sol, Claude Fable 5, Claude Opus 4.8, and Kimi K3; high for the two Gemini models and Seed2.1 Pro; and thinking mode for Gemma 4 31B. Other models retain “highest available reasoning budget; level not specified.” Claude Fable 5 used Claude Opus 4.8 as a fallback for safety-filter refusals. The source labels Gemma-4-31B without a checkpoint suffix, so its results remain separate from BenchBoard's Gemma 4 31B IT record. GLM-4.6V is added as a comparison-only model.

The previously stored Kimi K3 provider-reported 58.5% three-run average remains separate from this benchmark-owner 58.5% four-run mean, as identified in the report's Table 2. The separate run-consistency diagnostics in that table are outside the imported main-table scope.

## 2026-10-13 follow-up: ExplorationBench

The [official leaderboard](https://explorationbench.com/#leaderboard) adds 220 unique table values: ten model labels × two separate worlds × eleven metric views. These comprise M0, M4 Best@3, Mean@3, Worst@3, two complete-rule reference conditions, one world-specific auxiliary diagnostic, and four matched controls. The autonomous control column repeats M4 Best@3 and is not imported twice. The [official repository](https://github.com/Tencent-Hunyuan/ExplorationBench) prints the same 60 M0, Best@3, and Mean@3 cells; these are shared provenance, not additional observations. The [technical report](https://arxiv.org/abs/2609.30199) supplies the four-round protocol, 70 held-out tasks per world, three independent trajectories per system and world, and three answers per task.

The report identifies Qwen3.8-Max as the 0902 snapshot and Seed2.1 Pro as the 0915 snapshot, so those scores are kept separate from their earlier releases. Its DeepSeek-V4-Pro label gives no snapshot, so it remains separate from the known 0813 release. Reasoning levels come from the official leaderboard's per-system labels. AlienCode's rule count and AlienLogic's correct-refusal rate are auxiliary diagnostics and never share a ranking with held-out accuracy. The generated trajectory charts and task-level logs are outside the audited table scope.

## 2026-10-22 follow-up: SkillsBench source coverage

The [SkillsBench source-by-source audit](skillsbench-2026-10-22.md) adds 253 observations: Vals AI's complete paired accuracy/cost/duration table (210), plus missing SkillsBench results and relative harness metrics from Hy4, Atria, Ling, Qwen, openPangu, dots3, and GitHub Copilot (43). BenchFlow's 49 headline values were rechecked and remain unchanged. Undated DeepSeek Pro is no longer assigned to 0813; Qwen's 78-task and Hy4's 79-task results are no longer in the 87-task view. All SkillsBench variants now share one navigation family. The audit documents each source's protocol and remaining gaps, including full model-card tables outside this focused scope.

## Representation decisions

- Models introduced only by a benchmark-owner leaderboard use `scoreStatus: "comparison-only"`. Existing first-party target models keep their original status.
- One benchmark family contains its related metric, subset, version, and protocol views.
- Workspace-Bench Full 1.0 and Workspace-Bench-Lite remain separate because the task sets differ.
- Claw-Eval's control labeled `Image` downloads the table as an image; it is not a benchmark subset.
- PinchBench v2 has a task-count conflict as checked on 2026-10-11: the [live leaderboard](https://pinchbench.com/) displays 147 tasks, while the [official v2.0.0 release notes](https://github.com/pinchbench/skill/releases/tag/v2.0.0) say 148. Both counts are retained in result settings until the maintainer clarifies the scoring scope.
- Harness, effort, route, task count, run count, judge, and snapshot details remain attached to observations when published.

The following diagnostics and derivatives are outside the current headline-leaderboard scope: SkillsBench gain and wall-clock charts; PinchBench category awards and per-run pages; WildClawBench category breakdowns; QwenClawBench component averages and per-task drill-downs; Workspace-Bench-Lite difficulty summaries; Claw-Eval safety and token-efficiency diagnostics; and RNG-Bench raw win/tie/loss counts. These can be added later as separately named metric views without altering the stored headline results.

The current versions of these seven leaderboards contain no Qwen3.8-Omni-Flash row. Its scores are therefore publisher-reported rather than benchmark-owner reproduced.
