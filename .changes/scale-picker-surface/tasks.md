# Tasks — make the Picker accessible and scalable

## Behavioral
- [ ] B1  Open in the active window                         → behavior.md §1
- [ ] B2  Replace a Picker across windows                  → behavior.md §2
- [ ] B3  Expose combobox and active option semantics      → behavior.md §3
- [ ] B4  Announce changing result counts                  → behavior.md §4
- [ ] B5  Expose an accessible no-match state              → behavior.md §5
- [ ] B6  Activate and select with the pointer             → behavior.md §6
- [ ] B7  Let an outside click reach the workspace         → behavior.md §7
- [ ] B8  Restore focus after Escape                       → behavior.md §8
- [ ] B9  Render only the visible range                    → behavior.md §9
- [ ] B10 Keep the Active Candidate visible                → behavior.md §10
- [ ] B11 Size the Surface to available rows               → behavior.md §11
- [ ] B12 Keep Candidate rows single-line                  → behavior.md §12

## Chores
- [ ] C1  Add test-only DOM support if required by the existing harness
- [ ] C2  Complete theme-aware Picker, Active Candidate, Match Highlight, virtualization, and live-region styles
- [ ] C3  Register all Surface nodes and listeners with disposable Picker lifecycle cleanup
- [ ] C4  Run `npm test`, `npm run build`, and `npm run lint`; manually verify pop-out windows, click propagation, focus, screen-reader announcements, virtualization, and light/dark themes
