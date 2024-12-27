import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

function IndiaMap() {
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 21.7679, // Center of India
          longitude: 78.8718, // Center of India
          latitudeDelta: 10.0, // Zoom level
          longitudeDelta: 10.0, // Zoom level
        }}
        provider="google" // Use Google Maps if desired
      >
        <Marker
          coordinate={{ latitude: 21.7679, longitude: 78.8718 }}
          title="Center of India"
        />
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: "100%",
    width: "100%",
  },
});

export default IndiaMap;
