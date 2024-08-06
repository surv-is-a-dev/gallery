/**!
 * Custom Visual Report Test
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Custom Visual Report Test" extension needs to be ran unsandboxed.`);
  }

  const extId = '0znzwCustomVisualReportTest';
  const { vm, BlockType, ArgumentType, Cast } = Scratch;
  const { runtime } = vm;

  const xmlEscape = function (unsafe) {
    if (typeof unsafe !== 'string') {
      if (Array.isArray(unsafe)) {
        unsafe = String(unsafe);
      } else {
        return unsafe;
      }
    }
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
  if (Scratch.gui) Scratch.gui.getBlockly().then((Blockly) => {
    Blockly.WorkspaceSvg.prototype.reportValueHTML = function(id, html) {
      var block = this.getBlockById(id);
      if (!block) {
        throw 'Tried to report value on block that does not exist.';
      }
      Blockly.DropDownDiv.hideWithoutAnimation();
      Blockly.DropDownDiv.clearContent();
      const contentDiv = Blockly.DropDownDiv.getContentDiv();
      const valueReportBox = document.createElement('div');
      valueReportBox.setAttribute('class', 'valueReportBox');
      valueReportBox.innerHTML = html;
      contentDiv.appendChild(valueReportBox);
      Blockly.DropDownDiv.setColour(
        Blockly.Colours.valueReportBackground,
        Blockly.Colours.valueReportBorder
      );
      Blockly.DropDownDiv.showPositionedByBlock(this, block);
    };
    const rvr = runtime.visualReport;
    runtime.visualReport = function(...fakeArgs) {
      const [id, value] = fakeArgs;
      const block = vm.editingTarget.blocks.getBlock(id) ?? runtime.flyoutBlocks.getBlock(id);
      if (block) {
        if (block.opcode === `${extId}_reporter_test`) {
          const ws = Blockly?.getMainWorkspace?.();
          if (ws) {
            const styleId = Blockly.utils.genUid();
            return ws.reportValueHTML(id, `<style>
  div[data-styleId="${styleId}"] {
    margin: 20px;
    transform: scale(1.45, 2.5);
  }
</style><div data-styleId="${styleId}">${xmlEscape(value)}</div>`);
          }
        }
      } else {
        console.warn('Tried to report value on block that does not exist.');
      }
      return rvr.apply(this, fakeArgs);
    };
  });

  class extension {
    getInfo() {
      return {
        id: extId,
        name: 'VisualReport Test',
        blocks: [{
          opcode: 'reporter_test',
          blockType: BlockType.REPORTER,
          text: 'Sir Stretch (click me)',
        }], menus: {},
      };
    }
    reporter_test() {
      return 'Stretchy boi';
    }
  }

  const inst = new extension();
  runtime[`ext_${extId}`] = inst;
  Scratch.extensions.register(inst);
})(Scratch);