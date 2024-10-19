// globe.jsx
import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import "./assets/styles/globe.css"; // Globe-specific styling

const InteractiveGlobe = ({ onCountryHover, onCountryClick }) => {
    const globeEl = useRef();

    useEffect(() => {
        // Auto-rotate the globe
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 5.0; // Adjust rotation speed as needed

        // Disable zoom and pan to fix the globe size
        globeEl.current.controls().enableZoom = false;
        globeEl.current.controls().enablePan = false;

        // Set initial camera position to tilt towards the northern hemisphere
        globeEl.current.pointOfView(
            {
                lat: 30,   // Latitude for the camera to look at
                lng: 0,    // Longitude for the camera to look at
                altitude: 2.0, // Distance from the globe surface (default is 1.5)
            },
            0 // Duration of transition to new point of view (0 for immediate)
        );

        // Create a full-screen solar system background
        const createSolarSystemBackground = () => {
            const scene = globeEl.current.scene();

            // Add a large sphere for space background
            const loader = new THREE.TextureLoader();
            loader.load('/textures/space.jpg', (texture) => {
                const spaceGeometry = new THREE.SphereGeometry(1000, 64, 64);
                const spaceMaterial = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.BackSide, // Render inside of sphere
                });
                const spaceMesh = new THREE.Mesh(spaceGeometry, spaceMaterial);
                scene.add(spaceMesh);
            });
        };

        // Initialize solar system background
        createSolarSystemBackground();
    }, []);

    // Load GeoJSON data
    const [countries, setCountries] = useState({ features: [] });

    useEffect(() => {
        fetch('/ne_110m_admin_0_countries.geojson')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setCountries(data);
            })
            .catch((err) => {
                console.error('Error loading GeoJSON data:', err);
            });
    }, []);

    const highlightedCountries = ['United States of America', 'India', 'China', 'United Kingdom'];

    return (
        <div className="globe-component-container"> {/* Updated class name */}
            <Globe
                ref={globeEl}
                width={500} // Adjust size as needed
                height={500}
                backgroundColor="rgba(0, 0, 0, 0)" // Transparent background
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                polygonsData={countries.features}
                polygonCapColor={(polygon) => {
                    const countryName = polygon?.properties?.ADMIN;
                    if (countryName && highlightedCountries.includes(countryName)) {
                        return 'rgba(72,255,0,0.62)'; // Highlighted countries in green
                    } else {
                        return 'rgba(89,87,87,0.6)'; // Other countries in light gray
                    }
                }}
                polygonSideColor={() => 'rgba(0,0,0,0.11)'}
                polygonStrokeColor={() => 'rgba(16,16,16,0.43)'}
                onPolygonHover={(polygon) => {
                    // Stop rotation when hovering over a country
                    globeEl.current.controls().autoRotate = !polygon;
                    const countryName = polygon?.properties?.ADMIN;
                    if (countryName && highlightedCountries.includes(countryName)) {
                        onCountryHover(countryName);
                    } else {
                        onCountryHover(null);
                    }
                }}
                onPolygonClick={(polygon) => {
                    // Handle click events for touch devices
                    const countryName = polygon?.properties?.ADMIN;
                    if (countryName && highlightedCountries.includes(countryName)) {
                        onCountryClick(countryName);
                    } else {
                        onCountryClick(null);
                    }
                }}
                polygonsTransitionDuration={300}
                polygonLabel={({ properties: d }) => `${d.ADMIN}`}
            />
        </div>
    );
};

export default InteractiveGlobe;
