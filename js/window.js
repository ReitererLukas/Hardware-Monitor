function closeWindow() {
    if(websocket !== null) {
        websocket.close();
    }
    document.querySelector(".window").remove();
}

function createWindow() {
    let drawIds = ["cpu", "memory", "disk"]
    let otherIds = ["network", "pids", "error"]
    let window = document.createElement("div");
    window.className="window";

    let tabbar = document.createElement("div");
    tabbar.id = "tabbar"
    let tabButtons = document.createElement("span");
    tabButtons.id = "tabButtons";
    tabbar.appendChild(tabButtons);
    let close = document.createElement("span");
    close.className = "close";
    close.innerHTML="X";
    tabbar.appendChild(close);
    window.appendChild(tabbar);

    let windows = document.createElement("div");
    windows.className = "windows";

    for(let id of drawIds) {
        let div = document.createElement("div");
        let canvas = document.createElement("canvas");
        canvas.id = id;
        canvas.width = "100";
        canvas.height = "50";
        div.appendChild(canvas);

        let span = document.createElement("span");
        span.id = id+"Span";
        div.appendChild(span);
        windows.appendChild(div);
    }

    for(let id of otherIds) {
        let div = document.createElement("div");
        let span = document.createElement("span");
        span.id = id;
        div.appendChild(span);
        windows.appendChild(div);
    }

    let resizeRightDown = document.createElement("span");
    resizeRightDown.id = "resizeRightDown";
    windows.appendChild(resizeRightDown);
    
    window.appendChild(windows);

    document.querySelector("#body").appendChild(window);
    

    // for mouse events --> moving and resizing window
    document.querySelector("#tabbar").onmousedown = (ev) => ondownDragWindow(ev);
    document.querySelector("#tabbar").onmouseup = (ev) => onupDragWindow(ev);
    document.querySelector(".window").onmouseup = (ev) => onupResizeWindow(ev);
    document.querySelector(".window").onmousedown = (ev) => ondownResizeWindow(ev);

    // event to close the window
    document.querySelector(".close").onclick = closeWindow;
}
