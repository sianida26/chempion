import { AnimatedGIF } from "@pixi/gif";
import { ResolverManifest, Texture } from "pixi.js";

export type GameAsset<T extends string | Texture> = {
	fonts: {
		VT323: T,
	},
	backgrounds: {
		varma: T,
		theSnail: T,
	},
	sprites: {
		bag: T,
		bagHighlight: T,
		commentBar: T extends Texture ? AnimatedGIF : T,
		cursor: T,
        inventoryBox: T,
		itemObtain: T extends Texture ? AnimatedGIF : T,
		knightIdle: T extends Texture ? AnimatedGIF : T,
		obtainLoot: T,
		snailHighlight: T,
		snail: T,
		wrongInterract: T,
	},
	items: {
		grass: T,
		hay: T,
		loot: T,
		rope: T,
		salt: T,
	}
};

export const bundle: GameAsset<string> = {
	fonts: {
		VT323: "./fonts/VT323-Regular.ttf",
	},
	backgrounds: {
		varma: "./assets/map/varma.png",
		theSnail: "./assets/map/the_snail.png",
	},
	items: {
		grass: "./assets/sprite/items/item_grass.png",
		hay: "./assets/sprite/items/item_hay.png",
		loot: "./assets/sprite/items/item_loot.png",
		rope: "./assets/sprite/items/item_rope.png",
		salt: "./assets/sprite/items/item_salt.png",
	},
	sprites: {
		bag: "./assets/sprite/bag.png",
		bagHighlight: "./assets/sprite/bag_highlight.png",
		commentBar: "./assets/sprite/comment_bar.gif",
		cursor: "./assets/sprite/cursor.png",
        inventoryBox: "./assets/sprite/inventory_box.png",
		itemObtain: "./assets/sprite/item_obtain.gif",
		knightIdle: "./assets/sprite/knight_idle.gif",
		obtainLoot: "./assets/sprite/obtain_loot.png",
		snailHighlight: "./assets/sprite/snail_highlight.png",
		snail: "./assets/sprite/snail.png",
		wrongInterract: "./assets/sprite/wrong_interract.png",
	},
};

const manifestBundles = Object.entries(bundle).map(([key, value]) => ({
	name: key,
	assets: Object.entries(value).map(([assetName, url]) => ({
        name: assetName,
        srcs: new URL(url, import.meta.url).href
    }))
}));

const manifest: ResolverManifest = {
	bundles: manifestBundles,
};

export default manifest;
