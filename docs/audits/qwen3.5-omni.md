# Qwen3.5-Omni source audit

Audited on 2026-09-20.

The Qwen3.5-Omni release article and the later v2 technical report are tracked as separate first-party sources. Identical cells share one observation with both sources; the report's additional language- and direction-level results remain independently addressable.

## Official surfaces checked

| Surface | Result |
| --- | --- |
| [Release article](https://qwen.ai/blog?id=qwen3.5-omni) | Complete target columns: 92 observations for Plus and 83 for Flash. |
| [Technical report v2](https://arxiv.org/abs/2604.15804v2) | Complete target columns for capability Tables 4–15: 479 observations for Plus and 378 for Flash. |
| Qwen Hugging Face organization | No exact Qwen3.5-Omni-Plus or Qwen3.5-Omni-Flash model repository was found. |
| Qwen ModelScope organization | No exact public weight/model-card page with an additional result table was found. |

## Report accounting

- Tables 4–7 repeat 83 target observations per model from the release article. They are stored once with both sources.
- Tables 8–15 add 691 non-duplicate target observations: 396 for Plus and 295 for Flash.
- Compound cells are split by language, translation direction, and metric. Dashes remain missing data.
- Table 13 keeps WER and CER distinct according to the report's italic-language convention.
- English→Chinese and Chinese→English values printed in both Tables 14 and 15 are stored once and cite the shared table context.
- System latency, throughput, architecture dimensions, supported-language counts, and training or ablation statistics are outside the capability leaderboard.

The release article is a target-column audit, while the technical report adds the full fine-grained target evidence. Comparison-model columns remain eligible for later import and are not mislabeled as complete.
