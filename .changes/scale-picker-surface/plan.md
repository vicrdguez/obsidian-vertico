# Make the Picker accessible and scalable Plan

## Approach
Deepen `PickerHost` and its owned `Component` rather than creating a second UI abstraction. The Surface renders the existing Picker-session state, owns focus and pointer behavior, and virtualizes the ranked list with a fixed row height. Test observable DOM behavior through `PickerHost.pick`; keep only the geometry calculation as a small pure internal seam.

Use a maintained DOM test environment as a development dependency if the current harness cannot provide `Document`, events, focus, and ARIA attribute inspection. It must remain test-only and must not enter `main.js`.

## Implementation decisions
- Use native DOM under an Obsidian `Component`; do not use `Modal`, a framework, a workspace leaf, or a dock view.
- Obtain the active Obsidian `Window`/`Document` at each opening; do not cache a global document.
- Maintain one plugin-global Picker host. Replacing a session fully cancels it before mounting the next.
- Anchor the Surface to the active window's central workspace container by default. Fall back to the active document body only when the workspace container is unavailable, preserving bottom anchoring.
- Do not add a backdrop or consume workspace space.
- Keep focus in the query input while navigating. The listbox uses active-descendant focus rather than moving DOM focus into options.
- Option DOM IDs are unique per Picker opening and Candidate Key; Candidate Keys themselves need not be valid HTML IDs.
- Candidate Name is always the option's accessible label even when later templates omit `name` visually.
- The live region announces counts, not every active-row move. Status visually shows `<Source> <position>/<count>` and uses `<Source> 0/0` for no matches.
- Listen for outside pointer activation early enough to close before focus changes, but never call `preventDefault` or `stopPropagation`; do not restore prior focus for that cancellation path.
- Escape restores prior focus only if the element remains connected and focusable; otherwise leave focus at the active document's normal fallback.
- Use one fixed CSS row-height variable shared by rendering and virtual-range math. Runtime row measurement may calibrate it once per Surface; rows must never wrap.
- Retain the complete ranked array. Render a spacer with full scroll height and absolutely position only visible rows plus a small fixed overscan.
- Default maximum is 10 Candidate rows. Effective capacity is `min(match count, 10, viewport capacity)`; the no-match row occupies one row.
- Scroll only enough to reveal the Active Candidate. Ensure its option is rendered before updating `aria-activedescendant`.
- Resize and scroll listeners are disposable and recalculate range without rescoring Candidates.
- Theme styling uses Obsidian CSS variables; do not hard-code theme colors.
- Full-window span and user-configured maximum rows belong to the settings slice.

### Module shapes & seams

#### [MODIFIED] Picker host and Surface

```ts
class PickerHost {
  pick(request: PickerRequest): Promise<string | null>;
  close(): void;
}
```

Dependencies:
- Active Obsidian window/document: host UI
- Picker session: interaction state
- Obsidian `Component`: lifecycle cleanup

Invariants:
- Exactly one Surface exists while one request is pending.
- All temporary nodes and listeners are removed before `pick` resolves.
- Query input owns DOM focus throughout keyboard interaction.
- Active-descendant always points to a rendered option or is absent in the no-match state.

Test strategy: invoke `PickerHost.pick` in a DOM environment and drive real input, keyboard, pointer, and focus events. Assert DOM roles, attributes, status, rendered rows, resolution, and focus outcomes; do not mock internal event handlers.

#### [NEW] Virtual range calculation

```ts
type VisibleRange = Readonly<{ start: number; end: number }>;

function visibleRange(
  total: number,
  scrollTop: number,
  rowHeight: number,
  viewportHeight: number,
  overscan: number,
): VisibleRange;
```

Dependencies: none.

Invariants:
- Range is half-open and clamped to `[0, total]`.
- It includes every row intersecting the viewport plus bounded overscan.

Test strategy: use a short table of boundary values only. End-to-end virtualization remains tested through `PickerHost.pick`.

#### [MODIFIED] Styles
Define bottom anchoring, central-workspace width, fixed row height, no wrapping, ellipses, active background/accent border, Match Highlights, scroll spacer, and screen-reader-only live-region treatment with Obsidian theme variables.

Test strategy: DOM tests assert structural classes and inline geometry required by virtualization. Manually inspect computed layout and theme variables in Obsidian rather than snapshotting CSS text.

## Sequence
1. Establish DOM test support and active-window mounting through the existing host seam.
2. Add ARIA and live-status behaviors one red-green cycle at a time.
3. Add pointer selection and cancellation/focus paths.
4. Add virtual-range math, rendering, scrolling, resize handling, and capacity.
5. Add theme-aware CSS.
6. Run tests, build, and lint; manually smoke-test pop-out windows, outside-click propagation, keyboard focus, screen-reader announcements, large lists, and light/dark themes.
