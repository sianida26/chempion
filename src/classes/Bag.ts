import * as PIXI from "pixi.js";
import bagImage from "../assets/sprite/bag.png";
import bagHighlight from "../assets/sprite/bag_highlight.png";
import inventoryBoxImage from "../assets/sprite/inventory_box.png";
import { globalEmitter } from "../eventEmitter";
import InventoryBox from "./InventoryBox";

interface Textures{
    bag: PIXI.Texture
    bagHover: PIXI.Texture
    inventoryBox: PIXI.Texture
    items?: {[k: string]: PIXI.Texture}
}
export default class Bag{

    readonly container: PIXI.Container = new PIXI.Container();
    readonly inventoryBoxContainer = new PIXI.Container();
    readonly numberOfBoxes = 20;
    // private readonly inventoryBoxes: InventoryBox[] = [];

    private app: PIXI.Application;
    private textures: Textures;
    private bagSprite: PIXI.Sprite;

    //Bag states
    // private isOver = false;

    private constructor(app: PIXI.Application, textures: Textures){
        this.app = app;
        this.textures = textures;

        this.bagSprite = PIXI.Sprite.from(textures.bag);
        this.bagSprite.interactive = true;
        this.bagSprite
                .on("mouseover", this.handleMouseOver.bind(this))
                .on("mouseout", this.handleMouseOut.bind(this))
                .on("click", this.handleBagClick.bind(this))

        //positioning the bag
        this.container.x = 10;
		this.container.y = 10;

        this.container.addChild(this.bagSprite);

        //create inventory boxes
        for (let i = 0; i < this.numberOfBoxes; i++){
            const inventoryBox = new InventoryBox(PIXI.Sprite.from(textures.inventoryBox));
            inventoryBox.sprite.x = (i%10) * (inventoryBox.sprite.width + 2); //gap: 2
            inventoryBox.sprite.y = Math.floor(i/10) * (inventoryBox.sprite.height + 2); //gap: 2
            this.inventoryBoxContainer.addChild(inventoryBox.sprite);
        }
        this.inventoryBoxContainer.x = this.bagSprite.width;
        this.inventoryBoxContainer.y = this.bagSprite.y;
        this.inventoryBoxContainer.visible = false; //hidden by default
        this.container.addChild(this.inventoryBoxContainer);

        //listen to events
        globalEmitter.on("commentBarShowing", this.disableInteractivity.bind(this));
        globalEmitter.on("commentBarHiding", this.enableInteractivity.bind(this));
    }

    public static async makeBag(app: PIXI.Application){
        const [bag, bagHover, inventoryBox] = await Promise.all([
            PIXI.Assets.load(bagImage),
            PIXI.Assets.load(bagHighlight),
            PIXI.Assets.load(inventoryBoxImage),
        ]);
        return new this(app, { bag, bagHover, inventoryBox });
    }

    private handleMouseOver(){
        this.bagSprite.texture = this.textures.bagHover;
    }

    private handleMouseOut(){
        this.bagSprite.texture = this.textures.bag;
    }

    private handleBagClick(){
        if (this.inventoryBoxContainer.visible){
            this.closeInventoryBoxes()
        } else {
            this.openInventoryBoxes();
        }
    }

    private disableInteractivity(){
        this.closeInventoryBoxes();
        this.bagSprite.interactive = false;
    }

    private enableInteractivity(){
        this.bagSprite.interactive = true;
    }

    private openInventoryBoxes(){
        this.inventoryBoxContainer.visible = true;
    }

    private closeInventoryBoxes(){
        this.inventoryBoxContainer.visible = false;
    }
    
}