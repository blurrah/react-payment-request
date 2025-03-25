/// <reference types="@types/applepayjs" />
import type { ReactNode } from "react";
import { useLoadSuspenseScript } from "./use-load-suspense-script.ts";

export function ApplePayProvider(): ReactNode {
  return <div>ApplePayProvider</div>;
}

type ApplePayProps = {
  /**
   * The URL of the Apple Pay SDK script.
   * This is used to construct the Apple Pay button
   * @default https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js
   */
  scriptUrl?: string;
  /**
   * The merchant identifier for the Apple Pay merchant.
   */
  merchantIdentifier: string;
  /**
   * The onLoad callback function.
   */
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onMerchantValidation?: (event: ApplePayMerchantValidationEvent) => void;
  children: (requestPayment: () => void) => ReactNode;
  paymentMethodData: Array<PaymentMethodData>;
  paymentDetails: PaymentDetailsInit;
} & PaymentRequestEvents;

interface PaymentRequestEvents {
  onMerchantValidation: (event: ApplePayMerchantValidationEvent) => void;
}

export function ApplePay({
  scriptUrl = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js",
  merchantIdentifier,
  onMerchantValidation,
  onLoad,
  onError,
  paymentMethodData,
  paymentDetails,
  children,
}: ApplePayProps): ReactNode {
  // No need to check loading state as we use suspense/error boundary to handle it
  useLoadSuspenseScript({ src: scriptUrl, throwError: true });

  const handleApplePayButtonClick = async () => {
    console.log("onApplePayButtonClicked");
    // Consider falling back to Apple Pay JS if Payment Request is not available.
    if (!PaymentRequest) {
      return;
    }

    try {
      // Define PaymentDetails
      // Define PaymentOptions
      const paymentOptions = {
        requestPayerName: false,
        requestPayerEmail: false,
        requestPayerPhone: false,
        requestShipping: false,
        shippingType: "shipping",
      } satisfies PaymentOptions;

      // Create PaymentRequest
      const request = new PaymentRequest(
        paymentMethodData,
        paymentDetails,
        paymentOptions
      ) as ApplePayPaymentRequest;

      // Cast the request to ApplePayPaymentRequest to access onmerchantvalidation
      request.onmerchantvalidation = (
        event: ApplePayMerchantValidationEvent
      ) => {
        onMerchantValidation?.(event);
      };

      const response = await request.show();

      const status = "success";
      await response.complete(status);
    } catch (e) {
      // Handle errors
    }
  };

  return children(handleApplePayButtonClick);
}

/**
 * Apple Pay Button that uses the built-in Apple Pay custom element
 * Pretty much always use this as you also get the modal on non-Apple devices
 */
export function ApplePayButton({
  buttonProps,
  onClick,
}: {
  buttonProps?: ApplePayButtonProps;
  onClick: () => void;
}): ReactNode {
  // Callback ref to handle Apple Pay button click
  // Normal useRef doesn't work with custom elements it seems
  const buttonRef = (element: HTMLElement | null) => {
    if (element) {
      element.addEventListener("click", onClick);
    }

    return () => {
      if (element) {
        element.removeEventListener("click", onClick);
      }
    };
  };

  return <apple-pay-button {...buttonProps} ref={buttonRef} />;
}
