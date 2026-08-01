# Pick an available command Plan

## Approach
Replace the sample with the smallest end-to-end command Picker. Keep the plugin lifecycle thin, put undocumented Obsidian access in one adapter, and let the Picker return a Candidate Key without knowing the Selection Action. Use `fzf` with its v2 algorithm for the initial Candidate Name match so later matching work deepens rather than replaces the algorithm.

Add a dependency-free test runner around `node:test`: bundle TypeScript test entries with the already-installed esbuild development dependency into a temporary directory, run them with Node, and remove the temporary output. Add `fzf` as the only runtime dependency in this slice.

## Implementation decisions
- Follow `docs/adr/0001-desktop-only.md` and `docs/adr/0002-use-undocumented-command-api.md`.
- The manifest ID is permanently `vertico`; display name is `Vertico`; `isDesktopOnly` is `true`.
- Stable command ID is `pick-command`; do not assign a default hotkey.
- Keep all `app.commands` and internal hotkey-registry shape checks in `src/adapters/command-api.ts`.
- Call availability checks only as `checkCallback(true)`; never execute a check while building Candidates.
- Build a fresh immutable command snapshot for each opening.
- Format hotkeys with platform-readable modifier names and join multiple shortcuts with `, `; use an empty string when unassigned.
- Candidate Keys are command IDs in this Source.
- Source Order is natural Candidate Name, then command ID, with a deterministic raw-string tie break.
- `Picker.pick` cancels any pending session, owns all temporary DOM/listener cleanup, and resolves only after teardown.
- The caller performs the Selection Action after awaiting `Picker.pick`; the Picker never executes commands.
- The basic Surface renders Candidate Names as text only. Later slices deepen matching, presentation, accessibility, and scale.
- Register disposable DOM and Obsidian listeners through `Component`/plugin cleanup facilities.
- Do not introduce a generic or public Source interface.

### Module shapes & seams

#### [NEW] Picker

```ts
type Candidate = Readonly<{
  key: string;
  name: string;
  fields: Readonly<Record<string, string>>;
}>;

type PickerRequest = Readonly<{
  sourceName: string;
  candidates: readonly Candidate[];
}>;

class PickerHost {
  pick(request: PickerRequest): Promise<string | null>;
  close(): void;
}
```

Dependencies:
- `Document`/`Window` from the active Obsidian window for the Surface
- `fzf` v2 for Candidate Name matching

Invariants:
- Candidate Name is non-empty and Candidate Key is unique within one opening.
- The request Candidate order is Source Order.
- At most one session exists globally for this plugin instance.
- Resolve only after the session DOM and listeners are gone.

Test strategy: exercise the Picker's session seam with Candidate fixtures for query, status, navigation, no matches, cancellation, replacement, and teardown-before-resolution. Use DOM assertions only where teardown is observable; do not assert private helper calls.

#### [NEW] Command adapter

```ts
type CommandRecord = Readonly<{
  id: string;
  name: string;
  hotkeys: string;
}>;

type CommandAdapter = Readonly<{
  snapshotAvailable(): readonly CommandRecord[];
  execute(id: string): boolean;
}>;

function createCommandAdapter(app: App): CommandAdapter | null;
```

Dependencies:
- Undocumented Obsidian command and hotkey registries

Invariants:
- Return `null` when required registry capabilities cannot be recognized safely.
- Do not leak undocumented registry objects beyond this module.
- Snapshotting never executes a command.

Test strategy: use fake registry shapes at this adapter seam to cover availability, ordering inputs, hotkey formatting, execution, and unsupported internals.

#### [NEW] Command Picker orchestration

```ts
function pickCommand(
  adapter: CommandAdapter,
  picker: PickerHost,
  notify: (message: string) => void,
): Promise<void>;
```

Dependencies:
- Command adapter: external-system adapter
- Picker: UI module
- Notice callback: side-effect adapter

Invariant: execute only a selected key and only after `PickerHost.pick` resolves.

Test strategy: fake the two seams and assert teardown is observable before adapter execution without mocking internal Picker collaborators.

#### [MODIFIED] Plugin lifecycle
Keep `src/main.ts` limited to lifecycle, adapter creation, and stable command registration. Remove `src/settings.ts` until real settings arrive rather than preserving sample configuration.

## Sequence
1. Replace sample identity and behavior; add the test script and `fzf` dependency.
2. Implement and behavior-test the isolated Command adapter.
3. Implement the basic Picker session and Surface through `PickerHost.pick`.
4. Wire `pick-command`, including unsupported and execution-failure Notices.
5. Run tests, build, lint, and manually select and cancel commands in desktop Obsidian.
