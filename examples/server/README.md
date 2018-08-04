# Server Example

A simple example demonstrating how `mkware` can be used to emulate [`connect`].

This example listens on port `3000`.

## URLs

This example responds to the following URLs;

 * `/hello` → Responds with `Hello world!`
 * `/crash` → Crashes the application
 * Anything else → Outputs a 404 message

## Error handling

This example does not implement any error handling.

[`connect`]: https://github.com/senchalabs/connect
