import './style.sass';

import { SVG } from '@svgdotjs/svg.js'
import KUTE from 'kute.js'

import { debug, DOMElement } from './helpers.js'

class Cursor {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.elId = 'ipad-cursor'
    this.size = 20
    this.width = 20
    this.height = 20
    this.cx = this.width / 2
    this.cy = this.height / 2
    this.color = '#00000080'
    this.isVisible = false
    this.init();

    this.debugData = {}
    this.updateDebug()
    this.debugFrames = 0
  }
  init() {
    this.DE = new DOMElement('div').setAttrs({ id: this.elId }).appendChildTo('body');
    this.el = this.DE.el;
    this.svg = SVG().addTo(`#${this.el.id}`).size(this.width, this.height).circle(this.size).fill(this.color)
    document.addEventListener('mousemove', this.toggleVisible(true), { once: true })
    document.addEventListener('mousemove', this.onMouseMove.bind(this))
    document.body.addEventListener('mouseenter', () => this.toggleVisible(true))
    document.body.addEventListener('mouseleave', () => this.toggleVisible(false))
    this.animate();
  }
  onMouseMove(e) {
    this.x = e.clientX;
    this.y = e.clientY;
  }
  toggleVisible(val) {
    if (val == this.isVisible) return
    if (typeof val === "boolean") {
      this.el.classList.toggle('visible', val)
      this.isVisible = val
    } else {
      this.isVisible = !this.visible
      this.el.classList.toggle('visible', this.isVisible)
    }
  }
  animate() {
    const element = document.elementFromPoint(this.x, this.y);

    this.el.style.left = this.x - this.cx + 'px'
    this.el.style.top = this.y - this.cy + 'px'
    requestAnimationFrame(this.animate.bind(this))
  }

  updateDebug() {
    const skipFrames = 6;
    const hasUpdates = JSON.stringify(this.debugData) != JSON.stringify(debugData);
    const isThrottling = this.debugFrames % skipFrames != 0;
    const debugData = {
      visible: this.isVisible,
    }

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