# Official benchmark leaderboard audit

Audited on 2026-09-20.

Seven benchmark-owner leaderboards were transcribed at their current public versions. Their expected counts are enforced by the data validator.

| Source | Included result surface | Observations |
| --- | --- | ---: |
| SkillsBench 1.1 | With Skills and Without Skills resolution rates | 49 |
| PinchBench v2.0.0 | Best and average success rates | 118 |
| WildClawBench | Overall, multimodal, pure-text, elapsed time, and published cost | 169 |
| QwenClawBench v1.1 | Final task score | 12 |
| Workspace-Bench-Lite | Total rubric pass rate for every model and harness row | 45 |
| Claw-Eval v1.1 | Pass³ and Pass@3 for Overall, General, Multi-turn, and Multimodal | 174 |
| RNG-Bench | Nine single-player metrics plus Win%, Score%, and Elo for duel | 69 |

The seven sources contribute 636 observations.

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
