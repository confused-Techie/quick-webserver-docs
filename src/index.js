var fs = require("fs");
var { parseArgv } = require("./options.js");
var { genJSON, genMD } = require("./generate.js");
const readline = require("readline");

var blockComments = [];
var webComments = [];

async function run(rawArgv) {
  var options = parseArgv(rawArgv);

  if (options.status) {
    try {
      const fileStream = fs.createReadStream(options.input);

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      for await (const line of rl) {
        parseLine(line);
      }
      await prune();
      // Now webComments should contain an array of arrays, each individual array being the lines of an @web comment.
      // Now we can parse the syntax, to create the objects needed.

      var parsedJSON = await genJSON(webComments);
      var parsedMD = await genMD(parsedJSON);
      //console.log(parsedMD);

      // once it is all done, lets write the file.

      fs.writeFileSync(options.output, parsedMD);

      console.log('Done...');

    } catch(err) {
      console.log(`Error Occured: ${err}`);
      process.exit(1);
    }
  } else {
    console.error(`Something went wrong parsing Arguments.`);
    process.exit(1);
  }

}

var parseLineHasCurrent = false;

function parseLine(line) {
  // Ideally this will create an array for each new block comment syntax found, and if a previous block comment syntax hasn't been closed will add the line to an array
  // of that block comment.
  if (line.startsWith("/**")) {
    parseLineHasCurrent = true;
    blockComments.push([]);
  } else if (line.startsWith("*/")) {
    parseLineHasCurrent = false;
  } else if (line.startsWith("*")) {
    if (parseLineHasCurrent) {
      blockComments[blockComments.length-1].push(line);
    }
  }
}

async function prune() {
  // this is intended to prune any block comments, that don't have an @web definition
  for (var i = 0; i < blockComments.length; i++) {
    if (blockComments[i][0].includes("@web")) {
      webComments.push(blockComments[i]);
    }
  }
}

module.exports = { run };
