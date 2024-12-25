import React, { useEffect, useState } from 'react';
import { View, ToastAndroid, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { PermissionsAndroid } from 'react-native'; // Import PermissionsAndroid
import GetLocation from 'react-native-get-location'
const CurrentLocation = () => {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  console.log('--------- CurrentLocation ----------------')

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      ToastAndroid.show("Location permission denied", ToastAndroid.SHORT);
      return;
    }
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {

        console.log('--------- latitude  ----------------', location.latitude )
        console.log('--------- longitude  ----------------', location.longitude )
        setLatitude(location.latitude);
        setLongitude(location.longitude);
        // Log the coordinates to the console
        // console.log('Latitude:', location.latitude);
        // console.log('Longitude:', location.longitude);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
        Alert.alert('Location Error', message);
      });

    // console.log('--------- hasPermission ----------------', hasPermission)

  };

  useEffect(() => {
    getCurrentLocation();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <View style={styles.secoundMain}>

          <TouchableOpacity
          // disabled={isButtonDisabled || loading}
          // style={[styles.button, (isButtonDisabled || loading) && styles.buttonDisabled]}
          // onPress={onc}
          >
            <Text style={styles.buttonText}>{'Location'}</Text>
            <Text style={styles.buttonText}>{latitude}</Text>
            <Text style={styles.buttonText}>{longitude}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
};

export default CurrentLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  mainView: {
    alignItems: 'center',
  },
  secoundMain: {
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: 'black',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#008000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#008000',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});
