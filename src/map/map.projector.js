import {Circle, Line, Svg, svgContainer} from "../../lib/svg.js";
import {MapController} from "./map.controller.js";
import {dom} from "../../lib/dom.js";
import {LinAlg, Point} from "../../lib/linalg.js";

const projectCharacterButton = controller => {
    const [characterButton] = dom(`<button>chara</button>`);
    let toggle = false;

    characterButton.onclick = _ => {
        toggle = !toggle;
        characterButton.classList.toggle("active");
    };

    addEventListener("click", (event) => {
        if (toggle) {
            controller.setCharacter({
                x: event.clientX,
                y: event.clientY
            });
        }
    })

    return characterButton;
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
    const c = svgContainer();

    const c1 = Circle({x: 0, y: 0}, 10);
    const c2 = Circle({x: 0, y: 0}, 10);

    let selectedLine;
    let point1, point2;

    controller.onSelected(($selected) => {
        selectedLine = $selected;
        $selected.onChange(([p1, p2]) => {
            point1 = p1;
            point2 = p2;

            c1.setAttribute("cx", p1.x);
            c1.setAttribute("cy", p1.y);

            c2.setAttribute("cx", p2.x);
            c2.setAttribute("cy", p2.y);
        });
    });


    DragAndDrop(c1, (vector) => {
        controller.updateLinePoints(
            selectedLine,
            LinAlg.add(point1, vector),
            point2
        )
    });

    DragAndDrop(c2, (vector) => {
        controller.updateLinePoints(
            selectedLine,
            point1,
            LinAlg.add(point2, vector)
        )
    });

    c.appendChild(c1);
    c.appendChild(c2);
    return c;
}

const projectLine = controller => {

    const root = svgContainer();

    controller.onLineAdd($line => {
        const lineElement = Line(Point(0, 0), Point(0, 0));
        $line.onChange((ln) => {

            const [p1, p2] = ln;

            lineElement.setAttribute("x1", p1.x)
            lineElement.setAttribute("y1", p1.y)
            lineElement.setAttribute("x2", p2.x)
            lineElement.setAttribute("y2", p2.y)

            root.appendChild(lineElement)
        })

        DragAndDrop(lineElement, (vector) => {
            controller.selectItem($line);
            controller.moveLine($line, vector);
        })


    });

    return root
}


const projectCharacter = controller => {

    const charaCircle = Circle({x: 0, y: 0});
    controller.onCharacterChange(character => {
        charaCircle.setAttribute("cx", character.x);
        charaCircle.setAttribute("cy", character.y);
    });

    return charaCircle;
}


const projectSvg = (controller) => {

    const svgE = Svg();

    svgE.appendChild(projectCharacter(controller))
    svgE.appendChild(projectLine(controller))
    svgE.appendChild(projectSelectedLine(controller))

    return svgE;
}


const projectButtonBar = (controller) => {
    const bar = document.createElement("div");

    bar.setAttribute("class", "buttonbar")
    bar.appendChild(projectCharacterButton(controller))
    bar.appendChild(projectWallButton(controller))
    return bar;
}


export const projectMap = root => {

    const controller = MapController();

    root.appendChild(projectButtonBar(controller))
    root.appendChild(projectSvg(controller));
}