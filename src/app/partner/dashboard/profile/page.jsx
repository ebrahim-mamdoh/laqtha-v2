import React from 'react';
import ProfileForm from './_components/ProfileForm.client';
import { cookies } from 'next/headers';


import apiClient from '@/lib/api';

async function getProfileData() {
    // Attempt to fetch from the API side
    const cookieStore = await cookies();
    const token = cookieStore.get('partner_accessToken');

    try {
        const res = await apiClient.get('/v2/partners/me', {
            headers: {
                'Authorization': `Bearer ${token?.value}`,
                // Forward cookies if needed for session based auth
                'Cookie': cookieStore.toString()
            }
        });

        return res.data;
    } catch (e) {
        console.error('Error fetching profile:', e.message); // Cleaned up error logging
        return null;
    }
}


export default async function ProfilePage() {
    const data = await getProfileData();

    // If fetch failed, we might want to show an error or use a safe fallback
    const initialData = data || {
        success: false,
        data: {
            partner: {
                contactPerson: {},
                address: {},
                media: { images: [], documents: [] },
                businessName: '',
                email: '',
                phone: '',
                website: '',
                state: '',
                permissions: {}
            }
        }
    };

    return (
        <ProfileForm initialData={initialData} />
    );
}
