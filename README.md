# RowMotion Race

Application web responsive de gestion des competitions d'aviron, reliee au projet Firebase `rowmotion-ai`.

## Interface

- identite visuelle officielle RowMotion Race ;
- navigation adaptee aux mobiles et aux ordinateurs ;
- tableau de bord de competition ;
- sequence de depart PRET -> ATTENTION -> GO ;
- chronometrage au millieme et arrivees protegees contre le double clic ;
- resultats provisoires, programme et classements ;
- apercu local des participants sans ecriture automatique dans Firebase.

## Installation mobile et ordinateur

RowMotion Race est une Progressive Web App (PWA). Une fois publiee en HTTPS, elle peut etre installee depuis les navigateurs modernes sur Android, iPhone/iPad, Windows, macOS et ChromeOS.

Le bouton `Installer l'app` declenche l'installation native lorsqu'elle est disponible. Si le navigateur ne propose pas de fenetre d'installation, le bouton affiche les instructions adaptees a l'appareil :

- iPhone/iPad : Safari -> Partager -> Ajouter a l'ecran d'accueil ;
- Android : menu du navigateur -> Installer l'application ou Ajouter a l'ecran d'accueil ;
- macOS Safari : Fichier -> Ajouter au Dock ;
- Windows/macOS/Linux avec Chrome, Edge ou Brave : icone d'installation dans la barre d'adresse ou menu du navigateur.

Le manifeste, le service worker, les icones 192/512, l'icone maskable, l'icone Apple, les captures d'installation et une page hors ligne sont inclus dans le projet.

Les fichiers de marque se trouvent dans `public/brand/` :

- `rowmotion-race-icon.png` ;
- `rowmotion-race-logo.png` ;
- `rowmotion-race-mobile-showcase.png` ;
- `favicon.png`.

## Firebase

La configuration Firebase web et l'identifiant Analytics fournis sont enregistres dans `.env.local`. Ce fichier est ignore par Git.

L'authentification serveur securisee necessite encore :

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

Ces valeurs proviennent d'un compte de service Firebase Admin et ne doivent jamais etre exposees dans le code client.

## Garanties d'integrite

- lecture des collections RowMotion AI existantes ;
- aucune creation automatique d'athlete, club ou compte ;
- references conservees par identifiant ;
- routes privees protegees par une session Firebase ;
- Analytics initialise uniquement cote navigateur lorsque le SDK est compatible.

## Lancer le projet

```bash
npm install
npm run dev
```

Verification complete :

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
