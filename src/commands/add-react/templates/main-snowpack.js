/**
 * Main entry point for application
 */
import React from 'react';
import {render} from 'react-dom';
import App from './components/App';

const name = 'My tomo application';
const root = document.getElementById('root');

render(<App name={name} />, root);

if (import.meta.hot) {
    import.meta.hot.accept();
}