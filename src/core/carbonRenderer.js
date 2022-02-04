import getPixelWidth from "string-pixel-width";
import createRendererBox from "picasso.js/src/web/renderer/renderer-box";
import { textBounds } from "picasso.js/src/web/text-manipulation";
import { Scene } from "./scene";

const carbonRenderer = () => {
  const rnRenderer = { textBounds };
  const scene = new Scene();
  let rect = createRendererBox();
  let element;
  let _key;

  rnRenderer.setKey = (k) => {
    _key = k;
  };

  rnRenderer.appendTo = (parent) => {
    if (!element) {
      element = parent.createElement(rect, _key);
    }
  };

  rnRenderer.element = () => element;

  rnRenderer.root = () => element;

  rnRenderer.measureText = (opt) => {
    if (!opt.text) {
      return { width: getPixelWidth(opt, { size: 12 }), height: 12 };
    }
    let size = parseInt(opt.fontSize, 10);
    if (isNaN(size)) {
      size = 12;
    }

    const sourceFont = opt.fontFamily || "arial";

    const fontFamily = sourceFont
      .split(",")
      .map((s) => s?.trim()?.toLowerCase());
    const font = fontFamily.length > 1 ? fontFamily[1] : fontFamily[0];
    const dims = opt.fontSize
      ? { width: getPixelWidth(opt.text, { size, font }), height: size }
      : { width: getPixelWidth(opt.text, { size: 12, font }) };
    dims.width = Math.round(dims.width);
    dims.height = Math.round(dims.height);
    return dims;
  };

  rnRenderer.size = (opts) => {
    if (opts) {
      const newRect = createRendererBox(opts);
      rect = newRect;
      scene.resize(rect);
      if (element) {
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
    if (element.getImmediate()) {
      return;
    }
    let shapeId = 0;
    element.clear();
    scene.reset();

    const onShape = (shape) => {
      if (shape.type === "container") {
        shape.children.forEach((child) => {
          onShape(child);
        });
      } else {
        shape.shapeId = shapeId;
        shape.parentId = -1;
        shapeId += 1;
        element.add(shape);
        scene.add(shape);
      }
    };

    shapes.forEach((shape) => {
      onShape(shape);
    });
  };

  rnRenderer.itemsAt = (input) => scene.itemsAt(input);

  rnRenderer.findShapes = (selector) => scene.findShapes(selector);
  return rnRenderer;
};
export { carbonRenderer };
