//定义canvas左上角的坐标，因为绘制图形开始坐标为canvas内部坐标，canvas画布左上角坐标为（0,0），向下y坐标值增加，向右x坐标值增加，因此要将canvas坐标转换成视窗坐标
var canvasTLCoordinate ={
    x_tl : 0,
    y_tl : 0
};

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
        isSelected : false
    },
    {
        xStart : 20,
        yStart : 10,
        width : 100,
        height : 100,
        xEnd : 120,
        yEnd : 110,
        mark : "2",
        lineWidth :1,
        position : "bottomRight",
        isSelected : false
    },

    {
        xStart : 50,
        yStart : 30,
        width : 100,
        height : 100,
        xEnd : 150,
        yEnd : 130,
        mark : "3",
        lineWidth :1,
        position : "bottomRight",
        isSelected : false
    },

    {
        xStart : 80,
        yStart : 50,
        width : 100,
        height : 100,
        xEnd : 180,
        yEnd : 150,
        mark : "4",
        lineWidth :1,
        position : "bottomRight",
        isSelected : false
    }/*,
    {
        xStart : 602,
        yStart : 155,
        width : 55,
        height : 98,
        xEnd : 180,
        yEnd : 150,
        mark : "5",
        lineWidth :1,
        position : "bottomRight",
        isSelected : false
    }*/
];

//定义创建按钮的div成员，传入此创建的按钮所要添加到的父div的id
function CreateButtonDiv(div_id){

    this.div_id = div_id;


    //定义绘制拉选框按钮
    this.draw_btn = null;

    //定义移动矩形框按钮
    this.move_btn = null;

    //定义删除矩形框按钮
    this.delete_btn = null;

}

//定义创建按钮的div原型方法
CreateButtonDiv.prototype = {
    //重设constructor属性，将其指向CreateButtonDiv构造函数
    constructor : CreateButtonDiv,

    _createButton : function(){
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
    }

}


//KM_Annotation_Constructor构造函数，定义成员变量，即绘图的context属性
function KM_Annotation_Constructor(canvas_div){

    _this = this;

    this.canvas_div = canvas_div;

    //获取传入的canvas_div左上角坐标值
    this.canvas_div_left = canvas_div.getClientRects()[0].x;
    this.canvas_div_top = canvas_div.getClientRects()[0].y;

    //获取传入的canvas_div的长度和宽度
    this.canvas_div_w = this.canvas_div.style.width;
    this.canvas_div_h = this.canvas_div.style.height;

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

    //定义注释的标志
    this.mark = null;

    //绘制结束坐标相对开始坐标的位置，默认右下角
    this.position = "bottomRight";

    //定义被选中的注释所在注释数组的下标
    this.selectedAnnotationIndex = null;

    //获取被选中的矩形的绘制起始点坐标
    this.rect_xStart = null;
    this.rect_yStart = null;

    //获取被选中的矩形的绘制结束点坐标
    this.rect_xEnd = null;
    this.rect_yEnd = null;

    //将全局的注释数组赋值给当前对象的数组
    this.rects = rects;
}

