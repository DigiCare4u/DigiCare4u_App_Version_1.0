// import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import GoBack from '../components/GoBack';
// import { useRoute } from '@react-navigation/native';
// import { ScrollView } from 'react-native-gesture-handler';
// import Chart from '../components/Chart';
// import useFetchUser from '../hooks/useFetchUser';
// import DailyTransit from '../components/dailyTransit';
// import Attendance from '../components/Attendance';
// import DailyTransitMapBox from '../components/dailyTransitMapBox';
// import ChartUserSide from '../components/ChartUserSide';
// // import ChangeLineOffsetsShapeAnimator from '@rnmapbox/maps/lib/typescript/src/shapeAnimators/ChangeLineOffsetsShapeAnimator';

// const MemberDetail = () => {
//   const [loading, setLoading] = useState(true);
//   const route = useRoute();
//   const memberId = route.params.memberId;
//   const { memberSummary,
//     fetchMemberDetails,
//     memberSummaryLoader } = useFetchUser(memberId);

//     console.log('memberSummary====',memberSummary)


//     useEffect(() => {
//       if (!memberSummary) {
//         fetchMemberDetails();
//       }
//     }, [fetchMemberDetails]);

//     if (!memberSummary) {
//       return (
//         <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Member details not found.</Text>
//       </View>
//     );
//   }



//   const location = memberSummary?.location?.coordinates || [0, 0];

//   console.log('location==============',location)

//   return (
//     <View style={styles.mainContainer}>
//       {/* Header with GoBack and Title */}
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <GoBack />
//           <Text style={styles.title}>Insights</Text>
//         </View>
//         {/* <TouchableOpacity style={styles.reportButton} onPress={() => Alert.alert("This is not working, wait for the next upgrade")}>
//           <Text style={styles.reportButtonText}>Download Report</Text>
//         </TouchableOpacity> */}
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Member Details Card */}
//         <View style={styles.card}>
//           <View style={styles.leftPart}>
//             <Image
//               source={{
//                 uri: memberSummary.profileImage || 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png',
//               }}
//               style={styles.profileImage}
//             />
//             <View style={styles.statusContainer}>
//               <Text style={styles.statusBadge(memberSummary.locationStatus)}>
//                 {memberSummary.locationStatus === 'active' ? 'Active' : 'Inactive'}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.centerPart}>
//             <Text style={styles.name}>{memberSummary.name}</Text>
//             <Text style={styles.detail}><Text style={styles.label}>Mobile:</Text> {memberSummary.mobile}</Text>
//             <Text style={styles.detail}><Text style={styles.label}></Text> {memberSummary.email}</Text>
//           </View>
//         </View>

//         {/* Chart and Daily Transit Components */}
//         <Attendance />
//         <ChartUserSide memberId={memberId} />
//         <DailyTransitMapBox memberId={memberId} />
//       </ScrollView>
//     </View>
//   );
// };

// export default MemberDetail;

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     paddingHorizontal: 2,
//   },
//   title: {
//     fontSize: 28,
//     color: "#376ADA",
//     fontWeight: "800",
//     marginLeft: 10,
//   },
//   reportButton: {
//     backgroundColor: "#376ADA",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   reportButtonText: {
//     color: "#ffffff",
//     fontWeight: 'bold',
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     marginTop: 7,
//   },
//   leftPart: {
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   statusContainer: {
//     marginTop: 8,
//   },
//   statusBadge: (status) => ({
//     fontSize: 14,
//     fontWeight: '600',
//     backgroundColor: status === 'active' ? '#dff0d8' : '#f8d7da',
//     color: status === 'active' ? '#4CAF50' : '#a94442',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 15,
//     marginTop: -25
//   }),
//   centerPart: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#376ADA',
//   },
//   role: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#376ADA',
//     marginVertical: 4,
//   },
//   detail: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },
//   label: {
//     fontWeight: 'bold',
//     color: '#376ADA',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 18,
//     color: 'red',
//   },
// });



import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import PieChartAlternative from '../components/User/UserPaiChart';

const employees = [
  {
    id: '1',
    name: 'Jack Smith',
    number: 'Location - Street, area, pincode ',
    status: 'Pending',
    performance: '30 minute',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '2',
    name: 'Ethan Brown',
    number: 'Location - Street, area, pincode ',
    status: 'Pending',
    performance: '20 minute',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '3',
    name: 'Liam Johnson',
    number: 'Location - Street, area, pincode ',
    status: 'Pending',
    performance: '24 minute',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '4',
    name: 'Noah Wilson',
    number: 'Location - Street, area, pincode ',
    status: 'Pending',
    performance: '30 minute',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '5',
    name: 'Mason Taylor',
    number: 'Location - Street, area, pincode ',
    status: 'Completed',
    performance: '30 minute',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '6',
    name: 'Liam Johnson',
    number: 'Location - Street, area, pincode ',
    status: 'Completed',
    performance: '24 minute',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '7',
    name: 'Noah Wilson',
    number: 'Location - Street, area, pincode ',
    status: 'Completed',
    performance: '30 minute',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '8',
    name: 'Mason Taylor',
    number: 'Location - Street, area, pincode ',
    status: 'Completed',
    performance: '30 minute',
    avatar: 'https://via.placeholder.com/50',
  },
];

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('Pending');
  const [employee, setEmployee] = useState(employees);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [selectedTab]);

  const filteredEmployees = employees.filter(
    employee => employee.status === selectedTab,
  );

  const renderEmployeeItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.cardInfo}>
        <Text style={styles.employeeName}>{item.name}</Text>
        <Text style={styles.employeeNumber}>{item.number}</Text>
      </View>
      <View>
        <Text
          style={[
            styles.status,
            item.status === 'Completed' ? styles.completed : styles.pending,
          ]}>
          {item.status}
        </Text>
        <Text style={styles.performance}>{item.performance}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: '#376ADA',
          paddingHorizontal: 4,
          marginTop: 10,
        }}>
        Today Report
      </Text>
      <View style={styles.tabs}>
        {['Pending (4)', 'Completed (4)'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab.split(' ')[0] && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab.split(' ')[0])}>
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.split(' ')[0] && styles.activeTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Employee List */}
      {loading ? (
        <ActivityIndicator size="large" color="#376ADA" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployeeItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
      <PieChartAlternative />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 4,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#376ADA',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  list: {
    marginHorizontal: 3,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#376ADA',
  },
  employeeNumber: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  performance: {
    fontSize: 12,
    color: '#666',
  },
  completed: {
    color: 'green',
  },
  pending: {
    color: 'red',
  },
});
