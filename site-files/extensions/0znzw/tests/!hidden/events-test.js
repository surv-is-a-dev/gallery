/**!
 * Events Test
 * @author 0znzw <meow@miyo.icu> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.1
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Events Test" must be ran unsandboxed.`);
  }

  const runtime = Scratch.vm.runtime;
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

  class extension {
    getInfo() {
      return {
        id: '0znzwEventsTest',
        name: 'Events Test',
        blocks: [{
          opcode: 'receive',
          blockType: Scratch.BlockType.HAT,
          text: 'when I receive [BROADCAST]',
          isEdgeActivated: false,
          arguments: {
            BROADCAST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'message1',
            },
          },
          extensions: ['colours_event'],
          hideFromPalette: true,
        }, {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="0znzwEventsTest_receive"><value name="BROADCAST"><shadow type="event_broadcast_menu"></shadow></value></block>',
        }, {
          opcode: 'broadcast',
          blockType: Scratch.BlockType.COMMAND,
          text: 'broadcast [BROADCAST]',
          arguments: {
            BROADCAST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'message1',
            },
          },
          extensions: ['colours_event'],
          hideFromPalette: true,
        }, {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="0znzwEventsTest_broadcast"><value name="BROADCAST"><shadow type="event_broadcast_menu"></shadow></value></block>',
        }, {
          opcode: 'broadcast_and_wait',
          blockType: Scratch.BlockType.COMMAND,
          text: 'broadcast [BROADCAST] and wait',
          arguments: {
            BROADCAST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'message1',
            },
          },
          extensions: ['colours_event'],
          hideFromPalette: true,
        }, {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="0znzwEventsTest_broadcast_and_wait"><value name="BROADCAST"><shadow type="event_broadcast_menu"></shadow></value></block>',
        }],
      };
    }
    broadcast(args, util) {
      runHats('0znzwEventsTest_receive').forEach(thread => {
        thread._MiyoEventsReject = () => thread.status = 4;
        thread._MiyoEventsResolve = () => true;
        thread.broadcastArguments = args;
      });
    }
    broadcast_and_wait(args, util) {
      const { stackFrame } = util;
      // https://github.com/TurboWarp/scratch-vm/blob/develop/src/blocks/scratch3_event.js and,
      // https://github.com/surv-is-a-dev/gallery/blob/main/site-files/extensions/0znzw/tests/hidden/runHats%20and%20check%20count.js
      if (stackFrame.MiyoEvents_awaitingCount) {
        if (stackFrame.MiyoEvents_awaitingCount === 2) {
          stackFrame.MiyoEvents_awaitingCount = false;
          if (stackFrame.MiyoEvents_threads.length === 0) return true;
        } else {
          util.yield();
        }
      } else if (!stackFrame.MiyoEvents_threads) {
        // https://github.com/surv-is-a-dev/gallery/blob/main/site-files/extensions/0znzw/tests/hidden/runHats%20and%20check%20count.js
        stackFrame.MiyoEvents_awaitingCount = 1;
        stackFrame.MiyoEvents_threads = new Promise((resolve) => {
          const hats = new Set(runHats('0znzwEventsTest_receive'));
          if (hats.size == 0) resolve([]);
          const intersection = [];
          hats.forEach(thread => {
            thread._MiyoEventsReject = () => {
              thread.status = 4;
              hats.delete(thread);
              if (hats.size == 0) resolve(intersection);
            };
            thread._MiyoEventsResolve = () => {
              hats.delete(thread);
              intersection.push(thread);
              if (hats.size == 0) resolve(intersection);
            };
            thread.broadcastArguments = args;
          });
        });
        stackFrame.MiyoEvents_threads.then(threads => {
          stackFrame.MiyoEvents_threads = threads;
          stackFrame.MiyoEvents_awaitingCount = 2;
        });
        util.yield();
      }
      const waiting = !stackFrame.MiyoEvents_awaitingCount && stackFrame.MiyoEvents_threads.some(thread => thread.status !== 4);
      if (waiting) {
        const tick = stackFrame.MiyoEvents_threads.every(thread => thread.status !== 4);
        if (tick) util.yieldTick();
        else util.yield();
      } else return true;
    }
    receive(args, util) {
      const thread = util.thread;
      if (!thread.broadcastArguments || thread.broadcastArguments.BROADCAST !== args.BROADCAST) {
        thread?._MiyoEventsReject?.();
        return false;
      }
      thread?._MiyoEventsResolve?.();
      thread.reciveArguments = args;
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
