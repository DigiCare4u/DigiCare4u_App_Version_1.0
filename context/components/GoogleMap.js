import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const GoogleMap = ({ userLocation }) => {
    useEffect(() => {
        if (!userLocation || userLocation.length < 2) {
            Alert.alert('Location Error', 'Invalid or missing user location data.');
        }
    }, [userLocation]);

    if (!userLocation || userLocation.length < 2) {
        return null;
    }

    const [longitude, latitude] = userLocation;

    // console.log('====log=====')
    // console.log(longitude, latitude)

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <MapView
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
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    mapStyle: {
        width: '100%',
        height: '100%',
    },
});

export default GoogleMap;


// const mapStyle = [
//     { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
//     { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
//     { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
//     {
//         featureType: 'administrative.locality',
//         elementType: 'labels.text.fill',
//         stylers: [{ color: '#d59563' }],
//     },
//     {
//         featureType: 'poi',
//         elementType: 'labels.text.fill',
//         stylers: [{ color: '#d59563' }],
//     },
//     {
//         featureType: 'poi.park',
//         elementType: 'geometry',
//         stylers: [{ color: '#263c3f' }],
//     },
//     {
//         featureType: 'poi.park',
//         elementType: 'labels.text.fill',
//         stylers: [{ color: '#6b9a76' }],
//     },
//     {
//         featureType: 'road',
//         elementType: 'geometry',
//         stylers: [{ color: '#38414e' }],
//     },
//     {
//         featureType: 'road',
//         elementType: 'geometry.stroke',
//         stylers: [{ color: '#212a37' }],
//     },
//     {
//         featureType: 'road',
//         elementType: 'labels.text.fill',
//         stylers: [{ color: '#9ca5b3' }],
//     },
//     {
//         featureType: 'road.highway',
//         elementType: 'geometry',
//         stylers: [{ color: '#746855' }],
//     },
//     {
//         featureType: 'road.highway',
//         elementType: 'geometry.stroke',
//         stylers: [{ color: '#1f2835' }],
//     },
//     {
//         featureType: 'road.highway',
//         elementType: 'labels.text.fill',
//         stylers: [{ color: '#f3d19c' }],
//     },
//     {
//         featureType: 'transit',
//         elementType: 'geometry',
//         stylers: [{ color: '#2f3948' }],
//     },
//     {
//         featureType: 'transit.station',
//         elementType: 'labels.text.fill',
//         stylers: [{ color: '#d59563' }],
//     },
//     {
//         featureType: 'water',
//         elementType: 'geometry',
//         stylers: [{ color: '#17263c' }],
//     },
//     {
//         featureType: 'water',
//         elementType: 'labels.text.fill',
//         stylers: [{ color: '#515c6d' }],
//     },
//     {
//         featureType: 'water',
//         elementType: 'labels.text.stroke',
//         stylers: [{ color: '#17263c' }],
//     },
// ];

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//     },
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//     },
//     mapStyle: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//     },
// });
