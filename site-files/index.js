// It does not have to be async
async function GeneratorLoaded(generator) {
  const footerLinks = [];
  const funnyMode = window.location.href.includes('?funny-is-allowed');
  if (funnyMode) {
    generator._site.gallery_title += ' (Funny mode)';
    footerLinks.push(['GoofyWarp gallery', 'https://goofywarp.github.io/gallery/']);
  }
  document.head.querySelector('title').textContent = generator._site.gallery_title;
  generator.addFooterLinks(...footerLinks);
  generator.setUsage('gallery');
  generator.addSearchTags('experimental', 'advanced');
  generator.addMods('Unsandboxed');
  await generator.import(generator.asset('include/JSON5.min.js'));
  const NOW = Date.now().toString(16);
  let req, extensions;
  req = await fetch(generator.asset(`extensions/index.json5?v=${NOW}`));
  if (!req.ok) {
    alert('Failed to load gallery :(');
    return false;
  }
  extensions = JSON5.parse(await req.text());
  if (!extensions) {
    alert('Failed to load gallery :(');
    return false;
  }
  let i = 0;
  for (const extension of extensions) {
    extensions[i] = generator.addExtension(extension);
    i++;
  }
  if (window.location.href.includes('?hl')) {
    const _placeholder = extensions[0];
    _placeholder.querySelector('div.extension-buttons').appendChild((() => {
      const div = document.createElement('div');
      div.style = 'position: absolute; left: 0px; bottom: 0px; border: none; background: none;';
      div.id = 'hlMusic';
      div.innerHTML = `
        <img src="${generator.asset('@external/radio.webp')}" width="32" height="64" loading="lazy" draggable="false" />
        <audio src="${generator.asset('@external/radio.ogg')}" disablecontrols="false" loop="" style="display: none;" />
      `;
      div.audio = div.querySelector('audio');
      div.onclick = function() {
        if (this.yes) return;
        this.yes = true;
        this.audio.play();
        this.audio.disabled = true;
        delete this.onclick;
      };
      return div;
    })());
  }
  if (funnyMode) {
    alert('Funny mode activated, PLEASE do not report any bugs while using this mode!');
    generator.addSearchTags('funny');
    req = await fetch(generator.asset(`extensions/funny-is-allowed.json5?v=${NOW}`));
    if (!req.ok) {
      alert('Failed to load gallery :(');
      return false;
    }
    extensions = JSON5.parse(await req.text());
    if (!extensions) {
      alert('Failed to load extra gallery :(');
      return false;
    }
    for (const extension of extensions) {
      generator.addExtension(extension);
    }
  }
  (() => {
    let addedBaq = false
    function goBaq(currentSearch) {
      if (window.location.href.includes('?baq') || currentSearch === 'back to the future') {
        if (addedBaq) return;
        addedBaq = true;
        generator.addSearchTags('baq');
        generator.addExtension({
          img: 'baq23future/normal.webp', id: 'baq23future/normal',
          name: 'Completely normal behaviour',
          description: 'A completely normal extension. NOT STRANGE AT ALL :P',
          search_tags: new Set(['experimental', 'baq']), requirements: new Set(),
          mode: new Set(),
          iCard: {
            url: generator.asset('?baq'),
            description: 'Completely normal...',
          },
          credits: new Set([{
            name: 'baqirbeard',
            url: 'https://github.com/baqirbeard/',
          }, {
            name: '0znzw',
            url: 'https://scratch.mit.edu/users/0znzw/',
          }]),
          // SPECIAL meta tags for THIS SPECIFIC extension DO NOT ask for your own.
          meta: ['baq 2 3 future', 'back to the future'],
        });
      } else if (currentSearch === 'baq 2 3 future') {
        window.location.href += '#?baq';
        window.location.reload(true);
      }
    };
    if (window.location.href.includes('?baq')) goBaq('back to the future');
    generator.onSearchInput = (currentSearch) => {
      if (currentSearch === 'baq 2 3 future' || currentSearch === 'back to the future') {
        goBaq(currentSearch);
      }
    };
  })();
}
