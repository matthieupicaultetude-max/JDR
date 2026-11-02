# SIGNAL — prototype narratif

Simulation locale pour cinq personnes sur trois jours, sans dépendance à installer.

## Lancer

Depuis `/workspace/JDR`, exécuter `npm start` (Python 3 requis), puis ouvrir le port 3000 dans l’outil d’aperçu de votre environnement. On peut aussi ouvrir `index.html` via tout serveur HTTP statique. Les modules JavaScript nécessitent HTTP.

## Tester une partie

1. Choisir un personnage dans la barre latérale, lire son secret, répartir ses unités et sélectionner une action personnelle. Enregistrer.
2. Passer aux autres personnages. Les messages peuvent être collectifs ou privés. Un engagement verbal ne modifie aucune décision.
3. Ouvrir « Vue de contrôle » pour inspecter les choix et résoudre la journée. Les absents conservent leurs réserves.
4. Consulter le bilan, revenir aux personnages et répéter jusqu’à la fin du troisième jour. Les morts deviennent spectateurs.
5. Exporter la partie au format JSON ou recommencer. La sauvegarde locale est automatique.

Les règles détaillées figurent dans la vue de contrôle. Deux problèmes quotidiens se disputent des ressources : les contributions sont dépensées seulement au succès ; l’effort produit après les contributions et peut tuer. La protection évite les dégâts du jour. Les seuils ne diminuent pas après une mort. Ce sont des paramètres de test, pas un équilibrage définitif.

## Validation

`npm test` exécute les tests du moteur : absence de réponse, mortalité, dépenses et remboursements, engagements modifiables, messages et parcours d’évacuation sur trois jours.

Le test navigateur optionnel `scripts/check-browser.cjs` vérifie aussi les envois dans un aperçu intégré sans permission de soumettre des formulaires, la validation, la confidentialité des messages entre vues et la persistance après rechargement. Avec le serveur démarré et Chromium installé :

```sh
npm install --prefix /tmp/signal-browser --no-package-lock --no-audit --no-fund playwright
NODE_PATH=/tmp/signal-browser/node_modules node scripts/check-browser.cjs
```

## Limites

Il s’agit d’un tableau de simulation sur un seul navigateur, pas d’un service multijoueur. Aucune authentification ni confidentialité technique : le contrôleur peut consulter tous les points de vue. Pas de notifications, d’horloge automatique ou de transmission réseau des messages. Les informations privées sont découvertes par changement de point de vue. Une future version multijoueur devra déplacer les secrets et la résolution côté serveur.
