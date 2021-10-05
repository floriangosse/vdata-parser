var fs = require('fs');

/**
 * Helper function to recursively get inline parameters
 * @param  {String}  str  The content of the parameters, eg. TYPE=INTERNET;TYPE=HOME
 * @return {Array}        The parsed data in the form of an array for each key/value, which are objects in the array.
 */
function extractParams(str) {
    if (!(str)) { return undefined; }

    var sep = str.indexOf('=');
    var paramKey = str.substr(0, sep);
    var paramValue = str.substr(sep + 1);
    var newData = {};

    sep = paramValue.indexOf(';');
    if (sep !== -1) {
        var currentValue = paramValue.substr(0, sep);
        var recursive = extractParams(paramValue.substr(sep + 1));

        var arr = [];
        newData[paramKey] = currentValue;
        arr.push(newData);

        return arr.concat(recursive);

    } else {
        newData[paramKey] = paramValue;
        return [newData];
    }
};


/**
 * Parse lines and build a javascript object
 * @param  {Array}  lines The lines which should be parsed
 * @return {Object}       The parsed data
 */
function parse (lines) {
    var block,
        subLines = [],
        key,
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

        } else if (typeof block === 'string' && line === 'END:' + block) {
            // check if block is set and line is end of current block

            // parse the sublines which are collected
            var recursive = parse(subLines);
            // check if data for block is not set
            if (typeof data[block] === 'undefined') {
                data[block] = recursive;

            } else if (typeof data[block] === 'object' && !(data[block] instanceof Array)) {
                // check if data is already an object but not an array

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
            subLines = [];
        } else {
            // check if block is set
            if (typeof block === 'string') {
                // push current line to sublines array
                subLines.push(line);
            } else {
                // if line begins with a space
                if (line.match(/^\ /)) {
                    // add on to the previous value
                    data[key] += line.substr(1);
                } else {
                    // detect key/value seperator
                    var sep = line.indexOf(':');

                    key = line.substr(0, sep);
                    var value = line.substr(sep + 1);

                    // check for type=XXXX values within the key
                    sep = key.indexOf(';');
                    var k, v;

                    if (sep !== -1) {
                        var superKey = key.substr(0, sep);
                        var otherParams = extractParams(key.substr(sep + 1));

                        var newData = {value: value, params: otherParams};

                        k = superKey;
                        v = newData;
                    } else {
                        k = key;
                        v = value;
                    }

                    if (data[k] === undefined) {
                        // set key and value
                        data[k] = v;
                    } else if (!(data[k] instanceof Array)) {
                        var arr2 = [];
                        arr2.push(data[k]);
                        arr2.push(v);
                        data[k] = arr2;
                    } else {
                        data[k].push(v);
                    }
                }
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
function fromString(string) {
    var lines;

    // check if argument is an string
    if (typeof string !== 'string') {
        throw new TypeError('Argument must be of type string');
    }

    // replace any CR or CRLF with just LF, then split lines on LF
    lines = string.replace(/\r?\n|\r/g, '\n').split('\n');

    return parse(lines);
};

/**
 * Parse a file asynchrone and call the callback when is finished
 * @param  {String}   filename The file which should be parsed
 * @param  {Function} callback The function which is called if file is
 *                             successful finished or an error was occurred
 * @return {Object}            The parsed data
 */
function fromFile(filename, callback) {
    return fs.readFile(filename, function readFileCallback(err, buffer) {
        if (err) {
            return callback(err);
        }
        // catch the error which are thrown by parser.fromString
        try {
            // convert buffer to string
            var data = fromString(buffer.toString());
            return callback(null, data);
        } catch (err) {
            return callback(err);
        }
    });
};

/**
 * Parse a file synchronic
 * @param  {String}   filename The file which should be parsed
 * @return {Object}            The parsed data
 */
function fromFileSync(filename) {
    var buffer = fs.readFileSync(filename);

    return fromString(buffer.toString());
};

module.exports = {
    fromString: fromString,
    fromFile: fromFile,
    fromFileSync: fromFileSync
};
