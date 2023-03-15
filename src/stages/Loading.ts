import * as PIXI from "pixi.js"

import VT323 from "../fonts/VT323-Regular.ttf"

import varma from "../assets/map/varma.png";
import manifest from "../manifest";
import { assets } from "../classes/AssetResolver";

export default class Loading {
    readonly container = new PIXI.Container();

    textElement = new PIXI.Text();

    constructor(app: PIXI.Application){

        this.container.addChild(this.textElement);

        app.stage.addChild(this.container);
    }

    async start(){
        this.textElement.text = "Loading...";

        await this.loadAssets()
    }

    async loadAssets(){
        await PIXI.Assets.init({ manifest });
        await PIXI.Assets.loadBundle([ 'fonts', 'backgrounds', 'sprites' ], (progress) => this.textElement.text = `Loading... (${ Math.floor(progress * 100) }%)`);

        this.textElement.text = "Loading... (100%)\nStoring assets..."
        await assets.loadBundle();
    }
}