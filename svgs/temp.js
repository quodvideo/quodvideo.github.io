var svgNS   = "http://www.w3.org/2000/svg";
var xhtmlNS = "http://www.w3.org/1999/xhtml";
var mathNS  = "http://www.w3.org/1998/Math/MathML";
var xlinkNS = "http://www.w3.org/1999/xlink";
var d;

window.onload = init;
/**

  Widget
    Frame
    Tab
    Panel
      Dialog
    CornerGrippy



 **/
function Widget() {
  var x;
  var y;
  var width;
  var height;
  var svgelement;
}

function Frame(parent,x,y,width,height,resizeablep) {
}
function Tab(parentFrame,x,y,width,height) {
}
function CornerGrip() {
}

function init() {
  d = document.getElementById("theDesktop");
  FrameWindow(200.5,200.5,600,300);
}
function CornerGrippy() {
  var cg = document.createElementNS(svgNS,"use");
  cg.setAttributeNS(null,"x",width-19);
  cg.setAttributeNS(null,"y",height-19);
  cg.setAttributeNS(xlinkNS,"href","#cornerGrippy");
  function beginDrag() {
    alert("Mouse!")
  };
  function endDrag() {
    alert("Cat!")
  };
  cg.addEventListener("mousedown",beginDrag,false);
  cg.addEventListener("mouseup",endDrag,false);
}

function oldFrameWindow(x,y,width,height) {
  var g = document.createElementNS(svgNS,"g");
  g.setAttributeNS(null,"transform","translate("+x+","+y+")");
  var f = document.createElementNS(svgNS,"rect");
  f.setAttributeNS(null,"rx",3);
  f.setAttributeNS(null,"ry",3);
  f.setAttributeNS(null,"stroke","url(#strokeColor)");
  f.setAttributeNS(null,"fill","url(#greylight)");
  f.setAttributeNS(null,"width",width);
  f.setAttributeNS(null,"height",height);
  g.appendChild(f);

  d.appendChild(g);
}

function TabWindow() {
  this.group = document.createElementNS(svgNS,"g");
}
