import { initApp } from './app.js';
import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initApp();
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
});

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});
