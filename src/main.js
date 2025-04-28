// Import des modules nécessaires
import { k } from "./kaboomCtx";
import { loadAllResources } from "./loader";
import { fetchMapData } from "./maps";
import {loadScene, levelScene, mainMenuScene, howToPlayScene, howToPlayForcedScene, aboutScene} from "./scenes";

// Charger les ressources (sprites, sons, polices, etc.)
loadAllResources();

// Charger les données des cartes
(async () => {
    try {
        await fetchMapData(); // Charge les cartes depuis les fichiers JSON
        console.log("Cartes chargées avec succès.");
    } catch (error) {
        console.error("Erreur lors du chargement des cartes :", error);
    }
})();

// Définir les scènes
loadScene(
    "loadScreen1",
    "ld1", // Sprite pour l'écran de chargement
    "1986, petite ville du centre de l'Europe, Pierre est un jeune adolescent passioné d'électronique domaine dans lequel il effectue son apprentissage. Mais passé du temps derrière les bornes d'arcades et surtout, passé du temps avec sa bande d'amis derrière les bornes d'arcades de la salle de jeu de sa ville, ça c'est ce qui habite le plus joyeusement sa vie d'ado. Son père vient de l'appeler dans son garage, connu également comme son refuge pour bricoler ses câbles dont il a réussi à transmettre sa passion à son fils. Il veut lui montrer quelque chose...",
    "level0",
    "lvl1"// Scène suivante
);

loadScene(
    "loadScreen2",
    "ld2", // Sprite pour l'écran de chargement
    "Pierre enfile sa veste en cuir, attrape les clés de la maison, et claque la porte derrière lui. En descendant les marches de l'escalier familier, il ressent une légère excitation monter en lui. La fraîcheur de la soirée lui pique le visage alors qu'il traverse le jardin de ses parents, éclairé par la lueur jaune des réverbères. Le grincement du portail en fer est presque couvert par le bruissement des feuilles agitées par le vent. Il marche d'un pas rapide le long des trottoirs qu'il connaît par cœur, ses chaussures frappant le pavé avec régularité. Les rires étouffés et les échos des conversations animées s'échappent des fenêtres entrouvertes, tandis que Pierre se dirige vers le bar où l'attendent déjà ses amis, sans doute déjà occupés derrière les bornes.",
    "level2",
    'lvl2'
);

loadScene(
  'loadScreen4',
  'ld4',
    'Quelques jours plus tard… Après une semaine marquée par les défis de l\'apprentissage et les soirées à partager des moments avec sa bande d\'amis, Pierre se retrouve à vivre une expérience différente. Aujourd’hui, il participe à une visite organisée par son école à l’École Polytechnique Fédérale de Lausanne. L’occasion : une démonstration exceptionnelle du Smaky, un ordinateur suisse révolutionnaire. Au-delà des circuits et des lignes de code, cette journée pourrait bien offrir à Pierre une nouvelle perspective sur son avenir, entre technologie et passion.',
  'level4',
    'lvl3'
);

loadScene(
    'endScreen1',
    'ed1',
    'Sous les néons clignotants de la salle d’arcade, Pierre et Thomas s’accordent une trêve bienvenue. Une bière à la main, le tintement des pièces et les musiques de Tetris couvrent les bruits du monde extérieur. Les records tombent, les défis s’enchaînent, et entre les rires, les soucis familiaux s’éclipsent. Ici, autour des bornes, la complicité se renforce, rappelant que parfois, une soirée entre amis suffit à tout alléger.',
    'mainMenu'
);

loadScene(
    'endScreen2',
    'ed2',
    'Dans le garage de son père, Camille découvre l’Apple II avec des étoiles dans les yeux. Fascinée par l’ordinateur, elle explore chaque détail, écoutant avec attention les explications de Pierre et son père. Sous la lumière tamisée, une passion commune s’éveille, tandis que tous trois réalisent qu’ils sont témoins du début d’une nouvelle ère pour les ordinateurs personnels.',
    'mainMenu'
);

