import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Mapbox, { MapView, Camera, MarkerView } from '@rnmapbox/maps';

const InsightMap = ({ selectedChannel, selectedDate_, timelineData }) => {
  const mapRef = useRef(null); // Initialize map reference
  const [coordinates, setCoordinates] = useState([]); 

  // console.log('logs=====', selectedDate_)
  // console.log('selectedChannel',selectedChannel)

  useEffect(() => {
    // Check if timelineData is available and set the coordinates
    if (timelineData && timelineData[0]?.locations) {
      setCoordinates(timelineData[0]?.locations); // Set locations as an array of coordinates
    }
  }, [timelineData]);

  // Zoom level for the map
  const zoomLevel = 14;

  return (
    <View style={styles.card}>
      <MapView ref={mapRef} style={styles.map}>
        {/* Set the camera position to center on the first location */}
        <Camera
          zoomLevel={zoomLevel}
          centerCoordinate={coordinates.length > 0 ? coordinates[0] : [81.0614042, 26.8460533]} 
        />
        
        {/* Render markers for each location in the timelineData */}
        {coordinates.map((coord, index) => (
          <MarkerView key={index} coordinate={coord}>
            <View style={styles.markerContainer}>
              <Text style={styles.markerText}>{index + 1} here</Text>
            </View>
          </MarkerView>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    height: 300,
    width: '100%',
  },
  markerContainer: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default InsightMap;
