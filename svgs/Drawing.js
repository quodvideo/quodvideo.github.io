var svgNS   = "http://www.w3.org/2000/svg";
var xhtmlNS = "http://www.w3.org/1999/xhtml";
var mathNS  = "http://www.w3.org/1998/Math/MathML";
var xlinkNS = "http://www.w3.org/1999/xlink";
var evNS    = "http://www.w3.org/2001/xml-events";

var strokeColor = "#808080";
var insensitiveStrokeColor = "#a0a0a0";
var defaultRingColor = "#404040";
var textColor = "#000000";

/* Just drawing functions. All assume "theDesktop" and return elements */

function drawLabel(text) {
  var label = document.createElementNS(svgNS,"text");
  label.setAttributeNS(null,"font-size","12 pt");
  label.setAttributeNS(null,"font-family","Sans");
  label.setAttributeNS(null,"text-anchor","middle");
  label.setAttributeNS(null,"stroke","none");
  label.setAttributeNS(null,"fill",textColor);
  label.appendChild(document.createTextNode(text));
  return label;
}

function drawButtonBase(width,height) {
  var base = document.createElementNS(svgNS,"rect");
  base.setAttributeNS(null,"rx",3);
  base.setAttributeNS(null,"ry",3);
  base.setAttributeNS(null,"width",width);
  base.setAttributeNS(null,"height",height);
  base.setAttributeNS(null,"fill","url(#greylight)"); /* greyLight */
  base.setAttributeNS(null,"stroke",strokeColor);/* strokeColor */
  return base;
}

function drawTextFieldBase(width,height) {
  var base = document.createElementNS(svgNS,"rect");
  base.setAttributeNS(null,"rx",3);
  base.setAttributeNS(null,"ry",3);
  base.setAttributeNS(null,"width",width);
  base.setAttributeNS(null,"height",height);
  base.setAttributeNS(null,"fill","url(#textlight)"); /* greyLight */
  base.setAttributeNS(null,"stroke",strokeColor);/* strokeColor */
  return base;
}

