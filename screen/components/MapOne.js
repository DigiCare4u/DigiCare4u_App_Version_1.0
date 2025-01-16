import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Loader from './Loader';
import { startBackgroundLocation } from '../services/bgActions';
import useFetchMember from '../hooks/useFetchMember';
import getDistanceFromLatLonInMeters from '../services/util/distanceMatrix';
import { AppState } from 'react-native';
import { updateLocationIfNeeded } from '../services/coreTracking';
import useLocation from '../hooks/useLocation';
import getAddressFromCoordinates from '../services/geoCode';
import axios from 'axios';
import BackgroundTimer from 'react-native-background-timer';
import RNLocation from 'react-native-location';

const MapOne = () => {
    const [locationa, setLocation] = useState(null);

    const { location, error, getCurrentLocation } = useLocation()

    useEffect(() => {
        if (!location) {
            getCurrentLocation();
        }
    }, [getCurrentLocation]);

    if (error) (
        <Text>{error}</Text>
    )
    const { memberProfile, fetchMemberProfile } = useFetchMember()
    const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
        if (!memberProfile) {
            fetchMemberProfile();
        }
    }, [memberProfile, fetchMemberProfile]);


    //=========BG[MapOne]=============
    // Configure location and permissions
    //   const configureLocation = async () => {
    //     await RNLocation.configure({ distanceFilter: 5.0 });
    //     const granted = await RNLocation.requestPermission({
    //       ios: 'whenInUse',
    //       android: { detail: 'coarse' },
    //     });

    //     if (granted) {
    //       return true;
    //     }
    //     return false;
    //   };

    // Fetch location
    const fetchLocation = async () => {
        const currentLocation = await RNLocation.getLatestLocation({ timeout: 10000 });
        if (currentLocation) {
            setLocation(currentLocation);
            console.log(' ------------ Background Fetched --------------------- !!!!!!! :', currentLocation?.latitude);
        }
    };

    //   useEffect(() => {
    //     // Initialize location tracking and background service
    //     (async () => {
    //       const permissionGranted = await configureLocation();
    //       if (permissionGranted) {
    //         startBackgroundService();

    //         BackgroundTimer.runBackgroundTimer(() => {
    //             // console.log(' ------------ Background Fetched --------------------- !!!!!!! :');

    //           fetchLocation(); // Fetch location every interval
    //         }, 2000); // Set interval in milliseconds
    //       }
    //     });

    //     return () => {
    //       BackgroundTimer.stopBackgroundTimer(); // Stop timer on unmount
    //     };
    //   }, []);




    useEffect(() => {
        // Initialize location tracking and background service

        BackgroundTimer.runBackgroundTimer(() => {
            // console.log(' ------------ Background Fetched --------------------- !!!!!!! :');

            // getCurrentLocation()
            // fetchLocation(); // Fetch location every interval
        }, 1000); // Set interval in milliseconds


        return () => {
            BackgroundTimer.stopBackgroundTimer(); // Stop timer on unmount
        };
    }, []);



    //==========================




    const [d, setD] = useState({});

    const googleMapsPlatformAPIKey = 'AIzaSyCTe9J53cwj-60MvLB5G2p01bDXr4q-7qo';

    const getAddressFromCoordinates = async (latitude, longitude) => {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsPlatformAPIKey}`;
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=tourist_attraction&key=${googleMapsPlatformAPIKey}`;

        try {
            // Fetch address details from the Geocoding API
            const geocodeResponse = await axios.get(geocodeUrl);

            if (geocodeResponse.data.status === 'OK') {
                const addressComponents = geocodeResponse.data.results[0].address_components;
                const formattedAddress = geocodeResponse.data.results[0].formatted_address;

                const addressDetails = {
                    formattedAddress,
                    locality: 'NOT FOUND',
                    sublocality: 'NOT FOUND',
                    region: 'NOT FOUND',
                    country: 'NOT FOUND',
                    postalCode: 'NOT FOUND',
                    landmarks: []
                };

                addressComponents.forEach(component => {
                    const types = component.types;
                    if (types.includes('locality')) addressDetails.locality = component.long_name;
                    if (types.includes('sublocality')) addressDetails.sublocality = component.long_name;
                    if (types.includes('administrative_area_level_1')) addressDetails.region = component.long_name;
                    if (types.includes('country')) addressDetails.country = component.long_name;
                    if (types.includes('postal_code')) addressDetails.postalCode = component.long_name;
                });

                // Fetch landmarks from the Places API
                const placesResponse = await axios.get(placesUrl);
                if (placesResponse.data.status === 'OK') {
                    addressDetails.landmarks = placesResponse.data.results.map(place => ({
                        name: place.name,
                        vicinity: place.vicinity,
                        location: place.geometry.location
                    }));
                }

                return addressDetails;
            } else {
                console.error("Geocoding API error:", geocodeResponse.data.status);
                throw new Error(`Geocoding error: ${geocodeResponse.data.status}`);
            }
        } catch (error) {
            console.error("Error fetching address:", error.message);
            return null;
        }
    };

    const fe = async () => {
        if (memberProfile?.location?.coordinates) {
            try {
                const addressDetails = await getAddressFromCoordinates(
                    memberProfile.location.coordinates[1],
                    memberProfile.location.coordinates[0]
                );
                if (addressDetails) setD(addressDetails);
            } catch (error) {
                console.error("Error in fe function:", error.message);
            }
        }
    };

    useEffect(() => {
        fe();
    }, [memberProfile]);

    // console.log('=============== Address Details[MapOne] ===============');
    // console.log(d);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        let locationInterval;

        if (appState === 'active') {
            locationInterval = setInterval(() => {
                // console.log('active fetching .......', location?.latitude, location?.longitude);

                if (memberProfile?.name) {
                    getCurrentLocation();

                    // console.log('Last coordinates[MapOne].......', memberProfile?.location?.coordinates, memberProfile?.name);
                    updateLocationIfNeeded(
                        location?.latitude, location?.longitude,
                        memberProfile?.location?.coordinates)
                    // Check if the location has changed by more than 100 meters
                    // Call the updateLocationIfNeeded function (or similar logic)
                    // Example:
                    // updateLocationIfNeeded(prevLocation, newLocation);
                }
                // setPrevLocation(newLocation); // Update the previous location
                fetchMemberProfile()
            }, 8000); // Set interval to fetch location every 10 seconds (10000ms)
        }

        return () => {
            if (locationInterval) {
                clearInterval(locationInterval); // Clean up the interval on component unmount or app state change
            }
            subscription.remove();
        };
    }, [appState, memberProfile, location?.latitude, location?.longitude]);


    //========= re-animiating the map on new location ===============
    const mapRef = useRef(null);
    useEffect(() => {
        if (mapRef.current && location?.latitude && location?.longitude) {
            mapRef.current.animateToRegion({
                latitude: location?.latitude,
                longitude: location?.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000); // 1000 ms for smooth animation
        }
    }, [location?.latitude, location?.longitude]);
    // console.log('D --->: ', d);
    //=================================================

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    };


    return (
        <SafeAreaView style={styles.safeArea}>

            {(location?.latitude & location?.longitude) ?
                (
                    <View style={styles.container}>
                        <MapView
                            ref={mapRef}
                            style={styles.mapStyle}
                            initialRegion={{
                                latitude: location?.latitude,
                                longitude: location?.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                                draggable
                                coordinate={{
                                    latitude: location?.latitude,
                                    longitude: location?.longitude,
                                }}
                                onDragEnd={(e) => alert(JSON.stringify(e.nativeEvent.coordinate))}
                                title={memberProfile?.name || 'Member Location'}
                                description={
                                    d ? d?.formattedAddress : 'not found'
                                }
                            />
                        </MapView>
                        <View style={styles.locationInfo}>
                            {/* <Text style={styles.infoText}>location: {location.latitude} {location.longitude}</Text> */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                {/* <Text style={styles.infoText}>Accuracy: {location.accuracy} mm</Text> */}
                                <Text style={styles.infoText}>Place: {d?.formattedAddress}</Text>
                                {/* <Text style={styles.infoText}>Speed: {location.speed} m/s</Text>  */}
                                <Text style={styles.infoText}>Time: {formatTime(location.time)}</Text>
                            </View>
                        </View>
                    </View>
                ) :
                <Loader />
            }
        </SafeAreaView>
    );
};

export default MapOne;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    mapStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    locationInfo: {
        marginBottom: 270,
        padding: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        width: '70%',
        alignItems: 'center',
        backgroundColor: "#376ADA",

    },
    infoText: {
        fontSize: 12,
        color: "#fff",
        marginBottom: 0,
        marginHorizontal: 2,
    },
});