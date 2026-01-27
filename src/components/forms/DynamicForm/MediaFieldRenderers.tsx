'use client';

import React, { useRef, useState, useCallback } from 'react';
import type { FieldRendererProps } from './types';
import styles from './MediaFieldRenderers.module.css';

/* ============================================================================
   Image Field Renderer
   ============================================================================ */

interface ImageValue {
  url?: string;
  file?: File;
  preview?: string;
}

export function ImageFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageValue = value as ImageValue | undefined;
  const previewUrl = imageValue?.preview || imageValue?.url;
  
  const accept = (field as { accept?: string }).accept || 'image/*';
  const maxSize = (field as { maxSize?: number }).maxSize || 5 * 1024 * 1024; // 5MB default
  const previewWidth = (field as { previewWidth?: number }).previewWidth || 200;
  const previewHeight = (field as { previewHeight?: number }).previewHeight || 200;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      alert(`حجم الملف يجب أن لا يتجاوز ${Math.round(maxSize / 1024 / 1024)} ميجابايت`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({
        file,
        preview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={styles.fieldWrapper} onBlur={onBlur}>
      <label className={styles.fieldLabel}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
      </label>
      
      <div className={styles.imageUploader}>
        {previewUrl ? (
          <div className={styles.imagePreviewWrapper}>
            <img
              src={previewUrl}
              alt="معاينة الصورة"
              className={styles.imagePreview}
              style={{ maxWidth: previewWidth, maxHeight: previewHeight }}
            />
            <div className={styles.imageActions}>
              <button
                type="button"
                className={styles.changeButton}
                onClick={handleClick}
                disabled={disabled || field.disabled}
              >
                تغيير
              </button>
              <button
                type="button"
                className={styles.removeButton}
                onClick={handleRemove}
                disabled={disabled || field.disabled}
              >
                حذف
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.uploadButton}
            onClick={handleClick}
            disabled={disabled || field.disabled}
          >
            <UploadIcon />
            <span>اختر صورة</span>
          </button>
        )}
        
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled || field.disabled}
          className={styles.hiddenInput}
        />
      </div>

      {field.helperText && <p className={styles.helperText}>{field.helperText}</p>}
      {touched && error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

/* ============================================================================
   Gallery Field Renderer
   ============================================================================ */

interface GalleryItem {
  id: string;
  url?: string;
  file?: File;
  preview?: string;
}

export function GalleryFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const images = (value as GalleryItem[] | undefined) || [];
  
  const accept = (field as { accept?: string }).accept || 'image/*';
  const maxSize = (field as { maxSize?: number }).maxSize || 5 * 1024 * 1024;
  const maxImages = (field as { maxImages?: number }).maxImages || 10;
  const minImages = (field as { minImages?: number }).minImages || 0;

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Check max images limit
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`الحد الأقصى للصور هو ${maxImages}`);
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    const newImages: GalleryItem[] = [];

    filesToAdd.forEach((file, index) => {
      if (file.size > maxSize) {
        alert(`حجم الملف ${file.name} يتجاوز الحد المسموح`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({
          id: `new-${Date.now()}-${index}`,
          file,
          preview: reader.result as string,
        });

        // Update when all files are processed
        if (newImages.length === filesToAdd.filter(f => f.size <= maxSize).length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onChange(images.filter(img => img.id !== id));
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={styles.fieldWrapper} onBlur={onBlur}>
      <label className={styles.fieldLabel}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
        <span className={styles.imageCount}>({images.length}/{maxImages})</span>
      </label>
      
      <div className={styles.gallery}>
        {images.map((image) => (
          <div key={image.id} className={styles.galleryItem}>
            <img
              src={image.preview || image.url}
              alt="صورة في المعرض"
              className={styles.galleryImage}
            />
            <button
              type="button"
              className={styles.galleryRemoveButton}
              onClick={() => handleRemove(image.id)}
              disabled={disabled || field.disabled}
              aria-label="حذف الصورة"
            >
              ×
            </button>
          </div>
        ))}
        
        {canAddMore && (
          <button
            type="button"
            className={styles.galleryAddButton}
            onClick={handleClick}
            disabled={disabled || field.disabled}
          >
            <UploadIcon />
            <span>إضافة</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFilesChange}
        disabled={disabled || field.disabled}
        className={styles.hiddenInput}
      />

      {field.helperText && <p className={styles.helperText}>{field.helperText}</p>}
      {minImages > 0 && (
        <p className={styles.helperText}>الحد الأدنى للصور: {minImages}</p>
      )}
      {touched && error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

/* ============================================================================
   Location Field Renderer
   ============================================================================ */

interface LocationValue {
  lat?: number;
  lng?: number;
  address?: string;
}

export function LocationFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const locationValue = (value as LocationValue) || {};
  
  const showMap = (field as { showMap?: boolean }).showMap ?? true;
  const defaultCenter = (field as { defaultCenter?: { lat: number; lng: number } }).defaultCenter || {
    lat: 24.7136,
    lng: 46.6753, // Riyadh default
  };

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('تحديد الموقع غير مدعوم في هذا المتصفح');
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Location error:', error);
        alert('تعذر الحصول على الموقع الحالي');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = e.target.value ? parseFloat(e.target.value) : undefined;
    onChange({ ...locationValue, lat });
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lng = e.target.value ? parseFloat(e.target.value) : undefined;
    onChange({ ...locationValue, lng });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...locationValue, address: e.target.value });
  };

  const hasCoordinates = locationValue.lat !== undefined && locationValue.lng !== undefined;

  return (
    <div className={styles.fieldWrapper} onBlur={onBlur}>
      <label className={styles.fieldLabel}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
      </label>
      
      <div className={styles.locationWrapper}>
        {/* Address Input */}
        <div className={styles.addressInput}>
          <input
            type="text"
            placeholder="العنوان (اختياري)"
            value={locationValue.address || ''}
            onChange={handleAddressChange}
            disabled={disabled || field.disabled}
            className={styles.input}
          />
        </div>

        {/* Coordinate Inputs */}
        <div className={styles.coordinateInputs}>
          <div className={styles.coordinateInput}>
            <label className={styles.coordinateLabel}>خط العرض</label>
            <input
              type="number"
              step="0.000001"
              placeholder="24.7136"
              value={locationValue.lat ?? ''}
              onChange={handleLatChange}
              disabled={disabled || field.disabled}
              className={styles.input}
              dir="ltr"
            />
          </div>
          <div className={styles.coordinateInput}>
            <label className={styles.coordinateLabel}>خط الطول</label>
            <input
              type="number"
              step="0.000001"
              placeholder="46.6753"
              value={locationValue.lng ?? ''}
              onChange={handleLngChange}
              disabled={disabled || field.disabled}
              className={styles.input}
              dir="ltr"
            />
          </div>
        </div>

        {/* Get Location Button */}
        <button
          type="button"
          className={styles.locationButton}
          onClick={handleGetCurrentLocation}
          disabled={disabled || field.disabled || isLoadingLocation}
        >
          {isLoadingLocation ? (
            <>
              <LoadingSpinner />
              <span>جاري التحديد...</span>
            </>
          ) : (
            <>
              <LocationIcon />
              <span>تحديد موقعي الحالي</span>
            </>
          )}
        </button>

        {/* Map Preview (placeholder - would integrate with actual map library) */}
        {showMap && hasCoordinates && (
          <div className={styles.mapPreview}>
            <div className={styles.mapPlaceholder}>
              <LocationIcon />
              <p>
                الموقع: {locationValue.lat?.toFixed(6)}, {locationValue.lng?.toFixed(6)}
              </p>
              <small>لعرض الخريطة التفاعلية، قم بدمج Google Maps أو Mapbox</small>
            </div>
          </div>
        )}
      </div>

      {field.helperText && <p className={styles.helperText}>{field.helperText}</p>}
      {touched && error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

/* ============================================================================
   Icons
   ============================================================================ */

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
      <path
        d="M12 2a10 10 0 019.95 9.5"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default {
  ImageFieldRenderer,
  GalleryFieldRenderer,
  LocationFieldRenderer,
};
