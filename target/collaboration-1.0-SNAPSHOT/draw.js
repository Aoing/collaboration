var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");

drawRect(ctx);


function drawRect(context){

    ctx.fillStyle = "#ff0000";

    ctx.fillRect(30, 30, 300, 300);
}