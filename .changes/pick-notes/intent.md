# Pick notes with complete metadata

## Why
Vertico's primary vault workflow is selecting a Markdown Note by its filename, aliases, and useful annotations without rescanning the vault on every keystroke.

## What
Add **Pick note** with complete Canonical and Alias Candidates, curated metadata, exact Property Fields, deterministic Source Order, lazy cached snapshots, and stale-safe note opening through the existing Picker.

## Scope
- Register stable command ID `pick-note` with no default hotkey
- Include Markdown files only
- Build one Canonical Candidate per Note
- Build one Alias Candidate per accepted alias
- Trim aliases and omit empty, exact duplicate, and filename-identical aliases
- Preserve aliases that differ only by case or diacritics
- Give every Candidate a stable Source-unique key and non-empty Candidate Name
- Populate `name`, `filename`, `path`, `folder`, `tags`, `backlinkCount`, and exact top-level `property.*`
- Use filename without `.md` as Canonical Candidate Name and keep canonical `filename` empty
- Use the alias as Alias Candidate Name and underlying filename without `.md` as its `filename`
- Normalize, deduplicate, naturally sort, and space-join inline and frontmatter tags with one `#` prefix
- Count distinct Notes linking to each underlying Note
- Render Property Fields according to approved scalar/list/empty rules
- Naturally sort by Candidate Name, then Note path
- Use the compiled Note Display Template and template-controlled matching
- Lazily build and cache the Note Candidate snapshot
- Mark the cache dirty on relevant vault and metadata changes and rebuild before the next opening
- Keep an already-open Picker's immutable Candidate snapshot stable
- Close before opening the selected Note in the current workspace leaf
- Validate the selected target is still a Markdown Note; show a Notice on stale or failed targets without reopening
- Register cache invalidation listeners through plugin cleanup facilities

## Out of Scope
- Backlink Source
- Non-Markdown vault files
- Note previews, raw-query note creation, alternate Selection Actions, and query history
- A curated `aliases` field; aliases remain available through `property.alias` or `property.aliases`
- Nested frontmatter traversal
- Public Source APIs or user-defined Sources

## Definition of Done
- [ ] **Pick note** snapshots only Markdown Notes and produces the approved Canonical Candidate for each Note.
- [ ] Accepted aliases produce Alias Candidates with the approved deduplication and identity rules.
- [ ] Note Candidates expose the exact approved path, folder, tag, backlink-count, and Property Field values.
- [ ] Candidate Source Order is natural Candidate Name, then path, and Candidate Keys remain unique within an opening.
- [ ] The compiled Note template displays and searches curated and exact Property Fields end to end.
- [ ] The Note snapshot builds lazily, is reused while clean, and rebuilds only before a later opening after relevant invalidation.
- [ ] An open Picker retains its immutable Candidate snapshot despite vault or metadata changes.
- [ ] Selection closes first, then opens a still-valid Note in the current workspace leaf or reports failure without reopening.
- [ ] Note catalog and Picker integration behavior tests, `npm run build`, and `npm run lint` pass.
