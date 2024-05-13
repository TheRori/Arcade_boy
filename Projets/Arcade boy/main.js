import { k } from "./kaboomCtx";

const LVL = [
    "wwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwww",
    "w             w",
    "w             w",
    "w             w",
    "w             w",
    "w             w",
    "w             w",
    "w             w",
    "w             w",
    "w             w",
    "w             w",
    "w             w",
    "w             w",
    "wwwwwwwwwwwwwwww"
]

const imgHTML = document.getElementById('imgContainer');


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
        parler('father', 1,() => (player.isInDialogue = false));
        // play_minigame('pong');
        //set_video('media/video/space_invaders.mp4')
        player.isInDialogue = true;
        stopAnims();
        player.moveSpeed = 0;
    })
    k.onCollideUpdate('player', 'magazine', () => {
        readMagazine();
        console.log('salut');
        stopAnims();
        player.moveSpeed = 0
    })

    function readMagazine(mag) {
       const m=  document.getElementById("amstrad_03");
       m.style.display = "block";
    }
    function parler(speaker,numSpe, endSpeech) {

        const dialogueUI = document.getElementById("textbox-container");
        const dialogue = document.getElementById("dialogue");
        const choix = document.getElementById("choix");
        let statePlayer = [];

        k.loadJSON('speeches','speeches.json').then(dialogues => {
            dialogueUI.style.display = "block";
            const firstSpeech = dialogues.dialogues1.find(d => d.order === numSpe && d.speaker === speaker);
            dialogue.innerHTML = firstSpeech.speech;
            addChoices(firstSpeech);
            function addChoices(dial) {
                let choices = dial.choice;
                let choicesHTML = '';
                for (let i = 0; i < choices.length; i++) {
                    choicesHTML += ("<p class='choixVar' id='"+i+"'>"+choices[i]+"</p>");
                }
                choix.innerHTML = choicesHTML;
                const choixVarHTML = document.querySelectorAll(".choixVar");
                choixVarHTML.forEach((el,idx) => {
                    el.addEventListener('click', () => {
                        statePlayer.push(el.id);
                        console.log(statePlayer);
                        let nextSpe = dialogues.diag.find(d => d.order === numSpe + 1 && JSON.stringify(d.need) === JSON.stringify(statePlayer));
                        if (nextSpe) {
                            numSpe = numSpe + 1;

                            dialogue.innerHTML = nextSpe.speech;
                            addChoices(nextSpe);
                        }
                        else {
                            dialogue.innerHTML = '';
                            choix.innerHTML = '';
                            endSpeech();
                        }

                    } )
                })
            }


        });
        const closeBtn = document.getElementById("close");
        function onCloseBtnClick() {
            if (wallState === 0) {
                wallState += 1;
                imgHTML.style.display = 'block';
                endSpeech();
                dialogueUI.style.display = "none";
                dialogue.innerHTML = "";
                closeBtn.removeEventListener("click", onCloseBtnClick);
                setTimeout(function() {
                    parler('father', 1,() => (player.isInDialogue = false));
                }, 6000);
                set_video('media/video/space_invaders.mp4');
            }
        }

        closeBtn.addEventListener("click", onCloseBtnClick);

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