var mkware = require('.');

function createMiddleware(stop) {
  return jest.fn(function() {
    var forward = Array.prototype.slice.call(arguments, 0, -1);
    var next = arguments[arguments.length - 1];

    return stop ? null : next.apply(null, forward);
  });
}

function createAddMiddleware() {
  return function(value, next) {
    next(value + 1);
  };
}

it('returns a function', function() {
  var ware = mkware(
    createMiddleware(),
    createMiddleware(),
    createMiddleware(true),
  );

  expect(typeof ware).toBe('function');
});

it('has a wares attribute containing a list of all middleware', function() {
  var wares = [createMiddleware(), createMiddleware(), createMiddleware(true)];
  var ware = mkware.apply(null, wares);

  expect(ware.wares).toEqual(wares);
});

it('has a ware attribute pointing to the first middleware', function() {
  var wares = [createMiddleware(), createMiddleware(), createMiddleware(true)];
  var ware = mkware.apply(null, wares);

  expect(ware.ware).toEqual(wares[0]);
});

it('has a wares attribute on the next function containing a list of all middleware', function() {
  var wares = [createMiddleware(), createMiddleware(), createMiddleware(true)];
  var ware = mkware.apply(null, wares);

  ware();

  wares.forEach(function(jestWare) {
    expect(jestWare).toHaveBeenCalledWith(
      expect.objectContaining({
        wares: wares,
      }),
    );
  });
});

it('has a ware attribute on the next function pointing to the next middleware', function() {
  var wares = [createMiddleware(), createMiddleware(), createMiddleware(true)];
  var ware = mkware.apply(null, wares);

  ware();

  wares.forEach(function(jestWare, index) {
    expect(jestWare).toHaveBeenCalledWith(
      expect.objectContaining({
        ware: wares[index + 1],
      }),
    );
  });
});

it('executes each middleware', function() {
  var wares = [createMiddleware(), createMiddleware(), createMiddleware(true)];
  var ware = mkware.apply(null, wares);

  ware();

  wares.forEach(function(jestWare) {
    expect(jestWare).toHaveBeenCalled();
  });
});

it('forwards arguments passed to next to the next middleware', function() {
  var finalWare = createMiddleware(true);

  var ware = mkware(
    createAddMiddleware(),
    createAddMiddleware(),
    createAddMiddleware(),
    finalWare,
  );

  ware(0);

  expect(finalWare).toHaveBeenCalledWith(3, expect.any(Function));
});

it('throws an error if the last middleware calls next', function() {
  var ware = mkware(createMiddleware(), createMiddleware(), createMiddleware());

  expect(ware).toThrow(Error);
  expect(ware).toThrow('reached end of middleware chain');
});
