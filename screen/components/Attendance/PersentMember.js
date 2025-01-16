import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardSize = (width - 45) / 2; // Two cards per row with padding

const data = [
  {
    id: '1',
    name: 'John Doe',
    groupType: 'IT',
    time: '10:30 AM',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '2',
    name: 'Jane Smith',
    groupType: 'Sales',
    time: '11:00 AM',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '3',
    name: 'Raj Kumar',
    groupType: 'HR',
    time: '09:45 AM',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '4',
    name: 'Anita Sharma',
    groupType: 'IT',
    time: '10:15 AM',
    image: 'https://via.placeholder.com/100',
  },
];

const PersentMember = () => {
  const renderMember = ({ item }) => (
    <View style={[styles.card, { width: cardSize, height: cardSize }]}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <Text style={styles.nameText}>{item.name}</Text>
      <Text style={styles.groupTypeText}>{item.groupType}</Text>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default PersentMember;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  groupTypeText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
