import { k } from "./kaboomCtx";


const videoConfig = {
    "smaky_demo.mp4": {
        transform: "rotate(0deg) scale(1)",
        filter: "brightness(1)",
        styles: {
            transform: 'rotate(5deg) scale(1)',
            width: '13%',
            left: '8.5%',
            top: '4%',
            marginLeft: '10%',
            marginTop: '8.5%',
        },
    },
    "indiana_jones.mp4": {
        filter: "brightness(1.2) contrast(0.9)",
        styles: {
            width: '13%',
            left: '0%',
            top: '0%',
            marginLeft: '10%',
            marginTop: '8.5%',
        },
    },
    "space_invaders.mp4": {
        filter: "brightness(1.2) contrast(0.9)",
        styles: {
            width: '13%',
            left: '0%',
            top: '0%',
            marginLeft: '10%',
            marginTop: '8.5%',
        },
    },
    "default": {
        transform: "none",
        filter: "none",
        styles: {
            width: "100%",
            left: "0",
            top: "0",
            marginLeft: "0",
            marginTop: "0",
        },
    },
};

// Fonction pour récupérer la configuration vidéo
export function getVideoConfig(videoName) {
    return videoConfig[videoName] || videoConfig["default"];
}

// Fonction pour charger les polices
export function loadFonts() {
    k.loadFont("PressStart2P", "fonts/PressStart2p-vaV7.ttf");
}

// Fonction pour charger les sprites
export function loadSprites() {
    const sprites = [
        { name: "ld1", path: "sprites/ld1.png" },
        { name: "menu", path: "sprites/menu.png" },
        { name: "ld2", path: "sprites/ld2.png" },
        { name: "ld3", path: "sprites/ld3.png" },
        { name: "ld4", path: "sprites/ld4.png" },
        { name: "ed1", path: "sprites/ed1.png" },
        { name: "ed2", path: "sprites/ed2.png" },
        { name: "ed3", path: "sprites/ed3.png" },
        { name: "ed4", path: "sprites/ed4.png" },
        { name: "garage", path: "sprites/garage.png" },
        { name: "map", path: "sprites/map.png" },
        { name: "bar", path: "sprites/bar.png" },
        { name: "eric_bar", path: "sprites/eric_bar.png" },
        { name: "university", path: "sprites/university.png" },
        { name: "thomas_bar", path: "sprites/thomas_bar.png" },
        { name: "np_construire", path: "sprites/np_construire.png" },
        { name: "np_appleII", path: "sprites/np_appleII.png" },
        { name: "np_coin", path: "sprites/np_coin.png" },
        { name: "np_kingsquest", path: "sprites/np_kingsquest.png" },
        { name: "np_nesad", path: "sprites/np_nesad.png" },
    ];

    sprites.forEach(({ name, path }) => k.loadSprite(name, path));

    // Charger les atlas de sprites
    k.loadSpriteAtlas("sprites/Male4.png", {
        father: {
            x: 0,
            y: 192,
            width: 256,
            height: 576,
            sliceX: 8,
            sliceY: 12,
            anims: {
                stand: { from: 0, to: 0 },
            },
        },
    });

    k.loadSpriteAtlas("sprites/teen.png", {
        teen: {
            x: 0,
            y: 0,
            width: 2048,
            height: 1435,
            sliceX: 8,
            sliceY: 3,
            anims: {
                stand: { from: 0, to: 0 },
                walksD: { from: 0, to: 7, speed: 8, loop: true },
                walksL: { from: 0, to: 7, speed: 8, loop: true },
                walksR: { from: 0, to: 7, speed: 8, loop: true },
                walksU: { from: 0, to: 7, speed: 8, loop: true },
            },
        },
    });
}

// Fonction pour charger les sons
export function loadSounds() {
    const sounds = [
        { name: "lvl1", path: "music/The_Great_Machine.mp3" },
        { name: "dial", path: "music/dial.mp3" },
        { name: "win", path: "music/win.mp3" },
        { name: "loose", path: "music/loose.mp3" },
        { name: "toggleUI", path: "music/toggleUI.wav" },
        { name: "choice", path: "music/choice.mp3" },
        { name: "Arnaud", path: "music/Arnaud.mp3" },
        { name: "Papa", path: "music/Papa.mp3" },
        { name: "Camille", path: "music/Camille.mp3" },
        { name: "Éric", path: "music/Eric.mp3" },
        { name: "Professeur", path: "music/chill-synthwave.mp3" },
        { name: "Thomas", path: "music/Thomas.mp3" },
        { name: "lvl2", path: "music/bar.mp3" },
        { name: "lvl3", path: "music/chill-synthwave.mp3" },
        { name: "document", path: "music/documents.mp3" },
    ];
    sounds.forEach(({ name, path }) => k.loadSound(name, path));
}

// Fonction pour charger un fichier JSON unique
export async function loadJSONData(filePath) {
    try {
        const response = await fetch(filePath + "?" + Math.random()); // Ajout d'un cache-buster
        if (!response.ok) {
            throw new Error(`Erreur de chargement JSON: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors du chargement du fichier ${filePath}:`, error);
        return {}; // Retourner un objet vide en cas d'erreur
    }
}

// Fonction pour charger plusieurs fichiers JSON
export async function loadMultipleJSON(filePaths) {
    const data = {};
    for (const path of filePaths) {
        data[path] = await loadJSONData(path);
    }
    return data;
}

// Fonction pour charger toutes les ressources
export function loadAllResources() {
    loadFonts();
    loadSprites();
    loadSounds();
    console.log("Toutes les ressources ont été chargées.");
}
