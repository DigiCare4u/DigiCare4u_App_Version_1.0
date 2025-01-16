import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, PermissionsAndroid, Switch } from 'react-native';
import { useAuth } from '../context/auth';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { useIsFocused } from '@react-navigation/native';  // Import useIsFocused

const CheckPermisaion = () => {
  const [isToggled, setIsToggled] = useState(false);
  const { IsBackgroundLocationAccessGranted } = useAuth()
  const animatedValue = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused(); // Detect if the screen is focused

  const [hasBgLocationAccess, setHasBgLocationAccess] = useState(false)







  // useEffect(async () => {
  //   const bgLocationAccess = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
  //   setHasBgLocationAccess(bgLocationAccess)


  // }, [])



  useEffect(async() => {
    if (isFocused) {
    const bgLocationAccess = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
    setHasBgLocationAccess(bgLocationAccess)

    }
  }, [isFocused]); // Dependency array includes isFocused





  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],  // Adjust this based on button width
  });
  const requestBackgroundLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission',
          message:
            'This app needs access to your location in the background.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true; // Permission granted
      } else {
        Alert.alert('Permission Denied', 'Background location access is required.');
        return false; // Permission denied
      }
    } catch (err) {
      console.warn(err);
      return false; // Handle error
    }
  };

  // Function to toggle the button
  const handleToggle = async () => {
    console.log('toggle [permision ', hasBgLocationAccess);

    if (!hasBgLocationAccess) {
      // Ask for background location permission if not granted
      const permissionGranted = await requestBackgroundLocationPermission();
      if (hasBgLocationAccess) {
        // If permission is granted, toggle access
        setHasBgLocationAccess(true);
        Animated.timing(animatedValue, {
          toValue: 0, // Move button to 'ON' position
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    } else {
      // If already granted, toggle to OFF state
      setHasBgLocationAccess(false);
      Animated.timing(animatedValue, {
        toValue: 0, // Move button to 'OFF' position
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // Interpolating the animated value for smooth transition
  const togglePosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30], // Moving button between two positions
  });

  console.log('hasBgLocationAccess', hasBgLocationAccess);


  return (

    <View style={styles.container}>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <View style={{
          height: 20,
          width: 20,
          borderRadius: 10, // Ensures it's a perfect circle
          backgroundColor: hasBgLocationAccess ? 'green' : 'red' // Conditional color based on state
        }} />
        <Text style={styles.headerText}>Live Tracking</Text>
      </View>

      {/* <View style={styles.toggleContainer}> */}
      {hasBgLocationAccess ? (
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={'green'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggle}
          value={true}
        />
      ) : (
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={'red'}
          // thumbColor={hasBgLocationAccess ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggle}
          value={false}
        />
      )}
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginVertical: 10,
    borderRadius: 10,
  },
  headerText: {
    color: "black",
    padding: 5,
    fontSize: 18,
  },
  toggleContainer: {
    width: 100,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    padding: 1,
  },
  toggleButton: {
    width: 45,
    height: 45,
    borderRadius: 20,
    backgroundColor: '#376ADA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },


});

export default CheckPermisaion;
