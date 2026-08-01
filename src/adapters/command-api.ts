export type CommandRecord = Readonly<{
	id: string;
	name: string;
	hotkeys: string;
}>;

export type CommandAdapter = Readonly<{
	snapshotAvailable(): readonly CommandRecord[];
	execute(id: string): boolean;
}>;

type InternalCommand = {
	id: string;
	name: string;
	checkCallback?: (checking: boolean) => boolean;
};

type Hotkey = { modifiers: string[]; key: string };

type InternalApp = {
	commands?: {
		commands?: Record<string, InternalCommand>;
		executeCommandById?: (id: string) => boolean;
	};
	hotkeyManager?: { getHotkeys?: (id: string) => Hotkey[] };
};

const natural = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function createCommandAdapter(app: unknown, isMac: boolean): CommandAdapter | null {
	const internal = app as InternalApp;
	const commands = internal.commands?.commands;
	const execute = internal.commands?.executeCommandById;
	const getHotkeys = internal.hotkeyManager?.getHotkeys;
	if (!commands || typeof execute !== 'function' || typeof getHotkeys !== 'function') return null;

	return {
		snapshotAvailable: () => Object.values(commands)
			.filter((command) => command.name.length > 0 && (!command.checkCallback || command.checkCallback(true)))
			.map((command) => ({
				id: command.id,
				name: command.name,
				hotkeys: getHotkeys(command.id).map((hotkey) => formatHotkey(hotkey, isMac)).join(', '),
			}))
			.sort(compareCommands),
		execute: (id) => execute(id),
	};
}

function compareCommands(left: CommandRecord, right: CommandRecord): number {
	return natural.compare(left.name, right.name)
		|| left.name.localeCompare(right.name)
		|| natural.compare(left.id, right.id)
		|| left.id.localeCompare(right.id);
}

function formatHotkey(hotkey: Hotkey, isMac: boolean): string {
	const modifiers = hotkey.modifiers.map((modifier) => modifier === 'Mod' ? (isMac ? 'Cmd' : 'Ctrl') : modifier);
	return [...modifiers, hotkey.key.length === 1 ? hotkey.key.toUpperCase() : hotkey.key].join('+');
}
