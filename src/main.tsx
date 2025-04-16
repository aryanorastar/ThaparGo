import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Create a root
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);

// Render the app
root.render(<App />);
