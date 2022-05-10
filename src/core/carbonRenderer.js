import createRendererBox from 'picasso.js/src/web/renderer/renderer-box';
import {textBounds} from 'picasso.js/src/web/text-manipulation';
import {Scene} from './scene';

const carbonRenderer = () => {
  const rnRenderer = {textBounds};
  const scene = new Scene();
  let rect = createRendererBox();
  let element;
  let _key;

  rnRenderer.setKey = (k) => {
    _key = k;
  };

  rnRenderer.appendTo = (parent) => {
    if (!element) {
      element = parent.createVirtualElement(rect, _key);
    }
  };

  rnRenderer.element = () => element;

  rnRenderer.root = () => element;

  rnRenderer.measureText = (opt) => {
    if (opt.text) {
      const fontFamily = opt.fontFamily.split(',')[0];
      const fontSize = parseInt(opt.fontSize, 10);
      const text = opt.text;
      // eslint-disable-next-line no-undef
      const result = HeliumCanvasApi.measureText({fontFamily, fontSize, text});
      return result;
    }
    const fontFamily = 'Source Sans Pro';
    const fontSize = 12;
    // eslint-disable-next-line no-undef
    return HeliumCanvasApi.measureText({fontFamily, fontSize, text: opt});
  };

  rnRenderer.size = (opts) => {
    if (opts) {
      const newRect = createRendererBox(opts);
      rect = newRect;
      scene.resize(rect);
      if (element) {
        element.clear();
        element.setClientRect(rect);
      }
      return newRect;
    }

    return rect;
  };

  rnRenderer.clear = () => {
    if (element && element.clear) {
      element.clear();
    }
    scene.reset();
    return rnRenderer;
  };

  rnRenderer.destroy = () => {
    if (element) {
      element.destroy();
      element = null;
    }
    scene.reset();
  };

  rnRenderer.render = (shapes) => {
    if (!element || !shapes) {
      return;
    }

    element.clear();
    scene.reset();

    const onShape = (shape) => {
      if (shape.type === 'container') {
        shape.children.forEach((child) => {
          onShape(child);
        });
      } else {
        // omit data
        const s = Object.fromEntries(
          Object.entries(shape).filter(([key]) => !['data'].includes(key)),
        );
        element.add(s);
        scene.add(shape);
      }
    };

    shapes.forEach((shape) => {
      onShape(shape);
    });
    element.paint();
  };

  rnRenderer.itemsAt = (input) => scene.itemsAt(input);

  rnRenderer.findShapes = (selector) => scene.findShapes(selector);
  return rnRenderer;
};
export {carbonRenderer};
