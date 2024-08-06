/**!
 * Switch Case Compiled
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Switch Case v1c" needs to be ran unsandboxed.`);
  }

  const vm = Scratch.vm, runtime = vm.runtime;

  // For the lols this is gonna be un-used for now.
  const onBlockly = (Blockly) => {
    const ConProto = Blockly.Connection.prototype;
    const cpica = ConProto.isConnectionAllowed;
    ConProto.isConnectionAllowed = function(canidate) {
      const res = cpica.call(this, canidate);
      if (!res) return res;
      let firstStatementConnection = this.sourceBlock_.getFirstStatementConnection();
      // "Whitelist" of blocks for each connection on the blocks
      if (this.sourceBlock_.type === '0zSwCc_default_') {
        if (this === this.sourceBlock_.previousConnection) {
          // Basically only let the top of the block connect to switch blocks and case blocks
          if (canidate.sourceBlock_.type !== '0zSwCc_switch_' &&
              canidate.sourceBlock_.type !== '0zSwCc_case_') return false;
          // We can connect but is it valid
          if (canidate.sourceBlock_.type === '0zSwCc_switch_') {
            // We dont want to connect outside of the switch block
            if (canidate === canidate.sourceBlock_.nextConnection) return false;
          }
          if (canidate.sourceBlock_.type === '0zSwCc_case_') {
            // We only want to connect to the bottom of the case block
            if (canidate !== canidate.sourceBlock_.nextConnection) return false;
          }
        }
        // We skip inner and bottom connections
        return res;
      }
      if (this.sourceBlock_.type === '0zSwCc_case_') {
        if (this === this.sourceBlock_.previousConnection) {
          // Basically only let the top of the block connect to switch and case blocks
          if (canidate.sourceBlock_.type !== '0zSwCc_switch_' &&
              canidate.sourceBlock_.type !== '0zSwCc_case_') return false;
          // We can connect but is it valid
          if (canidate.sourceBlock_.type === '0zSwCc_switch_') {
            // We dont want to connect outside of the switch block
            if (canidate === canidate.sourceBlock_.nextConnection) return false;
          }
        }
        if (this === this.sourceBlock_.nextConnection) {
          // Basically only let the bottom of the block connect to case and default blocks
          if (canidate.sourceBlock_.type !== '0zSwCc_case_' &&
              canidate.sourceBlock_.type !== '0zSwCc_default_') return false;
          // We can connect but is it valid
          if (canidate.sourceBlock_.type === '0zSwCc_switch_') {
            // We dont want to connect outside of the switch block
            if (canidate === canidate.sourceBlock_.previousConnection) return false;
          }
        }
        // We skip inner connections
        return res;
      }
      if (this.sourceBlock_.type === '0zSwCc_switch_') {
        // We skip top and bottom connections for whitelist
        // Check if the connection is a "chomp"
        if (this !== this.sourceBlock_.nextConnection &&
            canidate === canidate.sourceBlock_.previousConnection &&
            res && canidate.sourceBlock_.type !== '0zSwCc_case_' &&
            canidate.sourceBlock_.type !== '0zSwCc_default_') return false;
        // Now we check for blacklist
        if (this === this.sourceBlock_.previousConnection) {
          // Ban the top of the block from connecting to case and default blocks
          if (canidate.sourceBlock_.type === '0zSwCc_case_' ||
              canidate.sourceBlock_.type === '0zSwCc_default_') return false;
        }
        if (this === this.sourceBlock_.nextConnection) {
          // Ban the bottom of the block from connecting to case and default blocks
          if (canidate.sourceBlock_.type === '0zSwCc_case_' ||
              canidate.sourceBlock_.type === '0zSwCc_default_') return false;
        }
        return res;
      }
      // check if the block is not one of the blocks
      if ((this.sourceBlock_.type !== '0zSwCc_switch_') &&
          (this.sourceBlock_.type !== '0zSwCc_case_') &&
          (this.sourceBlock_.type !== '0zSwCc_default_')) {
        // Make sure the thing actually well has connections
        const connections = this.sourceBlock_.getConnections_();
        if (connections.length < 1) return res;
        // Check if we are connecting to a switch block
        if (canidate.sourceBlock_.type === '0zSwCc_switch_') {
          // Make sure we are connecting to only the bottom and top of the switch block
          if (canidate === canidate.sourceBlock_.previousConnection ||
              canidate === canidate.sourceBlock_.nextConnection) return res;
          return false;
        }
        // Now we check for blacklist of top and bottom connections
        if (canidate === canidate.sourceBlock_.previousConnection) {
          // Ban the bottom of the block from connecting to case and default blocks
          if (canidate.sourceBlock_.type === '0zSwCc_case_' ||
              canidate.sourceBlock_.type === '0zSwCc_default_') return false;
        }
        if (canidate === canidate.sourceBlock_.nextConnection) {
          // Ban the bottom of the block from connecting to case and default blocks
          if (canidate.sourceBlock_.type === '0zSwCc_case_' ||
              canidate.sourceBlock_.type === '0zSwCc_default_') return false;
        }
      }
      return res;
    };
  };
  // if (!!Scratch?.gui) Scratch.gui.getBlockly().then(Blockly => onBlockly(Blockly));

  class extension {
    getInfo() {
      return {
      id: '0zSwCc',
      name: 'Switch Case (Compiler)',
      blocks: [{
        opcode: 'switch_', func: 'err',
        text: 'switch [C]',
        blockType: Scratch.BlockType.CONDITIONAL,
        arguments: {
          C: {type: Scratch.ArgumentType.STRING, defaultValue: 'apple'}
        },
      },{
        opcode: 'case_', func: 'err',
        text: 'case [C]',
        blockType: Scratch.BlockType.CONDITIONAL,
        arguments: {
          C: {type: Scratch.ArgumentType.STRING, defaultValue: 'apple'}
        },
      },{
        opcode: 'default_', func: 'err',
        text: 'default',
        blockType: Scratch.BlockType.CONDITIONAL,
        isTerminal: true,
      },{
        opcode: 'break_', func: 'err',
        text: 'break',
        blockType: Scratch.BlockType.COMMAND,
        isTerminal: true,
      }],
      }
    }
    err(args, util, blockJSON) {
      const err = 'This version of switch case only works in the compiler :trol:';
      runtime.visualReport(util.thread.isCompiled ? util.thread.peekStack() : util.thread.peekStackFrame().op.id, err);
      return err;
    }
    switch_() {}
    case_() {}
    defaut_() {}
    break_() {}
  }

  function sanitizeForEmbed(wrap, string) {
    // @ts-ignore Overdated syntax
    return String(string).replaceAll('\\', '\\\\').replaceAll(wrap, `\\${wrap}`);
  }

  const sanitize = string => {
    if (typeof string !== 'string') {
      console.warn(`sanitize got unexpected type: ${typeof string}`);
      string = '' + string;
    }
    return JSON.stringify(string).slice(1, -1);
  };

  class Frame {
    constructor(isLoop) {
      this.isLoop = isLoop;
      this.isLastBlock = false;
    }
  }

  // @ts-ignore
  const JSG = vm.exports.i_will_not_ask_for_help_when_these_break().JSGenerator;
  // @ts-ignore
  const STG = vm.exports.i_will_not_ask_for_help_when_these_break().ScriptTreeGenerator;
  const JSGP = JSG.prototype;
  const STGP = STG.prototype;

  const PATCHES_ID = '0zSwCc';
  const cst_patch = (obj, functions) => {
    if (obj[PATCHES_ID]) return;
    obj[PATCHES_ID] = {};
    for (const name in functions) {
      const original = obj[name];
      obj[PATCHES_ID][name] = obj[name];
      if (original) {
        obj[name] = function (...args) {
          const callOriginal = (...args) => original.call(this, ...args);
          return functions[name].call(this, callOriginal, ...args);
        };
      } else {
        obj[name] = function (...args) {
          return functions[name].call(this, () => {}, ...args);
        };
      }
    }
  };

  function caseSanitize(case_) {
    if (typeof case_ == 'string') return `"${sanitize(case_)}"`;
    if (typeof case_ == 'number') return String(case_);
    console.warn(`sanitization failed on case of type: ${typeof case_}, casting to string`);
    return String(case_);
  }
  function descendTillSource(input, san) {
    let des = this.descendInput(input), src = false;
    if (des.constantValue?.value) return san(des.constantValue.value);
    des = this.descendInput(des.constantValue);
    if (des.constantValue?.value) return san(des.constantValue.value);
    src = true;
    if (des?.source ?? des?.constantValue?.source) return des?.source ?? des?.constantValue?.source;
    throw new Error('Unable to descend input');
  }

  cst_patch(JSGP, {
    descendStackedBlock(originalFn, node) {
      console.log(this, node);
      switch(node.kind) {
        case '0zSwCc.switch':
          const case1_ = descendTillSource.call(this, node.case, caseSanitize);
          const oldSrc1 = this.source ?? '';
          // @ts-ignore
          this.descendStack(node.code, new Frame(false, node.type));
          const stackSrc1 = this.source.substring(oldSrc1.length);
          this.source = oldSrc1;
          this.source += `\nswitch(${case1_}) {\n${stackSrc1}\n}\n`;
          return;
        case '0zSwCc.case':
          const case2_ = descendTillSource.call(this, node.case, caseSanitize);
          const oldSrc2 = this.source ?? '';
          // @ts-ignore
          this.descendStack(node.code, new Frame(false, node.type));
          const stackSrc2 = this.source.substring(oldSrc2.length);
          this.source = oldSrc2;
          this.source += `case ${case2_}:\n${stackSrc2}\n`;
          return;
        case '0zSwCc.default':
          const oldSrc3 = this.source ?? '';
          // @ts-ignore
          this.descendStack(node.code, new Frame(false, node.type));
          const stackSrc3 = this.source.substring(oldSrc3.length);
          this.source = oldSrc3;
          this.source += `default:\n${stackSrc3}\n`;
          return;
        case '0zSwCc.break':
          this.source += `\nbreak;`;
          return;
        default:
          return originalFn(node);
      }
    },
  });

  cst_patch(STGP, {
    descendStackedBlock(originalFn, block) {
      switch(block.opcode) {
        case '0zSwCc_switch_':
          return {
            kind: '0zSwCc.switch',
            case: {
              kind: 'constant',
              value: this.descendInputOfBlock(block, 'C'),
            },
            code: this.descendSubstack(block, 'SUBSTACK'),
          };
        case '0zSwCc_case_':
          return {
            kind: '0zSwCc.case',
            case: {
              kind: 'constant',
              value: this.descendInputOfBlock(block, 'C'),
            },
            code: this.descendSubstack(block, 'SUBSTACK'),
          };
        case '0zSwCc_default_':
          return {
            kind: '0zSwCc.default',
            code: this.descendSubstack(block, 'SUBSTACK'),
          };
        case '0zSwCc_break_':
          return {
            kind: '0zSwCc.break',
          };
        default:
          return originalFn(block);
      }
    },
  });
  Scratch.extensions.register(new extension());
})(Scratch);