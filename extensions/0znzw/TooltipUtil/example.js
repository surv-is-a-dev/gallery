(function(Scratch) {
    'use strict';

    // @ts-ignore
    !function(t,o){/**
    * Tooltip Utility
    * @author 0znzw https://scratch.mit.edu/users/0znzw/
    * Please do not remove this comment
    */const e=t.vm,n=e.runtime,r={};let i;function c(t,o){const e=t.getAllBlocks().filter((t=>t.type==o)),n=t.getBlockById(o);return n&&e.push(n),e}const l=n._convertBlockForScratchBlocks.bind(n);function a(){for(const t of Object.keys(r)){const e=r[t],n=e.warning,l=e.tooltip;let a=0;const s=(t,o)=>{if(!o)return;let e=o.iconGroup_,n=o.bubble_;o.hasClick&&e.removeEventListener("mousedown",o.hasClick),o.hasClick=function(e){if(e.stopPropagation(),o.iconClick_(e),n=o.bubble_??{rendered_:!1},n.rendered_){const o=r[t.type].warning;Array.from(n.content_.children).forEach((t=>{o.textColour&&t.setAttribute("fill",o.textColour),o.bubbleColour&&n.setColour(o.bubbleColour)}))}},e.addEventListener("mousedown",o.hasClick)};c(i,t).forEach((t=>{if(t.setWarningText(null),n&&(Array.isArray(n.text)?n.text.forEach((e=>{t.setWarningText(e,`${o}_${a}`),a++})):t.setWarningText(n.text,o)),l){let o=l.text??"";Array.isArray(l.text)&&(o=l.text.join("\n")),t.setTooltip(o)}})),i.getAllBlocks().filter((t=>t.warning)).forEach((t=>s(t,t.warning)))}}function s(){window.ScratchBlocks&&(i=ScratchBlocks.getMainWorkspace(),e.removeListener("EXTENSION_ADDED",s),e.removeListener("BLOCKSINFO_UPDATE",s),e.on("workspaceUpdate",a),e.runtime.on("BLOCK_DRAG_UPDATE",a),e.runtime.on("BLOCK_DRAG_END",a))}n._convertBlockForScratchBlocks=function(t,o){const e=l(t,o),n=o.id+"_"+t.opcode;r[n]={warning:{},tooltip:{}};const i=r[n];if(t.tooltip){const o=t.tooltip,n=i.tooltip;return"string"==typeof o||Array.isArray(o)?(n.text=o,e):(console.warn("Invalid typeof tooltip [accepted: string || array]"),e)}if(t.warning){const o=t.warning,n=i.warning;switch(typeof o){case"string":return n.text=o,e;case"object":return n.text=o.text??"",o.bubbleColour&&(n.bubbleColour=o.bubbleColour),o.textColour&&(n.textColour=o.textColour),e;default:return console.warn("Invalid typeof warning [accepted: string || object]"),e}}return e},e.on("EXTENSION_ADDED",s),e.on("BLOCKSINFO_UPDATE",s),s()}(Scratch,"0znzwTooltipUtil");

    class ext {
        getInfo() {
            return {
                id: '0znzwTooltipUtil',
                name: 'Tooltip utility',
                blocks: [
                    {
                        opcode: 'a',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'tooltip (hover on me)',
                        tooltip: 'hi'
                    },
                    {
                        opcode: 'b',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '<-- warning (click it)',
                        warning: {
                            text: 'hello, this is a warning'
                        }
                    },
                    {
                        opcode: 'c',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '<-- customized warning (click it)',
                        warning: {
                            text: 'hello, this is a warning',
                            textColour: '#FFFFFF',
                            bubbleColour: '#000000'
                        }
                    },
                ]
            };
        }
        a(){}
        b(){}
        c(){}
    }
    Scratch.extensions.register(new ext());
})(Scratch);