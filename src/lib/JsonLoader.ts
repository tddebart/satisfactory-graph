// Load json's
import type {RecipeName, MachineName, ItemName, Recipe} from '$lib/types';

import DocsBuildings from '$lib/data/DocsBuildings.json';
import DocsItems from '$lib/data/DocsItems.json';
import DocsRecipesImport from '$lib/data/DocsRecipes.json'

const DocsRecipes = Object.fromEntries(Object.entries(DocsRecipesImport).map(([key, value]) => [key, value[0] as Recipe])) as { [key: RecipeName]: Recipe };
// Filter out buildgun recipes
for (const [key, value] of Object.entries(DocsRecipes)) {
    if (value.inBuildGun) {
        delete DocsRecipes[key];
    }
}

console.log(DocsRecipes);

export { DocsBuildings, DocsItems, DocsRecipes };

export const MachineImages: { [key: MachineName]: string } = {
    "Desc_AssemblerMk1_C": "IconDesc_AssemblerMk1_512.png",
    "Desc_ManufacturerMk1_C": "IconDesc_Manufacturer_512.png",
    "Desc_Converter_C": "IconDesc_Converter_512.png",
}

export const ItemImages: { [key: ItemName]: string } = {
    "Desc_SteelPlateReinforced_C": "IconDesc_EncasedSteelBeam_256.png",
    "Desc_IronScrew_C": "IconDesc_IronScrews_256.png",
    "Desc_HighSpeedWire_C": "IconDesc_Quickwire_256.png",
    "Desc_CircuitBoardHighSpeed_C": "IconDesc_AILimiter_256.png",
}

export function getItemImage(item: string, type: string = '512'): string {
    item = item.replace(/_C$/, `_${type}.png`);
    item = "Icon" + item;

    return item;
}