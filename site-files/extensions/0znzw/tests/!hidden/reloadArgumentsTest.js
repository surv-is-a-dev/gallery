/**!
 * Reload Test
 * @author 0znzw <meow@miyo.icu> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.1
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Reload Test" must be ran unsandboxed.`);
  }
  const extId = '0znzwReloadTest';
  const { BlockType, ArgumentType, Cast, vm } = Scratch, { runtime } = vm;
  class extension {
    constructor() {
      this.c = 0;
    }
    getInfo() {
      return {
        id: extId,
        name: 'Reload Test',
        blocks: [{
          opcode: 'res',
          blockType: BlockType.COMMAND,
          text: 'reset counter',
        }, {
          disableMonitor: true,
          opcode: 'cup',
          blockType: BlockType.REPORTER,
          text: '++counter',
        }, {
          opcode: 'yie',
          blockType: BlockType.REPORTER,
          text: 'add twice (yield) [A]',
          arguments: {
            A: {type: ArgumentType.NUMBER },
          },
        }],
      }
    }
    res() { this.c = 0; }
    cup() { return ++this.c; }
    yie({ A }, util) {
      util.stackFrame ??= Object.create(null);
      if (Object.hasOwn(util.stackFrame, 'ov')) {
        console.log('(YIE) Yielded', util.stackFrame.ov, A);
        return util.stackFrame.ov + Cast.toNumber(A);
      }
      console.log('(YIE) Started', util.stackFrame, A);
      util.stackFrame.ov = Cast.toNumber(A);
      debugger;
      util.yield();
    }

    static patchCompiler() {
      if (vm.enableDebug && !runtime.debug) vm.enableDebug();
      if (vm.exports.these_broke_before_and_will_break_again) {
        alert('GarboMuffins an ass so this doesnt work anymore lmfao.');
        throw 'stub is not supported.';
      }
      if (!vm.exports.i_will_not_ask_for_help_when_these_break || vm.exports.JSGenerator) {
        alert('TW (old) format compiler is required.');
        throw 'cst is not supported.';
      }
      const iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
      if (iwnafhwtb.IntermediateStackedBlock) {
        alert('TW (old) format compiler is required.');
        throw 'next-next is not supported.';
      }
      const { JSGenerator, ScriptTreeGenerator } = iwnafhwtb;
      const { TYPE_UNKNOWN } = JSGenerator.unstable_exports;
      const JSGP = JSGenerator.prototype, STGP = ScriptTreeGenerator.prototype;
      const js_di = JSGP.descendInput, st_di = STGP.descendInput;
      const js_gclc = JSGP.generateCompatibilityLayerCall, js_c = JSGP.compile;
      JSGP.compile = function(...args) {
        const F = globalThis.Function;
        globalThis.Function = function(...args) {
          if (args[0] === 'globalState') {
            const p1 = args[1].indexOf('const executeInCompatibilityLayer = function*');
            const p2 = args[1].indexOf('const executeBlock = () => {', p1);
            args[1] = args[1].replace('const executeBlock = () => {', `const executeBlock = function*() {
let inps = inputs;
if (Object.hasOwn(inps, '$di')) {
  inps = Object.create(null);
  for (const k of Object.keys(inputs)) {
    if (typeof inputs[k] !== 'function') continue;
    inps[k] = yield* (inputs[k]());
  }
}
`, p1);
            args[1] = args[1].replace('blockFunction(inputs', 'blockFunction(inps', p2);
            args[1] = args[1].replaceAll('returnValue = executeBlock()', 'returnValue = yield* executeBlock()', p2);
            console.log(args);
          }
          return F.call(this, ...args);
        };
        const r = js_c.apply(this, args);
        globalThis.Function = F;
        return r;
      };
      JSGP.descendInput = function (...args) {
        const node = args[0];
        console.log(node);
        if (node.kind === 'compat' && node.opcode === `${extId}_yie`) {
          let c = 0;
          const o_k = Object.keys;
          Object.keys = function(o) {
            const r = o_k.call(this, o);
            c = r.length;
            Object.keys = o_k;
            return r;
          };
          const js_diN = this.descendInput;
          this.descendInput = function(inp) {
            if (--c <= 0) this.descendInput = js_diN;
            inp = js_diN.call(this, inp);
            if (c < 0) return inp;
            const i_as = inp.asSafe;
            inp.asSafe = function() {
              inp.asSafe = i_as;
              const js = i_as.call(inp);
              return `(function*() {return( ${js} );})${c == 0 ? ',"$di":true' : ''}`;
            };
            return inp;
          };
          return js_di.apply(this, args);
        }
        return js_di.apply(this, args);
      };
    }
  }
  extension.patchCompiler();
  Scratch.extensions.register(runtime[`ext_${extId}`] = new extension());
})(Scratch);
