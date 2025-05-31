import { fetch } from 'expo/fetch';

//TODO: transfer this to a slice

/**
 * Interface definitions for Google Places Autocomplete API response
 */

/**
 * Represents a substring match in the prediction result
 */
export interface MatchedSubstring {
  /** Length of the matched substring */
  length: number;
  /** Starting position of the matched substring */
  offset: number;
}

/**
 * Represents the structured formatting of the prediction
 */
export interface StructuredFormatting {
  /** Main text of the structured formatting */
  main_text: string;
  /** Matched substrings in the main text */
  main_text_matched_substrings: MatchedSubstring[];
  /** Secondary text of the structured formatting */
  secondary_text: string;
}

/**
 * Represents a term in the prediction
 */
export interface Term {
  /** Starting position of the term */
  offset: number;
  /** Value of the term */
  value: string;
}

/**
 * Represents a single prediction in the autocomplete response
 */
export interface PlacePrediction {
  /** Human-readable description of the place */
  description: string;
  /** Substrings in the description that match the search query */
  matched_substrings: MatchedSubstring[];
  /** Unique identifier for the place */
  place_id: string;
  /** Reference identifier for the place */
  reference: string;
  /** Structured formatting of the place description */
  structured_formatting: StructuredFormatting;
  /** Terms that make up the description */
  terms: Term[];
  /** Types of the place (e.g., geocode, establishment) */
  types: string[];
}

/**
 * Represents the complete response from the Google Places Autocomplete API
 */
export interface GooglePlacesAutocompleteResponse {
  /** Array of prediction results */
  predictions: PlacePrediction[];
  /** Status of the API request (e.g., "OK", "ZERO_RESULTS") */
  status: string;
}

interface GetPlacePredictionsParams {
  q: string;
  coords?: { lat?: number; lng?: number };
}

class GoogleMapsService {
  private apiKey: string;
  private debounceTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  }

  /**
   * Get place suggestions from Google Places Autocomplete API
   * @returns Promise with autocomplete suggestions
   * @param params
   */
  getPlacePredictions = async (params: GetPlacePredictionsParams) => {
    const { q, coords } = params;
    try {
      if (!q || q.length < 2) {
        return { predictions: [] };
      }

      const input = encodeURIComponent(q);
      const url = new URL(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json'
      );
      url.searchParams.set('input', q);
      url.searchParams.set('key', this.apiKey);
      // url.searchParams.set('types', 'address');
      // Set language to improve relevance
      url.searchParams.set('language', 'en');

      // // Include all types of results like the Google Maps app
      // // This includes establishments, geocode, regions, cities, etc.
      // // Removing the 'types' restriction to get more diverse results
      //
      // if (coords?.lat && coords?.lng) {
      //   // Set the location parameter
      //   url.searchParams.set('location', `${coords.lat},${coords.lng}`);
      //
      //   // Add a radius parameter (in meters) to limit the search area
      //   // Increased from 50km to 100km for better coverage
      //   url.searchParams.set('radius', '100000');
      //
      //   // Add location bias instead of strict bounds
      //   url.searchParams.set(
      //     'locationbias',
      //     `circle:100000@${coords.lat},${coords.lng}`
      //   );
      // }

      // Set components parameter to improve regional relevance if needed
      // url.searchParams.set('components', 'country:us');

      // Set sessiontoken to enable billing per session instead of per request
      // This requires implementing a session token management system
      // url.searchParams.set('sessiontoken', this.getSessionToken());

      const response = await fetch(url.href);
      return (await response.json()) as GooglePlacesAutocompleteResponse;
    } catch (error) {
      console.error('Error fetching place suggestions:', error);
      return { predictions: [], error: 'Failed to fetch suggestions' };
    }
  };

  /**
   * Debounced version of getPlacePredictions to prevent excessive API calls
   * @param params
   * @param callback Function to call with the results
   * @param delay Optional custom debounce delay in milliseconds
   */
  debouncedGetPlacePredictions = (
    params: GetPlacePredictionsParams,
    callback: (
      results:
        | GooglePlacesAutocompleteResponse
        | { predictions: []; error?: string }
    ) => void,
    delay?: number
  ): void => {
    // Clear any existing timeout
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    // Set a new timeout
    this.debounceTimeout = setTimeout(async () => {
      const results = await this.getPlacePredictions(params);
      callback(results);
    }, delay || 300); // Default to 300ms if no delay specified
  };

  async getPlaceDetails(placeId: string) {
    try {
      // Using the Places API v1 for more detailed information
      const url = `https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${this.apiKey}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'location',
        },
      });
      return (await response.json()) as {
        location: {
          latitude: number;
          longitude: number;
        };
      };
    } catch (e) {
      console.error('Error fetching place details:', e);
      return null;
    }
  }
}

const googleMapsService = new GoogleMapsService();

export default googleMapsService;
