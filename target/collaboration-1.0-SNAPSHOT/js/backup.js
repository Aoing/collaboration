//定义全局变量
var globale = {


}

var map = new Map();

//保存删除的元素
var deleteArr = [];

//保存移动修改的元素
var modifyArr = [];

//创建矩形框集合
var rects=[
    {
        xStart : 0,
        yStart : 0,
        width : 100,
        height : 100,
        xEnd : 100,
        yEnd : 100,
        position : "bottomRight",
        mark : "1",
        lineWidth :1,
        borderColor: "blue",
        isSelected : false,
        author : "author",
        date : "20200424",
        id : 0,

    },
]


//定义创建按钮的div成员，传入此创建的按钮所要添加到的父div的id
function CreateButtonDiv(div_id){

    this.div_id = div_id;

    //定义绘制拉选框按钮
    this.draw_btn = null;

    //定义移动矩形框按钮
    this.move_btn = null;

    //定义删除矩形框按钮
    this.delete_btn = null;

    //定义保存矩形框按钮
    this.save_btn = null;


}

//定义创建按钮的div原型方法
CreateButtonDiv.prototype = {
    //重设constructor属性，将其指向CreateButtonDiv构造函数
    constructor : CreateButtonDiv,

    createButton : function(){
        //创建绘制拉选框按钮
        this.draw_btn = document.createElement("input");
        this.draw_btn.type = "button";
        this.draw_btn.value="绘制矩形框";
        this.div_id.append(this.draw_btn);

        //创建移动拉选框按钮
        this.move_btn = document.createElement("input");
        this.move_btn.type = "button";
        this.move_btn.value="移动矩形框";
        this.div_id.append(this.move_btn);

        //创建删除注释按钮
        this.delete_btn = document.createElement("input");
        this.delete_btn.type = "button";
        this.delete_btn.value="删除矩形框";
        this.div_id.append(this.delete_btn);

        //创建删除注释按钮
        this.save_btn = document.createElement("input");
        this.save_btn.type = "button";
        this.save_btn.value="保存矩形框";
        this.div_id.append(this.save_btn);
    }

}


// drawConstructor，定义成员变量，即绘图的context属性, 传入包裹 canvas 的父 div
function drawConstructor(div){

    //2020-4-24 15:09:32    添加作者属性
    this.author = null;

    this.id = null;

    this.date = null;

    this.div = div;

    //获取传入的canvas_div左上角坐标值
    this.canvas_div_left = div.getClientRects()[0].x;
    this.canvas_div_top = div.getClientRects()[0].y;

    //获取传入的 div 的长度和宽度
    this.div_w = this.div.style.width;
    this.div_h = this.div.style.height;

    //定义画布
    this.canvas = null;

    //定义画布的尺寸
    this.canvas_w = null;
    this.canvas_h = null;

    //定义当前对象的绘图环境
    this.context = null;

    //鼠标左键点击的坐标值
    this.x = null;
    this.y = null;

    //圆心坐标
    this.x0;
    this.y0;

    //鼠标左键按下的坐标值
    this.xStart = null;
    this.yStart = null;

    //鼠标松开按键时坐标值
    this.xEnd  = null;
    this.yEnd  = null;

    //定义矩形框线宽
    this.lineWidth = 1;

    //定义边线颜色
    this.borderColor = "blue";

    //定义注释的标志
    this.mark = null;

    //绘制结束坐标相对开始坐标的位置，默认右下角
    this.position = "bottomRight";

    //定义被选中的注释所在注释数组的下标
    this.selectedIndex = null;

    //定义被选中的注释 id
    this.selectedID = null;

    //定义被选中的注释
    this.selectedAnnotation = null;

    //获取被选中的矩形的绘制起始点坐标
    this.selected_xStart = null;
    this.selected_yStart = null;

    //获取被选中的矩形的绘制结束点坐标
    this.selected_xEnd = null;
    this.selected_yEnd = null;

    //将全局的注释数组赋值给当前对象的数组
    this.rects = rects;
}

