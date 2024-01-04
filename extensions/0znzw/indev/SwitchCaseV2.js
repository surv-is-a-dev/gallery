(function(Scratch) {

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const sequencer = runtime.sequencer;

    // @ts-ignore Not typed yet.
    runtime._events['THREAD_RETIRED'] = [];
    // @ts-ignore Not typed yet
    runtime._eventsCount++;
    var srt = sequencer.retireThread.bind(sequencer);
    sequencer.retireThread = function(thread) {
        // @ts-expect-error Custom event
        runtime.emit('THREAD_RETIRED', thread);
        return srt(thread);
    }

    class ImpossibleUsageSkip {
        constructor() {}
    }

    class SwitchCaseV2 {
        constructor() {
            this.extId = 'SwitchCaseV2';
            this.colors = {
                color1: '#FFAB19',
                color2: '#EC9C13',
                color3: '#CF8B17',
                color4: '#CF8B17',
                quaternary: '#CF8B17'
            }
            this.switchOpcode = this.opcode('switch0');
            this.blocks = [{
                blockType: Scratch.BlockType.REPORTER,
                opcode: 'switchValue',
                text: 'switch value',
                disableMonitor: true
            }, '---', {
                blockType: Scratch.BlockType.CONDITIONAL,
                opcode: 'switch0',
                text: 'switch [value]',
                arguments: {
                    value: {
                        type: null
                    }
                }
            }, {
                blockType: Scratch.BlockType.CONDITIONAL,
                opcode: 'case0',
                text: 'case [value]',
                arguments: {
                    value: {
                        type: Scratch.ArgumentType.STRING
                    }
                }
            }, {
                blockType: Scratch.BlockType.CONDITIONAL,
                opcode: 'default0',
                text: 'default',
                isTerminal: true
            }, {
                blockType: Scratch.BlockType.COMMAND,
                opcode: 'break0',
                text: 'break switch',
                isTerminal: true
            }, '---', {
                blockType: Scratch.BlockType.COMMAND,
                opcode: 'runNextCase',
                text: 'run next case'
            }, {
                blockType: Scratch.BlockType.COMMAND,
                opcode: 'skip2case',
                text: 'skip to case [value]',
                arguments: {
                    value: {
                        type: Scratch.ArgumentType.STRING
                    }
                }
            }, {
                blockType: Scratch.BlockType.COMMAND,
                opcode: 'skip2default',
                text: 'skip to default'
            }];
            this.blocks = this.blocks.map(/** @argument {Object} block */block => (block?.extensions || typeof block !== 'object' ? block : {
                ...block,
                extensions: ['colours_control']
            }));
        }
        getInfo() {
            return {
                id: this.extId,
                name: 'Switch Case V2',
                ...this.colors,
                blocks: this.blocks,
                menus: {}
            }
        }

        /* Id management */
        stirSoup(idLength) {
            // https://github.com/TurboWarp/scratch-vm/blob/develop/src/util/uid.js
            const soup = '!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const id = [];
            for (let i = 0; i < idLength; i++) {
                id[i] = soup.charAt(Math.random() * soup.length);
            }
            return id.join('');
        }

        /* Block & Thread management */
        inFlyout(thread) {
            return !thread.target.blocks.getBlock(thread.peekStack());
        }
        opcode(opcode) {
            return `${this.extId}_${opcode}`;
        }
        getBlock(id, thread) {
            return thread.target.blocks.getBlock(id);
        }
        setBlock(id, thread, json) {
            thread.target.blocks._blocks[id] = json;
        }
        getBlockData(block, thread) {
            if (!thread?.id) return -1;
            return block[thread?.id] ?? -2;
        }
        updateBlockData(block, thread, data, $delete) {
            if (!thread?.id) return;
            let state = block[thread?.id];
            if (!state) state = {};
            state = {
                ...state,
                ...data
            }
            block[thread.id] = state;
            if ($delete) delete block[thread.id];
            this.setBlock(block.id, thread, block);
        }

        /* C Block Utilities */
        /* todo: figure out what the fuck is going on here, and why its returning the C above it */
        outerC(StartBlockId, thread) {
            let block = this.getBlock(StartBlockId, thread), oldBlock = null, isC = false;
            if (!block?.parent) return undefined;
            block = this.getBlock(block.parent, thread);
            while (!!block?.parent && !isC) {
                oldBlock = block;
                if (!oldBlock?.parent) {
                    block = oldBlock;
                    break;
                }
                block = this.getBlock(oldBlock.parent, thread);
                isC = !!block.inputs?.SUBSTACK;
                if (block?.next !== oldBlock?.parent && isC) break;
                if (isC && oldBlock.id === block.inputs.SUBSTACK.block) break;
            }
            //if (!block?.inputs) block = oldBlock;
            isC = !!block?.inputs?.SUBSTACK;
            if (!isC) return undefined;
            return block;
        }
        outerC_untilOpcode(opcode, thread, StartBlockId) {
            let block = this.getBlock(StartBlockId ?? thread.peekStack(), thread);
            while (block) {
                block = this.outerC(block?.id, thread);
                if (block?.opcode === opcode) return block;
            }
            return undefined;
        }
        outerC_ifOpcode(opcode, thread, StartBlockId) {
            const block = this.getBlock(StartBlockId ?? thread.peekStack(), thread), outerC = this.outerC(block.id, thread);
            console.log(block, outerC)
            return (outerC?.opcode === opcode ? outerC : false);
        }

        /* Utilities     ^^^^ */
        /* Actual blocks vvvv */

        /* Built in to JS */
        async switch0({ value }, util) {
            const thread = util.thread, myId = thread.peekStack();
            if (this.inFlyout(thread)) return;
            thread.id = this.stirSoup(20);
            const block = this.getBlock(myId, thread), self = {
                value,
                broke: false,
                skippingCase: {
                    bool: false,
                    value: null
                },
                doNext: false
            }
            this.updateBlockData(block, thread, self);
            thread.onRetire = (newThread) => {
                if (newThread?.id !== thread.id) return;
                // @ts-expect-error Custom event
                runtime.removeListener('THREAD_RETIRED', thread.onRetire);
                this.updateBlockData(block, thread, {}, true);
            }
            util.startBranch(1, false);
            // @ts-expect-error Not typed yet & custom event
            runtime.addListener('THREAD_RETIRED', thread.onRetire);
        }
        case0({ value }, util) {
            const thread = util.thread;
            if (this.inFlyout(thread)) return;
            const switchBlock = this.outerC_ifOpcode(this.switchOpcode, thread);
            if (!switchBlock) return;
            const switchData = this.getBlockData(switchBlock, thread);
            const switchValue = switchData?.value; if (!switchValue) return;
            if (switchData.broke) return;
            let didSpecialMove = false;
            if (switchData.skippingCase.bool) {
                didSpecialMove = true;
                if (value === switchData.skippingCase.value) switchData.skippingCase.bool = false;
                else return;
            }
            if (switchData.doNext) {
                didSpecialMove = true;
                switchData.doNext = false;
            }
            if (!didSpecialMove && switchValue !== value) return;
            util.startBranch(1, false);
            return;
        }
        default0(_, util) {
            const thread = util.thread;
            if (this.inFlyout(thread)) return;
            const switchBlock = this.outerC_untilOpcode(this.switchOpcode, thread); if (!switchBlock) return;
            const switchBroke = this.getBlockData(switchBlock, thread)?.broke; if (switchBroke) return;
            util.startBranch(1, false);
        }
        break0(_, util) {
            const thread = util.thread;
            if (this.inFlyout(thread)) return;
            const switchBlock = this.outerC_untilOpcode(this.switchOpcode, thread); if (!switchBlock) return;
            this.updateBlockData(switchBlock, thread, { broke: true });
        }

        /* Not in JS */
        switchValue(_, util) {
            const thread = util.thread;
            if (this.inFlyout(thread)) return '';
            const switchBlock = this.outerC_untilOpcode(this.switchOpcode, thread); if (!switchBlock) return '';
            const switchValue = this.getBlockData(switchBlock, thread)?.value; if (!switchValue) return '';
            return switchValue;
        }
        skip2case({ value }, util) {
            const thread = util.thread;
            if (this.inFlyout(thread)) return;
            const switchBlock = this.outerC_untilOpcode(this.switchOpcode, thread);
            if (!switchBlock) return;
            this.updateBlockData(switchBlock, thread, { skippingCase: {
                bool: true,
                value
            } });
            return;
        }
        skip2default(_, util) {
            const thread = util.thread;
            if (this.inFlyout(thread)) return;
            const switchBlock = this.outerC_untilOpcode(this.switchOpcode, thread);
            if (!switchBlock) return;
            this.updateBlockData(switchBlock, thread, { skippingCase: {
                bool: true,
                value: new ImpossibleUsageSkip
            } });
            return;
        }
        runNextCase(_, util) {
            const thread = util.thread;
            if (this.inFlyout(thread)) return;
            const switchBlock = this.outerC_untilOpcode(this.switchOpcode, thread);
            if (!switchBlock) return;
            this.updateBlockData(switchBlock, thread, { doNext: true });
            return;
        }
    }
    Scratch.extensions.register(new SwitchCaseV2);
})(Scratch);