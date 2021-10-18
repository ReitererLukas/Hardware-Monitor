let servers = [];
document.addEventListener("DOMContentLoaded", onloaded);
let websocket = null;
let first = true;


function onloaded() {
    document.querySelector("#butAdd").onclick = onAdd;

    // for mouse events --> moving and resizing window
    document.onmousemove = (ev) => onmove(ev);
    // createWindow();

}

function onAdd() {
    let ip = document.querySelector("#inpIP").value;
    let port = document.querySelector("#inpPort").value;
    let name = document.querySelector("#inpName").value;

    if (!verifyInput(ip, port, name))
        return;

    servers.push({ socket: ip + ":" + port, name: name });
    generateTabs();

    if (first) {
        first = !first;
        alert("You can move and resize the window")
    }
}

function verifyInput(ip, port, name) {
    if (ip === "" || port === "" || name === "") {
        alert("you have to enter values!");
        return false;
    }

    for (const server of servers) {
        if (server.name === name) {
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
    if (servers.length == 0 && websocket != null) {
        websocket.close();
    }
    resetMonitor();
    generateTabs();
}

function generateTabs() {
    if (document.querySelector(".window") === null) {
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
    drawDiagram("cpu", data.cpu);
    document.querySelector("#cpuSpan").innerHTML = "CPU usage " + data.cpu + "%";
    drawDiagram("memory", data.memory);
    document.querySelector("#memorySpan").innerHTML = "Memory usage " + data.memory + "%";
    drawDiagram("disk", data.disk);
    document.querySelector("#diskSpan").innerHTML = data.disk + "%";
    document.querySelector("#network").innerHTML = data.network + " network connections";
    document.querySelector("#pids").innerHTML = data.pids + " running processes";
}

function resetMonitor(data) {
    console.log(data);
    clearDrawing("cpu");
    clearDrawing("memory");
    clearDrawing("disk");
    document.querySelector("#cpuSpan").innerHTML = "";
    document.querySelector("#memorySpan").innerHTML = "";
    document.querySelector("#diskSpan").innerHTML = "";
    document.querySelector("#network").innerHTML = "";
    document.querySelector("#pids").innerHTML = "";
    document.querySelector("#error").innerHTML = "";
}
