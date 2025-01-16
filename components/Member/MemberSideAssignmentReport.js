import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';

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

  const renderEmployeeItem = ({item}) => (
    <View style={styles.card}>
      <Image source={{uri: item.avatar}} style={styles.avatar} />
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
    <>
    <View style={styles.container}>
   <View style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row"}}>
   <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#376ADA',
          paddingHorizontal: 4,
          marginTop: 10,
        }}>
        Today Report
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#376ADA',
          paddingHorizontal: 4,
          marginTop: 10,
          textDecorationLine:'underline'
        }}>
        See More
      </Text>
   </View>
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
    </View>
    </>
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
