for(let i = rects.length-1; i >= 0; i--){
    switch(rects[i].position){
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
    }
}