import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CameraCapture from './CameraCapture';
import { uploadImageFiles } from '../utils/uploadImages';
import './AddNowFlow.css';

// Simple draggable pin icon (avoids Leaflet's default-icon webpack issue).
const pinIcon = L.divIcon({
  className: 'addnow-pin',
  html: '<div class="addnow-pin-dot"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Keeps the mini-map centered on the current coordinates.
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

const STEPS = { LOCATION: 0, PHOTOS: 1, DETAILS: 2 };

function AddNowFlow({ onSubmit, onClose }) {
  const [step, setStep] = useState(STEPS.LOCATION);

  // Location state
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [accuracy, setAccuracy] = useState(null);
  const [geoError, setGeoError] = useState('');
  const [locating, setLocating] = useState(false);

  // Photo state
  const [imageFiles, setImageFiles] = useState([]);

  // Details state — only name is required
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    dateOfBirth: '',
    dateOfDeath: '',
    age: '',
    causeOfDeath: '',
    address: '',
    section: '',
    intro: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const captureLocation = useCallback(() => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by this browser. Enter coordinates manually below.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setAccuracy(position.coords.accuracy);
        setLocating(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        let message = 'Unable to get your location.';
        if (err && err.code === err.PERMISSION_DENIED) {
          message = 'Location permission denied. Enter coordinates manually or allow access and retry.';
        }
        setGeoError(message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  // Auto-request location when the flow opens.
  useEffect(() => {
    captureLocation();
  }, [captureLocation]);

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setCoords({ lat, lng });
    setAccuracy(null); // manual adjustment supersedes GPS accuracy
  };

  const handleManualCoord = (field, value) => {
    const num = value === '' ? '' : parseFloat(value);
    setCoords((prev) => ({
      lat: field === 'lat' ? num : prev?.lat ?? '',
      lng: field === 'lng' ? num : prev?.lng ?? ''
    }));
  };

  const handleCapture = (file) => {
    setImageFiles((prev) => [...prev, file]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleField = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasValidCoords =
    coords &&
    typeof coords.lat === 'number' && !Number.isNaN(coords.lat) &&
    typeof coords.lng === 'number' && !Number.isNaN(coords.lng);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.name.trim()) {
      setSubmitError('Name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const imageUrls = await uploadImageFiles(imageFiles);

      const payload = {
        name: formData.name.trim(),
        profession: formData.profession.trim(),
        dateOfBirth: formData.dateOfBirth.trim() || null,
        dateOfDeath: formData.dateOfDeath.trim() || null,
        age: formData.age ? parseInt(formData.age, 10) : null,
        causeOfDeath: formData.causeOfDeath.trim(),
        location: {
          address: formData.address.trim(),
          section: formData.section.trim(),
          coordinates: hasValidCoords
            ? { lat: coords.lat, lng: coords.lng }
            : null
        },
        images: imageUrls,
        intro: formData.intro.trim(),
        createdAt: new Date().toISOString()
      };

      await onSubmit(payload);
      // Parent closes the flow on success.
    } catch (err) {
      console.error('Error saving grave (Add Now):', err);
      setSubmitError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const position = hasValidCoords ? [coords.lat, coords.lng] : null;

  return (
    <div className="addnow-overlay">
      <div className="addnow-panel">
        <header className="addnow-header">
          <button type="button" className="addnow-close" onClick={onClose} aria-label="Close">×</button>
          <h2>Add Grave — Now</h2>
          <div className="addnow-steps">
            <span className={step === STEPS.LOCATION ? 'active' : ''}>Location</span>
            <span className={step === STEPS.PHOTOS ? 'active' : ''}>Photos</span>
            <span className={step === STEPS.DETAILS ? 'active' : ''}>Details</span>
          </div>
        </header>

        <div className="addnow-body">
          {step === STEPS.LOCATION && (
            <div className="addnow-step">
              {locating && <p className="addnow-status">📍 Getting your location…</p>}
              {geoError && <div className="addnow-warn">{geoError}</div>}

              {hasValidCoords && (
                <>
                  <div className="addnow-coords">
                    <span>Lat: {Number(coords.lat).toFixed(6)}</span>
                    <span>Lng: {Number(coords.lng).toFixed(6)}</span>
                    {accuracy != null && <span className="addnow-accuracy">±{Math.round(accuracy)}m</span>}
                  </div>
                  <p className="addnow-hint">Drag the pin to the exact grave.</p>
                  <div className="addnow-map">
                    <MapContainer center={position} zoom={19} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                      />
                      <Marker
                        position={position}
                        icon={pinIcon}
                        draggable
                        eventHandlers={{ dragend: handleMarkerDragEnd }}
                      />
                      <RecenterMap position={position} />
                    </MapContainer>
                  </div>
                </>
              )}

              <div className="addnow-manual-coords">
                <label>
                  Latitude
                  <input
                    type="number"
                    step="any"
                    value={coords?.lat ?? ''}
                    onChange={(e) => handleManualCoord('lat', e.target.value)}
                  />
                </label>
                <label>
                  Longitude
                  <input
                    type="number"
                    step="any"
                    value={coords?.lng ?? ''}
                    onChange={(e) => handleManualCoord('lng', e.target.value)}
                  />
                </label>
              </div>

              <div className="addnow-actions">
                <button type="button" className="addnow-secondary" onClick={captureLocation} disabled={locating}>
                  {locating ? 'Locating…' : '↻ Re-detect'}
                </button>
                <button type="button" className="addnow-primary" onClick={() => setStep(STEPS.PHOTOS)}>
                  Next: Photos →
                </button>
              </div>
            </div>
          )}

          {step === STEPS.PHOTOS && (
            <div className="addnow-step">
              <CameraCapture onCapture={handleCapture} />

              {imageFiles.length > 0 && (
                <div className="addnow-thumbs">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="addnow-thumb">
                      <img src={URL.createObjectURL(file)} alt={`capture ${index + 1}`} />
                      <button type="button" onClick={() => removeImage(index)} aria-label="Remove">×</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="addnow-actions">
                <button type="button" className="addnow-secondary" onClick={() => setStep(STEPS.LOCATION)}>
                  ← Back
                </button>
                <button type="button" className="addnow-primary" onClick={() => setStep(STEPS.DETAILS)}>
                  Next: Details →
                </button>
              </div>
            </div>
          )}

          {step === STEPS.DETAILS && (
            <form className="addnow-step" onSubmit={handleSubmit}>
              {submitError && <div className="addnow-warn">{submitError}</div>}

              <div className="addnow-field">
                <label htmlFor="an-name">Name *</label>
                <input id="an-name" name="name" type="text" value={formData.name} onChange={handleField} required />
              </div>

              <div className="addnow-field">
                <label htmlFor="an-profession">Profession</label>
                <input id="an-profession" name="profession" type="text" value={formData.profession} onChange={handleField} />
              </div>

              <div className="addnow-grid">
                <div className="addnow-field">
                  <label htmlFor="an-age">Age</label>
                  <input id="an-age" name="age" type="number" value={formData.age} onChange={handleField} />
                </div>
                <div className="addnow-field">
                  <label htmlFor="an-cause">Cause of Death</label>
                  <input id="an-cause" name="causeOfDeath" type="text" value={formData.causeOfDeath} onChange={handleField} />
                </div>
              </div>

              <div className="addnow-grid">
                <div className="addnow-field">
                  <label htmlFor="an-dob">Date of Birth</label>
                  <input id="an-dob" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleField} />
                </div>
                <div className="addnow-field">
                  <label htmlFor="an-dod">Date of Death</label>
                  <input id="an-dod" name="dateOfDeath" type="date" value={formData.dateOfDeath} onChange={handleField} />
                </div>
              </div>

              <div className="addnow-field">
                <label htmlFor="an-address">Graveyard / Address</label>
                <input id="an-address" name="address" type="text" value={formData.address} onChange={handleField} />
              </div>

              <div className="addnow-field">
                <label htmlFor="an-section">Section</label>
                <input id="an-section" name="section" type="text" value={formData.section} onChange={handleField} />
              </div>

              <div className="addnow-field">
                <label htmlFor="an-intro">Introduction / Description</label>
                <textarea id="an-intro" name="intro" value={formData.intro} onChange={handleField} />
              </div>

              {!hasValidCoords && (
                <div className="addnow-warn">
                  No coordinates set — this grave won't appear on the map until coordinates are added.
                </div>
              )}

              <div className="addnow-actions">
                <button type="button" className="addnow-secondary" onClick={() => setStep(STEPS.PHOTOS)} disabled={submitting}>
                  ← Back
                </button>
                <button type="submit" className="addnow-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save Grave'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddNowFlow;
