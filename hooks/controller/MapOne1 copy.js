import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Loader from '../components/Loader';
import { startBackgroundLocation } from '../services/bgActions';
import useFetchMember from '../hooks/useFetchMember';
import getDistanceFromLatLonInMeters from '../services/distanceMatrix';
import { AppState } from 'react-native';
import { updateLocationIfNeeded } from '../services/coreTracking';
import useLocation from '../hooks/useLocation';

const MemberMap = () => {

    //============ BG Action ========================

    //====================================
    const { memberProfile, fetchMemberProfile } = useFetchMember()

    const { location, getCurrentLocation } = useLocation()
    const [appState, setAppState] = useState(AppState.currentState);
    const [prevLocation, setPrevLocation] = useState(null);
    const [locationUpdateTrigger, setLocationUpdateTrigger] = useState(0);

    useEffect(() => {
        if (!memberProfile) {
            fetchMemberProfile();
        }
    }, [memberProfile, fetchMemberProfile]);

    //=============location==================
    useEffect(() => {
        if (!location) {
            getCurrentLocation()
        }
    }, [getCurrentLocation]);
    //=============location==================

    // console.log('======location[MapOne]======')
    // console.log(location)


    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        let locationInterval;

        if (appState === 'active') {
            locationInterval = setInterval(() => {
                console.log('active fetching .......');

                if (memberProfile?.name) {
                    console.log('Last coordinates.......', memberProfile?.location?.coordinates, memberProfile?.name);
                    updateLocationIfNeeded(
                        location?.latitude, location?.longitude,
                        memberProfile?.location?.coordinates)

                    setLocationUpdateTrigger((prev) => prev + 1);

                    // updateLocationIfNeeded(prevLocation, newLocation);
                }
                // setPrevLocation(newLocation); // Update the previous location
                fetchMemberProfile()
            }, 5000); // Set interval to fetch location every 10 seconds (10000ms)
        }

        return () => {
            if (locationInterval) {
                clearInterval(locationInterval); // Clean up the interval on component unmount or app state change
            }
            subscription.remove();
        };
    }, [appState, memberProfile, latitude, longitude]);

    console.log('=======logs[MapOne]==========')
    console.log(latitude, longitude)

    //========= re-animiating the map on new location ===============
    const mapRef = useRef(null);
    useEffect(() => {
        if (mapRef.current && latitude && longitude) {
            mapRef.current.animateToRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000); // 1000 ms for smooth animation
        }
    }, [latitude, longitude, location]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    };

    return (
        <SafeAreaView style={styles.safeArea}>

            {(latitude & longitude) ?
                (
                    <View style={styles.container}>
                        <MapView
                            ref={mapRef}
                            style={styles.mapStyle}
                            initialRegion={{
                                latitude: latitude,
                                longitude: longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                                draggable
                                coordinate={{
                                    latitude: latitude,
                                    longitude: longitude,
                                }}
                                onDragEnd={(e) => alert(JSON.stringify(e.nativeEvent.coordinate))}
                                title={'Member Location'}
                                description={'This is the member’s current location'}
                            />
                        </MapView>
                        <View style={styles.locationInfo}>
                            <Text style={styles.infoText}>location: {location.latitude} {location.longitude}</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={styles.infoText}>Accuracy: {location.accuracy} meters</Text>
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

export default MemberMap;

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
        marginTop: 10,
        marginBottom: 5,
        padding: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        width: '85%',
        alignItems: 'center',
        backgroundColor:""
    },
    infoText: {
        fontSize: 12,
        color: '#333',
        marginBottom: 0,
        marginHorizontal: 5,
    },
});