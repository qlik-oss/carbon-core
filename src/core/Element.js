import EventEmitter from 'eventemitter3';
export class Element {
  constructor(canvas) {
    if (canvas) {
      this.canvas = canvas;
      this.eventEmitter = new EventEmitter();
      const size = canvas.getSize();
      this.boundingRect = {};
      this.setClientRect({x: 0, y: 0, ...size});
    }
  }

  createVirtualElement(rect) {
    if (this.canvas) {
      const virtualCanvas = this.canvas.createVirtualCanvas(rect);
      return new Element(virtualCanvas);
    }
    return undefined;
  }

  resetSize() {
    const size = this.canvas.getSize();
    this.boundingRect = {};
    this.setClientRect({x: 0, y: 0, ...size});
  }

  get2DCanvas() {
    return this.canvas;
  }

  addEventListener(type, listener) {
    const c = this.eventEmitter.addListener(type, listener);
    return c;
  }

  removeEventListener(type, listener) {
    this.eventEmitter.removeListener(type, listener);
  }

  resize(rect) {
    this.canvas.resize(rect);
    this.setClientRect(rect);
  }

  setClientRect(rect) {
    this.boundingRect.width = rect.width;
    this.boundingRect.height = rect.height;
    this.boundingRect.x = rect.x;
    this.boundingRect.y = rect.y;
    this.boundingRect.top = rect.y;
    this.boundingRect.left = rect.x;
    this.boundingRect.bottom = rect.y + rect.height;
    this.boundingRect.right = rect.x + rect.width;
  }

  getBoundingClientRect() {
    if (this.canvas) {
      return this.boundingRect;
    }
    return undefined;
  }

  clear() {
    this.canvas.clear();
  }

  paint() {
    this.canvas.draw();
  }

  destroy() {
    this.canvas.destroy();
  }
}
