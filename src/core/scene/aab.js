export const aabFrom = (shape) => {
  switch (shape.type) {
    case "rect": {
      return shape;
    }
    case "circle": {
      return {
        x: shape.cx - shape.r,
        y: shape.cy - shape.r,
        width: shape.r * 2,
        height: shape.r * 2,
      };
    }
    default: {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }
  }
};
