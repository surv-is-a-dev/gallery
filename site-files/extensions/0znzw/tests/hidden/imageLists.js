/**!
 * Image lists test
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.1
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Img Lists" must be ran unsandboxed.`);
  }
  // thank you river for the idea <3
  const extId = '0znzwRiverImageListsTest';
  const { vm, Cast, BlockType, ArgumentType } = Scratch, { runtime } = vm;

  class extension {
    getInfo() {
      return {
        id: extId,
        name: 'Img Lists',
        blocks: [{
          opcode: 'isListItemShown',
          text: 'is item [ITEM] in list [LIST] div shown?',
          blockType: BlockType.BOOLEAN,
          arguments: {
            ITEM: { type: ArgumentType.NUMBER, defaultValue: 1 },
            LIST: { type: ArgumentType.STRING, menu: 'lists' },
          },
        }, {
          opcode: 'setImage',
          text: 'set image in item [ITEM] of list [LIST] to [URL] W[W]xH[H]',
          blockType: BlockType.COMMAND,
          arguments: {
            ITEM: { type: ArgumentType.NUMBER, defaultValue: 1 },
            LIST: { type: ArgumentType.STRING, menu: 'lists' },
            URL: { type: ArgumentType.STRING, defaultValue: 'https://extensions.turbowarp.org/dango.png' },
            W: { type: ArgumentType.NUMBER, defaultValue: 24 },
            H: { type: ArgumentType.NUMBER, defaultValue: 24 },
          },
        }, {
          opcode: 'resizeItem',
          text: 'resize item [ITEM] height in list [LIST] to [H]',
          blockType: BlockType.COMMAND,
          arguments: {
            ITEM: { type: ArgumentType.NUMBER, defaultValue: 1 },
            LIST: { type: ArgumentType.STRING, menu: 'lists' },
            H: { type: ArgumentType.NUMBER, defaultValue: 24 },
          },
        }, {
          opcode: 'setHTML',
          text: 'set item [ITEM] HTML in list [LIST] to [HTML]',
          blockType: BlockType.COMMAND,
          arguments: {
            ITEM: { type: ArgumentType.NUMBER, defaultValue: 1 },
            LIST: { type: ArgumentType.STRING, menu: 'lists' },
            HTML: { type: ArgumentType.STRING, defaultValue: '...' },
          },
          hideFromPalette: !(new URLSearchParams(location.search).has('ImgListsShowHTML'))
        }],
        menus: {
          lists: { acceptReporters: true, items: '_getLists' },
        },
      };
    }
    // utils
    static get _stage() {
      return runtime.getTargetForStage();
    }
    static get _sprite() {
      return runtime.getEditingTarget();
    }
    _getLists() {
      let lists = Object.values(extension._stage.variables).flatMap(v => v.type === 'list' ? [{ text: v.name, value: v.id }] : []);
      if (extension._sprite.isStage) return lists[0] ? lists : [{ text: '', value: '' }];
      lists = [...lists, ...(Object.values(extension._sprite.variables).flatMap(v => v.type === 'list' ? [{ text: v.name, value: v.id }] : []))];
      return lists[0] ? lists : [{ text: '', value: '' }];
    }
    _fetchList(n) {
      const s = this._getLists();
      return s.find(l => l.value === n)?.value || s.find(l => l.text === n)?.value;
    }
    _fetchItem(id, n) {
      if (!id || n < 0) return null;
      return document.querySelector(`div[class^="monitor_monitor-container"][data-opcode="data_listcontents"][data-id="${id}"] div[class^="monitor_list-row"] > div[class^="monitor_list-value"][dataindex="${n}"]`);
    }
    // actual blocks
    isListItemShown({ ITEM, LIST }) {
      return !!this._fetchItem(this._fetchList(Cast.toString(LIST)), Cast.toNumber(ITEM) - 1);
    }
    setImage({ ITEM, LIST, URL, W, H }) {
      ITEM = this._fetchItem(this._fetchList(Cast.toString(LIST)), Cast.toNumber(ITEM) - 1);
      if (!ITEM) return false;
      W = Math.max(Cast.toNumber(W), 24), H = Math.max(Cast.toNumber(H), 24);
      let IMAGE = ITEM.querySelector('img');
      if (!IMAGE) {
        ITEM.querySelector('div').innerHTML = '<img />';
        IMAGE = ITEM.querySelector('img');
      }
      IMAGE.width = W;
      IMAGE.height = H;
      IMAGE.src = URL;
    }
    resizeItem({ ITEM, LIST, H }) {
      ITEM = this._fetchItem(this._fetchList(Cast.toString(LIST)), Cast.toNumber(ITEM) - 1);
      if (!ITEM) return false;
      H = Math.max(Cast.toNumber(H), 24) - 24;
      const ROW = ITEM.parentElement.parentElement;
      ROW.style['height'] = `${Number(ROW.style.height.replace('px', '')) + H}px`;
      ROW.style['max-height'] = `${Number(ROW.style.maxHeight.replace('px', '')) + H}px`;
      ROW.style['padding-top'] = `${H}px`;
      ITEM.style['min-height'] = `${H + 24}px`;
    }
    setHTML({ ITEM, LIST, HTML }) {
      ITEM = this._fetchItem(this._fetchList(Cast.toString(LIST)), Cast.toNumber(ITEM) - 1);
      if (!ITEM) return false;
      ITEM.innerHTML = Cast.toString(HTML);
    }
  }
  Scratch.extensions.register(runtime[`ext_${extId}`] = new extension());
})(Scratch);
