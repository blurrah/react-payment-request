const scriptCache = new Map<
  string,
  {
    status: "pending" | "loaded" | "error";
    promise: Promise<void> | null;
    error?: Error;
  }
>();

/**
 * Load script and suspend until it's loaded
 *
 * Uses a central script cache as to not load the same script multiple times
 * it's unique per script source.
 * @param src - The source of the script to load
 * @param throwError - Whether to throw an error to be catched by an error boundary
 * @returns `true` if the script is loaded, `false` if it's not as a possible fallback
 * @throws Error if `throwError` is `true` and the script fails to load
 * @example
 * ```tsx
 * function Component() {
 *   const isLoaded = useLoadSuspenseScript({
 *     src: "https://apple-pay-sdk.cdn.apple.com/jsapi/1.notlatest/apple-pay-sdk.js",
 *     throwError: true
 *   });
 *
 *   return <div>Loaded: {isLoaded.toString()}</div>;
 * }
 * <Suspense fallback={<div>Loading...</div>}>
 *   <ErrorBoundary fallback={<div>Error</div>}>
 *     <Component />
 *   </ErrorBoundary>
 * </Suspense>
 */
export function useLoadSuspenseScript({
  // The source of the script to load
  src,
  // Whether to throw an error to be catched by an error boundary
  throwError = false,
}: {
  src: string;
  throwError?: boolean;
}): boolean {
  if (!scriptCache.has(src)) {
    scriptCache.set(src, {
      status: "pending",
      promise: null,
    });
  }

  // biome-ignore lint/style/noNonNullAssertion: We already checked for the existence of the script
  const cache = scriptCache.get(src)!;

  console.log("cache", cache);

  if (!cache.promise) {
    cache.promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        cache.status = "loaded";
        resolve();
      };
      script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
        const error = new Error(`Failed to load script: ${src}`);
        cache.status = "error";
        cache.error = error;
        reject(error);
      };

      document.body.appendChild(script);
    });
  }

  if (cache.status === "pending") {
    // Throw promise to suspend
    throw cache.promise;
  }

  if (cache.status === "loaded") {
    return true;
  }

  if (throwError) {
    throw cache.error;
  }

  // Failed to load the script and not throwing an error
  return false;
}
