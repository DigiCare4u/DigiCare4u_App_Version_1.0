import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign';
import CheckBox from '@react-native-community/checkbox';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import useUserFetchChannel from '../../hooks/useUserFetchChannel';
import {emitEvent, onEvent} from '../../services/socket/config';

const UserChannelSideBar = ({visible, setVisible, selectedChannelId}) => {
  // console.log('selectedChannelId _______', selectedChannelId);
  const [checkBox, setCheckBox] = useState(false);
  const {channelMemberList, fetchChannelMember} = useUserFetchChannel();
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckBoxToggle = (itemId) => {
    setCheckedItems(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
    setSelectedMemberId(itemId);
    // setSelectedMemberId(item?.memberId);

    console.log('member Id : ', itemId);
  };



  const [selectedMemberId, setSelectedMemberId] = useState('');
  useEffect(() => {
    fetchChannelMember(selectedChannelId);
  }, [selectedChannelId]);

  //===============================

  const renderChannelMemberList = ({item}) => {
    if (!item) {
      return (
        <Text style={{color: 'red', textAlign: 'center'}}>Loader .....</Text>
      );
    }
    // console.log('item', item);
    return (
      <View style={styles.Card}>
        <View style={styles.memberItem}>
          {item ? (
            <View style={styles.memberDetails}>
              {/* Checkbox */}
              <View
                style={[
                  styles.checkboxWrapper,
                  checkBox && styles.checkedWrapper,
                ]}>
                <CheckBox
                  onValueChange={() => handleCheckBoxToggle(item?.memberId)}

                  value={checkedItems[item?.memberId] || false} // Check state for this item
                  // onValueChange={() => {
                  //   setCheckBox(prev => !prev);
                  //   setSelectedMemberId(item?.memberId);
                  //   console.log('member Id : ', item?.memberId);
                  // }}
                  style={styles.checkbox}
                />
              </View>

              {/* Image */}
              <Image
                source={{uri: item.avatar || 'https://via.placeholder.com/150'}}
                style={styles.memberAvatar}
              />

              {/* Member Info */}
              <View style={styles.textContainer}>
                {/* Name */}
                <Text style={styles.memberName}>{item?.memberName}</Text>
                {/* Last Location */}
                <View style={styles.locationContainer}>
                  <Icon
                    name="enviromento"
                    size={16}
                    color="#007ACC"
                    style={styles.locationIcon}
                  />
                  <Text style={styles.memberLocation}>
                    {item?.memberDetails?.lastLocation || 'Unknown Location'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={{color: 'red'}} t>
              Loader .....
            </Text>
          )}
        </View>
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
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setVisible(false)}>
          <Icon name="caretleft" size={40} color="#376ADA" />
        </TouchableOpacity>
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
        {/* <View style={styles.sliderContainer}> */}
        <FlatList
          data={channelMemberList?.data}
          renderItem={renderChannelMemberList}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', marginTop: 20}}>
              No members found.
            </Text>
          }
        />
        {/* </View> */}
        <View style={{marginVertical: 0}}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.requestButton]}
              onPress={() => Alert(pressed)}>
              <Text style={styles.buttonText}>Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.sosButton]}
              onPress={() => {
                emitEvent('SOS', {
                  memberId: selectedMemberId,
                  userId: 'not yet',
                  message: 'Big Boss wants you to be alert !',
                });
                Alert.alert('Success', 'SOS sent !');
              }}>
              <Text style={styles.buttonText}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserChannelSideBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: '12%',
    backgroundColor: '#fff',
    // backgroundColor: 'red',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 10,
  },
  sliderContainer: {
    // backgroundColor: '#fff',
    backgroundColor: 'red',
    // padding:5,
    borderRadius: 20,
    shadowColor: '#5dade2',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 120, // Adjust to center vertically
    left: -30, // Positioned to the left
    zIndex: 10, // Ensures it appears on top of other components
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
  Card: {
    // backgroundColor:"red"
  },
  // Search Bar =======================
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
  //MemberCard ===============
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2,
    // backgroundColor:"red"
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxWrapper: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderColor: '#007ACC',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkedWrapper: {
    backgroundColor: '#007ACC',
  },
  checkbox: {
    transform: [{scale: 1.4}],
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 7,
  },
  textContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007ACC',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 3,
  },
  memberLocation: {
    fontSize: 12,
    color: '#666',
  },
  // Button ================
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
