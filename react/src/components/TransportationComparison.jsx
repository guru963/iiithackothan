import React from 'react';
import './TransportationComparison.css';

function TransportationComparison() {
  const transportOptions = [
    {
      type: "Train",
      time: "2h 30m",
      cost: "$45",
      co2: "5kg",
      icon: "🚆"
    },
    {
      type: "Bus",
      time: "3h 15m",
      cost: "$30",
      co2: "8kg",
      icon: "🚌"
    },
    {
      type: "Car",
      time: "2h",
      cost: "$60 (fuel)",
      co2: "20kg",
      icon: "🚗"
    }
  ];

  return (
    <section className="transport-section">
      <h2>Compare Transportation Options</h2>
      <div className="transport-grid">
        {transportOptions.map((option, index) => (
          <div key={index} className="transport-card">
            <div className="transport-icon">{option.icon}</div>
            <h3>{option.type}</h3>
            <div className="transport-details">
              <p><strong>Time:</strong> {option.time}</p>
              <p><strong>Cost:</strong> {option.cost}</p>
              <p><strong>CO2 Emissions:</strong> {option.co2}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TransportationComparison;

