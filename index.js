var util = require('util');

function strip(str) {
    return ('' + str).replace(/\x1B\[\d+m/g, '');
}

function tabledOutput(source, config) {
    if (source == null) {
        return;
    }
    this.STAT = {
        config: {
            placeholder: ' ',
            columnSeparation: ' ',
            rowSeparation: "\n"
        },
        originalSource: source,
        source: null,
        formated: null,
        rows: 0,
        columns: 0,
        maxWidth: [],
        width: [],
        align: []
    };
    Object.assign(this.STAT.config, config || {});
    this.parse();
    this.sizeAgent();
    this.fixAlign();
    this.format();
}

var tp = tabledOutput.prototype;

tp.parse = function parse() {
    this.STAT.source = this.parseRow(this.STAT.originalSource).map(this.parseColumn);
    this.STAT.rows = this.STAT.source.length;
};

tp.parseRow = function parseRow(source) {
    return util.isString(source) ? source.split("\n") : source;
};

tp.parseColumn = function parseColumn(source) {
    return util.isString(source) ? source.split("\t") : source;
}

tp.sizeAgent = function sizeAgent() {
    this.STAT.source.forEach(function (row, rowNum) {
        if (this.STAT.columns < row.length) {
            this.STAT.columns = row.length;
        }
        this.STAT.width[rowNum] = [];
        row.forEach(function (column, columnNum) {
            var length = this.STAT.width[rowNum][columnNum] = strip(column).length;
            if (this.STAT.maxWidth[columnNum] == null || this.STAT.maxWidth[columnNum] < length) {
                this.STAT.maxWidth[columnNum] = length;
            }
        }.bind(this))
    }.bind(this));
}

tp.fixAlign = function fixAlign() {

    var align = (new Array(this.STAT.columns)).fill(0);

    var optAlign = [];

    if (this.STAT.config.hasOwnProperty('align')) {
        if (util.isString(this.STAT.config.align)) {
            optAlign = this.STAT.config.align.split('');
        } else if (util.isArray(this.STAT.config.align)) {
            optAlign = this.STAT.config.align;
        }

        Object.assign(align, optAlign.slice(0, this.STAT.columns).map(function (item) {
            switch (item) {
                case 'c':
                case 'center':
                    return 1;
                case 'r':
                case 'rignt':
                    return 2;
                case 'l':
                case 'left':
                default:
                    return 0;
            }
        }));
    }

    this.STAT.align = align;
}

tp.format = function format() {
    var placeholder = this.STAT.config.placeholder;
    var columnSeparation = this.STAT.config.columnSeparation;
    var rowSeparation = this.STAT.config.rowSeparation;
    this.STAT.formated = this.STAT.source.map(function (row, rowNum) {
        return row.map(function (column, columnNum) {
            var fillZero = this.STAT.maxWidth[columnNum] - this.STAT.width[rowNum][columnNum];
            if (fillZero > 0) {
                var fl, fr;
                switch (this.STAT.align[columnNum]) {
                    case 0:
                        fl = 0;
                        fr = fillZero;
                        return column + (new Array(fr + 1)).join(placeholder);
                    case 1:
                        fl = parseInt(fillZero / 2);
                        fr = fillZero - fl;
                        return (new Array(fl + 1)).join(placeholder) + column + (new Array(fr + 1)).join(placeholder);
                    case 2:
                        fl = fillZero;
                        fr = 0;
                        return (new Array(fl + 1)).join(placeholder) + column;
                }
            }
            return column;
        }.bind(this)).join(columnSeparation)
    }.bind(this)).join(rowSeparation);
};

tp.output = function output() {
    console.log(this.STAT.formated);
};

function WRAP(source, config) {
    return new tabledOutput(source, config || {});
}

WRAP.output = function (source, config) {
    (new tabledOutput(source, config || {})).output();
};

WRAP.injectConsole = function () {
    console.table = WRAP.output;
};

module.exports = WRAP;