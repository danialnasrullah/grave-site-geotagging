import React from 'react';
import './AddGraveChooser.css';

// Lets the admin pick how to add a grave: capture on-site ("Add Now") or fill
// the full form by hand ("Add Manually").
function AddGraveChooser({ onClose, onChooseNow, onChooseManual }) {
  return (
    <div className="chooser-overlay" onClick={onClose}>
      <div className="chooser-card" onClick={(e) => e.stopPropagation()}>
        <button className="chooser-close" onClick={onClose} aria-label="Close">×</button>
        <h2>Add a Grave</h2>
        <p className="chooser-subtitle">How would you like to add it?</p>

        <div className="chooser-options">
          <button type="button" className="chooser-option chooser-now" onClick={onChooseNow}>
            <span className="chooser-icon">📍</span>
            <span className="chooser-option-title">Add Now</span>
            <span className="chooser-option-desc">
              Capture GPS &amp; photos on-site. Best on a phone at the grave.
            </span>
          </button>

          <button type="button" className="chooser-option chooser-manual" onClick={onChooseManual}>
            <span className="chooser-icon">📝</span>
            <span className="chooser-option-title">Add Manually</span>
            <span className="chooser-option-desc">
              Enter all details and pick the location on a map.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddGraveChooser;
