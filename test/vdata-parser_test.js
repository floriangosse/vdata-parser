'use strict';

var parser = require('../lib/vdata-parser.js');

/*
    ======== A Handy Little Nodeunit Reference ========
    https://github.com/caolan/nodeunit

    Test methods:
        test.expect(numAssertions)
        test.done()
    Test assertions:
        test.ok(value, [message])
        test.equal(actual, expected, [message])
        test.notEqual(actual, expected, [message])
        test.deepEqual(actual, expected, [message])
        test.notDeepEqual(actual, expected, [message])
        test.strictEqual(actual, expected, [message])
        test.notStrictEqual(actual, expected, [message])
        test.throws(block, [error], [message])
        test.doesNotThrow(block, [error], [message])
        test.ifError(value)
*/

// Dummy test file
var dummyFile = __dirname + '/test-files/dummy.vdata';

// Dummy test string
var dummy = "" +
"BEGIN:MESSAGE\n" +
    "NAME:Hello World\n" +
    "BEGIN:LANGUAGE\n" +
        "KEY:English\n" +
        "NAME:Hello World\n" +
    "END:LANGUAGE\n" +
    "BEGIN:LANGUAGE\n" +
        "KEY:German\n" +
        "NAME:Hallo Welt\n" +
    "END:LANGUAGE\n" +
    "BEGIN:LANGUAGE\n" +
        "KEY:Latin\n" +
        "NAME:salve mundi\n" +
    "END:LANGUAGE\n" +
"END:MESSAGE";

// The structure which is expected for dummy above and the test file
var expected = {
    'MESSAGE': {
        'NAME': 'Hello World',
        'LANGUAGE': [{
            'KEY': 'English',
            'NAME': 'Hello World'
        },{
            'KEY': 'German',
            'NAME': 'Hallo Welt'
        },{
            'KEY': 'Latin',
            'NAME': 'salve mundi'
        }]
    }
};

exports['vdata-parser'] = {
    setUp: function(done) {
        done();
    },
    'has method fromString': function(test) {
        test.expect(1);
        // check if fromString is a method
        test.strictEqual(typeof parser.fromString, 'function');
        // tests here
        test.done();
    },
    'has method fromFile': function(test) {
        test.expect(1);
        // check if fromFile is a method
        test.strictEqual(typeof parser.fromFile, 'function');
        // tests here
        test.done();
    },
    'has method fromFileSync': function(test) {
        test.expect(1);
        // check if fromFileSync is a method
        test.strictEqual(typeof parser.fromFileSync, 'function');
        // tests here
        test.done();
    },
    'fromString output': function(test) {
        test.expect(1);
        // parse dummy
        var data = parser.fromString(dummy);

        // check if data and expected equal
        test.strictEqual(JSON.toString(data), JSON.toString(expected));
        // tests here
        test.done();
    },
    'fromFile output': function(test) {
        test.expect(1);
        // parse dummy
        parser.fromFile(dummyFile, function (err, data) {
            // check if data and expected equal
            test.strictEqual(JSON.toString(data), JSON.toString(expected));
            // tests here
            test.done();
        });
    },
    'fromFileSync output': function(test) {
        test.expect(1);
        // parse dummy
        var data = parser.fromFileSync(dummyFile);

        // check if data and expected equal
        test.strictEqual(JSON.toString(data), JSON.toString(expected));
        // tests here
        test.done();
    }
};
