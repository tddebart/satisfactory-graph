<script lang="ts">
	import { getItemImage, ItemImages } from "$lib/JsonLoader";
	import type { Component } from "$lib/types";
    import { Handle, Position, type Connection, useEdges } from "@xyflow/svelte";

    export let component: Component;

	export let type: 'source' | 'target';
    export let position: Position
    export let parentId: string;

    let connected;

    function isValidConnection(connection: Connection): boolean {
        return connection.sourceHandle === connection.targetHandle;
    }

    const edges = useEdges();

    for (const edge of $edges) {
        if (edge.source === parentId && edge.sourceHandle === component.item || edge.target === parentId && edge.targetHandle === component.item) {
            connected = true;
        }
    }

    function ondisconnect() {
        connected = false;
        // Check if we are still connected to an other edge
        for (const edge of $edges) {
            if (edge.source === parentId && edge.sourceHandle === component.item || edge.target === parentId && edge.targetHandle === component.item) {
                connected = true;
            }
        }
    }
</script>

<Handle
    id={component.item}
    {type}
    {position}
    {isValidConnection}
    onconnect={() => {connected = true}}
    {ondisconnect}
    class="{connected ? 'linked' : ''}"
>
    <img class="nodrag" src="icons/{ItemImages[component.item] ?? getItemImage(component.item, '256')}" alt={component.item}>
</Handle>

<style lang="scss">
    :global(.svelte-flow__handle) {
        width: 35px;
        height: 100%;
        display: flex;
        align-items: center;
        position: static;
        border-radius: 0;
        background-color: unset;
        border: unset;
        z-index: 2;
        transform: unset;

        &:not(.linked) {
            border: 1px solid black;
        }

        img {
            width: 100%;
            height: fit-content;
            pointer-events: none;
        }
    }


    :global(.inputs) :global(.svelte-flow__handle) {
        &:not(.linked) {
            background-color: #ff3737;
        }
    }
    :global(.outputs) :global(.svelte-flow__handle) {
        &:not(.linked) {
            background-color: #00ff00;
        }
    }


</style>