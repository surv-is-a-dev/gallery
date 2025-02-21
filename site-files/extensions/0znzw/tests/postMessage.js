/**!
 * Post-Message
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Post-Message" must be ran unsandboxed.`);
  }
  const { Cast, BlockType, ArgumentType, vm } = Scratch, { runtime } = vm;
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
  const validURL = (url) => {
    try {
      return new URL(url);
    } catch {
      return false;
    }
  };
  window.addEventListener('message', (ev) => {
    // Idc mine is cooler >:3
    runHats('0znzwPostMessage_recv').forEach(thread => thread.postMessageEvent = ev);
  });
  class extension {
    getInfo() {
      return {
        id: '0znzwPostMessage',
        name: 'Post-Message',
        blocks: [{
          opcode: 'post',
          blockType: BlockType.COMMAND,
          text: 'post message [MSG] to [DOMAIN] on [PAR]',
          arguments: {
            MSG: { type: ArgumentType.STRING, defaultValue: 'Hello, World!~' },
            DOMAIN: { type: ArgumentType.STRING, defaultValue: 'https://turbowarp.org/' },
            PAR: { type: ArgumentType.STRING, menu: 'target' },
          },
        }, {
          opcode: 'recv',
          blockType: BlockType.HAT,
          text: 'when posted message recivied',
          isEdgeActivated: false,
        }, '---', {
          opcode: 'data',
          blockType: BlockType.REPORTER,
          text: 'recevied data',
          disableMonitor: true,
        }, {
          opcode: 'origin',
          blockType: BlockType.REPORTER,
          text: 'data origin',
          disableMonitor: true,
        }],
        menus: {
          target: {
            acceptReporters: true,
            items: ['self', 'parent'],
          }
        },
      };
    }
    post({ MSG, DOMAIN, PAR }) {
      MSG = Cast.toString(MSG);
      DOMAIN = Cast.toString(DOMAIN);
      PAR = (Cast.toString(PAR) === 'parent');
      if (DOMAIN !== '*' && !validURL(DOMAIN)) return false;
      if (PAR) {
        if (window.parent) window.parent.postMessage(MSG, DOMAIN);
      } else window.postMessage(MSG, DOMAIN);
    }
    recv(_, { thread }) {
      if (!thread.postMessageEvent) {
        thread.status = 4;
        return false;
      }
      thread.postMessageOrigin = thread.postMessageEvent.origin ?? '*';
      thread.postMessageData = thread.postMessageEvent.data ?? '';
      delete thread.postMessageEvent;
      return true;
    }
    origin(_, { thread }) {
      return thread.postMessageOrigin || '*';
    }
    data(_, { thread }) {
      return thread.postMessageData || '';
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
