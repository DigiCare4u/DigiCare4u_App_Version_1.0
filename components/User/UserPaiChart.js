import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { devURL } from '../../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';

const PieChartAlternative = ({ selectedDate, memberId }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [downloadReportData, setDownloadReportData] = useState([]);
  const [activeTab, setActiveTab] = useState('locality'); // Default tab
  const [addressData, setAddressData] = useState({});

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const jwt = await AsyncStorage.getItem("token");

      const response = await axios.post(
        `${devURL}/user/members/live-location-tracking-insight-report`,
        {
          memberId: memberId, // Pass memberId to the body
          selectedDate: formatDate(selectedDate),
          locationType: activeTab,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
          },
        }
      );
      console.log('result', response.status);


      if (response.status == 200 && response.data.pieChartData?.length > 0) {
        const pieData = response.data.pieChartData.map((item) => ({
          name: item.name,
          population: parseFloat(item.count),
          color: item.color,
          legendFontColor: item.legendFontColor || '#333',
          legendFontSize: item.legendFontSize || 14,
        }));
        setDownloadReportData(response?.data?.downloadReportData)
        setChartData(pieData);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressData = async () => {
    try {
      const jwt = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${devURL}/user/members/latest-address/${memberId}`, // Assuming this endpoint provides latest address details
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        setAddressData(result.latestAddressDetails || {});
      } else {
        setAddressData({});
      }
    } catch (error) {
      console.error('Error fetching address data:', error);
      setAddressData({});
    }
  };

  const handleDownload = async () => {
    try {
      console.log('downloadReportData', downloadReportData);

      // Check if there's data to download
      if (!downloadReportData || downloadReportData.length === 0) {
        alert('No data available to download.');
        return;
      }

      const formattedDate = selectedDate.toISOString().split('T')[0];

      // Convert downloadReportData to Excel sheet
      const worksheet = XLSX.utils.json_to_sheet(downloadReportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

      // Define file path for download
      const filePath = `${RNFS.DownloadDirectoryPath}/Report_${formattedDate}.xlsx`;

      // Write Excel file
      const excelFile = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });
      await RNFS.writeFile(filePath, excelFile, 'ascii');

      // Notify user about the downloaded file
      alert(`Report downloaded at ${filePath}`);
    } catch (error) {
      console.error('Error downloading the report:', error);
      alert('An error occurred while downloading the report.');
    }
  };


  useEffect(() => {
    fetchChartData();
    // fetchAddressData();
  }, [selectedDate, memberId, activeTab]);

  // Function to render content based on the active tab
  const renderTabContent = () => {
    const selectedData = addressData[activeTab];

    if (Array.isArray(selectedData)) {
      return selectedData.length > 0 ? (
        selectedData.map((item, index) => (
          <Text key={index} style={styles.contentText}>
            {item}
          </Text>
        ))
      ) : (
        <Text style={styles.noDataText}>No Data Available</Text>
      );
    }

    return <Text style={styles.contentText}>{selectedData || 'Not Available'}</Text>;
  };
console.log('downloadReportData',downloadReportData);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['locality', 'street', 'neighborhood', 'district',].map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.tabButton,
              activeTab === key && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === key && styles.activeTabText,
              ]}
            >
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Display content based on active tab */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#4F86F7" />
        ) : chartData.length > 0 ? (
          <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: () => `rgba(0, 0, 0, 0.5)`,
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
            center={[10, 0]}
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>No Data Available</Text>
        )}

        {/* Render content for the selected address tab */}
        <View style={styles.tabContentContainer}>
          {renderTabContent()}
        </View>
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Text style={styles.downloadButtonText}>Download Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PieChartAlternative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#e6e6e6',
  },
  activeTabButton: {
    backgroundColor: '#4F86F7',
  },
  tabText: {
    fontSize: 12,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    color: '#4F86F7',
    textAlign: 'center',
    marginVertical: 10,
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  tabContentContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  downloadButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
