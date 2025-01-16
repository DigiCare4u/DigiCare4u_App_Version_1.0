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
import React, { useEffect, useState } from 'react';
import UserMemberTimeLineFeed from './UserMemberTimeLineFeed';
import useUserFetchChannel from '../../hooks/useUserFetchChannel';
import DatePickerOne from '../DatePickerOne';
import LiveTrackingMap from '../LiveTrackerMap_og';
import Loader from '../Loader';

const { width } = Dimensions.get('window');

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

const ChannelMembers = ({ whichChannelIsSelected }) => {

  // console.log('whichChannelIsSelected aaya ---',whichChannelIsSelected);


  const [selectedMmeberId, setSelectedMmeberId] = useState('');
  const { fetchChannelMember, channelMemberList } = useUserFetchChannel();
  const [loading, setLoading] = useState(true);
  const [selectDate, setSelectDate] = useState(null);


  const membersLoad = async () => {
    setLoading(true); // Start loading
    await fetchChannelMember(whichChannelIsSelected);
    // console.log('----------data------------', channelMemberList?.data[0]);
    setSelectedMmeberId(channelMemberList?.data[0]?.memberId?._id)
    setLoading(false);
  };
  useEffect(() => {
    membersLoad();
  }, [whichChannelIsSelected]);





  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedMmeberId(item?.memberId?._id);
        }}>
        <View
          style={[
            styles.imageWrapper,
            selectedMmeberId === item?.memberId?._id
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
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
          </ImageBackground>
          <Text style={{ color: 'black', fontSize: 10, padding: 5 }}>
            {item?.memberId?.name || 'Not Found'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  // console.log('channelMemberList----', channelMemberList);


  return (
    <SafeAreaView>
      <View>
        {channelMemberList ? (
          <>
            <FlatList
              data={channelMemberList?.data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.container}
            />
            <UserMemberTimeLineFeed
              selectedMmeberId={selectedMmeberId}
              setSelectDate={setSelectDate}
            />
          </>
        ) : (
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: 'red',
                marginTop: 50,
                fontWeight: '500',
              }}
            >
              No Members Found
            </Text>
          </View>
        )}
      </View>

      {/* <LiveTrackingMap
        selectedMmeberId={selectedMmeberId}
        selectedDate_={selectDate}
      transitMemberData={transitMemberData}
      memberId={selectedMmeberId}
      /> */}
    </SafeAreaView >
  );
};

export default ChannelMembers;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  imageWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Android shadow elevation
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderWidth: 2,
    borderColor: '#fff', // Adds a white border for better visibility
  },
  selectedMmeberId: {
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  unselectedChannel: {
    backgroundColor: '#fff',
  },
  memberName: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  emptyState: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

