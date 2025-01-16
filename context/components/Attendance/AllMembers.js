import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import useFetchUser from '../../hooks/useFetchUser';

const { width } = Dimensions.get('window');
const cardSize = (width - 50) / 2; // Two cards per row with 10px padding on both sides

const AllMembers = () => {
  const { userMembersList, fetchUserMembersList } = useFetchUser();

  useEffect(() => {
    fetchUserMembersList();
  }, []);

  // Render a single member item
  const renderMemberItem = ({ item }) => (
    <View style={[styles.memberCard, { width: cardSize, height: cardSize }]}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder for user profile pictures
        style={styles.profileImage}
      />
      <Text style={styles.nameText}>{item.name}</Text>
      <Text style={styles.groupTypeText}>{item.groupType}</Text>
      {item.latestTracking?.timestamp && (
        <Text style={styles.trackingText}>
         Last seen: {new Date(item.latestTracking.timestamp).toLocaleDateString()}
         <Text>{new Date(item.latestTracking.timestamp).toLocaleTimeString()}</Text>
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userMembersList} // Assuming `userMembersList` is an array from your hook
        renderItem={renderMemberItem}
        keyExtractor={(item) => item._id}
        numColumns={2} // Display items in 2 columns
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
};

export default AllMembers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    margin:2
   },
  listContainer: {
    justifyContent: 'space-between',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  memberCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    // marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#376ADA',
    textAlign: 'center',
  },
  groupTypeText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginBottom: 5,
  },
  trackingText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
