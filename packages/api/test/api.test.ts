import { describe, expect, it } from 'vitest';
import { apiName } from '../src/index.js';

describe('api', () => {
  it('exports package name', () => {
    expect(apiName).toBe('api');
  });
});
