exports.DOMElement = class DOMElement {
  constructor(el) {
    if (el instanceof Element) this.el = el;
    else if (typeof el === 'string') this.el = document.createElement(el);
  }
  setAttrs(attrs) {
    Object.assign(this.el, attrs);
    return this;
  }
  appendChildTo(el) {
    if (el instanceof Element) el.appendChild(this.el);
    else if (typeof el === "string") switch (el) {
      case 'head':
        document.head.appendChild(this.el);
        break;
      case 'body':
        document.body.appendChild(this.el);
        break;
    }
    return this;
  }
}

exports.debug = (data) => {
  document.getElementById('debug').innerHTML = JSON.stringify(data);
}