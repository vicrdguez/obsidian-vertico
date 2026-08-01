# Persist Picker settings Behavior

## Feature: Safe settings loading

#### Scenario: Fill missing values with defaults
- Given stored settings omit one or more Vertico settings
- When settings load
- Then each missing template uses its approved Source default
- And maximum rows is 10 when missing
- And Surface width is central workspace when missing

#### Scenario: Recover from invalid persisted templates
- Given a persisted Source template no longer compiles
- When settings load
- Then that Source's approved default compiles and becomes active
- And the invalid persisted template is not used to open a Picker

#### Scenario Outline: Clamp malformed persisted row counts
- Given persisted maximum rows is `<stored>`
- When settings load
- Then active maximum rows is `<active>`

Examples:
| stored | active |
| 0 | 1 |
| 51 | 50 |
| -20 | 1 |
| 12.8 | 12 |
| not a number | 10 |

## Feature: Source template settings

#### Scenario: Save and activate a valid template
- Given a Source has an active compiled template
- When the user edits its text area to another valid template
- Then the preview updates from the new compiled template
- And the valid text persists
- And subsequent Picker openings use the new compiled template

#### Scenario: Keep an invalid edit inactive
- Given a Source has an active valid template
- When the user edits its text area to an invalid template
- Then the invalid edit stays visible while the settings tab remains open
- And location-aware diagnostics appear beside that setting
- But the previous compiled template remains active
- And the invalid text is not persisted

#### Scenario: Reset one Source template
- Given a Source has a custom valid template
- When the user selects **Reset to default** for that Source
- Then its approved default text replaces the edit
- And the default preview appears
- And the default persists and becomes active
- But the other Source templates do not change

#### Scenario Outline: Preview representative Candidate fields
- Given the `<source>` template setting is visible
- When its current edit is valid
- Then the preview uses synthetic `<fields>` values
- And all preview content is rendered strictly as text

Examples:
| source | fields |
| Commands | name, id, hotkeys |
| Notes | tags, name, filename, path, folder, backlinkCount, property values |
| Backlinks | tags, name, path, folder, backlinkCount, property values |

## Feature: Surface settings

#### Scenario: Persist maximum Candidate rows
- Given the user sets maximum rows to a value from 1 through 50
- When settings save and the next Picker opens
- Then the Surface uses that maximum subject to match count and viewport capacity

#### Scenario: Span the full active window
- Given the user enables full-window width
- When the next Picker opens in an Obsidian window
- Then the Picker Surface spans that active window instead of only its central workspace

#### Scenario: Return to central-workspace width
- Given full-window width was enabled
- When the user disables it and opens another Picker
- Then the Picker Surface spans the central workspace
