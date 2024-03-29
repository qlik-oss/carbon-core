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
    if (opt.text && opt.fontSize) {
      const fontFamily = opt.fontFamily || "Source Sans Pro";
      const fontSize = parseInt(opt.fontSize, 10);
      const text = opt.text;
      if(text.length > 0) {
        // eslint-disable-next-line no-undef
        const result = HeliumCanvasApi.measureText({fontFamily, fontSize, text});
        return result;
      }
    }
    return {width: 0, height: 0}
  };

  rnRenderer.size = (opts) => {
    if (opts) {
      const newRect = createRendererBox(opts);
      rect = newRect;
      scene.resize(rect);
      if (element) {
        element.resize(rect);
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

    scene.reset();

    const onShape = (shape) => {
      if (shape.type === 'container') {
        shape.children.forEach((child) => {
          onShape(child);
        });
      } else {
        scene.add(shape);
      }
    };

     shapes.forEach((shape) => {
       if(shape.type === 'text') {
         shape.fontSize = parseInt(shape.fontSize, 10);
       }
       onShape(shape);
     });

    element.addShapes(shapes);
  };

  rnRenderer.itemsAt = (input) => scene.itemsAt(input);

  rnRenderer.findShapes = (selector) => scene.findShapes(selector);

  return rnRenderer;
};

export {carbonRenderer};
