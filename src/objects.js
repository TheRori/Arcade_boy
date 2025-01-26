import {getCurrentLevel, objectCache, setobjectCache} from "./globals";
import {k} from "./kaboomCtx";
import {map} from "./maps";

export function handleObjectInteractions(idConv, objs, map, k) {
    objs.forEach((o, index) => {
        if (o.activation === idConv && !o.isAdded) {
            console.log('objet ajouté');
            const newObject = map.add([
                k.sprite(o.name),
                k.area({
                    shape: new k.Rect(k.vec2(0), 32, 32),
                }),
                k.pos(o.x, o.y),
                k.scale(2),
            ]);
            Object.assign(newObject, {
                name: o.name,
                target: o.target,
                activation: o.activation,
                idObjs: index,
                idConv: o.idConv,
                type: 'documents',
            });
            objs[index].isAdded = true; // Marquer comme ajouté pour éviter les doublons
            objs[index] = newObject;
            setobjectCache(getCurrentLevel(),newObject);
        }
    });
}
