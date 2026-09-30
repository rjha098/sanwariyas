// FILE: client/src/lib/cashfree.js
// Loads Cashfree's checkout script once and returns a ready-to-use
// `cashfree` instance. Safe to call this multiple times — the script tag
// and SDK instance are only created the first time.

let sdkLoadPromise = null;

const loadScript = () =>
  new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load payment SDK. Check your connection."));
    document.body.appendChild(script);
  });

export const getCashfree = async () => {
  if (typeof window === "undefined") {
    throw new Error("Cashfree checkout can only run in the browser.");
  }
  if (!sdkLoadPromise) {
    sdkLoadPromise = loadScript();
  }
  await sdkLoadPromise;

  const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
  return window.Cashfree({ mode });
};

// Redirects the browser to Cashfree's hosted checkout page for this
// payment session. The browser comes back to our own return_url once the
// customer finishes (success or failure) — actual confirmation always
// comes from the server, never from this redirect alone.
export const redirectToCashfreeCheckout = async (paymentSessionId) => {
  const cashfree = await getCashfree();
  return cashfree.checkout({
    paymentSessionId,
    redirectTarget: "_self",
  });
};