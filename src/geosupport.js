const ffi = require("ffi");
const rightpad = require("./utils/rightpad");

const geosupport = {}; // module to export
const GEOSUPPORT_LIBGEO  = process.env.GEOSUPPORT_LIBGEO; // env var containing libgeo binary

/*
  Takes Borough from input address. Returns matching numeric boroughcode.
  If already numeric borough code, returns current code.
 */
function boroughMatch(borough){
  const codes = require('./data/boroughcodes');
  return codes[String(borough).toUpperCase()];
}


//Configuration settings for Geosupport
const lib = ffi.Library(GEOSUPPORT_LIBGEO, {
  geo: [ "void", [ "char *", "char *" ] ]
});


// you give this function a house number, a borough, a street name, and zip
// and it gives you a COW
// input: str, str | int, str
// output: <buffer>
function moooooo(house, street, boro) {
  var cowstr = "";
  cowstr += "1A"; // function code
  cowstr += rightpad(house, 16);
  cowstr += " ".repeat(38); // spacing
  cowstr += boroughMatch(boro);
  cowstr += " ".repeat(10); // yes, more spacing
  cowstr += rightpad(street, 32);
  cowstr += " ".repeat(113); // space space space
  cowstr += "C"; // and now the letter 'C'
  
  buffer = Buffer.alloc(1200, " ");
  buffer.write(cowstr.toUpperCase(), 'ascii');
  
  return buffer;
}

geosupport.geocode = function (a) {
  const address = Object.assign({}, a);

  var wa1Buffer = moooooo(address.houseNumber, address.streetName, address.borough); 
  var wa2Buffer = Buffer.alloc(1363, " ");

  // Geocode
  lib.geo(wa1Buffer, wa2Buffer);

  // result strings
  const wa1 = wa1Buffer.toString();
  const wa2 = wa2Buffer.toString();
  
  const returnCode = wa1.substring(716, 718);

  // Success
  if (returnCode === "00") {
    // set status
    address.status = 'OK';
        
    address.lat = wa2.substring(179, 188);
    address.lng = wa2.substring(188, 199);
    
    address.boro = wa2.substring(33,34);
    address.block = wa2.substring(34,39);
    address.lot = wa2.substring(39,43);
    address.bbl = wa2.substring(33,43);
    
  } else {
    address.status = 'ERROR';
  }

  return address;
};


module.exports = geosupport;
