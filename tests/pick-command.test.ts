import assert from 'node:assert/strict';
import test from 'node:test';
import { createCommandAdapter, type CommandAdapter } from '../src/adapters/command-api';
import { pickCommand } from '../src/commands/pick-command';
import type { PickerRequest } from '../src/picker';

function adapter(names: () => string[], execute = (_id: string) => true): CommandAdapter {
	return {
		snapshotAvailable: () => names().map((name) => ({ id: name, name, hotkeys: '' })),
		execute,
	};
}

test('each command Picker opening rebuilds its Candidate snapshot', async () => {
	let names = ['Always'];
	const requests: PickerRequest[] = [];
	const picker = { pick: async (request: PickerRequest) => (requests.push(request), null) };
	const source = adapter(() => names);

	await pickCommand(source, picker, () => {});
	names = ['Always', 'Now available'];
	await pickCommand(source, picker, () => {});

	assert.deepEqual(requests.map((request) => request.candidates.map((candidate) => candidate.name)), [
		['Always'],
		['Always', 'Now available'],
	]);
});

test('unsupported Command Source reports a Notice without opening a Picker', async () => {
	const notices: string[] = [];
	let opened = false;
	await pickCommand(null, { pick: async () => (opened = true, null) }, (message) => notices.push(message));
	assert.equal(opened, false);
	assert.deepEqual(notices, ['Vertico could not access Obsidian commands. The Command Source is unavailable.']);
});

test('incompatible command registry reports the Source unavailable without opening a Picker', async () => {
	const source = createCommandAdapter({
		commands: { commands: { broken: { id: 'broken' } }, executeCommandById: () => true },
		hotkeyManager: { getHotkeys: () => [] },
	}, false);
	const notices: string[] = [];
	let opened = false;

	await pickCommand(source, { pick: async () => (opened = true, null) }, (message) => notices.push(message));

	assert.equal(opened, false);
	assert.deepEqual(notices, ['Vertico could not access Obsidian commands. The Command Source is unavailable.']);
});

test('selected command executes only after the Picker resolves following teardown', async () => {
	let open = true;
	const events: string[] = [];
	const picker = { pick: async () => (open = false, events.push('resolved'), 'Open') };
	await pickCommand(adapter(() => ['Open'], (id) => (assert.equal(open, false), events.push(`executed:${id}`), true)), picker, () => {});
	assert.deepEqual(events, ['resolved', 'executed:Open']);
});

test('command execution failure reports a Notice without reopening the Picker', async () => {
	const notices: string[] = [];
	let openings = 0;
	const picker = { pick: async () => (openings++, 'Broken') };
	await pickCommand(adapter(() => ['Broken'], () => false), picker, (message) => notices.push(message));
	assert.equal(openings, 1);
	assert.deepEqual(notices, ['Could not execute command “Broken”.']);
});
