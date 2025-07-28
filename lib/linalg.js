

export  const Point = (x , y) => ({
    x: x,
    y: y,
})

const mult = (point, m) => Point(
    point.x * m,
    point.y * m
);


const sub = (p1, p2) => Point(
    p1.x - p2.x,
    p1.y - p2.y
);

const add = (p1, p2) => Point(
    p1.x + p2.x,
    p1.y + p2.y
);



export const LinAlg = {
    add,
    sub,
    mult
}

