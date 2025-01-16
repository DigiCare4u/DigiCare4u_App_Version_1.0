import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import ChannlMiddleWellModel from '../sideBar/userChannelSideBar';
import useUserFetchChannel from '../../hooks/useUserFetchChannel';

const ChannelNavbar = () => {
  const navigation = useNavigation();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isvisiblemodel, setVisibleModel] = useState(false);
  const { channelList, fetchChannelList} = useUserFetchChannel();


   useEffect(()=>{
    channelList
   }, [fetchChannelList]);

   console.log('====channelMember=======',channelList)

  const ChannelList = [
    {id: '1', name: 'Channel 1', avatar: 'https://via.placeholder.com/50'},
    {id: '2', name: 'Channel 2', avatar: 'https://via.placeholder.com/50'},
    {id: '3', name: 'Channel 3', avatar: 'https://via.placeholder.com/50'},
    {id: '4', name: 'Channel 4', avatar: 'https://via.placeholder.com/50'},
    {id: '5', name: 'Channel 5', avatar: 'https://via.placeholder.com/50'},
  ];

  const renderChannelList = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          styles.memberItem,
          selectedChannel === item.id && styles.selectedChannel,
        ]}
        onPress={() => {
          setSelectedChannel(item.id);
          setVisibleModel(true);
        }}>
        <Image source={{uri: item.avatar}} style={styles.memberAvatar} />
        <Text style={styles.memberName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.sliderContainer}>
        <FlatList
          data={ChannelList}
          renderItem={renderChannelList}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <ChannlMiddleWellModel
        visible={isvisiblemodel}
        setVisible={setVisibleModel}
      />
    </SafeAreaView>
  );
};

export default ChannelNavbar;

const styles = StyleSheet.create({
  sliderContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#5dade2',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  memberItem: {
    alignItems: 'center',
    marginVertical: 5,
  },
  selectedChannel: {
    borderWidth: 1,
    borderColor: '#007ACC',
    borderRadius: 5,
    padding: 4,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 35,
    marginBottom: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  memberName: {
    fontSize: 10,
    color: '#007ACC',
  },
});
