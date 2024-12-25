import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Platform, Image, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { devURL } from '../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DailyTransit = ({ memberId }) => {
    const [locations, setLocations] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const mapRef = useRef(null);

    const fetchDailyLocations = async (selectedDate) => {
        try {
            const jwtToken = await AsyncStorage.getItem('token');

            const response = await axios.get(`${devURL}/user/members/${memberId}/daily-transit`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                params: {
                    date: selectedDate.toISOString().split('T')[0], 
                }
            });

            const locationData = response.data.data;
            console.log('===location====')
            console.log(memberId)
            // console.log('Fetched locations:', locationData);

            if (locationData.length > 0) {
                setLocations(locationData);

                // Fit map to include all coordinates in the path
                const coordinates = locationData.map(loc => ({
                    latitude: loc.location.coordinates[1],
                    longitude: loc.location.coordinates[0],
                }));

                if (mapRef.current && coordinates.length > 0) {
                    mapRef.current.fitToCoordinates(coordinates, {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        animated: true,
                    });
                }
            }
        } catch (error) {
            console.error(error);
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

            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: locations[0]?.location?.coordinates[1] || 37.78825,
                    longitude: locations[0]?.location?.coordinates[0] || -122.4324,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {locations.map((location, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: location.location.coordinates[1],
                            longitude: location.location.coordinates[0],
                        }}
                        title={`Location ${index + 1}`}
                        description={`Time: ${new Date(location.timestamp).toLocaleTimeString()}`}
                    >
                        <Image
                            source={require('../components/Assets/pin.jpg')}
                            style={{ width: 30, height: 30 }}
                        />

                    </Marker>
                ))}

                <Polyline
                    coordinates={locations.map(loc => ({
                        latitude: loc.location.coordinates[1],
                        longitude: loc.location.coordinates[0],
                    }))}
                    strokeColor="#007AFF"
                    strokeWidth={3}
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal:5,
    },
    map: {
        width: '100%',
        height: 200, // Adjust the height as needed
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

});

export default DailyTransit;
