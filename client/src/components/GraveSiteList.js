import React, { useState } from 'react';
import './GraveSiteList.css';

function GraveSiteList({ graveSites }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="grave-site-list">
      <h2>Grave Sites</h2>
      <div className="sites-container">
        {graveSites.map((site, index) => (
          <div key={site._id} className="grave-site-card">
            <h3>{site.name}</h3>
            <p className="profession">{site.profession}</p>
            <p className="description">{site.description}</p>
            <div className="dates">
              {site.dateOfBirth && <p>Born: {new Date(site.dateOfBirth).toLocaleDateString()}</p>}
              {site.dateOfDeath && <p>Died: {new Date(site.dateOfDeath).toLocaleDateString()}</p>}
            </div>
            <img 
              src={`/Images/${index + 1}.jpg`} 
              alt={site.name} 
              className="grave-image"
              onClick={() => handleImageClick(`/Images/${index + 1}.jpg`)}
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <img src={selectedImage} alt="Enlarged view" className="enlarged-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default GraveSiteList; 