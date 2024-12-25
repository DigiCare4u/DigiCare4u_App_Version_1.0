// hooks/useFetchUser.js
import { useState, useEffect } from 'react';
import { devURL } from '../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Storing JWT token locally
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const useFetchUser = (
  // fetchType,
  memberId,
  // navigation
) => {
    const navigation = useNavigation();

  const [data, setData] = useState(null);
  const [profileOverviewLoader, setProfileOverviewLoader] = useState(true);
  const [error, setError] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [profileOverview, setUserProfileOverview] = useState([]);
  const [profileLoader, serProfileLoader] = useState(true);
  const [userProfile, setUserProfile] = useState({});
  const [userMembersList, setUserMembersList] = useState([]);
  const [membersListLoader, setMembersListLoader] = useState(true);
  const [membersListError, setMembersListError] = useState(true);

  const [memberSummary, setMemberSummary] = useState({});
  const [memberSummaryLoader, setMemberSummaryLoader] = useState(true);
  const [memberSummaryError, setMemberSummaryError] = useState(true);

  // console.log('=====member summary=======')
  // console.log(memberSummary)

  //-----------------------------------------
  const [addMembersLoader, setAddMembersLoader] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  //-----------------------------------------



  const fetchUserProfileOverview = async () => {
    try {
      setProfileOverviewLoader(true);
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/user/profile/overview`, {
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      const stats = response?.data?.stats;
      if (stats) {
        const formattedData = [
          { id: 1, label: 'Members', value: stats.totalMembers || 0, cardColor: '#376ADA' },
          { id: 2, label: 'Today Active', value: stats.activeMembers || 0, cardColor: '#28A745' },
          { id: 3, label: 'Today Offline', value: stats.inactiveMembers || 0, cardColor: '#DC3545' },
          { id: 4, label: 'Pending', value: stats.pendingMembers || 0, cardColor: '#FFC107' },
        ];

        setUserProfileOverview(formattedData);
      } else {
        console.error('Stats data is missing in the response.');
      }

      // console.log('API Response:', response?.data);

    } catch (err) {
      // console.error('Error fetching data:', err);
      setError(err); // Set error state
    } finally {
      setProfileOverviewLoader(false);
    }
  };

  const fetchUserProfileDetail = async () => {
    try {
      serProfileLoader(true);
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/user/profile`, {
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      const profile = response?.data?.user;
      // console.log('---------------------------',profile.userType);
      if (profile) {
        setUserProfile(profile); // Set the user profile detail
      } else {
        console.error('Profile data is missing in the response.');
      }

    } catch (err) {
      setProfileError(err); // Set error state
    } finally {
      serProfileLoader(false);
    }
  };



  const fetchUserMembersList = async () => {
    try {
      // console.log('fetchUserMembersList ---------------');
      setMembersListLoader(true); // Set the loader to true while fetching
      const jwtToken = await AsyncStorage.getItem('token'); // Get JWT token from storage
      const response = await axios.get(`${devURL}/user/members/list`, {
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      // console.log('response ---------------',response);
      const membersList = response?.data?.members; 
      
      if (membersList) {
        setUserMembersList(membersList); 
      } else {
        console.error('Members data is missing in the response.');
      }
      
    } catch (err) {
      setMembersListError(err); // Set error state if fetching fails
    } finally {
      setMembersListLoader(false); // Stop loading indicator
    }
  };



  const fetchMemberDetails = async () => {
    // console.log('---------- chala  fetchMemberDetails ----------',memberId);
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      // console.log('----------- jwtToken ------------>', jwtToken);
      const response = await axios.get(`${devURL}/user/members/${memberId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      // console.log('=========member details===========')
      // console.log(response.data.member);
      // console.log('=========member details===========')


      setMemberSummary(response?.data?.member);
    } catch (error) {
      console.error(error);
      setMemberSummaryError(error)
    } finally {
      setMemberSummaryLoader(false); // Stop loading
    }
  };

  const addMembers = async (addMembersPayload) => {
    try {
      // console.log('addMembersPayload', addMembersPayload);

      const {
        name,
        email,
        mobile,
        groupType,
      } = addMembersPayload
      // const [addMembersLoader, setAddMembersLoader] = useState(true);
      // const [alertVisible, setAlertVisible] = useState(false);
      // const [alertMessage, setAlertMessage] = useState('');
      // const [alertType, setAlertType] = useState('');

      setAddMembersLoader(true);

      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`${devURL}/user/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([{
          name,
          email,
          mobile: '79398774789',
          groupType,
        }]),
      });

      if (!response) {
        throw new Error('Failed to add member'); // Throw error if response is not successful
      }

      const data = await response.json();
      // console.log('Add Member Response:', data);

      // On success, show success alert
      setAlertType('success');
      setAlertMessage('Member added successfully!');
      setAlertVisible(true);
      navigation.navigate('UserHome');

    } catch (error) {
      console.error('Error adding member:', error);

      // On failure, show error alert
      setAlertType('error');
      setAlertMessage('Failed to add member. Please try again.');
      setAlertVisible(true);
    } finally {
      setAddMembersLoader(false); // Stop loading in either case

    }
  };


  useEffect(() => {
    fetchUserProfileOverview();
    fetchUserProfileDetail();
    fetchUserMembersList();
    fetchMemberDetails()
    // if (fetchType === 'memberSummary') {
    //   fetchMemberDetails();
    // }    // addMembers()
  }, [
    
  ]);

  return {
    profileOverview,
    profileOverviewLoader,
    profileLoader,
    error,
    userProfile,
    profileError,
    userMembersList,
    membersListLoader,
    membersListError,
    memberSummary,
    memberSummaryLoader,
    memberSummaryError,
    fetchUserMembersList,
    fetchUserProfileOverview,
    addMembers,
    setAlertVisible,
    alertVisible,
    alertMessage,
    alertType,
    addMembersLoader,
    // fetchMemberDetails,
    fetchUserProfileDetail
  };
};

export default useFetchUser;
