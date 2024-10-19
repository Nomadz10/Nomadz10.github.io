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
                <Route path="/convolution-tool" element={<ConvolutionTool />} /> {/* Custom URL */}
                <Route path="/autonomous-delivery-robots" element={<SentAnal />} /> {/* Custom URL */}
            </Routes>
        </Router>
    );
};

export default App;