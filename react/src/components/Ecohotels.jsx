import React from 'react';
import './EcoHotels.css';
import hotel1 from '../assets/hotel1.png'
import hotel2 from '../assets/hotel2.png'
import hotel3 from '../assets/hotel3.png'

function EcoHotels() {
  const hotels = [
    {
      name: "Green Valley Eco Resort",
      location: "Barcelona, Spain",
      rating: "4.8",
      price: "$120/night",
      image: hotel1,
      features: ["Solar powered", "Organic restaurant", "Water recycling"]
    },
    {
      name: "Earth Harmony Hotel",
      location: "Portland, USA",
      rating: "4.6",
      price: "$95/night",
      image: hotel2,
      features: ["LEED certified", "Bike rentals", "Local sourcing"]
    },
    {
      name: "Ocean Breeze Eco Lodge",
      location: "Bali, Indonesia",
      rating: "4.9",
      price: "$150/night",
      image:hotel3,
      features: ["Beachfront", "Coral reef protection", "Zero waste"]
    }
  ];

  return (
    <section className="hotels-section">
      <h2>Eco-Friendly Accommodations</h2>
      <div className="hotels-grid">
        {hotels.map((hotel, index) => (
          <div key={index} className="hotel-card">
            <div className="hotel-image">
              <img src={hotel.image} alt={hotel.name} />
              <div className="rating">{hotel.rating} ★</div>
            </div>
            <div className="hotel-info">
              <h3>{hotel.name}</h3>
              <p className="location">{hotel.location}</p>
              <p className="price">{hotel.price}</p>
              <ul className="features">
                {hotel.features.map((feature, i) => (
                  <li key={i}>✓ {feature}</li>
                ))}
              </ul>
              <button className="book-button">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EcoHotels;