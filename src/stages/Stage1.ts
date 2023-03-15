import * as PIXI from "pixi.js";

import AbstractStage from "../classes/AbstractStage";

import { pause } from "../helper";
import CommentBar from "../classes/CommentBar";
import Bag from "../classes/Bag";
import { assets } from "../classes/AssetResolver";
import { globalEmitter } from "../eventEmitter";
import InventoryItem from "../classes/InventoryItem";
import { app } from "../main";
import gsap from "gsap";

interface Stage1Asset {
	background: PIXI.Sprite;
	knightIdle: PIXI.Sprite;
	snail: PIXI.Sprite;
	bag: Bag;
	treasure: PIXI.Sprite;
	commentBar: CommentBar;
}

export default class Stage1 extends AbstractStage<Stage1Asset> {
	commentText: string;
	assets: Stage1Asset

	constructor(app: PIXI.Application<PIXI.ICanvas>) {
		super(app);
		this.commentText = "";
		this.assets = {
			background: new PIXI.Sprite(assets.backgrounds.varma),
			knightIdle: assets.sprites.knightIdle,
			bag: new Bag(app),
			commentBar: new CommentBar(app),
			snail: new PIXI.Sprite(assets.sprites.snail),
			treasure: new PIXI.Sprite(assets.sprites.obtainLoot),
		}
	}

	private initializeStage() {
		this.stage.addChild(this.assets.background);

		this.assets.knightIdle.x = 20;
		this.assets.knightIdle.y = 180;
		this.stage.addChild(this.assets.knightIdle);

		this.stage.addChild(this.assets.bag.container);

        this.stage.addChild(this.assets.commentBar.container);

		//the snail
		this.assets.snail.x = 225;
		this.assets.snail.y = 190;
		this.assets.snail.interactive = true
		this.assets.snail.hitArea
		this.assets.snail
			.on("mouseover", () => this.assets.snail.texture = assets.sprites.snailHighlight)
			.on("mouseleave", () => this.assets.snail.texture = assets.sprites.snail)
			.on("click", this.scene2.bind(this))
			.on("tap", this.scene2.bind(this))

		globalEmitter.on("commentBarShowing", () => {
			this.assets.snail.interactive = false;
			this.assets.snail.texture = assets.sprites.snail;
		})

		globalEmitter.on("commentBarHiding", () => {
			this.assets.snail.interactive = true;
		})
		
		this.stage.addChild(this.assets.snail);
	}

	async play() {
		this.initializeStage();
		await pause(0);
        this.assets.commentBar?.showMessage("Belk","Hai Pak:)\nPak Munzil Baik Deh :))");
	}

	async scene2(){
		const initialize = () => {
			this.assets.background.texture = assets.backgrounds.theSnail;

			this.assets.knightIdle.visible = false;

			this.assets.snail.x = 540;
			this.assets.snail.y = 260;
			this.assets.snail.texture = assets.sprites.snail;

			const onPointerMove = (e: PIXI.FederatedPointerEvent) => {
				if (this.assets.snail.containsPoint(e.global)){
					this.assets.snail.texture = assets.sprites.snailHighlight
				} else {
					this.assets.snail.texture = assets.sprites.snail
				}
			}

			const onPointerUp = (e: PIXI.FederatedPointerEvent) => {
				if (this.assets.snail.containsPoint(e.global)){
					this.scene3()
				} else {
					console.log("wrong")
				}
			}

			const itemDragListener = (item: any) => {
				if (!(item instanceof InventoryItem)) {
					return 
				}

				app.stage.on("pointermove", onPointerMove);
				app.stage.on("pointerup", onPointerUp);
			}

			globalEmitter.on("itemStartDrag", itemDragListener)
			globalEmitter.on("itemStopDrag", () => { 
				app.stage.off("pointermove", onPointerMove)
				app.stage.off("pointerup", onPointerUp)
			})
		}

		initialize()
	}

	async scene3(){

		const initialize = () => {
			this.assets.snail.visible = false;
			this.assets.bag.container.visible = false;

			this.stage.addChild(assets.sprites.itemObtain);

			this.assets.treasure.x = this.stage.width / 2;
			this.assets.treasure.y = this.stage.height / 2;
			this.assets.treasure.pivot.x = this.assets.treasure.width / 2;
			this.assets.treasure.pivot.y = this.assets.treasure.height / 2;
			this.assets.treasure.scale.set(0,0);
			this.stage.addChild(this.assets.treasure);

		}

		initialize()

		await gsap.to(this.assets.treasure.scale, {
			x: 1, y: 1, duration: 1, repeat: 0
		})
	}
}
