import React from 'react';
import Masknumbermoney from './Masknumbermoney';

it('test formatToMask', () => {
  expect(Masknumbermoney.formatToMask(1000000).indexOf('$')).not.toBe(-1);
});

it('test formatToNumber', () => {
  expect(typeof Masknumbermoney.formatToNumber('$1.000.000')).toBe('number');
});
