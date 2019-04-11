import React from 'react';
import Helpers from './Helpers';

it('test toCapitalize', () => {
    expect(typeof Helpers.toCapitalize("test words")).toBe('string');
});
