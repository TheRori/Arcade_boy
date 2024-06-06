import { k } from "./kaboomCtx";

const imgHTML = document.getElementById('appleII');
const imgHTMLContainer = document.getElementById('imgContainer');
const dialogueUI = document.getElementById("textbox-container");
const dialogue = document.getElementById("dialogue");
const choix = document.getElementById("choix");
const inventaireUI = document.getElementById('inventory-container');

let statePlayer = [{"Rpapa" : -1},{"Rcamille" : 0},{"Reric" : 0}];
let objs = []

let inventoryDisplay,chosen = false

let inventoryPlayer = [
    {
        id: 999,
        img: "sprites/construire.png",
        speech: "«Il y a un moment où tu ne penses plus tout à fait à"
    }
];


let collide = false;

k.loadSprite("map", "sprites/map.png");
k.loadSprite("bar", "sprites/bar.png");

k.loadSprite("wall1", "sprites/wall.png");
async function loadJSONData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error loading JSON: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return {}; // Return an empty object in case of errors
    }
}

// Charger les ressources nécessaires
k.loadSpriteAtlas("sprites/Male4.png", {
    "father": {
        x: 0,
        y: 192,
        width: 256,
        height: 576,
        sliceX: 8,
        sliceY: 12,
        anims: {
            stand:  { from: 0, to: 0 },
        },
    },
});
k.loadSpriteAtlas("sprites/player.png", {
    "teen": {
        x: 0,
        y: 0,
        width: 72.5,
        height: 128,
        sliceX: 3,
        sliceY: 4,
        anims: {
            stand:  { from: 0, to: 0 },
            walksD: { from: 6, to: 8, speed: 4, loop: true },
            walksL: { from: 9, to: 11, speed: 4, loop: true },
            walksR: { from: 3, to: 5, speed: 4, loop: true },
            walksU: { from: 0, to: 2, speed: 4, loop: true },
        },
    },
});



function play_minigame(game) {
    if (game === 'pong') {
        document.getElementById('minigame').style.display = 'block';
    }

}

