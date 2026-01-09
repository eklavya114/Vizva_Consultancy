
/**
 * CTS Frontend Entry Point
 * Initializes the React 19 application and mounts it to the DOM.
 * StrictMode is enabled for development-time safety checks.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  // Critical failure if DOM is not ready
  throw new Error("Initialization Failed: Root element not found.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
