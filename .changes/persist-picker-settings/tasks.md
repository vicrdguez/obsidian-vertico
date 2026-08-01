# Tasks — persist Picker settings

## Behavioral
- [ ] B1  Fill missing values with defaults                    → behavior.md §1
- [ ] B2  Recover from invalid persisted templates            → behavior.md §2
- [ ] B3  Clamp malformed persisted row counts                → behavior.md §3
- [ ] B4  Save and activate a valid template                  → behavior.md §4
- [ ] B5  Keep an invalid edit inactive                       → behavior.md §5
- [ ] B6  Reset one Source template                           → behavior.md §6
- [ ] B7  Preview representative Candidate fields            → behavior.md §7
- [ ] B8  Persist maximum Candidate rows                      → behavior.md §8
- [ ] B9  Span the full active window                         → behavior.md §9
- [ ] B10 Return to central-workspace width                   → behavior.md §10

## Chores
- [ ] C1  Replace any temporary settings wiring with `VerticoSettings`, runtime compiled state, and the Obsidian settings tab
- [ ] C2  Register the settings tab and dispose live-validation listeners
- [ ] C3  Run `npm test`, `npm run build`, and `npm run lint`; manually verify reload, validation, previews, resets, capacity, and both width modes
