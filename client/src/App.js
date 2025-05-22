import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GraveSiteList from './components/GraveSiteList';
import AddGraveForm from './components/AddGraveForm';
import './App.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [graveSites, setGraveSites] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchGraveSites();
  }, []);

  const fetchGraveSites = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/grave-sites');
      const data = await response.json();
      setGraveSites(data);
    } catch (error) {
      console.error('Error fetching grave sites:', error);
    }
  };

  const handleAddGrave = async (newGrave) => {
    try {
      const response = await fetch('http://localhost:5000/api/grave-sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGrave),
      });
      const data = await response.json();
      setGraveSites([...graveSites, data]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding grave site:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Grave Site Geotagging</h1>
        <button onClick={() => setShowForm(true)} className="add-button">
          Add New Grave
        </button>
      </header>

      <div className="main-content">
        <div className="map-container">
          <MapContainer
            center={[0, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {graveSites.map((site) => (
              <Marker
                key={site._id}
                position={[site.coordinates.lat, site.coordinates.lng]}
              >
                <Popup>
                  <div>
                    <h3>{site.name}</h3>
                    <p>{site.description}</p>
                    <p>Born: {new Date(site.dateOfBirth).toLocaleDateString()}</p>
                    <p>Died: {new Date(site.dateOfDeath).toLocaleDateString()}</p>
                    {site.imageUrl && <img src={site.imageUrl} alt={site.name} style={{ maxWidth: '100%' }} />}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <GraveSiteList graveSites={graveSites} />
      </div>

      {showForm && (
        <AddGraveForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddGrave}
        />
      )}
    </div>
  );
}

export default App; 