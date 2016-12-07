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
  .option('-i, --input [source]', "REQ: Input source. Takes file location or stream with '-i -'")
  .option ('-o --output [dest]', "OPTIONAL: Output destination. Defaults to stream. Takes file location or stream with '-o -'")
  .parse(process.argv);

sensemake(program)


// Display help if nothing displayed
if (!process.argv.slice(2).length) {
  program.outputHelp(make_red);
  process.exit(1);
}

function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
}

// Actual paramater sensemaking starts here

function sensemake(program){
  input(program.input)
  output(program.output)
}

function input(val){
  /*
    Builds input stream
    No default assumed
    '-': STDIN
    all other: assumed to be file location; writes over file
  */
  if (val === '-'){app.input=process.stdin}
  else{app.input = fs.createReadStream(val)}
}

function output(val){
  /*
    Builds output stream
    Default: STDOUT
    '-': STDOUT
    all other: Assumed to be file location
  */
  if(val === '-') // IS IT A DASH (STDOUT)
    { app.output=process.stdout}
  else if (typeof(val) === 'string'){ // IF ITS NOT A DASH, BUT ITS A STRING, ITS A FILE
    app.output = fs.createWriteStream(val)}
  else{ // OR WERE STDOUT AGAIN
      app.output=process.stdout
  }

}

module.exports.cli = program; // Original CLI params
module.exports.app = app; // Usable functions / data
