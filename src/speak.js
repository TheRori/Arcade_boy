import {decouperTexte, getPlayerStateValue, hideMachineDisplay, setupMachineDisplay} from "./utils";
import {
    choix,
    dialogue,
    dialogueUI, direction, doc, getIsGameLaunched,
    imgHTMLContainer, infoUI, levelEnd, lvlMusic,
    perso1, resize, setCurrentBackgroundMusic, setDirection, setInDialogue, setSpeakState,
    showFullDialogueButton
} from "./globals";
import {addChoices} from "./choices";
import {handleObjectInteractions} from "./objects";
import {readMagazine} from "./documents";
import {k} from "./kaboomCtx";
import {playLoop, stopCurrentLoop} from "./sounds";
import {objs, map} from "./maps";

let currentDialogueIndex = 0;

export async function speak(categorie, idObj, idConv, endSpeech, mood) {
    const relations = {
        thomas: getPlayerStateValue("Sthomas"),
        camille: getPlayerStateValue("Scamille"),
        eric: getPlayerStateValue("Seric"),
        arnaud: getPlayerStateValue("Sarnaud")
    };
    const dials = await fetch("jsons/dials.json?" + Math.random()).then((res) => res.json());
    let data;
    currentDialogueIndex = 0;
    // Démarrer le dialogue
    setInDialogue(true);
    stopCurrentLoop();

    infoUI.style.display = "none";
    dialogueUI.style.display = "block";
    choix.style.display = "none";

    console.log(categorie, idObj, idConv, endSpeech, mood);

    console.log("Relation speak", relations);

    if (handleSpecialCases(idConv, endSpeech, categorie, idObj, mood)) return;

    if (categorie === "dialogues" || categorie === "objet") {
        data = dials.dialogues2.find(d => d.id === idConv);
        setupDialogueUI(data, mood);
        setCurrentBackgroundMusic(data.music || data.speaker);

        // Jouer la musique associée
        if (data?.music) playLoop(data.music);
    } else if (categorie === "documents") {
        console.log("Categorie is 'documents', processing document...");
        data = dials.objets.find(d => d.id === idConv);
        if (data) {
            setCurrentBackgroundMusic('document');

            console.log(`Processing document with ID: ${idConv}, Speaker: ${data.speaker}`);
            console.log(data);
            readMagazine("sprites/" + data.img);
        }
    }
    if (data) {
        // Ajout des interactions si nécessaire
        if (objs && map) {
            handleObjectInteractions(idConv, objs, map, k);
        }
        console.log('data',data,currentDialogueIndex);
        playLoop();

        const splitText = decouperTexte(data.speech, 175);
        console.log('text découpé : ',splitText);
        displayDialogue(data, splitText, currentDialogueIndex);

        const nextArrow = document.getElementById("next");
        if (currentDialogueIndex + 1 >= splitText.length) {
            finalizeDialogue(data, data.speech, nextArrow, endSpeech, categorie, idObj, idConv, mood);
        }
        else {
        const onNext = () => {
            if (currentDialogueIndex + 1 < splitText.length) {
                dialogue.innerHTML = `${data.speaker} : ${splitText[++currentDialogueIndex]}`;
            } else {
                nextArrow.removeEventListener("click", onNext);
                finalizeDialogue(data, data.speech, nextArrow, endSpeech, categorie, idObj, idConv, mood);
            }
        };

        nextArrow.style.display = "block";
        nextArrow.addEventListener("click", onNext);
        k.onKeyPress("e", onNext);}
    } else {
        resetDialogueUI();
    }
}


export function handleSpecialCases(idConv, endSpeech, categorie, idObj, mood) {
    if (idConv === -1) {
        stopCurrentLoop();
        resetDialogueUI();
        endSpeech();
        if (levelEnd) speak(categorie, idObj, 49, endSpeech, mood);
        return true;
    } else if (idConv === -10 || idConv === -20) {
        resetDialogueUI();
        endSpeech();
        transitionLevel(idConv === -10 ? 'loadScreen2' : 'loadScreen3');
        return true;
    } else if (idConv === -100) {
        resetDialogueUI();
        endSpeech();
        handleGameEnding();
        return true;
    }
    return false;
}


