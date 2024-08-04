/**!
 * Run hats test 2
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
        id: '0znzwFunny',
        name: 'hat test',
        blocks: [{
          opcode: 'myHat',
          blockType: Scratch.BlockType.HAT,
          text: 'wowie [TEST]',
          isEdgeActivated: false,
          arguments: {
            TEST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'nya~',
            },
          },
        }, {
          opcode: 'runMyHat',
          blockType: Scratch.BlockType.COMMAND,
          text: 'run [TEST]',
          arguments: {
            TEST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'nya~',
            },
          },
        }],
      };
    }
    async runMyHat(args, util) {
      const hatsMatch = await new Promise((resolve) => {
        const hats = new Set(runHats('0znzwFunny_myHat'));
        if (hats.size == 0) resolve([]);
        const intersection = [];
        hats.forEach(thread => {
          thread._reject = () => {
            thread.status = 4;
            hats.delete(thread);
            if (hats.size == 0) resolve(intersection);
          };
          thread._resolve = () => {
            hats.delete(thread);
            intersection.push(thread);
            if (hats.size == 0) resolve(intersection);
          };
          thread.commandArguments = args;
        });
      });
      if (hatsMatch.length == 0) console.log('No hats were ran.');
    }
    myHat(args, util) {
      const thread = util.thread;
      if (thread.commandArguments && thread.commandArguments.TEST !== args.TEST) {
        thread._reject();
        return false;
      }
      thread._resolve();
      thread.hatArguments = args;
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);