function set_video(link) {
    let video = document.getElementById("video");
    let source = document.getElementById("videoMachine");
    // Modification de la source de la vidéo
    source.src = link;
    video.load();
}
export async function createMap() {
    const mapData = await (await fetch("map.json")).json();
    const mapDataB = await (await fetch("bar.json?"+Math.random())).json();


// const layers = mapData.layers;
    const layersB = mapDataB.layers;


    const map = k.add([k.sprite("bar"), k.pos(0), k.scale(1)]);
    for (const layer of layersB) {
        if (layer.name === "boundaries") {
            let r = 0
            let c = 0
            for (const id of layer.data) {
                if (id !== 0) {
                    map.add([
                        k.area({
                            shape: new k.Rect(k.vec2(0), 32, 32),
                        }),
                        k.body({isStatic: true}),
                        k.pos(c * 32, r * 32 - 7 * 32),
                        'wall',
                    ]);
                }
                if (c === 37) {
                    c = 0;
                    r += 1
                } else {
                    c += 1;
                }
            }
        }
        if (layer.class === "interact") {
            let r = 0
            let c = 0
            for (const id of layer.data) {
                if (id !== 0) {
                    const perso = map.add([
                        k.area({
                            shape: new k.Rect(k.vec2(0), 32, 32),
                        }),
                        k.pos(c * 32, r * 32),
                        k.sprite('wall1'),
                        'camille',
                    ]);
                    perso.name = layer.name;
                    console.log(perso.name);
                    perso.idConv = layer.idConv;
                    perso.type = 'dialogues';
                }
                if (c === 37) {
                    c = 0;
                    r += 1
                } else {
                    c += 1;
                }
            }

        }
        /*for (const boundary of layer.objects) {
            map.add([
                k.area({
                    shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                }),
                k.body({isStatic: true}),
                k.pos(boundary.x, boundary.y -16),
                boundary.name,
            ]);
        }
*/  if (layer.objects) {
    let i = 0;
        for (const o of layer.objects) {
            const centerX = o.x + (o.width / 2);
            const centerY = o.y - (o.height / 2);

            const rotatedCenterX = o.x + Math.cos(o.rotation) * (centerX - o.x) - Math.sin(o.rotation) * (centerY - o.y);
            const rotatedCenterY = o.y + Math.sin(o.rotation) * (centerX - o.x) + Math.cos(o.rotation) * (centerY - o.y);

            const objs= map.add([
                k.area({
                    shape: new k.Rect(k.vec2(0), o.width, o.height),
                }),
                k.sprite('wall1'),
                k.pos(rotatedCenterX, rotatedCenterY+150),
                o.name,
            ]);
            objs.name = o.name;
            objs.idConv = 999 - i;
            objs.type = 'documents';
            i += 1;
        }

        }
    }
    console.log(objs)

    /*
    for (const layer of layers) {
        if (layer.class === "boundaries") {
            let r = 0
            let c = 0
            for (const id of layer.data) {
                if (id === 324 || id===327) {
                    map.add([
                        k.area({
                            shape: new k.Rect(k.vec2(0),16, 16),
                        }),
                        k.body({isStatic: true}),
                        k.pos(c*16, r*16),
                        'wall',
                    ]);
                }
                else if (id === 2) {
                    map.add([
                        k.sprite("father"),
                        k.area(),
                        k.pos(c*16,r*16),
                        k.scale(1.5),
                        k.body({isStatic:true}),
                        "father",
                    ])
                }
                if (c === 15) {
                    c = 0;
                    r +=1
                }
                else {c += 1;}
            }
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                    }),
                    k.body({isStatic: true}),
                    k.pos(boundary.x, boundary.y -16),
                    boundary.name,
                ]);
            }

            }

    }
    */
    createPlayer(0,0);
}
export async function createPlayer(posx,posy) {
    // Créez le personnage avec un sprite et une position

    const player = k.add([
        k.sprite('teen'),
        k.scale(7),
        k.pos(posx,450),
        k.area(),
        {
            speed: 250,
            direction: 'down',
            isInDialogue: false,
        },
        k.body(),
        'player',
    ]);


    let moving = true

    if (moving) {
        player.moveSpeed = 120;
    }
    else {
        player.moveSpeed = 0;
    }
    function stopAnims() {
        if (player.direction === "down") {
            player.play("stand");
            return;
        }
        if (player.direction === "up") {
            player.play("stand");
            return;
        }

        player.play("stand");
    }
    k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== "left" || player.isInDialogue) return;

        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);

        const mouseAngle = player.pos.angle(worldMousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if (
            mouseAngle > lowerBound &&
            mouseAngle < upperBound &&
            player.curAnim() !== "walksU"
        ) {
            player.play("walksU");
            player.direction = "up";
            return;
        }

        if (
            mouseAngle < -lowerBound &&
            mouseAngle > -upperBound &&
            player.curAnim() !== "walksD"
        ) {
            player.play("walksD");
            player.direction = "down";
            return;
        }

        if (Math.abs(mouseAngle) > upperBound) {
            player.flipX = false;
            if (player.curAnim() !== "walksR") player.play("walksR");
            player.direction = "right";
            return;
        }

        if (Math.abs(mouseAngle) < lowerBound) {
            if (player.curAnim() !== "walksL") player.play("walksL");
            player.direction = "left";
            return;
        }
    });

    k.onKeyDown((key) => {
        const keyMap = [
            k.isKeyDown("right"),
            k.isKeyDown("left"),
            k.isKeyDown("up"),
            k.isKeyDown("down"),
        ];

        let nbOfKeyPressed = 0;
        for (const key of keyMap) {
            if (key) {
                nbOfKeyPressed++;
            }
        }
        k.onKeyRelease(() => {
            stopAnims();
        });
        if (nbOfKeyPressed > 1) return;
        if (player.isInDialogue === true) return;
        if (keyMap[0]) {
            player.flipX = false;
            if (player.curAnim() !== "walksR") player.play("walksR");
            player.direction = "right";
            player.move(player.speed, 0);
            return;
        }

        if (keyMap[1]) {
            if (player.curAnim() !== "walksL") player.play("walksL");
            player.direction = "left";
            player.move(-player.speed, 0);
            return;
        }

        if (keyMap[2]) {
            if (player.curAnim() !== "walksU") player.play("walksU");
            player.direction = "up";
            player.move(0, -player.speed);
            return;
        }

        if (keyMap[3]) {
            if (player.curAnim() !== "walksD") player.play("walksD");
            player.direction = "down";
            player.move(0, player.speed);
        }
    });
    let wallState = 0;
    k.onKeyPress("i", () => {
        if(!inventoryDisplay){
            inventoryDisplay = true;
            afficherInventaire()
        }
        else {
            inventaireUI.style.display = "none";
            inventoryDisplay = false;
        }
    })
    let idd, namee, type;
    k.onCollide('player', '*', (player,objj) => {
        dialogueUI.style.display = "block";
       idd = objj.idConv;
       namee = objj.name;
       type = objj.type;
        console.log('salut'+namee+type);
        choix.innerHTML = "Inspecter";
        collide = true;
        choix.addEventListener('click', () => {
            choix.innerHTML = '';
            if (type === 'documents') {
                console.log('bouh'+type);
                if(!player.isInDialogue){parler("documents", namee, 1, idd, () => (player.isInDialogue = false));}
                }
            else if (type === 'dialogues') {
                if(!player.isInDialogue)parler("dialogues", namee, 1, idd, () => (player.isInDialogue = false));
            }
            if (!player.isInDialogue && collide){
                stopAnims();
            player.isInDialogue = true;
            player.moveSpeed = 0
            k.onDraw(() => {
                if (player.isInDialogue === true) {
                    k.drawRect({
                        tag: 'sepia',
                        width: 32 * 38,
                        height: 32 * 23,
                        pos: k.vec2(0),
                        color: k.rgb(127, 96, 58),
                        opacity: 0.3,
                    })
                }
            })
        }
        })

    })
    k.onCollideEnd('player','*',(player, obj) => {collide = false;dialogueUI.style.display='none';idd = null;namee = null;type = null;})

    let slideIndex = 1;
    function plusDivs(n,mag) {
        showDivs(slideIndex += n,mag);
    }

    return player;
}
function readMagazine(src_img) {
    imgHTMLContainer.style.display = 'block';
    const doc = document.getElementById('doc');
    doc.src=src_img
    doc.style.display = "block";
}

