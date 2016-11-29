/*
program.js
Used for setting up user parameters from CLI and returning streaming IO objects
*/

var program = require('commander'),
    fs = require('fs'),
    colors = require('colors');
//var cli = {};
var app = {};

module.exports = {}

program
  .version('0.0.1')
  .usage('[options]')
  .option('-i, --input [source]', "REQ: Input source. Takes file location or stream with '-i -'", input)
  .parse(process.argv);

// Display help if nothing displayed
if (!process.argv.slice(2).length) {
  program.outputHelp(make_red);
  process.exit(1);
}

function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
}

// Actual paramater sensemaking starts here

function input(val){
  if (val === '-'){app.input=process.stdin}
  else{app.input = fs.createReadStream(val)}
}

module.exports.cli = program; // Original CLI params
module.exports.app = app; // Usable functions / data