//KM_Annotation_Constructor原型，用来定义方法
KM_Annotation_Constructor.prototype = {

    //重设constructor属性，将其指向KM_Annotation_Constructor构造函数
    constructor : KM_Annotation_Constructor,

    _createCanvas : function(){

        _this = _this;

        //创建canvas画布
        _this.canvas = document.createElement("canvas");

        //设置画布尺寸
        _this.canvas_w = ( _this.canvas_div_w).substring(0,( _this.canvas_div_w).length-2);
        _this.canvas_h = ( _this.canvas_div_h).substring(0,( _this.canvas_div_h).length-2);

        //将canvas插入到div中
        _this.canvas_div.append( _this.canvas);

        //设置canvas位置为浮动
        _this.canvas.style.position = "absolute";

        //获取绘图context
        _this.context = _this.canvas.getContext('2d');

        _this.canvas.width = _this.canvas_w;
        _this.canvas.height = _this.canvas_h;
        _this.canvas.style.border = "dashed";
        _this.canvas.style.borderColor = "blue";
        _this.canvas.style.borderWidth = "1";
    },

    //添加注释对象，定义默认属性
    addAnnotation : function(){

        _this = _this;

        var annotationElement = {

            //鼠标点击开始绘制的矩形框的顶点坐标
            xStart : _this.xStart,
            yStart : _this.yStart,

            //矩形框的宽度和高度
            width : _this.xEnd - _this.xStart,
            height : _this.yEnd - _this.yStart,

            //圆心坐标
            x0 : _this.x0,
            y0 : _this.y0,

            //矩形框的结束点坐标
            xEnd : _this.xEnd,
            yEnd : _this.yEnd,

            mark : _this.mark,

            //标记绘制结束坐标相对开始坐标的位置，便于后期确定鼠标是否选中注释
            position : _this.position,

            lineWidth : _this.lineWidth,

            //判断注释右下角是否被选中
            isSelected : false
        };

        //将注释对象保存到注释数组中
        rects.push(annotationElement);
    },

    deleteAnnotation : function(e){
        _this = _this;

        ev = e || event;
        _this.x = ev.offsetX;
        _this.y = ev.offsetY;

        _this.selectedAnnotationIndex = _this.isSelected();

        if(_this.selectedAnnotationIndex >= 0){
            //移除注释数组中被选中的注释
            rects.splice(_this.selectedAnnotationIndex,1);

            //重新绘制注释
            _this.drawRects();
        }

    },

    //绘制单个矩形框（在触发mousemove事件时调用），绘制拉选框
    drawRect : function(){

        _this = _this;

        // 清除画布，准备绘制，如果不清除会导致绘制很多矩形框
        _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

        //清除画布后，需要重新绘制，因为这个方法是在鼠标按下并移动的时候进行绘制的，如果不重新绘制所有注释，则在鼠标按下移动触发MouseMove事件时会导致画布处于被清空状态，当松开鼠标按键触发mouseup事件才会重新绘制
        _this.drawRects();

        _this.context.beginPath();
        _this.context.rect( _this.xStart, _this.yStart, _this.xEnd - _this.xStart, _this.yEnd - _this.yStart);
        _this.context.strokeStyle = 'blue';
        _this.context.lineWidth = 1;
        // this.context.fillStyle = 'red';
        // this.context.fill();
        _this.context.stroke();
    },

    //绘制所有矩形框
    drawRects : function(){
        _this = _this;

        // 清除画布，准备绘制
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 遍历所有矩形框
        for(let i=0; i<this.rects.length; i++) {
            let rect = this.rects[i];
            // 绘制矩形
            // this.context.strokeStyle="#FF0000";
            // this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            _this.context.beginPath();
            _this.context.rect(rect.xStart, rect.yStart, rect.width, rect.height);
            _this.context.strokeStyle = 'blue';
            _this.context.lineWidth = _this.rects[i].lineWidth;
            // this.context.fillStyle = 'red';
            // this.context.fill();
            _this.context.stroke();

            _this.context.fillText("("+ _this.rects[i].xStart +","+ _this.rects[i].yStart+"),"+ _this.rects[i].mark, _this.rects[i].xStart, _this.rects[i].yStart+10);

            // this.context.fillText("!!!!!!!!!!!!!!!!!", this.rects[i].xUp-400, this.rects[i].yUp-400);
            _this.context.fillText("("+ _this.rects[i].xEnd+","+ _this.rects[i].yEnd+"),"+ _this.rects[i].mark, _this.rects[i].xEnd, _this.rects[i].yEnd);



            // if (rect.isSelected) {
            //     this.context.lineWidth = 1;
            // }
            // else {
            //     this.context.lineWidth = 5;
            // }
        }
    },

    //绘制圆
    drawCircle : function(x0,y0){
        this.context.beginPath();
        this.context.arc(x0, y0, 5, 0, 2 * Math.PI, false);
        this.context.stroke();

    },


    //判断鼠标是否选中注释，如果选中注释右下角则将isSelected置位true,并且返回该注释对应的注释数组下标
    isSelected : function(){

        _this = _this;

        for(let i = rects.length-1; i >= 0; i--){
            switch(rects[i].position){
                case "bottomRight":
                    if((rects[i].xStart < _this.x) && (rects[i].yStart < _this.y) && (rects[i].xStart + rects[i].width >= _this.x ) && (rects[i].yStart + rects[i].height >= _this.y )){

                        //判断鼠标是否点击右下角，如果点击右下角则将rects[i].isSelected置位true
                        if((rects[i].xStart + rects[i].width - 10 < _this.x) && (rects[i].yStart + rects[i].height - 10 < _this.y) && (rects[i].xStart + rects[i].width >= _this.x ) && (rects[i].yStart + rects[i].height >= _this.y )){

                            rects[i].isSelected = true;
                        }

                        //alert("选中矩形框:"+rects[i].mark);
                        return i;
                    }
                    break;

                case "topRight":
                    if((rects[i].xStart < _this.x ) && (rects[i].yStart > _this.y ) && (rects[i].xStart + rects[i].width >= _this.x ) && (rects[i].yStart + rects[i].height <= _this.y )){

                        //判断鼠标是否点击右上角，如果点击右上角则将rects[i].isSelected置位true
                        if((rects[i].xStart + rects[i].width - 10 < _this.x) && (rects[i].yStart + rects[i].height - 10 > _this.y) && (rects[i].xStart + rects[i].width >= _this.x ) && (rects[i].yStart + rects[i].height <= _this.y )){

                            rects[i].isSelected = true;
                        }

                        return i;
                    }
                    break;

                case "topLeft":
                    if((rects[i].xStart > _this.x ) && (rects[i].yStart > _this.y ) && (rects[i].xStart + rects[i].width <= _this.x ) && (rects[i].yStart + rects[i].height <= _this.y )){

                        //判断鼠标是否点击左上角，如果点击左上角则将rects[i].isSelected置位true
                        if((rects[i].xStart + rects[i].width - 10 > _this.x) && (rects[i].yStart + rects[i].height - 10 > _this.y) && (rects[i].xStart + rects[i].width <= _this.x ) && (rects[i].yStart + rects[i].height <= _this.y )){

                            rects[i].isSelected = true;
                        }

                        return i;
                    }
                    break;

                case "bottomLeft":
                    if((rects[i].xStart > _this.x ) && (rects[i].yStart < _this.y ) && (rects[i].xStart + rects[i].width <= _this.x ) && (rects[i].yStart + rects[i].height >= _this.y )){

                        //判断鼠标是否点击左下角，如果点击左下角则将rects[i].isSelected置位true
                        if((rects[i].xStart + rects[i].width - 10 < _this.x) && (rects[i].yStart + rects[i].height - 10 < _this.y) && (rects[i].xStart + rects[i].width <= _this.x ) && (rects[i].yStart + rects[i].height >= _this.y )){

                            rects[i].isSelected = true;
                        }
                        return i;
                    }
                    break;
                default:
                    return -1;
                    break;
            }
        }
        // alert("未选中任何矩形");
    },


    positionMark : function(){

        _this = _this;

        //判断绘制结束坐标相对开始坐标的位置，便于后期确定鼠标是否选中注释
        if(( _this.xStart <= _this.xEnd) && ( _this.yStart <= _this.yEnd)){
            _this.position = "bottomRight";
        }
        else if(( _this.xStart <= _this.xEnd) && ( _this.yStart > _this.yEnd)){
            _this.position = "topRight";
        }
        else if(( _this.xStart > _this.xEnd) && ( _this.yStart <= _this.yEnd)){
            this.position = "bottomLeft";
        }
        else if(( _this.xStart > _this.xEnd) && ( _this.yStart > _this.yEnd)){
            _this.position = "topLeft";
        }
    },

    _onmousedown : function(e){

        _this = _this;

        ev = e || event;
        _this.xStart = ev.offsetX;
        _this.yStart = ev.offsetY;
        di_text.innerHTML= "鼠标按下左键,鼠标坐标："+ _this.xStart+","+ _this.yStart;
    },

    _onmousemove : function(e){

        _this = _this;

        ev = e || event;
        // rects.splice(rects.length-1,1);
        _this.xEnd = ev.offsetX;
        _this.yEnd = ev.offsetY;
        _this.positionMark();
        di_text.innerHTML= "鼠标按下左键后移动，鼠标坐标："+ _this.xEnd +","+ _this.yEnd +",鼠标结束位置："+ _this.position;
        // alert(rects.toString());
        // this.drawRects();
        // this.addAnnotation();

        _this.drawRect();
        //alert(rects.toString());
    },

    _onmouseup : function(e){

        _this = _this;

        ev = e || event;
        _this.xEnd = ev.offsetX;
        _this.yEnd = ev.offsetY;

        //调用KM_Annotation_Constructor原型方法中的positionMark方法
        _this.positionMark();
        di_text.innerHTML= "鼠标松开左键，鼠标坐标："+ _this.xEnd +","+ _this.yEnd +",鼠标结束位置："+ _this.position;

        _this.mark = rects.length+1;
        //调用添加注释方法，并且将注释保存到注释数组中

        //判断如果初始坐标和结束坐标一样，则不进行绘制
        if(( _this.xStart != _this.xEnd ) || ( _this.yStart != _this.yEnd )){
            _this.addAnnotation();
            // alert(rects.toString());
            _this.drawRects();
        }

    },

    _onclick : function(e){

        _this = _this;

        ev = e || event;
        _this.x = ev.offsetX;
        _this.y = ev.offsetY;
        _this.selectedAnnotationIndex = _this.isSelected();

        //alert("this.selectedAnnotationIndex:"+this.selectedAnnotationIndex);


        if((_this.selectedAnnotationIndex) >= 0){


            //将选中的矩形框边框加粗
            rects[_this.selectedAnnotationIndex].lineWidth = 5;

            //获取被选中的矩形的绘制起始点坐标
            _this.rect_xStart = rects[_this.selectedAnnotationIndex].xStart;
            _this.rect_yStart = rects[_this.selectedAnnotationIndex].yStart;

            //获取被选中的矩形的绘制结束点坐标
            _this.rect_xEnd = rects[_this.selectedAnnotationIndex].xEnd;
            _this.rect_yEnd = rects[_this.selectedAnnotationIndex].yEnd;

            //获取被选中的矩形的尺寸
            _this.rect_width = rects[_this.selectedAnnotationIndex].width;
            _this.rect_height = rects[_this.selectedAnnotationIndex].height;

            //将注释对象保存到注释数组中
            // rects.push(this.selectedAnnotation);

            //调用添加注释方法，并且将注释保存到注释数组中
            _this.drawRects();

            //在选中的矩形框的左上角和右下角绘制圆圈
            _this.drawCircle(_this.rect_xStart, _this.rect_yStart);
            _this.drawCircle(_this.rect_xStart + _this.rect_width, _this.rect_yStart + _this.rect_height);


            di_text.innerHTML= "鼠标坐标：("+ _this.x +","+ _this.y +")";
            console.log(rects.length+rects);
        }


    },

    //当移动注释时的具体操作
    _moveAnnotation : function(e){

        _this = _this;

        ev = e || event;

        //获取鼠标在画布上的相对坐标
        _this.xEnd = ev.offsetX;
        _this.yEnd = ev.offsetY;

        if((_this.selectedAnnotationIndex) >= 0){

            //修改被选中的矩形的坐标:原始坐标+鼠标移动的距离
            rects[_this.selectedAnnotationIndex].xStart = _this.rect_xStart + _this.xEnd - _this.xStart;
            rects[_this.selectedAnnotationIndex].yStart = _this.rect_yStart + _this.yEnd - _this.yStart;
            rects[_this.selectedAnnotationIndex].xEnd = _this.rect_xEnd + _this.xEnd - _this.xStart;
            rects[_this.selectedAnnotationIndex].yEnd = _this.rect_yEnd + _this.yEnd - _this.yStart;

            //重新绘制
            _this.drawRects();
        }
    },

    //改变矩形框尺寸
    _changeSize : function(e){
        ev = e || event;

        _this = _this;

        //获取鼠标在画布上的相对坐标
        _this.xEnd = ev.offsetX;
        _this.yEnd = ev.offsetY;


        if((this.selectedAnnotationIndex) >= 0){
            //修改被选中的矩形的坐标:原始坐标+鼠标移动的距离
            rects[this.selectedAnnotationIndex].width = _this.rect_width + _this.xEnd - _this.xStart;
            rects[this.selectedAnnotationIndex].height = _this.rect_height + _this.yEnd - _this.yStart;

            rects[this.selectedAnnotationIndex].xEnd = rects[this.selectedAnnotationIndex].xStart + rects[this.selectedAnnotationIndex].width;
            rects[this.selectedAnnotationIndex].yEnd = rects[this.selectedAnnotationIndex].yStart + rects[this.selectedAnnotationIndex].height;
            //重新绘制
            _this.drawRects();
        }
    },


    //触发移动注释以及更改注释尺寸事件
    _moveAnnotationEvent : function (){
        _this = _this;
        //_this：KM_Annotation_Constructor对象，this：当前canvas对象

        // _this._drawAnnotationEvent = null;
        _this.canvas.onclick = function (e) {
            //需要将mousedown事件和onmouseup事件注销，否则点击鼠标的同时也会触发mousedown事件和onmouseup事件
            this.onmouseup = null;
            _this._onclick(e);

            _this.canvas.onmousedown = function (e) {

                _this._onmousedown(e);

                //调用鼠标点击事件，判断再次点击时是否击中注释
                _this._onclick(e);

                _this.canvas.onmousemove = function (e) {

                    //判断如果单击到矩形框的右下角则进行改变尺寸操作，否则进行拖动操作
                    if( rects[_this.selectedAnnotationIndex].isSelected){
                        _this._changeSize(e);
                    }
                    else{
                        _this._moveAnnotation(e);
                    }

                };

                _this.canvas.onmouseup = function (e) {

                    // if( !rects[_this.selectedAnnotationIndex].isSelected ){

                    //将选中的矩形框边框变回原先样式
                    rects[_this.selectedAnnotationIndex].lineWidth = 1;

                    _this.drawRects();

                    // }


                    //清除mousemove和mouseup,onmousedown事件
                    this.onmousemove = this.onmouseup = this.onclick = null;

                    //重新将右下角选择状态置为false，否则会导致改变大小操作一直处于激活状态
                    rects[_this.selectedAnnotationIndex].isSelected = false;
                };

            };
        };
    },

    //绘制注释事件
    _drawAnnotationEvent : function (){
        _this = _this;
        //_this：KM_Annotation_Constructor对象，this：当前canvas对象

        //this._moveAnnotationEvent = null;
        _this.canvas.onmousedown = function (e){
            _this._onmousedown(e);

            _this.canvas.onmousemove = function (e){
                _this._onmousemove(e);
            };

            _this.canvas.onmouseup = function (e){
                _this._onmouseup(e);

                //清除当前对象的mousemove和mouseup事件，this代表当前对象即：事件的句柄_this.canvas
                this.onmousemove = this.onmouseup = null;
                //alert(rect.position+"=="+rect.xStart+"=="+rect.yStart+"=="+rect.xEnd+"=="+rect.yEnd);
            };

        }
    },

    //删除注释按钮事件
    _deleteAnnotationEvent : function (){
        _this = _this;
        //_this：KM_Annotation_Constructor对象，this：当前canvas对象

        // _this._drawAnnotationEvent = null;
        _this.canvas.onclick = function (e) {

            _this.deleteAnnotation(e);

        };
    }

}



var but_test = document.getElementById("but_test");
var button_div = document.getElementById("button_div");
var di_text = document.getElementById("text");
var div = document.getElementById("container");



var canvasDiv = new KM_Annotation_Constructor(div);
canvasDiv._createCanvas();
canvasDiv.drawRects();


var btns = new CreateButtonDiv(button_div);
btns._createButton();

//点击移动矩形按钮，则触发移动事件
btns.move_btn.onclick = function(){

    canvasDiv._moveAnnotationEvent();
};

//点击绘制矩形按钮，则触发绘制事件
btns.draw_btn.onclick = function(){

    canvasDiv._drawAnnotationEvent();

};

//点击删除注释按钮，则触发绘制事件
btns.delete_btn.onclick = function(){

    canvasDiv._deleteAnnotationEvent();

};

