import { markObjectAsDeleted, objs } from "./maps";
import {dialogue, inventoryPlayer, isInDialogue, statePlayer} from "./globals";
import { k } from "./kaboomCtx";
import {speak} from "./speak";
import {openLightBox, readMagazine} from "./documents";
import {playSound} from "./sounds";

export function updateInventory() {
    const inventaireElement = document.getElementById('inventaire');
    inventaireElement.innerHTML = '';

    // Ajouter le bouton de fermeture
    const closeButton = createCloseButton();
    inventaireElement.appendChild(closeButton);

    // Afficher les objets dans l'inventaire
    inventoryPlayer.forEach(item => {
        const itemElement = createInventoryItem(item);
        inventaireElement.appendChild(itemElement);
    });

    // Afficher les relations avec animation
    const relationElementContainer = document.getElementById('relations');
    relationElementContainer.innerHTML = '';
    statePlayer.forEach(rel => {
        Object.entries(rel).forEach(([key, value]) => {
            if (value !== null) {
                const relationElement = createRelationElement(key, value);
                relationElementContainer.appendChild(relationElement);
            }
        });
    });
}

export function handleInventoryInteractions(categorie, idObj, idConv, endSpeech, mood) {
    toggleInventory();
    const inventaireElement = document.getElementById('inventaire');
    // Parcourir les items de l'inventaire
    inventoryPlayer.forEach(item => {
        const itemElement = document.getElementById(item.id);
        console.log(item.targetObj);
        if (itemElement) {
            itemElement.addEventListener('click', () => {
                if (idConv === item.targetObj) {
                    document.getElementById('inventory-container').style.display = 'none';
                    console.log(categorie)
                    speak(categorie, idObj, parseInt(itemElement.id), endSpeech, mood);
                } else {
                    dialogue.innerHTML = "C'est gentil mais je n'en ai pas besoin.";
                    toggleInventory();
                }
            });
        }
    });
}

function createCloseButton() {
    const closeButton = document.createElement('div');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        document.getElementById('inventory-container').style.display = "none";
    });
    return closeButton;
}

function createInventoryItem(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('inventory-item');

    const imgElement = document.createElement('img');
    imgElement.src = item.img;
    imgElement.id = item.id;

    const textElement = document.getElementById("textInventory");
    imgElement.addEventListener('mouseenter', () => {
        textElement.style.display = 'block';
        textElement.textContent = item.speech;
    });
    imgElement.addEventListener('mouseleave', () => {
        textElement.style.display = 'none';
    });
    if (!isInDialogue) imgElement.addEventListener('click', () => openLightBox(item.img));

    itemElement.appendChild(imgElement);
    return itemElement;
}

function createRelationElement(key, value) {
    const relElement = document.createElement('div');
    relElement.className = 'relation';

    const imgRelHTML = document.createElement('img');
    imgRelHTML.className = 'relation-img';
    imgRelHTML.src = '/sprites/' + getImageName(key);
    imgRelHTML.alt = key;

    const relationValueHTML = document.createElement('span');
    relationValueHTML.className = 'relationValue';
    relationValueHTML.dataset.key = key;
    addHeartsToRelation(relationValueHTML, value);

    relElement.appendChild(imgRelHTML);
    relElement.appendChild(relationValueHTML);
    return relElement;
}

function addHeartsToRelation(container, value) {
    const heartType = value >= 0 ? '♥' : '♡';
    for (let i = 0; i < Math.abs(value); i++) {
        const heart = document.createElement('span');
        heart.className = value >= 0 ? 'heart filled' : 'heart empty';
        heart.innerHTML = heartType;
        container.appendChild(heart);
    }
}

export function animateRelationChange(key, delta) {
    const inventoryUI = document.getElementById("inventory-container");

    // Si l'inventaire n'est pas déjà affiché, on l'ouvre avec un fondu
    if (inventoryUI.style.display !== "block") {
        inventoryUI.style.display = "block";
        inventoryUI.style.opacity = "0"; // Démarre transparent
        inventoryUI.style.transition = "opacity 0.5s ease"; // Transition pour l'apparition
        setTimeout(() => {
            inventoryUI.style.opacity = "1"; // Fait apparaître progressivement
        }, 10);
    }

    // Attendre que l'inventaire soit visible avant de lancer l'animation des cœurs
    setTimeout(() => {
        const relationValueHTML = document.querySelector(`.relationValue[data-key="${key}"]`);

        if (!relationValueHTML) {
            console.error(`Relation element with key "${key}" not found!`);
            return;
        }

        const heart = document.createElement('span');
        if (delta >= 0) {
            playSound('win'); // Joue le son de victoire
        } else {
            playSound('loose'); // Joue le son de défaite
        }
        heart.className = delta > 0 ? "heart-animation add" : "heart-animation remove";
        heart.innerHTML = delta > 0 ? "♥" : "♡";

        document.body.appendChild(heart);

        const rect = relationValueHTML.getBoundingClientRect();

        heart.style.position = "absolute";
        heart.style.top = `${rect.top + window.scrollY}px`; // Prend en compte le défilement
        heart.style.left = `${rect.left + window.scrollX}px`; // Prend en compte le défilement
        heart.style.fontSize = "24px";
        heart.style.transition = "transform 1.2s ease, opacity 1.2s ease";

        setTimeout(() => {
            heart.style.transform = "translateY(-50px) scale(1.5)"; // Déplacement et agrandissement
            heart.style.opacity = "0"; // Disparaître
        }, 10);

        setTimeout(() => heart.remove(), 1000); // Supprimer après l'animation

        // Mise à jour des cœurs dans l'inventaire après l'animation
        setTimeout(() => {
            updateInventory(); // Actualise les relations visibles dans l'inventaire
        }, 1000);
    }, 500); // Lancer l'animation des cœurs après le fondu

    // Après avoir affiché et mis à jour l'inventaire, fermer en fondu
    setTimeout(() => {
        inventoryUI.style.transition = "opacity 0.5s ease"; // Transition pour la disparition
        inventoryUI.style.opacity = "0"; // Fait disparaître progressivement
        setTimeout(() => {
            inventoryUI.style.display = "none"; // Cache complètement après la transition
        }, 500); // Attendre la durée de la transition
    }, 2000); // Fermeture après avoir laissé visible les cœurs animés
}

function getImageName(key) {
    return key.substring(1, 2).toUpperCase() + key.substring(2) + ".png";
}

function showItem(imageSrc, description) {
    const selectedItem = document.getElementById('selected-item');
    const selectedImage = document.getElementById('selected-image');
    const selectedDescription = document.getElementById('selected-description');

    selectedImage.src = imageSrc;
    selectedDescription.textContent = description;
    selectedItem.style.display = 'block';
}

export function toggleInventory() {
    const inventoryUI = document.getElementById("inventory-container");
    inventoryUI.style.opacity = "1";
    const isDisplayed = inventoryUI.style.display === "block";

    if (!isDisplayed) {
        updateInventory();
        inventoryUI.style.display = "block";
        console.log("Inventaire ouvert");
    } else {
        inventoryUI.style.display = "none";
        console.log("Inventaire fermé");
    }
}

export function addDocumentToInventory(dial, speaker, idObj) {
    const documentInfo = {
        id: dial.id,
        speech: dial.speech,
        activation: dial.activation,
        targetObj: dial.target,
        img: 'sprites/' + dial.img
    };
    inventoryPlayer.push(documentInfo);
    console.log('idObj',idObj,objs);
    k.destroy(objs[idObj]);
    markObjectAsDeleted(speaker);
}
