<template>
  <div class="p-0 invisible-scrollbar overflow-hidden d-flex flex-column h-100">
    <div class="d-flex align-items-center p-2">
      <div class="dropdown">
        <button
            class="btn btn-secondary dropdown-toggle btn-sm"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
          {{ implementation.language }}
        </button>

        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <button
              v-for="implementation in implementations"
              v-on:click="getImplementation(implementation)"
              v-bind:key="implementation.extension"
              class="dropdown-item">
            {{ implementation.language }}
          </button>
        </div>
      </div>

      <a class="btn btn-secondary btn-sm ml-1"
         v-bind:href="implementation.extension"
         v-bind:download="implementation.filename">
        <b-icon-download></b-icon-download>
      </a>

      <button
          v-if="clipboardIsSupported"
          type="button"
          class="btn btn-secondary btn-sm ml-1"
          :disabled="!implementation.sourcecode"
          v-on:click="copyToClipBoard">
        <b-icon-clipboard></b-icon-clipboard>
      </button>

      <div class="dropdown ml-auto">
        <button
            class="btn btn-secondary dropdown-toggle btn-sm"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
          {{t('Theme')}}: <b>{{ selectedTheme }}</b>
        </button>

        <div class="dropdown-menu overflow-auto" aria-labelledby="dropdownMenuButton" style="max-height: 50vh">
          <button
              v-for="theme in themes"
              :disabled="selectedTheme == theme"
              v-on:click="setCodeStyle(theme)"
              class="dropdown-item">
            {{ theme }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex-fill overflow-auto">
      <pre><code v-bind:class="implementation.extension"></code></pre>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {BaseComponent} from '../utils/base-component';
import hljs from 'highlight.js';
import {BIconDownload, BIconClipboard} from 'bootstrap-vue';

declare const ClipboardJS: any;

Vue.component('BIconDownload', BIconDownload);
Vue.component('BIconClipboard', BIconClipboard);

interface Implementation {
  language: string;
  filename: string;
  extension: string;
  sourcecode: string;
}

@Component
export default class CodeViewer extends BaseComponent {
  implementations: Implementation[] = null;
  implementation: Implementation = null;
  selectedTheme = '';
  themes = [
    'Default',
    // 'A 11 Y Dark',
    // 'A 11 Y Light',
    'Agate',
    'An Old Hope',
    'Androidstudio',
    'Arduino Light',
    'Arta',
    'Ascetic',
    // 'Atelier Cave Dark',
    // 'Atelier Cave Light',
    // 'Atelier Dune Dark',
    // 'Atelier Dune Light',
    // 'Atelier Estuary Dark',
    // 'Atelier Estuary Light',
    // 'Atelier Forest Dark',
    // 'Atelier Forest Light',
    // 'Atelier Heath Dark',
    // 'Atelier Heath Light',
    // 'Atelier Lakeside Dark',
    // 'Atelier Lakeside Light',
    // 'Atelier Plateau Dark',
    // 'Atelier Plateau Light',
    // 'Atelier Savanna Dark',
    // 'Atelier Savanna Light',
    // 'Atelier Seaside Dark',
    // 'Atelier Seaside Light',
    // 'Atelier Sulphurpool Dark',
    // 'Atelier Sulphurpool Light',
    'Atom One Dark Reasonable',
    'Atom One Dark',
    'Atom One Light',
    // 'Brown Paper',
    'Codepen Embed',
    'Color Brewer',
    'Darcula',
    'Dark',
    'Docco',
    'Dracula',
    'Far',
    'Foundation',
    'Github Gist',
    'Github',
    'Gml',
    'Googlecode',
    // 'Gradient Dark',
    // 'Grayscale',
    // 'Gruvbox Dark',
    // 'Gruvbox Light',
    'Hopscotch',
    'Hybrid',
    'Idea',
    'Ir Black',
    'Isbl Editor Dark',
    'Isbl Editor Light',
    'Kimbie Dark',
    'Kimbie Light',
    'Lightfair',
    'Lioshi',
    'Magula',
    'Mono Blue',
    'Monokai Sublime',
    'Monokai',
    'Night Owl',
    'Nnfx Dark',
    'Nnfx',
    'Nord',
    'Obsidian',
    'Ocean',
    'Paraiso Dark',
    'Paraiso Light',
    'Pojoaque',
    'Purebasic',
    'Qtcreator Dark',
    'Qtcreator Light',
    'Railscasts',
    'Rainbow',
    'Routeros',
    'School Book',
    'Shades Of Purple',
    'Solarized Dark',
    'Solarized Light',
    'Srcery',
    'Sunburst',
    'Tomorrow Night Blue',
    'Tomorrow Night Bright',
    'Tomorrow Night Eighties',
    'Tomorrow Night',
    'Tomorrow',
    'Vs',
    'Vs 2015',
    'Xcode',
    // 'Xt 256',
    'Zenburn',
  ]
  translations = {
    ru: {
      "Theme": "Тема",
    }
  }

  created()
  {
    this.implementations = JSON.parse(document.getElementById('algorithm-implementations-data').textContent);
    this.implementation = this.implementations[0];
    this.getImplementation(this.implementation);
  }

  mounted()
  {
    const codeStyle = localStorage.getItem('hljsTheme') ?
        localStorage.getItem('hljsTheme') :
        this.themes[0];

    this.setCodeStyle(codeStyle);
  }

  copyToClipBoard(e: any)
  {
    const button = e.target.closest('button');
    new ClipboardJS(button, {
      container: this.$el,
      text: () => this.implementation.sourcecode
    });
  }

  get clipboardIsSupported(): boolean
  {
    return ClipboardJS.isSupported();
  }

  setCodeStyle(theme: string)
  {
    this.selectedTheme = theme;
    localStorage.setItem('hljsTheme', theme);

    const currentCodeStyle: HTMLElement = document.getElementById('hljsTheme');
    if (currentCodeStyle) currentCodeStyle.remove();

    const codeStyle = document.createElement('link');
    codeStyle.href = `/static/highlight.js/styles/${theme.replace(/ /g, '-').toLowerCase()}.css`;
    codeStyle.id = 'hljsTheme';
    codeStyle.rel = 'stylesheet';
    document.head.appendChild(codeStyle);
    codeStyle.onload = () => {
      setTimeout(() => {
        const hljsBgColor: string = window
            .getComputedStyle(this.$el.querySelector('code') ,null)
            .getPropertyValue('background-color');
        (this.$el as HTMLElement).style.backgroundColor = hljsBgColor;
      });
    }
  }

  async getImplementation(implementation: Implementation)
  {
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
