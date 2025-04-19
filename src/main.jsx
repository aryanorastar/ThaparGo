if (typeof window.session === 'undefined') {
  window.session = {};
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('Checking root element:', document.getElementById('root'));

const hydrateCheck = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('FATAL: Could not find root element');
    document.body.innerHTML = '<h1 style="color:red">Error: Missing root element</h1>';
    return;
  }
  
  if (rootElement._reactRootContainer) {
    console.log('React already hydrated');
    rootElement.innerHTML += '<div style="position:fixed;top:0;left:0;background:red;color:white;z-index:9999">DUPLICATE HYDRATION</div>';
  }
};

hydrateCheck();

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (!root) {
    document.body.innerHTML = '<h1 style="color:red;padding:20px">CRITICAL ERROR: Missing root element</h1>';
  } else {
    console.log('Root element found:', root);
    root.innerHTML += '<div style="position:fixed;top:10px;left:10px;background:red;color:white;padding:10px;z-index:9999">DOM Loaded</div>';
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('FATAL: Could not find root element');
  document.body.innerHTML = '<h1 style="color:red">Error: Missing root element</h1>';
} else {
  const debugStyle = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: 'white',
    padding: '10px',
    zIndex: 9999
  };

  const DebugInfo = () => (
    <div style={debugStyle}>
      <p>React Mounted: {new Date().toLocaleTimeString()}</p>
    </div>
  );

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
      <div style={{position:'fixed',bottom:0,right:0,background:'black',color:'white',padding:'10px',zIndex:9999}}>
        React Hydrated: {new Date().toLocaleTimeString()}
      </div>
    </React.StrictMode>
  );
  console.log('React mounted successfully');
}

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    console.error('Caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Check console for details.</h1>;
    }
    return this.props.children;
  }
}
