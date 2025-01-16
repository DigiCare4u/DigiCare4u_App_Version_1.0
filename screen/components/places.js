import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

const placesData = [
  { id: '1', name: 'Hotel' },
  { id: '2', name: 'Hospital' },
  { id: '3', name: 'Police Station' },
  { id: '4', name: 'Cafe' },
  { id: '5', name: 'School' },
  { id: '6', name: 'College' },
  { id: '7', name: 'Park' },
  { id: '8', name: 'Library' },
];

const Places = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={placesData}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Places;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
  },
  listContainer: {
    // paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
