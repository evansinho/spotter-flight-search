import { amadeusClient } from './amadeus';
import {
  Airport,
  AirportSearchResponse,
  FlightOffersResponse,
  SearchParams,
} from '@/types/flight';

/**
 * Search for airports by keyword (city, airport name, or IATA code)
 */
export async function searchAirports(keyword: string): Promise<Airport[]> {
  if (!keyword || keyword.length < 2) {
    return [];
  }

  try {
    const response = await amadeusClient.get<AirportSearchResponse>(
      '/v1/reference-data/locations',
      {
        keyword: keyword.trim(),
        subType: 'AIRPORT,CITY',
        'page[limit]': 10,
      }
    );

    return response.data.map((location) => ({
      iataCode: location.iataCode,
      name: location.name,
      city: location.address?.cityName || location.name,
      country: location.address?.countryName || '',
      type: location.subType,
    }));
  } catch (error: any) {
    console.error('Error searching airports:', error);

    // Return empty array on error instead of throwing
    // This prevents the UI from breaking during development
    return [];
  }
}

/**
 * Search for flight offers
 */
export async function searchFlightOffers(
  params: SearchParams
): Promise<FlightOffersResponse> {
  try {
    const queryParams: Record<string, any> = {
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults,
      currencyCode: params.currencyCode || 'USD',
      max: params.max || 50,
    };

    // Add optional parameters
    if (params.returnDate) {
      queryParams.returnDate = params.returnDate;
    }

    if (params.children) {
      queryParams.children = params.children;
    }

    if (params.infants) {
      queryParams.infants = params.infants;
    }

    if (params.travelClass) {
      queryParams.travelClass = params.travelClass;
    }

    const response = await amadeusClient.get<FlightOffersResponse>(
      '/v2/shopping/flight-offers',
      queryParams
    );

    return response;
  } catch (error: any) {
    console.error('Error searching flight offers:', error);

    // Return detailed error information
    if (error.response?.data?.errors) {
      throw new Error(
        error.response.data.errors[0]?.detail || 'Failed to search flights'
      );
    }

    throw new Error('Failed to search flights. Please try again.');
  }
}

/**
 * Get flight price confirmation
 * This endpoint can be used to confirm the price before booking
 */
export async function confirmFlightPrice(
  flightOffer: any
): Promise<FlightOffersResponse> {
  try {
    const response = await amadeusClient.post<FlightOffersResponse>(
      '/v1/shopping/flight-offers/pricing',
      {
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [flightOffer],
        },
      }
    );

    return response;
  } catch (error: any) {
    console.error('Error confirming flight price:', error);
    throw new Error('Failed to confirm flight price');
  }
}
