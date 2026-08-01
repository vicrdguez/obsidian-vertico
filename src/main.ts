import { Notice, Platform, Plugin } from 'obsidian';
import { createCommandAdapter } from './adapters/command-api';
import { pickCommand } from './commands/pick-command';
import { PickerHost } from './picker';

export default class VerticoPlugin extends Plugin {
	private picker: PickerHost | null = null;

	onload(): void {
		this.picker = new PickerHost(activeDocument, activeWindow);
		const adapter = createCommandAdapter(this.app, Platform.isMacOS);
		this.addCommand({
			id: 'pick-command',
			name: 'Pick command',
			callback: () => {
				if (this.picker) void pickCommand(adapter, this.picker, (message) => new Notice(message));
			},
		});
	}

	onunload(): void {
		this.picker?.close();
		this.picker = null;
	}
}
