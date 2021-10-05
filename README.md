# vdata-parser

Parse vdata (ics, vcal, vcard) to javscript objects.

## Getting Started
Install the module with: `npm install vdata-parser`

```javascript
var parser = require('vdata-parser');
```

## Documentation

### `fromString(string)`
Parse a string and return a object which contains the data which parsed.

Return: `Object` - The parsed data

#### `string`
* Type: `String`

The string contains the vdata which should be parsed.

### `fromFile(filename, callback)`
Parse the file and execute the given callback.

#### `filename`
* Type: `String`

The file which should be parsed.

#### `callback`
* Type: `Function`

The function which is called if file is successful finished or an error was occurred. The callback is called with two arguments: `err` and `data`. The argument `err` is `null` and `data` is an `object` if no error is occurred.

### `fromFileSync(filename)`
Parse a file synchronic.

Return: `Object` - The parsed data

#### `filename`
* Type: `String`

The file which should be parsed.

## Examples

### Parse a string
```javascript
var parser = require('vdata-parser');

// ... define variable `string` ...

var data = parser.fromString(string);

console.dir(data);
```

### Parse a file asynchrone
```javascript
var parser = require('vdata-parser');

parser.fromFile(__dirname + '/file', function (err, data) {
        if (err) throw err;

        console.dir(data);
    });
```

### Parse a file synchron
```javascript
var parser = require('vdata-parser');

var data = parser.fromFileSync(__dirname + '/file');

console.dir(data);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 Florian Goße. Licensed under the MIT license.
