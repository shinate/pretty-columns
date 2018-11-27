"use strict";

var emojiRegex = require('emoji-regex')();

/**
 * Strip ansi characters
 *
 * @param {string} str
 * @returns {string}
 */
function stripANSI(str) {
    return ('' + str).replace(/\x1B\[\d+m/g, '');
}

/**
 * Strip wrap characters
 *
 * @param {string} str
 * @returns {string}
 */
function stripWRAP(str) {
    return ('' + str).replace(/[\n\r]+/g, ' ');
}

/**
 * Strip emoji characters
 *
 * @param {string} str
 * @returns {string}
 */
function stripEmoji(str) {
    return ('' + str).replace(emojiRegex, '');
}

/**
 * Split if string given
 *
 * @param {array|string} source
 * @param {string|regex} symbol
 * @returns {array}
 */
function split(source, symbol) {
    return isArray(source) ? source : ('' + source).split(symbol);
}

/**
 * Is string
 *
 * @param t
 * @returns {boolean}
 */
function isString(t) {
    return typeof t === 'string';
}

/**
 * Is Array
 *
 * @param t
 * @returns {boolean}
 */
function isArray(t) {
    return Array.isArray(t);
}

/**
 * String real width
 *
 * @param {string} str
 * @returns {number}
 *
 * Emoji: 2
 * Double-byte character: 2
 * Others: 1
 */
function realWidth(str) {
    if (str == null)
        return 0;
    str = stripANSI(str);
    return str.length + (stripEmoji(str).match(/[^\x00-\xff]/g) || []).length;
}

/**
 * Main
 *
 * @param source
 * @param config
 * @constructor
 */
function PC(source, config) {
    if (source == null)
        return;

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
        formatted: null,
        rows: 0,
        columns: 0,
        maxWidth: [],
        width: [],
        align: []
    };

    this.params(config);
    this.parseSource();
    this.AnalyticAlignment();
    this.format();
}

var tp = PC.prototype;

/**
 * Parse configuration
 *
 * @param {object} config
 */
tp.params = function params(config) {
    Object.assign(this.config, config);
};

/**
 * Parsing the original source and create this._STATS.source
 */
tp.parseSource = function parse() {
    this._STATS.source = split(this._STATS.originalSource, this.config.rowSplitSymbol).map(function (row, rowNum) {
        if (this._STATS.columns < row.length)
            this._STATS.columns = row.length;
        this._STATS.width[rowNum] = [];
        return split(row, this.config.columnSplitSymbol).map(function (column, columnNum) {
            var length = this._STATS.width[rowNum][columnNum] = realWidth(column);
            if (!this._STATS.maxWidth.hasOwnProperty(columnNum) || this._STATS.maxWidth[columnNum] < length)
                this._STATS.maxWidth[columnNum] = length;
            return stripWRAP(column);
        }.bind(this));
    }.bind(this));
    this._STATS.rows = this._STATS.source.length;
};

/**
 * Analytic alignment
 */
tp.AnalyticAlignment = function fixAlign() {
    var align = (new Array(this._STATS.columns)).fill(0);
    var optAlign = [];
    if (this.config.hasOwnProperty('align')) {
        if (isString(this.config.align)) {
            optAlign = this.config.align.split('');
        } else if (isArray(this.config.align)) {
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

/**
 * Format source and create this._STATS.formatted
 */
tp.format = function format() {
    var placeholder = this.config.placeholder;
    var columnSeparation = this.config.columnSeparation;
    var rowSeparation = this.config.rowSeparation;
    this._STATS.formatted = this.config.prefix +
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

/**
 * Output
 */
tp.output = function output() {
    console.log(this._STATS.formatted);
};

/**
 * Export wrapper
 *
 * @param {string|array} source
 * @param {object|null} config
 * @returns {PC}
 * @constructor
 */
function WRAP(source, config) {
    return new PC(source, config || {});
}

/**
 * Direct call of output
 *
 * @param {string|array} source
 * @param {object|null} config
 */
WRAP.output = function (source, config) {
    (new PC(source, config || {})).output();
};

/**
 * Inject to console with given string
 *
 * @param {string} key default: "columns"
 */
WRAP.injectConsole = function (key) {
    console[key || 'columns'] = WRAP.output;
};

module.exports = WRAP;