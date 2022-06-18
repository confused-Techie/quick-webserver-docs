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

module.exports = { genJSON, genMD };
