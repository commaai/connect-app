var now = require("performance-now")
export default (store) => {
  return function (next) {
    return function (action) {
      console.log('dispatching', action.type);
      // var start = performance.now();
      var start = now();
      var result = next(action);
      var end = now();
      // var end = performance.now();
      console.log('%c Action with type "' + action.type + '" took ' + (end - start).toFixed(2) + ' milliseconds.', 'background: #bada55; color: #222');
      return result;
    };
  };
}
