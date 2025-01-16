import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { devURL } from '../constants/endpoints';
import InsightTwo from './User/UserTimeLineFeed';
import Icon from 'react-native-vector-icons/FontAwesome';

const LiveTrackingMap = ({ selectedMmeberId, selectedDate_, transitMemberData }) => {
  console.log('selectedMmeberId______________>', selectedMmeberId, selectedDate_);


  const [loca_, setLoca_] = useState([]);
  const [sampledLocations, setSampledLocations] = useState([]);
  const [region, setRegion] = useState({
    latitude: 26.8472092,
    longitude: 80.9478472,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [loading, setLoading] = useState(false);

  const fetchDailyLocations = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      console.log('chala !!!!!!!______________');
      setLoading(true);

      const response = await axios.get(
        `${devURL}/user/members/${selectedMmeberId}/daily-transit?date=${selectedDate_}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          }
        }
      );
      console.log('response!!!!!!! ______________', response.data.data[0].locations);

      const locations = response.data.data[0]?.locations || [];

      setLoca_(locations);
      setLoading(false);
      // Sample data for rendering
      // const sampledData = sampleLocations(locations, 12);
      // setSampledLocations(sampledData);


    } catch (error) {
      console.log('Fetch canceled:', error.message);

    } finally {
      setLoading(false);
    }
  };

  const sampleLocations = (locations, maxPoints) => {
    const totalPoints = locations.length;
    if (totalPoints <= maxPoints) return locations;
    const step = Math.ceil(totalPoints / maxPoints);
    return locations.filter((_, index) => index % step === 0);
  };

  useEffect(() => {
    // const fetchData = async () => {
    // };
    fetchDailyLocations();

    // fetchData();
  }, [selectedMmeberId]);

  useEffect(() => {
    if (loca_.length > 0) {
      const firstLocation = loca_[0];
      setRegion({
        latitude: firstLocation[1],
        longitude: firstLocation[0],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }

  }, [selectedMmeberId])
  console.log('sampledLocations', sampledLocations);

  return (
    <View>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : region ? (
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            {loca_?.map((location, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: location[1],
                  longitude: location[0],
                }}
                title={`Transit ${index + 1}`}
                description={`Time: ${location[2]}`}
              >
                <Icon name="flag" size={24} color="#007AFF" />
              </Marker>
            ))}

            {sampledLocations.length > 1 && (
              <Polyline
                coordinates={sampledLocations.map(location => ({
                  latitude: location[1],
                  longitude: location[0],
                }))}
                strokeWidth={1}
                strokeColor="#007AFF"
              />
            )}
          </MapView>
        ) : (
          <Text style={styles.noDataText}>No location data available</Text>
        )}
      </View>
      <InsightTwo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
  },
  map: {
    height: 400,
    marginTop: 20,
  },
  marker: {
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
    alignSelf: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default LiveTrackingMap;
