# RowMotion Race

Application web responsive de gestion des compétitions d'aviron, reliée au projet Firebase `rowmotion-ai`.

## Interface

- identité visuelle officielle RowMotion Race ;
- navigation adaptée aux mobiles et aux ordinateurs ;
- tableau de bord de compétition ;
- séquence de départ PRÊT → ATTENTION → GO ;
- chronométrage au millième et arrivées protégées contre le double clic ;
- résultats provisoires, programme et classements ;
- aperçu local des participants sans écriture automatique dans Firebase.

Les fichiers de marque se trouvent dans `public/brand/` :

- `rowmotion-race-icon.png` ;
- `rowmotion-race-logo.png` ;
- `rowmotion-race-mobile-showcase.png` ;
- `favicon.png`.

## Firebase

La configuration Firebase web et l'identifiant Analytics fournis sont enregistrés dans `.env.local`. Ce fichier est ignoré par Git.

L'authentification serveur sécurisée nécessite encore :

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

Ces valeurs proviennent d'un compte de service Firebase Admin et ne doivent jamais être exposées dans le code client.

## Garanties d'intégrité

- lecture des collections RowMotion AI existantes ;
- aucune création automatique d'athlète, club ou compte ;
- références conservées par identifiant ;
- routes privées protégées par une session Firebase ;
- Analytics initialisé uniquement côté navigateur lorsque le SDK est compatible.

## Lancer le projet

```bash
npm install
npm run dev
```

Vérification complète :

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
