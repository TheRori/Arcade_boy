import { k } from "./kaboomCtx";
import {createMap, objs, setObjs} from "./maps";
import { resizeBackground } from "./maps"; // Si vous avez une fonction pour ajuster le fond
import {playLoop, playSound, stopCurrentLoop} from "./sounds"; // Pour jouer de la musique en boucle
import {
    currentBackgroundMusic,
    getCurrentLevel, levelLoaded,
    resize,
    setCurrentBackgroundMusic,
    setCurrentLevel, setlevelLoaded,
    setLvlMusic, setPlayerStatelvl2, statePlayer, statePlayerlvl2
} from "./globals";
import {getPlayerStateValue, setupDialogueOverlay} from "./utils";
import {updateInventory} from "./inventory";

export function loadScene(name, sprite, textContent, nextScene, music = null) {
    k.scene(name, () => {
        // Create the sprite and apply resizing after initialization
        const map = k.add([k.sprite(sprite), k.pos(0), k.scale(1)]);
        setlevelLoaded(false);
        // Use `k.onUpdate` to ensure dimensions are available
        k.onUpdate(() => {
            if (map.width && map.height) {
                resizeBackground(map); // Resize only when dimensions are available
            }
        });

        if (music){
            stopCurrentLoop()
            setLvlMusic(music);
            setCurrentBackgroundMusic(music);
            playLoop();
        }

        const textBox = document.getElementById("loadScrren");
        const nextArrow = document.getElementById("go");

        // Show textBox and set content
        textBox.style.display = "block";
        textBox.querySelector("p").innerHTML = textContent;
        nextArrow.style.display = "block";

        // Add event listener for "next" arrow
        const onNext = () => {
            // Ensure elements are hidden before transitioning
            textBox.style.display = "none";
            nextArrow.style.display = "none";

            // Remove this event listener to avoid duplicates
            nextArrow.removeEventListener("click", onNext);

            // Transition to the next scene
            k.go(nextScene);
        };

        // Add the event listener
        nextArrow.addEventListener("click", onNext);

        // Cleanup to ensure no duplicate handlers or leftover elements
        k.onDestroy(() => {
            textBox.style.display = "none";
            nextArrow.style.display = "none";
            nextArrow.removeEventListener("click", onNext);
        });
    });
}



// Fonction pour créer une scène de niveau
export function levelScene(levelNumber, mapName, sprite, posX, posY, music = null) {
    k.scene(`level${levelNumber}`, () => {
        // Réinitialiser l'état global si nécessaire
        if (music){
            stopCurrentLoop()
            setLvlMusic(music);
            setCurrentBackgroundMusic(music);
            playLoop();
        }
        setCurrentLevel(levelNumber);
        console.log(getCurrentLevel())
        if (getCurrentLevel()===2 && !levelLoaded){
            console.log("level loaded");
            setPlayerStatelvl2(statePlayer);
        }
        if (getCurrentLevel() === 0 || getCurrentLevel() === 2 || getCurrentLevel() === 4) {
            setlevelLoaded(true);
        }
        const doc = document.getElementById("doc");
        const imgHTMLContainer = document.getElementById("imgContainer");
        const choix = document.getElementById("choix");
        const machine = document.getElementById("machine");

        doc.src = "";
        imgHTMLContainer.style.display = "none";
        choix.style.display = "none";
        machine.src = "";

        createMap(levelNumber, sprite, posX, posY);
        updateInventory();
        setupDialogueOverlay();
    });
}

// Scène principale
export function mainMenuScene() {
    k.scene("mainMenu", () => {
        k.setBackground(k.BLACK);

        k.add([
            k.text("ARCADE BOY", {
                font: "PressStart2P",
                size: 32,
            }),
            k.pos(k.width() / 2.6, 30),
            k.color(0, 255, 30),
        ]);

        addMenuOption("START", k.vec2(k.width() / 2 - 200, k.height() / 2 - 80), "start");
        addMenuOption("COMMENT JOUER ?", k.vec2(k.width() / 2 - 200, k.height() / 2 + 20), "howToPlay");

        k.onClick("start", () => {
            k.go("loadScreen1");
        });

        k.onClick("howToPlay", () => {
            k.go("howToPlay");
        });
    });
}

// Fonction utilitaire pour ajouter une option au menu
function addMenuOption(text, position, tag) {
    k.add([
        k.text(text, {
            font: "PressStart2P",
        }),
        k.pos(position),
        k.area(),
        k.body(),
        k.color(255, 255, 0),
        tag,
    ]);
}

// Scène "Comment jouer"
export function howToPlayScene() {
    k.scene("howToPlay", () => {
        k.setBackground(k.BLACK);

        k.add([
            k.text("COMMENT JOUER ?", {
                font: "PressStart2P",
                size: 24,
            }),
            k.pos(k.width() / 2.8, 30),
            k.color(0, 255, 30),
        ]);

        k.add([
            k.text(
                "Utilisez les touches fléchées pour vous déplacer.\n" +
                "Appuyez sur 'I' pour ouvrir l'inventaire.\n" +
                "Interagissez avec les personnages et objets\n" +
                "pour faire évoluer les relations et progresser\n" +
                "dans le jeu.",
                { font: "PressStart2P", size: 16 }
            ),
            k.pos(50, 100),
            k.color(255, 255, 255),
        ]);

        k.add([
            k.text("Appuyez sur n'importe quelle touche pour revenir au menu principal.", {
                font: "PressStart2P",
                size: 16,
            }),
            k.pos(50, 300),
            k.color(255, 255, 0),
        ]);

        k.onKeyPress(() => {
            k.go("mainMenu");
        });
    });
}
