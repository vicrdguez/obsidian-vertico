# Tasks — pick notes with complete metadata

## Behavioral
- [ ] B1  Build a Canonical Candidate for each Markdown Note       → behavior.md §1
- [ ] B2  Build accepted Alias Candidates                         → behavior.md §2
- [ ] B3  Normalize Tags Fields                                   → behavior.md §3
- [ ] B4  Count distinct backlinking Notes                        → behavior.md §4
- [ ] B5  Render top-level Property Fields                        → behavior.md §5
- [ ] B6  Sort Notes in deterministic Source Order                → behavior.md §6
- [ ] B7  Search Note annotations and properties                  → behavior.md §7
- [ ] B8  Open a selected Note after closing                      → behavior.md §8
- [ ] B9  Report a stale selected Note                            → behavior.md §9
- [ ] B10 Build once and reuse a clean snapshot                   → behavior.md §10
- [ ] B11 Rebuild before opening after invalidation               → behavior.md §11
- [ ] B12 Keep an open snapshot stable                            → behavior.md §12

## Chores
- [ ] C1  Register stable `pick-note` with no default hotkey
- [ ] C2  Register and dispose relevant vault and metadata-cache invalidation listeners
- [ ] C3  Wire the compiled Note template and current Picker settings into each opening
- [ ] C4  Run `npm test`, `npm run build`, and `npm run lint`; manually verify aliases, metadata, caching, pinned-leaf opening, and stale selection
