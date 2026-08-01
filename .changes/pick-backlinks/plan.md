# Pick backlinks Plan

## Approach
Add a narrow Backlink Source orchestration over the existing `NoteCatalog`, metadata cache, compiled Backlink template, settings, and Picker. Build one immutable opening snapshot by inverting Obsidian's resolved-link graph for the captured active Note path, then project each distinct linking Note through the shared Note field projection without alias expansion.

Do not add backlink occurrence models or a generic Source framework.

## Implementation decisions
- Stable command ID is `pick-backlink`; do not assign a default hotkey.
- Register with Obsidian `checkCallback`: return true only when the active view has a Markdown `TFile`; invoke only when `checking === false`.
- Capture the active target path once when invocation starts. Later active-view changes do not retarget the open Picker.
- Use `metadataCache.resolvedLinks` as the source of truth. A source path qualifies when its resolved destination map contains the captured target path with a positive occurrence count.
- Include only source paths that currently resolve to Markdown `TFile`s.
- Deduplicate by source Note path. Different link syntax and occurrence count do not create more Candidates.
- A resolved self-link qualifies under the same path rule; do not special-case it away.
- Build exactly one Candidate per linking Note. Its Candidate Key is an opaque Note key owned by `NoteCatalog`, and its Candidate Name is the linking file's basename.
- Reuse the shared Note field projector with alias expansion disabled. Retain raw `property.alias`/`property.aliases` output.
- Compute each linking Note's `backlinkCount` using the same distinct-source rule as the Note Source, not the number of links to the captured active Note.
- Final Source Order is natural Candidate Name, then linking Note path, then raw key tie break.
- Build a fresh Backlink Candidate array for each opening from the captured target plus the current Note catalog/resolved links. The Picker retains that immutable array even if caches invalidate.
- Zero Candidates is a successful snapshot and opens the normal Picker no-match state.
- Supply Source name `Backlinks`, current compiled Backlink template, maximum rows, and width mode.
- Selection uses `NoteCatalog.open(candidateKey)` so Markdown validation, current-leaf opening, pinned-leaf behavior, and failure handling remain single-sourced.
- Do not scan vault file text or inspect unresolved links.

### Module shapes & seams

#### [NEW] Backlink Candidate builder

```ts
type ResolvedLinkMap = Readonly<
  Record<string, Readonly<Record<string, number>>>
>;

function buildBacklinkCandidates(
  activePath: string,
  notes: NoteIndexSnapshot,
  resolvedLinks: ResolvedLinkMap,
): readonly Candidate[];
```

`NoteIndexSnapshot` is the smallest internal read model needed to look up current Markdown Note records and project one canonical-form Candidate without aliases. Reuse the existing Note module type rather than duplicating metadata types.

Dependencies:
- Note projection/read model: internal domain module
- Resolved links: external metadata input

Invariants:
- At most one Candidate exists per distinct linking Note path.
- Every Candidate targets a current Markdown Note.
- Output is immutable final Source Order.

Test strategy: use a literal Note-index fixture and resolved-link graph at this seam. Cover repeated counts, multiple source Notes, non-Markdown/missing sources, unresolved absence, self-links, alias metadata without Alias Candidates, zero results, ordering, and keys. Do not mock projector helper calls.

#### [MODIFIED] Note catalog
Expose the smallest internal immutable read snapshot needed by `buildBacklinkCandidates` and reuse the existing stale-safe `open` operation. Do not expose Obsidian metadata objects or make the catalog a public Source API.

Test strategy: existing NoteCatalog behavior remains authoritative. Add only a high-level Backlink integration for stable snapshots and stale selection.

#### [NEW] Backlink command orchestration

```ts
function pickBacklink(
  activePath: string,
  noteCatalog: NoteCatalog,
  resolvedLinks: ResolvedLinkMap,
  picker: PickerHost,
  settings: RuntimeSettings,
): Promise<void>;
```

Dependencies:
- Note catalog: internal data/selection module
- Metadata cache resolved links: external data adapter
- Picker and settings: UI modules

Invariant: the active target and Candidate array are captured once per opening; the Selection Action runs only after Picker teardown.

Test strategy: exercise command availability via its registered callback and one Picker orchestration test with fake active views, catalog, and Picker. Observe returned/opened keys, not internal graph traversal.

## Sequence
1. Red-green the pure Backlink Candidate builder for deduplication and filtering.
2. Reuse canonical Note field projection without aliases and complete ordering/keys.
3. Add active-Markdown command availability and capture the target path.
4. Wire compiled Backlink template/settings, no-match opening, stable snapshot, and stale-safe selection.
5. Run tests, build, and lint; manually demo repeated references, self-links, zero backlinks, unavailable command context, pinned leaves, and deletion before selection.
