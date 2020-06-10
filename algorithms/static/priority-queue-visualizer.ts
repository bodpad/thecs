declare var Vue: any;
declare var rxjs: any;
declare var axios: any;
declare var hljs: any;
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
        if (this.parent) this.updateLinePosition();
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
    updateLinePosition() {
        this.line.animate().plot(this.x, this.y, this.parent.x, this.parent.y);
    }
}

var visualizer = new Vue({
    el: '#visualizer',
    data: {
        value: 0,
        keys: [],
        draw: null,
        zoom: 1,
        line_container: null,
        pq: [null],
        options: { }
    },
    created: function () {
        this.reloadState();
        setTimeout(() => {
            this.draw = SVG().addTo('.visualizer__body').size('100%', '100%');
            this.line_container = this.draw.group();

            document.querySelector('g').addEventListener("animationstart", function() {
                console.log(3);
            }, false);
        })


    },
    watch: {
        pq: function (val, oldVal) {
            // console.log(val, oldVal);
            // console.log(this._watchers[0])
        }
    },
    methods: {
        nextStep: function() {
            if (!this.keys.length) return;
            this.add(this.keys.shift());
        },
        add: async function(key: number) {
            const X = 255;
            const Y = 200;
            const node = new GNode(key, this.draw, this.line_container);
            this.pq.push(node);

            // Recalculation of the position of all pq
            // after adding a node to the heap.
            for (let i = 1; i <= this.numberOfNodes(); i++) {
                const node = this.pq[i];
                const height = this.height(node);

                // y axis calc
                let y = Y;
                y += height * D * 2;
                y -= this.height() * D;

                // x axis calc
                let x = X;

                let isLeftNode = Number.isInteger(i/2);
                const parent = this.parent(node);
                if (parent) {
                    const exponent = Math.pow(2, this.numberOfLowerLevels(node) + 1);
                    if (isLeftNode) {
                        x = parent.x - (exponent * R);
                    } else {
                        x = parent.x + (exponent * R);
                    }
                }

                node.move(x, y);
            }

            await sleep(.5);
            if (this.parent(node)) node.lineTo(this.parent(node));
        },
        swim: async function(k: number) {
            while (k > 1 && this.less(k/2, k))
            {
                const n1: GNode = this.pq[k];
                const n2: GNode = this.pq[k/2];
                n1.wrong();
                n2.wrong();
                await sleep(0.8);
                const x = n1.x;
                const y = n1.y;
                n1.move(n2.x, n2.y);
                n2.move(x, y);
                await sleep(0.4);
                n1.right();
                n2.right();

                this.exch(k, k/2);
                k = k/2;
            }
        },
        less: function(i, j) {
            return this.pq[i].key < this.pq[j].key;
        },
        exch: function(i, j) {
            const temp = this.pq[i];
            this.pq[i] = this.pq[j];
            this.pq[j] = temp;
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
        reloadState: function() {
            this.pq = [null];
            this.keys = [];
            while (this.keys.length !== 10) {
                this.addKye();
            }
        },
        shuffle: function() {
            const N = this.keys.length;
            for (let i = 0; i < N; i++) {
                const r = window['randint'](0, i + 1);
                this.exch(this.keys, i ,r);
            }
            this.keys.reverse();
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

var implementation = new Vue({
    el: '#implementation',
    data: {
        implementations: [],
        implementation: null
    },
    created: function () {
        this.implementations = JSON.parse(document.getElementById('algorithm-implementations-data').textContent);
        this.implementation = this.implementations[0];
        this.getImplementation(this.implementation)
    },
    methods: {
        getImplementation: async function(implementation: any) {
            this.implementation = implementation;
            const resp = await axios.get(`/implementation/${implementation.filename}/`);
            this.$set(this.implementation, 'code', resp.data)
            const block = document.querySelector('pre code');
            block.innerHTML = resp.data;
            hljs.initHighlighting.called = false;
            hljs.highlightBlock(block);
        }
    }
})

var triptych = new Vue({
    el: '#triptych',
    data: {
        leftHidden: JSON.parse(localStorage.getItem('triptych') || '{}').leftHidden,
        centerHidden: JSON.parse(localStorage.getItem('triptych') || '{}').centerHidden,
        rightHidden: JSON.parse(localStorage.getItem('triptych') || '{}').rightHidden,
    },
    created: function () {
        if (this.leftHidden) this.hideLeft(false);
        if (this.centerHidden) this.hideCenter(false);
        if (this.rightHidden) this.hideRight(false);
    },
    methods: {
        hideLeft: function (saveState: boolean = true) {
            if (saveState) {
                this.leftHidden = !this.leftHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.leftHidden = this.leftHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el: HTMLElement = document.querySelector('.triptych > *:nth-child(1)');
            if (this.leftHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            } else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        },
        hideCenter: function (saveState: boolean = true) {
            if (saveState) {
                this.centerHidden = !this.centerHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.centerHidden = this.centerHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el: HTMLElement = document.querySelector('.triptych > *:nth-child(2)');
            if (this.centerHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            } else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        },
        hideRight: function (saveState: boolean = true) {
            if (saveState) {
                this.rightHidden = !this.rightHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.rightHidden = this.rightHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el: HTMLElement = document.querySelector('.triptych > *:nth-child(3)');
            if (this.rightHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            } else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        }
    }
});
