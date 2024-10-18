<script lang="ts">
    import { DocsRecipes, getItemImage, MachineImages } from '$lib/JsonLoader';
    import type { MachineName, Recipe, RecipeName } from '$lib/types';
    import { Handle, Position, type NodeProps, useEdges } from '@xyflow/svelte';
    import CustomHandle from './CustomHandle.svelte';

    $$restProps;

    type DataType = {
        recipeName: RecipeName
    }

    type CustomNodeProps = NodeProps & { data: DataType };

    type $$Props = CustomNodeProps;

    const { id } = $$props;

    export let data: DataType;

    const { recipeName } = data;

    const recipe: Recipe = DocsRecipes[recipeName];
    if (recipe === undefined) {
        console.error(`Recipe not found "${recipeName}"`);
    }

    const machineName: MachineName = recipe.producedIn[0];
</script>

<div class="info">
    <img src="icons/{MachineImages[machineName] ?? getItemImage(machineName)}" alt="{machineName}">
    <span>?</span>
    <input class="nodrag" type="text">
</div>

<div class="inputs count-{recipe.ingredients.length}">
    {#each recipe.ingredients as ingredient}
        <CustomHandle component={ingredient} type="target" position={Position.Left} parentId={id} />
    {/each}
</div>

<div class="outputs count-{recipe.products.length}">
    {#each recipe.products as product}
        <CustomHandle component={product} type="source" position={Position.Right} parentId={id} />
    {/each}
</div>


<style lang="scss">
    :global(.svelte-flow__node-custom) {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        width: 200px;
        height: 170px;
        background-color: hsl(0, 0%, 30%);
        border-radius: 10px;
        border: 2px solid hsl(0, 0%, 50%);
        box-shadow: rgba(26, 26, 26, 0.42) 0.3px 0.5px 0.7px 0px, rgba(26, 26, 26, 0.1) 0.8px 1.6px 2px -0.8px, rgba(26, 26, 26, 0.1) 2.1px 4.1px 5.2px -1.7px, rgba(26, 26, 26, 0.1) 5px 10px 12.6px -2.5px;
    }

    :global(.svelte-flow__node-custom.selected) {
        border-color: hsl(0, 0%, 80%);
    }

    .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: black;
        font-size: 18px;
        font-weight: bold;
        font-family: monospace;

        img {
            width: 70px;
        }

        input {
            width: 70%;
            margin-left: 20px;
        }
    }

    .inputs, .outputs {
        display: flex;
        flex-direction: column;
        gap: 2px;
        height: 100%;
        position: absolute;
        top: 0;
        padding: 4px;

        &.count-1 {
            height: 60%;
        }

        &.count-2 {
            height: 70%;
        }
    }

    .inputs {
        left: 0;
    }

    .outputs {
        right: 0;
    }
</style>