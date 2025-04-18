/**!
 * File Manager
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function (Scratch) {
  const extId = `0znzwEditorFileManager`;
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"${extId}" must be ran unsandboxed.`);
  }
  const Base64 = function () {
    const window = {};
    // https://github.com/beatgammit/base64-js (MIT)
    // prettier-ignore
    (function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"==typeof window?"undefined"==typeof global?"undefined"==typeof self?this:self:global:window,b.base64js=a()}})(function(){return function(){function b(d,e,g){function a(j,i){if(!e[j]){if(!d[j]){var f="function"==typeof require&&require;if(!i&&f)return f(j,!0);if(h)return h(j,!0);var c=new Error("Cannot find module '"+j+"'");throw c.code="MODULE_NOT_FOUND",c}var k=e[j]={exports:{}};d[j][0].call(k.exports,function(b){var c=d[j][1][b];return a(c||b)},k,k.exports,b,d,e,g)}return e[j].exports}for(var h="function"==typeof require&&require,c=0;c<g.length;c++)a(g[c]);return a}return b}()({"/":[function(a,b,c){'use strict';function d(a){var b=a.length;if(0<b%4)throw new Error("Invalid string. Length must be a multiple of 4");var c=a.indexOf("=");-1===c&&(c=b);var d=c===b?0:4-c%4;return[c,d]}function e(a,b,c){return 3*(b+c)/4-c}function f(a){var b,c,f=d(a),g=f[0],h=f[1],j=new m(e(a,g,h)),k=0,n=0<h?g-4:g;for(c=0;c<n;c+=4)b=l[a.charCodeAt(c)]<<18|l[a.charCodeAt(c+1)]<<12|l[a.charCodeAt(c+2)]<<6|l[a.charCodeAt(c+3)],j[k++]=255&b>>16,j[k++]=255&b>>8,j[k++]=255&b;return 2===h&&(b=l[a.charCodeAt(c)]<<2|l[a.charCodeAt(c+1)]>>4,j[k++]=255&b),1===h&&(b=l[a.charCodeAt(c)]<<10|l[a.charCodeAt(c+1)]<<4|l[a.charCodeAt(c+2)]>>2,j[k++]=255&b>>8,j[k++]=255&b),j}function g(a){return k[63&a>>18]+k[63&a>>12]+k[63&a>>6]+k[63&a]}function h(a,b,c){for(var d,e=[],f=b;f<c;f+=3)d=(16711680&a[f]<<16)+(65280&a[f+1]<<8)+(255&a[f+2]),e.push(g(d));return e.join("")}function j(a){for(var b,c=a.length,d=c%3,e=[],f=16383,g=0,j=c-d;g<j;g+=f)e.push(h(a,g,g+f>j?j:g+f));return 1===d?(b=a[c-1],e.push(k[b>>2]+k[63&b<<4]+"==")):2===d&&(b=(a[c-2]<<8)+a[c-1],e.push(k[b>>10]+k[63&b>>4]+k[63&b<<2]+"=")),e.join("")}c.byteLength=function(a){var b=d(a),c=b[0],e=b[1];return 3*(c+e)/4-e},c.toByteArray=f,c.fromByteArray=j;for(var k=[],l=[],m="undefined"==typeof Uint8Array?Array:Uint8Array,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=0,p=n.length;o<p;++o)k[o]=n[o],l[n.charCodeAt(o)]=o;l[45]=62,l[95]=63},{}]},{},[])("/")});
    return window.base64js;
  }.apply({});
  let storage;
  const { BlockType, ArgumentType, Cast } = Scratch,
    runtime = Scratch.vm.runtime;
  if (!(window.scaffolding && typeof window.scaffolding === 'object'))
    (async () => {
      if (!Scratch.gui) throw new Error(`"${extId}" requires Scratch.gui`);
      // prettier-ignore
      const getScratchClass = (()=>{let t=null;(()=>{if(t)return t;const e=Array.from(document.styleSheets).filter((t=>!(t.ownerNode.textContent.startsWith("/* DO NOT EDIT\n@todo This file is copied from GUI and should be pulled out into a shared library.")&&(t.ownerNode.textContent.includes("input_input-form")||t.ownerNode.textContent.includes("label_input-group_"))))).map((t=>{try{return[...t.cssRules]}catch(t){return[]}})).flat().map((t=>t.selectorText)).filter((t=>t)).map((t=>t.match(/(([\w-]+?)_([\w-]+)_([\w\d-]+))/g))).filter((t=>t)).flat();t=[...new Set(e)];const n=new MutationObserver((e=>{for(const o of e)for(const e of o.addedNodes)if("STYLE"===e.tagName)return t=null,void n.disconnect()}));n.observe(document.head,{childList:!0})})();let e=new Map;return n=>(e.has(n)||e.set(n,t.find((t=>t.includes(n)))),e.get(n))})();
      const awaitElement = (selector, node, timeout, interval) =>
        new Promise((resolve, reject) => {
          node = node || document;
          timeout = timeout || 30_000;
          interval = interval || 100;
          timeout = setTimeout(() => {
            clearInterval(interval);
            clearTimeout(timeout);
            reject();
          }, timeout);
          interval = setInterval(() => {
            const query = node.querySelector(selector);
            if (!query) return;
            clearInterval(interval);
            clearTimeout(timeout);
            resolve(query);
          }, interval);
        });
      function TemporaryWindow(HTML, onMessage, ...attrs) {
        this.windowHref = URL.createObjectURL(new Blob([HTML], { type: 'text/html' }));
        this.onWindowMessage = (ev) => onMessage(this, ev);
        this.window = window.open(this.windowHref, ...attrs);
        window.addEventListener('message', this.onWindowMessage);
        this.window.onclose = () => URL.revokeObjectURL(this.windowHref);
      }
      const buttonData = {
        src: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ljk4MTE2IDFIMTUuMDE5NkMxNi40MDQyIDEgMTcuNjE1OCAyLjIxMTU0IDE3LjYxNTggMy41OTYxNVYxMC44NjU0SDEzLjYzNUMxMS4zODUgMTAuODY1NCA5LjY1NDI0IDEyLjc2OTIgOS42NTQyNCAxNC44NDYyVjE4LjgyNjlINC45ODExNkMzLjU5NjU1IDE4LjgyNjkgMi4zODUwMSAxNy42MTU0IDIuMzg1MDEgMTYuMjMwOFYzLjU5NjE1QzIuMzg1MDEgMi4yMTE1NCAzLjU5NjU1IDEgNC45ODExNiAxWk02LjAxOTYzIDkuODI2OTJIOC43ODg4NkM5LjQ4MTE2IDkuODI2OTIgMTAuMDAwNCA5LjQ4MDc3IDEwLjAwMDQgOC43ODg0NkMxMC4wMDA0IDguMDk2MTUgOS40ODExNiA3Ljc1IDguOTYxOTMgNy43NUg2LjAxOTYzQzUuNTAwMzkgNy43NSA0Ljk4MTE2IDguMjY5MjMgNC45ODExNiA4Ljc4ODQ2QzQuOTgxMTYgOS4zMDc2OSA1LjUwMDM5IDkuODI2OTIgNi4wMTk2MyA5LjgyNjkyWk0xNC4xNTQyIDUuODQ2MTVINi4wMTk2M0M1LjMyNzMyIDUuODQ2MTUgNC45ODExNiA1LjMyNjkyIDQuOTgxMTYgNC44MDc2OUM0Ljk4MTE2IDQuMjg4NDYgNS41MDAzOSAzLjc2OTIzIDYuMDE5NjMgMy43NjkyM0gxNC4xNTQyQzE0LjY3MzUgMy43NjkyMyAxNS4xOTI3IDQuMjg4NDYgMTUuMTkyNyA0LjgwNzY5QzE1LjAxOTYgNS4zMjY5MiAxNC42NzM1IDUuODQ2MTUgMTQuMTU0MiA1Ljg0NjE1Wk0xNy40NDI3IDEyLjI1SDEzLjQ2MTlDMTIuMDc3MyAxMi4yNSAxMC44NjU4IDEzLjQ2MTUgMTAuODY1OCAxNS4wMTkyVjE5TDE3LjQ0MjcgMTIuMjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K`,
        windowHTML: () => {
          return `
<!DOCTYPE html>
<html>
  <head>
    <title>File Manager</title>
  </head>
  <body>
    <main>
      <h2>File Manager</h2>
      <span>DONT REFRESH THIS PAGE!!!</span><br />
      <div id="controls" style="display: none;"></div>
      <div id="files"><pre>(Note if this does not disappear try pressing the "Manage Files" button again!)</pre><br /><span>Loading...</span></div>
    </main>
    <script>(async () => {
      const controlBar = document.querySelector('div#controls');
      const filesNode = document.querySelector('div#files');
      const querys = Object.create(null);
      function postQuery(name, json, callback) {
        json = json || {};
        json.fromManager = true;
        json.queryRequest = name;
        window.opener.postMessage(JSON.stringify(json), '${window.location.href}');
        querys[name] = (queryData) => {
          delete querys[name];
          callback(queryData);
        };
      }
      const postQueryAsync = (name, json) => new Promise(resolve => postQuery(name, json, resolve));
      window.addEventListener('message', (ev) => {
        ev = JSON.parse(ev.data);
        if (querys[ev.queryResponse]) querys[ev.queryResponse](ev);
      });
      const selectFile = () => new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async (ev) => resolve(await Promise.all(Array.from(ev.target.files).map(async (file) => {
          return { data: Array.from(new Uint8Array(await file.arrayBuffer())), name: file.name, mime: file.type };
        })));
        input.click();
      });
      let files = new Set();
      (() => {
        const deleteAll = document.createElement('button');
        deleteAll.textContent = 'Delete All';
        deleteAll.onclick = async () => {
          if (!confirm('Are you sure you want to do this!!!\\nThis MAJOR operation cannot be undone!!!')) return;
          controlBar.style.display = 'none';
          filesNode.innerHTML = 'No files!';
          files = new Set();
          await postQueryAsync('deleteAll');
          controlBar.style.display = 'block';
        };
        const createFile = document.createElement('button');
        createFile.textContent = 'Upload File';
        createFile.onclick = async () => {
          controlBar.style.display = 'none';
          const filesList = await selectFile();
          if (!filesNode.querySelector('div.file')) filesNode.innerHTML = '';
          for (const file of filesList) {
            await postQueryAsync('createFile', file);
            if (files.has(file.name)) file.name += \` \${Math.round(Math.random() * 10_000_000).toString(12)}\`;
            filesNode.appendChild(await createFileNode(file.name));
          }
          controlBar.style.display = 'block';
        };
        controlBar.appendChild(createFile);
        controlBar.appendChild(deleteAll);
      })();
      const createFileNode = async (fileName) => {
        files.add(fileName);
        const fileNode = document.createElement('div');
        fileNode.meta = (await postQueryAsync('getFileMeta', { path: fileName })).meta;
        fileNode.classList.add('file');
        fileNode.dataset.path = fileName;
        const fileButtons = document.createElement('span');
        fileButtons.classList.add('filebuttons');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('filebutton');
        deleteButton.textContent = 'X';
        deleteButton.onclick = () => {
          if (!confirm('Are you sure you want to do this?\\nThis cannot be undone.')) return;
          fileNode.remove();
          files.delete(fileName);
          if (!filesNode.querySelector('div.file')) filesNode.innerHTML = 'No Files!';
          postQueryAsync('deleteFile', { name: fileName });
        };
        fileButtons.appendChild(deleteButton);
        const renameButton = document.createElement('button');
        renameButton.classList.add('filebutton');
        renameButton.textContent = 'rename';
        renameButton.onclick = () => {
          const newName = prompt('New file name:', fileName);
          if (newName === fileName || newName === null) return;
          if (files.has(newName)) return alert('A file with that name already exists!');
          fileNode.querySelector('span.filename > span').textContent = newName;
          files.delete(fileName);
          files.add(newName);
          postQueryAsync('renameFile', { name: fileName, newName });
        };
        fileButtons.appendChild(renameButton);
        fileNode.appendChild(fileButtons);
        fileNode.appendChild(document.createElement('br'));
        const fileNameNode = document.createElement('span');
        const fileNameHolder = document.createElement('span');
        fileNameHolder.classList.add('filename');
        fileNameHolder.appendChild(document.createTextNode('File name: '));
        fileNameNode.textContent = fileName;
        fileNameHolder.appendChild(fileNameNode);
        fileNode.appendChild(fileNameHolder);
        fileNode.appendChild(document.createElement('br'));
        const fileSizeNode = document.createElement('span');
        const fileSizeHolder = document.createElement('span');
        fileSizeHolder.classList.add('filesize');
        fileSizeHolder.appendChild(document.createTextNode('File size: '));
        fileSizeNode.textContent = String(fileNode.meta.size / 1000) + 'KB';
        fileSizeHolder.appendChild(fileSizeNode);
        fileNode.appendChild(fileSizeHolder);
        fileNode.appendChild(document.createElement('br'));
        const fileTypeNode = document.createElement('span');
        const fileTypeHolder = document.createElement('span');
        fileTypeHolder.classList.add('filetype');
        fileTypeHolder.appendChild(document.createTextNode('File type: '));
        fileTypeNode.textContent = fileNode.meta.mime;
        fileTypeHolder.appendChild(fileTypeNode);
        fileNode.appendChild(fileTypeHolder);
        fileNode.appendChild(document.createElement('br'));
        return fileNode;
      };
      const redrawFiles = async (filesList) => {
        controlBar.style.display = 'none';
        filesNode.innerHTML = '';
        const fileNodes = await Promise.all(filesList.map(fileName => {
           if (files.has(fileName)) fileName += \` \${Math.round(Math.random() * 10_000_000).toString(12)}\`;
           return createFileNode(fileName);
        }));
        for (const fileNode of fileNodes) filesNode.appendChild(fileNode);
        if (!(0 in fileNodes)) fileNodes.innerHTML = '<span>No files!</span>';
        controlBar.style.display = 'block';
      };
      redrawFiles((await postQueryAsync('getFileNames')).files);
    })();</script>
  </body>
</html>
        `;
        },
        windowAttrs: [
          (sub, ev) => {
            ev = JSON.parse(ev.data);
            if (!ev.fromManager) return;
            if (ev.queryRequest) {
              switch (ev.queryRequest) {
                case 'getFileNames': {
                  sub.window.postMessage(
                    JSON.stringify({
                      queryResponse: 'getFileNames',
                      files: Object.keys(storage).map(fileName => fileName.replace('file_', '')),
                    }),
                    sub.windowHref,
                  );
                  break;
                };
                case 'getFileMeta': {
                  sub.window.postMessage(
                    JSON.stringify({
                      queryResponse: 'getFileMeta',
                      meta: (storage[ev.path] || { meta: {} }).meta,
                    }),
                    sub.windowHref,
                  );
                  break;
                };
                case 'deleteAll': {
                  for (const key of Object.keys(storage)) delete storage[key.replace('file_', '')];
                  sub.window.postMessage(
                    JSON.stringify({
                      queryResponse: 'deleteAll',
                      status: true,
                    }),
                    sub.windowHref,
                  );
                  runtime.extensionManager.refreshBlocks();
                  break;
                };
                case 'deleteFile': {
                  sub.window.postMessage(
                    JSON.stringify({
                      queryResponse: 'deleteFile',
                      status: delete storage[ev.name],
                    }),
                    sub.windowHref,
                  );
                  runtime.extensionManager.refreshBlocks();
                  break;
                };
                case 'createFile': {
                  storage[ev.name] = { data: Base64.fromByteArray(ev.data), meta: { mime: ev.mime, size: ev.data.length } };
                  sub.window.postMessage(
                    JSON.stringify({
                      queryResponse: 'createFile',
                      status: true,
                    }),
                    sub.windowHref,
                  );
                  runtime.extensionManager.refreshBlocks();
                  break;
                };
                case 'renameFile': {
                  const temp = storage[ev.name];
                  delete storage[ev.name];
                  storage[ev.newName] = temp;
                  sub.window.postMessage(
                    JSON.stringify({
                      queryResponse: 'renameFile',
                      status: true
                    }),
                    sub.windowHref,
                  );
                  runtime.extensionManager.refreshBlocks();
                  break;
                };
              }
            }
          },
          'location=no,height=420,width=360,scrollbars=yes,status=no',
        ],
        onclick: () => (new TemporaryWindow(buttonData.windowHTML(), ...buttonData.windowAttrs)),
      };
      const addButton = () =>
        awaitElement(`div.${getScratchClass('menu-bar_file-group')}`).then((fileBar) => {
          const button = fileBar.querySelector(`div:not(.${getScratchClass('menu-bar_active')}) ~ :not(:has(div.${getScratchClass('menu-bar_menu-bar-menu')}))`).cloneNode(true);
          button.querySelector('span > span').textContent = 'Manage Files';
          button.querySelector('img').src = buttonData.src;
          button.onclick = buttonData.onclick;
          fileBar.appendChild(fileBar.parentElement.querySelector('div[class*=divider_divider][class*=menu-bar_divider]').cloneNode(true));
          fileBar.appendChild(button);
        });
      let oldState = ReduxStore.getState();
      ReduxStore.subscribe(_ => {
        const newState = ReduxStore.getState();
        if (oldState.scratchGui.mode.isPlayerOnly === newState.scratchGui.mode.isPlayerOnly) return;
        oldState = newState;
        addButton();
      })
      await addButton();
    })();
  class extension {
    constructor() {
      this.TextDecoder = new TextDecoder();
      storage = new Proxy(
        (runtime.extensionStorage[extId] = runtime.extensionStorage[extId] || {
          file_test: { data: 'SGkh', meta: { mime: 'text/plain', size: 3 } },
        }),
        {
          set(obj, n, ...args) {
            n = `file_${n}`;
            return Reflect.set(obj, n, ...args);
          },
          get(obj, n, ...args) {
            n = `file_${n}`;
            return Reflect.get(obj, n, ...args);
          },
          deleteProperty(obj, n, ...args) {
            n = `file_${n}`;
            return Reflect.deleteProperty(obj, n, ...args);
          },
        },
      );
    }
    getInfo() {
      return {
        id: extId,
        name: 'Editor Files',
        blocks: [
          {
            blockType: BlockType.BUTTON,
            func: 'README',
            text: 'README :3',
          },
          {
            blockType: BlockType.REPORTER,
            opcode: 'getFile',
            text: 'get file [NAME] as [TYPE]',
            arguments: {
              NAME: { menu: 'files' },
              TYPE: { menu: 'types' },
            },
          },
          {
            blockType: BlockType.REPORTER,
            opcode: 'getAttr',
            text: 'get file [NAME] [ATTR]',
            arguments: {
              NAME: { menu: 'files' },
              ATTR: { menu: 'attrs' },
            },
          },
        ],
        menus: {
          files: {
            acceptReporters: true,
            items: '_getFile',
          },
          types: {
            acceptReporters: true,
            items: '_getType',
          },
          attrs: {
            acceptReporters: true,
            items: '_getAttr',
          },
        },
      };
    }
    _getFile(_, __, name) {
      if (name !== undefined) return storage[name];
      const files = Object.keys(storage).map((file) => file.replace('file_', ''));
      if (!(0 in files)) files.push('');
      return files;
    }
    _getType(_, __, type) {
      const types = ['text', 'dataURL', 'base64', 'arrayBuffer'];
      const typesUpper = ['TEXT', 'DATAURL', 'BASE64', 'ARRAYBUFFER'];
      if (type !== undefined) return (typesUpper.includes(type.toUpperCase()) ? type : 'TEXT').toUpperCase();
      return types;
    }
    _getAttr(_, __, attr) {
      const attrs = ['size', 'mime'];
      const attrsUpper = ['SIZE', 'MIME'];
      if (attr !== undefined) return (attrsUpper.includes(attr.toUpperCase()) ? attr : 'SIZE').toUpperCase();
      return attrs;
    }
    getFile({ NAME, TYPE }) {
      NAME = this._getFile(null, null, Cast.toString(NAME));
      if (!NAME) return '';
      TYPE = this._getType(null, null, Cast.toString(TYPE));
      if (TYPE === 'BASE64') return NAME.data;
      if (TYPE === 'DATAURL') return `data:${NAME.meta.mime};base64,${NAME.data}`;
      const data = Base64.toByteArray(NAME.data);
      switch (TYPE) {
        case 'TEXT':
          return this.TextDecoder.decode(data);
        case 'ARRAYBUFFER':
          return data;
      }
    }
    getAttr({ NAME, ATTR }) {
      NAME = this._getFile(null, null, Cast.toString(NAME));
      if (!NAME) return '';
      ATTR = this._getAttr(null, null, Cast.toString(ATTR));
      return NAME.meta[ATTR.toLowerCase()] ?? '';
    }
    README() {
      alert('Use the "Manage Files" button in the navbar!!');
    }
    static exports = { Base64 };
  }
  Scratch.extensions.register((runtime[`ext_${extId}`] = new extension()));
})(Scratch);
