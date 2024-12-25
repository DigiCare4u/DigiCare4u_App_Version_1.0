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
 
const MemberMap = ({ latitude, longitude }) => {

    //============ BG Action ========================
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
 
    const runBgTask = async () => {
        await BackgroundService.start(veryIntensiveTask, options);
 
    }
    //====================================
 
    const { memberProfile, fetchMemberProfile } = useFetchMember()
 
 
    const { location, getCurrentLocation } = useLocation()
    const [appState, setAppState] = useState(AppState.currentState);
    const [prevLocation, setPrevLocation] = useState(null);
 
    useEffect(() => {
        if (!memberProfile) {
            fetchMemberProfile();
        }
    }, [memberProfile, fetchMemberProfile]);
 
    //============================================
    // useEffect(() => {
    //     const handleAppStateChange = (nextAppState) => {
    //         setAppState(nextAppState);
    //     };
 
    //     const subscription = AppState.addEventListener('change', handleAppStateChange);
 
    //     return () => {
    //         subscription.remove();
    //     };
    // }, []);
    //============================================
 
 
    useEffect(() => {
        if (!location) {
            getCurrentLocation()
        }
    }, [getCurrentLocation]);
 
 
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
                        latitude, longitude,
                        memberProfile?.location?.coordinates)
                    // Check if the location has changed by more than 100 meters
                    // Call the updateLocationIfNeeded function (or similar logic)
                    // Example:
                    // updateLocationIfNeeded(prevLocation, newLocation);
                }
                // setPrevLocation(newLocation); // Update the previous location
                fetchMemberProfile()
            }, 5000); // Set interval to fetch location every 10 seconds (10000ms)
        }
 
//  ==========later===========================
        if (appState === 'background') {
            locationInterval = setInterval(async () => {
                console.log('bg fetching andar se  .......');

                await BackgroundService.start(veryIntensiveTask, options);
 
            }, 2000);
        }
// ================================================

        return () => {
            if (locationInterval) {
                clearInterval(locationInterval); // Clean up the interval on component unmount or app state change
            }
            subscription.remove();
        };
    }, [appState, memberProfile, latitude, longitude]);

    console.log('=======[MapOne]logs==========')
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
    }, [latitude, longitude]);
    //=================================================
    console.log(appState);
 
 
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
                                title={memberProfile?.name || 'Member Location'}
                                description={ 'This is the member’s current location'}
                            />
                        </MapView>
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
});