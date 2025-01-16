import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import InsightOne from './MemberInsightOne';
import InsightTwo from './MemberInsightTwo';

const DateInsights = () => {
  const [selectedDate, setSelectedDate] = useState(moment());

  const handlePreviousDate = () => {
    setSelectedDate(prevDate => moment(prevDate).subtract(1, 'days'));
  };

  const handleNextDate = () => {
    setSelectedDate(prevDate => moment(prevDate).add(1, 'days'));
  };

  return (
    <View>
        <InsightOne />
        {/* ============= Calender Insights =========== */}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handlePreviousDate}
          style={styles.arrowButton}>
          <Text style={styles.arrowText}>
            <Icon name="caretleft" size={15} color="#007ACC" />
          </Text>
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {selectedDate.format('MMMM Do, YYYY')}
          </Text>
        </View>

        <TouchableOpacity onPress={handleNextDate} style={styles.arrowButton}>
          <Text style={styles.arrowText}>
            <Icon name="caretright" size={15} color="#007ACC" />
          </Text>
        </TouchableOpacity>
      </View>
      {/* =========== INSIGHTS ============== */}
      <InsightTwo/>
    </View>
  );
};

export default DateInsights;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    marginVertical:10,
    backgroundColor:"#fff",
    borderRadius:5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  arrowButton: {
    padding: 5,
    borderRadius: 5,
    borderColor: '#007ACC',
    borderWidth: 1,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007ACC',
  },
});
