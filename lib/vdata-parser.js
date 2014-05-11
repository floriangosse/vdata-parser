'use strict';

var fs = require('fs');

var parser = module.exports = {};

/**
 * Parse lines and build a javascript object
 * @param  {Array}  lines The lines which should be parsed
 * @return {Object}       The parsed data
 */
function parse (lines) {
    var block,
        subLines = [],
        data = {};

    // check if lines are an array
    if (!(lines instanceof Array)) {
        throw new TypeError('Argument must be instanceof Array');
    }

    // loop through the lines
    for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];

        // check if block is set and line begins with BEGIN:
        if (typeof block === 'undefined' && !!~line.indexOf('BEGIN:')) {
            block = line.substr(6);
        }
        // check if block is set and line is end of current block
        else if (typeof block === 'string' && line === 'END:' + block) {
            // parse the sublines which are collected
            var recursive = parse(subLines);
            // check if data for block is not set
            if (typeof data[block] === 'undefined') {
                data[block] = recursive;
            }
            // check if data is already an object but not an array
            else if (typeof data[block] === 'object' && !(data[block] instanceof Array)) {
                var arr = [];

                // push existing data into array
                arr.push(data[block]);
                // push new data
                arr.push(recursive);

                // set array as new block value
                data[block] = arr;
            } else {
                // push new data
                data[block].push(recursive);
            }
            block = undefined;
        } else {
            // check if block is set
            if (typeof block === 'string') {
                // push current line to sublines array
                subLines.push(line);
            } else {
                // detect key/value seperator
                var sep = line.indexOf(':');

                // set key and value
                data[line.substr(0, sep)] = line.substr(sep + 1);
            }
        }
    }

    return data;
}

/**
 * Parse a string
 * @param  {String} string The string which should be parsed
 * @return {Object}        The parsed data
 */
parser.fromString = function (string) {
    var lines;

    // check if argument is an string
    if (typeof string !== 'string') {
        throw new TypeError('Argument must be of type string');
    }

    lines = string.split('\n');

    return parse(lines);
};

/**
 * Parse a file asynchrone and call the callback when is finished
 * @param  {String}   filename The file which should be parsed
 * @param  {Function} callback The function which is called if file is
 *                             successful finished or an error was occurred
 * @return {Object}            The parsed data
 */
parser.fromFile = function (filename, callback) {
    return fs.readFile(filename, function (err, buffer) {
        if (err) {
            return callback(err);
        }
        // catch the error which are thrown by parser.fromString
        try {
            // convert buffer to string
            var data = parser.fromString(buffer.toString());
            return callback(null, data);
        } catch (err) {
            return callback(err);
        }
    });
};

/**
 * Parse a file synchrone
 * @param  {String}   filename The file which should be parsed
 * @return {Object}            The parsed data
 */
parser.fromFileSync = function (filename) {
    var buffer = fs.readFileSync(filename);

    return parser.fromString(buffer.toString());
};