/**!
 * Advanced Base64
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
      throw new Error(`"Advanced Base64" extension must be ran unsandboxed.`);
    }
    class base64ext {
      getInfo() {
        return {
          id: '0znzwAdvancedBase64',
          name: 'Better Base64',
          blocks: [
            {
              blockType: Scratch.BlockType.BOOLEAN,
              opcode: 'can_use_api',
              text: 'packaged-base64 api avalible?'
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'encode',
              text: 'encode [DATA] to base64',
              arguments: {
                DATA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'TurboWarp' 
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'decode',
              text: 'decode [DATA] from base64',
              arguments: {
                DATA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'VHVyYm9XYXJw' 
                }
              }
            },
          ]
        };
      }
      can_use_api() {
        try { Base64 && 1 } catch { return false };
        return true;
      }
      encode({ DATA }) {
        DATA = Scratch.Cast.toString(DATA);
        return Base64.encode(DATA);
      }
      decode({ DATA }) {
        DATA = Scratch.Cast.toString(DATA);
        return Base64.decode(DATA);
      }
    }
    Scratch.extensions.register(new base64ext());
  })(Scratch);