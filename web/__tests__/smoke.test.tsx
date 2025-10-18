import { render, screen } from "@testing-library/react";

describe("Smoke test", () => {
  it("renders placeholder text", () => {
    render(<div>Summa.Vision</div>);
    expect(screen.getByText(/summa\.vision/i)).toBeInTheDocument();
  });
});
