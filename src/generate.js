var { lookupStatus } = require("./lookups.js");

function genJSON(obj) {
  // this will take the 2d array object from the original text, and attempt at generating JSON from it.
  var final = [];

  for (var i = 0; i < obj.length; i++) {
    var curObj = {};

    for (var y = 0; y < obj[i].length; y++) {
      // this will be each value within the second dimension array, to create a singular object.
      var cur = obj[i][y];
      // from here this will need to enclude every possible definition for web syntax.
      if (cur.includes("@path")) {
        curObj.path = cur.replace("*", "").replace("@path","").trim();
      } else if (cur.includes("@desc")) {
        curObj.desc = cur.replace("*", "").replace("@desc","").trim();
      } else if (cur.includes("@method")) {
        curObj.method = cur.replace("*", "").replace("@method","").trim();
      } else if (cur.includes("@paramdef")) {
        const re = new RegExp('\\*\\s+@paramdef\\s+\\{(?<location>[a-zA-Z]+)\\|(?<type>[a-zA-Z]+)\\}\\s+\\[(?<name>\\w+)=(?<value>\\S+)\\]\\s+-\\s+(?<desc>.*)');
        var match = cur.match(re);
        if (!curObj.param) {
          curObj.param = [];
        }
        // after the param object is ensured to be created we will add all named group matches.
        // The documentation for how this is done, is included with @response handling.
        curObj.param.push({
          ...(match.groups.location) && {location: match.groups.location},
          ...(match.groups.type) && {type: match.groups.type},
          ...(match.groups.name) && {name: match.groups.name},
          ...(match.groups.value) && {value: match.groups.value},
          ...(match.groups.desc) && {desc: match.groups.desc},
        });
      } else if (cur.includes("@param ")) {
        // This is modeled exactly off of @paramdef until all values are optional.
        const re = new RegExp('\\*\\s+@param\\s+\\{(?<location>[a-zA-Z]+)\\|(?<type>[a-zA-Z]+)\\}\\s+\\[(?<name>\\w+)\\]\\s+-\\s+(?<desc>.*)');
        var match = cur.match(re);
        if (!curObj.param) {
          curObj.param = [];
        }
        curObj.param.push({
          ...(match.groups.location) && {location: match.groups.location},
          ...(match.groups.type) && {type: match.groups.type},
          ...(match.groups.name) && {name: match.groups.name},
          ...(match.groups.desc) && {desc: match.groups.desc},
        });
      } else if (cur.includes("@response")) {
        const re = new RegExp('\\*\\s+@response\\s+(?<status>\\{\\d{1,3}\\})\\s+(?<type>\\[[a-zA-Z/]+\\])\\s+-\\s+(?<desc>.*)');
        var match = cur.match(re);
        if (!curObj.responses) {
          // if the responses object has not been created yet.
          curObj.responses = []; // instiate the key with an array value.
        }
        // after the array has been created if needed.
        curObj.responses.push({
          ...(match.groups.status) && {status: match.groups.status.replace("{","").replace("}","")},
          ...(match.groups.type) && {type: match.groups.type.replace("[","").replace("]","")},
          ...(match.groups.desc) && {desc: match.groups.desc.trim()},
        });
        // The above synatactical sugar allows us to use the spread operator and logical AND short circuit evaluation.
        // This allows the short circuit evaluation to be deconstructed, wich if true leaves the object declaration, and false
        // then is ignored. And if true, the object itself will then also be deconstructed.
        // This means that each and every item is optional.
        // TODO: Let the Regex support each value being optional.
      }
    }

    // after processing every item in the array.
    final.push(curObj);
  }

  // after everything has been parsed, return the new object
  return final;
}

function genJSON2(obj) {
  // this is the second generation parser, in line with the new definitions.
  var final = [];

  for (var i = 0; i < obj.length; i++) {
    var curObj = {};

    var tmpParam = {};
    var tmpResp = {};
    var paramActive = false;
    var respActive = false;

    for (var y = 0; y < obj[i].length; y++) {
      var cur = obj[i][y];

      if (cur.includes("@path")) {
        curObj.path = cur.replace("*","").replace("@path","").trim();
      } else if (cur.includes("@desc")) {
        curObj.desc = cur.replace("*","").replace("@desc","").trim();
      } else if (cur.includes("@method")) {
        curObj.method = cur.replace("*","").replace("@method","").trim();
      } else if (cur.includes("@todo")) {
        curObj.todo = cur.replace("*","").replace("@todo","").trim();
      } else if (cur.includes("@param")) {
        if (!Array.isArray(curObj.param)) {
          curObj.param = [ ];
        } else {
          // this would mean that param is already an array, and we have initialized it once,
          // and we are hitting param again, which is likely another definition.
          // so we will take whatever is in tmpParam and push it to the array.
          curObj.param.push(tmpParam);
          tmpParam = {};
        }
      } else if (cur.includes("@response")) {
        if (!Array.isArray(curObj.response)) {
          curObj.response = [ ];
        } else {
          curObj.response.push(tmpResp);
          tmpResp = {};
        }
      } else if (cur.includes("@location")) {
        tmpParam.location = cur.replace("*","").replace("@location","").trim();
      } else if (cur.includes("@Ptype")) {
        tmpParam.type = cur.replace("*","").replace("@Ptype","").trim();
      } else if (cur.includes("@default")) {
        tmpParam.default = cur.replace("*","").replace("@default","").trim();
      } else if (cur.includes("@name")) {
        tmpParam.name = cur.replace("*","").replace("@name","").trim();
      } else if (cur.includes("@valid")) {
        tmpParam.valid = cur.replace("*","").replace("@valid","").trim();
      } else if (cur.includes("@Pdesc")) {
        tmpParam.desc = cur.replace("*","").replace("@Pdesc","").trim();
      } else if (cur.includes("@Pexample")) {
        tmpParam.example = cur.replace("*","").replace("@example","").trim();
      } else if (cur.includes("@required")) {
        if (cur.includes("true") || cur.includes("TRUE")) {
          tmpParam.required = true;
        } else if (cur.includes("false") || cur.includes("FALSE")) {
          tmpParam.required = false;
        }
      } else if (cur.includes("@auth")) {
        if (cur.includes("true") || cur.includes("TRUE")) {
          curObj.auth = true;
        } else if (cur.includes("false") || cur.includes("FALSE")) {
          curObj.auth = false;
        }
      } else if (cur.includes("@status")) {
        tmpResp.status = cur.replace("*","").replace("@status","").trim();
      } else if (cur.includes("@Rtype")) {
        tmpResp.type = cur.replace("*","").replace("@Rtype","").trim();
      } else if (cur.includes("@Rdesc")) {
        tmpResp.desc = cur.replace("*","").replace("@Rdesc","").trim();
      } else if (cur.includes("@Rexample")) {
        tmpResp.example = cur.replace("*","").replace("@Rexample","").trim();
      }
    }
    // we also wanna make sure that we push any leftover params or responses into the object.
    var isParamEmpty = Object.keys(tmpParam).length === 0;
    if (!isParamEmpty) {
      curObj.param.push(tmpParam);
    }
    var isRespEmpty = Object.keys(tmpResp).length === 0;
    if (!isRespEmpty) {
      curObj.response.push(tmpResp);
    }
    final.push(curObj);
  }

  return final;
}

