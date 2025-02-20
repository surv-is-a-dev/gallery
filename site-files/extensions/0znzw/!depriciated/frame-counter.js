/**!
 * "Frame" Counter
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Counter" needs to be ran unsandboxed.`);
  }
  let measuringFrames1 = false, frameCount1 = 0;
  let measuringFrames2 = false, frameCount2 = 0;
  function onFrame1() {
    if (measuringFrames1) return frameCount1++;
    vm.runtime.off('BEFORE_EXECUTE', onFrame1);
  }
  function onFrame2() {
    if (measuringFrames2) return frameCount2++, requestAnimationFrame(onFrame2);
  }
  class extension {
    getInfo() {
      return {
        id: '0znzwRFCaAFCdProof',
        name: 'Counter',
        blocks: [{
          blockType: Scratch.BlockType.LABEL,
          text: 'Runtime Frame-Count',
        }, {
          blockType: Scratch.BlockType.COMMAND,
          opcode: 'start1',
          text: 'start rfc-measure',
        }, {
          blockType: Scratch.BlockType.COMMAND,
          opcode: 'end1',
          text: 'end rfc-measure',
        }, {
          blockType: Scratch.BlockType.REPORTER,
          opcode: 'get1',
          text: 'get rfc-measure',
        }, {
          blockType: Scratch.BlockType.LABEL,
          text: 'Animation Frame-Count',
        }, {
          blockType: Scratch.BlockType.COMMAND,
          opcode: 'start2',
          text: 'start afc-measure',
        }, {
          blockType: Scratch.BlockType.COMMAND,
          opcode: 'end2',
          text: 'end afc-measure',
        }, {
          blockType: Scratch.BlockType.REPORTER,
          opcode: 'get2',
          text: 'get afc-measure',
        }],
      };
    }
    start1() {
      measuringFrames1 = true, frameCount1 = 0;
      vm.runtime.off('BEFORE_EXECUTE', onFrame1);
      vm.runtime.on('BEFORE_EXECUTE', onFrame1);
    }
    get1() { return frameCount1; }
    end1() { measuringFrames1 = false; }
    start2() {
      if (measuringFrames2) return;
      measuringFrames2 = true, frameCount2 = 0;
      requestAnimationFrame(onFrame2);
    }
    get2() { return frameCount2; }
    end2() { measuringFrames2 = false; }
  }
  Scratch.extensions.register(new extension());
})(Scratch);