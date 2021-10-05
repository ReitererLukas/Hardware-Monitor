let isdragging = false;
let diffToX, diffToY;

function onmove(event) {
    if(isdragging) {
        let window = document.querySelector(".window");
        let x = event.clientX - diffToX;
        let y = event.clientY - diffToY;
        window.style.left = x+"px";
        window.style.top = y+"px";
    }
}

function ondown(event) {
    diffToX = event.layerX
    diffToY = event.layerY
    isdragging = true;
}

function onup(event) {
    isdragging = false;
}