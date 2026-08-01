export type Candidate = Readonly<{
	key: string;
	name: string;
	fields: Readonly<Record<string, string>>;
}>;

export type PickerRequest = Readonly<{
	sourceName: string;
	candidates: readonly Candidate[];
}>;

export interface PickerHost {
	pick(request: PickerRequest): Promise<string | null>;
	close(): void;
}
