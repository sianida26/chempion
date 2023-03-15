import { AnimatedGIF } from "@pixi/gif";
import * as PIXI from "pixi.js";
import { bundle, GameAsset } from "../manifest";

type BundleKey = "fonts" | "backgrounds" | "sprites" | "items" ;

export default class AssetResolver {

	private _assets: GameAsset<PIXI.Texture> | null = null;

	constructor() {}

	async loadBundle(){
		const loadData: {[k in BundleKey]: any} = {
			fonts: await PIXI.Assets.loadBundle('fonts'),
			backgrounds: await PIXI.Assets.loadBundle('backgrounds'),
			sprites: await PIXI.Assets.loadBundle('sprites'),
			items: await PIXI.Assets.loadBundle('items'),
		}

		const assets: any = Object.keys(loadData).reduce((prev, curr) => {prev[curr] = {}; return prev;} , {} as any)

		console.log(loadData)

		Object.entries(bundle)
			.forEach(([bundleName, bundleData]) => {
				Object.keys(bundleData)
					.forEach(assetName => assets[bundleName as BundleKey][assetName] = loadData[bundleName as BundleKey][assetName])
			})

		this._assets = assets;
	}

	
	public get assets() : GameAsset<PIXI.Texture> {
		if (this._assets === null) throw new Error("The Assets is null! You should load assets first.")
		return this._assets;
	}

	
	public get backgrounds() : GameAsset<PIXI.Texture>["backgrounds"] {
		return this.assets.backgrounds;
	}

	public get sprites() : GameAsset<PIXI.Texture>["sprites"] {
		return this.assets.sprites;
	}
	
	public get items(): GameAsset<PIXI.Texture>["items"]{
		return this.assets.items;
	}
	
}

export const assets = new AssetResolver()
