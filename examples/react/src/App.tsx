import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ApplePay, ApplePayButton } from "react-payment-request";
import "./App.css";

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading WITH SUSPENSE</div>}>
        <ErrorBoundary fallback={<div>Error</div>}>
          <ApplePay
            onMerchantValidation={() => {
              console.log("This is working");
            }}
            paymentMethodData={[
              {
                supportedMethods: "https://apple.com/apple-pay",
                data: {
                  version: 3,
                  merchantIdentifier: "merchant.com.apdemo",
                  merchantCapabilities: ["supports3DS"],
                  supportedNetworks: ["amex", "discover", "masterCard", "visa"],
                  countryCode: "US",
                },
              },
            ]}
            paymentDetails={{
              total: {
                label: "Demo (Card is not charged)",
                amount: {
                  value: "27.50",
                  currency: "USD",
                },
              },
            }}
            paymentOptions={{
              requestPayerName: false,
              requestPayerEmail: false,
              requestPayerPhone: false,
              requestShipping: false,
            }}
          >
            {(paymentRequest) => (
              <>
                <style>
                  {`
apple-pay-button {
  --apple-pay-button-width: 172px;
  --apple-pay-button-height: 43px;
  --apple-pay-button-border-radius: 9px;
  --apple-pay-button-padding: 0px 0px;
  --apple-pay-button-box-sizing: border-box;
}
                  `}
                </style>
                <ApplePayButton
                  buttonProps={{
                    type: "buy",
                  }}
                  onClick={async () => {
                    const request = await paymentRequest();
                    const response = await request.show();
                    await response.complete("success");
                  }}
                />
              </>
            )}
          </ApplePay>
        </ErrorBoundary>
      </Suspense>
    </>
  );
}

export default App;
