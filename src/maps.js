import { k } from "./kaboomCtx";
import {createPlayer} from "./player";
import {getCurrentLevel, loadedMaps, objectCache, resize} from "./globals";

// Stockage global des données de cartes
export let mapDataB = [];
export let map, objs = [];
export let mapL, mapR, mapX;


export function setObjs(value) {
    objs = value;
}
// Fonction pour charger les données de la carte
export async function fetchMapData() {
    const mapFiles = [
        '/jsons/garage.json',
        'jsons/bar_thomas.json',
        'jsons/bar.json',
        'jsons/bar_eric.json',
        'jsons/university.json'
    ];
    mapDataB = await Promise.all(
        mapFiles.map(file => fetch(`${file}?${Math.random()}`).then(res => res.json()))
    );
    console.log("Cartes chargées :", mapDataB);
}

// Fonction pour créer une carte à partir d'un fichier JSON
export async function createMap(numLVL, sprite, x, y) {
    objs = [];
    const layersB = mapDataB[numLVL].layers;
    mapL = mapDataB[numLVL].left;
    mapR = mapDataB[numLVL].right;
    mapX = mapDataB[numLVL].x;

    map = k.add([k.sprite(sprite), k.pos(0), k.scale(1)]);
    resizeBackground(map);

    layersB.forEach(layer => {
        if (layer.name === "boundaries") {
            createBoundaries(layer);
        }
        if (layer.class === "interact") {
            createInteractables(layer);
        }
        if (layer.objects) {
            createObjects(layer.objects);
        }
    });

    console.log("Objets de la carte :", objs);
    loadedMaps[numLVL] = true;

    // Créer le joueur après avoir généré la carte
    createPlayer();
}

// Créer les frontières de la carte
function createBoundaries(layer) {
    let r = 0; // Ligne
    let c = 0; // Colonne
    const cols = 38; // Nombre de colonnes (ajustez selon votre carte)
    const tileSize = 32; // Taille d'une tuile en pixels

    layer.data.forEach((id) => {
        if (id !== 0) { // Si l'ID est non nul, c'est un mur
            map.add([
                k.rect(tileSize, tileSize), // Rectangle de la taille d'une tuile
                k.color(255, 0, 0), // Couleur rouge pour le débogage
                k.outline(2, k.color(0, 0, 0)), // Bordure noire de 2px
                k.area({
                    shape: new k.Rect(k.vec2(0), tileSize, tileSize),
                }),
                k.body({ isStatic: true }), // Mur statique
                k.pos(c * tileSize, r * tileSize), // Position
                'wall', // Tag pour identifier les murs
            ]);
        }

        // Incrémentation des colonnes et gestion des lignes
        c++;
        if (c === cols) { // Lorsque la colonne atteint la limite, passer à la ligne suivante
            c = 0;
            r++;
        }
    });

    console.log(`Boundaries created for ${r} rows and ${cols} columns.`);
}


// Créer les objets interactifs
function createInteractables(layer) {
    let r = 0, c = 0;
    layer.data.forEach(id => {
        if (id !== 0) {
            const interactable = map.add([
                k.area({
                    shape: new k.Rect(k.vec2(0), 32, 32),
                }),
                k.pos(c * 32, r * 32),
                'camille',
            ]);
            interactable.name = layer.name;
            interactable.idConv = layer.idConv;
            interactable.type = 'dialogues';
        }
        if (c === 37) {
            c = 0;
            r++;
        } else {
            c++;
        }
    });
}

// Créer les objets interactifs à partir des couches
function createObjects(objects) {
    // Initialisez le cache pour le niveau actuel s'il n'existe pas encore
    if (!objectCache[getCurrentLevel()]) {
        objectCache[getCurrentLevel()] = [];
    }

    objects.forEach((o, index) => {
        // Recherchez l'objet dans le cache pour le niveau actuel
        const cachedObject = objectCache[getCurrentLevel()].find(cached => cached.idConv === o.id);

        if (cachedObject) {
            // Ajoutez toujours à objs, même si l'objet est supprimé
            console.log('objet ajouté depuis le cache',objectCache);
            objs.push(cachedObject);

            // Si l'objet n'est pas supprimé, ajoutez-le visuellement à la carte
            if (!cachedObject.isDeleted) {
                const addedObject = map.add([
                    k.sprite(cachedObject.name),
                    k.area({
                        shape: new k.Rect(k.vec2(0), 32, 32),
                    }),
                    k.pos(cachedObject.x, cachedObject.y),
                    k.scale(2),
                ]);
                Object.assign(addedObject, cachedObject);
                objs[objs.length - 1] = addedObject; // Remplacez la référence dans objs
            }
            return; // Passez au prochain objet
        }

        // Si l'objet n'est pas trouvé dans le cache, créez un nouvel objet
        const centerX = o.x + (o.width / 2);
        const centerY = o.y - (o.height / 2);

        const newObj = {
            name: o.name,
            target: o.target,
            activation: o.activation,
            idObjs: index,
            idConv: o.id,
            x: centerX - 70,
            y: centerY - 60,
            type: 'documents',
            isDeleted: o.isDeleted, // Par défaut, non supprimé
        };

        // Ajoutez toujours à objs, même si l'objet est supprimé
        objs.push(newObj);

        if (!newObj.isDeleted) {
            // Ajoutez visuellement l'objet à la carte s'il n'est pas supprimé
            const addedObject = map.add([
                k.sprite(o.name),
                k.area({
                    shape: new k.Rect(k.vec2(0), 32, 32),
                }),
                k.pos(newObj.x, newObj.y),
                k.scale(2),
            ]);
            Object.assign(addedObject, newObj);
            objs[objs.length - 1] = addedObject; // Remplacez la référence dans objs
        }
        // Ajoutez le nouvel objet au cache
        objectCache[getCurrentLevel()].push(newObj);
    });
}




// Fonction pour marquer un objet comme supprimé
export async function markObjectAsDeleted(name) {
    const layersB = mapDataB[getCurrentLevel()].layers;
    let objectsB = [];

    layersB.forEach(layer => {
        if (layer.objects) {
            objectsB = layer.objects;
        }
    });

    const obj = objectsB.find(obj => obj.name === name);
    if (obj) {
        obj.isDeleted = true;
        console.log(`Objet supprimé : ${name}`);
    } else {
        console.warn(`Objet introuvable : ${name}`);
    }
}


// Fonction pour redimensionner la carte
export function resizeBackground(map) {
    const scaleX = k.width() / map.width;
    const scaleY = k.height() / map.height;


    map.scale = k.vec2(scaleX, scaleY);
}