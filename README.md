# react-payment-request

Components for using the Payment Request API to create payments using:
- Apple Pay
- Google Pay
- TBD


## Apple Pay

Use `<ApplePay />` to handle the complete Apple Pay checkout. You can use the render props API to request a payment.

```tsx
<Suspense fallback={<ApplePayLoading />}>
  <ErrorBoundary fallback={<ApplePayNotAvailable />}>
    <ApplePay
      onStartPayment={async () => {
        const request = await paymentRequest({
          // Payment request data here
        })
        try {
        const response = await request.show();
        } catch() {
          // Do something with error
        }
        // Do something after it's done
      }}
      // All callback methods including additional apple pay methods available
      onMerchantValidation((event) => {
        const response = await fetch("/api/authorize-merchant")
        const paymentInfo = await response.json();

        event.complete(paymentInfo)
      })
    >
    {(requestPayment) => (
      // Apple Pay Button in this case is a React wrapper for just the custom element, you can add any custom button you want here but we suggest the custom element
      <ApplePayButton locale="en-US" buttonStyle="black" type="pay" onClick={() => requestPayment()}>
    )}
    </ApplePay>
  </ErrorBoundary>
</Suspense>
```

Alternative where we don't use render props but ApplePay also has a context available and the ApplePayButton has a useApplePay() hook that allows for requestPayment to be handled:

```tsx
<Suspense fallback={<ApplePayLoading />}>
  <ErrorBoundary fallback={<ApplePayNotAvailable />}>
    <ApplePay
      onStartPayment={async () => {
        const request = await paymentRequest({
          // Payment request data here
        })
        try {
        const response = await request.show();
        } catch() {
          // Do something with error
        }
        // Do something after it's done
      }}
      // All callback methods including additional apple pay methods available
      onMerchantValidation((event) => {
        const response = await fetch("/api/authorize-merchant")
        const paymentInfo = await response.json();

        event.complete(paymentInfo)
      })
    >
      // Apple Pay Button in this case is a React wrapper for just the custom element, you can add any custom button you want here but we suggest the custom element
      <ApplePayButton locale="en-US" buttonStyle="black" type="pay">
    </ApplePay>
  </ErrorBoundary>
</Suspense>
```
