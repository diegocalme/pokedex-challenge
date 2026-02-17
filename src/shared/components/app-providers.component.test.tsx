import { render, screen } from "@testing-library/react";
import { AppProviders } from "@shared/components/app-providers.component";

describe("AppProviders", () => {
  it("renders children", () => {
    render(
      <AppProviders>
        <div>App content</div>
      </AppProviders>,
    );

    expect(screen.getByText("App content")).toBeInTheDocument();
  });
});
