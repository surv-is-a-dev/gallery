/**!
 * Anime image API test
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @author Mist <mist@mistium.com> (@link https://scratch.mit.edu/users/mistium/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function (Scratch) {
  'use strict';
  const { BlockType, ArgumentType, Cast, vm } = Scratch;
  const { runtime } = vm;
  // @ts-ignore es-stuff
  if (!Array.fromAsync) Array.fromAsync = Array.from.bind(Array);
  const types = {
    normal: atob('d2FpZnUgbmVrbyBzaGlub2J1IG1lZ3VtaW4gYnVsbHkgY3VkZGxlIGNyeSBodWcgYXdvbyBraXNzIGxpY2sgcGF0IHNtdWcgYm9uayB5ZWV0IGJsdXNoIHNtaWxlIHdhdmUgaGlnaGZpdmUgaGFuZGhvbGQgbm9tIGJpdGUgZ2xvbXAgc2xhcCBraWxsIGtpY2sgaGFwcHkgd2luayBwb2tlIGRhbmNlIGNyaW5nZQ==').split(' '),
    sus: atob('d2FpZnUgbmVrbyB0cmFwIGJsb3dqb2I=').split(' '),
  }
  const extId = '0znzwMistAnimeImageApiTest';
  class extension {
    static exports = { types };
    constructor() {
      this.sus = false;
      this.showUnsafe = false;
      this.initAPIdetails(false, 'waifus.mistium.com');
    }
    initAPIdetails(proxy, api) {
      this.PROXY = proxy ? 'https://proxy.mistium.com/?url=' : '';
      this.API = `${this.PROXY}https://${api}`;
    }
    getInfo() {
      return {
        id: extId,
        name: 'Anime image API test',
        blocks: [{
          blockType: BlockType.BUTTON,
          func: 'toggleSUS',
          text: this.sus ? 'Disable sus' : 'Enable sus',
        }, {
          blockType: BlockType.BUTTON,
          func: 'README',
          text: 'READ ME',
        }, {
          blockType: BlockType.REPORTER,
          opcode: 'fetchNormal',
          text: 'get [many] url(s) of category [type]',
          arguments: {
            many: { menu: 'many', type: ArgumentType.STRING },
            type: { menu: 'typesNormal', type: ArgumentType.STRING },
          },
        }, {
          blockType: BlockType.REPORTER,
          opcode: 'fetchNormalAsT',
          text: 'get one of category [type] as [mode]',
          arguments: {
            type: { menu: 'typesNormal', type: ArgumentType.STRING },
            mode: { menu: 'modes', type: ArgumentType.STRING },
          },
        }, {
          hideFromPalette: !this.sus,
          blockType: BlockType.XML,
          xml: '<sep gap="24" />',
        }, {
          hideFromPalette: !this.sus,
          blockType: BlockType.REPORTER,
          opcode: 'fetchSus',
          text: 'get [many] url(s) of 18+ category [type]',
          arguments: {
            many: { menu: 'many', type: ArgumentType.STRING },
            type: { menu: 'typesSus', type: ArgumentType.STRING },
          },
        }, {
          hideFromPalette: !this.sus,
          blockType: BlockType.REPORTER,
          opcode: 'fetchSusAsT',
          text: 'get one of 18+ category [type] as [mode]',
          arguments: {
            type: { menu: 'typesSus', type: ArgumentType.STRING },
            mode: { menu: 'modes', type: ArgumentType.STRING },
          },
        }],
        menus: {
          typesNormal: {
            items: types.normal,
            acceptReporters: true,
            acceptText: true,
          },
          typesSus: {
            items: types.sus,
            acceptReporters: true,
            acceptText: true,
          },
          many: {
            items: ['one', 'many'],
            acceptReporters: true,
            acceptText: true,
          },
          modes: {
            items: ['dataURL', 'base64', ...(this.showUnsafe ? ['arrayBuffer', 'uint8array', 'blob'] : []), 'array', 'hex', 'binary'],
            acceptReporters: true,
            acceptText: true,
          }
        },
      };
    }
    toggleSUS() {
      if (this.sus) {
        this.sus = false;
      } else if (confirm('You must be over 18 to do this :3.\nAre you? (ok/y or cancel/n)')) {
        this.sus = true;
      }
      vm.extensionManager.refreshBlocks(extId);
    }
    README() {
      alert('This API / extension CAN return GIFs so if you are importing these images make sure to check if it is a GIF or not.\n\nAlso if it does not work then the API may be down or your ISP / network may be blocking the endpoints.');
    }
    _constructURL(sus, type, many) {
      if (('scaffolding' in window) && sus !== this.sus && sus) {
        this.toggleSUS();
        sus = this.sus;
      }
      return `${this.API}${many ? '/many' : ''}/${sus ? 'n' : ''}sfw/${encodeURIComponent(type)}`;
    }
    _asImageType(sus, type) {
      type = Cast.toString(type).toLowerCase();
      const typeor = (sus ? types.sus : types.normal);
      if (!typeor.includes(type)) {
        const _stype = type;
        type = Cast.toNumber(type) - 1;
        if (typeof typeor[type] !== 'string') {
          console.warn(`Unable to find indexed (${type}) or stringed (${_stype}) key for type. defaulting to index 0.`);
          type = 0;
        }
        type = typeor[type];
      }
      return type;
    }
    async _doFetch(sus, many, type) {
      if (typeof many !== 'boolean') {
        many = Cast.toString(many).toLowerCase();
        if (many === 'many') many = true;
        else if (many === 'one') many = false;
        else many = Cast.toBoolean(many);
      }
      type = this._asImageType(sus, type);
      const url = this._constructURL(sus, type, many);
      if (!await Scratch.canFetch(url)) return '';
      try {
        const req = await fetch(url, { cache: 'no-cache' });
        if (!req.ok) throw new Error('Request was NOT ok. try again.', req);
        const json = await req.json();
        if (Object.prototype.hasOwnProperty.call(json, 'files')) return JSON.stringify(json.files);
        return json.url ?? '';
      } catch(err) {
        console.error('Failed to fetch.', url, err);
        return '';
      }
    }
    _req2read(req, read) {
      return new Promise((resolve, reject) => {
        req.blob().then((blob) => {
          const fr = new FileReader();
          fr.onloadend = () => resolve(fr.result);
          fr.onerror = reject;
          fr.onabort = reject;
          fr[read](blob);
        }).catch(reject);
      }).catch(err => (console.error('Failed to read response.', err), ''));
    }
    async _fetchImage(sus, type, mode) {
      const url = await this._doFetch(sus, false, type);
      try {
        const req = await fetch(url);
      	if (!req.ok) throw new Error('Request was NOT ok. try again.', req);
      	switch (mode = Cast.toString(mode).toLowerCase()) {
      	  case 'dataurl': return await this._req2read(req, 'readAsDataURL');
          case 'base64': {
            const url = await this._req2read(req, 'readAsDataURL');
            return url.slice(url.indexOf(',') + 1);
          };
          case 'array':
          case 'binary':
          case 'hex':
          case 'uint8array': {
            let array = new Uint8Array(await req.arrayBuffer());
            if (mode == 'uint8array') return array;
            array = await Array.fromAsync(array);
            if (mode == 'array') return JSON.stringify(array);
            if (mode == 'hex') {
              return array.map(b => b.toString(16).padStart(2, '0')).join('');
            }
            return array.map(b => b.toString(2).padStart(8, '0')).join(' ');
          }
          case 'arraybuffer': return await req.arrayBuffer();
          case 'blob': return await req.blob();
    		}
        throw new TypeError('Unknown mode.');
      } catch(err) {
      	console.error('Failed to fetch', url, 'as', mode, err);
      	return '';
    	}
    }
    fetchSus({ many, type }) {
      return this._doFetch(true, many, type);
    }
    fetchSusAsT({ type, mode }) {
      return this._fetchImage(true, type, mode);
    }
    fetchNormal({ many, type }) {
      return this._doFetch(false, many, type);
    }
    fetchNormalAsT({ type, mode }) {
      return this._fetchImage(false, type, mode);
    }
  }
  Scratch.extensions.register(runtime[`cext_${extId}`] = new extension());
})(Scratch);
