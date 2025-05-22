import React, { useState } from 'react';
import './AddGraveForm.css';

function AddGraveForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dateOfBirth: '',
    dateOfDeath: '',
    coordinates: {
      lat: '',
      lng: ''
    },
    imageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'lat' || name === 'lng') {
      setFormData({
        ...formData,
        coordinates: {
          ...formData.coordinates,
          [name]: parseFloat(value)
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Grave Site</h2>
        <button className="close-button" onClick={onClose}>×</button>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Death:</label>
            <input
              type="date"
              name="dateOfDeath"
              value={formData.dateOfDeath}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Coordinates:</label>
            <div className="coordinates-input">
              <input
                type="number"
                name="lat"
                placeholder="Latitude"
                value={formData.coordinates.lat}
                onChange={handleChange}
                step="any"
                required
              />
              <input
                type="number"
                name="lng"
                placeholder="Longitude"
                value={formData.coordinates.lng}
                onChange={handleChange}
                step="any"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Add Grave Site</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGraveForm; 