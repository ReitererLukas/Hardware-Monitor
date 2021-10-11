function drawDiagram(canvasId, percent) {
    let canvas = document.querySelector("#"+canvasId);
    console.log("canvas"+canvasId);
    
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d");
        
        ctx.clearRect(0,0,canvas.width, canvas.height)

        ctx.beginPath();
        ctx.moveTo(50, 5);
        ctx.lineTo(50, 45);
        ctx.arc(50, 45, 40, Math.PI, Math.PI+Math.PI/180*(percent*1.8), false);
        ctx.lineTo(50, 45);
        ctx.fillStyle = "lime";
        ctx.fill();
        

        ctx.beginPath();
        ctx.arc(50, 45, 40, Math.PI, 0, false);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(50, 45, 25, Math.PI, 0, false);
        ctx.fillStyle = "white"
        ctx.fill();

        ctx.beginPath();
        ctx.arc(50, 45, 25, Math.PI, 0, false);
        ctx.stroke();

    }
}

function clearDrawing(canvasId) {
    let canvas = document.querySelector("#"+canvasId);
    
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width, canvas.height)
    }
}