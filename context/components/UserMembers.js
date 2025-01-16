import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {devURL} from '../constants/endpoints';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddMember from './AddMemeber';

const UserMembers = ({liveMemberId, disconnectedMembersId, setLiveMembers}) => {
  console.log('ids____________________ :', liveMemberId, disconnectedMembersId);

  const [teamMember, setTeamMember] = useState([]);
  const [teamMemberLoader, setTeamMemberLoader] = useState(false);
  const [teamMemberError, setTeamMemberError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const navigation = useNavigation();

  // To track whether the component is still mounted
  let isMounted = true;

  useEffect(() => {
    if (disconnectedMembersId) {
      setLiveMembers('');
    }

    // Cleanup function to set the flag to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, [disconnectedMembersId]);

  const fetchTeamMembers = async () => {
    try {
      setTeamMemberLoader(true);
      const jwtToken = await AsyncStorage.getItem('token');

      const response = await axios.get(`${devURL}/user/members/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      // Only update the state if the component is still mounted
      if (isMounted) {
        setTeamMember(response?.data?.members);
        setTeamMemberError(null);
      }
    } catch (err) {
      if (isMounted) {
        setTeamMemberError(err.message || 'Failed to fetch records');
      }
    } finally {
      if (isMounted) {
        setTeamMemberLoader(false);
      }
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const filteredMembers = teamMember?.filter(member =>
    member.name.toLowerCase().includes(searchInput.toLowerCase()),
  );

  // console.log('teamMember', teamMember);

  const renderMemberItem = ({item}) => {
    return (
      <View style={styles.memberCard}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MemberDetail', {memberId: item._id})
          }>
          <View style={styles.memberHeader}>
            {/* Member Image */}
            <Image
              source={{
                uri:
                  item.imageUrl ||
                  'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
              }}
              style={styles.memberImage}
            />
            {/* Member Info */}
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberType}>
                Role: <Text>{item.groupType}</Text>
              </Text>
              <Text style={styles.memberDetails}>
                <Text>
                  <Icon name="map-marker" size={14} color="green" />
                </Text>{' '}
                {item?.latestTracking?.locality ||
                  item.latestTracking?.sublocality ||
                  item.latestTracking?.region ||
                  item.latestTracking?.country ||
                  'Not Available'}
              </Text>
            </View>
            {/* Status Indicator */}
            <View style={styles.statusContainer}>
              {/* Status Dot */}
              <View
                style={[
                  styles.statusDot,
                  item.locationStatus === 'active'
                    ? styles.activeDot
                    : styles.inactiveDot,
                ]}
              />

              {/* Date and Time */}
              <View style={styles.trackingContainer}>
                <Text style={styles.trackingTime}>
                  {new Date(
                    item.latestTracking?.timestamp,
                  ).toLocaleTimeString()}
                </Text>
                <Text style={styles.trackingDate}>
                  {new Date(item.latestTracking?.timestamp).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (teamMemberLoader) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading members...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Members List</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Member..."
            value={searchInput}
            onChangeText={setSearchInput}
            placeholderTextColor="#376ADA"
          />
          <Image
            source={{
              uri: 'https://icons.veryicon.com/png/o/construction-tools/e-construction/search-267.png',
            }}
            style={styles.searchIcon}
          />
        </View>
      </View>
      {teamMember.length > 0 ? (
        <FlatList
          data={filteredMembers}
          renderItem={renderMemberItem}
          keyExtractor={item => item?._id?.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <AddMember />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#376ADA',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 180,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 7,
    color: '#000',
  },
  searchIcon: {
    height: 20,
    width: 20,
    marginLeft: -30,
  },
  memberCard: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 7,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#376ADA',
  },
  memberType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#376ADA',
  },
  memberDetails: {
    fontSize: 13,
    color: '#376ADA',
    fontWeight: '500',
  },
  statusDot: (liveMemberId, id, disconnectedMembersId) => ({
    width: 12,
    height: 12,
    borderRadius: 6,
    // backgroundColor: liveMemberId === id ? '#4CAF50' : (liveMemberId === disconnectedMembersId ? 'red' : 'gray'),
    // backgroundColor: (liveMemberId === id) ? '#4CAF50' ? (liveMemberId === disconnectedMembersId ?) 'red',
    backgroundColor:
      liveMemberId === id
        ? '#4CAF50'
        : liveMemberId === disconnectedMembersId
        ? 'red'
        : 'red',

    marginLeft: 95,
  }),
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  trackingTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#376ADA',
    marginVertical: 1,
    marginLeft: 60,
  },
  trackingDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#376ADA',
    marginVertical: 1,
  },
});

export default UserMembers;
