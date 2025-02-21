/**!
 * Workspace Background
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Workspace Background" needs to be ran unsandboxed.`);
  }
  const { vm, BlockType } = Scratch, { runtime } = vm;
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
  localStorage['0zWsBg'] ??= `{"url":"https://search.bus-hit.me/image_proxy?url=https%3A%2F%2Fstaticg.sportskeeda.com%2Feditor%2F2024%2F07%2F8abf1-17207740847695-1920.jpg&h=d2d00513a0bfd5141ae6ddba8814de29b3151a72dddc71ba39519c6a2694d03c","opacity":"1"}`;
  function setBG(url) {
    const s = JSON.parse(localStorage['0zWsBg']);
    s.url = url;
    localStorage['0zWsBg'] = JSON.stringify(s);
  }
  function setOpacity(opacity) {
    const s = JSON.parse(localStorage['0zWsBg']);
    s.opacity = opacity;
    localStorage['0zWsBg'] = JSON.stringify(s);
  }
  if (Scratch.gui) Scratch.gui.getBlockly().then(ScratchBlocks => {
    const WSSP = ScratchBlocks.WorkspaceSvg.prototype;
    const render = WSSP.render;
    WSSP.imageUrl = undefined;
    WSSP.imageOpacity = '1';
    WSSP.computedStyles = null;
    WSSP.render = function(...args) {
      const res = render.apply(this, args);
      const svg = this.cachedParentSvg_;
      if (this.imageUrl) {
        svg.style['background-image'] = `url("${this.imageUrl}")`;
        svg.style['background-size'] = 'cover';
        svg.style['background-repeat'] = 'no-repeat';
        svg.style['opacity'] = String(this.imageOpacity);
      } else if (!this.imageUrl && svg.style['background-image']) {
        delete svg.style['background-image'];
        delete svg.style['background-size'];
        delete svg.style['background-repeat'];
        delete svg.style['opacity'];
      }
      return res;
    };
    const refreshWorkspace = vm.refreshWorkspace;
    vm.refreshWorkspace = function(...args) {
      try {
        const ws = ScratchBlocks.getMainWorkspace();
        const s = JSON.parse(localStorage['0zWsBg']);
        ws.imageOpacity = String(s.opacity);
        ws.imageUrl = s.url;
        ws.render();
      } catch {}
      return refreshWorkspace.apply(this, args);
    };
    vm.refreshWorkspace();
    // Button code from: https://raw.githubusercontent.com/surv-is-a-dev/gallery/refs/heads/main/site-files/extensions/0znzw/tests/!hidden/custom-button-class-and-svg.js
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
  myButtonCss.textContent = `
.a0znzwWsBackground-bgButton, .a0znzwWsBackground-opButton, .a0znzwWsBackground-bgButton rect.blocklyFlyoutButtonBackground, .a0znzwWsBackground-opButton rect.blocklyFlyoutButtonBackground {
  width: 200px;
}
  `;
  document.head.appendChild(myButtonCss);

  class extension {
    getInfo() {
      return {
        id: '0znzwWsBackground',
        name: 'Workspace Background',
        blocks: [{
          blockType: BlockType.HAT,
          opcode: 'temp',
          text: 'Put this in the project to save.',
          isTerminal: true,
        }, {
          blockType: BlockType.LABEL,
          text: 'Set BG:',
        }, {
          blockType: BlockType.BUTTON,
          func: 'updateBG',
          text: '\u202D',
          cssClass: 'a0znzwWsBackground-bgButton',
          extraDom: `
            <foreignObject x="30" y="10" width="200" height="20">
              <input type="url" width="50" height="20" xmlns="http://www.w3.org/1999/xhtml" />
            </foreignObject>
          `,
        }, {
          blockType: BlockType.LABEL,
          text: 'Set Opacity:',
        }, {
          blockType: BlockType.BUTTON,
          func: 'updateOpacity',
          text: '\u202D',
          cssClass: 'a0znzwWsBackground-opButton',
          extraDom: `
            <foreignObject x="30" y="10" width="200" height="20">
              <input type="number" width="50" height="20" xmlns="http://www.w3.org/1999/xhtml" min="0" max="100" />
            </foreignObject>
          `,
        }],
      };
    }
    updateBG() {
      const input = document.querySelector('g.a0znzwWsBackground-bgButton input');
      if (!input) console.warn('Unable to find input');
      setBG(input.value);
      vm.refreshWorkspace();
    }
    updateOpacity() {
      const input = document.querySelector('g.a0znzwWsBackground-opButton input');
      if (!input) console.warn('Unable to find input');
      setOpacity(Math.max(Math.min(Number(input.value), 100), 0) / 100 || 0);
      vm.refreshWorkspace();
    }
    temp() {}
  }
  Scratch.extensions.register(new extension());
})(Scratch);