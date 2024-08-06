let terser, htmlminifier, cleancss;
const production = process.argv.slice(2)[0] === 'production';
if (production) {
  console.log('BUILD: Running in production mode!');
  terser = require('terser');
  htmlminifier = require('html-minifier');
  cleancss = new (require('clean-css'))({
    level: 2,
  });
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
      if (production) {
        if ((file.endsWith('.js') && !file.startsWith('site/extensions/')) || file.endsWith('.html') || file.endsWith('css')) {
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
              } else if (file.endsWith('css')) {
                data = (await cleancss.minify(data)).styles;
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
