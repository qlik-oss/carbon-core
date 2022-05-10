export class Element {
  constructor(canvas) {
    if (canvas) {
      this.canvas = canvas;
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
    console.log('new size', size);
    this.boundingRect = {};
    this.setClientRect({x: 0, y: 0, ...size});
  }

  get2DCanvas() {
    return this.canvas;
  }

  addEventListener() {}

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
      console.log('returning', this.boundingRect);
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
  add(shape) {
    if (shape.type === 'text') {
      shape.fontSize = parseInt(shape.fontSize, 10);
      shape.fontFamily = shape.fontFamily.split(',')[0];
    }
    this.canvas.drawShape(shape);
  }
  destroy() {
    // this.canvas = null;
  }
}
