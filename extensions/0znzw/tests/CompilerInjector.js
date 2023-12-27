/**!
 * Compiler-Utility created by 0znzw.
 * https://scratch.mit.edu/users/0znzw/
 * Licensed under MIT license.
 * DO NOT REMOVE THIS COMMENT
 */
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
        __internal__: {
            descendStackedBlock_JSG(original, node) {
                // @ts-expect-error
                const mixins = vm.compiler.nodeMixin.__internal__.mixins;
                const mixinNames = Object.keys(mixins);
                const kind = node.kind;
                if (mixinNames.includes(kind)) {
                    let mixin = mixins[kind];
                    if (typeof mixin === 'function') {
                        mixin = mixin(original.bind({ source: '' }), node);
                    }
                    this.source += `/*mixin:${kind}*/${mixin}`;
                    if (!this.source.endsWith('\n')) this.source += '\n';
                    return;
                }
                return original(node);
            },
            descendInput_STG(original, block) {
                // @ts-expect-error
                const mixins = vm.compiler.inputMixin.__internal__.mixins;
                const mixinNames = Object.keys(mixins);
                const kind = block.opcode;
                if (mixinNames.includes(kind)) {
                    return mixins[kind];
                }
                return original(block);
            },
            descendStackedBlock_STG(original, block) {
                // @ts-expect-error
                const mixins = vm.compiler.blockMixin.__internal__.mixins;
                const mixinNames = Object.keys(mixins);
                const kind = block.opcode;
                if (mixinNames.includes(kind)) {
                    return mixins[kind];
                }
                return original(block);
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
        blockMixin: {
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

    // @ts-expect-error
    const JSGenerator = vm.compiler.tools.JSGenerator;
    // @ts-expect-error
    const ScriptTreeGenerator = vm.compiler.tools.ScriptTreeGenerator;
    const JSGP = JSGenerator.prototype;
    const STGP = ScriptTreeGenerator.prototype;

    cst_patch(JSGP, {
        descendStackedBlock: internal.descendStackedBlock_JSG,
    });

    cst_patch(STGP, {
        descendInput: internal.descendInput_STG,
        descendStackedBlock: internal.descendStackedBlock_STG,
    });

    return true;
}
const anon$compilerUtilityImported = anon$compilerUtility({});
if (anon$compilerUtilityImported) console.log('Compiler utility loaded successfully.\nUse vm.compiler to access it.');
else console.error('The Compiler-Utility has failed to load.');

/**
 * Example: this will make the changeX block run alert "1" instead of its default code;
 * vm.compiler.nodeMixin.register(vm.compiler.nodeMixin.new('motion', 'changeX'), 'alert(1)');
 */