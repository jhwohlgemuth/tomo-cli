/**
 * Main entry point for application
 */
import {render} from 'react-dom';
import App from './components/App.jsx';

const name = 'My tomo application';
const root = document.getElementById('root');

render(<App name={name} />, root);