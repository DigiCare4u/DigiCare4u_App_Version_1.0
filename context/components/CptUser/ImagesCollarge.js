import { Dimensions, FlatList, SafeAreaView, StyleSheet, ImageBackground, View } from 'react-native';
import React from 'react';

const images = [
  { id: '1', uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', status: 'Online' },
  { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', status: 'Offline' },
  { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', status: 'Online' },
  { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', status: 'Offline' },
];

const { width } = Dimensions.get('window');

// Function to determine the color of the status dot
const getStatusColor = (status) => {
  switch (status) {
    case 'Online':
      return 'green';
    case 'Offline':
      return 'red';
    default:
      return 'Offline';
  }
};

const ImagesCollarge = () => {
  const renderItem = ({ item }) => {
    return (
      <View style={styles.imageWrapper}>
        <ImageBackground source={{ uri: item.uri }} style={styles.image}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) }, // Dynamic dot color
            ]}
          />
        </ImageBackground>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <View>
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.container}
        />
      </View>
    </SafeAreaView>
  );
};

export default ImagesCollarge;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  imageWrapper: {
    width: width * 0.14,
    marginRight: 0, 
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 50,
    height: 50,
    justifyContent: 'flex-end',
  },
  statusDot: {
    width: 15, 
    height: 15,
    borderRadius: 16,
    position: 'absolute',
    bottom: 1,
    right: 5,
    borderWidth: 1.5, 
    borderColor: 'white',
  },
});
