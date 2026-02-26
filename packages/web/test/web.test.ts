import { describe, expect, it } from 'vitest';
import { webName } from '../src/index.js';

describe('web', () => {
  it('exports package name', () => {
    expect(webName).toBe('web');
  });
});
