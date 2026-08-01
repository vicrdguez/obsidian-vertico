# Compile and use Display Templates

## Why
Vertico Candidates need Source-specific context without hard-coded row layouts, and users need displayed fields to define what participates in matching.

## What
Add a validated, text-only Display Template compiler and use its opaque compiled result to present and search command Candidates in the live Picker. Include approved schemas, defaults, layout modifiers, escaping, semantic Field Styles, and diagnostics for all initial Sources.

## Scope
- Parse literal text and named field placeholders such as `${tags width=20 style=tag searchable=false}`
- Support backslash escaping for literal `${`, quoted modifier content, and literal backslashes
- Support conditional `prefix` and `suffix`
- Support fixed `ch` width, one `width=*`, left/right alignment, searchability, and semantic style modifiers
- Apply semantic default styles for `name`, `tags`, `backlinkCount`, `hotkeys`, `property.*`, and other fields
- Support `primary`, `annotation`, `tag`, `property`, `count`, and `hotkey` Field Styles
- Reject malformed syntax, unsupported fields or modifiers, invalid modifier values, duplicate fields, and more than one `width=*`
- Accept exact arbitrary `property.*` fields in Note and Backlink schemas even when absent from current Candidates
- Compile a template to an opaque presentation/search model rather than exposing parser structure
- Render literals and Candidate Field values strictly as text
- Render a field's prefix and suffix only when its field value is non-empty
- Reserve fixed field width, fill remaining space with `width=*`, align as requested, and truncate overflow with ellipses
- Make displayed fields searchable by default; exclude `searchable=false` fields and all template literals
- Connect compiled searchable fields to ranking and compiled row segments to the Picker Surface
- Apply Match Highlights only to Candidate Field text, never literals or affixes
- Add approved default Display Templates for Commands, Notes, and Backlinks
- Add theme-variable CSS for semantic Field Styles

## Out of Scope
- Settings controls, persistence, live preview, and reset behavior
- User-defined schemas or public template APIs
- Markdown, HTML, nested layout, multi-line rows, conditional expressions, or arbitrary CSS in templates
- Note and Backlink Candidate construction

## Definition of Done
- [ ] Valid templates compile literals, fields, escaping, conditional affixes, widths, alignment, searchability, and Field Styles into the approved opaque presentation model.
- [ ] Field values, literals, prefixes, and suffixes render strictly as text with correct empty-field behavior.
- [ ] Fixed and flexible fields reserve/fill width, align, and truncate as specified, with at most one `width=*`.
- [ ] Semantic default and explicit Field Styles use approved theme-aware roles.
- [ ] Unsupported, duplicate, malformed, or otherwise invalid templates return useful diagnostics and no compiled template.
- [ ] Exact `property.*` placeholders are valid only for Note-based schemas and do not traverse nested values.
- [ ] Only displayed searchable Candidate Field values participate in matching; literals, affixes, and display-only fields never match.
- [ ] The command Picker uses the approved default command template end to end.
- [ ] Compiler and Picker integration behavior tests, `npm run build`, and `npm run lint` pass.
