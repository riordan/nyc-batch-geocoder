var geosupport=require("./geosupport"),
    //fs = require("fs"),
    //JSONStream = require("JSONStream"),
    csvparse = require("csv-parse"),
    csvstringify = require("csv-stringify"),
    program = require('./program')

var csvstringifier = csvstringify({header:true})

program.app.input
  .pipe(csvparse({columns:true}))
  .on('data', function(x){geosupport.geocode.address(x, program.app.additionalFields)})
  .pipe(csvstringifier)
  .pipe(program.app.output)



// fs.createReadStream('./data/addresses.json')  // Load in some addresses
// .pipe(JSONStream.parse('*'))                  // Read every object in the array
// .on('data', geocode)                          // Geocode every address
// .pipe(JSONStream.stringify())                 // Prepare it to output as JSON
// .pipe(process.stdout);                        // Send it to stdout
