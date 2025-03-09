import { k } from "./kaboomCtx";
import {currentBackgroundMusic} from "./globals";

// Ajustez le volume global des sons
k.volume(0.1);


let currentMusicBackground = null;

/**
 * Fonction pour jouer un son
 * @param {string} soundKey - La clé du son à jouer.
 */
export function playSound(soundKey) {
    k.play(soundKey);
}


export function playLoop() {
    if (currentMusicBackground === currentBackgroundMusic) {
        // Si le son est déjà en cours de lecture, ne rien faire
        return;
    }

    // Arrêter la musique actuelle si elle existe
    stopCurrentLoop();

    // Jouer le nouveau son en boucle et l'enregistrer comme musique actuelle
    currentMusicBackground = k.play(currentBackgroundMusic, { loop: true,volume: 0.5, });
    console.log(`Musique de fond actuelle : ${currentBackgroundMusic}`);
}

/**
 * Fonction pour arrêter le son en boucle actuel
 */
export function stopCurrentLoop() {
    console.log(currentMusicBackground)
    if (currentMusicBackground) {
        currentMusicBackground.stop(); // Arrêter le son en cours
        currentMusicBackground = null; // Réinitialiser la variable
        console.log("Musique de fond arrêtée.");
    }
}

/**
 * Fonction pour réinitialiser complètement la gestion des sons
 */
export function resetAllSounds() {
    stopCurrentLoop(); // Arrêter la musique actuelle
    console.log("Réinitialisation complète des sons.");
}

