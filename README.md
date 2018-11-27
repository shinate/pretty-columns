# pretty-columns

[![Build Status via Travis CI](https://travis-ci.org/shinate/pretty-columns.svg?branch=master)](https://travis-ci.org/shinate/pretty-columns)

- Support [colors](https://www.npmjs.com/package/colors), [chalk](https://www.npmjs.com/package/chalk) and other ansi.
- Compatible with double-byte characters, emoji emoticons.
- Best display when using monospaced fonts.
- Content can only be displayed in a single line, automatically remove "\n" or "\r" from content.
- Multi-line display may be possible. (lazy.. stretched)

## Via [npm](https://www.npmjs.com/)

```javascript
npm install pretty-columns
```

## Via [yarn](https://yarnpkg.com/)

```javascript
yarn add pretty-columns
```

## Usage

### Normally

```javascript
var pc = require('pretty-columns');

pc(input).output();
// console.log(pc(input)) will see all structure
```

### Output

```javascript
var po = require('pretty-columns').output;

po(input);
```

### Inject console

```javascript
require('pretty-columns').injectConsole();

console.columns(input);
```

## About Input

### String

```javascript
var input = "A\tB\n1\t2";
```

### Array

```javascript
var input = [['A','B'],[1,2]];
```

### Mixed

```javascript
var input = ['A,B','1,2'];
```

## Custom configuration

|property|description|default|
|---|---|---|
|rowSplitSymbol|Row split symbol(when string input given)|"\n" (can be regexp)|
|columnSplitSymbol|Column split symbol(when string input given)|"\t" (can be regexp)|
|align|Alignment:<br>\['right', 'center', ...\]<br>OR<br>'rc...'|Filling "left" when insufficient.<br>Ignored when redundant.|
|rowSeparation|Rows connector|"\n"|
|columnSeparation|Columns connector|" "|
|prefix|Prefix at output|""|
|suffix|Suffix at output|""|
|placeholder|Fill white space|" "|

## Example

```javascript

var output = require('../index').output;
var colors = require('colors');
var chalk = require('chalk');

var INPUT = [
    [
        chalk.bold.blue("key"),
        colors.bold.red("value")
    ],
    [
        "domain",
        "www.google.com"
    ],
    [
        chalk.yellow("path"),
        "😘search🐰"
    ],
    [
        "query",
        colors.cyan("q=") + "npm 中\n文呢？"
    ],
    [
        "scheme",
        "https"
    ]
];

output(INPUT, {
    align: 'cr',
    columnSeparation: ' | ',
    rowSeparation: " |\n| ",
    prefix: '| ',
    suffix: ' |',
    placeholder: '*'
});
```

**Print**

![](https://raw.githubusercontent.com/shinate/pretty-columns/master/thumbnails/description.png)