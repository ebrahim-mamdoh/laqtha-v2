'use client';
import React from 'react';
import { TextField, NumberField, SelectField, BooleanField, TextareaField } from './fields/CoreFields.client';
import { PriceField, TimeRangeField, FileUploadField, LocationField } from './fields/ComplexFields.client';

export const FieldRenderer = ({ field, form }) => {
    switch (field.type) {
        case 'text':
        case 'email':
        case 'url':
        case 'phone':
            return <TextField field={field} form={form} />;

        case 'number':
        case 'decimal':
        case 'rating':
            return <NumberField field={field} form={form} />;

        case 'textarea':
            return <TextareaField field={field} form={form} />;

        case 'select':
            return <SelectField field={field} form={form} />;

        case 'boolean':
            return <BooleanField field={field} form={form} />;

        case 'price':
            return <PriceField field={field} form={form} />;

        case 'timeRange':
            return <TimeRangeField field={field} form={form} />;

        case 'image':
        case 'gallery':
            return <FileUploadField field={field} form={form} />;

        case 'location':
            return <LocationField field={field} form={form} />;

        // Fallback for types like date, time, datetime (use text input for now with type override inside TextField or separate if rigorous)
        case 'date':
        case 'time':
        case 'datetime':
            // Can use TextField logic which supports type override via props
            return <TextField field={field} form={form} type={field.type === 'datetime' ? 'datetime-local' : field.type} />;

        default:
            console.warn(`Unsupported field type: ${field.type}`);
            return null;
    }
};
