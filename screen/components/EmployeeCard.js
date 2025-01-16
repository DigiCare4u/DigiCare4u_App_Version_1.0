import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Animated, Easing, TouchableOpacity } from 'react-native';
import { devURL } from '../constants/endpoints';
import Icon from 'react-native-vector-icons/FontAwesome';

const EmployeeCard = ({ onPendingMemberPress, onAbsentMemberPress, onActiveMemberPress, onMemberPress }) => {
  const [totalMember, setTotalMember] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1)); // Animation scale value

  const fetchTotalMember = async () => {
    try {
      setLoading(true);
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/user/profile/overview`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const stats = response?.data?.stats;
      if (stats) {
        const formattedData = [
          { id: 1, label: 'Members', value: stats.totalMembers || 0, cardColor: '#376ADA', icon: 'users', onPress: onMemberPress },
          { id: 2, label: 'Today Active', value: stats.activeMembers || 0, cardColor: '#28A745', icon: 'check', onPress: onActiveMemberPress },
          { id: 3, label: 'Today Offline', value: stats.inactiveMembers || 0, cardColor: '#DC3545', icon: 'times', onPress: onAbsentMemberPress },
          { id: 4, label: 'Pending', value: stats.pendingMembers || 0, cardColor: '#FFC107', icon: 'hourglass-half', onPress: onPendingMemberPress },
        ];
        setTotalMember(formattedData);
      } else {
        console.error('Stats data is missing in the response.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalMember();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  const animateCard = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      item.onPress?.();
      animateCard();
    }}>
      <Animated.View style={[styles.cardContainer, { backgroundColor: item.cardColor, transform: [{ scale: scaleValue }] }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconContainer}>
            <Icon name={item.icon} size={20} color="#fff" />
          </View>
          <Text style={styles.title}>{item.label}</Text>
        </View>
        <Text style={styles.total}>{item.value}</Text>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={totalMember}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    padding: 5,
    width: 150,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginVertical:10,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 10,
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 10,
  },
});

export default EmployeeCard;
