# Kaboom Test Project

Ce projet utilise [Kaboom.js](https://kaboomjs.com/) et [esbuild](https://esbuild.github.io/) pour le développement de jeux. Le serveur live est utilisé pour le développement en temps réel.

## Prérequis

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

## Installation et démarrage du serveur live

1. Clonez ce dépôt ou téléchargez-le sous forme d'archive ZIP.
2. Ouvrez un terminal et accédez au répertoire du projet.
3. Exécutez la commande suivante pour installer les dépendances :
    ```
    npm install
    ```
4. Pour bundler votre fichier `main.js` et produire le fichier `build.js`, utilisez la commande suivante :
    ```
    npm run build
    ```
5. Après avoir bundlé le projet, démarrez le serveur live pour voir votre fichier `index.html` :
    ```
    npm run start
    ```
Cela démarrera `live-server` et ouvrira automatiquement votre navigateur à l'adresse par défaut (habituellement `http://127.0.0.1:8080`), où vous pourrez voir votre fichier `index.html` en temps réel.


