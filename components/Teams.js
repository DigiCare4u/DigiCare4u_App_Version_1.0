import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { devURL } from '../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import GoogleMap from './GoogleMap'; // Adjust the import path as necessary

const Teams = () => {
    const [teamMember, setTeamMember] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const jwtToken = await AsyncStorage.getItem('token');

            const response = await axios.get(`${devURL}/member/team`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwtToken}`,
                },
            });

            setTeamMember(response?.data.team); // Use response.data.team
            setError(null); // Reset error state on successful fetch
        } catch (err) {
            setError(err.message || "Failed to fetch records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, [teamMember._id]); // Run once on component mount

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    const renderItem = ({ item }) => (
        <View style={styles.friendItem}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.imageUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                    style={styles.friendImage}
                />
                <View
                    style={[
                        styles.statusDot,
                        { backgroundColor: item.onlineStatus === 'Online' ? 'green' : 'red' },
                    ]}
                />
            </View>
        </View>
    );

    const activeTeamMember = teamMember.find(member => member.locationStatus === 'active');
    const userLocation = activeTeamMember ? activeTeamMember.location.coordinates : [0, 0]; // Default to [0, 0] if none

    return (
        <View style={styles.container}>
            <FlatList
                data={teamMember}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                initialNumToRender={4}
                style={styles.friendList}
            />
        </View>
    );
};

export default Teams;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor:"red"
    },
    friendList: {
        padding: 10,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    imageContainer: {
        position: 'relative',
    },
    friendImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    statusDot: {
        width: 22,
        height: 22,
        borderRadius: 16,
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: '#fff',
    },
    errorText: {
        fontSize: 20,
        fontWeight: "700",
        color: "red",
        textAlign: 'center',
    },
    friendName: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
    },
});
