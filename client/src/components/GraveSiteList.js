import React, { useState } from 'react';
import './GraveSiteList.css';

function GraveSiteList({ graveSites, onGraveClick }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedIntros, setExpandedIntros] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    name: true,
    profession: true,
    dateOfDeath: true
  });

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const toggleIntro = (siteId) => {
    setExpandedIntros(prev => ({
      ...prev,
      [siteId]: !prev[siteId]
    }));
  };

  const truncateIntro = (intro, siteId) => {
    if (!intro) return '';
    const words = intro.split(' ');
    if (words.length <= 30 || expandedIntros[siteId]) {
      return intro;
    }
    return words.slice(0, 30).join(' ') + '...';
  };

  const handleFilterChange = (filter) => {
    setSearchFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const filteredGraveSites = graveSites.filter(site => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const matchesName = searchFilters.name && site.name.toLowerCase().includes(query);
    const matchesProfession = searchFilters.profession && site.profession?.toLowerCase().includes(query);
    const matchesDateOfDeath = searchFilters.dateOfDeath &&
      site.dateOfDeath &&
      new Date(site.dateOfDeath).toLocaleDateString().includes(query);

    return matchesName || matchesProfession || matchesDateOfDeath;
  });

  return (
    <div className="grave-site-list">
      <h2>Grave Sites</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search graves..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="search-filters">
          <label className="filter-label">
            <input
              type="checkbox"
              checked={searchFilters.name}
              onChange={() => handleFilterChange('name')}
            />
            Name
          </label>
          <label className="filter-label">
            <input
              type="checkbox"
              checked={searchFilters.profession}
              onChange={() => handleFilterChange('profession')}
            />
            Profession
          </label>
          <label className="filter-label">
            <input
              type="checkbox"
              checked={searchFilters.dateOfDeath}
              onChange={() => handleFilterChange('dateOfDeath')}
            />
            Date of Death
          </label>
        </div>
      </div>
      <div className="sites-container">
        {filteredGraveSites.map((site) => (
          <div key={site.id} className="grave-site-card">
            <h3
              onClick={() => onGraveClick(site)}
              className="clickable-name"
              title="Click to locate on map"
            >
              {site.name} 📍
            </h3>
            {site.profession && <p className="profession">{site.profession}</p>}

            <div className="details-grid">
              {site.age && <p><strong>Age:</strong> {site.age} years</p>}
              {site.causeOfDeath && <p><strong>Cause of Death:</strong> {site.causeOfDeath}</p>}
              {site.location?.address && <p><strong>Address:</strong> {site.location.address}</p>}
              {site.location?.section && <p><strong>Section:</strong> {site.location.section}</p>}
            </div>

            {site.dateOfBirth && site.dateOfDeath && (
              <p className="dates">
                {new Date(site.dateOfBirth).toLocaleDateString()} - {new Date(site.dateOfDeath).toLocaleDateString()}
              </p>
            )}

            {site.intro && (
              <div className="intro-container">
                <p className="intro">{truncateIntro(site.intro, site.id)}</p>
                {site.intro.split(' ').length > 30 && (
                  <button
                    className="see-more-button"
                    onClick={() => toggleIntro(site.id)}
                  >
                    {expandedIntros[site.id] ? 'Show less' : 'See more'}
                  </button>
                )}
              </div>
            )}

            {/* Support for multiple images */}
            {site.images && site.images.length > 0 ? (
              <div className="images-grid">
                {site.images.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Grave of ${site.name} - ${idx + 1}`}
                    className="grave-image"
                    onClick={() => handleImageClick(imgUrl)}
                    crossOrigin="anonymous"
                  />
                ))}
              </div>
            ) : site.imageUrl ? (
              // Fallback for legacy data
              <img
                src={site.imageUrl}
                alt={`Grave of ${site.name}`}
                className="grave-image"
                onClick={() => handleImageClick(site.imageUrl)}
                crossOrigin="anonymous"
              />
            ) : null}

          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="enlarged-image"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GraveSiteList; 