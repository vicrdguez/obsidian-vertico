import assert from 'node:assert/strict';
import test from 'node:test';
import { createCommandAdapter } from '../src/adapters/command-api';

const command = (id: string, name: string, available?: boolean) => ({
	id,
	name,
	...(available === undefined ? {} : { checkCallback: (checking: boolean) => checking && available }),
});

test('snapshot includes only Available Commands in deterministic Source Order', () => {
	const executed: string[] = [];
	const app = {
		commands: {
			commands: {
				z: command('z', 'Open 10'),
				b: command('b', 'open 2', true),
				a: command('a', 'open 2', true),
				hidden: command('hidden', 'Hidden', false),
			},
			executeCommandById: (id: string) => (executed.push(id), true),
		},
		hotkeyManager: {
			getHotkeys: (id: string) => id === 'a' ? [{ modifiers: ['Mod', 'Shift'], key: 'p' }] : [],
		},
	};

	const adapter = createCommandAdapter(app, true);
	assert.ok(adapter);
	assert.deepEqual(adapter.snapshotAvailable(), [
		{ id: 'a', name: 'open 2', hotkeys: 'Cmd+Shift+P' },
		{ id: 'b', name: 'open 2', hotkeys: '' },
		{ id: 'z', name: 'Open 10', hotkeys: '' },
	]);
	assert.equal(adapter.execute('a'), true);
	assert.deepEqual(executed, ['a']);
});

test('unsupported command internals return no adapter', () => {
	assert.equal(createCommandAdapter({}, false), null);
});
