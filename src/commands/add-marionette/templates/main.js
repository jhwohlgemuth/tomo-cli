/* eslint-env browser */
/**
 * Main entry point for application
 */
import app from './components/app';

document.addEventListener('DOMContentLoaded', () => app.start({name: 'My Tomo App'}));
