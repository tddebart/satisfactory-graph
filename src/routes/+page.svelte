<script lang="ts">
    import '@xyflow/svelte/dist/style.css';

    import { browser } from '$app/environment';
    import '$lib/index';
    import '$lib/JsonLoader';
    import { SvelteFlow, SvelteFlowProvider, Background, Controls, MiniMap, useSvelteFlow } from '@xyflow/svelte';
    import type { Node, Edge, OnConnectEnd, Viewport } from '@xyflow/svelte';
    import { writable } from 'svelte/store';
    import CustomNode from '$lib/components/CustomNode.svelte';
    import createUndoable from '$lib/Undoable';
    import { getStoreValue } from '$lib/util';
    import RightClickMenu from '$lib/components/RightClickMenu.svelte';
    import { initialEdges, initialNodes } from '$lib/initialNodes';

    let onconnectend: OnConnectEnd;
    let onContextmenu: (event: MouseEvent) => void;
    let hideRightClickMenu: () => void;

    const localStorageKey = 'satisfactory-graph';

    const { toObject } = useSvelteFlow();

    const nodeTypes = {
        'custom': CustomNode,
    };

    const nodes = writable<Node[]>(initialNodes);
    const nodeUndoable = createUndoable(nodes);

    const edges = writable<Edge[]>(initialEdges);
    const edgeUndoable = createUndoable(edges);

    const viewport = writable<Viewport>({
        x: 0,
        y: 0,
        zoom: 1,
    });

    if (browser) {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if ((e.key === 'y' && e.ctrlKey) || (e.key === 'Z' && e.ctrlKey && e.shiftKey)) {
                redo();
            }
            if (e.key === 'z' && e.ctrlKey) {
                undo();
            }

            if (e.key === 'a' && e.ctrlKey) {
                $nodes.forEach((n) => (n.selected = true));
            }
        });

        if (localStorage.getItem(localStorageKey)) {
            const { nodes: localStorageNodes, edges: localStorageEdges, viewport: localStorageViewport } = JSON.parse(
                localStorage.getItem(localStorageKey),
            );

            console.log(localStorageViewport)
            nodes.set(localStorageNodes);
            edges.set(localStorageEdges);
            viewport.set(localStorageViewport);
        }
    }

    function oninit() {
        nodeUndoable.setInitial(getStoreValue(nodes));
        edgeUndoable.setInitial(getStoreValue(edges));
    }

    function saveHistory() {
        nodeUndoable.set(getStoreValue(nodes));
        edgeUndoable.set(getStoreValue(edges));
        save();
    }

    function undo() {
        nodeUndoable.undo();
        edgeUndoable.undo();
        save();

        // Sanity check
        if (nodeUndoable.historyIndex() != edgeUndoable.historyIndex()) {
            console.error(
                `Undo/redo history mismatch: ${nodeUndoable.historyIndex()} != ${edgeUndoable.historyIndex()}`,
            );
        }
    }

    function redo() {
        nodeUndoable.redo();
        edgeUndoable.redo();
        save();

        // Sanity check
        if (nodeUndoable.historyIndex() != edgeUndoable.historyIndex()) {
            console.error(
                `Undo/redo history mismatch: ${nodeUndoable.historyIndex()} != ${edgeUndoable.historyIndex()}`,
            );
        }
    }

    function updateGraph() {
        $nodes = $nodes;
        $edges = $edges;
        saveHistory();
    }

    function save() {
        console.log('saving')
        localStorage.setItem(localStorageKey, JSON.stringify(toObject()));
    }
</script>

<div
    style="width: 100vw; height: 100vh"
    on:contextmenu={onContextmenu}
    on:click={() => hideRightClickMenu()}
>
    <SvelteFlow
        {nodes}
        {edges}
        {viewport}
        {nodeTypes}
        colorMode="dark"
        fitView={$viewport.x === 0 && $viewport.y === 0}
        onlyRenderVisibleElements
        deleteKey="Delete"
        {onconnectend}
        {oninit}
        onconnect={saveHistory}
        ondelete={saveHistory}
        on:nodedragstop={saveHistory}
    >
        <Background />
        <Controls />
        <MiniMap />
    </SvelteFlow>
</div>
<RightClickMenu
    bind:onconnectend
    bind:onContextmenu
    bind:hide={hideRightClickMenu}
    {updateGraph}
/>
