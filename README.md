# hiasm-scheme
Basic parser created for HiAsm's .sha files. Turns .sha files into JSON.

Containers (`BEGIN_SDK`/`END_SDK`) are supported.
## Example
```javascript
const { parse } = require("./index.js");

async function main() {
	console.log(await parse('scheme.sha',true));
}
main();
```

Assuming scheme.sha is:
```
Make(delphi)
ver(4.05 build 186)
Add(Console,2953706,161,98)
{
 Title="хуй"
 link(onStart,6072511:doExecute,[(215,104)(215,132)])
}
Add(ODialog,6072511,238,126)
{
 link(onExecute,3481011:doDelete,[(296,132)(296,146)])
}
Add(FileTools,3481011,322,126)
{
}
```
(this scheme is almost 4 years old btw (and is also made by me for whatever reason)) and is in Windows-1251, the output will be:
```
{
  "pack": "delphi",
  "hiasmVersion": "4.05 build 186",
  "elements": [
    {
      "name": "Console",
      "id": 2953706,
      "x": 161,
      "y": 98,
      "props": {
        "Title": "\"хуй\""
      },
      "points": [],
      "links": [
        {
          "point": "onStart",
          "to": {
            "id": "6072511",
            "name": "doExecute"
          },
          "coords": [
            [
              215,
              104
            ],
            [
              215,
              132
            ]
          ]
        }
      ]
    },
    {
      "name": "ODialog",
      "id": 6072511,
      "x": 238,
      "y": 126,
      "props": {},
      "points": [],
      "links": [
        {
          "point": "onExecute",
          "to": {
            "id": "3481011",
            "name": "doDelete"
          },
          "coords": [
            [
              296,
              132
            ],
            [
              296,
              146
            ]
          ]
        }
      ]
    },
    {
      "name": "FileTools",
      "id": 3481011,
      "x": 322,
      "y": 126,
      "props": {},
      "points": [],
      "links": []
    }
  ]
}
```
## Usage
`parse(filename[, prettyPrint])` - parses a scheme (from a file, intended to be in win1251, created using HiAsm) and returns a Promise, that after parsing, returns JSON.<br>
* `filename` - path to a scheme file to parse<br>
* `prettyPrint` - whether to pretty print the JSON
