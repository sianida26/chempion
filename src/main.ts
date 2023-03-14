import * as PIXI from 'pixi.js';
import '@pixi/gif';
import VT323 from "./fonts/VT323-Regular.ttf"

import config from './config';
import Stage1 from './stages/Stage1';

const appContainer = document.getElementById("app")!;
if (!appContainer) throw new Error("The Container is not found");
//512x288
// PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;

const app = new PIXI.Application({
  width: config.appWidth,
  height: config.appHeight,
  autoDensity: true,
  // resolution: window.devicePixelRatio || 1,
  resizeTo: appContainer,
});

app.stage.scale.x = app.screen.height / config.appHeight;
app.stage.scale.y = app.screen.height / config.appHeight;

PIXI.Assets.addBundle('fonts', {
  VT323,
});
PIXI.Assets.backgroundLoadBundle('fonts')

const stage1 = new Stage1(app);

stage1.play()

// @ts-ignore
appContainer.appendChild(app.view);

function actualWidth() {
  const { width, height } = app.screen;
  const isWidthConstrained = width < height * 16 / 9;
  return isWidthConstrained ? width : height * 16 / 9;
}

function actualHeight() {
  const { width, height } = app.screen;
  const isHeightConstrained = width * 9 / 16 > height;
  return isHeightConstrained ? height : width * 9 / 16;
}


export {}