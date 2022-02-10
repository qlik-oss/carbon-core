import {create as createGeometry} from 'picasso.js/src/core/geometry';
import {Quadtree} from './quadtree';
import {aabFrom} from './aab';
import {narrowPhase} from './narrowPhaseCollision';

export class Scene {
  constructor() {
    this.shapes = {
      rect: [],
      circle: [],
      line: [],
      path: [],
      text: [],
      container: [],
    };
  }

  resize(rect) {
    this.tree = new Quadtree(rect);
  }

  reset() {
    for (let shape in this.shapes) {
      this.shapes[shape] = [];
    }

    if (this.tree) {
      this.tree.clear();
    }
  }

  add(shape) {
    try {
      if (this.tree) {
        this.shapes[shape.type].push({
          attrs: shape,
          bounds: shape,
          localBounds: shape,
          ...shape,
        });

        if (shape.type !== 'text') {
          const AAB = aabFrom(shape);
          this.tree.insert(AAB);
        }
      }
    } catch (e) {
      console.log('Failed to add shape', e);
    }
  }

  findShapes(selector) {
    return this.shapes[selector];
  }

  itemsAt(input) {
    const results = [];
    if (input.x && input.y) {
      const rect = {
        x: input.x,
        y: input.y,
        width: 1,
        height: 1,
      };
      this.findItem(rect, results);
    } else if (input.x1 && input.y1 && input.x2 && input.y2) {
      // create a fat "capsule"
      const x = (input.x1 + input.x2) * 0.5;
      const y = (input.y1 + input.y2) * 0.5;
      const dx = input.x2 - input.x1;
      const dy = input.y2 - input.y1;
      const radius = Math.hypot(dx, dy) * 0.5;
      const rect = {
        x,
        y,
        width: radius,
        height: radius,
      };
      const line = createGeometry('line', input);
      this.findItem(rect, results, radius, 'line', line);
    } else if (input.vertices) {
      const polygon = createGeometry('polygon', input);
      this.findItem(polygon.boundingRect(), results, 0, 'polygon', polygon);
    }

    return results;
  }

  findItem(rect, results, radius = 1, type = 'point', shape = undefined) {
    if (this.tree) {
      const elements = this.tree.find(rect);
      if (elements) {
        narrowPhase(elements, rect, results, radius, type, shape);
      }
    }
  }
}
