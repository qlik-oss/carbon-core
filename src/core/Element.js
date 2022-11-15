import EventEmitter from 'eventemitter3';
import { transformEvent } from './transformEvent';
import {throttle} from 'lodash';

export class Element {
  constructor(canvas) {
    if (canvas) {
      this.canvas = canvas;
      this.panning = false;
      this.eventEmitter = new EventEmitter();
      const size = canvas.getSize();
      this.boundingRect = {};
      this.setClientRect({x: 0, y: 0, ...size});
      this.shapes = [];
      this.elements = [];
    }
  }

  // the following two methods are to signal Picasso.js that this is mobile and will
  // be recieving touchxxxx events
  ontouchstart() {}
  ontouchend() {}

  createVirtualElement(rect) {
    if (this.canvas) {
      const virtualCanvas = this.canvas.createVirtualCanvas(rect);
      const element = new Element(virtualCanvas);
      this.elements.push(element);
      return element;
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

  emit(type, event) {
    const txEvent = transformEvent(event);
    if(txEvent.transformed) {
      const newEvent = {...event, ...txEvent}
      this.eventEmitter.emit(type, newEvent);
    }
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
    this.shapes = false;
    this.canvas.clear();
  }

  paint() {
    if(this.shapes) {
      this.canvas.draw();
    }
  }

  destroy() {
    this.canvas.destroy();
  }

  addShapes(shapes) {
     this.canvas.addShapes(shapes);
  }
  setSelectionBrushes(brushes) {
    this.canvas.setSelectionBrushes(brushes);
  }

  confirmSelections() {
    this.canvas.confirmSelections();
  }

  clearSelections() {
    this.canvas.clearSelections();
  }

  setTouchesStartListener(listener) {
    this.touchesStartListener = listener;
  }

  getTouchesStartListener() {
    return this.touchesStartListener;
  }

  mount(component) {
    this.jsxComponent = component;
  }

  renderComponent(data) {
    this.eventEmitter.emit('renderComponentWithData', data);
  }

  getJsxComponent() {
    return this.jsxComponent;
  }

  title(value) {
    this.eventEmitter.emit('titleChanged', value);
  }
}
