// Extend JSX.IntrinsicElements to add the apple-pay-button web component
type ApplePayButtonProps = {
  /**
   * The style of the Apple Pay button.
   * @default "black"
   */
  buttonstyle?: "black" | "white" | "white-outline";
  /**
   * The type of the Apple Pay button.
   */
  type?:
    | "plain"
    | "continue"
    | "add-money"
    | "book"
    | "buy"
    | "check-out"
    | "contribute"
    | "donate"
    | "order"
    | "pay"
    | "reload"
    | "rent"
    | "set-up"
    | "subscribe"
    | "support"
    | "tip"
    | "top-up";
  /**
   * The locale/language of the Apple Pay button.
   *
   * You can set this separate from the payment options
   * as payment locale might not align 1-1 with the button you want to show.
   * @default "en-US"
   */
  locale?: string;
};

declare global {
  declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "apple-pay-button": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & ApplePayButtonProps,
          HTMLElement
        >;
      }
    }
  }
}
