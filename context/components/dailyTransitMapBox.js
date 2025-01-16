import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapboxGL from '@rnmapbox/maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { devURL } from '../constants/endpoints';

const accessToken = 'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ'; // Replace with your Mapbox token
MapboxGL.setAccessToken(accessToken); // Replace with your Mapbox token

const DailyTransitMapBox = ({ memberId }) => {
    // let today = new Date().toISOString().split('T')[0]

    const [locations, setLocations] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    // console.log('today',date);

    const fetchDailyLocations = async (selectedDate) => {
        try {
            
            const jwtToken = await AsyncStorage.getItem('token');
            
            const response = await axios.get( `${devURL}/user/members/${memberId}/daily-transit?date=${date}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                params: {
                    date: selectedDate.toISOString().split('T')[0],
                },
            });
            
            const locationData = response?.data?.data;
            console.log('----------locationData:', locationData);
            if (locationData?.length > 0) {
                setLocations(locationData);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    useEffect(() => {
        fetchDailyLocations(date);
    }, [date]);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const getCoordinates = () => locations?.map(loc => [loc?.location?.coordinates[0], loc?.location?.coordinates[1]]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>Select Date</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <MapboxGL.MapView style={styles.map}>
                <MapboxGL.Camera
                    zoomLevel={14}
                    centerCoordinate={
                        locations.length
                            ? [locations[0]?.location?.coordinates[0], locations[0]?.location?.coordinates[1]]
                            : [-122.4324, 37.78825]
                    }
                />

                {locations.map((location, index) => (
                    <MapboxGL.PointAnnotation
                        key={index}
                        id={`marker-${index}`}
                        coordinate={[location?.location?.coordinates[0], location?.location?.coordinates[1]]}
                    >
                        <View style={styles.marker}>
                            <Text style={styles.markerText}>{index + 1}</Text>
                        </View>
                    </MapboxGL.PointAnnotation>
                ))}

                {locations.length > 1 && (
                    <MapboxGL.ShapeSource
                        id="routeLine"
                        shape={{
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: getCoordinates(),
                            },
                        }}
                    >
                        <MapboxGL.LineLayer id="routeLayer" style={styles.routeLine} />
                    </MapboxGL.ShapeSource>
                )}
            </MapboxGL.MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 5,
    },
    map: {
        flex: 1,
        height: 400, // Adjust as needed
        marginTop: 20,
    },
    dateButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    dateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
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
    routeLine: {
        lineWidth: 3,
        lineColor: '#007AFF',
    },
});

export default DailyTransitMapBox;
