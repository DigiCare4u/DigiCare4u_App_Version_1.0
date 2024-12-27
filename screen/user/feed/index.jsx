import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import ImagesCollarge from '../../../components/User/UserImagesCollarge';
import ChannelList from '../../../components/User/Channel/list';
import AddChannelModal from '../../../components/Modal/UserModel/AddChannelModal';
import DatePickerOne from '../../../components/DatePickerOne';
import InsightMap from '../../../components/User/UserInsightMap';

const UserFeed = () => {
  const navigation = useNavigation();
  const [Ischannelmodel, setIsChannelModal] = useState(false);
  const [whichChannelIsSelected, setWhichChannelIsSelected] = useState('');
  // console.log('whichChannelIsSelected---dddd---------', whichChannelIsSelected);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Feed</Text>
      </View>
      <View style={styles.mainContainer}>
        {/* Left Side */}
        <View style={styles.leftContainer}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsChannelModal(true)}>
              <Icon name="pluscircleo" size={40} color="black" />
            </TouchableOpacity>
          </View>
          <ChannelList setWhichChannelIsSelected={setWhichChannelIsSelected} />
        </View>

        {/* Right Side */}
        <View style={styles.rightContainer}>
          <ImagesCollarge whichChannelIsSelected={whichChannelIsSelected} />
        </View>
      </View>

      {/* Add Channel Modal */}
      <AddChannelModal
        visible={Ischannelmodel}
        setVisible={setIsChannelModal}
      />
    </SafeAreaView>
  );
};

export default UserFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
    // backgroundColor:"red"
  },
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'baseline',
    // backgroundColor:"red"
  },
  leftContainer: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 2,
    // backgroundColor: '#fff',
    // borderRadius: 10,
    width: '19%',
  },
  rightContainer: {
    width: '80%',
    padding: 10,
    borderRadius: 10,
    // backgroundColor:"red"
  },
  addButton: {
    height: 40,
    width: 40,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    color: '#007ACC',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
