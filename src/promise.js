var mkware = require('.');

/**
 * Create a wrapper function which replaces the wares/ware values on the next
 * function with middlewares from the provided array.
 *
 * @param middlewares the middlewares to use
 * @returns {Function} a function which accepts a middleware and returns a
 *                     wrapped version
 */
function createMiddlewareWrapper(middlewares) {
  return function wrapMiddleware(ware) {
    return function wrappedMiddleware() {
      var forward = Array.prototype.slice.call(arguments, 0, -1);
      var next = arguments[arguments.length - 1];

      // Find the index of the original middleware we are wrapping.
      var index = middlewares.indexOf(ware);

      next.wares = middlewares;

      // The next middleware is the one after the middleware we are wrapping.
      next.ware = middlewares[index + 1];

      // Call the original middleware we're wrapping.
      return ware.apply(this, forward.concat(next));
    };
  };
}

/**
 * Create a middleware pipe which resolves to a promise at the end.
 *
 * Note: the promise will resolve with the first argument passed to "next" in
 * the last middleware.
 *
 * @param {...Function} middlewares the middleware for the pipe
 * @returns {Function} a function which executes the provided middleware.
 *                     Any arguments passed to this function will be forwarded
 *                     to the first middleware. This function will return a
 *                     promise which will resolve when the last middleware is
 *                     executed.
 */
module.exports = function mkPromiseWare() {
  // Convert the middleware list to an array.
  var middlewares = Array.prototype.slice.call(arguments);

  // Wrap the middlewares so that their "wares" and "ware" values are correct.
  var wrappedMiddlewares = middlewares.map(
    createMiddlewareWrapper(middlewares)
  );

  var next = function next() {
    // Store the arguments we're going to use on the result from mkware.
    var wareArguments = arguments;

    return new Promise(function(resolve) {
      // Build the middleware chain and execute it immediately.
      mkware
        .apply(
          null,
          // Add the resolving middleware to the end of the chain.
          wrappedMiddlewares.concat(function promiseResolverMiddleware(value) {
            resolve(value);
          })
        )
        .apply(null, wareArguments);
    });
  };

  // Add the ware values to the returned function.
  next.wares = middlewares;
  next.ware = middlewares[0];

  return next;
};
