declare var Vue: any;
declare var rxjs: any;
declare var axios: any;
declare var hljs: any;
declare var ClipboardJS: any;
declare var SVG: any;

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
