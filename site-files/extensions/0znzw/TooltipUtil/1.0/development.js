(function(Scratch, extId) {
    /**
     * Tooltip Utility
     * @author 0znzw https://scratch.mit.edu/users/0znzw/
     * Please do not remove this comment
     */
    const vm = Scratch.vm, runtime = vm.runtime, tooltips = {};
    let workspace;
    function getBlocksByType(workspace, type) {
        const blocks = workspace.getAllBlocks().filter((block) => block.type == type);
        const flyoutBlock = workspace.getBlockById(type);
        if (flyoutBlock) blocks.push(flyoutBlock);
        return blocks;
    }
    // @ts-ignore Not typed yet
    const cbfsb = runtime._convertBlockForScratchBlocks.bind(runtime);
    // @ts-ignore Not typed yet
    runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo) {
        const res = cbfsb(blockInfo, categoryInfo);
        const bid = categoryInfo.id+'_'+blockInfo.opcode;
        tooltips[bid] = {
            warning: {}, tooltip: {}
        }
        const mtip = tooltips[bid];
        if (blockInfo.tooltip) {
            const tooltip = blockInfo.tooltip, ttip = mtip['tooltip'];
            if (typeof tooltip !== 'string' && !Array.isArray(tooltip)) {
                console.warn('Invalid typeof tooltip [accepted: string || array]');
                return res;
            }
            ttip['text'] = tooltip;
            return res;
        }
        if (blockInfo.warning) {
            const warning = blockInfo.warning, wtip = mtip['warning'];
            switch(typeof warning) {
                case 'string':
                    wtip['text'] = warning;
                    return res;
                case 'object':
                    wtip['text'] = warning.text ?? '';
                    if (warning.bubbleColour) wtip['bubbleColour'] = warning.bubbleColour;
                    if (warning.textColour) wtip['textColour'] = warning.textColour;
                    return res;
                default:
                    console.warn('Invalid typeof warning [accepted: string || object]');
                    return res;
            }
        }
        return res;
    }
    function modifyBlocks() {
        for (const opcode of Object.keys(tooltips)) {
            const mtip = tooltips[opcode], wtip = mtip['warning'], ttip = mtip['tooltip'];
            let i = 0;
            const handleWarning = (block, warning) => {
                if (!warning) return;
                let icoGroup = warning.iconGroup_, bubble = warning.bubble_;
                if (warning.hasClick) icoGroup.removeEventListener('mousedown', warning.hasClick);
                warning.hasClick = function(event) {
                    event.stopPropagation();
                    warning.iconClick_(event);
                    bubble = warning.bubble_ ?? {
                        rendered_: false
                    }
                    if (bubble.rendered_) {
                        const mtip = tooltips[block.type], wtip = mtip['warning'];
                        Array.from(bubble.content_.children).forEach((element) => {
                            if (wtip.textColour) element.setAttribute('fill', wtip.textColour);
                            if (wtip.bubbleColour) bubble.setColour(wtip.bubbleColour);
                        });
                    }
                }
                icoGroup.addEventListener('mousedown', warning.hasClick);
            }
            getBlocksByType(workspace, opcode).forEach((block) => {
                block.setWarningText(null);
                if (wtip) {
                    if (Array.isArray(wtip.text))
                    wtip.text.forEach((warning) => {
                        block.setWarningText(warning, `${extId}_${i}`);
                        i++;
                    });
                    else block.setWarningText(wtip.text, extId);
                }
                if (ttip) {
                    let text = ttip.text ?? '';
                    if (Array.isArray(ttip.text)) text = ttip.text.join('\n');
                    block.setTooltip(text);
                }
            });
            workspace.getAllBlocks().filter((block) => block.warning).forEach(block => handleWarning(block, block.warning));
        }
    }
    function tryUseScratchBlocks() {
        if (!window.ScratchBlocks) return;
        // @ts-ignore Not typed yet
        workspace = ScratchBlocks.getMainWorkspace();
        vm.removeListener('EXTENSION_ADDED', tryUseScratchBlocks);
        vm.removeListener('BLOCKSINFO_UPDATE', tryUseScratchBlocks);
        vm.on('workspaceUpdate', modifyBlocks);
        vm.runtime.on('BLOCK_DRAG_UPDATE', modifyBlocks);
        vm.runtime.on('BLOCK_DRAG_END', modifyBlocks);
    }
    vm.on('EXTENSION_ADDED', tryUseScratchBlocks);
    vm.on('BLOCKSINFO_UPDATE', tryUseScratchBlocks);
    tryUseScratchBlocks();
})(Scratch, '0znzwTooltipUtil');