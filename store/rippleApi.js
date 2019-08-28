const RippleAPI = require('ripple-lib').RippleAPI;


const rippleTestApi = new RippleAPI({
  server: process.env.rippleTestServer // Public rippled server hosted by Ripple, Inc.
});
rippleTestApi.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});
rippleTestApi.on('connected', () => {
  console.log('connected');
});
rippleTestApi.on('disconnected', (code) => {
  // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
  // will be 1000 if this was normal closure
  console.log('disconnected, code:', code);
});


export default rippleTestApi;
