/**!
 * Custom Button Class Test
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Custom Button Class" needs to be ran unsandboxed.`);
  }
  const xmlEscape = function(unsafe) {
    return unsafe.replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  };
  const _cbfsb = vm.runtime._convertButtonForScratchBlocks;
  vm.runtime._convertButtonForScratchBlocks = function(...args) {
    const [blockInfo] = args;
    const res = _cbfsb.apply(this, args);
    if (blockInfo.cssClass) res.xml = res.xml.replace('text', `web-class="${xmlEscape(blockInfo.cssClass)}" text`);
    if (typeof blockInfo.extraDom === 'string') res.xml = res.xml.replace('text', `extra-dom="${xmlEscape(blockInfo.extraDom)}" text`);
    return res;
  };
  if (Scratch.gui) Scratch.gui.getBlockly().then(ScratchBlocks => {
    const domparser = new DOMParser();
    const fbpi = ScratchBlocks.FlyoutButton.prototype.init;
    ScratchBlocks.FlyoutButton.prototype.init = function(...args) {
      const xml = args[2];
      const extraDom = xml.getAttribute('extra-dom');
      this.extraDom = extraDom ? (domparser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg"><g>${extraDom}</g></svg>`, 'image/svg+xml').getElementsByTagNameNS('http://www.w3.org/2000/svg', 'g').item(0) || false) : false;
      return fbpi.apply(this, args);
    };
    const fbpcd = ScratchBlocks.FlyoutButton.prototype.createDom;
    ScratchBlocks.FlyoutButton.prototype.createDom = function(...args) {
      const res = fbpcd.apply(this, args);
      if (this.extraDom) res.appendChild(this.extraDom);
      return res;
    };
  });

  const myButtonCss = document.createElement('style');
  myButtonCss.textContent = `.buttonClassTest-testButton {
    fill: red;
    stroke: white;
    color: white;
  }
  .buttonClassTest-testCircle {
    fill: blue !important;
    stroke: blue !important;
  }`;
  document.head.appendChild(myButtonCss);

  class extension {
    getInfo() {
      return {
        id: '0znzwButtonClassTest',
        name: 'Custom Button Class',
        blocks: [{
          blockType: Scratch.BlockType.BUTTON,
          func: 'button',
          text: 'i have custom css-class',
          cssClass: 'buttonClassTest-testButton',
          extraDom: `
            <circle r="5" x="1" cx="0" y="1" cy="20" class="buttonClassTest-testCircle" />
          `,
        }],
        menus: {},
      };
    }
    button() {
      alert('yep');
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);