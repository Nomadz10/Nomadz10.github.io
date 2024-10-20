import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ConvolutionTool from './ConvolutionTool';
import SentAnal from './SentAnal';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ConvolutionTool" element={<ConvolutionTool />} /> {/* Custom URL */}
                <Route path="/SentAnal.jsx" element={<SentAnal />} /> {/* Custom URL */}
            </Routes>
        </Router>
    );
};

export default App;