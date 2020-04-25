//声明全局变量
var webSocket;
var target = "ws://localhost:8080/collaboration/websocket";

if ('WebSocket' in window) {
    webSocket = new WebSocket(target);
} else if ('MozWebSocket' in window) {//火狐
    webSocket = new MozWebSocket(target);
} else {
    alert("请使用支持 WebSocket 的浏览器！");
}

webSocket.onopen=function(){
    setMessage("websocket开启连接成功");

}
webSocket.οnerrοr=function (ev) {
    setMessage("websocket 错误");
}
webSocket.onmessage=function (ev) {

    rects = null;

    //接收服务端发送的数据
    rects = JSON.parse(ev.data);

    alert(rects);

    //将从服务端接收的数据加入到全局 map 中
    for (let i = 0; i < rects.length; i++){
        map.set(rects[i].id, rects[i]);
    }

    alert(map.size);
    //重新绘制服务端发送的数据
    canvasDiv.drawRects(rects);

}
webSocket.onclose=function (ev) {
    setMessage("websocket关闭");
}

/*window.οnunlοad=function (ev) {
    closeWebSocket();
}*/

function openWebSocket(){
    webSocket.open();
}

function closeWebSocket(){
    webSocket.close()
}

function setMessage(message){
    document.getElementById("div").innerHTML+=message+"<br/>";
}

function sendMessage(){

    let content = JSON.stringify(rects);
    webSocket.send(content);


    /*
        for (let i = 0; i < rects.length; i++){
            let content = JSON.stringify(rects[i]);
            webSocket.send(content);
        }
        */
}

btns.save_btn.addEventListener("click", sendMessage);
