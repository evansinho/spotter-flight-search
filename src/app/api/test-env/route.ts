import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasApiKey: !!process.env.AMADEUS_API_KEY,
    hasApiSecret: !!process.env.AMADEUS_API_SECRET,
    hasApiUrl: !!process.env.AMADEUS_API_URL,
    apiKeyPrefix: process.env.AMADEUS_API_KEY?.substring(0, 4) || 'none',
    apiUrl: process.env.AMADEUS_API_URL || 'none',
    nodeEnv: process.env.NODE_ENV,
  });
}
