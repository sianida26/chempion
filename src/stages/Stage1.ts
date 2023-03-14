import { AnimatedGIF } from "@pixi/gif";
import * as PIXI from "pixi.js";

import AbstractStage from "../classes/AbstractStage";

import backgroundImg from "../assets/map/varma.png";
import knight from "../assets/sprite/knight_idle.gif";
import { pause } from "../helper";
import CommentBar from "../classes/CommentBar";
import Bag from "../classes/Bag";

interface Stage1Asset {
	background: PIXI.Sprite;
	knightIdle: AnimatedGIF;
	bag: Bag;
	commentBar: CommentBar;
}

export default class Stage1 extends AbstractStage<Stage1Asset> {
	commentText: string;

	constructor(app: PIXI.Application<PIXI.ICanvas>) {
		super(app);
		this.commentText = "";
	}

	private async loadAssets() {
		console.log("Loading background");
		this.assets.background = PIXI.Sprite.from(
			await PIXI.Assets.load(backgroundImg)
		);

		console.log("Loading knight_idle");
		this.assets.knightIdle = await PIXI.Assets.load(knight);

		console.log("Loading bag");
        this.assets.bag = await Bag.makeBag(this.app);

		console.log("Loading comment bar");
        this.assets.commentBar = await CommentBar.makeCommentBar(this.app)

		console.log("Initialization finished");
	}

	private initializeStage() {
		if (
			!(
				this.assets.background &&
				this.assets.knightIdle &&
				this.assets.bag &&
				this.assets.commentBar
			)
		)
			throw "Assets is not loaded completely";
		this.stage.addChild(this.assets.background);

		this.assets.knightIdle.x = 20;
		this.assets.knightIdle.y = 180;
		this.stage.addChild(this.assets.knightIdle);

		this.stage.addChild(this.assets.bag.container);

        this.stage.addChild(this.assets.commentBar.container)
	}

	async play() {
		await this.loadAssets();
		this.initializeStage();
		await pause(1000);
        this.assets.commentBar?.showMessage("Wkwkwkwk")
	}
}
