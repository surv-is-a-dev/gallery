/**!
 * Patches Test
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.1
 * @copyright MIT and LGPLv3 Licenses
 * Some Patch authors:
 * @author CST1229 https://scratch.mit.edu/users/CST1229/
 * @author LilyMakesThings https://scratch.mit.edu/users/CST1229/
 * @author Xeltalliv https://github.com/Xeltalliv/
 * Do not remove this comment
 */
(function (Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Patches Test" must be ran unsandboxed.`);
  }
  const extId = '0znzwPatchesTest';
  const Patches = ((Scratch, extId) => {
    const { vm } = Scratch;
    const { runtime } = vm;
    Scratch.BlockType.INLINE = Symbol('Patches.BlockType.INLINE');
    // Scratch.gui.getBlockly patch, 0znzw
    Scratch.gui = undefined;
    delete Scratch.gui;
    (function () {
      function getBlockly() {
        return new Promise((resolve_getBlockly, reject_getBlockly) => {
          // A single namespace as to not waste RAM with setTimeout loops
          if (!vm?.$LazySB)
            vm.$LazySB = {
              $dev: false,
              onBlockly(callback) {
                return new Promise((resolve_onBlockly, reject_onBlockly) => {
                  if (typeof window?.ScratchBlocks === 'object') resolve_onBlockly(window.ScratchBlocks);
                  function waitLoop() {
                    if (vm.$LazySB.$dev) console.log('wait loop');
                    if (typeof window?.ScratchBlocks !== 'object') {
                      if (vm.$LazySB.$dev) console.log('looping again');
                      setTimeout(() => waitLoop(), 10);
                    } else {
                      if (vm.$LazySB.$dev) console.log('Found Blockly, resolving onBlockly');
                      callback(window.ScratchBlocks);
                      resolve_onBlockly(window.ScratchBlocks);
                    }
                  }
                  setTimeout(() => waitLoop(), 10);
                });
              },
              waitingForBlockly: false,
              getBlocklyCallbacks: [],
            };
          const LazySB = vm.$LazySB;
          if (!LazySB.waitingForBlockly) {
            const LazySB = vm.$LazySB;
            if (LazySB.$dev) console.log('waiting for blockly');
            LazySB.onBlockly((Blockly) => {
              const LazySB = vm.$LazySB;
              if (LazySB.$dev) console.log('onBlockly callback called');
              while (LazySB.getBlocklyCallbacks.length > 0) {
                const callback = LazySB.getBlocklyCallbacks.shift();
                if (typeof callback === 'function') callback(Blockly);
              }
              LazySB.waitingForBlockly = false;
              if (LazySB.$dev) console.log('no longer waiting for Blockly');
            });
            LazySB.waitingForBlockly = true;
          }
          LazySB.getBlocklyCallbacks.push(function (Blockly) {
            resolve_getBlockly(Blockly);
          });
        });
      }
      if (!Scratch?.gui)
        Scratch.gui = Scratch?.gui ?? {
          getBlockly,
          getBlocklyEagerly() {
            console.warn('Scratch.gui.getBlocklyEagerly is patched in and does not work!');
            return this.getBlockly();
          },
        };
    })();
    // Patch compilation done by 0znzw
    const returnData = {
      duplicateOnDrag: [],
      // ADM by CST1229
      getCurrentBlockArgs() {
        // @ts-ignore Not typed yet.
        const ScratchBlocks = window.ScratchBlocks;
        if (!ScratchBlocks) return {};
        // @ts-ignore Type fuck-up
        const source = ScratchBlocks.selected;
        if (!source) return {};
        const args = {};
        for (const input of source.inputList) {
          for (const field of input.fieldRow) {
            if (field.isCurrentlyEditable()) args[field.name] = field.getValue();
          }
          if (!input.connection) continue;
          const block = input.connection.targetConnection.sourceBlock_;
          if (!block || !block.isShadow()) continue;
          for (const input2 of block.inputList) {
            for (const field2 of input2.fieldRow) {
              if (field2.isCurrentlyEditable()) args[input.name] = field2.getValue();
            }
          }
        }
        return args;
      },
      reloadWorkspace() {
        // https://github.com/TurboWarp/addons/blob/tw/addons/custom-block-shape/update-all-blocks.js
        const eventsOriginallyEnabled = Blockly.Events.isEnabled(),
          workspace = Blockly.getMainWorkspace();
        Blockly.Events.disable();
        if (workspace) {
          if (vm.editingTarget) {
            vm.emitWorkspaceUpdate();
          }
          const flyout = workspace.getFlyout();
          if (flyout) {
            const flyoutWorkspace = flyout.getWorkspace();
            Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.workspaceToDom(flyoutWorkspace), flyoutWorkspace);
            workspace.getToolbox().refreshSelection();
            workspace.toolboxRefreshEnabled_ = true;
          }
        }
        if (eventsOriginallyEnabled) Blockly.Events.enable();
      },
    };
    // CST1229 made this thingy lol
    const rscp = runtime.sequencer.constructor.prototype;
    const spst = rscp.stepThread;
    rscp.stepThread = function (thread) {
      if (thread.dontStepJustThisOneTime) {
        thread.dontStepJustThisOneTime = false;
        return;
      }
      return spst.call(this, thread);
    };
    const cbfsb = runtime._convertBlockForScratchBlocks.bind(runtime);
    runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo) {
      const fullOpcode = `${extId}_${blockInfo.opcode}`;
      if (blockInfo.blockType === Scratch.BlockType.INLINE) {
        (blockInfo.blockType = Scratch.BlockType.BOOLEAN), (blockInfo.branchCount = blockInfo.branchCount ?? 1);
        blockInfo.outputShape = 3;
        blockInfo.disableMonitor = true;
        blockInfo.output = [null];
        if (!Array.isArray(blockInfo.text)) blockInfo.text = [blockInfo.text];
      }
      if (typeof blockInfo?.shadowArgs === 'object') {
        const args = Object.entries(blockInfo.shadowArgs);
        let innerXml = '',
          blockXml = `<block type="${xmlEscape(fullOpcode)}">`;
        for (const argData of args) {
          const argName = argData[0],
            argJson = argData[1];
          let argXml = `<value name="${xmlEscape(argName)}"${argJson.valueArgs ? ' ' + argJson.valueArgs : ''}>`;
          if (argJson.insertXML) argXml += argJson.insertXml;
          let shadowArg = `<shadow type="${xmlEscape(argJson.shadowOpcode)}"${argJson.shadowArgs ? ' ' + argJson.shadowArgs : ''}></shadow>`;
          argXml += `${shadowArg}</value>`;
          innerXml += argXml;
        }
        blockXml += innerXml;
        blockXml += '</block>';
        blockInfo.hideFromPalette = true;
        categoryInfo.blocks.push({
          info: {
            blockType: Scratch.BlockType.XML,
            xml: blockXml,
          },
          xml: blockXml,
        });
      }
      const res = cbfsb(blockInfo, categoryInfo);
      if (blockInfo.outputShape) res.json.outputShape = blockInfo.outputShape;
      if (blockInfo.branchCount) res.json.branchCount = blockInfo.branchCount;
      if (blockInfo.output) (res.json.output = blockInfo.output), (res.json.check_ = blockInfo.output);
      if (blockInfo.duplicateOnDrag && !returnData.duplicateOnDrag.includes(fullOpcode)) returnData.duplicateOnDrag.push(fullOpcode);
      if (blockInfo.isTerminal) res.json.isTerminal = true;
      if (blockInfo.isTerminal && (blockInfo.blockType === Scratch.BlockType.HAT || blockInfo.blockType === Scratch.BlockType.EVENT)) {
        // res.json.previousStatement = undefined;
        res.json.nextStatement = undefined;
      }
      return res;
    };
    const _bmfsb = runtime._buildMenuForScratchBlocks;
    runtime._buildMenuForScratchBlocks = function (menuName, menuInfo, categoryInfo) {
      const res = _bmfsb.call(this, menuName, menuInfo, categoryInfo);
      if (menuInfo.output) res.json.output = menuInfo.output;
      if (menuInfo.outputShape) res.json.outputShape = menuInfo.outputShape;
      return res;
    };
    // @ts-ignore
    !(function (t, o) {
      /**
       * Tooltip Utility
       * @author 0znzw https://scratch.mit.edu/users/0znzw/
       * Please do not remove this comment
       * https://raw.githubusercontent.com/surv-is-a-dev/gallery/main/extensions/0znzw/TooltipUtil/1.0/production.js
       */ const e = t.vm,
        n = e.runtime,
        r = {};
      let i;
      function c(t, o) {
        const e = t.getAllBlocks().filter((t) => t.type == o),
          n = t.getBlockById(o);
        return n && e.push(n), e;
      }
      const l = n._convertBlockForScratchBlocks.bind(n);
      function a() {
        for (const t of Object.keys(r)) {
          const e = r[t],
            n = e.warning,
            l = e.tooltip;
          let a = 0;
          const s = (t, o) => {
            if (!o) return;
            let e = o.iconGroup_,
              n = o.bubble_;
            o.hasClick && e.removeEventListener('mousedown', o.hasClick),
              (o.hasClick = function (e) {
                if ((e.stopPropagation(), o.iconClick_(e), (n = o.bubble_ ?? { rendered_: !1 }), n.rendered_)) {
                  const o = r[t.type].warning;
                  Array.from(n.content_.children).forEach((t) => {
                    o.textColour && t.setAttribute('fill', o.textColour), o.bubbleColour && n.setColour(o.bubbleColour);
                  });
                }
              }),
              e.addEventListener('mousedown', o.hasClick);
          };
          c(i, t).forEach((t) => {
            if (
              (t.setWarningText(null),
              n &&
                (Array.isArray(n.text)
                  ? n.text.forEach((e) => {
                      t.setWarningText(e, `${o}_${a}`), a++;
                    })
                  : t.setWarningText(n.text, o)),
              l)
            ) {
              let o = l.text ?? '';
              Array.isArray(l.text) && (o = l.text.join('\n')), t.setTooltip(o);
            }
          }),
            i
              .getAllBlocks()
              .filter((t) => t.warning)
              .forEach((t) => s(t, t.warning));
        }
      }
      function s() {
        window.ScratchBlocks && ((i = ScratchBlocks.getMainWorkspace()), e.removeListener('EXTENSION_ADDED', s), e.removeListener('BLOCKSINFO_UPDATE', s), e.on('workspaceUpdate', a), e.runtime.on('BLOCK_DRAG_UPDATE', a), e.runtime.on('BLOCK_DRAG_END', a));
      }
      (n._convertBlockForScratchBlocks = function (t, o) {
        const e = l(t, o),
          n = o.id + '_' + t.opcode;
        r[n] = { warning: {}, tooltip: {} };
        const i = r[n];
        if (t.tooltip) {
          const o = t.tooltip,
            n = i.tooltip;
          return 'string' == typeof o || Array.isArray(o) ? ((n.text = o), e) : (console.warn('Invalid typeof tooltip [accepted: string || array]'), e);
        }
        if (t.warning) {
          const o = t.warning,
            n = i.warning;
          switch (typeof o) {
            case 'string':
              return (n.text = o), e;
            case 'object':
              return (n.text = o.text ?? ''), o.bubbleColour && (n.bubbleColour = o.bubbleColour), o.textColour && (n.textColour = o.textColour), e;
            default:
              return console.warn('Invalid typeof warning [accepted: string || object]'), e;
          }
        }
        return e;
      }),
        e.on('EXTENSION_ADDED', s),
        e.on('BLOCKSINFO_UPDATE', s),
        s();
    })(Scratch, extId);
    // https://github.com/Xeltalliv/extensions/blob/examples/examples/custom-field-types.js
    const bcfi = runtime._buildCustomFieldInfo.bind(runtime);
    const bcftfsb = runtime._buildCustomFieldTypeForScratchBlocks.bind(runtime);
    let fi = null;
    runtime._buildCustomFieldInfo = function (fieldName, fieldInfo, extensionId, categoryInfo) {
      fi = fieldInfo;
      return bcfi(fieldName, fieldInfo, extensionId, categoryInfo);
    };
    runtime._buildCustomFieldTypeForScratchBlocks = function (fieldName, output, outputShape, categoryInfo) {
      let res = bcftfsb(fieldName, output, outputShape, categoryInfo);
      if (fi) {
        if (fi.color1) res.json.colour = fi.color1;
        if (fi.color2) res.json.colourSecondary = fi.color2;
        if (fi.color3) res.json.colourTertiary = fi.color3;
        fi = null;
      }
      return res;
    };
    if (Scratch?.gui)
      Scratch.gui.getBlockly().then((ScratchBlocks) => {
        // CST1229 & LilyMakesThings
        const sbuisar = ScratchBlocks.scratchBlocksUtils.isShadowArgumentReporter;
        ScratchBlocks.scratchBlocksUtils.isShadowArgumentReporter = function (block) {
          const result = sbuisar(block);
          if (result) return result;
          return /*block.isShadow() && */ returnData.duplicateOnDrag.includes(block.type);
        };
      });
    return returnData;
  })(Scratch, extId);
  console.warn(`You are using a test extension ("${extId}") which uses alot of patches, please dont complain if your stuff breaks.\nThx!`);
  // Unused but included patches: custom field info colors and skip step thread.
  class extension {
    constructor() {
      this.funnyHatCond = Symbol(`${extId}.FunnyHatPrevCondition`);
    }
    getInfo() {
      return {
        id: extId,
        name: 'Patches test',
        blocks: [
          {
            tooltip: 'menu shape patch',
            opcode: 'menushape',
            text: 'menu shape [A]',
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, menu: 'shape' },
            },
            blockType: Scratch.BlockType.COMMAND,
          },
          {
            tooltip: 'duplicate on drag patch',
            opcode: 'dupeondrag',
            text: 'drag me to duplicate',
            arguments: {
              A: { type: Scratch.ArgumentType.STRING },
            },
            duplicateOnDrag: true,
            blockType: Scratch.BlockType.COMMAND,
          },
          {
            // For some reason tooltip AND warning at the same time broke it :(
            // tooltip: 'all blocks have a tooltip in this extension.',
            opcode: 'tooltipwarning',
            text: 'warning block (put in workspace)',
            warning: {
              text: 'wow a warning hover on the blocks for a tooltip!',
              textColour: '#FFFFFF',
              bubbleColour: '#000000',
            },
            blockType: Scratch.BlockType.COMMAND,
          },
          {
            tooltip: 'block shape and output patch',
            opcode: 'shapeoutput',
            text: 'block and output shape (acts like a boolean)',
            blockType: Scratch.BlockType.REPORTER,
            output: 'Boolean',
            outputShape: 3,
          },
          {
            tooltip: 'branch on a hat patch',
            opcode: 'branchhat',
            text: ['hat', 'with', 'branches!'],
            branchCount: 2,
            isTerminal: true,
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
          },
          {
            opcode: 'inlineshape',
            text: ['inline', 'block!'],
            blockType: Scratch.BlockType.INLINE,
          },
          // working blocks etc
          {
            text: '(thanks jeijbmc and this works!)',
            blockType: Scratch.BlockType.LABEL,
          },
          {
            opcode: 'funnyhat',
            text: ['when [COND] is | true:', 'false:'],
            branchCount: 2,
            isTerminal: true,
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: true,
          },
        ],
        menus: {
          shape: {
            items: ['menu shape'],
            outputShape: 1,
            acceptReporters: true,
          },
        },
      };
    }
    // All useless
    menushape() {}
    branchhat() {}
    dupeondrag_shadow() {}
    dupeondrag() {}
    tooltipwarning() {}
    shapeoutput() {}
    inlineshape() {}
    // Funny hat
    spawnandwaitforthread(blockId, util) {
      const Thread = util.thread.constructor;
      const thread = vm.runtime._pushThread(blockId, vm.editingTarget, { stackClick: true, refreshMonitors: false });
      if (thread.status === Thread.STATUS_DONE) return true;
      return new Promise((resolve) => {
        vm.runtime.on('AFTER_EXECUTE', function afterExecute() {
          if (thread.status === Thread.STATUS_DONE) {
            vm.runtime.off('AFTER_EXECUTE', afterExecute);
            resolve(true);
          }
        });
      });
    }
    async funnyhat({ COND }, util) {
      const thread = util.thread;
      const blockId = thread.isCompiled ? thread.peekStack() : thread.peekStackFrame().op.id;
      const blocks = thread.target.blocks;
      const block = blocks.getBlock(blockId);
      if (COND !== block?.[this.funnyHatCond]) {
        block[this.funnyHatCond] = COND;
        const branch1 = blocks.getBranch(blockId, 1);
        const branch2 = blocks.getBranch(blockId, 2);
        if (COND) {
          if (!branch1) return false;
          await this.spawnandwaitforthread(branch1, util);
        } else {
          if (!branch2) return false;
          await this.spawnandwaitforthread(branch2, util);
        }
      }
      return false;
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
