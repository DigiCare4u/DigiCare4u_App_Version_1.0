import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import useUserFetchChannel from '../../hooks/useUserFetchChannel';

const ChannlMiddleWellModel = ({visible, setVisible, selectedChannelId}) => {
  // console.log('selectedChannelId _______', selectedChannelId)
  const [message, setMessage] = useState('');
  const {channelMemberList, fetchChannelMember} = useUserFetchChannel();

  useEffect(() => {
    if (!channelMemberList || channelMemberList.length === 0) {
      fetchChannelMember(selectedChannelId);
    }
  }, [channelMemberList, fetchChannelMember]);

  // console.log('channelMemberList',channelMemberList)
  const members = channelMemberList?.data || [];
  // console.log('channelMemberList',channelMemberList)

  const renderChannelMemberList = ({item}) => {
    // console.log('channelMemberList', channelMemberList?.data?.memberDetails);
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={styles.memberItem}>
          <View>
            <Image
              source={{uri: item.avatar || 'https://via.placeholder.com/150'}}
              style={styles.memberAvatar}
            />
            <Text style={styles.memberName}>
              {item?.memberDetails?.name || 'Unknown Member'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}>
      <View style={styles.container}>
        <ScrollView>
          {/* Top Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://via.placeholder.com/150',
              }}
              style={styles.image}
            />
          </View>
          <Text style={styles.heading}>Explore</Text>

          {/* Total Members */}
          <Text style={styles.totalMembers}>
            <FontAwesomeIcon name="group" size={15} color="#376ADA" /> -{' '}
            {channelMemberList?.totalMember}
          </Text>

          {/* Search Bar and Add Button */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search Members"
              placeholderTextColor="#007ACC"
            />

          </View>
          <View style={styles.sliderContainer}>
            <FlatList
              data={members}
              renderItem={renderChannelMemberList}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  No members found.
                </Text>
              }
            />
          </View>
        </ScrollView>
        <View style={{marginVertical: 0}}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.requestButton]}
              onPress={() => Alert(pressed)}>
              <Text style={styles.buttonText}>Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.sosButton]}
              onPress={() => Alert(pressed)}>
              <Text style={styles.buttonText}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: '20%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 10,
  },
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
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    borderTopLeftRadius: 25,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    textAlign: 'left',
    marginVertical: 5,
  },
  totalMembers: {
    fontSize: 15,
    color: '#376ADA',
    textAlign: 'center',
    marginBottom: 10,
    textAlign: 'left',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007ACC',
    borderRadius: 10,
    padding: 5,
    marginRight: 10,
  },
  addButton: {
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007ACC',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  requestButton: {
    backgroundColor: '#4CAF50',
  },
  sosButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChannlMiddleWellModel;
