import { NextRequest, NextResponse } from 'next/server';
import { amadeusServerClient } from '@/lib/api/amadeus-server';
import { FlightOffer } from '@/types/flight';

interface AmadeusFlightSearchResponse {
  data: FlightOffer[];
  meta?: {
    count: number;
    links?: {
      self: string;
    };
  };
  dictionaries?: {
    carriers?: Record<string, string>;
    aircraft?: Record<string, string>;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params: Record<string, any> = {
      originLocationCode: searchParams.get('originLocationCode'),
      destinationLocationCode: searchParams.get('destinationLocationCode'),
      departureDate: searchParams.get('departureDate'),
      adults: searchParams.get('adults') || '1',
      max: searchParams.get('max') || '50',
    };

    // Optional parameters
    const returnDate = searchParams.get('returnDate');
    const children = searchParams.get('children');
    const travelClass = searchParams.get('travelClass');
    const nonStop = searchParams.get('nonStop');
    const maxPrice = searchParams.get('maxPrice');
    const currencyCode = searchParams.get('currencyCode');

    if (returnDate) params.returnDate = returnDate;
    if (children) params.children = children;
    if (travelClass) params.travelClass = travelClass;
    if (nonStop) params.nonStop = nonStop === 'true';
    if (maxPrice) params.maxPrice = maxPrice;
    if (currencyCode) params.currencyCode = currencyCode;

    const response = await amadeusServerClient.get<AmadeusFlightSearchResponse>(
      '/v2/shopping/flight-offers',
      params
    );

    return NextResponse.json({
      data: response.data,
      meta: response.meta,
      dictionaries: response.dictionaries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to search flights' },
      { status: error.response?.status || 500 }
    );
  }
}