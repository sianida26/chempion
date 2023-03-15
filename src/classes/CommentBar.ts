import * as PIXI from "pixi.js";

import config from "../config";
import { splitIntoLines } from "../helper";
import { globalEmitter } from "../eventEmitter";
import { assets } from "./AssetResolver";
import { AnimatedGIF } from "@pixi/gif";

export default class CommentBar{

    app: PIXI.Application;
    container: PIXI.Container;
    message: string = "";
    name: string = "";
    private theBar: AnimatedGIF;
    private theMessage: PIXI.Text;
    private theName: PIXI.Text;
    private splittedText: String[] = [];
    private messageLinePos: number = 0;

    constructor(app: PIXI.Application){
        this.app = app;

        this.container = new PIXI.Container();

        this.theBar = assets.sprites.commentBar;
        // this.theBar.width = this.app.renderer.width;
		// this.theBar.height = (112 * this.app.renderer.height) / config.editorHeight;
        this.theBar.interactive = true;
        this.theBar.onclick = this.handleBarClick.bind(this);

		this.container.y =
			config.appHeight - this.theBar.height;
		this.container.x = 0;
        this.container.visible = false;

        this.container.addChild(this.theBar);

        this.theName = new PIXI.Text();
        this.theMessage = new PIXI.Text();

        this.loadText();
    }

    private async loadText(){
        // await PIXI.Assets.loadBundle("fonts");
        const textPosition = { x: 160, y: 340 };
        const textStyle = new PIXI.TextStyle({
			fontFamily: "VT323",
			fontSize: 40,
			fill: "white",
			wordWrap: true,
			wordWrapWidth: config.appWidth - textPosition.x,
		});
        this.theName = new PIXI.Text(this.name + ":", textStyle);
        this.theName.x = 160;
        this.theName.y = 45; 
        this.container.addChild(this.theName);

        this.theMessage = new PIXI.Text("", textStyle);
        this.theMessage.x = 160;
        this.theMessage.y = 70;
        this.container.addChild(this.theMessage)

        //add keyboard event
        window.addEventListener("keydown", (e) => {
            if (e.key === "Enter"){
                this.handleBarClick()
            }
        })
    }

    private handleBarClick(){
        if (!this.isShowing) return;
        if (this.messageLinePos + 3 >= this.splittedText.length){
            this.hide();
        } else {
            this.next();
        }
    }

    hide(){
        globalEmitter.emit("commentBarHiding");
        this.container.visible = false;
    }

    show(){
        globalEmitter.emit("commentBarShowing");
        this.container.visible = true;
    }
    
    public get isShowing() : boolean {
        return this.container.visible
    }

    private next(){
        this.messageLinePos += 3;
        this.animateText();
    }
    
    private animateText(){
        this.theMessage.text = "";
        const showMessage = this.splittedText.slice(this.messageLinePos, this.messageLinePos+3).join(" ");

        this.theName.text = this.name + ":";

        let currentIndex = 0;
		const ticker = () => {
			if (currentIndex < showMessage.length) {
                this.theMessage.text += showMessage[currentIndex];
                currentIndex++;
			} else {
				this.app.ticker.remove(ticker);
			}
		};
		this.app.ticker.add(ticker);
    }

    showMessage(name: string = "", message: string = ""){
        this.name = name;
        this.message = message;
        this.splittedText = splitIntoLines(this.message);
        console.log(this.splittedText);
        this.show();
        this.animateText();
    }
}