function handleGameEnding() {
    // Obtenez les valeurs de relation pour chaque personnage
    const relations = {
        thomas: getPlayerStateValue("Rthomas"),
        camille: getPlayerStateValue("Rcamille"),
        eric: getPlayerStateValue("Réric"),
        arnaud: getPlayerStateValue("Rarnaud")
    };

    // Trouver le(s) personnage(s) avec la valeur la plus haute
    const maxRelation = Math.max(...Object.values(relations));
    const candidates = Object.keys(relations).filter(key => relations[key] === maxRelation);

    console.log("Les candidats sont : ",candidates," avec ", maxRelation);

    // S'il y a plusieurs candidats, choisir au hasard
    const selectedEnding = candidates[Math.floor(Math.random() * candidates.length)];

    // Charger l'écran correspondant
    switch (selectedEnding) {
        case "thomas":
            k.go("endScreen1"); // Fin pour Thomas
            break;
        case "camille":
            k.go("endScreen2"); // Fin pour Camille
            break;
        case "eric":
            k.go("endScreen3"); // Fin pour Éric
            break;
        case "arnaud":
            k.go("endScreen4"); // Fin pour Arnaud
            break;
        default:
            console.error("Erreur : aucune fin valide sélectionnée !");
            break;
    }
}



export function setupDialogueUI(data, mood) {
    if (data) {
        console.log('données dialogues : ',data,'mood', mood);
        perso1.src = `sprites/${data.speaker}${mood || ""}.png`;
        imgHTMLContainer.style.display = 'block';
        perso1.style.display = data.speaker ? 'block' : 'none';
    }
}


export function displayDialogue(data, splitText) {
    if (data.machine.length > 0) {
        console.log(data.machine)
        setupMachineDisplay(data.machine);
    } else {
        hideMachineDisplay();
    }
    dialogue.innerHTML = `${data.speaker} : ${splitText[currentDialogueIndex]}`;
}


export function finalizeDialogue(data, splitText, nextArrow, endSpeech, categorie, idObj, idConv, mood) {
    nextArrow.style.display = 'none';
    /*showFullDialogueButton.style.display = 'block';
    showFullDialogueButton.addEventListener('click', () => toggleFullDialogue(data, splitText));*/
    dialogue.innerHTML = `${data.speaker} : ${splitText}`;
    console.log('before send choices',data);
    addChoices(data, categorie, data.speaker, idConv, idObj, endSpeech, mood);
}


/*
export function toggleFullDialogue(data, splitText) {
    const showFullDialogue = showFullDialogueButton.dataset.showFull === "true";
    if (showFullDialogue) {
        // Afficher seulement la ligne actuelle
        dialogue.innerHTML = `${data.speaker} : ${splitText[currentDialogueIndex]}`;
    } else {
        // Afficher tout le dialogue
        dialogue.innerHTML = data.speech;
    }
    showFullDialogueButton.textContent = showFullDialogue ? "Afficher tout" : "Masquer";
    showFullDialogueButton.dataset.showFull = !showFullDialogue;
}
*/


export function resetDialogueUI() {
    imgHTMLContainer.style.display = 'none';
    dialogueUI.style.display = 'none';
    doc.src = '';
    perso1.src = '';
    dialogue.innerHTML = '';
    choix.innerHTML = '';
    // Arrêter la musique de dialogue

    // Reprendre la musique de fond actuelle si définie
    if (lvlMusic) {
        setCurrentBackgroundMusic(lvlMusic);
        playLoop();
    }

    setInDialogue(false);

}

export function transitionLevel(screen) {
    resize.length = 0;
    setDirection('');
    k.go(screen);
}