function drawPushButton(params) {
  /* Draw the label */
  var label = drawLabel(params.label);

  /* Get the size of the label */
  document.getElementById("theDesktop").appendChild(label);
  var bbox = label.getBBox();
  var width = bbox.width;
  var height = bbox.height;
/*  alert("X: "+bbox.x+" Y: "+bbox.y+" Width: "+bbox.width+" Height: "+bbox.height); */
  /* Pad the label */
  width+=12;
  height+=8;

  /* Regular PushButtons have a minimum width. */
  if (width<64) width = 64;

  /* Now the group that is the PushButton */
  var g = document.createElementNS(svgNS,"g");

  if (params.isDefault) {
    var defaultEdge = document.createElementNS(svgNS,"rect");
    defaultEdge.setAttributeNS(null,"x",-1);
    defaultEdge.setAttributeNS(null,"y",-1);
    defaultEdge.setAttributeNS(null,"rx",4);
    defaultEdge.setAttributeNS(null,"ry",4);
    defaultEdge.setAttributeNS(null,"width",width+2);
    defaultEdge.setAttributeNS(null,"height",height+2);
    defaultEdge.setAttributeNS(null,"fill","none");
    defaultEdge.setAttributeNS(null,"stroke",defaultRingColor);
    defaultEdge.setAttributeNS(null,"stroke-width",3);
    g.appendChild(defaultEdge);
  }

  var base = drawButtonBase(width,height);
  g.appendChild(base);

  /**/
  label.setAttributeNS(null,"x",0.5*width);
  label.setAttributeNS(null,"y",4-bbox.y);
  g.appendChild(label);

  if (params.hasFocus) {
    var focusRing = document.createElementNS(svgNS,"rect");
    focusRing.setAttributeNS(null,"x",0.5*width-0.5*bbox.width-1);
    focusRing.setAttributeNS(null,"y",15+bbox.y-1);
    focusRing.setAttributeNS(null,"width",bbox.width+2);
    focusRing.setAttributeNS(null,"height",bbox.height+2);
    focusRing.setAttributeNS(null,"fill","none");
    focusRing.setAttributeNS(null,"stroke","red");
    focusRing.setAttributeNS(null,"stroke-dasharray","2,2");
/*
    focusRing.setAttributeNS(null,"x",2);
    focusRing.setAttributeNS(null,"y",2);
    focusRing.setAttributeNS(null,"width",width-4);
    focusRing.setAttributeNS(null,"height",height-4);
    focusRing.setAttributeNS(null,"rx",2);
    focusRing.setAttributeNS(null,"ry",2);
    focusRing.setAttributeNS(null,"fill","green");
    focusRing.setAttributeNS(null,"fill-opacity",0.2);
    focusRing.setAttributeNS(null,"stroke","orange");
    focusRing.setAttributeNS(null,"stroke-dasharray","0");
*/
    g.appendChild(focusRing);
  }

  /* Some event handling for show. */
  function onmouseover(e) {
    base.setAttributeNS(null,"fill","url(#greyshade)");
    document.removeEventListener("mouseup",onmousecancel,false);
    g.addEventListener("mouseup",onmouseup,false);
    g.addEventListener("mouseout",onmouseout,false);
  }
  function onmousecancel(e) {
    document.removeEventListener("mouseup",onmousecancel,false);
    g.removeEventListener("mouseout",onmouseout,false);
    g.removeEventListener("mouseover",onmouseover,false);
  }
  function onmouseout(e) {
    base.setAttributeNS(null,"fill","url(#greylight)");
    g.removeEventListener("mouseup",onmouseup,false);
    g.removeEventListener("mouseout",onmouseout,false);
    document.addEventListener("mouseup",onmousecancel,false);
    g.addEventListener("mouseover",onmouseover,false);
  };
  function onmouseup(e) {
    base.setAttributeNS(null,"fill","url(#greylight)");
    g.removeEventListener("mouseup",onmouseup,false);
    g.removeEventListener("mouseout",onmouseout,false);
  }
  function onmousedown(e) {
    if (e.button === 0) {
      base.setAttributeNS(null,"fill","url(#greyshade)");
      g.addEventListener("mouseup",onmouseup,false);
      g.addEventListener("mouseout",onmouseout,false);
    }
  }
  g.addEventListener("mousedown",onmousedown,false);

  g.setAttributeNS(null,"transform","translate("+params.x+","+params.y+")");
  return g;
}

