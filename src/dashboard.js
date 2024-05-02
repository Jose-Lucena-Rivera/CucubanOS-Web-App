import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import './styles.css';

const Dashboard = () => {
  const [sliderValue, setSliderValue] = useState(100);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedColorNum, setSelectedColorNum] = useState([]);
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
  const [markers, setMarkers] = useState([]); // State to store all markers
  const [validMarkers, setValidMarkers] = useState([]);
  const [markerIds, setMarkerIds] = useState([]);
  let markersData = [];

  
  useEffect(() => {
    // Check if the user is logged in (i.e., if there's a token in local storage)
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token found, redirect the user to the login page
      window.location.href = '/';
    }
  }, []);
  
  // Use useEffect to initialize selectedColorNum once markers state is updated
  useEffect(() => {
    // Check if markers array has been initialized
    if (markers.length > 0) {
      // Initialize selectedColorNum with all markers set to 0
      setSelectedColorNum(Array(markers.length).fill(0));
    }
  }, [markers]);

    // Add a useEffect hook to clear the stored color value from localStorage when the component unmounts
    useEffect(() => {
      // Define a function to clear the stored color value
      const clearStoredColor = () => {
        localStorage.removeItem('selectedColor');
      };
  
      // Call the function to clear the stored color value when the component unmounts
      return () => {
        clearStoredColor();
      };
    }, []);

  const fetchBuoys = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-buoys');
      const data = await response.json();
  
      console.log('Fetched buoys:', data);
  
      if (response.ok) {
        const markersData = data.map((buoyArray) => {
          const [name, coordinatesStr, color, __, id] = buoyArray;
  
          if (coordinatesStr === '(0,0)') {
            return null;
          }
  
          const [latStr, lngStr] = coordinatesStr.split(',').map(coord => parseFloat(coord.trim()));
  
          if (isNaN(latStr) || isNaN(lngStr)) {
            return null;
          }
  
          return {
            name,
            lat: latStr,
            lng: lngStr,
            color,
            id,
          };
        }).filter(Boolean);
  
        console.log('Valid markers:', markersData);
  
        setMarkers(markersData);
        loadMap(markersData); // Load the map with the new markers
      } else {
        console.error('Error fetching buoys:', data.error);
      }
    } catch (error) {
      console.error('Error fetching buoys:', error);
    }
  };
  
  useEffect(() => {
    fetchBuoys();
  }, []);

   
    
      
  // Update the loadMap function to store marker instances
  const loadMap = async (markersData) => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API is not loaded.');
      return;
    }
  
    try {
      const position = { lat: 18.2208, lng: -66.4000 };
      const mapOptions = {
        center: position,
        zoom: 8.5,
      };
  
      const newMap = new window.google.maps.Map(mapRef.current, {
        ...mapOptions,
        key: GOOGLE_MAPS_API_KEY,
      });
  
      // Create a LatLngBounds object to store the bounds of all markers
      const bounds = new window.google.maps.LatLngBounds();
  
      if (markers && markers.length > 0) {
        markers.forEach((marker) => {
          if (marker) {
            marker.setMap(null);
          }
        });
      }
  
      // Track the current marker ID
      let currentMarkerId = 1;
      let selectedColor = '#FFFFFF'; // Initialize selectedColor with a default color
  
      const handleMarkerClick = (marker) => {
        let colorNumber = getColorNum(marker.color || '#FFFFFF'); // Default to 0 if marker has no color
        // Inside the handleMarkerClick function, after updating the marker's color
        localStorage.setItem(`markerColor${marker.id}`, marker.color || '#FFFFFF');
        console.log('Marker clicked:', {
          name: marker.name,
          position: marker.position.toString(),
          colorNumber: colorNumber,
          id: marker.id
        });
  
        setSelectedColorNum(prevColorNums => {
          const newColorNums = [...prevColorNums];
          newColorNums[marker.id - 1] = colorNumber; // Assuming marker IDs start from 1
          return newColorNums;
        });
  
        // Store the clicked marker's color and ID in localStorage
        localStorage.setItem(`markerColor${marker.id}`, marker.color || '#FFFFFF');
  
        // Update the marker's color in the markers array
        const updatedMarkers = markers.map(m => {
          if (m.id === marker.id) {
            return { ...m, color: marker.color };
          }
          return m;
        });
        setMarkers(updatedMarkers);
        // If you want to log the color hex code as well
        console.log('Selected color:', colorNumber);
      };
  
      const setMarkerIconColor = (marker, color) => {
        const markerIcon = {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 8,
        };
        marker.setIcon(markerIcon);
      };
  
      const updateMarkerIcon = (marker, color) => {
        const markerIcon = {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 8,
        };
        marker.setIcon(markerIcon);
      };
  
      const newMarkers = await Promise.all(markersData.map((buoy) => {
        return new Promise((resolve) => {
          const initialColor = buoy.color || '#FFFFFF';
  
          const marker = new window.google.maps.Marker({
            position: { lat: buoy.lat, lng: buoy.lng },
            map: newMap,
            color: initialColor,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: initialColor,
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 8,
            },
            title: buoy.name,
            id: currentMarkerId++,
          });
  
          // Inside the loadMap function, after creating markers
          markersData.forEach((buoy) => {
            // Retrieve the marker color from local storage
            const storedColor = localStorage.getItem(`markerColor${buoy.id}`);
            if (storedColor) {
              buoy.color = storedColor;
              updateMarkerIcon(marker, storedColor);
            }
          });
  
          // Extend the bounds to include the marker's position
          bounds.extend(marker.getPosition());
          // Retrieve the marker color from local storage
          const storedColor = localStorage.getItem(`markerColor${marker.id}`);
          if (storedColor) {
            marker.color = storedColor;
            updateMarkerIcon(marker, storedColor);
          }
  
          marker.addListener('click', () => {
            const selectedColor = localStorage.getItem('selectedColor') || '#FFFFFF';
            const defaultColor = '#FFFFFF';
            marker.color = selectedColor; // Update marker's color property
            handleMarkerClick(marker); // Call function to handle marker click event
  
            // Update the marker's color in the markers array
            const updatedMarkers = markers.map(m => {
              if (m.id === marker.id) {
                return { ...m, color: marker.color };
              }
              return m;
            });
            setMarkers(updatedMarkers);
  
            if (marker.getIcon() && marker.getIcon().fillColor !== selectedColor && selectedColor !== defaultColor) {
              marker.setIcon({
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: selectedColor,
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 8,
              });
              localStorage.setItem('clickedMarkerColor', selectedColor);
            }
  
            // Handle marker click after updating marker's color
            handleMarkerClick(marker);
          });
  
          if (markersData.length > 0) {
            // If there are markers, fit the map to the bounds of all markers
            newMap.fitBounds(bounds);
          } else {
            // If there are no markers, set a default zoom level
            newMap.setCenter(mapOptions.center);
          }
          // Add the new marker ID to the markerIds state
          setMarkerIds((prevMarkerIds) => [...prevMarkerIds, marker.id]);
  
          resolve(marker);
        });
      }));
  
      // Set the map and markers states and trigger sending marker IDs to the backend
      setMap(newMap);
      setMarkers(newMarkers);
      sendMarkerIdsToBackend();
  
    } catch (error) {
      console.error('Error loading map:', error);
    }
  };
  
  window.initMap = () => {
    loadMap(markers);
  };
      

      

  // Function to send marker IDs to the backend
  const sendMarkerIdsToBackend = async () => {
    try {
      // Make a POST request to your backend API endpoint
      const response = await fetch('http://localhost:5000/update-marker-ids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markerIds }), // Send the marker IDs in the request body
      });

      if (response.ok) {
        console.log('Marker IDs updated successfully in the backend.');
      } else {
        console.error('Failed to update marker IDs in the backend.');
      }
    } catch (error) {
      console.error('Error updating marker IDs in the backend:', error);
    }
  };

  // useEffect hook to automatically send marker IDs to the backend whenever they change
  useEffect(() => {
    sendMarkerIdsToBackend();
  }, [markerIds]); // Trigger the effect whenever markerIds change

  

    // Modify handleUpdateMarker to include color parameter
