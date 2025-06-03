/**!
 * Gradient Block (speedrun fr)
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
// most of the extension is boiler plate
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"0znzwGradTestSpeed" must be ran unsandboxed.`);
  }
  const extId = '0znzwGradTestSpeed', { BlockType, vm } = Scratch;
  const runtime = vm.runtime;
  class extension {
    getInfo() {
      return {
        id: extId,
        name: extId,
        // ugly colours for display
        color1: '#ff0000',
        color2: '#00ff00',
        color3: '#0000ff',
        blocks: [{
          blockType: BlockType.BOOLEAN,
          opcode: 'a',
          text: 'block A',
        }, {
          blockType: BlockType.BOOLEAN,
          opcode: 'b',
          text: 'block B',
        }, {
          blockType: BlockType.BOOLEAN,
          opcode: 'C',
          text: 'block C',
        }], menus: {},
      };
    }
    a() {}
    b() {}
    c() {}
  }
  // actual patch
  if (Scratch.gui) Scratch.gui.getBlockly().then((SB) => {
    const svg = document.createElement("div");
    // I used a gradient generator
    svg.innerHTML = `<svg><defs><linearGradient xmlns="http://www.w3.org/2000/svg" id="c${extId}" x1="0" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#003f5b"/><stop offset="0.2" stop-color="#3f4e88"/><stop offset="0.4" stop-color="#8c509d"/><stop offset="0.6" stop-color="#d54c8d"/><stop offset="0.8" stop-color="#ff625f"/><stop offset="1" stop-color="#ff9913"/></linearGradient></defs></svg>`;
    document.body.appendChild(svg);
    // Changed SPgradients to MIOgradients
    if (!SB?.MIOgradients?.patched) {
      // Gradient Patch by 0znzw & SharkPool
      SB.MIOgradients = { gradientUrls: {}, patched: false };
      const BSP = SB.BlockSvg.prototype, BSPR = BSP.render;
      BSP.render = function(...args) {
        /* global ReduxStore */
        const blockTheme = ReduxStore.getState().scratchGui?.theme?.theme?.blocks;
        const res = BSPR.apply(this, args);
        let category;
        if (this?.svgPath_ && this?.category_ && (category = this.type.slice(0, this.type.indexOf("_"))) && SB.MIOgradients.gradientUrls[category] &&
          this.type === `${extId}_b` // <- this line right here makes it only apply to that block, this can 100% be made more modular
        ) {
          const urls = SB.MIOgradients.gradientUrls[category];
          if (urls) {
            this.svgPath_.setAttribute("fill", urls[0]);
            if (blockTheme === "dark") {
              this.svgPath_.setAttribute("fill-opacity", ".5");
              // fixed the colour here
              this.svgPath_.setAttribute("stroke", "#003f5b");
            }
          }
        }
        return res;
      }
      SB.MIOgradients.patched = true;
    }
    SB.MIOgradients.gradientUrls[extId] = [`url(#c${extId})`];
  });
  Scratch.extensions.register(runtime[`cext_${extId}`] = new extension());
})(Scratch);
