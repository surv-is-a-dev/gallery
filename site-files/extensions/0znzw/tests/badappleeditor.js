/**!
 * Bad Apple (Editor)
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.3
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(async function (Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Bad Apple (Editor)" must be ran unsandboxed.`);
  }
  const extId = '0znzwBadAppleEditor', QP = new URLSearchParams(window.location.search);
  const { BlockType, vm } = Scratch, { runtime } = vm, JSZip = vm.exports.JSZip;
  let ScratchBlocks, audio, BIN, SIZE = 16;
  const HQAudio = QP.has('HQAudio'), HQ = false && QP.has('HQ'), CACHE_KEY = `${extId}_BadApple${HQAudio ? 'HQAudio' : (
    HQ ? 'HQ' : ''
  )}`;
  if (HQ) SIZE = 32;
  const FRAME_SIZE = SIZE ** 2;
  console.log('[BadApple] Loading cache');
  const idb=new (class IndexedDBSimple {
    constructor(key) {
      this.dbVersion = 1;
      if (key ?? false) this.setDBName(key);
    }
    setDBName(NAME) {
      this.dbName = NAME;
      return this.initializeDatabase();
    }
    initializeDatabase() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
        request.onerror = reject;
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };
        request.onupgradeneeded = (event) => {
          this.db = event.target.result;
          this.db.createObjectStore('data', {
            keyPath: 'key'
          });
        };
      });
    }
    writeToDatabase(KEY, VALUE) {
      const transaction = this.db.transaction(['data'], 'readwrite');
      const objectStore = transaction.objectStore('data');
      objectStore.put({
        key: KEY,
        value: VALUE
      });
    }
    async readFromDatabase(KEY) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['data'], 'readonly');
        const objectStore = transaction.objectStore('data');
        const request = objectStore.get(KEY);
        request.onsuccess = function(event) {
          resolve(event.target.result ? event.target.result.value : null);
        };
        request.onerror = function(event) {
          reject('Error reading from database');
        };
      });
    };
    getAllKeys() {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['data'], 'readonly');
        const objectStore = transaction.objectStore('data');
        const request = objectStore.getAllKeys();
        request.onsuccess = function(event) {
          const keysArray = event.target.result;
          const keysJSON = JSON.stringify(keysArray);
          resolve(keysJSON);
        };
        request.onerror = function(event) {
          reject('Error getting keys from database');
        };
      });
    }
    async keyExists(KEY) {
      const keys = await this.getAllKeys();
      return keys.includes(KEY);
    }
    deleteFromDatabase(KEY) {
      const transaction = this.db.transaction(['data'], 'readwrite');
      const objectStore = transaction.objectStore('data');
      objectStore.delete(KEY);
    }
  });
  await idb.setDBName(CACHE_KEY);
  const ReCACHE = QP.has('BA_RECACHE_DANGER');
  if (!await idb.keyExists('BadAppleCached') || ReCACHE) {
    let ZIP = await (() => new Promise((res, rej) => {
      idb.readFromDatabase('BadApple').then(async (kex) => {
        if (kex && !ReCACHE) return res(kex);
        console.log('[BadApple] Constructing cache');
        let data = await fetch(HQAudio ? `https://miyo.lol/bad_apple_manifest.hq_audio.lol?v=${Date.now()}` : (
          HQ ? `https://miyo.lol/bad_apple_manifest.hq.lol?v=${Date.now()}`
          : `https://miyo.lol/bad_apple_manifest.lol?v=${Date.now()}`)
        );
        data = await data.text();
        await idb.writeToDatabase('BadApple', data);
        res(data);
      }).catch(rej);
    }))();
    console.log('[BadApple] Caching zip');
    ZIP = await fetch(ZIP);
    ZIP = await ZIP.blob();
    ZIP = await JSZip.loadAsync(ZIP);
    console.log('[BadApple] Caching audio');
    const audioBlob = await ZIP.files.audio.async('blob');
    audio = await (blob => new Promise(resolve => {
      const fr = new FileReader();
      fr.onload = e => resolve(e.target.result);
      fr.readAsDataURL(blob);
    }))(audioBlob);
    await idb.writeToDatabase('BadAppleAudio', audio.replace('application/octet-stream', 'audio/mp3'));
    console.log('[BadApple] Loading audio');
    audio = new Audio(URL.createObjectURL(audioBlob));
    console.log('[BadApple] Loading binary data');
    BIN = (RLEData => {
      console.log('[BadApple] Loading and decoding binary data');
      return RLEData.replaceAll('@', ' @').replaceAll('!', ' !').split(' ').map(i => {
        if (!i) return '';
        return (i[0] === '!' ? '0' : '1').repeat(Number(i.slice(1)));
      }).join('');
    })(await ZIP.files.binary.async('string'));
    console.log('[BadApple] Caching binary data');
    await idb.writeToDatabase('BadAppleBinary', BIN);
    ZIP = null;
    await idb.writeToDatabase('BadAppleCached', true);
  } else {
    console.log('[BadApple] Loading cached audio');
    audio = new Audio(await idb.readFromDatabase('BadAppleAudio'));
    console.log('[BadApple] Loading cached binary data');
    BIN = await idb.readFromDatabase('BadAppleBinary');
  }
  console.log('[BadApple] Ready');
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
      this.blocks = new Array(FRAME_SIZE);
      this.wipeWS(false);
      for (let i = 0; i < FRAME_SIZE; i++) {
        this.blocks[i] = this.constructor.createWsBlock(((i % SIZE) * 32.4), (Math.floor(i / SIZE) * 27)).id;
      }
      vm.refreshWorkspace();
      console.log('[BadApple] Setup Workspace');
    }
    drawFrame() {
      this.frame++;
      const frame = (this.frame - 1) * FRAME_SIZE;
      const frameData = BIN.slice(frame, frame + FRAME_SIZE);
      for (let i = 0; i < FRAME_SIZE; i++) {
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
          blockType: BlockType.XML,
          xml: `<sep gap="-12" /><label text="30FPS | ${HQAudio ? '16x16 HQAudio' : (
            HQ ? '32x32 HQAudio' : '16x16'
          )}" />`,
        }, {
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
