# Pick backlinks

## Why
While reading a Note, users need to jump to any distinct Markdown Note that refers to it without reviewing individual link occurrences.

## What
Add **Pick backlink** by reusing Note metadata projection and the existing Picker, producing one Backlink Candidate per distinct resolved linking Note and opening the selection safely in the current workspace leaf.

## Scope
- Register stable command ID `pick-backlink` with no default hotkey
- Make the command available only while a Markdown Note is active
- Snapshot the active Note path when the command opens
- Use Obsidian's resolved internal links regardless of reference syntax or occurrence count
- Produce one Backlink Candidate per distinct Markdown Note linking to the active Note
- Exclude non-Markdown sources and the active Note unless it has a resolved self-link
- Reuse Note field projection for `name`, `path`, `folder`, `tags`, `backlinkCount`, and exact `property.*`
- Use the linking Note's filename without `.md` as Candidate Name
- Do not create Alias Candidates
- Keep aliases available through `property.alias` or `property.aliases`
- Naturally sort by Candidate Name, then linking Note path
- Use the current compiled Backlink Display Template and Picker settings
- Open a normal **No matches** Picker when the active Note has zero backlinks
- Keep the opening snapshot stable
- Close before opening the selected linking Note in the current workspace leaf
- Validate stale selected targets and report failure with a Notice without reopening

## Out of Scope
- Individual backlink occurrences, occurrence counts, context snippets, and previews
- Unresolved textual references
- Backlinks to non-Markdown files
- Alias Candidates
- Mixed Sources, public Source APIs, and alternate Selection Actions
- Mobile Obsidian

## Definition of Done
- [ ] **Pick backlink** is available only when a Markdown Note is active and opens against that Note's path.
- [ ] Every distinct Markdown Note with a resolved internal reference to the active Note produces exactly one Backlink Candidate.
- [ ] Backlink Candidates reuse approved Note fields, expose aliases only as exact Property Fields, and follow natural Candidate Name/path Source Order.
- [ ] Zero backlinks opens the normal **No matches** state rather than showing an error.
- [ ] The compiled Backlink template and current Picker settings control display and matching.
- [ ] The opening snapshot remains stable while its Picker is open.
- [ ] Selection closes first, then opens a still-valid linking Note in the current workspace leaf or reports failure without reopening.
- [ ] Backlink behavior and Picker integration tests, `npm run build`, and `npm run lint` pass.
