/// <reference types="@types/applepayjs" />
import type { ReactNode } from "react";
import { useLoadSuspenseScript } from "./use-load-suspense-script.ts";

type ApplePayProps = {
  /**
   * The URL of the Apple Pay SDK script.
   * This is used to construct the Apple Pay button
   * @default https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js
   */
  scriptUrl?: string;
  onMerchantValidation?: (event: ApplePayMerchantValidationEvent) => void;
  children: (
    paymentRequest: () => ApplePayPaymentRequest | undefined
  ) => ReactNode;
  paymentMethodData: Array<PaymentMethodData>;
  paymentDetails: PaymentDetailsInit;
  paymentOptions?: PaymentOptions;
} & PaymentRequestEvents;

interface PaymentRequestEvents {
  onMerchantValidation: (event: ApplePayMerchantValidationEvent) => void;
  onPaymentMethodChange: (event: PaymentMethodChangeEvent) => void;
  onShippingAddressChange: (event: PaymentRequestUpdateEvent) => void;
  onShippingOptionChange: (event: PaymentRequestUpdateEvent) => void;
}

export function ApplePay({
  scriptUrl = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js",
  onMerchantValidation,
  onPaymentMethodChange,
  onShippingAddressChange,
  onShippingOptionChange,
  paymentMethodData,
  paymentDetails,
  paymentOptions,
  children,
}: ApplePayProps): ReactNode {
  // No need to check loading state as we use suspense/error boundary to handle it
  useLoadSuspenseScript({ src: scriptUrl, throwError: true });

  /**
   * Request payment from Apple Pay using the Payment Request API
   *
   * This returns the payment request after setting up the event handlers
   * so you'll manually need to call show() and complete() in the caller
   *
   * @example
   * <ApplePay>
   *  {request => <button onClick={() => request.show()}>Pay</button>}
   * </ApplePay>
   */
  const paymentRequest = () => {
    // Consider falling back to Apple Pay JS if Payment Request is not available.
    if (!PaymentRequest) {
      return;
    }

    // Create PaymentRequest
    const paymentRequest = new PaymentRequest(
      paymentMethodData,
      paymentDetails,
      paymentOptions
    ) as ApplePayPaymentRequest;

    paymentRequest.addEventListener("merchantvalidation", (event) => {
      // This event does not exist in base payment request API
      // but gets added by Apple Pay JS
      onMerchantValidation?.(event as ApplePayMerchantValidationEvent);
    });

    paymentRequest.addEventListener("paymentmethodchange", (event) => {
      onPaymentMethodChange?.(event);
    });

    paymentRequest.addEventListener("shippingaddresschange", (event) => {
      onShippingAddressChange?.(event);
    });

    paymentRequest.addEventListener("shippingoptionchange", (event) => {
      onShippingOptionChange?.(event);
    });

    return paymentRequest;
  };

  return children(paymentRequest);
}

/**
 * Apple Pay Button that uses the built-in Apple Pay custom element
 * Pretty much always use this as you also get the modal on non-Apple devices
 */
export function ApplePayButton({
  buttonProps,
  onClick,
  "data-testid": testId,
}: {
  buttonProps?: ApplePayButtonProps;
  /**
   * Used as fallback for testing as no text or roles are rendered
   * by default.
   */
  "data-testid"?: string;
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

  return (
    <apple-pay-button {...buttonProps} data-testid={testId} ref={buttonRef} />
  );
}
