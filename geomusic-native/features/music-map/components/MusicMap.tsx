import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import MapView, { Marker, Region, MapEvent, Callout } from 'react-native-maps';

// Types for our component
interface Coordinate {
  latitude: number;
  longitude: number;
}

interface CustomMarker {
  id: string;
  coordinate: Coordinate;
  title: string;
  description: string;
  color?: string;
}

interface CustomMapWithMarkersProps {
  initialRegion?: Region;
  markers?: CustomMarker[];
  onMarkerAdded?: (marker: CustomMarker) => void;
  onMarkerSelected?: (marker: CustomMarker) => void;
  readOnly?: boolean;
  markerColors?: string[];
}

// Custom Marker Component
const CustomMarkerComponent: React.FC<{
  marker: CustomMarker;
  onPress: () => void;
}> = ({ marker, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.markerContainer}>
      <View
        style={[
          styles.customMarker,
          { backgroundColor: marker.color || '#FF0000' },
        ]}
      >
        <Text style={styles.markerText}>
          {marker.title.substring(0, 1).toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CustomMapWithMarkers: React.FC<CustomMapWithMarkersProps> = ({
  initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  markers = [],
  onMarkerAdded,
  onMarkerSelected,
  readOnly = false,
  markerColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
}) => {
  const [customMarkers, setCustomMarkers] = useState<CustomMarker[]>(markers);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCoordinate, setSelectedCoordinate] =
    useState<Coordinate | null>(null);
  const [markerTitle, setMarkerTitle] = useState<string>('');
  const [markerDescription, setMarkerDescription] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(markerColors[0]);

  const mapRef = useRef<MapView | null>(null);

  const handleMapLongPress = (event: MapEvent) => {
    if (readOnly) return;

    const { coordinate } = event.nativeEvent;
    setSelectedCoordinate(coordinate);
    setModalVisible(true);
  };

  const addMarker = () => {
    if (!selectedCoordinate) return;

    const newMarker: CustomMarker = {
      id: Date.now().toString(),
      coordinate: selectedCoordinate,
      title: markerTitle || 'New Marker',
      description: markerDescription || 'No description provided',
      color: selectedColor,
    };

    const updatedMarkers = [...customMarkers, newMarker];
    setCustomMarkers(updatedMarkers);

    // Reset form
    setSelectedCoordinate(null);
    setMarkerTitle('');
    setMarkerDescription('');
    setModalVisible(false);

    // Call parent callback if provided
    if (onMarkerAdded) {
      onMarkerAdded(newMarker);
    }
  };

  const handleMarkerPress = (marker: CustomMarker) => {
    if (onMarkerSelected) {
      onMarkerSelected(marker);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onLongPress={handleMapLongPress}
      >
        {customMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            tracksViewChanges={false}
          >
            <CustomMarkerComponent
              marker={marker}
              onPress={() => handleMarkerPress(marker)}
            />
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutDescription}>
                  {marker.description}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {!readOnly && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (mapRef.current) {
                mapRef.current.getCamera().then((camera) => {
                  setSelectedCoordinate({
                    latitude: camera.center.latitude,
                    longitude: camera.center.longitude,
                  });
                  setModalVisible(true);
                });
              }
            }}
          >
            <Text style={styles.buttonText}>Add Marker at Center</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Marker</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addMarker}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Marker Title"
              value={markerTitle}
              onChangeText={setMarkerTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Marker Description"
              value={markerDescription}
              onChangeText={setMarkerDescription}
              multiline
            />

            <Text style={styles.colorSelectorLabel}>Select Color:</Text>
            <View style={styles.colorSelector}>
              {markerColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  colorSelectorLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  colorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#ff5252',
  },
  // Custom marker styles
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
  },
});

export default CustomMapWithMarkers;
