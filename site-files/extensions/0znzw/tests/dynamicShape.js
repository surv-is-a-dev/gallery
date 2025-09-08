/**!
 * Dynamic Shape
 * @author 0znzw <meow@miyo.icu> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function(Scratch) {
  const { BlockType, vm } = Scratch, { runtime } = vm;
  const extId = '0znzwDynmShape';
  if (Scratch.gui) Scratch.gui.getBlockly().then(Blockly => {
    Blockly.Blocks[`${extId}_dynamicShape`] = {
      init: function() {
        this._writeShape = function(shape) {
          this._lastShape = shape;
          switch(shape) {
            case 'stack':
              this.setOutputShape(null);
              this.setOutput(null);
              this.setPreviousStatement(true);
              this.setNextStatement(true);
              break;
            case 'reporter':
              this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
              this.setOutput('String');
              this.setPreviousStatement(false);
              this.setNextStatement(false);
              break;
            case 'boolean':
              this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
              this.setOutput('Boolean');
              this.setPreviousStatement(false);
              this.setNextStatement(false);
              break;
            default:
              console.warn('Unknown shape', shape);
              this.setOutputShape(Blockly.OUTPUT_SHAPE_SQUARE);
              this.setOutput(null);
              this.setPreviousStatement(undefined);
              this.setNextStatement(undefined);
              break;
          }
        };
        this._menuCallback = function(shape) {
          Blockly.Events.setGroup(true);
          const a = Blockly.Xml.domToText(this.sourceBlock_.mutationToDom());
          this.sourceBlock_._writeShape(shape);
          const b = Blockly.Xml.domToText(this.sourceBlock_.mutationToDom());
          Blockly.Events.fire(new Blockly.Events.BlockChange(this.sourceBlock_, 'mutation', null, a, b));
          this.setValue(shape);
          Blockly.Events.setGroup(false);
          return null;
        };
        this.jsonInit({
          type: `${extId}_dynamicShape`,
          message0: 'shape: ',
          args0: [],
          output: null,
        });
        this.appendDummyInput().appendField(
          new ScratchBlocks.FieldDropdown([
            ['stack', 'stack'],
            ['reporter', 'reporter'],
            ['boolean', 'boolean'],
          ], this._menuCallback), 'SHAPE',
        );
        this._writeShape('stack');
      },
      mutationToDom: function() {
        const mutation = document.createElement('mutation');
        mutation.setAttribute('shapeoutput', this._lastShape);
        return mutation;
      },
      domToMutation: function(node) {
        this._writeShape(node.getAttribute('shapeoutput'));
      },
    };
  });
  class extension {
    getInfo() {
      return {
        id: extId,
        name: 'Dynm Shape',
        blocks: [{
          blockType: BlockType.XML,
          xml: `<block type="${extId}_dynamicShape"><field name="SHAPE">stack</field></block>`
        }],
      };
    }
    dynamicShape({ SHAPE }) { alert(SHAPE); return SHAPE; }
  }
  const ext = new extension();
  runtime._primitives[`${extId}_dynamicShape`] = ext.dynamicShape.bind(ext);
  Scratch.extensions.register(runtime[`cext_${extId}`] = ext);
})(Scratch);