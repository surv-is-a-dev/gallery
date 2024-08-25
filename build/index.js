let terser, htmlminifier, cleancss, JSON5;
const production = process.argv.slice(2)[0] === 'production';
if (production) {
  console.log('BUILD: Running in production mode!');
  terser = require('terser');
  htmlminifier = require('html-minifier');
  cleancss = new (require('clean-css'))({
    level: 2,
  });
  JSON5 = require('./JSON5');
}
const rimraf = require('rimraf').rimraf;
const { XMLDoc, XMLNode } = require('./xml.js');
const fs = require('fs').promises;
const fsExtra = require('fs-extra');
const path = require('path');

const xmlFile = 'files.xml';
const xmlPath = `./site/${xmlFile}`;

async function walk(dir) {
  let files = await fs.readdir(dir);
  files = await Promise.all(files.map(async file => {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) return walk(filePath);
    else if(stats.isFile()) return filePath;
  }));
  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

new Promise(async (resolveShare) => {
  try {
    await rimraf('./site', { preserveRoot: false });
  } catch {} finally {
    await new Promise((resolve, reject) => {
      fsExtra.copy('./site-files', './site', function(err) {
        if (err) return reject(err);
        resolve();
      });
    });
    resolveShare();
  }
}).then(() => {
  walk('./site').then(async (files) => {
    let file = true;
    const map = new XMLDoc();
    map.attrs['x-build-time'] = Date.now();
    while (file = files.shift()) {
      if (file.endsWith('.html')) {
        await new Promise((resolve) => {
          fs.readFile(file).catch((err) => console.error(`BUILD: Failed to inject generator ${file}\n`, err)).then(async (data) => {
            const NOW = Date.now().toString(16);
            data = data.toString().replace('<!-- %GENERATOR.JS% -->', `<!-- The base64 is just to use the altgen and isaltgen tags -->\n    <script src="/include/generator.js?v=${NOW}" data-altgen="/gallery/include/generator.js?v=${NOW}" data-isaltgen="1" onerror="eval(atob('ICAgICgoKT0+e2NvbnN0IHRvcExldmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7CiAgICB0b3BMZXZlbC5vbmVycm9yID0gKCkgPT4gYWxlcnQoJ1RoaXMgc2l0ZSBpcyBub3QgY29uZmlndXJlZCBjb3JyZWN0bHknKTsKICAgIHRvcExldmVsLnNyYyA9IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbZGF0YS1pc2FsdGdlbj0iMSJdJykuZGF0YXNldC5hbHRnZW4pOwogICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b3BMZXZlbCk7fSkoKTs='))"></script>`);
            data = data.replace('<!-- %HEADER% -->', `<!-- To the guy whos snooping. -->\n    <!-- This site is generated via JS -->\n    <!-- So its not just there on load -->\n    <!-- Please be careful -->`);
            data = data.replace('%CACHEOFF%', `v=${NOW}`);
            fs.writeFile(file, data, 'utf8').catch((err) => console.error(`BUILD: Failed to inject generator ${file}\n`, err)).then(() => resolve(console.log(`BUILD: Minified ${file}`)));
          });
        });
      }
      if (production) {
        if ((file.endsWith('.js') && !(file.startsWith('site/extensions/') || file.endsWith('.min.js'))) || file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.json5')) {
          console.log(`BUILD: Minifying ${file}`);
          await new Promise((resolve) => {
            fs.readFile(file).catch((err) => console.error(`BUILD: Failed to minify ${file}\n`, err)).then(async (data) => {
              data = data.toString();
              if (file.endsWith('.js')) {
                data = (await terser.minify(data, {
                  sourceMap: false,
                })).code;
              } else if (file.endsWith('.html')) {
                data = (await htmlminifier.minify(data, {
                  removeAttributeQuotes: true,
                  minifyJS: true,
                  minifyCSS: true,
                }));
              } else if (file.endsWith('.css')) {
                data = (await cleancss.minify(data)).styles;
              } else if (file.endsWith('.json5')) {
                data = JSON5.stringify(JSON5.parse(data));
              }
              fs.writeFile(file, data, 'utf8').catch((err) => console.error(`BUILD: Failed to minify ${file}\n`, err)).then(() => resolve(console.log(`BUILD: Minified ${file}`)));
            });
          });
        }
      }
      const node = new XMLNode('x-file');
      node.attrs['path'] = file.replace('site/', '');
      map.appendChild(node);
    }
    try {
      await (fs.stat(xmlPath).catch((err) => {}).then((stats) => {
        fs.unlink(xmlPath).catch((err) => {}).then(() => console.log(`BUILD: Deleted existing ${xmlFile} succesfully.`)).finally();
      }));
    } catch {
    } finally {
      fs.writeFile(xmlPath, map.toString(), 'utf8').catch((err) => console.error(`BUILD: Failed to write ${xmlFile}\n`, err)).then(() => console.log(`BUILD: Wrote ${xmlFile}`));
    }
  });
});
