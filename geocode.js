var proj4 = require("proj4"),
    ffi = require("ffi"),
    fs = require("fs");

var lib = ffi.Library("version-16c_16.3/lib/libgeo.so", {
  geo: [ "void", [ "char *", "char *" ] ]
});

// Faster to reuse the same buffers
var wa1Buffer = new Buffer(1200),
    wa2Buffer = new Buffer(1200);

var reproject = proj4('PROJCS["NAD_1983_StatePlane_New_York_Long_Island_FIPS_3104_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",984250.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-74.0],PARAMETER["Standard_Parallel_1",40.66666666666666],PARAMETER["Standard_Parallel_2",41.03333333333333],PARAMETER["Latitude_Of_Origin",40.16666666666666],UNIT["Foot_US",0.3048006096012192]]').inverse;

// Load in some addresses
var addresses = require("./data/addresses.json");

// Geocode each address
addresses.forEach(geocode);

// Optional: write the results to a file or something!
fs.writeFile('./data/geocoded.json', JSON.stringify(addresses, null, 2) , 'utf-8');


function geocode(address) {

  // Construct COW string for work area 1
  var wa1 = ("1 " + rightpad(address.HouseNumber, 16) + rightpad("", 38) + address.BoroughCode + rightpad("", 10) + rightpad(address.AltStreetName || address.StreetName, 32) + rightpad("", 113) + "C" + rightpad(address.ZipCode, 5)).toUpperCase(),
      wa2, returnCode, x, y;

  // Reset work areas
  wa1Buffer.fill(" ");
  wa2Buffer.fill(" ");

  // Write to work area 1
  wa1Buffer.write(wa1, "utf8");

  // Geocode
  lib.geo(wa1Buffer, wa2Buffer);

  // Update with results
  wa1 = wa1Buffer.toString();
  wa2 = wa2Buffer.toString();

  returnCode = wa1.substring(716, 718);

  // Success
  if (returnCode === "00") {

    // State Plane coords
    x = +(wa2.substring(125, 132));
    y = +(wa2.substring(132, 139));

    address.tract = +(wa2.substring(223, 229));
    address.block = +(wa2.substring(229, 233));
    address.lngLat = reproject([x, y]);

  }
  // Optional: handle errors, return code "EE", etc.

  return address;

}

function rightpad(str, width) {

  str = str.toString();

  while (str.length < width) {
    str += " ";
  }

  if (str.length > width) {
    return str.slice(0, width);
  }

  return str;

}
