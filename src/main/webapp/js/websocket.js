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

    //将从服务端接收的数据加入到全局 map 中
    for (let i = 0; i < rects.length; i++){
        map.set(rects[i].id, rects[i]);
    }

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

/*function sendMessage() {
    //将全局的注释数组转为 json 串
    let content = JSON.stringify(rects);
    //发送到服务端
    webSocket.send( type + "::" + content);
}*/

//使用闭包函数可以在 addEventListener 中传递参数
function sendMessage(type){

    return function () {
        let content = "";
        /*switch (type) {
            case "save":
                //将全局的注释数组转为 json 串
                content = JSON.stringify(rects);
                console.log("保存数据")
                break;

            case "delete":
                content = JSON.stringify(deleteArr);
                console.log("删除数据")
                break;

            case "modify":
                content = JSON.stringify(modifyArr);
                console.log("修改数据")
                break;

            default:
                break;

        }*/

        if (deleteArr != null && deleteArr.length > 0){
            type = "delete";
            content = JSON.stringify(deleteArr);
            webSocket.send( type + "::" + content);
            console.log("删除数据")
        }

        if (modifyArr != null && modifyArr.length > 0){
            type = "modify";
            content = JSON.stringify(modifyArr);
            webSocket.send( type + "::" + content);
            console.log("修改数据")
        }
        if (addArr != null && addArr.length > 0){
            type = "save";
            //将全局的注释数组转为 json 串
            content = JSON.stringify(addArr);
            webSocket.send( type + "::" + content);
            console.log("保存数据")
        }
    }

}

btns.save_btn.addEventListener("click", sendMessage("save"));
//btns.delete_btn.addEventListener("click", sendMessage("delete"));