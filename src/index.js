var geosupport=require("./geosupport"),
    //fs = require("fs"),
    //JSONStream = require("JSONStream"),
    csvparse = require("csv-parse"),
    csvstringify = require("csv-stringify"),
    program = require('./program')

var csvstringifier = csvstringify({header:true})

program.app.input
  .pipe(csvparse({columns:true}))
  .on('data', geosupport.geocode)
  .pipe(csvstringifier)
  .pipe(process.stdout)



// fs.createReadStream('./data/addresses.json')  // Load in some addresses
// .pipe(JSONStream.parse('*'))                  // Read every object in the array
// .on('data', geocode)                          // Geocode every address
// .pipe(JSONStream.stringify())                 // Prepare it to output as JSON
// .pipe(process.stdout);                        // Send it to stdout


// // Load in some addresses
// var addresses = require("./data/addresses.json");
//
// // Geocode each address
// addresses.forEach(geocode);
//
// // Optional: write the results to a file or something!
// fs.writeFile('./data/geocoded.json', JSON.stringify(addresses, null, 2) , 'utf-8');
