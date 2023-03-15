import * as PIXI from "pixi.js";
import { globalEmitter } from "../eventEmitter";
import { assets } from "./AssetResolver";
import InventoryBox from "./InventoryBox";
import { ItemType } from "./InventoryItem";

export default class Bag{

    readonly container: PIXI.Container = new PIXI.Container();
    readonly inventoryBoxContainer = new PIXI.Container();
    readonly numberOfBoxes = 20;
    private readonly inventoryBoxes: InventoryBox[] = [];

    private readonly app: PIXI.Application;
    private bagSprite: PIXI.Sprite;
    public items: ItemType[] = [
        "salt",
        "grass",
        "hay",
    ];

    //Bag states
    // private isOver = false;

    constructor(app: PIXI.Application){
        this.app = app;

        this.bagSprite = PIXI.Sprite.from(assets.sprites.bag);
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
            const inventoryBox = new InventoryBox();
            inventoryBox.container.x = (i%10) * (inventoryBox.sprite.width + 2); //gap: 2
            inventoryBox.container.y = Math.floor(i/10) * (inventoryBox.sprite.height + 2); //gap: 2
            this.inventoryBoxes.push(inventoryBox);
            this.inventoryBoxContainer.addChild(inventoryBox.container);
        }
        this.inventoryBoxContainer.x = this.bagSprite.width;
        this.inventoryBoxContainer.y = this.bagSprite.y;
        this.inventoryBoxContainer.visible = false; //hidden by default
        this.container.addChild(this.inventoryBoxContainer);

        //attach invetory items to the box container
        for (let i = 0; i < this.items.length; i++){
            this.inventoryBoxes[i].setItem(this.items[i])
        }

        //listen to events
        globalEmitter.on("commentBarShowing", this.disableInteractivity.bind(this));
        globalEmitter.on("commentBarHiding", this.enableInteractivity.bind(this));
    }

    private handleMouseOver(){
        this.bagSprite.texture = assets.sprites.bagHighlight;
    }

    private handleMouseOut(){
        this.bagSprite.texture = assets.sprites.bag;
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