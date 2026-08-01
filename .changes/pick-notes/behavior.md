# Pick notes with complete metadata Behavior

## Feature: Note Candidate projection

#### Scenario: Build a Canonical Candidate for each Markdown Note
- Given a vault containing Markdown and non-Markdown files
- When the Note Source snapshots Candidates
- Then each Markdown Note produces one Canonical Candidate
- But non-Markdown files produce no Candidates
- And each Canonical Candidate uses the filename without `.md` as `name`, empty `filename`, vault-relative `.md` path, and parent folder without a trailing slash

#### Scenario: Build accepted Alias Candidates
- Given a Note named `Café.md` with aliases containing whitespace, empty values, exact duplicates, `Café`, `café`, `Cafe`, and `Coffee`
- When Note Candidates are projected
- Then empty aliases, exact duplicate aliases, and the filename-identical alias `Café` are omitted
- And trimmed `café`, `Cafe`, and `Coffee` each produce distinct Alias Candidates
- And each Alias Candidate has the alias as `name` and `Café` as `filename`

#### Scenario: Normalize Tags Fields
- Given inline and frontmatter tags with repeated values, mixed `#` prefixes, and natural-sortable names
- When Note Candidates are projected
- Then `tags` contains each tag once with one `#` prefix
- And tags are naturally sorted and joined with spaces

#### Scenario: Count distinct backlinking Notes
- Given one Note links repeatedly to a target through multiple resolved references and another Note links once
- When the target's Candidates are projected
- Then every Candidate for that target has `backlinkCount` equal to `2`

#### Scenario Outline: Render top-level Property Fields
- Given a Note has top-level frontmatter key `<key>` with value `<value>`
- When Candidate Field `<field>` is presented
- Then its text is `<text>`

Examples:
| key | value | field | text |
| status | draft | property.status | draft |
| priority | 3 | property.priority | 3 |
| published | true | property.published | true |
| aliases | [One, Two] | property.aliases | One, Two |
| a.b | exact | property.a.b | exact |
| owner | null | property.owner | empty |
| nested | {name: Ada} | property.nested | empty |
| mixed | [one, {two: 2}] | property.mixed | empty |

#### Scenario: Sort Notes in deterministic Source Order
- Given projected Canonical and Alias Candidates with natural-sortable names
- When the Note snapshot is finalized
- Then Candidates are naturally sorted by Candidate Name, then Note path
- And every Candidate Key is unique within the opening

## Feature: Template-driven Note Picker

#### Scenario: Search Note annotations and properties
- Given the compiled Note template displays searchable tags, name, filename, folder, backlinkCount, and `property.status`
- When Query Components match values across those fields
- Then the Candidate remains matched and ranks through the normal Picker rules

#### Scenario: Open a selected Note after closing
- Given a Note Candidate is active and its target still exists as Markdown
- When the user selects it
- Then the Picker tears down before the Selection Action
- And Obsidian opens the Note in the current workspace leaf using normal pinned-leaf handling

#### Scenario: Report a stale selected Note
- Given a Note Candidate's target was deleted or ceased to be Markdown after the snapshot
- When the user selects it
- Then the Picker remains closed
- And a Notice reports that the Note can no longer be opened

## Feature: Lazy Note snapshots

#### Scenario: Build once and reuse a clean snapshot
- Given the Note Source cache has not been built
- When **Pick note** opens twice without a relevant vault or metadata change
- Then the first opening builds the snapshot lazily
- And the second opening reuses the same immutable snapshot

#### Scenario: Rebuild before opening after invalidation
- Given a clean cached Note snapshot
- When a relevant vault or metadata event changes Candidate data
- And **Pick note** opens again
- Then a fresh snapshot is built before that opening
- And it reflects the changed data

#### Scenario: Keep an open snapshot stable
- Given a Picker is open with one immutable Note snapshot
- When a relevant vault or metadata event occurs
- Then that open Picker's Candidates do not change
- But the cache is dirty for the next opening
