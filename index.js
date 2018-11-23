var util = require('util');

function strip(str) {
    return ('' + str).replace(/\x1B\[\d+m/g, '');
}

function split(source, symbol) {
    return util.isString(source) ? source.split(symbol) : source;
}

function PC(source, config) {
    if (source == null) {
        return;
    }
    this.config = {
        prefix: '',
        suffix: '',
        placeholder: ' ',
        columnSeparation: ' ',
        rowSeparation: "\n",
        rowSplitSymbol: "\n",
        columnSplitSymbol: "\t"
    };
    this._STATS = {
        originalSource: source,
        source: null,
        formated: null,
        rows: 0,
        columns: 0,
        maxWidth: [],
        width: [],
        align: []
    };
    this.params(config);
    this.parse();
    this.sizeAgent();
    this.fixAlign();
    this.format();
}

var tp = PC.prototype;

tp.params = function params(config) {
    Object.assign(this.config, config);
};

tp.parse = function parse() {
    this._STATS.source = split(this._STATS.originalSource, this.config.rowSplitSymbol).map(function (row) {
        return split(row, this.config.columnSplitSymbol);
    }.bind(this));
    this._STATS.rows = this._STATS.source.length;
};

tp.sizeAgent = function sizeAgent() {
    this._STATS.source.forEach(function (row, rowNum) {
        if (this._STATS.columns < row.length) {
            this._STATS.columns = row.length;
        }
        this._STATS.width[rowNum] = [];
        row.forEach(function (column, columnNum) {
            var length = this._STATS.width[rowNum][columnNum] = strip(column).length;
            if (this._STATS.maxWidth[columnNum] == null || this._STATS.maxWidth[columnNum] < length) {
                this._STATS.maxWidth[columnNum] = length;
            }
        }.bind(this))
    }.bind(this));
};

tp.fixAlign = function fixAlign() {

    var align = (new Array(this._STATS.columns)).fill(0);

    var optAlign = [];

    if (this.config.hasOwnProperty('align')) {
        if (util.isString(this.config.align)) {
            optAlign = this.config.align.split('');
        } else if (util.isArray(this.config.align)) {
            optAlign = this.config.align;
        }

        Object.assign(align, optAlign.slice(0, this._STATS.columns).map(function (item) {
            switch (item) {
                case 1:
                case 'c':
                case 'center':
                    return 1;
                case 2:
                case 'r':
                case 'right':
                    return 2;
                case 0:
                case 'l':
                case 'left':
                default:
                    return 0;
            }
        }));
    }

    this._STATS.align = align;
};

tp.format = function format() {
    var placeholder = this.config.placeholder;
    var columnSeparation = this.config.columnSeparation;
    var rowSeparation = this.config.rowSeparation;
    this._STATS.formated = this.config.prefix +
        this._STATS.source.map(function (row, rowNum) {
            return row.map(function (column, columnNum) {
                var fillZero = this._STATS.maxWidth[columnNum] - this._STATS.width[rowNum][columnNum];
                if (fillZero > 0) {
                    var fl, fr;
                    switch (this._STATS.align[columnNum]) {
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
        }.bind(this)).join(rowSeparation) +
        this.config.suffix;
};

tp.output = function output() {
    console.log(this._STATS.formated);
};

function WRAP(source, config) {
    return new PC(source, config || {});
}

WRAP.output = function (source, config) {
    (new PC(source, config || {})).output();
};

WRAP.injectConsole = function () {
    console.columns = WRAP.output;
};

module.exports = WRAP;