async function parler(categorie,speaker,numSpe, idConv, endSpeech) {
    console.log(speaker+idConv+categorie);
    const dials = await (await fetch("dials.json?"+Math.random())).json();
    let curentIndex = 0;
    let stateMachine ="";
    dialogueUI.style.display = "block";
    let data;
    if (idConv === -1){
        imgHTMLContainer.style.display = 'none';
        dialogueUI.style.display = "none";
        endSpeech();
        curentIndex = null;
        dialogue.innerHTML = "";
        choix.innerHTML = "";
        return;
    }
    if (categorie === "dialogues" | categorie === "objet"){
        console.log(idConv);
        data = dials.dialogues2.find(d => d.id === idConv && d.speaker === speaker);
    }
    else if (categorie === "documents"){
        data = dials.objets.find(d => d.id === idConv && d.speaker === speaker);
        readMagazine("sprites/"+data.img);
    }
    if (data) {
        let splitText = decouperTexte(data.speech, '150');
        if (data.machine.length > 0 ){
            const machine = document.getElementById('machine');
            const videoM = document.getElementById('videoMachine');
            machine.style.display = "flex";
            set_video('media/video/space_invaders.mp4');
            machine.src = "sprites/"+data.machine[0];
        }
        if (splitText.length > 1) {
            dialogue.innerHTML = splitText[curentIndex];
            const nextArrow = document.getElementById('next');
            nextArrow.style.display = 'block';
            function updateDialogue() {
                if (curentIndex + 1 < splitText.length) {
                    // Affichez le prochain morceau de texte
                    curentIndex = curentIndex + 1;
                    dialogue.innerHTML = splitText[curentIndex];
                } else {
                    curentIndex = null;
                    nextArrow.style.display = "none";
                    // Une fois que tous les morceaux de texte ont été affichés, ajoutez les choix
                    dialogue.innerHTML = data.speech;
                    addChoices(data, categorie, speaker, numSpe, endSpeech);
                }
            }
            nextArrow.addEventListener('click', updateDialogue);
            k.onKeyPress("e", updateDialogue);
        } else {
            dialogue.innerHTML = data.speech;
            addChoices(data,categorie,speaker,numSpe,endSpeech);
        }
        if (data.end === true) {
            closeBtn.style.display = 'block';
            closeBtn.addEventListener("click",() =>{onCloseBtnClick(data.machine)});
        }
    }
    else  {
        dialogue.innerHTML = '';
        choix.innerHTML = '';
        endSpeech();
    }

    const closeBtn = document.getElementById("close");
    function onCloseBtnClick(mach) {
        player.isInDialogue = false;
        if (mach !== '') {
            imgHTMLContainer.style.display = 'block';
            imgHTML.style.display = 'block';
            endSpeech();
            dialogueUI.style.display = "none";
            dialogue.innerHTML = "";
            closeBtn.removeEventListener("click", onCloseBtnClick);
            setTimeout(function () {
                parler("dialogues",'Camille', 1, 2, () => (player.isInDialogue = false));
            }, 6000);
            set_video('media/video/space_invaders.mp4');
        }
        else {
            imgHTMLContainer.style.display = 'none';
            dialogueUI.style.display = "none";
            endSpeech();
            dialogue.innerHTML = "";
            choix.innerHTML = '';
        }

    }
}

