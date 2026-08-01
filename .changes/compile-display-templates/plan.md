# Compile and use Display Templates Plan

## Approach
Build one compiler that turns Source-specific template text into an opaque `CompiledTemplate`. The Picker asks that object for presented rows and searchable fields; it never inspects parser nodes. Rendering creates DOM nodes and text nodes from presentation segments, keeping parsing, evaluation, matching input, and DOM concerns separate without exposing a public extension API.

## Implementation decisions
- Supported field modifiers are exactly:
  - `width=<positive integer>` in `ch` or `width=*`
  - `align=left|right`
  - `style=primary|annotation|tag|property|count|hotkey`
  - `searchable=true|false`
  - quoted `prefix="..."` and `suffix="..."`
- Modifiers are whitespace-separated; field names and modifier names are case-sensitive.
- Backslash escapes exactly literal `${`, `"` inside quoted modifier values, and `\\`. Unknown escape sequences are diagnostics rather than silently rewritten.
- A prefix/suffix is part of its field segment but appears only for a non-empty field value. Affixes and literals are never searchable or highlighted.
- Every displayed field is searchable unless `searchable=false`.
- A field may appear only once. There may be at most one `width=*` field.
- Fixed widths reserve their declared `ch` width even for empty values. `width=*` consumes remaining width and may shrink to zero. Fields without a width use their content width and may shrink with ellipsis.
- Default alignment is left. `align=right` affects the complete field segment.
- Default styles are: `name → primary`, `tags → tag`, `backlinkCount → count`, `hotkeys → hotkey`, `property.* → property`, all others → `annotation`.
- Command schema fields are exactly `name`, `id`, and `hotkeys`.
- Note schema fields are `name`, `filename`, `path`, `folder`, `tags`, `backlinkCount`, and any exact `property.<top-level-key>`.
- Backlink schema uses the same supported fields as Note schema.
- The substring after `property.` is one exact non-empty top-level key, including any dots; the compiler does not split or traverse it.
- Unsupported/duplicate fields, malformed syntax, unknown modifiers, invalid values, and multiple flexible fields make the whole template invalid.
- Diagnostics include a concise message and source character range. Do not return a partially usable compiled template.
- `CompiledTemplate` and its result types are internal and immutable. Do not expose the AST.
- Presentation values come from `Candidate.name` or `Candidate.fields`; missing values are empty strings.
- Render all content with `Text` nodes/`textContent`, never `innerHTML`, MarkdownRenderer, or parsing APIs.
- Use CSS flex layout for fields, `ch` bases for fixed widths, and `min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` for truncation.
- Approved default strings are:

```text
Notes:     ${tags width=20 suffix=" "}${name width=*}${filename width=24 prefix=" "}${folder width=24 prefix=" "}${backlinkCount width=5 align=right prefix=" "}
Backlinks: ${tags width=20 suffix=" "}${name width=*}${folder width=24 prefix=" "}${backlinkCount width=5 align=right prefix=" "}
Commands:  ${name width=*}${id width=36 prefix=" "}${hotkeys width=18 align=right prefix=" "}
```

### Module shapes & seams

#### [NEW] Display Template compiler

```ts
type TemplateDiagnostic = Readonly<{
  message: string;
  start: number;
  end: number;
}>;

type PresentedSegment = Readonly<{
  field?: string;
  text: string;
  prefix: string;
  suffix: string;
  width?: number | '*';
  align: 'left' | 'right';
  style: FieldStyle;
  searchable: boolean;
}>;

type PresentedRow = Readonly<{
  segments: readonly PresentedSegment[];
  searchableFields: readonly string[];
}>;

type CompileResult =
  | Readonly<{ ok: true; value: CompiledTemplate }>
  | Readonly<{ ok: false; diagnostics: readonly TemplateDiagnostic[] }>;

function compileTemplate(text: string, schema: CandidateSchema): CompileResult;
```

`CompiledTemplate` exposes only `present(candidate): PresentedRow` and immutable schema-derived metadata needed by the Picker.

Dependencies: none beyond Candidate values and schema constants.

Invariants:
- Successful compilation is complete and diagnostic-free.
- Failed compilation has no compiled value.
- Presented text exactly preserves Candidate values and decoded template literals.
- Searchable fields are displayed fields with `searchable !== false`.

Test strategy: table-driven tests through `compileTemplate(...).present(candidate)` assert literal expected segments and diagnostics. Include malformed syntax, all escapes/modifiers, schema differences, semantic defaults, absent exact properties, and conditional affixes. Do not test parser token arrays.

#### [MODIFIED] Candidate ranker
Accept the `PresentedRow.searchableFields`/values rather than searching every Candidate field. Keep the existing ranking and highlighting contract unchanged.

Test strategy: one Picker-level integration proves display-only and literal text do not match while a displayed searchable field does.

#### [MODIFIED] Picker Surface
Render `PresentedSegment`s as text-only DOM spans with semantic classes and layout properties. Split only Candidate Field text around ranker-provided highlight positions.

Test strategy: use the DOM behavior seam to verify untrusted text remains text and highlights exclude literals/affixes. Inspect rendered behavior, not parser internals or exact class lists beyond semantic roles.

## Sequence
1. Implement schemas, diagnostics, and compiler grammar one red-green behavior at a time.
2. Implement immutable row presentation and semantic defaults.
3. Route presented searchable fields into the ranker.
4. Render segments, layout, styles, and Match Highlights in the Surface.
5. Add and compile the three default constants.
6. Run tests, build, and lint; manually inspect layouts, text-only rendering, and theme roles in desktop Obsidian.
