function Label(params) {
  
  function create() {
    var tn = document.createTextNode(params.label);
    this.element = document.createElementNS(svgNS,"text");
    this.element.appendChild(tn);
  }

  var label = document.createElementNS(svgNS,"text");
  label.setAttributeNS(null,"x",0);
  label.setAttributeNS(null,"y",0);
  label.setAttributeNS(null,"font-size",12);
  label.setAttributeNS(null,"font-family","Sans");
  label.setAttributeNS(null,"text-anchor","middle");
  label.setAttributeNS(null,"stroke","none");
  label.setAttributeNS(null,"fill","black");
  document.getElementById("theDesktop").appendChild(label);

  function getSize() {
    var bbox;
    if (/* not attached */) { /* attach off screen */ };
    bbox = this.element.getBBox();
  }
  function place() {
  }
}

