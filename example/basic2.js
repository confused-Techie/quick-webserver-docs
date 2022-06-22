var test = false;

/**
* @web
* @ignore
* @desc Hello world
* @path /api/packages
* @method GET
* @auth true
* @param
*   @location query
*   @Ptype application/json
*   @name page
*   @valid 1,2,3,4
*   @required true
*   @Pdesc Hello world from a query parameter.
* @param
*   @name test
*   @Ptype application/json
*   @Pdesc fjfjfjfj
* @response
*   @status 418
*   @Rtype application/json
*   @Rdesc Hello world response
*   @Rexample {[rar]}
* @response
*   @Rdesc Hello world again.
*   @status 200
*/

function parse() {
  console.log(test);
}

/**
* @desc Testing testing JSDocs including in the same source.
* @param {string} token description
* @param {function} [callback] optional description parameter.
*/
