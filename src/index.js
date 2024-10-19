import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.css'; // Load global styles
import App from './App'; // Main app component

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
