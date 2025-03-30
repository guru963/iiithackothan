
import React, { useState } from "react";
import axios from "axios";
import "./TouristSpots.css";

const ItineraryPlanner = () => {
  const [destination, setDestination] = useState("");
  const [spots, setSpots] = useState([]);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itineraryName, setItineraryName] = useState("");
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [selectedSpotImages, setSelectedSpotImages] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Replace with your actual API key and Search Engine ID
  const GOOGLE_API_KEY = "AIzaSyAj6S5OdYtc4uZ0G_fEUlhr2YjLUVU5oa0";
  const SEARCH_ENGINE_ID = "97285f79cdec1496a";

  const fetchTouristSpots = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSpots([]);
    
    try {
      const query = `
        [out:json];
        area[name~"^${destination}$"]->.searchArea;
        (
          node["tourism"="attraction"](area.searchArea);
          way["tourism"="attraction"](area.searchArea);
          relation["tourism"="attraction"](area.searchArea);
          node["tourism"~"museum"](area.searchArea);
          way["tourism"~"museum"](area.searchArea);
          relation["tourism"~"museum"](area.searchArea);
          node["historic"](area.searchArea);
          way["historic"](area.searchArea);
          relation["historic"](area.searchArea);
          node["leisure"~"park|garden"](area.searchArea);
          way["leisure"~"park|garden"](area.searchArea);
          relation["leisure"~"park|garden"](area.searchArea);
          node["natural"~"beach|water|cliff|peak"](area.searchArea);
          way["natural"~"beach|water|cliff|peak"](area.searchArea);
          relation["natural"~"beach|water|cliff|peak"](area.searchArea);
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await axios({
        method: 'post',
        url: 'https://overpass-api.de/api/interpreter',
        data: query,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const elements = response.data.elements || [];
      const places = elements
        .filter(place => place.tags && place.tags.name)
        .map(place => ({
          id: place.id,
          name: place.tags.name,
          type: place.tags.tourism || "attraction",
          lat: place.lat || (place.center ? place.center.lat : null),
          lon: place.lon || (place.center ? place.center.lon : null),
          description: place.tags.description || "",
          selected: false
        }))
        .slice(0, 25);
      
      if (places.length === 0) {
        setError(`No tourist spots found in ${destination}. Try a different search term.`);
      } else {
        setSpots(places);
      }
    } catch (error) {
      console.error("Error fetching tourist spots:", error);
      setError("Failed to fetch tourist spots. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpotSelection = (spotId) => {
    const updatedSpots = spots.map(spot => 
      spot.id === spotId ? { ...spot, selected: !spot.selected } : spot
    );
    
    setSpots(updatedSpots);
    
    const selected = updatedSpots.filter(spot => spot.selected);
    setSelectedSpots(selected);
  };

  const fetchSpotImages = async (spotName) => {
    setImageLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(spotName + " tourist attraction")}&cx=${SEARCH_ENGINE_ID}&key=${GOOGLE_API_KEY}&searchType=image&num=5`
      );
      
      const images = response.data.items?.map(item => ({
        url: item.link,
        title: item.title
      })) || [];
      
      setSelectedSpotImages({
        spotName,
        images
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Could not load images for this location");
    } finally {
      setImageLoading(false);
    }
  };

  const closeImageModal = () => {
    setSelectedSpotImages(null);
  };

  const saveItinerary = () => {
    if (selectedSpots.length === 0) {
      setError("Please select at least one spot to save itinerary");
      return;
    }
    
    if (!itineraryName.trim()) {
      setError("Please give your itinerary a name");
      return;
    }
    
    const newItinerary = {
      name: itineraryName,
      date: new Date().toLocaleDateString(),
      spots: selectedSpots,
      coordinates: selectedSpots.map(spot => ({
        name: spot.name,
        lat: spot.lat,
        lon: spot.lon
      }))
    };
    
    setSavedItineraries([...savedItineraries, newItinerary]);
    setItineraryName("");
    setSelectedSpots([]);
    setSpots(spots.map(spot => ({ ...spot, selected: false })));
  };

  const navigateToRouteOptimizer = (spots) => {
    if (spots.length < 2) {
      setError("Please select at least 2 spots to plan a route");
      return;
    }
    
    const coordinates = spots.map(spot => 
      `${spot.lat.toFixed(6)},${spot.lon.toFixed(6)},${encodeURIComponent(spot.name)}`
    ).join('|');
    
    window.location.href = `/route-optimization.html?coordinates=${encodeURIComponent(coordinates)}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTouristSpots();
  };

  return (
    <div className="itinerary-planner">
      <div className="tourist-container">
        <h1 className="page-title">Explore</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-wrapper">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter a destination (e.g., Paris, Rome, Tokyo)"
              className="search-input"
              required
            />
            <button 
              type="submit"
              disabled={loading}
              className="search-button"
            >
              {loading ? 'Searching...' : 'Find Spots'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {spots.length > 0 && (
          <div className="results-container">
            <h2 className="results-title">Top Tourist Spots in {destination}</h2>
            <div className="spots-grid">
              {spots.map((spot) => (
                <div 
                  key={spot.id} 
                  className={`spot-card ${spot.selected ? 'selected' : ''}`}
                >
                  <div className="spot-image" onClick={() => fetchSpotImages(spot.name)}>
                    {imageLoading && selectedSpotImages?.spotName === spot.name ? (
                      <div className="image-loading-spinner"></div>
                    ) : (
                      <span className="spot-icon">
                        🏛
                      </span>
                    )}
                  </div>
                  <div className="spot-content">
                    <div className="spot-header">
                      <h3 className="spot-title">{spot.name}</h3>
                      <button 
                        className={`heart-button ${spot.selected ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSpotSelection(spot.id);
                        }}
                      >
                        {spot.selected ? '❤️' : '🤍'}
                      </button>
                    </div>
                    <p className="spot-type">Type: {spot.type}</p>
                    {spot.description && <p className="spot-description">{spot.description}</p>}
                    {spot.lat && spot.lon && (
                      <div className="spot-coordinates">
                        Coordinates: {spot.lat.toFixed(4)}, {spot.lon.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedSpotImages && (
          <div className="image-modal">
            <div className="image-modal-content">
              <button className="close-button" onClick={closeImageModal}>
                &times;
              </button>
              <h3>{selectedSpotImages.spotName}</h3>
              
              {imageLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                </div>
              ) : selectedSpotImages.images.length > 0 ? (
                <div className="image-grid">
                  {selectedSpotImages.images.map((image, index) => (
                    <div key={index} className="image-item">
                      <img 
                        src={image.url} 
                        alt={image.title} 
                        className="spot-image-result"
                        loading="lazy"
                      />
                      <p className="image-title">{image.title}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-images">
                  No images available for this location
                </div>
              )}
            </div>
          </div>
        )}
        
        {selectedSpots.length > 0 && (
          <div className="selection-panel">
            <h3>Selected Places ({selectedSpots.length})</h3>
            <div className="selected-spots">
              {selectedSpots.map((spot, index) => (
                <div key={index} className="selected-spot">
                  <span>{spot.name}</span>
                  <span className="coordinates">
                    {spot.lat.toFixed(4)}, {spot.lon.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="save-itinerary">
              <input
                type="text"
                value={itineraryName}
                onChange={(e) => setItineraryName(e.target.value)}
                placeholder="Name your itinerary"
                className="itinerary-name-input"
                required
              />
              <button 
                onClick={saveItinerary}
                className="save-button"
              >
                Save Itinerary
              </button>
              <button
                onClick={() => navigateToRouteOptimizer(selectedSpots)}
                className="route-button"
              >
                Plan Route
              </button>
            </div>
          </div>
        )}
        
        {savedItineraries.length > 0 && (
          <div className="saved-itineraries">
            <h3>Your Saved Itineraries</h3>
            <div className="itinerary-list">
              {savedItineraries.map((itinerary, index) => (
                <div key={index} className="itinerary-item">
                  <h4>{itinerary.name} <span className="itinerary-date">{itinerary.date}</span></h4>
                  <ul className="itinerary-spots">
                    {itinerary.spots.map((spot, idx) => (
                      <li key={idx}>
                        {spot.name} ({spot.lat.toFixed(2)}, {spot.lon.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                  <div className="itinerary-actions">
                    <button 
                      onClick={() => navigateToRouteOptimizer(itinerary.spots)}
                      className="action-button view"
                    >
                      View on Map
                    </button>
                    <button className="action-button share">Share</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryPlanner;