// todo:
//   figure out why this is not working
(function(Scratch) {

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const Cast = Scratch.Cast;
    const ArgType = Scratch.ArgumentType;
    const BlockType = Scratch.BlockType;

    class SwitchCaseExt {
        constructor() {
            this.extensionId = '0znzwSwitchCase2';
            this.errors = {
                notInSwitch: 'this block must be inside a switch block'
            }
        }

        getInfo() {
            return ({
                id: this.extensionId,
                name: 'Switch Case',
                blocks: [{
                    blockType: BlockType.CONDITIONAL,
                    opcode: 'switch0',
                    text: 'switch [VALUE]',
                    arguments: {
                        VALUE: {
                            type: null
                        }
                    }
                }, {
                    blockType: BlockType.CONDITIONAL,
                    opcode: 'case0',
                    text: 'case [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgType.STRING
                        }
                    }
                }, {
                    blockType: BlockType.CONDITIONAL,
                    opcode: 'default0',
                    text: 'default',
                    isTerminal: true
                }]
            });
        }

        inFlyout(util) {
            return !util.target.blocks.getBlock(util.thread.peekStack());
        }
        stirSoup(idLength) {
            // https://github.com/TurboWarp/scratch-vm/blob/develop/src/util/uid.js
            const soup = '!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const id = [];
            for (let i = 0; i < idLength; i++) {
                id[i] = soup.charAt(Math.random() * soup.length);
            }
            return id.join('');
        }

        getBlock(util, id) {
            return util.target.blocks.getBlock(id);
        }
        setBlock(util, id, json) {
            util.target.blocks._blocks[id] = json;
        }

        outerC(util, startBlock) {
            const target = util.target, thread = util.thread;
            let block = null, oldBlock = null, isC = false;
            startBlock = startBlock ?? thread.peekStack();
            block = this.getBlock(util, startBlock);
            while (!!block.parent && !isC) {
                oldBlock = block;
                block = this.getBlock(util, oldBlock.parent);
                isC = !!block.inputs?.SUBSTACK;
                if (isC && oldBlock.id === block.inputs.SUBSTACK.block) break;
            }
            const trace = this;
            return {trace, util, block, oldBlock, checkStack() {
                const block = this.block, oldBlock = this.oldBlock;
                const isC = !!block.inputs?.SUBSTACK;
                if (!isC) return false;
                return oldBlock.id === block.inputs.SUBSTACK.block;
            }, csParent() {
                if (!this.checkStack()) {
                    const oldBlock = this.block;
                    this.block = this.trace.getBlock(this.util, this.block.parent);
                    this.oldBlock = oldBlock;
                }
            }};
        }
        outerC_opcode(util, startBlock, opcode) {
            let loopData = this.outerC(util, startBlock);
            while (loopData.block.opcode !== opcode) {
                if (!loopData?.block?.id) break;
                loopData.csParent();
                loopData = this.outerC(util, loopData.block.id);
            }
            if (!!loopData.block) return {
                err: 'failed to get valid block'
            };
            if (!loopData.checkStack()) loopData.csParent();
            if (!loopData.checkStack()) {
                return {
                    err: 'failed find valid parent'
                };
            }
            return loopData;
        }

        setInSwitchBlock(util, switchBlockId, keyPairs) {
            let switchBlock = this.getBlock(util, switchBlockId);
            switchBlock = {
                ...switchBlock,
                ...keyPairs
            }
            this.setBlock(util, switchBlockId, switchBlockId);
        }
        setInSwitchThread(util, switchBlockId, keyPairs) {
            const thread = util.thread, internals = thread.switchInternals, switchObject = internals.switch[switchBlockId] ?? {};
            internals.switch[switchBlockId] = {
                ...switchObject,
                ...keyPairs
            }
        }
        getInSwitchBlock(util, switchBlockId, key) {
            return this.getBlock(util, switchBlockId)[key];
        }
        getInSwitchThread(util, switchBlockId, key) {
            const thread = util.thread, internals = thread.switchInternals;
            return internals.switch[switchBlockId][key];
        }
        getSwitchBlock(util) {
            return this.outerC_opcode(util, util.thread.peekStack(), `${this.extensionId}_switch0`);
        }
        getSwitchThread(util, switchBlock) {
            return util.thread?.switchInternals?.switch[switchBlock.id];
        }

        BlockError(blockId, error) {
            error = String(error) ?? 'unknown error';
            vm.runtime.visualReport(blockId, `SwitchCasee Has Errored\n${error}`);
        }

        /*^ Utility functions <3 ^*/

        switch0({ VALUE }, util) {
            if (this.inFlyout(util)) return;
            const thread = util.thread;
            thread.switchInternals = {
                id: this.stirSoup(20),
                switch: {}
            };
            const id = util.thread.peekStack();
            this.setInSwitchBlock(util, id, {
                threadId: thread.switchInternals.id
            });
            this.setInSwitchThread(util, id, {
                value: VALUE,
                ranCase: false
            });
        }

        case0({ VALUE }, util) {
            const thread = util.thread, id = thread.peekStack();
            if (this.inFlyout(util)) {
                this.BlockError(id, this.errors.notInSwitch);
                return;
            };
            const switchBlock = this.getSwitchBlock(util), switchThread = this.getSwitchThread(util, switchBlock);
            if (switchBlock.err || !switchThread) {
                if (!switchThread) this.BlockError(id, this.errors.notInSwitch);
                console.log(switchBlock);
                return;
            }
            if (VALUE === switchThread.value) {
                this.setInSwitchThread(util, switchBlock.id, {
                    ranCase: VALUE
                })
                util.startBranch(1, 0);
            }
        }

        default0(_, util) {
            const thread = util.thread, id = thread.peekStack();
            if (this.inFlyout(util)) {
                this.BlockError(id, this.errors.notInSwitch);
                return;
            };
            const switchBlock = this.getSwitchBlock(util), switchThread = this.getSwitchThread(util, switchBlock);
            if (switchBlock.err || !switchThread) {
                if (!switchThread) this.BlockError(id, this.errors.notInSwitch);
                console.log(switchBlock);
                return;
            }
            if (switchThread.ranCase) return;
            util.startBranch(1, 0);
        }

    }

    Scratch.extensions.register(new SwitchCaseExt);
})(Scratch);