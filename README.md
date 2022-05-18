# hiasm-scheme
Basic parser created for HiAsm's .sha files. Turns .sha files into JSON.

Containers (`BEGIN_SDK`/`END_SDK`) are supported.
## Example
```javascript
const { parse } = require("./index.js");

async function main() {
	console.log(await parse('scheme.sha'));
}
main();
```
## Usage
`parse(filename[, prettyPrint])` - parses a scheme (from a file, intended to be in win1251, created using HiAsm) and returns a Promise, that after parsing, returns JSON.<br>
* `filename` - path to a scheme file to parse<br>
* `prettyPrint` - whether to pretty print the JSON
