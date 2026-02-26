import { describe, expect, it } from 'vitest';
import { sharedName } from '../src/index.js';

describe('shared', () => {
  it('exports package name', () => {
    expect(sharedName).toBe('shared');
  });
});
