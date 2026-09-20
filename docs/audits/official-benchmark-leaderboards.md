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

## Representation decisions

- Models introduced only by a benchmark-owner leaderboard use `scoreStatus: "comparison-only"`. Existing first-party target models keep their original status.
- One benchmark family contains its related metric, subset, version, and protocol views.
- Workspace-Bench Full 1.0 and Workspace-Bench-Lite remain separate because the task sets differ.
- Claw-Eval's control labeled `Image` downloads the table as an image; it is not a benchmark subset.
- PinchBench v2 uses the current 148-task description, not the older 147-task wording.
- Harness, effort, route, task count, run count, judge, and snapshot details remain attached to observations when published.

The following diagnostics and derivatives are outside the current headline-leaderboard scope: SkillsBench gain and wall-clock charts; PinchBench category awards and per-run pages; WildClawBench category breakdowns; QwenClawBench component averages and per-task drill-downs; Workspace-Bench-Lite difficulty summaries; Claw-Eval safety and token-efficiency diagnostics; and RNG-Bench raw win/tie/loss counts. These can be added later as separately named metric views without altering the stored headline results.

The current versions of these seven leaderboards contain no Qwen3.8-Omni-Flash row. Its scores are therefore publisher-reported rather than benchmark-owner reproduced.
