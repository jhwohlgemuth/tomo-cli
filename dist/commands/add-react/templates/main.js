/**
 * Main entry point for application
 */
import React from 'react';
import {render} from 'react-dom';
import App from './components/App.jsx';

const name = 'My tomo application';
const root = document.getElementById('root');

render(<App name={name} />, root);

if (module.hot) {
    module.hot.accept(() => {
        render(<App name={name} />, root);
    });
}