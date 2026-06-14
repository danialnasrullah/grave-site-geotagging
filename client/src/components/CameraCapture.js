import React, { useRef, useState, useEffect, useCallback } from 'react';
import './CameraCapture.css';

// Live in-app camera with a headstone framing overlay. Captures the current
// video frame to a File and hands it back via onCapture(file). Falls back to a
// gallery picker when the camera is unavailable or permission is denied.
function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setError('');
    setReady(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera not supported on this device/browser. Use "Upload from gallery" instead.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setReady(true);
    } catch (err) {
      console.error('Camera error:', err);
      let message = 'Unable to access the camera.';
      if (err && err.name === 'NotAllowedError') {
        message = 'Camera permission was denied. Allow camera access or use "Upload from gallery".';
      } else if (err && err.name === 'NotFoundError') {
        message = 'No camera found on this device. Use "Upload from gallery" instead.';
      }
      setError(message + '');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return stopStream;
  }, [startCamera, stopStream]);

  const handleShutter = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !ready) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      setError('Camera is still warming up — try again in a moment.');
      return;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Failed to capture the photo. Please try again.');
          return;
        }
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      },
      'image/jpeg',
      0.9
    );
  };

  const handleGalleryChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    files.forEach((file) => onCapture(file));
    // Reset so selecting the same file again still fires onChange.
    e.target.value = '';
  };

  return (
    <div className="camera-capture">
      <div className="camera-viewport">
        {!error && (
          <>
            <video
              ref={videoRef}
              className="camera-video"
              playsInline
              muted
            />
            {/* Headstone framing guide: fit the whole grave, foot to headstone, inside the outline */}
            <svg className="camera-overlay" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet">
              <path
                d="M30 130 L30 50 Q30 20 50 20 Q70 20 70 50 L70 130 Z"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <line x1="22" y1="130" x2="78" y2="130" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
            </svg>
            <div className="camera-hint">Fit the whole grave — foot to headstone — inside the outline</div>
          </>
        )}

        {error && (
          <div className="camera-error">
            <p>{error}</p>
            <button type="button" className="camera-retry" onClick={startCamera}>
              Retry camera
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="camera-actions">
        <button
          type="button"
          className="camera-shutter"
          onClick={handleShutter}
          disabled={!ready || !!error}
          aria-label="Capture photo"
        />
        <button
          type="button"
          className="camera-gallery-btn"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          Upload from gallery
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleGalleryChange}
        />
      </div>
    </div>
  );
}

export default CameraCapture;
