var test = false;

/**
* @web
* @desc Hello World
* @path /api/packages
* @method GET
* @response {200} [application/json] - Array of Package Objects.
* @paramdef {query|integer} [page=1,2,3] - Indicate what page number to return.
* @param {query|integer} [number] - Test if no dec works.
* @paramdef {query|integer} [test=1] - Hello World.
*/

function parse() {
  console.log(test);
}

/**
* @jsdoc
*/
