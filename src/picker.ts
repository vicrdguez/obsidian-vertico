import { Fzf } from 'fzf';
import type { Component } from 'obsidian';

export type Candidate = Readonly<{
	key: string;
	name: string;
	fields: Readonly<Record<string, string>>;
}>;

export type PickerRequest = Readonly<{
	sourceName: string;
	candidates: readonly Candidate[];
}>;

type Session = { finish(value: string | null): void };

export class PickerHost {
	private session: Session | null = null;

	constructor(
		private readonly document: Document,
		private readonly window: Window,
		private readonly createComponent: () => Component,
	) {}

	pick(request: PickerRequest): Promise<string | null> {
		this.close();
		return new Promise((resolve) => {
			const component = this.createComponent();
			component.load();
			const surface = this.document.createElement('div');
			surface.className = 'vertico-picker';
			const input = this.document.createElement('input');
			input.type = 'text';
			input.className = 'vertico-query';
			input.ariaLabel = `${request.sourceName} query`;
			const list = this.document.createElement('div');
			list.className = 'vertico-candidates';
			const status = this.document.createElement('div');
			status.className = 'vertico-status';
			surface.append(input, list, status);
			this.document.body.append(surface);

			const finder = new Fzf(request.candidates, {
				selector: (candidate) => candidate.name,
				fuzzy: 'v2',
				casing: 'case-insensitive',
				normalize: false,
			});
			let matches = [...request.candidates];
			let active = 0;

			const render = () => {
				list.replaceChildren();
				if (matches.length === 0) {
					const empty = this.document.createElement('div');
					empty.className = 'vertico-no-matches';
					empty.textContent = 'No matches';
					list.append(empty);
					status.textContent = `${request.sourceName} 0/0`;
					return;
				}
				for (const [index, candidate] of matches.entries()) {
					const row = this.document.createElement('div');
					row.className = index === active ? 'vertico-candidate vertico-candidate-active' : 'vertico-candidate';
					row.textContent = candidate.name;
					list.append(row);
				}
				status.textContent = `${request.sourceName} ${active + 1}/${matches.length}`;
			};

			const onInput = () => {
				matches = input.value === '' ? [...request.candidates] : finder.find(input.value).map((result) => result.item);
				active = 0;
				render();
			};
			const onKeydown = (event: KeyboardEvent) => {
				if (!['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(event.key)) return;
				event.preventDefault();
				const selected = matches[active];
				if (event.key === 'Escape') this.session?.finish(null);
				else if (event.key === 'Enter' && selected) this.session?.finish(selected.key);
				else if (event.key === 'ArrowUp') { active = Math.max(0, active - 1); render(); }
				else if (event.key === 'ArrowDown' && matches.length > 0) { active = Math.min(matches.length - 1, active + 1); render(); }
			};
			const finish = (value: string | null) => {
				component.unload();
				surface.remove();
				this.session = null;
				resolve(value);
			};

			this.session = { finish };
			component.registerDomEvent(input, 'input', onInput);
			component.registerDomEvent(this.window, 'keydown', onKeydown);
			render();
			input.focus();
		});
	}

	close(): void {
		this.session?.finish(null);
	}
}
