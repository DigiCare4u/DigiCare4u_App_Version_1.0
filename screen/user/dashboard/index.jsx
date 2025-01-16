import { View, Text, SafeAreaView, ScrollView, StyleSheet, Modal, Button } from 'react-native';
import React, { useState } from 'react';
import Icard from '../../../components/Icard';
import Header from '../../../components/Header';
import EmployeeCard from '../../../components/EmployeeCard';
import AddMember from '../../../components/AddMemberModal';
import TaskSchedule from '../../../components/TaskSchedule';
import AddChannel from '../../../components/AddChannel';

export default function UserDashboard() {
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollView}>
        <View style={styles.ViewOne}>
          <View style={{ flex: 1 }}>
            <Header
              onMenuPress={() => setVisible(true)}
              onNotificationPress={() => console.log('Notification')}
            />
          </View>
          <View>
            {/* <EmployeeCard  
              //  onMemberPress = {()=>console.log('3')}
              //  onActiveMemberPress = {()=>console.log('4')}
              //  onAbsentMemberPress = {()=>console.log('2')}
              //  onPendingMemberPress={() => setPendingModalVisible(true)}
               /> */}
            <Icard />
            <AddMember/>
          </View>
          <TaskSchedule/>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  ScrollView: {
    padding: 3,
  },
  ViewOne: {
    marginTop: 10,
  },
  employerDetails: {
    fontSize: 17,
    fontWeight: "600",
    paddingTop: 15,
    paddingBottom: 0,
    paddingHorizontal: 5,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#61c2e3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});
