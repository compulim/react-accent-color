import arrayEqual from './arrayEqual';

export default function mapEqual(x, y) {
  if (x === y) {
    return true;
  } else if (!x) {
    return !y;
  } else if (!y) {
    return false;
  } else {
    const keys = Object.keys(x);

    return (
      arrayEqual(keys, Object.keys(y))
      && keys.every(key => x[key] === y[key])
    );
  }
}
