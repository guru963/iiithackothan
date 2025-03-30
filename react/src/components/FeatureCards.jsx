import React from 'react';
import { Link } from 'react-router-dom';
import './FeatureCards.css';

function FeatureCards() {
  const features = [
    {
      title: "Explore",
      description: "Explore the places you dream to visit",
      icon: "📅",
      link: "/itinerary-planner",
      isHtml: false
    },
    {
      title: "Route Optimization",
      description: "Find the most eco-friendly routes for your journey",
      icon: "🛣️",
      link: "/route-optimization.html", // HTML file
      isHtml: true
    },
    {
      title: "Eco Accommodations",
      description: "Discover certified eco-friendly hotels and stays",
      icon: "🏨",
      link: "/eco-accommodations.html", // HTML file
      isHtml: true
    },
    {
      title: "Weather Activities",
      description: "Find activities perfect for current weather conditions",
      icon: "☀️",
      link: "/activities",
      isHtml: false
    },
    {
      title: "Eco Packing",
      description: "Sustainable, biodegradable, and minimal-waste packaging",
      icon: "🛣️",
      link: "/eco-packing.html", // HTML file
      isHtml: true
    },
  ];

  const handleNavigation = (link, isHtml, e) => {
    if (isHtml) {
      e.preventDefault();
      window.location.href = link;
    }
  };

  return (
    <section className="features-section">
      <h2>Our Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Link
            to={feature.link}
            key={index}
            className="feature-card"
            onClick={(e) => handleNavigation(feature.link, feature.isHtml, e)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FeatureCards;