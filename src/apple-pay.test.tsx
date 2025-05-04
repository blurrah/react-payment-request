import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { ApplePayButton } from "./apple-pay.tsx";

describe("ApplePayButton", () => {
  test("renders apple pay button", async () => {
    // Falling back to data-testid as no text or roles are rendered
    const { getByTestId } = render(
      <ApplePayButton data-testid="apple-pay-button" onClick={() => {}} />
    );
    await expect.element(getByTestId("apple-pay-button")).toBeInTheDocument();
  });
});
