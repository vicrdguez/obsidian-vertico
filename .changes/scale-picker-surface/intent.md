# Make the Picker accessible and scalable

## Why
The basic Picker proves the flow but is not yet safe for large Candidate sets, mouse use, multiple Obsidian windows, or assistive technology.

## What
Complete the Picker Surface as a globally single, active-window, accessible, mouse-capable, fixed-height virtualized overlay while retaining the existing `Picker.pick` contract and full ranked snapshot.

## Scope
- Mount the Picker Surface in the active Obsidian window
- Keep at most one Picker open globally and move replacement sessions to the active window
- Anchor the temporary Surface to the bottom without changing or dimming workspace layout
- Span the central workspace by default
- Put the query above the Candidate list
- Implement the ARIA combobox/listbox pattern with `aria-activedescendant`
- Give every rendered Candidate option an accessible Candidate Name regardless of displayed fields
- Announce matching-result counts through a live region
- Render Picker Status as Source name plus Active Candidate position and matching count
- Render the non-selectable **No matches** row and `0/0` status
- Make hovering activate a Candidate and a single click select it
- Cancel on an outside click without preventing that click from reaching the workspace
- Restore prior focus after Escape; leave focus on the clicked target after outside-click cancellation
- Use fixed-height virtual scrolling while retaining every ranked match
- Keep the Active Candidate in view during keyboard and pointer navigation
- Show at most 10 Candidate rows by default, shrink for fewer matches, and respect viewport capacity
- Keep Candidate rows on one line with ellipses
- Style the Active Candidate with the theme selection background and a narrow accent leading border
- Use accent-colored bold Match Highlights
- Register and remove all DOM listeners through the Picker component lifecycle
- Add DOM-level behavior tests at the `Picker.pick` seam plus focused virtual-range checks only where browser layout cannot provide geometry

## Out of Scope
- Full-window width and configurable row count
- Display Templates and semantic field styles
- Persistent settings
- Note and Backlink Sources
- Mobile support

## Definition of Done
- [ ] Opening or replacing a Picker leaves exactly one Surface in the active Obsidian window.
- [ ] The query, list, options, Active Candidate, status, and announcements expose the specified accessible combobox/listbox behavior.
- [ ] **No matches** is announced and rendered as non-selectable, with Enter inert.
- [ ] Hover activates a Candidate and one click selects it after teardown.
- [ ] Outside-click cancellation allows the workspace click through and leaves focus on its target.
- [ ] Escape cancellation restores the element focused before the Picker opened.
- [ ] Large result sets use fixed-height virtual scrolling, retain every ranked Candidate, and keep the Active Candidate visible.
- [ ] The Surface shows no more than 10 rows, shrinks for fewer matches, and obeys viewport capacity.
- [ ] Candidate rows, Active Candidate styling, and Match Highlights follow the approved theme-aware presentation.
- [ ] DOM behavior tests, `npm run build`, and `npm run lint` pass, followed by the specified manual desktop checks.
