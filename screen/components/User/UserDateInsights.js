import React, {useState} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import moment from 'moment';
import UserTimeLineFeed from './UserTimeLineFeed';
import DateSelect from '../DatePickerOne';
import LiveTrackingMap from '../LiveTrackerMap';

const DateInsights = ({selectedMmeberId}) => {
  const [transitMemberData, setTransitMemberData] = useState([]);
  const [selectedDate_, setSelectedDate_] = useState(moment());
  const [loading, setLoading] = useState(false); // State to track loading

  const handleLoading = isLoading => {
    setLoading(isLoading);
  };

  return (
    <View>
      <View style={styles.container}>
        <DateSelect
          setDate={setSelectedDate_}
          selectedMmeberId={selectedMmeberId}
        />
        <LiveTrackingMap
                  selectedMmeberId={selectedMmeberId}

          selectedDate_={selectedDate_}
          transitMemberData={transitMemberData}
          memberId={selectedMmeberId}
        />
      </View>
      {loading && (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      )}
      {!loading && (
        <UserTimeLineFeed
          setTransitMemberData={setTransitMemberData}
          selectedMmeberId={selectedMmeberId}
          selectedDate_={selectedDate_}
          setLoading={handleLoading}
        />
      )}
    </View>
  );
};

export default DateInsights;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  loader: {
    marginVertical: 15,
    alignSelf: 'center',
  },
});