// Fonction pour obtenir la valeur d'une clé spécifique dans l'état du joueur
function getPlayerStateValue(key) {
    let state = statePlayer.find(obj => obj.hasOwnProperty(key));
    return state ? state[key] : undefined;
}
// Fonction pour mettre à jour la valeur d'une clé spécifique dans l'état du joueur
function setPlayerStateValue(key, newValue) {
    let state = statePlayer.find(obj => obj.hasOwnProperty(key));
    if (state) {
        state[key] = newValue;
    } else {
        let newState = {};
        newState[key] = newValue;
        statePlayer.push(newState);
    }
}

function addChoices(dial,categorie,speaker,numSpe,endSpeech) {

    let choices = dial.choices;
    let choicesHTML = '';

    for (let i = 0; i < choices.length; i++) {
        if (choices[i].need && choices[i].need.length > 0) {
            const conditions = choices[i].need;
            let allConditionsMet = true;
            for (const condition of conditions) {
                let { key, operator, value } = condition;
                const playerValue = statePlayer.find(obj => obj.hasOwnProperty(key))[key];
                if (playerValue === undefined || operator === undefined || value === undefined) {
                    allConditionsMet = false;
                    break;
                }
                // Utilise la fonction "new Function" pour évaluer la condition de manière dynamique
                const conditionMet = new Function('playerValue', 'value', `return playerValue ${operator} value;`)(playerValue, value);
                if (!conditionMet) {
                    allConditionsMet = false;
                    break;
                }
            }
            if (allConditionsMet) {
                choicesHTML += ("<p class='choixVar' id='" + i + "'>" + choices[i].speech + "</p>");
            }
        } else {
            choicesHTML += ("<p class='choixVar' id='" + i + "'>" + choices[i].speech + "</p>");
        }
    }
    if(categorie === "dialogues"){
        choicesHTML += ("<p class='choixVar' id='obj'>"+ "Essayer un objet…"  + "</p>");
    }
    choix.innerHTML = choicesHTML;
    const choixVarHTML = document.querySelectorAll(".choixVar");
    choixVarHTML.forEach((el, idx) => {
        el.addEventListener('click', () => {
            choix.innerHTML = '';
            if(categorie === "dialogues"){
            if (choices[idx].modifiers.length > 0) {
                choices[idx].modifiers.forEach(({ key, operator, value }) => {
                    const stateValue = getPlayerStateValue(key);
                    const newValue = new Function('stateValue', 'value', `return stateValue ${operator} value;`)(stateValue, value);
                    setPlayerStateValue(key, newValue);
                    console.log(statePlayer);
                });
            }}
            let nextId = choices[idx].nextId;
            if (categorie === 'documents') {
                if(choices[idx].remember){
                    const documentId = inventoryPlayer.length + 1; // Génère une ID unique pour le document
                    const documentInfo = {
                        id: documentId,
                        speech: dial.speech,
                        img: dial.img
                    };
                    // Ajoute les informations du document à l'inventaire du joueur
                    inventoryPlayer.push(documentInfo);
                    console.log("Document ajouté à l'inventaire:", documentInfo);
                }
            }
            if (el.id ==="obj"){
                categorie = 'objet';
                afficherInventaire(true,categorie, speaker, numSpe + 1, nextId, endSpeech);
            }
            else{ parler(categorie, speaker, numSpe + 1, nextId, endSpeech);  // Utilisation de nextId dans l'appel de parler
            }
        });
    });
}


