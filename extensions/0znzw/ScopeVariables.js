/**
 *
 * Scope variables   | en-us v1.0
 * All code by 0znzw | Licensed under MIT license.
 * DO NOT REMOVE THIS COMMENT
 *
 * original: https://chibi.codingclip.cc/extensions/SimonShiki/shikiScopeVar.js
 * original by: SkyHigh173, and SimonShiki
 * "ported" for turbowarp compiler
 *
 */
(function (Scratch) {

    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Scope Variables" extension must be ran unsandboxed.`);
    }

    function isInPalette(util) {
        return !Object.keys(util.thread.target.blocks._blocks).includes(
            util.thread.peekStack(),
        );
    }

    function getBlockByID(target, id) {
        return target.blocks._blocks[id];
    }

    function setBlockByID(target, id, JSON) {
        target.blocks._blocks[id] = JSON;
    }

    function getBranch(target, id, number) {
        return target.blocks.getBranch(id, number);
    }

    //SkyHigh173 helped me alot :DDD
    function getOuterC(target, startBlockID, targetOpcode) {
        const blocks = target.blocks;
        let block = blocks.getBlock(startBlockID),
            oldBlock = null;
        if (block.parent == null) return null;
        function moveUpParentStack() {
            while (block.parent != null) {
                oldBlock = structuredClone(block);
                block = blocks.getBlock(block.parent);
                if (block.inputs.hasOwnProperty('SUBSTACK')) {
                    if (oldBlock.id === block.inputs.SUBSTACK.block) break;
                }
            }
        }
        if (targetOpcode) {
            while (block != null && block.opcode != targetOpcode) 
                moveUpParentStack();
        } else moveUpParentStack();
        return block;
    }

    class extension {
        constructor() {
            this.mgi = this.getInfo();
            this.scopeId = this.mgi.id + '_scope';
        }
        getInfo() {
            return {
                id: '0znzwScopeVariables',
                name: 'Scope Variables',
                // *cough* steal color *cough*
                color1: '#9999FF',
                blocks: [
                    {
                        text: 'scope',
                        opcode: 'scope',
                        blockType: 'conditional',
                    },
                    {
                        text: 'create scoped [name]',
                        opcode: 'new',
                        blockType: 'command',
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                            },
                        },
                    },
                    {
                        text: 'get scoped [name]',
                        opcode: 'get',
                        blockType: 'reporter',
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                            },
                        },
                    },
                    {
                        text: 'has scoped [name]',
                        opcode: 'has',
                        blockType: 'Boolean',
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                            },
                        },
                    },
                    {
                        text: 'set scoped [name] to [value]',
                        opcode: 'set',
                        blockType: 'command',
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            value: {
                                type: Scratch.ArgumentType.STRING,
                            },
                        },
                    },
                    {
                        text: 'change scoped [name] by [value]',
                        opcode: 'change',
                        blockType: 'command',
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            value: {
                                type: Scratch.ArgumentType.NUMBER,
                            },
                        },
                    },
                ],
            };
        }
        getScope(util) {
            return getOuterC(
                util.target,
                util.thread.peekStack(),
                this.scopeId,
            );
        }
        getBlock(util) {
            return getBlockByID(util.target, util.thread.peekStack());
        }
        setBlock(util, json) {
            setBlockByID(util.target, util.thread.peekStack(), json);
        }
        updateScope(util, scope) {
            setBlockByID(util.target, scope.id, scope);
        }
        scope(args, util) {
            if (isInPalette(util)) return;
            const me = this.getBlock(util);
            me.scopeVars = {};
            this.setBlock(util, me);
            util.startBranch(1, false);
        }
        new(args, util) {
            if (isInPalette(util)) return;
            const myC = this.getScope(util);
            if (!myC || myC === null) return;
            const vName = Scratch.Cast.toString(args.name);
            myC.scopeVars[vName] = '';
            this.updateScope(util, myC);
        }
        set(args, util) {
            if (isInPalette(util)) return;
            const myC = this.getScope(util);
            if (!myC || myC === null) return;
            const vName = Scratch.Cast.toString(args.name);
            const vValue = args.value;
            myC.scopeVars[vName] = vValue;
            this.updateScope(util, myC);
        }
        change(args, util) {
            if (isInPalette(util)) return;
            const myC = this.getScope(util);
            if (!myC || myC === null) return;
            const name = Scratch.Cast.toString(args.name);
            const changeBy = Scratch.Cast.toNumber(args.count);
            const value = this.get({ name }, util) + changeBy;
            this.set({ value, name }, util);
        }
        get(args, util) {
            if (isInPalette(util)) return;
            const myC = this.getScope(util);
            if (!myC || myC === null) return;
            const vName = Scratch.Cast.toString(args.name);
            return myC.scopeVars[vName];
        }
        has(args, util) {
            if (isInPalette(util)) return;
            const myC = this.getScope(util);
            if (!myC || myC === null) return;
            return !!(this.get({ name: args.name }, util) ?? null);
        }
    }

    // @ts-ignore This always happens :sweat_smile:
    Scratch.extensions.register(new extension());
})(Scratch);
