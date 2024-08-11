(function() {
  /* eslint-disable */
  /*
  0znzw made an extension in coffeescript
  */
  (function(Scratch) {
    var ArgumentType, BlockType, Cast, Extension;
    ArgumentType = Scratch.ArgumentType;
    BlockType = Scratch.BlockType;
    Cast = Scratch.Cast;
    Extension = class Extension {
      constructor() {
        this.objects = {};
        this.currentObject = '';
        this.currentPath = [];
        this.selected = null;
      }

      getInfo() {
        var res;
        res = {
          id: '0znzwCoffeeScriptObjectExt',
          name: 'Objects (w/ CoffeeScript)',
          blocks: [
            {
              opcode: 'createObject',
              text: 'create object [NAME]',
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'my object'
                }
              },
              blockType: Scratch.BlockType.COMMAND
            },
            {
              opcode: 'createSubObject',
              text: 'create object [NAME] in current object',
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'my sub-object'
                }
              },
              blockType: Scratch.BlockType.COMMAND
            },
            {
              opcode: 'deleteObject',
              text: 'delete object [NAME]',
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'my object'
                }
              },
              blockType: Scratch.BlockType.COMMAND
            },
            {
              opcode: 'useObject',
              text: 'use object [NAME]',
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'my object'
                }
              },
              blockType: Scratch.BlockType.COMMAND
            },
            {
              opcode: 'setPath',
              text: 'set path to [PATH]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: '/my sub-object'
                }
              },
              blockType: Scratch.BlockType.COMMAND
            },
            '---',
            {
              opcode: 'setKey',
              text: 'set [KEY] to [VALUE]',
              arguments: {
                KEY: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'foo'
                },
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'bar'
                }
              },
              blockType: Scratch.BlockType.COMMAND
            },
            {
              opcode: 'getKey',
              text: 'get [KEY]',
              arguments: {
                KEY: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'foo'
                }
              },
              blockType: Scratch.BlockType.REPORTER
            }
          ]
        };
        return res;
      }

      // Internal utilitys
      _updateMainObject() {
        var i, len, object, path, ref;
        object = this.currentObject;
        ref = this.currentPath;
        for (i = 0, len = ref.length; i < len; i++) {
          path = ref[i];
          (function() {
            if (path.trim() !== '') {
              object = object[path];
              return true;
            } else {
              return false;
            }
          })();
        }
        this.selected = object;
        return object;
      }

      // Setup
      createObject({NAME}) {
        NAME = Cast.toString(NAME);
        this.objects[NAME] = new Object;
        return '';
      }

      createSubObject({NAME}) {
        NAME = Cast.toString(NAME);
        this.selected[NAME] = new Object;
        return '';
      }

      deleteObject({NAME}) {
        NAME = Cast.toString(NAME);
        delete this.objects[NAME];
        return '';
      }

      useObject({NAME}) {
        NAME = Cast.toString(NAME);
        if (this.objects[NAME]) {
          this.currentObject = this.objects[NAME];
          this.currentPath = [];
          this.selected = this.currentObject;
        }
        return '';
      }

      setPath({PATH}) {
        PATH = Cast.toString(PATH);
        if (PATH === '' || PATH === '/') {
          this.currentPath = [];
        } else {
          this.currentPath = PATH.split('/');
        }
        this._updateMainObject();
        return '';
      }

      // Actually using the object
      setKey({KEY, VALUE}) {
        KEY = 'key_' + Cast.toString(KEY);
        this.selected[KEY] = VALUE;
        return '';
      }

      getKey({KEY}) {
        KEY = 'key_' + Cast.toString(KEY);
        return this.selected[KEY];
      }

    };
    return Scratch.extensions.register(new Extension);
  })(Scratch);

}).call(this);


//# sourceMappingURL=CrimeAgainstHumanity.js.map
//# sourceURL=coffeescript