function decouperTexte(chaine, seuil) {
    if (chaine.length <= seuil) {
        return [chaine]; // Retourne la chaîne telle quelle si sa longueur est inférieure ou égale au seuil
    }

    const mots = chaine.split(' '); // Sépare la chaîne en mots
    let partieActuelle = '';
    const parties = [];

    for (let i = 0; i < mots.length; i++) {
        const mot = mots[i];
        if (partieActuelle.length + mot.length <= seuil) {
            partieActuelle += (partieActuelle.length === 0 ? '' : ' ') + mot; // Ajoute le mot à la partie actuelle
        } else {
            parties.push(partieActuelle); // Ajoute la partie actuelle au tableau de parties
            partieActuelle = mot; // Commence une nouvelle partie avec le mot actuel
        }
    }

    if (partieActuelle.length > 0) {
        parties.push(partieActuelle); // Ajoute la dernière partie
    }

    return parties;
}

// Fonction pour afficher l'inventaire
function afficherInventaire(choose,categorie, speaker, numSpe, nextId, endSpeech) {
    // Sélectionner l'élément HTML où vous voulez afficher l'inventaire
    const inventaireElement = document.getElementById('inventaire');

    // Vider le contenu de l'élément pour éviter les doublons
    inventaireElement.innerHTML = '';

    // Parcourir le tableau inventoryPlayer pour chaque élément de l'inventaire
    inventoryPlayer.forEach((item) => {
        // Créer un élément div pour chaque élément de l'inventaire
        const itemElement = document.createElement('div');
        itemElement.classList.add('inventory-item');

        // Ajouter l'image de l'élément de l'inventaire à l'élément div
        const imgElement = document.createElement('img');
        imgElement.src = item.img;
        imgElement.id = (item.id);
        itemElement.appendChild(imgElement);

        // Ajouter le texte de l'élément de l'inventaire à l'élément div
        const textElement = document.createElement('div');
        textElement.classList.add('text');
        textElement.textContent = item.speech;
        itemElement.appendChild(textElement);

        imgElement.addEventListener('click', () => {
            if (choose){
                inventaireUI.style.display = "none";
                parler(categorie, speaker, numSpe + 1, parseInt(imgElement.id), endSpeech);
            }
            textElement.style.display = 'block'; // Afficher le texte
        });

        // Ajouter l'élément div à l'élément d'inventaire
        inventaireElement.appendChild(itemElement);
    });
    inventaireUI.style.display = "block";
}

function removeAllEventListeners(element) {
    // Cloner l'élément pour supprimer tous les écouteurs d'événements
    const clonedElement = element.cloneNode(true);
    element.parentNode.replaceChild(clonedElement, element);

    // Ajout de la même classe pour conserver les styles si nécessaire
    clonedElement.className = element.className;

    // Suppression de tous les écouteurs d'événements de l'élément cloné
    const events = getEventListeners(element);
    for (const event in events) {
        events[event].forEach(listener => {
            clonedElement.removeEventListener(event, listener.listener);
        });
    }
}


// Créer la première scène
k.scene("level1", () => {
    // Créer le personnage
    createMap();
    k.setBackground(k.BLACK);

});

// Créer la deuxième scène
k.scene("level2", () => {
    k.add([
        k.text("Félicitations, vous êtes arrivé à la deuxième scène !", 24),
        k.pos(0, height() / 2),
    ]);
});

// Charger la première scène au démarrage
k.go("level1");