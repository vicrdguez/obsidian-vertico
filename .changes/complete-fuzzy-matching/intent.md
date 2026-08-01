# Complete fuzzy matching and navigation

## Why
A name-only command filter is not enough for Vertico's intended completion workflow: users need order-independent components across contextual fields, predictable ranking, visible Match Highlights, and deliberate keyboard control.

## What
Deepen the live command Picker with the complete v1 matching, ranking, highlighting, Active Candidate, and keyboard-navigation semantics while preserving the existing `Picker.pick` seam.

## Scope
- Split the query on whitespace into positive, order-independent Query Components
- Require every Query Component to fuzzy-match at least one searchable Candidate Field
- Allow different Query Components to match different fields
- Use `fzf` v2 ordered-subsequence scores with contiguous, word-boundary, and earlier-match preferences
- Apply Smart Case independently per Query Component
- Ignore Unicode diacritics where normalization permits while retaining original display text and highlight positions
- Choose each component's highest-scoring field match
- Give Candidate Name matches a 10% score advantage
- Sum each component's winning field score into the Candidate Match Score
- Highlight only the winning field positions for each Query Component
- Search command `name`, `id`, and `hotkeys` until Display Templates later choose searchable fields
- Preserve Source Order before querying and whenever Match Scores tie
- Keep the highest-ranked Candidate active until the user deliberately navigates
- Preserve a deliberate Active Candidate across query changes while it still matches; otherwise activate the new highest-ranked Candidate
- Support Up/Down, Page Up/Page Down, Home/End, Ctrl+P/Ctrl+N, Enter, Escape, and inert Tab
- Stop navigation at the first and last matching Candidate
- Keep all ranking logic behind one pure internal seam and all interaction state behind the Picker session seam

## Out of Scope
- Display Template parsing or template-controlled searchability
- ARIA completion, mouse interaction, focus restoration, active-window placement, and virtual scrolling
- Persistent settings
- Note and Backlink Sources
- Alternate matchers, typo edits, transpositions, score cutoffs, and reserved query syntax

## Definition of Done
- [ ] Query Components match in any order and may match across different searchable Candidate Fields, but every component is required.
- [ ] Smart Case is applied independently to every Query Component.
- [ ] Diacritic-insensitive matching preserves original rendered text and correct Match Highlight positions.
- [ ] Each component contributes only its best field score and Match Highlights, with a 10% Candidate Name advantage.
- [ ] Candidate Match Scores are summed and ties preserve Source Order; an empty query also preserves Source Order.
- [ ] The Active Candidate follows the top-ranked match until deliberate navigation and is preserved across query changes only while it remains matched.
- [ ] Every specified navigation key moves or selects as defined, never crosses list bounds, and Tab leaves focus and state unchanged.
- [ ] Ranking and Picker-session behavior tests, `npm run build`, and `npm run lint` pass.
