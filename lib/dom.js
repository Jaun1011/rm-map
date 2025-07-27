
export const dom = html => {
    const element = document.createElement("div");
    element.innerHTML = html;
    return element.children;
}