import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import './styles.css';

const Dashboard = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const buttonRef = useRef(null);
  const colorPickerRef = useRef(null);

  const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC100', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];

  useEffect(() => {
    // Initialize MDL sliders
    window.componentHandler.upgradeAllRegistered();
    
    // Event listener to update the displayed value of the slider
    const slider = document.getElementById('s1');
    slider.addEventListener('change', () => {
      setSliderValue(slider.value);
    });

    // Event listener to close color picker when clicking outside of it
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target) && buttonRef.current !== event.target) {
        setDisplayColorPicker(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClick = (event) => {
    event.stopPropagation(); // Prevent click event from propagating to window
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    setDisplayColorPicker(false);
  };

  return (
    <Layout>
      <div className="dashboard-content">
        {/* Your dashboard content here */}
        {/* Stop Design button */}
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect stop-design" type="submit">
          <span>Stop Design</span>
        </button>
        {/* Deploy button*/}
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect deploy-button" type="submit">
          <span>Deploy</span>
        </button>
         {/* Select All button*/}
         <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect select-all" type="submit">
          <span>Select All</span>
        </button>
         {/* Clear All button*/}
         <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect clear-all" type="submit">
          <span>Clear All</span>
        </button>
        
        {/* Pattern Menu*/}     
        <button id="pattern-menu" className="mdl-button mdl-js-button mdl-button--raised" style={{ marginLeft: '10px' }}>
          Pattern
        </button>
        <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" for="pattern-menu">
          <li className="mdl-menu__item">Pattern 1</li>
          <li className="mdl-menu__item">Pattern 2</li>
          <li className="mdl-menu__item">Pattern 3</li>
          <li className="mdl-menu__item">Pattern 4</li>
          <li className="mdl-menu__item">Pattern 5</li>
          <li className="mdl-menu__item">Pattern 6</li>
        </ul>

        {/* Choose Color button */}
        <button ref={buttonRef} onClick={handleClick} className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect choose-color" style={{ backgroundColor: selectedColor }}>
          <span>Choose Color</span>
        </button>

        {/* Slider */}
        <div className="slider-container">
          <div style={{ width: '300px', margin: '20px auto' }}>
            <input
              className="mdl-slider mdl-js-slider" type="range" id="s1" min="0" max="100" value={sliderValue} step="1" tabIndex="0"
              onChange={(e) => setSliderValue(e.target.value)} />
            <span>{sliderValue}</span>
            <p>Brightness</p>
          </div>
        </div>
        
        {/* Color Picker */}
        <div ref={colorPickerRef} className="color-picker-container" style={{ position: 'relative' }}>
          {displayColorPicker && (
            <div style={{ position: 'absolute', top: buttonRef.current.offsetTop + buttonRef.current.offsetHeight, left: buttonRef.current.offsetLeft, backgroundColor: '#fff', border: '2px solid #000', boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)', padding: '20px', width: '300px' }}>
              <div className="color-squares">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="color-square"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                  />
                ))}
              </div>
              {/*<button onClick={handleClose}>Close</button>*/}
            </div> 
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
