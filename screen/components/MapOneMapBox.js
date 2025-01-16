import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
import Loader from './Loader';
import { startBackgroundLocation } from '../services/bgActions';
import useFetchMember from '../hooks/useFetchMember';
import getDistanceFromLatLonInMeters from '../services/util/distanceMatrix';
import { AppState } from 'react-native';
import { updateLocationIfNeeded } from '../services/coreTracking';
import useLocation from '../hooks/useLocation';
// import getAddressFromCoordinates from '../services/geoCode';
import axios from 'axios';
import BackgroundTimer from 'react-native-background-timer';
import RNLocation from 'react-native-location';
import Mapbox, { MapView, Camera, MarkerView } from "@rnmapbox/maps";
import BackgroundService from 'react-native-background-actions';

const MapOneMapBox = () => {

    const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
 
    const veryIntensiveTask = async (taskDataArguments) => {
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                console.log('bg fetching .......');
                console.log(i);
                await sleep(delay);
            }
        });
    };
    const options = {
        taskName: 'Example',
        taskTitle: 'ExampleTask title',
        taskDesc: 'ExampleTask description',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 1000,
        },
    };
 
    //=====================================
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


    //=========BG[MapOneMapBox]=============
    // Configure location and permissions
    const configureLocation = async () => {
        await RNLocation.configure({ distanceFilter: 5.0 });
        const granted = await RNLocation.requestPermission({
            ios: 'whenInUse',
            android: { detail: 'coarse' },
        });

        if (granted) {
            return true;
        }
        return false;
    };

    // Fetch location
    const fetchLocation = async () => {
        const currentLocation = await RNLocation.getLatestLocation({ timeout: 10000 });
        if (currentLocation) {
            setLocation(currentLocation);
            console.log(' ------------ Background Fetched --------------------- !!!!!!! :', currentLocation?.latitude);
        }
    };

    useEffect(() => {
        // Initialize location tracking and background service
        (async () => {
            const permissionGranted = await configureLocation();
            if (permissionGranted) {
                startBackgroundService();

                BackgroundTimer.runBackgroundTimer(() => {
                    // console.log(' ------------ Background Fetched --------------------- !!!!!!! :');

                    fetchLocation(); // Fetch location every interval
                }, 2000); // Set interval in milliseconds
            }
        });

        return () => {
            BackgroundTimer.stopBackgroundTimer(); // Stop timer on unmount
        };
    }, []);




    // useEffect(() => {
    //     // Initialize location tracking and background service

    //     BackgroundTimer.runBackgroundTimer(() => {
    //         // console.log(' ------------ Background Fetched --------------------- !!!!!!! :');

    //         // getCurrentLocation()
    //         // fetchLocation(); // Fetch location every interval
    //     }, 1000); // Set interval in milliseconds


    //     return () => {
    //         BackgroundTimer.stopBackgroundTimer(); // Stop timer on unmount
    //     };
    // }, []);



    //==========================




    const [d, setD] = useState({});
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

    const googleMapsPlatformAPIKey = 'AIzaSyCTe9J53cwj-60MvLB5G2p01bDXr4q-7qo';


    const getAddressFromCoordinates = async (latitude, longitude) => {

        // console.log('latitude, longitude________________ : ',latitude, longitude);


        // console.log('latitude aaya____________ : ', latitude);
        const accessToken = 'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ'; // Replace with your Mapbox token
        const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${accessToken}&limit=1`;

        try {
            const response = await axios.get(url);
            // console.log('response ________________ : ',response.data);
            // console.log('response ________________ : ', response?.data?.features[0]?.properties?.context?.locality?.name);

            // if (response.data && response.data.features.length > 0) {
            if (response.data) {

                // setCountry(response.data.features[0].properties.context.country.name); 
                setLocationDetails((prevState) => ({
                    ...prevState,
                    preferredAddress: response.data?.features[0]?.properties?.name_preferred || null,
                    address: response.data?.features[0]?.properties?.place_formatted || null,
                    street: response.data?.features[0]?.properties?.context?.street?.name || null,
                    neighborhood: response.data?.features[0]?.properties?.context?.neighborhood?.name || 'Not Found',
                    postcode: response.data?.features[0]?.properties?.context?.postcode?.name || null,
                    locality: response.data?.features[0]?.properties?.context?.locality?.name || '',
                    district: response.data?.features[0]?.properties?.context?.district?.name || null,
                    region: response.data?.features[0]?.properties?.context?.region?.name || null,
                    country: response.data?.features[0]?.properties?.context?.country?.name || null,
                }));
            } else {
                setAddress('Address not found');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            setAddress('Error fetching address');
        }





        // const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsPlatformAPIKey}`;
        // const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=tourist_attraction&key=${googleMapsPlatformAPIKey}`;

        // try {
        //     // Fetch address details from the Geocoding API
        //     const geocodeResponse = await axios.get(geocodeUrl);

        //     if (geocodeResponse.data.status === 'OK') {
        //         const addressComponents = geocodeResponse.data.results[0].address_components;
        //         const formattedAddress = geocodeResponse.data.results[0].formatted_address;

        //         const addressDetails = {
        //             formattedAddress,
        //             locality: 'NOT FOUND',
        //             sublocality: 'NOT FOUND',
        //             region: 'NOT FOUND',
        //             country: 'NOT FOUND',
        //             postalCode: 'NOT FOUND',
        //             landmarks: []
        //         };

        //         addressComponents.forEach(component => {
        //             const types = component.types;
        //             if (types.includes('locality')) addressDetails.locality = component.long_name;
        //             if (types.includes('sublocality')) addressDetails.sublocality = component.long_name;
        //             if (types.includes('administrative_area_level_1')) addressDetails.region = component.long_name;
        //             if (types.includes('country')) addressDetails.country = component.long_name;
        //             if (types.includes('postal_code')) addressDetails.postalCode = component.long_name;
        //         });

        //         // Fetch landmarks from the Places API
        //         const placesResponse = await axios.get(placesUrl);
        //         if (placesResponse.data.status === 'OK') {
        //             addressDetails.landmarks = placesResponse.data.results.map(place => ({
        //                 name: place.name,
        //                 vicinity: place.vicinity,
        //                 location: place.geometry.location
        //             }));
        //         }

        //         return addressDetails;
        //     } else {
        //         console.error("Geocoding API error:", geocodeResponse.data.status);
        //         throw new Error(`Geocoding error: ${geocodeResponse.data.status}`);
        //     }
        // } catch (error) {
        //     console.error("Error fetching address:", error.message);
        //     return null;
        // }
    };

    const fe = async () => {
        if (memberProfile?.location?.coordinates) {
            try {
                const addressDetails = await getAddressFromCoordinates(
                    memberProfile.location.coordinates[0],
                    memberProfile.location.coordinates[1],
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

    // console.log('=============== Address Details[MapOneMapBox] ===============', locationDetails?.locality);
    // console.log(d);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        let locationInterval;

        if (appState === 'active') {
            locationInterval = setInterval(() => {
                console.log('active fetching .......', location?.latitude, location?.longitude);

                if (memberProfile?.name) {
                    getCurrentLocation();

                    // console.log('Last coordinates[MapOneMapBox].......', memberProfile?.location?.coordinates, memberProfile?.name);
                    updateLocationIfNeeded(
                        location?.latitude,
                        location?.longitude,
                        memberProfile?.location?.coordinates,
                        locationDetails
                    )
                    // Check if the location has changed by more than 100 meters
                    // Call the updateLocationIfNeeded function (or similar logic)
                    // Example:
                    // updateLocationIfNeeded(prevLocation, newLocation);
                }
                // setPrevLocation(newLocation); // Update the previous location
                fetchMemberProfile()
            }, 4000); // Set interval to fetch location every 10 seconds (10000ms)
        }
        //===================================
        if (appState === 'background') {
            locationInterval = setInterval(async () => {
                console.log('bg fetching andar se  .......');

                await BackgroundService.start(veryIntensiveTask, options);

            }, 2000);
        }
        //======================================
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
        if (location) {
            mapRef.current?.setCamera({
                centerCoordinate: [location.longitude, location.latitude],
                zoomLevel: 14,
                animationDuration: 1000,
            });
        }
    }, [location]);
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
                        <MapView ref={mapRef} style={styles.map}>

                            <Camera
                                zoomLevel={14}
                                centerCoordinate={[location ? location.longitude : 0.0, location ? location.latitude : 0.0]}
                            />



                            <MarkerView
                                allowOverlap={true}
                                // key={index}
                                coordinate={[
                                    location ? location?.longitude : 0.0, // longitude
                                    location ? location?.latitude : 0.0, // latitude
                                ]}
                            >
                                <View
                                // style={styles.markerInfo}
                                >


                                    <Button style={styles.markerTitle}
                                        title={`Place: ${locationDetails?.locality} \n accuracy : ${location?.accuracy}m`}
                                    />


                                </View>
                                <View style={styles.customMarker}>
                                    {/* <MySvgComponent /> */}
                                    <Image
                                        source={require("../components/Assets/pin.jpg")}
                                        style={styles.memberImage}
                                    />
                                </View>


                            </MarkerView>



                        </MapView>
                    </View>
                ) :
                <Loader />
            }
        </SafeAreaView>
    );
};

export default MapOneMapBox;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'flex-end',
    },
    mapStyle: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
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
    memberImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    markerImage: {
        width: 50,
        height: 50,
    },
    customMarker: {
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 250,
    },
    // map: {
    //     width: "100%",
    //     height: "100%",
    // },
});