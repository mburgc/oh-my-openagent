# Keeping the fork in sync with upstream

This repository is a fork (mirror) of [code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent), rebranded with a World of Warcraft theme. The upstream project ships updates frequently, so the fork must be re-synced periodically to keep the plugin working and to avoid drifting away from upstream fixes.

The rebranding lives on the `rebrand/wow` branch. Upstream changes should always come in through `master` and then be merged into `rebrand/wow` — never edit upstream files directly on `rebrand/wow`.

## Remote layout

| Remote | URL | Purpose |
|--------|-----|---------|
| `origin` | `https://github.com/mburgc/oh-my-openagent.git` | Your fork (this repo) |
| `upstream` | `https://github.com/code-yeongyu/oh-my-openagent` | The original project |

## Sync workflow

Run from the repo root:

```bash
# 1. Fetch the latest upstream state (do NOT merge yet)
git fetch upstream

# 2. Update the local mirror of master to match upstream exactly
git checkout master
git rebase upstream/master      # or: git reset --hard upstream/master

# 3. Bring the rebranded branch up to date
git checkout rebrand/wow
git merge master                # resolve conflicts, keeping the WoW branding
```

> `git reset --hard upstream/master` is the true "mirror" behaviour — it discards any local-only commit on `master`. Use `git rebase` instead if you ever commit directly to `master`.

## Conflict policy

The only files that should ever conflict are the ones the rebranding touched. When a conflict appears:

- **Keep the WoW/rebranding side** for: agent display names, GitHub bot identity (`guldan-ai`), telemetry default (PostHog key empty), star-request removal, repo URLs (`mburgc/oh-my-openagent`), README branding, `.github/assets/*.png`.
- **Take the upstream side** for: all functional code (`packages/*/src/`), config schemas, installer logic, tests, docs that describe behaviour rather than branding.
- If an upstream change adds a *new* agent name, model, or prompt, apply the same WoW mapping used in the existing rebranding (see the agent display-name table below).

## Agent display-name mapping

When upstream adds or renames agents, map them to the WoW theme consistently:

| Internal id | Display name |
|-------------|--------------|
| `sisyphus` | Arthas |
| `hephaestus` | Illidan |
| `prometheus` | Khadgar |
| `atlas` | Saurfang |
| `jaina` | Jaina |
| `gallywix` | Gallywix |
| `kirintor` | KirinTor |
| `medivh` | Medivh |
| `chromie` | Chromie |
| `brann` | Brann |
| `alleria` | Alleria |
| `rhonin` | Rhonin |
| `anduin` | Anduin |
| `kael` | Kael |
| `metis` | Jaina |

**Important:** internal config keys, plugin ids, and CLI names stay lowercase/original — only user-visible display names are rebranded. Never rename `sisyphuslabs` (the Codex marketplace identity) or internal ids; that would break installs and configs.

## After syncing

1. Run the test suites for anything that changed (see [repo AGENTS.md](../AGENTS.md) for the test commands).
2. Regenerate schema assets if config changed: `bun run build:schema && bun run build:omo-schema`.
3. Commit the merge, then push: `git push origin rebrand/wow`.
