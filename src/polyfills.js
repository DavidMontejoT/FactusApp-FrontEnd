// Polyfills para React Native Web en el navegador

// __DEV__ polyfill para React Native
if (typeof window.__DEV__ === 'undefined') {
  window.__DEV__ = true;
}

// Also define it on global for compatibility
if (typeof global !== 'undefined' && typeof global.__DEV__ === 'undefined') {
  global.__DEV__ = true;
}

// requestAnimationFrame polyfill
if (typeof window.requestAnimationFrame === 'undefined') {
  window.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 16);
  };
}

if (typeof window.cancelAnimationFrame === 'undefined') {
  window.cancelAnimationFrame = (id) => {
    clearTimeout(id);
  };
}

// scrollTo polyfill
if (typeof window.scrollTo === 'undefined') {
  window.scrollTo = (x, y) => {
    window.document.body.scrollTop = y;
    window.document.documentElement.scrollTop = y;
  };
}

// Performance.now polyfill
if (typeof window.performance === 'undefined') {
  window.performance = {};
}
if (typeof window.performance.now === 'undefined') {
  window.performance.now = Date.now;
}
