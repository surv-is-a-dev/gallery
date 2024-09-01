/**!
 * Compiler Injector
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.1
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
  
  const descendPatchArgs = function(block) {
    return Array.from(Object.entries(block.inputs).flatMap(entr => String(entr[0]).startsWith('ARG') ? [this.descendInputOfBlock(block, entr[0])] : []) || []);
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
        case `${extId}_newline`:
          return {
            kind: `${extId}.newline`,
          };
        case `${extId}_patch_reporter`:
          return {
            kind: `${extId}.patchReporter`,
            js: descendPatchArgs.call(this, block),
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
            args: descendPatchArgs.call(this, block),
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
          return new TypedInput(node.args.map(arg => this.descendInput(arg).asRaw() || '/**/').join('') || '/**/', TYPE_UNKNOWN);
        case `${extId}.allPatched`:
          return new TypedInput('(JSON.stringify(Array.from(runtime.patchedOpcodes.keys())))', TYPE_STRING);
        case `${extId}.isPatched`:
          return new TypedInput(`(runtime.patchedOpcodes.has(${this.descendInput(node.opcode).asString()}))`, TYPE_BOOLEAN);
        case `${extId}.presetReporter`:
          this.source += new TypedInput(getPreset.call(this, node.name), TYPE_UNKNOWN);
          break;
        case `${extId}.newline`:
          return new TypedInput('/*<br />*/\n', TYPE_UNKNOWN);
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
          this.source += node.args.map(arg => this.descendInput(arg).asRaw() || '/**/').join('') || '/**/';
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
          blockType: BlockType.BUTTON,
          text: runtime.debug ? 'Disable debug' : 'Enable debug',
          func: 'DEBUG',
        }, {
          blockType: BlockType.REPORTER,
          opcode: 'newline',
          text: 'newline',
          allowDropAnywhere: true,
          disableMonitor: true,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'patch_command',
          text: 'inject js',
          mutator: 'cst_extendable',
          extensions: ['mio_extendable_string'],
          func: 'interpreter_error',
        }, {
          blockType: BlockType.REPORTER,
          opcode: 'patch_reporter',
          text: 'inject js',
          allowDropAnywhere: true,
          disableMonitor: true,
          mutator: 'cst_extendable',
          extensions: ['mio_extendable_string'],
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
    DEBUG() {
      runtime.debug = !runtime.debug;
      vm.extensionManager.refreshBlocks();
    }
    newline() {
      return '\n';
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

  // https://github.com/TurboWarp/extensions/pull/1254/files
  const cbfsb = runtime._convertBlockForScratchBlocks.bind(runtime);
  runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo) {
    const res = cbfsb(blockInfo, categoryInfo);
    if (blockInfo.mutator) res.json.mutator = blockInfo.mutator;
    return res;
  };
  if (Scratch.gui) Scratch.gui.getBlockly().then(ScratchBlocks => {
    const allExtensions = ScratchBlocks.Extensions.ALL_;

    const leftArrowIcon = `data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwIDEzIiB0cmFuc2Zvcm09InNjYWxlKC0xLCAxKSI+PHBhdGggZD0iTTMuNjUuMTQ1YTIuNDEgMi40MSAwIDAgMSAxLjcyLjcxbDMuOTIgMy45MmEyLjQ1IDIuNDUgMCAwIDEgMCAzLjQ1bC0zLjkyIDMuOTFhMi40MiAyLjQyIDAgMCAxLTEuNzIuNzIgMi40OCAyLjQ4IDAgMCAxLTEuNzMtLjcxYy0uMjQtLjI5LS43MS0uNzItLjcxLTUuNjUgMC00LjkzLjQ2LTUuMzkuNzEtNS42NGEyLjQ0IDIuNDQgMCAwIDEgMS43My0uNzF6IiBmaWxsPSIjMjMxZjIwIiBvcGFjaXR5PSIuMSIvPjxwYXRoIGQ9Ik04Ljk4NSA2LjUxYTEuNDMgMS40MyAwIDAgMS0uNDIgMWwtMy45MiAzLjk0YTEuNDQgMS40NCAwIDAgMS0yIDBjLS41Ni0uNTYtLjU2LTkuMzEgMC05Ljg3YTEuNDQgMS40NCAwIDAgMSAyIDBsMy45MiAzLjkyYTEuNDMgMS40MyAwIDAgMSAuNDIgMS4wMXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=`;
    const rightArrowIcon = `data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwIDEzIj48cGF0aCBkPSJNMy42NS4xNDVhMi40MSAyLjQxIDAgMCAxIDEuNzIuNzFsMy45MiAzLjkyYTIuNDUgMi40NSAwIDAgMSAwIDMuNDVsLTMuOTIgMy45MWEyLjQyIDIuNDIgMCAwIDEtMS43Mi43MiAyLjQ4IDIuNDggMCAwIDEtMS43My0uNzFjLS4yNC0uMjktLjcxLS43Mi0uNzEtNS42NSAwLTQuOTMuNDYtNS4zOS43MS01LjY0YTIuNDQgMi40NCAwIDAgMSAxLjczLS43MXoiIGZpbGw9IiMyMzFmMjAiIG9wYWNpdHk9Ii4xIi8+PHBhdGggZD0iTTguOTg1IDYuNTFhMS40MyAxLjQzIDAgMCAxLS40MiAxbC0zLjkyIDMuOTRhMS40NCAxLjQ0IDAgMCAxLTIgMGMtLjU2LS41Ni0uNTYtOS4zMSAwLTkuODdhMS40NCAxLjQ0IDAgMCAxIDIgMGwzLjkyIDMuOTJhMS40MyAxLjQzIDAgMCAxIC40MiAxLjAxeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==`;
    const arrowWidth = 16;
    const arrowHeight = 32;
    class FieldImageButton extends ScratchBlocks.FieldImage {
      constructor(src, width, height, callback, opt_alt, flip_rtl, noPadding) {
        super(src, width, height, opt_alt, flip_rtl);
        this._callback = callback.bind(this);
        this.noPadding = noPadding;
      }
      init() {
        if (this.fieldGroup_) {
          return;
        }
        super.init();
        this.mouseDownWrapper_ = ScratchBlocks.bindEventWithChecks_(
          this.getSvgRoot(),
          'mousedown',
          this,
          this.onMouseDown_
        );
        this.getSvgRoot().style.cursor = 'pointer';
      }
      showEditor_() {
        if (this._callback) {
          this._callback();
        }
      }
      getSize() {
        if (!this.size_.width) {
          this.render_();
        }
        if (!this.noPadding) return this.size_;
        return new this.size_.constructor(
          Math.max(1, this.size_.width - ScratchBlocks.BlockSvg.SEP_SPACE_X),
          this.size_.height
        );
      }
      EDITABLE = true;
    }
    ScratchBlocks.FieldImageButton = FieldImageButton;
    if (!allExtensions.cst_extendable) ScratchBlocks.Extensions.registerMutator(
      'cst_extendable',
      {
        domToMutation(xmlElement) {
          this.inputCount = Math.floor(
            Number(xmlElement.getAttribute('inputcount'))
          );
          this.inputCount = Math.min(
            Math.max(this.minInputs, this.inputCount),
            this.maxInputs
          );
          if (isNaN(this.inputCount) || !Number.isFinite(this.inputCount))
            this.inputCount = this.minInputs;
          this.prevInputCount = this.inputCount;
          this.updateDisplay_(true);
        },
        mutationToDom() {
          const container = document.createElement('mutation');
          container.setAttribute('inputcount', this.inputCount.toString());
          return container;
        },
        isExtendableInput(input) {
          return (
            input.name.startsWith('ARROW_') ||
            this.extendableDefs.some((def) => input.name.startsWith(def.id)) ||
            this.extendableDefsStart.some((def) =>
              input.name.startsWith(def.id)
            ) ||
            this.extendableDefsEnd.some((def) => input.name.startsWith(def.id))
          );
        },
        disconnectOldBlocks_() {
          const connectionMap = {};
          const hasEndBlocks = this.extendableDefsEnd.length > 0;
          const hasStartBlocks = this.extendableDefsStart.length > 0;
          const prevEndIndex = this.prevInputCount + (this.extendableDefsStart.length > 0);
          const reattachMap = Object.create(null);
          if (hasEndBlocks) {
            for (const def of this.extendableDefsEnd) {
              const input = this.getInput(
                this.getExtendableInput(def.id, prevEndIndex)
              );
              if (input && input.connection) {
                reattachMap[input.name] = def.id;
              }
            }
          }
          for (const input of this.inputList) {
            if (input.connection && this.isExtendableInput(input)) {
              const target = input.connection.targetBlock();
              const saveInfo = {
                shadow: input.connection.getShadowDom(),
                block: target,
              };
              let name = input.name;
              if (reattachMap[name]) {
                name = this.getExtendableInput(
                  reattachMap[name],
                  this.inputCount + hasStartBlocks
                );
                if (connectionMap[name]) {
                  connectionMap['$UNUSED' + name] = connectionMap[name];
                  delete connectionMap[name];
                }
              }
              if (connectionMap[name]) {
                connectionMap['$UNUSED' + name] = saveInfo;
              } else {
                connectionMap[name] = saveInfo;
              }
              input.connection.setShadowDom(null);
              if (target) {
                input.connection.disconnect();
              }
            }
          }
          return connectionMap;
        },
        removeAllInputs_() {
          this.inputList = this.inputList.filter((input) => {
            if (
              this.isExtendableInput(input) ||
              (input.type === ScratchBlocks.DUMMY_INPUT && this.clearLabels)
            ) {
              input.dispose();
              return false;
            }
            return true;
          });
        },
        attachShadow_(input, def) {
          if (!def.shadowType) return;
          ScratchBlocks.Events.disable();
          let newBlock;
          try {
            newBlock = this.workspace.newBlock(def.shadowType);
            newBlock.setFieldValue(def.shadowDefault, def.shadowField);
            newBlock.setShadow(true);
            if (!this.isInsertionMarker()) {
              newBlock.initSvg();
              newBlock.render(false);
            }
          } finally {
            ScratchBlocks.Events.enable();
          }
          if (ScratchBlocks.Events.isEnabled()) {
            ScratchBlocks.Events.fire(
              new ScratchBlocks.Events.BlockCreate(newBlock)
            );
          }
          if (newBlock.outputConnection)
            newBlock.outputConnection.connect(input.connection);
          else newBlock.previousConnection.connect(input.connection);
        },
        buildShadowDom_(def) {
          const shadowDom = document.createElement('shadow');
          shadowDom.setAttribute('type', def.shadowType);
          const fieldDom = document.createElement('field', null);
          fieldDom.setAttribute('name', def.shadowField);
          shadowDom.appendChild(fieldDom);
          return shadowDom;
        },
        populateArgument_(connectionMap, id, input, def) {
          let oldBlock = null;
          let oldShadow = null;
          if (connectionMap && id in connectionMap) {
            const saveInfo = connectionMap[id];
            oldBlock = saveInfo['block'];
            oldShadow = saveInfo['shadow'];
          }
          if (connectionMap && oldBlock) {
            connectionMap[id] = null;
            if (oldBlock.outputConnection)
              oldBlock.outputConnection.connect(input.connection);
            else oldBlock.previousConnection.connect(input.connection);
            if (def.shadowType) {
              const shadowDom = oldShadow || this.buildShadowDom_(def);
              input.connection.setShadowDom(shadowDom);
            }
          } else {
            this.attachShadow_(input, def);
          }
        },
        cleanInputs() {
          const target = Scratch.vm.editingTarget;
          if (!target) return;
          const blocks = this.isInFlyout
            ? Scratch.vm.runtime.flyoutBlocks
            : target.blocks;
          const vmBlock = blocks.getBlock(this.id);
          if (!vmBlock) return;
          const usedInputs = new Set(this.inputList.map((i) => i?.name));
          const inputs = vmBlock.inputs;
          for (const name of Object.keys(inputs)) {
            const input = inputs[name];
            if (!usedInputs.has(name)) {
              blocks.deleteBlock(input.block);
              blocks.deleteBlock(input.shadow);
              delete inputs[name];
            }
          }
        },
        getExtendableInput(prefix, index) {
          let id = prefix;
          if (prefix === 'SUBSTACK') {
            index += 1;
            if (index > 1) id += index;
          } else {
            id += index;
          }
          return id;
        },
        addInput_(def, i, connectionMap = null) {
          const id = this.getExtendableInput(def.id, i);
          const input = this.appendInput_(def.type, id);
          if (def.type === ScratchBlocks.DUMMY_INPUT) {
            input.appendField(def.check);
          } else {
            if (def.check) {
              input.setCheck(def.check);
            }
            this.populateArgument_(connectionMap, id, input, def);
          }
        },
        insertInput() {
          ScratchBlocks.Events.setGroup(true);
          const oldMutation = ScratchBlocks.Xml.domToText(this.mutationToDom());
          this.inputCount++;
          this.updateDisplay_();
          const newMutation = ScratchBlocks.Xml.domToText(this.mutationToDom());
          const ev = new ScratchBlocks.Events.BlockChange(
            this,
            'mutation',
            null,
            oldMutation,
            newMutation
          );
          ScratchBlocks.Events.fire(ev);
          ScratchBlocks.Events.setGroup(false);
        },
        deleteInput() {
          ScratchBlocks.Events.setGroup(true);
          const oldMutation = ScratchBlocks.Xml.domToText(this.mutationToDom());
          this.inputCount--;
          const plusInputs = this.extendableDefsStart.length > 0 ? 1 : 0;
          for (const def of this.extendableDefs) {
            this.removeInput(
              this.getExtendableInput(def.id, this.inputCount + plusInputs)
            );
          }
          this.updateDisplay_();
          const newMutation = ScratchBlocks.Xml.domToText(this.mutationToDom());
          const ev = new ScratchBlocks.Events.BlockChange(
            this,
            'mutation',
            null,
            oldMutation,
            newMutation
          );
          ScratchBlocks.Events.fire(ev);
          ScratchBlocks.Events.setGroup(false);
          this.cleanInputs();
        },
        createAllInputs_(connectionMap) {
          let index = 0;
          if (this.extendableDefsStart.length > 0) {
            for (const def of this.extendableDefsStart)
              this.addInput_(def, index, connectionMap);
            index++;
          }
          for (let i = 0; i < this.inputCount; i++) {
            for (const def of this.extendableDefs)
              this.addInput_(def, index, connectionMap);
            index++;
          }
          return index;
        },
        addArrowButtons_() {
          if (this.inputCount > this.minInputs) {
            const leftInput = this.appendDummyInput('ARROW_LEFT');
            const leftArrow = new FieldImageButton(
              leftArrowIcon,
              arrowWidth,
              arrowHeight,
              function () {
                this.sourceBlock_.deleteInput();
              },
              'Remove input',
              true,
              this.inputCount < this.maxInputs
            );
            leftInput.appendField(leftArrow);
          }
          if (this.inputCount < this.maxInputs) {
            const rightInput = this.appendDummyInput('ARROW_RIGHT');
            const rightArrow = new FieldImageButton(
              rightArrowIcon,
              arrowWidth,
              arrowHeight,
              function () {
                this.sourceBlock_.insertInput();
              },
              'Add Input',
              true,
              false
            );
            rightInput.appendField(rightArrow);
          }
        },
        updateDisplay_(force) {
          if (
            !this.isInsertionMarker() &&
            !force &&
            this.workspace?.currentGesture_?.isDraggingBlock_ &&
            this.workspace?.currentGesture_?.targetBlock_.type === this.type
          ) return;
          const wasRendered = this.rendered;
          if (this.isInFlyout) ScratchBlocks.Events.disable();
          this.rendered = false;
          this.extendableUpdatedDisplay = true;
          const connectionMap = this.disconnectOldBlocks_();
          this.removeAllInputs_();
          let index = this.createAllInputs_(connectionMap);
          this.addArrowButtons_();
          for (const def of this.extendableDefsEnd) this.addInput_(def, index, connectionMap);
          ScratchBlocks.ScratchBlocks.ProcedureUtils.deleteShadows_.call(this, connectionMap);
          this.prevInputCount = this.inputCount;
          this.rendered = wasRendered;
          if (wasRendered) {
            this.initSvg();
            this.render();
          }
          if (this.isInFlyout) ScratchBlocks.Events.enable();
        },
      },
      function() {
        this.extendableDefs = [];
        this.extendableDefsStart = [];
        this.extendableDefsEnd = [];
        this.inputCount = 2;
        this.minInputs = 1;
        this.maxInputs = Infinity;
        this.clearLabels = false;
        this.prevInputCount = this.inputCount;
      }
    );
    const createInput = (type, id, check = null, shadowType = undefined, shadowField = undefined, shadowDefault = undefined) => ({ type, id, check, shadowType, shadowField, shadowDefault });
    if (!allExtensions.mio_extendable_string) ScratchBlocks.Extensions.register('mio_extendable_string', function () {
      this.extendableDefs = [
        createInput(ScratchBlocks.INPUT_VALUE, 'ARG', null, 'text', 'TEXT', ''),
      ];
      this.minInputs = 1;
      this.inputCount = 1;
      this.prevInputCount = 0;
    });
  });

  Scratch.extensions.register(new extension());
})(Scratch);
