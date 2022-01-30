var svgNS   = "http://www.w3.org/2000/svg";
var xhtmlNS = "http://www.w3.org/1999/xhtml";
var mathNS  = "http://www.w3.org/1998/Math/MathML";
var xlinkNS = "http://www.w3.org/1999/xlink";
var evNS    = "http://www.w3.org/2001/xml-events";


function init() {

  var d = new Desktop(1920,1080);

};

function makeButton(params) {
/*  <g id="okButton">
      <rect x="-1" y="-1" rx="4" ry="4" width="66" height="24"
            fill="none" stroke="#404040" stroke-width="3"/>
      <rect id="pushButton" rx="3" ry="3" width="64" height="22"
            stroke="url(./gradients.svg#strokeColor)"
            fill="url(./gradients.svg#greylight)"/>
      <text x="32" y="15" font-size="12" font-family="sans"
            text-anchor="middle"
            stroke="none" fill="black">OK</text>
    </g>*/

  var g = document.createElementNS(svgNS,"g");

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

  var edge = document.createElementNS(svgNS,"rect");
  edge.setAttributeNS(null,"x",params.x);
  edge.setAttributeNS(null,"y",params.y);
  edge.setAttributeNS(null,"rx",3);
  edge.setAttributeNS(null,"ry",3);
  edge.setAttributeNS(null,"width",params.width);
  edge.setAttributeNS(null,"height",params.height);
  edge.setAttributeNS(null,"fill","#f0f0f0"); /* greyLight */
  edge.setAttributeNS(null,"stroke","#a0a0a0");/* strokeColor */
  g.appendChild(edge);


  var t = document.createElementNS(svgNS,"text");
  t.setAttributesNS(null,"x",params.x+0.5*params.width);
  t.setAttributesNS(null,"y",params.y+15);
  t.setAttributesNS(null,"font-size",12);
  t.setAttributesNS(null,"font-family","Sans");
  t.setAttributesNS(null,"text-anchor","middle");
  t.setAttributesNS(null,"stroke","none");
  t.setAttributesNS(null,"fill","black");
  t.appendChild(document.createTextNode(params.label));
  g.appendChild(t);
}


function InfoAlert(params){
  var g = document.createElementNS(svgNS,"g");
  var r = document.createElementNS(svgNS,"rect");
  g.appendChild(r);
  r.setAttributeNS(null,"x",0);
  r.setAttributeNS(null,"y",0);
  r.setAttributeNS(null,"width",0);
  r.setAttributeNS(null,"height",0);
  var b = new PushButton({
    x: 0,
    y: 0,
    label: "OK"
  });
};


/* Older stuff below */

function Panel(params) {
};
function OKCancelDialog(params) {
};
function VBox(params){
};
function HBox(params){
};
function OptionButton(params){
};
function Spacer(params){};
function MenuButton(params){};
function TreeView(params);

function FileSelector(params) {

  var p = new Panel({
    title: "Choose a file . . ."
  });

  var ocd = new OKCancelDialog({
    onOK: function () {
      /* Report the file selected, destroy the panel, etc. */
    },
    onCancel: function () {
      /* Report no file selected, destroy the panel, etc. */
    }
  });
  p.appendChild(ocd);

  var vbox = new VBox();
  ocd.appendChild(vbox);

  var hbox = new HBox();
  vbox.appendChild(hbox);

  var dirOption = new OptionButton({
    onSelect: function () {},
  });
  hbox.appendChild(dirOption);

  var spacer = new Spacer();
  hbox.appendChild(spacer);

  var mb = new MenuButton();
  hbox.appendChild(mb);

  mb = new MenuButton();
  hbox.appendChild(mb);

  mb = new MenuButton();
  hbox.appendChild(mb);

  mb = new MenuButton();
  hbox.appendChild(mb);

  var tv = new TreeView({
  });
  vbox.appendChild(tv);
}





function makeASettingsPanel(d) {

  /* Really this should be a type unto itself. */

  var p = new Panel({
    desktop: d,
    title: "Document Settings",
  });

  var pb = new PropertyBook();

  var page = new PropertySheet({
    title: "Program"
  });

  var field = new PathField({
    label: "Path and file name:",
    labelAboveField: true,
  });
  page.appendChild(field);

  field = new Field({
    label: "Parameters:",
    labelAboveField: true,
  });
  page.appendChild(field);

  field = new Field({
    label: "Working directory:",
    labelAboveField: true,
  });
  page.appendChild(field);

  pb.appendChild(page);

  p.appendChild(pb);
}

function makeAWindow(d) {
  var ts = new TabbedSheet({
    desktop: d,
    title: "My First Sheet",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  ts.show();
}


