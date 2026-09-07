import {render , screen} from "@testing-library/react";
import {describe , expect , it, vi} from "vitest";
import MealForm from "./MealForm";

describe("MealForm", () => {
    it("renders the MealForm component", () => {
        render(<MealForm onMealCreated={vi.fn()} />);

        expect(
            screen.getByRole("heading", { name: "Create New Meal" })
        ).toBeTruthy();

        expect(
            screen.getByRole("button", { name: "Create Meal" })
        ).toBeTruthy();
    });
});