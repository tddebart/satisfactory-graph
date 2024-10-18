import { get, writable, type Readable, type Writable } from 'svelte/store';
import { getStoreValue, getValue } from './util';

export default function createUndoable<T>(store: Writable<T>): Undoable<T> {
	const history: T[] = [];
	const historyStore: Writable<T[]> = writable(history);
	let historyIndex: number = 0;

	const updateStore = (): void => store.set(getValue(history[historyIndex]));

	return {
		subscribe: store.subscribe,
		history: historyStore,
		historyIndex: () => historyIndex,
		set: (newValue: T): void => {
			newValue = getValue(newValue);
			historyIndex++;
			history[historyIndex] = newValue;
			historyStore.set(history);
			while (historyIndex < history.length - 1) {
				history.pop();
			}
			// updateStore();
		},
		setInitial: (newValue: T): void => {
			history[0] = newValue;
			historyStore.set(history);
		},
		undo: (): void => {
			console.log(historyIndex)
			if (historyIndex > 0) {
				historyIndex--;
				updateStore();
			}
		},
		redo: (): void => {
			console.log(historyIndex)
			if (historyIndex < history.length - 1) {
				historyIndex++;
				updateStore();
			}
		},
	};
}

interface Undoable<T> {
	subscribe: Readable<T>['subscribe'];
	history: Writable<T[]>;
	historyIndex: () => number;
	set: (newValue: T) => void;
	setInitial: (newValue: T) => void;
	undo: () => void;
	redo: () => void;
}