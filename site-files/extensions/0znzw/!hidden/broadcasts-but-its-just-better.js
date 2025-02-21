/**!
 * Broadcasts but better
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.2
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Broadcasts but better" must be ran unsandboxed.`);
  }
  const extId = '0znzwBroadcastButBetter';
  const { vm, BlockType, ArgumentType, Cast } = Scratch, runtime = vm.runtime;

  const runHats = (opcode) => {
    // https://github.com/surv-is-a-dev/gallery/blob/main/site-files/extensions/0znzw/tests/hidden/runHats.js
    const threads = [];
    for (const target of runtime.targets) {
      Object.values(target.blocks._blocks).filter(block => block.opcode === opcode).forEach(block => {
        threads.push(runtime._pushThread(block.id, target, { stackClick: true }));
      });
    }
    return threads;
  };
  const broadcast = (args, util, todo) => {
    todo = todo || { forEach: () => {}, skipNormal: false };
    let threads = [];
    return(threads = [...runHats(`${extId}_receive`), ...(todo.skipNormal ? [] : util.startHats('event_whenbroadcastreceived', {
      BROADCAST_OPTION: args.BROADCAST_OPTION,
    }))], threads.forEach(thread => {
      thread._MiyoEventsReject = () => thread.status = 4;
      thread._MiyoEventsResolve = () => true;
      thread.broadcastArguments = args;
      thread.receivedData = args.data ?? '';
      thread.status = (args.targets && args.targets.includes(thread.target.id) ? thread.status : 4);
      todo.forEach(thread);
    }), threads.filter(thread => thread.status !== 4));
  };
  const get_broadcast = (args, util, todo) => new Promise((resolve) => {
    todo = todo || { forEach() {} };
    let intersection = [];
    const hats = new Set(broadcast(args, util, { forEach(thread) {
      thread._MiyoEventsReject = (function() {
        this.status = 4;
        hats.delete(this);
        if (hats.size === 0) resolve(intersection);
      }).bind(thread);
      thread._MiyoEventsResolve = (function() {
        hats.delete(this);
        intersection.push(this);
        if (hats.size === 0) resolve(intersection);
      }).bind(thread);
      todo.forEach(thread);
    } }));
    Array.from(hats).forEach(thread => {
      const topOpcode = thread.blockContainer.getBlock(thread.topBlock).opcode;
      if (topOpcode === `${extId}_receive`) return;
      thread._MiyoEventsResolve();
    });
    if (hats.size === 0) resolve([]);
  });
  const broadcastAndWait = (args, util) => new Promise((resolve) => {
    const hats = new Set();
    get_broadcast(args, util, { forEach(thread) {
      const _MER = thread._MiyoEventsReject.bind(thread);
      thread._MiyoEventsReject = () => {
        _MER();
        hats.delete(thread);
      };
      if (thread.status !== 4) hats.add(thread);
      thread._MiyoEventsStatus = thread.status;
      Object.defineProperty(thread, 'status', {
        set: (function(status) {
          if (status === 4) {
            this.hats.delete(this.thread);
            console.log(this.hats.size, this.hats);
            if (this.hats.size === 0) resolve();
          }
          this.thread._MiyoEventsStatus = status;
          return true;
        }).bind({ thread, hats }),
        get: (function() {
          return this._MiyoEventsStatus;
        }).bind(thread),
      });
    } }).then(_ => {
      if (hats.size === 0) resolve();
    });
  });

  const alphaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const uid = function (len, soup) {
    const soup_ = soup ?? ('!#%()*+,-./:;=?@[]^_`{|}~' + alphaChars);
    const length = len ?? 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
      id[i] = soup_.charAt(Math.random() * soupLength);
    }
    return id.join('');
  };

  class extension {
    constructor() {
      runtime[`ext_${extId}`] = this;
      // 255 is excessive, but tbh idc
      const idenLen = 255;
      this.IdenWithData = uid(idenLen);
      this.IdenToTarget = uid(idenLen);
      this.IdenWaitStatus = uid(idenLen);
    }
    getInfo() {
      return {
        id: extId,
        name: 'Broadcasts but better',
        color1: '#FFBF00',
        color2: '#E6AC00',
        color3: '#CC9900',
        ...(window?.ScratchBlocks ? {
          color1: ScratchBlocks.Colours.event.primary,
          color2: ScratchBlocks.Colours.event.secondary,
          color3: ScratchBlocks.Colours.event.tertiary,
        } : {}),
        blocks: [{
          opcode: 'receive',
          blockType: BlockType.HAT,
          text: 'when I receive [BROADCAST_OPTION]',
          isEdgeActivated: false,
          arguments: {
            BROADCAST_OPTION: {
              type: ArgumentType.STRING,
              defaultValue: 'message1',
            },
          },
          extensions: ['colours_event'],
          hideFromPalette: true,
        }, {
          blockType: BlockType.XML,
          xml: `<block type="${extId}_receive"><value name="BROADCAST_OPTION"><shadow type="event_broadcast_menu"></shadow></value></block>`,
        }, {
          opcode: 'broadcast2',
          blockType: BlockType.COMMAND,
          text: 'broadcast [BROADCAST_OPTION] [OPTIONS]',
          arguments: {
            BROADCAST_OPTION: {
              type: ArgumentType.STRING,
              defaultValue: 'message1',
            },
            OPTIONS: {
              type: null,
            },
          },
          extensions: ['colours_event'],
          hideFromPalette: true,
        }, {
          blockType: BlockType.XML,
          xml: `<block type="${extId}_broadcast2"><value name="BROADCAST_OPTION"><shadow type="event_broadcast_menu"></shadow></value><value name="OPTIONS"></value></block>`,
        }, {
          opcode: 'getData',
          blockType: BlockType.REPORTER,
          text: 'received data',
          extensions: ['colours_event'],
          allowDropAnywhere: true,
          disableMonitor: true,
        }, '---', {
          opcode: 'opt_join',
          blockType: BlockType.REPORTER,
          text: '[A],[B]',
          arguments: {
            A: {
              type: null,
            },
            B: {
              type: null,
            }
          },
          extensions: ['colours_event'],
        }, {
          opcode: 'opt_withData',
          blockType: BlockType.REPORTER,
          text: 'with data [DATA]',
          arguments: {
            DATA: {
              type: ArgumentType.STRING,
              defaultValue: 'dataaa~',
            },
          },
          extensions: ['colours_event'],
        }, {
          opcode: 'opt_waitStatus',
          blockType: BlockType.REPORTER,
          text: 'and [DO_WAIT]',
          arguments: {
            DO_WAIT: {
              type: ArgumentType.STRING,
              defaultValue: 'wait',
              menu: 'WAIT_STATUS',
            },
          },
          extensions: ['colours_event'],
        }, {
          opcode: 'opt_toTarget',
          blockType: BlockType.REPORTER,
          text: 'to [TARGET] [CLONES]',
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              defaultValue: 'Stage',
              menu: 'TARGETS',
            },
            CLONES: {
              type: ArgumentType.STRING,
              defaultValue: 'only',
              menu: 'CLONE_STATUS',
            },
          },
          extensions: ['colours_event'],
        }],
        menus: {
          WAIT_STATUS: {
            acceptReporters: true,
            items: [{ text: 'don\'t wait', value: 'don\'t wait' }, { text: 'wait', value: 'wait' }],
          },
          CLONE_STATUS: {
            acceptReporters: true,
            items: [{ text: 'only', value: 0 }, { text: 'clones', value: 1 }, { text: 'and its clones', value: 2 }],
          },
          TARGETS: {
            acceptReporters: true,
            items: 'getTargets',
          },
        },
      };
    }
    getTargets() {
      const spriteNames = [{ text: 'stage', value: '_stage_' }, { text: 'myself', value: '_myself_' }];
      const targets = runtime.targets;
      for (let index = 1; index < targets.length; index++) {
        const target = targets[index];
        if (target.isOriginal) {
          spriteNames.push({
            text: target.getName(),
            value: target.getName(),
          });
        }
      }
      if (spriteNames.length > 0) {
        return spriteNames;
      } else {
        return [{ text: '', value: 0 }];
      }
    }
    opt_join({ A, B }) {
      return `${Cast.toString(A || '')}'${Cast.toString(B || '')}`;
    }
    opt_toTarget({ TARGET, CLONES }, util) {
      TARGET = Cast.toString(TARGET);
      if (TARGET === '_stage_') TARGET = runtime.getTargetForStage().id;
      else if (TARGET === '_myself_') TARGET = util.target.id;
      else TARGET = runtime.getSpriteTargetByName(TARGET)?.id || '';
      if (CLONES === 'only') CLONES = 0;
      else if (CLONES === 'clones') CLONES = 1;
      else if (CLONES === 'and its clones') CLONES = 2;
      else CLONES = Math.min(Math.max(Cast.toNumber(CLONES), 0), 2);
      CLONES = Cast.toNumber(CLONES);
      return `${this.IdenToTarget}${CLONES}${TARGET}`;
    }
    opt_withData({ DATA }) {
      return `${this.IdenWithData}${DATA}`;
    }
    opt_waitStatus({ DO_WAIT }) {
      if (DO_WAIT === 'don\'t wait') DO_WAIT = false;
      if (DO_WAIT === 'wait') DO_WAIT = true;
      DO_WAIT = Cast.toBoolean(DO_WAIT);
      return `${this.IdenWaitStatus}${DO_WAIT}`;
    }
    broadcast2(args, util) {
      args.targets = runtime.targets;
      const OPTIONS = Cast.toString(args.OPTIONS).split('\'');
      for (const option of OPTIONS) {
        const optionData = option.slice(255) || '';
        switch(option.slice(0, 255) || '') {
          case this.IdenToTarget:
            args.target = optionData.slice(1) || '';
            const mainTarget = runtime.getTargetById(args.target);
            switch(Number(optionData[0])) {
              case 0:
                args.targets = [mainTarget];
                break;
              case 1:
                args.targets = mainTarget.sprite.clones.filter(target => !target.isOriginal);
                break
              case 2: 
                args.targets = mainTarget.sprite.clones.filter(target => !target.isOriginal);
                args.targets.push(mainTarget);
                break;
              default:
                break;
            }
            break;
          case this.IdenWaitStatus:
            args.wait = Cast.toBoolean(optionData);
            break;
          case this.IdenWithData:
            args.data = optionData;
            break;
          default:
            break;
        }
      }
      args.targets = Array.from(args.targets).filter(target => !!target).map(target => target.id ?? 'idfk');
      if (args.wait) {
        return broadcastAndWait(args, util);
      } else {
        broadcast(args, util);
      }
    }
    receive(args, util) {
      const BROADCAST_NAME = Cast.toString(args.BROADCAST_OPTION);
      const { thread } = util, broadcastArguments = thread.broadcastArguments || { BROADCAST_OPTION: '' }, data = thread.receivedData ?? '';
      thread.receivedData = data;
      if (!broadcastArguments || Cast.toString(broadcastArguments.BROADCAST_OPTION) !== BROADCAST_NAME) {
        thread?._MiyoEventsReject?.();
        return false;
      }
      thread?._MiyoEventsResolve?.();
      thread.reciveArguments = args;
    }
    getData(_, { thread }) {
      return thread.receivedData ?? '';
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
