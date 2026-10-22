# SkillsBench source audit: 2026-10-22

This audit adds 253 observations and nine model records. It is a SkillsBench-specific audit, not a claim that every model release or benchmark in BenchBoard is complete. Each imported source scope has an expected observation count checked by repository validation.

## Checked result scopes

| Primary source | Imported scope | New observations | Preserved or corrected |
| --- | --- | ---: | --- |
| [BenchFlow leaderboard](https://www.skillsbench.ai/leaderboard) | All 25 with-Skills configurations and 24 available without-Skills baselines | 0 | Existing 49 values match; its undated DeepSeek V4 Pro row is no longer assigned to 0813 |
| [Vals AI](https://www.vals.ai/benchmarks/skillsbench) | 35 configurations, two conditions, accuracy / measured cost per test / mean duration | 210 | GPT-5.5 Codex and OpenHands remain separate configurations of one model |
| [Hy4 pinned appendix](https://github.com/Tencent-Hunyuan/Hy4-preview/blob/509799be8cc7bfeb63353e7322b2daddf7f73a28/README.md#benchmark-appendix) | All eight SkillsBench model cells and protocol notes | 6 | Existing Hy4 62.9 and Hy3 55.3 gain provenance; Hy4 moves out of the 87-task view |
| [Atria model card](https://huggingface.co/internlm/Atria-Dawn-Preview/blob/311a9b8c6c0e8dd4b00b2d7baff7a926c3415e78/README.md) and [report v2](https://arxiv.org/html/2609.15818v2) | Seven SkillsBench cells and Appendix B protocol | 7 | Same values in both documents share provenance |
| [Ling-3.1-Flash model card](https://huggingface.co/inclusionAI/Ling-3.1-flash/blob/93e96ab91e800998388563295340a4238ff3e962/README.md) | Seven SkillsBench cells in the evaluation image and its footnotes | 7 | Version and SkillsBench-specific harness are unspecified |
| [Qwen3.7 release](https://qwen.ai/blog?id=qwen3.7) and [official repository](https://github.com/AlibabaCloud-Official/Qwen3.7-max-readme) | Four available comparison cells missed by the original target-column import | 4 | Qwen3.7 Max and Plus's existing 78-task results move out of the 87-task view |
| [openPangu-2.0-Flash model card](https://huggingface.co/openpangu/openPangu-2.0-Flash/blob/5b78fc70a06dd27c5c4c5e918c46c49531d357b4/README.md) | Thinking and Non-Thinking Avg@5 | 2 | No task count, version, or harness inferred |
| [dots3-note Preview appendix](https://huggingface.co/dots-studio/dots3-note-prev/blob/1e1e7b0cd37a3a48a6c8d7fa55d5f9d14377006b/README.md#benchmark-appendix) | All nine available SkillsBench cells and footnote 11 | 9 | Four own-test cells use the 79-task API-excluded protocol; five external comparisons retain unknown settings |
| [GitHub Copilot evaluation](https://github.blog/ai-and-ml/github-copilot/evaluating-performance-and-efficiency-of-the-github-copilot-agentic-harness-across-models-and-tasks/) | Four resolution-rate differences and four relative median token changes | 8 | Relative metrics remain separate from absolute accuracy |

New model records are Inkling, Inkling-Small, Ling-3.0-Flash, Ling-3.1-Flash, Mercury 2.5, Atria Dawn Preview, openPangu-2.0-Flash, dots3-note Preview, and a comparison-only DeepSeek V4 Pro Preview label. Their input modalities are checked against model-provider cards. Full provider benchmark tables for these newly added models remain outside this focused audit and are marked partial.

## GLM examples

| Evaluation scope | GLM-5.3 | GLM-5.3-Flash |
| --- | ---: | ---: |
| Vals, With Skills, OpenHands | 47.509% | 40.159% |
| Vals, No Skills, OpenHands | 29.636% | 32.516% |
| Hy4, 79 text-only tasks, Claude Code, three runs | 63.3% | Not reported |
| Atria, 79 text-only tasks, OpenHands / AgentCompass, three runs | 63.3% | Not reported |
| Ling-3.1 official chart, settings unspecified | 59.4% | 61.3% |

These are distinct published observations. They are not interchangeable scores or evidence that all settings produce the same result. Identical numeric values alone do not justify merging provenance.

## Vals protocol and extraction

The [public JSON](https://www.vals.ai/_astro/benchmark_view_skillsbench.BE2TXB-M.json) has 35 system IDs in each of `with_skills` and `no_skills`. `overall` duplicates `with_skills` exactly and is not imported again. Every accuracy, `cost_per_test`, and `latency` value is preserved at its published JSON precision. Standard errors and non-null generation settings remain attached to accuracy records.

The page states three trials in each condition, a mean over trials per task followed by a mean across tasks, and OpenHands-CLI commit `3ca17446c5d9c1e35e054803478a3501ec251ecf`. The GPT-5.5 Codex row has no published Codex version. Its trace charts identify 87 tasks per run (261 trial tasks). Metadata calls the evaluation version `1`; no task-source commit establishes equivalence with BenchFlow's `skillsbench@1.1`. The [benchmark service](https://github.com/benchflow-ai/skillsbench-benchmark-service/tree/codex/initial-skillsbench-service) describes the Valkyrie adapter, but its current porting guide lists a different task count and does not identify the historical evaluation checkout. It is not used to override the September table's task count.

DeepSeek's `deepseek/deepseek-v4-pro` ID is displayed as "DeepSeek V4" and has no dated snapshot. It uses the version-unspecified Pro model record. Qwen's undated Max ID is not assigned to 0902. Provider refusals flagged for Fable 5.1 and Opus 5 are reported as failures; no unnamed fallback route is invented.

## Variant and modality decisions

All 15 current SkillsBench variants share one navigation family. This includes the previously orphaned 78-task self-contained subset. Related metrics have separate views and units:

- BenchFlow v1.1: with and without Skills.
- Vals September 27: with and without Skills, each with accuracy, mean cost, and mean duration.
- 78-task self-contained OpenCode subset.
- 79-task text-only Claude Code and OpenHands evaluations.
- Dots' 79-task external-API-excluded Claude Code evaluation.
- Unspecified-version scores.
- Copilot resolution difference and relative median token change.

The 79-task Dots footnote excludes external APIs, not multimodal inputs. Tencent and Atria explicitly exclude multimodal tasks. These subsets are not assumed to be identical because they share a task count. Ling's LingCode/Pi footnote applies only to four named coding benchmarks and does not establish a SkillsBench harness. None of these newly imported unknown or text-only subsets is automatically added to the multimodal × harness collection.

## Limits and remaining checks

The [GLM-5.3 card](https://huggingface.co/zai-org/GLM-5.3) does not contain a SkillsBench row; its scores here come from evaluators and other model providers' comparison tables. GLM-5.3-Flash's card and benchmark-image reference were inspected, but this audit does not claim a new SkillsBench result from Z.ai's own publication.

The [SkillsBench citations registry](https://github.com/benchflow-ai/skillsbench/blob/main/website/src/data/citations.ts) was used to discover additional primary sources. Community discussion alone does not establish benchmark version: dots3's 52.8 is accompanied by an official 79-task footnote, so an external v1.1 label is not used to rank it on the 87-task main view.

Ling-3.0's card describes Kilo Code and a contradictory task-count phrase ("87 tasks", excluding external API-dependent tasks); its benchmark images point at an internal Alipay proxy. No vendor-chart values are imported without readable primary evidence. Its Vals results are included. Non-SkillsBench rows in the newly registered model cards, derived skill-lift charts, per-task traces, and confidence/efficiency diagnostics on the BenchFlow leaderboard remain outside the imported scope.