function genMD(obj) {
  // this expects to be handed the JSON from the above function directly, and will build a string of MarkDown syntax accordingly.
  var final = '';

  for (var i = 0; i < obj.length; i++) {
    final += `## **[${obj[i].method}]** ${obj[i].path} \n${obj[i].desc}\n\n`;

    if (obj[i].responses) {
      final += `| Responses | Status Code | Type | \n| - | - | - |\n`;
      for (var y = 0; y < obj[i].responses.length; y++) {
        final += `| ${obj[i].responses[y].desc} | **${obj[i].responses[y].status}** | ${obj[i].responses[y].type} |\n`;
      }
      final += `\n`;
    }

    if (obj[i].param) {
      final += `| Param | Location | Type | Required | Default | Valid |\n| - | - | - | - | - | - |\n`;
      for (var y = 0; y < obj[i].param.length; y++) {
        // here we need to do some thinking, since if the value doesn't exist,
        // default is empty, and valid is empty,
        // but if it does, we want it as the default ONLY if there are no ',', if there are then they are listed as Valid.
        if (obj[i].param[y].value) {
          // we know it has a value, but is it multiple values.
          if (obj[i].param[y].value.includes(",")) {
            // multiple values
            final += `| ${obj[i].param[y].name} | ${obj[i].param[y].location} | ${obj[i].param[y].type} | 'TRUE' | | ${obj[i].param[y].value} |\n`;
          } else {
            // only one value, and thats the default.
            final += `| ${obj[i].param[y].name} | ${obj[i].param[y].location} | ${obj[i].param[y].type} | 'TRUE' | ${obj[i].param[y].value} | |\n`;
          }
        } else {
          final += `| ${obj[i].param[y].name} | ${obj[i].param[y].location} | ${obj[i].param[y].type} | 'FALSE' | | |\n`;
        }

      }
      final += `\n`;
    }
  }

  return final;
}

function genMD2(obj) {
  var final = '';

  for (var i = 0; i < obj.length; i++) {
    final += `# **[${obj[i].method}]** ${obj[i].path}\n${obj[i].desc}\n\n`;

    if (obj[i].todo) { final += `Todo: ${obj[i].todo}\n`; }

    if (obj[i].auth) { final += `Auth: \`${obj[i].auth}\`\n`; } else { final += `Auth: \`FALSE\`\n`; }

    if (obj[i].param) {
      final += `Parameters:\n---\n`;
      for (var y = 0; y < obj[i].param.length; y++) {
        final +=
          `* ${obj[i].param[y].name} ${obj[i].param[y].required ? `_(required)_` : `_(optional)_`} ${obj[i].param[y].type ? `\`[${obj[i].param[y].type}]\`` : ''} ${obj[i].param[y].default ? `| Defaults: \`${obj[i].param[y].default}\`` : ''} ${obj[i].param[y].valid ? `| Valid: \`[${obj[i].param[y].valid}]\`` : ''}\n${obj[i].param[y].desc ? `  - ${obj[i].param[y].desc}\n\n` : `\n\n`}`;
        final += `\n---\n`;
      }
    }

    if (obj[i].response) {
      final += `Responses:\n---\n`;
      for (var y = 0; y < obj[i].response.length; y++) {
        if (obj[i].response[y].status) { final += `**HTTP Status Code:** \`${obj[i].response[y].status} ${lookupStatus(obj[i].response[y].status)}\`\n\n`; }
        if (obj[i].response[y].type) { final += `**Type:** \`[${obj[i].response[y].type}]\`\n\n`; }
        if (obj[i].response[y].desc) { final += `${obj[i].response[y].desc}\n\n`; }
        if (obj[i].response[y].example) { final += `\`\`\`json\n${obj[i].response[y].example}\n\`\`\`\n\n`; }
        final += `\n---\n`;
      }
    }

  }
  return final;
}

module.exports = { genJSON, genMD, genJSON2, genMD2 };
