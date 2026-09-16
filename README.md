# Maison Clara

Application web d'intendance, publiée avec GitHub Pages :
https://mdg64.github.io/Maison-Clara/

## Organisation

- `src/maison_clara.html` : la source (React en JSX, telle qu'éditée).
- `index.html` : **généré**, ne pas modifier à la main. Le JSX y est compilé
  à l'avance et React est servi depuis `vendor/`, sans dépendre d'unpkg.com
  ni de Babel dans le navigateur.
- `manifest.json` et les icônes : installation comme application sur tablette.

## Mettre à jour

Remplacer `src/maison_clara.html` (le fichier doit toujours charger React
et Babel depuis unpkg.com : le build retire ces trois lignes), puis :

    npm install
    npm run build
    git add -A
    git commit -m "maj"
    git push

Le site est rafraîchi une à deux minutes plus tard.

## Note sur les données

Les données saisies sont stockées dans le `localStorage` du navigateur :
elles restent sur la tablette qui les a saisies et ne se synchronisent pas
d'un appareil à l'autre.
