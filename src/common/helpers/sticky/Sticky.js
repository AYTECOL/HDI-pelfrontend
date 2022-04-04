class Sticky {
  constructor(element) {
    this.el = document.querySelector('.' + element);
    this.content = window;
    if (this.el) {
      this.height = this.el.offsetHeight;
      this.referenceBottom = document.createElement('div');
      this.referenceBottom.className = 'stickybottom';
      this.el.after(this.referenceBottom);
      this.el.className += ' sticky-wrapper';
      this.content.addEventListener('scroll', this.listener.bind(this));
    }
  }

  listener(e) {
    const { el, height, referenceBottom } = this;
    const className = 'js-is-sticky';
    const subClassName = 'js-is-sticky-truck';
    const scrollTop = document.scrollingElement.scrollTop;
    const offsetTop = referenceBottom.offsetTop;
    if (offsetTop <= scrollTop) {
      if (
        offsetTop <= scrollTop &&
        offsetTop + height >= scrollTop &&
        el.className.indexOf(className) !== -1
      ) {
        if (el.className.indexOf(subClassName) === -1)
          el.className += ' ' + subClassName;
      } else {
        if (el.className.indexOf(className) === -1)
          el.className += ' ' + className;
        referenceBottom.style.height = height + 'px';
      }
    } else {
      el.className = el.className
        .replace(' ' + className, '')
        .replace(' ' + subClassName, '');
      referenceBottom.style.height = '';
    }
  }

  destroy() {
    this.content.removeEventListener('scroll', this.listener);
  }
}

export default Sticky;
