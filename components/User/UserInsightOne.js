import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const InsightOne = () => {
  return (
    <View style={styles.card}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>Map Placeholder</Text>
      </View>
    </View>
  );
};

export default InsightOne;

const styles = StyleSheet.create({
  mapPlaceholder: {
    width: '100%',
    height: 250, 
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Optional: rounded corners
    borderWidth: 1,
    borderColor: '#d0d0d0',
    marginTop:10,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
  },
});
