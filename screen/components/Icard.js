import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { devURL } from '../constants/endpoints';

export default function Icard() {
  const [userprofile, setUserProfile] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      setUserProfile([response?.data?.user]);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading user profile...</Text>
      </View>
    );
  }

  if (!userprofile.length) {
    return <Text>No User Data Available</Text>;
  }

  const renderUserItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} // Placeholder image
          style={styles.userImage}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.value}>{item.name || 'User Not found'}</Text>
          <Text style={styles.value}>{item.email || 'Email Not found'}</Text>
          <Text style={styles.value}>{item.mobile || 'Mobile Not found'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.cardContainer}>
      <FlatList
        data={userprofile}
        renderItem={renderUserItem}
        keyExtractor={(item, index) => item?._id?.toString() || index.toString()} // Fallback to index if no _id
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 2,
    backgroundColor:"red"
  },
  detailsContainer: {
    flexDirection: 'column',
    marginLeft: 4,
    padding:10
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },
});
