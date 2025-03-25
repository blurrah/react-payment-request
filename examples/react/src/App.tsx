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
            merchantIdentifier="bla"
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
          >
            {(requestPayment) => <ApplePayButton onClick={requestPayment} />}
          </ApplePay>
        </ErrorBoundary>
      </Suspense>
    </>
  );
}

export default App;