function drawRadioButton(params) { // 5 pixels lower so it lines up with other controls

  var g = document.createElementNS(svgNS,"g");

  var indicator = document.createElementNS(svgNS,"circle");
  indicator.setAttributeNS(null,"cx",6);
  indicator.setAttributeNS(null,"cy",11);
  indicator.setAttributeNS(null,"r",6);
  indicator.setAttributeNS(null,"fill","url(#greylight)");
  indicator.setAttributeNS(null,"stroke",strokeColor);
  g.appendChild(indicator);

  if (params.indeterminate) {
    var marker = document.createElementNS(svgNS,"line");
    marker.setAttributeNS(null,"x1",1.5);
    marker.setAttributeNS(null,"y1",11);
    marker.setAttributeNS(null,"x2",10.5);
    marker.setAttributeNS(null,"y2",11);
    marker.setAttributeNS(null,"stroke-width",2);
    marker.setAttributeNS(null,"stroke",textColor);
    g.appendChild(marker);
  } else if (params.checked) {
    var marker = document.createElementNS(svgNS,"circle");
    marker.setAttributeNS(null,"cx",6);
    marker.setAttributeNS(null,"cy",11);
    marker.setAttributeNS(null,"r",2);
    marker.setAttributeNS(null,"fill",textColor);
    marker.setAttributeNS(null,"stroke",textColor);
    g.appendChild(marker);
  }

  var label = drawLabel(params.label);
  label.setAttributeNS(null,"x",16);
  label.setAttributeNS(null,"y",15);
  label.setAttributeNS(null,"text-anchor","start");
  g.appendChild(label);

  g.setAttributeNS(null,"transform","translate("+params.x+","+params.y+")");
  return g;
}
function drawCheckButton(params) { // 5 pixels lower so it lines up with other controls
  var g = document.createElementNS(svgNS,"g");

  var indicator = document.createElementNS(svgNS,"rect");
  indicator.setAttributeNS(null,"y",5);
  indicator.setAttributeNS(null,"width",12);
  indicator.setAttributeNS(null,"height",12);
  indicator.setAttributeNS(null,"fill","url(#greylight)");
  indicator.setAttributeNS(null,"stroke",strokeColor);
  g.appendChild(indicator);

  if (params.indeterminate) {
    var marker = document.createElementNS(svgNS,"line");
    marker.setAttributeNS(null,"x1",1.5);
    marker.setAttributeNS(null,"y1",11);
    marker.setAttributeNS(null,"x2",10.5);
    marker.setAttributeNS(null,"y2",11);
    marker.setAttributeNS(null,"stroke-width",2);
    marker.setAttributeNS(null,"stroke",textColor);
    g.appendChild(marker);
  } else if (params.checked) {
    var marker = document.createElementNS(svgNS,"path");
    marker.setAttributeNS(null,"d","M1,11.5 L5,15.5 L11,6.5");
    marker.setAttributeNS(null,"fill","none");
    marker.setAttributeNS(null,"stroke-width",2);
    marker.setAttributeNS(null,"stroke",textColor);
    g.appendChild(marker);
  }

  var label = drawLabel(params.label);
  label.setAttributeNS(null,"x",16);
  label.setAttributeNS(null,"y",15);
  label.setAttributeNS(null,"text-anchor","start");
  g.appendChild(label);

  g.setAttributeNS(null,"transform","translate("+params.x+","+params.y+")");

  return g;
}
function drawDetailsButton(params) { // 5 pixels lower so it lines up with other controls
  var g = document.createElementNS(svgNS,"g");

  var angle = params.angle || 0;

  var indicator = document.createElementNS(svgNS,"path");
  indicator.setAttributeNS(null,"d","M3,5 V17 H4 L10,11 L4,5 Z");
  indicator.setAttributeNS(null,"fill","url(#greylight)");
  indicator.setAttributeNS(null,"stroke",strokeColor);
  indicator.setAttributeNS(null,"transform","rotate("+angle+" 6 11)");
  g.appendChild(indicator);

  var label = drawLabel(params.label);
  label.setAttributeNS(null,"x",16);
  label.setAttributeNS(null,"y",15);
  label.setAttributeNS(null,"text-anchor","start");
  g.appendChild(label);

  g.setAttributeNS(null,"transform","translate("+params.x+","+params.y+")");

  return g;
}

function drawOptionMenu(params) {
  var g = document.createElementNS(svgNS,"g");

  var labels = new Array();
  var maxWidth = 0;
  for (var i=0;i<params.options.length;i++) {
    var thisWidth;
    labels[i] = drawLabel(params.options[i]);
    document.getElementById("theDesktop").appendChild(labels[i]);
    thisWidth = labels[i].getBBox().width;
    maxWidth = maxWidth>thisWidth?maxWidth:thisWidth;
    document.getElementById("theDesktop").removeChild(labels[i]);
  }

  var width = maxWidth+25;

  var base = drawButtonBase(width,22);
  g.appendChild(base);
/*
  var divider = document.createElementNS(svgNS,"line");
  divider.setAttributeNS(null,"x1",width-13);
  divider.setAttributeNS(null,"y1",0);
  divider.setAttributeNS(null,"x2",width-13);
  divider.setAttributeNS(null,"y2",22);
  divider.setAttributeNS(null,"stroke",strokeColor);
  g.appendChild(divider);
*/
  var arrow = document.createElementNS(svgNS,"use");
  arrow.setAttributeNS(xlinkNS,"href","#bigArrowDown");
  arrow.setAttributeNS(null,"x",width-11);
  arrow.setAttributeNS(null,"y",8.5);
  g.appendChild(arrow);

  labels[params.defaultOption].setAttributeNS(null,"x",5);
  labels[params.defaultOption].setAttributeNS(null,"y",15);
  labels[params.defaultOption].setAttributeNS(null,"text-anchor","start");
  g.appendChild(labels[params.defaultOption]);

  g.setAttributeNS(null,"transform","translate("+params.x+","+params.y+")");

  return g;
}
function drawToolbarButton(params) {
  var g = document.createElementNS(svgNS,"g");

  var base = drawButtonBase(22,22);
  g.appendChild(base);

  g.setAttributeNS(null,"transform","translate("+params.x+","+params.y+")");

  return g;
}

