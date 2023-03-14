import * as PIXI from "pixi.js";
import { ICanvas } from "pixi.js";

export default abstract class AbstractStage<T>{

    app: PIXI.Application<ICanvas>;
    stage: PIXI.Container;
    assets: Partial<T>;

    constructor(app: PIXI.Application<ICanvas>){
        this.app = app;
        this.stage = new PIXI.Container();
        this.app.stage.addChild(this.stage);
        this.assets = {}
    }

    abstract play(): Promise<void>
}