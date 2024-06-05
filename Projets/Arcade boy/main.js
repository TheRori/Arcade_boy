import { k } from "./kaboomCtx";

const imgHTML = document.getElementById('appleII');
const imgHTMLContainer = document.getElementById('imgContainer');


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
    let source = document.getElementById("srcVideo");
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
                    map.add([
                        k.area({
                            shape: new k.Rect(k.vec2(0), 32, 32),
                        }),
                        k.pos(c * 32, r * 32),
                        k.sprite('wall1'),
                        'camille',
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
        for (const o of layer.objects) {
            map.add([
                k.area({
                    shape: new k.Rect(k.vec2(0), o.width, o.height),
                }),
                k.body({isStatic: true}),
                k.sprite('wall1'),
                k.pos(o.x + o.width/2, o.y - o.height/2),
                o.name,
            ]);}
    }}

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
    k.onCollide('player', 'camille', () => {
        k.onKeyDown("space", () => {
            if (!player.isInDialogue) {
                parler("dialogues",'Camille', 1, 1, () => (player.isInDialogue = false));
                // play_minigame('pong');
                //set_video('media/video/space_invaders.mp4')
                player.isInDialogue = true;
                stopAnims();
                player.moveSpeed = 0;
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
    k.onCollide('player', 'np_construire', () => {
        readMagazine('sprites/construire.png');
        parler("documents",'construire',1,1,() => (player.isInDialogue = false))
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
                })}
        })
    })



    function readMagazine(src_img) {
        const doc = document.getElementById('doc');
        doc.src=src_img
        doc.style.display = "block";
    }

    let slideIndex = 1;
    function plusDivs(n,mag) {
        showDivs(slideIndex += n,mag);
    }

    function showDivs(n,mag) {
        let i;
        let x = document.getElementsByClassName(mag);
        if (n > x.length) {slideIndex = 1}
        if (n < 1) {slideIndex = x.length}
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        x[slideIndex-1].style.display = "block";
    }


    return player;
}

async function parler(categorie,speaker,numSpe, idConv, endSpeech) {
    const dials = await (await fetch("dials.json")).json();
    const dialogueUI = document.getElementById("textbox-container");
    const dialogue = document.getElementById("dialogue");
    const choix = document.getElementById("choix");
    let curentIndex = 0;
    let stateMachine ="";
    dialogueUI.style.display = "block";
    let firstSpeech;
    if (idConv === -1){
        imgHTMLContainer.style.display = 'none';
        dialogueUI.style.display = "none";
        endSpeech();
        curentIndex = null;
        dialogue.innerHTML = "";
        choix.innerHTML = "";
        return;
    }
    if (categorie === "dialogues"){
        firstSpeech = dials.dialogues2.find(d => d.order === numSpe && d.speaker === speaker);
    }
    else if (categorie === "documents"){
        firstSpeech = dials.documents.find(d => d.order === numSpe && d.speaker === speaker);
    }
    if (firstSpeech) {
        let splitText = decouperTexte(firstSpeech.speech, '150');
        if (splitText.length > 1) {
            dialogue.innerHTML = splitText[curentIndex];
            k.onKeyPress("e",() => {
                // Vérifiez s'il y a encore des morceaux de texte à afficher
                if (curentIndex+1 < splitText.length) {
                    // Affichez le prochain morceau de texte
                    curentIndex = curentIndex + 1;
                    dialogue.innerHTML = splitText[curentIndex];
                } else {
                    curentIndex = null;
                    // Une fois que tous les morceaux de texte ont été affichés, ajoutez les choix
                    dialogue.innerHTML = firstSpeech.speech;
                    addChoices(firstSpeech,categorie,speaker,numSpe,endSpeech);
                }
            })
        } else {
            dialogue.innerHTML = firstSpeech.speech;
            addChoices(firstSpeech,categorie,speaker,numSpe,endSpeech);

        }
        if (firstSpeech.end === true) {

            closeBtn.style.display = 'block';
            closeBtn.addEventListener("click",() =>{onCloseBtnClick(firstSpeech.machine)});
        }
        let statePlayer = {"Rpapa" : -1};
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

function addChoices(dial,categorie,speaker,numSpe,endSpeech) {

    let choices = dial.choices;
    let nextId = dial.id;
    let choicesHTML = '';

    for (let i = 0; i < choices.length; i++) {
        if (choices[i].need && choices[i].need.length > 0) {
            const conditions = choices[i].need;
            let allConditionsMet = true;
            for (const condition of conditions) {
                const { key, operator, value } = condition;
                const playerValue = statePlayer[key];
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
    choix.innerHTML = choicesHTML;
    const choixVarHTML = document.querySelectorAll(".choixVar");
    choixVarHTML.forEach((el, idx) => {
        el.addEventListener('click', () => {
            choix.innerHTML = '';
            const nextId = choices[idx].nextId;  // Capture l'ID du choix cliqué
            if (categorie === 'documents') {
                if(choices[idx].remember){
                    console.log(dial.speech)
                }
            }
            parler(categorie, speaker, numSpe + 1, nextId, endSpeech);  // Utilisation de nextId dans l'appel de parler
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