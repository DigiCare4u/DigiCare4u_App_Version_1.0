import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 3000); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../components/Assets/logo.jpg')}  // Use require for local image
        style={styles.logo}
      />
      <Text style={styles.appName}>DigiCare4u</Text>

      <ActivityIndicator size="large" color="#00ffcc" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',  // Splash background color
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ffcc',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});

export default Splash;
