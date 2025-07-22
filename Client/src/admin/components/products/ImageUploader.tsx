import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ImageUploader = ({ onUpload, onMainImageUpload, onAdditionalImagesUpload, onRemoveMainImage, onRemoveAdditionalImage, mainImagePreview, additionalImagePreviews }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector((state) => state.auth.token);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      // If onAdditionalImagesUpload is provided, handle multiple files
      if (typeof onAdditionalImagesUpload === 'function') {
        const urls = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append('image', file);
          const response = await fetch('http://localhost:5000/api/products/upload-image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });
          if (!response.ok) {
            throw new Error('Image upload failed');
          }
          const data = await response.json();
          urls.push(data.url);
        }
        onAdditionalImagesUpload(urls, files);
      } else if (typeof onMainImageUpload === 'function') {
        // Only one file for main image
        const file = files[0];
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('http://localhost:5000/api/products/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Image upload failed');
        }
        const data = await response.json();
        onMainImageUpload(data.url, file);
      } else if (typeof onUpload === 'function') {
        // Only one file for generic upload
        const file = files[0];
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('http://localhost:5000/api/products/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Image upload failed');
        }
        const data = await response.json();
        onUpload(data.url);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        {...(typeof onAdditionalImagesUpload === 'function' ? { multiple: true } : {})}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Optionally render previews if provided */}
      {mainImagePreview && (
        <div className="mt-2">
          <img src={mainImagePreview} alt="Main Preview" className="w-32 h-20 object-cover rounded border" />
          {onRemoveMainImage && (
            <button type="button" onClick={onRemoveMainImage} className="ml-2 text-red-500">Remove</button>
          )}
        </div>
      )}
      {additionalImagePreviews && additionalImagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {additionalImagePreviews.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={img} alt={`Preview ${idx + 1}`} className="w-20 h-16 object-cover rounded border" />
              {onRemoveAdditionalImage && (
                <button type="button" onClick={() => onRemoveAdditionalImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
