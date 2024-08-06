/**!
 * Vadik LORE
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Vadik Lore" must be ran unsandboxed.`);
  }
  const extId = '0znzwImageBlockTest';

  ((Scratch, extId) => {
    const { vm, BlockType, ArgumentType } = Scratch, { runtime } = vm;
    BlockType.IMAGE = 'image';
    const _ciij = runtime._constructInlineImageJson;
    runtime._constructInlineImageJson = function(...args) {
      const [argInfo] = args;
      const res = _ciij.apply(this, args);
      res.width = argInfo.width || argInfo.size || 24;
      res.height = argInfo.height || argInfo.size || 24;
      return res;
    };
    const _cbfsb = runtime._convertBlockForScratchBlocks;
    runtime._convertBlockForScratchBlocks = function(...args) {
      let [blockInfo] = args;
      if (blockInfo.blockType === Scratch.BlockType.IMAGE) {
        blockInfo = {
          opcode: blockInfo.opcode,
          func: blockInfo.func || blockInfo.opcode,
          text: '[IMAGE]',
          blockType: BlockType.BOOLEAN,
          allowDropAnywhere: true,
          arguments: {
            IMAGE: { type: ArgumentType.IMAGE, dataURI: blockInfo.src, width: blockInfo.width || 24, height: blockInfo.height || 24 },
          },
          color1: '#00000000',
          color2: '#00000000',
          color3: '#00000000',
        };
        args[0] = blockInfo;
      }
      const res = _cbfsb.apply(this, args);
      return res;
    };
  })(Scratch, extId);

  class extension {
    getInfo() {
      return {
        id: extId,
        name: 'Vadik Lore',
        blocks: [{
          opcode: 'sticker',
          blockType: Scratch.BlockType.IMAGE,
          src: 'data:image/webp;base64,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',
          width: 160,
          height: 160,
        }],
        menus: {},
      };
    }
    sticker() { return 'Vadik Lore'; }
  }
  Scratch.extensions.register(new extension());
})(Scratch);