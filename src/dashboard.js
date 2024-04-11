import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import './styles.css';


const Dashboard = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const buttonRef = useRef(null);
  const colorPickerRef = useRef(null);

  const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
    '#795548', '#607D8B', '#FF5252', '#FF4081', '#8E24AA', '#512DA8', '#303F9F', '#1976D2',
    '#0288D1', '#0097A7', '#00796B', '#388E3C', '#7CB342', '#C0CA33', '#FFD600', '#FF6F00'
  ];

  useEffect(() => {
    window.componentHandler.upgradeAllRegistered();
    const slider = document.getElementById('s1');
    slider.addEventListener('change', () => {
      setSliderValue(slider.value);
    });

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
    event.stopPropagation(); 
    setDisplayColorPicker(!displayColorPicker);
  };

  

  const handleColorClick = (color) => {
    setSelectedColor(color);
    setDisplayColorPicker(false);
  };

  return (
    <Layout>
      <div className="dashboard-content">
         {/* Google Maps iframe */}
         <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d21432.895380016187!2d-66.66869482751298!3d18.263319124176782!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c02d8243b2daccb%3A0xe74abb725347f602!2sLago%20Caonillas!5e0!3m2!1sen!2spr!4v1712768782094!5m2!1sen!2spr"
          height="450"
          width="300"
          style={{ border: 0, float: 'left', marginRight: '20px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect stop-design" type="submit">
          <span>Stop Design</span>
        </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect deploy-button" type="submit">
          <span>Deploy</span>
        </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect select-all" type="submit">
          <span>Select All</span>
        </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect clear-all" type="submit">
          <span>Clear All</span>
        </button>
        <button id="pattern-menu" className="mdl-button mdl-js-button mdl-button--raised" style={{ marginLeft: '10px' }}>
          Pattern
        </button>
        <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" for="pattern-menu">
          <li className="mdl-menu__item">Blink</li>
          <li className="mdl-menu__item">Fade</li>
          <li className="mdl-menu__item">Strobe</li>
          <li className="mdl-menu__item">Pulse</li>
          <li className="mdl-menu__item">Wave</li>
          <li className="mdl-menu__item">Random</li>
        </ul>
        <button ref={buttonRef} onClick={handleClick} className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect choose-color" style={{ backgroundColor: selectedColor }}>
          <span>Choose Color</span>
        </button>
        <div className="slider-container">
          <div style={{ width: '300px', margin: '20px auto' }}>
            <input
              className="mdl-slider mdl-js-slider" type="range" id="s1" min="0" max="100" value={sliderValue} step="1" tabIndex="0"
              onChange={(e) => setSliderValue(e.target.value)} />
            <span>{sliderValue}</span>
            <p>Brightness</p>
          </div>
        </div>
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
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
