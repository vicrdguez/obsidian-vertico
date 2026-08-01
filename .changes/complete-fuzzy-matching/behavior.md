# Complete fuzzy matching and navigation Behavior

## Feature: Candidate ranking

#### Scenario: Require order-independent components across fields
- Given a Candidate whose `name` is `Daily notes` and whose `id` is `workspace:open-daily`
- When the query is `open dly`
- Then the Candidate matches even though the Query Components appear in a different field order
- And both Query Components contribute to its Match Score

#### Scenario: Reject a Candidate missing one component
- Given a Candidate for which one Query Component matches a searchable field and another matches no searchable field
- When Candidates are ranked
- Then that Candidate is excluded

#### Scenario Outline: Apply Smart Case per component
- Given Candidate Field text `<field>`
- When the Query Component is `<component>`
- Then the match result is `<result>`

Examples:
| field | component | result |
| Daily | daily | matched |
| Daily | Daily | matched |
| daily | Daily | excluded |
| ABCdaily | aBc | excluded |

#### Scenario: Match diacritics and map highlights to original text
- Given Candidate Field text `Café résumé`
- When the query is `cafe resume`
- Then the Candidate matches without changing its displayed text
- And Match Highlights identify the corresponding characters in `Café résumé`

#### Scenario: Prefer the best field and Candidate Name
- Given one Query Component matches both a Candidate Name and an Annotation with otherwise equivalent `fzf` v2 scores
- When the Candidate is ranked
- Then only the Candidate Name match receives Match Highlights
- And its field score receives a 10% advantage

#### Scenario: Sum component scores
- Given two Candidates with worked `fzf` v2 field scores for two Query Components
- When they are ranked
- Then each Candidate's Match Score is the sum of its two winning field scores after any Candidate Name advantage
- And the Candidate with the greater Match Score ranks first

#### Scenario: Preserve Source Order for empty queries and score ties
- Given Candidates in deterministic Source Order
- When the query is empty or their Match Scores tie
- Then their ranked order remains the Source Order

## Feature: Active Candidate state

#### Scenario: Follow the top match before deliberate navigation
- Given the user has not navigated manually
- When a query change produces a different highest-ranked Candidate
- Then that Candidate becomes active

#### Scenario: Preserve a deliberate Active Candidate while it matches
- Given the user deliberately activated a Candidate below the top-ranked match
- When the query changes and that Candidate still matches
- Then the same Candidate Key remains active

#### Scenario: Replace a deliberate Active Candidate that no longer matches
- Given the user deliberately activated a Candidate
- When the query changes and that Candidate no longer matches
- Then the new highest-ranked Candidate becomes active

## Feature: Complete keyboard navigation

#### Scenario Outline: Move the Active Candidate
- Given matching Candidates and an Active Candidate away from the requested boundary
- When the user presses `<key>`
- Then the Active Candidate moves `<movement>`

Examples:
| key | movement |
| ArrowUp | one Candidate up |
| Ctrl+P | one Candidate up |
| ArrowDown | one Candidate down |
| Ctrl+N | one Candidate down |
| PageUp | one visible page up |
| PageDown | one visible page down |
| Home | to the first Candidate |
| End | to the last Candidate |

#### Scenario: Stop navigation at list boundaries
- Given the first or last matching Candidate is active
- When the user navigates beyond that boundary
- Then the boundary Candidate remains active

#### Scenario: Keep Tab inert
- Given focus is in the query input
- When the user presses Tab
- Then focus remains in the query input
- And the query and Active Candidate do not change
