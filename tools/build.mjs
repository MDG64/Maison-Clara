// Génère index.html à partir de src/maison_clara.html :
// - le script JSX (text/babel) est compilé à l'avance, plus de Babel dans le navigateur ;
// - React est servi depuis vendor/ au lieu d'unpkg.com ;
// - un rapporteur d'erreurs remplace la page blanche par un message lisible.
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { transformSync } from '@babel/core';

const root = new URL('..', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');

let html = read('src/maison_clara.html');

const cdn = /<script src="https:\/\/unpkg\.com\/[^"]+"[^>]*><\/script>\s*/g;
if ((html.match(cdn) || []).length !== 3) throw new Error('3 scripts unpkg attendus dans la source');
html = html.replace(cdn, '');

const babelRe = /<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/;
const m = html.match(babelRe);
if (!m) throw new Error('script text/babel introuvable');
const { code } = transformSync(m[1], {
  presets: ['@babel/preset-react'],
  plugins: ['@babel/plugin-transform-optional-catch-binding'],
  babelrc: false,
  configFile: false,
  compact: false,
});

const reporter = `<script>
(function(){
  var errs=[];
  function show(){
    var r=document.getElementById('root');
    if(!r||(r.firstChild&&r.firstChild.id!=='boot'))return;
    r.innerHTML='<div style="padding:24px;font:15px/1.5 sans-serif;color:#1a2744">'
      +'<b>Maison Clara n\\'a pas pu démarrer.</b><br>'
      +(errs.length?errs.map(function(e){return String(e).replace(/</g,'&lt;')}).join('<br>')
        :'Aucune erreur signalée : vérifiez la connexion puis rechargez la page.')
      +'<br><small>version '+VERSION+'</small></div>';
  }
  window.addEventListener('error',function(e){
    var t=e.target;
    errs.push(t&&t.src?'Fichier non chargé : '+t.src:(e.message||'Erreur')+(e.lineno?' (ligne '+e.lineno+')':''));
    show();
  },true);
  window.addEventListener('unhandledrejection',function(e){errs.push('Erreur : '+(e.reason&&e.reason.message||e.reason));show();});
  setTimeout(show,8000);
})();
</script>`;

html = html.replace(babelRe, () =>
  `<script src="vendor/react.production.min.js"></script>\n` +
  `<script src="vendor/react-dom.production.min.js"></script>\n` +
  `<script>\n${code}\n</script>`);
// Texte visible sans JavaScript : s'il reste affiché, les scripts ne tournent pas.
const version = new Date().toISOString().slice(0, 16).replace('T', ' ');
const boot = `<div id="boot" style="padding:24px;font:15px/1.5 sans-serif;color:#1a2744">`
  + `Chargement de Maison Clara…<br><small>version ${version}</small></div>`;
html = html.replace('<div id="root"></div>', () =>
  `<div id="root">${boot}</div>\n${reporter.replace('VERSION', JSON.stringify(version))}`);

writeFileSync(new URL('index.html', root), html);
copyFileSync(new URL('node_modules/react/umd/react.production.min.js', root), new URL('vendor/react.production.min.js', root));
copyFileSync(new URL('node_modules/react-dom/umd/react-dom.production.min.js', root), new URL('vendor/react-dom.production.min.js', root));
console.log('index.html généré (' + html.length + ' octets)');
