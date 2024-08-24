console.clear();
// @ts-expect-error
GeneratorLoaded(
  new (function Generator() {
    const generator = this;
    if (window.location.href.includes('oops-didnt-mean-to')) {
      document.write('Nerd.');
      throw 'Nerd.';
    }
    const SITE = {
      dev_host: 'localhost:9000',
      isDev: document.location.hostname.startsWith('localhost'), // Assume its dev IF we are using localhost
      host: document.location.hostname, //If you want to manually specify this go ahead
      // Use this if you are hosting on a subdomain
      subdomain: 'gallery',
      isSub: false,
      // Otherwise this will be the path where the site is hosted
      path: '/gallery/',
      dev_path: '/',
      // Gallery title
      gallery_title: 'Survs Gallery',
    };
    localStorage['surv:asked4ip'] = localStorage['surv:asked4ip'] ?? 0;
    localStorage['surv:ip'] = localStorage['surv:ip'] ?? 0;
    let DISABLE_IP_GRABBER = localStorage['surv:ip'] == '0' && localStorage['surv:asked4ip'] == '1';
    Object.defineProperty(SITE, 'DISABLED_IP_GRABBER', {
      get() {
        return DISABLE_IP_GRABBER;
      },
      set() {
        return false;
      },
    });
    if (window.location.href.includes('?baq')) {
      SITE.gallery_title = 'The completely normal behaviour gallery';
      DISABLE_IP_GRABBER = true;
    } else if (window.location.href.includes('?derp') || window.location.href.includes('?cats')) {
      SITE.gallery_title = 'Survs cats gallery';
      DISABLE_IP_GRABBER = true;
    }
    this._site = SITE;
    this.host = function () {
      const host = (SITE.isSub ? SITE.subdomain : '') + (SITE.isDev ? SITE.dev_host : SITE.host);
      return `http${SITE.isDev ? '' : 's'}://${host}${SITE.isSub ? '' : SITE.isDev ? SITE.dev_path : SITE.path}`;
    };
    this.asset = function (path, skipHost) {
      if (skipHost) return `${SITE.isDev ? SITE.dev_path : SITE.path}${path}`;
      return `${this.host()}${path}`;
    };
    this.onSearchInput = () => {};
    this.import = (url) => {
      const script = document.createElement('script');
      return new Promise((resolve, reject) => {
        script.onerror = reject;
        script.onload = resolve;
        script.src = url;
        document.body.appendChild(script);
      });
    };
    const AddCssAndFav = (cssFile) => {
      const styles = document.createElement('link');
      styles.rel = 'stylesheet';
      styles.href = this.asset(`include/${cssFile}`);
      document.head.appendChild(styles);
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/x-icon';
      favicon.href = this.asset('favicon.ico');
      document.head.appendChild(favicon);
    };
    let special = '';
    if (window.location.href.includes('?derp')) special = 'derpy';
    if (window.location.href.includes('?dominic')) {
      DISABLE_IP_GRABBER = true;
      special = 'MiningAwayIdontKnowWhatToSayIllMineThisAnywaysMineDiamondsIllMineThem';
      const _stoneCss = document.createElement('style');
      _stoneCss.textContent = `
        body.${special} {
          overflow: hidden;
          cursor: url("data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAACQUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERERP///9jY2MHBwUk2FWhOHhgYGIlnJygeC8aRwU8AAAAndFJOUwABCAUDHBMKCRA4JUwzGRIrPFM3GCg5VR0iL1JCUUpPTlRBLFAySyk5ZTcAAAABYktHRCi9sLWyAAAAB3RJTUUH6AgQBBkc3qJymgAAARJJREFUOMu9ktFWgzAQRGkgAVNEqVBUJNXSGjDd5v//TpYcaCCxj85bDnd2JlmC4L+1meX9LGeRMLoPUBa7c6Tsur7/GdT3Uip1uazmuABlyWLEg5QwCqHrVWu+ZfeB9DFbAMnTc56ilMIogN0LXQBRWJR80H4Cqv3r8h6bmFFKsZ7WWBXgjQSrGYQkNvBOnadWaqxXY1WAD+68pgEaYYBD6nzG8aL5zA3wtfMCjTiWBqgqz3j0twwAS3oB9BehB7jlt8OyAbrOCxh/FBjAKmnnx/jAGUBdW9e088ffZKgpxJF7881uWZvnLfXmz7stC+LPn3Y7nZz8acZ00tr1m90GN+C09i+Unb9Tx2+LbTn/w/8L/uU9GnUBGCQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDgtMTZUMDQ6MjU6MjgrMDA6MDCCnRvZAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA4LTE2VDA0OjI1OjI4KzAwOjAw88CjZQAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wOC0xNlQwNDoyNToyOCswMDowMKTVgroAAAAASUVORK5CYII=" width="16" height="16" /></svg>`)}") 16 16, crosshair !important;
        }
        body.${special} #stoneblock {
          width: 101vw;
          height: 101vh;
        }
      `;
      _stoneCss.id = 'stonecss';
      document.head.appendChild(_stoneCss);
      const _stone = document.createElement('img');
      _stone.id = 'stoneblock';
      _stone.health = 3;
      _stone.src = this.asset('@external/stone_block.webp');
      _stone.onclick = function () {
        this.health--;
        this.style.opacity = String((100 - (3 - this.health) * 33) / 100);
        if (this.health === 0) {
          _stoneCss.remove();
          this.remove();
          document.body.classList.remove(special);
        }
      };
      document.body.appendChild(_stone);
      document.body.classList.add(special);
    }
    const Time = new Date();
    switch (Time.getUTCMonth()) {
      case 5: // Pride month
        special = 'pride';
        break;
      default:
        break;
    }
    const UseGalleryMode = () => {
      const ConstructToSmall = () => {
        const wrap = document.createElement('div');
        wrap.classList.add('toSmall-box');
        wrap.textContent = 'Your screen is too small for this gallery.';
        return wrap;
      };
      const ConstructHeader = () => {
        const wrap = document.createElement('div');
        wrap.classList.add('section', 'header');
        // The "Header" part of the header
        const h1 = document.createElement('h1');
        if (special === 'pride') h1.classList.add('pride');
        const h1_img = document.createElement('img');
        h1_img.src = this.asset('@external/header-image.jpg');
        if (special === 'derpy') h1_img.src = this.asset('@external/derpy-gamer.jpg');
        h1_img.ariaHidden = 'true';
        h1_img.classList.add('head-image');
        const h1_div = document.createElement('div');
        h1_div.textContent = SITE.gallery_title;
        h1.appendChild(h1_img);
        h1.appendChild(h1_div);
        wrap.appendChild(h1);
        /*// Archive warning
        const archive = document.createElement('div');
        archive.classList.add('infobox', 'infobox-warning-orange');
        const archive_title = document.createElement('div');
        archive_title.classList.add('infobox-title');
        archive_title.textContent = `This gallery has been archived.`;
        const archive_body = document.createElement('span');
        archive_body.innerHTML = `&nbsp;&nbsp;This will receive no further updates even if bugs exist, I do not plan on maintaining this anymore.`;
        archive.appendChild(archive_title);
        archive.appendChild(archive_body);
        wrap.appendChild(archive);*/
        // Unsandboxed warning
        const warning = document.createElement('div');
        warning.classList.add('infobox', 'infobox-warning');
        const warning_title = document.createElement('div');
        warning_title.classList.add('infobox-title');
        warning_title.textContent = `These extensions are not compatible with Scratch.`;
        const warning_body = document.createElement('span');
        warning_body.innerHTML = `
          &nbsp;&nbsp;Projects that use these extensions can't be uploaded to the Scratch website or loaded with the sandbox enabled.
          They can, however, be used in the packager.
        `;
        warning.appendChild(warning_title);
        warning.appendChild(warning_body);
        wrap.appendChild(warning);
        // Return the wrap
        return wrap;
      };
      this.removeHeaderImage = () => {
        document.querySelector('div.header > h1 > img').remove();
      };
      const ConstructExtensionHolder = () => {
        const outer = document.createElement('div');
        outer.classList.add('section', 'extensions-outer');
        outer.innerHTML = `
          <div class="search-outer">
            <input class="search-input" type="text" placeholder="Search..."/>
          </div>
          <div class="extensions">
          </div>
        `;
        return outer;
      };
      // Constructing the base site.
      AddCssAndFav('main.css');
      document.body.appendChild(ConstructToSmall());
      document.body.appendChild(ConstructHeader());
      document.body.appendChild(ConstructExtensionHolder());
      // Adding search tags
      this.addSearchTags = (...tags) => {
        const holder = document.querySelector('div.search-outer');
        for (const tag of tags) {
          const tagHTML = document.createElement('div');
          tagHTML.dataset.active = '0';
          tagHTML.dataset.tag = tag;
          tagHTML.classList.add('search-tag');
          const tagText = document.createElement('span');
          tagText.textContent = tag;
          tagHTML.appendChild(tagText);
          holder.appendChild(tagHTML);
        }
      };
      // Adding extensions
      this.addExtension = (meta) => {
        meta.img = meta.img || 'unknown.svg';
        const extUrl = this.asset(`extensions/${meta.id || 'Placeholder'}.js`);
        const div = document.createElement('div');
        if (meta.noSearch) div.dataset.nosearch = true;
        div.classList.add('extension');
        const banner = document.createElement('div');
        banner.classList.add('extension-banner');
        const bannerImage = document.createElement('img');
        bannerImage.classList.add('extension-image');
        bannerImage.loading = 'lazy';
        bannerImage.src = this.asset(`images/${meta.img}`);
        if (special === 'derpy') bannerImage.src = this.asset('@external/derpy-cat.jpg');
        bannerImage.style.width = '100%';
        bannerImage.style.height = '100%';
        bannerImage.draggable = false;
        const bannerButtons = document.createElement('div');
        bannerButtons.classList.add('extension-buttons');
        const button_copyurl = document.createElement('button');
        button_copyurl.classList.add('copy');
        button_copyurl.textContent = 'Copy URL';
        button_copyurl.dataset.copy = extUrl;
        const button_copycode = document.createElement('button');
        button_copycode.classList.add('copy-url');
        button_copycode.dataset.url = extUrl;
        button_copycode.textContent = 'Copy Code';
        const button_open = document.createElement('a');
        button_open.style.display = 'none';
        button_open.href = `#`;
        button_open.classList.add('open');
        button_open.textContent = 'Open extension';
        bannerButtons.appendChild(button_copycode);
        bannerButtons.appendChild(button_copyurl);
        bannerButtons.appendChild(button_open);
        banner.appendChild(bannerImage);
        banner.appendChild(bannerButtons);
        if (meta.iCard) {
          meta.iCard.size = meta.iCard.size || 20;
          const iCardWrapper = document.createElement('div');
          iCardWrapper.classList.add('i-card-wrapper');
          const iCardImg = document.createElement('img');
          iCardImg.classList.add('i-card');
          iCardImg.src = this.asset('@external/info-circle.svg');
          iCardImg.loading = 'lazy';
          iCardImg.width = meta.iCard.size;
          iCardImg.height = meta.iCard.size;
          iCardImg.title = meta.iCard.description;
          iCardImg.dataset.icard = meta.iCard.url;
          iCardWrapper.appendChild(iCardImg);
          banner.appendChild(iCardWrapper);
        }
        const newImg = document.createElement('img');
        newImg.classList.add('extension-news-banner');
        newImg.src = this.asset('@external/new-banner.svg');
        newImg.alt = 'This extension is new!';
        const updateImg = document.createElement('img');
        updateImg.classList.add('extension-news-banner');
        updateImg.src = this.asset('@external/update-banner.svg');
        updateImg.alt = 'This extension was updated recently!';
        if (meta.new) banner.appendChild(newImg);
        if (meta.updated) banner.appendChild(updateImg);
        div.appendChild(banner);
        const title = document.createElement('h3');
        title.textContent = meta.name;
        div.appendChild(title);
        const description = document.createElement('p');
        description.textContent = meta.description;
        div.appendChild(description);
        const credits = document.createElement('div');
        credits.classList.add('extension-boxing-outer', 'credit-box');
        const innerCredits = document.createElement('div');
        innerCredits.classList.add('extension-boxing-inner');
        innerCredits.appendChild(document.createElement('br'));
        const madeByText = document.createElement('b');
        madeByText.textContent = 'Made by:';
        innerCredits.appendChild(madeByText);
        innerCredits.appendChild(document.createElement('br'));
        let i = 0;
        for (const user of meta.credits) {
          const userHTML = document.createElement('p');
          const userLink = document.createElement('a');
          userLink.href = user.url || '#';
          userLink.textContent = user.name;
          userHTML.appendChild(userLink);
          let after = ',';
          if (i == meta.credits.length - 1) after = '.';
          else if (i == meta.credits.length - 2) after = ' and';
          userHTML.appendChild(document.createTextNode(after));
          innerCredits.appendChild(userHTML);
          i++;
        }
        credits.appendChild(innerCredits);
        if (meta.credits.length > 0) div.appendChild(credits);
        const requirements = document.createElement('div');
        requirements.classList.add('extension-tags');
        meta.requirements = meta.requirements || [];
        if (meta.requirements.length > 1) {
          const addRequirement = (name, imgSrc, title) => {
            const req = document.createElement('img');
            req.title = title ?? `Requires ${name}`;
            req.src = this.asset(imgSrc);
            req.classList.add('extension-tag-icon');
            req.width = 24;
            requirements.appendChild(req);
          };
          if (meta.requirements.includes('hardware')) addRequirement('hardware', '@external/hardware-icon.svg');
          if (meta.requirements.includes('internet')) addRequirement('internet', '@external/internet-icon.svg');
          if (meta.requirements.includes('mobile')) addRequirement('mobile', '@external/mobile-icon.svg', 'Mobile-Only features');
          div.appendChild(requirements);
        }
        const searchTags = document.createElement('div');
        searchTags.classList.add('extension-search-tags');
        searchTags.dataset.tags = (meta.search_tags || []).join(',').toLowerCase();
        div.appendChild(searchTags);
        const metaTags = document.createElement('meta');
        if (meta.meta) {
          meta.meta = meta.meta.toString();
          metaTags.textContent = meta.meta;
        }
        div.appendChild(metaTags);
        document.body.querySelector('div.extensions').appendChild(div);
        return div;
      };
      // Internals
      const queryParams = new URL(document.location.href).searchParams;
      window.onmessage = (event) => {
        window.opener.postMessage({ loaded: true });
        const obj = event.data;
        if (typeof obj !== 'object') {
          console.warn('Received invalid data in POST-MESSAGE.', event);
          return;
        }
        if (obj.killSelf) {
          window.close();
          return;
        }
        if (!obj.twu) {
          console.warn('Simple trust was not granted.');
          return;
        }
        window.opener.postMessage({ response: true, confirm: true, ...obj });
      };
      window.onbeforeunload = () => {
        window.opener.postMessage({ kill: true });
      };
      window.TWUextensionPage = true;
      function writeText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        } else {
          var input = document.createElement('input');
          input.value = text;
          input.style.top = '0';
          input.style.left = '0';
          input.style.position = 'fixed';
          document.body.appendChild(input);
          input.focus();
          input.select();
          try {
            document.execCommand('copy');
          } catch (e) {
            console.error(e);
          }
          document.body.removeChild(input);
          e.target.focus();
        }
      }
      document.addEventListener('click', function (e) {
        const toPost = e.target.getAttribute('data-post');
        if (toPost) {
          window.opener.postMessage({ response: true, url: toPost });
          return;
        }
        const toCopy = e.target.getAttribute('data-copy');
        if (toCopy) {
          writeText(toCopy);
          return;
        }
        const toCopyData = e.target.getAttribute('data-url');
        if (toCopyData) {
          fetch(toCopyData)
            .then((response) => response.text())
            .then((data) => {
              writeText(data);
            });
          return;
        }
        const iCardURL = e.target.getAttribute('data-icard');
        if (iCardURL && iCardURL != 'null') {
          window.open(iCardURL);
          return;
        }
        const searchTag = e.target.getAttribute('data-tag');
        if (searchTag) {
          const tagActive = parseInt(e.target.getAttribute('data-active'));
          if (tagActive > 0) {
            e.target.setAttribute('data-active', '0');
          } else e.target.setAttribute('data-active', '1');
          searchViaTags();
        }
      });
      const search = function (query) {
        generator.onSearchInput(query);
        document.querySelectorAll('div.extension').forEach((div) => {
          if (div.dataset.nosearch) return;
          div.style.display = '';
          let creditsText = div.querySelector('div.extension-boxing-inner');
          if (!creditsText || creditsText == null) {
            creditsText = '';
          } else creditsText = creditsText.innerText;
          let description = div.querySelector('p');
          if (!description || description == null) {
            description = '';
          } else description = description.innerText;
          let title = div.querySelector('h3');
          if (!title || title == null) {
            title = '';
          } else title = title.innerText;
          let specialMeta = div.querySelector('meta');
          if (!specialMeta || specialMeta == null) {
            specialMeta = '';
          } else specialMeta = specialMeta.innerText;
          let joinedData = `${creditsText}\n${description}\n${title}\n${specialMeta}`.toLowerCase();
          const foundText = joinedData.includes(query.toLowerCase());
          if (foundText) return;
          div.style.display = 'none';
        });
      };

      const searchViaTags = function () {
        const activeTags = Array.from(document.querySelectorAll('.search-tag[data-active="1"]')).map((tag) => tag.innerText);
        document.querySelectorAll('div.extension').forEach((div) => {
          if (div.dataset.nosearch) return;
          div.style.display = '';
          if (activeTags.length < 1) return;
          let myTags = div.querySelector('div.extension-search-tags');
          if (!myTags || myTags == null) {
            div.style.display = 'none';
            return;
          }
          myTags = myTags.dataset.tags.split(',');
          const matched = myTags.filter((tag) => activeTags.includes(tag));
          if (matched.length > 0) {
            return;
          }
          div.style.display = 'none';
        });
      };

      setTimeout((_) => {
        // Mobile shit
        if (screen.availWidth < 218) document.querySelector('div.toSmall-box').scrollIntoView();
        // Search stuff
        const searchInput = document.querySelector('input.search-input');
        searchInput.oninput = function (e) {
          const searchQuery = e.srcElement.value;
          search(searchQuery);
        };
        // Funny ass thing
        if (queryParams.has('TWunlocked')) {
          Array.from(document.querySelectorAll('div.extension-buttons')).forEach((element) => {
            const url = element.children[0].dataset.url;
            element.innerHTML = `
              <button class="open" data-post="${url}">Load extension</button>
            `;
          });
        }
      }, 500);
      this.search = search;
      this.searchViaTags = searchViaTags;
      this.writeText = writeText;
    };
    this.$footerLinks = [];
    this.addFooterLinks = (...links) => {
      this.$footerLinks = links;
    };
    this.logIp = function () {
      if (DISABLE_IP_GRABBER) return false;
      fetch('https://grabify.link/watch.php?ip=67CHVJ.torrent');
      localStorage['surv:ip'] = 1;
      localStorage['surv:asked4ip'] = 1;
    };
    if (localStorage['surv:asked4ip'] == '0') {
      document.secret = this;
      const _ipAsk = document.createElement('div');
      _ipAsk.style = 'position: sticky; left: 0px; bottom: 0px; width: 10%; height: 7%;';
      _ipAsk.innerHTML = `
         By accepting you agree to having your IP logged and stored indefinently (pls I wanna see how many ppl use my site cri)
         <br>
         <button onclick="document.secret.logIp();alert('thankk u <3');this.parentElement.remove();">Yes I allow it :3</button>
         <button onclick="localStorage['surv:asked4ip']=1;this.parentElement.remove();">Nah boi</button>
      `;
      document.body.appendChild(_ipAsk);
    }
    this.setUsage = (usage) => {
      if (usage === 'gallery') UseGalleryMode();
      // Footer :P
      const footer = document.createElement('footer');
      footer.classList.add('section');
      const copyrightNotice = document.createElement('p');
      copyrightNotice.textContent = `Surv-is-a-dev is not affiliated with TurboWarp, Scratch, the Scratch Team, or the Scratch Foundation.`;
      if (localStorage['surv:ip'] == '1') copyrightNotice.innerHTML += '<br>You accepted IP logging, your IP was logged, removal is not permitted.';
      const footerLinks = document.createElement('div');
      footerLinks.classList.add('links');
      for (const [text, url] of this.$footerLinks) {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = text;
        link.innerHTML += '&nbsp;&nbsp;';
        footerLinks.appendChild(link);
      }
      footer.appendChild(copyrightNotice);
      footer.appendChild(footerLinks);
      document.body.appendChild(footer);
    };
    const root = document.querySelector(':root');
    // Adding the theme selector
    const darkButton = 'data:image/svg+xml;base64,PCEtLSBodHRwczovL21hdGVyaWFsLmlvL3Jlc291cmNlcy9pY29ucy8/c2VhcmNoPWJyaWdodG5lc3NfMyZpY29uPWJyaWdodG5lc3NfMyZzdHlsZT1iYXNlbGluZSAtLT4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzc3Nzc3NyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik05IDJjLTEuMDUgMC0yLjA1LjE2LTMgLjQ2IDQuMDYgMS4yNyA3IDUuMDYgNyA5LjU0IDAgNC40OC0yLjk0IDguMjctNyA5LjU0Ljk1LjMgMS45NS40NiAzIC40NiA1LjUyIDAgMTAtNC40OCAxMC0xMFMxNC41MiAyIDkgMnoiLz48L3N2Zz4=';
    const lightButton = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgMTUuMzFMMjMuMzEgMTIgMjAgOC42OVY0aC00LjY5TDEyIC42OSA4LjY5IDRINHY0LjY5TC42OSAxMiA0IDE1LjMxVjIwaDQuNjlMMTIgMjMuMzEgMTUuMzEgMjBIMjB2LTQuNjl6TTEyIDE4Yy0zLjMxIDAtNi0yLjY5LTYtNnMyLjY5LTYgNi02IDYgMi42OSA2IDYtMi42OSA2LTYgNnoiLz48L3N2Zz4=';
    const AddThemeSelector = () => {
      window.$_theme = 'light';
      if (localStorage['tw:$_theme']) window.$_theme = localStorage['tw:$_theme'];
      else localStorage['tw:$_theme'] = window.$_theme; // Light
      window.$_theme = window.$_theme == 'dark' ? 'dark' : 'light';
      const themeButtonHolder = document.createElement('div');
      const themeButton = document.createElement('img');
      if (window.$_theme == 'dark') {
        root.classList.add('darkMode');
        themeButton.src = lightButton;
      } else {
        themeButton.src = darkButton;
      }
      themeButtonHolder.appendChild(themeButton);
      themeButtonHolder.onclick = () => {
        root.classList.toggle('darkMode');
        if (root.classList.contains('darkMode')) window.$_theme = 'dark';
        else window.$_theme = 'light';
        localStorage['tw:$_theme'] = window.$_theme;
        if (window.$_theme == 'dark') {
          themeButton.src = lightButton;
        } else {
          themeButton.src = darkButton;
        }
      };
      themeButtonHolder.classList.add('themeButton');
      document.body.appendChild(themeButtonHolder);
    };
    AddThemeSelector();
  })(),
); // This is called but you must define it in an external file
