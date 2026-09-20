# Qwen3.8-Omni-Flash source audit

Audited on 2026-09-20.

Qwen3.8-Omni-Flash has 69 displayed records across 68 benchmark-and-setting views, 64 benchmark variants, and 48 benchmark families: 68 observations from the official release surface and one conflicting observation from Qwen's official X account. The release page contributes 310 distinct observations when its comparison-model cells are included.

## First-party sources checked

| Source | Finding | Treatment |
| --- | --- | --- |
| [Qwen release article](https://qwen.ai/blog?id=qwen3.8-omni-flash) | Eight HTML tables, an overview figure, evaluation settings, and numeric efficiency claims | Complete score source |
| Qwen release article, Chinese locale | The six numeric tables match the English locale cell for cell; the remaining two tables contain service and plugin metadata | Duplicate translation; no second score record |
| [Alibaba Cloud Model Studio](https://www.alibabacloud.com/help/en/model-studio/qwen3-8-omni-flash) | Model metadata and API capabilities; no benchmark table | Metadata only |
| [QwenCloud](https://www.qwencloud.com/models/qwen3.8-omni-flash) | Model and API metadata; no independent benchmark table | Metadata only |
| [Official Qwen launch post on X](https://x.com/Alibaba_Qwen/status/2100785962414702599) | Reports a 51.8% OmniVideoBench token reduction, conflicting with the release article's 45.7% and raw token counts | Kept as a separate conflicting observation |
| [Qwen on Hugging Face](https://huggingface.co/Qwen) | The exact `Qwen/Qwen3.8-Omni-Flash` URL returns 404 and exact model search returns no result | No model card to import |
| [Qwen on ModelScope](https://modelscope.cn/organization/Qwen) | The exact model URL returns 404 | No model card to import |
| [Qwen3.8 GitHub repository](https://github.com/QwenLM/Qwen3.8) | No Qwen3.8-Omni-Flash result table | No additional scores |
| [Qwen-MM-Plugins](https://github.com/QwenLM/Qwen-MM-Plugins) | The exact model identifier appears in 27 files across Qwen's GitHub organization, all in this tooling repository; none reports a benchmark score | Tooling reference only |
| [Qwen-Live-Harness](https://github.com/QwenLM/Qwen-Live-Harness) | The release article links to it, but the URL currently returns 404 | No accessible score evidence |
| [Qwen publication index](https://qwen.ai/publication) | No separate paper or technical report for this model | No additional report |

## Release-page accounting

The English and Chinese release records expose the same eight HTML tables. Their six numeric tables match cell for cell and contain:

1. OmniVideoBench accuracy and tokens per query for Static and Agentic Understanding.
2. The full Omni comparison table, including audio, audio-visual, and agentic-omni results.
3. Static and Qwen Code results for OmniVideoBench, Video-MME-v2, and LVOmniBench.
4. Text, coding, and agent results.
5. Vision and agentic-vision results.
6. Realtime API service measurements.
7. Supported-language metadata.
8. Plugin capability metadata.

Tables 6 to 8 do not add model benchmark scores. Realtime TPS, TTFT, time-to-first-audio, and RTF measure the separate hosted service, so BenchBoard does not mix them into model capability rankings.

The overview figure adds an AliMeeting summary score of 89.7. Its footnote defines the formula as `100 × [1 - (0.5 × DER + 0.5 × cpWER)]`. Detailed AliMeeting observations use the more precise prose values, DER 3.35 and cpWER 17.18; the table shows rounded values of 3.4 and 17.2.

The release article reports a 45.7% OmniVideoBench token reduction from 145,736 to 79,117 tokens per query. The official X post reports 51.8% for the same comparison. Both observations remain available with their own source links.

## Setting and naming checks

- WildClawBench-MM uses Claude Code. UniClawBench uses OpenClaw. AgenticVBench uses Claude Code. OmniGAIA does not name a harness.
- Agentic Omni Understanding keeps Static and Qwen Code as separate settings.
- Qwen's ClawEval-MM `Pass@3` means at least one of three runs succeeds. Seed's `Pass³` means all three runs succeed. They are separate metric views under one Claw-Eval family.
- The detailed table uses `JoinAVBench`; the overview figure uses `JointAVBench`. The identical 75.9 result is stored once with the naming discrepancy noted.
- Blank cells and dashes are not converted to zero.

The current SkillsBench 1.1, PinchBench v2, WildClawBench, QwenClawBench v1.1, Workspace-Bench-Lite, Claw-Eval v1.1, and RNG-Bench leaderboards contain no Qwen3.8-Omni-Flash row. They add no independent score for this model.
