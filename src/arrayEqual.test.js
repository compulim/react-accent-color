import arrayEqual from './arrayEqual';

test('should return true for similar array', () => {
  expect(arrayEqual([1], [1])).toBe(true);
});

test('should return true for same array', () => {
  const array = [1];

  expect(arrayEqual(array, array)).toBe(true);
});

test('should return true for both null array', () => {
  expect(arrayEqual(null, null)).toBe(true);
});

test('should return true for both empty array', () => {
  expect(arrayEqual([], [])).toBe(true);
});

test('should return false for array with different content', () => {
  expect(arrayEqual([1], [2])).toBe(false);
});

test('should return false for array with larger first array', () => {
  expect(arrayEqual([1], [1, 2])).toBe(false);
});

test('should return false for array with larger second array', () => {
  expect(arrayEqual([1, 2], [1])).toBe(false);
});

test('should return false for first null array', () => {
  expect(arrayEqual(null, [1])).toBe(false);
});

test('should return false for second null array', () => {
  expect(arrayEqual(null, [1])).toBe(false);
});
