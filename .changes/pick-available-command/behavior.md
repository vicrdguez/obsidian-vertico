# Pick an available command Behavior

## Feature: Available Command Source

#### Scenario: Snapshot only Available Commands
- Given registered commands with no availability check, a passing `checkCallback(true)`, and a failing `checkCallback(true)`
- When **Pick command** builds its opening snapshot
- Then Candidates include the commands with no check and the passing check
- But Candidates exclude the command with the failing check
- And Candidates are naturally ordered by Candidate Name, then command ID

#### Scenario: Rebuild command Candidates for every opening
- Given a command changes from unavailable to available after one Picker closes
- When **Pick command** opens again
- Then the new opening includes that command

#### Scenario: Disable the Source when the undocumented API is unavailable
- Given the isolated command adapter cannot recognize the current Obsidian command registry
- When **Pick command** is invoked
- Then a clear Notice explains that the Command Source is unavailable
- And no Picker opens

## Feature: Basic command Picker

#### Scenario: Narrow commands by Candidate Name
- Given the command Picker opened with an empty query and Candidate `Open daily note`
- When the user enters an ordered subsequence of that Candidate Name
- Then `Open daily note` remains a match
- And it becomes the Active Candidate when ranked first
- And Picker Status reports its position and the matching count

#### Scenario: Show the no-match state
- Given an open command Picker
- When the query matches no Candidate Name
- Then a non-selectable **No matches** row appears
- And Picker Status is `Commands 0/0`
- And Enter performs no Selection Action

#### Scenario: Bound basic navigation
- Given three matching Candidates and the first Candidate active
- When the user presses Up, Down repeatedly, then Down beyond the final Candidate
- Then navigation never moves before the first or beyond the last Candidate

#### Scenario: Select after teardown
- Given an Available Command is the Active Candidate
- When the user presses Enter
- Then the Picker Surface and its listeners are removed before the selected Candidate Key resolves
- And the command is executed after resolution

#### Scenario: Report command execution failure
- Given an Available Command is selected and execution fails
- When its Selection Action runs
- Then a Notice reports the failure
- And the closed Picker does not reopen

#### Scenario: Cancel without execution
- Given an open command Picker
- When the user presses Escape
- Then the Picker Surface and its listeners are removed
- And no command is executed

#### Scenario: Replace the existing Picker
- Given one Picker is open
- When **Pick command** opens another Picker
- Then the first Picker resolves as cancelled and is removed before the second opens
- And only one Picker Surface remains
