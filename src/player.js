import { k } from "./kaboomCtx";
import { handleKeyboardEvents } from "./events.js";
import { handleCollisions } from "./events.js";
import {map, mapX} from "./maps";
import {direction} from "./globals";

export function createPlayer(x,y) {
    // Créez le personnage avec un sprite, une position et une échelle initiale
    let posx;
    let posy = y;
    if (direction === 'left'){
        posx = k.width();
    }
    else if (direction === 'right'){
        posx = 0;
    }
    else {
        posx = x;
    }
    const player = k.add([
        k.sprite("teen"),
        k.scale(1.3), // Échelle initiale
        k.pos(posx, posy),
        k.area(),
        {
            speed: 420,
            direction: "down",
            readySpeak: false,
            baseScale: 1.3, // Échelle de base du joueur
            depthFactor: 0.002, // Facteur d'ajustement du scaling
            referenceY: posy, // Position de référence pour le scaling
        },
        k.body(),
        "player",
    ]);

    // Gestion des animations (local à player.js)
    function stopAnimations() {
        if (player.direction === "down" || player.direction === "up") {
            player.play("stand");
        } else {
            player.play("stand");
        }
    }

    // Fonction de mise à jour pour ajuster l'échelle en fonction de la profondeur
    function updateScaling() {
        const yDiff = player.pos.y - player.referenceY; // Différence avec la position de référence
        const newScale = player.baseScale + yDiff * player.depthFactor;
        player.scaleTo(Math.max(newScale, 1.2)); // Évite une échelle trop petite
    }

    // Appel des événements
    handleKeyboardEvents(player, stopAnimations);
    handleCollisions(player);

    // Mettez à jour l'échelle à chaque frame
    k.onUpdate(() => {
        updateScaling();
    });

    return player;
}
