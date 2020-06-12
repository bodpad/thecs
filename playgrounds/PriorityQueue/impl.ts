declare var Vue: any;
declare var rxjs: any;
declare var axios: any;
declare var ClipboardJS: any;
declare var SVG: any;

// Diameter of Node
const D = 28;

// Radius of Node
const R = D / 2;

/**
 * Delay execution for a given number of seconds.  The argument may be
 * a floating point number for subsecond precision.
 */
async function sleep(seconds) {
  await rxjs.timer(seconds*1000).toPromise();
}

function isInt(x: number) {
  return x % 1 === 0;
}

function int(x) {
  return Math.floor(x);
}

class GNode {
  key: number;
  parent: GNode = null;
  history: any[] = [];
  el: any;
  circle;
  text;
  line;
  lc;
  constructor(key: number, draw: any, linesContainer: any) {
    this.key = key;
    this.lc = linesContainer;
    this.el = draw.group();

    this.circle = this.el.circle(D);
    this.circle.fill('#fff');
    this.circle.stroke({ color: '#28A745', width: 2 });

    this.text = this.el.plain(key);
    this.text.move(14, 3);
    this.text.font({size: 13, family: 'monospace', anchor: 'middle'});
  }
  wrong() {
    this.circle.stroke({ color: 'red' })
  }
  right() {
    this.circle.stroke({ color: '#28A745' })
  }
  historyPush() {

  }
  move(x: number, y: number) {
    this.history.push([x, y]);
    this.el.animate().cx(x).cy(y);
    if (this.line && this.parent) {
      this.line.animate().plot(this.x, this.y, this.parent.x, this.parent.y);
    }
  }
  get x(): number {
    const last = this.history.length - 1;
    return this.history[last][0];
  }
  get y(): number {
    const last = this.history.length - 1;
    return this.history[last][1];
  }
  lineTo(node: GNode) {
    this.parent = node;
    this.line = this.lc.line(this.x, this.y, node.x, node.y);
    this.line.animate().stroke({ color: '#222', width: 1 });
  }
}

var visualizer = new Vue({
  el: '#visualizer',
  data: {
    keys: null,
    draw: null,
    zoom: 1,
    line_container: null,
    pq: null,
    gal: false, // Global animation lock
  },
  created: function () {
    this.init();
  },
  methods: {
    init: function() {
      this.pq = [null];
      this.keys =  [];
      while (this.keys.length !== 20) {
        this.addKye();
      }
      if (this.draw) this.draw.remove();
      // console.log(this.keys);
      setTimeout(() => { // fix for SVG.js
        this.draw = SVG().addTo('.visualizer__body').size('100%', '100%');
        this.line_container = this.draw.group();
      })
    },
    nextStep: function() {
      if (!this.keys.length) return;
      this.add(this.keys.shift());
    },
    prevStep: function() {

    },
    enableGAL: function() {
      this.gal = true;
    },
    disableGAL: function() {
      this.gal = false;
    },
    add: async function(key: number) {
      this.enableGAL();

      const X = this.draw.node.scrollWidth / 2;
      const Y = this.draw.node.scrollHeight / 2;

      const node = new GNode(key, this.draw, this.line_container);
      this.pq.push(node);

      /**
       * Recalculation of the position of all pq
       * after adding a node to the heap.
       */
      for (let i = 1; i <= this.numberOfNodes(); i++) {
        const node = this.pq[i];
        const height = this.height(node);

        /**
         * Y axis calc
         */
        let y = Y;
        y += height * D * 2;
        y -= this.height() * D;

        /**
         * X axis calc
         */
        let x = X;

        let isLeftNode = Number.isInteger(i/2);
        const parent = this.parent(node);
        if (parent) {
          const exponent = Math.pow(2, this.numberOfLowerLevels(node) + 1) * R;
          if (isLeftNode) {
            x = parent.x - exponent;
          } else {
            x = parent.x + exponent;
          }
        }

        node.move(x, y);
      }

      await sleep(.4);

      if (this.parent(node)) {
        node.lineTo(this.parent(node));
        await sleep(.4);
      }

      this.swim(this.numberOfNodes());
    },
    swim: async function(k: number) {

      while (k > 1 && this.less(int(k/2), k))
      {
        let p = int(k/2); // index of parent node

        const parent: GNode = this.pq[p];
        const target: GNode = this.pq[k];

        // Mark nodes as wrong (red circles)
        parent.wrong();
        target.wrong();
        await sleep(0.4);

        // Swap position of two nodes
        const parentLine = parent.line;
        const targetLine = target.line;
        parent.line = target.line = null;

        const pp: GNode = parent.parent;
        parent.parent = target.parent = null;

        const x = parent.x;
        const y = parent.y;
        parent.move(target.x, target.y);
        target.move(x, y);

        await sleep(0.4);

        parent.line = targetLine;
        target.line = parentLine;

        parent.parent = target;

        // Mark nodes as right (green circles)
        parent.right();
        target.right();

        // Swap inside DS
        this.exch(this.pq, k, p);

        this.updateLinks(k);
        this.updateLinks(p);

        k = p;
      }

      this.disableGAL();
    },
    updateLinks: function(k: number) {
      const parent = this.pq[int(k/2)];
      const lefChild = this.pq[k*2];
      const rightChild = this.pq[(k*2)+1];

      if (parent) this.pq[k].parent = parent;
      if (lefChild) lefChild.parent = this.pq[k];
      if (rightChild) rightChild.parent = this.pq[k];
    },
    less: function(i: number, j: number) {
      return this.pq[i].key < this.pq[j].key;
    },
    exch: function(arr: any[], i: number, j: number) {
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    },
    addKye: function() {
      while (true) {
        const r = window['randint'](0, 101);
        if (this.keys.indexOf(r) === -1) {
          this.keys.push(r);
          return;
        }
      }
    },
    shuffle: function() {
      const N = this.keys.length;
      for (let i = 0; i < N; i++) {
        const r = window['randint'](0, i + 1);
        this.exch(this.keys, i ,r);
      }
      this.keys.reverse(); // Hack: change detection for array in Vue
    },
    zoomIn: function() {
      if (this.zoom === 1) return;
      this.zoom += 0.1;
    },
    zoomOut: function() {
      if (this.zoom === 0.1) return;
      this.zoom -= 0.1;
    },
    resetZoom: function () {
      this.zoom = 1;
    },
    numberOfUpperLevels: function(node: GNode): number {
      let k = this.pq.indexOf(node);
      let h = 0;
      while (k > 1) {
        h = h+1;
        k = int(k/2);
      }
      return h;
    },
    numberOfLowerLevels: function(node: GNode): number {
      return this.height() - this.height(node);
    },
    /**
     * Height of Binary heap
     */
    height: function (node?: GNode) {
      if (node) {
        let k = this.pq.indexOf(node);
        let h = 0;
        while (k > 1) {
          h = h+1;
          k = int(k/2);
        }
        return h;
      } else {
        return int(Math.log2(this.numberOfNodes()));
      }
    },
    depth: function(node: GNode) {
      let k = this.pq.indexOf(node);
      let d = 0;

    },
    /**
     * Number of pq in Binary heap
     */
    numberOfNodes: function () {
      return this.pq.length - 1;
    },
    /**
     * Parent of node in Binary heap
     * @param node
     */
    parent: function (node: GNode) {
      const index = this.pq.indexOf(node);
      return this.pq[int(index / 2)];
    },
  },
  components: {
    'vueSlider': window[ 'vue-slider-component' ],
  }
})
