import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useDecodedToken} from '../../../hooks/useDecoded';
import Details from '../../../components/Details';
import TodayTask from '../../../components/TodayTask';
import Header from '../../../components/Header';
import useLocation from '../../../hooks/useLocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  PERMISSIONS,
  check,
  request,
  openSettings,
} from 'react-native-permissions';
import Bg_for_v1 from '../../../services/Bg_for_v1';
import LiveAttendance from '../../../components/Member/attendance';
import InsightTwo from '../../../components/Member/Channel/MemberInsightTwo';

const MemberDashboard = ({navigation}) => {
  const {location, getCurrentLocation} = useLocation();
  const [isBgAccess, setIsBgAccess] = useState(false);

  useEffect(() => {
    checkBackgroundAccess();
  }, [isBgAccess]);
  // console.log('=========cisBgAccess===========================');
  // console.log(isBgAccess);
  // console.log('====================================');

  const checkBackgroundAccess = async () => {
    try {
      const status = await check(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      if (status === 'granted') {
        setIsBgAccess(true);
      } else if (status === 'denied') {
        // requestBackgroundAccess();
      } else {
        setIsBgAccess(false);
      }
    } catch (error) {
      console.error('Error checking background location permission:', error);
    }
  };

  const requestBackgroundAccess = async () => {
    try {
      const status = await request(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      if (status === 'granted') {
        setIsBgAccess(true);
      } else {
        setIsBgAccess(false);
      }
    } catch (error) {
      console.error('Error requesting background location permission:', error);
    }
  };

  const navigateToSettings = () => {
    openSettings().catch(() => {
      console.error('Unable to open settings');
    });
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        {/* <Header /> */}
        <View style={styles.container}>
          <Text style={styles.text}>Background Access</Text>
          {isBgAccess ? (
            <Icon name="check-circle" size={24} color="green" />
          ) : (
            <>
              <Icon name="warning" size={24} color="yellow" />
              <TouchableOpacity
                onPress={navigateToSettings}
                style={styles.button}>
                <Text style={styles.buttonText}>Enable</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={{marginTop: 10}}>
          <LiveAttendance />
          <Bg_for_v1 isBgAccess={isBgAccess} />
          <Details decodedToken={useDecodedToken().decodedToken} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    // backgroundColor:"red"
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#376ADA',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MemberDashboard;
