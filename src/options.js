function parseArgv(rawArg) {
  if (rawArg.length < 1) {
    console.log("No Arguments passed...");
    process.exit(1);
  } else {
    var returnObj = {
      status: false,
      input: '',
      output: ''
    };

    for (var i = 0; i < rawArg.length; i++) {
      if (rawArg[i] == "-i") {
        returnObj.input = rawArg[i+1];
      } else if (rawArg[i] == "-o") {
        returnObj.output = rawArg[i+1];
      }
    }

    if (returnObj.input != "") {
      returnObj.status = true;
    }

    return returnObj;
  }
}

module.exports = { parseArgv };
