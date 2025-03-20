import { type ReactNode, useEffect, useState } from "react";
import { useLoadSuspenseScript } from "./use-load-suspense-script";

export function ApplePayProvider(): ReactNode {
  return <div>ApplePayProvider</div>;
}

/**
 * Loads the Apple Pay SDK script from the given source.
 * Default endpoint is https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js
 * @param source
 * @returns
 */
export function useApplePayScript(
  source = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js"
): { isLoaded: boolean } {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // Check if the script is already loaded
    if (!document.querySelector('script[src*="apple-pay-sdk.js"]')) {
      const script = document.createElement("script");
      script.src =
        "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";
      script.crossOrigin = "anonymous";

      // Handle loading errors
      script.onerror = () => {
        console.error("Failed to load Apple Pay SDK");
      };

      document.head.appendChild(script);
    }
  }, []);

  return {
    isLoaded,
  };
}

interface ApplePayProps {
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
  buttonProps: ApplePayButtonProps;
}

function applePayIsAvailable(): boolean {
  return window.ApplePaySession && typeof window.ApplePaySession === "function";
}

export function ApplePay({
  scriptUrl = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js",
  merchantIdentifier,
  onLoad,
  onError,
  buttonProps = {
    buttonstyle: "black",
    type: "plain",
    locale: "en-US",
  },
}: ApplePayProps): ReactNode {
  // No need to check loading state as we use suspense/error boundary to handle it
  useLoadSuspenseScript(scriptUrl);

  // State to track if Apple Pay SDK is loaded
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(
    applePayIsAvailable()
  );

  // Check if Apple Pay SDK is loaded
  useEffect(() => {
    if (applePayIsAvailable()) {
      setIsApplePayAvailable(true);
    }

    // Set up event listener for script load
    const handleScriptLoad = () => {
      if (applePayIsAvailable()) {
        setIsApplePayAvailable(true);
      }
    };

    // Add event listener to the script
    const script = document.querySelector(`script[src="${scriptUrl}"]`);
    if (script) {
      script.addEventListener("load", handleScriptLoad);
    }
    return () => {
      if (script) {
        script.removeEventListener("load", handleScriptLoad);
      }
    };
  }, [scriptUrl]);

  const handleApplePayButtonClick = async () => {
    console.log("onApplePayButtonClicked");
    // Consider falling back to Apple Pay JS if Payment Request is not available.
    if (!PaymentRequest) {
      return;
    }

    try {
      // Define PaymentMethodData
      const paymentMethodData = [
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
      ];
      // Define PaymentDetails
      const paymentDetails = {
        total: {
          label: "Demo (Card is not charged)",
          amount: {
            value: "27.50",
            currency: "USD",
          },
        },
      };
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
      );

      const response = await request.show();
      const status = "success";
      await response.complete(status);
    } catch (e) {
      // Handle errors
    }
  };

  if (!isApplePayAvailable) {
    // TODO: Show disabled button
    return <div>Apple Pay is not available</div>;
  }

  // Callback ref to handle Apple Pay button click
  // Normal useRef doesn't work with custom elements it seems
  const buttonRef = (element: HTMLElement | null) => {
    if (element) {
      element.addEventListener("click", handleApplePayButtonClick);
    }

    return () => {
      if (element) {
        element.removeEventListener("click", handleApplePayButtonClick);
      }
    };
  };

  return <apple-pay-button ref={buttonRef} {...buttonProps} />;
}
