import {rectToPoints} from 'picasso.js/src/core/geometry/util';

export const narrowPhase = (
  elements,
  rect,
  results,
  radius = 1,
  type = 'point',
  shape = undefined,
) => {
  const accept = (d) => {
    results.push({d, node: {...d, data: d.data}});
  };
  if (type === 'point') {
    elements.forEach((e) => {
      if (
        rectCirle(
          {
            x: rect.x + radius * 0.5,
            y: rect.y + radius * 0.5,
            radius,
          },
          e,
        )
      ) {
        accept(e);
      }
    });
  } else {
    elements.forEach((target) => {
      switch (target.type) {
        // TODO: implement rest of shapes and
        // inversetransforms
        case 'rect': {
          const points = rectToPoints(target);
          if (shape.intersectsRect(points)) {
            accept(target);
          }
          break;
        }
        case 'circle': {
          break;
        }
        case 'line': {
          break;
        }
        case 'path': {
          break;
        }
        default: {
          break;
        }
      }
    });
  }
};

const rectCirle = (circle, rect) => {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > rect.width / 2 + circle.radius) {
    return false;
  }
  if (distY > rect.height / 2 + circle.radius) {
    return false;
  }

  if (distX <= rect.width / 2) {
    return true;
  }
  if (distY <= rect.height / 2) {
    return true;
  }

  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
};
