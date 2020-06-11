var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Diameter of Node
const D = 28;
// Radius of Node
const R = D / 2;
/**
 * Delay execution for a given number of seconds.  The argument may be
 * a floating point number for subsecond precision.
 */
function sleep(seconds) {
    return __awaiter(this, void 0, void 0, function* () {
        yield rxjs.timer(seconds * 1000).toPromise();
    });
}
function isInt(x) {
    return x % 1 === 0;
}
function int(x) {
    return Math.floor(x);
}
class GNode {
    constructor(key, draw, linesContainer) {
        this.parent = null;
        this.history = [];
        this.key = key;
        this.lc = linesContainer;
        this.el = draw.group();
        this.circle = this.el.circle(D);
        this.circle.fill('#fff');
        this.circle.stroke({ color: '#28A745', width: 2 });
        this.text = this.el.plain(key);
        this.text.move(14, 3);
        this.text.font({ size: 13, family: 'monospace', anchor: 'middle' });
    }
    wrong() {
        this.circle.stroke({ color: 'red' });
    }
    right() {
        this.circle.stroke({ color: '#28A745' });
    }
    historyPush() {
    }
    move(x, y) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.history.push([x, y]);
            this.el.animate().cx(x).cy(y);
            if (this.line && this.parent) {
                this.line.animate().plot(this.x, this.y, this.parent.x, this.parent.y);
            }
            yield sleep(400);
            resolve();
        }));
    }
    get x() {
        const last = this.history.length - 1;
        return this.history[last][0];
    }
    get y() {
        const last = this.history.length - 1;
        return this.history[last][1];
    }
    lineTo(node) {
        this.parent = node;
        this.line = this.lc.line(this.x, this.y, node.x, node.y);
        this.line.animate().stroke({ color: '#222', width: 1 });
    }
}
var visualizer = new Vue({
    el: '#visualizer',
    data: {
        value: 0,
        keys: null,
        draw: null,
        zoom: 1,
        line_container: null,
        pq: null,
        options: {}
    },
    created: function () {
        this.init();
    },
    methods: {
        init: function () {
            this.pq = [null];
            this.keys = [];
            while (this.keys.length !== 20) {
                this.addKye();
            }
            if (this.draw)
                this.draw.remove();
            // console.log(this.keys);
            setTimeout(() => {
                this.draw = SVG().addTo('.visualizer__body').size('100%', '100%');
                this.line_container = this.draw.group();
            });
        },
        nextStep: function () {
            if (!this.keys.length)
                return;
            this.add(this.keys.shift());
        },
        add: function (key) {
            return __awaiter(this, void 0, void 0, function* () {
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
                    let isLeftNode = Number.isInteger(i / 2);
                    const parent = this.parent(node);
                    if (parent) {
                        const exponent = Math.pow(2, this.numberOfLowerLevels(node) + 1);
                        if (isLeftNode) {
                            x = parent.x - (exponent * R);
                        }
                        else {
                            x = parent.x + (exponent * R);
                        }
                    }
                    node.move(x, y);
                }
                yield sleep(.4);
                if (this.parent(node)) {
                    node.lineTo(this.parent(node));
                    yield sleep(.4);
                }
                this.swim(this.numberOfNodes());
            });
        },
        swim: function (k) {
            return __awaiter(this, void 0, void 0, function* () {
                while (k > 1 && this.less(int(k / 2), k)) {
                    let p = int(k / 2); // index of parent node
                    const parent = this.pq[p];
                    const target = this.pq[k];
                    // Mark nodes as wrong (red circles)
                    parent.wrong();
                    target.wrong();
                    yield sleep(0.4);
                    // Swap position of two nodes
                    const parentLine = parent.line;
                    const targetLine = target.line;
                    parent.line = target.line = null;
                    const pp = parent.parent;
                    parent.parent = target.parent = null;
                    const x = parent.x;
                    const y = parent.y;
                    parent.move(target.x, target.y);
                    target.move(x, y);
                    yield sleep(0.4);
                    parent.line = targetLine;
                    target.line = parentLine;
                    parent.parent = target;
                    // Mark nodes as right (green circles)
                    parent.right();
                    target.right();
                    // Swap inside DS
                    this.exch(this.pq, k, p);
                    let lefChild = null;
                    let rightChild = null;
                    lefChild = this.pq[k * 2];
                    rightChild = this.pq[(k * 2) + 1];
                    if (lefChild)
                        lefChild.parent = this.pq[k];
                    if (rightChild)
                        rightChild.parent = this.pq[k];
                    lefChild = this.pq[p * 2];
                    rightChild = this.pq[(p * 2) + 1];
                    if (lefChild)
                        lefChild.parent = this.pq[p];
                    if (rightChild)
                        rightChild.parent = this.pq[p];
                    k = p;
                }
            });
        },
        less: function (i, j) {
            return this.pq[i].key < this.pq[j].key;
        },
        exch: function (arr, i, j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        },
        addKye: function () {
            while (true) {
                const r = window['randint'](0, 101);
                if (this.keys.indexOf(r) === -1) {
                    this.keys.push(r);
                    return;
                }
            }
        },
        shuffle: function () {
            const N = this.keys.length;
            for (let i = 0; i < N; i++) {
                const r = window['randint'](0, i + 1);
                this.exch(this.keys, i, r);
            }
            this.keys.reverse(); // Hack: change detection for array in Vue
        },
        zoomIn: function () {
            if (this.zoom === 1)
                return;
            this.zoom += 0.1;
        },
        zoomOut: function () {
            if (this.zoom === 0.1)
                return;
            this.zoom -= 0.1;
        },
        resetZoom: function () {
            this.zoom = 1;
        },
        numberOfUpperLevels: function (node) {
            let k = this.pq.indexOf(node);
            let h = 0;
            while (k > 1) {
                h = h + 1;
                k = int(k / 2);
            }
            return h;
        },
        numberOfLowerLevels: function (node) {
            return this.height() - this.height(node);
        },
        /**
         * Height of Binary heap
         */
        height: function (node) {
            if (node) {
                let k = this.pq.indexOf(node);
                let h = 0;
                while (k > 1) {
                    h = h + 1;
                    k = int(k / 2);
                }
                return h;
            }
            else {
                return int(Math.log2(this.numberOfNodes()));
            }
        },
        depth: function (node) {
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
        parent: function (node) {
            const index = this.pq.indexOf(node);
            return this.pq[int(index / 2)];
        },
    },
    components: {
        'vueSlider': window['vue-slider-component'],
    }
});
var implementation = new Vue({
    el: '#implementation',
    data: {
        implementations: [],
        implementation: null
    },
    created: function () {
        this.implementations = JSON.parse(document.getElementById('algorithm-implementations-data').textContent);
        this.implementation = this.implementations[0];
        this.getImplementation(this.implementation);
    },
    methods: {
        getImplementation: function (implementation) {
            return __awaiter(this, void 0, void 0, function* () {
                this.implementation = implementation;
                const resp = yield axios.get(`/implementation/${implementation.filename}/`);
                this.$set(this.implementation, 'code', resp.data);
                const block = document.querySelector('pre code');
                block.innerHTML = resp.data;
                hljs.initHighlighting.called = false;
                hljs.highlightBlock(block);
            });
        }
    }
});
var triptych = new Vue({
    el: '#triptych',
    data: {
        leftHidden: JSON.parse(localStorage.getItem('triptych') || '{}').leftHidden,
        centerHidden: JSON.parse(localStorage.getItem('triptych') || '{}').centerHidden,
        rightHidden: JSON.parse(localStorage.getItem('triptych') || '{}').rightHidden,
    },
    created: function () {
        if (this.leftHidden)
            this.hideLeft(false);
        if (this.centerHidden)
            this.hideCenter(false);
        if (this.rightHidden)
            this.hideRight(false);
    },
    methods: {
        hideLeft: function (saveState = true) {
            if (saveState) {
                this.leftHidden = !this.leftHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.leftHidden = this.leftHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el = document.querySelector('.triptych > *:nth-child(1)');
            if (this.leftHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            }
            else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        },
        hideCenter: function (saveState = true) {
            if (saveState) {
                this.centerHidden = !this.centerHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.centerHidden = this.centerHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el = document.querySelector('.triptych > *:nth-child(2)');
            if (this.centerHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            }
            else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        },
        hideRight: function (saveState = true) {
            if (saveState) {
                this.rightHidden = !this.rightHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.rightHidden = this.rightHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el = document.querySelector('.triptych > *:nth-child(3)');
            if (this.rightHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            }
            else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        }
    }
});
