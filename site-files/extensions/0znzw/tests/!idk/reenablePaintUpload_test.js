/**! @license: MIT @copyright 2024-2024 0znzw @version v1.0.2 */
// This just re-enables the "upload" feature on my paint extension.
(() => {
  let playground;
  // @todo Update this ID when it gets changed.
  const playgroundAPI = vm.runtime.ext_0znzwUSBPaintTest.playgroundAPI;
  const oldDownloadImage = playgroundAPI.hooks.downloadImage;
  playgroundAPI.setHook('uploadImage', () => true);
  playgroundAPI.setHook('downloadImage', (thePlayground) => {
    playgroundAPI.setHook('downloadImage', oldDownloadImage);
    playground = thePlayground;
    return false;
  });
  const dlButton = document.querySelector('div[class^="paint-editor_editor-container"]').parentElement.lastElementChild;
  dlButton.click();
  // @todo Possibly just override getElementById to save the expensive scanning.
  const uploadInputId = Array.from(Array.from(document.styleSheets).find(sheet => sheet.ownerNode.textContent.includes(`#playground_fileInput`)).cssRules).find(rule => rule.selectorText.startsWith('#playground_fileInput_')).selectorText.slice(1);
  if (!document.getElementById(uploadInputId)) {
    const uploadButton = dlButton.previousElementSibling;
    uploadButton.removeAttribute('disabled');
    uploadButton.textContent = 'Upload.';
    const uploadInput = document.createElement('input');
    uploadInput.id = uploadInputId;
    uploadInput.type = 'file';
    uploadInput.name = 'name';
    dlButton.before(uploadInput);
    // @todo Maybe find a way to hook with react?
    uploadInput.onchange = playground.onUploadImage.bind(playground);
  }
  console.log('Uploading enabled.');
})();
