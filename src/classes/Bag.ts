import * as PIXI from "pixi.js";
import bagImage from "../assets/sprite/bag.png";

export default class Bag{

    container: PIXI.Container = new PIXI.Container();

    private app: PIXI.Application;
    private bagSprite: PIXI.Sprite;

    private constructor(app: PIXI.Application, bagSprite: PIXI.Sprite){
        this.app = app;
        this.bagSprite = bagSprite;

        //positioning the bag
        this.container.x = 10;
		this.container.y = 10;

        this.container.addChild(this.bagSprite);
    }

    public static async makeBag(app: PIXI.Application){
        return new this(app, PIXI.Sprite.from(await PIXI.Assets.load(bagImage)));
    }
}