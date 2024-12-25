import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DateInsights from './UserDateInsights';
import useUserFetchChannel from '../../hooks/useUserFetchChannel';
import DatePickerOne from '../DatePickerOne';
import LiveTrackingMap from '../LiveTrackerMap';

const {width} = Dimensions.get('window');

const getStatusColor = status => {
  switch (status) {
    case 'Online':
      return 'green';
    case 'Offline':
      return 'red';
    default:
      return 'red'; // Defaulting to 'Offline'
  }
};

const ImagesCollarge = ({whichChannelIsSelected}) => {
  const [selectedMmeberId, setSelectedMmeberId] = useState(null);
  const {fetchChannelMember, channelMemberList} = useUserFetchChannel();
  const [loading, setLoading] = useState(true);

  // console.log('whichChannelIsSelected',whichChannelIsSelected)
  // console.log('selectedChannel',selectedChannel)

  useEffect(() => {
    const membersLoad = async () => {
      setLoading(true); // Start loading
      await fetchChannelMember(whichChannelIsSelected); // Wait for the fetch to complete
      setLoading(false); // Stop loading after data is fetched
    };
    membersLoad();
  }, [whichChannelIsSelected]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedMmeberId(item.memberId);
        }}>
        <View
          style={[
            styles.imageWrapper,
            selectedMmeberId === item?.memberId
              ? styles.selectedMmeberId
              : styles.unselectedChannel,
          ]}>
          <ImageBackground
            source={{
              uri:
                item.uri ||
                'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.image}>
            <View
              style={[
                styles.statusDot,
                {backgroundColor: getStatusColor(item.status)},
              ]}
            />
          </ImageBackground>
          <Text style={{color: 'black', fontSize: 10, padding: 5}}>
            {item.memberName || 'Not Found'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : channelMemberList ? (
          <FlatList
            data={channelMemberList?.data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
          />
        ) : (
          <Text style={{color: 'black'}}>Member is not Available</Text>
        )}
      </View>
      <DateInsights selectedMmeberId={selectedMmeberId} />
    </SafeAreaView>
  );
};

export default ImagesCollarge;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 5,
    // backgroundColor:"red"
  },
  imageWrapper: {
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 5,
    padding: 5,
    // backgroundColor:"red"
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 15,
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  selectedMmeberId: {
    borderWidth: 0, // Remove border
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000', // Shadow color
    shadowOffset: {width: 0, height: 2}, // Shadow offset
    shadowOpacity: 0.8, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 5, // Android shadow elevation
  },
  unselectedChannel: {
    borderWidth: 0,
  },
});
