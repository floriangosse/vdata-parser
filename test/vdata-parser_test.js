'use strict';

var vDataParser = require('../lib/vdata-parser.js');

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

exports['vdata-parser'] = {
  setUp: function(done) {
    // setup here
    this.parser = new vDataParser();
    done();
  },
  'instance of': function(test) {
    test.expect(1);
    // is instanceof vDataParser
    test.ok(this.parser instanceof vDataParser);
    // tests here
    test.done();
  }
};
