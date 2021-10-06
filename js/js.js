let servers = [];
document.addEventListener("DOMContentLoaded", onloaded);
let websocket;


function onloaded() {
    document.querySelector("#butAdd").onclick = onAdd;

    // for mouse events --> moving and resizing window
    document.onmousemove = (ev) => onmove(ev);
    document.querySelector("#tabbar").onmousedown = (ev) => ondownDragWindow(ev);
    document.querySelector("#tabbar").onmouseup = (ev) => onupDragWindow(ev);
    document.querySelector(".window").onmouseup = (ev) => onupResizeWindow(ev);
    document.querySelector(".window").onmousedown = (ev) => ondownResizeWindow(ev);

    // event to close the window
    document.querySelector(".close").onclick = closeWindow;
}

function closeWindow() {
    document.querySelector(".window").remove();
}

function onAdd() {
    let ip = document.querySelector("#inpIP").value;
    let port = document.querySelector("#inpPort").value;
    let name = document.querySelector("#inpName").value;

    if(!verifyInput(ip, port, name))
        return;

    servers.push({ socket: ip + ":" + port, name: name });
    generateTabs();
}

function createWindow() {
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

    let cpuDiv = document.createElement("div");
    let cpu = document.createElement("span");
    cpu.id = "cpu";
    cpuDiv.appendChild(cpu);
    windows.appendChild(cpuDiv);

    let memoryDiv = document.createElement("div");
    let memory = document.createElement("span");
    memory.id = "memory";
    memoryDiv.appendChild(memory);
    windows.appendChild(memoryDiv);

    let diskDiv = document.createElement("div");
    let disk = document.createElement("span");
    disk.id = "disk";
    diskDiv.appendChild(disk);
    windows.appendChild(diskDiv);
    
    let networkDiv = document.createElement("div");
    let network = document.createElement("span");
    network.id = "network";
    networkDiv.appendChild(network);
    windows.appendChild(networkDiv);
    
    let pidsDiv = document.createElement("div");
    let pids = document.createElement("span");
    pids.id = "pids";
    pidsDiv.appendChild(pids);
    windows.appendChild(pidsDiv);
    
    let errorDiv = document.createElement("div");
    let error = document.createElement("span");
    error.id = "error";
    errorDiv.appendChild(error);
    windows.appendChild(errorDiv);

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

function verifyInput(ip, port, name) {
    if (ip === "" || port === "" || name === "") {
        alert("you have to enter values!");
        return false;
    }

    for(const server of servers) {
        if(server.name === name) {
            alert("Name already exists");
            return false;
        }
    }

    return true;
}

function closeTab(index) {
    if (index >= servers.length)
        generateTabs()
    let i = 0;
    while (i < servers.length - 1) {
        if (i >= index) {
            servers[i] = servers[i + 1];
        }
        i++;
    }
    servers.pop();

    generateTabs();
}

function generateTabs() {
    if(document.querySelector(".window") === null) {
        createWindow();
    }

    let buttons = document.querySelector("#tabButtons");

    buttons.innerHTML = "";
    let index = 0;
    while (index < servers.length) {
        let tab = document.createElement("span");
        let button = document.createElement("span");
        let close = document.createElement("span");

        button.innerHTML = servers[index].name;
        button.value = index;
        button.className = "tabButton"
        button.onclick = (e) => showMonitor(e.target.value);
        tab.appendChild(button);

        close.innerHTML = "X"
        close.value = index;
        close.onclick = (e) => closeTab(e.target.value);
        close.className = "tabClose";
        tab.appendChild(close);

        tab.className = "tab";
        buttons.appendChild(tab);
        index++;
    }
}

function showMonitor(index) {
    resetMonitor();
    // close websocket connection if active
    // before you create a new one
    if (websocket != null)
        websocket.close();

    try {
        websocket = new WebSocket("ws://" + servers[index].socket);
    } catch (e) {
        document.querySelector("#error").value = e.message;
    }

    websocket.onerror = (e) => document.querySelector("#error").innerHTML = "Server is not reachable";


    websocket.onmessage = (e) => {
        let data = JSON.parse(e.data);
        showData(data);
    };

}

function showData(data) {
    console.log(data);
    document.querySelector("#cpu").innerHTML = data.cpu + "%";
    document.querySelector("#memory").innerHTML = data.memory + "%";
    document.querySelector("#disk").innerHTML = data.disk + "%";
    document.querySelector("#network").innerHTML = data.network;
    document.querySelector("#pids").innerHTML = data.pids;
}

function resetMonitor(data) {
    console.log(data);
    document.querySelector("#cpu").innerHTML = "";
    document.querySelector("#memory").innerHTML = "";
    document.querySelector("#disk").innerHTML = "";
    document.querySelector("#network").innerHTML = "";
    document.querySelector("#pids").innerHTML = "";
    document.querySelector("#error").innerHTML = "";
}
