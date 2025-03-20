import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const lang = formData.get('lang') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Forward the file to your backend
        const backendFormData = new FormData();
        backendFormData.append('file', file);
        backendFormData.append('language', lang);

        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
            method: 'POST',
            body: backendFormData,
        });

        if (!backendResponse.ok) {
            console.error('Backend upload failed:', backendResponse.statusText);
            throw new Error('Backend upload failed');
        }

        const data = await backendResponse.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'File upload failed' },
            { status: 500 }
        );
    }
}

// Increase the limit for file uploads (optional, adjust as needed)
export const config = {
    api: {
        bodyParser: false,
    },
}; 