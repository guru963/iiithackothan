// CarbonFootprint.js
import React, { useEffect, useState } from 'react';
import './CarbonFootprint.css';

function CarbonFootprint() {
  const [animated, setAnimated] = useState(false);
  
  // Sample data for the pie chart
  const carbonData = [
    { name: 'Transportation', value: 45, color: '#2e8b57' },
    { name: 'Accommodation', value: 25, color: '#3cb371' },
    { name: 'Activities', value: 15, color: '#98fb98' },
    { name: 'Food', value: 15, color: '#006400' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('.carbon-section');
      if (element) {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100 && !animated) {
          setAnimated(true);
          
          // Add floating leaves
          addFloatingLeaves();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial render
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animated]);

  const addFloatingLeaves = () => {
    const colors = ['#2e8b57', '#3cb371', '#98fb98', '#006400'];
    const section = document.querySelector('.carbon-section');
    
    for (let i = 0; i < 8; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.innerHTML = '🍃';
      
      // Random properties
      const size = Math.random() * 30 + 20;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 3 + 3;
      const delay = Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      leaf.style.fontSize = `${size}px`;
      leaf.style.left = `${left}%`;
      leaf.style.top = `${Math.random() * 100}%`;
      leaf.style.animationDuration = `${animationDuration}s`;
      leaf.style.animationDelay = `${delay}s`;
      leaf.style.color = color;
      
      section.appendChild(leaf);
    }
  };

  return (
    <section className={`carbon-section ${animated ? 'animated' : 'animate-on-scroll'}`}>
      <h2>Your Trip's Carbon Footprint</h2>
      <div className="carbon-container">
        <div className="pie-chart">
          <div className="pie" style={{ 
            background: `conic-gradient(
              ${carbonData[0].color} 0% ${carbonData[0].value}%,
              ${carbonData[1].color} 0% ${carbonData[0].value + carbonData[1].value}%,
              ${carbonData[2].color} 0% ${carbonData[0].value + carbonData[1].value + carbonData[2].value}%,
              ${carbonData[3].color} 0% 100%
            )`
          }}></div>
        </div>
        <div className="carbon-legend">
          <h3>Carbon Emission Breakdown</h3>
          <ul>
            {carbonData.map((item, index) => (
              <li key={index}>
                <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                <span>{item.name}: {item.value}%</span>
              </li>
            ))}
          </ul>
          <p className="carbon-tip">
            Tip: Choosing trains over cars can reduce your carbon footprint by up to 75%! Small changes in your travel habits make a big difference for our planet.
          </p>
          <button className="calculate-button">Calculate Your Footprint</button>
        </div>
      </div>
    </section>
  );
}

export default CarbonFootprint;