import React from 'react';
import './Testimonials.css';

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Berlin, Germany",
      text: "EcoTravel helped me reduce my carbon footprint by 40% on my last trip without compromising on comfort!",
      rating: "5"
    },
    {
      name: "Michael Chen",
      location: "Toronto, Canada",
      text: "The route optimization feature saved me both time and money while keeping my emissions low. Highly recommend!",
      rating: "4"
    },
    {
      name: "Emma Rodriguez",
      location: "Madrid, Spain",
      text: "Found amazing eco-friendly hotels I wouldn't have discovered otherwise. The carbon calculator is eye-opening.",
      rating: "5"
    }
  ];

  return (
    <section className="testimonials-section">
      <h2>What Our Travelers Say</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="rating">{'★'.repeat(testimonial.rating)}</div>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="author">
              <p className="name">{testimonial.name}</p>
              <p className="location">{testimonial.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;