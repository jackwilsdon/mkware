var mkPromiseWare = require('./promise');

function createForwardingMiddleware(nextArguments) {
  return jest.fn(function() {
    return arguments[arguments.length - 1].apply(null, nextArguments || []);
  });
}

function createTerminatingMiddleware() {
  return jest.fn();
}

it('returns a function', function() {
  var ware = mkPromiseWare(
    createForwardingMiddleware(),
    createForwardingMiddleware(),
    createForwardingMiddleware()
  );

  expect(typeof ware).toBe('function');
});

it('returns a promise when the middleware is executed', function() {
  var ware = mkPromiseWare(
    createForwardingMiddleware(),
    createForwardingMiddleware(),
    createForwardingMiddleware()
  );

  expect(ware()).toBeInstanceOf(Promise);
});

it('has a wares attribute containing a list of all middleware', function() {
  var wares = [
    createForwardingMiddleware(),
    createForwardingMiddleware(),
    createTerminatingMiddleware(),
  ];
  var ware = mkPromiseWare.apply(null, wares);

  expect(ware.wares).toEqual(wares);
});

it('has a ware attribute pointing to the first middleware', function() {
  var wares = [
    createForwardingMiddleware(),
    createForwardingMiddleware(),
    createTerminatingMiddleware(),
  ];
  var ware = mkPromiseWare.apply(null, wares);

  expect(ware.ware).toEqual(wares[0]);
});

it('has a wares attribute on the next function containing a list of all middleware', function() {
  var wares = [
    createForwardingMiddleware(),
    createForwardingMiddleware(),
    createTerminatingMiddleware(),
  ];
  var ware = mkPromiseWare.apply(null, wares);

  ware();

  wares.forEach(function(jestWare) {
    expect(jestWare).toHaveBeenCalledWith(
      expect.objectContaining({
        wares: wares,
      })
    );
  });
});

it('has a ware attribute on the next function pointing to the next middleware', function() {
  var wares = [
    createForwardingMiddleware(),
    createForwardingMiddleware(),
    createTerminatingMiddleware(),
  ];
  var ware = mkPromiseWare.apply(null, wares);

  ware();

  wares.forEach(function(jestWare, index) {
    expect(jestWare).toHaveBeenCalledWith(
      expect.objectContaining({
        ware: wares[index + 1],
      })
    );
  });
});

it('executes each middleware', function() {
  var wares = [
    createForwardingMiddleware(),
    createForwardingMiddleware(),
    createTerminatingMiddleware(),
  ];
  var ware = mkPromiseWare.apply(null, wares);

  ware();

  wares.forEach(function(jestWare) {
    expect(jestWare).toHaveBeenCalled();
  });
});

it('passes the initial arguments to every middleware', function() {
  var wares = [
    createForwardingMiddleware([
      "this shouldn't be forwarded to the next middleware",
      "this shouldn't either",
    ]),
    createForwardingMiddleware([
      "this shouldn't be forwarded to the next middleware",
      "this shouldn't either",
    ]),
    createTerminatingMiddleware(),
  ];

  var ware = mkPromiseWare.apply(null, wares);

  ware('a', 'b', 'c');

  wares.forEach(function(jestWare) {
    expect(jestWare).toHaveBeenCalledWith('a', 'b', 'c', expect.any(Function));
  });
});

it('resolves the promise if the last middleware calls next', function() {
  var ware = mkPromiseWare(
    createForwardingMiddleware(),
    createForwardingMiddleware(),
    createForwardingMiddleware()
  );

  expect(ware).resolves;
});
