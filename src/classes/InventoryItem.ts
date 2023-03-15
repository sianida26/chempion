import * as PIXI from "pixi.js";
import { globalEmitter } from "../eventEmitter";
import { app } from "../main";
import { GameAsset } from "../manifest";
import { assets } from "./AssetResolver";

export type ItemType = keyof GameAsset<string>["items"];

export default class InventoryItem {

    public readonly type: ItemType
    public readonly sprite: PIXI.Sprite = new PIXI.Sprite();

    private isDragging = false;
    private originalPosition = new PIXI.Point();
    private originalParent: PIXI.Container | null = null;

    constructor(type: ItemType){
        this.type = type;

        this.sprite.texture = assets.items[type]
        this.sprite.interactive = true;

        this.sprite.on("pointerdown", this.handleDragStart.bind(this), this.sprite)
    }

    private handleDragStart(event: PIXI.FederatedPointerEvent){
        this.sprite.alpha = 0.5;

        // Store the original position before dragging
        this.originalPosition = new PIXI.Point(this.sprite.x, this.sprite.y);

        this.originalParent = this.sprite.parent;
        this.sprite.setParent(app.stage);

        this.sprite.parent.toLocal(event.global, undefined, this.sprite.position)

        app.stage.on("pointermove", this.handleDragMove.bind(this))
        app.stage.on("pointerup", this.handleDragEnd.bind(this))
        app.stage.on("pointerupoutside", this.handleDragEnd.bind(this))

        this.isDragging = true;
        globalEmitter.emit("itemStartDrag", this);
    }

    private handleDragMove(event: PIXI.FederatedPointerEvent){
        if (this.isDragging){
            this.sprite.parent.toLocal(event.global, undefined, this.sprite.position)
        }
    }

    private handleDragEnd(){
        if (this.isDragging){
            app.stage.off("pointermove", this.handleDragMove.bind(this))
            app.stage.off("pointerup", this.handleDragEnd.bind(this))
            app.stage.off("pointerupoutside", this.handleDragEnd.bind(this))
            this.sprite.alpha = 1;

            this.sprite.setParent(this.originalParent!);

            // Reset the sprite's position to its original position
            this.sprite.position.set(this.originalPosition.x, this.originalPosition.y);


            this.isDragging = false;
            globalEmitter.emit("itemStopDrag")
        }
    }
}