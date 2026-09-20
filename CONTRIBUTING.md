# Contributing data

Contributions may add a model, a benchmark, a source, or a correction to an existing result. Keep each pull request focused on one model release or one result table when possible; smaller changes are easier to verify.

Before submitting:

1. Check the model's official release/news page, first-party model card (including Hugging Face or ModelScope), linked repository, and technical or system report when those surfaces exist. Register checked pages even when they contain metadata only, and state when a surface was not found.
2. Link to a model provider, official benchmark page, paper, or model card. If no primary source is available, identify the secondary source clearly.
3. Use an exact model release. Keep dated snapshots, previews, and stable aliases separate.
4. Include the benchmark version whenever it affects comparability.
5. Record known evaluation details in `setting`, including the harness, tool access, reasoning setting, task count, and sample count.
6. Merge identical values with identical settings by combining `sourceIds`. Keep different values or settings as separate observations.
7. Do not add a build dependency. The site must still work by opening `index.html` directly.

Screenshots of the original table are useful in a pull request, but every record still needs a link to an accessible source.

## Workflow

1. Add small records to `data.js`. Put a large source audit in a focused file under `data-packs/` and load it from both `index.html` and `scripts/load-data.mjs`.
2. Update `sourceAudits` with the scope you checked. Use `complete` only for every numeric result in that source scope, or `target-complete` for fully checked model columns. Include expected counts so later omissions fail validation.
3. Run `npm run check` to validate IDs, references, units, model-version mappings, duplicate observations, and source-audit counts.
4. Run `npm run sync-readme` and `npm run sync-source-matrix` to refresh the coverage counts and the model-to-source audit matrix.
5. Run `npm run check-readme`, `npm run check-source-matrix`, and `node --check app.js`.
6. In the pull request, link the original source and list the records added or corrected.

You can report an error without editing the repository. Open an issue with the model, benchmark, current value, proposed value, and primary source.

## Changes we cannot accept

- Scores from an inaccessible screenshot or an unattributed summary.
- Results copied between dated snapshots, previews, stable aliases, or different harnesses.
- Guessed values based on a nearby release or another model in the same family.
- Rankings that combine incompatible units, metrics, or benchmark versions.
- Composite strings such as `41.0 / 40.0 / 58.6`. Create separate metric views instead.
