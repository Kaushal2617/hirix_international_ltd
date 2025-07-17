import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ImageUploader = ({ onUpload, onMainImageUpload, onAdditionalImagesUpload, onRemoveMainImage, onRemoveAdditionalImage, mainImagePreview, additionalImagePreviews }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector((state) => state.auth.token);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
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
      if (typeof onUpload === 'function') {
        onUpload(data.url);
      } else if (typeof onMainImageUpload === 'function') {
        onMainImageUpload(data.url, file);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
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
