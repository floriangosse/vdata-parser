const path = require('path');
const test = require('ava');
const { readFileSync } = require('fs');
const { fromString, fromFile, fromFileSync } = require('../lib/vdata-parser');

const fixtureDataFile = path.resolve(__dirname, 'fixtures.vdata');
const fixtureData = readFileSync(fixtureDataFile).toString();

const expectedData = {
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
        }],
        'EMAIL': [{value: "abc@def.com", params: [{TYPE: "INTERNET"}]},
            {value: "info@xyz.com", params: [{TYPE: "INTERNET"}, {TYPE: "HOME"}]}]
    }
};

test('fromString', (t) => {
    const actualData = fromString(fixtureData);

    t.deepEqual(actualData, expectedData);
});

test('fromFile', (t) => {
    t.plan(1);

    return new Promise((resolve, reject) => {
        fromFile(fixtureDataFile, (err, actualData) => {
            if (err) {
                return reject(err);
            }

            t.deepEqual(actualData, expectedData);
            resolve();
        });
    });
});

test('fromFileSync', (t) => {
    const actualData = fromFileSync(fixtureDataFile);

    t.deepEqual(actualData, expectedData);
});