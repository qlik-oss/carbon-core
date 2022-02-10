// implementation based on
// https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

export class Quadtree {
  constructor(rect, level) {
    this.bounds = rect;
    this.maxLevels = 4;
    this.maxObjects = 10;
    this.level = level || 0;
    this.objects = [];
    this.nodes = [];
  }

  clear() {
    this.objects = [];
    this.nodes.forEach((node) => node.clear());
    this.nodes = [];
  }

  partition() {
    const width = this.bounds.width * 0.5;
    const height = this.bounds.height * 0.5;
    const {x} = this.bounds;
    const {y} = this.bounds;
    const next = this.level + 1;

    this.nodes.push(
      new Quadtree(
        {
          x: +width,
          y,
          width,
          height,
        },
        next,
      ),
    );

    this.nodes.push(
      new Quadtree(
        {
          x,
          y,
          width,
          height,
        },
        next,
      ),
    );

    this.nodes.push(
      new Quadtree(
        {
          x,
          y: y + height,
          width,
          height,
        },
        next,
      ),
    );

    this.nodes.push(
      new Quadtree(
        {
          x: x + width,
          y: y + height,
          width,
          height,
        },
        next,
      ),
    );
  }

  getIndex(rect) {
    const idx = [];
    const cx = this.bounds.x + this.bounds.width * 0.5;
    const cy = this.bounds.y + this.bounds.height * 0.5;

    const top = rect.y < cy;
    const left = rect.x < cx;
    const right = rect.x + rect.width > cx;
    const bottom = rect.y + rect.height > cy;

    if (top && right) {
      idx.push(0);
    }

    if (top && left) {
      idx.push(1);
    }

    if (bottom && left) {
      idx.push(2);
    }

    if (bottom && right) {
      idx.push(3);
    }

    return idx;
  }

  insert(rect) {
    let idx = [];
    // don't insert zero rects
    if (rect.width * rect.height === 0) {
      return;
    }

    if (this.nodes.length) {
      idx = this.getIndex(rect);
      // straddle??
      idx.forEach((i) => {
        this.nodes[i].insert(rect);
      });
      return;
    }
    this.objects.push(rect);

    if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
      if (!this.nodes.length) {
        this.partition();
      }
      this.objects.forEach((obj) => {
        idx = this.getIndex(obj);
        idx.forEach((i) => {
          this.nodes[i].insert(obj);
        });
      });
      this.objects = [];
    }
  }

  find(rect) {
    const idx = this.getIndex(rect);
    let result = this.objects;
    if (this.nodes.length) {
      idx.forEach((index) => {
        result = result.concat(this.nodes[index].find(rect));
      });
    }
    result = result.filter((obj, index) => result.indexOf(obj) >= index);
    return result;
  }
}
