# react-payment-request

Components for using the Payment Request API to create payments using:
- Apple Pay
- Google Pay
- TBD


## Apple Pay

Use `<ApplePay />` to handle the complete Apple Pay checkout. You can use the render props API to request a payment.

```tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  ApplePay,
  ApplePayButton,
} from "./path/to/apple-pay"; // Adjust import path as needed

function ApplePayCheckout() {
  // Define your payment details according to the Payment Request API spec
  const paymentMethodData: PaymentMethodData[] = [
    {
      supportedMethods: "https://apple.com/apple-pay",
      data: {
        version: 3,
        merchantIdentifier: "merchant.com.example", // Replace with your identifier
        merchantCapabilities: ["supports3DS"],
        supportedNetworks: ["visa", "masterCard", "amex", "discover"],
        countryCode: "US",
      },
    },
  ];

  const paymentDetails: PaymentDetailsInit = {
    id: "order-123",
    displayItems: [
      { label: "Subtotal", amount: { currency: "USD", value: "99.00" } },
      { label: "Tax", amount: { currency: "USD", value: "1.00" } },
    ],
    total: {
      label: "Total",
      amount: { currency: "USD", value: "100.00" },
    },
    // Add shipping options if needed
  };

  return (
    <Suspense fallback={<div>Loading Apple Pay...</div>}>
      <ErrorBoundary fallback={<div>Apple Pay not available</div>}>
        <ApplePay
          paymentMethodData={paymentMethodData}
          paymentDetails={paymentDetails}
          // Add paymentOptions if needed
          // paymentOptions={{ requestShipping: true }}
          onMerchantValidation={async (event) => {
            try {
              const response = await fetch("/api/authorize-merchant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ validationURL: event.validationURL }),
              });
              if (!response.ok) throw new Error("Merchant validation failed");
              const paymentInfo = await response.json();
              event.complete(paymentInfo);
            } catch (error) {
              console.error("Merchant validation error:", error);
              // Optionally complete with an error object, though the spec is unclear here
              // event.complete({ error: 'validation-failed' });
            }
          }}
          // Optional event handlers:
          onPaymentMethodChange={(event) => {
          //   // Update paymentDetails based on the selected method
            event.updateWith(updatedDetails);
          }}
          onShippingAddressChange={(event) => {
          //   // Update paymentDetails based on the new address (e.g., recalculate tax/shipping)
            event.updateWith(updatedDetails);
          }}
          onShippingOptionChange={(event) => {
          //   // Update paymentDetails based on the selected shipping option
            event.updateWith(updatedDetails);
          }}
        >
          {(createPaymentRequest) => (
            <ApplePayButton
              locale="en-US"
              buttonStyle="black"
              type="pay"
              onClick={async () => {
                const request = createPaymentRequest();
                if (!request) {
                  console.error("Payment Request API is not available.");
                  // Handle case where Payment Request is not supported
                  // or Apple Pay JS fallback is needed (if implemented).
                  return;
                }
                try {
                  const response = await request.show();
                  // Process successful payment response
                  console.log("Payment successful:", response);
                  // IMPORTANT: Complete the payment on the PaymentResponse object
                  await response.complete("success");
                  // Perform post-payment actions (e.g., redirect, show success message)
                } catch (error) {
                  console.error("Payment failed:", error);
                  // Handle payment errors (e.g., user cancellation, processing error)
                  // No need to call complete() if show() rejects.
                }
              }}
            />
          )}
        </ApplePay>
      </ErrorBoundary>
    </Suspense>
  );
}

```
