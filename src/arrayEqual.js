export default function arrayEqual(x, y) {
  if (x === y) {
    return true;
  } else if (!x) {
    return !y;
  } else if (!y) {
    return false;
  } else if (x.length !== y.length) {
    return false;
  } else {
    return x.every((x, index) => x === y[index]);
  }
}