loadScene(
    'endScreen3',
    'ed3',
    'Dans le salon d’Arnaud, la nouvelle console NES trône fièrement sous la télévision. Les deux amis, manettes en main, s’immergent dans des mondes colorés et dynamiques. Entre exclamations et éclats de rire, ils réalisent que cette petite machine marque le début d’une nouvelle ère pour le jeu vidéo. Une révolution vient de commencer, et ils sont aux premières loges.',
    'mainMenu'
);

loadScene(
    'endScreen4',
    'ed4',
    'Dans la salle d’arcade, Éric fixe la nouvelle borne d’un jeu d’aventure avec un émerveillement presque enfantin. Tandis que l’écran s’allume et dévoile un univers riche et captivant, il s’installe aux commandes, prêt à vivre une nouvelle histoire. Pas de scores à battre ou de records à afficher, juste une quête à explorer et un monde à découvrir. À ses côtés, tu partages son enthousiasme, convaincu que ce genre de jeux est fait pour lui. Une immersion totale, loin de la compétition effrénée, et une aventure qui restera gravée dans vos mémoires.',
    'mainMenu'
);


loadScene(
    "loadScreen3",
    "ld3", // Sprite pour l'écran de chargement
    "Il monte sur son vélomoteur allume le moteur, et se met en mouvement pour emprunter les 800 mètres de bitume qu'il connait par coeur et qui le sépare de chez lui. Les pétarades du peugeot s'éloignent dans la nuit tombante alors que le bruit des sticks matraqués, voix élecroniques annonçant un game over ou un meilleur score retentissent encore.",
    "loadScreen4" // Scène suivante
);

levelScene(
    0, // Numéro du niveau
    "garage", // Nom de la carte (pour JSON)
    "garage", // Sprite utilisé
    0, // Position X du joueur
    k.height()/2, // Position Y du joueur
    "lvl1" // Musique associée
);

levelScene(
    1,
    "thomas_bar",
    "thomas_bar",
    k.width() / 2,
    k.height()/2
);

levelScene(
    2,
    "bar",
    "bar",
    k.width() / 2,
    k.height()/2,
    "lvl2"
);

levelScene(
    3,
    "eric_bar",
    "eric_bar",
    k.width() / 2,
    k.height()/2
);

levelScene(
    4,
    "university",
    "university",
    k.width() / 2,
    k.height()/2,
    'lvl3'
);

// Définir le menu principal
mainMenuScene();
howToPlayScene();
howToPlayForcedScene();
aboutScene();

// Démarrer avec le menu principal
k.go("mainMenu");

// --- Redimensionnement par rechargement de la page ---
let resizeTimeout;
let currentSceneName = "mainMenu"; // Variable pour suivre la scène actuelle

// Intercepter les changements de scène
const originalGo = k.go;
k.go = (sceneName) => {
    currentSceneName = sceneName;
    console.log("Changement de scène vers:", sceneName);
    return originalGo(sceneName);
};

window.addEventListener('resize', () => {
    // Utiliser un délai pour éviter les rechargements multiples pendant le redimensionnement
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Sauvegarder la scène actuelle dans l'URL
        window.location.href = window.location.pathname + '?scene=' + currentSceneName;
    }, 500); // Attendre 500ms après la fin du redimensionnement
});

// Vérifier s'il faut restaurer une scène au chargement (depuis l'URL)
window.addEventListener('DOMContentLoaded', () => {
    // Récupérer le paramètre de scène depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const sceneParam = urlParams.get('scene');
    
    if (sceneParam && sceneParam !== 'mainMenu') {
        console.log("Restauration de la scène depuis l'URL:", sceneParam);
        // Attendre que tout soit initialisé
        setTimeout(() => {
            k.go(sceneParam);
        }, 1000);
    }
});
