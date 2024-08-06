/**
 * Default scratch prompt without JSDocs
 */
ScratchBlocks._prompt = ScratchBlocks.prompt.bind(ScratchBlocks);

/**
 * Variable type name to internal string versions
 */
const variableType = {
    variable: '',
    list: 'list',
    broadcast: 'broadcast_msg'
}

/**
 * Callback for when the user clicks ok the a ScratchBlocks prompt
 * 
 * @type {Function}
 * @callback ScratchBlocks.promptCallback
 * @param {String} text The value inputted in the variable name box.
 * @param {Array} existingVariables existingVariables - 
 * @param {Object} scope 
 */

/**
 * Makes a modal for creating a variable.
 * @param {String} description The description of the modal.
 * @param {String} defaultValue The default variable name.
 * @param {ScratchBlocks.promptCallback} callback Callback when the user presses ok.
 * @param {String} title Title of the modal.
 * @param {String} variable_type Type of variable.
 * @function callback
 */
ScratchBlocks.prompt = function (description, defaultValue, callback, title, variable_type) {
    const args = [description, defaultValue, (text, existingVariables, scope) => {
        callback(text, existingVariables, scope);
    }, title, variable_type];
    ScratchBlocks._prompt(...args);
}

/**
 * Test function
 */
ScratchBlocks.prompt('New dictionary name:', '', (text, _, scope) => {
    if (!text) return;
}, 'New Dictionary', variableType['list']);