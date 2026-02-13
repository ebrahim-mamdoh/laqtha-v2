'use client';

import React from 'react';
import * as Yup from 'yup';

// Maps backend field types to Yup validators
const generateSchema = (fields = [], isDraft = false) => {

    // Core Schema Validation
    const coreSchema = {
        name: Yup.object({
            ar: Yup.string().required('الاسم بالعربية مطلوب'),
            en: Yup.string() // Optional based on contract description "name: { ar, en } and name is required. Usually both or just 1." Contract validation rules say "name.ar required". En is optional.
        }),
        description: Yup.object({
            ar: Yup.string().max(2000, 'الوصف طويل جداً'),
            en: Yup.string()
        }).nullable(),
        state: Yup.string().oneOf(['draft', 'inactive']),
    };

    // Attributes Schema Generation
    const attributesShape = {};

    fields.forEach(field => {
        let validator = getBaseValidatorForType(field.type);

        // Required Validation (Conditional on NOT draft)
        // If not draft => field.required applies
        // If draft => field.required is ignored
        if (field.required && !isDraft) {
            // For strings/numbers/booleans, strict required check
            validator = validator.required(`${field.label?.ar || field.key} مطلوب`);
        } else {
            // If optional or draft mode, allow null/undefined/empty string
            validator = validator.nullable().notRequired();
        }

        // Apply specific validation rules (min, max, length, pattern)
        if (field.validation) {
            const { min, max, minLength, maxLength, pattern } = field.validation;

            if (min !== undefined && (field.type === 'number' || field.type === 'decimal' || field.type === 'rating')) {
                validator = validator.min(min, `القيمة يجب أن تكون على الأقل ${min}`);
            }
            if (max !== undefined && (field.type === 'number' || field.type === 'decimal' || field.type === 'rating')) {
                validator = validator.max(max, `القيمة يجب أن لا تتجاوز ${max}`);
            }

            if (minLength !== undefined && (field.type === 'text' || field.type === 'textarea')) {
                validator = validator.min(minLength, `النص يجب أن يكون على الأقل ${minLength} حرف`);
            }
            if (maxLength !== undefined && (field.type === 'text' || field.type === 'textarea')) {
                validator = validator.max(maxLength, `النص يجب أن لا يتجاوز ${maxLength} حرف`);
            }

            if (pattern) {
                validator = validator.matches(new RegExp(pattern), 'تنسيق غير صحيح');
            }
        }

        // Add to attributes shape
        attributesShape[field.key] = validator;
    });

    return Yup.object().shape({
        ...coreSchema,
        attributes: Yup.object().shape(attributesShape)
    });
};

// Helper: Determine base Yup type
function getBaseValidatorForType(type) {
    switch (type) {
        case 'text':
        case 'textarea':
        case 'email':
        case 'phone':
        case 'url':
        case 'date':
        case 'time':
        case 'datetime':
        case 'select': // select value is string
            return Yup.string();

        case 'number':
        case 'rating':
            return Yup.number().integer('يجب ادخال رقم صحيح').typeError('يجب ادخال رقم');

        case 'decimal':
            return Yup.number().typeError('يجب ادخال رقم');

        case 'boolean':
            return Yup.boolean();

        case 'multiselect':
        case 'gallery':
            return Yup.array().of(Yup.string()); // array of strings

        case 'price':
            // Object { amount }
            return Yup.object().shape({
                amount: Yup.number().typeError('السعر يجب أن يكون رقم')
            });

        case 'location':
            // Object { lat, lng }
            return Yup.object().shape({
                lat: Yup.number(),
                lng: Yup.number()
            });

        case 'timeRange':
            // Object { start, end }
            return Yup.object().shape({
                start: Yup.string(),
                end: Yup.string()
            });

        default:
            return Yup.mixed(); // fallback
    }
}

export default generateSchema;
