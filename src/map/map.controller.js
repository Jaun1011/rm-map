import {Observable, ObservableList} from "../../lib/observable.js";
import {LinAlg} from "../../lib/linalg.js";

const calcShadow = (p) => (line) => {


    const v1 = {
        x: line[0].x - p.x,
        y: line[0].y - p.y
    };

    const v2 = {
        x: line[1].x - p.x,
        y: line[1].y - p.y
    };

    const n = 100;

    const p1 = {
        x: v1.x * n,
        y: v1.y * n
    };

    const p2 = {
        x: v2.x * n,
        y: v2.y * n
    };

    return [
        p1,
        p2,
        line[1],
        line[0]
    ];
}


export const MapController = () => {


    const frameSize = {
        width: window.screenX,
        height: window.screenY
    }


    const $lines = ObservableList([]);
    const $character = Observable({
        x: frameSize.width / 2,
        y: frameSize.height / 2
    });

    const $image = Observable("");


    const $$selected = Observable(Observable([
        {x:-100, y:-100},
        {x:-100, y:-100},
    ]));


    return {
        frameSize,

        setImage: $image.setValue,
        onImageChange: $image.onChange,

        setCharacter: $character.setValue,
        onCharacterChange: $character.onChange,

        addLine: (p1, p2) => {
            $lines.add(Observable([p1, p2]))
        },

        moveLine: ($line, vector) => {
            const [p1, p2] = $line.getValue()


            $line.setValue([
                LinAlg.add(p1, vector),
                LinAlg.add(p2, vector),
            ])
        },



        selectItem: $$selected.setValue,



        onSelected: $$selected.onChange,


        onLineAdd: $lines.onAdd


    }


}