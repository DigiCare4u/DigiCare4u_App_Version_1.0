import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Text
} from 'react-native';
import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
import BackgroundService from 'react-native-background-actions';
import BackgroundTimer from 'react-native-background-timer';
import RNLocation from 'react-native-location';
 
// Sleep helper function
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
 
// Intensive background task
const veryIntensiveTask = async (taskDataArguments) => {
  const { delay } = taskDataArguments;
 
  for (let i = 0; BackgroundService.isRunning(); i++) {
    // Simulate a delay
    await sleep(delay);
  }
};
 
// Options for the background task
const options = {
  taskName: 'LocationTracker',
  taskTitle: 'Tracking location in background',
  taskDesc: 'Location is being tracked',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane',
  parameters: {
    delay: 5000, // 5 seconds interval
  },
};
 
function App() {
  const [serviceRunning, setServiceRunning] = useState(false);
  const [location, setLocation] = useState(null);
 
  const startBackgroundService = async () => {
    try {
      await BackgroundService.start(veryIntensiveTask, options);
      setServiceRunning(true);
      console.log('Background service started successfully!');
    } catch (e) {
      console.error('Error starting background service:', e);
      setServiceRunning(false);
    }
  };
 
  // Configure location and permissions
  const configureLocation = async () => {
    await RNLocation.configure({ distanceFilter: 5.0 });
    const granted = await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: { detail: 'coarse' },
    });
 
    if (granted) {
      return true;
    }
    return false;
  };
 
  // Fetch location
  const fetchLocation = async () => {
    const currentLocation = await RNLocation.getLatestLocation({ timeout: 10000 });
    if (currentLocation) {
      setLocation(currentLocation);
      console.log('Updated location:', currentLocation?.latitude);
    }
  };
 
  useEffect(() => {
    // Initialize location tracking and background service
    (async () => {
      const permissionGranted = await configureLocation();
      if (permissionGranted) {
        startBackgroundService();
       
        BackgroundTimer.runBackgroundTimer(() => {
          fetchLocation(); // Fetch location every interval
        }, 2000); // Set interval in milliseconds
      }
    })();
 
    return () => {
      BackgroundTimer.stopBackgroundTimer(); // Stop timer on unmount
    };
  }, []);
 
  const isDarkMode = useColorScheme() === 'dark';
 
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
 
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <Header />
        <Text>Background Service Running: {serviceRunning ? 'True' : 'False'}</Text>
        <Text>Current Location: {location ? `Lat: ${location.latitude}, Lon: ${location.longitude}` : 'Fetching location...'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
 
export default App;