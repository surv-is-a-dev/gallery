/**!
 * Dynamic-Terminal test
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
  if (Scratch.gui) Scratch.gui.getBlockly().then(ScratchBlocks => {
    ScratchBlocks.Extensions.register('0znzwDynamicTerminalTest_terminal', function() {
      let block = this, input = false;
      if (!(input = block.inputList.find(input => input?.fieldRow?.[0].name === 'type')?.fieldRow?.[0])) return;
      input._ois = function() {
        if (this.value_ === 'cap') return block.setNextStatement(false);
        block.setNextStatement(true);
      };
      input._ois();
      const ois = input.onItemSelected;
      input.onItemSelected = function(...args) {
        const res = ois.apply(this, args);
        this._ois();
        return res;
      };
    });
  });
  class extension {
    getInfo() {
      return {
        id: '0znzwDynamicTerminalTest',
        name: 'Dynamic-Terminal test',
        blocks: [{
          opcode: 'test',
          blockType: Scratch.BlockType.COMMAND,
          text: '[type]',
          arguments: {
            type: {
              type: Scratch.ArgumentType.STRING,
              menu: 'type',
            }
          },
          extensions: ['0znzwDynamicTerminalTest_terminal'],
        }],
        menus: {
          type: {
            acceptReporters: false,
            items: ['stack', 'cap'],
          },
        },
      };
    }
    test(args, util, blockJSON) {
      debugger;
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);