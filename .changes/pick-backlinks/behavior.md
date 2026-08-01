# Pick backlinks Behavior

## Feature: Backlink command availability

#### Scenario: Enable Pick backlink for an active Markdown Note
- Given the active workspace view contains a Markdown Note
- When Obsidian checks command availability
- Then **Pick backlink** is available
- And invoking it snapshots that active Note as the backlink target

#### Scenario: Disable Pick backlink without an active Markdown Note
- Given no Markdown Note is active
- When Obsidian checks command availability
- Then **Pick backlink** is unavailable
- And no Picker can be opened through that command

## Feature: Backlink Candidate snapshot

#### Scenario: Collapse repeated resolved references by linking Note
- Given one Markdown Note contains multiple resolved references of different internal-link forms to the active Note
- And another Markdown Note contains one resolved reference
- When Backlink Candidates are built
- Then exactly two Candidates are returned
- And each linking Note appears once regardless of occurrence count or reference form

#### Scenario: Include only resolved Markdown linking Notes
- Given resolved links from a Markdown Note and a non-Markdown file plus an unresolved textual reference from another Note
- When Backlink Candidates are built
- Then only the resolved Markdown linking Note appears

#### Scenario: Reuse Note fields without Alias Candidates
- Given a linking Note has aliases, tags, frontmatter, folder data, and its own distinct backlink count
- When its Backlink Candidate is built
- Then `name` is the linking Note's filename without `.md`
- And tags, path, folder, backlinkCount, and exact Property Fields use the Note projection rules
- And aliases are available through `property.alias` or `property.aliases`
- But no Alias Candidate is created

#### Scenario: Preserve deterministic Backlink Source Order
- Given several Backlink Candidates with natural-sortable Candidate Names
- When the snapshot is finalized
- Then Candidates are naturally sorted by Candidate Name, then linking Note path
- And Candidate Keys are unique within the opening

#### Scenario: Open no-match state for zero backlinks
- Given an active Markdown Note with no resolved backlinking Notes
- When **Pick backlink** opens
- Then the normal Picker opens with the compiled Backlink template
- And it shows **No matches** with `Backlinks 0/0`

#### Scenario: Keep the opening snapshot stable
- Given a Backlink Picker is open
- When resolved links or linking Note metadata changes
- Then the open Picker's Candidate snapshot does not change
- But a later opening reflects the current Note catalog and resolved-link state

## Feature: Backlink selection

#### Scenario: Open the selected linking Note after closing
- Given a Backlink Candidate is active and its linking Note still exists as Markdown
- When the user selects it
- Then the Picker tears down before the Selection Action
- And Obsidian opens the linking Note in the current workspace leaf using normal pinned-leaf handling

#### Scenario: Report a stale linking Note
- Given the selected linking Note was deleted or ceased to be Markdown after the snapshot
- When its Selection Action runs
- Then the Picker remains closed
- And a Notice reports that the Note can no longer be opened
