if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

if (typeof URL.parse === 'undefined') {
  URL.parse = function (url, base) {
    try {
      return new URL(url, base);
    } catch (e) {
      return null;
    }
  };
}

// Dynamically import the standard worker from CDN
// Updated to match API version 5.4.296
await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs");