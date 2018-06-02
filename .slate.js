const gutter = 2;
const shortcut = ':ctrl;cmd';

const CropMenu = () => ({

});

const fullscreen = slate.operation('move', {
  x: `screenOriginX+screenSizeX*${gutter}/100/2`,
  y: `screenOriginY+screenSizeY*${gutter}/100/2`,
  width: `screenSizeX-screenSizeX*${gutter}/100`,
  height: `screenSizeY-screenSizeY*${gutter}/100`,
});

const left = slate.operation('move', {
  x: `screenOriginX+screenSizeX*${gutter}/100/2`,
  y: `screenOriginY+screenSizeY*${gutter}/100/2`,
  width: `((screenSizeX-screenSizeX*${gutter}/100)/2)-(screenSizeX*${gutter}/100/2)/2`,
  height: `(screenSizeY-screenSizeY*${gutter}/100)-screenSizeY*${gutter}/100/2`,
});

const right = slate.operation('move', {
  x: `(screenSizeX/2)+screenSizeX*${gutter}/100/2/2`,
  y: `screenOriginY+screenSizeY*${gutter}/100/2`,
  width: `((screenSizeX-screenSizeX*${gutter}/100)/2)-(screenSizeX*${gutter}/100/2)/2`,
  height: `(screenSizeY-screenSizeY*${gutter}/100)-screenSizeY*${gutter}/100/2`,
});

const down = slate.operation('move', {
  x: `(screenSizeX/2)+screenSizeX*${gutter}/100/2/2`,
  y: `(screenSizeY/2)+screenSizeY*${gutter}/100`,
  width: `((screenSizeX-screenSizeX*${gutter}/100)/2)-(screenSizeX*${gutter}/100/2)/2`,
  height: `((screenSizeY-screenSizeY*${gutter}/100)/2)-(screenSizeY*${gutter}/100)/2`,
  //height: `((screenSizeY-screenSizeY*${gutter}/100)/2)-(screenSizeY*${gutter}/100/2)/2/2`,
});

slate.bind('k' + shortcut, (win) => win.doOperation(fullscreen));
slate.bind('h' + shortcut, (win) => win.doOperation(left));
slate.bind('l' + shortcut, (win) => win.doOperation(right));
slate.bind('j' + shortcut, (win) => win.doOperation(down));
