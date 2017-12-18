import mapEqual from './mapEqual';

test('should return true for similar map', () => {
  expect(mapEqual({ abc: 123 }, { abc: 123 })).toBe(true);
});

test('should return true for same map', () => {
  const o = { abc: 123 };

  expect(mapEqual(o, o)).toBe(true);
});

test('should return true for both null map', () => {
  expect(mapEqual(null, null)).toBe(true);
});

test('should return false for larger first map', () => {
  expect(mapEqual({ abc: 123, def: 456 }, { abc: 123 })).toBe(false);
});

test('should return false for larger second map', () => {
  expect(mapEqual({ abc: 123 }, { abc: 123, def: 456 })).toBe(false);
});

test('should return false for different maps', () => {
  expect(mapEqual({ abc: 123 }, { def: 456 })).toBe(false);
});
