/*!
 * Created by 0znzw | v1.0
 * Licensed Under MIT License.
 * DO NOT REMOVE THIS COMMENT
*/
(function(Scratch){
    Scratch.ArgumentType.VERTICAL_SEPARATOR = 'vertical_separator';
    const googMath_Size = new ScratchBlocks.FieldVerticalSeparator().size_.constructor;
    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const bcfi = runtime._buildCustomFieldInfo.bind(runtime);
    const bcftfsb = runtime._buildCustomFieldTypeForScratchBlocks.bind(runtime);
    let fi = null;
    runtime._buildCustomFieldInfo = function(fieldName, fieldInfo, extensionId, categoryInfo) {
      fi = fieldInfo;
      return bcfi(fieldName, fieldInfo, extensionId, categoryInfo);
    }
    runtime._buildCustomFieldTypeForScratchBlocks = function(fieldName, output, outputShape, categoryInfo) {
      let res = bcftfsb(fieldName, output, outputShape, categoryInfo);
      if (fi) {
        if (fi.color1) res.json.colour = fi.color1;
        if (fi.color2) res.json.colourSecondary = fi.color2;
        if (fi.color3) res.json.colourTertiary = fi.color3;
        fi = null;
      }
      return res;
    }
  
    // https://github.com/LilyMakesThings/extensions/blob/Experiments/extensions/Lily/Experiments/ContextMenu.js
    function injectContextMenu() {
      ScratchBlocks.Extensions.registerMixin('0znzwDymJoin', {
        customContextMenu: function(options) {
          options.splice(0, 0, {
            text: 'Add Input',
            enabled: !this.isInFlyout,
            callback: () => {
              modify(this, (info) => {
        const args = info.arguments;
        const argsLength = Scratch.Cast.toString(Object.keys(args).length);
        info.arguments[argsLength] = {
          type: Scratch.ArgumentType.STRING,
          defaultValue: argsLength,
        };
        info.text = `${info.text} [${argsLength}]`;
      });
            }
          });
          options.splice(1, 0, {
            text: 'Removed Input',
            enabled: !this.isInFlyout,
            callback: () => {}
          });
          options.splice(2, 0, {
            text: 'Clear Inputs',
            enabled: !this.isInFlyout,
            callback: () => {}
          });
          options[3].separator = true;
        }
      })
    }
    injectContextMenu();
  
    // https://github.com/LLK/scratch-vm/blob/f405e59d01a8f9c0e3e986fb5276667a8a3c7d40/test/unit/extension_conversion.js#L85-L124
    // https://github.com/LLK/scratch-vm/commit/ceaa3c7857b79459ccd1b14d548528e4511209e7
    vm.addListener('EXTENSION_FIELD_ADDED', fieldInfo => {
       ScratchBlocks.Field.register(fieldInfo.name, fieldInfo.implementation);
    });
    vm.removeListener('EXTENSION_ADDED', injectContextMenu);
    vm.removeListener('BLOCKSINFO_UPDATE', injectContextMenu);
    class ext {
      getInfo() {return{
        id: '0znzwDymJoin',
        name: 'Dynamic Join',
        blocks: [
          {
            hideFromPalette: true,
            opcode: '_Int__thisPass',
            blockType: Scratch.BlockType.COMMAND,
            text: '_Int__thisPass',
          },
          {
            isDynamic: true,
            opcode: 'join',
            blockType: Scratch.BlockType.REPORTER,
            text: '[ADD] [REMOVE] [BTNSEPARATOR] join [0] [1]',
            arguments: {
              ADD: {
                type: 'button',
                defaultValue: '+1',
                color1: '#00FF00',
                textColor: '#FFFFFF',
                func: 'ADD'
              },
              REMOVE: {
                type: 'button',
                defaultValue: '-1',
                color1: '#FF0000',
                textColor: '#FFFFFF',
                func: 'REMOVE'
              },
              BTNSEPARATOR: {
                type: Scratch.ArgumentType.VERTICAL_SEPARATOR//'VerticalSeparator'
              },
              0: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
              1: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
            },
            extensions: ['0znzwDymJoin', 'colours_operators']
          }
        ],
        customFieldTypes: {
          button: {
            output: 'String',
            color1: '#141414',
            outputShape: 3,
            implementation: {
              fromJson: () => new FieldButton()
            }
          },
          VerticalSeperator: {
            //output: null,
            //outputShape: 4,
            implementation: {
              fromJson: () => new VerticalSeperator()
            }
          },
        }
      }}
      _Int__thisPass() {
        return this;
      }
      ADD(FieldThis) {
      }
      REMOVE(FieldThis) {
        //modify(ScratchBlocks, FieldThis.parent.source, true);
      }
      join(args) {
        delete args['ADD'];
        delete args['REMOVE'];
        return Object.values(args).join('');
      }
    }
    class MyField extends ScratchBlocks.Field {
      constructor(opt_value, argtype) {
        super(opt_value);
        this.addArgType(argtype);
        setTimeout(() => this.setup(), 25);
      }
      amend() {
        if (this.ranSetup) return;
        this.target = vm.editingTarget;
        const source = this.sourceBlock_;
        this.blocks = (source.isInFlyout ? runtime.flyoutBlocks : this.target.blocks);
        const workspaceBlock = source.parentBlock_;
        const fieldBlock = this.blocks.getBlock(source.id);
        const spriteBlock = this.blocks.getBlock(workspaceBlock.id);
        const extensionId = source.type.substr(0, source.type.indexOf('_'));
        const blockOpcode = spriteBlock.opcode.substr(spriteBlock.opcode.indexOf('_') + 1, Infinity);
        const class_ = runtime.getOpcodeFunction(extensionId+'__Int__thisPass')();
        const gotInfo = class_.getInfo();
        const currentBlock = gotInfo.blocks.filter(block => block.opcode === blockOpcode)[0];
        this.extension = {
          class_, id: extensionId, blockOpcode, currentBlock, gotInfo
        }
        this.parent = {
          source, workspaceBlock, spriteBlock, fieldBlock
        }
      }
      getCurrentArgument() {
        const parent = this.parent.spriteBlock, field = this.parent.fieldBlock, currentBlock = this.extension.currentBlock;
        const name = Object.values(parent.inputs).filter(argument => argument.shadow === field.id)[0].name;
        const argument = currentBlock.arguments[name];
        argument.name = name;
        return argument;
      }
      fixColors() {
        const source = this.parent.source;
        const defaultColors = {color1: source.colour_, color2: source.colourSecondary_, color3: source.colourTertiary_};
        const path = source.svgPath_, argumentSvg = path.parentNode, textNode = argumentSvg.querySelector('g.blocklyEditableText text');
        const argument = this.argument;
        const color1 = argument.color1 ?? defaultColors.color1, color2 = argument.color2 ?? defaultColors.color2, color3 = argument.color3 ?? defaultColors.color3, textColor = argument.textColor ?? color2;
        source.colour_ = color1;
        source.colourSecondary_ = color2;
        source.colourTertiary_ = color3;
        path.style.fill = color1;
        path.style.stroke = color3;
        textNode.style.fill = textColor;
      }
      setup() {
        this.ranSetup = false;
        this.amend();
        this.argument = this.getCurrentArgument();
        this.fixColors();
        this.ranSetup = true;
      }
    }
    ScratchBlocks.CustomizedField = MyField;
    class FieldButton extends MyField {
      constructor(opt_value) {
        super(opt_value, 'button');
      }
      showEditor_() {
        const fallFn = (()=>{});
        let func = (this.argument.func ?? fallFn);
        if (typeof func === 'string') func = (this.extension.class_[func] ?? fallFn);
        if (typeof func !== 'function') {
          console.warn('Recived invalid function.');
        }
        func(this);
      }
    }
    class VerticalSeperator extends MyField {
      constructor() {
        super(undefined, 'field_vertical_separator');
        this.size_ = new googMath_Size(1, 40);
      }
    }
    // https://github.com/Xeltalliv/extensions/blob/examples/examples/other-default-field-types.js
    const convPHs = runtime._convertPlaceholders.bind(runtime);
    runtime._convertPlaceholders = function(context, match, placeholder) {
      const retVal = convPHs(context, match, placeholder);
      const argInfo = context.blockInfo.arguments[placeholder] || {};
      const argsName = `args${context.outLineNum}`;
      const blockArgs = context.blockJSON[argsName];
      const argJSON = blockArgs[blockArgs.length-1];
      if (argInfo.type === Scratch.ArgumentType.VERTICAL_SEPARATOR) {
        argJSON.type = 'field_vertical_separator';
      }
      return retVal;
    }
    let Blockly = ScratchBlocks;
    function modify(block, change) {
      console.log(block)
      let mutation = block.mutationToDom();
      let bi = JSON.parse(mutation.getAttribute("blockInfo"));
      change(bi);
      mutation.setAttribute("blockInfo", JSON.stringify(bi));
      block.needsBlockInfoUpdate = true;
      for (let input of block.inputList) {
        block.removeInput(input.name, true); // true = disable warnings when missing. names are often the same
      }
      block.appendInput_(1, "yes");
      updateMutation(block, mutation);
      Scratch.vm.runtime.extensionManager.refreshBlocks();
    }
    // Based on https://github.com/LLK/scratch-blocks/blob/develop/core/procedures.js
    function updateMutation(block, mutation) {
      var oldMutationDom = block.mutationToDom();
      var oldMutation = oldMutationDom && Blockly.Xml.domToText(oldMutationDom);
      block.domToMutation(mutation);
      var newMutationDom = block.mutationToDom();
      var newMutation = newMutationDom && Blockly.Xml.domToText(newMutationDom);
      Blockly.Events.fire(
        new Blockly.Events.BlockChange(
          block,
          "mutation",
          null,
          oldMutation,
          newMutation
        )
      );
    }
    Scratch.extensions.register(new ext());
  })(Scratch);