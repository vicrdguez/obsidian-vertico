# Compile and use Display Templates Behavior

## Feature: Display Template compilation

#### Scenario: Compile literals and ordered fields
- Given the command template `${name width=*} — ${id width=36}`
- When it compiles against the Command schema
- Then its presentation model preserves the literal and field order
- And `name` fills remaining width while `id` reserves 36ch

#### Scenario: Decode supported escapes
- Given a template containing escaped literal `${`, escaped quotes inside a modifier, and an escaped backslash
- When it compiles and presents a Candidate
- Then those characters appear once as literal text
- And none begin an unintended placeholder

#### Scenario: Render conditional affixes
- Given `${hotkeys prefix=" [" suffix="]"}`
- When it presents Candidates with and without `hotkeys`
- Then the non-empty value includes its prefix and suffix
- But the empty value renders neither affix

#### Scenario: Compile layout, searchability, and explicit style
- Given `${backlinkCount width=5 align=right searchable=false style=count}`
- When it compiles
- Then the field reserves 5ch, aligns right, is display-only, and has the `count` Field Style

#### Scenario Outline: Apply semantic default styles
- Given a placeholder for `<field>` without `style=`
- When it compiles under a schema supporting that field
- Then its Field Style is `<style>`

Examples:
| field | style |
| name | primary |
| tags | tag |
| backlinkCount | count |
| hotkeys | hotkey |
| property.status | property |
| folder | annotation |
| id | annotation |

#### Scenario Outline: Reject invalid templates
- Given a template with `<problem>`
- When it is compiled
- Then compilation returns at least one location-aware diagnostic
- And no compiled template is returned

Examples:
| problem |
| malformed placeholder syntax |
| unsupported field for the selected Source schema |
| the same field more than once |
| two fields using width=* |
| unsupported modifier |
| invalid width, alignment, style, or searchable value |
| unterminated quoted modifier value |

#### Scenario: Accept an absent exact Property Field
- Given a Note template containing `${property.some.key}` and no current Candidate has frontmatter key `some.key`
- When it compiles against the Note schema
- Then the template is valid
- And the field addresses the exact top-level key `some.key` rather than nested traversal

#### Scenario: Reject Property Fields for commands
- Given a Command template containing `${property.status}`
- When it compiles against the Command schema
- Then compilation fails with an unsupported-field diagnostic

## Feature: Text-only Candidate presentation

#### Scenario: Present untrusted text without markup interpretation
- Given a Candidate Field and literal containing HTML-like and Markdown-like text
- When the compiled template renders a row
- Then the visible content exactly equals the input text
- And no element or Markdown rendering is created from that content

#### Scenario: Lay out and truncate fields
- Given a row with fixed-width fields, one `width=*` field, and values wider than their allocations
- When the row renders in constrained space
- Then fixed fields retain their declared `ch` widths
- And the flexible field receives the remaining width
- And every overflowing field truncates with an ellipsis without wrapping

## Feature: Template-controlled matching

#### Scenario: Match only displayed searchable field values
- Given a compiled template with searchable `name`, display-only `id`, and literal text `command`
- When the Picker queries values found only in `id` or the literal
- Then the Candidate does not match
- But a query matching `name` includes the Candidate

#### Scenario: Highlight only Candidate Field text
- Given a query matches a searchable Candidate Field displayed with a prefix and suffix
- When the row renders Match Highlights
- Then only matched characters in the field value are highlighted
- But literal and affix text are not highlighted

## Feature: Approved defaults

#### Scenario Outline: Compile each default template
- Given the approved `<source>` default template
- When it compiles against its Source schema
- Then fields appear in `<order>`
- And `name` is the only `width=*` field

Examples:
| source | order |
| Notes | tags, name, filename, folder, backlinkCount |
| Backlinks | tags, name, folder, backlinkCount |
| Commands | name, id, hotkeys |
