import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import useFetchMember from '../hooks/useFetchMember'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { devURL } from '../constants/endpoints';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

const Chart = () => {

  // const { chartData, fetchVisitData } = useFetchMember();
  const [chartData, setChartData] = useState([]);

  const fetchVisitData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      let today = new Date();
      let formattedDate = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD

      const response = await axios.post(
        `${devURL}/user/members/activity-frequency`,
        { date: formattedDate }, // Send date in the request body
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        }
      );

      console.log('=========Visit data[useFetchMember]================')
      console.log(response?.data?.data);

      // const labels = response.data.map((item) => item._id || "Unknown");
      // const data = response.data.map((item) => item.count);

      setChartData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching visit data:", error);
    }
  };







  useEffect(() => {
    fetchVisitData();


  }, []);

  const data = {
    labels: chartData?.map((item) => item._id) || [],
    datasets: [
      {
        data: chartData?.map((item) => item.count) || [],
      },
    ],
  };

  // console.log('==== chart data ========',chartData)

  const chartConfig = {
    backgroundGradientFrom: '#f8f8f8',
    backgroundGradientTo: '#f8f8f8',
    color: (opacity = 1) => `rgba(58, 123, 213, ${opacity})`, // Bar color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
    fillShadowGradient: '#376ADA', // Bar fill color
    fillShadowGradientOpacity: 0.8,
    decimalPlaces: 1,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Distance Over Time</Text>
      <BarChart
        style={styles.chart}
        data={data}
        width={screenWidth - 42} // Width of the chart
        height={170} // Height of the chart
        chartConfig={chartConfig}
        yAxisSuffix="km" // Label for Y-axis values
        yAxisInterval={1} // Optional, set to 1 to ensure it goes up by 1 unit
        showValuesOnTopOfBars // Show values on top of bars
        fromZero // Start Y-axis from zero
      />
    </View>
  );
};

export default Chart;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#376ADA',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 8,
  },
});
