# react-payment-request

Components for using the Payment Request API to create payments using:
- Apple Pay
- Google Pay
- TBD


## Apple Pay

API Idea:

```tsx
<Suspense fallback={<ApplePayLoading />}>
  <ApplePay
    buttonProps={{
      buttonstyle: "black"
      locale: "nl-NL"
    }}
    // If you don't want to use the existing Apple Pay button
    // We only export a requestPayment function to allow users to add onClick and other event handlers
    renderButton={(requestPayment) => <CustomButton onClick={() => requestPayment()}>}
    onClick={async () => {
      const request = await paymentRequest({
        // Payment request data here
      })
      request.show();
    }}
    // Handle each of the callback methods
    onShippingMethodChange={() => {}}
  />
</Suspense>

```
