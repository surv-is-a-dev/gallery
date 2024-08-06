window.Blockly = ScratchBlocks;
// FrameSvg is based on
// https://github.com/TurboWarp/scratch-blocks/blob/develop/core/workspace_comment_svg.js
// https://github.com/TurboWarp/scratch-blocks/blob/develop/core/workspace_comment_render_svg.js
Blockly.FrameSvg = class FrameSvg {
  constructor(workspace, x, y) {
    this.workspace = workspace;
    this.rendered_ = false;
  }
  render() {
    if (this.rendered_) return false;
    
  }
  dispose() {}
}
// 
const wssp = Blockly.WorkspaceSvg.prototype;
const wssr = wssp.render;
wssp.render = function(...fakeArgs) {
  // We need to render our frames :trol:
  
  return wssr.apply(this, fakeArgs);
}
const dtw = Blockly.Xml.domToWorkspace;
Blockly.Xml.domToWorkspace = function(e,t,...fakeArgs) {
  return dtw.call()
}