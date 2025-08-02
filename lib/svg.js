const element = name => document.createElementNS("http://www.w3.org/2000/svg", name);

export const Svg = _ =>{
    const svg = element("svg");

    return svg;

}

export const SvgContainer = _ =>  element("g")


export const Line = (p1, p2, color = "red") => {
    const l = element("line")

    l.setAttribute("x1", p1.x);
    l.setAttribute("y1", p1.y);

    l.setAttribute("x2", p2.x);
    l.setAttribute("y2", p2.y);

    l.setAttribute("stroke", color);
    l.setAttribute("stroke-width", "10");

    return l;
}


export const Image = (
    src,
    point = {x: 0, y: 0},
    height = "100%",
    width = "100%"
)=> {
    const e = element("image")

    e.setAttribute("href", src);
    e.setAttribute("x", point.x);
    e.setAttribute("y", point.y);
    e.setAttribute("height", height);
    e.setAttribute("width", width);

    return e;
}

export const Circle = (point, radius = 5, color = "red") => {
    const e = element("circle");

    e.setAttribute("cx", point.x);
    e.setAttribute("cy", point.y);
    e.setAttribute("cz", 1);
    e.setAttribute("r", radius);
    e.setAttribute("fill", color)
    return e;
}


export const PolyLine = _ => {
    const e = element("polyline");
    return  e;
}


