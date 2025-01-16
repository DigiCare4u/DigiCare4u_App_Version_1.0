import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Button,
  TextInput,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import PieChartAlternative from '../components/User/UserPaiChart';
import { useRoute } from '@react-navigation/native';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import axios from 'axios';
import DateSelect from '../components/DatePickerOne';

const employees = [
  // ... Your existing employee data ...
];

const Dashboard = () => {
  const route = useRoute();
  const memberId = route.params.memberId;

  const [selectedTab, setSelectedTab] = useState('Pending');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState(employees);

  useEffect(() => {
    setLoading(true);

  }, [selectedTab]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const url = `http://{{localURL}}/user/members/live-location-tracking-insight-report/${memberId}/${formattedDate}`;
      const response = await axios.get(url);
      setEmployeesData(response.data); // Assuming API returns the updated employees data
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };


  const filteredEmployees = employeesData.filter(
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
      <Text style={styles.title}>Today Report</Text>
      <View style={styles.dateContainer}>
        {/* <DatePicker
          date={selectedDate}
          mode="date"
          // onDateChange={setSelectedDate}
          style={styles.datePicker}
        /> */}
        {/* import DateSelect from '../DatePickerOne'; */}
        <DateSelect setDate={setSelectedDate} />
        {/* <TouchableOpacity style={styles.fetchButton} onPress={fetchReportData}>
          <Text style={styles.fetchButtonText}>Fetch Report</Text>
        </TouchableOpacity> */}
      </View>
      {/* <View style={styles.tabs}>
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
      </View> */}
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
      <PieChartAlternative memberId={memberId} selectedDate={selectedDate} />
      {/* <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadButtonText}>Download Report</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#376ADA',
    paddingHorizontal: 4,
    marginTop: 10,
    textAlign: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  datePicker: {
    flex: 1,
  },
  fetchButton: {
    backgroundColor: '#376ADA',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  fetchButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
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
