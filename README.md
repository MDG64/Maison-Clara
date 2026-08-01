# Maison Clara

Application web d'intendance (page HTML autonome, React via CDN).

Publiée avec GitHub Pages : le fichier servi est `index.html`.

## Mettre à jour

Remplacer `index.html`, puis :

    git add index.html
    git commit -m "maj"
    git push

Le site est rafraîchi une à deux minutes plus tard.

## Note sur les données

Les données saisies sont stockées dans le `localStorage` du navigateur :
elles restent sur la tablette qui les a saisies et ne se synchronisent pas
d'un appareil à l'autre.
