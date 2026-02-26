import { describe, expect, it } from 'vitest';
import { runnerName } from '../src/index.js';

describe('runner', () => {
  it('exports package name', () => {
    expect(runnerName).toBe('runner');
  });
});
