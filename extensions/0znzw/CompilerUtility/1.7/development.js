/**!
 * Compiler-Utility [v1.7] created by 0znzw.
 * https://scratch.mit.edu/users/0znzw/
 * Patch code by CST1229
 * https://scratch.mit.edu/users/CST1229/
 * Licensed under MIT license.
 * DO NOT REMOVE THIS COMMENT
 * Development
 */
// prettier-ignore
function anon$compilerUtility(Q3JlYXRlZCBieSAwem56dy4KaHR0cHM6Ly9zY3JhdGNoLm1pdC5lZHUvMHpuencvCkRPIE5PVCBSRU1PVkUgVEhJUw) {
    const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
    /**
     * @type {VM}
     */
    // @ts-expect-error
    const vm = window.vm;
    const opts = Q3JlYXRlZCBieSAwem56dy4KaHR0cHM6Ly9zY3JhdGNoLm1pdC5lZHUvMHpuencvCkRPIE5PVCBSRU1PVkUgVEhJUw;
    if (!hasOwn(opts, 'enableDebug')) opts.enableDebug
    function checkCompilerExports() {
        if (!hasOwn(vm.exports, 'Compiler')) {
            // @ts-expect-error
            vm.exports.Compiler = {};
            if (!hasOwn(vm.exports, 'IRGenerator') && !hasOwn(vm.exports, 'JSGenerator')) {
                console.error('Could not find working compiler exports :cri:');
                return false;
            }
            if (!hasOwn(vm.exports, 'jsexecute')) {
                console.error('Could not find working jsexecute export :cri:');
                return false;
            }
            // @ts-expect-error
            const IRGenerator = vm.exports.IRGenerator;
            // @ts-expect-error
            const JSGenerator = vm.exports.JSGenerator;
            // @ts-expect-error
            const jsexecute = vm.exports.jsexecute;
            if (!hasOwn(IRGenerator, 'exports')) {
                console.error('Could not find exports for IRGenerator.');
                return false;
            }
            if (!hasOwn(JSGenerator, 'exports')) {
                console.error('Could not find exports for JSGenerator.');
                return false;
            }
            if (!hasOwn(IRGenerator.exports, 'ScriptTreeGenerator')) {
                console.error('Could not find ScriptTreeGenerator in IRGenerator exports.');
                return false;
            }
            const ScriptTreeGenerator = IRGenerator.exports.ScriptTreeGenerator;
            if (!hasOwn(JSGenerator.exports, 'ConstantInput')) {
                console.error('Could not find ConstantInput in JSGenerator exports.');
                return false;
            }
            const ConstantInput = JSGenerator.exports.ConstantInput;
            if (!hasOwn(JSGenerator.exports, 'TypedInput')) {
                console.error('Could not find TypedInput in JSGenerator exports.');
                return false;
            }
            const TypedInput = JSGenerator.exports.TypedInput;
            if (!hasOwn(JSGenerator.exports, 'Frame')) {
                console.error('Could not find Frame in JSGenerator exports.');
                return false;
            }
            const Frame = JSGenerator.exports.Frame;
            // @ts-expect-error
            vm.exports.Compiler = {
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
    vm.enableDebug();
    // @ts-expect-error
    const compilerExport = vm.exports.Compiler;
    // @ts-expect-error
    vm.compiler = {
        compilerExport,
        utilityVersion: 1.7,
        __internal__: {
            descendStackedBlock_JSG(original, node) {
                // @ts-expect-error
                const mixins = vm.compiler.nodeMixin.__internal__.mixins;
                const kind = node.kind;
                let mixin = mixins[kind];
                if (!!!mixin && !!mixins['*']) mixin = mixins['*'];
                if (!!!mixin) return original(node);
                if (typeof mixin === 'function') {
                    const oldSource = this.source;
                    this.source = '';
                    this.overrideSource = oldSource;
                    let fakeOriginal = function(...args) {
                        this.$patches.descendStackedBlock.apply(this, [node]);
                        return this;
                    }.bind(this);
                    mixin = mixin(fakeOriginal, node);
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
                if (!!!mixin && !!mixins['*']) mixin = mixins['*'];
                if (!!!mixin) return original(node);
                if (typeof mixin === 'function') {
                    mixin = mixin(original, node);
                }
                return mixin;
			},
            descendInput_STG(original, block) {
                // @ts-expect-error
                const mixins = vm.compiler.inputMixin.__internal__.mixins;
                const kind = block.opcode;
                const mixin = mixins[kind];
                if (!!!mixin) return original(block);
                if (typeof mixin === 'function') return mixin.apply(this, [block]);
                return mixin;
            },
            descendStackedBlock_STG(original, block) {
                // @ts-expect-error
                const mixins = vm.compiler.blockMixin.__internal__.mixins;
                const kind = block.opcode;
                const mixin = mixins[kind];
                if (!!!mixin) return original(block);
                if (typeof mixin === 'function') return mixin.apply(this, [block]);
                return mixin;
            },
            descendStackedBlock_IRG(original, block) {
                // @ts-expect-error
                const mixins = vm.compiler.irBlockMixin.__internal__.mixins;
                const kind = block.opcode;
                const mixin = mixins[kind];
                if (!!!mixin) return original(block);
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
            jsexecute: compilerExport.jsexecute,
            IRGenerator: compilerExport.IRGenerator,
            compileThread: compilerExport.compileThread,
            ScriptTreeGenerator: compilerExport.IRGenerator.exports.ScriptTreeGenerator,
        },
        inputs: {
            Typed: compilerExport.JSGenerator.exports.TypedInput,
            Constant: compilerExport.JSGenerator.exports.ConstantInput,
            Frame: compilerExport.JSGenerator.exports.Frame,
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
const anon$compilerUtilityImported = anon$compilerUtility({});
if (anon$compilerUtilityImported) console.log('Compiler utility loaded successfully.\nUse vm.compiler to access it.');
else console.error('The Compiler-Utility has failed to load.');

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