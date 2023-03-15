import * as PIXI from 'pixi.js';
import '@pixi/gif';
import VT323 from "./fonts/VT323-Regular.ttf"

import config from './config';
import Stage1 from './stages/Stage1';
import Loading from './stages/Loading';

const appContainer = document.getElementById("app")!;
if (!appContainer) throw new Error("The Container is not found");

//Declare application
export const app = new PIXI.Application({
  width: config.appWidth,
  height: config.appHeight,
  autoDensity: true,
  background: '#FFFFFF',
  // resolution: window.devicePixelRatio || 1,
  resizeTo: appContainer,
});

//Scale the app
app.stage.scale.x = app.screen.height / config.appHeight;
app.stage.scale.y = app.screen.height / config.appHeight;

app.stage.hitArea = app.screen;
app.stage.interactive = true;


(async () => {
  const loading = new Loading(app);
  await loading.start();

  const stage1 = new Stage1(app);
  stage1.play()
})()



// @ts-ignore
appContainer.appendChild(app.view);


export {}