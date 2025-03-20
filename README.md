# react-payment-request

Components for using the Payment Request API to create payments using:
- Apple Pay
- Google Pay
- TBD


## Apple Pay

API Idea:

```tsx
<Suspense fallback={<ApplePayLoading />}>
  <ErrorBoundary fallback={<ApplePayNotAvailable />}>
    <ApplePay
      buttonProps={{
        buttonstyle: "black"
        locale: "nl-NL"
      }}
      // If you don't want to use the existing Apple Pay button
      // We only export a requestPayment function to allow users to add onClick and other event handlers
      renderButton={(requestPayment) => <CustomButton onClick={() => requestPayment()}>}
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
    />
  </ErrorBoundary>
</Suspense>
```
