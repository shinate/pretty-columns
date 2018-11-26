# pretty-columns

Support colors, chalk and other ansi.

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
|prefix|Prefix at output|""|
|suffix|Suffix at output|""|
|placeholder|Fill white space|" "|
|columnSeparation|Columns connector|" "|
|rowSeparation|Rows connector|"\n"|
|rowSplitSymbol|Row split symbol(when string input given)|"\n"(can be regexp)|
|columnSplitSymbol|Column split symbol(when string input given)|"\t"(can be regexp)|

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
        "search"
    ],
    [
        "query",
        "q=" + colors.cyan("npm")
    ],
    [
        "scheme",
        "https"
    ]
];

output(source_array, {
    align: 'cr',
    columnSeparation: ' | ',
    rowSeparation: " |\n| ",
    prefix: '| ',
    suffix: ' |',
    placeholder: '*'
});
```

**Print**

![]()