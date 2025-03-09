import { k } from "./src/kaboomCtx";
k.loadFont("PressStart2P", "fonts/PressStart2p-vaV7.ttf");
k.volume(0.1);


const imgHTMLContainer = document.getElementById('imgContainer');
const machine = document.getElementById('machine');
const dialogueUI = document.getElementById("dialogueUI");
const dialogue = document.getElementById("dialogue");
const persoIMG = document.getElementById("personnage");
const perso1 = document.getElementById('perso1');
const perso2 = document.getElementById('perso2');
const choix = document.getElementById("choix");
const infoUI = document.getElementById("info-container");
const info = document.getElementById("info");
const doc = document.getElementById('doc');
const inventaireUI = document.getElementById('inventory-container');
const showFullDialogueButton = document.getElementById('showFullDialogue');

let isInDialogue= false;
let resize = [];
let videoPlaying = false;
let statePlayer = [{"Rpapa" : null},{"Rcamille" : null},{"Reric" : null},{"Rarnaud": null},{"Rthomas": null},{"Rconsole":null}];
let initialStatePlayer = [];
let objs = []
let idd,idObj, namee, type, targetObj;
let map, musicBackground, musicDial = [];

let lvlJson = 'bar.json';
let mapDataB = [], idLVL;
async function fetchDataAndProcess() {
    let mapTemp;
    mapTemp = await (await fetch('garage.json?'+Math.random())).json();
    mapDataB.push(mapTemp);
    mapTemp = await (await fetch('bar_thomas.json?'+Math.random())).json();
    mapDataB.push(mapTemp);
    mapTemp = await (await fetch('bar.json?'+Math.random())).json();
    mapDataB.push(mapTemp);
    mapTemp = await (await fetch('bar_eric.json?'+Math.random())).json();
    mapDataB.push(mapTemp);
}



let inventoryDisplay,chosen = false
let levelEnd = false;

let inventoryPlayer = [];


let collide = false;
k.loadSprite('ld1', 'sprites/ld1.png');
k.loadSprite('ld2', 'sprites/ld2.png');
k.loadSprite('ld3', 'sprites/ld3.png');
k.loadSprite("garage", "sprites/garage.png");
k.loadSprite("map", "sprites/map.png");
k.loadSprite("bar", "sprites/bar.png");
k.loadSprite("eric_bar", "sprites/eric_bar.png");
k.loadSprite("thomas_bar", "sprites/thomas_bar.png");
k.loadSprite("np_construire", "sprites/np_construire.png");
k.loadSprite("np_appleII", "sprites/np_appleII.png");
k.loadSprite("np_coin", "sprites/np_coin.png");
k.loadSprite("np_kingsquest", "sprites/np_kingsquest.png");
k.loadSprite("np_nesad", "sprites/np_nesad.png");

k.loadSound('lvl1', 'music/The_Great_Machine.mp3')
k.loadSound('dial', 'music/dial.mp3')
k.loadSound('choice', 'music/choice.mp3')
k.loadSound('Papa', 'music/Papa.mp3')
k.loadSound('Camille', 'music/Camille.mp3')
k.loadSound('Eric', 'music/Eric.mp3')
k.loadSound('Thomas', 'music/Thomas.mp3')
k.loadSound('lvl2', 'music/bar.mp3')
k.loadSound('np_construire', 'music/documents.mp3')
k.loadSound('np_appleII', 'music/documents.mp3')
k.loadSound('np_coin', 'music/documents.mp3')
k.loadSound('np_nesad', 'music/documents.mp3')
k.loadSound('np_kingsquest', 'music/documents.mp3')




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
k.loadSpriteAtlas("sprites/teen.png", {
    "teen": {
        x: 0,
        y: 0,
        width: 2048,
        height: 1435,
        sliceX: 8,
        sliceY: 3,
        anims: {
            stand:  { from: 0, to: 0 },
            walksD: { from: 0, to: 7, speed: 8, loop: true },
            walksL: { from: 0, to: 7, speed: 8, loop: true },
            walksR: { from: 0, to: 7, speed: 8, loop: true },
            walksU: { from: 0, to: 7, speed: 8, loop: true },
        },
    },
});




function play_minigame(game) {
    if (game === 'pong') {
        document.getElementById('minigame').style.display = 'block';
    }

}