const handleUpdateMarker = (updatedMarkerId, updatedColor,color) => {
  // Find the marker with the updated ID
  const updatedMarkers = markers.map(marker => {
    if (marker.id === updatedMarkerId) {
      return { ...marker, color: color || updatedColor }; // Update the marker's color
    }
    return marker;
  });

  // Update the markers state with the updated markers
  setMarkers(updatedMarkers);
  // Inside the handleUpdateMarker function, after updating the marker's color
  localStorage.setItem(`markerColor${updatedMarkerId}`, color || updatedColor);

  const markerColorData = JSON.parse(localStorage.getItem('markerColorData')) || {};
  markerColorData[updatedMarkerId] = updatedColor;
  localStorage.setItem('markerColorData', JSON.stringify(markerColorData));

   // Update selectedColorNum with the updated number of markers
   setSelectedColorNum(prevColorNums => {
    const newColorNums = [...prevColorNums];
    // Ensure the number of color numbers matches the number of markers
    while (newColorNums.length < updatedMarkers.length) {
      newColorNums.push(updatedColor);
    }
    // Limit the number of color numbers to the number of markers
    return newColorNums.slice(0, updatedMarkers.length);
    });
  };

    // Inside the useEffect to retrieve marker color data from local storage upon component mount
    useEffect(() => {
      const storedMarkerColorData = localStorage.getItem('markerColorData');

      if (storedMarkerColorData) {
        const markerColorData = JSON.parse(storedMarkerColorData);

        // Iterate through the stored data and apply colors to markers
        markers.forEach(marker => {
          const storedColor = markerColorData[marker.id];
          if (storedColor) {
            updateMarkerIcon(marker, storedColor);
          }
        });
      }
    }, []);

  const updateAllMarkersColor = (color) => {
    markers.forEach((marker) => {
      if (marker && marker.setIcon && typeof marker.setIcon === 'function') {
        marker.setIcon({
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 8,
        });
      }
    });
  };
  const handleSelectAll = () => {
        // Update all markers to have the selected color
    updateAllMarkersColor(selectedColor);

    // Update selectedColorNum to match the selected color for all markers
    const colorNumber = getColorNum(selectedColor);
    setSelectedColorNum(Array(markers.length).fill(colorNumber));
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
    document.documentElement.style.setProperty('--selected-color', selectedColor);
}, [selectedColor]);

