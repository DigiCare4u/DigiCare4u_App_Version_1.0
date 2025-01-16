import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import DetailMap from './DetailMap';

const DateTime = () => {
  const [currentDate, setCurrentDate] = useState(moment());

  const handlePrevDay = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'days'));
  };

  const handleNextDay = () => {
    setCurrentDate(currentDate.clone().add(1, 'days'));
  };
  // console.log('currentDate',currentDate);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handlePrevDay}>
          <Text style={styles.buttonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {currentDate.format('dddd, MMMM Do YYYY')}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNextDay}>
          <Text style={styles.buttonText}>▶</Text>
        </TouchableOpacity>
      </View>
      <DetailMap />
    </>
  );
};

export default DateTime;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#f5f5f5',
    marginTop: 10,
    // backgroundColor:"red"
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    marginHorizontal: 10,
    color: '#333',
  },
});
