/**
 * Main entry point for application
 */
import app from './components/app';

const options = {
    name: 'My Tomo App'
};
document.addEventListener('DOMContentLoaded', () => app.start(options));
