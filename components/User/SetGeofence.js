import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loader from '../Loader';
import { devURL } from '../../constants/endpoints';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logProfileData } from 'react-native-calendars/src/Profiler';
import DailyTaskAssignment from './DailyTaskAssignment';

const { height: screenHeight } = Dimensions.get('window');

const SetGeofence = ({ location }) => {
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [geoFencedPlaceUpdated, setGeoFencedPlaceUpdated] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To manage loading state
  const [geoFenced, setGeoFenced] = useState(null); // To store the geoFenced coordinates
  const mapRef = useRef(null);

  // Function to fetch the user's profile
  const fetchUserProfile = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      // console.log(' ___________________', response?.data?.user?.geoFenced);

      if (response?.data && response?.data?.user?.geoFenced) {
        // console.log('formattedCoords', response?.data?.user?.geoFenced[0][0]);
        let formattedCoords = [];

        formattedCoords = response?.data?.user?.geoFenced?.coordinates?.map(coord => {
          // console.log('fdfd', coord[0], coord[1]);
          return { latitude: coord[0], longitude: coord[1] }; // Reversing to match the desired {lat, long} format
        });

        // console.log('Formatted Coordinates:', formattedCoords);


        setGeoFenced(response?.data?.user?.geoFenced?.coordinates);
        setPolygonCoords(formattedCoords);
        console.log('response?.data?.user?.geoFenced[0][1]?.latitude', response?.data?.user?.geoFenced.length);


      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [geoFencedPlaceUpdated]);

  const handleMapPress = (event) => {
    if (!isDrawing) return;
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setPolygonCoords((prev) => [...prev, { latitude, longitude }]);
  };

  const handleSaveGeofence = async () => {
    // if (polygonCoords.length < 3) {
    //   Alert.alert('Error', 'A geofence requires at least 3 points.');
    //   return;
    // }

    // Ensure the geofence is in the correct format: [[longitude, latitude], [longitude, latitude], ...]
    const closedPolygonCoords = [...polygonCoords, polygonCoords[0]]; // Close the polygon
    let formattedCoords = [];
    // Convert the coordinates to the expected format: [[longitude, latitude], [longitude, latitude], ...]
    formattedCoords = closedPolygonCoords.map(coord => [coord?.latitude, coord?.longitude]); // Swap [latitude, longitude] to [longitude, latitude]
    console.log('formattedCoords---', formattedCoords);
    if (formattedCoords[0][1] == undefined) {
      formattedCoords = []

    }
    try {
      // Get the JWT token from AsyncStorage
      const jwtToken = await AsyncStorage.getItem('token');

      // Send the geofence data to the backend to update the user profile
      const response = await axios.patch(
        `${devURL}/user/profile`, // Assuming this is the endpoint for updating the user profile
        { geoFenced: formattedCoords }, // Send the formatted geofence data in the request body
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`, // Authorization header with JWT token
          },
        }
      );

      console.log('response===', response?.status);



      if (response?.status == 200) {
        setGeoFencedPlaceUpdated(true)
        console.log('Geofence Saved:', response.data);
        Alert.alert('Success', 'Geofence saved successfully!');
      } else {
        Alert.alert('Error', 'Failed to save geofence.');
      }
    } catch (error) {
      console.error('Error saving geofence:', error);
      Alert.alert('Error', 'An error occurred while saving the geofence.');
    } finally {
      setGeoFencedPlaceUpdated(false)
    }
  };

  const handleClearGeofence = () => {
    setPolygonCoords([]);
  };

  const handleUndoLastPoint = () => {
    setPolygonCoords((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (polygonCoords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(polygonCoords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [polygonCoords]);

  console.log('polygonCoords hia ??  ', polygonCoords, location.latitude);



  return (
    <>
      <View style={styles.container}>
        {!location ? (
          <Loader /> // Show loader while data is being fetched
        ) : geoFenced && location && polygonCoords != [] ? (

          <>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: location?.latitude,
                longitude: location?.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={handleMapPress}
            >
              {/* Render the polygon */}
              {polygonCoords.length > 0 && (
                <Polygon
                  coordinates={polygonCoords}
                  strokeColor={isDrawing ? '#FF6347' : '#0066CC'}
                  fillColor="rgba(255,99,71,0.3)"
                  strokeWidth={2}
                />
              )}
              {/* Render the markers */}
              {polygonCoords?.map((coord, index) => {
                // console.log('coord------------------', coord);

                return (

                  <Marker key={index} coordinate={{ latitude: coord?.latitude, longitude: coord?.longitude }} pinColor="blue" />

                  // <Marker key={index} coordinate={coord} pinColor="blue" />

                )
              })}
              {/* Display current user location */}
              <Marker
                coordinate={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                }}
                pinColor="green"
                title="Your Location"
                description="This is your current location"
              />
            </MapView>
          </>
        ) : (
          <View style={styles.noGeofence}>

            <Text style={styles.noGeofenceText}>
              You haven't set up a geofence yet. Tap the map to draw one.
            </Text>

           
          </View>

        )}

        <View style={styles.header}>
          <Text style={styles.title}>{polygonCoords != [] ? 'Geo-Fenced Zone' : 'Set Geo Fencing'}</Text>
        </View>

        {isDrawing && (
          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Tap on the map to add points for your geofence.
            </Text>
          </View>
        )}

        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={[
              styles.fab,
              { backgroundColor: isDrawing ? '#FF6347' : '#4CAF50' },
            ]}
            onPress={() => setIsDrawing((prev) => !prev)}
          >
            <Icon
              name={isDrawing ? 'stop' : 'edit'}
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fab}
            onPress={handleUndoLastPoint}
            disabled={!polygonCoords.length}
          >
            <Icon
              name="undo"
              size={24}
              color={polygonCoords.length ? '#FFF' : '#CCC'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fab} onPress={handleClearGeofence}>
            <Icon name="delete" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fab} onPress={handleSaveGeofence}>
            <Icon name="done" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>


      </View>
      <DailyTaskAssignment />
    </>
  );
};

export default SetGeofence;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 19,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    overflow: 'hidden',
    height: screenHeight * 0.7,
  },

  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructions: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 10,
    zIndex: 1,
  },
  instructionsText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  fab: {
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  noGeofence: {
    flex: 1,
    justifyContent: 'center', // Centers the content vertically
    alignItems: 'center', // Centers the content horizontally
    backgroundColor: '#F8F8F8', // Light background color
    borderRadius: 10, // Rounded corners
    padding: 20, // Padding around the content
    margin: 15, // Margin from edges of screen
    shadowColor: '#000', // Adds shadow for better visibility
    shadowOffset: { width: 0, height: 4 }, // Shadow depth
    shadowOpacity: 0.1, // Light shadow
    shadowRadius: 4, // Smooth shadow
  },
  noGeofenceText: {
    fontSize: 16, // Text size
    fontWeight: '500', // Medium weight for the text
    color: '#555', // Dark gray color for text
    textAlign: 'center', // Centers the text inside the view
    lineHeight: 24, // Spacing between lines to improve readability
  },
});
