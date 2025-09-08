/**!
 * USB Pause
 * @author 0znzw <meow@miyo.icu> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 * Original Concept by SharkPool
 */
(function (Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed || !Scratch.extensions.isUSB) {
    throw new Error(`"USB Pause" must be ran unsandboxed.`);
  }
  const { BlockType, ArgumentType, Cast, vm } = Scratch, { runtime } = vm;
  const extId = '0znzwUSBPause', Runtime = runtime.constructor;
  const { Thread } = vm.exports.i_will_not_ask_for_help_when_these_break();
  let ScratchBlocks;
  if (Scratch.gui) Scratch.gui.getBlockly().then(Blockly => ScratchBlocks = Blockly);
  // Thanks CST1229 for this function.
  // Sourced from: https://github.com/surv-is-a-dev/gallery/blob/dfe44a322a125d441c35696d01e82925b304bdda/site-files/extensions/0znzw/MoreButtons.js
  function getCurrentBlockArgs() {
    if (!ScratchBlocks) return {};
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
  }
  class extension {
    constructor() {
      runtime.on(Runtime.PROJECT_PAUSE, () => {
        runtime.startHats(`${extId}_onStatusChange`).forEach(thread => {
          thread.setStatus(Thread.STATUS_RUNNING);
        });
      });
    }
    set pauseStatus(status) {
      runtime.setPause(status);
    }
    get pauseStatus() {
      return runtime.paused;
    }
    getInfo() {
      return {
        id: extId,
        name: 'USB Pause',
        blocks: [{
          opcode: 'pauseProject',
          blockType: BlockType.COMMAND,
          text: '[STATUS] project',
          arguments: {
            STATUS: { type: ArgumentType.STRING, menu: 'pause', defaultValue: 'pause' },
          },
        }, '---', {
          opcode: 'pauseTarget',
          blockType: BlockType.COMMAND,
          text: '[STATUS] [TARGET]',
          arguments: {
            STATUS: { type: ArgumentType.STRING, menu: 'pause', defaultValue: 'pause' },
            TARGET: { type: ArgumentType.STRING, menu: 'sprites', defaultValue: 'myself' },
          },
        }, {
          opcode: 'pauseTargetClones',
          blockType: BlockType.COMMAND,
          text: '[STATUS] [TARGET]\'s clones',
          arguments: {
            STATUS: { type: ArgumentType.STRING, menu: 'pause', defaultValue: 'pause' },
            TARGET: { type: ArgumentType.STRING, menu: 'sprites', defaultValue: 'myself' },
          },
        }, {
          opcode: 'pauseTargetClone',
          blockType: BlockType.COMMAND,
          text: '[STATUS] clones of [TARGET] with [VARIABLE] set to [VALUE]',
          arguments: {
            STATUS: { type: ArgumentType.STRING, menu: 'pause', defaultValue: 'pause' },
            TARGET: { type: ArgumentType.STRING, menu: 'sprites', defaultValue: 'myself' },
            VARIABLE: { type: ArgumentType.STRING, menu: 'variables' },
            VALUE: { type: ArgumentType.STRING, defaultValue: '1' },
          },
        }, '---', {
          opcode: 'pauseThread',
          blockType: BlockType.COMMAND,
          text: 'pause thread',
        }, {
          opcode: 'pauseThreadName',
          blockType: BlockType.COMMAND,
          text: '[STATUS] thread with id: [NAME]',
          arguments: {
            STATUS: { type: ArgumentType.STRING, menu: 'pause', defaultValue: 'pause' },
            NAME: { type: ArgumentType.STRING, defaultValue: 'my thread' },
          },
        }, '---', {
          opcode: 'getPauseStatus',
          blockType: BlockType.BOOLEAN,
          text: 'project paused?',
          disableMonitor: true,
        }, {
          opcode: 'onStatusChange',
          blockType: BlockType.EVENT,
          text: 'when project pause status changes',
          isEdgeActivated: false,
        }],
        menus: {
          pause: {
            items: [{
              text: 'pause',
              value: 'pause',
            }, {
              text: 'unpause',
              value: 'unpause',
            }, {
              text: 'toggle pause status of',
              value: 'toggle',
            }],
            acceptReporters: true,
            acceptText: true,
          },
          sprites: {
            items: 'getSprites',
            acceptReporters: true,
            acceptText: false,
          },
          variables: {
            items: 'getVariables',
            acceptReporters: true,
            acceptText: true,
          },
        },
      };
    }
    pauseProject({ STATUS }) {
      STATUS = this.castStatusBool(STATUS);
      if (this.pauseStatus === STATUS) return;
      this.pauseStatus = STATUS;
    }
    pauseTarget({ STATUS, TARGET }, util) {
      if (!(TARGET = this.getTarget(TARGET, util.target))) return;
      STATUS = this.castStatusBool(STATUS, TARGET.paused);
      if (TARGET.paused === STATUS) return;
      TARGET.setPause(STATUS);
    }
    pauseTargetClones({ STATUS, TARGET }, util) {
      STATUS = this.castStatusStr(STATUS);
      if (!(TARGET = this.getTarget(TARGET, util.target))) return;
      for (const clone of TARGET.sprite.clones.slice(1)) {
        if (clone.paused === STATUS) continue;
        clone.setPause(this.castStatusBool(STATUS, clone.paused));
      }
    }
    pauseTargetClone({ STATUS, TARGET, VARIABLE, VALUE }, util) {
      if (!(TARGET = this.getTarget(TARGET, util.target))) return;
      for (const clone of TARGET.sprite.clones.slice(1)) {
        const cloneVar = clone.lookupVariableById(this.convertVariableName(Cast.toString(VARIABLE), TARGET));
        if (!cloneVar) continue;
        if (Cast.compare(cloneVar.value, VALUE) !== 0) continue;
        STATUS = this.castStatusBool(STATUS, clone.paused);
        if (clone.paused === STATUS) continue;
        clone.setPause(STATUS);
      }
    }
    pauseThread(_, util) {
      util.thread.setStatus(Thread.STATUS_PAUSED);
    }
    pauseThreadName({ STATUS, NAME }) {
      NAME = getThreadFromPID(Cast.toString(NAME));
      if (!NAME) return;
      STATUS = this.castStatusBool(STATUS, (NAME.status === Thread.STATUS_PAUSED));
      NAME.setStatus(STATUS);
    }
    getPauseStatus() {
      return this.pauseStatus;
    }
    onStatusChange() {
      return true;
    }
    // Utils
    castStatusStr(STATUS) {
      STATUS = Cast.toString(STATUS).toLowerCase();
      if (
        STATUS === 'pause' ||
        STATUS === 'unpause' ||
        STATUS === 'toggle'
      ) return STATUS;
      return 'toggle';
    }
    castStatusBool(STATUS, pauseStatus) {
      STATUS = this.castStatusStr(STATUS);
      if (STATUS === 'pause') return true;
      if (STATUS === 'toggle') return !(pauseStatus ?? this.pauseStatus);
      return false;
    }
    getTarget(TARGET, utilTarget) {
      TARGET = Cast.toString(TARGET);
      if (TARGET === '_myself_') return utilTarget;
      TARGET = runtime.getTargetById(TARGET) || runtime.getSpriteTargetByName(TARGET);
      return TARGET || utilTarget;
    }
    getVariables() {
      let target = vm.editingTarget;
      const blockArgs = getCurrentBlockArgs();
      if (blockArgs) target = this.getTarget(blockArgs.TARGET, target);
      if (!target) return [{ text: '', value: '' }];
      const variables = Object.values(target.variables).map(variable => ({
        text: variable.name,
        value: variable.id,
      }));
      if (!variables[0]) return [{ text: '', value: '' }];
      return variables;
    }
    convertVariableName(name, target) {
      return Object.values(target.variables).find(variable => (
        Cast.compare(variable.name, name) === 0 ||
        variable.id === name
      )).id;
    }
    getThreadFromPID(pid) {
      return runtime.threads.find(thread => (
        Cast.compare(thread.name, pid) === 0 ||
        thread.id === pid
      ));
    }
    // getSprites borrowed and modified from
    // https://extensions.turbowarp.org/Lily/ClonesPlus.js
    getCloneFromVariable(variableId, expectedValue, clones) {
      for (let i = 1; i < clones.length; i++) {
        const cloneVar = clones[i].lookupVariableById(variableId);
        if (!cloneVar) continue;
        if (Cast.compare(cloneVar.value, expectedValue) !== 0) continue;
        return clones[i];
      }
      return null;
    }
    getSprites() {
      let spriteNames = [];
      if (vm.editingTarget) spriteNames.push({
        text: 'myself',
        value: '_myself_',
      });
      for (let i = 0; i < runtime.targets.length; i++) {
        const target = runtime.targets[i];
        if (!target.isOriginal || target.isStage) continue;
        spriteNames.push({
          text: target.getName(),
          value: target.id,
        });
      }
      if (spriteNames[0]) return spriteNames;
      return [{ text: '', value: '' }];
    }
  }
  Scratch.extensions.register(runtime[`ext_${extId}`] = new extension());
})(Scratch);
