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

    const n = 1000;

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
        line[0],
    ];
}


export const MapController = () => {

    const frameSize = {
        width: window.screenX,
        height: window.screenY
    }

    const $showShadows = Observable(false);
    const $image = Observable("");


    const $lines = ObservableList([]);
    const $character = Observable({
        x: 450,
        y: 221
    });


    const $$selected = Observable(Observable([
        {x: -100, y: -100},
        {x: -100, y: -100},
    ]));


    const $shadows = ObservableList([]);


    const calcAllShadows = () => {
        const calcLineShadow = calcShadow($character.getValue());

        for (let $shadow of $shadows.list) {
            const shadow = $shadow.getValue();
            const line = shadow.$line.getValue();
            const points = calcLineShadow(line)

            $shadow.setValue({
                points: points,
                $line: shadow.$line,
            });
        }
    };


    const addLine = (p1, p2) => {
        const $line = Observable([p1, p2]);
        $lines.add($line);

        const p = $character.getValue();
        $shadows.add(Observable(
            {
                points: calcShadow(p)([p1, p2]),
                $line: $line
            }
        ));
    };


    return {
        frameSize,
        toggleShadow: _ => $showShadows.setValue(!$showShadows.getValue()),
        onShowShadowChange: $showShadows.onChange,

        setImage: (image) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                $image.setValue(event.target.result);
            }
            reader.readAsDataURL(image);
        },

        onImageChange: $image.onChange,

        setCharacterPoint: (vector) => {
            const newPoint = LinAlg.add($character.getValue(), vector);

            $character.setValue(newPoint);

            calcAllShadows();
        },


        onCharacterChange: $character.onChange,
        onShadowAdd: $shadows.onAdd,

        addLine,
        duplicateLine: _ => {
            const [p1, p2] = $$selected.getValue().getValue();

            const deltaX = 50;
            const deltaY  = 60;
            addLine(
                {
                    x: p1.x + deltaX,
                    y: p1.y + deltaY,
                },
                {
                    x: p2.x + deltaX,
                    y: p2.y + deltaY,
                });
        },
        moveLine: ($line, vector) => {
            const [p1, p2] = $line.getValue()

            $line.setValue([
                LinAlg.add(p1, vector),
                LinAlg.add(p2, vector),
            ])

            calcAllShadows();
        },

        updateLinePoints: ($line, p1, p2) => {
            $line.setValue([p1, p2])

            calcAllShadows();
        },


        selectItem: $$selected.setValue,
        onSelected: $$selected.onChange,

        onLineAdd: $lines.onAdd,
        onLIneRemove: $lines.onDel

    }


}