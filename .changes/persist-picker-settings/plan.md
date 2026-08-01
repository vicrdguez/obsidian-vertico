# Persist Picker settings Plan

## Approach
Keep persisted data as plain validated values and compiled templates as runtime-only state. One settings loader merges and sanitizes stored data. The Obsidian settings tab edits each template through the existing compiler, presents the compiler's diagnostics and row model, and commits only valid values. `PickerHost.pick` receives current runtime settings at each opening.

## Implementation decisions
- Persist this shape through `loadData`/`saveData`:

```ts
type VerticoSettings = Readonly<{
  templates: Readonly<{
    commands: string;
    notes: string;
    backlinks: string;
  }>;
  maxRows: number;
  fullWindowWidth: boolean;
}>;
```

- Keep compiled templates outside persisted data in runtime state keyed by Source.
- Defaults are the exact three template constants owned by the Display Template module, `maxRows: 10`, and `fullWindowWidth: false`.
- Treat absent, wrong-typed, or non-finite stored values as defaults.
- Convert a numeric row count to an integer by truncating, then clamp to 1–50. A non-number uses 10.
- If a persisted template is not a string or does not compile against its Source schema, use the approved default for both persisted/runtime recovery and active compilation.
- The settings tab may hold an invalid draft only in its current DOM control state. Do not write invalid template text to plugin data and do not change runtime compiled state.
- A valid template edit compiles before save, then atomically updates persisted text and runtime compiled state.
- Live validation may be debounced only enough to avoid redundant rendering; it must update as the user edits and must be disposed with the settings tab.
- Diagnostics are inline setting descriptions/messages, not Notices.
- Previews use fixed representative synthetic Candidates, the compiler's presentation result, and the same text-only row renderer as the Picker where practical. Do not open a Picker for previews.
- Reset affects only its Source and follows the same compile/save/activate path as a valid edit.
- Row count and width changes save immediately through Obsidian controls.
- Read all three settings when a Picker opens. Do not mutate an already-open session; changes apply to subsequent openings.
- Full-window width changes only the Surface horizontal containing block. Bottom anchoring and viewport-capacity behavior remain unchanged.
- Keep settings classes independent of the plugin concrete class by accepting narrow load/save/runtime callbacks where needed; do not introduce a general settings framework.

### Module shapes & seams

#### [NEW] Settings state

```ts
type RuntimeSettings = Readonly<{
  values: VerticoSettings;
  templates: Readonly<Record<SourceId, CompiledTemplate>>;
}>;

function loadSettings(raw: unknown): RuntimeSettings;

class SettingsStore {
  readonly current: RuntimeSettings;
  setTemplate(source: SourceId, text: string): Promise<CompileResult>;
  setMaxRows(value: number): Promise<void>;
  setFullWindowWidth(value: boolean): Promise<void>;
  resetTemplate(source: SourceId): Promise<void>;
}
```

Dependencies:
- Plugin `loadData`/`saveData`: persistence adapter
- Display Template compiler and Source schemas: validation

Invariants:
- Every runtime Source always has a valid compiled template.
- Persisted templates are strings that compiled successfully when saved.
- `maxRows` is always an integer from 1 through 50.

Test strategy: test `loadSettings` and `SettingsStore` through fake raw data and fake persistence. Assert resulting public values, compiled presentation, and saved payloads; do not assert private caches or compiler calls.

#### [NEW] Vertico settings tab
Use Obsidian `PluginSettingTab` and `Setting` controls for the three template editors, row count, width toggle, diagnostics, previews, and reset buttons.

Dependencies:
- Settings store: domain/persistence seam
- Existing row presenter: UI rendering seam

Invariant: invalid draft text never reaches `SettingsStore` as active state.

Test strategy: drive input/change/reset through a DOM settings tab where practical; otherwise retain one manual settings smoke test and keep validation/save behavior at `SettingsStore`.

#### [MODIFIED] Picker request/opening
Supply compiled template, max rows, and width mode from the current runtime settings for every opening. Do not make Picker code load plugin data.

Test strategy: a high-level integration opens twice around a settings change and observes the second Surface's presentation and capacity.

## Sequence
1. Add red-green loading/sanitization and runtime compiled-state behavior.
2. Add valid edit, invalid draft, save, and reset flows through the settings store.
3. Build the settings tab with diagnostics and synthetic previews.
4. Route max rows, width mode, and compiled template into each new Picker opening.
5. Run tests, build, and lint; manually reload the plugin and verify all controls, previews, invalid edits, reset, width, and capacity.
