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
  "doc": "node quick-webserver-docs -i ./input/file.js -o ./output/file.md"
}
```

And to create your new Documentation file:

```bash
npm run doc
```

## Syntax

* \@web: Specifies that the following Block Comment is intended for Quick-WebServer-Docs
* \@path: The path this block comment documents.
* \@desc: A description for the endpoint. Any special notes for the endpoint should be put here.
* \@method: The Method for this endpoint.
* \@paramdef: Any parameters available for this endpoint CONTAINING default values.

  - {} Brackets can be used to define the location of the Query Parameter and/or type. The first value in the brackets is to indicate the location of the parameter, if including a type add '|' and the type afterwards.
  - [] Square Brackets can indicate the name of the parameter and is required, following the name of the parameter can be an '=' sign, which one indicates that its optional, and additionally whatever is on the other side of the equal sign is used to indicate the default value. Type NULL to indicate if no default is chosen. Alternatively you can use '=' following by multiple values separated only by ',' to indicate valid values.
  - Finally a '-' with a space on both sides is used to write a description of this parameter.

* \@param: Any parameters available for an endpoint, without any defaults.

  - This matches almost exactly with \@paramdef EXCEPT it will fail from getting a '=' in the param name field. Expecting there are no defaults.

* \@response: Define a response this endpoint can return.

  - {} Brackets can be used to return the HTTP Status Code of this specific response.
  - [] Square Brackets can be used to define what type of data is returned.
  - Finally a '-' with a space on both sides is used to write a description of this response.

### Valid Syntax Values:

* Parameter Location: query, header, path, cookie
* Data Type:

## Examples

```javascript
/**
* @web
* @path /api/packages
* @method GET
* @desc A Short Description
* @param {query|integer} [page=1] - Indicate what page number to return.
* @response {200} [application/json] - Array of Package Objects.
*/
```

### **[GET]** /api/packages
A Short Description

| Param | Location | Type | Required | Default |
| - | - | - | - | - |
| page | Query | `integer` | False | 1 |

| Responses | Status Code | Type |
| - | - | - |
| Array of Package Objects | **200** | `application/json` |
