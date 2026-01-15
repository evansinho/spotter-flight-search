// Airport and Location Types
export interface Airport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
  type?: string;
}

// Search Parameters
export interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  currencyCode?: string;
  max?: number;
}

// Flight Segment
export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string; // ISO 8601 datetime
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string; // ISO 8601 datetime
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string; // ISO 8601 duration (e.g., "PT2H30M")
  id: string;
  numberOfStops: number;
}

// Itinerary
export interface Itinerary {
  duration: string; // ISO 8601 duration
  segments: FlightSegment[];
}

// Price Details
export interface Price {
  currency: string;
  total: string;
  base: string;
  fees?: Array<{
    amount: string;
    type: string;
  }>;
  grandTotal: string;
}

// Traveler Pricing
export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: Array<{
    segmentId: string;
    cabin: string;
    fareBasis: string;
    class: string;
    includedCheckedBags?: {
      quantity?: number;
      weight?: number;
      weightUnit?: string;
    };
  }>;
}

// Flight Offer
export interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate?: string;
  numberOfBookableSeats?: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

// API Response Types
export interface FlightOffersResponse {
  meta?: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: FlightOffer[];
  dictionaries?: {
    locations?: Record<string, Airport>;
    aircraft?: Record<string, string>;
    currencies?: Record<string, string>;
    carriers?: Record<string, string>;
  };
}

export interface AirportSearchResponse {
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: Array<{
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    id: string;
    iataCode: string;
    address?: {
      cityName?: string;
      cityCode?: string;
      countryName?: string;
      countryCode?: string;
      regionCode?: string;
    };
  }>;
}

// Filter Options
export interface FilterOptions {
  stops: number[]; // [0, 1, 2] for non-stop, 1 stop, 2+ stops
  priceRange: {
    min: number;
    max: number;
  };
  airlines: string[]; // airline codes
  departureTimeRange?: {
    start: string; // "00:00"
    end: string; // "23:59"
  };
  arrivalTimeRange?: {
    start: string;
    end: string;
  };
  maxDuration?: number; // in minutes
}

// Processed Flight Data (for UI)
export interface ProcessedFlight extends FlightOffer {
  totalDuration: number; // in minutes
  numberOfStops: number;
  departureTime: Date;
  arrivalTime: Date;
  priceValue: number; // parsed price for sorting/filtering
  airlineName: string;
}
