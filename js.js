let servers = [];
document.addEventListener("DOMContentLoaded", onloaded);
let websocket;


function onloaded() {
    document.querySelector("#butAdd").onclick = onAdd;
}

function onAdd() {
    let ip = document.querySelector("#inpIP").value;
    let port = document.querySelector("#inpPort").value;

    if(ip === "" || port === "") {
        alert("you have to enter values!")
        return
    }
    
    servers.push(ip+":"+port);
    generateTabs();
}

function generateTabs() {
    let buttons = document.querySelector("#buttons");

    buttons.innerHTML = "";
    let index = 0;
    while(index < servers.length) {
        let button = document.createElement("button");
        button.innerHTML="Server "+(index+1)
        button.value = index;
        button.onclick = (e) => showMonitor(e.target.value)
        buttons.appendChild(button)
        index++;
    }
}

function showMonitor(index) {
    resetMonitor();
    // close websocket connection if active
    // before you create a new one
    if(websocket != null) 
        websocket.close();

    try {
        websocket = new WebSocket("ws://"+servers[index]);
    } catch (e) {
        console.log("123");
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
