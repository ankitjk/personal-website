---
name: log-changes
description: Record what changed on the site, and why, as a dated entry in the Changelog of DEVELOPMENT.md, then print a short rundown. Use after finishing a change and before committing it, or when asked to log, document, or write up what was changed.
---

# /log-changes - Write this change into DEVELOPMENT.md

`DEVELOPMENT.md` at the repo root is the site's running log. Its `## Changelog`
holds one dated entry per change (one feature, so one commit and one pull
request), titled for that change, newest first. A day can have several.

The entry must say **why**, not just what. The diff already records what
changed; the reasons (what looked wrong, what was asked for, what was tried and
dropped) live only in this conversation and are lost when it ends.

## Usage

```
/log-changes                 # log uncommitted changes plus this branch's commits
/log-changes <commit-range>  # log a specific range, e.g. main~3..main
```

## Pick a size

The record should cost about as much as the change did.

| Size | Examples | What to write |
|------|----------|---------------|
| **Small** | Copy edit, styling tweak, rename, dependency bump, one-line fix | One bullet under `**Minor:**` in this change's entry |
| **Normal** | New page or component, layout change, build/deploy/config change, a bug fix | Bullets under `**Changes:**`, one per file or purpose, each with what and why |

When unsure, pick Small.

## Instructions

1. **Find what changed.** Use the range if given. Otherwise:
   ```bash
   git status --short
   git diff HEAD --stat   # fails if the repo has no commits yet; use git status then
   git log --oneline origin/main..HEAD   # this branch's commits not yet on main
   ```
   Read the diffs (or the new files) for anything non-trivial. Do not describe
   a file you have not looked at. Ignore `web/dist/` and lockfile-only churn
   unless that was the point.

2. **Find out why.** Take reasons from this conversation and commit message
   bodies. If a reason is not known, ask; do not invent one. Results come
   from the checks actually run (build, lint, browser); never invent them.

3. **One entry per change.** Add to an existing entry only when it describes
   this same change, i.e. it's already on this branch and not merged to main.
   Otherwise start a new entry, even if another entry has today's date.

4. **Write the entry** directly under `## Changelog`, above the newest one:

   ```markdown
   ### <Month D, YYYY> - <Short Title>

   **Changes:**
   - `path/to/file` - <what changed> - <why>

   **Results:**
   - <how it was checked and what was seen>

   **Minor:**
   - <small change>

   **Left open:**
   - <anything noticed but deliberately not done>
   ```

   Include only the sections that have something in them. Group files that
   changed for one reason into a single bullet.

5. **Keep `## Next Up` honest.** Remove items the work finished. Add anything
   from **Left open** that should be picked up later.

6. **Update `**Last Updated:**`** at the top of the file.

7. **Print a rundown** in chat: a table of file / what changed / why, then
   anything left open.

## Notes

- Do not commit. Leave the edit in the working tree so it goes into the same
  commit as the change it describes.
