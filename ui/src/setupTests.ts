/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

expect.extend(matchers);

vi.stubGlobal('URL', {
  createObjectURL: vi.fn(),
});
