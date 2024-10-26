// Load json's
import type {RecipeName, MachineName, ItemName, Recipe} from '$lib/types';

import DocsBuildings from '$lib/data/DocsBuildings.json';
import DocsItems from '$lib/data/DocsItems.json';
import DocsRecipesImport from '$lib/data/DocsRecipes.json'

const DocsRecipes = Object.fromEntries(Object.entries(DocsRecipesImport).map(([key, value]) => [key, value[0] as Recipe])) as { [key: RecipeName]: Recipe };
// Filter out buildgun recipes
for (const [key, value] of Object.entries(DocsRecipes)) {
    if (value.inBuildGun || value.inCustomizer) {
        delete DocsRecipes[key];
    }
}

export { DocsBuildings, DocsItems, DocsRecipes };

export const MachineImages: { [key: MachineName]: string } = {
    "Desc_AssemblerMk1_C": "IconDesc_AssemblerMk1_512.png",
    "Desc_ManufacturerMk1_C": "IconDesc_Manufacturer_512.png",
    "Desc_Converter_C": "IconDesc_Converter_512.png",
    "Desc_FoundryMk1_C": "IconDesc_Foundry_512.png",
}

export const ItemImages: { [key: ItemName]: string } = {
    "Desc_SteelPlateReinforced_C": "IconDesc_EncasedSteelBeam_256.png",
    "Desc_IronScrew_C": "IconDesc_IronScrews_256.png",
    "Desc_HighSpeedWire_C": "IconDesc_Quickwire_256.png",
    "Desc_CircuitBoardHighSpeed_C": "IconDesc_AILimiter_256.png",
    "Desc_Diamond_C": "IconDesc_Diamonds_256.png",
    "Desc_IronRod_C": "IconDesc_IronRods_256.png",
    "Desc_IronPlateReinforced_C": "IconDesc_ReinforcedIronPlates_256.png",
    "Desc_IronPlate_C": "IconDesc_IronPlates_256.png",
    "Desc_Water_C": "IconDesc_LiquidWater_Pipe_256.png",
    "Desc_Cable_C": "IconDesc_Cables_256.png",
    "BP_EquipmentDescriptorShockShank_C": "IconDesc_XenoZapper_256.png",
    "Desc_OreIron_C": "IconDesc_iron_new_256.png",
    "Desc_Coal_C": "IconDesc_CoalOre_256.png",
    "Desc_RocketFuel_C": "IconDesc_RocketFuelPipe_256.png",
    "Desc_GasTank_C": "IconDesc_PressureTank_256.png",
    "Desc_LiquidFuel_C": "IconDesc_LiquidFuel_Pipe_256.png",
    "Desc_LiquidTurboFuel_C": "IconDesc_LiquidTurboFuel_Pipe_256.png",
    "Desc_SAMIngot_C": "IconDesc_SameOre_256.png",
    "Desc_AluminumPlate_C": "IconDesc_AluminiumSheet_256.png",
}

export function getItemImage(item: string, type: string = '512'): string {
    item = item.replace(/_C$/, `_${type}.png`);
    item = "Icon" + item;

    return item;
}

export function getRealItemName(item: ItemName): string {
    return DocsItems[item][0].name;
}

export function getInternalItemName(item: ItemName): string {
    return Object.values(DocsItems).find((value) => value[0].name === item)[0].className;
}