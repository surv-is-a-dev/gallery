/**!
 * More Fields
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.8
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
(function (Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"More Fields" must be ran unsandboxed.`);
  }
  const extId = '0znzwMoreFields';
  const { BlockType, ArgumentType, vm } = Scratch, runtime = vm.runtime;
  const hasOwn = (object, property) => Object.prototype.hasOwnProperty.call(object, property);
  if (hasOwn(runtime, `ext_${extId}`)) {
    // https://github.com/surv-is-a-dev/gallery/blob/main/site-files/extensions/0znzw/NicheToolbox.js
    const MESSAGE = `Palette overload.<br /><small>(MoreFields loaded twice)</small>`;
    const toString = Object.prototype.toString;
    Object.prototype.toString = function() {
      throw new Error(MESSAGE);
    }
    vm.editingTarget = {};
    vm.emitTargetsUpdate();
    setTimeout(function(){
      const err = document.querySelector('p[class^=crash-message_error-message]');
      err.innerHTML = MESSAGE;
      Object.prototype.toString = toString;
    }, 100);
    throw new Error(MESSAGE);
  }
  const DOOMcheck = (vm.runtime.ioDevices.userData._username === 'DOOM1997');
  const searchParams = new URLSearchParams(globalThis.location.search);
  const _hideInlineTextarea = !searchParams.has('MoreFields_InlineTextarea');
  const padding = JSON.parse(localStorage['tw:addons'] || JSON.stringify(globalThis.scratchAddons ? scratchAddons.globalState.addonSettings : {'custom-block-shape': { cornerSize: 100, notchSize: 100, paddingSize: 100 }}))['custom-block-shape'] || { cornerSize: 100, notchSize: 100, paddingSize: 100 };
  const customFieldTypes = {};
  let Blockly = null;
  // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
  const _LDC = function _LightenDarkenColor(col, amt) {
    const num = parseInt(col.replace('#', ''), 16);
    const r = (num >> 16) + amt;
    const b = ((num >> 8) & 0x00FF) + amt;
    const g = (num & 0x0000FF) + amt;
    const newColour = g | (b << 8) | (r << 16);
    return (col.at(0) === '#' ? '#' : '') + newColour.toString(16);
  };
  function _setCssNattr(node, attr, value) {
    node.setAttribute(attr, String(value));
    node.style[attr] = value;
  }
  function _delCssNattr(node, attr) {
    node.removeAttribute(attr);
    delete node.style[attr];
  }
  function _fixColours(doText, col1, textColour) {
    const LDA = -10;
    const self = this.sourceBlock_;
    const parent = self?.parentBlock_;
    if (!parent) return;
    const path = self?.svgPath_;
    const argumentSvg = path?.parentNode;
    const textNode = argumentSvg.querySelector('g.blocklyEditableText text');
    const oldFirstColour = parent.colour_;
    self.colour_ = (col1 ?? _LDC(parent.colour_, LDA));
    self.colourSecondary_ = _LDC(parent.colourSecondary_, LDA);
    self.colourTertiary_ = _LDC(parent.colourTertiary_, LDA);
    self.colourQuaternary_ = _LDC(parent?.colourQuaternary_ ?? oldFirstColour, LDA);
    _setCssNattr(path, 'fill', self.colour_);
    _setCssNattr(path, 'stroke', self.colourTertiary_);
    if (doText && textNode) _setCssNattr(textNode, 'fill', textColour ?? '#FFFFFF');
  }
  function _moveDropdown(toArgument) {
    toArgument ??= false;
    Blockly.DropDownDiv.showPositionedByBlock(this, (toArgument ? this.sourceBlock_ : this.sourceBlock_.parentBlock_));
  }
  const _cbfsb = runtime._convertBlockForScratchBlocks.bind(runtime);
  runtime._convertBlockForScratchBlocks = function(blockInfo, categoryInfo, ...args) {
    const res = _cbfsb(blockInfo, categoryInfo, ...args);
    if (hasOwn(blockInfo, 'blockShape')) res.json.outputShape = blockInfo.blockShape;
    return res;
  };
  // https://github.com/Xeltalliv/extensions/blob/examples/examples/custom-field-types.js
  const bcfi = runtime._buildCustomFieldInfo.bind(runtime);
  const bcftfsb = runtime._buildCustomFieldTypeForScratchBlocks.bind(runtime);
  let fi = null;
  runtime._buildCustomFieldInfo = function(fieldName, fieldInfo, extensionId, categoryInfo, ...args) {
    fi = fieldInfo;
    return bcfi(fieldName, fieldInfo, extensionId, categoryInfo, ...args);
  };
  runtime._buildCustomFieldTypeForScratchBlocks = function(fieldName, output, outputShape, categoryInfo, ...args) {
    const res = bcftfsb(fieldName, output, outputShape, categoryInfo, ...args);
    if (fi) {
      if (fi.color1) res.json.colour = fi.color1;
      if (fi.color2) res.json.colourSecondary = fi.color2;
      if (fi.color3) res.json.colourTertiary = fi.color3;
      if (fi.color4) res.json.colourQuaternary = fi.color4;
      if (hasOwn(fi, 'output')) res.json.output = fi.output;
      fi = null;
    }
    return res;
  };
  const toRegisterOnBlocklyGot = [];
  // https://github.com/LLK/scratch-vm/blob/f405e59d01a8f9c0e3e986fb5276667a8a3c7d40/test/unit/extension_conversion.js#L85-L124
  // https://github.com/LLK/scratch-vm/commit/ceaa3c7857b79459ccd1b14d548528e4511209e7
  vm.addListener('EXTENSION_FIELD_ADDED', (fieldInfo) => {
    if (Blockly) Blockly.Field.register(fieldInfo.name, fieldInfo.implementation);
    else toRegisterOnBlocklyGot.push([fieldInfo.name, fieldInfo.implementation]);
  });
  ArgumentType.TEXTAREA = 'TextareaInput';
  ArgumentType.INLINETEXTAREA = 'TextareaInputInline';
  ArgumentType.SNAPBOOLEAN = 'SnapBoolean';
  ArgumentType.INLINESLIDER = 'SliderInline';
  ArgumentType.HIDDENSTRING = 'StringHidden';
  ArgumentType.INLINEDATE = 'DateInline';
  ArgumentType.FILE = 'FileInput';
  const implementations = {
    FieldTextarea: null,
    FieldInlineTextarea: null,
    FieldSnapBoolean: null,
    FieldInlineSlider: null,
    FieldInlineDate: null,
    FieldFileInput: null,
    FieldInlineDoom: null,
  };
  customFieldTypes[ArgumentType.TEXTAREA] = {
    output: ArgumentType.STRING,
    color1: '#9566d3',
    outputShape: 2,
    implementation: {
      fromJson: () => new implementations.FieldTextarea(),
    },
  };
  customFieldTypes[ArgumentType.INLINETEXTAREA] = {
    output: ArgumentType.STRING,
    color1: '#9566d3',
    outputShape: 3,
    implementation: {
      fromJson: () => new implementations.FieldInlineTextarea(),
    },
  };
  customFieldTypes[ArgumentType.SNAPBOOLEAN] = {
    output: ArgumentType.BOOLEAN,
    color1: '#9566d3',
    outputShape: 1,
    implementation: {
      fromJson: () => new implementations.FieldSnapBoolean(),
    },
  };
  customFieldTypes[ArgumentType.INLINESLIDER] = {
    output: ArgumentType.NUMBER,
    color1: '#9566d3',
    outputShape: 3,
    implementation: {
      fromJson: () => new implementations.FieldInlineSlider(),
    },
  };
  customFieldTypes[ArgumentType.HIDDENSTRING] = {
    output: ArgumentType.STRING,
    color1: '#9566d3',
    outputShape: 2,
    implementation: {
      fromJson: () => new implementations.FieldHiddenTextInput(),
    },
  };
  customFieldTypes[ArgumentType.INLINEDATE] = {
    output: ArgumentType.NUMBER,
    color1: '#9566d3',
    outputShape: 3,
    implementation: {
      fromJson: () => new implementations.FieldInlineDate(),
    },
  };
  customFieldTypes[ArgumentType.FILE] = {
    output: null,
    color1: '#9566d3',
    outputShape: 3,
    implementation: {
      fromJson: () => new implementations.FieldFileInput(),
    },
  };
  customFieldTypes['InlineDoom'] = {
    output: [],
    color1: '#9566d3',
    outputShape: 3,
    implementation: {
      fromJson: () => new implementations.FieldInlineDoom(),
    },
  };
  function gotBlockly(_sb) {
    Blockly = _sb;
    const BlockSvg = Blockly.BlockSvg;
    // Temporary fix for the annoying error:
    // '<text> attribute x: Expected length, "NaN".'
    const _setAttribute = SVGTextElement.prototype.setAttribute;
    SVGTextElement.prototype.setAttribute = function(attr, val, ...args) {
      if (String(val) === 'NaN' && (attr === 'x' || attr === 'y') && this.getAttribute('class') === 'blocklyText') {
        const nattr = `MoreFieldsAttrErr${attr.toUpperCase()}`;
        _setAttribute.call(this, nattr, `Attempted an illegal set on this text node. ${attr.toUpperCase()} was set to NaN.`);
        return _setAttribute.call(this, attr, '0', ...args);
      }
      return _setAttribute.call(this, attr, val, ...args);
    };
    // Patch for a bug in size_.height
    const _endBlockDrag = Blockly.BlockDragger.prototype.endBlockDrag
    Blockly.BlockDragger.prototype.endBlockDrag = function (...a) {
      const res = _endBlockDrag.apply(this, a);
      for (const childBlock of this.draggingBlock_.childBlocks_) {
        const inputList = childBlock.inputList;
        if (inputList.length === 1 && inputList[0].fieldRow.length === 1 && !!inputList[0].fieldRow[0]?.inlineDblRender) childBlock.render();
      }
      return res;
    }
    const textInputs_trueToOriginal = true;
    implementations.FieldTextarea = class FieldTextarea extends Blockly.FieldTextInput {
      constructor(opt_value) {
        opt_value = ArgumentType.TEXTAREA;
        super(opt_value);
        this.addArgType('String');
        this.addArgType(ArgumentType.TEXTAREA);
      }
      showEditor_() {
        Blockly.DropDownDiv.clearContent();
        const div = Blockly.DropDownDiv.getContentDiv();
        const input = document.createElement('textarea');
        input.value = this.getValue();
        div.append(input);
        this._textarea = input;
        input.addEventListener('input', () => this._onInput());
        Blockly.DropDownDiv.setColour(this.sourceBlock_.parentBlock_.getColour(), this.sourceBlock_.parentBlock_.getColourTertiary());
        Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
        _moveDropdown.call(this);
      }
      init(...initArgs) {
        Blockly.Field.prototype.init.call(this, ...initArgs);
        this.sourceBlock_.allowFieldConnection_ = true;
        this.sourceBlock_.isMoreFields_ = true;
        _fixColours.call(this, !textInputs_trueToOriginal, (textInputs_trueToOriginal ? '#FFFFFF' : undefined), '#FFFFFF');
      }
      _onInput() {
        this.setValue(this._textarea.value);
        _moveDropdown.call(this);
      }
    }
    implementations.FieldInlineTextarea = class FieldInlineTextarea extends Blockly.Field {
      constructor(opt_value) {
        opt_value = ArgumentType.INLINETEXTAREA;
        super(opt_value);
        this.addArgType('String');
        this.addArgType(ArgumentType.INLINETEXTAREA);
      }
      updateWidth() {
        if (this._textarea) {
          const width = this._textarea.offsetWidth + 1, height = this._textarea.offsetHeight + 1;
          this._textareaHolder.setAttribute('width', String(width + 3));
          this._textareaHolder.setAttribute('height', String(height + 3));
          this.size_.width = width - BlockSvg.NOTCH_START_PADDING + 2 * BlockSvg.NOTCH_START_PADDING / 3;
          this.size_.height = height + BlockSvg.NOTCH_HEIGHT + 1.5 + BlockSvg.NOTCH_START_PADDING / 3;
        } else {
          this.size_.width = this._FakeWidth || 40;
          this.size_.height = this._FakeHeight || 24;
        }
      }
      dispose() {
        super.dispose();
      }
      init(...initArgs) {
        this.inlineDblRender = true;
        Blockly.Field.prototype.init.call(this, ...initArgs);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (!!this.textNode__ && this.sourceBlock_.parentBlock_) {
          this.textNode__.style.display = 'none';
          _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_);
        }
        this._FakeWidth ??= 40;
        this._FakeHeight ??= 24;
        const textareaHolder = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        textareaHolder.setAttribute('x', '6');
        textareaHolder.setAttribute('y', String(BlockSvg.NOTCH_START_PADDING / 2 - 0.375));
        textareaHolder.addEventListener('mousedown', (e) => e.stopPropagation());
        const textarea = document.createElement('textarea');
        textarea.value = this.getValue() ?? '';
        textarea.addEventListener('input', () => this._onInput());
        textarea.addEventListener('mouseup', () => this._resizeHolder());
        if (this.fieldGroup_) {
          this.fieldGroup_.insertAdjacentElement('afterend', textareaHolder);
          textareaHolder.appendChild(textarea);
          this._textareaHolder = textareaHolder;
          this._textarea = textarea;
          if (this.sourceBlock_ && this.sourceBlock_.isInFlyout) {
            textarea.disabled = true;
            textarea.style.resize = 'none';
          }
          new ResizeObserver(() => this._resizeHolder()).observe(this._textarea);
        }
        this._resizeHolder();
      }
      _resizeHolder() {
        this.updateWidth();
        const ov = this.getValue();
        this.setValue(ov + '~');
        this.setValue(ov);
        this.render_();
      }
      _onInput() {
        this.setValue(this._textarea.value);
      }
      showEditor_() {
      }
    }
    implementations.FieldSnapBoolean = class FieldSnapBoolean extends Blockly.Field {
      constructor(opt_value) {
        opt_value = Number(opt_value);
        super(opt_value);
        this.addArgType('Boolean');
        this.addArgType(ArgumentType.SNAPBOOLEAN);
        this.checkSymbol = String.fromCodePoint('10003');
        this.slap = `${this.checkSymbol}\u00A0\u00A0\u00A0x`;
      }
      // Initial DOM building.
      dispose(...a) {
        Blockly.Field.prototype.dispose.call(this, ...a);
        delete this.sliderCircle_;
      }
      init(...a) {
        Blockly.Field.prototype.init.call(this, ...a);
        const sliderCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        sliderCircle.setAttribute('cx', '0');
        sliderCircle.setAttribute('cy', '0');
        sliderCircle.setAttribute('r', String(Math.min(this.size_.height - 7.5, 10)));
        sliderCircle.setAttribute('fill', 'white');
        this.sliderCircle_ = sliderCircle;
        if (this.fieldGroup_) this.fieldGroup_.insertAdjacentElement('afterend', sliderCircle);
        this.rerender();
      }
      updateCircle_() {
        if (!this.sliderCircle_) return;
        if (this.textElement_) {
          this.sliderCircle_.setAttribute('transform', `translate(${Number(this.textElement_.getAttribute('x')) - 1.5}, ${(Number(this.textElement_.getAttribute('y')) || 24) - 2})`);
        } else {
          this.sliderCircle_.setAttribute('transform', `translate(16, 16`);
        }
      }
      rerender() {
        this.updateCircle_();
        const fg_ = this.fieldGroup_;
        if (!fg_) return;
        const path = fg_?.previousElementSibling;
        if (path?.nodeName !== 'path') return;
        const circle = this.sliderCircle_;
        if (!circle) return;
        if (Number(this.getValue())) {
          path.setAttribute('stroke', '#21DD21');
          path.setAttribute('fill', '#21DD21');
          if (circle) circle.setAttribute('cx', '20');
        } else {
          path.setAttribute('stroke', '#FF3333');
          path.setAttribute('fill', '#FF3333');
          if (circle) circle.setAttribute('cx', '0');
        }
      }
      updateState(value, toggle) {
        let n = Number(value);
        if (toggle) n = Number(!(Number(this.getValue())));
        this.setValue(n);
      }
      showEditor_() {
        this.updateState(0, true);
        this.render_();
      }
      render_() {
        if (this.visible_ && this.textElement_) {
          this.textElement_.textContent = this.slap;
          this.updateWidth();
          let centerTextX = (this.size_.width - this.arrowWidth_) / 2;
          if (this.sourceBlock_.RTL) {
            centerTextX += this.arrowWidth_;
          }
          if (this.sourceBlock_.isShadow() && !this.positionArrow) {
            const minOffset = Blockly.BlockSvg.FIELD_WIDTH / 2;
            if (this.sourceBlock_.RTL) {
              const minCenter = this.size_.width - minOffset;
              centerTextX = Math.min(minCenter, centerTextX);
            } else {
              centerTextX = Math.max(minOffset, centerTextX);
            }
          }
          this.textElement_.setAttribute('x', centerTextX);
        }
        if (this.box_) {
          this.box_.setAttribute('width', this.size_.width);
          this.box_.setAttribute('height', this.size_.height);
        }
        this.rerender();
      }
    }
    implementations.FieldInlineSlider = class FieldInlineSlider extends Blockly.FieldNumber {
      constructor(opt_value) {
        opt_value = ArgumentType.INLINESLIDER;
        super(opt_value);
        this.addArgType('Number');
        this.addArgType(ArgumentType.INLINESLIDER);
      }
      updateWidth() {
        this.size_.width = 139;
      }
      dispose(...a) {
        Blockly.FieldNumber.prototype.dispose.call(this, ...a);
        if (this._slider) this._slider.remove();
        if (this._sliderHolder) this._sliderHolder.remove();
        delete this._slider;
        delete this._sliderHolder;
      }
      init(...initArgs) {
        Blockly.FieldNumber.prototype.init.call(this, ...initArgs);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (this.textNode__) {
          this.textNode__.style.display = 'none';
          if (this.sourceBlock_.parentBlock) _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_);
        }
        if (!String(this.getValue()).includes(',')) this.setValue(`${this.getValue()},${Number(this.getValue())-Number(this.getValue())/2},${Number(this.getValue())+Number(this.getValue())/2}`);
        const vals = this.getValue().split(',');
        const input = document.createElement('input');
        input.type = 'range';
        input.value = Number(vals[0]);
        input.min = Number(vals[1]);
        input.max = Number(vals[2]);
        input.width = 139;
        input.height = 16;
        input.addEventListener('input', () => this._onSliderInput());
        const sliderHolder = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        sliderHolder.setAttribute('x', '16');
        sliderHolder.setAttribute('y', '8');
        sliderHolder.setAttribute('width', '139');
        sliderHolder.setAttribute('height', '16');
        sliderHolder.addEventListener('mousedown', (e) => e.stopPropagation());
        if (this.fieldGroup_) this.fieldGroup_.insertAdjacentElement('afterend', sliderHolder);
        sliderHolder.appendChild(input);
        this._slider = input;
        this._sliderHolder = sliderHolder;
        this.render_();
      }
      _onInput() {
        this._valInput.min = this._minInput.value;
        this._valInput.max = this._maxInput.value;
        this._slider.value = this._valInput.value;
        this._slider.min = this._minInput.value;
        this._slider.max = this._maxInput.value;
        const val = `${this._slider.value},${this._minInput.value},${this._maxInput.value}`;
        this.setValue(val);
      }
      _onSliderInput() {
        if (this._valInput) this._valInput.value = Number(this._slider.value);
        const val = `${this._slider.value},${this._slider.min},${this._slider.max}`;
        this.setValue(val);
      }
      showEditor_() {
        Blockly.DropDownDiv.clearContent();
        const div = Blockly.DropDownDiv.getContentDiv();
        const minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.value = Number(this._slider.min);
        const maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.value = Number(this._slider.max);
        const valInput = document.createElement('input');
        valInput.type = 'number';
        valInput.value = Number(this._slider.value);
        valInput.min = minInput.value;
        valInput.max = maxInput.value;
        div.append(document.createTextNode('Min: '));
        div.append(minInput);
        div.append(document.createElement('br'));
        div.append(document.createTextNode('Value: '));
        div.append(valInput);
        div.append(document.createElement('br'));
        div.append(document.createTextNode('Max: '));
        div.append(maxInput);
        this._minInput = minInput;
        this._maxInput = maxInput;
        this._valInput = valInput;
        minInput.addEventListener('input', () => this._onInput());
        maxInput.addEventListener('input', () => this._onInput());
        valInput.addEventListener('input', () => this._onInput());
        Blockly.DropDownDiv.setColour(this.sourceBlock_.parentBlock_.getColour(), this.sourceBlock_.parentBlock_.getColourTertiary());
        Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
        _moveDropdown.call(this, true);
      }
    }
    implementations.FieldHiddenTextInput = class FieldHiddenTextInput extends Blockly.FieldTextInput {
      constructor(opt_value) {
        opt_value = ArgumentType.HIDDENSTRING;
        super(opt_value);
        this.addArgType('String');
        this.addArgType(ArgumentType.HIDDENSTRING);
      }
      init(...initArgs) {
        Blockly.FieldTextInput.prototype.init.call(this, ...initArgs);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (!!this.textNode__ && this.sourceBlock_.parentBlock_) _fixColours.call(this, true, this.sourceBlock_.parentBlock_.colour_, this.sourceBlock_.parentBlock_.colour_);
      }
      showEditor_(...showArgs) {
        if (this.textNode__) _delCssNattr(this.textNode__, 'fill');
        Blockly.FieldTextInput.prototype.showEditor_.call(this, ...showArgs);
      }
    }
    implementations.FieldInlineDate = class FieldInlineDate extends Blockly.Field {
      constructor(opt_value) {
        opt_value = ArgumentType.INLINEDATE;
        super(opt_value);
        this.addArgType('Number');
        this.addArgType(ArgumentType.INLINEDATE);
      }
      updateWidth() {
        if (this._date) {
          const rect = this._date.getBoundingClientRect();
          this.size_.width = rect.width;
          this.size_.height = rect.height;
          this._dateHolder.setAttribute('width', String(rect.width));
          this._dateHolder.setAttribute('height', String(rect.height * 2));
        } else {
          if (this._dateHolder) {
            this._dateHolder.setAttribute('width', '136');
            this._dateHolder.setAttribute('height', '22');
          }
          this.size_.width = 136;
          this.size_.height = 22;
        }
      }
      dispose(...a) {
        Blockly.FieldNumber.prototype.dispose.call(this, ...a);
        if (this._date) this._date.remove();
        if (this._dateHolder) this._dateHolder.remove();
        delete this._date;
        delete this._dateHolder;
      }
      init(...initArgs) {
        Blockly.FieldNumber.prototype.init.call(this, ...initArgs);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (this.textNode__) {
          this.textNode__.style.display = 'none';
          if (this.sourceBlock_.parentBlock_) _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_);
        }
        const validDateFormat = (/(\d{4}(\-|\/)\d{2}(\-|\/)\d{2})/i.test(this.getValue()));
        if (!validDateFormat) this.setValue('2001-01-01');
        const date = new Date(this._getDate());
        const ts = this._dateFormat(date);
        this.setValue(ts);
        const input = document.createElement('input');
        input.type = 'date';
        this._fixDate(input);
        input.addEventListener('input', () => this._onInput());
        input.addEventListener('change', () => this._onInput());
        const dateHolder = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        dateHolder.setAttribute('x', '8');
        dateHolder.setAttribute('y', '5');
        dateHolder.addEventListener('mousedown', (e) => e.stopPropagation());
        if (this.fieldGroup_) this.fieldGroup_.insertAdjacentElement('afterend', dateHolder);
        dateHolder.appendChild(input);
        this._date = input;
        this._dateHolder = dateHolder;
        this.render_();
      }
      _onInput() {
        this.setValue(this._date.value.toString());
      }
      _getDate() {
        return this.getValue().replaceAll('-', '/');
      }
      _dateFormat(date) {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
      }
      _fixDate(_date) {
        const date = new Date(this._getDate());
        const ts = this._dateFormat(date);
        const msUnix = date.getTime();
        _date.valueAsNumber = msUnix;
        _date.value = ts;
      }
      showEditor_() {
        // TODO: add min and max date along with "step"
      }
    }
    // icons from: https://fonts.google.com/icons
    const _fileIconColour = `style="fill:#FFFFFF;stroke:#FFFFFF;" fill="#FFFFFF" stroke="#FFFFFF"`;
    const settingsIcon = `data:image/svg+xml;base64,${btoa(`<svg ${_fileIconColour} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>`)}`;
    const uploadIcon = `data:image/svg+xml;base64,${btoa(`<svg ${_fileIconColour} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>`)}`;
    implementations.FieldFileInput = class FieldFileInput extends Blockly.Field {
      constructor(opt_value) {
        opt_value = ArgumentType.FILE;
        super(opt_value);
        this.addArgType('String');
        this.addArgType(ArgumentType.FILE);
      }
      updateWidth() {
        this.size_.width = 40;
      }
      dispose(...a) {
        Blockly.FieldTextInput.prototype.dispose.call(this, ...a);
        if (this._settingsButton) this._settingsButton.remove();
        if (this._uploadButton) this._uploadButton.remove();
        delete this._settingsButton;
        delete this._uploadButton;
      }
      init(...initArgs) {
        this._delim = '\n';
        Blockly.FieldTextInput.prototype.init.call(this, ...initArgs);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (this.textNode__) {
          this.textNode__.style.display = 'none';
          if (this.sourceBlock_.parentBlock_) _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_);
        }
        this._fileData = this.getValue() ?? null;
        const fg_ = this.fieldGroup_;
        if (!fg_) return;
        const path = fg_?.previousElementSibling;
        if (path?.nodeName !== 'path') return;
        const settingsButton = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        settingsButton.setAttribute('width', '24');
        settingsButton.setAttribute('height', '24');
        settingsButton.setAttribute('x', '19.5');
        settingsButton.setAttribute('y', '4');
        settingsButton.setAttribute('xlink:href', settingsIcon);
        settingsButton.setAttribute('href', settingsIcon);
        settingsButton.addEventListener('mousedown', (e) => this._onSettingsClick(e));
        this._settingsButton = settingsButton;
        const uploadButton = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        uploadButton.setAttribute('width', '24');
        uploadButton.setAttribute('height', '24');
        uploadButton.setAttribute('x', '-4');
        uploadButton.setAttribute('y', '3.5');
        uploadButton.setAttribute('xlink:href', uploadIcon);
        uploadButton.setAttribute('href', uploadIcon);
        uploadButton.addEventListener('mousedown', (e) => this._onUploadClick(e));
        this._uploadButton = uploadButton;
        fg_.appendChild(settingsButton);
        fg_.appendChild(uploadButton);
        this._saveFileData();
      }
      _loadData(item) {
        const value = this.getValue();
        const cr1 = value.indexOf(this._delim);
        const cr2 = value.indexOf(this._delim, cr1 + 1);
        switch (item) {
          case 1:
            this._fileData = value.substr(cr2 + 1);
            break;
          case 2:
            this._outputOptions.value = value.slice(0, cr1);
            break;
          case 3:
            this._fileLimiter.value = value.slice(cr1 + 1, cr2);
            break;
          default:
            break;
        }
      }
      _saveFileData(skipLoad) {
        if (!(skipLoad ?? false)) this._loadData(1);
        this.showEditor_(true);
        this._onInput(this._fileData);
        Blockly.DropDownDiv.hideWithoutAnimation();
        this._fileData = null;
      }
      _onSettingsClick(e) {
        e.stopPropagation();
        this.showEditor_(true);
      }
      _onUploadClick(e) {
        e.stopPropagation();
        const fileInput = document.createElement('input');
        this.showEditor_(true);
        fileInput.type = 'file';
        fileInput.accept = this._fileLimiter.value.replaceAll(this._delim, '').trim() || '*.*';
        const loadType = this._outputOptions.value;
        Blockly.DropDownDiv.hideWithoutAnimation();
        const fiErr = (c, alr) => {
          c = !c;
          if (c) {
            this._uploadButton.style.display = 'block';
            fileInput.remove();
            alert(alr);
          }
          return c;
        }
        fileInput.addEventListener('change', (event) => {
          this._uploadButton.style.display = 'none';
          const fileList = event.target.files;
          // This wont do anything why :cri:
          let noFileErr = () => false;
          const unfe = () => {
            if (fileList.length < 0) noFileErr = () => fiErr(true, 'No file uploaded?');
            return true;
          };
          globalThis.addEventListener('focus', unfe, {once: true});
          if (unfe() && noFileErr()) return;
          // Ok done crying.
          const reader = new FileReader();
          reader.addEventListener('load', (event) => {
            this._fileData = event.target.result;
            this._saveFileData(true);
            this._uploadButton.style.display = 'block';
            fileInput.remove();
            alert('File uploaded.');
          });
          const file = fileList[0];
          if (fiErr(!!file, 'File is null?!!??')) return;
          switch(loadType) {
            case 'dataURL':
              reader.readAsDataURL(file);
              break;
            case 'text':
              reader.readAsText(file);
              break;
            default:
              if (fiErr(false, 'Invalid output option.')) return;
              break;
          }
        });
        fileInput.click();
      }
      _getFileData() {
        if (this._fileData) return this._fileData;
        this._loadData(1);
        const fileData = this._fileData ?? '';
        this._fileData = null;
        return fileData;
      }
      _onInput(fileData) {
        if (this._fileLimiter.value.trim().length < 1) this._fileLimiter.value = '*.*';
        this.setValue(`${this._outputOptions.value}${this._delim}${this._fileLimiter.value.replaceAll(this._delim, '')}${this._delim}${fileData ?? this._getFileData()}`);
      }
      _optDropdown(selected, ...optValues) {
        optValues = (optValues ?? []).map(opt => `<option value="${opt}"${selected===opt ? 'selected=""' : ''}>${opt}</option>`).join('\n');
        const select = document.createElement('select');
        return { select, optValues };
      }
      showEditor_(forceShow) {
        if (!(forceShow ?? false)) return;
        Blockly.DropDownDiv.clearContent();
        const div = Blockly.DropDownDiv.getContentDiv();
        if (!div) return;
        const outputOptions_temp = this._optDropdown('dataURL', 'dataURL', 'text');
        const outputOptions = outputOptions_temp.select;
        outputOptions.addEventListener('input', () => this._onInput());
        const fileLimiter = document.createElement('input');
        fileLimiter.addEventListener('input', () => this._onInput());
        const clearBtn = document.createElement('button');
        if (this._getFileData().at(0)) {
          clearBtn.addEventListener('click', () => {
            this._fileData = null;
            this._onInput('');
            clearBtn.nextElementSibling.remove();
            clearBtn.remove();
          });
          div.appendChild(clearBtn);
          clearBtn.textContent = 'Clear file.';
          div.appendChild(document.createElement('br'));
        }
        div.appendChild(document.createTextNode('Upload as: '));
        div.appendChild(outputOptions);
        outputOptions.innerHTML = outputOptions_temp.optValues;
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createTextNode('Limit file types: '));
        div.appendChild(fileLimiter);
        div.appendChild(document.createElement('br'));
        this._outputOptions = outputOptions;
        this._fileLimiter = fileLimiter;
        if (this.sourceBlock_.parentBlock) {
          Blockly.DropDownDiv.setColour(this.sourceBlock_.parentBlock_.getColour(), this.sourceBlock_.parentBlock_.getColourTertiary());
          Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
        }
        _moveDropdown.call(this, true);
        this._loadData(2);
        this._loadData(3);
      }
    }
    implementations.FieldInlineDoom = class FieldInlineDoom extends Blockly.Field {
      showEditor_() {}
      constructor(opt_value) {
        opt_value = 'InlineDoom';
        super(opt_value);
        this.addArgType('String');
        this.addArgType('InlineDoom');
      }
      updateWidth() {
        this.size_.width = 650;
        this.size_.height = 410;
      }
      dispose(...a) {
        Blockly.Field.prototype.dispose.call(this, ...a);
        if (this._fObj) this._fObj.remove();
        delete this._fObj;
      }
      init(...initArgs) {
        this.inlineDblRender = true;
        Blockly.Field.prototype.init.call(this, ...initArgs);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (this.textNode__) {
          this.textNode__.style.display = 'none';
          if (this.sourceBlock_.parentBlock_) _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_);
        }
        const fg_ = this.fieldGroup_;
        if (!fg_) return;
        const path = fg_?.previousElementSibling;
        if (path?.nodeName !== 'path') return;
        const fObj = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        fObj.setAttribute('width', '650');
        fObj.setAttribute('height', '410');
        fObj.setAttribute('x', '0');
        fObj.setAttribute('y', '0');
        this._fObj = fObj;
        this.fg_ = fg_;
        if (this.fieldGroup_) this.fieldGroup_.insertAdjacentElement('afterend', fObj);
        this._addDOOM();
      }
      _addDOOM() {
        const frame = document.createElement('iframe');
        frame.width = 640;
        frame.height = 400;
        frame.id = 'DOOM';
        this._fObj.appendChild(frame);
        /**!
          * 
          * ORIGINAL: https://diekmann.github.io/wasm-fizzbuzz/doom/
          * Ported for use in turbowarp blocks
          * 
          */
        frame.srcdoc = atob(`PCEtLSBPUklHSU5BTDogaHR0cHM6Ly9kaWVrbWFubi5naXRodWIuaW8vd2FzbS1maXp6YnV6ei9kb29tLyAtLT48IWRvY3R5cGVodG1sPjxodG1sPjxib2R5PjxET09NPjxzdHlsZT4jb3V0cHV0e2JvcmRlcjozcHggZ3Jvb3ZlICM3ZmZmZDQ7YmFja2dyb3VuZC1jb2xvcjpiaXNxdWU7d2lkdGg6NTUwcHg7aGVpZ2h0OjQwMHB4O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZSxzZXJpZjtmb250LXNpemU6MTBweDtvdmVyZmxvdy15OnNjcm9sbH0jb3V0cHV0IHNwYW4ubG9ne2NvbG9yOiM0ODNkOGJ9I291dHB1dCBzcGFuLnN0ZG91dHtjb2xvcjojMDAwfSNvdXRwdXQgc3Bhbi5zdGRlcnJ7Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOmJyb3dufS5jb250YWluZXJ7ZGlzcGxheTpmbGV4fSp7bWFyZ2luOjBweDtwYWRkaW5nOjBweH08L3N0eWxlPjxzcGFuIGhpZGRlbj48cCBpZD1mb2N1c2hpbnQ+PC9wPjxwPjxidXR0b24gaWQ9ZW50ZXJCdXR0b24+PC9idXR0b24+PGJ1dHRvbiBpZD1sZWZ0QnV0dG9uPjwvYnV0dG9uPjxidXR0b24gaWQ9dXBCdXR0b24+PC9idXR0b24+PGJ1dHRvbiBpZD1kb3duQnV0dG9uPjwvYnV0dG9uPjxidXR0b24gaWQ9cmlnaHRCdXR0b24+PC9idXR0b24+IDxidXR0b24gaWQ9Y3RybEJ1dHRvbj48L2J1dHRvbj48YnV0dG9uIGlkPXNwYWNlQnV0dG9uPjwvYnV0dG9uPiA8YnV0dG9uIGlkPWFsdEJ1dHRvbj48L2J1dHRvbj48L3A+PC9zcGFuPjxkaXYgY2xhc3M9Y29udGFpbmVyPjxjYW52YXMgaGVpZ2h0PTQwMCBpZD1zY3JlZW4gdGFiaW5kZXg9MCB3aWR0aD02NDA+VGhpcyBpcyB3aGVyZSB0aGUgRG9vTSBzY3JlZW4gc2hvdWxkIHJlbmRlci48L2NhbnZhcz48ZGl2IGhpZGRlbiBpZD1vdXRwdXQ+PC9kaXY+PC9kaXY+PHNwYW4gaGlkZGVuPjxzcGFuIGlkPWdldG1zcHNfc3RhdHM+PC9zcGFuPjxzcGFuIGlkPWdldG1zX3N0YXRzPjwvc3Bhbj4gPHNwYW4gaWQ9ZnBzX3N0YXRzPjwvc3Bhbj48c3BhbiBpZD1kcmF3ZnJhbWVzX3N0YXRzPjwvc3Bhbj4gPHNwYW4gaWQ9YW5pbWF0aW9uZnBzX3N0YXRzPjwvc3Bhbj48L3NwYW4+PHNjcmlwdCBkZWZlcj4idXNlIHN0cmljdCI7dmFyIG1lbW9yeT1uZXcgV2ViQXNzZW1ibHkuTWVtb3J5KHtpbml0aWFsOjEwOH0pO2NvbnN0IG91dHB1dD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgib3V0cHV0Iik7ZnVuY3Rpb24gcmVhZFdhc21TdHJpbmcodCxlKXtsZXQgbj1uZXcgVWludDhBcnJheShtZW1vcnkuYnVmZmVyLHQsZSk7cmV0dXJuIG5ldyBUZXh0RGVjb2RlcigidXRmOCIpLmRlY29kZShuKX1mdW5jdGlvbiBjb25zb2xlTG9nU3RyaW5nKHQsZSl7bGV0IG49cmVhZFdhc21TdHJpbmcodCxlKTtjb25zb2xlLmxvZygnIicrbisnIicpfWZ1bmN0aW9uIGFwcGVuZE91dHB1dCh0KXtyZXR1cm4gZnVuY3Rpb24oZSxuKXtsZXQgcz1yZWFkV2FzbVN0cmluZyhlLG4pLnNwbGl0KCJcbiIpO2Zvcih2YXIgYT0wO2E8cy5sZW5ndGg7KythKWlmKDAhPXNbYV0ubGVuZ3RoKXt2YXIgcj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCJzcGFuIik7ci5jbGFzc0xpc3QuYWRkKHQpLHIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc1thXSkpLG91dHB1dC5hcHBlbmRDaGlsZChyKSxvdXRwdXQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiYnIiKSksci5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6InNtb290aCIsYmxvY2s6ImVuZCIsaW5saW5lOiJuZWFyZXN0In0pfX19Y29uc3QgZ2V0bXNwc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZ2V0bXNwc19zdGF0cyIpLGdldG1zX3N0YXRzPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJnZXRtc19zdGF0cyIpO3ZhciBnZXRtc19jYWxsc190b3RhbD0wLGdldG1zX2NhbGxzPTA7ZnVuY3Rpb24gZ2V0TWlsbGlzZWNvbmRzKCl7cmV0dXJuKytnZXRtc19jYWxscyxwZXJmb3JtYW5jZS5ub3coKX13aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtnZXRtc19jYWxsc190b3RhbCs9Z2V0bXNfY2FsbHMsZ2V0bXNwc19zdGF0cy5pbm5lclRleHQ9Z2V0bXNfY2FsbHMvMWUzKyJrIixnZXRtc19zdGF0cy5pbm5lclRleHQ9Z2V0bXNfY2FsbHNfdG90YWwsZ2V0bXNfY2FsbHM9MH0sMWUzKTtjb25zdCBjYW52YXM9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInNjcmVlbiIpLGRvb21fc2NyZWVuX3dpZHRoPTY0MCxkb29tX3NjcmVlbl9oZWlnaHQ9NDAwLGZwc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZnBzX3N0YXRzIiksZHJhd2ZyYW1lc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZHJhd2ZyYW1lc19zdGF0cyIpO3ZhciBudW1iZXJfb2ZfZHJhd3NfdG90YWw9MCxudW1iZXJfb2ZfZHJhd3M9MDtmdW5jdGlvbiBkcmF3Q2FudmFzKHQpe3ZhciBlPW5ldyBVaW50OENsYW1wZWRBcnJheShtZW1vcnkuYnVmZmVyLHQsMTAyNGUzKSxuPW5ldyBJbWFnZURhdGEoZSw2NDAsNDAwKTtjYW52YXMuZ2V0Q29udGV4dCgiMmQiKS5wdXRJbWFnZURhdGEobiwwLDApLCsrbnVtYmVyX29mX2RyYXdzfXdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpe251bWJlcl9vZl9kcmF3c190b3RhbCs9bnVtYmVyX29mX2RyYXdzLGRyYXdmcmFtZXNfc3RhdHMuaW5uZXJUZXh0PW51bWJlcl9vZl9kcmF3c190b3RhbCxmcHNfc3RhdHMuaW5uZXJUZXh0PW51bWJlcl9vZl9kcmF3cyxudW1iZXJfb2ZfZHJhd3M9MH0sMWUzKTt2YXIgaW1wb3J0T2JqZWN0PXtqczp7anNfY29uc29sZV9sb2c6YXBwZW5kT3V0cHV0KCJsb2ciKSxqc19zdGRvdXQ6YXBwZW5kT3V0cHV0KCJzdGRvdXQiKSxqc19zdGRlcnI6YXBwZW5kT3V0cHV0KCJzdGRlcnIiKSxqc19taWxsaXNlY29uZHNfc2luY2Vfc3RhcnQ6Z2V0TWlsbGlzZWNvbmRzLGpzX2RyYXdfc2NyZWVuOmRyYXdDYW52YXN9LGVudjp7bWVtb3J5Om1lbW9yeX19O1dlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKGZldGNoKCJodHRwczovL21peW8ubG9sL2Rvb20ud2FzbSIpLGltcG9ydE9iamVjdCkudGhlbih0PT57dC5pbnN0YW5jZS5leHBvcnRzLm1haW4oKTtsZXQgZT1mdW5jdGlvbih0KXtzd2l0Y2godCl7Y2FzZSA4OnJldHVybiAxMjc7Y2FzZSAxNzpyZXR1cm4gMTU3O2Nhc2UgMTg6cmV0dXJuIDE4NDtjYXNlIDM3OnJldHVybiAxNzI7Y2FzZSAzODpyZXR1cm4gMTczO2Nhc2UgMzk6cmV0dXJuIDE3NDtjYXNlIDQwOnJldHVybiAxNzU7ZGVmYXVsdDppZih0Pj02NSYmdDw9OTApcmV0dXJuIHQrMzI7aWYodD49MTEyJiZ0PD0xMjMpcmV0dXJuIHQrNzU7cmV0dXJuIHR9fSxuPWZ1bmN0aW9uKGUpe3QuaW5zdGFuY2UuZXhwb3J0cy5hZGRfYnJvd3Nlcl9ldmVudCgwLGUpfSxzPWZ1bmN0aW9uKGUpe3QuaW5zdGFuY2UuZXhwb3J0cy5hZGRfYnJvd3Nlcl9ldmVudCgxLGUpfTtjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigia2V5ZG93biIsZnVuY3Rpb24odCl7bihlKHQua2V5Q29kZSkpLHQucHJldmVudERlZmF1bHQoKX0sITEpLGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCJrZXl1cCIsZnVuY3Rpb24odCl7cyhlKHQua2V5Q29kZSkpLHQucHJldmVudERlZmF1bHQoKX0sITEpLFtbImVudGVyQnV0dG9uIiwxM10sWyJsZWZ0QnV0dG9uIiwxNzJdLFsicmlnaHRCdXR0b24iLDE3NF0sWyJ1cEJ1dHRvbiIsMTczXSxbImRvd25CdXR0b24iLDE3NV0sWyJjdHJsQnV0dG9uIiwxNTddLFsic3BhY2VCdXR0b24iLDMyXSxbImFsdEJ1dHRvbiIsMTg0XV0uZm9yRWFjaCgoW3QsZV0pPT57Y29uc29sZS5sb2codCsiIGZvciAiK2UpO3ZhciBhPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHQpO2EuYWRkRXZlbnRMaXN0ZW5lcigidG91Y2hzdGFydCIsKCk9Pm4oZSkpLGEuYWRkRXZlbnRMaXN0ZW5lcigidG91Y2hlbmQiLCgpPT5zKGUpKSxhLmFkZEV2ZW50TGlzdGVuZXIoInRvdWNoY2FuY2VsIiwoKT0+cyhlKSl9KTtsZXQgYT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZm9jdXNoaW50Iikscj1mdW5jdGlvbih0KXthLmlubmVyVGV4dD0iS2V5Ym9hcmQgZXZlbnRzIHdpbGwgYmUgY2FwdHVyZWQgYXMgbG9uZyBhcyB0aGUgdGhlIERPT00gY2FudmFzIGhhcyBmb2N1cy4iLGEuc3R5bGUuZm9udFdlaWdodD0ibm9ybWFsIn07Y2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoImZvY3VzaW4iLHIsITEpLGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCJmb2N1c291dCIsZnVuY3Rpb24odCl7YS5pbm5lclRleHQ9IkNsaWNrIG9uIHRoZSBjYW52YXMgdG8gY2FwdXRlIGlucHV0IGFuZCBzdGFydCBwbGF5aW5nLiIsYS5zdHlsZS5mb250V2VpZ2h0PSJib2xkIn0sITEpLGNhbnZhcy5mb2N1cygpLHIoKTtsZXQgbz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYW5pbWF0aW9uZnBzX3N0YXRzIik7dmFyIHU9MDtmdW5jdGlvbiBjKGUpeysrdSx0Lmluc3RhbmNlLmV4cG9ydHMuZG9vbV9sb29wX3N0ZXAoKSx3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGMpfXdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpe28uaW5uZXJUZXh0PXUsdT0wfSwxZTMpLHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYyl9KTs8L3NjcmlwdD48L0RPT00+PC9ib2R5PjwvaHRtbD4=`);
      }
    }
    gotBlockly._registerFields();
  }
  gotBlockly._on = new Set();
  gotBlockly.when = function(callback) {
    if (Blockly) {
      callback(Blockly);
      return;
    }
    gotBlockly._on.add(() => callback(Blockly));
  };
  gotBlockly._registerFields = function() {
    while (toRegisterOnBlocklyGot.length > 0) {
      const [name, impl] = toRegisterOnBlocklyGot.shift();
      Blockly.Field.register(name, impl);
    }
    gotBlockly._hardRefresh();
  };
  gotBlockly._hardRefresh = function() {
    vm.extensionManager.refreshBlocks();
    const eventsOriginallyEnabled = Blockly.Events.isEnabled(), workspace = Blockly.getMainWorkspace();
    try {
      // https://github.com/TurboWarp/addons/blob/tw/addons/custom-block-shape/update-all-blocks.js
      Blockly.Events.disable();
      if (workspace) {
        if (vm.editingTarget) vm.emitWorkspaceUpdate();
        const flyout = workspace.getFlyout();
        if (flyout) {
          const flyoutWorkspace = flyout.getWorkspace();
          Blockly.Xml.clearWorkspaceAndLoadFromXml(
            Blockly.Xml.workspaceToDom(flyoutWorkspace),
            flyoutWorkspace
          );
          workspace.getToolbox().refreshSelection();
          workspace.toolboxRefreshEnabled_ = true;
        }
      }
    } catch(err) {
      console.error('Error while refreshing toolbox and workspace.', err);
    } finally {
      if (eventsOriginallyEnabled) Blockly.Events.enable();
    }
  }
  gotBlockly._badRefresh = function(ws) {
    ws.resetDragSurface();
    try {
      ws.getFlyout().clearOldBlocks_();
      vm.extensionManager.refreshBlocks();
      ws.refreshToolboxSelection_();
    } catch {/**/}
  };
  if (typeof Scratch?.gui === 'object') Scratch.gui.getBlockly().then((Blockly) => gotBlockly(Blockly));
  const xmlEscape = (unsafe) => unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
  // The MoreFields API
  class extensionAPI {
    static get customFieldTypes() {
      return customFieldTypes;
    }
    static get fieldInfo() {
      return fi;
    }
    static PRIV_extensionField(args, util, blockJSON) {
      return (
        this._registered[blockJSON.fieldInfo.name.toUpperCase()]
      ).getValue(args, util, blockJSON);
    }
    static hideDropdown() {
      if (!Blockly) return;
      if (!Blockly.DropDownDiv.isVisible()) return;
      Blockly.DropDownDiv.clearContent();
      Blockly.DropDownDiv.hide();
    }
    static fixDropdown(self) {
      if (!Blockly) return;
      if (Blockly.DropDownDiv.isVisible()) return;
      if (self.sourceBlock_.parentBlock) {
        Blockly.DropDownDiv.setColour(self.sourceBlock_.parentBlock_.getColour(), self.sourceBlock_.parentBlock_.getColourTertiary());
        Blockly.DropDownDiv.setCategory(self.sourceBlock_.parentBlock_.getCategory());
      }
      _moveDropdown.call(self, true);
    }
    static setPathColour(self, colour) {
      const fg_ = self.fieldGroup_;
      if (!fg_) return;
      const path = fg_?.previousElementSibling;
      if (path?.nodeName !== 'path') return;
      path.setAttribute('stroke', colour);
      path.setAttribute('fill', colour);
    }
    static fixTextNode(self, textColour) {
      if (!self.sourceBlock_) return;
      if (!(self.textNode__ = (
        self.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text')
      ))) return
      _setCssNattr(self.textNode__, 'fill', textColour ?? '#FFFFFF');
    }
    static _registered = Object.create(null);
    static _register = new Set();
    static _patch = new Set();
    constructor() {
      vm.on('CREATE_UNSANDBOXED_EXTENSION_API', (Scratch) => {
        const register = Scratch.extensions.register;
        Scratch.extensions.register = (clss) => {
          if (this.constructor._patch.has(clss.getInfo().id)) {
            clss['extensionField'] = this.constructor.PRIV_extensionField.bind(this.constructor);
          }
          return register(clss);
        };
      });
    }
    static register(newExtId, opts, getValue, getField) {
      const onu = opts.name.toUpperCase();
      if (this._register.has(onu)) {
        throw new Error(`"${opts.name}" already exists.`);
      }
      this._register.add(onu);
      this._patch.add(newExtId);
      ArgumentType[onu] = onu;
      opts.blockType ??= BlockType.REPORTER;
      opts.defaultValue ??= '';
      opts.text ??= '[FIELD]';
      opts.xml ??= '';
      opts.output ??= null;
      opts.outputShape ??= 3;
      opts.color1 ??= '#9566d3';
      opts.color2 ??= opts.color1;
      opts.color3 ??= opts.color1;
      opts.color4 ??= opts.color1;
      implementations[`ceb${onu}`] = null;
      const fi = customFieldTypes[onu] = opts.fi = {
        name: onu,
        output: opts.output,
        color1: opts.color1,
        color2: opts.color2,
        color3: opts.color3,
        color4: opts.color4,
        outputShape: opts.outputShape,
        implementation: {
          fromJson: (...args) => new implementations[`ceb${onu}`](...args),
        },
      };
      this._registered[onu] = {
        getValue,
        getField,
        opts,
        fi,
      };
      gotBlockly.when((Blockly) => {
        Blockly.defineBlocksWithJsonArray([{
          type: `${extId}_${onu}`,
          message0: '%1',
          inputsInline: true,
          output: opts.output,
          colour: opts.color1,
          colourSecondary: opts.color2,
          colourTertiary: opts.color3,
          outputShape: opts.outputShape,
          args0: [{
            name: `field_${extId}_${onu}`,
            type: `field_${extId}_${onu}`,
          }],
        }]);
        const field = getField(Blockly);
        implementations[`ceb${onu}`] = field;
        this._register.delete(onu);
        if (this._register.size === 0) {
          runtime.emit('BLOCKINFO_UPDATE', runtime[`ext_${extId}`].getInfo());
          gotBlockly._registerFields();
          if (globalThis.ReduxStore) { setTimeout(() => {
            const ws = Blockly.getMainWorkspace();
            vm.clearFlyoutBlocks();
            runtime.flyoutBlocks.resetCache();
            ws.updateToolbox(ReduxStore.getState().scratchGui.toolbox.toolboxXML);
            gotBlockly._badRefresh(ws);
            setTimeout(() => gotBlockly._badRefresh(ws), 100);
          }, 250); }
        }
      });
      vm.emit('EXTENSION_FIELD_ADDED', Object.assign(fi, {
        name: `field_${extId}_${onu}`,
      }));
      return [{
        fieldInfo: opts,
        blockType: opts.blockType,
        outputShape: opts.outputShape,
        blockShape: opts.outputShape,
        func: 'extensionField',
        opcode: `ceb${onu}`,
        text: opts.text,
        arguments: {
          FIELD: {
            type: onu,
            defaultValue: opts.defaultValue,
          },
        },
        allowDropAnywhere: (opts.output === null),
        hideFromPalette: true,
      }, {
        blockType: BlockType.XML,
        xml: (`<block type="${newExtId}_ceb${onu}">${
          opts.xml
        }<value name="FIELD"><shadow type="${
          extId
        }_${onu}"><field name="field_${extId}_${onu}">${
          xmlEscape(opts.defaultValue)
        }</field></shadow></value></block>`),
      }];
    }
  }
  class extension extends extensionAPI {
    static exports = {
      hasOwn,
      _LDC,
      _setCssNattr,
      _delCssNattr,
      _fixColours,
      _moveDropdown,
      extensionAPI,
      xmlEscape,
      get padding() { return padding; },
    };
    getInfo() {
      const getInfo = ({
        id: extId,
        name: 'More Fields',
        color1: '#9566d3',
        color2: '#9566d3',
        color3: '#9566d3',
        color4: '#9566d3',
        blocks: [
          {
            hideFromPalette: true,
            opcode: 'multifieldTest',
            blockType: BlockType.REPORTER,
            text: 'file [FILE] snap bool [BOOL] slider [NUM]',
            arguments: {
              FILE: {
                type: ArgumentType.FILE,
                defaultValue: 'dataURL\n*/*\n',
              },
              BOOL: {
                type: ArgumentType.SNAPBOOLEAN,
                defaultValue: 0,
              },
              NUM: {
                type: ArgumentType.INLINESLIDER,
                defaultValue: '10,0,20',
              },
            },
            allowDropAnywhere: true,
            blockShape: 3,
          },
          {
            opcode: 'textarea',
            blockType: BlockType.REPORTER,
            text: 'textarea [TEXT]',
            arguments: {
              TEXT: {
                type: ArgumentType.TEXTAREA,
                defaultValue: ':D',
              },
            },
            allowDropAnywhere: true,
            blockShape: 2,
          },
          {
            // hideFromPalette: hideInlineTextarea,
            opcode: 'textareaInline',
            blockType: BlockType.REPORTER,
            text: 'textarea [TEXT]',
            arguments: {
              TEXT: {
                type: ArgumentType.INLINETEXTAREA,
                defaultValue: ':D',
              },
            },
            allowDropAnywhere: true,
            blockShape: 3,
          },
          {
            // hideFromPalette: hideInlineTextarea,
            blockType: BlockType.XML,
            xml: '<sep gap="46" />',
          },
          {
            opcode: 'snapBool',
            blockType: BlockType.BOOLEAN,
            text: '[BOOL]',
            arguments: {
              BOOL: {
                type: ArgumentType.SNAPBOOLEAN,
                defaultValue: 0,
              },
            },
            allowDropAnywhere: true,
            blockShape: 1,
          },
          {
            opcode: 'sliderInline',
            blockType: BlockType.REPORTER,
            text: 'slider: [NUM]',
            arguments: {
              NUM: {
                type: ArgumentType.INLINESLIDER,
                defaultValue: '10,0,20',
              }
            },
            allowDropAnywhere: true,
            blockShape: 3,
          },
          {
            opcode: 'hiddenString',
            blockType: BlockType.REPORTER,
            text: '"secret" [TEXT]',
            arguments: {
              TEXT: {
                type: ArgumentType.HIDDENSTRING,
                defaultValue: 'oo a secret ;)',
              },
            },
            allowDropAnywhere: true,
            blockShape: 2,
          },
          {
            opcode: 'date',
            blockType: BlockType.REPORTER,
            text: 'date [DATE]',
            arguments: {
              DATE: {
                type: ArgumentType.INLINEDATE,
                defaultValue: '2024-03-14',
              },
            },
            allowDropAnywhere: true,
            blockShape: 3,
          },
          {
            opcode: 'file',
            blockType: BlockType.REPORTER,
            text: 'file [FILE]',
            arguments: {
              FILE: {
                type: ArgumentType.FILE,
                defaultValue: 'dataURL\n*/*\n',
              },
            },
            allowDropAnywhere: true,
            blockShape: 3,
          },
          {
            hideFromPalette: !DOOMcheck,
            opcode: 'DOOM',
            blockType: BlockType.COMMAND,
            text: 'DOOM [_a]',
            arguments: {
              _a: {
                type: 'InlineDoom',
                defaultValue: '',
              },
            },
          },
        ],
        customFieldTypes,
      });
      return getInfo;
    }
    multifieldTest() {}
    textarea(args) {
      return args.TEXT;
    }
    textareaInline(args) {
      return args.TEXT;
    }
    snapBool(args) {
      return Scratch.Cast.toBoolean(args.BOOL);
    }
    sliderInline(args) {
      try {
        return Scratch.Cast.toNumber(args.NUM.split(',')[0]);
      } catch {
        return '';
      }
    }
    hiddenString(args) {
      return args.TEXT;
    }
    date(args) {
      try {
        const date = new Date(Scratch.Cast.toString(args.DATE).replaceAll('-', '/'));
        return (date.getTime());
      } catch {
        return '';
      }
    }
    file(args) {
      args.FILE = Scratch.Cast.toString(args.FILE);
      try {
        const cr1 = args.FILE.indexOf('\n');
        const cr2 = args.FILE.indexOf('\n', cr1 + 1);
        return args.FILE.substr(cr2 + 1);
      } catch {
        return '';
      }
    }
    DOOM() {
      return '';
    }
  }
  const inst = runtime[`ext_${extId}`] = new extension();
  Scratch.extensions.register(inst);
  vm._events['MOREFIELDS_REGISTERED'] = (() => {});
  vm.emit('MOREFIELDS_REGISTERED', inst, extension);
})(Scratch);
