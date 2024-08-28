/**!
 * Events Test
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';

  const runHats = (opcode) => {
    const threads = [];
    for (const target of vm.runtime.targets) {
      Object.values(target.blocks._blocks).filter(block => block.opcode === opcode).forEach(block => {
        threads.push(vm.runtime._pushThread(block.id, target, { stackClick: true }));
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
        }],
      };
    }
    broadcast(args, util) {
      runHats('0znzwEventsTest_receive').forEach(thread => thread.broadcastArguments = args);
    }
    receive(args, util) {
      const thread = util.thread;
      if (thread.broadcastArguments && thread.broadcastArguments.BROADCAST !== args.BROADCAST) {
        thread.status = 4;
        return false;
      }
      thread.reciveArguments = args;
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
