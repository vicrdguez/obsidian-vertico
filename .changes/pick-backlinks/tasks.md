# Tasks — pick backlinks

## Behavioral
- [ ] B1  Enable Pick backlink for an active Markdown Note      → behavior.md §1
- [ ] B2  Disable Pick backlink without an active Markdown Note → behavior.md §2
- [ ] B3  Collapse repeated resolved references by linking Note → behavior.md §3
- [ ] B4  Include only resolved Markdown linking Notes          → behavior.md §4
- [ ] B5  Reuse Note fields without Alias Candidates            → behavior.md §5
- [ ] B6  Preserve deterministic Backlink Source Order          → behavior.md §6
- [ ] B7  Open no-match state for zero backlinks                → behavior.md §7
- [ ] B8  Keep the opening snapshot stable                      → behavior.md §8
- [ ] B9  Open the selected linking Note after closing          → behavior.md §9
- [ ] B10 Report a stale linking Note                           → behavior.md §10

## Chores
- [ ] C1  Register stable conditional `pick-backlink` with no default hotkey
- [ ] C2  Expose the smallest immutable Note-index read model needed by Backlink projection
- [ ] C3  Wire the compiled Backlink template and current Picker settings into each opening
- [ ] C4  Run `npm test`, `npm run build`, and `npm run lint`; manually verify repeated links, zero results, context availability, pinned leaves, stable snapshots, and stale selection
