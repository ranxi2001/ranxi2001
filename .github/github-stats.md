# GitHub stats card

The README embeds `assets/github-stats.svg`. GitHub Actions regenerates it daily
at 00:23 UTC (08:23 Asia/Shanghai; scheduled runs can be delayed), or manually via
**Actions → Update GitHub stats → Run workflow**. Pushing a workflow change to
`main` also triggers generation.

## Open-source implementation

- Original project: https://github.com/anuraghazra/github-readme-stats
  (its README now recommends the maintained successors).
- Generator: https://github.com/stats-organization/github-readme-stats-action
- Core: https://github.com/stats-organization/github-stats-extended

The workflow pins the action commit and core package version 2.1.3. It generates
the SVG directly using GitHub's API, without an external card-hosting service.
Data-fetch failures stop the job before committing, preserving the last good SVG.

## Permissions and statistics

The default `GITHUB_TOKEN` needs `contents: write` to commit the image. No extra
secret or Vercel deployment is required. This setup uses public statistics;
`count_private=true` alone never grants access to private repositories.

For private statistics, explicitly configure an appropriate PAT as an Actions
secret and change the generator's `token` input. Any rendered statistics become
public in this repository. Never put the token in the README or an image URL.

If an update fails, check the workflow log for API rate limits or repository
rules blocking the bot's push, then rerun the workflow. GitHub may disable
scheduled workflows in public repositories after 60 days without activity;
re-enable the workflow from Actions if needed.
