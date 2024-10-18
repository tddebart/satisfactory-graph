export type Point = {
    x: number;
    y: number;
}

export interface Drawable {
    position: Point;

    Draw (ctx: CanvasRenderingContext2D, scale: number, offset: Point): void
}

export type RecipeName = string;
export type MachineName = string;
export type ItemName = string;

export type Component = {
    item: ItemName;
    amount: number;
}

export type Recipe = {
    className: string;
    name: string;
    unlockedBy: string;
    duration: number;
    ingredients: Component[];
    products: Component[];
    producedIn: MachineName[];
    inCraftBench: boolean;
    inWorkshop: boolean;
    inBuildGun: boolean;
    inCustomizer: boolean;
    manualCraftingMultiplier: number;
    alternate: boolean;
    minPower: number | null;
    maxPower: number | null;
    seasons: string[];
    stable: boolean;
    experimental: boolean;
}
