import { get, type Readable } from "svelte/store";

export function getStoreValue<T>(store: Readable<T>): T {
    return JSON.parse(JSON.stringify(get(store)))
}

export function getValue<T>(object: T): T {
    return JSON.parse(JSON.stringify(object))
}