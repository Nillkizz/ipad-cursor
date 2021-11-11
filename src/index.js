import './style.sass';

import { SVG } from '@svgdotjs/svg.js'
import KUTE from 'kute.js'

import { debug, DOMElement } from './helpers.js'

class Cursor {
  constructor() {
    this.elId = 'ipad-cursor'
    this.evListeners = []
    this.size = 20
    this.width = 20
    this.height = 20
    this.color = '#00000080'
    this.pos = {
      x: 0,
      y: 0,
    }
    this.cache = {
      isVisible: false
    }
    this.mouseMoveCount = 0
    this.init();

    this.debugData = {}
    this.updateDebug()
    this.debugFrames = 0
  }
  get cx() { return this.pos.x - this.width / 2 }
  get cy() { return this.pos.y - this.height / 2 }
  get isVisible() { return this.mouseMoveCount > 1 }
  init() {
    this.DE = new DOMElement('div').setAttrs({ id: this.elId }).appendChildTo('body');
    this.el = this.DE.el;
    this.svg = SVG().addTo(`#${this.el.id}`).size(this.width, this.height).circle(this.size).fill(this.color)
    this.animate();
    this.initEvListeners();
  }
  initEvListeners() {
    this.evListeners = [
      document.body.addEventListener('mousemove', (e) => this.onMouseMove(e)),
      document.body.addEventListener('mouseleave', () => this.hide()),
      document.body.addEventListener('touchend', () => this.hide())
    ]
  }
  onMouseMove(e) {
    this.pos.x = e.clientX;
    this.pos.y = e.clientY;
    this.mouseMoveCount++
  }
  hide() {
    this.mouseMoveCount = 0
  }
  animate() {
    const newValues = {
      isVisible: this.isVisible,
    }
    // const element = document.elementFromPoint(this.pos.x, this.pos.y);
    if (this.cache.isVisible != newValues.isVisible) {
      this.el.classList.toggle('visible', newValues.isVisible)
    }

    this.el.style.left = this.cx + 'px'
    this.el.style.top = this.cy + 'px'
    this.updateCache(newValues)
    requestAnimationFrame(this.animate.bind(this))
  }

  updateCache(newValues) {
    Object.assign(this.cache, newValues);
  }

  updateDebug() {
    const debugData = {
      visible: this.isVisible,
    }

    const skipFrames = 6;
    const isThrottling = this.debugFrames % skipFrames != 0;
    const hasUpdates = JSON.stringify(this.debugData) != JSON.stringify(debugData);

    if (hasUpdates && !isThrottling) {
      debug(debugData)
      this.debugData = debugData;
    }
    this.debugFrames++
    requestAnimationFrame(this.updateDebug.bind(this))
  }
}
document.addEventListener('mousemove', () => {
  window.cursor = new Cursor();
}, { once: true })