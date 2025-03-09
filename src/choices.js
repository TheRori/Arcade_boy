import {
    choix,
    getCurrentLevel, getIsGameLaunched,
    getLevelEnd,
    perso2,
    selectedChoices,
    setLevelEnd,
    showFullDialogueButton, statePlayer, statePlayerlvl2
} from "./globals";
import {getPlayerStateValue, setPlayerStateValue} from "./utils";
import {speak} from "./speak";
import {addDocumentToInventory, handleInventoryInteractions, updateInventory} from "./inventory";
import {k} from "./kaboomCtx";
import {objs} from "./maps";
import {displayBasicGame, launchBasicGame} from "./basicGames";

let dialogue = null;

export function addChoices(dial, categorie, speaker, idConv, idObj, endSpeech) {
    dialogue = dial;
    const choices = dial.choices;
    perso2.src = '/sprites/Pierre.png';
    perso2.style.display = 'block';
    console.log(dial.choices);
    if (!getIsGameLaunched()) choix.style.display = 'block';

    ensureSelectedChoicesEntry(idConv);
    console.log(selectedChoices)
    choix.innerHTML = choices.map((choice, i) => {
        if (isChoiceSkipped(choice, idConv, i)) return '';
        return buildChoiceHTML(choice, i);
    }).join('');

    setupChoiceEventListeners(choices, categorie, idConv, idObj, speaker, endSpeech);
}

function ensureSelectedChoicesEntry(idConv) {
    if (!selectedChoices[idConv]) {
        selectedChoices[idConv] = new Set();
    }
}

function isChoiceSkipped(choice, idConv, index) {
    return selectedChoices[idConv].has(index) && !choice.alwaysVisible;
}

function buildChoiceHTML(choice, index) {
    if (choice.need && !areAllConditionsMet(choice.need)) return '';
    return `
        <img class="arrowChoice" src="../sprites/arrow_choice.png">
        <p class="choixVar" id="${index}">${choice.speech}</p>
    `;
}

function areAllConditionsMet(conditions) {
    return conditions.every(({ key, operator, value }) => {
        const playerValue = getPlayerStateValue(key);
        if (playerValue === undefined || operator === undefined || value === undefined) return false;
        return new Function('playerValue', 'value', `return playerValue ${operator} value;`)(playerValue, value);
    });
}

function setupChoiceEventListeners(choices, categorie, idConv, idObj, speaker, endSpeech, mood) {
    const choixVarHTML = document.querySelectorAll(".choixVar");

    choixVarHTML.forEach((el) => {
        el.addEventListener('click', () => handleChoiceClick(el, choices, categorie, idConv, idObj, speaker, endSpeech, mood));
        el.addEventListener('mouseover', () => k.play('choice'));
    });
}

export function processChoiceModifiers(modifiers, mood) {
    if (!modifiers || modifiers.length === 0) return mood;

    modifiers.forEach(({ key, operator, value }) => {
        console.log(key, operator, value);
        const stateValue = getPlayerStateValue(key);

        let newValue;

        // Vérifier si la valeur est un booléen
        if (typeof value === "boolean") {
            console.log('value',value);
            if (operator === "==") newValue = stateValue === value;
            else if (operator === "!=") newValue = stateValue !== value;
            else if (operator === "&&") newValue = stateValue && value;
            else if (operator === "||") newValue = stateValue || value;
            else if (operator === "=") newValue = value; // Affectation directe
            else {
                console.error(`Opérateur non pris en charge pour les booléens : ${operator}`);
                return;
            }
        } else {
            // Si c'est un nombre, on utilise la fonction dynamique
            newValue = new Function('stateValue', 'value', `return stateValue ${operator} value;`)(stateValue, value);
        }

        console.log(newValue);
        setPlayerStateValue(key, newValue);

        // Gestion du mood uniquement si la valeur est numérique
        if (typeof stateValue === "number" && typeof newValue === "number") {
            if (newValue < stateValue) mood = '_angry';
            else if (newValue > stateValue) mood = '_happy';
            else mood = '';
        }
        console.log(newValue, 'mood', mood);
    });

    return mood;
}


export function checkAndSetLevelEnd() {
    let changedKeysCount = 0;

    // Comparer chaque clé entre les deux états
    statePlayer.forEach((state, index) => {
        const stateLvl2 = statePlayerlvl2[index];
        for (const key in state) {
            console.log(stateLvl2,state);
            if (state[key] !== stateLvl2[key]) {
                changedKeysCount++;
            }
        }
    });
    console.log('clés changées',changedKeysCount);
    if (changedKeysCount >= 3) {
        console.log('fin?', changedKeysCount);
        setLevelEnd(true);
        console.log('Level end triggered');
    }

}

function handleChoiceClick(el, choices, categorie, idConv, idObj, speaker, endSpeech, mood) {
    showFullDialogueButton.style.display = 'none';
    k.play('choice');

    const choiceIndex = parseInt(el.id);
    if (!choices[choiceIndex].alwaysVisible) {
        selectedChoices[idConv].add(choiceIndex);
    }

    if (categorie === "dialogues") {
        // Récupère le mood mis à jour
        mood = processChoiceModifiers(choices[choiceIndex].modifiers, mood);
        const action = choices[choiceIndex].action;
        if (action) {
            executeAction(action, endSpeech);
        }
        if ( !getLevelEnd() && (getCurrentLevel() === 1|| getCurrentLevel() === 2|| getCurrentLevel() === 3)) {
            checkAndSetLevelEnd();
        }
    }

    const nextId = choices[choiceIndex].nextId;
    if (categorie === 'documents' && choices[choiceIndex].remember) {
        addDocumentToInventory(dialogue, speaker, idObj);
    }

    if (nextId === 0) {
        console.log('ouverture de l\'inventaire')
        handleInventoryInteractions("dialogues",idObj, idConv, endSpeech, mood);
    } else {
        choix.innerHTML = '';
        console.log('moood', mood);
        speak(categorie, idObj, nextId, endSpeech, mood); // Passe le mood mis à jour
    }
}


function executeAction(action, endSpeech) {
    if (action === "launchBasicGame") {
        launchBasicGame(endSpeech);
    } else if (action === "displayBasicGame") {
        displayBasicGame();
    }
}

