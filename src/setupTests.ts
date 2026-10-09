import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Automatically cleanup rendered components after each test
afterEach(() => {
  cleanup();
});
