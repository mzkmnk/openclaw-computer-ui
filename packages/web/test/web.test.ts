import { describe, expect, it } from 'vitest';

import { App } from '../src/index.js';

describe('web scaffold', () => {
  it('exports App component', () => {
    expect(typeof App).toBe('function');
  });
});
