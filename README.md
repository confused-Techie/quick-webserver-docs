# Quick-WebServer-Docs

After searching high and low for a simplistic, fast, reliable way to create JSDoc Style Markdown documentation I was disappointed by the myriad of solutions I found.

While there is absolutely no shortage of solutions, and granted many of them are bound to be fantastic, extensible, pluggable, and flexible. This wasn't what I needed. Sometimes all thats needed is a quick and dirty way to write down documentation for your JavaScript API endpoints. Without YAML in JSDoc Comments, or installing Java on your machine.

For this now there is Quick-WebServer-Docs.

Exactly how it sounds, it has some simple syntax that lives in JSDoc Style Comments in your JavaScript code, with a single CLI app to extract, parse, and create a Markdown file where you see fit.

If at any point some more complex declarations are giving you issues you can refer to the [Regex](/docs/regex.md) statements explained to give insight into what exactly is expected.

## Installation

```bash
npm install @confused-techie/quick-webserver-docs
```

## Usage

To add this as an NPM script for your project:

```bash
npm install @confused-techie/quick-webserver-docs --save-dev
```

Then add the following into your package.json file.

```json
"scripts": {
  "doc": "quick-webserver-docs -i ./input/file.js -o ./output/file.md"
}
```

And to create your new Documentation file:

```bash
npm run doc
```

## Syntax

The syntax has recently been rewritten with many breaking changes.

* \@web: Specifies that the following Block Comment is intended for Quick-WebServer-Docs.
* \@path: The path this block comment documents.
* \@desc: The description for the endpoint. Any special notes for the endpoint should be put here.
* \@method: The Method for this endpoint.
* \@todo: Any notes about what is left todo for this endpoint.
* \@auth: A boolean (true|TRUE false|FALSE) to indicate if authentication is required.
* \@param: This is the header to start defining a single parameter. Each new parameter needs a new \@param header.
  - \@location: The location of the parameter. Recommended values: query, header, path, cookie.
  - \@Ptype: Since type is duplicated for different fields, a parameter type is Ptype. Being the type of data this is expected to receive. Such as string, integer and so on.
  - \@default: The default value for this specific parameter, if there is none, this field can be left out entirely.
  - \@name: The name of this parameter.
  - \@valid: A list of valid values for this parameter.
  - \@Pdesc: A description for this parameter.
  - \@Pexample: A short one lined example for the parameter.
  - \@required: A boolean (true|TRUE false|FALSE) to indicate if this parameter is required.
* \@response: Header to define a single response. Each new response needs a new \@response header.
  - \@status: The status code returned by this response. A lookup of the numeric code will be done automatically to include the text representation as well.
  - \@Rtype: The type of data returned by the response. eg. application/json
  - \@Rdesc: A short description of the returned data.
  - \@Rexample: A single line example of the data returned.

## Examples

```javascript
/**
* @web
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
* @response
*   @status 418
*   @Rtype application/json
*   @Rdesc Hello world response
*   @Rexample {[ "name": "hello-world"]}
*/
```

Creates:

---

# **[GET]** /api/packages
Hello world

Auth: `true`
Parameters:
---
* page _(required)_ `[application/json]`  | Valid: `[1,2,3,4]`
  - Hello world from a query parameter.

Responses:
---
**HTTP Status Code:** `418 I'm a teapot`

**Type:** `[application/json]`

Hello world response

```json
{[ "name": "hello-world" ]}
```
