import mapExcept from './mapExcept';

test('mapExcept should exclude keys', () => {
  const map = { abc: 123, def: 456, xyz: 789 };
  const actual = mapExcept(map, ['def']);

  expect(actual).toHaveProperty('abc', 123);
  expect('def' in actual).toBe(false);
  expect(actual).toHaveProperty('xyz', 789);
  expect(Object.keys(actual)).toHaveProperty('length', 2);
});

test('mapExcept should skip missing keys', () => {
  const map = { abc: 123, def: 456, xyz: 789 };
  const actual = mapExcept(map, ['ghi']);

  expect(actual).toHaveProperty('abc', 123);
  expect(actual).toHaveProperty('def', 456);
  expect(actual).toHaveProperty('xyz', 789);
  expect(Object.keys(actual)).toHaveProperty('length', 3);
});
