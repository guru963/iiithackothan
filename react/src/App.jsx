import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FeatureCards from './components/FeatureCards';
import TransportationComparison from './components/TransportationComparison';
import CarbonFootprint from './components/CarbonFootprint';
import EcoHotels from './components/EcoHotels';
import ItineraryPlanner from './components/TouristSpots';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import './App.css';
import Heroimage from './assets/hero-image.png';
import WeatherActivityRecommender from './components/WeatherActivityRecommender';
import Login from './Login';

function HomePage() {
  return (
    <>
            <section className="hero">
          <div className="leaf-decoration leaf-1"></div>
          <div className="leaf-decoration leaf-2"></div>
          <div className="hero-content">
            <h1>Plan Your Eco-Friendly Journey</h1>
            <p>Travel sustainably with our route optimization and carbon footprint calculator</p>
            <button className="cta-button">Get Started</button>
          </div>
          <div className="hero-image">
            <img src={Heroimage} alt="Eco-friendly travel" />
          </div>
        </section>
      <FeatureCards />
      <TransportationComparison />
      <CarbonFootprint />
      <EcoHotels />
      <Testimonials />
    </>
  );
}

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/login' element={<Login/>}/>
          <Route path="/itinerary-planner" element={<ItineraryPlanner />} />
          <Route path="/activities" element={<WeatherActivityRecommender/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;