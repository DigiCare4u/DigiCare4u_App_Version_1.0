import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {devURL} from '../../../constants/endpoints';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import TodayAttendance from '../../../components/User/LiveAttendance';
import AssignmentAndAttendance from '../../../components/User/AssignmentAndAttendance';

const MemberList = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  return (
     <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Employee List</Text>
      </View>
      
        <AssignmentAndAttendance />

      <TouchableOpacity onPress={()=>setIsModalOpen(true)} style={styles.button}>
          <Text style={styles.buttonText}>View Attandance</Text>
        </TouchableOpacity>

      {/* MODEL Attendance */}
      <TodayAttendance visible={isModalOpen} setVisible={setIsModalOpen} />
    </ScrollView>
  );
};
export default MemberList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f4f7',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007ACC',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#007ACC',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    width: '50%',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#007ACC',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#007ACC',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
    padding: 10,
    alignItems: 'center',
  },
  cardImageContainer: {
    height: 50,
    width: 50,
    borderRadius: 35,
    marginRight: 15,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    height: '100%',
    width: '100%',
    borderRadius: 35,
  },
  cardDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007ACC',
  },
  position: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green',
    marginRight: 5,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007ACC',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom:50
  },
  buttonText: {color: 'white', fontWeight: 'bold'},
});
