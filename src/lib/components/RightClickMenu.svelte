<script lang="ts">
    import { DocsRecipes, getInternalItemName, getItemImage, getRealItemName, ItemImages } from "$lib/JsonLoader";
    import type { Recipe, RecipeName } from "$lib/types";
    import type { OnConnectEnd, XYPosition, Node, HandleProps } from "@xyflow/svelte";
    import { useNodes, useEdges, useSvelteFlow, useUpdateNodeInternals } from '@xyflow/svelte';

    const recipes = DocsRecipes;

    const nodes = useNodes();
    const edges = useEdges();
    const { screenToFlowPosition } = useSvelteFlow();

    let filteredRecipes = Object.values(recipes);

    export let updateGraph: () => void;

    let hidden = true;

    let xPos = 0;
    let yPos = 0;

    let menuElement: HTMLDivElement;

    let filterByInputs = true;
    let filterByName = true;
    let filterByOutputs = true;
    let searchString: string = '';
    let inputElement: HTMLInputElement;

    let newNodePosition: XYPosition;
    let newNodeSourceId: string
    let newNodeSourceHandleId: string
    let newNodeDirection: HandleProps['type'];

    const iconWidth = 35;

    let inputsMinWidth = 0;
    let outputsMinWidth = 0;

    function filterRecipes() {
        const value = searchString.trim();
        filteredRecipes = Object.values(recipes).filter(recipe => {
            // Glob search
            for (const word of value.split('-')) {
                // Outputs
                if (filterByOutputs && recipe.products.some(component => getRealItemName(component.item).toLowerCase().includes(word.toLowerCase()))) {
                    return true;
                }
                if (filterByName && recipe.name.toLowerCase().includes(word.toLowerCase())) {
                    return true;
                }
                // Inputs
                if (filterByInputs && recipe.ingredients.some(component => getRealItemName(component.item).toLowerCase().includes(word.toLowerCase()))) {
                    return true;
                }
            }

            return false;
        });

        // filteredRecipes = filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));

        // Calculate min widths
        inputsMinWidth = Math.max(...filteredRecipes.map(recipe => recipe.ingredients.length)) * iconWidth;
        outputsMinWidth = Math.max(...filteredRecipes.map(recipe => recipe.products.length)) * iconWidth;
    }

    function createNewNode(recipe: Recipe) {
        const id = `${recipe.className}_${Math.random().toString(36).substring(2, 12)}`;

        const newNode: Node = {
            id: id,
            type: 'custom',
            position: newNodePosition,
            data: { recipeName: recipe.className },
            origin: [0.5, 0.5],
        };

        $nodes.push(newNode);

        if (newNodeSourceId !== null) {
            const source = newNodeDirection === 'source' ? newNodeSourceId : id;
            const target = newNodeDirection === 'source' ? id : newNodeSourceId;

            const newEdge = {
                id: `${newNodeSourceId}${newNodeSourceHandleId}-${id}${newNodeSourceHandleId}-`,
                source: source,
                target: target,
                sourceHandle: newNodeSourceHandleId,
                targetHandle: newNodeSourceHandleId,
            }

            edges.update(edges => [...edges, newEdge]);
        }

        updateGraph();
        hidden = true;
    }

    export const onconnectend: OnConnectEnd = (event: MouseEvent, connectionState) => {
        if (connectionState.isValid) {
            return
        };

        const sourceNodeId = connectionState.fromNode?.id ?? '1';

        const {clientX, clientY} = event;

        searchString = getRealItemName(connectionState.fromHandle.id);

        filterByInputs = connectionState.fromHandle.type === 'source';
        filterByOutputs = connectionState.fromHandle.type === 'target';
        filterByName = false;

        filterRecipes();

        newNodePosition = screenToFlowPosition({ x: clientX, y: clientY });
        newNodeSourceId = sourceNodeId;
        newNodeSourceHandleId = connectionState.fromHandle.id;
        newNodeDirection = connectionState.fromHandle.type;

        setTimeout(() => {
            setPosition(clientX, clientY);
            hidden = false;
        }, 10);
    }

    export const onContextmenu = (event: MouseEvent) => {
        event.preventDefault();


        searchString = '';

        filterByInputs = true;
        filterByName = true;
        filterByOutputs = true;

        newNodePosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        newNodeSourceId = null;
        newNodeSourceHandleId = null;
        newNodeDirection = null;

        filterRecipes();

        setTimeout(() => {
            setPosition(event.clientX, event.clientY);
            hidden = false;
        })
    }

    export const hide = () => {
        hidden = true;
        xPos = 0;
        yPos = 0;
    }

    function setPosition(xPosTarget: number, yPosTarget: number) {
        const menuWidth = menuElement.offsetWidth;
        const menuHeight = menuElement.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        xPos = xPosTarget;
        yPos = yPosTarget;

        if ((xPos + menuWidth) > windowWidth) {
            xPos = xPos - menuWidth;
        }

        if ((yPos + menuHeight) > windowHeight) {
            yPos -= (yPos + menuHeight) - windowHeight;
        }
    }

    filterRecipes();
</script>

<div class="right-click-menu" style="top: {yPos}px; left: {xPos}px; visibility: {hidden ? 'hidden' : 'unset'}" bind:this={menuElement}>
    <span style="user-select: none;">Filter by</span>
    <div class="buttons">
        <input type="checkbox" id="inputs-toggle" bind:checked={filterByInputs} on:change={filterRecipes}/>
        <label for="inputs-toggle">Inputs</label>

        <input type="checkbox" id="name-toggle" bind:checked={filterByName} on:change={filterRecipes}/>
        <label for="name-toggle">Name</label>

        <input type="checkbox" id="outputs-toggle" bind:checked={filterByOutputs} on:change={filterRecipes}/>
        <label for="outputs-toggle">Outputs</label>
    </div>
    <input type="text" placeholder="Search" bind:value={searchString} on:input={filterRecipes} bind:this={inputElement}/>
    <div class="recipes">
        {#each filteredRecipes.slice(0, 15) as recipe}
            <div class="recipe" on:click={() => createNewNode(recipe)}>
                <div class="inputs" style="min-width: {inputsMinWidth}px;">
                    {#each recipe.ingredients as component}
                        <img src="icons/{ItemImages[component.item] ?? getItemImage(component.item, '256')}" alt="{getRealItemName(component.item)}" title={component.item} loading="lazy">
                    {/each}
                </div>
                <span>{recipe.name}</span>
                <div class="outputs" style="min-width: {outputsMinWidth}px;">
                    {#each recipe.products as component}
                        <img src="icons/{ItemImages[component.item] ?? getItemImage(component.item, '256')}" alt="{getRealItemName(component.item)}" title={component.item} loading="lazy">
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .right-click-menu {
        position: absolute;
        top: 0;
        left: 0;
        background-color: grey;
        border: 1px solid black;
        border-radius: 5px;
        padding: 10px;
        z-index: 999;
        max-height: 90vh;
    }

    .recipes {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 5px;
        overflow-y: scroll;
        max-height: 70vh;
    }

    .recipe {
        display: flex;
        flex-direction: row;
        gap: 5px;
        cursor: pointer;

        &:hover {
            background-color: hsl(0, 0%, 80%);
        }

        .inputs, .outputs {
            display: flex;
            flex-direction: row;
            gap: 5px;
            height: 35px;
            width: fit-content;
        }

        img {
            width: 35px;
            height: 35px;
            color: #ff0000;
            overflow: hidden;
        }

        span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0 10px;
        }
    }

    .buttons {
        user-select: none;
    }
</style>

