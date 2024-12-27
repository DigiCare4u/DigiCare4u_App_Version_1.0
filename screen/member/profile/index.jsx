import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator
} from 'react-native';
import profile from '../../../components/Assets/profile.png';
import explore from '../../../components/Assets/explore.png';
import share from '../../../components/Assets/share.png';
import logout from '../../../components/Assets/logout.png';
import Goback from '../../../components/GoBack';
import { useNavigation } from '@react-navigation/native';
import useFetchMember from '../../../hooks/useFetchMember';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import BackgroundActions from 'react-native-background-actions';

export default function MemberProfile() {
  
  const stopBackgroundTask = async () => {
    try {
      await BackgroundActions.stop();
      await AsyncStorage.setItem('isRunning', 'false');
      // setIsRunning(false);
    } catch (e) {
      console.log('stopBackgroundTask error ___',e);
      
      Alert.alert('Error', 'Failed to stop background task');
    }
  };

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const {memberProfile, fetchMemberProfile } = useFetchMember();

  useEffect(()=>{
    fetchMemberProfile();
  }, [])

  // console.log('-----fetch [MemberProfile]--------')
  // console.log(memberProfile)

  const shareOther = async() => {
    setLoading(true);
    try {
      await Share.share({
        message: 'Check out this link to download app: https://www.youtube.com/shorts/sk8DIakdG7k'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the link. Please try again.');
      console.error('Share Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
              Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Logged Out',
                textBody: 'You have successfully logged out.',
              });

              stopBackgroundTask()
              navigation.navigate('Login');

            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
        <Goback/>
        <Text style={styles.title}>Profile</Text>
      </View>
      <Text style={styles.heading}>Progate Profile</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <View>
          <View style={styles.profileimage}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}  style={{ height:120, width:120,}}/>
          </View>
          <View style={{marginBottom:25}}>
            <Text style={{fontSize:20,fontWeight:700,textAlign:"center", color: "#376ADA",}}>{memberProfile?.name}</Text>
            <Text style={{fontSize:18,fontWeight:700, textAlign:"center", color: "#376ADA",}}>{memberProfile?.email}</Text>
            <Text style={{fontSize:18,fontWeight:700, textAlign:"center", color: "#376ADA",}}>{memberProfile?.emplyoeeId || 'PGT-001'}</Text>
            </View>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.box} onPress={()=>navigation.navigate('MemberProfileEdit')} >
              <Image source={profile} style={styles.image} />
              <Text style={styles.name}>Profile Setting</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.box} onPress={()=>console.log('This is not working wait for next upgrade')}>
              <Image source={explore} style={styles.image} />
              <Text style={styles.name}>Explore</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.box} onPress={shareOther}>
              <Image source={share} style={styles.image} />
              <Text style={styles.name}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.box} onPress={handleLogout}>
              <Image source={logout} style={styles.image} />
              <Text style={styles.name}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:15,
  },
  profileimage:{
     flex:1,
     justifyContent:"center",
    alignItems:"center",
    marginTop:30,
    marginBottom:70,
    padding:10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
    color: "#376ADA",
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 35,
    height: 35,
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: "#376ADA",
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionupdate:{
 flex:1,
 justifyContent:"space-evenly",
 alignSelf:"center",
  },
  title: {
    fontSize: 28,
    color: "#376ADA",
    fontWeight: "800",
    marginLeft: 10,
  },
})
