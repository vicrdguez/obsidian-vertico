# Vertico

Vertico adds a bottom-anchored, keyboard-driven Picker to Obsidian.

Use **Pick command** to search currently available commands. Type to narrow the list, use **Up** and **Down** to navigate, **Enter** to run a command, or **Escape** to cancel.

Vertico is desktop-only and uses Obsidian's undocumented command registry. If that registry changes, the command Source disables itself and shows a Notice rather than failing silently.

## Development

```sh
npm install
npm test
npm run build
npm run lint
```
