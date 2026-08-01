# Pick notes with complete metadata Plan

## Approach
Put Obsidian vault/metadata collection, caching, invalidation, and stale selection in a `NoteCatalog`. Keep Candidate projection and normalization pure so behavior fixtures need no Obsidian runtime. The plugin asks the catalog for an immutable opening snapshot, passes it with the compiled Note template to the existing Picker, then asks the catalog to open the returned Candidate Key.

Reuse the existing Candidate, template, ranking, Picker, settings, and row-presentation contracts. Do not create a generic Source framework.

## Implementation decisions
- Stable command ID is `pick-note`; do not assign a default hotkey.
- Enumerate only `TFile`s with extension exactly `md` under Obsidian's normalized extension behavior.
- The Canonical Candidate Name is `file.basename`; its `filename` field is empty.
- Read aliases from Obsidian metadata/frontmatter forms for `alias` and `aliases`, normalize to scalar strings, trim each, and preserve source order before deduplication.
- Omit empty aliases, exact duplicate alias strings, and aliases exactly equal to `file.basename`. Comparisons are case-sensitive and diacritic-sensitive, so case-only and diacritic-only differences survive.
- Alias Candidate `name` is the trimmed alias; `filename` is `file.basename`.
- Candidate Keys are opaque strings derived from the Note path plus Candidate kind and exact alias identity. Escape or length-prefix components so distinct paths/aliases cannot collide; never parse keys outside `NoteCatalog`.
- Every Candidate for one Note shares its target path, tags, folder, backlink count, and Property Fields.
- `path` is vault-relative and includes `.md`; `folder` is `file.parent?.path` except vault root becomes empty.
- Tags combine Obsidian inline/cache tags and frontmatter tags. Trim, remove all leading `#`, discard empty values, prefix exactly one `#`, deduplicate exact normalized strings, naturally sort, and join with one space.
- Backlink count is the number of distinct source Note paths in `metadataCache.resolvedLinks` that resolve at least once to the target path. Ignore non-Markdown sources.
- Frontmatter projection is top-level only:
  - string unchanged
  - finite/non-finite number via JavaScript string conversion
  - boolean as `true`/`false`
  - a list only when every element is string, number, or boolean; join converted values with `, `
  - missing, null, objects, and lists containing objects/nested lists/null become empty
- Preserve exact frontmatter keys, including dots, as `property.<key>` Candidate Fields. Do not synthesize a curated `aliases` field.
- Source Order uses natural Candidate Name, then path, then raw Candidate Key as deterministic tie breaker.
- Build lazily on first `snapshot()`. Return one immutable array and immutable Candidate values while clean.
- Mark dirty for vault create/delete/rename/modify events affecting Markdown Notes and metadata-cache changed/resolved events that can affect aliases, properties, tags, or links. Coalesce invalidations to one dirty flag; do not rebuild in event handlers.
- An opening retains the array it received even after the catalog becomes dirty.
- On selection, resolve Candidate Key to the captured target path, fetch the current abstract file, require a Markdown `TFile`, then call the current workspace leaf's normal `openFile` path. Respect pinned-leaf handling by using Obsidian's current-leaf API rather than selecting a new leaf manually.
- Close-before-action remains owned by `Picker.pick`. Failures show one concise Notice and never reopen.
- Register vault/metadata listeners with the plugin so unload removes them.

### Module shapes & seams

#### [NEW] Pure Note projection

```ts
type NoteRecord = Readonly<{
  path: string;
  basename: string;
  aliases: readonly string[];
  tags: readonly string[];
  frontmatter: Readonly<Record<string, unknown>>;
  backlinkingPaths: readonly string[];
}>;

function projectNoteCandidates(
  notes: readonly NoteRecord[],
): readonly Candidate[];
```

Dependencies: standard-library normalization/sorting only.

Invariants:
- Output includes exactly one Canonical Candidate plus accepted Alias Candidates per input Note.
- Candidate Keys are unique and all Candidate values are immutable.
- Output is final Source Order.

Test strategy: one multi-Note fixture at this seam covers file filtering inputs, canonical/alias rules, tags, properties, root/nested folders, distinct backlinks, natural ordering, and key uniqueness. Expected fields are literal values, not recomputed by test helpers.

#### [NEW] Note catalog

```ts
class NoteCatalog {
  snapshot(): readonly Candidate[];
  invalidate(): void;
  open(candidateKey: string): Promise<void>;
  unload(): void;
}
```

Dependencies:
- Obsidian vault and metadata cache: external data adapters
- Workspace current leaf: Selection Action adapter
- Pure Note projection: internal domain module

Invariants:
- Build only from Obsidian state observed at `snapshot()` time.
- Reuse the immutable array while clean and never mutate arrays already returned.
- Validate current target state during `open`.

Test strategy: fake the vault/metadata/workspace boundary and observe snapshot identity/content, rebuild timing, stable prior snapshots, and open outcomes through public methods. Do not assert dirty flags or event-handler calls.

#### [MODIFIED] Plugin command orchestration
Register `pick-note`, fetch the current Note template/settings, await `PickerHost.pick`, and invoke `NoteCatalog.open` only for a selected key. Convert catalog failures to concise Notices.

Test strategy: one high-level integration demonstrates template-controlled property matching and teardown-before-current-leaf opening.

## Sequence
1. Red-green pure Note projection for canonical identity and aliases.
2. Add tags, properties, backlink counts, keys, and ordering one scenario at a time.
3. Add lazy `NoteCatalog` collection, immutable caching, and invalidation.
4. Add stale-safe current-leaf opening.
5. Register `pick-note` and connect the Note template/settings to the Picker.
6. Run tests, build, and lint; manually demo aliases, metadata search, cache invalidation, pinned leaves, and deletion before selection.
