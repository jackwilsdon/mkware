# mkware [![NPM Version Badge]][NPM] ![Node Version Badge] [![Build Status Badge]][Travis CI] [![Coverage Badge]][Coverage]

Make you a middleware pipe!

## Installation

```sh
npm install --save mkware
```

or

```sh
yarn add mkware
```

## Usage (normal)

```js
var mkware = require('mkware');

var execute = mkware(
  function(value, next) {
    next(value, value + 1);
  },
  function(originalValue, value, next) {
    next(originalValue, value * 2);
  },
  function(originalValue, value, next) {
    next(originalValue + value);
  },
  function(value) {
    console.log(value);
  }
);

execute(5); // last middleware outputs 17
```

## Usage (promise)

```js
var mkware = require('mkware/promise');

var execute = mkware(
  function(value, next) {
    next(value, value + 1);
  },
  function(originalValue, value, next) {
    next(originalValue, value * 2);
  },
  function(originalValue, value, next) {
    next(originalValue + value);
  }
);

execute(5).then(function(value) {
  console.log(value); // 17
});
```

[NPM Version Badge]: https://img.shields.io/npm/v/mkware.svg
[NPM]: https://npmjs.com/package/mkware
[Node Version Badge]: https://img.shields.io/node/v/mkware.svg
[Build Status Badge]: https://img.shields.io/travis/jackwilsdon/mkware.svg
[Travis CI]: https://travis-ci.org/jackwilsdon/mkware
[Coverage Badge]: https://img.shields.io/codecov/c/github/jackwilsdon/mkware.svg
[Coverage]: https://codecov.io/gh/jackwilsdon/mkware
