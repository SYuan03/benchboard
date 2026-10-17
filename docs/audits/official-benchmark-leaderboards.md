# Official benchmark leaderboard audit

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

## Representation decisions

- Models introduced only by a benchmark-owner leaderboard use `scoreStatus: "comparison-only"`. Existing first-party target models keep their original status.
- One benchmark family contains its related metric, subset, version, and protocol views.
- Workspace-Bench Full 1.0 and Workspace-Bench-Lite remain separate because the task sets differ.
- Claw-Eval's control labeled `Image` downloads the table as an image; it is not a benchmark subset.
- PinchBench v2 has a task-count conflict as checked on 2026-10-11: the [live leaderboard](https://pinchbench.com/) displays 147 tasks, while the [official v2.0.0 release notes](https://github.com/pinchbench/skill/releases/tag/v2.0.0) say 148. Both counts are retained in result settings until the maintainer clarifies the scoring scope.
- Harness, effort, route, task count, run count, judge, and snapshot details remain attached to observations when published.

The following diagnostics and derivatives are outside the current headline-leaderboard scope: SkillsBench gain and wall-clock charts; PinchBench category awards and per-run pages; WildClawBench category breakdowns; QwenClawBench component averages and per-task drill-downs; Workspace-Bench-Lite difficulty summaries; Claw-Eval safety and token-efficiency diagnostics; and RNG-Bench raw win/tie/loss counts. These can be added later as separately named metric views without altering the stored headline results.

The current versions of these seven leaderboards contain no Qwen3.8-Omni-Flash row. Its scores are therefore publisher-reported rather than benchmark-owner reproduced.
