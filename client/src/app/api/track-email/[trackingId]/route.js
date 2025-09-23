import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { trackingId } = params;
  
  try {
    // Forward the request to the backend tracking endpoint
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
    const response = await fetch(`${API_BASE}/newsletter-subscriptions/track-email/${trackingId}`, {
      method: 'GET',
      headers: {
        'User-Agent': request.headers.get('user-agent') || '',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || '',
      }
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': buffer.byteLength.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } else {
      // Return a 1x1 transparent pixel even if tracking fails
      const pixel = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64'
      );
      
      return new NextResponse(pixel, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': pixel.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  } catch (error) {
    console.error('Email tracking error:', error);
    
    // Return a 1x1 transparent pixel on error
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );
    
    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': pixel.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}
