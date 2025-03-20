const promise: Promise<void> | null = null;

const scriptCache = new Map<
  string,
  {
    status: "pending" | "loaded" | "error";
    promise: Promise<void> | null;
  }
>();

/**
 * Load script and suspend until it's loaded
 * @param src - The source of the script to load
 * @returns `true` if the script is loaded, `false` if it's not
 */
export function useLoadSuspenseScript(src: string): boolean {
  if (!scriptCache.has(src)) {
    scriptCache.set(src, {
      status: "pending",
      promise: null,
    });
  }

  // biome-ignore lint/style/noNonNullAssertion: We already checked for the existence of the script
  const cache = scriptCache.get(src)!;

  if (!cache.promise) {
    cache.promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        cache.status = "loaded";
        resolve();
      };
      script.onerror = () => {
        cache.status = "error";
        reject(new Error("Failed to load script"));
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

  return false;
}
