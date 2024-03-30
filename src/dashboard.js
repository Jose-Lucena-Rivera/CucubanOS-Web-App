import React, { useState } from 'react';
import Layout from './Layout';
import { useEffect } from 'react';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';
import './styles.css'

const Dashboard = () => {
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    // Initialize MDL sliders
    window.componentHandler.upgradeAllRegistered();
    
    // Event listener to update the displayed value of the slider
    const slider = document.getElementById('s1');
    slider.addEventListener('change', () => {
      setSliderValue(slider.value);
    });
  }, []);

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
          <button id="pattern-menu"
                  class="mdl-button mdl-js-button mdl-button--raised ">
            Pattern
          </button>
          <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
              for="pattern-menu">
            <li class="mdl-menu__item">Pattern 1</li>
            <li class="mdl-menu__item">Pattern 2</li>
            <li class="mdl-menu__item">Pattern 3</li>
            <li class="mdl-menu__item">Pattern 4</li>
            <li class="mdl-menu__item">Pattern 5</li>
            <li class="mdl-menu__item">Pattern 6</li>
          </ul>


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
      </div>


    </Layout>
  );
};

export default Dashboard;