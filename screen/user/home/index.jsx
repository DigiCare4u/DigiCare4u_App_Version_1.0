import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Places from '../../../components/places';
import Mapbox, {MapView, Camera, MarkerView} from '@rnmapbox/maps';
import useLocation from '../../../hooks/useLocation';
import Loader from '../../../components/Loader';
import useFetchUser from '../../../hooks/useFetchUser';
import axios from 'axios';
import UserMembersModal from '../../../components/Modal/UsersMemberModel';
import {onEvent} from '../../../services/socket/config';
import {MemberVerifiedNotification} from '../../../notificationTemplates/memberVerified';

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
  // const socket = useSocket();
  // const {memberVerifiedNotification,} = useNotification(socket);

  // const displayNotification_ = async notification => {
  //   try {
  //     // Request permissions (required for iOS)
  //     console.log(
  //       'notification___________lenght',
  //       notification,
  //       notification.length,
  //     );
  //     const length = Object.keys(notification).length;
  //     // console.log('len ----->',length); // Output: 3

  //     if (length <= 0) {
  //       return;
  //     }
  //     await notifee.requestPermission();

  //     // Create a channel (required for Android)
  //     const channelId = await notifee.createChannel({
  //       id: 'default',
  //       name: 'Default Channel',
  //       sound: 'congrat', // Use the file name from your raw folder

  //       importance: AndroidImportance.HIGH,
  //     });

  //     // Display a notification
  //     await notifee.displayNotification({
  //       title: notification.title || 'Member Verified !',
  //       body: notification.message || 'You have a new message.',
  //       android: {
  //         channelId,
  //         smallIcon: 'ic_launcher', // Replace with your notification icon
  //         pressAction: {
  //           id: 'default',
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Notification Error:', error);
  //   }
  // };

  useEffect(() => {
    onEvent('onMemberVerified', data => {
      MemberVerifiedNotification(data);
    });
  }, []);

  // console.log('notification:', notifications.message);

  //===================================
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

  const getAddressFromCoordinates = async ([longitude, latitude]) => {
    // console.log('latitude aaya____________ : ', latitude);
    const accessToken =
      'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ'; // Replace with your Mapbox token
    const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${accessToken}&limit=1`;

    try {
      const response = await axios.get(url);
      // console.log('response ________________ : ',response.data.features[0].properties.full_address);
      // console.log('response ________________ : ', response?.data?.features[0]?.properties?.context?.locality?.name);

      // if (response.data && response.data.features.length > 0) {
      if (response.data) {
        // setCountry(response.data.features[0].properties.context.country.name);
        setLocationDetails(prevState => ({
          ...prevState,
          preferredAddress:
            response.data?.features[0]?.properties?.name_preferred || null,
          address:
            response.data?.features[0]?.properties?.place_formatted || null,
          street:
            response.data?.features[0]?.properties?.context?.street?.name ||
            null,
          neighborhood:
            response.data?.features[0]?.properties?.context?.neighborhood
              ?.name || 'Not Found',
          postcode:
            response.data?.features[0]?.properties?.context?.postcode?.name ||
            null,
          locality:
            response.data?.features[0]?.properties?.context?.locality?.name ||
            '',
          district:
            response.data?.features[0]?.properties?.context?.district?.name ||
            null,
          region:
            response.data?.features[0]?.properties?.context?.region?.name ||
            null,
          country:
            response.data?.features[0]?.properties?.context?.country?.name ||
            null,
        }));
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Error fetching address');
    }
  };

  //======================================
  const {userMembersList, fetchUserMembersList} = useFetchUser();
  const [teamData, setTeamData] = useState([]);

  const fetchLocalities = async () => {
    // setIsFetching(true);
    const data = [];

    // Replace with actual team member data fetching logic
    // const userMembersList = []; // Assume userMembersList is available here

    const localityPromises = userMembersList?.map(async member => {
      try {
        console.log('fetchLocalities ------------ :');
        const {coordinates} = member?.location || {};
        if (!coordinates) throw new Error('Missing coordinates');

        const [latitude, longitude] = coordinates;
        // const accessToken = accessToken; // Replace with your Mapbox token
        const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${accessToken}&limit=1`;

        const response = await axios.get(url);
        const currentLocality =
          response?.data?.features[0]?.properties?.context.locality?.name ||
          'Not Found';

        // console.log('latitude, longitude===', latitude, longitude);

        // const accessToken = 'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ'; // Replace with your Mapbox token
        // const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${accessToken}&limit=1`;
        const url_1 = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${longitude},${latitude};${location?.longitude},${location?.latitude}?access_token=${accessToken}`;

        const response_1 = await axios.get(url_1);
        // console.log('response --------------', response_1.data.routes[0].duration);
        // console.log(' ETA :  -___________ : ', response_1.data.routes[0].distance);

        // let address = response?.data?.features[0]?.properties?.context?.locality?.name
        let duration = response_1?.data?.routes[0]?.duration;
        let distance = response_1?.data?.routes[0]?.distance;
        let eta = {distance, duration};
        // console.log('eta ----', eta);

        data.push({
          ...member,
          currentLocality,
          eta,
        });
      } catch (error) {
        console.error(`Error fetching locality for ${member?.name}:`, error);
        data.push({
          ...member,
          currentLocality: 'Error Fetching Locality',
        });
      }
    });
    // console.log('here --------- :');
    await Promise.all(localityPromises);
    setTeamData(data);
    // setIsFetching(false);
  };

  const {location, getCurrentLocation} = useLocation();
  const [isModalVisible, setModalVisible] = useState(false);
  const mapRef = useRef(null);

  // Fetch user members list
  useEffect(() => {
    if (!userMembersList) {
      fetchUserMembersList();
    }
  }, [fetchUserMembersList, userMembersList]);

  // Fetch user's current location
  useEffect(() => {
    if (!location) {
      getCurrentLocation();
    }
  }, [getCurrentLocation, location]);

  useEffect(() => {
    if (userMembersList?.length && !teamData?.length) {
      fetchLocalities();
    }
  }, [userMembersList, teamData]);

  useEffect(() => {
    if (location) {
      getAddressFromCoordinates([location?.longitude, location?.latitude]);
    }
  }, [location]);

  // Center map on user's current location
  useEffect(() => {
    if (location) {
      mapRef.current?.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  }, [location]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  console.log('teamData========', teamData[0]?.name);

  return (
    <SafeAreaView style={styles.container}>
      {location && teamData ? (
        <MapView ref={mapRef} style={styles.map}>
          <Camera
            zoomLevel={14}
            centerCoordinate={[
              location ? location.longitude : 0.0,
              location ? location.latitude : 0.0,
            ]}
          />

          <MarkerView
            allowOverlap={true}
            coordinate={[
              location?.longitude, // longitude
              location?.latitude, // latitude
            ]}>
            <View style={styles.customMarker}>
              <Icon name="map-marker" size={40} color="green" />
            </View>
          </MarkerView>

          {/* Render markers for user members */}
          {teamData?.map((member, index) => {
            return (
              <MarkerView
                draggable={true}
                animationMode="flyTo"
                allowOverlap={true}
                key={index}
                coordinate={[
                  member?.location ? member?.location?.coordinates[1] : 0.0, // longitude
                  member?.location ? member?.location?.coordinates[0] : 0.0, // latitude
                ]}>
                <View style={styles.markerTitle}>
                  <Button
                    style={styles.markerTitle}
                    title={`Name: ${member?.name}\nAddress: ${
                      member?.currentLocality
                    }\nDistance: ${formatDistance(
                      member?.eta?.distance,
                    )}\nDuration: ${formatDuration(member?.eta?.duration)}`}
                  />
                </View>
                <View style={styles.customMarker}>
                  <Icon
                    name="map-marker"
                    size={30}
                    color="#376ADA"
                    style={styles.iconLeft}
                  />
                </View>
              </MarkerView>
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
  customMarker: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
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
