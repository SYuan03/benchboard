# BenchBoard

[Live leaderboard](https://syuan03.github.io/benchboard/) · [Contribute data](CONTRIBUTING.md) · [MIT License](LICENSE)

BenchBoard collects published benchmark results for current language, multimodal, and agent models. Every result stays attached to the exact model version, evaluation setup, and source that reported it. The site does not calculate a cross-benchmark composite score.

[![BenchBoard benchmark index](assets/benchboard-teaser.svg)](https://syuan03.github.io/benchboard/)

## News

- 2026-09-21: Expanded first-party release audits for Qwen3.8 Omni Flash, Claude 4, DeepSeek V3.2, and MiMo V2. The [source coverage matrix](docs/audits/model-source-coverage.md) tracks what has been checked for each model.
- 2026-09-20: Added the [Multimodal Input × Harness collection](https://syuan03.github.io/benchboard/?collection=multimodal-harness), covering published results where an agent harness receives images, audio, video, screens, or other non-text files as task input.
- 2026-09-18: Launched BenchBoard with results for representative releases from GPT, Claude, Gemini, DeepSeek, Qwen, GLM, Seed, Kimi, and Hy.

## Coverage

<!-- DATA_SUMMARY_START -->
- 97 curated model releases
- 35 benchmark-only comparison models
- 462 benchmark families
- 1069 separately ranked metrics and versions
- 5810 deduplicated public results
- 199 primary sources
<!-- DATA_SUMMARY_END -->

Coverage focuses on general, coding, multimodal, and agent models near the frontier in 2026. Core entries include GPT-6 Astra, GPT-5.6 Sol, Claude 5, Gemini 3.8, DeepSeek V4.1, Qwen3.8, GLM-5.3, Seed2.1, Kimi K3, and Hy4. Older or secondary models reported by an official leaderboard remain available as clearly labeled comparison records.

All rows from the Coding Agent, General Agent, and General Capabilities tables in the official Qwen3.8 model card are recorded individually. Qwen3.8 Max currently has public results across 45 benchmark families and 51 separately ranked metric or version views. The open-weight `Qwen3.8-2.4T-A95B` language model and the vision-and-tool-enabled Qwen3.8 Max service are listed separately.

The Qwen3.8 Omni Flash release has been checked against every published table, summary chart, and numeric claim. The page contributes 310 distinct observations. The model has 68 release-page results plus one conflicting value from the official Qwen X account, spanning 68 benchmark-and-setting views, 64 benchmark variants, and 48 benchmark families. Blank cells stay blank, rounded chart values do not replace more precise prose values, and conflicting first-party claims remain separate. The [source audit](docs/audits/qwen3.8-omni-flash.md) lists every first-party surface checked and every deliberate exclusion.

SkillsBench 1.1, PinchBench v2, WildClawBench, WildClawBench-MM, QwenClawBench, ClawEval, Agents' Last Exam, and Workspace-Bench 1.0 are included. Agent harnesses and settings stay attached to each result when the publisher reports them. Benchmarks appear once in navigation; their versions, subsets, and metrics are switchable inside the benchmark view. PinchBench, for example, keeps Best Success Rate and Average Success Rate as separate rankings under one entry. WildClawBench similarly groups Overall, MM, Elapsed Time, and Total Cost without mixing their units or rankings. WildClawBench-MM includes multimodal agent results such as the official 71.0 score reported for Qwen3.8 Omni Flash.

The [official leaderboard audit](docs/audits/official-benchmark-leaderboards.md) records the checked result surfaces, count gates, representation decisions, and deliberate exclusions for seven benchmark-owner sources.

The generated [model source coverage matrix](docs/audits/model-source-coverage.md) shows, model by model, which first-party release surfaces are attached, whether the target score columns were fully checked, and which comparison-only entries still need a first-party audit.

[RNG-Bench](https://internlm.github.io/RNGBench/) appears once with 12 switchable metric views for the comparable rates, scores, efficiency measures, error rates, and Elo in its official main-results tables. The records cover the 10×10 Matching Pairs setting, the 13×13 Maze, and the 16-game-per-model Duel protocol. Raw win, tie, and loss counts remain on the source page.

Coverage grows as model providers and benchmark maintainers publish new tables. A source can be complete for one model column while its comparison columns remain unfinished; the Sources view states that scope directly.

## Use the site

The site has five views:

- Leaderboard ranks models within each benchmark and shows modality, evaluation setup, and sources.
- Compare places two or three models side by side across shared or model-specific benchmarks. It does not combine results into one score.
- Coverage shows the benchmark-by-model matrix.
- Models lists versions, aliases, context windows, native modalities, and access types. Opening a model shows all of its recorded results, settings, and sources.
- Sources shows how many observations each publication supports and whether its full result tables have been checked.

Use the benchmark list on the left to move between leaderboards. Browser search (`Ctrl+F` or `Cmd+F`) works on the visible list.

The **Multimodal Input × Harness** collection requires a named agent harness such as OpenClaw, Claude Code, Codex, OpenCode, or OpenHands and a task that gives the agent an image, audio clip, video, screen, or another non-text file as input. A model's advertised modalities do not determine inclusion. Text-only generation scored by a multimodal judge is excluded. Mixed suites are labeled separately from dedicated multimodal subsets, and the input modalities are shown in the benchmark list. A mixed-suite result is the published score for the full suite, not a score for its multimodal subset. The filtered view has a shareable URL.

## Run locally

BenchBoard is a static site with no build step. Open `index.html`, or serve the directory locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

After changing `data.js` or a file in `data-packs/`, run:

```bash
npm run check
npm run sync-readme
npm run sync-source-matrix
npm run audit
```

`check` validates IDs, references, missing scores, mixed units, and completed source audits. `sync-readme` refreshes the coverage counts above. `sync-source-matrix` regenerates the model-to-source audit matrix. `audit` lists models with sparse coverage and benchmarks with few reported participants.

Pushes to `main` are validated and deployed to GitHub Pages automatically. Pull requests run the same data and README checks.

## Data model

The base registry lives in `data.js`; larger audited imports live in `data-packs/`:

- `models` stores provider, release, aliases, modality, and access type.
- `benchmarks` stores normalized names, versions, capability areas, metric direction, and optional collection metadata such as harness and collection scope.
- `benchmarkFamilies` groups related versions, subsets, and metrics under one navigation entry while preserving separate rankings.
- `sources` stores original publication pages. Model-provider releases, official benchmark leaderboards, and technical reports are preferred.
- `sourceAudits` records the checked scope and an expected observation count. A count mismatch fails validation.
- `observations` stores each model, benchmark, score, and evaluation-setting combination.

Confirm both the model release and benchmark version before adding a result. Identical values can share a displayed row while retaining every source and setting. Different values, metrics, units, or harnesses remain separate observations. A model without a published score may be registered with `scoreStatus: "pending"`; an older model's result must not be used in its place.

Modalities use three values:

- `language`: text input and text output.
- `vision`: text and visual input. Video or file support belongs in `modalityDetail`.
- `omni`: native support for several input types, such as text, images, audio, and video.

## Source policy

A provider's table may contain results for competing models. BenchBoard marks those rows as provider-reported. Data published by benchmark maintainers, including SkillsBench and PinchBench, is marked as benchmark-official. Models introduced only by one of those comparison tables carry a `comparison-only` status until a first-party model source is added.

Source audits use five practical states. "Public result tables checked" covers every numeric observation in the stated source scope. "Target model column checked" covers the named model columns but may omit comparison columns. "Metadata only" means the page was checked and contains no independent benchmark table. "Partial" means some relevant result tables remain, while "Pending" means the surface has been registered but not yet checked. Safety evaluations, deployment tests, latency, throughput, and pricing are not mixed into the capability leaderboards unless they are the benchmark's stated metric.

One benchmark may contain several metrics or settings. Agents' Last Exam, for example, has Pass Rate and Overall Score; OSWorld has Binary, Partial, and Strict; ExploitGym has Success Rate and Solved Tasks. The site shows one benchmark entry with direct metric buttons inside it. Each metric still gets its own ranking and stable URL; composite strings and incompatible units are never forced into one table.

Rankings from different sources still require context. Dataset versions, agent harnesses, tool permissions, reasoning settings, and sample counts can change a result even when the benchmark name matches. BenchBoard indexes published evidence and does not claim independent reproduction.

Found a missing or incorrect result? See [CONTRIBUTING.md](CONTRIBUTING.md).

## Scope and license

BenchBoard is an index of published results, not an independent evaluation or a model-buying recommendation. Coverage favors current models, primary result tables, and official benchmark leaderboards. It does not try to catalog every model ever released. Records may need reverification when a source changes or disappears.

The repository's code and data organization are available under the MIT License. Model names, benchmark names, and quoted source material remain the property of their respective owners.
