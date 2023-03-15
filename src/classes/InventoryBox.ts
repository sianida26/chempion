import * as PIXI from "pixi.js"
import { assets } from "./AssetResolver";
import InventoryItem, { ItemType } from "./InventoryItem";

export default class InventoryBox{

    container: PIXI.Container = new PIXI.Container();
    sprite: PIXI.Sprite;
    item: InventoryItem | null = null;

    constructor(){
        this.sprite = new PIXI.Sprite(assets.sprites.inventoryBox);
        this.container.addChild(this.sprite);
    }

    setItem(itemName: ItemType){
        this.item = new InventoryItem(itemName)
        this.item.sprite.x = this.sprite.width / 2
        this.item.sprite.y = this.sprite.height / 2
        this.item.sprite.pivot.x = this.item.sprite.width /2
        this.item.sprite.pivot.y = this.item.sprite.height /2
        this.container.addChild(this.item.sprite);
    }
}