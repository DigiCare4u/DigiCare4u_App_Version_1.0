import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

const ChannelMemberList = () => {
  const ChannelList = [
    {id: '1', name: 'Name 1', avatar: 'https://via.placeholder.com/50'},
    {id: '2', name: 'Name 2', avatar: 'https://via.placeholder.com/50'},
    {id: '3', name: 'Name 3', avatar: 'https://via.placeholder.com/50'},
    {id: '4', name: 'Name 4', avatar: 'https://via.placeholder.com/50'},
    {id: '5', name: 'Name 5', avatar: 'https://via.placeholder.com/50'},
  ];

  const renderChannelList = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity style={styles.memberItem}>
        <View>
          <Image source={{uri: item.avatar}} style={styles.memberAvatar} />
          <Text style={styles.memberName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
      {/* background Action Reqest */}
      {/* <View style={{borderColor:"blue", borderWidth:1,borderRadius:5, padding:4,}}>
        <TouchableOpacity>
        <Text style={{color:"blue"}}>BG - Requset</Text>
        </TouchableOpacity>
      </View> */}
      {/* S.O.S Button */}
      {/* <View style={{backgroundColor:"red", padding:5, borderRadius:5}}>
        <TouchableOpacity>
        <Text style={{color:"white", }}>S.O.S</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        data={ChannelList}
        renderItem={renderChannelList}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChannelMemberList;

const styles = StyleSheet.create({
  sliderContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#5dade2',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: '80%',
    padding: 10,
    marginVertical: 5,
    alignSelf: 'center',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5,
  },
  memberName: {
    fontSize: 12,
    color: '#007ACC',
  },
});
