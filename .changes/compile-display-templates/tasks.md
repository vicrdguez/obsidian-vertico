# Tasks — compile and use Display Templates

## Behavioral
- [ ] B1  Compile literals and ordered fields                       → behavior.md §1
- [ ] B2  Decode supported escapes                                 → behavior.md §2
- [ ] B3  Render conditional affixes                               → behavior.md §3
- [ ] B4  Compile layout, searchability, and explicit style        → behavior.md §4
- [ ] B5  Apply semantic default styles                            → behavior.md §5
- [ ] B6  Reject invalid templates                                 → behavior.md §6
- [ ] B7  Accept an absent exact Property Field                    → behavior.md §7
- [ ] B8  Reject Property Fields for commands                      → behavior.md §8
- [ ] B9  Present untrusted text without markup interpretation     → behavior.md §9
- [ ] B10 Lay out and truncate fields                              → behavior.md §10
- [ ] B11 Match only displayed searchable field values             → behavior.md §11
- [ ] B12 Highlight only Candidate Field text                      → behavior.md §12
- [ ] B13 Compile each default template                            → behavior.md §13

## Chores
- [ ] C1  Add Source schema and approved default-template constants
- [ ] C2  Add theme-aware semantic Field Style and segment-layout CSS
- [ ] C3  Wire the compiled command template into the existing Picker request
- [ ] C4  Run `npm test`, `npm run build`, and `npm run lint`; manually inspect layout, text safety, and semantic styles in desktop Obsidian
