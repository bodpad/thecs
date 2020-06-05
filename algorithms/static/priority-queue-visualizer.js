var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function int(x) {
    return Math.floor(x);
}
var GNode = /** @class */ (function () {
    function GNode(key, x, y, canvas) {
        this.key = key;
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        var el = document.createElement('div');
        el.classList.add('node');
        el.innerHTML = this.key.toString();
        el.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
        this.nativeElement = el;
        this.render();
    }
    GNode.prototype.render = function () {
        this.canvas.appendChild(this.nativeElement);
    };
    return GNode;
}());
var visualizer = new Vue({
    el: '#visualizer',
    data: {
        value: 0,
        playing: false,
        keys: [],
        zoom: 1,
        nodes: [null],
        options: {
            dotSize: 14,
            width: 'auto',
            height: 4,
            contained: false,
            direction: 'ltr',
            data: null,
            min: 0,
            max: 10,
            interval: 1,
            disabled: false,
            clickable: true,
            duration: 0.5,
            adsorb: true,
            lazy: false,
            tooltip: 'active',
            tooltipPlacement: 'top',
            tooltipFormatter: void 0,
            useKeyboard: false,
            keydownHook: null,
            dragOnClick: false,
            enableCross: true,
            fixed: false,
            minRange: void 0,
            maxRange: void 0,
            order: true,
            marks: false,
            dotOptions: void 0,
            process: true,
            dotStyle: void 0,
            railStyle: void 0,
            processStyle: void 0,
            tooltipStyle: void 0,
            stepStyle: void 0,
            stepActiveStyle: void 0,
            labelStyle: void 0,
            labelActiveStyle: void 0,
        }
    },
    created: function () {
        this.reloadState();
        // this.play();
    },
    methods: {
        play: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.playing = !this.playing;
                            _a.label = 1;
                        case 1:
                            if (!this.keys.length) return [3 /*break*/, 3];
                            if (!this.playing)
                                return [2 /*return*/];
                            this.addGNode(this.keys.shift());
                            return [4 /*yield*/, rxjs.timer(1000).toPromise()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        nextStep: function () {
            this.addGNode(this.keys.shift());
        },
        addGNode: function (key) {
            var canvas = document.querySelector('.visualizer__body__container');
            var x, y = 0;
            if (this.numberOfNodes() === 0) {
                x = canvas.offsetWidth / 2;
                y = canvas.offsetHeight / 2;
            }
            else {
            }
            var node = new GNode(key, x, y, canvas);
            this.nodes.push(node);
        },
        addKye: function () {
            while (true) {
                var r = window['randint'](0, 101);
                if (this.keys.indexOf(r) === -1) {
                    this.keys.push(r);
                    return;
                }
            }
        },
        reloadState: function () {
            this.keys = [];
            while (this.keys.length !== 10) {
                this.addKye();
            }
        },
        shuffle: function () {
            var N = this.keys.length;
            for (var i = 0; i < N; i++) {
                var r = window['randint'](0, i + 1);
                this.exch(this.keys, i, r);
            }
            this.keys.reverse();
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
        exch: function (arr, i, j) {
            var v = arr[i];
            arr[i] = arr[j];
            arr[j] = v;
        },
        /**
         * Height of Binary heap
         */
        height: function (node) {
            if (node) {
                var index = this.nodes.indexOf(node);
                while (false) {
                }
            }
            else {
                return int(Math.log2(this.numberOfNodes()));
            }
        },
        /**
         * Number of nodes in Binary heap
         */
        numberOfNodes: function () {
            return this.nodes.length - 1;
        },
        /**
         * Parent of node in Binary heap
         * @param node
         */
        parent: function (node) {
            var index = this.nodes.indexOf(node);
            return this.nodes[int(index / 2)];
        }
    },
    components: {
        'vueSlider': window['vue-slider-component'],
    }
});
