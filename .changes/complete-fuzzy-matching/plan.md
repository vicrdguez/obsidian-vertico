# Complete fuzzy matching and navigation Plan

## Approach
Deepen the existing Picker without changing its ownership boundary. A pure ranker converts the current query and searchable Candidate Fields into ranked Candidates plus winning Match Highlights. The Picker session consumes that result and owns only Active Candidate and navigation state. DOM code renders the resulting model but does not calculate ranking.

Use the installed `fzf` package's v2 algorithm for each Query Component/field pair. Normalize only for matching, carrying an index map back to original UTF-16 positions for rendering. Lock qualitative behavior with independent worked fixtures rather than exposing numeric scores as public API.

## Implementation decisions
- Search `name`, `id`, and `hotkeys` in this slice; the Display Template slice will supply the same seam with its compiled searchable fields.
- Split on whitespace and discard empty components. There are no operators or negative components.
- Determine Smart Case from each original Query Component before diacritic normalization: any uppercase letter makes that component case-sensitive.
- Normalize strings with Unicode canonical decomposition and remove combining marks where supported. Preserve a map from each normalized code point to the original UTF-16 range; never render normalized text.
- Run `fzf` v2 separately for every component/field pair.
- A component must match one complete field; characters may not cross field boundaries.
- Choose the highest field score per component. For equal adjusted field scores, prefer `name`, then Candidate field order, to keep highlights deterministic.
- Adjust a Candidate Name field score by multiplying it by `1.1`; sum adjusted winning scores across components. Do not add a cutoff.
- Sort larger Match Scores first; retain the request Candidate index as the final stable tie break.
- Match Highlights are the union of the original-string positions from the winning field for each component; render overlapping positions once.
- An empty query returns all Candidates in Source Order with no Match Highlights and score zero.
- Track deliberate activation by Candidate Key, never by result index.
- A query edit resets deliberate state only when its Candidate Key no longer matches.
- Page movement receives the visible row capacity from the Surface and moves by that many Candidates, clamped to a boundary.
- Ctrl+P/Ctrl+N are recognized only without other modifiers that would change their meaning. Tab is prevented from leaving the input but performs no Picker action.
- Keep ranking and session modules internal; do not expose a matching strategy API.

### Module shapes & seams

#### [NEW] Candidate ranker

```ts
type FieldMatch = Readonly<{
  field: string;
  positions: readonly number[];
}>;

type RankedCandidate = Readonly<{
  candidate: Candidate;
  score: number;
  matches: readonly FieldMatch[];
}>;

function rankCandidates(
  candidates: readonly Candidate[],
  searchableFields: readonly string[],
  query: string,
): readonly RankedCandidate[];
```

Dependencies:
- `fzf` v2: matching algorithm
- Unicode standard-library normalization: text adaptation

Invariants:
- Input order is Source Order and is the final tie breaker.
- Every returned Candidate matched every Query Component.
- At most one field match exists per Query Component.
- Highlight positions address original Candidate Field strings.

Test strategy: table-driven `rankCandidates` tests use literal expected order and positions for cross-field components, Smart Case, decomposed/precomposed diacritics, Candidate Name weighting, score aggregation, empty query, and ties. Do not reproduce the ranking algorithm in assertions.

#### [MODIFIED] Picker session

```ts
class PickerSession {
  setQuery(query: string): void;
  move(delta: -1 | 1): void;
  page(delta: -1 | 1, capacity: number): void;
  first(): void;
  last(): void;
  accept(): string | null;
  cancel(): null;
  readonly state: PickerState;
}
```

Dependencies:
- Candidate ranker: internal domain module

Invariants:
- `state.activeKey` is null exactly when no Candidate matches.
- Active Candidate behavior follows the documented automatic/deliberate rules.
- Navigation is clamped and does nothing in the no-match state.

Test strategy: drive this public session seam through query and navigation operations. Assert state and accepted Candidate Key, not private flags or helper calls.

#### [MODIFIED] Picker Surface
Map input and key events to Picker-session operations, render winning Match Highlights with accent-colored bold text, and keep focus in the query input for Tab. Enter with no Active Candidate is inert.

Test strategy: one integration behavior verifies the live Picker searches all three command fields and accepts the session's Candidate Key. Keep ranking combinations at the pure ranker seam.

## Sequence
1. Add normalization/index mapping and red-green its original-text positions.
2. Add component/field ranking one behavior at a time through `rankCandidates`.
3. Deepen Picker-session Active Candidate state one behavior at a time.
4. Wire complete key handling and Match Highlight rendering.
5. Run tests, build, lint, and manually exercise command name, ID, hotkey, uppercase, and accented queries.
