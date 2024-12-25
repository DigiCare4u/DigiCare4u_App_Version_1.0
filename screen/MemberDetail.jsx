import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import GoBack from '../components/GoBack';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import Chart from '../components/Chart';
import useFetchUser from '../hooks/useFetchUser';
import DailyTransit from '../components/dailyTransit';
import Attendance from '../components/Attendance';
import DailyTransitMapBox from '../components/dailyTransitMapBox';
import ChartUserSide from '../components/ChartUserSide';

const MemberDetail = () => {
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const memberId = route.params.memberId;
  const { memberSummary, fetchMemberDetails, memberSummaryLoader } = useFetchUser(memberId);

  useEffect(() => {
    if (!memberSummary) {
      fetchMemberDetails();
    }
  }, [fetchMemberDetails]);

  if (!memberSummary) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Member details not found.</Text>
      </View>
    );
  }

  const location = memberSummary?.location?.coordinates || [0, 0];

  return (
    <View style={styles.mainContainer}>
      {/* Header with GoBack and Title */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <GoBack />
          <Text style={styles.title}>Insights</Text>
        </View>
        {/* <TouchableOpacity style={styles.reportButton} onPress={() => Alert.alert("This is not working, wait for the next upgrade")}>
          <Text style={styles.reportButtonText}>Download Report</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Member Details Card */}
        <View style={styles.card}>
          <View style={styles.leftPart}>
            <Image
              source={{
                uri: memberSummary.profileImage || 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png',
              }}
              style={styles.profileImage}
            />
            <View style={styles.statusContainer}>
              <Text style={styles.statusBadge(memberSummary.locationStatus)}>
                {memberSummary.locationStatus === 'active' ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <View style={styles.centerPart}>
            <Text style={styles.name}>{memberSummary.name}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Mobile:</Text> {memberSummary.mobile}</Text>
            <Text style={styles.detail}><Text style={styles.label}></Text> {memberSummary.email}</Text>
          </View>
        </View>

        {/* Chart and Daily Transit Components */}
        <Attendance/>
        <ChartUserSide memberId={memberId} />
        {/* <DailyTransit memberId={memberId} /> */}
        <DailyTransitMapBox memberId={memberId} />
        <Text style={{color: "#376ADA",paddingHorizontal:10,}}>Last 24 hour update... </Text>
      </ScrollView>
    </View>
  );
};

export default MemberDetail;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    width: '100%', 
    paddingHorizontal: 2, 
  },
  title: {
    fontSize: 28,
    color: "#376ADA",
    fontWeight: "800",
    marginLeft: 10,
  },
  reportButton: {
    backgroundColor: "#376ADA",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reportButtonText: {
    color: "#ffffff",
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:5,
    marginTop:7,
  },
  leftPart: {
    alignItems: 'center',
    marginRight: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: (status) => ({
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: status === 'active' ? '#dff0d8' : '#f8d7da',
    color: status === 'active' ? '#4CAF50' : '#a94442',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop:-25
  }),
  centerPart: {
    flex: 1,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#376ADA',
  },
  role: {
    fontSize: 16,
    fontWeight: '600',
    color: '#376ADA',
    marginVertical: 4,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#376ADA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});