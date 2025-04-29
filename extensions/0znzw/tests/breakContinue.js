/**!
 * Break + Continue test
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.1
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Loop test" must be ran unsandboxed.`);
  }
  const { BlockType, ArgumentType, vm } = Scratch;
  if (vm.exports.i_will_not_ask_for_help_when_these_break) {
    const iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
    if (!iwnafhwtb.IntermediateStackedBlock) {
      const { JSGenerator, ScriptTreeGenerator } = iwnafhwtb;
      const JSGP = JSGenerator.prototype, STGP = ScriptTreeGenerator.prototype;
      const js_dsb = JSGP.descendStackedBlock, st_dsb = STGP.descendStackedBlock;
      JSGP.descendStackedBlock = function(...args) {
        console.log(args);
        if (args[0].kind === '0znzwBreakTest.break') {
          if (!this.frames.find(frame => frame.isLoop)?.isLoop) return null;
          this.source += '\nbreak;\n';
        } else if (args[0].kind === '0znzwBreakTest.continue') {
          if (!this.frames.find(frame => frame.isLoop)?.isLoop) return null;
          this.source += '\ncontinue;\n';
        } else return js_dsb.apply(this, args);
      };
      STGP.descendStackedBlock = function(...args) {
        if (args[0].opcode === '0znzwBreakTest_break') {
          return { kind: '0znzwBreakTest.break' };
        } else if (args[0].opcode === '0znzwBreakTest_continue') {
          return { kind: '0znzwBreakTest.continue' };
        } else return st_dsb.apply(this, args);
      };
    }
  }
  class extension {
    getInfo() {
      return {
        id: '0znzwBreakTest',
        name: 'Break + Continue!!',
        blocks: [{
          opcode: 'break',
          blockType: BlockType.COMMAND,
          text: 'break (my legs)',
          isTerminal: true
        }, {
          opcode: 'continue',
          blockType: BlockType.COMMAND,
          text: 'continue (your meds)',
          isTerminal: true
        }],
      };
    }
    _getLoopFrame(thread) {
      const stackFrames = thread.stackFrames, frameCount = stackFrames.length;
      let loopFrameBlock = null, loopFrameIndex = -1;
      for (let i = frameCount - 1; i >= 0; i--) {
        if (i < 0) break;
        if (!stackFrames[i].isLoop) continue;
        loopFrameBlock = stackFrames[i].op.id;
        loopFrameIndex = i;
        break;
      }
      if (!loopFrameBlock) return false;
      return [loopFrameBlock, loopFrameIndex];
    }
    break(_, util) {
      const thread = util.thread, stackFrame = thread.peekStackFrame();
      if (!stackFrame._breakData) {
        let frameData = false;
        if (!(frameData = this._getLoopFrame(thread))) return console.warn('Not in a loop!');
        const loopFrameBlock = frameData[0];
        const afterLoop = thread.blockContainer.getBlock(loopFrameBlock).next;
        stackFrame._breakData = { loopFrameBlock, afterLoop };
      }
      const { loopFrameBlock, afterLoop } = stackFrame._breakData;
      while(thread.stack.at(-1) !== loopFrameBlock) thread.popStack();
      thread.popStack();
      if (afterLoop) thread.pushStack(afterLoop);
    }
    continue(_, util) {
      const thread = util.thread, blocks = thread.blockContainer, stackFrame = thread.peekStackFrame();
      if (!stackFrame._continueData) {
        let frameData = false;
        if (!(frameData = this._getLoopFrame(thread))) return console.warn('Not in a loop!');
        stackFrame._continueData = frameData[0];
      }
      while(thread.stack[0] && thread.stack.at(-1) !== stackFrame._continueData) thread.popStack();
      thread.status = thread.constructor.STATUS_YIELD;
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
