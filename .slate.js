const gutter = 15;
const shortcut = ':ctrl;cmd';

const fullscreen = slate.operation('move', {
  x: 'screenOriginX',
  y: 'screenOriginY',
  width: 'screenSizeX',
  height: 'screenSizeY',
});

const left = slate.operation('push', {
  direction: 'left',
  style: 'bar-resize:screenSizeX/2',
});

const right = slate.operation('push', {
  direction: 'right',
  style: 'bar-resize:screenSizeX/2',
});

slate.bind('k' + shortcut, (win) => win.doOperation(fullscreen));
slate.bind('h' + shortcut, (win) => win.doOperation(left));
slate.bind('l' + shortcut, (win) => win.doOperation(right));
