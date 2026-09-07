import { describe, expect, it } from "vitest";
import { createMeal ,getMeals } from "./mealApi";


describe("mealApi", () => {
  it("getMeals exists as a function", () => {
    expect(typeof getMeals).toBe("function");
  });

  it("createMeal exists as a function", () => {
    expect(typeof createMeal).toBe("function");
  });
});