# Rapport Phase 1

La configuration web reçue cible le projet Firebase `rowmotion-ai` et a été intégrée sans créer de second projet.

Le miroir `sources/` demeure vide. Le schéma exact des documents et les règles Firestore ne peuvent donc être confirmés hors ligne. La page `/diagnostic-integration` effectue les lectures réelles après connexion et signale les collections absentes ou interdites.

La configuration Firebase Admin n’a pas été fournie. Les trois paramètres du compte de service sont obligatoires pour générer les cookies de session privés ; aucune valeur de substitution n’a été créée.
