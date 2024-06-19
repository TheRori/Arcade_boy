import { k } from "./kaboomCtx";
k.loadFont("PressStart2P", "fonts/PressStart2p-vaV7.ttf");


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

let resize = [];
let statePlayer = [{"Rpapa" : -1},{"Rcamille" : 0},{"Reric" : 0},{"Rarnaud": 0},{"Rthomas": 0},{"Rconsole":0}];
let objs = []
let idd,idObj, namee, type;
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

let inventoryPlayer = [
];


let collide = false;
k.loadSprite("garage", "sprites/garage.png");
k.loadSprite("map", "sprites/map.png");
k.loadSprite("bar", "sprites/bar.png");
k.loadSprite("eric_bar", "sprites/eric_bar.png");
k.loadSprite("thomas_bar", "sprites/thomas_bar.png");
k.loadSprite("np_construire", "sprites/np_construire.png");
k.loadSprite("np_appleII", "sprites/np_appleII.png");

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

function set_video(link) {
    let video = document.getElementById("video");
    let source = document.getElementById("videoMachine");
    // Modification de la source de la vidéo
    source.src = link;
    video.load();
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
    function resizeBackground() {
        resize.push(k.width() / map.width);
        resize.push(k.height() / map.height);

        // Mettre à jour la taille de l'image de fond
        map.scale = k.vec2(
            resize[0],
            resize[1]
        );
    }
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
            if (!o.isDeleted) {
                const centerX = o.x + (o.width / 2);
                const centerY = o.y - (o.height / 2);
                console.log(centerX, centerY)// Changer le signe '-' en '+' pour le centerY

                objs.push(map.add([
                    k.sprite(o.name),
                    k.area({
                        shape: new k.Rect(k.vec2(0), o.width, o.height),
                    }),
                    k.pos(centerX - 70, centerY - 60),
                    k.scale(2),
                ]));
                objs[i].name = o.name;
                objs[i].idObjs = i;
                objs[i].idConv = o.id;
                objs[i].type = 'documents';
                i += 1;
            }
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
            isInDialogue: false,
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
        if (player.isInDialogue === true) return;
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
            inventoryDisplay = true;
            afficherInventaire()
        }
        else {
            inventaireUI.style.display = "none";
            inventoryDisplay = false;
        }
    })
    function handleClick() {
        player.isInDialogue = true;
        infoUI.style.display = 'none';
        k.play('dial')
        musicDial.push(k.play(namee,{loop: true}));
        // Retirer l'écouteur d'événements dès que le clic se produit
        info.removeEventListener('click', handleClick);

        choix.innerHTML = '';

        if (type === 'documents') {
            console.log('bouh' + type);
            parler("documents", idObj, idd, () => {
                player.isInDialogue = false;
            },'');

        } else if (type === 'dialogues') {
            console.log('salut');
            parler("dialogues", idObj, idd, () => {
                player.isInDialogue = false;
                musicDial.paused = true;
            },'');
        }

        stopAnims();
        player.moveSpeed = 0;

    }

    k.onDraw(() => {
        if (player.isInDialogue === true) {
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
       namee = objj.name;
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

               console.log(posBubblex,posBubbley,resize);
               collide = false;
               console.log("ajouter");
               player.readySpeak = true;
               info.addEventListener('click', handleClick);
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
}

async function parler(categorie,idObj, idConv, endSpeech, mood) {
    const dials = await (await fetch("dials.json?"+Math.random())).json();
    let curentIndex = 0;
    let stateMachine ="";
    let speaker;
    musicBackground.paused = true;
    dialogueUI.style.display = 'block'
    choix.style.display = 'none';
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
        return;
    }
    else if (idConv === -10){
        imgHTMLContainer.style.display = 'none';
        dialogueUI.style.display = "none";
        endSpeech();
        doc.src = "";
        curentIndex = null;
        dialogue.innerHTML = "";
        choix.innerHTML = "";
        musicDial[musicDial.length -1].paused = true;
        musicBackground.paused = true;
        musicBackground = k.play('lvl2',{loop: true});
        k.go('level2');
        return;
    }
    if (categorie === "dialogues" | categorie === "objet"){
        data = dials.dialogues2.find(d => d.id === idConv);
        console.log(data)
        speaker = data.speaker;
        perso1.src = '/sprites/'+speaker+mood+'.png';
        imgHTMLContainer.style.display = 'block';
        perso1.style.display = 'block';
    }
    else if (categorie === "documents"){
        data = dials.objets.find(d => d.id === idConv);
        speaker = data.speaker;
        console.log(idObj + speaker)
        readMagazine("sprites/"+data.img);
    }
    if (data) {
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
            function updateDialogue() {
                console.log(splitText)
                k.play('dial');
                if (curentIndex + 1 < splitText.length) {
                    // Affichez le prochain morceau de texte
                    curentIndex = curentIndex + 1;
                    dialogue.innerHTML = data.speaker+' : ';
                    dialogue.innerHTML += splitText[curentIndex];
                } else {
                    curentIndex = null;
                    nextArrow.style.display = "none";
                    // Une fois que tous les morceaux de texte ont été affichés, ajoutez les choix
                    dialogue.innerHTML = data.speaker+' : ';
                    dialogue.innerHTML += data.speech;
                    nextArrow.removeEventListener('click', updateDialogue);
                    addChoices(data, categorie, speaker, idObj, endSpeech,mood);
                    data = null
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

function addChoices(dial,categorie,speaker,idObj,endSpeech,mood) {

    let choices = dial.choices;
    perso2.src = '/sprites/Pierre.png';
    perso2.style.display = 'block';
    let choicesHTML = '';
    choix.style.display = 'block';
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
                choicesHTML += '<img class="arrowChoice" src="sprites/arrow_choice.png">';
                choicesHTML += ("<p class='choixVar' id='" + i + "'>" + choices[i].speech + "</p>");
            }
        } else {
            choicesHTML += '<img class="arrowChoice" src="sprites/arrow_choice.png">';
            choicesHTML += ("<p class='choixVar' id='" + i + "'>" + choices[i].speech + "</p>");
        }
    }
    if(categorie === "dialogues"){
        choicesHTML += '<img class="arrowChoice" src="sprites/arrow_choice.png">'
        choicesHTML += ("<p class='choixVar' id='obj'>"+ "Essayer un objet…"  + "</p>");
    }
    choix.innerHTML = choicesHTML;
    const choixVarHTML = document.querySelectorAll(".choixVar");
    choixVarHTML.forEach((el, idx) => {
        el.addEventListener('click', () => {
            choix.innerHTML = '';
            k.play('choice');
            if(categorie === "dialogues"){
            if (choices[idx].modifiers.length > 0) {
                choices[idx].modifiers.forEach(({ key, operator, value }) => {
                    const stateValue = getPlayerStateValue(key);
                    const newValue = new Function('stateValue', 'value', `return stateValue ${operator} value;`)(stateValue, value);
                    if (newValue < stateValue) {
                        mood = '_angry';
                    }
                    else if (newValue > stateValue) {
                        mood = '_happy';
                    }
                    else {mood = '';}
                    setPlayerStateValue(key, newValue);
                    console.log(statePlayer);
                });
            }}
            let nextId = choices[idx].nextId;
            if (categorie === 'documents') {
                if(choices[idx].remember){
                    const documentId = inventoryPlayer.length + 1; // Génère une ID unique pour le document
                    const documentInfo = {
                        id: dial.id,
                        speech: dial.speech,
                        img: 'sprites/'+dial.img
                    };
                    // Ajoute les informations du document à l'inventaire du joueur
                    inventoryPlayer.push(documentInfo);
                    console.log('dial'+dial.speaker)
                    k.destroy(objs[idObj]);
                    markObjectAsDeleted(speaker);
                    console.log("Document ajouté à l'inventaire:", documentInfo);
                }
            }
            if (el.id ==="obj"){
                categorie = 'objet';
                afficherInventaire(true,categorie, speaker, idObj, nextId, endSpeech,mood);
            }
            else{
                console.log(nextId);
                parler(categorie, idObj, nextId, endSpeech,mood);  // Utilisation de nextId dans l'appel de parler
            }
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
function afficherInventaire(choose,categorie, speaker, idObj, nextId, endSpeech,mood) {
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
        const textElement = document.getElementById("textInventory");
        textElement.textContent = item.speech;
        imgElement.addEventListener('mouseenter',() => {textElement.style.display = 'block'})
        imgElement.addEventListener('mouseleave',() => {textElement.style.display = 'none'})
        imgElement.addEventListener('click', () => {
            if (choose){
                inventaireUI.style.display = "none";
                parler(categorie, idObj, parseInt(imgElement.id), endSpeech,mood);
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
    idLVL = 1;
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
    idd = null;namee = null;type = null;
    set_video('');
    machine.src = '';
    imgHTMLContainer.style.display = 'none';
    choix.style.display = 'none';
    createMap(3,'eric_bar',k.width()/2,k.height());
    k.setBackground(k.BLACK);
});
// Charger la première scène au démarrage

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
        k.color(0, 255, 30)
    ]);

    addMenuOption("PRESS ANYWHERE TO START", k.vec2(300, 205), "start");

    k.onClick(() => {
        k.go("level0");
    });
});

fetchDataAndProcess();
k.go("mainMenu");