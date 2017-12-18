import memoize from './memoize';

test('should run once only', () => {
  const counter = jest.fn();

  const fn = memoize(x => {
    counter();

    return ++x;
  });

  expect(fn(1)).toBe(2);

  fn(1);

  expect(counter).toHaveBeenCalledTimes(1);
});