// drawConstructor 原型，用来定义方法
drawConstructor.prototype = {

    //重设constructor属性，将其指向KM_Annotation_Constructor构造函数
    constructor : drawConstructor,

    createCanvas : function(){

        //创建canvas画布
        this.canvas = document.createElement("canvas");

        //设置画布尺寸
        this.canvas_w = (this.div_w).substring(0,( this.div_w).length-2);
        this.canvas_h = (this.div_h).substring(0,( this.div_h).length-2);

        //将 canvas 插入到 div 中
        this.div.append( this.canvas);

        //设置canvas位置为浮动
        this.canvas.style.position = "absolute";

        //获取绘图context
        this.context = this.canvas.getContext('2d');

        //设置 canvas 画布的尺寸和边线样式
        this.canvas.width = this.canvas_w;
        this.canvas.height = this.canvas_h;
        this.canvas.style.border = "dashed";
        this.canvas.style.borderColor = "blue";
        this.canvas.style.borderWidth = "1";
    },

    //添加注释对象，定义默认属性
    addAnnotation : function(){

        var annotationElement = {

            //鼠标点击开始绘制的矩形框的顶点坐标，判断初始坐标和终点坐标大小，将小的赋值给初始坐标
            xStart : this.xStart < this.xEnd ? this.xStart : this.xEnd,
            yStart : this.yStart < this.yEnd ? this.yStart : this.yEnd,

            //矩形框的宽度和高度
            width : Math.abs(this.xEnd - this.xStart),
            height : Math.abs(this.yEnd - this.yStart),

            //圆心坐标
            x0 : this.x0,
            y0 : this.y0,

            //矩形框的结束点坐标
            xEnd : this.xStart > this.xEnd ? this.xStart : this.xEnd,
            yEnd : this.yStart > this.yEnd ? this.yStart : this.yEnd,

            //定义注释的标志
            mark : this.mark,

            //标记绘制结束坐标相对开始坐标的位置，便于后期确定鼠标是否选中注释
            position : this.position,

            lineWidth : this.lineWidth,

            //判断注释右下角是否被选中
            isSelected : false,

            date : (new Date()).toLocaleString(),
        };

        //将注释对象保存到注释数组中
        rects.push(annotationElement);
    },

    deleteAnnotation : function(e){

        //将当前对象 this 赋值给 __this：代表 drawConstructor 对象，否则在触发事件时，this 指向的事件
        _this = this;

        ev = e || event;
        _this.x = ev.offsetX;
        _this.y = ev.offsetY;

        _this.selectedAnnotation = _this.isSelected(rects);

        if(_this.selectedAnnotation != null){
            //移除注释数组中被选中的注释
            for (let i = 0; i < rects.length; i++) {
                if (_this.selectedAnnotation.id == rects[i].id) {
                    console.log("被删除的注释 id ：" + _this.selectedAnnotation.id)
                    rects.splice(i, 1);
                    //将删除的元素保存到 删除的数组中
                    deleteArr.push(_this.selectedAnnotation);
                }
            }

            //重新绘制注释
            _this.drawRects(rects);
        }

    },

    //绘制单个矩形框（在触发mousemove事件时调用），绘制拉选框
    drawRect : function(){

        // 清除画布，准备绘制，如果不清除会导致绘制很多矩形框
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 清除画布后，需要重新绘制，因为这个方法是在鼠标按下并移动的时候进行绘制的，
        // 如果不重新绘制所有注释，则在鼠标按下移动触发MouseMove事件时会导致画布处于被清空状态，
        // 当松开鼠标按键触发 mouseup 事件才会重新绘制
        this.drawRects(rects);

        this.context.beginPath();
        //this.context.rect( this.xStart, this.yStart, this.width, this.height);

        //通过路径绘制矩形
        this.context.moveTo(this.xStart, this.yStart);
        this.context.lineTo(this.xEnd, this.yStart);
        this.context.lineTo(this.xEnd, this.yEnd);
        this.context.lineTo(this.xStart, this.yEnd);
        this.context.lineTo(this.xStart, this.yStart);

        this.context.strokeStyle = 'blue';
        this.context.lineWidth = 1;
        // this.context.fillStyle = 'red';
        // this.context.fill();
        this.context.stroke();
    },

    //绘制所有矩形框
    drawRects : function(rects){

        //将当前对象 this 赋值给 __this：代表 drawConstructor 对象，否则在触发事件时，this 指向的事件
        //_this = this;

        // 清除画布，准备绘制
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 遍历所有矩形框
        for(let i=0; i < rects.length; i++) {
            let rect = rects[i];
            // 绘制矩形
            // _this.context.strokeStyle="#FF0000";
            // _this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            this.context.beginPath();
            //_this.context.rect(rect.xStart, rect.yStart, rect.width, rect.height);

            //通过路径绘制矩形
            this.context.moveTo(rect.xStart, rect.yStart);
            this.context.lineTo(rect.xEnd, rect.yStart);
            this.context.lineTo(rect.xEnd, rect.yEnd);
            this.context.lineTo(rect.xStart, rect.yEnd);
            this.context.lineTo(rect.xStart, rect.yStart);

            this.context.strokeStyle = rect.borderColor;
            this.context.lineWidth = rect.lineWidth;
            // _this.context.fillStyle = 'red';
            // _this.context.fill();
            this.context.stroke();

            this.context.fillText("("+ rect.xStart +","+ rect.yStart+"),"+ rect.mark, rect.xStart, rect.yStart+10);

            // _this.context.fillText("!!!!!!!!!!!!!!!!!", rects[i].xUp-400, rects[i].yUp-400);
            this.context.fillText("("+ rect.xEnd+","+ rect.yEnd+"),"+ rect.mark, rect.xEnd, rect.yEnd);



            // if (rect.isSelected) {
            //     _this.context.lineWidth = 1;
            // }
            // else {
            //     _this.context.lineWidth = 5;
            // }
        }
    },

    //绘制圆
    drawCircle : function(x0,y0){

        //将当前对象 this 赋值给 __this：代表 drawConstructor 对象，否则在触发事件时，this 指向的事件
        _this = this;

        _this.context.beginPath();
        _this.context.arc(x0, y0, 5, 0, 2 * Math.PI, false);
        _this.context.stroke();

    },


    //判断鼠标是否选中注释，如果选中注释右下角则将 isSelected 置为 true ,并且返回该注释对应的注释数组下标
    isSelected : function(annotationArr){

        /*//将当前对象 this 赋值给 __this：代表 drawConstructor 对象，否则在触发事件时，this 指向的事件
        _this = this;*/

        for(let i = annotationArr.length-1; i >= 0; i--){
            let annotation = annotationArr[i];
            //使用路径绘制矩形时，直接判断鼠标点击坐标是否在矩形内即可
            if((annotation.xStart < this.x) && (annotation.yStart < this.y) && (annotation.xEnd >= this.x ) && (annotation.yEnd >= this.y )){

                //判断鼠标是否点击右下角，如果点击右下角则将rects[i].isSelected置位true
                if((annotation.xEnd - 10 < this.x) && (annotation.yEnd - 10 < this.y) && (annotation.xEnd >= this.x ) && (annotation.yEnd >= this.y )){

                    annotation.isSelected = true;
                }

                //alert("选中矩形框:"+rects[i].mark);
                return annotation;
            }


            //使用 rect 绘制矩形的时候，需要判断绘制矩形的初始坐标点和终点坐标点相对位置
            /*switch(rects[i].position){
                case "bottomRight":
                    if((rects[i].xStart < this.x) && (rects[i].yStart < this.y) && (rects[i].xStart + rects[i].width >= this.x ) && (rects[i].yStart + rects[i].height >= this.y )){

                        //判断鼠标是否点击右下角，如果点击右下角则将rects[i].isSelected置位true
                        if((rects[i].xStart + rects[i].width - 10 < this.x) && (rects[i].yStart + rects[i].height - 10 < this.y) && (rects[i].xStart + rects[i].width >= this.x ) && (rects[i].yStart + rects[i].height >= this.y )){

                            rects[i].isSelected = true;
                        }

                        //alert("选中矩形框:"+rects[i].mark);
                        return i;
                    }
                    break;

                case "topRight":
                    if((rects[i].xStart < this.x ) && (rects[i].yStart > this.y ) && (rects[i].xStart + rects[i].width >= this.x ) && (rects[i].yStart + rects[i].height <= this.y )){

                        //判断鼠标是否点击右上角，如果点击右上角则将rects[i].isSelected置位true
                        if((rects[i].xStart + rects[i].width - 10 < this.x) && (rects[i].yStart + rects[i].height - 10 > _this.y) && (rects[i].xStart + rects[i].width >= this.x ) && (rects[i].yStart + rects[i].height <= this.y )){

                            rects[i].isSelected = true;
                        }

                        return i;
                    }
                    break;

                case "topLeft":
                    if((rects[i].xStart > this.x ) && (rects[i].yStart > this.y ) && (rects[i].xStart + rects[i].width <= this.x ) && (rects[i].yStart + rects[i].height <= this.y )){

                        //判断鼠标是否点击左上角，如果点击左上角则将rects[i].isSelected置位true
                        if((rects[i].xStart + rects[i].width - 10 > this.x) && (rects[i].yStart + rects[i].height - 10 > this.y) && (rects[i].xStart + rects[i].width <= this.x ) && (rects[i].yStart + rects[i].height <= this.y )){

                            rects[i].isSelected = true;
                        }

                        return i;
                    }
                    break;

                case "bottomLeft":
                    if((rects[i].xStart > this.x ) && (rects[i].yStart < this.y ) && (rects[i].xStart + rects[i].width <= this.x ) && (rects[i].yStart + rects[i].height >= this.y )){

                        //判断鼠标是否点击左下角，如果点击左下角则将rects[i].isSelected置位true
                        if((rects[i].xStart + rects[i].width - 10 < this.x) && (rects[i].yStart + rects[i].height - 10 < this.y) && (rects[i].xStart + rects[i].width <= this.x ) && (rects[i].yStart + rects[i].height >= this.y )){

                            rects[i].isSelected = true;
                        }
                        return i;
                    }
                    break;
                default:
                    return -1;
                    break;
            }*/
        }
        // alert("未选中任何矩形");
    },

    // 判断绘制结束坐标相对开始坐标的位置，便于后期确定鼠标是否选中注释
    positionMark : function(){

        //将当前对象 this 赋值给 __this：代表 drawConstructor 对象，否则在触发事件时，this 指向的事件
        _this = this;

        if(( _this.xStart <= _this.xEnd) && ( _this.yStart <= _this.yEnd)){
            _this.position = "bottomRight";
        }
        else if(( _this.xStart <= _this.xEnd) && ( _this.yStart > _this.yEnd)){
            _this.position = "topRight";
        }
        else if(( _this.xStart > _this.xEnd) && ( _this.yStart <= _this.yEnd)){
            _this.position = "bottomLeft";
        }
        else if(( _this.xStart > _this.xEnd) && ( _this.yStart > _this.yEnd)){
            _this.position = "topLeft";
        }
    },

    _onmousedown : function(e){

        ev = e || event;
        this.xStart = ev.offsetX;
        this.yStart = ev.offsetY;
        di_text.innerHTML= "鼠标按下左键,鼠标坐标："+ this.xStart+","+ this.yStart;
    },

    _onmousemove : function(e){

        ev = e || event;
        // rects.splice(rects.length-1,1);
        this.xEnd = ev.offsetX;
        this.yEnd = ev.offsetY;
        this.positionMark();
        di_text.innerHTML= "鼠标按下左键后移动，鼠标坐标："+ this.xEnd +","+ this.yEnd +",鼠标结束位置："+ this.position;
        // alert(rects.toString());
        // _this.drawRects(rects);
        // _this.addAnnotation();

        this.drawRect();
        //alert(rects.toString());
    },

    _onmouseup : function(e){

        ev = e || event;
        this.xEnd = ev.offsetX;
        this.yEnd = ev.offsetY;

        //调用 drawConstructor原型方法中的 positionMark 方法
        this.positionMark();

        di_text.innerHTML= "鼠标松开左键，鼠标坐标："+ this.xEnd +","+ this.yEnd +",鼠标结束位置："+ this.position;

        this.mark = rects.length + 1;

        //判断如果初始坐标和结束坐标一样，则不进行绘制
        if(( this.xStart != this.xEnd ) || ( this.yStart != this.yEnd )){
            this.addAnnotation();
            // alert(rects.toString());
            this.drawRects(rects);
        }

    },

    _onclick : function(e){

        ev = e || event;
        this.x = ev.offsetX;
        this.y = ev.offsetY;
        this.selectedAnnotation = this.isSelected(rects);

        //alert("_this.selectedAnnotationIndex:"+_this.selectedAnnotationIndex);

        if(this.selectedAnnotation != null){

            //将选中的矩形框边框加粗
            this.selectedAnnotation.lineWidth = 5;

            //获取被选中的矩形的绘制起始点坐标
            this.selected_xStart = this.selectedAnnotation.xStart;
            this.selected_yStart = this.selectedAnnotation.yStart;

            //获取被选中的矩形的绘制结束点坐标
            this.selected_xEnd = this.selectedAnnotation.xEnd;
            this.selected_yEnd = this.selectedAnnotation.yEnd;

            //获取被选中的矩形的尺寸
            this.selected_width = this.selectedAnnotation.width;
            this.selected_height = this.selectedAnnotation.height;

            //将注释对象保存到注释数组中
            // rects.push(_this.selectedAnnotation);

            //调用绘制注释方法，重新绘制所有注释（被选中的注释加粗）
            this.drawRects(rects);

            //在选中的矩形框的左上角和右下角绘制圆圈
            this.drawCircle(this.selected_xStart, this.selected_yStart);
            this.drawCircle(this.selected_xEnd, this.selected_yEnd);


            di_text.innerHTML = "鼠标坐标：(" + this.x + "," + this.y + ")";
            console.log(rects.length + ", " + rects);
        }


    },

    //当移动注释时的具体操作
    _moveAnnotation : function(e){
        ev = e || event;

        //获取鼠标在画布上的相对坐标
        this.xEnd = ev.offsetX;
        this.yEnd = ev.offsetY;

        if((this.selectedAnnotation) != null){

            //修改被选中的矩形的坐标:原始坐标+鼠标移动的距离
            this.selectedAnnotation.xStart = this.selected_xStart + this.xEnd - this.xStart;
            this.selectedAnnotation.yStart = this.selected_yStart + this.yEnd - this.yStart;
            this.selectedAnnotation.xEnd = this.selected_xEnd + this.xEnd - this.xStart;
            this.selectedAnnotation.yEnd = this.selected_yEnd + this.yEnd - this.yStart;

            //重新绘制
            this.drawRects(rects);
        }
    },

    //改变矩形框尺寸
    _changeSize : function(e){
        ev = e || event;

        //获取鼠标在画布上的相对坐标
        this.xEnd = ev.offsetX;
        this.yEnd = ev.offsetY;


        if((this.selectedAnnotation) != null){
            //修改被选中的矩形的坐标:原始坐标+鼠标移动的距离
            this.selectedAnnotation.width = this.selected_width + this.xEnd - this.xStart;
            this.selectedAnnotation.height = this.selected_height + this.yEnd - this.yStart;

            this.selectedAnnotation.xEnd = this.selectedAnnotation.xStart + this.selectedAnnotation.width;
            this.selectedAnnotation.yEnd = this.selectedAnnotation.yStart + this.selectedAnnotation.height;

            //重新绘制
            this.drawRects(rects);
        }
    },


    //触发移动注释以及更改注释尺寸事件
    moveAnnotationEvent : function (){

        //将当前对象 this 赋值给 __this：代表 drawConstructor 对象，否则在触发事件时，this 指向的事件
        _this = this;

        // this._drawAnnotationEvent = null;
        _this.canvas.onclick = function (e) {
            //需要将 mousedown 事件和onmouseup事件注销，否则点击鼠标的同时也会触发mousedown事件和onmouseup事件

            this.onmouseup = null;

            _this._onclick(e);

            _this.canvas.onmousedown = function (e) {

                _this._onmousedown(e);

                //调用鼠标点击事件，判断再次点击时是否击中注释
                _this._onclick(e);

                _this.canvas.onmousemove = function (e) {

                    if (this.selectedAnnotation != null) {
                        //判断如果单击到矩形框的右下角则进行改变尺寸操作，否则进行拖动操作
                        if (this.selectedAnnotation.isSelected) {
                            _this._changeSize(e);
                        } else {
                            _this._moveAnnotation(e);
                        }
                    }

                };

                _this.canvas.onmouseup = function (e) {

                    // if( !rects[__this.selectedAnnotationIndex].isSelected ){

                    if (this.selectedAnnotation != null) { //将选中的矩形框边框变回原先样式
                        this.selectedAnnotation.lineWidth = 1;

                        //在编辑完成后（松开鼠标左键）将移动修改的注释保存到修改的数组中
                        modifyArr.push(this.selectedAnnotation);

                        _this.drawRects(rects);

                        // }


                        //清除mousemove和mouseup,onmousedown事件
                        this.onmousemove = this.onmouseup = this.onclick = null;

                        //重新将右下角选择状态置为false，否则会导致改变大小操作一直处于激活状态
                        this.selectedAnnotation.isSelected = false;
                    }
                };

            };
        };
    },

    //绘制注释事件
    drawAnnotationEvent : function (){

        //将当前对象 this 赋值给 __this：代表 drawConstructor 对象，否则在触发事件时，this 指向的事件
        _this = this;

        //__this：drawConstructor对象，_this：当前canvas对象

        //_this._moveAnnotationEvent = null;
        _this.canvas.onmousedown = function (e){
            _this._onmousedown.call(_this, e);

            _this.canvas.onmousemove = function (e){
                _this._onmousemove.call(_this, e);
            };

            _this.canvas.onmouseup = function (e){
                _this._onmouseup.call(_this, e);

                //清除当前对象的mousemove和mouseup事件，_this代表当前对象即：事件的句柄__this.canvas
                _this.canvas.onmousemove = _this.canvas.onmouseup = null;
                //alert(rect.position+"=="+rect.xStart+"=="+rect.yStart+"=="+rect.xEnd+"=="+rect.yEnd);
            };

        }
    },

    //删除注释按钮事件
    deleteAnnotationEvent : function (){

        //将当前对象 this 赋值给 __this：代表 drawConstructor 对象，否则在触发事件时，this 指向的事件
        _this = this;

        _this.canvas.onclick = function (e) {

            _this.deleteAnnotation(e);

        };
    },

    saveAnnotationEvent : function (rects) {
        for (let i = 0; i < rects.length; i++){
            console.log(rects[i].date);
        }
    },

}

function findAnnotation (array, id){
    for (let i = 0; i < array.length; i++){
        if (id == array[i].id){
            return array[i];
        }
    }
    return null;
}


var but_test = document.getElementById("but_test");
var button_div = document.getElementById("button_div");
var di_text = document.getElementById("text");
var div = document.getElementById("canvasDiv");



var canvasDiv = new drawConstructor(div);
canvasDiv.createCanvas();
canvasDiv.drawRects(rects);


var btns = new CreateButtonDiv(button_div);
btns.createButton();

//点击移动矩形按钮，则触发移动事件
btns.move_btn.onclick = function(){


    canvasDiv.moveAnnotationEvent();

};

//点击绘制矩形按钮，则触发绘制事件
btns.draw_btn.onclick = function(){

    canvasDiv.drawAnnotationEvent();

};

//点击删除注释按钮，则触发删除事件
btns.delete_btn.onclick = function(){

    canvasDiv.deleteAnnotationEvent();

};

//点击保存注释按钮，则触发保存事件
btns.save_btn.onclick = function(){

    canvasDiv.saveAnnotationEvent(rects);

};

