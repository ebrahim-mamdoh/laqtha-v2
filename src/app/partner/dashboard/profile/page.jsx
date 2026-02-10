import React from 'react';
import ProfileForm from './_components/ProfileForm.client';
import { cookies } from 'next/headers';

async function getProfileData() {
    // Attempt to fetch from the API side
    const cookieStore = await cookies();
    const token = cookieStore.get('partner_accessToken');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

    try {
        const res = await fetch(`${apiUrl}/api/v2/partners/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                // Forward cookies if needed for session based auth
                'Cookie': cookieStore.toString()
            },
            cache: 'no-store' // ensure fresh data
        });

        if (!res.ok) {
            console.error('Failed to fetch profile:', res.status, res.statusText);
            // Fallback or throw
            return null;
        }

        return await res.json();
    } catch (e) {
        console.error('Error fetching profile:', e);
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
