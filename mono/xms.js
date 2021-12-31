var svgNS = "http://www.w3.org/2000/svg";
var xhtmlNS = "http://www.w3.org/1999/xhtml";
var mathNS = "http://www.w3.org/1998/Math/MathML";

var hc = 12398.4172;// in eV-Angstroms
var d = 2.0;
var n = 1.0;

var minAngle = 12.5;
var maxAngle = 72;
var angleStep = 0.5;
var integrationTime = 125;
var currentAngle = 45;
var intervalID;
var timeoutID;
var settleTime;
var scanRateMultiplier;

function braggAngleToEnergy(angle,n,d) {
  if (!n) n=1;
  if (!d) d=2.0;
  return n*hc/2/d/Math.sin(angle*Math.PI/180.0);
}
function braggEnergyToAngle(energy,n,d) {
  if (!n) n=1;
  if (!d) d=2.0;  
  return Math.asin(n*hc/2/d/energy)*180/Math.PI;
}
/*
function Crystal(name,dSpacing) {
  this.name = name;
  this.dSpacing = dSpacing;
}
var DCM = {
  crystal: { name: "Ge(220)", dSpacing: 2.0 },
  minAngle: 12.5,
  maxAngle: 72,
  settleTime: 0.7,
  angleStepSize: 0.5,
  angleStepTime: 1,
  g: document.getElementById("graph0"),
  convertAngleToEnergy: function (angle,harmonic) {
    if (!harmonic) harmonic = 1;
    return harmonic*hc/2/this.crystal.dSpacing/Math.sin(angle*Math.PI/180.0);
  },
  convertEnergyToAngle: function (energy,harmonic) {
    if (!harmonic) harmonic = 1;
    return Math.asin(harmonic*hc/2/this.crystal.dSpacing/energy)*180/Math.PI;
  },
  convertEnergyToHue: function (energy) {
    var eMax = convertAngleToEnergy(this.minAngle);
    var eMin = convertAngleToEnergy(this.maxAngle);
    var eRange = eMax - eMin;
    var ePercent = (energy - eMin)/eRange;
    return ePercent*300/360;
  },
  moveToAngle: function (angle) {
    var energy = convertAngleToEnergy(angle);
    var hue = convertEnergyToHue(energy);
    var x = 100/Math.tan((180-2*angle)*Math.PI/180);
    var g = document.getElementById("graph0");
    var s = g.suspendRedraw(1000);
    changeLine("pinklight","x2",500-x,convertHSVtoRGB([hue,0.3,1]));
    changeLine("redlight","x1",500-x,convertHSVtoRGB([hue,1,1]));
    changeXtal1(angle);
    changeXtal2(angle,x);
    g.unsuspendRedraw(s);
  }
}*/
function init() {
  moveToAngle(45);
  document.getElementById("backButton").onclick = moveDown;
  document.getElementById("stopButton").onclick = moveStop;
  document.getElementById("forwardButton").onclick = moveUp;
  connectScanParameters();
  document.getElementById("startScan").onclick = startScan;
  document.getElementById("stopScan").onclick = stopScan;
  /*alert("The DCM Object is "+DCM+" .\n"
        +"Given the angle 45 degrees it returns the energy "+DCM.convertAngleToEnergy(45)+" eV.\n"
        +"Given the energy 4383.502439049964 eV it returns the angle "+DCM.convertEnergyToAngle(4383.502439049964)+" degrees.");
        \*/ 
}
function convertAngleToEnergy(angle) { return n*hc/2/d/Math.sin(angle*Math.PI/180.0); }
function convertEnergyToAngle(energy) { return Math.asin(n*hc/2/d/energy)*180/Math.PI; }
function convertEnergyToHue(e) {
  var eMax = convertAngleToEnergy(minAngle);
  var eMin = convertAngleToEnergy(maxAngle);
  var eRange = eMax - eMin;
  var ePercent = (e - eMin)/eRange;
  return ePercent * 300/360;
}
function convertHSVtoRGB(hsv) {
  var R,G,B;
  var H = hsv[0];
  var S = hsv[1];
  var V = hsv[2];
  var h,i,j,k,l,r,g,b;
  if ( S == 0 ) {             //HSV from 0 to 1
    R = V * 255;
    G = V * 255;
    B = V * 255;
  } else {
    h = H * 6;
    if ( h == 6 ) h = 0;      //H must be < 1
    i = Math.floor( h );
    j = V * ( 1 - S );
    k = V * ( 1 - S * ( h - i ) );
    l = V * ( 1 - S * ( 1 - ( h - i ) ) );
    
    if      ( i == 0 ) { r = V ; g = l ; b = j }
    else if ( i == 1 ) { r = k ; g = V ; b = j }
    else if ( i == 2 ) { r = j ; g = V ; b = l }
    else if ( i == 3 ) { r = j ; g = k ; b = V }
    else if ( i == 4 ) { r = l ; g = j ; b = V }
    else               { r = V ; g = j ; b = k }
    
    R = r * 255;                  //RGB results from 0 to 255
    G = g * 255;
    B = b * 255;
  }
  return [R,G,B]
}
function moveDown() {
  window.clearInterval(intervalID);
  intervalID = window.setInterval(stepDown,integrationTime);
}
function moveStop() {
  window.clearInterval(intervalID);
}
function moveUp() {
  window.clearInterval(intervalID);
  intervalID = window.setInterval(stepUp,integrationTime);
}
function stepUp() {
  if (currentAngle <= minAngle) {
    window.clearInterval(intervalID);
  } else {
    moveToAngle(currentAngle - angleStep);
  }
}
function stepDown() {
  if (currentAngle >= maxAngle) {
    window.clearInterval(intervalID);
  } else {
    moveToAngle(currentAngle+angleStep);
  }
}
function moveToAngle(angle) {
  function changeLine(id,coord,val,rgb) {
    var l = document.getElementById(id);
    l.setAttributeNS(null,coord,val);
    l.setAttributeNS(null,"stroke",String("rgb("+Math.round(rgb[0])+","+Math.round(rgb[1])+","+Math.round(rgb[2])+")"));
  }
  var energy = convertAngleToEnergy(angle);
  var hue = convertEnergyToHue(energy);
  var x = 100/Math.tan((180-2*angle)*Math.PI/180);
  var g = document.getElementById("graph0");
  var s = g.suspendRedraw(1000);
  changeLine("pinklight","x2",500-x,convertHSVtoRGB([hue,0.3,1]));
  changeLine("redlight","x1",500-x,convertHSVtoRGB([hue,1,1]));
  document.getElementById("xtal1").setAttributeNS(null,"transform","rotate("+angle+" 500 500)");
  document.getElementById("xtal2").setAttributeNS(null,"transform","translate("+(-x)+" 100) rotate("+angle+" 500 500)");
  g.unsuspendRedraw(s);
  currentAngle = angle;
}
function connectScanParameters() {
  var e = document.getElementById("e0");
  e.onkeyup  = checkE0;
  e.onchange = checkE0;
  var b = document.getElementById("regionBoundaries");
  b.onkeyup  = checkRegionBoundaries;
  b.onchange = checkRegionBoundaries;
  var s = document.getElementById("stepSizes");
  s.onkeyup  = checkStepSizes;
  s.onchange = checkStepSizes;
  var t = document.getElementById("integrationTimes");
  t.onkeyup  = checkIntegrationTimes;
  t.onchange = checkIntegrationTimes;
  var st = document.getElementById("settleTime");
  st.onkeyup  = checkSettleTime;
  st.onchange = checkSettleTime;
  
  function checkE0() {
    var n = Number(e.value);
    if (n && n>= convertAngleToEnergy(maxAngle) && n <= convertAngleToEnergy(minAngle)) {
      e.style.color = "black";
      b.disabled = false;
      checkRegionBoundaries();
    } else {
      e.style.color = "red";
      b.disabled = true;
      s.disabled = true;
      t.disabled = true;
      document.getElementById("startScan").disabled = true;
    }
  }
  function checkRegionBoundaries() {
    var nre = /([\+\-]?\d+(\.\d+)?([Ee][\+\-]?\d+)?)|([\+\-]?\.\d+([Ee][\+\-]?\d+)?)|([\+\-]?0x\d+)/g;
    var m = b.value.match(nre);
    var valid = false;
    if (m && m.length>=2) {
      var i = m.length-1;
      while (i>0 && Number(m[i])>Number(m[i-1])) {
        i--;
      }
      if (i==0) {
        valid = true;
      }
    }
    if (valid) {
      b.style.color = "black";
      s.disabled = false;
      checkStepSizes();
    } else {
      b.style.color = "red";
      s.disabled = true;
      t.disabled = true;
      document.getElementById("startScan").disabled = true;
    }
  }
  function checkStepSizes() {
    var nre = /([\+\-]?\d+(\.\d+)?([Ee][\+\-]?\d+)?)|([\+\-]?\.\d+([Ee][\+\-]?\d+)?)|([\+\-]?0x\d+)/g;
    var bm = b.value.match(nre);
    var r = bm.length - 1;
    var m = s.value.match(nre);
    var valid = false;
    if (m && m.length == r) {
      var i = m.length;
      while (i>0 && Number(m[i-1])>0) {
        i--;
      }
      if (i==0) {
        valid = true;
      }
    }
    if (valid) {
      s.style.color = "black";
      t.disabled = false;
      checkIntegrationTimes();
    } else {
      s.style.color = "red";
      t.disabled = true;
      document.getElementById("startScan").disabled = true;
    }
  }
  function checkIntegrationTimes() {
    var nre = /([\+\-]?\d+(\.\d+)?([Ee][\+\-]?\d+)?)|([\+\-]?\.\d+([Ee][\+\-]?\d+)?)|([\+\-]?0x\d+)/g;
    var bm = b.value.match(nre);
    var r = bm.length - 1;
    var m = t.value.match(nre);
    var valid = false;
    if (m && m.length == 1 && Number(m[0]) > 0) {
      valid = true;
    }
    if (m && m.length == r) {
      var i = m.length;
      while (i>0 && Number(m[i-1])>0) {
        i--;
      }
      if (i==0) {
        valid = true;
      }
      /*
      valid = true;
      for (i=0;i<m.length;i++) {
        if (Number(m[i])<0) {
          valid = false;
        }
      }
      */
    }
    if (valid) {
      t.style.color = "black";
      document.getElementById("startScan").disabled = false;
      updateEstimatedTime();
    } else {
      t.style.color = "red";
      document.getElementById("startScan").disabled = true;
    }
  }
  function checkSettleTime() {
    var nre = /([\+\-]?\d+(\.\d+)?([Ee][\+\-]?\d+)?)|([\+\-]?\.\d+([Ee][\+\-]?\d+)?)|([\+\-]?0x\d+)/g;
    if (st.value && !isNaN(st.value) && document.getElementById("startScan").disabled == false) {
      updateEstimatedTime();
    }
  }
  function updateEstimatedTime() {
    var nre = /([\+\-]?\d+(\.\d+)?([Ee][\+\-]?\d+)?)|([\+\-]?\.\d+([Ee][\+\-]?\d+)?)|([\+\-]?0x\d+)/g;
    var ev = Number(e.value);
    var bv = b.value.match(nre);
    var sv = s.value.match(nre);
    var tv = t.value.match(nre);
    var tt = 0;
    var ts = 0;
    for (var i=0;i<bv.length-1;i++) {
      rl = bv[i+1]-bv[i];
      rs = rl / sv[i];
      if (tv.length == 1) {
        tt += rs * tv[0];
      } else {
        tt += rs * tv[i];
      }
      ts += rs;
    }
    // adding settle time
    tt += ts*Number(st.value);
    var tp,hrs,mins,secs;
    secs = tt%60;
    tp = (tt-secs)/60;
    mins = tp%60;
    hrs = (tp-mins)/60;
    document.getElementById("estimatedDuration").value = hrs+":"+mins+":"+Math.round(secs);
  }
}
function reportScanParameters() {
  var i;
  var nre = /([\+\-]?\d+(\.\d+)?([Ee][\+\-]?\d+)?)|([\+\-]?\.\d+([Ee][\+\-]?\d+)?)|([\+\-]?0x\d+)/g;

  var bs = document.getElementById("regionBoundaries").value;
  var ss = document.getElementById("stepSizes").value;
  var ts = document.getElementById("integrationTimes").value;

  var e = Number(document.getElementById("e0").value);
  var o = "E0 is "+e+".\n";
  var b = bs.match(nre);
  if (b) {
    o += "The boundaries are: ";
    for (i=0;i<b.length;i++) { o += b[i] + ((i==b.length-1)?" .\n":" : "); }
  }
  var s = ss.match(nre);
  if (s) {
    o += "The steps are: ";
    for (i=0;i<s.length;i++) { o += s[i] + ((i==s.length-1)?" .\n":" : "); }
  }
  var t = ts.match(nre);
  if (t) {
    o += "The times are: ";
    for (i=0;i<t.length;i++) { o += t[i] + ((i==t.length-1)?" .\n":" : "); }
  }
  alert(o);
  var oe;
  if (b.length>=2 && s.length==b.length-1 && (t.length==1 || t.length==s.length)) {
    if (s.length>1) {
      oe = "There are "+s.length+" regions.\n";
      for (var r = 0;r<s.length;r++) {
        oe += "Region "+(r+1)+" is from "+Number(b[r])+" to "+Number(b[r+1]);
        oe += " with step size "+Number(s[r]);
        oe += " and integration time ";
        if (t.length == 1) {
          oe += t[0];
        } else {
          oe += t[r];
        }
        oe += " .\n"
      }
      
    } else {
      oe =  "There is one region from "+Number(b[0])+" to "+Number(b[1]);
      oe += " with step size "+Number(s[0]);
      oe += " and integration time "+Number(t[0])+" .";
    }
  } else {
    oe = "Something is wrong with the boundaries.";
    if (b.length<2) {
      oe += " There are not enough region boundaries.";
    } else if (s.length > b.length-1) {
      oe += " Too many step sizes are given.";
    } else if (s.length < b.length-1) {
      oe += " Too few step sizes are given.";
    } else if (t.length > b.length-1) {
      oe += " Too many integration times are given.";
    } else if (t.length < b.length-1) {
      oe += " Too few integration times are given.";
    } else {
      oe += " But I don't know what.";
    }
  }
  alert(oe);
}
function buildScanDB() {
  var scandb = [];
  var nre = /([\+\-]?\d+(\.\d+)?([Ee][\+\-]?\d+)?)|([\+\-]?\.\d+([Ee][\+\-]?\d+)?)|([\+\-]?0x\d+)/g;
  var e = Number(document.getElementById("e0").value);
  var b = document.getElementById("regionBoundaries").value.match(nre);
  var s = document.getElementById("stepSizes").value.match(nre);
  var t = document.getElementById("integrationTimes").value.match(nre);
  var currentEnergy;
  /* Convert relative boundaries into absolute boundaries */
  if (Number(b[0])<0) {
    for (var i=0;i<b.length;i++) {
      b[i] = e + Number(b[i]);
    }
  }
  /* Set up integration times for all regions */
  if (t.length == 1) {
    for (var i=1;i<s.length;i++) {
      t[i] = t[0];
    }
  }
  /* Make an array of arrays of energies & integration times */
  for (var r=0;r<b.length;r++) {
    currentEnergy = Number(b[r]);
    while(currentEnergy<b[r+1]) {
      scandb.push([currentEnergy,Number(t[r])]);
      currentEnergy+=Number(s[r]);
    }
  }
  return scandb;
}
function startScan() {
  var scandb = buildScanDB();
  settleTime = Number(document.getElementById("settleTime").value);
  scanRateMultiplier = Number(document.getElementById("scanRateMultiplier").value);
  step(scandb,0);
  freezeScanControls();
  freezeMonoControls();
}
function stopScan() {
  window.clearTimeout(timeoutID);
  unfreezeScanControls();
  unfreezeMonoControls();
}
function step(db,i) {
  document.getElementById("currentStep").value = i+"/"+db.length;
  if (i<db.length) {
    moveToAngle(convertEnergyToAngle(db[i][0]));
    timeoutID = window.setTimeout(step,(db[i][1]+settleTime)*1000/scanRateMultiplier,db,i+1);
  } else {
    unfreezeScanControls();
    unfreezeMonoControls();
  }
}
function freezeScanControls() {
  document.getElementById("e0").disabled = true;
  document.getElementById("regionBoundaries").disabled = true;
  document.getElementById("stepSizes").disabled = true;
  document.getElementById("integrationTimes").disabled = true;
  document.getElementById("settleTime").disabled = true;
  document.getElementById("startScan").disabled = true;
  document.getElementById("stopScan").disabled = false;
}
function unfreezeScanControls() {
  document.getElementById("e0").disabled = false;
  document.getElementById("regionBoundaries").disabled = false;
  document.getElementById("stepSizes").disabled = false;
  document.getElementById("integrationTimes").disabled = false;
  document.getElementById("settleTime").disabled = false;
  document.getElementById("startScan").disabled = false;
  document.getElementById("stopScan").disabled = true;
}
function freezeMonoControls() {
  document.getElementById("backButton").disabled = true;
  document.getElementById("stopButton").disabled = true;
  document.getElementById("forwardButton").disabled = true;
}
function unfreezeMonoControls() {
  document.getElementById("backButton").disabled = false;
  document.getElementById("stopButton").disabled = false;
  document.getElementById("forwardButton").disabled = false;
}
window.onload = init;

