import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

function LucknowMapWithMarkers() {
  const places = [
    {
      name: 'Bara Imambara',
      description: 'Historical monument in Lucknow',
      coordinates: { latitude: 26.8691, longitude: 80.9126 },
    },
    {
      name: 'Hazratganj',
      description: 'Famous shopping area',
      coordinates: { latitude: 26.8486, longitude: 80.9432 },
    },
    {
      name: 'Rumi Darwaza',
      description: 'Iconic gateway in Lucknow',
      coordinates: { latitude: 26.8699, longitude: 80.9124 },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 26.8467,
          longitude: 80.9462,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {places.map((place, index) => (
          <Marker
            key={index}
            coordinate={place.coordinates}
            title={place.name}
            description={place.description}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default LucknowMapWithMarkers;
