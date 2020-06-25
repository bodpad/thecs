<template>
    <div class="p-0 invisible-scrollbar d-flex flex-column h-100" style="background: #333;">
        <div class="d-flex align-items-center p-2">

            <a class="btn btn-secondary btn-sm ml-auto"
               v-bind:href="implementation.extension"
               v-bind:download="implementation.filename">
                <b-icon-download></b-icon-download>
            </a>

            <button type="button"
                    class="btn btn-secondary btn-sm ml-1"
                    :disabled="!implementation.sourcecode"
                    v-clipboard:copy="implementation.sourcecode">
                <b-icon-clipboard></b-icon-clipboard>
            </button>

            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle btn-sm ml-1"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                    {{implementation.language}}
                </button>

                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <button v-for="implementation in implementations"
                            v-on:click="getImplementation(implementation)"
                            v-bind:key="implementation.extension"
                            class="dropdown-item">
                        {{implementation.language}}
                    </button>
                </div>
            </div>

        </div>

        <div class="flex-fill overflow-auto">
            <pre><code></code></pre>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import hljs from 'highlight.js';
    import { BIconDownload, BIconClipboard } from 'bootstrap-vue';
    import VueClipboard from 'vue-clipboard2';

    Vue.use(VueClipboard)

    Vue.component('BIconDownload', BIconDownload);
    Vue.component('BIconClipboard', BIconClipboard);

    interface Implementation {
        language: string;
        filename: string;
        extension: string;
        sourcecode: string;
    }

    @Component
    export default class CodeViewer extends Vue {
      implementations: Implementation[] = null;
      implementation: Implementation = null;

      created () {
          this.implementations = JSON.parse(document.getElementById('algorithm-implementations-data').textContent);
          this.implementation = this.implementations[0];
          this.getImplementation(this.implementation)
      }

      async getImplementation(implementation: Implementation) {
          this.implementation = implementation;
          const resp = await this.$http.get(`${location.pathname}${implementation.extension}/`);
          Vue.set(this.implementation, 'sourcecode', resp.data);
          this.$el.querySelector('code').innerHTML = this.implementation.sourcecode;
          hljs.highlightBlock(this.$el.querySelector('code'));
      }
    }
</script>

<style lang="scss" scoped>

</style>
