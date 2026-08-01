import type { CommandAdapter } from '../adapters/command-api';
import type { PickerHost } from '../picker';

const unavailable = 'Vertico could not access Obsidian commands. The Command Source is unavailable.';

export async function pickCommand(
	adapter: CommandAdapter | null,
	picker: Pick<PickerHost, 'pick'>,
	notify: (message: string) => void,
): Promise<void> {
	if (!adapter) {
		notify(unavailable);
		return;
	}

	let commands;
	try {
		commands = adapter.snapshotAvailable();
	} catch {
		notify(unavailable);
		return;
	}
	const selected = await picker.pick({
		sourceName: 'Commands',
		candidates: commands.map((command) => ({
			key: command.id,
			name: command.name,
			fields: { id: command.id, hotkeys: command.hotkeys },
		})),
	});
	if (selected === null) return;

	try {
		if (!adapter.execute(selected)) notify(`Could not execute command “${selected}”.`);
	} catch {
		notify(`Could not execute command “${selected}”.`);
	}
}
