# Make the Picker accessible and scalable Behavior

## Feature: Global active-window Picker Surface

#### Scenario: Open in the active window
- Given Obsidian has more than one desktop window and no Picker is open
- When a Source opens the Picker from the active window
- Then the Picker Surface is mounted in that window
- And no workspace pane is resized or dimmed

#### Scenario: Replace a Picker across windows
- Given a Picker is open in one Obsidian window
- When another Picker opens from a different active window
- Then the first Picker is cancelled and removed
- And exactly one Picker Surface exists in the new active window

## Feature: Accessible result interaction

#### Scenario: Expose combobox and active option semantics
- Given an open Picker with matching Candidates
- When the Active Candidate changes
- Then the query exposes an expanded combobox controlling a listbox
- And `aria-activedescendant` references the active option
- And every option has its Candidate Name as an accessible identity
- And Picker Status reports the Source name, active position, and matching count

#### Scenario: Announce changing result counts
- Given an open Picker
- When the query changes the matching count
- Then a live region announces the new result count without moving input focus

#### Scenario: Expose an accessible no-match state
- Given an open Picker
- When no Candidates match
- Then **No matches** is rendered without option semantics
- And status is `0/0`
- And the live region announces zero results
- And Enter is inert

#### Scenario: Activate and select with the pointer
- Given matching Candidates are rendered
- When the user hovers one Candidate and clicks it once
- Then that Candidate becomes active on hover
- And the Picker tears down before its Candidate Key resolves from the click

## Feature: Cancellation focus behavior

#### Scenario: Let an outside click reach the workspace
- Given the query input has focus in an open Picker
- When the user clicks a focusable workspace control outside the Picker
- Then the Picker cancels without preventing the click's default action or propagation
- And focus remains on the clicked control

#### Scenario: Restore focus after Escape
- Given a workspace element was focused before opening the Picker
- When the user cancels with Escape
- Then the Picker closes
- And focus returns to that workspace element when it can still receive focus

## Feature: Virtualized Candidate list

#### Scenario: Render only the visible range
- Given hundreds of ranked Candidates
- When the Picker displays the first page
- Then the scroll extent represents every ranked Candidate
- But DOM option rows are limited to the visible range plus a small fixed overscan

#### Scenario: Keep the Active Candidate visible
- Given the Active Candidate is outside the current visible range
- When keyboard navigation activates it
- Then the list scrolls the minimum distance needed to reveal it
- And `aria-activedescendant` references a rendered option

#### Scenario Outline: Size the Surface to available rows
- Given `<matches>` matching Candidates, ten configured rows, and `<viewport>` rows of viewport capacity
- When the Picker lays out its Candidate list
- Then its visible row count is `<rows>`

Examples:
| matches | viewport | rows |
| 3 | 20 | 3 |
| 40 | 20 | 10 |
| 40 | 6 | 6 |
| 0 | 20 | 1 no-match row |

#### Scenario: Keep Candidate rows single-line
- Given a Candidate Field is wider than the available row space
- When its row renders
- Then the row does not wrap
- And overflowing text is truncated with an ellipsis
