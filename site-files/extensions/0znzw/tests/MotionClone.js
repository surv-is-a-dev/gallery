/**!
 * Motion Category Remake
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch, Unsandboxed) {
  if (!Scratch.extensions.unsandboxed || !(Scratch.extensions.isUSB && Unsandboxed)) {
    throw new Error(`"Motion" must be ran unsandboxed!`);
  }
  const extId = '0znzwMotion';
  const { BlockType, ArgumentType, vm } = Scratch, { runtime } = vm;
  let ScratchBlocks = globalThis.ScratchBlocks;
  if (!ScratchBlocks && Scratch.gui) Scratch.gui.getBlockly().then(Blockly => {
    ScratchBlocks = Blockly;
  });
  class extension extends (vm.runtime.ext_scratch3_motion.constructor) {
    static getMonitorId(targetId) {
      return `${targetId || vm.editingTarget.id}_${extId}_${this}`;
    }
    static getColours() {
      const Colours = (ScratchBlocks ? ScratchBlocks.Colours.motion : ({
        primary: '#4C97FF',
        secondary: '#4280D7',
        tertiary: '#3373CC',
        quaternary: '#3373CC',
      }));
      return {
        color1: Colours.primary,
        color2: Colours.secondary,
        color3: Colours.tertiary,
        color4: Colours.quaternary,
      };
    }
    constructor() {
      super(runtime);
      const sup = this.getPrimitives();
      Object.entries(sup).forEach(entr => this[entr[0].slice(entr[0].indexOf('_') + 1)] = entr[1]);
      for (const block of this._getDynamics(false, false)) {
        runtime.monitorBlockInfo[`${extId}_${block.opcode}`] = {
          [extId]: true,
          isSpriteSpecific: true,
          getId: extension.getMonitorId.bind(block.opcode),
        };
      }
      const BlockContainer = runtime.flyoutBlocks.__proto__.constructor;
      const cB = BlockContainer.prototype.createBlock;
      BlockContainer.prototype.createBlock = function(block, ...args) {
        if (
          this !== runtime.flyoutBlocks &&
          this !== runtime.monitorBlocks
        ) return cB.call(this, block, ...args);
        const monitorInfo = runtime.monitorBlockInfo[block.opcode] || {};
        if (monitorInfo.isSpriteSpecific && monitorInfo[extId]) {
          block.targetId = vm.editingTarget.id;
          block.id = monitorInfo.getId(block.targetId);
        }
        return cB.call(this, block, ...args);
      };
      runtime.flyoutBlocks.createBlock = BlockContainer.prototype.createBlock.bind(runtime.flyoutBlocks);
      runtime.monitorBlocks.createBlock = BlockContainer.prototype.createBlock.bind(runtime.monitorBlocks);
      const _aS = BlockContainer.prototype._addScript;
      BlockContainer.prototype._addScript = function(id, ...args) {
        if (
          this !== runtime.flyoutBlocks &&
          this !== runtime.monitorBlocks
        ) return _aS.call(this, id, ...args);
        const monitorInfo = runtime.monitorBlockInfo[id] || {};
        if (monitorInfo.isSpriteSpecific && monitorInfo[extId]) {
          id = monitorInfo.getId(vm.editingTarget.id);
        }
        return _aS.call(this, id, ...args);
      };
      runtime.flyoutBlocks._addScript = BlockContainer.prototype._addScript.bind(runtime.flyoutBlocks);
      runtime.monitorBlocks._addScript = BlockContainer.prototype._addScript.bind(runtime.monitorBlocks);
    }
    getInfo() {
      const hideFromPalette = vm.editingTarget.isStage;
      return {
        id: extId,
        name: 'Motion',
        ...extension.getColours(),
        blocks: [{
          blockType: BlockType.LABEL,
          text: 'Stage selected: no motion blocks',
          hideFromPalette: !hideFromPalette,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'movesteps',
          text: 'move [STEPS] steps',
          arguments: {
            STEPS: { type: ArgumentType.NUMBER, defaultValue: 10 },
          },
          hideFromPalette,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'turnright',
          text: 'turn [ARROW] [DEGREES] degrees',
          arguments: {
            ARROW: { type: ArgumentType.IMAGE, dataURI: 'static/blocks-media/default/rotate-right.svg' },
            DEGREES: { type: ArgumentType.NUMBER, defaultValue: 15 },
          },
          hideFromPalette,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'turnleft',
          text: 'turn [ARROW] [DEGREES] degrees',
          arguments: {
            ARROW: { type: ArgumentType.IMAGE, dataURI: 'static/blocks-media/default/rotate-left.svg' },
            DEGREES: { type: ArgumentType.NUMBER, defaultValue: 15 },
          },
          hideFromPalette,
        }, '---', {
          blockType: BlockType.COMMAND,
          opcode: 'goto',
          text: 'go to [TO]',
          arguments: {
            TO: { type: ArgumentType.STRING, menu: 'targetsGoto' },
          },
          hideFromPalette,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'gotoxy',
          text: 'go to x: [X] y: [Y]',
          arguments: {
            X: { type: ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
          },
          hideFromPalette,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'changebyxy',
          text: 'change by x: [X] y: [Y]',
          arguments: {
            X: { type: ArgumentType.NUMBER, defaultValue: 10 },
            Y: { type: ArgumentType.NUMBER, defaultValue: 10 },
          },
          hideFromPalette,
        }, '---', {
          blockType: BlockType.COMMAND,
          opcode: 'pointtowards',
          text: 'point in direction [TOWARDS]',
          arguments: {
            TOWARDS: { type: ArgumentType.STRING, menu: 'targetsDir' },
          },
          hideFromPalette,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'pointtowardsxy',
          text: 'point towards x: [X] y: [Y]',
          arguments: {
            X: { type: ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
          },
          hideFromPalette,
        }, '---', {
          blockType: BlockType.COMMAND,
          opcode: 'changexby',
          text: 'change x by [DX]',
          arguments: {
            DX: { type: ArgumentType.NUMBER, defaultValue: vm.editingTarget.x },
          },
          hideFromPalette,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'setx',
          text: 'set x to [X]',
          arguments: {
            X: { type: ArgumentType.NUMBER, defaultValue: 10 },
          },
          hideFromPalette,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'changeyby',
          text: 'change y by [DY]',
          arguments: {
            DY: { type: ArgumentType.NUMBER, defaultValue: 10 },
          },
          hideFromPalette,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'sety',
          text: 'set y to [Y]',
          arguments: {
            Y: { type: ArgumentType.NUMBER, defaultValue: vm.editingTarget.y },
          },
          hideFromPalette,
        }, '---', {
          blockType: BlockType.COMMAND,
          opcode: 'setrotationstyle',
          text: 'set rotation style [STYLE]',
          arguments: {
            STYLE: { type: ArgumentType.STRING, menu: 'rotationStyle' },
          },
          hideFromPalette,
        }, ...this._getDynamics(hideFromPalette, true)],
        menus: {
          targetsGoto: {
            acceptReporters: true,
            items: '_getTargetsGoto',
          },
          targetsDir: {
            acceptReporters: true,
            items: '_getTargetsDir',
          },
          rotationStyle: {
            acceptReporters: false,
            items: ['left-right', 'looking', 'don\'t rotate', 'all around'],
          },
        },
      };
    }
    _getBlock(id) {
      return (
        vm.editingTarget.blocks.getBlock(id) ||
        runtime.getTargetForStage().blocks.getBlock(id)
      );
    }
    _getTargetsInternal(gotoTargetBlock) {
      let targets = [{
        text: 'mouse-pointer',
        value: '_mouse_',
      }, {
        text: 'camera',
        value: '_camera_',
      }, {
        text: 'random direction',
        value: '_random_',
      }];
      if (gotoTargetBlock) {
        targets = [{
          text: 'random position',
          value: '_random_',
        }, {
          text: 'camera',
          value: '_camera_',
        }, {
          text: 'mouse-pointer',
          value: '_mouse_',
        }];
      }
      return targets.concat(vm.runtime.targets.filter(t => (
        !t.isStage && t.isOriginal && t.id !== vm.editingTarget.id
      )).map(t => ({
        text: t.getName(),
        value: t.id,
      })));
    }
    _getTargetsGoto() {
      return this._getTargetsInternal(true);
    }
    _getTargetsDir() {
      return this._getTargetsInternal(false);
    }
    _getDynamics(hideFromPalette, xml) {
      const blocks = [{
        blockType: BlockType.REPORTER,
        opcode: 'rotationstyle',
        text: 'rotation style',
        hideFromPalette: (xml ? true : hideFromPalette),
      }, '---', {
        blockType: BlockType.REPORTER,
        opcode: 'xposition',
        text: 'x position',
        hideFromPalette: (xml ? true : hideFromPalette),
      }, {
        blockType: BlockType.REPORTER,
        opcode: 'yposition',
        text: 'y position',
        hideFromPalette: (xml ? true : hideFromPalette),
      }, {
        blockType: BlockType.REPORTER,
        opcode: 'direction',
        text: 'direction',
        hideFromPalette: (xml ? true : hideFromPalette),
      }];
      if (xml) return blocks.flatMap((block) => {
        if (block === '---') return [block];
        const xml = `<block type="${extId}_${block.opcode}" id="${extension.getMonitorId.call(block.opcode)}"></block>`;
        return [block, {
          blockType: BlockType.XML,
          xml,
          hideFromPalette,
        }];
      });
      return blocks;
    }
  }
  Scratch.extensions.register(new extension());
})(globalThis.Scratch, globalThis.Unsandboxed);