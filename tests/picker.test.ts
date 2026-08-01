import assert from 'node:assert/strict';
import test from 'node:test';
import { PickerHost, type Candidate } from '../src/picker';

class FakeTarget {
	listeners = new Map<string, Set<(event: any) => void>>();
	addEventListener(type: string, listener: (event: any) => void) {
		const listeners = this.listeners.get(type) ?? new Set();
		listeners.add(listener);
		this.listeners.set(type, listeners);
	}
	removeEventListener(type: string, listener: (event: any) => void) { this.listeners.get(type)?.delete(listener); }
	dispatch(type: string, event: any = {}) { for (const listener of this.listeners.get(type) ?? []) listener(event); }
}

class FakeElement extends FakeTarget {
	children: FakeElement[] = [];
	parentElement: FakeElement | null = null;
	className = '';
	textContent = '';
	value = '';
	type = '';
	constructor(readonly tagName: string) { super(); }
	append(...elements: FakeElement[]) { for (const element of elements) { element.parentElement = this; this.children.push(element); } }
	replaceChildren(...elements: FakeElement[]) { for (const child of this.children) child.parentElement = null; this.children = []; this.append(...elements); }
	remove() {
		if (!this.parentElement) return;
		this.parentElement.children = this.parentElement.children.filter((child) => child !== this);
		this.parentElement = null;
	}
	focus() {}
	querySelector(selector: string): FakeElement | null {
		return this.querySelectorAll(selector)[0] ?? null;
	}
	querySelectorAll(selector: string): FakeElement[] {
		const matches: FakeElement[] = [];
		const className = selector.startsWith('.') ? selector.slice(1) : null;
		for (const child of this.children) {
			if ((className && child.className.split(' ').includes(className)) || (!className && child.tagName === selector.toUpperCase())) matches.push(child);
			matches.push(...child.querySelectorAll(selector));
		}
		return matches;
	}
}

class FakeDocument {
	body = new FakeElement('BODY');
	createElement(tag: string) { return new FakeElement(tag.toUpperCase()); }
	querySelector(selector: string) { return this.body.querySelector(selector); }
	querySelectorAll(selector: string) { return this.body.querySelectorAll(selector); }
}

class FakeWindow extends FakeTarget {}

const candidate = (key: string, name = key): Candidate => ({ key, name, fields: {} });
const setup = () => {
	const document = new FakeDocument();
	const window = new FakeWindow();
	return { document, window, picker: new PickerHost(document as unknown as Document, window as unknown as Window) };
};
const key = (window: FakeWindow, value: string) => window.dispatch('keydown', { key: value, preventDefault() {} });

test('ordered-subsequence query ranks an Active Candidate and updates Picker Status', () => {
	const { document, picker } = setup();
	void picker.pick({ sourceName: 'Commands', candidates: [candidate('other', 'Other'), candidate('daily', 'Open daily note')] });
	const input = document.querySelector('input');
	assert.ok(input);
	input.value = 'odn';
	input.dispatch('input');
	assert.equal(document.querySelector('.vertico-candidate-active')?.textContent, 'Open daily note');
	assert.equal(document.querySelector('.vertico-status')?.textContent, 'Commands 1/1');
	picker.close();
});

test('no-match query shows No matches, zero status, and Enter selects nothing', async () => {
	const { document, window, picker } = setup();
	const selection = picker.pick({ sourceName: 'Commands', candidates: [candidate('daily', 'Open daily note')] });
	const input = document.querySelector('input');
	assert.ok(input);
	input.value = 'zzz';
	input.dispatch('input');
	key(window, 'Enter');
	assert.equal(document.querySelector('.vertico-no-matches')?.textContent, 'No matches');
	assert.equal(document.querySelector('.vertico-status')?.textContent, 'Commands 0/0');
	assert.ok(document.querySelector('.vertico-picker'));
	key(window, 'Escape');
	assert.equal(await selection, null);
});

test('Up and Down keep the Active Candidate within matching bounds', () => {
	const { document, window, picker } = setup();
	void picker.pick({ sourceName: 'Commands', candidates: ['A', 'B', 'C'].map((name) => candidate(name)) });
	key(window, 'ArrowUp');
	assert.equal(document.querySelector('.vertico-candidate-active')?.textContent, 'A');
	key(window, 'ArrowDown'); key(window, 'ArrowDown'); key(window, 'ArrowDown');
	assert.equal(document.querySelector('.vertico-candidate-active')?.textContent, 'C');
	assert.equal(document.querySelector('.vertico-status')?.textContent, 'Commands 3/3');
	picker.close();
});

test('Enter and Escape resolve only after Surface and listeners are removed', async () => {
	for (const pressed of ['Enter', 'Escape']) {
		const { document, window, picker } = setup();
		const selection = picker.pick({ sourceName: 'Commands', candidates: [candidate('A')] });
		key(window, pressed);
		assert.equal(await selection, pressed === 'Enter' ? 'A' : null);
		assert.equal(document.querySelector('.vertico-picker'), null);
		assert.equal(window.listeners.get('keydown')?.size ?? 0, 0);
	}
});

test('opening another Picker cancels and removes the existing Surface first', async () => {
	const { document, picker } = setup();
	const first = picker.pick({ sourceName: 'Commands', candidates: [candidate('A')] });
	const second = picker.pick({ sourceName: 'Commands', candidates: [candidate('B')] });
	assert.equal(await first, null);
	assert.equal(document.querySelectorAll('.vertico-picker').length, 1);
	picker.close();
	assert.equal(await second, null);
});
