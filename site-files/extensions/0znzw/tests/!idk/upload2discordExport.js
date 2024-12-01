(() => {
  const playgroundAPI = vm.runtime.ext_0znzwUSBPaintTest.playgroundAPI;
  const oldDownloadImage = playgroundAPI.hooks.downloadImage;
  playgroundAPI.setHook('uploadImage', () => true);
  playgroundAPI.setHook('downloadImage', (playground) => {
    playgroundAPI.setHook('downloadImage', oldDownloadImage);
    window.playground = playground;
    return false;
  });
  const dlButton = document.querySelector('div[class^="paint-editor_editor-container"]').parentElement.lastElementChild;
  dlButton.click();
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
    uploadInput.onchange = playground.onUploadImage.bind(playground);
  }
  console.log('Uploading enabled.');
})();