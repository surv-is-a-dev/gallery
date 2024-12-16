/**!
 * More Fields (Extend Base)
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"More Fields (Extend Base)" must be ran unsandboxed.`);
  }

  const extId = '0znzwMoreFieldsExtendBase';
  const { ArgumentType, Cast, vm } = Scratch, runtime = vm.runtime;

  if (!vm.extensionManager._loadedExtensions.has('0znzwMoreFields')) {
    throw new Error('You must load more fields first!');
  }
  const moreFields = runtime[`ext_0znzwMoreFields`];
  const moreFieldsAPI = moreFields.constructor;

  const myFieldType = 'myfield';
  const myField = moreFieldsAPI.register(extId, {
    name: myFieldType,
    defaultValue: 'yes',
    color1: '#9566d3',
    output: ArgumentType.STRING,
    outputShape: 3,
  }, (args) => {
    return `You chose: ${Cast.toString(args.FIELD)}`;
  }, (Blockly) => {
    const buttonStyle = `cursor:pointer;width:30px;height:15px;color:white;font-weight:bolder;`;
    const divHTML = `<span style="display:inline-block;">
      <span style="${buttonStyle}background-color:green;" data-sel="yes">Yes</span>
      &nbsp;OR&nbsp;
      <span style="${buttonStyle}background-color:red;" data-sel="no">No</span>
    </span>`;
    return(class MyField extends Blockly.Field {
      constructor(opt_value) {
        opt_value = myFieldType.toUpperCase();
        super(opt_value);
        this.addArgType('String');
        this.addArgType(myFieldType.toUpperCase());
      }
      init(...args) {
        this.inlineDblRender = true;
        Blockly.Field.prototype.init.apply(this, args);
        moreFieldsAPI.fixTextNode(this);
        this.fixColour(this.getValue());
      }
      fixColour(option) {
        if (!this.sourceBlock_) return;
        this.sourceBlock_.setColour(option === 'yes' ? '#21DD21' : '#FF3333');
      }
      chooseOption(option) {
        moreFieldsAPI.hideDropdown();
        this.fixColour(option);
        this.setValue(option);
      }
      showEditor_() {
        Blockly.DropDownDiv.clearContent();
        const div = Blockly.DropDownDiv.getContentDiv();
        if (!div) return;
        div.innerHTML = divHTML;
        div.querySelector('[data-sel="yes"]').onclick = () => this.chooseOption('yes');
        div.querySelector('[data-sel="no"]').onclick = () => this.chooseOption('no');
        moreFieldsAPI.fixDropdown(this);
      }
    });
  });

  class extension {
    getInfo() {
      return {
        id: extId,
        name: 'More Fields (Extend Base)',
        blocks: [...myField],
      }
    }
  }
  
  Scratch.extensions.register(runtime[`ext_${extId}`] = new extension());
})(Scratch);