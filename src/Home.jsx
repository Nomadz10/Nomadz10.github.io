import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "./assets/styles/index.css"; // Your custom CSS
import "./assets/styles/globe.css"; // Globe-specific styling
import "./assets/styles/navbar.css"; // Globe-specific styling
import Header from './Header'; // Import the Header component
import InteractiveGlobe from './Globe'; // Import the Globe component
import SentAnal from "./SentAnal";
import { useSpring, animated, useTrail } from 'react-spring'; // For animations
import { useNavigate } from 'react-router-dom'; // For navigation

const Home = () => {
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [lastHoveredCountry, setLastHoveredCountry] = useState(null); // New state to track the last hovered country
    const [typingComplete, setTypingComplete] = useState(false); // State to track if typing animation is done
    const [typedText, setTypedText] = useState(""); // State to store the progressively typed text
    const [hoverKey, setHoverKey] = useState(0);
    const typingSpeed = 20; // Speed of the typing effect in milliseconds per character
    const [currentLineIndex, setCurrentLineIndex] = useState(0); // To track current line being typed
    const navigate = useNavigate(); // For navigation
    const [isSmallScreen, setIsSmallScreen] = useState(false); // State to track screen size

    const initialText = `Hello! \nHover over the highlighted\ncountries on the interactive \nglobe to learn more about me! \nOr click on one of my projects \non the right to explore my work!`;

    // Split the initial text into lines
    const lines = initialText.split('\n');

    useEffect(() => {
        // Handle the typing effect line by line
        if (currentLineIndex < lines.length) {
            const line = lines[currentLineIndex]; // Get the current line
            let index = 0;

            const typeInterval = setInterval(() => {
                if (index < line.length) {
                    setTypedText((prevText) => prevText + line[index]); // Append characters to the text
                    index++;
                } else {
                    clearInterval(typeInterval); // Stop the interval when the line is fully typed
                    setTypedText((prevText) => prevText + '\n'); // Add a newline once the line is fully typed
                    setCurrentLineIndex(currentLineIndex + 1); // Move to the next line
                }
            }, typingSpeed);

            return () => clearInterval(typeInterval); // Cleanup interval on unmount or change
        } else {
            setTypingComplete(true); // Mark typing as complete after all lines are typed
        }
    }, [currentLineIndex]);

    // Information about the highlighted countries
    const countryInfo = {
        'United States of America': {
            title: 'United States of America',
            description: 'Information about the USA.',
        },
        India: {
            title: 'India',
            description: 'Information about India.',
        },
        China: {
            title: 'China',
            description: 'Information about China.',
        },
        'United Kingdom': {
            title: 'United Kingdom',
            description: 'Information about the UK.',
        },
    };

    useEffect(() => {
        if (hoveredCountry && typingComplete) {
            setLastHoveredCountry(hoveredCountry);
            setHoverKey((prev) => prev + 1); // Increment hoverKey to force re-render and reset animation
        }
    }, [hoveredCountry, typingComplete]); // Only update when typingComplete is true

    // Animation for the info card
    const cardAnimation = useSpring({
        opacity: hoveredCountry ? 1 : 0,
        transform: hoveredCountry
            ? `translateY(0) rotateY(35deg)` // Tilt the card by rotating along Y-axis
            : `translateY(10px) rotateY(15deg)`,
        config: { tension: 220, friction: 120 },
        reset: true, // Reset animation on each hover
        immediate: !hoveredCountry, // This ensures immediate reset when country is null
    });

    // Use the last hovered country or fallback to hovered country
    const activeCountry = hoveredCountry || lastHoveredCountry;

    const countryOffsets = {
        'United States of America': 0, // Start from the beginning for USA
        India: 4, // Start from the second image for India
        China: 8, // Start from the third image for China
        'United Kingdom': 12, // Start from the beginning for the UK
    };

    // Use the last hovered country's offset if there's no current hover
    const imageOffset = activeCountry ? countryOffsets[activeCountry] || 0 : 0;

    const randomImages = [
        'usa1.jpg',
        'usa2.jpg',
        'webpic1.jpg',
        'webpic2.jpg',
        'india1.jpg',
        'india2.jpg',
        'india3.jpg',
        'india4.jpg',
        'china1.jpg',
        //'china2.jpg',
        'micpic.jpg',
        'china3.jpg',
        'china4.jpg',
        'uk1.jpg',
        'uk2.jpg',
        'uk3.jpg',
        'uk4.jpg',
    ];

    const getRandomStyle = (index) => {
        const zones = [
            { left: `${Math.random() * 50}px`, top: `${Math.random() * 150 + 400}px` },
            { left: `${Math.random() * 50 + 250}px`, top: `${Math.random() * 150 + 400}px` },
            { left: `${Math.random() * 200}px`, top: `${Math.random() * 100 + 100}px` },
            { left: `${Math.random() * 200 + 250}px`, top: `${Math.random() * 100 + 100}px` },
        ];

        const zone = zones[index % zones.length];

        return {
            ...zone,
            transform: `rotate(${Math.random() * 30 - 15}deg)`,
            zIndex: Math.floor(Math.random() * 2),
        };
    };

    const trail = useTrail(4, {
        opacity: hoveredCountry ? 1 : 0,
        transform: hoveredCountry ? `scale(1)` : `scale(0.3)`,
        config: { tension: 180, friction: 20 },
    });


    const projectCards = [
        {
            id: 1,
            title: 'Convolutional Neural Networks',
            description: 'A Unique tool that helps users experiment with how convolution is used and how it effects images.',
            image: 'img.png',
            link: '/ConvolutionTool',
        },
        {
            id: 2,
            title: 'Autonomous Delivery Robots',
            description: 'Conducted a sentiment Analysis using twitter data regarding the acceptance of Autonomous Delivery Robots',
            image: 'homerobo.png',
            link: '/SentAnal.jsx',
        },

    ];

    // Handler for card click
    const handleCardClick = (link) => {
        navigate(link);
    };

    // State to track screen size
    useEffect(() => {
        // Function to check screen size
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        // Initial check
        checkScreenSize();

        // Add event listener on resize
        window.addEventListener('resize', checkScreenSize);

        // Clean up the event listener
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div>
            <Header />
            <main className="main-container">
                <div className="globe-content-area">
                    {/* Text Section */}
                    <div className="text-section">
                        {!isSmallScreen && hoveredCountry ? (
                            // Only show random images on larger screens
                            trail.map((style, index) => (
                                <animated.img
                                    key={index + imageOffset}
                                    src={randomImages[index + imageOffset]}
                                    alt={`random-img-${index}`}
                                    className="random-img"
                                    style={{ ...style, ...getRandomStyle(index + imageOffset) }}
                                />
                            ))
                        ) : (
                            <div className="text-container">
                                <pre>{typedText}</pre> {/* Render the progressively typed text */}
                            </div>
                        )}

                        {/* Information Card - Adjusted for small screens */}
                        {(hoveredCountry || (isSmallScreen && lastHoveredCountry)) && (
                            <div className={`info-card-wrapper ${isSmallScreen ? 'small-screen' : ''}`}>
                                <animated.div
                                    key={`${hoveredCountry || lastHoveredCountry}-${hoverKey}`} // Unique key to force re-render
                                    style={cardAnimation}
                                    className="info-card glassmorphism"
                                >
                                    <h2>{countryInfo[hoveredCountry || lastHoveredCountry].title}</h2>
                                    <hr />
                                    <p>{countryInfo[hoveredCountry || lastHoveredCountry].description}</p>
                                </animated.div>
                            </div>
                        )}
                    </div>

                    {/* Globe Section */}
                    <div className="globe-section">
                        <div className="globe-container">
                            <InteractiveGlobe  onCountryHover={(country) => {
                                if (typingComplete) {
                                    setHoveredCountry(country);
                                }
                            }} />
                            <div className="globe-base">
                                <div className="globe-base-glow"></div>
                            </div>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="projects-section">
                        {projectCards.map((project) => (
                            <div
                                key={project.id}
                                className="project-card"
                                onClick={() => handleCardClick(project.link)}
                                style={{ backgroundImage: `url(${project.image})` }} // Set the background image
                            >
                                <div className="card-content">
                                    <h3 className="project-title">{project.title}</h3>
                                    <p className="project-description">{project.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
