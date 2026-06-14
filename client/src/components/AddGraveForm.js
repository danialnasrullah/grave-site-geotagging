import React, { useState } from 'react';
import { uploadImageFiles } from '../utils/uploadImages';
import './AddGraveForm.css';

function AddGraveForm({ onClose, onSubmit, onPickLocation, initialData }) {
  const [formData, setFormData] = useState(initialData?.formData || {
    name: '',
    profession: '',
    dateOfBirth: '',
    dateOfDeath: '',
    age: '',
    causeOfDeath: '',
    location: {
      address: '',
      section: '',
      coordinates: {
        lat: '',
        lng: ''
      }
    },
    images: [],
    intro: ''
  });
  const [imageFiles, setImageFiles] = useState(initialData?.imageFiles || []);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleCurrentLocation = () => {
    setGettingLocation(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }
        }));
        setGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to retrieve your location');
        setGettingLocation(false);
      }
    );
  };

  const handlePickOnMap = () => {
    // Pass current state back up to App
    onPickLocation(formData, imageFiles);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['lat', 'lng'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: {
            ...prev.location.coordinates,
            [name]: value
          }
        }
      }));
    } else if (['address', 'section'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ... rest of file handlers ... (no change needed for handleFileChange etc) ...

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      if (!formData.name || !formData.age || !formData.dateOfDeath || !formData.location.coordinates.lat || !formData.location.coordinates.lng) {
        throw new Error('Please fill in all required fields');
      }

      // Upload images first
      const imageUrls = await uploadImageFiles(imageFiles);

      const formattedData = {
        name: formData.name.trim(),
        profession: formData.profession.trim(),
        dateOfBirth: formData.dateOfBirth.trim(),
        dateOfDeath: formData.dateOfDeath.trim(),
        age: parseInt(formData.age),
        causeOfDeath: formData.causeOfDeath.trim(),
        location: {
          address: formData.location.address.trim(),
          section: formData.location.section.trim(),
          coordinates: {
            lat: parseFloat(formData.location.coordinates.lat),
            lng: parseFloat(formData.location.coordinates.lng)
          }
        },
        images: imageUrls,
        intro: formData.intro.trim(),
        createdAt: new Date().toISOString()
      };

      await onSubmit(formattedData);
      // onClose is handled by parent on success
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Grave Site</h2>
        <button className="close-button" onClick={onClose}>×</button>

        <form onSubmit={handleSubmit} className="add-grave-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="profession">Profession</label>
            <input type="text" id="profession" name="profession" value={formData.profession} onChange={handleChange} />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="causeOfDeath">Cause of Death</label>
              <input type="text" id="causeOfDeath" name="causeOfDeath" value={formData.causeOfDeath} onChange={handleChange} />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfDeath">Date of Death *</label>
              <input type="date" id="dateOfDeath" name="dateOfDeath" value={formData.dateOfDeath} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Location (Graveyard/Address)</label>
            <input type="text" name="address" placeholder="Graveyard Name or Address" value={formData.location.address} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Section</label>
            <input type="text" name="section" placeholder="Grave Section (optional)" value={formData.location.section} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Coordinates *</label>

            <div className="location-actions">
              <button type="button" className="secondary-btn" onClick={handleCurrentLocation} disabled={gettingLocation}>
                {gettingLocation ? 'Locating...' : '📍 Use Current Location'}
              </button>
              <button type="button" className="secondary-btn" onClick={handlePickOnMap}>
                🗺️ Choose on Map
              </button>
            </div>

            <div className="coordinates-input">
              <input type="number" name="lat" placeholder="Latitude" value={formData.location.coordinates.lat} onChange={handleChange} step="any" required />
              <input type="number" name="lng" placeholder="Longitude" value={formData.location.coordinates.lng} onChange={handleChange} step="any" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="intro">Introduction / Description</label>
            <textarea id="intro" name="intro" value={formData.intro} onChange={handleChange} placeholder="A brief description..." />
          </div>

          <div className="form-group">
            <label>Images</label>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            <div className="file-list">
              {imageFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <span>{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="remove-file-btn">Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={uploading}>Cancel</button>
            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading & Saving...' : 'Add Grave Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGraveForm;