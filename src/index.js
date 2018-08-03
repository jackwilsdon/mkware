/**
 * Bind a next method to some middleware.
 *
 * @param {Function} next the next method to bind
 * @param {Number} index the index of the middleware to bind
 * @param {Function[]} wares the middlewares to bind
 * @returns {Function} the bound next method
 */
function createNext(next, index, wares) {
  var boundNext = next.bind(null, index);

  boundNext.wares = wares;
  boundNext.ware = wares[index];

  return boundNext;
}

/**
 * Create a middleware pipe.
 *
 * @param {...Function} middlewares the middleware for the pipe
 * @returns {Function} a function which executes the provided middleware.
 *                     Any arguments passed to this function will be forwarded
 *                     to the first middleware
 */
module.exports = function mkware() {
  // Convert the middleware list to an array,
  var middlewares = Array.prototype.slice.call(arguments);

  var next = function next(index) {
    // If we've reached the end of our middleware chain then throw an error.
    if (index >= middlewares.length) {
      throw new Error('reached end of middleware chain');
    }

    // Build the arguments for the next middleware.
    var nextArguments = Array.prototype.slice
      .call(arguments, 1)
      .concat(createNext(next, index + 1, middlewares));

    // Call the next middleware.
    middlewares[index].apply(null, nextArguments);
  };

  // Create a new next method calling the initial middleware.
  return createNext(next, 0, middlewares);
};
