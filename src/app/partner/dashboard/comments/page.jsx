import React from 'react';
import CommentsDashboard from './_components/CommentsDashboard.client';

export const metadata = {
    title: 'التعليقات - لوحة تحكم الشريك',
    description: 'إدارة تعليقات وتقييمات العملاء',
};

async function getComments() {
    // Mock data based on screenshot
    const mockComment = {
        id: 1,
        userName: 'Mohamed Ahmed',
        itemName: 'اسم المنتج او الخدمة',
        rating: 5,
        text: 'جودة عالية في المنتج والتوصيل',
        date: '2025-10-15',
        avatarUrl: '/path/to/avatar.jpg' // Using placeholder in client component
    };

    return [
        { ...mockComment, id: 1 },
        { ...mockComment, id: 2 },
        { ...mockComment, id: 3 },
        { ...mockComment, id: 4 },
    ];
}

export default async function CommentsPage() {
    const comments = await getComments();

    return (
        <CommentsDashboard initialComments={comments} />
    );
}
