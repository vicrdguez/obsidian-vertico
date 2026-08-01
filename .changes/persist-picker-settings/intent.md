# Persist Picker settings

## Why
Users need to tune dense Picker layout and each Source's annotations without editing code, while invalid templates must never break an opening.

## What
Add persistent Vertico settings for per-Source Display Templates, maximum visible rows, and Surface width, with live validation, representative previews, and safe reset behavior.

## Scope
- Persist one Display Template string for Commands, Notes, and Backlinks
- Persist maximum Candidate rows with default 10 and valid range 1–50
- Persist central-workspace versus full-active-window Surface width, defaulting to central workspace
- Merge missing stored values with defaults on load
- Validate and compile stored templates before making them active
- Fall back to the corresponding default when stored template data is absent or invalid
- Add one settings text area per Source
- Validate template edits live and show concise diagnostics without Notices
- Show a representative synthetic Candidate preview for each Source using the edited valid template
- Keep an invalid edit visible while the settings tab remains open, but do not save or activate it
- Add **Reset to default** for each Source template
- Save and activate a template only after successful validation
- Apply row count and width settings to subsequent Picker openings
- Clamp malformed persisted row counts into the supported 1–50 range
- Use short sentence-case Obsidian settings copy

## Out of Scope
- Custom Source schemas or user-defined Sources
- Per-Source row counts or width settings
- Custom Field Style colors in settings
- Query history, initial-query restoration, previews while navigating, or alternate Selection Actions
- Editing settings from inside an open Picker

## Definition of Done
- [ ] Loading missing or malformed persisted settings yields safe defaults and valid compiled active templates.
- [ ] A valid Source template edit updates its preview, persists, and becomes active for later Picker openings.
- [ ] An invalid template edit remains visible with diagnostics but neither persists nor replaces the active compiled template.
- [ ] Every Source offers a representative text-only synthetic Candidate preview and **Reset to default**.
- [ ] Maximum rows defaults to 10, persists within 1–50, and invalid persisted values are clamped.
- [ ] Surface width defaults to central workspace, persists, and can span the full active window.
- [ ] Subsequent Picker openings use the active templates, row count, and width settings.
- [ ] Settings behavior tests, `npm run build`, and `npm run lint` pass.
