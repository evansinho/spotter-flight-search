import { NextRequest, NextResponse } from 'next/server';
import { amadeusServerClient } from '@/lib/api/amadeus-server';
import { Airport } from '@/types/flight';

interface AmadeusAirportResponse {
  data: Array<{
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    id: string;
    iataCode: string;
    address: {
      cityName: string;
      countryName: string;
    };
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    if (!keyword || keyword.length < 2) {
      return NextResponse.json({ data: [] });
    }

    const response = await amadeusServerClient.get<AmadeusAirportResponse>(
      '/v1/reference-data/locations',
      {
        subType: 'AIRPORT',
        keyword: keyword,
        'page[limit]': 10,
      }
    );

    const airports: Airport[] = response.data.map((location) => ({
      iataCode: location.iataCode,
      name: location.name,
      city: location.address.cityName,
      country: location.address.countryName,
      type: location.subType,
    }));

    return NextResponse.json({ data: airports });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to search airports' },
      { status: error.response?.status || 500 }
    );
  }
}