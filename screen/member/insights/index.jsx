import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Goback from '../../../components/GoBack';
import Calender from '../../../components/Member/Calender';

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
            fontSize: 25,
            fontWeight: '700', marginRight: 19, }}>
          Insights
        </Text>
      </View>
      <Calender />
    </View>
  );
};

export default MemberInsight;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
