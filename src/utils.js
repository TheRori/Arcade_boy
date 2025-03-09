import {k} from "./kaboomCtx";
import {imgHTMLContainer, isInDialogue, machineHTML, perso1, statePlayer} from "./globals";
import {map} from "./maps";
import {animateRelationChange} from "./inventory";
import {set_video} from "./video";


// Fonction pour découper un texte en segments
export function decouperTexte(texte, seuil) {
    if (texte.length <= seuil) return [texte];
    const mots = texte.split(" ");
    const parties = [];
    let partieActuelle = "";

    for (const mot of mots) {
        if ((partieActuelle.length + mot.length) <= seuil) {
            partieActuelle += (partieActuelle ? " " : "") + mot;
        } else {
            parties.push(partieActuelle);
            partieActuelle = mot;
        }
    }
    if (partieActuelle) parties.push(partieActuelle);
    return parties;
}

// Fonction pour obtenir la valeur d'une clé spécifique dans l'état du joueur
export function getPlayerStateValue(key) {
    const state = statePlayer.find(obj => obj.hasOwnProperty(key));
    return state ? state[key] : undefined;
}

// Fonction pour mettre à jour une clé dans l'état du joueur
export function setPlayerStateValue(key, newValue) {
    let state = statePlayer.find(obj => obj.hasOwnProperty(key));
    if (!state) {
        // Si la clé n'existe pas encore, on la crée et on ajoute au state
        state = { [key]: newValue };
        statePlayer.push(state);

        // Ajoute une animation pour un changement initial
        animateRelationChange(key, newValue);
    } else {
        const oldValue = state[key];
        if (typeof newValue !== "boolean") {
            state[key] = newValue - oldValue;
        }
        else {
            state[key] = newValue;
        }

        console.log(key,'a changé en', newValue);
        if (typeof newValue !== "boolean") {
        console.log('rel changes',state[key],key);
            animateRelationChange(key, newValue - oldValue);
        }}
}


// Fonction pour vérifier si une condition est remplie
export function evaluateCondition(playerValue, operator, value) {
    return new Function('playerValue', 'value', `return playerValue ${operator} value;`)(playerValue, value);
}

// Fonction pour vérifier si toutes les conditions sont remplies
export function areAllConditionsMet(conditions, statePlayer) {
    return conditions.every(({ key, operator, value }) => {
        const playerValue = getPlayerStateValue(key, statePlayer);
        if (playerValue === undefined || operator === undefined || value === undefined) return false;
        return evaluateCondition(playerValue, operator, value);
    });
}

export function setupDialogueOverlay() {
    const scaleX = k.width() / map.width;
    const scaleY = k.height() / map.height;
    k.onDraw(() => {
        if (isInDialogue) {
            k.drawRect({
                width: 32 * 38 * scaleX,
                height: 32 * 23 * scaleY,
                pos: k.vec2(0),
                color: k.rgb(0, 0, 0),
                opacity: 1,
            });
        }
    });
}

// Fonction pour afficher un message de journalisation (debugging)
export function logMessage(message) {
    console.log(message);
}

export function hideMachineDisplay() {
    perso1.style.display = "block"; // Réaffiche le sprite du personnage
    machineHTML.style.display = "none";
    set_video(""); // Réinitialise la vidéo
    machineHTML.src = ""; // Réinitialise l'image ou le sprite
}


export function setupMachineDisplay(machineData) {

    imgHTMLContainer.style.display = "block";
    // Masque le sprite du personnage
    perso1.style.display = "none";
    // Affiche la machine (image et vidéo)
    machineHTML.style.display = "flex";

    // Vérifie si machineData contient une vidéo avec un temps de démarrage
    if (Array.isArray(machineData[1])) {
        const [videoPath, startTime] = machineData[1];
        set_video(videoPath, startTime); // Appelle set_video avec un lien et un temps de démarrage
    } else {
        set_video(machineData[1]); // Appelle set_video avec seulement le lien
    }

    // Définit l'image ou le sprite
    machineHTML.src = "sprites/" + machineData[0];
}

