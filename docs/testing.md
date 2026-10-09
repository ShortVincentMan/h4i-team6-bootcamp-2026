# Unit Testing Guide

We use **Vitest** and **React Testing Library** for running unit tests in this project.

## Commands

- **Run tests once:**
  npm test

- **Run tests in watch mode:**
  npm run test:watch

## Writing a Test

Place test files alongside components with a `.test.tsx` extension.

### Example

import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ComponentToTest from '@/components/ComponentToTest';

// Mock usePathname from next/navigation if testing components with navigation links
vi.mock('next/navigation', () => ({
usePathname: () => '/',
}));

describe('ComponentToTest', () => {
it('renders home link correctly', () => {
render(<ComponentToTest />);

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');

});
});
