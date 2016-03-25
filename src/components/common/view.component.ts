declare var Proxy:any;
declare var diffDOM:any;

export class ViewComponent {

  public el:HTMLElement;
  // public dataProxy:any;
  public events;
  public dd:any;
  public eventsBound:Boolean = false;

  getTemplate():string {
    return ``;
  }

  constructor(options:any = {}) {
    this.el = options.el;
    // this.startListening();
    this.initialize();

    this.dd = new diffDOM();
  }

  initialize() {}

  bindEvents() {
    for (var ev in this.events) {
      let evType:string = ev.split(' ')[0];
      let elId = ev.split(' ')[1];

      var els = this.el.querySelectorAll(elId)

      for (var i = els.length - 1; i >= 0; i--) {
        els[i].addEventListener(evType, this[this.events[ev]].bind(this))
      }

      // .addEventListener(evType, this[this.events[ev]].bind(this));
    }
    this.eventsBound = true
  }

  // startListening() {
  //   this.dataProxy = new Proxy(this, {
  //     set: (obj, prop, val) => {
  //       obj[prop] = val;

  //       this.render();

  //       return true;
  //     }
  //   });
  // }

  render(selector?:string) {
    let currentHtml = document.createElement('div'); 
    currentHtml.innerHTML = selector ? this.el.querySelector(selector).innerHTML : this.el.innerHTML;

    let newHtml = document.createElement('div');
    newHtml.innerHTML = this.getTemplate();

    if (selector) {
      newHtml.innerHTML = newHtml.querySelector(selector).innerHTML;
    }

    let diff = this.dd.diff(currentHtml, newHtml);

    this.dd.apply(this.el, diff);

    if (!this.eventsBound) {
      this.bindEvents();
    }
    this.afterViewRendered();
  }

  afterViewRendered() {}

  renderChildView(el, Component, options) {
    var component = new Component(options);
    component.render();
  }

}