import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ConvolutionTool from './ConvolutionTool';
import SentAnal from './SentAnal';
import Header from './Header';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ConvolutionTool" element={<ConvolutionTool />} />
                <Route path="/SentAnal.jsx" element={<SentAnal />} />
            </Routes>
        </Router>
    );
};

export default App;