import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DrawerModal from './Modal/UserModel/DrawerModal';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = ({
  onSearchPress,
  onNotificationPress,
  profileImage,
  setVisible
}) => {
  const navigation = useNavigation();
  const [openDrawerModal, setOpenDrawerModal] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => setOpenDrawerModal(true)}>
        <Icon name="menu" size={25} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={onSearchPress}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.pnghttps://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }} // Replace with your image URL
            style={{height: 25, width: 25, marginHorizontal: 5}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/3177/3177336.png',
            }} // Replace with your image URL
            style={{height: 25, width: 25, marginHorizontal: 5}}
          />
        </TouchableOpacity>
      </View>

      {/* Modal Box */}
      <DrawerModal visible={openDrawerModal} setVisible={setOpenDrawerModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    shadowOffset: {width: 0, height: 2},
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#376ADA',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 16,
  },
});

export default Header;
