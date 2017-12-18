import arrayEqual from './arrayEqual';

export default function memoize(fn) {
  let lastArgs, lastResult;

  return function () {
    const args = [].slice.call(arguments);

    if (arrayEqual(args, lastArgs)) {
      return lastResult;
    }

    return (lastResult = fn.apply(null, (lastArgs = args)));
  };
}
