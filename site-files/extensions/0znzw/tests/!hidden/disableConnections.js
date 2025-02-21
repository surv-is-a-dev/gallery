/**!
 * Disable connections test
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Disable connections" must be ran unsandboxed.`);
  }
  const extId = '0znzwDisableConnectionsTest';
  const { BlockType, ArgumentType } = Scratch;
  const bypassCheck = ['text'];
  if (Scratch.gui) Scratch.gui.getBlockly().then(ScratchBlocks => {
    const { Extensions, Connection } = ScratchBlocks;
    Extensions.register(`${extId}_disableInputConnections`, function() {
      this.disableInputConnections = true;
    });
    Connection.REASON_DISABLED_INPUTS = -259;
    const ccwr_ = Connection.prototype.canConnectWithReason_;
    Connection.prototype.canConnectWithReason_ = function(...args) {
      const [attempt] = args;
      if (attempt.sourceBlock_.disableInputConnections && !bypassCheck.includes(this.sourceBlock_.type)) return Connection.REASON_DISABLED_INPUTS;
      return ccwr_.apply(this, args);
    };
    const cc_ = Connection.prototype.checkConnection_;
    Connection.prototype.checkConnection_ = function(...args) {
      const [attempt] = args;
      const ccwr = this.canConnectWithReason_(attempt);
      if (ccwr === Connection.REASON_DISABLED_INPUTS) throw 'Attempted to connect to a block with disabled inputs.';
      return cc_.apply(this, args);
    };
  });
  class extension {
    getInfo() {
      return {
        id: extId,
        name: 'Disable connections',
        blocks: [{
          opcode: 'nope',
          blockType: BlockType.COMMAND,
          text: 'nah [abc] cant [123] blocks',
          arguments: {
            abc: {
              type: ArgumentType.STRING,
              defaultValue: 'you',
            },
            123: {
              type: ArgumentType.STRING,
              defaultValue: 'connect',
            },
          },
          extensions: [`${extId}_disableInputConnections`],
        }],
      };
    }
    nope() {}
  }
  Scratch.extensions.register(new extension());
})(Scratch);
