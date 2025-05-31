import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const useGetLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      try {
        // Request permission first
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          return;
        }

        // Get location with high accuracy
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        if (isMounted) {
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          });
        }
      } catch (error) {
        if (isMounted) {
          setLocationError('Could not get your location');
          console.error('Error getting location:', error);
        }
      }
    };

    getLocation();

    // Set up location subscription for real-time updates
    let locationSubscription: Location.LocationSubscription;

    const setupLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 10, // Update if user moves 10 meters
            timeInterval: 5000, // Or every 5 seconds
          },
          (location) => {
            if (isMounted) {
              setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
              });
            }
          }
        );
      }
    };

    setupLocationUpdates();

    // Cleanup function
    return () => {
      isMounted = false;
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return { currentLocation, locationError };
};

export default useGetLocation;
