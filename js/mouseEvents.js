let isdragging = false, isResizing = false;
let diffToX, diffToY;

function onmove(event) {
    let window = document.querySelector(".window");
    if(isdragging) {
        let x = event.clientX - diffToX;
        let y = event.clientY - diffToY;
        window.style.left = x+"px";
        window.style.top = y+"px";
    } else if(isResizing) {
        let rect = window.getBoundingClientRect();
        let x = event.clientX;
        let y = event.clientY;

        window.style.width = (x - rect.left) + "px"; 
        window.style.height = (y - rect.top) + "px"; 
    }
}

function ondownDragWindow(event) {
    diffToX = event.layerX
    diffToY = event.layerY
    isdragging = true;
}

function onupDragWindow(event) {
    isdragging = false;
}

function ondownResizeWindow(event) {
    isResizing = true;
}

function onupResizeWindow(event) {
    isResizing = false;
}