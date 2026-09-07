import {render , screen} from "@testing-library/react";
import {describe , expect , it} from "vitest";
import AdminMealsPage from "./AdminMealsPage";


describe ("AdminMealsPage", () => {
  it("renders the AdminMealsPage component", async () => {
    render(<AdminMealsPage />);


    expect(
       await screen.findByRole("heading", { name: "Meals" })

    ).toBeTruthy();
    });
});