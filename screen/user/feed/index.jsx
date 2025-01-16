import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import ChannelMembers from '../../../components/User/ChannelMembers'
import ChannelList from '../../../components/User/Channel/list';
import AddChannelModal from '../../../components/Modal/UserModel/AddChannelModal';

const UserFeed = () => {
  const navigation = useNavigation();
  const [isChannelModal, setIsChannelModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('');
  // console.log('selectedChannel aaya ---',selectedChannel);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Feed</Text>
      </View>

      <View style={styles.mainContainer}>
        {/* Left Container */}
        <View style={styles.leftContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsChannelModal(true)}
          >
            <Icon name="pluscircleo" size={40} color="black" />
          </TouchableOpacity>
          <ChannelList setWhichChannelIsSelected={setSelectedChannel} />
        </View>

        {/* Right Container */}
        <View style={styles.rightContainer}>
          <ChannelMembers whichChannelIsSelected={selectedChannel} />
        </View>
      </View>

      {/* Add Channel Modal */}
      <AddChannelModal
        visible={isChannelModal}
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
    paddingHorizontal: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007ACC',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    width: '30%',
    alignItems: 'center',
  },
  addButton: {
    marginBottom: 15,
  },
  rightContainer: {
    width: '72%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
