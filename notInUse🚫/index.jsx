import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import MoreReport from '../../../components/MoreReport';
import Chart from '../../../components/Chart';
import Goback from '../../../components/GoBack';
import Calender from '../../../components/Member/Calender';
import Assinement from '../../../components/Member/Assinement';

const MemberInsight = ({decodedToken}) => {
  // console.log('====details===')
  // console.log(decodedToken)

  return (
    <View style={{flex: 1, padding: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Goback />
        <Text
          style={{
            color: '#376ADA',
            fontSize: 26,
            fontWeight: '700',
            marginRight: 19,
          }}>
          Insights
        </Text>
      </View>
      <Calender />
      {/* <Assinement /> */}

      {/* <View style={styles.mainContainer}>
        <Chart />
        <View style={styles.tabContainer}>
          {["Day", "Week", "Month", "Year"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <MoreReport decodedToken={decodedToken} />
        </View>
      </View> */}
    </View>
  );
};

export default MemberInsight;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    //  backgroundColor:"green"
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //  backgroundColor:"black"
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginRight: 4,
  },
  activeTab: {
    backgroundColor: '#376ADA',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#376ADA',
    borderRadius: 10,
  },
  contentText: {
    fontSize: 18,
  },
});
