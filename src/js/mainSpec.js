'use strict';

var main = require('./main')

describe('Testing', function() {
  it('works', function() {
    expect(true).toBe(true);
    expect(main(123)).toBe(256);
  });
});