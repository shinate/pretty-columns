var PC = require('../index');
var output = require('../index').output;
require('../index').injectConsole(); // inject table to console
var colors = require('colors');
var chalk = require('chalk');

var source_string = "A\tB is very very very long\tC\tD\n1\t2\t3 is very very very wide.\t4\t5";

var source_array = [
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
var source_mix = ["column1,column2,column3", "100,200,300", "1.56,9.293872," + chalk.green.bold("398203.342387473")];

var source_regexp_symbol = "A:A,,,,B:B\n1,2\n\n3,,4\n\n\n\n5,,,,6";

console.log("\n# String input".blue.bold);
PC(source_string).output();

console.log("\n# Second column align right".blue.bold);
PC.output(source_string, {align: [null, 'right']});

console.log("\n# With custom configuration".blue.bold);
PC(source_array, {
    align: 'cr',
    columnSeparation: ' | ',
    rowSeparation: " |\n| ",
    prefix: '| ',
    suffix: ' |',
    placeholder: '*'
}).output();

console.log("\n# Mixed input and special column symbol".blue.bold);
output(source_mix, {columnSplitSymbol: ',', align: '__r'});

console.log("\n# Use regexp symbol".blue.bold);
console.columns(source_regexp_symbol, {rowSplitSymbol: /\n+/, columnSplitSymbol: /,+/, align: 'cc'});