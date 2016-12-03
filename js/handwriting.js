var canvasWidth = Math.min(800,$(window).width()-20);
var canvasHeight = canvasWidth;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var strokeColor = "black"
var isMouseDown = false;
var lastLoc = {x:0,y:0};
var lastLineWidth = -1;

var lastTimetamp = 0;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$("#controller").css("width",canvasWidth+"px");
drawGrid();
$("#clear_btn").click(
    function (e) {
        context.clearRect(0,0,canvasWidth,canvasHeight);
        drawGrid();
    }
)
$(".color_btn").click(
    function (e){
        $(".color_btn").removeClass("color_btn_selected");
        $(this).addClass("color_btn_selected");
        strokeColor = $(this).css("background-color");
    }
)

//document.onmousedown = function(e){
//    alert(e.clientX);
//}
function windowtocanvas(x,y){
    var bbox = canvas.getBoundingClientRect();
    return{x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)};
}

function calcDistance(loc1,loc2){
    return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y));
}

function distance(loc1,loc2){

    return Math.sqrt(Math.pow((loc1.x-loc2.x),2)+Math.pow((loc1.y-loc2.y),2))

}
canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    touch = e.touches[0];
    beginStroke({x: touch.pageX,y: touch.pageY});
});
canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    if(isMouseDown){
        touch = e.touches[0];
        moveStroke({x: touch.pageX,y: touch.pageY});
    }
});
canvas.addEventListener('touchend', function (e) {
    e.preventDefault();
    endStroke();
});


function calcLineWidth(t,s){
    var v = s/t;
    var resultWidth ;
    if(v <=0.1)
        resultWidth = 30;
    else if(v>=10)
        resultWidth = 1;
    else
        resultWidth = 30 - (v-0.1)/(10-0.1)*(30-1);;

    if(lastLineWidth == -1){
        return resultWidth;
    }else{
        return Math.sqrt(resultWidth*resultWidth*1/3 + lastLineWidth*lastLineWidth*2/3);
        //return lastLineWidth*2/3+resultWidth*1/3;
    }
    //console.log(t,s);
}
function beginStroke(point){
    isMouseDown = true;
    lastTimetamp = new Date().getTime();
    lastLoc = windowtocanvas(point.x, point.y);
}
function endStroke(){
    isMouseDown = false;
}
function moveStroke(point){
    var currLoc = windowtocanvas(point.x,point.y);

    var curTimestamp = new Date().getTime();
    var s = distance(currLoc,lastLoc);
    var t = curTimestamp - lastTimetamp;
    var lineWidth = calcLineWidth(t,s);
    console.log(s);
    context.beginPath();
    context.moveTo(lastLoc.x,lastLoc.y);
    context.lineTo(currLoc.x,currLoc.y);
    context.strokeStyle = strokeColor
    context.lineWidth = lineWidth;
    context.lineCap = "round"
    context.lineJoin = "round "
    context.stroke();


    lastLoc = currLoc;
    lastTimetamp = curTimestamp;
    lastLineWidth = lineWidth;
}

canvas.onmousedown = function(e){
    e.preventDefault();
    beginStroke({x: e.clientX,y: e.clientY});
}
canvas.onmouseup = function (e) {
    e.preventDefault();
    endStroke();
}
canvas.onmouseout = function(e){
    e.preventDefault();
    endStroke();
}
canvas.onmousemove = function(e){
    e.preventDefault();
    if(isMouseDown){
        moveStroke({x: e.clientX,y: e.clientY});
    }
}

function drawGrid(){

    context.save();
    context.strokeStyle = "rgb(230,11,9)";
    context.beginPath();
    context.moveTo(3,3);
    context.lineTo(canvasWidth-3,3);
    context.lineTo(canvasWidth-3,canvasHeight-3);
    context.lineTo(3,canvasHeight-3);
    context.closePath();

    context.lineWidth = 6;
    context.stroke();

    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(canvasWidth,canvasHeight);

    context.moveTo(canvasWidth,0);
    context.lineTo(0,canvasHeight);

    context.moveTo(canvasWidth/2,0);
    context.lineTo(canvasWidth/2,canvasHeight);

    context.moveTo(0,canvasHeight/2);
    context.lineTo(canvasWidth,canvasHeight/2);

    context.setLineDash([4, 5]);//ÐéÏß
    context.lineWidth = 1;
    context.stroke();
    context.restore();
}


