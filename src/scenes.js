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
// Scène principale avec texte interactif amélioré
export function mainMenuScene() {
    k.scene("mainMenu", () => {
        k.setBackground(k.BLACK);

        // Titre du jeu avec effet de pulsation
        const title = k.add([
            k.text("ARCADE BOY", {
                font: "PressStart2P",
                size: 32,
            }),
            k.pos(k.width() / 2.6, 30),
            k.color(0, 255, 30),
            {
                defaultColor: k.rgb(0, 255, 30),
                timer: 0,
                pulsating: true
            }
        ]);

        // Option de menu START avec effets interactifs
        const startOption = addInteractiveMenuOption("START", k.vec2(k.width() / 2 - 200, k.height() / 2 - 80), "start", k.rgb(255, 255, 0), k.rgb(255, 50, 50));

        // Option COMMENT JOUER avec effets interactifs
        const howToPlayOption = addInteractiveMenuOption("COMMENT JOUER ?", k.vec2(k.width() / 2 - 200, k.height() / 2 + 20), "howToPlay", k.rgb(255, 255, 0), k.rgb(255, 50, 50));

        // Ajouter une option CREDITS
        //const creditsOption = addInteractiveMenuOption("CREDITS", k.vec2(k.width() / 2 - 200, k.height() / 2 + 120), "credits", k.rgb(255, 255, 0), k.rgb(255, 50, 50));

        // Pulsation du titre
        k.onUpdate(() => {
            // Effet de pulsation pour le titre
            if (title.pulsating) {
                title.timer += k.dt();
                const pulse = Math.sin(title.timer * 2) * 0.2 + 0.8;
                title.color = k.rgb(
                    title.defaultColor.r * pulse,
                    title.defaultColor.g * pulse,
                    title.defaultColor.b * pulse
                );
            }
        });

        // Gestionnaire de survol pour les options de menu
        k.onHover("menuOption", (option) => {
            option.color = option.hoverColor;
            option.scale = k.vec2(1.1, 1.1);
            document.body.style.cursor = "pointer";
        });

        k.onHoverEnd("menuOption", (option) => {
            option.color = option.defaultColor;
            option.scale = k.vec2(1, 1);
        });

        // Actions des boutons
        k.onClick("start", () => {
            playSound("choice"); // Assurez-vous d'avoir cette fonction dans sounds.js
            k.go("loadScreen1");
        });

        k.onClick("howToPlay", () => {
            playSound("choice");
            k.go("howToPlay");
        });

        // k.onClick("credits", () => {
        //     playSound("choice");
        //     k.go("credits"); // Vous devrez créer cette scène
        // });
    });
}

// Fonction améliorée pour ajouter une option interactive au menu
function addInteractiveMenuOption(text, position, tag, defaultColor, hoverColor) {
    return k.add([
        k.text(text, {
            font: "PressStart2P",
        }),
        k.pos(position),
        k.area({ cursor: "pointer" }), // Try adding the cursor property directly, // Pour la détection des événements de survol
        k.scale(1),
        k.color(defaultColor),
        {
            defaultColor: defaultColor,
            hoverColor: hoverColor
        },
        tag,
        "menuOption", // Tag commun pour les options de menu
    ]);
}

// Scène "Comment jouer" améliorée
export function howToPlayScene() {
    k.scene("howToPlay", () => {
        k.setBackground(k.BLACK);

        // Titre
        k.add([
            k.text("COMMENT JOUER ?", {
                font: "PressStart2P",
                size: 24,
            }),
            k.pos(k.width() / 2.8, 30),
            k.color(0, 255, 30),
        ]);

        // Instructions
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

        // Bouton de retour au menu
        k.add([
            k.text("RETOUR AU MENU", {
                font: "PressStart2P",
                size: 16,
            }),
            k.pos(k.width() / 2, k.height() - 80),
            k.area(),
            k.color(255, 255, 0),
            {
                defaultColor: k.rgb(255, 255, 0),
                hoverColor: k.rgb(255, 50, 50),
                timer: 0
            },
            "backButton",
            "menuOption",
        ]);

        // Animation spéciale pour le bouton de retour
        k.onUpdate("backButton", (button) => {
            button.timer += k.dt();
            if (button.isHovering()) {
                button.scale = k.vec2(
                    1 + Math.sin(button.timer * 5) * 0.05,
                    1 + Math.sin(button.timer * 5) * 0.05
                );
            } else {
                button.scale = k.vec2(1, 1);
            }
        });

        // Clic sur le bouton de retour
        k.onClick("backButton", () => {
            playSound("choice");
            k.go("mainMenu");
        });

        // Retour au menu avec une touche (gardé pour compatibilité)
        k.onKeyPress(() => {
            k.go("mainMenu");
        });
    });
}

// Nouvelle scène de crédits
export function creditsScene() {
    k.scene("credits", () => {
        k.setBackground(k.BLACK);

        // Titre des crédits
        k.add([
            k.text("CREDITS", {
                font: "PressStart2P",
                size: 24,
            }),
            k.pos(k.width() / 2, 30),
            k.color(0, 255, 30),
        ]);

        // Contenu des crédits
        const creditsText = k.add([
            k.text(
                "DÉVELOPPEMENT\n\n" +
                "Nicolas Bovet\n\n" +
                {
                    font: "PressStart2P",
                    size: 16,
                    align: "center"
                }
            ),
            k.pos(k.width() / 2, 120),
            k.color(255, 255, 255),
            {
                defaultColor: k.rgb(255, 255, 255),
                timer: 0,
                scrolling: true
            }
        ]);

        // Bouton de retour
        k.add([
            k.text("RETOUR", {
                font: "PressStart2P",
                size: 16,
            }),
            k.pos(k.width() / 2, k.height() - 50),
            k.area(),
            k.color(255, 255, 0),
            {
                defaultColor: k.rgb(255, 255, 0),
                hoverColor: k.rgb(255, 50, 50)
            },
            "backButton",
            "menuOption",
        ]);

        // Animation du texte des crédits
        k.onUpdate(() => {
            // Animation du texte des crédits
            if (creditsText.scrolling) {
                creditsText.timer += k.dt();
                const colorPulse = Math.sin(creditsText.timer * 2) * 0.2 + 0.8;
                creditsText.color = k.rgb(
                    creditsText.defaultColor.r * colorPulse,
                    creditsText.defaultColor.g * colorPulse,
                    creditsText.defaultColor.b * colorPulse
                );
            }
        });

        // Action du bouton de retour
        k.onClick("backButton", () => {
            playSound("choice");
            k.go("mainMenu");
        });

        // Retour au menu avec une touche (pour facilité)
        k.onKeyPress("escape", () => {
            k.go("mainMenu");
        });
    });
}
