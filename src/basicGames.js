import {basicGame, choix, dialogueUI, setInDialogue, setIsGameLaunched} from "./globals";
import {resetDialogueUI} from "./speak";

// Affiche le code BASIC simulé
export function displayBasicGame() {
    basicGame.style.display = 'block';
    basicGame.style.backgroundColor = "#000"; // Noir rétro
    basicGame.style.color = "#0f0"; // Texte vert fluo
    basicGame.innerHTML = `
        <div id="basic-screen" style="font-family: monospace; font-size: 16px; padding: 20px; text-align: left;">
            <p>10 PRINT "DEVINE LE NOMBRE"</p>
            <p>20 PRINT "J'AI CHOISI UN NOMBRE ENTRE 1 ET 100"</p>
            <p>30 INPUT "ENTRE TON CHOIX"; A</p>
            <p>40 IF A &lt; N THEN PRINT "PLUS GRAND!"</p>
            <p>50 IF A &gt; N THEN PRINT "PLUS PETIT!"</p>
            <p>60 IF A = N THEN PRINT "BRAVO! TROUVÉ EN "; C; "ESSAIS"</p>
            <p>70 GOTO 30</p>
            <hr />
            <p id="basic-output">RUNNING...</p>
        </div>
    `;
}

// Lance le jeu BASIC simulé
export function launchBasicGame(endSpeech) {
    const choix = document.getElementById("choix");
    setIsGameLaunched(true);

    // Configurer l'interface
    choix.style.display = 'none';
    basicGame.style.display = 'block';
    basicGame.style.backgroundColor = "#000"; // Noir rétro
    basicGame.style.color = "#0f0"; // Texte vert fluo
    basicGame.innerHTML = `
        <div id="basic-screen" style="font-family: monospace; font-size: 16px; padding: 20px; text-align: left;">
            <p>10 PRINT "DEVINE LE NOMBRE"</p>
            <p>20 PRINT "J'AI CHOISI UN NOMBRE ENTRE 1 ET 100"</p>
            <p>30 INPUT "ENTRE TON CHOIX"; A</p>
            <p>40 IF A &lt; N THEN PRINT "PLUS GRAND!"</p>
            <p>50 IF A &gt; N THEN PRINT "PLUS PETIT!"</p>
            <p>60 IF A = N THEN PRINT "BRAVO! TROUVÉ EN "; C; "ESSAIS"</p>
            <p>70 GOTO 30</p>
            <hr />
            <p id="basic-feedback">RUNNING...</p>
            <input type="number" id="basic-input" style="background-color: #000; color: #0f0; border: none; padding: 5px;" />
            <button id="basic-submit" style="background-color: #0f0; color: #000; padding: 5px; margin-left: 10px;">OK</button>
        </div>
    `;

    const secretNumber = Math.floor(Math.random() * 100) + 1; // Générer un nombre aléatoire
    console.log(secretNumber);
    let attempts = 0;

    // Gestion des interactions
    document.getElementById("basic-submit").addEventListener("click", () => {
        const input = parseInt(document.getElementById("basic-input").value, 10);
        attempts++;

        const feedback = document.getElementById("basic-feedback");
        if (input < secretNumber) {
            feedback.textContent = "PLUS GRAND !";
        } else if (input > secretNumber) {
            feedback.textContent = "PLUS PETIT !";
        } else {
            feedback.textContent = `BRAVO ! TROUVÉ EN ${attempts} ESSAIS.`;
            setTimeout(() => {
                setIsGameLaunched(false);
                basicGame.style.display = 'none';
                choix.style.display = 'block'; // Réafficher les choix
                endSpeech(); // Retour au dialogue principal
            }, 1500); // Laisser un délai avant de quitter le jeu
        }
    });
}

