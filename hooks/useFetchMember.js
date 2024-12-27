import { useState, useEffect } from 'react';
import { devURL } from '../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Storing JWT token locally
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const useFetchMember = (memberId) => {
  const navigation = useNavigation();

  const [records, setRecords] = useState([]);
  const [loadng, setLoading] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [chartData_, setChartData_] = useState([]);
  const [teamMember, setTeamMember] = useState([]);
  const [teamMemberLoader, setTeamMemberLoader] = useState(false);
  const [teamMemberError, setTeamMemberError] = useState(null);

  const [memberProfile, setMemberProfile] = useState({});
  const [memberProfileLoader, setMemberProfileLoader] = useState(null);
  const [memberProfileError, setMemberProfileError] = useState(null);

  //-----------------------------------------

  const fetchMemberProfile = async () => {
    try {

      setMemberProfileLoader(true);
      const jwtToken = await AsyncStorage.getItem('token');

      const response = await axios.get(`${devURL}/member/profile`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
      });

      // console.log('response ', response?.data.member);
      setMemberProfile(response?.data?.member); // Use response.data.team
      setMemberProfileError(null); // Reset error state on successful fetch
    } catch (err) {
      setMemberProfileError(err.message || "Failed to fetch records");
    } finally {
      setMemberProfileLoader(false);
    }
  };

  const fetchUpdateMemberLocation = async (locationData) => {
    try {
      console.log('----- locationData-------', locationData);

      setMemberProfileLoader(true);
      const jwtToken = await AsyncStorage.getItem('token');

      const response = await axios.patch(
        `${devURL}/member/profile/location-update`,
        locationData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`,
          },
        }
      );

      // If needed, update the member profile with the new location data
      setMemberProfile((prevProfile) => ({
        ...prevProfile,
        location: response?.data?.location, // Assuming the response contains updated location data
      }));
      setMemberProfileError(null); // Reset error state on successful update
    } catch (err) {
      setMemberProfileError(err.message || "Failed to update location");
    } finally {
      setMemberProfileLoader(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      // console.log('--------- fetchTeamMembers----------->');

      setTeamMemberLoader(true);
      const jwtToken = await AsyncStorage.getItem('token');

      const response = await axios.get(`${devURL}/member/team`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
      });

      // console.log('----------useFetchMember------')
      // console.log('resp ------------------->',response?.data?.team[0].name)

      setTeamMember(response?.data?.team); // Use response.data.team
      setTeamMemberError(null); // Reset error state on successful fetch
    } catch (err) {
      setTeamMemberError(err.message || "Failed to fetch records");
    } finally {
      setTeamMemberLoader(false);
    }
  };


  const fetchTrackingRecords = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/member/track/records?interval=7days`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      // console.log('=====memberData[usefetchMember]========')
      // console.log('hook========',response?.data.locations; 
      setRecords(response?.data?.locations);
    } catch (err) {
      setError(err.message || "Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      let today = new Date();
      let formattedDate = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD

      const response = await axios.post(
        `${devURL}/user/members/activity-frequency`,
        { date: formattedDate }, // Send date in the request body
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        }
      );

      // console.log('=========Visit data[useFetchMember]================')
      // console.log(response?.data?.data);

      // const labels = response.data.map((item) => item._id || "Unknown");
      // const data = response.data.map((item) => item.count);

      setChartData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching visit data:", error);
    }
  };



  const fetchVisitData_UserScreenForMember = async () => {
    try {
      console.log(memberId,'____');
      
      const jwtToken = await AsyncStorage.getItem('token');
      let today = new Date();
      let formattedDate = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD

      const response = await axios.post(
        `${devURL}/user/members/activity-frequency_`,
        { date: formattedDate, memberId }, // Send date in the request body
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        }
      );

      // console.log('=========Visit data[useFetchMember]================')
      // console.log(response?.data?.data);

      // const labels = response.data.map((item) => item._id || "Unknown");
      // const data = response.data.map((item) => item.count);

      setChartData_(response?.data?.data);
    } catch (error) {
      console.error("Error fetching visit data:", error);
    }
  };


  useEffect(() => {
    fetchTeamMembers();
    fetchMemberProfile();
    fetchTrackingRecords();
    // fetchVisitData();
  }, [

  ]);

  return {
    records,
    chartData,
    chartData_,
    teamMember,
    memberProfile,
    teamMemberError,
    teamMemberLoader,
    fetchVisitData,
    fetchTeamMembers,
    fetchMemberProfile,
    fetchTrackingRecords,
    fetchUpdateMemberLocation,
    fetchVisitData_UserScreenForMember
  };
};

export default useFetchMember;
