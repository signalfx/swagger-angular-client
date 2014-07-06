'use strict';

var main = require('./seed');

describe('Testing', function() {
  it('works', function() {
    expect(true).toBe(true);
    expect(main(123)).toBe(256);
  });
});