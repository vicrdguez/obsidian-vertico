# Picker

A general completion interaction for narrowing a collection of selectable things and choosing one.

## Language

**Picker**:
The interaction that presents, narrows, and selects from a vertical collection of **Candidates**.
_Avoid_: Palette, finder

**Picker Surface**:
The single temporary bottom-anchored overlay containing the Picker. It captures keyboard input in the active Obsidian window, disappears after selection or cancellation, and spans the central workspace by default or the full window when configured.
_Avoid_: Modal window, workspace pane, bottom dock

**Candidate**:
One selectable thing presented by a **Picker**, belonging to exactly one **Source**. Every Candidate has a non-empty Candidate Name and a unique Candidate Key.
_Avoid_: Item, option, result

**Candidate Key**:
A Source-supplied stable identity unique within one Picker opening. It is not displayed or searched unless the Source also exposes it as a Candidate Field.
_Avoid_: Candidate Name, array index

**Source**:
A kind of selectable thing from which a **Picker** obtains **Candidates**. Each opening of the Picker uses exactly one Source; the initial Sources are notes, backlinks to the current note, and Obsidian commands.
_Avoid_: Provider, collection

**Note**:
A Markdown file in the Obsidian vault. Other vault file types may belong to future Sources but are not Notes.
_Avoid_: File, document

**Source Order**:
The deterministic order supplied by a Source and preserved by the Picker before a query and whenever Match Scores tie. Built-in Sources sort naturally by Candidate Name, then by path or command identifier.
_Avoid_: API order, Picker order

**Candidate Name**:
The required primary label assigned to a Candidate by its Source and exposed as `name`. A Display Template may omit it visually, but the Picker retains it as the Candidate's accessible identity.
_Avoid_: Title, label

**Available Command**:
An Obsidian command that has no availability check or whose check succeeds in the current workspace context. Only Available Commands become Candidates when the command Source opens.
_Avoid_: Registered command, disabled command

**Hotkeys Field**:
The platform-readable shortcuts assigned to an Available Command, such as `Cmd+P` or `Ctrl+Shift+P`, joined with `, ` or empty when unassigned.
_Avoid_: Key glyphs, raw modifiers

**Backlink Candidate**:
A **Candidate** representing one distinct note that has any resolved internal reference to the current note, regardless of reference type or occurrence count. Its `name` is the linking note's filename without `.md`; aliases remain accessible through the `property` namespace rather than creating additional Candidates.
_Avoid_: Backlink occurrence, inbound link

**Backlink Count**:
The number of distinct notes linking to a Candidate's underlying note. Repeated link occurrences from the same note count once.
_Avoid_: Link count, mention count

**Tags Field**:
The naturally sorted, deduplicated combination of a note's inline and frontmatter tags, each normalized with a `#` prefix and exposed as `tags`.
_Avoid_: Frontmatter tags, raw tags

**Alias Candidate**:
A Candidate representing a note under one of its aliases. Its `name` is the trimmed alias and its `filename` is the note's filename without `.md`; empty, exact duplicate, and filename-identical aliases are omitted while case-only and diacritic differences remain distinct.
_Avoid_: Duplicate note, alias match

**Canonical Candidate**:
The primary Candidate representing a note. Its `name` is the note's filename without `.md` and its `filename` field is empty so the same Display Template works for Canonical and Alias Candidates.
_Avoid_: Real Candidate, original Candidate

**Candidate Field**:
A named value of a Candidate, such as its name, path, tag, property, or command identifier. Note Candidates expose a curated set of fields plus arbitrary frontmatter under the `property` namespace; command Candidates expose `name`, `id`, and `hotkeys`.
_Avoid_: Attribute, column

**Property Field**:
A top-level frontmatter value referenced by its exact key through the `property` namespace. Scalars become text, scalar lists are joined with `, `, and null, missing, object, or nested collection values are empty.
_Avoid_: Parsed property, formatted property, nested property

**Note Path**:
A note's vault-relative path including `.md`, exposed as `path`. Its `folder` is the parent path without a trailing slash, or empty for a note at the vault root.
_Avoid_: Absolute path, extensionless path

**Annotation**:
A Candidate Field displayed alongside the Candidate Name to provide context. Like all displayed fields, an Annotation participates in matching by default unless its Display Template marks it display-only.
_Avoid_: Marginalia, extra text

**Query Component**:
A non-empty part of the user's query separated by whitespace. Every Query Component must match some searchable Candidate Field, but components may match in any order and across different fields.
_Avoid_: Search word, token

**Fuzzy Match**:
An ordered character-subsequence match within one Candidate Field. Contiguous, word-boundary, and earlier matches rank higher; typo edits and transpositions are not matches in the initial capability.
_Avoid_: Typo match, edit-distance match

**Smart Case**:
Case sensitivity chosen independently for each Query Component: an all-lowercase component is case-insensitive, while any uppercase letter makes that component case-sensitive.
_Avoid_: Global case sensitivity

**Diacritic-insensitive Match**:
A Fuzzy Match that treats a base letter and its Unicode diacritic variants as equivalent where normalization permits, while preserving the original Candidate Field for display.
_Avoid_: ASCII-only match

**Name Match**:
A Fuzzy Match within the Candidate Name. Its score receives a 10% advantage over an otherwise equivalent match found only in an Annotation.
_Avoid_: Title match, primary-field filter

**Match Score**:
The sum of each Query Component's best field-match score, including the Name Match advantage where applicable. A Candidate's rank is determined by this combined score.
_Avoid_: Source score, field weight

**Match Highlight**:
The visual emphasis applied to the matched character positions from each Query Component's best field match. Other possible matches in the Candidate row are not highlighted.
_Avoid_: Global row highlight

**Display Template**:
A user-configurable, text-only description of how Candidate Fields form a Candidate's row. Each Source has its own Display Template, controlling field order, conditional prefixes and suffixes, width, truncation, left or right alignment, searchability, and visual style; at most one field may use `width=*` to fill remaining space.
_Avoid_: Row formatter, result template, markup template

**Field Style**:
A named, theme-aware visual treatment assigned to a Candidate Field by a Display Template. The initial roles are `primary`, `annotation`, `tag`, `property`, `count`, and `hotkey`; fields receive semantic defaults that users may override in the template or with Obsidian CSS snippets.
_Avoid_: Face, inline formatting, literal color

**Active Candidate**:
The Candidate that pressing Enter would select. It follows the highest-ranked match until the user navigates manually, after which query changes preserve it while it still matches and otherwise activate the new highest-ranked match.
_Avoid_: Selected Candidate, focused result

**Picker Status**:
The Source name followed by the Active Candidate's position among matching Candidates, such as `Notes 3/247`.
_Avoid_: Result count, prompt

**Selection Action**:
The effect performed after a Candidate is selected. The Picker Surface closes before the feature that opened it performs the action; failures are reported without reopening the Picker.
_Avoid_: Candidate action, Picker action

## Example dialogue

> **User:** Open the Picker for commands.
>
> **Developer:** The command Source supplies Candidates, and the Picker narrows them as you type. Its Display Template determines which Candidate Fields appear and which participate in matching.
>
> **User:** What happens when I select one?
>
> **Developer:** The feature that opened the Picker performs the Selection Action; the Picker itself only reports your selection.
