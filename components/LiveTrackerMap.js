import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';
import { devURL } from '../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const LiveTrackingMap = ({ selectedMmeberId, selectedDate_, }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the input date string
    const year = date.getFullYear(); // Extract the year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Extract the month (0-based index) and pad with leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Extract the day and pad with leading zero
    return `${year}-${month}-${day}`; // Combine into the desired format
  };



  // console.log('selectedDate_',selectedDate_);
  const [memberLiveTrackingData, setMemberLiveTrackingData] = useState([]);
  const [memberLiveTrackingReocirds, setMemberLiveTrackingRecords] = useState([]);

  const [transitMemberData, setTransitMemberData] = useState([]);
  const [transitMemberCoordinatesData, setTransitMemberCoordinatesData] = useState([]);
  const [memberAssignmentDetails, setMemberAssignmentDetail] = useState([]);

  const fetchDailyLocations = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      setLoading(true);

      const response = await axios.get(
        `${devURL}/user/members/assignment-location-tracking/${selectedMmeberId}/${formatDate(selectedDate_)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        }
      );


      // const coordinates = response?.data?.assignmentDetails?.map(loc => loc.location.coordinates);
      const eventDetails = response?.data?.assignmentDetails?.map(item => ({
        id: item.assignmentId?._id || 'Unknown ID', // Extract ID with a fallback
        name: item.assignmentId?.eventName || 'Unnamed Event', // Extract name with a fallback
      }));

      // console.log('Event Details:', eventDetails);
      // console.log('---------------', response?.data?.assignmentDetails);
      setMemberAssignmentDetail(response?.data?.assignmentDetails)
      // setTransitMemberCoordinatesData(coordinates)
      const locations = response.data.data[0]?.locations || [];
      setTransitMemberData(locations);
    } catch (error) {
      console.log('Fetch canceled:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyLocations();
  }, [selectedMmeberId, selectedDate_]);




  const [isCheckedMarked, setIsCheckedMarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [region, setRegion] = useState({
    latitude: transitMemberData?.length > 0 ? transitMemberData[0][1] : 26.8506406,
    longitude: transitMemberData?.length > 0 ? transitMemberData[0][0] : 80.9753135,
    latitudeDelta: 0.09,
    longitudeDelta: 0.09,
  });

  const fetchLiveTrackingData = async () => {
    setLoading(true);
    try {
      const jwtToken = await AsyncStorage.getItem('token');

      if (!jwtToken) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${devURL}/user/members/live-location-tracking/${selectedMmeberId}/${formatDate(selectedDate_)}`, // Updated URL
        {

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`, // Add token in the Authorization header
          },
        }
      );
// console.log('response',response.status);


      // const data = await response.json();
      // const coordinates = response?.data?.liveLocation?.map(loc => loc.location.coordinates);
      let coord = []
      if (response.status == 200) {
        const coordinates = response?.data?.liveLocation?.map(loc => {

          return (
            coord.push(loc.coordinates)
          )
        });
        // console.log('_____________ Live coordinates ___________________', coordinates);
        setMemberLiveTrackingRecords(response?.data?.liveLocation) // Assuming 'liveLocation' contains the required data
        // setMemberLiveTrackingData(response?.data?.liveLocation); // Assuming 'liveLocation' contains the required data
      } else {
        console.error('Live tracking data not found:', data.error);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching live tracking data:', error);
      setLoading(false);
    }
  };

  const sampleLocations = (locations) => {
    const maxPoints = 25;
    const totalPoints = locations.length;
    if (totalPoints <= maxPoints) return locations;
    const step = Math.ceil(totalPoints / maxPoints);
    return locations.filter((_, index) => index % step === 0);
  };

  useEffect(() => {
    if (isCheckedMarked) {
      fetchLiveTrackingData();
    }
  }, [isCheckedMarked,]);



  // useEffect(() => {
  //   if (memberLiveTrackingReocirds?.length > 0) {
  //     const firstLocation = memberLiveTrackingReocirds[0];
  //     setRegion({
  //       latitude: firstLocation[0],
  //       longitude: firstLocation[1],
  //       latitudeDelta: 0.02,
  //       longitudeDelta: 0.02,
  //     });
  //   }

  // }, [selectedMmeberId]);

  useEffect(() => {
    if (memberLiveTrackingReocirds && memberLiveTrackingReocirds?.length > 0) {

      const firstLocation = memberLiveTrackingReocirds[0];
          console.log('firstLocation:', memberLiveTrackingReocirds);

      setRegion({
        latitude: firstLocation?.coordinates[0],
        longitude: firstLocation?.coordinates[1],
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [selectedMmeberId,selectedDate_]);



  // console.log('Assigenemnt traking data :', transitMemberCoordinatesData[0]);
  // console.log('Live traking data', memberLiveTrackingData[0]);
  console.log('memberLiveTrackingReocirds', memberLiveTrackingReocirds[0]);


  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isCheckedMarked}
          onValueChange={setIsCheckedMarked}
        />
        <Text style={styles.checkboxLabel}>Live Tracking</Text>
        <Icon
          name="refresh" // Material Icons name for a refresh icon
          size={24}
          color="#007AFF"
          onPress={fetchLiveTrackingData} // Call the function when the icon is pressed
          style={styles.refreshIcon}
        />
      </View>

      {/* ----------- tags like UI to show assignemnts names (memberAssignmentDetails array) ---------------- */}


      {/* import { ScrollView, TouchableOpacity } from 'react-native'; */}
      {!isCheckedMarked ? (

        <View style={styles.tagsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(() => {
              // console.log('memberAssignmentDetails:', memberAssignmentDetails);
              return (memberAssignmentDetails || []).length > 0 ? (
                (memberAssignmentDetails || []).map((detail, index) => (

                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => {
                      console.log(`Clicked on assignment: `, detail.trackingCoordinates);
                      const assignmentCoordinates = detail.trackingCoordinates[0];

                      setTransitMemberCoordinatesData(detail.trackingCoordinates)

                      if (assignmentCoordinates) {
                        setRegion({
                          latitude: assignmentCoordinates[0],
                          longitude: assignmentCoordinates[1],
                          latitudeDelta: 0.02,
                          longitudeDelta: 0.02,
                        });
                      } else {
                        console.error(`No coordinates available for assignment: ${detail.eventName}`);
                      }
                    }}
                  >
                    <Text style={styles.tagText}>{detail.eventName || 'Unnamed Assignment'}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noAssignmentText}>No assignments available</Text>
              );
            })()}
          </ScrollView>
        </View>
      ) : null}




      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : isCheckedMarked ? (
        memberLiveTrackingReocirds?.length > 0 ? (
          <MapView style={styles.map} region={region}>
            {(memberLiveTrackingReocirds).map((location, index) => {
              // console.log('location --------------->', location);

              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: location?.coordinates[0],
                    longitude: location?.coordinates[1],
                  }}
                  title={`${location.locality} @ ${ moment(location.timestamp).format('h:mm A')}`}
                >
                  <Icon name="flag" size={24} color="#007AFF" />
                </Marker>
              )
            })}
            <Polyline
              coordinates={memberLiveTrackingReocirds.map((location) => ({
                latitude: location?.coordinates[0],
                longitude: location?.coordinates[1],
              }))}
              strokeWidth={2}
              strokeColor="red"
            />
          </MapView>
        ) : (
          <Text>No live tracking data available</Text>
        )
      ) : (
        transitMemberCoordinatesData?.length > 0 ? (
          <MapView style={styles.map} region={region}>
            {(transitMemberCoordinatesData).map((location, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: location[0],
                  longitude: location[1],
                }}
                title={`Transit Point ${index + 1}`}
              >
                <Icon name="flag" size={24} color="#007AFF" />
              </Marker>
            ))}
            <Polyline
              coordinates={transitMemberCoordinatesData.map((location) => ({
                latitude: location[0],
                longitude: location[1],
              }))}
              strokeWidth={2}
              strokeColor="red"
            />
          </MapView>
        ) : (
          <Text>No transit data available</Text>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  map: {
    height: height * 0.6,
    width: width - 20,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  map: {
    height: height * 0.6,
    width: width - 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noAssignmentText: {
    color: '#555555',
    fontSize: 14,
  },
  refreshIcon: {
    marginLeft: 10, // Adjust for spacing
    padding: 5,     // Add touchable padding for better UX
  },
});

export default LiveTrackingMap;
