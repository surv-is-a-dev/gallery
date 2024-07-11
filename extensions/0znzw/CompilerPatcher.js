/**!
 * Compiler Injector
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Compiler Injector" extension must be ran unsandboxed!`);
  }
  
  const { vm, BlockType, ArgumentType } = Scratch, { runtime } = vm, extId = '0znzwCompilerPatching';
  const iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
  const { JSGenerator, IRGenerator, ScriptTreeGenerator } = iwnafhwtb;
  const { TYPE_NUMBER, TYPE_STRING, TYPE_BOOLEAN, TYPE_UNKNOWN, TYPE_NUMBER_NAN, TypedInput, ConstantInput, VariableInput, Frame, sanitize } = JSGenerator.unstable_exports;
  const JSGP = JSGenerator.prototype, IRGP = IRGenerator.prototype, STGP = ScriptTreeGenerator.prototype;
  
  runtime.patchedOpcodes = new Map(), runtime.patchPresets = new Map();
  runtime.patchedOpcodes.setOpcode = (function(opcode, position, js) {
    if (!runtime.patchedOpcodes.has(opcode)) {
      this.set(opcode, {
        ontop: null,
        before: '',
        after: '',
      });
    }
    runtime.patchedOpcodes.get(opcode)[position] = js;
  }).bind(runtime.patchedOpcodes);
  ConstantInput.prototype.asRaw = function() {
    return this.constantValue;
  };
  TypedInput.prototype.asRaw = function() {
    return this.asUnknown();
  };
  VariableInput.prototype.asRaw = function() {
    return this._value.asRaw();
  };
  
  const PATCHES_ID = `__patches_${extId}__`;
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
  
  cst_patch(STGP, {
    descendInput(fn, block, ...args) {
      const patchedOpcode = runtime.patchedOpcodes.get(block.opcode);
      if (patchedOpcode) {
        return {
          kind: `${extId}.opPatch`,
          node: fn(block, ...args),
          patchedOpcode,
        };
      }
      switch(block.opcode) {
        // Skip any stack-like blocks
        case `${extId}_patch_reporter`:
          return {
            kind: `${extId}.patchReporter`,
            js: this.descendInputOfBlock(block, 'JS'),
          };
        case `${extId}_all_patched`:
          return {
            kind: `${extId}.allPatched`,
          };
        case `${extId}_is_patched`:
          return {
            kind: `${extId}.isPatched`,
            opcode: this.descendInputOfBlock(block, 'OPCODE'),
          };
        case `${extId}_use_preset_reporter`:
          return {
            kind: `${extId}.presetReporter`,
            name: this.descendInputOfBlock(block, 'NAME'),
          };
        default:
          return fn(block, ...args);
      }
    },
    descendStackedBlock(fn, block, ...args) {
      const patchedOpcode = runtime.patchedOpcodes.get(block.opcode);
      if (patchedOpcode) {
        return {
          kind: `${extId}.opPatch`,
          node: fn(block, ...args),
          patchedOpcode,
        };
      }
      switch(block.opcode) {
        // Skip any non-stack-like blocks
        case `${extId}_patch_command`:
          return {
            kind: `${extId}.patchCommand`,
            js: this.descendInputOfBlock(block, 'JS'),
          };
        case `${extId}_patch_conditional`:
          return {
            kind: `${extId}.patchWrapper`,
            js1: this.descendInputOfBlock(block, 'JSSTART'),
            stack: this.descendSubstack(block, 'SUBSTACK'),
            js2: this.descendInputOfBlock(block, 'JSEND'),
          };
        case `${extId}_patch_opcode`:
          return {
            kind: `${extId}.patchOpcode`,
            opcode: this.descendInputOfBlock(block, 'OPCODE'),
            position: this.descendInputOfBlock(block, 'POS'),
            js: this.descendInputOfBlock(block, 'JS'),
          };
        case `${extId}_unpatch_opcode`:
          return {
            kind: `${extId}.unpatchOpcode`,
            opcode: this.descendInputOfBlock(block, 'OPCODE'),
          };
        case `${extId}_new_preset`:
          return {
            kind: `${extId}.newPreset`,
            name: this.descendInputOfBlock(block, 'NAME'),
            id: block.id,
          };
        case `${extId}_use_preset_command`:
          return {
            kind: `${extId}.presetCommand`,
            name: this.descendInputOfBlock(block, 'NAME'),
          };
        default:
          return fn(block, ...args);
      }
    },
  });
  
  function getPreset(name) {
    return '';
  }
  cst_patch(JSGP, {
    descendInput(fn, node, ...args) {
      switch(node.kind) {
        case `${extId}.opPatch`:
          return new TypedInput(`${node.patchedOpcode.before ?? ''}
${node.patchedOpcode.ontop !== null ? node.patchedOpcode.ontop : this.descendInput(node.node).asUnknown()}
${node.patchedOpcode.after ?? ''}`, TYPE_UNKNOWN);
        case `${extId}.patchReporter`:
          return new TypedInput(this.descendInput(node.js).asRaw(), TYPE_UNKNOWN);
        case `${extId}.allPatched`:
          return new TypedInput('(JSON.stringify(Array.from(runtime.patchedOpcodes.keys())))', TYPE_STRING);
        case `${extId}.isPatched`:
          return new TypedInput(`(runtime.patchedOpcodes.has(${this.descendInput(node.opcode).asString()}))`, TYPE_BOOLEAN);
        case `${extId}.presetReporter`:
          this.source += new TypedInput(getPreset.call(this, node.name), TYPE_UNKNOWN);
          break;
        default:
          return fn(node, ...args);
      }
    },
    descendStackedBlock(fn, node, ...args) {
      switch(node.kind) {
        case `${extId}.opPatch`:
          this.source += `${node.patchedOpcode.before ?? ''}
${node.patchedOpcode.ontop !== null ? node.patchedOpcode.ontop : this.descendInput(node.node).asUnknown()}
${node.patchedOpcode.after ?? ''}`;
          break;
        case `${extId}.patchCommand`:
          this.source += this.descendInput(node.js).asRaw();
          break;
        case `${extId}.patchWrapper`:
          this.source += this.descendInput(node.js1).asRaw() + '\n';
          this.descendStack(node.stack, new Frame(false));
          this.source += '\n' + this.descendInput(node.js2).asRaw();
          break;
        case `${extId}.patchOpcode`:
          this.source += `runtime.patchedOpcodes.setOpcode(${this.descendInput(node.opcode).asString()}, ${this.descendInput(node.position).asString()}, ${this.descendInput(node.js).asString()});`;
          break;
        case `${extId}.unpatchOpcode`:
          this.source += `runtime.patchedOpcodes.delete(${this.descendInput(node.opcode).asString()});`;
          break;
        case `${extId}.newPreset`:
          this.source += `runtime.patchPresets.set(${this.descendInput(node.name).asString()}, "${node.id}");`;
          break;
        case `${extId}.presetCommand`:
          this.source += getPreset.call(this, node.name);
          break;
        default:
          return fn(node, ...args);
      }
    }
  });
  
  class extension {
    getInfo() {
      return {
        id: extId,
        name: 'Compiler Injector',
        blocks: [{
          blockType: BlockType.COMMAND,
          opcode: 'patch_command',
          text: 'inject js [JS]',
          arguments: {
            JS: { type: ArgumentType.STRING, defaultValue: 'alert(1);' },
          },
          func: 'interpreter_error',
        }, {
          blockType: BlockType.REPORTER,
          opcode: 'patch_reporter',
          text: 'inject js [JS]',
          arguments: {
            JS: { type: ArgumentType.STRING, defaultValue: 'alert(1);' },
          },
          allowDropAnywhere: true,
          func: 'interpreter_error',
        }, {
          blockType: BlockType.CONDITIONAL,
          opcode: 'patch_conditional',
          text: ['inject js [JSSTART]', '[JSEND]'],
          arguments: {
            JSSTART: { type: ArgumentType.STRING, defaultValue: 'if (1) {' },
            JSEND: { type: ArgumentType.STRING, defaultValue: '};' },
          },
          func: 'interpreter_error',
        }, '---', {
          blockType: BlockType.COMMAND,
          opcode: 'patch_opcode',
          text: 'inject js [JS] [POS] opcode [OPCODE]',
          arguments: {
            OPCODE: { type: ArgumentType.STRING, defaultValue: 'motion_direction' },
            JS: { type: ArgumentType.STRING, defaultValue: 'alert(1);' },
            POS: { menu: 'inject_type' },
          },
          func: 'interpreter_error',
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'unpatch_opcode',
          text: 'uninject opcode [OPCODE]',
          arguments: {
            OPCODE: { type: ArgumentType.STRING, defaultValue: 'motion_direction' },
          },
          func: 'interpreter_error',
        }, {
          blockType: BlockType.REPORTER,
          opcode: 'all_patched',
          text: 'patched opcodes',
          disableMonitor: true,
          func: 'interpreter_error',
        }, {
          blockType: BlockType.BOOLEAN,
          opcode: 'is_patched',
          text: 'is [OPCODE] patched?',
          arguments: {
            OPCODE: { type: ArgumentType.STRING, defaultValue: 'motion_direction' },
          },
          func: 'interpreter_error',
        }, '---',  {
          blockType: BlockType.CONDITIONAL,
          opcode: 'new_preset',
          text: 'create preset [NAME] using',
          arguments: {
            NAME: { type: ArgumentType.STRING, defaultValue: 'my preset' },
          },
          hideFromPalette: true,
          func: 'interpreter_error',
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'use_preset_command',
          text: 'inject preset [NAME]',
          arguments: {
            NAME: { type: ArgumentType.STRING, defaultValue: 'my preset' },
          },
          hideFromPalette: true,
          func: 'interpreter_error',
        }, {
          blockType: BlockType.REPORTER,
          opcode: 'use_preset_reporter',
          text: 'inject preset [NAME]',
          arguments: {
            NAME: { type: ArgumentType.STRING, defaultValue: 'my preset' },
          },
          allowDropAnywhere: true,
          hideFromPalette: true,
          func: 'interpreter_error',
        }],
        menus: {
          inject_type: {
            acceptReporters: true,
            items: [{text: 'overtop of', value: 'ontop'}, 'before', 'after'],
          },
        },
      };
    }
    patch_command() {}
    patch_reporter() {}
    patch_conditional() {}
    patch_opcode() {}
    precompile() {}
    all_patched() {}
    is_patched() {}
    unpatch_opcode() {}
    new_preset() {}
    use_preset_command() {}
    use_preset_reporter() {}
    interpreter_error(_, util) {
      runtime.visualReport(util.thread.isCompiled ? util.thread.peekStack() : util.thread.peekStackFrame().op.id, util.thread.isCompiled ? 'The block errored wtf.' : 'This block cannot be ran in the interpreter.');
    }
  }
  
  Scratch.extensions.register(new extension());
})(Scratch);