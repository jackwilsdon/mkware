/**
 * Bind a next method to some middleware.
 *
 * @param {Function} next the next method to bind
 * @param {Number} index the index of the middleware to bind
 * @param {Function[]} wares the middlewares to bind
 * @param {Array} [wareArguments] arguments for the next middleware. If this
 *                                is not provided then a next method is
 *                                returned which uses it's arguments as the
 *                                ware arguments.
 * @returns {Function} the bound next method
 */
function bindNext(next, index, wares, wareArguments) {
  if (arguments.length >= 4) {
    next = next.bind(null, index, wareArguments);
  } else {
    var originalNext = next;

    next = function next() {
      originalNext.call(null, index, Array.prototype.slice.call(arguments));
    };
  }

  next.wares = wares;
  next.ware = wares[index];

  return next;
}

/**
 * Create a middleware pipe.
 *
 * @param {...Function} middlewares the middleware for the pipe
 * @returns {Function} a function which executes the provided middleware.
 *                     Any arguments passed to this function will be passed to
 *                     all middleware
 */
module.exports = function mkware() {
  // Convert the middleware list to an array,
  var wares = Array.prototype.slice.call(arguments);

  var next = function next(index, wareArguments) {
    if (index >= wares.length) {
      throw new Error('reached end of middleware chain');
    }

    var nextWareArguments = wareArguments.concat(
      bindNext(next, index + 1, wares, wareArguments)
    );

    wares[index].apply(null, nextWareArguments);
  };

  return bindNext(next, 0, wares);
};
