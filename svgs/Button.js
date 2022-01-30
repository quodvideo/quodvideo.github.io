/*
 * Parameters
 * x:
 * y:
 * width:
 * height:
 * isDefault:
 * label:
 */

var svgNS   = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";
var evNS    = "http://www.w3.org/2001/xml-events";

function createButton(params) {

  var g = document.createElementNS(svgNS,"g");

  if (params.isDefault) {
    var defaultEdge = document.createElementNS(svgNS,"rect");
    defaultEdge.setAttributeNS(null,"x",params.x-1);
    defaultEdge.setAttributeNS(null,"y",params.y-1);
    defaultEdge.setAttributeNS(null,"rx",4);
    defaultEdge.setAttributeNS(null,"ry",4);
    defaultEdge.setAttributeNS(null,"width",params.width+2);
    defaultEdge.setAttributeNS(null,"height",params.height+2);
    defaultEdge.setAttributeNS(null,"fill","none");
    defaultEdge.setAttributeNS(null,"stroke","#404040");
    defaultEdge.setAttributeNS(null,"stroke-width",3);
    g.appendChild(defaultEdge);
  }

  var edge = document.createElementNS(svgNS,"rect");
  edge.setAttributeNS(null,"x",params.x);
  edge.setAttributeNS(null,"y",params.y);
  edge.setAttributeNS(null,"rx",3);
  edge.setAttributeNS(null,"ry",3);
  edge.setAttributeNS(null,"width",params.width);
  edge.setAttributeNS(null,"height",params.height);
  edge.setAttributeNS(null,"fill","url(#greylight)"); /* greyLight */
  edge.setAttributeNS(null,"stroke","#a0a0a0");/* strokeColor */
  g.appendChild(edge);

  var label = document.createElementNS(svgNS,"text");
  function gimme(evt) {
    var bbox = evt.target.getBBox();
    alert("Width: "+bbox.width+" Height: "+bbox.height);
  }
  label.addEventListener("click",gimme,false);
  label.setAttributeNS(null,"x",params.x+0.5*params.width);
  label.setAttributeNS(null,"y",params.y+15);
  label.setAttributeNS(null,"font-size",12);
  label.setAttributeNS(null,"font-family","Sans");
  label.setAttributeNS(null,"text-anchor","middle");
  label.setAttributeNS(null,"stroke","none");
  label.setAttributeNS(null,"fill","black");
  label.appendChild(document.createTextNode(params.label));

  g.appendChild(label);

  return g;
}

/*

  I---J
  | . |
  K---L

  a-----------b
  | e-------f |
  | | i---j | |
  | | | . | | |
  | | k---l | |
  | g-------h |
  c-----------d

  . = text.x,text.y
  a = 
  b =
  c =
  d =
  e =
  f =
  g =
  h = 
  i = bbox.x,bbox.y
  j = bbox.x+bbox.width,bbox.y
  k = bbox.x,bbox.y+bbox.height
  l = bbox.x+bbox.width,bbox.y+bbox.height



*/
function drawLabel(params) {
  var label = document.createElementNS(svgNS,"text");
  label.setAttributeNS(null,"x",0);
  label.setAttributeNS(null,"y",0);
  label.setAttributeNS(null,"font-size",12);
  label.setAttributeNS(null,"font-family","Sans");
  label.setAttributeNS(null,"text-anchor","middle");
  label.setAttributeNS(null,"stroke","none");
  label.setAttributeNS(null,"fill","black");
  label.appendChild(document.createTextNode(params.label));
  return label;
}
function createAutoButton(params) {

  var label = drawLabel({label: params.label});
  document.getElementById("theDesktop").appendChild(label);

  bbox = label.getBBox();
  var width = bbox.width;
  var height = bbox.height;

  /* alert("Text at (0,0) reports bounding box from x="+bbox.x+" y="+bbox.y+" width="+bbox.width+" height="+bbox.height); */
 
  width+=12; // padding
  height+=8; // padding

  if (width<64) width = 64;

  var g = document.createElementNS(svgNS,"g");

  if (params.isDefault) {
    var defaultEdge = document.createElementNS(svgNS,"rect");
    defaultEdge.setAttributeNS(null,"x",params.x-1);
    defaultEdge.setAttributeNS(null,"y",params.y-1);
    defaultEdge.setAttributeNS(null,"rx",4);
    defaultEdge.setAttributeNS(null,"ry",4);
    defaultEdge.setAttributeNS(null,"width",width+2);
    defaultEdge.setAttributeNS(null,"height",height+2);
    defaultEdge.setAttributeNS(null,"fill","none");
    defaultEdge.setAttributeNS(null,"stroke","#404040");
    defaultEdge.setAttributeNS(null,"stroke-width",3);
    g.appendChild(defaultEdge);
  }

  var edge = document.createElementNS(svgNS,"rect");
  edge.setAttributeNS(null,"x",params.x);
  edge.setAttributeNS(null,"y",params.y);
  edge.setAttributeNS(null,"rx",3);
  edge.setAttributeNS(null,"ry",3);
  edge.setAttributeNS(null,"width",width);
  edge.setAttributeNS(null,"height",height);
  edge.setAttributeNS(null,"fill","url(#greylight)"); /* greyLight */
  edge.setAttributeNS(null,"stroke","#a0a0a0");/* strokeColor */
  g.appendChild(edge);

  g.appendChild(label);
  label.setAttributeNS(null,"x",params.x+0.5*width);
  label.setAttributeNS(null,"y",params.y+15);

  function onmouseover(e) {
    edge.setAttributeNS(null,"fill","url(#greyshade)");
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
    edge.setAttributeNS(null,"fill","url(#greylight)");
    g.removeEventListener("mouseup",onmouseup,false);
    g.removeEventListener("mouseout",onmouseout,false);
    document.addEventListener("mouseup",onmousecancel,false);
    g.addEventListener("mouseover",onmouseover,false);
  };
  function onmouseup(e) {
    edge.setAttributeNS(null,"fill","url(#greylight)");
    g.removeEventListener("mouseup",onmouseup,false);
    g.removeEventListener("mouseout",onmouseout,false);
  }
  function onmousedown(e) {
    if (e.button === 0) {
      edge.setAttributeNS(null,"fill","url(#greyshade)");
      g.addEventListener("mouseup",onmouseup,false);
      g.addEventListener("mouseout",onmouseout,false);
    }
  }
  g.addEventListener("mousedown",onmousedown,false);


  return g;
}

