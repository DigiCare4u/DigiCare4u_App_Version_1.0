import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Places from '../../../components/places';
import Mapbox from '@rnmapbox/maps';
import useLocation from '../../../hooks/useLocation';
import Loader from '../../../components/Loader';
import useFetchUser from '../../../hooks/useFetchUser';
import axios from 'axios';
import UserMembersModal from '../../../components/Modal/UsersMemberModel';
import {onEvent} from '../../../services/socket/config';
import {MemberVerifiedNotification} from '../../../notificationTemplates/memberVerified';
import MapView, {Marker, Callout} from 'react-native-maps';
import {devURL} from '../../../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const accessToken =
  'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ'; // Replace with your Mapbox token

Mapbox.setAccessToken(
  'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ',
);
function formatDistance(distanceInMeters) {
  if (distanceInMeters >= 1000) {
    return `${(distanceInMeters / 1000).toFixed(2)} km`;
  }
  return `${distanceInMeters} meters`;
}

function formatDuration(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${
      minutes > 1 ? 's' : ''
    }`;
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

export default function UserHome() {
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [locationDetails, setLocationDetails] = useState({
    preferredAddress: null,
    address: null,
    street: null,
    neighborhood: null,
    postcode: null,
    locality: '',
    district: null,
    region: null,
    country: null,
  });

  const [teamData, setTeamData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const markersRef = useRef([]);
  const mapRef = useRef(null);

  const {userMembersList, fetchUserMembersList} = useFetchUser();
  const {location, getCurrentLocation} = useLocation();

  // Notifications
  useEffect(() => {
    onEvent('onMemberVerified', data => {
      MemberVerifiedNotification(data);
    });
  }, []);

  // const fetchLocalities = async () => {
  //   const data = [];

  //   const localityPromises = userMembersList?.map(async (member) => {
  //     try {
  //       const { coordinates } = member?.location || {};
  //       if (!coordinates) throw new Error('Missing coordinates');

  //       const [latitude, longitude] = coordinates;
  //       const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${accessToken}&limit=1`;
  //       const response = await axios.get(url);

  //       const currentLocality =
  //         response?.data?.features[0]?.properties?.context.locality?.name || 'Not Found';
  //       // console.log('payload', location, longitude);

  //       const url_1 = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${longitude},${latitude};${location?.longitude},${location?.latitude}?access_token=${accessToken}`;
  //       const response_1 = await axios.get(url_1);
  //       // console.log('response_1', response_1);

  //       const duration = response_1?.data?.routes[0]?.duration;
  //       const distance = response_1?.data?.routes[0]?.distance;

  //       data.push({
  //         ...member,
  //         currentLocality,
  //         eta: { distance, duration },
  //       });
  //     } catch (error) {
  //       // console.error(`Error fetching locality for ${member?.name}:`, error);
  //       data.push({
  //         ...member,
  //         currentLocality: 'Error Fetching Locality',
  //       });
  //     }
  //   });

  //   await Promise.all(localityPromises);
  //   setTeamData(data);
  // };

  // Replace with your Mapbox API Access Token

  // Function to fetch locality and ETA (distance, duration)
  const fetchLocalities = async location => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');

      // Fetch members' last locations from the backend
      const response = await axios.post(
        `${devURL}/user/members/last-location`,
        {},

        {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Pass the user's token for authentication
          },
        },
      );
      // console.log('-------', response.data.data);
      setTeamData(response.data.data);
      const userMembersList = response?.data?.data || []; // Assuming the response has 'data' field with member info

      if (!userMembersList.length) {
        console.log('No members found.');
        return;
      }

      const data = [];

      // const localityPromises = userMembersList.map(async member => {
      //   try {
      //     const {coordinates} = member?.lastLocation || {};
      //     if (!coordinates) throw new Error('Missing coordinates');

      //     const [latitude, longitude] = coordinates;

      //     // Fetch current locality using reverse geocoding
      //     const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${accessToken}&limit=1`;
      //     const localityResponse = await axios.get(url);
      //     const currentLocality =
      //       localityResponse?.data?.features[0]?.properties?.context.locality
      //         ?.name || 'Not Found';

      //     // Fetch ETA (distance and duration) from user location to member's location
      //     const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${longitude},${latitude};${location?.longitude},${location?.latitude}?access_token=${accessToken}`;
      //     const directionsResponse = await axios.get(directionsUrl);

      //     const duration = directionsResponse?.data?.routes[0]?.duration;
      //     const distance = directionsResponse?.data?.routes[0]?.distance;

      //     // Push the data to the result array
      //     data.push({
      //       ...member,
      //       currentLocality,
      //       eta: {distance, duration},
      //     });
      //   } catch (error) {
      //     console.error(`Error fetching locality for ${member?.name}:`, error);
      //     data.push({
      //       ...member,
      //       currentLocality: 'Error Fetching Locality',
      //     });
      //   }
      // });

      // await Promise.all(localityPromises);

      // Log or use the data as needed
      // console.log('=====',data);
      return data;
    } catch (error) {
      console.error("Error fetching members' last locations:", error);
    }
  };

  useEffect(() => {
    if (!userMembersList) fetchUserMembersList();
  }, [fetchUserMembersList, userMembersList]);

  useEffect(() => {
    if (!location) getCurrentLocation();
  }, [getCurrentLocation, location]);

  useEffect(() => {
    if (userMembersList?.length && !teamData?.length && location)
      fetchLocalities();
  }, [userMembersList, teamData, location]);

  // useEffect(() => {
  //   if (location) getAddressFromCoordinates([location?.longitude, location?.latitude]);
  // }, [location]);

  useEffect(() => {
    markersRef.current.forEach(marker => marker?.showCallout());
  }, [teamData]);
  // console.log('-----teamData--', teamData);

  return (
    <SafeAreaView style={styles.container}>
      {location && teamData ? (
        <MapView
          region={{
            latitude: location?.latitude, // Initial latitude from location data
            longitude: location?.longitude, // Initial longitude from location data
            latitudeDelta: 0.0922, // Adjust zoom level
            longitudeDelta: 0.0421,
          }}
          // onRegionChangeComplete={onRegionChange}
          style={styles.map}>
          <Marker
            key={'uniqueKey'}
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
            title={'Your Location'}
            description={`Accuracy: 20 meters`}
          />

          {/* Render markers for user members */}
          {teamData?.map((member, index) => {
            console.log('teamDatamember___', member?.lastLocation?.coordinates[0],);

            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: member?.lastLocation?.coordinates[0],
                  longitude: member?.lastLocation?.coordinates[1],
                }}
                title={member?.name}
                description={`${member.location} @ ${ moment(member.time).format('h:mm A')}`}
                
                onPress={() => {
                  console.log('Marker pressed:', member?.name);
                }}></Marker>
            );
          })}
        </MapView>
      ) : (
        <Loader />
      )}

      {/* Search bar and place container */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBarContainer}>
          {/* Menu icon */}
          <TouchableOpacity
            onPress={toggleModal}
            style={styles.menuIconContainer}>
            <Icon name="bars" size={28} color="#376ADA" />
          </TouchableOpacity>

          {/* Search input */}
          <View style={styles.searchBar}>
            <Icon
              name="map-marker"
              size={28}
              color="#376ADA"
              style={styles.iconLeft}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={locationDetails?.preferredAddress}
              placeholderTextColor="#888"
              editable={false}
            />
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
              }}
              style={styles.imageRight}
            />
          </View>
        </View>
      </View>
      {/* Modal for team members */}
      <UserMembersModal visible={isModalVisible} setVisible={setModalVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  // customMarker: {
  //   justifyContent: 'center',
  //   alignItems: 'center',

  // },
  markerImage: {
    width: 50,
    height: 50,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    elevation: 5,
  },
  calloutContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#376ADA',
  },
  calloutText: {
    fontSize: 14,
    color: '#555',
  },
  iconLeft: {
    alignSelf: 'center',
  },

  Marker: {
    width: 50,
    height: 50,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchBarWrapper: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  markerText: {
    fontSize: 15,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5, // Add some space between the text and the image
  },
  menuIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 5,
    flex: 1,
  },
  iconLeft: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  imageRight: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  placeContainer: {
    marginTop: 3,
    padding: 5,
    borderRadius: 8,
  },
  markerInfo: {
    alignItems: 'center',
    marginBottom: 5, // Space between text and marker image
    backgroundColor: 'red', // Semi-transparent background
    borderRadius: 5,
    padding: 20,
    borderColor: '#376ADA',
    elevation: 2,
  },
  markerTitle: {
    fontSize: 1,
    // fontWeight: 'italic',
    backgroundColor: 'red',
  },
  markerDescription: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  memberButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15, // Add horizontal padding for content spacing
    height: 50,
    width: 50,
    shadowColor: '#376ADA',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    elevation: 2,
    position: 'absolute', // Use absolute positioning to place the button
    right: 7, // Adjust right position
    top: 8, // Adjust top position
  },
  notifeeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15, // Add horizontal padding for content spacing
    height: 50,
    width: 55,
    shadowColor: '#376ADA',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    elevation: 2,
    position: 'absolute', // Use absolute positioning to place the button
    right: 7, // Adjust right position
    top: 98, // Adjust top position
  },
  memberText: {
    color: 'black', // Ensure text color contrasts the button background
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8, // Add space between icon and text
  },
});
