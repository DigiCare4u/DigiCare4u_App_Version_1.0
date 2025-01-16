import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Goback from '../../../components/GoBack';
import Calender from '../../../components/Member/Calender';
import DateTime from '../../../components/Member/DateTime';

const MemberInsight = ({ decodedToken }) => {
  // console.log('====details===')
  // console.log(decodedToken)

  return (
    <SafeAreaView>

      <ScrollView>
        <View style={{ padding: 10, height:"100%"}}>
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
                fontSize: 25,
                fontWeight: '700', marginRight: 19,
              }}>
              Insights
            </Text>
          </View>
          {/* <Calender /> */}
          <DateTime/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MemberInsight;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor:"red"
  },
});
