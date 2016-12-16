var csvparse = require('csv-parse/lib/sync');
var fs = require('fs');

var fieldset = {}


var csv = csvparse(fs.readFileSync('addressfields.csv'), {columns:true})

csv.forEach( function(row, callback){
  fieldset[row.FIELDCODE] = [parseInt(row.POSITION_FROM), parseInt(row.POSITION_TO)]
})

var myfields = ["atomic_polygon", "census_tract_2010"]

function matchFields(myfields,fieldset, callback){
  var matches = 
  myfields.forEach(function(field){
    if(fieldset[field]){
      return fieldset[field]
    }
  })
}
