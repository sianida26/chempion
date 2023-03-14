import * as PIXI from "pixi.js";

import config from "../config";
import commentBarImage from "../assets/sprite/comment_bar.gif";
import { splitIntoLines } from "../helper";
import { globalEmitter } from "../eventEmitter";

export default class CommentBar{

    app: PIXI.Application;
    container: PIXI.Container;
    message: string = "";
    private theBar: PIXI.Sprite;
    private theMessage: PIXI.Text;
    private theName: PIXI.Text;
    private splittedText: String[] = [];
    private messageLinePos: number = 0;

    private constructor(app: PIXI.Application, sprite: PIXI.Sprite){
        this.app = app;

        this.container = new PIXI.Container();

        this.theBar = sprite;
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

    static async makeCommentBar(app: PIXI.Application){
        return new this(app, await PIXI.Assets.load(commentBarImage));
    }

    private async loadText(){
        await PIXI.Assets.loadBundle("fonts");
        const textPosition = { x: 160, y: 340 };
        const textStyle = new PIXI.TextStyle({
			fontFamily: "VT323",
			fontSize: 40,
			fill: "white",
			wordWrap: true,
			wordWrapWidth: config.appWidth - textPosition.x,
		});
        this.theName = new PIXI.Text("Nama:", textStyle);
        this.theName.x = 160;
        this.theName.y = 45; 
        this.container.addChild(this.theName);

        this.theMessage = new PIXI.Text("", textStyle);
        this.theMessage.x = 160;
        this.theMessage.y = 70;
        this.container.addChild(this.theMessage)
    }

    private handleBarClick(){
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

    showMessage(message: string = ""){
        this.message = message;
        this.splittedText = splitIntoLines(this.message);
        console.log(this.splittedText);
        this.show();
        this.animateText();
    }
}
