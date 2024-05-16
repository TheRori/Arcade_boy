import { k } from "./kaboomCtx";

const imgHTML = document.getElementById('appleII');
const imgHTMLContainer = document.getElementById('imgContainer');


k.loadSprite("map", "sprites/map.png");
k.loadSprite("wall1", "sprites/wall.png");

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
const layers = mapData.layers;

const map = k.add([k.sprite("map"), k.pos(0), k.scale(2)]);
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
createPlayer(200,100);
    console.log(k.get("map"));

}
export function createPlayer(position) {
    // Créez le personnage avec un sprite et une position

    const player = k.add([
        k.sprite('teen'),
        k.scale(2),
        k.pos(position),
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
    k.onCollide('player', 'father', () => {
        parler('father#1', 1,1,() => (player.isInDialogue = false));
        // play_minigame('pong');
        //set_video('media/video/space_invaders.mp4')
        player.isInDialogue = true;
        stopAnims();
        player.moveSpeed = 0;
        k.onDraw(() => {
            if(player.isInDialogue === true) {

                k.drawRect({
                tag: 'sepia',
                width: 256 * 2,
                height: 256 * 2,
                pos: k.vec2(0),
                color: k.rgb(127, 96, 58),
                opacity: 0.5,
            })}
        })
    })
    k.onCollide('player', 'magazine', () => {
        readMagazine();
        parler('mag#1',1,3,() => (player.isInDialogue = false))
        stopAnims();
        player.isInDialogue = true;
        player.moveSpeed = 0
        k.onDraw(() => {
            if (player.isInDialogue === true) {
                k.drawRect({
                tag: 'sepia',
                width: 256 * 2,
                height: 256 * 2,
                pos: k.vec2(0),
                color: k.rgb(127, 96, 58),
                opacity: 0.5,
            })}
        })
    })

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


    function readMagazine(mag) {
        const prevBtn = document.getElementById('pre-mag');
        const nextBtn = document.getElementById('next-mag');
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        prevBtn.addEventListener('click',() => {plusDivs(-1,'amstradebdo')})
        nextBtn.addEventListener('click',() => {plusDivs(1,'amstradebdo')})
       showDivs(1,'amstradebdo');
    }

    let slideIndex = 1;
    function plusDivs(n,mag) {
        showDivs(slideIndex += n,mag);
    }

    function showDivs(n,mag) {
        console.log(slideIndex);
        let i;
        let x = document.getElementsByClassName(mag);
        console.log(x);
        if (n > x.length) {slideIndex = 1}
        if (n < 1) {slideIndex = x.length}
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        x[slideIndex-1].style.display = "block";
    }

    let statePlayer = [];

    function parler(speaker,numSpe, idConv, endSpeech) {

        const dialogueUI = document.getElementById("textbox-container");
        const dialogue = document.getElementById("dialogue");
        const choix = document.getElementById("choix");
        let stateMachine ="";

        k.loadJSON('speeches','speeches.json').then(dialogues => {
            dialogueUI.style.display = "block";
            const firstSpeech = dialogues.dialogues1.find(d => d.order === numSpe && d.speaker === speaker && JSON.stringify(d.need) === JSON.stringify(statePlayer));
            if (firstSpeech) {
                console.log(firstSpeech);
                let splitText = decouperTexte(firstSpeech.speech, '150');
                console.log(splitText)
                if (splitText.length > 1) {
                    dialogue.innerHTML = splitText[0];
                    for (let i = 1; i < splitText.length; i++) {
                        console.log(splitText[i])
                        setTimeout(function () {
                            dialogue.innerHTML = splitText[i];
                        }, 3000*i);
                    }
                } else {
                    dialogue.innerHTML = firstSpeech.speech;
                }
                setTimeout(function () {
                    dialogue.innerHTML = firstSpeech.speech;
                    addChoices(firstSpeech);
                }, splitText.length * 3000 + 2000);
                if (firstSpeech.end === true) {
                    closeBtn.style.display = 'block';
                    closeBtn.addEventListener("click",() =>{onCloseBtnClick(firstSpeech.machine)});
                }
                function addChoices(dial) {
                    let choices = dial.choice;
                    let choicesHTML = '';
                    for (let i = 0; i < choices.length; i++) {
                        choicesHTML += ("<p class='choixVar' id='" + i + "'>" + choices[i] + "</p>");
                    }
                    choix.innerHTML = choicesHTML;
                    const choixVarHTML = document.querySelectorAll(".choixVar");
                    choixVarHTML.forEach((el, idx) => {
                        el.addEventListener('click', () => {
                            statePlayer.push(el.id);
                            choix.innerHTML = '';
                            parler(speaker,numSpe+1,idConv,endSpeech);
                        })
                    })
                }

            }
            else  {
                dialogue.innerHTML = '';
                choix.innerHTML = '';
                endSpeech();
                player.isInDialogue = false;
            }
        });
        const closeBtn = document.getElementById("close");
        function onCloseBtnClick(mach) {
            console.log(mach);
            player.isInDialogue = false;
            if (mach !== '') {
                imgHTMLContainer.style.display = 'block';
                imgHTML.style.display = 'block';
                endSpeech();
                dialogueUI.style.display = "none";
                dialogue.innerHTML = "";
                closeBtn.removeEventListener("click", onCloseBtnClick);
                setTimeout(function () {
                    statePlayer = [];
                    parler('father#2', 1, 2, () => (player.isInDialogue = false));
                }, 6000);
                set_video('media/video/space_invaders.mp4');
            }
            else {
                imgHTMLContainer.style.display = 'none';
                dialogueUI.style.display = "none";
                endSpeech();
                dialogue.innerHTML = "";
            }
        }



        k.onKeyPress('space', () => {
            k.destroy(dialogue);
        })
    }


    return player;
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