import React from 'react';
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Home'; // Home component
import ConvolutionTool from './ConvolutionTool'; // Convolution Tool component
import SentAnal from "./SentAnal";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} /> {/* Home page */}
                <Route path="/ConvolutionTool" element={<ConvolutionTool />} /> {/* Convolution Tool page */}
                <Route path="/SentAnal.jsx" element={<SentAnal />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
