import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import './styles.css';
const Dashboard = () => {
  const [sliderValue, setSliderValue] = useState(100);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedColorNum, setSelectedColorNum] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState('Pattern');
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const mapRef = useRef(null);
  const buttonRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [clickedMarkerColor, setClickedMarkerColor] = useState(null);
  const markerRef = useRef(null);
  const [selectedFrequency, setSelectedFrequency] = useState('Frequency');
  const [selectedPatternNum, setSelectedPatternNum] = useState(0);
  const [selectedFrequencyNum, setSelectedFrequencyNum] = useState(0);
  const [brightnessLevel, setBrightnessLevel] = useState(0);
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  const loadMap = () => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API is not loaded.');
      return;
    }
  
    try {
      const position = { lat: 18.262550, lng: -66.656294 };
      const mapOptions = {
        zoom: 13.5,
        center: position,
      };
  
      const newMap = new window.google.maps.Map(mapRef.current, {
        ...mapOptions,
        key: GOOGLE_MAPS_API_KEY,
      });
  
      const marker = new window.google.maps.Marker({
        position: position,
        map: newMap,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: localStorage.getItem('clickedMarkerColor') || '#FFFFFF',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 8,
        }
      });
  
      marker.addListener('click', () => {
        if (clickedMarkerColor === selectedColor) {
          clearMarker();
        } else {
          setClickedMarkerColor(selectedColor);
          updateMarkerIcon(marker, selectedColor);
        }
      });
  
      markerRef.current = marker;
      setMap(newMap);
    } catch (error) {
      console.error('Error loading map:', error);
    }
  };
  
  window.initMap = () => {
    loadMap();
  };
  useEffect(() => {
    const handleTouchStart = (event) => {
      event.target.classList.add('touched'); // Add a class to indicate touch
    };
    const handleTouchEnd = (event) => {
      event.target.classList.remove('touched'); // Remove the touch class
      event.target.click(); // Trigger the button click
    };
    // Add touch event listeners to all buttons
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('touchstart', handleTouchStart);
      button.addEventListener('touchend', handleTouchEnd);
    });
    // Cleanup: Remove event listeners when the component unmounts
    return () => {
      document.querySelectorAll('button').forEach((button) => {
        button.removeEventListener('touchstart', handleTouchStart);
        button.removeEventListener('touchend', handleTouchEnd);
      });
    };
  }, []); // Empty dependency array means this useEffect runs once when the component mounts
  useEffect(() => {
    document.documentElement.style.setProperty('--selected-color', selectedColor);
  }, [selectedColor]);
  useEffect(() => {
    window.componentHandler.upgradeAllRegistered();
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target) && displayColorPicker) {
        setDisplayColorPicker(false);
      }
    };

    console.log(process.env);
    console.log('API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    console.log('API Key:', GOOGLE_MAPS_API_KEY);

    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is not provided.");
      return;
    }
    window.addEventListener('click', handleClickOutside);
    // Check if Google Maps API script is already loaded
    if (!window.google || !window.google.maps) {
      const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          console.error('Error loading Google Maps API.');
        };
        document.head.appendChild(script);
      } else {
        // Wait for the Google Maps API to load
        existingScript.addEventListener('load', () => {
          loadMap();
        });
      }
    } else {
      loadMap();
    }
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [selectedColor, displayColorPicker, clickedMarkerColor]);
  const clearMarker = () => {
  const marker = markerRef.current;
  if (marker) {
    setClickedMarkerColor(null);
    marker.setIcon({
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: '#FFFFFF',
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 10,
    });
    localStorage.removeItem('clickedMarkerColor');
  }
};
const updateMarkerIcon = (marker, color) => {
  if (marker && window.google && window.google.maps) { // Check if marker and google maps are loaded
    marker.setIcon({
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 10,
    });
    localStorage.setItem('clickedMarkerColor', color);
  }
};
  const handleClick = (event) => {
    event.stopPropagation();
    setDisplayColorPicker(!displayColorPicker);
  };
  const handleColorClick = (color) => {
    setSelectedColor(color);
    const colorNum = getColorNum(color); // Get color number based on color
    setSelectedColorNum(colorNum); // Update color number state
    console.log(`Selected Color Number: ${colorNum}`); // Log color number
    setDisplayColorPicker(false);
  };
  const getColorNum = (color) => {
    const colorMap = {
      '#FF0303': 1,
      '#E91E63': 2,
      '#9C27B0': 3,
      '#673AB7': 4,
      '#3F51B5': 5,
      '#2196F3': 6,
      '#03A9F4': 7,
      '#00BCD4': 8,
      '#009688': 9,
      '#4CAF50': 10,
      '#8BC34A': 11,
      '#CDDC39': 12,
      '#FFEB3B': 13,
      '#FFC107': 14,
      '#FF9800': 15,
      '#FF5722': 16,
      '#795548': 17,
      '#607D8B': 18,
      '#FF5252': 19,
      '#FF4081': 20,
      '#8E24AA': 21,
      '#512DA8': 22,
      '#303F9F': 23,
      '#1976D2': 24,
      '#0288D1': 25,
      '#0097A7': 26,
      '#00796B': 27,
      '#388E3C': 28,
      '#7CB342': 29,
      '#C0CA33': 30,
      '#FFD600': 31,
      '#FF6F00': 32,
    };
    return colorMap[color] || 0; // Return color number or 0 if color not found
  };
  const handleSliderChange = (value) => {
    setSliderValue(value);
    const brightnessLevelNum = getBrightnessLevelNum(value); // Get brightness level number based on slider value
    setBrightnessLevel(brightnessLevelNum); // Update brightness level state
    console.log(`Selected Brightness Level: ${brightnessLevelNum}`); // Log brightness level number
    const updatedColor = adjustBrightness(selectedColor, value);
    document.documentElement.style.setProperty('--brightness', `${value}%`);
    buttonRef.current.style.backgroundColor = updatedColor;
  };
  const getBrightnessLevelNum = (value) => {
    const brightnessMap = {
      0: 1,
      25: 2,
      50: 3,
      75: 4,
      100: 5,
    };
    return brightnessMap[value] || 0; // Return brightness level number or 0 if value not found
  };
  
  const adjustBrightness = (color, value) => {
    const match = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) return color;
  
    let [, r, g, b] = match.map((c) => parseInt(c, 16));
  
    const brightness = value / 100;
    r = Math.round(r * brightness);
    g = Math.round(g * brightness);
    b = Math.round(b * brightness);
  
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  const handleBrightnessSnap = (value) => {
    const snappedValue = Math.round(value / 25) * 25;
    setSliderValue(snappedValue);
    handleSliderChange(snappedValue);
  };
    const handlePatternSelect = (pattern) => {
    setSelectedPattern(pattern);
    const patternNum = getPatternNum(pattern); // Get pattern number based on pattern
    setSelectedPatternNum(patternNum); // Update pattern number state
    console.log(`Selected Pattern Number: ${patternNum}`); // Log pattern number
  };
  const getPatternNum = (pattern) => {
    const patternMap = {
      'Blink': 1,
      'Fade Up': 2,
      'Fade Down': 3,
      'Pulse': 4,
      'Strobe': 5,
      'Random': 6,
      'No Pattern': 7,
    };
    return patternMap[pattern] || 0; // Return pattern number or 0 if pattern not found
  };
   const handleFrequencySelect = (frequency) => {
    setSelectedFrequency(frequency);
    const frequencyNum = getFrequencyNum(frequency); // Get frequency number based on frequency
    setSelectedFrequencyNum(frequencyNum); // Update frequency number state
    console.log(`Selected Frequency Number: ${frequencyNum}`); // Log frequency number
  };
  const getFrequencyNum = (frequency) => {
    const frequencyMap = {
      'X1': 1,
      'X2': 2,
      'X3': 3,
      'X4': 4,
    };
    return frequencyMap[frequency] || 0; // Return frequency number or 0 if frequency not found
  };
  const handleDeploy = async () => {
    const data = {
      selectedColorNum: selectedColorNum,
      selectedPatternNum: selectedPatternNum,
      brightnessLevel: brightnessLevel,
      selectedFrequencyNum: selectedFrequencyNum,
    };
  
    try {
      const response = await fetch('http://localhost:5000/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      /* // Trigger the file download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'output.json';
      a.click();
      window.URL.revokeObjectURL(downloadUrl); */
      //Comment this to download json
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <Layout>
      <div className="dashboard-content">
        {/* Existing buttons */}
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect stop-design" type="submit">
          <span>Stop Design</span>
        </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect deploy-button" onClick={handleDeploy} type="submit">
          <span>Deploy</span>
        </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect select-all" type="submit">
          <span>Select All</span>
        </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect clear-all" onClick={clearMarker} type="submit">
          <span>Clear All</span>
        </button>
        <button id="pattern-menu" className="mdl-button mdl-js-button mdl-button--raised" style={{ marginLeft: '10px' }}>
          {selectedPattern}
        </button>
        <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" for="pattern-menu">
          <li className="mdl-menu__item" onClick={() => handlePatternSelect('Blink')}>Blink</li>
          <li className="mdl-menu__item" onClick={() => handlePatternSelect('Fade Up')}>Fade Up</li>
          <li className="mdl-menu__item" onClick={() => handlePatternSelect('Fade Down')}>Fade Down</li>
          <li className="mdl-menu__item" onClick={() => handlePatternSelect('Pulse')}>Pulse</li>
          <li className="mdl-menu__item" onClick={() => handlePatternSelect('Strobe')}>Strobe</li>
          <li className="mdl-menu__item" onClick={() => handlePatternSelect('Random')}>Random</li>
          <li className="mdl-menu__item" onClick={() => handlePatternSelect('No Pattern')}>No Pattern</li>
        </ul>
        <button id="frequency-menu" className="mdl-button mdl-js-button mdl-button--raised" style={{ marginLeft: '10px' }}>
          {selectedFrequency}
        </button>
        <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" for="frequency-menu">
          <li className="mdl-menu__item" onClick={() => handleFrequencySelect('X1')}>X1</li>
          <li className="mdl-menu__item" onClick={() => handleFrequencySelect('X2')}>X2</li>
          <li className="mdl-menu__item" onClick={() => handleFrequencySelect('X3')}>X3</li>
          <li className="mdl-menu__item" onClick={() => handleFrequencySelect('X4')}>X4</li>
        </ul>
        <button ref={buttonRef} onClick={handleClick} className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect choose-color" style={{ backgroundColor: selectedColor }}>
          <span>Choose Color</span>
        </button>
        <div className="slider-container">
          <div style={{ width: '300px', margin: '20px auto' }}>
            <input
              className="mdl-slider mdl-js-slider" type="range" id="s1" min="0" max="100" value={sliderValue} step="25" tabIndex="0"
              onChange={(e) => {
                handleSliderChange(e.target.value);
              }}
              onMouseUp={(e) => {
                handleBrightnessSnap(e.target.value);
              }}
            />
            <span>{sliderValue}</span>
            <p>Brightness</p>
          </div>
        </div>
        <div ref={colorPickerRef} className="color-picker-container" style={{ position: 'relative' }}>
          {displayColorPicker && (
            <div style={{ position: 'absolute', top: buttonRef.current.offsetTop + buttonRef.current.offsetHeight, left: buttonRef.current.offsetLeft, backgroundColor: '#fff', border: '2px solid #000', boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)', padding: '20px', width: '300px' }}>
              <div className="color-squares">
                {['#FF0303', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
                  '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
                  '#795548', '#607D8B', '#FF5252', '#FF4081', '#8E24AA', '#512DA8', '#303F9F', '#1976D2',
                  '#0288D1', '#0097A7', '#00796B', '#388E3C', '#7CB342', '#C0CA33', '#FFD600', '#FF6F00'
                ].map((color, index) => (
                  <div
                    key={index}
                    className="color-square"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div ref={mapRef} className="map-container" style={{ top: '120px', left: '40px', height: '50vh', width: '40vw' }}></div>
        <div ref={mapRef} className="map-container" style={{ top: '130px', left: '40px', height: '50vh', width: '40vw' }}></div>
      </div>
    </Layout>
  );
};
export default Dashboard;