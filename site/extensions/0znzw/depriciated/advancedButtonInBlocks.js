/*!
 * Created by 0znzw | v1.0
 * Licensed Under MIT License.
 * DO NOT REMOVE THIS COMMENT
*/

// pls dont share, thx <3

// TODO:
//       add individual button color
//       add category button color

(function (Scratch) {
    'use strict';
    const vm = Scratch.vm;
    const runtime = vm.runtime;
  
    // set colors here
  
    const colors = {
      color1: '#565656',
    }
  
    // button functions
  
    /**
     * Legal characters for the unique ID.
     * Should be all on a US keyboard.  No XML special characters or control codes.
     * Removed $ due to issue 251.
     * @private
     */
    const soup_ =
      '!#%()*+,-./:;=?@[]^_`{|}~' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    /**
     * Generate a unique ID, from Blockly.  This should be globally unique.
     * 87 characters ^ 20 length > 128 bits (better than a UUID).
     * @return {string} A globally unique ID string.
     */
    const uid = function () {
      const length = 20;
      const soupLength = soup_.length;
      const id = [];
      for (let i = 0; i < length; i++) {
        id[i] = soup_.charAt(Math.random() * soupLength);
      }
      return id.join('');
    };
    var buttons = {};
  
    function buttonArg(name, func, obj) {
      let defaultValue = name;
      const finalObj = {
        type: 'button',
        defaultValue,
        func: function (...args) {
          this.func(...args);
        }.bind({ func }),
        ...obj,
      };
      finalObj.link = finalObj;
      finalObj.uid = uid();
      defaultValue += `⨗${finalObj.uid}`;
      finalObj.defaultValue = defaultValue;
      buttons[finalObj.uid] = finalObj;
      return finalObj;
    }
  
    class FieldButton extends ScratchBlocks.Field {
      constructor(opt_value) {
        opt_value = 'Button';
        super(opt_value);
        this.addArgType('button');
        this.joiner = '⨗';
        setTimeout(() => {
          const data = this.getData();
          const obj = this.showEditor_(this.joiner);
          if (!obj) return;
          if (obj) this.obj = obj;
          if (obj['buttonColor'] === undefined) obj.buttonColor = '#ffffff';
          if (this['buttonColor'] === undefined) this.buttonColor = obj.buttonColor;
          if (this.text_.includes(this.joiner)) {
            this.text_ = data[0];
            this.btnId = data[1];
          }
          if (this.textElement_) {
            this.textElement_.style.fill = this.buttonColor;
          }
        }, 25)
      }
  
      getData() {
        if (this.text_.includes(this.joiner)) this.defaultValue_ = this.text_;
        let data = this.defaultValue_.split(this.joiner);
        const final = data[data.length - 1];
        data.pop(data.length - 1);
        data = data.join(this.joiner);
        return [data, final];
      }
  
      showEditor_(isReturn) {
        let block;
        console.log(this)
        if (this['btnId'] === undefined) {
          block = this.getData()[1];
        } else block = this.btnId;
        let button = undefined;
        button = buttons[block];
        console.log(block, this)
        if (isReturn===this.joiner && button) return button;
        if (button || this.obj!==undefined && this.obj.func) (button||this.obj).func(button);
      }
    }
  
    Scratch.vm.addListener('EXTENSION_FIELD_ADDED', (fieldInfo) => {
      ScratchBlocks.Field.register(fieldInfo.name, fieldInfo.implementation);
    });
  
    // from: https://github.com/Xeltalliv/extensions/blob/examples/examples/custom-field-types.js
    // Scratch doesn't automatically set input colors
    const bcfi = runtime._buildCustomFieldInfo.bind(runtime);
    const bcftfsb = runtime._buildCustomFieldTypeForScratchBlocks.bind(runtime);
    let fi = null;
    runtime._buildCustomFieldInfo = function (
      fieldName,
      fieldInfo,
      extensionId,
      categoryInfo,
    ) {
      fi = fieldInfo;
      return bcfi(fieldName, fieldInfo, extensionId, categoryInfo);
    };
    runtime._buildCustomFieldTypeForScratchBlocks = function (
      fieldName,
      output,
      outputShape,
      categoryInfo,
    ) {
      let res = bcftfsb(fieldName, output, outputShape, categoryInfo);
      if (fi) {
        if (fi.color1) res.json.colour = fi.color1;
        if (fi.color2) res.json.colourSecondary = fi.color2;
        if (fi.color3) res.json.colourTertiary = fi.color3;
        fi = null;
      }
      return res;
    };
  
    const customFieldTypes = {
      button: {
        output: 'String',
        color1: colors.color1,
        outputShape: 3,
        implementation: {
          fromJson: () => new FieldButton(),
        },
      },
    };
  
    // my functions
  
    function buttonHandler(obj) {
      const funcs = {
        say: function (args) {
          alert(args.say);
        },
      };
      return funcs[obj.bfunc](obj);
    }
  
    class button {
      getInfo() {
        return {
          id: 'lmsButton',
          name: 'Button Test',
          ...colors,
          blocks: [
            {
              opcode: 'buttonBlock',
              blockType: Scratch.BlockType.COMMAND,
              text: 'button [BUTTON] element [RANDOM]',
              arguments: {
                BUTTON: buttonArg('test', buttonHandler, {
                  bfunc: 'say',
                  buttonColor: '#00ff00',
                  say: 'Hello, World.',
                }),
                RANDOM: {
                  type: Scratch.ArgumentType.STRING,
                },
              },
            },
          ],
          customFieldTypes,
        };
      }
  
      buttonBlock() {}
    }
  
    Scratch.extensions.register(new button());
  })(Scratch);
  