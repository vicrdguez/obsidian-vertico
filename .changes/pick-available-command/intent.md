# Pick an available command

## Why
Obsidian users need a fast, keyboard-driven proof that Vertico can collect Candidates, narrow them, and safely perform a Selection Action.

## What
Replace the sample plugin with the first complete Vertico tracer: **Pick command** opens a bottom-anchored Picker for currently Available Commands, narrows by Candidate Name, and executes the selected command after the Picker closes.

## Scope
- Rename the plugin and package to Vertico and mark it desktop-only
- Remove all sample commands, modal, ribbon, status item, global click Notice, interval, and sample setting
- Register stable command ID `pick-command` with no default hotkey
- Isolate all undocumented command registry access behind one adapter
- Rebuild Command Candidates on every opening
- Include commands with no `checkCallback` or whose `checkCallback(true)` succeeds; exclude all others
- Expose non-empty `name`, stable unique `key`, `id`, and platform-readable joined `hotkeys`
- Naturally sort Command Candidates by Candidate Name, then command ID
- Add the internal Candidate contract and `Picker.pick` seam
- Open one basic bottom-anchored Picker Surface with an empty query
- Narrow Candidate Names with `fzf` v2 ordered-subsequence matching
- Show Picker Status, an Active Candidate, and the **No matches** state
- Support Up, Down, Enter, and Escape
- Cancel an existing Picker before opening a replacement
- Close and tear down the Picker before resolving selection or cancellation
- Execute the selected command only after selection resolves; report execution failures with a Notice
- Disable **Pick command** with a clear Notice when the undocumented API is unavailable
- Add the smallest runnable behavior-test harness using `node:test` and the existing build tooling

## Out of Scope
- Multi-component or cross-field matching, Smart Case, diacritic normalization, scoring aggregation, and Match Highlights
- Full keyboard navigation, mouse behavior, focus restoration, ARIA listbox behavior, and virtual scrolling
- Display Templates and Picker settings
- Note and Backlink Sources
- Public Source APIs or end-user-defined Sources
- Mobile Obsidian

## Definition of Done
- [ ] Vertico loads as a desktop-only plugin with no sample-plugin behavior.
- [ ] Opening **Pick command** snapshots only currently Available Commands in deterministic Source Order.
- [ ] When the undocumented command API is unavailable, **Pick command** shows a clear Notice and does not open a Picker.
- [ ] The command Picker starts empty, narrows Candidate Names with ordered-subsequence matching, and exposes an Active Candidate and Picker Status.
- [ ] A query with no matches shows **No matches**, status `Commands 0/0`, and Enter performs no action.
- [ ] Up and Down change the Active Candidate without moving beyond the first or last match.
- [ ] Enter tears down the Picker before executing the selected command; execution failures produce a Notice without reopening it.
- [ ] Escape tears down the Picker without executing a command.
- [ ] Opening another Picker cancels and removes the existing Picker first.
- [ ] Behavior tests, `npm run build`, and `npm run lint` pass.