let mapL, mapR;
export async function createMap(numLVL,sprite,x,y) {
    console.log(mapDataB);

// const layers = mapData.layers;
    const layersB = mapDataB[numLVL].layers;
    mapL = mapDataB[numLVL].left;
    mapR = mapDataB[numLVL].right;

    console.log(mapR);


    map = k.add([k.sprite(sprite), k.pos(0), k.scale(1)]);
    resizeBackground();

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
                        k.pos(c * 32, r * 32 - (10 * 32)),
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
                        'camille',
                    ]);
                    perso.name = layer.name;
                    console.log(perso.name);
                    perso.idConv = layer.idConv;
                    console.log(perso.idConv);
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

                let centerX = o.x + (o.width / 2);
                let centerY = o.y - (o.height / 2);
                console.log(o);
                if (!o.isDeleted) {
                    objs.push(map.add([
                        k.sprite(o.name),
                        k.area({
                            shape: new k.Rect(k.vec2(0), 32, 32),
                        }),
                        k.pos(centerX - 70, centerY - 60),
                        k.scale(2),
                    ]));
                    objs[i].name = o.name;
                    objs[i].target = o.target;
                    objs[i].activation = o.activation;
                    objs[i].idObjs = i;
                    objs[i].idConv = o.id;
                    objs[i].type = 'documents';
                }
                else{
                    objs.push({
                        name: o.name,
                        target: o.target,
                        activation: o.activation,
                        idObjs: i,
                        idConv: o.id,
                        x: o.x,
                        y: o.y,
                        width:o.width,
                        height:o.height,
                        type: 'documents',
                    });
                }
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
    createPlayer(x,y);
}
export async function createPlayer(posx,posy) {
    // Créez le personnage avec un sprite et une position
    let p = k.getSprite('teen')
    const player = k.add([
        k.sprite('teen'),
        k.scale(1),
        k.pos(posx,posy - 1 *  p.data.height),
        k.area(),
        {
            speed: 250,
            direction: 'down',
            readySpeak: false,
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
    k.onKeyDown((key) => {
        let p = k.getSprite('teen')
        const keyMap = [
            k.isKeyDown("right"),
            k.isKeyDown("left"),
            k.isKeyDown("up"),
            k.isKeyDown("down"),
        ];
        let posBubblex, posBubbley;
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
        if (isInDialogue === true) return;
        if (keyMap[0]) {
            player.flipX = true;
            if (player.curAnim() !== "walksR"){ player.play("walksR",);}
            player.direction = "right";
            player.move(player.speed
                , 0);
            if (player.pos.x >= k.width() && mapR !== "") {
                console.log(player.pos.x);
                k.go(mapR);
            }
            return;
        }

        if (keyMap[1]) {
            player.flipX = false;
            if (player.curAnim() !== "walksL") player.play("walksL");
            player.direction = "left";
            player.move(-player.speed, 0);
            if (player.pos.x < 0 && mapL !== "") {
                console.log(player.pos.x);
                k.go(mapL);
            }
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
            console.log(inventoryPlayer);
            inventoryDisplay = true;
            afficherInventaire()
        }
        else {
            inventaireUI.style.display = "none";
            inventoryDisplay = false;
        }
    })
    function handleClick() {
        isInDialogue = true;
        infoUI.style.display = 'none';
        k.play('dial')
        musicDial.push(k.play(namee,{loop: true}));
        // Retirer l'écouteur d'événements dès que le clic se produit
        info.removeEventListener('click', handleClick);

        choix.innerHTML = '';

        if (type === 'documents') {
            console.log('bouh' + type);
            parler("documents", idObj, idd, () => {
                isInDialogue = false;
            },'');

        } else if (type === 'dialogues') {
            console.log('salut');
            parler("dialogues", idObj, idd, () => {
                isInDialogue = false;
                musicDial.paused = true;
            },'');
        }

        stopAnims();
        player.moveSpeed = 0;

    }

    k.onDraw(() => {
        if (isInDialogue === true) {
            console.log('dialoguenoir');
            k.drawRect({
                tag: 'sepia',
                width: 32 * 38 * resize[0],
                height: 32 * 23 * resize[1],
                pos: k.vec2(0),
                color: k.rgb(0, 0, 0),
                opacity: 1,
            });
        }
    });


    k.onCollide('player', '*', (player,objj) => {
        idd = objj.idConv;
        idObj = objj.idObjs;
        targetObj = objj.target;
        namee = objj.name;
        console.log(objj)
        type = objj.type;
        let posBubblex, posBubbley;
        if(idd !== undefined) {
            infoUI.style.display = "flex";
            if(type==='dialogues')info.innerHTML = "<span id=insp>Parler à "+namee+"</span>";
            else if (type === 'documents')info.innerHTML = "<span id=insp>Inspecter</span>";
            collide = true;
            if (!player.readySpeak && collide) {
                posBubblex = (player.pos.x + 50) * resize[0]
                if(resize[0] < 1 || resize[1] < 1){ posBubblex += player.pos.x + (player.pos.x + 50)  * resize[0]}
                if(resize[0] > 1 || resize[1] > 1){ posBubblex += player.pos.x - (player.pos.x + 50)  * resize[0]}
                posBubbley = (player.pos.y - 70)  * resize[1]
                if(resize[0] < 1 || resize[1] < 1){ posBubbley = player.pos.y + (player.pos.y - 70)  * resize[1]}
                if(resize[0] > 1 || resize[1] > 1){ posBubbley += player.pos.y - (player.pos.y + 50)  * resize[1]}

                collide = false;
                player.readySpeak = true;
                infoUI.addEventListener('click', handleClick);
            }
        }
    })
    k.onCollideEnd('player','*',(player, obj) => {
        info.removeEventListener('click', handleClick);
        dialogueUI.style.display='none';
        infoUI.style.display='none';
        idd = null;
        namee = null;
        type = null;
        player.readySpeak = false;
    })

    let slideIndex = 1;
    function plusDivs(n,mag) {
        showDivs(slideIndex += n,mag);
    }

    return player;
}
function readMagazine(src_img) {
    imgHTMLContainer.style.display = 'block';

    doc.src=src_img
    doc.style.display = "block";

    // Ajouter un écouteur de clic pour afficher l'image dans la lightbox
    doc.addEventListener('click', () => {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        lightboxImg.src = doc.src; // Utiliser la source de l'image actuelle
        lightbox.style.display = 'flex'; // Affiche la lightbox
    });

    // Ajoutez ce listener pour fermer la lightbox au clic sur le bouton de fermeture
    const lightboxClose = document.getElementById('lightbox-close');
    lightboxClose.addEventListener('click', () => {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none'; // Cache la lightbox
    });
}

async function parler(categorie,idObj, idConv, endSpeech, mood) {
    const dials = await (await fetch("dials.json?"+Math.random())).json();
    let curentIndex = 0;
    let stateMachine ="";
    let speaker;
    let showFullDialogue = false;
    musicBackground.paused = true;
    dialogueUI.style.display = 'block'
    choix.style.display = 'none';
    console.log(categorie)
    let data;
    if (idConv === -1){
        imgHTMLContainer.style.display = 'none';
        dialogueUI.style.display = "none";
        doc.src = "";
        perso1.src = "";
        curentIndex = null;
        dialogue.innerHTML = "";
        choix.innerHTML = "";
        console.log(musicDial)
        musicDial[musicDial.length -1].paused = true;
        musicBackground.paused = false;
        endSpeech();
        if (levelEnd) {
            console.log('hein ??'+levelEnd)
            parler(categorie,idObj, 49, endSpeech, mood);
        }
        console.log('helloreturn1');
        return 1;
    }
    else if (idConv === -10){
        imgHTMLContainer.style.display = 'none';
        dialogueUI.style.display = "none";
        endSpeech();
        doc.src = "";
        perso1.src = '';
        curentIndex = null;
        dialogue.innerHTML = "";
        choix.innerHTML = "";
        musicDial[musicDial.length -1].paused = true;
        musicBackground.paused = true;
        musicBackground = k.play('lvl2',{loop: true});
        resize = [];
        k.go('loadScreen2');
        return;
    }
    else if (idConv === -20){
        imgHTMLContainer.style.display = 'none';
        dialogueUI.style.display = "none";
        endSpeech();
        doc.src = "";
        perso1.src = '';
        curentIndex = null;
        dialogue.innerHTML = "";
        choix.innerHTML = "";
        musicDial[musicDial.length -1].paused = true;
        musicBackground.paused = true;
        musicBackground = k.play('lvl2',{loop: true});
        resize = [];
        k.go('loadScreen3');
        return;
    }
    if (categorie === "dialogues" || categorie === "objet"){
        data = dials.dialogues2.find(d => d.id === idConv);
        console.log(data)
        speaker = data.speaker;
        perso1.src = '/sprites/'+speaker+mood+'.png';
        imgHTMLContainer.style.display = 'block';
        if (data.speaker !== ""){
            perso1.style.display = 'block';
        } else {
            perso1.style.display = 'none';
        }
    }
    else if (categorie === "documents"){
        console.log("Categorie is 'documents', processing document...");
        data = dials.objets.find(d => d.id === idConv);
        speaker = data.speaker;
        console.log(idObj + speaker)
        readMagazine("sprites/"+data.img);
    }
    if (data) {
        console.log(objs)
        objs.forEach((o, index) => {
            console.log(o);
            console.log(idConv);
            let centerX = o.x + (o.width / 2);
            let centerY = o.y - (o.height / 2);

            // Vérifier si l'objet doit être remplacé
            if (o.activation === idConv) {
                // Créer un nouvel objet avec map.add()
                const newObject = map.add([
                    k.sprite(o.name),
                    k.area({
                        shape: new k.Rect(k.vec2(0), o.width, o.height),
                    }),
                    k.pos(centerX - 70, centerY - 60),
                    k.scale(2),
                ]);

                // Ajouter les propriétés supplémentaires à l'objet créé
                newObject.name = o.name;
                newObject.target = o.target;
                newObject.activation = o.activation;
                newObject.idObjs = o.idObjs; // Utiliser l'index actuel
                newObject.idConv = o.idConv;   // Mettre à jour idConv si nécessaire
                newObject.type = 'documents';

                // Remplacer l'ancien objet par le nouvel objet
                objs[index] = newObject;
            }
        });

        let splitText = decouperTexte(data.speech, '175');
        if (data.machine.length > 0 ){
            imgHTMLContainer.style.display = "block";
            const videoM = document.getElementById('videoMachine');
            perso1.style.display = 'none';
            machine.style.display = "flex";
            set_video('media/video/'+data.machine[1]);
            machine.src = "sprites/"+data.machine[0];
        }
        else if (data.machine.length === 0){
            machine.style.display = "none";
            set_video('');
        }
        dialogue.innerHTML = data.speaker+' : ';
        dialogue.innerHTML += splitText[curentIndex];
        const speechEntier = data.speech;
        const nextArrow = document.getElementById('next');
        nextArrow.style.display = 'block';

        showFullDialogueButton.style.display = 'none';

        function updateDialogue() {

            console.log(splitText)
            k.play('dial');
            if (curentIndex + 1 < splitText.length) {
                // Affichez le prochain morceau de texte
                curentIndex = curentIndex + 1;
                dialogue.innerHTML = data.speaker+' : ';
                dialogue.innerHTML += splitText[curentIndex];
            } else {
                nextArrow.style.display = "none";
                console.log(curentIndex)
                // Une fois que tous les morceaux de texte ont été affichés, ajoutez les choix
                dialogue.innerHTML = data.speaker+' : ';
                dialogue.innerHTML += splitText[curentIndex];
                nextArrow.removeEventListener('click', updateDialogue);
                showFullDialogueButton.style.display = 'block';
                showFullDialogueButton.addEventListener('click', toggleFullDialogue);
                addChoices(data, categorie, speaker, idConv, idObj, endSpeech,mood);
            }

            // Fonction pour basculer l'affichage complet du dialogue
            function toggleFullDialogue() {
                console.log(showFullDialogue)
                showFullDialogue = !showFullDialogue; // Inverser l'état

                if (showFullDialogue) {
                    dialogue.innerHTML = data.speech; // Afficher tout l'historique
                    showFullDialogueButton.textContent = "Masquer";
                } else {
                    dialogue.innerHTML = data.speaker + ' : ' + splitText[curentIndex]; // Afficher uniquement le morceau courant
                    showFullDialogueButton.textContent = "Afficher tout";
                }
            }



        }
        nextArrow.addEventListener('click', updateDialogue);
        k.onKeyPress("e", updateDialogue);
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
}

function initializeInitialPlayerState() {
    initialStatePlayer = statePlayer.map(stateObj => {
        let key = Object.keys(stateObj)[0];
        return { [key]: stateObj[key] }; // Copy initial state value
    });
}

// Fonction pour obtenir la valeur d'une clé spécifique dans l'état du joueur
function getPlayerStateValue(key) {
    let state = statePlayer.find(obj => obj.hasOwnProperty(key));
    return state ? state[key] : undefined;
}
// Fonction pour mettre à jour la valeur d'une clé spécifique dans l'état du joueur
function setPlayerStateValue(key, newValue) {
    let state = statePlayer.find(obj => obj.hasOwnProperty(key));
    if(state === null){state = 0};
    if (state) {

        state[key] = newValue;
    } else {
        let newState = {};
        newState[key] = newValue;
        statePlayer.push(newState);

    }
}

// Object to keep track of selected choices for each conversation
const selectedChoices = {};

// Function to add choices to the dialogue
function addChoices(dial, categorie, speaker, idConv, idObj, endSpeech, mood) {
    let choices = dial.choices;
    console.log(categorie);
    perso2.src = '/sprites/Pierre.png';
    perso2.style.display = 'block';
    let choicesHTML = '';
    choix.style.display = 'block';

    // Ensure the selectedChoices object has an entry for the current conversation
    if (!selectedChoices[idConv]) {
        selectedChoices[idConv] = new Set();
    }

    for (let i = 0; i < choices.length; i++) {
        const choice = choices[i];

        // Check if the choice has been selected before, and if it should always be shown
        if (selectedChoices[idConv].has(i) && !choice.alwaysVisible) {
            continue; // Skip this choice if it has been selected before and is not marked as always visible
        }

        if (choice.need && choice.need.length > 0) {
            const conditions = choice.need;
            let allConditionsMet = true;
            for (const condition of conditions) {
                let { key, operator, value } = condition;
                const playerValue = statePlayer.find(obj => obj.hasOwnProperty(key))[key];
                if (playerValue === undefined || operator === undefined || value === undefined) {
                    allConditionsMet = false;
                    break;
                }
                // Use "new Function" to evaluate the condition dynamically
                const conditionMet = new Function('playerValue', 'value', `return playerValue ${operator} value;`)(playerValue, value);
                if (!conditionMet) {
                    allConditionsMet = false;
                    break;
                }
            }
            if (allConditionsMet) {
                choicesHTML += '<img class="arrowChoice" src="sprites/arrow_choice.png">';
                choicesHTML += ("<p class='choixVar' id='" + i + "'>" + choice.speech + "</p>");
            }
        } else {
            choicesHTML += '<img class="arrowChoice" src="sprites/arrow_choice.png">';
            choicesHTML += ("<p class='choixVar' id='" + i + "'>" + choice.speech + "</p>");
        }
    }

    choix.innerHTML = choicesHTML;
    const choixVarHTML = document.querySelectorAll(".choixVar");
    choixVarHTML.forEach((el, idx) => {
        el.addEventListener('click', () => {
            showFullDialogueButton.style.display = 'none';
            k.play('choice');

            // Mark the choice as selected, unless it's always visible
            const choiceIndex = parseInt(el.id);
            if (!choices[choiceIndex].alwaysVisible) {
                selectedChoices[idConv].add(choiceIndex);
            }

            if (categorie === "dialogues") {
                console.log(choices[el.id].modifiers.length);
                if (choices[el.id].modifiers.length > 0) {
                    choices[el.id].modifiers.forEach(({ key, operator, value }) => {
                        const stateValue = getPlayerStateValue(key);
                        const newValue = new Function('stateValue', 'value', `return stateValue ${operator} value;`)(stateValue, value);
                        if (newValue < stateValue) {
                            mood = '_angry';
                        } else if (newValue > stateValue) {
                            mood = '_happy';
                        } else {
                            mood = '';
                        }
                        setPlayerStateValue(key, newValue);
                    });

// Check state values of Rcamille, Reric, Rarnaud, and Rthomas
                    const stateKeys = ['Rcamille', 'Reric', 'Rarnaud', 'Rthomas'];
                    let changedKeysCount = 0;

                    stateKeys.forEach(key => {
                        const value = getPlayerStateValue(key);
                        console.log(key + ': ' + value);

                        // Check if the value has changed from its initial null state
                        if (value !== null) {
                            changedKeysCount++;
                        }
                    });

// If at least 3 out of the 4 keys have changed, set levelEnd to true
                    if (changedKeysCount >= 3) {
                        console.log('At least 3 out of 4 keys have changed');
                        levelEnd = true;
                    }
                }
            }

            let nextId = choices[el.id].nextId;
            if (categorie === 'documents') {
                if (choices[el.id].remember) {
                    const documentId = inventoryPlayer.length + 1; // Generate a unique ID for the document
                    const documentInfo = {
                        id: dial.id,
                        speech: dial.speech,
                        activation: dial.activation,
                        targetObj: dial.target,
                        img: 'sprites/' + dial.img
                    };
                    // Add document info to the player's inventory
                    inventoryPlayer.push(documentInfo);
                    console.log(inventoryPlayer);
                    k.destroy(objs[idObj]);
                    markObjectAsDeleted(speaker);
                }
            }

            if (nextId === 0) {
                afficherInventaire(true, categorie, speaker, idConv, idObj, nextId, endSpeech, mood);
            } else {
                console.log(nextId);
                choix.innerHTML = '';
                parler(categorie, idObj, nextId, endSpeech, mood); // Use nextId in the call to parler
            }
        });

        el.addEventListener('mouseover', () => {
            k.play('choice');
        });
    });
}


async function markObjectAsDeleted(name) {
    let objectsB
    const layersB = mapDataB[idLVL].layers;
    for (const layer of layersB) {
        if (layer.objects) {
            objectsB = layer.objects
        }
    }
    const obj = objectsB.find(obj => obj.name === name);
    console.log(obj);
    if (obj) {
        obj.isDeleted = true;
        console.log(mapDataB);
    }
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
function afficherInventaire(choose, categorie, speaker, idConv, idObj, nextId, endSpeech, mood) {
    // Sélectionner l'élément HTML où vous voulez afficher l'inventaire
    const inventaireElement = document.getElementById('inventaire');

    // Vider le contenu de l'élément pour éviter les doublons
    inventaireElement.innerHTML = '';

    // Créer le bouton de fermeture
    const closeButton = document.createElement('div');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;'; // Symbole de croix
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '24px';
    closeButton.style.color = '#000'; // Couleur de la croix
    closeButton.addEventListener('click', () => {
        inventaireUI.style.display = "none"; // Masque l'inventaire
    });

    inventaireElement.appendChild(closeButton);

    // Parcourir le tableau inventoryPlayer pour chaque élément de l'inventaire
    inventoryPlayer.forEach((item) => {
        console.log(item);
        // Créer un élément div pour chaque élément de l'inventaire
        const itemElement = document.createElement('div');
        itemElement.classList.add('inventory-item');

        // Ajouter l'image de l'élément de l'inventaire à l'élément div
        const imgElement = document.createElement('img');
        imgElement.src = item.img;
        imgElement.id = item.id;
        itemElement.appendChild(imgElement);

        // Ajouter le texte de l'élément de l'inventaire à l'élément div
        const textElement = document.getElementById("textInventory");
        textElement.textContent = item.speech;
        imgElement.addEventListener('mouseenter', () => { textElement.style.display = 'block'; });
        imgElement.addEventListener('mouseleave', () => { textElement.style.display = 'none'; });
        imgElement.addEventListener('click', () => {
            console.log(targetObj + '   ' + idConv);
            if (choose && idConv === item.targetObj) {
                inventaireUI.style.display = "none";
                parler(categorie, idObj, parseInt(imgElement.id), endSpeech, mood);
            } else {
                dialogue.innerHTML = "C'est gentil mais je n'en ai pas besoin.";
                inventaireUI.style.display = "none";
            }
            textElement.style.display = 'block'; // Afficher le texte
        });
        if (!isInDialogue){
            imgElement.addEventListener('click', () => {
                const lightbox = document.getElementById('lightbox');
                const lightboxImg = document.getElementById('lightbox-img');
                lightboxImg.src = imgElement.src;
                lightbox.style.display = 'flex'; // Affiche la lightbox
            });}

        // Ajouter l'élément div à l'élément d'inventaire
        inventaireElement.appendChild(itemElement);
    });

    // Gestionnaire de clic pour fermer la lightbox
    const lightboxClose = document.getElementById('lightbox-close');
    lightboxClose.addEventListener('click', () => {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none'; // Cache la lightbox
    });

    // Sélectionner le conteneur des relations et vider son contenu pour éviter les doublons
    const relationElementContainer = document.getElementById('relations');
    relationElementContainer.innerHTML = ''; // Vider le contenu du conteneur des relations

    // Fonction pour transformer les clés en noms d'images
    function getImageName(key) {
        // Supprime le premier caractère (le "R") et met la première lettre en majuscule
        return key.substring(1, 2).toUpperCase() + key.substring(2) + ".png";
    }

    // Parcours chaque objet dans le tableau statePlayer
    statePlayer.forEach((rel) => {
        for (let key in rel) {
            let value = rel[key];

            // Vérifie si la valeur est null
            if (value === null) {
                continue; // Passe à la prochaine itération si value est null
            }

            let relElement = document.createElement('div');
            relElement.className = 'relation';

            // Crée un élément <img> pour représenter la personne
            let imgRelHTML = document.createElement('img');
            imgRelHTML.className = 'relation-img';
            imgRelHTML.src = '/sprites/' + getImageName(key); // Utilise le nom de fichier généré
            imgRelHTML.alt = key;

            let relationValueHTML = document.createElement('span');
            relationValueHTML.className = 'relationValue';

            // Ajouter les cœurs remplis ou non remplis en fonction de la valeur
            if (value >= 0) {
                // Ajouter des cœurs remplis pour les valeurs positives ou nulles
                for (let i = 0; i < value; i++) {
                    let heart = document.createElement('span');
                    heart.className = 'heart filled';
                    heart.innerHTML = '♥'; // Coeur rempli
                    relationValueHTML.appendChild(heart);
                }
            } else {
                // Ajouter des cœurs non remplis pour les valeurs négatives
                for (let i = 0; i < Math.abs(value); i++) {
                    let heart = document.createElement('span');
                    heart.className = 'heart empty';
                    heart.innerHTML = '♡'; // Coeur non rempli
                    relationValueHTML.appendChild(heart);
                }
            }

            relElement.appendChild(imgRelHTML);
            relElement.appendChild(relationValueHTML);
            relationElementContainer.appendChild(relElement);
        }
    });

    inventaireUI.style.display = "block";
}


function resizeBackground() {
    resize.push(k.width() / map.width);
    resize.push(k.height() / map.height);

    // Mettre à jour la taille de l'image de fond
    map.scale = k.vec2(
        resize[0],
        resize[1]
    );
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

k.scene('loadScreen1',() => {
    map = k.add([k.sprite('ld1'), k.pos(0), k.scale(1)]);
    const textBox = document.getElementById('loadScrren');
    const nextArrow = document.getElementById('go');

    textBox.style.display = 'block';
    resizeBackground();

    textBox.querySelector("p").innerHTML = '1986, petite ville du centre de l\'Europe, Pierre est un jeune adolescent passioné d\'électronique domaine dans lequel il effectue son apprentissage. Mais passé du temps derrière les bornes d\'arcades et surtout, passé du temps avec sa bande d\'amis derrière les bornes d\'arcades de la salle de jeu de sa ville, ça c\'est ce qui habite le plus joyeusement sa vie d\'ado. Son père vient de l\'appeler dans son garage, connu également comme son refuge pour bricoler ses câbles dont il a réussi à transmettre sa passion à son fils. Il veut lui montrer quelque chose...'
    nextArrow.style.display = 'block';
    nextArrow.addEventListener('click', () => {
        textBox.style.display = 'none';
        nextArrow.style.display = 'none';
        resize = [];
        k.go('level0');
    })

})

k.scene('loadScreen2',() => {
    map = k.add([k.sprite('ld2'), k.pos(0), k.scale(1)]);
    const textBox = document.getElementById('loadScrren');
    const nextArrow = document.getElementById('go');

    textBox.style.display = 'block';
    resizeBackground();

    textBox.querySelector("p").innerHTML =
        "Pierre enfile sa veste en cuir, attrape les clés de son appartement, et claque la porte derrière lui. En descendant les marches de l'escalier familier, il ressent une légère excitation monter en lui. La fraîcheur de la soirée lui pique le visage alors qu'il traverse le jardin de ses parents, éclairé par la lueur jaune des réverbères. Le grincement du portail en fer est presque couvert par le bruissement des feuilles agitées par le vent. Il marche d'un pas rapide le long des trottoirs qu'il connaît par cœur, ses chaussures frappant le pavé avec régularité. Les rires étouffés et les échos des conversations animées s'échappent des fenêtres entrouvertes, tandis que Pierre se dirige vers le bar où l'attendent déjà ses amis, devant le bar ou déjà à l'oeuvre derrière les bornes.";
    nextArrow.style.display = 'block';
    nextArrow.addEventListener('click', () => {
        textBox.style.display = 'none';
        nextArrow.style.display = 'none';
        resize = [];
        k.go('level2');
    })

})

k.scene('loadScreen3',() => {
    map = k.add([k.sprite('ld3'), k.pos(0), k.scale(1)]);
    const textBox = document.getElementById('loadScrren');
    const nextArrow = document.getElementById('go');

    textBox.style.display = 'block';
    resizeBackground();

    textBox.querySelector("p").innerHTML =
        "Il monte sur son vélomoteur, allume le moteur et se met en mouvement pour emprunter les 800 mètres de bitume qu'il connaît par cœur et qui le séparent de chez lui. Les pétarades du Peugeot s'éloignent dans la nuit tombante, tandis que le bruit des sticks matraqués et des voix électroniques annonçant un game over ou un meilleur score retentissent encore.";    nextArrow.style.display = 'block';
    nextArrow.addEventListener('click', () => {
        textBox.style.display = 'none';
        nextArrow.style.display = 'none';
        resize = [];
        k.go('mainMenu');
    })

})



// Créer la première scène
k.scene("level1", () => {
    // Créer le personnage
    idLVL = 1;
    objs = [];
    doc.src = "";
    set_video('');
    machine.src = '';
    idd = null;namee = null;type = null;
    imgHTMLContainer.style.display = 'none';
    choix.style.display = 'none';
    createMap(1,'thomas_bar',k.width()/2,k.height());
    k.setBackground(k.BLACK);

});

// Créer la deuxième scène
k.scene("level2", () => {
    idLVL = 2;
    doc.src = "";
    objs = [];
    idd = null;
    namee = null;
    type = null;
    set_video('');
    machine.src = '';
    imgHTMLContainer.style.display = 'none';
    choix.style.display = 'none';
    createMap(2,'bar',k.width()/2,k.height());
    k.setBackground(k.BLACK);
});

k.scene("level0", () => {
    idLVL = 0;
    musicBackground = k.play('lvl1',{loop: true});
    doc.src = "";
    idd = null;namee = null;type = null;
    set_video('');
    machine.src = '';
    imgHTMLContainer.style.display = 'none';
    choix.style.display = 'none';
    createMap(0,'garage',0,k.height());
    k.setBackground(k.BLACK);
});
k.scene("level3", () => {
    idLVL = 3;
    doc.src = "";
    objs = [];
    idd = null;namee = null;type = null;
    set_video('');
    machine.src = '';
    imgHTMLContainer.style.display = 'none';
    choix.style.display = 'none';
    createMap(3,'eric_bar',k.width()/2,k.height());
    k.setBackground(k.BLACK);
});


// Ajouter une option de menu
function addMenuOption(text, position, tag) {
    k.add([
        k.text(text, {
            font: "PressStart2P",
        }),
        k.pos(position),
        k.area(),
        k.body(),
        k.color(255, 255, 0),
        tag
    ]);


}

// Menu principal
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

    // Add "PRESS ANYWHERE TO START" option
    addMenuOption("START", k.vec2(k.width()/2 -200, k.height()/2 - 80), "start");

    // Add "Comment jouer ?" option
    addMenuOption("COMMENT JOUER ?", k.vec2(k.width()/2 -200, k.height()/2 + 20), "howToPlay");

    // Navigate to the level on any click (to preserve original functionality)
    k.onClick("start", () => {
        k.go("loadScreen1");

    });
    k.onHover("start", () => {
        k.color(k.RED);
    })

    // Navigate to the How to Play scene when "Comment jouer ?" is clicked
    k.onClick("howToPlay", () => {
        k.go("howToPlay");
    });
});

// Scene to show how to play the game
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

    // Instructions for controls
    k.add([
        k.text("Utilisez les touches fléchées pour vous déplacer.\n" +
            "Appuyez sur 'I' pour ouvrir l'inventaire.\n" +
            "Interagissez avec les personnages et objets\n" +
            "pour faire évoluer les relations et progresser\n" +
            "dans le jeu.", {
            font: "PressStart2P",
            size: 16,
        }),
        k.pos(50, 100),
        k.color(255, 255, 255),
    ]);

    // Instruction to go back to the main menu
    k.add([
        k.text("Appuyez sur n'importe quelle touche pour revenir au menu principal.", {
            font: "PressStart2P",
            size: 16,
        }),
        k.pos(50, 300),
        k.color(255, 255, 0),
    ]);

    // Return to the main menu on any key press
    k.onKeyPress(() => {
        k.go("mainMenu");
    });
});


fetchDataAndProcess();
k.go("mainMenu");