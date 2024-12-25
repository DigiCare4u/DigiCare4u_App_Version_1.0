import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/auth';
import Logo from '../components/Assets/logo.jpeg';

const SplashScreen = ({ navigation }) => {
  const { IsAuthenticaticated } = useAuth();

  useEffect(() => {
    const checkAuthentication = async () => {
      const user = await IsAuthenticaticated(navigation);
      if (user) {
        // Navigate to the appropriate home screen based on the role
        navigation.reset({
          index: 0,
          routes: [{ name: `Home/${user.role}` }],
        });
      } else {
        navigation.replace('Login');
      }
    };

    // Add a delay for the splash screen animation
    const timer = setTimeout(checkAuthentication, 10);

    return () => clearTimeout(timer);
  }, [IsAuthenticaticated, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={Logo} style={styles.image} />
        <Text style={styles.text}>Welcome to DigiCare4u</Text>
      </View>
      <ActivityIndicator size="large" color="#007ACC" />
      <Text style={styles.subText}>Version 1.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007ACC',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subText: {
    fontSize: 16,
    color: '#808080',
    letterSpacing: 1,
    marginBottom: 10,
  },
});

export default SplashScreen;
