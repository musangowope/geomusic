import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import googleMapsService, {
  PlacePrediction,
} from '@/features/music-map/services/google-maps.service';
import Input from '@/components/ui/input/Input';
import useGetLocation from '@/features/music-map/hooks/useGetLocation';

interface AddressAutocompleteProps {
  onSelectAddress: (address: PlacePrediction) => void;
  placeholder?: string;
  initialValue?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelectAddress,
  placeholder = 'Search for an address...',
  initialValue = '',
}) => {
  const [query, setQuery] = useState(initialValue);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const location = useGetLocation();

  console.log('location', location);
  // Fetch predictions when query changes
  useEffect(() => {
    googleMapsService.debouncedGetPlacePredictions(
      {
        q: query,
        coords: {
          lat: location.currentLocation?.latitude,
          lng: location.currentLocation?.longitude,
        },
      },
      (results) => {
        // Update your state with the results
        setPredictions(results.predictions);
      }
    );
  }, [query]);

  // Handle selecting an address from the predictions
  const handleSelectAddress = (address: PlacePrediction) => {
    onSelectAddress(address);
    setQuery(address.description);
    setPredictions([]);
  };

  return (
    <View style={styles.container}>
      <Input value={query} onChangeText={setQuery} placeholder={placeholder} />

      {predictions.length > 0 && (
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.place_id}
          style={styles.predictionsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectAddress(item)}
            >
              <Text style={styles.suggestionText}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'visible',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  predictionsList: {
    // position: 'absolute',
    // top: 50,
    maxHeight: 200,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
  },
  currentLocationButton: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
  },
});
