/**!
 * Compiler-Utility [v2.0] created by 0znzw.
 * https://scratch.mit.edu/users/0znzw/
 * Patch code by CST1229
 * https://scratch.mit.edu/users/CST1229/
 * Licensed under MIT license.
 * DO NOT REMOVE THIS COMMENT
 * Development
 */
// prettier-ignore
/* eslint-disable */
function anon$compilerUtility(Q3JlYXRlZCBieSAwem56dy4KaHR0cHM6Ly9zY3JhdGNoLm1pdC5lZHUvMHpuencvCkRPIE5PVCBSRU1PVkUgVEhJUw) {
    const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
    /**
     * @type {VM}
     */
    // @ts-expect-error
    const vm = window.vm;
    const opts = Q3JlYXRlZCBieSAwem56dy4KaHR0cHM6Ly9zY3JhdGNoLm1pdC5lZHUvMHpuencvCkRPIE5PVCBSRU1PVkUgVEhJUw;
    if (!hasOwn(opts, 'enableDebug')) opts.enableDebug = false;
    const messages = {
        missing_tw: {
            GTBAYWNRAS: `Could not find export for i_will_not_ask_for_help_when_these_break.`,
            everything: `WARNING, Turbowarp is missing these exports:
    jsexecute
    CompileThread
    TypedInput
    ConstantInput
    Frame`,
            ST: `Could not find export for ScriptTreeGenerator.`,
        },
        missing_else: {
            exports: `Could not find working compiler exports :cri:`,
            IR: `Could not find export for IRGenerator.`,
            JS: `Could not find export for JSGenerator.`,
            JE: `Could not find export for jsexecute.`,
            ST_IR: `Could not find ScriptTreeGenerator in IRGenerator exports.`,
            CI_JS: `Could not find ConstantInput in JSGenerator exports.`,
            TI_JS: `Could not find TypedInput in JSGenerator exports.`,
            F_JS: `Could not find Frame in JSGenerator exports.`,
        }
    };
    function fakeInputTypes() {
        const log = console;
        const sanitize = string => {
            if (typeof string !== 'string') {
                log.warn(`sanitize got unexpected type: ${typeof string}`);
                string = '' + string;
            }
            return JSON.stringify(string).slice(1, -1);
        };
        const Cast = {
            toBoolean(data) {
                switch (typeof data) {
                    case 'number':
                        if (data > 0) return true;
                        return false;
                    default:
                        return Boolean(data);
                }
            }
        };
        const TYPE_NUMBER = 1;
        const TYPE_STRING = 2;
        const TYPE_BOOLEAN = 3;
        const TYPE_NUMBER_NAN = 5;
        class TypedInput {
            constructor (source, type) {
                // for debugging
                if (typeof type !== 'number') throw new Error('type is invalid');
                this.source = source;
                this.type = type;
            }

            asNumber () {
                if (this.type === TYPE_NUMBER) return this.source;
                if (this.type === TYPE_NUMBER_NAN) return `(${this.source} || 0)`;
                return `(+${this.source} || 0)`;
            }

            asNumberOrNaN () {
                if (this.type === TYPE_NUMBER || this.type === TYPE_NUMBER_NAN) return this.source;
                return `(+${this.source})`;
            }

            asString () {
                if (this.type === TYPE_STRING) return this.source;
                return `("" + ${this.source})`;
            }

            asBoolean () {
                if (this.type === TYPE_BOOLEAN) return this.source;
                return `toBoolean(${this.source})`;
            }

            asColor () {
                return this.asUnknown();
            }

            asUnknown () {
                return this.source;
            }

            asSafe () {
                return this.asUnknown();
            }

            isAlwaysNumber () {
                return this.type === TYPE_NUMBER;
            }

            isAlwaysNumberOrNaN () {
                return this.type === TYPE_NUMBER || this.type === TYPE_NUMBER_NAN;
            }

            isNeverNumber () {
                return false;
            }
        }

        class ConstantInput {
            constructor (constantValue, safe) {
                this.constantValue = constantValue;
                this.safe = safe;
            }

            asNumber () {
                // Compute at compilation time
                const numberValue = +this.constantValue;
                if (numberValue) {
                    // It's important that we use the number's stringified value and not the constant value
                    // Using the constant value allows numbers such as "010" to be interpreted as 8 (or SyntaxError in strict mode) instead of 10.
                    return numberValue.toString();
                }
                // numberValue is one of 0, -0, or NaN
                if (Object.is(numberValue, -0)) {
                    return '-0';
                }
                return '0';
            }

            asNumberOrNaN () {
                return this.asNumber();
            }

            asString () {
                return `"${sanitize('' + this.constantValue)}"`;
            }

            asBoolean () {
                // Compute at compilation time
                return Cast.toBoolean(this.constantValue).toString();
            }

            asColor () {
                // Attempt to parse hex code at compilation time
                if (/^#[0-9a-f]{6,8}$/i.test(this.constantValue)) {
                    const hex = this.constantValue.substr(1);
                    return Number.parseInt(hex, 16).toString();
                }
                return this.asUnknown();
            }

            asUnknown () {
                // Attempt to convert strings to numbers if it is unlikely to break things
                if (typeof this.constantValue === 'number') {
                    // todo: handle NaN?
                    return this.constantValue;
                }
                const numberValue = +this.constantValue;
                if (numberValue.toString() === this.constantValue) {
                    return this.constantValue;
                }
                return this.asString();
            }

            asSafe () {
                if (this.safe) {
                    return this.asUnknown();
                }
                return this.asString();
            }

            isAlwaysNumber () {
                const value = +this.constantValue;
                if (Number.isNaN(value)) {
                    return false;
                }
                // Empty strings evaluate to 0 but should not be considered a number.
                if (value === 0) {
                    return this.constantValue.toString().trim() !== '';
                }
                return true;
            }

            isAlwaysNumberOrNaN () {
                return this.isAlwaysNumber();
            }

            isNeverNumber () {
                return Number.isNaN(+this.constantValue);
            }
        }
        /**
         * A frame contains some information about the current substack being compiled.
         */
        class Frame {
            constructor (isLoop) {
                /**
                 * Whether the current stack runs in a loop (while, for)
                 * @type {boolean}
                 * @readonly
                 */
                this.isLoop = isLoop;

                /**
                 * Whether the current block is the last block in the stack.
                 * @type {boolean}
                 */
                this.isLastBlock = false;
            }
        }
        return {
            ConstantInput, TypedInput, Frame
        };
    }
    function checkTW() {
        // @ts-expect-error Not typed yet.
        const exports = vm.exports, apis = exports?.i_will_not_ask_for_help_when_these_break?.();
        const missing = messages.missing_tw, missing_else = messages.missing_else, errorStack = [];
        if (!apis) {
            console.warn('Unable to find i_will_not_ask_for_help_when_these_break');
            console.debug('Assuming the user is not using base turbowarp.');
            return false;
        }
        const IRGenerator = apis['IRGenerator'];
        const JSGenerator = apis['JSGenerator'];
        const ScriptTreeGenerator = apis['ScriptTreeGenerator'];
        if (!IRGenerator) errorStack.push(missing_else.IR);
        if (!JSGenerator) errorStack.push(missing_else.JS);
        if (!ScriptTreeGenerator) errorStack.push(missing.ST);
        if (errorStack.length > 0) {
            errorStack.forEach(err => console.warn(err));
            return false;
        }
        console.warn(missing.everything);
        console.debug('Dont worry we can fake the InputTypes');
        const InputTypes = fakeInputTypes();
        const ConstantInput = InputTypes.ConstantInput;
        const TypedInput = InputTypes.TypedInput;
        const Frame = InputTypes.Frame;
        console.debug('Copying ScriptTreeGenerator to IRGenerator exports for compatibility.');
        IRGenerator.exports = IRGenerator.exports ?? {};
        IRGenerator.exports.ScriptTreeGenerator = ScriptTreeGenerator;
        console.debug('Copying Inputs to JSGenerator exports for compatibility.');
        JSGenerator.exports = JSGenerator.exports ?? {};
        JSGenerator.exports.Frame = Frame;
        JSGenerator.exports.ConstantInput = ConstantInput;
        JSGenerator.exports.TypedInput = TypedInput;
        // @ts-expect-error
        exports.Compiler = {
            _: 'TURBOWARP_LIMITED',
            IRGenerator, JSGenerator,
            ScriptTreeGenerator, Frame,
            ConstantInput, TypedInput
        };
        return true;
    }
    function checkCompilerExports() {
        if (!hasOwn(vm.exports, 'Compiler')) {
            if (checkTW()) return;
            const missing = messages.missing_else, exports = vm.exports, errorStack = [];
            // @ts-expect-error
            const IRGenerator = exports?.IRGenerator;
            // @ts-expect-error
            const JSGenerator = exports?.JSGenerator;
            // @ts-expect-error
            const jsexecute = exports?.jsexecute;
            const ScriptTreeGenerator = IRGenerator?.exports?.ScriptTreeGenerator;
            const ConstantInput = JSGenerator?.exports?.ConstantInput;
            const TypedInput = JSGenerator?.exports?.TypedInput;
            const Frame = JSGenerator?.exports?.Frame;
            if (!IRGenerator) errorStack.push(missing.IR);
            if (!JSGenerator) errorStack.push(missing.JS);
            if (!jsexecute) errorStack.push(missing.JE);
            if (errorStack.length > 0) errorStack.push('The following errors are most likely from missing top level exports.');
            if (!ScriptTreeGenerator) errorStack.push(missing.ST_IR);
            if (!ConstantInput) errorStack.push(missing.CI_JS);
            if (!TypedInput) errorStack.push(missing.TI_JS);
            if (!Frame) errorStack.push(missing.F_JS);
            if (errorStack.length > 0) {
                // @ts-expect-error
                exports.Compiler = {
                    _: 'FAIL'
                };
                errorStack.forEach(err => console.warn(err));
                return false;
            }
            // @ts-expect-error
            exports.Compiler = {
                _: 'FULL',
                Frame,
                ConstantInput,
                TypedInput,
                ScriptTreeGenerator,
                IRGenerator,
                JSGenerator,
                jsexecute,
            };
            return 2;
        }
        return true;
    }
    if (!checkCompilerExports()) return false;
    if (opts.enableDebug) vm.enableDebug();
    // @ts-expect-error
    const compilerExport = vm.exports.Compiler;
    // @ts-expect-error
    vm.compiler = {
        compilerExport,
        utilityVersion: 2.0,
        __internal__: {
            descendStackedBlock_JSG(original, node) {
                // @ts-expect-error
                const mixins = vm.compiler.nodeMixin.__internal__.mixins;
                const kind = node.kind;
                let mixin = mixins[kind];
                if (!mixin && !!mixins['*']) mixin = mixins['*'];
                if (!mixin) return original(node);
                if (typeof mixin === 'function') {
                    const oldSource = this.source;
                    this.source = '';
                    this.overrideSource = oldSource;
                    let fakeOriginal = function(...args) {
                        this.$patches.descendStackedBlock.apply(this, [node]);
                        return this;
                    }.bind(this);
                    mixin = mixin.apply(this, [fakeOriginal, node]);
                    if (oldSource !== this.overrideSource) {
                        this.source = this.overrideSource;
                    } else this.source = oldSource;
                }
                this.source += `/*mixin:${kind}*/${mixin}`;
                if (!this.source.endsWith('\n')) this.source += '\n';
            },
            descendInput_JSG(original, node) {
                // @ts-expect-error
                const mixins = vm.compiler.jsInputMixin.__internal__.mixins;
                const kind = node.kind;
                let mixin = mixins[kind];
                if (!mixin && !!mixins['*']) mixin = mixins['*'];
                if (!mixin) return original(node);
                if (typeof mixin === 'function') {
                    mixin = mixin.apply(this, [original, node]);
                }
                return mixin;
            },
            descendInput_STG(original, block) {
                // @ts-expect-error
                const mixins = vm.compiler.inputMixin.__internal__.mixins;
                const kind = block.opcode;
                const mixin = mixins[kind];
                if (!mixin) return original(block);
                if (typeof mixin === 'function') return mixin.apply(this, [block]);
                return mixin;
            },
            descendStackedBlock_STG(original, block) {
                // @ts-expect-error
                const mixins = vm.compiler.blockMixin.__internal__.mixins;
                const kind = block.opcode;
                const mixin = mixins[kind];
                if (!mixin) return original(block);
                if (typeof mixin === 'function') return mixin.apply(this, [block]);
                return mixin;
            },
            descendStackedBlock_IRG(original, block) {
                // @ts-expect-error
                const mixins = vm.compiler.irBlockMixin.__internal__.mixins;
                const kind = block.opcode;
                const mixin = mixins[kind];
                if (!mixin) return original(block);
                if (typeof mixin === 'function') return mixin.apply(this, [block]);
            },
        },
        type: {
            NUMBER: 1,
            STRING: 2,
            BOOLEAN: 3,
            UNKNOWN: 4,
            NAN: 5,
        },
        tools: {
            JSGenerator: compilerExport.JSGenerator,
            jsexecute: compilerExport?.jsexecute,
            IRGenerator: compilerExport.IRGenerator,
            compileThread: compilerExport?.compileThread,
            ScriptTreeGenerator: compilerExport.IRGenerator.exports.ScriptTreeGenerator,
            VariablePool: class VariablePool {
                // https://github.com/TurboWarp/scratch-vm/blob/develop/src/compiler/variable-pool.js
                /**
                 * @param {string} prefix The prefix at the start of the variable name.
                 */
                constructor (prefix) {
                    if (prefix.trim().length === 0) {
                        throw new Error('prefix cannot be empty');
                    }
                    this.prefix = prefix;
                    /**
                     * @private
                     */
                    this.count = 0;
                }
                next () {
                    return `${this.prefix}${this.count++}`;
                }
            }
        },
        inputs: {
            Typed: compilerExport.JSGenerator.exports.TypedInput,
            Constant: compilerExport.JSGenerator.exports.ConstantInput,
            Frame: compilerExport.JSGenerator.exports.Frame,
        },
        pen: {
            ext: 'runtime.ext_pen',
            state: `runtime.ext_pen._getPenState(target)`
        },
        inputMixin: {
            __internal__: {
                mixins: {},
            },
            register(opcode, mixin) {
                const internal = this.__internal__;
                internal.mixins[opcode] = mixin;
            },
            remove(opcode) {
                delete this.__internal__.mixins[opcode];
            },
        },
        jsInputMixin: {
            __internal__: {
                mixins: {},
            },
            register(opcode, mixin) {
                const internal = this.__internal__;
                internal.mixins[opcode] = mixin;
            },
            remove(opcode) {
                delete this.__internal__.mixins[opcode];
            },
        },
        blockMixin: {
            __internal__: {
                mixins: {},
            },
            register(opcode, mixin) {
                if (typeof mixin !== 'function') console.warn('Hey mixin needs to be a function or it wont register!');
                const internal = this.__internal__;
                internal.mixins[opcode] = mixin;
            },
            remove(opcode) {
                delete this.__internal__.mixins[opcode];
            },
        },
        irBlockMixin: {
            __internal__: {
                mixins: {},
            },
            register(opcode, mixin) {
                const internal = this.__internal__;
                internal.mixins[opcode] = mixin;
            },
            remove(opcode) {
                delete this.__internal__.mixins[opcode];
            },
        },
        nodeMixin: {
            __internal__: {
                mixins: {},
            },
            register(nodeType, source) {
                const internal = this.__internal__;
                internal.mixins[nodeType] = source;
            },
            remove(nodeType) {
                delete this.__internal__.mixins[nodeType];
            },
            new(category, block) {
                return `${category}.${block}`;
            },
            newStgMixin(category, block) {
                return { kind: `${category}.${block}` };
            },
        },
    };

    // @ts-expect-error
    let internal = vm.compiler.__internal__;

    const PATCHES_ID = '$patches';
    function patch(obj, funcs) {
        obj.patches = {};
        Object.keys(funcs).forEach((key) => {
            obj.patches[key] = obj[key].bind(obj);
            obj[key] = function (...args) {
                this['$' + key] = obj.patches[key];
                funcs[key].call(this, ...args);
            };
        });
    }

    const cst_patch = (obj, functions) => {
        if (obj[PATCHES_ID]) return;
        obj[PATCHES_ID] = {};
        for (const name in functions) {
            const original = obj[name];
            obj[PATCHES_ID][name] = obj[name];
            if (original) {
                obj[name] = function (...args) {
                    const callOriginal = (...args) => original.call(this, ...args);
                    return functions[name].call(this, callOriginal, ...args);
                };
            } else {
                obj[name] = function (...args) {
                    return functions[name].call(this, () => {}, ...args);
                };
            }
        }
    };

    const unpatchCst = (obj) => {
        if (typeof obj[PATCHES_ID] !== 'object') return;
        for (const patch in Object.keys(obj[PATCHES_ID])) {
            const patched = obj[PATCHES_ID][patch];
            obj[patch] = patched;
        }
        obj[PATCHES_ID] = undefined;
    };

    // @ts-expect-error
    const JSGenerator = vm.compiler.tools.JSGenerator;
    // @ts-expect-error
    const ScriptTreeGenerator = vm.compiler.tools.ScriptTreeGenerator;
    // @ts-expect-error
    const IRGenerator = vm.compiler.tools.IRGenerator;
    const JSGP = JSGenerator.prototype;
    const STGP = ScriptTreeGenerator.prototype;
    const IRGP = IRGenerator.prototype;

    unpatchCst(JSGP);
    unpatchCst(STGP);

    cst_patch(JSGP, {
        descendStackedBlock: internal.descendStackedBlock_JSG,
        descendInput: internal.descendInput_JSG,
    });

    cst_patch(STGP, {
        descendInput: internal.descendInput_STG,
        descendStackedBlock: internal.descendStackedBlock_STG,
    });

    //cst_patch(IRGP, {
    //    descendStackedBlock: internal.descendStackedBlock_IRG,
    //});

    // @ts-expect-error
    vm.constructor.prototype.compiler = vm.compiler;

    return true;
}
// @ts-expect-error
if (!window?.anon$compilerUtilityImported) window.anon$compilerUtilityImported = anon$compilerUtility({});
// @ts-expect-error
if (window?.anon$compilerUtilityImported) console.log("Compiler utility loaded successfully.\nUse vm.compiler to access it.");
else console.error("The Compiler-Utility has failed to load.");
/* eslint-enable */
/** WARNING
* Turbowarp may or may not support some API's.
* Also this may be outdated and not work anymore.
* Use at your own risk
*/
/** v1.0
* Example: this will make the changeX block run alert "1" instead of its default code;
* vm.compiler.nodeMixin.register(vm.compiler.nodeMixin.new('motion', 'changeX'), 'alert(1)');
*/
/** v1.2
 * Example: this will make the changeX block run its original code, and alert "1";
var mcx = vm.compiler.nodeMixin.new('motion', 'changeX');
vm.compiler.nodeMixin.remove(mcx);
vm.compiler.nodeMixin.register(mcx, function(original, node) {
    const oldSource = original().source;
    const newSource = `${oldSource}${oldSource.endsWith(';') ? '' : ';'}\nalert(1);\n`;
    return newSource;
});
    */
/** v1.3
 * Example: this will make the changeX block remove all compiled code before it (none of the blocks before it will run);
var mcx = vm.compiler.nodeMixin.new('motion', 'changeX');
vm.compiler.nodeMixin.remove(mcx);
vm.compiler.nodeMixin.register(mcx, function(original, node) {
    const origin = original();
    origin.overrideSource = '';
    return origin.source;
});
    */
/** v1.4
 * Example: this will make every block compile to "alert(1)"
vm.compiler.nodeMixin.register('*', 'alert(1)');
    */
/** v1.5
 * Example: this will register a block as a new compilation option; (IRGenerator)
 * Extension used: javascript extension from penguinmod.
vm.compiler.blockMixin.register('jgJavascript_javascriptStack', function(block) {
    return {
        kind: 'jgJavascript.javascriptStack',
        code: this.descendInputOfBlock(block, "CODE").value
    }
});
vm.compiler.nodeMixin.register('jgJavascript.javascriptStack', function(original, node) {
    return node.code;
});
    */
