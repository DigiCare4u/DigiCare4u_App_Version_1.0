import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
 
const Loader = ({ message = 'Loading...', size = 'large', color = '#376ADA' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Change background color if necessary
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333', // Change text color if necessary
  },
});
 
export default Loader;