/**!
 * Custom Block Shape
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Custom Block Shape" extension needs to be ran unsandboxed.`);
  }

  /**!
   * Custom block shape patch
   * @author 0znzw https://scratch.mit.edu/users/0znzw/
   * @version 2.0
   * @copyright MIT & LGPLv3 License
   * This allows you to add your own custom BlockType/ArgumentType/BlockShape.
   * Do not remove this comment
   */
  function BlockShape(info, Scratch) {
    // Some meta data
    let argName_ = info.name;
    let types_ = info.types ?? [];
    if (!Scratch) throw new Error('Could not find Scratch object.');
    const { vm } = Scratch;
  
    // A SHIT TON of constants
    let argName_L = argName_.toLowerCase();
    let argName_U = argName_.toUpperCase();
    let argName_T = `${argName_U.at(0)}${argName_L.substr(1, Infinity)}`;
    const argId_ = argName_U; argName_ = argName_U;
    info.name = argName_;
    // Just do this because its annoying handlign it all
    argName_L = argName_U, argName_T = argName_U, argName_U = argName_U;
    const OUTPUT_SHAPE_ARGNAME_NUM = argId_;
    const OUTPUT_SHAPE_ARGNAME_STR = `OUTPUT_SHAPE_${argName_U}`;
    const INPUT_SHAPE_ARGNAME_NUM = argId_;
    const INPUT_SHAPE_ARGNAME_STR = `INPUT_SHAPE_${argName_U}`;
    const output_argname_str = `output_${argName_L}`;
    const INPUT_SHAPE_ARGNAME_WIDTH_STR = `INPUT_SHAPE_${argName_U}_WIDTH`;
  
    this.debugInfo = {
      argName_,
      argId_,
      argName_L,
      argName_U,
      argName_T,
      OUTPUT_SHAPE_ARGNAME_STR,
      OUTPUT_SHAPE_ARGNAME_NUM,
      INPUT_SHAPE_ARGNAME_STR,
      INPUT_SHAPE_ARGNAME_NUM,
      output_argname_str,
      INPUT_SHAPE_ARGNAME_WIDTH_STR,
    };
    
    // Blockly patching
    this.patchBlockly = function(Blockly) {
      const paths_ = info.GetPaths(info, Blockly);
      const paddings_ = info.GetPaddings(info, Blockly);
      this.debugInfo.paths_ = paths_;
      this.debugInfo.paddings_ = paddings_;
      const blockPath_L = paths_.leftBlockPath;
      const blockPath_R = paths_.rightBlockPath;
      const argPath_ = paths_.argumentPath(Blockly.BlockSvg.GRID_UNIT);
      types_ = types_ ?? [];
      if (!Array.isArray(types_)) types_ = [];
      types_.push(argName_T);
      Blockly[OUTPUT_SHAPE_ARGNAME_STR] = OUTPUT_SHAPE_ARGNAME_NUM;
      Blockly.Extensions.register(output_argname_str, function () {
        this.setInputsInline(true);
        this.setOutputShape(OUTPUT_SHAPE_ARGNAME_NUM);
        this.setOutput(true, argName_T);
      });
      Blockly.BlockSvg[INPUT_SHAPE_ARGNAME_STR] = argPath_;
  
      const INPUT_SHAPE_ARGNAME_WIDTH_NUM = 12 * Blockly.BlockSvg.GRID_UNIT;
      this.debugInfo.INPUT_SHAPE_ARGNAME_WIDTH_NUM = INPUT_SHAPE_ARGNAME_WIDTH_NUM;
      Blockly.BlockSvg[INPUT_SHAPE_ARGNAME_WIDTH_STR] = INPUT_SHAPE_ARGNAME_WIDTH_NUM;
  
      function updatePadToGu(pad) {
        console.log(pad);
        for (const key of Object.keys(pad)) {
          pad[key] = pad[key] * Blockly.BlockSvg.GRID_UNIT;
        }
        return pad;
      }

      for (const key of Object.keys(Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING)) {
        const padObj = Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[key];
        padObj[argId_.toString()] = paddings_[key];
      }
      Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[argId_.toString()] = updatePadToGu(paddings_[argId_]);
      const computeInputWidth_ = Blockly.BlockSvg.prototype.computeInputWidth_;
      Blockly.BlockSvg.prototype.computeInputWidth_ = function (input) {
        if (input.type == Blockly.INPUT_VALUE && (!input.connection || !input.connection.isConnected())) {
          if (input.connection.getOutputShape() == OUTPUT_SHAPE_ARGNAME_NUM) return INPUT_SHAPE_ARGNAME_WIDTH_NUM;
        }
        return computeInputWidth_.call(this, input);
      };
      const renderClassify_ = Blockly.BlockSvg.prototype.renderClassify_;
      Blockly.BlockSvg.prototype.renderClassify_ = function () {
        const res = renderClassify_.call(this);
        let shapes = this.svgGroup_.getAttribute('data-shapes').split(' ');
        if (this.edgeShape_ == OUTPUT_SHAPE_ARGNAME_NUM) {
          shapes.push(argName_L);
        }
        this.svgGroup_.setAttribute('data-shapes', shapes.join(' '));
        return res;
      };
      const getInputShapeInfo_ = Blockly.BlockSvg.getInputShapeInfo_;
      Blockly.BlockSvg.getInputShapeInfo_ = function (shape) {
        const res = getInputShapeInfo_.call(this, shape);
        if (shape == OUTPUT_SHAPE_ARGNAME_NUM) {
          res.inputShapePath = argPath_;
          res.inputShapeWidth = INPUT_SHAPE_ARGNAME_WIDTH_NUM;
          res.inputShapeArgType = argName_L;
          res.path = argPath_;
          res.width = INPUT_SHAPE_ARGNAME_WIDTH_NUM;
          res.argType = argName_L;
        }
        return res;
      };
      const getOutputShape = Blockly.Connection.prototype.getOutputShape;
      Blockly.Connection.prototype.getOutputShape = function () {
        if (this.check_ && this.check_.indexOf(argName_T) !== -1) {
          return OUTPUT_SHAPE_ARGNAME_NUM;
        }
        return getOutputShape.call(this);
      };
      const renderDraw_ = Blockly.BlockSvg.prototype.renderDraw_;
      Blockly.BlockSvg.prototype.renderDraw_ = function (iconWidth, inputRows) {
        const res = renderDraw_.call(this, iconWidth, inputRows);
        if (this.outputConnection) {
          var shape = this.getOutputShape();
          if (shape !== Blockly.OUTPUT_SHAPE_SQUARE) {
            this.edgeShapeWidth_ = inputRows.bottomEdge / 2;
            this.edgeShape_ = shape;
            this.squareTopLeftCorner_ = true;
          }
        }
        var steps = [];
  
        this.renderDrawTop_(steps, inputRows.rightEdge);
        var cursorY = this.renderDrawRight_(steps, inputRows, iconWidth);
        this.renderDrawBottom_(steps, cursorY);
        this.renderDrawLeft_(steps);
  
        var pathString = steps.join(' ');
        this.svgPath_.setAttribute('d', pathString);
  
        if (this.RTL) {
          this.svgPath_.setAttribute('transform', 'scale(-1 1)');
        }
      };
      const renderDrawLeft_ = Blockly.BlockSvg.prototype.renderDrawLeft_;
      Blockly.BlockSvg.prototype.renderDrawLeft_ = function (steps) {
        renderDrawLeft_.call(this, steps);
        if (this.edgeShape_ == OUTPUT_SHAPE_ARGNAME_NUM) {
          const path = blockPath_L(this.edgeShapeWidth_);
          steps.pop(steps.length - 1);
          steps.push(path);
        }
      };
      const drawEdgeShapeRight_ = Blockly.BlockSvg.prototype.drawEdgeShapeRight_;
      Blockly.BlockSvg.prototype.drawEdgeShapeRight_ = function (steps) {
        drawEdgeShapeRight_.call(this, steps);
        if (this.edgeShape_ && this.edgeShape_ == OUTPUT_SHAPE_ARGNAME_NUM) {
          const path = blockPath_R(this.edgeShapeWidth_);
          steps.push(path);
        }
      };
    }
    this.patchVM = function() {
      // @ts-ignore
      vm.runtime.CustomArgumentTypeMap = vm.runtime.CustomArgumentTypeMap ?? {};
      // @ts-ignore
      vm.runtime.CustomArgumentTypeMap[argName_L] = {
        check: types_,
      };
      // @ts-ignore
      vm.runtime.xmlEscape = function (unsafe) {
        if (typeof unsafe !== 'string') {
          if (Array.isArray(unsafe)) {
            unsafe = String(unsafe);
          } else {
            console.error('Unexpected input recieved in replaceUnsafeChars');
            return unsafe;
          }
        }
        return unsafe.replace(/[<>&'"]/g, (c) => {
          switch (c) {
            case '<':
              return '&lt;';
            case '>':
              return '&gt;';
            case '&':
              return '&amp;';
            case "'":
              return '&apos;';
            case '"':
              return '&quot;';
          }
        });
      };
      // @ts-ignore
      const _convertPlaceholders = vm.runtime._convertPlaceholders;
      // @ts-ignore
      vm.runtime._convertPlaceholders = function (context, match, placeholder) {
        const res = _convertPlaceholders.call(this, context, match, placeholder);
        const argInfo = context.blockInfo.arguments[placeholder] || null;
        const argTypeInfo = this.CustomArgumentTypeMap[argInfo.type] || null;
        if (!argInfo || !argTypeInfo) return res;
        const argsName = `args${context.outLineNum}`;
        const argNum = context.argsMap[placeholder] - 1;
        let FinalArgInfo = context.blockJSON[argsName][argNum];
        FinalArgInfo = { ...FinalArgInfo, ...argTypeInfo };
        context.blockJSON[argsName][argNum] = FinalArgInfo;
        return res;
      }.bind(vm.runtime);
      // @ts-ignore
      const _convertBlockForScratchBlocks = vm.runtime._convertBlockForScratchBlocks;
      // @ts-ignore
      vm.runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo) {
        const res = _convertBlockForScratchBlocks.call(this, blockInfo, categoryInfo);
        if (blockInfo.blockType == argName_T) {
          res.json.output = info.output ?? argName_T;
          res.json.outputShape = OUTPUT_SHAPE_ARGNAME_NUM;
        }
        // @ts-ignore Outdated ES
        if (Object.hasOwn(blockInfo, 'output') || Object.hasOwn(blockInfo, 'forceOutputType')) res.json.output = blockInfo.output ?? blockInfo.forceOutputType;
        // @ts-ignore Outdated ES
        if (Object.hasOwn(blockInfo, 'outputShape') || Object.hasOwn(blockInfo, 'blockShape')) res.json.outputShape = blockInfo.outputShape ?? blockInfo.blockShape;
        return res;
      };
    };
    this.patch = function(addScratchType) {
      this.patchVM();
      if (Scratch.gui) Scratch.gui.getBlockly().then(Blockly => this.patchBlockly(Blockly));
      if (addScratchType) {
        Scratch.BlockType[argName_U] = argName_T;
        Scratch.ArgumentType[argName_U] = argName_T;
      }
    };
  }

  // Example usage.
  let Blockly;
  const ArrowBlock = new BlockShape({
    name: 'arrow',
    GetPaths(info, Blockly) {
      const Paths = {
        argumentPath: function (GRID_UNIT) {
          return ('M ' + 4 * GRID_UNIT + ',0 ' +
    ' h ' + 4 * GRID_UNIT +
    ' l ' + 4 * GRID_UNIT + ',' + 4 * GRID_UNIT +
    ' l ' + -4 * GRID_UNIT + ',' + 4 * GRID_UNIT +
    ' h ' + -4 * GRID_UNIT +
    ' l ' + 2 * GRID_UNIT + ' ' + -4 * GRID_UNIT +
    ' l ' + -2 * GRID_UNIT + ' ' + -4 * GRID_UNIT +
    ' z');
        },
        leftBlockPath: function (edgeShapeWidth_) {
          return ('h ' + -edgeShapeWidth_ +
          ' l ' + edgeShapeWidth_ / 2 + ' ' + -edgeShapeWidth_ +
          ' l ' + -edgeShapeWidth_ / 2 + ' ' + -edgeShapeWidth_ +
          ' h ' + edgeShapeWidth_);
        },
        rightBlockPath: function (edgeShapeWidth_) {
          return ('l ' + edgeShapeWidth_ + ' ' + edgeShapeWidth_ +
          ' l ' + -edgeShapeWidth_ + ' ' + edgeShapeWidth_);
        },
      };
      return Paths;
    },
    GetPaddings(info, Blockly) {
      const padId = info.name;
      const paddings = {
        1: 5, // argName_L in Boolean.
        2: 3, // argName_L in Reporter.
        3: 2, // argName_L in Square.
      };
      paddings[padId] = {
        // Outer shape: argName_L.
        0: 5, // Field in argName_L.
        1: 2, // Hexagon in argName_L.
        2: 5, // Round in argName_L.
        3: 5, // Square in argName_L.
      };
      paddings[padId][padId] = 2; // argName_L in argName_L.
      return paddings;
    },
    // output can be specified here as well
  }, Scratch);
  // Patches the VM and Blockly, and adds (Scratch.BlockType[argName_U] = info.id)
  ArrowBlock.patch(true);
  // @ts-ignore Exposing is bad idc
  window.ArrowBlock = ArrowBlock;

  // An example extension using the shapes
  class extension {
    getInfo() {
      return {
        id: '0znzwCBStest2',
        name: 'Custom Block Shape',
        blocks: [{
          blockType: Scratch.BlockType.REPORTER,
          // @ts-ignore Our patch adds this
          outputShape: Scratch.BlockType.ARROW,
          // @ts-ignore Our patch adds this
          output: Scratch.ArgumentType.ARROW,
          opcode: 'block',
          text: 'Oooh im an arrow!',
        }, {
          blockType: Scratch.BlockType.REPORTER,
          // @ts-ignore Our patch adds this
          outputShape: Scratch.BlockType.ARROW,
          // @ts-ignore Our patch adds this
          output: Scratch.ArgumentType.ARROW,
          opcode: 'arg',
          text: 'argument [val]',
          arguments: {
            // @ts-ignore Our patch adds this
            val: { type: Scratch.ArgumentType.ARROW },
          },
        }, {
          blockType: Scratch.BlockType.REPORTER,
          // @ts-ignore Our patch adds this
          outputShape: Scratch.BlockType.ARROW,
          // @ts-ignore Our patch adds this
          output: Scratch.ArgumentType.ARROW,
          opcode: 'arg_menu',
          text: 'menu [val]',
          arguments: {
            // @ts-ignore Our patch adds this
            val: { menu: 'abc' },
          },
        }, {
          blockType: Scratch.BlockType.REPORTER,
          // @ts-ignore Our patch adds this
          outputShape: Scratch.BlockType.ARROW,
          // @ts-ignore Our patch adds this
          output: Scratch.ArgumentType.ARROW,
          opcode: 'arg_block',
          text: '[val]',
          arguments: {
            // @ts-ignore Our patch adds this
            val: { type: Scratch.ArgumentType.ARROW },
          },
        }, {
          blockType: Scratch.BlockType.REPORTER,
          // @ts-ignore Our patch adds this
          outputShape: Scratch.BlockType.ARROW,
          // @ts-ignore Our patch adds this
          output: Scratch.ArgumentType.ARROW,
          opcode: 'arg_block',
          text: 'argument [val] text',
          arguments: {
            // @ts-ignore Our patch adds this
            val: { type: Scratch.ArgumentType.ARROW },
          },
        }],
        menus: {
          abc: {
            acceptReporters: true, // Used for the shape
            items: ['arrow menu <3'],
            // @ts-ignore Our patch adds this
            output: Scratch.ArgumentType.ARROW,
            // @ts-ignore Our patch adds this
            outputShape: Scratch.BlockType.ARROW,
          }
        }
      }
    }
    block(args) { return 'yep, an arrow >:3' }
    arg(args) { return args.val }
    arg_menu(args) { return args.val }
    arg_block(args) { return args.val }
    arg_block_text(args) { return args.val }
  }
  // Extra patches for menu.shape and menu.output
  const vm = Scratch.vm;
  // @ts-ignore Outdated runtime types
  const _bmfsb = vm.runtime._buildMenuForScratchBlocks;
  // @ts-ignore Outdated runtime types
  vm.runtime._buildMenuForScratchBlocks = function(menuName, menuInfo, categoryInfo) {
    const res = _bmfsb.call(this, menuName, menuInfo, categoryInfo);
    if (menuInfo.output) res.json.output = menuInfo.output;
    if (menuInfo.outputShape) res.json.outputShape = menuInfo.outputShape;
    return res;
  }
  // We dont need a block.output and block.outputShape patch because our BlockShape patch does it automatically
  // @ts-ignore Bad TS support for this ngl
  Scratch.extensions.register(new extension());
})(Scratch);