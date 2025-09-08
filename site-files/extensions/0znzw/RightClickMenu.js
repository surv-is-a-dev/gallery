/**!
 * Right Click Menu
 * @author 0znzw <meow@miyo.icu> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.2
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Right click menu" extension must be ran unsandboxed.`);
  }
  let $isDisabled = false;
  const document_oncontextmenu = document.oncontextmenu;
  document.oncontextmenu = function oncontextmenu(event) {
    if ($isDisabled) event.preventDefault();
    if (document_oncontentmenu) document_oncontentmenu(event);
    return !$isDisabled;
  };
  const { BlockType } = Scratch;
  const extId = '0znzwRightClick';
  class extension {
    getInfo() {
      return {
        id: extId,
        name: 'Right click menu',
        blocks: [{
          blockType: BlockType.COMMAND,
          opcode: 'enable',
          text: 'enable right click menu',
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'disable',
          text: 'disable right click menu',
        }, {
          blockType: BlockType.BOOLEAN,
          opcode: 'isDisabled',
          text: 'is right click menu disabled?',
        }],
      };
    }
    isDisabled() {
      try {
        return !document.oncontextmenu(new MouseEvent(0));
      } catch(e) {
        console.warn('Failed to get context menu disable status.', e);
        return $isDisabled;
      }
    }
    enable() { $isDisabled = false; }
    disable() { $isDisabled = true; }
  }

  const ext = new extension();
  if (Scratch.extensions.unsandboxed) {
    Scratch.vm.runtime[`cext_${extId}`] = ext;
  }
  Scratch.extensions.register(ext);
})(Scratch);
