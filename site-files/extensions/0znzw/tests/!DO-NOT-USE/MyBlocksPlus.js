/**!
 * My Blocks+
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @author CST1229 https://scratch.mit.edu/users/CST1229/
 * @version 1.0
 * @copyright MIT License
 * Do not remove this comment
 */
(function (Scratch) {
    'use strict';

    window.Scratch = Scratch;

    const hasOwn = function (object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    };

    const _stackFrameFreeList = [];
    class _StackFrame {
        constructor(t) {
            (this.isLoop = !1), (this.warpMode = t), (this.justReported = null), (this.reporting = ''), (this.reported = null), (this.waitingReporter = null), (this.params = null), (this.executionContext = null), (this.op = null);
        }
        reset() {
            return (this.isLoop = !1), (this.warpMode = !1), (this.justReported = null), (this.reported = null), (this.waitingReporter = null), (this.params = null), (this.executionContext = null), (this.op = null), this;
        }
        reuse(t = this.warpMode) {
            return this.reset(), (this.warpMode = Boolean(t)), this;
        }
        static create(t) {
            const e = _stackFrameFreeList.pop();
            return void 0 !== e ? ((e.warpMode = Boolean(t)), e) : new _StackFrame(t);
        }
        static release(t) {
            void 0 !== t && _stackFrameFreeList.push(t.reset());
        }
    }

    const vm = Scratch.vm,
        runtime = vm.runtime;
    const sequencer = runtime.sequencer;
    const extensionId = '0znzwMBP',
        myBlocks = [],
        hatMap = {},
        shadowClone = [],
        noMod = [];

        const defTargetStore = {
            hats: []
        }

    vm.runtime.on('targetWasCreated', (target) => {
      // @ts-ignore  
      target.extensionStorage.mbp = structuredClone(defTargetStore);
    });
    runtime.targets.forEach(target => {
        if (!target.isOriginal) return;
        // @ts-ignore
        target.extensionStorage.mbp = structuredClone(defTargetStore);
    })

    vm.on('EXTENSION_ADDED', tryUseScratchBlocks);
    vm.on('BLOCKSINFO_UPDATE', tryUseScratchBlocks);
    tryUseScratchBlocks();

    const THREAD_RETIRED = 'THREAD_RETIRED_MBP';
    // @ts-ignore Not typed yet.
    runtime._events[THREAD_RETIRED] = runtime._events[THREAD_RETIRED] ?? [];
    // @ts-ignore Not typed yet
    runtime._eventsCount++;
    var srt = sequencer.retireThread.bind(sequencer);
    sequencer.retireThread = function (thread) {
        // @ts-expect-error Custom event
        runtime.emit(THREAD_RETIRED, thread);
        return srt(thread);
    };

    const Utils = {
        /**
         * Escape a string to be safe to use in XML content.
         * CC-BY-SA: hgoebl
         * https://stackoverflow.com/questions/7918868/
         * how-to-escape-xml-entities-in-javascript
         * @param {!string | !Array.<string>} unsafe Unsafe string.
         * @return {string} XML-escaped string, for use within an XML tag.
         * https://github.com/TurboWarp/scratch-vm/blob/develop/src/util/xml-escape.js
         */
        xmlEscape(unsafe) {
            if (typeof unsafe !== 'string') {
                if (Array.isArray(unsafe)) {
                    // This happens when we have hacked blocks from 2.0
                    // See #1030
                    unsafe = String(unsafe);
                } else {
                    console.error('[MB+] Unexpected input received in xmlEscape');
                    return unsafe;
                }
            }
            return unsafe.replace(/[<>&'"]/g, (c) => {
                switch (c) {
                    case '<':
                        return '&lt;';
                    case '>':
                        return '&gt;';
                    case '&':
                        return '&amp;';
                    case "'":
                        return '&apos;';
                    case '"':
                        return '&quot;';
                }
            });
        },
        /**
         * UID Generator
         * @param {Number} idLength
         * @returns {String} random UID
         */
        stirSoup(idLength) {
            // https://github.com/TurboWarp/scratch-vm/blob/develop/src/util/uid.js
            const soup = '!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const id = [];
            for (let i = 0; i < idLength; i++) {
                id[i] = soup.charAt(Math.random() * soup.length);
            }
            return id.join('');
        },
        /**
         * Forces a thread to become warped
         * @param {VM.Thread} thread Thread to warp
         */
        warpThread(thread) {
            thread.isCompiled = false;
            thread.peekStackFrame().warpMode = true;
            thread.tryCompile();
        },
        /**
         *
         * @param {VM.Thread}   Thread   Thread class
         * @param {VM.Thread}   thread   Thread to spoof
         * @param {String}      topBlock Top block id
         * @param {VM.Target}   target   Thread target
         * @returns {VM.Thread}
         */
        spoofThread(Thread, thread, topBlock, target) {
            const myThreadOpts = { stackClick: thread.stackClick ?? false, updateMonitor: thread.updateMonitor ?? false };
            const warpMode = thread.stackFrames[thread.stackFrames.length - 1].warpMode;
            // @ts-ignore Not typed at all
            const myThread = new Thread(thread.topBlock, thread.target, myThreadOpts);
            myThread.stackFrames = [new _StackFrame(warpMode)];
            myThread.topBlock = topBlock ?? myThread.topBlock;
            myThread.stack = [myThread.topBlock];
            myThread.blockGlowInFrame = myThread.topBlock;
            myThread.target = target ?? myThread.target;
            myThread.blockContainer = myThread.target.blocks;
            for (const key of Object.keys(thread)) {
                if (hasOwn(myThread, key)) continue;
                myThread[key] = thread[key];
            }
            return myThread;
        },
        spoofWarp(Thread, thread, topBlock, target) {
            const newThread = Utils.spoofThread(Thread, thread, topBlock, target);
            thread.peekStackFrame().warpMode = false;
            this.warpThread(newThread);
            thread.stackFrames[thread.stackFrames.length - 1].warpMode = true;
            return newThread;
        },
        getBlocksByType(workspace, type) {
            const blocks = workspace.getAllBlocks().filter((block) => block.type == type);
            const flyoutBlock = workspace.getBlockById(type);
            if (flyoutBlock) blocks.push(flyoutBlock);
            return blocks;
        },
        adjustColor: (c, a) => c.replace(/\w\w/g, m => Math.min(255, Math.max(0, parseInt(m, 16) + a)).toString(16)),
    };

    function modifyBlocks() {
        // @ts-ignore
        const workspace = ScratchBlocks.getMainWorkspace();
        workspace.getAllBlocks().filter(block => {
            return noMod.includes(block.type);
        }).forEach(block => {
            block.setDeletable(false);
            block.setEditable(false);
        });
        workspace.getAllBlocks().filter(block => {
            return shadowClone.includes(block.type);
        }).forEach(block => {
            if (block.shadowColored) return;
            block.setColour(String(Utils.adjustColor(block.colour_, -20)).padEnd(7, '0'));
            block.shadowColored = true;
        });
    }

    function tryUseScratchBlocks() {
        // @ts-ignore
        if (!window.ScratchBlocks) return;
        // @ts-ignore Not typed yet
        const workspace = ScratchBlocks.getMainWorkspace();
        // @ts-ignore
        const sbu = ScratchBlocks.scratchBlocksUtils;
        vm.removeListener('EXTENSION_ADDED', tryUseScratchBlocks);
        vm.removeListener('BLOCKSINFO_UPDATE', tryUseScratchBlocks);
        const isar = sbu.isShadowArgumentReporter;
        sbu.isShadowArgumentReporter = function(block) {
            if (shadowClone.includes(block.type)) {
                return true && block.isShadow();
            } else return isar(block);
        }
        vm.on('workspaceUpdate', modifyBlocks);
        runtime.on('BLOCK_DRAG_UPDATE', modifyBlocks);
        runtime.on('BLOCK_DRAG_END', modifyBlocks);
    }

    function getHat(blockInfo) {
      // @ts-ignore
        const target = runtime.targets.find(target => target.extensionStorage.mbp.hats.includes(blockInfo.hatOpcode));
        const id = Object.values(target.blocks._blocks).find(block => block.opcode === blockInfo.hatOpcode)?.id;
        return {target, id};
    }

    class Extension {
        constructor() {
            this.getInfo_ = {
                id: extensionId,
                name: 'mbp',
                menus: {},
            };
        }
        baseHat(args, util, blockInfo) {
            const thread = util.thread;
            thread.mbp_id = Utils.stirSoup(20);
            thread.hatArgs = args;
        }
        /*
        TODO
        fix warp
        add arguments
         */
        baseBlock(args, util, blockInfo) {
            const hat = getHat(blockInfo);
            const hatTarget = hat.target;
            const hatId = hat.id;
            const thread = util.thread,
                target = util.target;
            /**
             * @type {Object}
             */
            const Thread = thread.constructor;
            const hatThread = Utils.spoofWarp(Thread, thread, hatId, hatTarget);
            // @ts-ignore
            hatThread.spawnArgs = args;
            console.log(args);
            runtime.threads.push(hatThread);
            return new Promise((resolve) => {
                runtime.on('AFTER_EXECUTE', function afterExecute() {
                    // @ts-ignore Not typed at all
                    if (hatThread.status === Thread.STATUS_DONE || hasOwn(hatThread, 'returnValue')) {
                        runtime.off('AFTER_EXECUTE', afterExecute);
                        // @ts-ignore
                        const returnValue = hatThread.returnValue;
                        if (blockInfo?.branchCount > 0) {
                            util.startBranch(Scratch.Cast.toNumber(returnValue), false);
                        }
                        resolve(returnValue ?? '');
                    }
                });
            });
        }
        get0(args, util, blockInfo) {
            const rtn = blockInfo.blockType === 'reporter' ? '' : false;
            const thread = util.thread;
            if (!hasOwn(thread, 'mbp_id')) return rtn;
            //if (hasOwn(thread.hatArgs, blockInfo.text)) return thread.hatArgs[blockInfo.text];
            if (!hasOwn(thread, 'spawnArgs')) return rtn;
            return thread.spawnArgs[args.A1] ?? rtn;
        }
        return0(args, util) {
            runtime._stopThread(util.thread);
            util.thread.returnValue = args.A1;
            return new Promise((resolve) => {
                resolve();
            });
        }
        getInfo() {
            const i = this.getInfo_;
            i.blocks = [
                {
                    opcode: 'return0',
                    blockType: Scratch.BlockType.COMMAND,
                    isTerminal: true,
                    text: 'return [A1]',
                    arguments: {
                        A1: {
                            type: Scratch.ArgumentType.STRING,
                        },
                    },
                },
                {
                    opcode: 'get0',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'argument [A1]',
                    arguments: {
                        A1: {
                            type: Scratch.ArgumentType.STRING,
                        },
                    },
                },
                ...myBlocks
            ]
            return i;
        }
    }

            // @ts-ignore Outdated types
            if (!runtime.extensionStorage?.mbp) runtime.extensionStorage.mbp = {
                blocks: [],
                loading: false
                // @ts-ignore
            }; else runtime.extensionStorage.mbp.loading = true;

    const blockArgs = [];
    /**
     * Creates the specified block & its hat
     * @param {Object} data Block to add
     */
    function createBlock(data, genHats) {
        const baseOpcode = data.opcode,
            hatOpcode = `${baseOpcode}_hat`,
            argOpcode = `${baseOpcode}_arg`;
        const xmlOpcode = `${extensionId}_${baseOpcode}`,
            xmlHatOpcode = `${extensionId}_${hatOpcode}`,
            xmlArgOpcode = `${extensionId}_${argOpcode}`;
        const target = vm.editingTarget;
        // @ts-ignore
        const store = target.extensionStorage.mbp;
        //data.hideFromPalette = true;
        data.func = 'baseBlock';
        data.arguments = data.arguments ?? {};
        data.hatOpcode = xmlHatOpcode;
        const hat = {};
        hat.hideFromPalette = true;
        hat.blockType = Scratch.BlockType.HAT;
        hat.id = Utils.stirSoup(20);
        hat.opcode = hatOpcode;
        noMod.push(xmlHatOpcode);
        hat.func = 'baseHat';
        hat.text = data.hatText;
        if (data.extensions) hat.extensions = data.extensions;
        if (data.color1) hat.color1 = data.color1;
        if (data.color2) hat.color2 = data.color2;
        if (data.color3) hat.color3 = data.color3;
        if (data.color4) hat.color4 = data.color4;
        if (genHats) {
            const workspaceHat = {
                id: hat.id,
                opcode: xmlHatOpcode,
                inputs: {},
                fields: {},
                next: null,
                topLevel: true,
                parent: null,
                shadow: false,
                x: 0,
                y: 0,
            };
            // @ts-ignore
            target.blocks.createBlock(workspaceHat);
            // @ts-ignore
            target.blocks._addScript(hat.id);
        }
        myBlocks.push(data);
        myBlocks.push(hat);
        Extension.prototype[hatOpcode] = function () {};
        Extension.prototype[baseOpcode] = function () {};
        store.hats.push(xmlHatOpcode);
        // @ts-ignore
        runtime.extensionStorage.mbp.blocks.push(data);
        // @ts-ignore
        runtime.extensionStorage.mbp.blocks.push(hat);
        vm.emitWorkspaceUpdate();
        vm.refreshWorkspace();
        runtime.extensionManager.refreshBlocks();
    }

    // @ts-ignore
    if (runtime.extensionStorage?.mbp.blocks) { for (const block of runtime.extensionStorage.mbp.blocks) {
        createBlock(block, false);
    }}

    // @ts-ignore
    window.cc = createBlock;

    // @ts-ignore Outdated types
    Scratch.extensions.register(new Extension());

    vm.once('EXTENSION_ADDED', () => {
        vm.refreshWorkspace();
    })
})(Scratch);
