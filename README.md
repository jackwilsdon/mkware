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
  function(object, next) {
    object.value += 1;
    next();
  },
  function(object, next) {
    object.value *= 2;
    next();
  },
  function(object, next) {
    object.value += 5;
    next();
  },
  function(value) {
    console.log(value);
  }
);

execute({ value: 5 }); // last middleware outputs 17
```

## Usage (promise)

```js
var mkware = require('mkware/promise');

var execute = mkware(
  function(object, next) {
    object.value += 1;
    next();
  },
  function(object, next) {
    object.value *= 2;
    next();
  },
  function(object, next) {
    object.value += 5;
    next();
  }
);

execute({ value: 5 }).then(function(object) {
  console.log(object.value); // 17
});
```

## Builder

Need a more conventional way to set up your middleware? Try [`mkware-builder`][mkware-builder];

```js
var mkware = require('mkware-builder');

var ware = mkware();

ware.use(function(object, next) {
    object.value += 1;
    next();
});

ware.use(function(object, next) {
    object.value *= 2;
    next();
});

ware.use(function(object, next) {
    object.value += 5;
    next();
});

ware.use(function(object) {
  console.log(object.value);
});

ware({ value: 5 }); // last middleware outputs 17
```

There is also a promise-based variant at [`mkware-builder/promise`][mkware-builder];

```js
var mkware = require('mkware-builder/promise');

var ware = mkware();

ware.use(function(value, next) {
  next(value, value + 1);
});

ware.use(function(originalValue, value, next) {
  next(originalValue, value * 2);
});

ware.use(function(originalValue, value, next) {
  next(originalValue + value);
});

ware(5).then(function(value) {
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
[mkware-builder]: https://npmjs.com/package/mkware-builder
