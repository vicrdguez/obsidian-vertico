# Tasks — complete fuzzy matching and navigation

## Behavioral
- [ ] B1  Require order-independent components across fields       → behavior.md §1
- [ ] B2  Reject a Candidate missing one component                 → behavior.md §2
- [ ] B3  Apply Smart Case per component                           → behavior.md §3
- [ ] B4  Match diacritics and map highlights to original text     → behavior.md §4
- [ ] B5  Prefer the best field and Candidate Name                 → behavior.md §5
- [ ] B6  Sum component scores                                     → behavior.md §6
- [ ] B7  Preserve Source Order for empty queries and score ties    → behavior.md §7
- [ ] B8  Follow the top match before deliberate navigation        → behavior.md §8
- [ ] B9  Preserve a deliberate Active Candidate while it matches  → behavior.md §9
- [ ] B10 Replace a deliberate Candidate that no longer matches    → behavior.md §10
- [ ] B11 Move the Active Candidate with every supported key       → behavior.md §11
- [ ] B12 Stop navigation at list boundaries                       → behavior.md §12
- [ ] B13 Keep Tab inert                                            → behavior.md §13

## Chores
- [ ] C1  Wire Match Highlight rendering and command `name`, `id`, and `hotkeys` search through the existing Picker
- [ ] C2  Run `npm test`, `npm run build`, and `npm run lint`; manually verify matching and navigation in desktop Obsidian
