import type { Edge, Node } from "@xyflow/svelte";

export const initialNodes: Node[] = [
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
];

export const initialEdges: Edge[] = [
    {
        id: '1Desc_CopperSheet_C-2Desc_CopperSheet_C',
        source: '1',
        target: '2',
        sourceHandle: 'Desc_CopperSheet_C',
        targetHandle: 'Desc_CopperSheet_C',
    },
];