import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './WeatherActivityRecommender.css';

function WeatherActivityRecommender() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [activities, setActivities] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setWeatherLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            isManual: false
          });
          setError(null);
        },
        (err) => {
          setError("Unable to retrieve your location. Please enable location services or enter a location manually.");
          setWeatherLoading(false);
          console.error(err);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please enter a location manually.");
      setWeatherLoading(false);
    }
  };

  // Handle manual location submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualLocation.trim()) {
      setError("Please enter a location");
      return;
    }
    setWeatherLoading(true);
    setError(null);
    fetchManualLocationCoordinates(manualLocation);
  };

  // Fetch coordinates for manual location
  const fetchManualLocationCoordinates = async (locationName) => {
    try {
      const apiKey = '1c464a06f144eec7f2b886c74b3d33b5';
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${apiKey}`
      );
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error("Location not found");
      }
      
      setLocation({
        lat: data[0].lat,
        lon: data[0].lon,
        name: data[0].name,
        isManual: true
      });
    } catch (err) {
      setError("Failed to find location. Please try another name.");
      setWeatherLoading(false);
      console.error(err);
    }
  };

  // Fetch weather when location is available
  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        const apiKey = '1c464a06f144eec7f2b886c74b3d33b5';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        setWeather(data);
        generateActivities(data);
      } catch (err) {
        setError("Failed to fetch weather data");
        console.error(err);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  // Generate eco activities using Gemini API
  const generateActivities = async (weatherData) => {
    setActivitiesLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error("Missing Google API key");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const locationName = weatherData.name || manualLocation;
      const prompt = `
        Based on the following weather conditions in ${locationName}, 
        suggest 3 eco-friendly adventure activities with specific locations where to do them.
        Weather: ${weatherData.weather[0].description}, 
        Temperature: ${weatherData.main.temp}°C, 
        Wind: ${weatherData.wind.speed} m/s.
        
        Return the response as a valid JSON array with objects containing:
        - timeOfDay (morning/afternoon/evening)
        - activity (the activity name)
        - location (specific place)
        - description (short description)
        - icon (suggest a relevant emoji)
        
        Make sure activities are suitable for the current weather conditions.
        Focus on low-impact, sustainable activities that connect people with nature.
        
        Example format:
        [
          {
            "timeOfDay": "morning",
            "activity": "Sunrise yoga in the park",
            "location": "Central Park Meadow",
            "description": "Start your day with mindful movement surrounded by nature",
            "icon": "🧘‍♀️"
          }
        ]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\[.*\]/s);
        if (!jsonMatch) {
          throw new Error("No JSON array found in response");
        }
        const activitiesData = JSON.parse(jsonMatch[0]);
        
        if (!Array.isArray(activitiesData)) {
          throw new Error("Invalid activities format");
        }
        
        setActivities(activitiesData);
        setError(null);
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error("Couldn't process activity recommendations");
      }
    } catch (err) {
      console.error("Activity generation failed:", err);
      setError(`We couldn't generate activity recommendations: ${err.message}`);
      setActivities(getManualActivities(weatherData));
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Manual fallback activities
  const getManualActivities = (weatherData) => {
    const time = new Date().getHours();
    const timeOfDay = time < 12 ? 'morning' : time < 17 ? 'afternoon' : 'evening';
    const conditions = weatherData.weather[0].main.toLowerCase();
    const temp = weatherData.main.temp;
    
    const activityMap = {
      clear: [
        {
          timeOfDay,
          activity: "Sunrise hiking",
          location: "Local nature reserve",
          description: "Enjoy the cool morning air on sustainable trails",
          icon: "🥾"
        },
        {
          timeOfDay,
          activity: "Outdoor yoga",
          location: "Community park",
          description: "Mindful movement in fresh air",
          icon: "🧘"
        },
        {
          timeOfDay,
          activity: "Bird watching",
          location: "Nearby wetlands",
          description: "Observe local wildlife responsibly",
          icon: "🦅"
        }
      ],
      rain: [
        {
          timeOfDay,
          activity: "Eco-museum visit",
          location: "Sustainability museum",
          description: "Learn about environmental conservation",
          icon: "🏛️"
        },
        {
          timeOfDay,
          activity: "Indoor rock climbing",
          location: "Green-certified gym",
          description: "Sustainable fitness activity",
          icon: "🧗"
        },
        {
          timeOfDay,
          activity: "Tea tasting",
          location: "Local organic tea house",
          description: "Sample sustainably sourced teas",
          icon: "🍵"
        }
      ],
      clouds: [
        {
          timeOfDay,
          activity: "Nature photography",
          location: "Scenic overlook",
          description: "Capture the beauty of nature",
          icon: "📷"
        },
        {
          timeOfDay,
          activity: "Botanical garden visit",
          location: "Local arboretum",
          description: "Explore plant biodiversity",
          icon: "🌿"
        },
        {
          timeOfDay,
          activity: "Farmers market",
          location: "Town square",
          description: "Support local sustainable agriculture",
          icon: "🛒"
        }
      ],
      snow: [
        {
          timeOfDay,
          activity: "Snowshoeing",
          location: "Forest preserve",
          description: "Low-impact winter exploration",
          icon: "❄️"
        },
        {
          timeOfDay,
          activity: "Winter wildlife tracking",
          location: "Nature sanctuary",
          description: "Learn about animal habitats",
          icon: "🦌"
        },
        {
          timeOfDay,
          activity: "Hot springs visit",
          location: "Geothermal springs",
          description: "Natural warm water relaxation",
          icon: "♨️"
        }
      ]
    };

    return activityMap[conditions] || [
      {
        timeOfDay: "day",
        activity: "Nature walk",
        location: "Local park",
        description: "Explore and appreciate your local environment",
        icon: "🌳"
      },
      {
        timeOfDay: "day",
        activity: "Community garden volunteering",
        location: "Urban farm",
        description: "Help grow local organic produce",
        icon: "👩‍🌾"
      },
      {
        timeOfDay: "evening",
        activity: "Stargazing",
        location: "Dark sky preserve",
        description: "Connect with the night sky",
        icon: "✨"
      }
    ];
  };

  const resetSearch = () => {
    setLocation(null);
    setWeather(null);
    setActivities(null);
    setManualLocation('');
    setError(null);
  };

  if (weatherLoading) {
    return (
      <div className="wa-loading-container">
        <div className="wa-leaf-spinner"></div>
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="wa-error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={resetSearch} className="wa-eco-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="wa-container">
      {/* Floating leaves */}
      <div className="wa-leaf wa-leaf-1">🍃</div>
      <div className="wa-leaf wa-leaf-2">🌿</div>
      <div className="wa-leaf wa-leaf-3">🍀</div>
      <div className="wa-leaf wa-leaf-4">🌱</div>
      
      <header className="wa-header">
        <h1>🌿 Eco Adventure Planner</h1>
        <p>Sustainable outdoor activities based on current weather</p>
      </header>

      <main>
        {!location ? (
          <section className="wa-location-section">
            <div className="wa-location-options">
              <button
                onClick={() => {
                  setUseCurrentLocation(true);
                  getCurrentLocation();
                }}
                className={`wa-eco-btn ${useCurrentLocation ? 'active' : ''}`}
              >
                Use My Current Location
              </button>
              <span className="wa-or-divider">or</span>
              <button
                onClick={() => setUseCurrentLocation(false)}
                className={`wa-eco-btn ${!useCurrentLocation ? 'active' : ''}`}
              >
                Enter Location Manually
              </button>
            </div>

            {!useCurrentLocation && (
              <form onSubmit={handleManualSubmit} className="wa-location-form">
                <input
                  type="text"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  placeholder="Enter city, country"
                  className="wa-location-input"
                />
                <button type="submit" className="wa-eco-btn">
                  Find Adventures
                </button>
              </form>
            )}
          </section>
        ) : (
          <>
            <div className="wa-location-section wa-location-header">
              <h2>
                {weather ? `Eco Adventures in ${weather.name}` : `Searching for ${manualLocation || 'your location'}`}
              </h2>
              <button onClick={resetSearch} className="wa-eco-btn">
                Change Location
              </button>
            </div>

            {weather && (
              <section className="wa-weather-section">
                <div className="wa-weather-card">
                  <div className="wa-weather-main">
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                      alt={weather.weather[0].description}
                    />
                    <div>
                      <p className="wa-temp">{Math.round(weather.main.temp)}°C</p>
                      <p className="wa-description">{weather.weather[0].description}</p>
                    </div>
                  </div>
                  <div className="wa-weather-details">
                    <p>🌬️ Wind: {weather.wind.speed} m/s</p>
                    <p>💧 Humidity: {weather.main.humidity}%</p>
                    <p>🌡️ Feels like: {Math.round(weather.main.feels_like)}°C</p>
                  </div>
                </div>
              </section>
            )}

            {error && (
              <div className="wa-notice-message">
                <p>{error}</p>
              </div>
            )}

            {activitiesLoading ? (
              <div className="wa-loading-container">
                <div className="wa-leaf-spinner"></div>
                <p>Generating eco-friendly activities...</p>
              </div>
            ) : activities ? (
              <section className="wa-activities-section">
                <h3>Recommended Eco-Adventures</h3>
                <div className="wa-activities-grid">
                  {activities.map((activity, index) => (
                    <div key={index} className="wa-activity-card">
                      <div className="wa-card-header">
                        <span className="wa-time-badge">{activity.timeOfDay}</span>
                        <span className="wa-activity-icon">{activity.icon}</span>
                      </div>
                      <h4>{activity.activity}</h4>
                      <p className="wa-location">📍 {activity.location}</p>
                      <p className="wa-description">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              !error && (
                <div className="wa-notice-message">
                  <p>No activity recommendations available for this location.</p>
                </div>
              )
            )}
          </>
        )}
      </main>

      <footer className="wa-footer">
        <p>🌎 Explore responsibly. Leave no trace.</p>
      </footer>
    </div>
  );
}

export default WeatherActivityRecommender;