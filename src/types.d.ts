// Extend JSX.IntrinsicElements to add the apple-pay-button web component
declare global {
  declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "apple-pay-button": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            buttonstyle?: "black" | "white" | "white-outline";
            type?:
              | "plain"
              | "buy"
              | "donate"
              | "checkout"
              | "book"
              | "subscribe";
            locale?: string;
          },
          HTMLElement
        >;
      }
    }
  }
}
