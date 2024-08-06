(function(Scratch){
'use strict';
const vm = Scratch.vm, runtime = vm.runtime;
    //@ts-expect-error
        Scratch.vm.addListener('EXTENSION_FIELD_ADDED', fieldInfo => {
            //@ts-expect-error
            /*eslint-disable*/ScratchBlocks/*eslint-enable*/.Field.register(fieldInfo.name, fieldInfo.implementation);
        });

        // from: https://github.com/Xeltalliv/extensions/blob/examples/examples/custom-field-types.js
        // Scratch doesn't automatically set input colors
        //@ts-expect-error
        const bcfi = runtime._buildCustomFieldInfo.bind(runtime);
        //@ts-expect-error
        const bcftfsb = runtime._buildCustomFieldTypeForScratchBlocks.bind(runtime);
        let fi = null;
        //@ts-expect-error
        runtime._buildCustomFieldInfo = function(fieldName, fieldInfo, extensionId, categoryInfo) {
            fi = fieldInfo;
            return bcfi(fieldName, fieldInfo, extensionId, categoryInfo);
        };

        //@ts-expect-error
        runtime._buildCustomFieldTypeForScratchBlocks = function(fieldName, output, outputShape, categoryInfo) {
            let res = bcftfsb(fieldName, output, outputShape, categoryInfo);
            if (fi) {
                if (fi.color1) res.json.colour = fi.color1;
                if (fi.color2) res.json.colourSecondary = fi.color2;
                if (fi.color3) res.json.colourTertiary = fi.color3;
                res.json.test = 'Holy shit whats this????'
                fi = null;
            }
            return res;
        };

        var FieldMultilineInput = (function(e) {
            "use strict";
            const Blockly = e;
            var exports = {};
        /**
         * @license
         * Copyright 2023 Google LLC
         * SPDX-License-Identifier: Apache-2.0
         */
        var __extends = (this && this.__extends) || (function () {
            var extendStatics = function (d, b) {
                extendStatics = Object.setPrototypeOf ||
                    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                    function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
                return extendStatics(d, b);
            };
            return function (d, b) {
                if (typeof b !== "function" && b !== null)
                    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() { this.constructor = d; }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        })();
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.FieldMultilineInput = void 0;
        /**
         * @fileoverview Multiline text input field.
         */
        //var Blockly = require("blockly/core");
        /**
         * Class for an editable text area input field.
         */
        var FieldMultilineInput = /** @class */ (function (_super) {
            __extends(FieldMultilineInput, _super);
            /**
             * @param value The initial content of the field.  Should cast to a string.
             *     Defaults to an empty string if null or undefined.  Also accepts
             *     Field.SKIP_SETUP if you wish to skip setup (only used by subclasses
             *     that want to handle configuration and setting the field value after
             *     their own constructors have run).
             * @param validator An optional function that is called to validate any
             *     constraints on what the user entered.  Takes the new text as an
             *     argument and returns either the accepted text, a replacement text, or
             *     null to abort the change.
             * @param config A map of options used to configure the field.
             *     See the [field creation documentation]{@link
             * https://developers.google.com/blockly/guides/create-custom-blocks/fields/built-in-fields/multiline-text-input#creation}
             * for a list of properties this parameter supports.
             */
            function FieldMultilineInput(value, validator, config) {
                var _this = _super.call(this, Blockly.Field.SKIP_SETUP) || this;
                /**
                 * The SVG group element that will contain a text element for each text row
                 *     when initialized.
                 */
                _this.textGroup = null;
                /**
                 * Defines the maximum number of lines of field.
                 * If exceeded, scrolling functionality is enabled.
                 */
                // eslint-disable-next-line @typescript-eslint/naming-convention
                _this.maxLines_ = Infinity;
                /** Whether Y overflow is currently occurring. */
                // eslint-disable-next-line @typescript-eslint/naming-convention
                _this.isOverflowedY_ = false;
                if (value === Blockly.Field.SKIP_SETUP)
                    return _this;
                if (config) {
                    _this.configure_(config);
                }
                _this.setValue(value);
                if (validator) {
                    _this.setValidator(validator);
                }
                return _this;
            }
            FieldMultilineInput.prototype.getSourceBlock = function() {
                return this.sourceBlock_;
            }
            /**
             * Configure the field based on the given map of options.
             *
             * @param config A map of options to configure the field based on.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            FieldMultilineInput.prototype.configure_ = function (config) {
                _super.prototype.configure_.call(this, config);
                if (config.maxLines)
                    this.setMaxLines(config.maxLines);
            };
            /**
             * Serializes this field's value to XML.
             * Should only be called by Blockly.Xml.
             *
             * @param fieldElement The element to populate with info about the field's
             *     state.
             * @returns The element containing info about the field's state.
             */
            FieldMultilineInput.prototype.toXml = function (fieldElement) {
                // Replace '\n' characters with HTML-escaped equivalent '&#10'.  This is
                // needed so the plain-text representation of the XML produced by
                // `Blockly.Xml.domToText` will appear on a single line (this is a
                // limitation of the plain-text format).
                fieldElement.textContent = this.getValue().replace(/\n/g, '&#10;');
                return fieldElement;
            };
            /**
             * Sets the field's value based on the given XML element.  Should only be
             * called by Blockly.Xml.
             *
             * @param fieldElement The element containing info about the field's state.
             */
            FieldMultilineInput.prototype.fromXml = function (fieldElement) {
                this.setValue(fieldElement.textContent.replace(/&#10;/g, '\n'));
            };
            /**
             * Saves this field's value.
             * This function only exists for subclasses of FieldMultilineInput which
             * predate the load/saveState API and only define to/fromXml.
             *
             * @returns The state of this field.
             */
            FieldMultilineInput.prototype.saveState = function () {
                var legacyState = this.saveLegacyState(FieldMultilineInput);
                if (legacyState !== null) {
                    return legacyState;
                }
                return this.getValue();
            };
            /**
             * Sets the field's value based on the given state.
             * This function only exists for subclasses of FieldMultilineInput which
             * predate the load/saveState API and only define to/fromXml.
             *
             * @param state The state of the variable to assign to this variable field.
             */
            FieldMultilineInput.prototype.loadState = function (state) {
                if (this.loadLegacyState(Blockly.Field, state)) {
                    return;
                }
                this.setValue(state);
            };
            /**
             * Create the block UI for this field.
             */
            FieldMultilineInput.prototype.initView = function () {
                this.createBorderRect_();
                this.textGroup = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.G, {
                    class: 'blocklyEditableText',
                }, this.fieldGroup_);
            };
            /**
             * Get the text from this field as displayed on screen.  May differ from
             * getText due to ellipsis, and other formatting.
             *
             * @returns Currently displayed text.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            FieldMultilineInput.prototype.getDisplayText_ = function () {
                var block = this.getSourceBlock();
                if (!block) {
                    throw new Error('The field has not yet been attached to its input. ' +
                        'Call appendField to attach it.');
                }
                var textLines = this.getText();
                if (!textLines) {
                    // Prevent the field from disappearing if empty.
                    return Blockly.Field.NBSP;
                }
                var lines = textLines.split('\n');
                textLines = '';
                var displayLinesNumber = this.isOverflowedY_
                    ? this.maxLines_
                    : lines.length;
                for (var i = 0; i < displayLinesNumber; i++) {
                    var text = lines[i];
                    if (text.length > this.maxDisplayLength) {
                        // Truncate displayed string and add an ellipsis ('...').
                        text = text.substring(0, this.maxDisplayLength - 4) + '...';
                    }
                    else if (this.isOverflowedY_ && i === displayLinesNumber - 1) {
                        text = text.substring(0, text.length - 3) + '...';
                    }
                    // Replace whitespace with non-breaking spaces so the text doesn't
                    // collapse.
                    text = text.replace(/\s/g, Blockly.Field.NBSP);
                    textLines += text;
                    if (i !== displayLinesNumber - 1) {
                        textLines += '\n';
                    }
                }
                if (block.RTL) {
                    // The SVG is LTR, force value to be RTL.
                    textLines += '\u200F';
                }
                return textLines;
            };
            /**
             * Called by setValue if the text input is valid.  Updates the value of the
             * field, and updates the text of the field if it is not currently being
             * edited (i.e. handled by the htmlInput_).  Is being redefined here to update
             * overflow state of the field.
             *
             * @param newValue The value to be saved.  The default validator guarantees
             *     that this is a string.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            FieldMultilineInput.prototype.doValueUpdate_ = function (newValue) {
                _super.prototype.doValueUpdate_.call(this, newValue);
                if (this.value_ !== null) {
                    this.isOverflowedY_ = this.value_.split('\n').length > this.maxLines_;
                }
            };
            /** Updates the text of the textElement. */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            FieldMultilineInput.prototype.render_ = function () {
                console.log(this);
                var block = this.getSourceBlock();
                if (!block) {
                    throw new Error('The field has not yet been attached to its input. ' +
                        'Call appendField to attach it.');
                }
                // Remove all text group children.
                var currentChild;
                var textGroup = this.textGroup;
                while ((currentChild = textGroup.firstChild)) {
                    textGroup.removeChild(currentChild);
                }
                var constants = this.getConstants();
                // This can't happen, but TypeScript thinks it can and lint forbids `!.`.
                if (!constants)
                    throw Error('Constants not found');
                // Add in text elements into the group.
                var lines = this.getDisplayText_().split('\n');
                var y = 0;
                for (var i = 0; i < lines.length; i++) {
                    var lineHeight = constants.FIELD_TEXT_HEIGHT + constants.FIELD_BORDER_RECT_Y_PADDING;
                    var span = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.TEXT, {
                        class: 'blocklyText blocklyMultilineText',
                        x: constants.FIELD_BORDER_RECT_X_PADDING,
                        y: y + constants.FIELD_BORDER_RECT_Y_PADDING,
                        dy: constants.FIELD_TEXT_BASELINE,
                    }, textGroup);
                    span.appendChild(document.createTextNode(lines[i]));
                    y += lineHeight;
                }
                if (this.isBeingEdited_) {
                    var htmlInput = this.htmlInput_;
                    if (this.isOverflowedY_) {
                        Blockly.utils.dom.addClass(htmlInput, 'blocklyHtmlTextAreaInputOverflowedY');
                    }
                    else {
                        Blockly.utils.dom.removeClass(htmlInput, 'blocklyHtmlTextAreaInputOverflowedY');
                    }
                }
                this.updateSize_();
                if (this.isBeingEdited_) {
                    if (block.RTL) {
                        // in RTL, we need to let the browser reflow before resizing
                        // in order to get the correct bounding box of the borderRect
                        // avoiding issue #2777.
                        setTimeout(this.resizeEditor_.bind(this), 0);
                    }
                    else {
                        this.resizeEditor_();
                    }
                    var htmlInput = this.htmlInput_;
                    if (!this.isTextValid_) {
                        Blockly.utils.dom.addClass(htmlInput, 'blocklyInvalidInput');
                        Blockly.utils.aria.setState(htmlInput, Blockly.utils.aria.State.INVALID, true);
                    }
                    else {
                        Blockly.utils.dom.removeClass(htmlInput, 'blocklyInvalidInput');
                        Blockly.utils.aria.setState(htmlInput, Blockly.utils.aria.State.INVALID, false);
                    }
                }
            };
            /** Updates the size of the field based on the text. */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            FieldMultilineInput.prototype.updateSize_ = function () {
                var constants = this.getConstants();
                // This can't happen, but TypeScript thinks it can and lint forbids `!.`.
                if (!constants)
                    throw Error('Constants not found');
                var nodes = this.textGroup.childNodes;
                var fontSize = constants.FIELD_TEXT_FONTSIZE;
                var fontWeight = constants.FIELD_TEXT_FONTWEIGHT;
                var fontFamily = constants.FIELD_TEXT_FONTFAMILY;
                var totalWidth = 0;
                var totalHeight = 0;
                for (var i = 0; i < nodes.length; i++) {
                    var tspan = nodes[i];
                    var textWidth = Blockly.utils.dom.getFastTextWidth(tspan, fontSize, fontWeight, fontFamily);
                    if (textWidth > totalWidth) {
                        totalWidth = textWidth;
                    }
                    totalHeight +=
                        constants.FIELD_TEXT_HEIGHT +
                            (i > 0 ? constants.FIELD_BORDER_RECT_Y_PADDING : 0);
                }
                if (this.isBeingEdited_) {
                    // The default width is based on the longest line in the display text,
                    // but when it's being edited, width should be calculated based on the
                    // absolute longest line, even if it would be truncated after editing.
                    // Otherwise we would get wrong editor width when there are more
                    // lines than this.maxLines_.
                    var actualEditorLines = String(this.value_).split('\n');
                    var dummyTextElement = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.TEXT, { class: 'blocklyText blocklyMultilineText' });
                    for (var i = 0; i < actualEditorLines.length; i++) {
                        if (actualEditorLines[i].length > this.maxDisplayLength) {
                            actualEditorLines[i] = actualEditorLines[i].substring(0, this.maxDisplayLength);
                        }
                        dummyTextElement.textContent = actualEditorLines[i];
                        var lineWidth = Blockly.utils.dom.getFastTextWidth(dummyTextElement, fontSize, fontWeight, fontFamily);
                        if (lineWidth > totalWidth) {
                            totalWidth = lineWidth;
                        }
                    }
                    var htmlInput = this.htmlInput_;
                    var scrollbarWidth = htmlInput.offsetWidth - htmlInput.clientWidth;
                    totalWidth += scrollbarWidth;
                }
                if (this.borderRect_) {
                    totalHeight += constants.FIELD_BORDER_RECT_Y_PADDING * 2;
                    totalWidth += constants.FIELD_BORDER_RECT_X_PADDING * 2;
                    this.borderRect_.setAttribute('width', "".concat(totalWidth));
                    this.borderRect_.setAttribute('height', "".concat(totalHeight));
                }
                this.size_.width = totalWidth;
                this.size_.height = totalHeight;
                this.positionBorderRect_();
            };
            /**
             * Show the inline free-text editor on top of the text.
             * Overrides the default behaviour to force rerender in order to
             * correct block size, based on editor text.
             *
             * @param e Optional mouse event that triggered the field to open, or
             *     undefined if triggered programmatically.
             * @param quietInput True if editor should be created without focus.
             *     Defaults to false.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            FieldMultilineInput.prototype.showEditor_ = function (e, quietInput) {
                _super.prototype.showEditor_.call(this, e, quietInput);
                this.forceRerender();
            };
            /**
             * Create the text input editor widget.
             *
             * @returns The newly created text input editor.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            FieldMultilineInput.prototype.widgetCreate_ = function () {
                var div = Blockly.WidgetDiv.getDiv();
                var scale = this.workspace_.getScale();
                var constants = this.getConstants();
                // This can't happen, but TypeScript thinks it can and lint forbids `!.`.
                if (!constants)
                    throw Error('Constants not found');
                var htmlInput = document.createElement('textarea');
                htmlInput.className = 'blocklyHtmlInput blocklyHtmlTextAreaInput';
                htmlInput.setAttribute('spellcheck', String(this.spellcheck_));
                var fontSize = constants.FIELD_TEXT_FONTSIZE * scale + 'pt';
                div.style.fontSize = fontSize;
                htmlInput.style.fontSize = fontSize;
                var borderRadius = Blockly.FieldTextInput.BORDERRADIUS * scale + 'px';
                htmlInput.style.borderRadius = borderRadius;
                var paddingX = constants.FIELD_BORDER_RECT_X_PADDING * scale;
                var paddingY = (constants.FIELD_BORDER_RECT_Y_PADDING * scale) / 2;
                htmlInput.style.padding =
                    paddingY + 'px ' + paddingX + 'px ' + paddingY + 'px ' + paddingX + 'px';
                var lineHeight = constants.FIELD_TEXT_HEIGHT + constants.FIELD_BORDER_RECT_Y_PADDING;
                htmlInput.style.lineHeight = lineHeight * scale + 'px';
                div.appendChild(htmlInput);
                htmlInput.value = htmlInput.defaultValue = this.getEditorText_(this.value_);
                htmlInput.setAttribute('data-untyped-default-value', String(this.value_));
                htmlInput.setAttribute('data-old-value', '');
                if (Blockly.utils.userAgent.GECKO) {
                    // In FF, ensure the browser reflows before resizing to avoid issue #2777.
                    setTimeout(this.resizeEditor_.bind(this), 0);
                }
                else {
                    this.resizeEditor_();
                }
                this.bindInputEvents_(htmlInput);
                return htmlInput;
            };
            /**
             * Sets the maxLines config for this field.
             *
             * @param maxLines Defines the maximum number of lines allowed, before
             *     scrolling functionality is enabled.
             */
            FieldMultilineInput.prototype.setMaxLines = function (maxLines) {
                if (typeof maxLines === 'number' &&
                    maxLines > 0 &&
                    maxLines !== this.maxLines_) {
                    this.maxLines_ = maxLines;
                    this.forceRerender();
                }
            };
            /**
             * Returns the maxLines config of this field.
             *
             * @returns The maxLines config value.
             */
            FieldMultilineInput.prototype.getMaxLines = function () {
                return this.maxLines_;
            };
            /**
             * Handle key down to the editor.  Override the text input definition of this
             * so as to not close the editor when enter is typed in.
             *
             * @param e Keyboard event.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            FieldMultilineInput.prototype.onHtmlInputKeyDown_ = function (e) {
                if (e.key !== 'Enter') {
                    _super.prototype.onHtmlInputKeyDown_.call(this, e);
                }
            };
            /**
             * Construct a FieldMultilineInput from a JSON arg object,
             * dereferencing any string table references.
             *
             * @param options A JSON object with options (text, and spellcheck).
             * @returns The new field instance.
             * @nocollapse
             */
            FieldMultilineInput.fromJson = function (options) {
                var text = Blockly.utils.parsing.replaceMessageReferences(options.text);
                // `this` might be a subclass of FieldMultilineInput if that class doesn't
                // override the static fromJson method.
                return new this(text, undefined, options);
            };
            return FieldMultilineInput;
        }(Blockly.FieldTextInput));
        exports.FieldMultilineInput = FieldMultilineInput;
        /**
         * CSS for multiline field.
         */
            ScratchBlocks.Css.styleSheet_.addRule('.blocklyHtmlTextAreaInput', 'font-family: monospace;\n  resize: none;\n  overflow: hidden;\n  height: 100%;\n  text-align: left;');
            ScratchBlocks.Css.styleSheet_.addRule('.blocklyHtmlTextAreaInputOverflowedY', 'overflow-y: scroll;');
        return exports.FieldMultilineInput;
        })(ScratchBlocks);

        
    class TESTbuttonInBlocks {
        getInfo() {
            return {
                id: '0znzwButtonInBlocksTEST',
                name: 'BUTTON IN BLOCKS TEST',
                
                customFieldTypes: {//KEEP THIS OBJECT IT IS USED TO DEFINE THE BUTTON TYPE
                    button: {
                        output: 'String',
                        color1: '#141414',
                        outputShape: 3,
                        implementation: FieldMultilineInput('test', (...args)=>{return args})
                    }
                },

                blocks: [
                    {
                        opcode: '[BUTTON]',
                        arguments: {
                            BUTTON: {
                                type: 'button',
                                defaultValue: 'test button' //This is the text displayed on the button AND also the function name, so keep that in mind.
                            }
                        }
                    }
                ],
                menus: {
                    //menus
                }
            }
        }
    }

    //@ts-expect-error
    Scratch.extensions.register(new TESTbuttonInBlocks());
    })(Scratch);