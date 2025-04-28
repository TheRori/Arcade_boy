import {toggleInventory} from "./inventory";
import {k} from "./kaboomCtx";
import {speak} from "./speak";
import {direction, infoUI, objectCache, setDirection, setobjectCache} from "./globals";
import {readMagazine} from "./documents";
import {mapL, mapR, objs} from "./maps";
import {playLoop, playSound, stopCurrentLoop} from "./sounds";

let isWalking = false; // Variable pour suivre l'état de déplacement

export function handleKeyboardEvents(player, stopAnimations, mapTransitions) {
    let lastKeyPressed = null;

    k.onKeyPress((key) => {
        if (["right", "left", "up", "down"].includes(key)) {
            lastKeyPressed = key;
        }
    });
    k.onKeyRelease((key) => {
        if (["right", "left", "up", "down"].includes(key)) {
            // Si la touche relâchée est celle en cours, on cherche une autre touche maintenue
            if (!k.isKeyDown(lastKeyPressed)) {
                // Priorité d'ordre : droite, gauche, haut, bas
                if (k.isKeyDown("right")) lastKeyPressed = "right";
                else if (k.isKeyDown("left")) lastKeyPressed = "left";
                else if (k.isKeyDown("up")) lastKeyPressed = "up";
                else if (k.isKeyDown("down")) lastKeyPressed = "down";
                else lastKeyPressed = null;
            }
        }
        if (!["right", "left", "up", "down"].some(k.isKeyDown)) {
            stopAnimations();
        }
    });

    k.onUpdate(() => {
        const keyMap = {
            right: "walksR",
            left: "walksL",
            up: "walksU",
            down: "walksD",
        };
        if (lastKeyPressed) {
            if (lastKeyPressed === "right") {
                player.flipX = true;
                if (player.curAnim() !== keyMap.right) player.play(keyMap.right);
                player.move(player.speed, 0);
                if (player.pos.x >= k.width() && mapR) {
                    setDirection('right');
                    k.go(mapR);
                }
            } else if (lastKeyPressed === "left") {
                player.flipX = false;
                if (player.curAnim() !== keyMap.left) player.play(keyMap.left);
                player.move(-player.speed, 0);
                if (player.pos.x < 0 && mapL) {
                    setDirection('left');
                    k.go(mapL);
                }
            } else if (lastKeyPressed === "up") {
                if (player.curAnim() !== keyMap.up) player.play(keyMap.up);
                player.move(0, -player.speed);
            } else if (lastKeyPressed === "down") {
                if (player.curAnim() !== keyMap.down) player.play(keyMap.down);
                player.move(0, player.speed);
            }
        }
    });

    k.onKeyPress("i", () => {
        playSound('toggleUI');
        toggleInventory();
    });
}

export function handleCollisions(player) {
    let currentObject = null; // Suivre l'objet actuellement en collision
    let isClickListenerAttached = false; // Suivre si un gestionnaire `click` est attaché

    const infoUI = document.getElementById("info-container");
    const info = document.getElementById("info");

    const handleClick = () => {
        if (currentObject) {
            handleInteraction(currentObject); // Interaction avec l'objet
        }
    };

    k.onCollide("player", "*", (player, obj) => {
        if (obj.idConv !== undefined) {
            if (currentObject !== obj) {
                currentObject = obj; // Mettre à jour l'objet en collision

                // Mise à jour de l'interface utilisateur
                updateInteractionUI(obj);

                if (!isClickListenerAttached) {
                    console.log("Ajout d'un événement click unique");
                    infoUI.addEventListener("click", handleClick); // Attacher le gestionnaire
                    isClickListenerAttached = true;
                }

                // Ajout : valider interaction avec ESPACE
                function onSpace(e) {
                    if (e.code === "Space") {
                        handleInteraction(currentObject);
                        window.removeEventListener("keydown", onSpace);
                    }
                }
                window.addEventListener("keydown", onSpace);
            }
        }
    });

    k.onCollideEnd("player", "*", () => {
        if (currentObject) {
            currentObject = null; // Réinitialiser l'objet en collision
            infoUI.style.display = "none"; // Masquer l'interface d'information

            if (isClickListenerAttached) {
                console.log("Suppression de l'événement click");
                infoUI.removeEventListener("click", handleClick); // Retirer le gestionnaire
                isClickListenerAttached = false;
            }
        }
    });
}

function updateInteractionUI(obj) {
    const infoUI = document.getElementById("info-container");
    const info = document.getElementById("info");

    infoUI.style.display = "flex";
    info.innerHTML =
        obj.type === "dialogues"
            ? `<span id="insp">Parler à ${obj.name}</span>`
            : `<span id="insp">Inspecter</span>`;
}

function handleInteraction(obj) {
    if (obj.type === "dialogues") {
        console.log(`Interagir avec ${obj.name}`);
        // Appeler la fonction pour démarrer un dialogue
        speak("dialogues", obj.idObjs, obj.idConv, () => console.log("Dialogue terminé"));
    } else if (obj.type === "documents") {
        console.log(`Inspecter ${obj.name}`,obj.idObjs);
        speak("documents", obj.idObjs, obj.idConv, () => console.log("Dialogue terminé"));
    }
}
