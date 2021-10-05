// import { ondown, onmove, onup } from "./moveWindow.js";

let servers = [];
document.addEventListener("DOMContentLoaded", onloaded);
let websocket;


function onloaded() {
    document.querySelector("#butAdd").onclick = onAdd;
    document.onmousemove = (ev) => onmove(ev);
    document.querySelector("#tabbar").onmousedown = (ev) => ondown(ev);
    document.querySelector("#tabbar").onmouseup = (ev) => onup(ev);
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
