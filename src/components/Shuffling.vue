<template>
  <div class="d-flex flex-column h-100 px-3">
    <div class="pt-3 text-right">
      <button v-on:click="init"
              type="button"
              class="btn btn-secondary btn-sm ml-auto">
        <b-icon-arrow-clockwise></b-icon-arrow-clockwise>
      </button>
    </div>
    <div class="d-flex flex-fill flex-column align-items-center justify-content-center">
      <div class="w-100 h-50 d-flex flex-fill flex-column justify-content-end">
        <div class="rows d-flex text-secondary w-100">
          <div v-for="(item, i) in items" v-bind:key="item" class="text-monospace">[{{ i }}]</div>
        </div>

        <div class="items rows d-flex w-100 mt-3">
          <div v-for="item in items" v-bind:key="item">{{ item }}</div>
        </div>
      </div>
      <div class="w-100 h-50 d-flex flex-fill flex-column justify-content-start">
        <div v-if="!(isLastStep && !lock)" class="rows d-flex w-100 mt-3">
          <div v-for="(item, _i) in items" v-bind:key="item">
            <div v-if="i === _i" class="pointer red text-monospace"></div>
            <div v-if="r === _i" class="pointer green text-monospace"></div>
          </div>
        </div>

        <div v-if="isLastStep && !lock" class="w-100 mt-5">
          <div class="text-secondary">
            Finished! Source array was:
          </div>
          <div class="d-flex align-items-center mt-2">
            <div>[</div>
            <div class="items rows d-flex w-100">
              <div v-for="(item, key) in snapshot" v-bind:key="item">
                {{ item }}
                <span v-if="key !== snapshot.length - 1">,</span>
              </div>
            </div>
            <div>]</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pb-3 text-center">
      <button v-on:click="nextStep" type="button" class="btn btn-secondary" :disabled="lock">
        next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {BIconArrowClockwise, BIconSkipStartFill} from 'bootstrap-vue'
import {BaseComponent} from '../utils/base-component'
import {timer} from 'rxjs'
import {random, clone} from 'lodash';

Vue.component('BIconSkipStartFill', BIconSkipStartFill);
Vue.component('BIconArrowClockwise', BIconArrowClockwise);

@Component
export default class Shuffling extends BaseComponent {
  items: any = null;
  snapshot: any = null;
  i = 0;
  r = 0;
  lock = false;

  created() {
    this.init();
  }

  init() {
    this.items = ['Ali', 'Ben', 'Dan', 'Eva', 'Jay', 'Kit', 'Leo', 'Max', 'Rob', 'Tom'];
    this.snapshot = clone(this.items);
    this.i = 0;
    this.r = null;
  }

  get isLastStep(): boolean {
    return this.i === this.items.length - 1;
  }

  async nextStep(): Promise<any> {
    if (this.isLastStep) return;
    this.lock = true;
    this.i++;
    await timer(500).toPromise();
    this.r = random(this.i - 1);
    await timer(500).toPromise();
    const origin: HTMLElement = this.$el.querySelector(`.items > *:nth-child(${this.i + 1})`);
    const target: HTMLElement = this.$el.querySelector(`.items > *:nth-child(${this.r + 1})`);
    const originRect: DOMRect = origin.getBoundingClientRect();
    const targetRect: DOMRect = target.getBoundingClientRect();
    origin.style.transform = `translateX(${targetRect.left - originRect.left}px)`;
    target.style.transform = `translateX(${originRect.left - targetRect.left}px)`;
    await timer(500).toPromise();
    origin.style.transition = 'none';
    target.style.transition = 'none';
    await timer(100).toPromise();
    origin.style.transform = null;
    target.style.transform = null;
    [this.items[this.i], this.items[this.r]] = [this.items[this.r], this.items[this.i]];
    this.items.splice(0, 0);
    await timer(100).toPromise();
    origin.style.transition = null;
    target.style.transition = null;
    this.lock = false;
  }
}
</script>

<style lang="scss" scoped>
.rows {
  & > * {
    width: 10%;
    text-align: center;
  }
}

.items > * {
  transition: all .5s;
}

.pointer {
  text-align: center;

  &.red:before {
    border-bottom-color: red;
  }

  &.red:after {
    content: "i";
  }

  &.green:before {
    border-bottom-color: green;
  }

  &.green:after {
    content: "r";
  }

  &:before {
    width: 0;
    height: 0;
    border: 6px solid transparent;
    margin: 0 auto;
    content: "";
    display: block;
  }

  &:after {
    display: block;
  }
}
</style>
