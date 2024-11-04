/**!
 * Bad Apple (Editor)
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(async function (Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Bad Apple (Editor)" must be ran unsandboxed.`);
  }
  const extId = '0znzwBadAppleEditor';
  const { BlockType, vm } = Scratch, { runtime } = vm, JSZip = vm.exports.JSZip;
  let ScratchBlocks;
  if (!localStorage[`${extId}_BadAppleCache`]) {
    try {
      const data = await fetch('https://miyo.lol/bad_apple_manifest.lol');
      localStorage[`${extId}_BadAppleCache`] = await data.text();
    } catch {
      throw new Error('Failed to get the Bad Apple data.');
    }
  }
  console.log('[BadApple] Loading zip');
  let ZIP = await fetch(localStorage[`${extId}_BadAppleCache`]);
  ZIP = await ZIP.blob();
  ZIP = await JSZip.loadAsync(ZIP);
  console.log('[BadApple] Loading audio');
  const audio = new Audio(URL.createObjectURL(new Blob([await ZIP.files.audio.async('arraybuffer')], { type: 'audio/mp3' })));
  const BIN = (RLEData => {
    console.log('[BadApple] Loading and decoding binary data');
    return RLEData.replaceAll('@', ' @').replaceAll('!', ' !').split(' ').map(i => {
      if (!i) return '';
      return (i[0] === '!' ? '0' : '1').repeat(Number(i.slice(1)));
    }).join('');
  })(await ZIP.files.binary.async('string'));
  console.log('[BadApple] Ready');
  ZIP = null;
  const alphaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const uid = function (len, soup) {
    const soup_ = soup ?? ('!#%()*+,-./:;=?@[]^_`{|}~' + alphaChars);
    const length = len ?? 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
      id[i] = soup_.charAt(Math.random() * soupLength);
    }
    return id.join('');
  };
  class extension {
    constructor() {
      this.info = null;
      this.playing = false;
      this.interval = null;
      this.frame = 0;
      if (Scratch.gui) Scratch.gui.getBlockly().then(Blockly => {
        ScratchBlocks = Blockly;
      });
    }
    static createWsBlock = (x, y) => {
      const block = {
        fields: {},
        id: uid(),
        inputs: {},
        next: null,
        opcode: `${extId}_bit`,
        parent: null,
        shadow: false,
        topLevel: true,
        x, y,
      };
      const bks = vm.editingTarget.blocks;
      bks._blocks[block.id] = block;
      bks._scripts.push(block.id);
      return block;
    };
    setupBlocks() {
      this.blocks = new Array(256);
      this.wipeWS(false);
      for (let i = 0; i < 256; i++) {
        this.blocks[i] = this.constructor.createWsBlock(((i % 16) * 32.4), (Math.floor(i / 16) * 27)).id;
      }
      vm.refreshWorkspace();
      console.log('[BadApple] Setup Workspace');
    }
    drawFrame() {
      this.frame++;
      const frame = (this.frame - 1) * 256;
      const frameData = BIN.slice(frame, frame + 256);
      for (let i = 0; i < 256; i++) {
        const block = ScratchBlocks.mainWorkspace.blockDB_[this.blocks[i]];
        const colour = frameData[i] == '0' ? '#000000' : '#FFFFFF';
        if (block.colour_ === colour) continue;
        block.setColour(colour);
      }
    }
    drawFrameBtn() {
      this.setupBlocks();
      this.drawFrame();
    }
    getInfo() {
      return {
        id: extId,
        name: 'Bad Apple (Editor)',
        blocks: [{
          blockType: BlockType.BUTTON,
          func: 'drawFrameBtn',
          text: 'draw frame',
        }, {
          blockType: BlockType.BUTTON,
          func: 'play',
          text: this.playing ? 'Stop' : 'Play',
        }, {
          blockType: BlockType.REPORTER,
          opcode: 'bit',
          text: '\u202D',
          output: String(Date.now()),
          blockShape: 3,
          color1: '#000000',
          color2: '#000000',
          color3: '#000000',
          disableMonitor: true,
        }],
      };
    }
    wipeWS(ref) {
      const bks = vm.editingTarget.blocks;
      bks._blocks = {};
      bks._scripts = [];
      bks._cache.compiledProcedures = {};
      bks._cache.compiledScripts = {};
      bks._cache.inputs = {};
      bks._cache.procedureDefinitions = {};
      bks._cache.procedureParamNames = {};
      bks._cache.proceduresPopulated = {};
      bks._cache.scripts = {
        event_whengreaterthan: [],
        event_whenkeypressed: [],
        event_whentouchingobject: [],
      };
      bks._cache._executedCached = {};
      bks._cache._monitored = null;
      if (ref ?? true) vm.refreshWorkspace();
    }
    play() {
      this.playing = !this.playing;
      clearInterval(this.interval);
      this.wipeWS(true);
      this.frame = 0;
      const FPS = (1000 / 30);
      if (this.playing) {
        this.setupBlocks();
        this.interval = setInterval(() => this.drawFrame(), FPS);
        setTimeout(() => audio.play(), FPS);
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
      vm.extensionManager.refreshBlocks();
    }
    bit() { return '' }
  }
  const _cbfsb = runtime._convertBlockForScratchBlocks;
  runtime._convertBlockForScratchBlocks = function(blockInfo, categoryInfo, ...args) {
    const res = _cbfsb.call(this, blockInfo, categoryInfo, ...args);
    if (blockInfo.output !== undefined) res.json.output = blockInfo.output;
    if (blockInfo.blockShape !== undefined) res.json.outputShape = blockInfo.blockShape;
    return res;
  };
  Scratch.extensions.register(runtime[`ext_${extId}`] = new extension());
})(Scratch);
