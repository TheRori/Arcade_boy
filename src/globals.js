
// DOM Elements
export const dialogueUI = document.getElementById('dialogueUI');
export const infoUI = document.getElementById("info-container");
export const doc = document.getElementById('doc');
export const perso1 = document.getElementById('perso1');
export const perso2 = document.getElementById('perso2');
export const imgHTMLContainer = document.getElementById('imgContainer');
export const magazines = document.getElementById('magazines');
export const dialogue = document.getElementById('dialogue');
export const choix = document.getElementById('choix');
export const showFullDialogueButton = document.getElementById('showFullDialogue');
export const machineHTML = document.getElementById('machine');
export const basicGame = document.getElementById('basic-game-container');


// Game State
export const selectedChoices = {};
export let lvlMusic = '';
export let statePlayer = [{"Rpapa" : 0},{"Rcamille" : 0},{"Réric" : 0},{"Rarnaud": 0},{"Rthomas": 0},{"Scamille" : false}, {"Sarnaud" : false}];
export let statePlayerlvl2 = [];
export let inventoryPlayer = [  ];
export const resize = [];
export let levelEnd = false;
export let currentLevel;
export let levelLoaded = false;
export let loadedMaps = {};
export let direction = '';
export let objectCache = {};
export let isInDialogue = false;
export let isGameLaunched = false;
export let currentBackgroundMusic = '';
// Getter and Setter for levelEnd
export function getLevelEnd() {
    return levelEnd;
}

export function setlevelLoaded(value){
    levelLoaded = value;
}

export function setobjectCache(lvl, value, index = 0) {
    // Si le niveau n'existe pas encore dans le cache, initialisez-le
    if (!objectCache[lvl]) {
        objectCache[lvl] = [];
    }

    if (index !== null) {
        // Ajoutez ou remplacez un objet spécifique à un index donné
        objectCache[lvl][index] = value;
    } else if (Array.isArray(value)) {
        // Si une liste complète est fournie, ajoutez-la ou remplacez le tableau entier
        objectCache[lvl] = value;
    } else {
        // Ajoutez un seul objet à la fin si aucun index spécifique n'est fourni
        objectCache[lvl].push(value);
    }

    console.log(`Cache mis à jour pour le niveau ${lvl} :`, objectCache[lvl]);
}
export function setLevelEnd(value) {
    levelEnd = value;
    console.log(`levelEnd set to: ${value}`); // Debugging purpose
}
export function setCurrentBackgroundMusic(musicKey) {
    currentBackgroundMusic = musicKey;
}
export function setLvlMusic(value) {
    lvlMusic = value;
}
export function getLvlMusic() {
    return lvlMusic;
}
export function setInDialogue(value) {
    isInDialogue = value;
}

export function setCurrentLevel(value) {
    currentLevel = value;
}

export function getCurrentLevel() {
    return currentLevel;
}

export function setIsGameLaunched(value) {
    isGameLaunched = value;
}

export function getIsGameLaunched() {
    return isGameLaunched;
}
export function setDirection(value) {
    direction = value;
}
export function setPlayerStatelvl2(playerState) {
    // Copie profonde de statePlayer dans statePlayerlvl2
    statePlayerlvl2.length = 0; // Réinitialise le tableau
    playerState.forEach((state) => {
        statePlayerlvl2.push(JSON.parse(JSON.stringify(state)));
    });
}
