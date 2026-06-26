import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from './supabaseClient';
import { useAuth } from './context/AuthContext';
import { useIsMobile } from './hooks/useIsMobile';
import GraveSiteList from './components/GraveSiteList';
import AddGraveForm from './components/AddGraveForm';
import AddGraveChooser from './components/AddGraveChooser';
import AddNowFlow from './components/AddNowFlow';
import Acknowledgements from './components/Acknowledgements';
import Login from './components/Login';
import './App.css';

// Custom Marker Icon
const createCustomIcon = (profession, isHighlighted) => {
  return L.divIcon({
    className: `custom-marker ${isHighlighted ? 'marker-highlight' : ''}`,
    html: `<div class="marker-pin"></div><div class="marker-shadow"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });
};

// Map Controller for programmatic movements
const MapController = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target, 18, {
        animate: true,
        duration: 1.5
      });
    }
  }, [target, map]);
  return null;
};

// Map Click Handler for Picking Location
const MapClickHandler = ({ isPicking, onLocationPicked }) => {
  const map = useMapEvents({
    click(e) {
      if (isPicking) {
        onLocationPicked(e.latlng);
      }
    },
    mousemove(e) {
      if (isPicking) {
        map.getContainer().style.cursor = 'crosshair';
      } else {
        map.getContainer().style.cursor = '';
      }
    }
  });
  return null;
};

function Home({ addMode, setAddMode }) {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const [mobileTab, setMobileTab] = useState('map'); // 'map' | 'list'
  const [graveSites, setGraveSites] = useState([]);
  const [hoveredGrave, setHoveredGrave] = useState(null);
  const [selectedGrave, setSelectedGrave] = useState(null); // For the independent popup
  const [flyToLocation, setFlyToLocation] = useState(null); // New state for navigation
  const [highlightedGraveId, setHighlightedGraveId] = useState(null); // For temporary highlight

  // States for Map Picker Mode
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickingFormState, setPickingFormState] = useState(null);

  useEffect(() => {
    fetchGraveSites();
  }, []);

  const fetchGraveSites = async () => {
    try {
      const { data, error } = await supabase
        .from('grave_sites')
        .select('*');

      if (error) throw error;

      const graveSitesList = data.map(item => ({
        ...item,
        derivedCoordinates: item.location?.coordinates || item.coordinates
      }));
      setGraveSites(graveSitesList);
    } catch (error) {
      console.error('Error fetching grave sites:', error);
    }
  };

  const handlePickLocationStart = (currentData, currentFiles) => {
    setPickingFormState({ formData: currentData, imageFiles: currentFiles });
    setIsPickingLocation(true);
    setAddMode(null);
  };

  const handleLocationPicked = (latlng) => {
    const updatedFormState = {
      ...pickingFormState,
      formData: {
        ...pickingFormState.formData,
        location: {
          ...pickingFormState.formData.location,
          coordinates: {
            lat: latlng.lat,
            lng: latlng.lng
          }
        }
      }
    };
    setPickingFormState(updatedFormState); // Update with new coords
    setIsPickingLocation(false);
    setAddMode('manual'); // Re-open form
  };

  const handleFormClose = () => {
    setAddMode(null);
    setPickingFormState(null); // Reset draft on cancel/close
  };

  const handleAddGrave = async (newGrave) => {
    try {
      // Only name is enforced here; flows that need stricter rules (the manual
      // form) validate before calling this handler.
      if (!newGrave.name) {
        throw new Error('Name is required');
      }

      const { data, error } = await supabase
        .from('grave_sites')
        .insert([newGrave])
        .select();

      if (error) throw error;

      const addedGrave = {
        ...data[0],
        derivedCoordinates: data[0].location?.coordinates || data[0].coordinates
      };

      setGraveSites([...graveSites, addedGrave]);
      handleFormClose(); // Close and reset
    } catch (error) {
      // Re-thrown so the calling flow (manual form or Add Now) surfaces it via
      // its own inline error message instead of swallowing it here.
      console.error('Failed to add grave site:', error);
      throw error;
    }
  };

  const handleGraveClickFromList = (site) => {
    setSelectedGrave(null); // Ensure card is closed
    if (site.derivedCoordinates) {
      setFlyToLocation([site.derivedCoordinates.lat, site.derivedCoordinates.lng]);

      // Trigger highlight
      setHighlightedGraveId(site.id);
      setTimeout(() => {
        setHighlightedGraveId(null);
      }, 1500); // 1.5 seconds highlight
    }
  };

  const mapBlock = (
    <div className="map-container">
      <MapContainer
          center={[31.5496, 74.3078]}
          zoom={16}
          minZoom={15}
          maxBounds={[
            [31.542694, 74.302972],
            [31.556556, 74.312750]
          ]}
          maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler isPicking={isPickingLocation} onLocationPicked={handleLocationPicked} />
          <MapController target={flyToLocation} />

          {graveSites.map((site) => {
            const position = site.derivedCoordinates ? [site.derivedCoordinates.lat, site.derivedCoordinates.lng] : null;
            if (!position) return null;

            const isHighlighted = site.id === highlightedGraveId;

            return (
              <Marker
                key={site.id}
                position={position}
                icon={createCustomIcon(site.profession, isHighlighted)}
                eventHandlers={{
                  mouseover: () => !isPickingLocation && setHoveredGrave(site),
                  mouseout: () => setHoveredGrave(null),
                  click: () => {
                    if (!isPickingLocation) {
                      setSelectedGrave(site);
                      setHoveredGrave(null); // Clear hover when clicked
                    }
                  }
                }}
              />
            );
          })}
        </MapContainer>

        {/* Hover Card (Only show if nothing is selected to avoid clutter) */}
        {hoveredGrave && !selectedGrave && (
          <div className="hover-card">
            <h3>{hoveredGrave.name}</h3>
            <span className="hover-profession">{hoveredGrave.profession}</span>
            <div className="hover-dates">
              {hoveredGrave.dateOfBirth ? new Date(hoveredGrave.dateOfBirth).getFullYear() : '?'} - {new Date(hoveredGrave.dateOfDeath).getFullYear()}
            </div>
            {hoveredGrave.topImage && (
              <img src={hoveredGrave.topImage} alt={hoveredGrave.name} className="hover-image" />
            )}
            {!hoveredGrave.topImage && hoveredGrave.images && hoveredGrave.images.length > 0 && (
              <img src={hoveredGrave.images[0]} alt={hoveredGrave.name} className="hover-image" />
            )}
            {!hoveredGrave.topImage && (!hoveredGrave.images || hoveredGrave.images.length === 0) && hoveredGrave.imageUrl && (
              <img src={hoveredGrave.imageUrl} alt={hoveredGrave.name} className="hover-image" />
            )}
            <p className="hover-intro">{hoveredGrave.intro ? hoveredGrave.intro.substring(0, 80) + '...' : ''}</p>
          </div>
        )}

        {/* Independent Detail Popup (Modal Style) */}
        {selectedGrave && (
          <div className="detail-popup-overlay" onClick={() => setSelectedGrave(null)}>
            <div className="detail-popup-card" onClick={(e) => e.stopPropagation()}>
              <button className="popup-close-btn" onClick={() => setSelectedGrave(null)}>×</button>

              <div className="popup-header">
                <h2>{selectedGrave.name}</h2>
                <span className="popup-profession-tag">{selectedGrave.profession}</span>
              </div>

              <div className="popup-dates-large">
                {selectedGrave.dateOfBirth ? new Date(selectedGrave.dateOfBirth).toLocaleDateString() : 'Unknown'} — {new Date(selectedGrave.dateOfDeath).toLocaleDateString()}
                {selectedGrave.age && <span className="popup-age"> (Age {selectedGrave.age})</span>}
              </div>

              {selectedGrave.causeOfDeath && (
                <div className="popup-meta">
                  <strong>Cause of Death:</strong> {selectedGrave.causeOfDeath}
                </div>
              )}

              {/* Image Carousel / Grid */}
              <div className="popup-images-scroll">
                {(selectedGrave.images || (selectedGrave.imageUrl ? [selectedGrave.imageUrl] : [])).map((img, idx) => (
                  <img key={idx} src={img} alt={`${selectedGrave.name} ${idx}`} className="popup-detail-image" />
                ))}
              </div>

              <div className="popup-body-text">
                <p>{selectedGrave.intro}</p>
              </div>

            </div>
          </div>
        )}

      </div>
  );

  return (
    <div className={`main-content ${isMobile ? 'mobile-view' : ''}`}>
      {isPickingLocation && (
        <div className="picking-mode-banner">
          <p>Click on the map to select the location</p>
          <button onClick={() => { setIsPickingLocation(false); setAddMode('manual'); }}>Cancel</button>
        </div>
      )}

      {/* Desktop: map + persistent sidebar list */}
      {!isMobile && (
        <>
          {mapBlock}
          <div className="sidebar">
            {addMode === 'manual' && (
              <AddGraveForm
                onSubmit={handleAddGrave}
                onClose={handleFormClose}
                onPickLocation={handlePickLocationStart}
                initialData={pickingFormState}
              />
            )}
            <GraveSiteList
              graveSites={graveSites}
              onGraveClick={handleGraveClickFromList}
            />
          </div>
        </>
      )}

      {/* Mobile (capture-first): Map / List toggle */}
      {isMobile && (
        <>
          <div className="mobile-tabs">
            <button
              className={mobileTab === 'map' ? 'active' : ''}
              onClick={() => setMobileTab('map')}
            >
              🗺️ Map
            </button>
            <button
              className={mobileTab === 'list' ? 'active' : ''}
              onClick={() => setMobileTab('list')}
            >
              📋 List ({graveSites.length})
            </button>
          </div>

          <div className="mobile-panel">
            {mobileTab === 'map' ? mapBlock : (
              <div className="mobile-list">
                <GraveSiteList
                  graveSites={graveSites}
                  onGraveClick={(site) => { setMobileTab('map'); handleGraveClickFromList(site); }}
                />
              </div>
            )}
          </div>

          {isAuthenticated && (
            <button className="mobile-fab" onClick={() => setAddMode('chooser')}>
              + Add Grave
            </button>
          )}

          {/* Manual form renders as a full-screen overlay on mobile. */}
          {addMode === 'manual' && (
            <AddGraveForm
              onSubmit={handleAddGrave}
              onClose={handleFormClose}
              onPickLocation={handlePickLocationStart}
              initialData={pickingFormState}
            />
          )}
        </>
      )}

      {addMode === 'chooser' && (
        <AddGraveChooser
          onClose={() => setAddMode(null)}
          onChooseNow={() => setAddMode('now')}
          onChooseManual={() => setAddMode('manual')}
        />
      )}

      {addMode === 'now' && (
        <AddNowFlow
          onSubmit={handleAddGrave}
          onClose={() => setAddMode(null)}
        />
      )}
    </div>
  );
}

function App() {
  // addMode: null | 'chooser' | 'manual' | 'now'
  const [addMode, setAddMode] = useState(null);
  const { isAuthenticated, logout } = useAuth();

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <h1>Lahore Graves</h1>
            <nav className="header-nav">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/acknowledgements" className="nav-link">Acknowledgements</Link>
            </nav>
          </div>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <button onClick={() => setAddMode('chooser')} className="add-button">
                  Add New Grave
                </button>
                <button onClick={logout} className="nav-link logout-button">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link login-link">Login</Link>
            )}
          </div>
        </header>
        <main className="app-body">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  addMode={isAuthenticated ? addMode : null}
                  setAddMode={setAddMode}
                />
              }
            />
            <Route path="/acknowledgements" element={<Acknowledgements />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;