function drawSegmentedRadioButtons(params) {
}
function drawTextField(params) {
  var g = document.createElementNS(svgNS,"g");

  var base = drawTextFieldBase(params.width,params.height);
  g.appendChild(base);

  if (params.text) {
    var text = document.createElementNS(svgNS,"text");
    text.setAttributeNS(null,"x",5);
    text.setAttributeNS(null,"y",15);
    text.setAttributeNS(null,"font-size",12);
    text.setAttributeNS(null,"font-family","Sans");
    text.setAttributeNS(null,"text-anchor","start");
    text.setAttributeNS(null,"stroke","none");
    text.setAttributeNS(null,"fill",textColor);
    text.appendChild(document.createTextNode(params.text));
    g.appendChild(text);
  }

  g.setAttributeNS(null,"transform","translate("+params.x+","+params.y+")");

  return g;
}
function drawUpSpinStepper(x,y) {
  var g = document.createElementNS(svgNS,"g");
  var base = document.createElementNS(svgNS,"path");
  base.setAttributeNS(null,"d","M0,0 H8 C9.656,0 11,1.344 11,3 V11 H0 V0");
  base.setAttributeNS(null,"fill","url(#greylight)");
  base.setAttributeNS(null,"stroke",strokeColor);
  g.appendChild(base);
  var arrow = document.createElementNS(svgNS,"use");
  arrow.setAttributeNS(xlinkNS,"href","#smallArrowUp");
  arrow.setAttributeNS(null,"x",2.5);
  arrow.setAttributeNS(null,"y",4);
  g.appendChild(arrow);
  g.setAttributeNS(null,"transform","translate("+x+","+y+")");
  return g;
}
function drawDownSpinStepper(x,y) {
  var g = document.createElementNS(svgNS,"g");
  var base = document.createElementNS(svgNS,"path");
  base.setAttributeNS(null,"d","M0,0 H11 V8 C 11,9.656 9.656,11 8,11 H0 V0");
  base.setAttributeNS(null,"fill","url(#greylight)");
  base.setAttributeNS(null,"stroke",strokeColor);
  g.appendChild(base);
  var arrow = document.createElementNS(svgNS,"use");
  arrow.setAttributeNS(xlinkNS,"href","#smallArrowDown");
  arrow.setAttributeNS(null,"x",2.5);
  arrow.setAttributeNS(null,"y",4);
  g.appendChild(arrow);
  g.setAttributeNS(null,"transform","translate("+x+","+y+")");
  return g;
}
function drawSpinField(params) {
  var g = document.createElementNS(svgNS,"g");

  var base = drawTextFieldBase(params.width,22);
  g.appendChild(base);
  var upStepper = drawUpSpinStepper(params.width-11,0);
  g.appendChild(upStepper);
  var downStepper = drawDownSpinStepper(params.width-11,11);
  g.appendChild(downStepper);

  g.setAttributeNS(null,"transform","translate("+params.x+","+params.y+")");

  return g;
}
