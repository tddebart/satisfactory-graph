<script lang="ts">
    import { browser } from '$app/environment';
    import '$lib/index';
    import '$lib/JsonLoader';
    import { SvelteFlow, SvelteFlowProvider, Background, Controls, MiniMap, ConnectionMode } from '@xyflow/svelte';
    import type { Node, Edge, Connection } from '@xyflow/svelte';
    import { writable } from 'svelte/store';
    import CustomNode from '$lib/components/CustomNode.svelte';
    import createUndoable from '$lib/Undoable';
    import { getStoreValue } from '$lib/util';

    const nodeTypes = {
        'custom': CustomNode
    };

    const nodes = writable<Node[]>([
        {
            id: '1',
            type: 'custom',
            position: { x: 0, y: 0 },
            data: { recipeName: 'Recipe_CopperSheet_C' },
        },
        {
            id: '2',
            position: { x: 300, y: 100 },
            type: 'custom',
            data: { recipeName: 'Recipe_AILimiter_C' },
        },
        {
            id: '3',
            position: { x: 600, y: -100 },
            type: 'custom',
            data: { recipeName: 'Recipe_CircuitBoard_C' },
        },
        {
            id: '4',
            position: { x: 900, y: -100 },
            type: 'custom',
            data: { recipeName: 'Recipe_ModularFrameHeavy_C' },
        },
    ]);
    const nodeUndoable = createUndoable(nodes);

    const edges = writable<Edge[]>([{ id: '1Desc_CopperSheet_C-2Desc_CopperSheet_C', source: '1', target: '2', sourceHandle: 'Desc_CopperSheet_C', targetHandle: 'Desc_CopperSheet_C' }]);
    const edgeUndoable = createUndoable(edges);

    if (browser) {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if ((e.key === 'y' && e.ctrlKey) || (e.key === 'Z' && e.ctrlKey && e.shiftKey)) {
                redo();
            }
            if (e.key === 'z' && e.ctrlKey) {
                undo();
            }
        })
    }

    function oninit() {
        nodeUndoable.setInitial(getStoreValue(nodes));
        edgeUndoable.setInitial(getStoreValue(edges));
    }

    function saveHistory() {
        nodeUndoable.set(getStoreValue(nodes));
        edgeUndoable.set(getStoreValue(edges));
    }

    function undo() {
        nodeUndoable.undo();
        edgeUndoable.undo();

        // Sanity check
        if (nodeUndoable.historyIndex() != edgeUndoable.historyIndex()) {
            console.error(`Undo/redo history mismatch: ${nodeUndoable.historyIndex()} != ${edgeUndoable.historyIndex()}`);
        }
    }

    function redo() {
        nodeUndoable.redo();
        edgeUndoable.redo();

        // Sanity check
        if (nodeUndoable.historyIndex() != edgeUndoable.historyIndex()) {
            console.error(`Undo/redo history mismatch: ${nodeUndoable.historyIndex()} != ${edgeUndoable.historyIndex()}`);
        }
    }
</script>

<SvelteFlowProvider>
    <SvelteFlow
        {nodes}
        {edges}
        {nodeTypes}
        colorMode="dark"
        fitView
        onlyRenderVisibleElements
        deleteKey="Delete"
        {oninit}
        onconnect={saveHistory}
        ondelete={saveHistory}
        on:nodedragstop={saveHistory}

    >
        <Background />
        <Controls />
        <MiniMap />
    </SvelteFlow>
</SvelteFlowProvider>
