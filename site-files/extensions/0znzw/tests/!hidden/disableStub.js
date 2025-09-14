/**!
 * Disable compiler stub
 * @author 0znzw <meow@miyo.icu> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Disables the new horrible compiler stub as it breaks a lot of stuff.
 * Do not remove this comment
 */
const iwnafhwtb = ((() => {
  // stub disabler
  const tbbawba = vm.exports.these_broke_before_and_will_break_again;
  const iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break;
  if (!tbbawba) return iwnafhwtb();
  if (!(vm.exports.__miyo_broke__ && vm.exports.__miyo_broke__.__webpack_require__.toString().includes('exports:{}}'))) {
    let data;
    const warn = console.warn;
    console.warn = () => 'no';
    const emit = vm.emit;
    vm.emit = () => 'no';
    try {
      vm.exports.i_will_not_ask_for_help_when_these_break = function(...args) {
        let clayer = -1, modl = null, __wp_require__ = null;
        const fpc = Function.prototype.call;
        Function.prototype.call = function(self, ...args) {
          Function.prototype.call = fpc;
          clayer = args[0];
          modl = args[1];
          const require = args[2];
          __wp_require__ = require;
          if (!require || !modl ||
               modl.l || !require.e ||
               !require.t || !require.c
             ) return fpc.apply(this, [self].concat(args));
          return undefined; // ngl take the L
        };
        const r = iwnafhwtb.apply(this, args);
        if (__wp_require__) {
          vm.exports.__miyo_broke__ = Object.assign(tbbawba(), {
            __webpack_require__: __wp_require__,
            __clayer_id__: [clayer, modl],
            STUB_DISABLED: true,
          });
          vm.exports.these_broke_before_and_will_break_again = () => {
            console.warn('You are using unsupported APIs. WHEN your code breaks, do not expect help.');
            return vm.exports.__miyo_broke__;
          };
          vm.exports.i_will_not_ask_for_help_when_these_break = vm.exports.these_broke_before_and_will_break_again;
          console.warn = warn;
          return vm.exports.i_will_not_ask_for_help_when_these_break();
        }
        throw 'stub';
      };
      data = vm.exports.i_will_not_ask_for_help_when_these_break();
    } catch(error) {
      throw new Error('Another extension is using bad stubs that are incompatible with this extension.');
    } finally {
      console.warn = warn;
      vm.emit = emit;
    }
    data.__clayer_id__[0].exports.enabled = false;
    data.__clayer_id__[1].enabled = false;
    return data;
  }
  return vm.exports.these_broke_before_and_will_break_again();
})());