useEffect(() => {
    window.componentHandler.upgradeAllRegistered();

    const handleClickOutside = (event) => {
        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target) && displayColorPicker) {
            setDisplayColorPicker(false);
        }
    };

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
                // Removed the loadMap call here
            });
        }
    } else {
        // Removed the loadMap call here
    }

    return () => {
        window.removeEventListener('click', handleClickOutside);
    };
    }, [selectedColor, displayColorPicker, clickedMarkerColor]);

  // Function to clear the selected marker
  const clearAllMarkersColor = () => {
    markers.forEach((marker) => {
      if (marker && marker.setIcon && typeof marker.setIcon === 'function') {
        marker.setIcon({
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 8,
        });
        marker.color = '#FFFFFF'; // Update marker's color property
      }
    });
    // Clear the stored marker color data from local storage
    localStorage.removeItem('markerColorData');
  };
  
  const updateMarkerIcon = (marker, color) => {
    if (marker && marker.setIcon && typeof marker.setIcon === 'function') {
      marker.setIcon({
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 8,
      });
      
    }
  };


  
  const handleClearAll = () => {
    // Call clearAllMarkersColor to ensure all markers are cleared visually
    clearAllMarkersColor();
  
    // Reset selectedColorNum to an array of 0s with the same length as markers
    setSelectedColorNum(Array(markers.length).fill(0));
    // Clear the stored marker color data from local storage
    localStorage.removeItem('markerColorData');
  };



   const handleClick = (event) => {
    event.stopPropagation();
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleColorClick = (color) => {
    let colorNum = 0; // Default to 0 if no color is selected
    if (color) {
      colorNum = getColorNum(color); // Get color number based on color
      setSelectedColor(color);
      localStorage.setItem('selectedColor', color); // Set selected color in localStorage
    }
     // Retrieve the selected color from local storage when the component mounts
      const storedColor = localStorage.getItem('selectedColor');
      if (storedColor) {
        setSelectedColor(storedColor);
      }
    
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

    const brightnessLevelToSend = sliderValue === 100 ? 5 : brightnessLevel;

     // Map the colors to color numbers, replacing null with 0 for markers without color
    const colorNums = markers.map(marker => marker.color ? getColorNum(marker.color) : 0);
    // Determine the pattern number
    let patternToSend = selectedPatternNum;
    if (selectedPattern === 'Pattern') {
      patternToSend = 7; // No Pattern
    }

    // Determine the frequency number
    let frequencyToSend = selectedFrequencyNum;
    if (selectedFrequency === 'Frequency') {
      frequencyToSend = 1; // X1
    }
 
    const data = {
      selectedColorNum: selectedColorNum,
      selectedPatternNum: patternToSend,
      brightnessLevel: brightnessLevelToSend,
      selectedFrequencyNum: frequencyToSend,
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

  const handleStopDesign = async () => {
    const data = {
      selectedColorNum: Array(markers.length).fill(0), 
      selectedPatternNum: 0,
      brightnessLevel: 0,
      selectedFrequencyNum: 0,
    };
    clearAllMarkersColor()
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
  
      const responseData = await response.json();
      console.log(responseData);
  
    } catch (error) {
      console.error('Error:', error);
    }
  
    // Reset all state values to their default or 0 values
    setSliderValue(100);
    setSelectedColor('#FFFFFF');
    setSelectedColorNum(Array(markers.length).fill(0));
    setSelectedPattern('Pattern');
    setClickedMarkerColor(null);
    setSelectedPatternNum(0);
    setSelectedFrequency('Frequency');
    setSelectedFrequencyNum(0);
    setBrightnessLevel(0);
  };

  useEffect(() => {
    // Save selectedColor to local storage when it changes
    localStorage.setItem('selectedColor', selectedColor);
  }, [selectedColor]);


  return (
    <Layout>
      <div className="dashboard-content">
        {/* Existing buttons */}
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect stop-design" onClick={handleStopDesign} type="submit">
          <span>Stop Design</span>
        </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect deploy-button" onClick={handleDeploy} type="submit">
          <span>Deploy</span>
        </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect select-all" onClick={handleSelectAll} type="submit">
          <span>Select All</span>
        </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect clear-all" onClick={handleClearAll} type="submit">
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
        <div ref={mapRef} className="map-container" style={{ top: '130px', left: '40px', height: '50vh', width: '40vw' }}></div>
      </div>
    </Layout>
  );
};

export default Dashboard;