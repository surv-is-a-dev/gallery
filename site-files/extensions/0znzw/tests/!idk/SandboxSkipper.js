/**!
 * Sandbox Skipper
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.1
 * @copyright MIT License
 * Do not remove this comment
 */
(function (Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Sandbox Skipper" extension must be ran unsandboxed.`);
  }
  class extension {
    constructor() {
      this.doPatch(Scratch);
      Scratch.vm.on('CREATE_UNSANDBOXED_EXTENSION_API', (Scratch) => {
        this.doPatch(Scratch);
      });
    }
    getInfo() {
      return {
        id: '0znzwSandboxSkipperTest',
        name: 'Sandbox Skipper',
        blocks: [{
          blockType: Scratch.BlockType.EVENT,
          opcode: 'saver',
          text: 'put me in the project to save.',
          isTerminal: true,
          isEdgeActivated: false,
        }],
      };
    }
    doPatch(Scratch) {
      Scratch.extensions.unsandboxed = false;
      const vm = Scratch.vm;
      vm.securityManager.__proto__.getSandboxMode = async () => 'unsandboxed';
      vm.securityManager.getSandboxMode = async () => 'unsandboxed';
      vm.extensionManager.securityManager = vm.securityManager;
    }
    saver() { return false; }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
