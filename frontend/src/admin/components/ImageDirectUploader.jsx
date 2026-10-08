import { useState, useRef } from 'react';
import { uploadMediaApi } from '../../services/api';

export default function ImageDirectUploader({
  value = '',
  onChange,
  label = 'Upload Image from PC',
  required = false,
  helperText = 'Accepts JPG, JPEG, PNG, WEBP, GIF, SVG, BMP, TIFF, AVIF',
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Check file is an image or valid extension
    const isImage =
      file.type.startsWith('image/') ||
      /\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff|tif|avif|heic|heif|ico|jfif)$/i.test(file.name);

    if (!isImage) {
      setUploadError('Please select a valid image file (JPG, JPEG, PNG, WEBP, SVG, etc.)');
      return;
    }

    setUploadError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));

      const res = await uploadMediaApi(formData);
      if (res?.data?.url) {
        onChange(res.data.url);
      } else {
        throw new Error('Server did not return a valid file URL');
      }
    } catch (err) {
      console.error('Direct upload error:', err);
      // Fallback: Read as data URL if backend offline
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      setUploadError('Note: Image saved locally for preview.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="admin-form-group direct-image-uploader-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ margin: 0 }}>
          {label} {required && <span className="req">*</span>}
        </label>
        <button
          type="button"
          className="btn-link"
          style={{ fontSize: '0.75rem', color: '#fbbf24', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setShowUrlInput(!showUrlInput)}
        >
          {showUrlInput ? '📁 Switch to File Upload' : '🔗 Enter URL manually'}
        </button>
      </div>

      {showUrlInput ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            required={required}
            placeholder="/images/... or /uploads/... or https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      ) : (
        <div
          className={`direct-upload-dropzone ${dragOver ? 'dragover' : ''} ${value ? 'has-image' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.svg,.bmp,.tiff,.tif,.avif,.jfif,.heic"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />

          {value ? (
            <div className="upload-preview-container" onClick={(e) => e.stopPropagation()}>
              <div className="preview-image-box">
                <img
                  src={value}
                  alt="Selected Preview"
                  onError={(e) => {
                    e.target.src = '/images/bokul_rope_works_hero.webp';
                  }}
                />
              </div>
              <div className="preview-info-box">
                <div className="preview-status-pill">
                  {uploading ? '⏳ Uploading...' : '✓ Image Selected'}
                </div>
                <div className="preview-path-text" title={value}>
                  <code>{value}</code>
                </div>
                <div className="preview-actions-row">
                  <button
                    type="button"
                    className="btn-outline btn-xs"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    📁 Choose Different Image
                  </button>
                  <button
                    type="button"
                    className="btn-danger btn-xs"
                    onClick={() => onChange('')}
                    disabled={uploading}
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="upload-prompt-box">
              <div className="upload-icon-circle">
                {uploading ? '⏳' : '📁'}
              </div>
              <div className="upload-prompt-text">
                <strong>{uploading ? 'Uploading image to server...' : 'Click to browse image from your PC'}</strong>
                <span>or drag & drop your image file here</span>
              </div>
              <span className="upload-helper-badge">{helperText}</span>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '6px' }}>
          ⚠️ {uploadError}
        </div>
      )}
    </div>
  );
}
