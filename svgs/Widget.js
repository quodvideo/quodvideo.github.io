var svgNS   = "http://www.w3.org/2000/svg";
var xhtmlNS = "http://www.w3.org/1999/xhtml";
var mathNS  = "http://www.w3.org/1998/Math/MathML";
var xlinkNS = "http://www.w3.org/1999/xlink";
var evNS    = "http://www.w3.org/2001/xml-events";

/* Widget States
 * 
 * hasFocus          GTK_STATE_FOCUSED      css:focus
 * toplevelHasFocus  --
 * isEnabled         !GTK_STATE_INSENSITIVE css:enabled css:disabled
 * isResponding      GTK_STATE_ACTIVE       css:active
 * 
 * prelight?         GTK_STATE_PRELIGHT     css:hover
 * selected?         GTK_STATE_SELECTED     css:selected
 * inconsistent?     GTK_STATE_INCONSISTENT css:indeterminate
 * normal?           GTK_STATE_NORMAL       ...
 * checked?                                 css:checked
 *
 * Also consider:
 * css:default
 * css:valid
 * css:invalid
 * css:in-range
 * css:out-ofrange
 * css:required
 * css:optional
 * css:read-only
 * css:read-write
 *
 */

function Widget(params) {
  /*
   */
  this.geometry = {
    request: {
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
      maxWidth: null,
      maxHeight: null
    },
    allocation: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  };
  this.hasFocus = false;
  this.toplevelHasFocus = false;
  this.isEnabled = false;
  this.isActive = false;
  this.isSelected = false;
  this.isChecked = false;
  this.isInconsistent = false;
  this.create = function () {
    document.createElementNS(svgNS,"g");
  };
};
