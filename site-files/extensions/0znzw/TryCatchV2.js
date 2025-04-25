/**!
 * Try Catch
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 2.5
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 * 
 * @todo Fix this in TW new compiler.
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Try Catch V2" extension must be ran unsandboxed.`);
  }
  const { BlockType, ArgumentType, vm = } Scratch, { exports, runtime } = vm;
  const extId = '0znzwTryCatchV2';
  const THREAD_HOOK = Symbol('TryCatch.Capture');
  const THREAD_ERR = Symbol('TryCatch.Error');
  const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  if (Scratch?.gui) Scratch.gui.getBlockly().then(Blockly => {
    const LightenDarkenColor = (r,n) => {var a=!1;"#"==r[0]&&(r=r.slice(1),a=!0);var t=parseInt(r,16),e=(t>>16)+n;e>255?e=255:e<0&&(e=0);var i=(t>>8&255)+n;i>255?i=255:i<0&&(i=0);var o=(255&t)+n;return o>255?o=255:o<0&&(o=0),(a?"#":"")+(o|i<<8|e<<16).toString(16)};
    const BSP_updateColour = Blockly.BlockSvg.prototype.updateColour;
    Blockly.BlockSvg.prototype.updateColour = function(...args) {
      const renderDuplicate = this.isShadow() && Blockly.scratchBlocksUtils.isShadowArgumentReporter(this);
      if (renderDuplicate && this.type === `${extId}_caught`) {
        const t_getColourTertiary = this.getColourTertiary;
        this.getColourTertiary = function(...args) {
          const parent = this.getParent();
          if (!parent) return t_getColourTertiary.apply(this, args);
          return parent.getColourTertiary.apply(parent, args);
        };
        const getName = this.isGlowingBlock_ ? `getColourSecondary` : `getColour`;
        const getColour = this[getName];
        this[getName] = function(...args) {
          const myColour = getColour.apply(this, args);
          const parent = this.getParent();
          if (!parent) return myColour;
          return LightenDarkenColor(parent[getName].apply(parent, args), -12);
        };
        const t_getOpacity = this.getOpacity;
        this.getOpacity = function(...args) {
          const parent = this.getParent();
          if (parent) return parent.getOpacity.apply(parent, args);
          return t_getOpacity.apply(this, args);
        };
      }
      return BSP_updateColour.apply(this, args);
    };
    const SBU_isShadowArgumentReporter = Blockly.scratchBlocksUtils.isShadowArgumentReporter;
    Blockly.scratchBlocksUtils.isShadowArgumentReporter = function(block) {
      if (SBU_isShadowArgumentReporter.call(this, block)) return true;
      if (block.isShadow() && block.type == `${extId}_caught`) {
        return true;
      } else return false;
    };
  });
  const PATCHES_ID = extId;
  const cst_patch = (obj, functions) => {
    if (obj[PATCHES_ID]) return;
    obj[PATCHES_ID] = {};
    for (const name in functions) {
      const original = obj[name];
      obj[PATCHES_ID][name] = obj[name];
      if (original) {
        obj[name] = function (...args) {
          const callOriginal = (...args) => original.call(this, ...args);
          return functions[name].call(this, callOriginal, ...args);
        };
      } else {
        obj[name] = function (...args) {
          return functions[name].call(this, () => {}, ...args);
        };
      }
    }
  };
  // Improved version of my one in "Error Stop"
  const prims = runtime._primitives;
  runtime._primitives = new Proxy(prims, {
    get(target, prop) {
      const tprop = target[prop];
      if (typeof tprop == 'function') return function(...all) {
        const util = all[1], { thread } = util;
        if (!hasOwn(thread, THREAD_HOOK)) return tprop(...all);
        const hook = thread[THREAD_HOOK];
        try {
          return tprop(...all);
        } catch(error) {
          thread[THREAD_ERR] = error;
          if (hook) thread.pushStack(hook);
          return '';
        }
      }; else return tprop;
    }
  });
  const xml = {
    attemptBlock: `<block type="${extId}_attempt"><value name="ERROR"><shadow type="${extId}_caught"></shadow></value></block>`
  };
  class extension {
    getInfo() {
      return {
        id: extId,
        name: 'Try Catch V2',
        color1: '#ff3104',
        blocks: [{
          hideFromPalette: true,
          opcode: 'caught',
          text: 'error',
          blockType: BlockType.REPORTER,
          color1: '#c52300', // differentiate the block
        }, {
          hideFromPalette: true,
          opcode: 'attempt',
          text: ['try', 'catch [ERROR]'],
          blockType: BlockType.CONDITIONAL,
          arguments: {
            ERROR: { type: null },
          },
          branchCount: 2,
        }, {
          blockType: BlockType.XML,
          xml: `${xml.attemptBlock}`,
        }, {
          opcode: 'error',
          text: 'throw [ERROR]',
          blockType: BlockType.COMMAND,
          arguments: {
            ERROR: { type: ArgumentType.STRING },
          },
          isTerminal: true,
        }]
      };
    }
    async until(conditionFunction) {
      const poll = (resolve) => {
        if (conditionFunction()) resolve();
        else vm.runtime.once('AFTER_EXECUTE', (_) => poll(resolve));
      };
      return new Promise(poll);
    }
    caught(_, util) {
      const error = util.thread?.[THREAD_ERR];
      if (!error) return '{"message":"","name":"","stack":""}';
      return JSON.stringify({
        message: error?.message ?? '',
        name: error?.name ?? '',
        stack: error?.stack ?? '',
      });
    }
    async attempt(_, util) {
      const { target, thread } = util, blocks = target.blocks;
      const id = thread.peekStack();
      const tryBranch = blocks.getBranch(id, 1), catchBranch = blocks.getBranch(id, 2) ?? false;
      if (!tryBranch) return 0;
      const tryThread = runtime._pushThread(tryBranch, target, { stackClick: true, updateMonitor: false });
      tryThread[THREAD_HOOK] = catchBranch;
      await this.until(_ => !runtime.isActiveThread(tryThread));
    }
    error(args) {
      throw new Error(args.ERROR);
    }
  }
  let Frame, TypedInput;
  // TurboWarp and CST's exports support.
  const errors = new (function generator() {
    'use strict';
    this.$i = 0;
    this.now = () => `Perr${this.$i}`;
    this.next = () => `Perr${++this.$i}`;
  });
  function getError() {
    if ((this.currentFrame ?? '') === '') return '(\'\')';
    let i = -1, j = this.frames.findIndex(same => same === this.currentFrame);
    let k = this.currentFrame;
    while(true) {
      k = this.frames[j - (++i)];
      if (k === undefined || k[THREAD_ERR]) break;
    }
    return `(${(k || {})[THREAD_ERR] ?? '\'\''})`;
  }
  const iwnafhwtb = exports.i_will_not_ask_for_help_when_these_break;
  let JSG, STG, IRG;
  if (iwnafhwtb) {
    const temp = iwnafhwtb();
    // Unsandboxed support
    if (runtime.compilerData) {((compilerData, {
      IntermediateStackBlock,
      IntermediateInput,
      InputType,
      Frame,
    }) => {
      compilerData.registerBlock(`${extId}_attempt`, function (stg, block) {
        return new IntermediateStackBlock(this.ir_opcode, {
          toTry: stg.descendSubstack(block, 'SUBSTACK'),
          onCaught: stg.descendSubstack(block, 'SUBSTACK2'),
        });
      }, function (jsg, block) {
        jsg.source += '\ntry {\n';
        jsg.descendStack(block.inputs.toTry, new Frame(false));
        jsg.currentFrame[THREAD_ERR] = errors.next();
        jsg.source += `\n} catch(${jsg.currentFrame[THREAD_ERR]}) {\n`;
        jsg.descendStack(block.inputs.onCaught, new Frame(false));
        jsg.source += `\n};`;
      }, {
        input: false,
      });
      compilerData.registerBlock(`${extId}_error`, function (stg, block) {
        return new IntermediateStackBlock(this.ir_opcode, {
          error: stg.descendInputOfBlock(block, 'VALUE'),
        });
      }, function (jsg, block) {
        jsg.source += `\nthrow new Error(${jsg.descendInput(block.inputs.error)});`;
      }, {
        input: false,
      });
      compilerData.registerBlock(`${extId}_caught`, function (stg, block) {
        return new IntermediateStackBlock(this.ir_opcode, this.type);
      }, function (jsg, block) {
        const e = getError.call(jsg);
        return `(JSON.stringify({message:${e}?.message??'',name:${e}?.name??'',stack:${e}?.stack??''}))`;
      }, {
        input: true,
        type: InputType.STRING,
      });
    })(runtime.compilerData, runtime.compilerData.exports)} else {
      JSG = temp.JSGenerator;
      STG = temp.ScriptTreeGenerator;
      IRG = temp.IRGenerator;
      void({ TYPE_STRING, Frame, TypedInput } = JSG.unstable_exports);
    }
  } else {
    IRG = exports?.IRGenerator;
    if (IRG) {
      JSG = exports.JSGenerator;
      STG = IRG.exports.ScriptTreeGenerator;
      void({ TYPE_UNKNOWN, Frame, TypedInput } = JSG.exports);
    } else {
      console.error('Failed register compiler patches. VM is outdated.');
    }
  }
  if (JSG) {
    const JSGP = JSG.prototype;
    const STGP = STG.prototype;
    cst_patch(JSGP, {
      descendStackedBlock(originalFn, node) {
        switch(node.kind) {
          case `${extId}.caught`:
            this.source += '\nvoid(\'\');';
            break;
          case `${extId}.error`:
            this.source += `\nthrow new Error(${this.descendInput(node.error).asString()});`;
            break;
          case `${extId}.attempt`:
            this.source += '\ntry {\n';
            this.descendStack(node.toTry, new Frame(false));
            this.currentFrame[THREAD_ERR] = errors.next();
            this.source += `\n} catch(${this.currentFrame[THREAD_ERR]}) {\n`;
            this.descendStack(node.onCaught, new Frame(false));
            this.source += `\n};`;
            break;
          default:
            return originalFn(node);
        }
      },
      descendInput(originalFn, node) {
        switch(node.kind) {
          case `${extId}.caught`: {
            const e = getError.call(this);
            return new TypedInput(`(JSON.stringify({message:${e}?.message??'',name:${e}?.name??'',stack:${e}?.stack??''}))`, TYPE_STRING);
          };
          default:
            return originalFn(node);
        }
      },
    });
    cst_patch(STGP, {
      descendStackedBlock(originalFn, block) {
        switch(block.opcode) {
          case `${extId}_caught`:
            return {
              kind: `${extId}.caught`,
            };
          case `${extId}_error`:
            return {
              kind: `${extId}.error`,
              error: this.descendInputOfBlock(block, 'ERROR'),
            };
          case `${extId}_attempt`:
            return {
              kind: `${extId}.attempt`,
              toTry: this.descendSubstack(block, 'SUBSTACK'),
              onCaught: this.descendSubstack(block, 'SUBSTACK2'),
            };
          default:
            return originalFn(block);
        }
      },
      descendInput(originalFn, block) {
        switch(block.opcode) {
          case `${extId}_caught`:
            return {
              kind: `${extId}.caught`,
            };
          default:
            return originalFn(block);
        }
      },
    });
  }
  Scratch.extensions.register(new extension());
})(Scratch);
