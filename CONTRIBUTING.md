# Contributing data

Contributions may add a model, a benchmark, a source, or a correction to an existing result. Keep each pull request focused on one model release or one result table when possible; smaller changes are easier to verify.

Before submitting:

1. Link to a model provider, official benchmark page, paper, or model card. If no primary source is available, identify the secondary source clearly.
2. Use an exact model release. Keep dated snapshots, previews, and stable aliases separate.
3. Include the benchmark version whenever it affects comparability.
4. Record known evaluation details in `setting`, including the harness, tool access, reasoning setting, task count, and sample count.
5. Merge identical values with identical settings by combining `sourceIds`. Keep different values or settings as separate observations.
6. Do not add a build dependency. The site must still work by opening `index.html` directly.

Screenshots of the original table are useful in a pull request, but every record still needs a link to an accessible source.

## Workflow

1. Add or update `sources`, `models`, `benchmarks`, and `observations` in `data.js`.
2. Run `npm run check` to validate IDs, references, units, and model-version mappings.
3. Run `npm run sync-readme` to refresh the coverage counts in README.
4. Run `npm run check-readme` and `node --check app.js`.
5. In the pull request, link the original source and list the records added or corrected.

You can report an error without editing the repository. Open an issue with the model, benchmark, current value, proposed value, and primary source.

## Changes we cannot accept

- Scores from an inaccessible screenshot or an unattributed summary.
- Results copied between dated snapshots, previews, stable aliases, or different harnesses.
- Guessed values based on a nearby release or another model in the same family.
- Rankings that combine incompatible units, metrics, or benchmark versions.
