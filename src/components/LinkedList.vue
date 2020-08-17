<template>
  <div class="d-flex flex-column h-100 px-3">
    <div class="pt-3 d-flex align-items-center">
      <div class="d-flex align-items-center queue text-pre">
        <div>[</div>
        <div v-for="(item, i) in queue"
             class="queue__item"
             v-bind:key="item.key">
          {{ item.value }}
          <template v-if="queue.length !== (i+1)">,&nbsp;</template>
        </div>
        <div>]</div>
      </div>
      <button
          v-on:click="init"
          type="button"
          class="btn btn-secondary btn-sm ml-auto">
        <b-icon-arrow-clockwise></b-icon-arrow-clockwise>
      </button>
    </div>
    <div class="body d-flex align-items-center flex-fill overflow-auto">
      <div class="px-4">
        <div class="nodes d-flex">
          <div v-for="(node, i) in nodes"
               v-bind:key="node.key"
               class="node d-flex align-items-end">
            <div>
              <div class="text-12 text-secondary">instance of</div>

              <pre class="text-12 code text-monospace">
<span class="text-secondary">class Node&lt;T&gt; {</span>
  <span class="text-secondary">// data == <b>{{ node.value }}</b></span>
  <span class="text-secondary">public T data;</span>
  public Node next;
<span class="text-secondary">}</span>
</pre>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="106px" width="60px">
              <path d="M0 72 C 30 72, 35 53, 60 53" stroke="#007bff" stroke-width="2px" fill="transparent"/>
              <path d="M54 49 60 53 54 57" stroke="#007bff" stroke-width="1px" fill="#007bff"/>
            </svg>
            <div v-if="nodes.length === (i+1)" class="null-pointer">null</div>
          </div>
        </div>

        <div v-if="!linkedListIsEmpty()" class="pointer-to-first">
          private Node first;
        </div>
      </div>
    </div>
    <div class="py-3 text-center">
      <button
          v-on:click="add"
          type="button"
          class="btn btn-secondary"
          :disabled="lock">+
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {timer} from 'rxjs';
import {shuffle} from 'lodash';
import {BaseComponent} from '../utils/base-component'
import {BIconArrowClockwise} from 'bootstrap-vue'

Vue.component('BIconArrowClockwise', BIconArrowClockwise);

@Component
export default class LinkedList extends BaseComponent {
  lock = false;
  queue: any[] = []
  nodes: any[] = [];

  created() {
    this.init();
  }

  init() {
    this.queue = shuffle([
      {key: 0, value: 'Ali'},
      {key: 1, value: 'Ban'},
      {key: 2, value: 'Dan'},
      {key: 3, value: 'Eva'},
      {key: 4, value: 'Jay'},
      {key: 5, value: 'Kit'},
      {key: 6, value: 'Leo'},
      {key: 7, value: 'Max'},
      {key: 8, value: 'Rob'},
      {key: 9, value: 'Tom'}
    ]);
    this.nodes = [];
    this.lock = false;
  }

  linkedListIsEmpty() {
    return this.nodes.length === 0;
  }

  async add() {
    this.$el.querySelector('.body').scrollTo(0, 0);
    if (this.nodes.length > 0) {
      this.lock = true;
      const nodesContainer: HTMLElement = this.$el.querySelector('.nodes');
      nodesContainer.style.transition = 'padding 250ms';
      nodesContainer.style.paddingLeft = '210px';
      await timer(300).toPromise();
      nodesContainer.style.transition = null;
      nodesContainer.style.paddingLeft = null;
      this.lock = false;
    }

    this.nodes.unshift(this.queue.shift());
    if (!this.queue.length) this.lock = true;
  }
}
</script>

<style lang="scss" scoped>
.code {
  white-space: pre;
  background: #fff;
  box-shadow: 0 0 4px #ccc;
  border-radius: 4px;
  padding: 8px;
}

.node svg {
  margin-left: -6px;
}

.null-pointer {
  height: 106px;
  display: flex;
  align-items: center;
  padding: 8px;
}

.pointer-to-first {
  width: 175px;
  text-align: center;
  margin-top: 10px;

  &:before {
    content: "↑";
    display: block;
  }
}
</style>
