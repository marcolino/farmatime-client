/**
 * we need to run yarn start-dev, yarn lighthouse to build a fresh lighthouseOutput.json...
 */

//import { afterEach } from "vitest"
//import { cleanup } from "@testing-library/react"
//import { render, screen } from "@testing-library/react"
//import "@testing-library/jest-dom/vitest"

import { describe, test, expect } from "vitest";
import lighthouseOutput from "./lighthouseOutput.json" assert { type: "json" };

describe("Accessibility", () => {
  test("Accessibility score is within acceptable threshold", () => {
    expect(lighthouseOutput.categories.accessibility.score >= 0.95);
  });
  test("All Images have alt values", () => {
    expect(lighthouseOutput.audits["image-alt"].score === 1);
  });
});
