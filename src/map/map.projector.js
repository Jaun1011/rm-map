import {Circle, Line, PolyLine, Svg, SvgContainer} from "../../lib/svg.js";
import {MapController} from "./map.controller.js";
import {dom} from "../../lib/dom.js";
import {LinAlg, Point} from "../../lib/linalg.js";


const projectDisableShadowButton = controller => {
    const [button] = dom(`<button>shadows</button>`);
    button.onclick = _ => controller.toggleShadow();
    return button;
}

const projectWallButton = controller => {
    const [lineButton] = dom(`<button>line</button>`);
    lineButton.onclick = _ => controller.addLine(
        {x: 100, y: 100},
        {x: 200, y: 200}
    );
    return lineButton;
}


const DragAndDrop = (item, callback) => {
    let isDragged = false;
    let lastPoint = {};

    item.addEventListener("mousedown", event => {
        lastPoint = {
            x: event.clientX,
            y: event.clientY
        };

        isDragged = true;
    });

    const dragging = event => {

        if (!isDragged) return;

        const currentPoint = {
            x: event.clientX,
            y: event.clientY
        }

        const delta = LinAlg.sub(currentPoint, lastPoint);
        callback(delta);
        lastPoint = currentPoint;
    }

    const draggingEnd = event => {
        dragging(event);
        isDragged = false;
    }

    addEventListener("mousemove", dragging);
    addEventListener("mouseup", draggingEnd);
    addEventListener("mouseleave", draggingEnd);
}


const projectSelectedLine = controller => {
    const c = SvgContainer();

    const c1 = Circle({x: 0, y: 0}, 10);
    const c2 = Circle({x: 0, y: 0}, 10);

    let $selectedLine;
    let point1, point2;

    controller.onSelected(($selected) => {
        $selectedLine = $selected;
        $selected.onChange(([p1, p2]) => {
            point1 = p1;
            point2 = p2;

            c1.setAttribute("cx", p1.x);
            c1.setAttribute("cy", p1.y);

            c2.setAttribute("cx", p2.x);
            c2.setAttribute("cy", p2.y);
        });
    });

    DragAndDrop(c1, (vector) => controller.updateLinePoints($selectedLine, LinAlg.add(point1, vector), point2));
    DragAndDrop(c2, (vector) => controller.updateLinePoints($selectedLine, point1, LinAlg.add(point2, vector)));

    c.appendChild(c1);
    c.appendChild(c2);

    return c;
}

const projectLine = controller => {

    const root = SvgContainer();

    controller.onLineAdd($line => {
        const lineElement = Line(
            Point(0, 0),
            Point(0, 0)
        );

        $line.onChange((ln) => {

            const [p1, p2] = ln;

            lineElement.setAttribute("x1", p1.x);
            lineElement.setAttribute("y1", p1.y);
            lineElement.setAttribute("x2", p2.x);
            lineElement.setAttribute("y2", p2.y);

            root.appendChild(lineElement);
        })

        DragAndDrop(lineElement, (vector) => {
            controller.selectItem($line);
            controller.moveLine($line, vector);
        })
    });

    return root
}


const projectCharacter = controller => {

    const charaCircle = Circle({
        y: 0, x: 0
    });

    charaCircle.setAttribute("fill", "red");


    controller.onCharacterChange(character => {
        charaCircle.setAttribute("cx", character.x);
        charaCircle.setAttribute("cy", character.y);
    });


    DragAndDrop(charaCircle, (vec) => {
        controller.setCharacterPoint(vec)


    })

    return charaCircle;
}


const projectShadow = controller => {


    const g = SvgContainer();

    controller.onShadowAdd($shadow => {
        const polygon = PolyLine();
        $shadow.onChange(s => {
            const points = s.points
                .map(p => `${p.x},${p.y}`)
                .reduce((a, b) => a + " " + b)


            console.log(points)
            polygon.setAttribute("points", points);
        });

        controller.onShowShadowChange(toggle => {
            polygon.setAttribute("visibility", toggle ? "visible" : "hidden");

        })


        g.appendChild(polygon);
    })

    return g;
}

const projectSvg = (controller) => {

    const svgE = Svg();

    svgE.appendChild(projectCharacter(controller));
    svgE.appendChild(projectLine(controller));
    svgE.appendChild(projectSelectedLine(controller));
    svgE.appendChild(projectShadow(controller));

    return svgE;
}


const projectButtonBar = (controller) => {
    const bar = document.createElement("div");

    bar.setAttribute("class", "buttonbar");
    bar.appendChild(projectWallButton(controller));
    bar.appendChild(projectDisableShadowButton(controller));
    return bar;
}


export const projectMap = root => {

    const controller = MapController();

    root.appendChild(projectButtonBar(controller));
    root.appendChild(projectSvg(controller));
}