import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import RNFS from 'react-native-fs'; // For file system operations
import XLSX from 'xlsx'; // For converting JSON to CSV

// Function to download the file

const DownloadButton = ({attendanceRecords}) => {
  const downloadFile = async () => {
    try {
      // Sample JSON data
      const jsonData = attendanceRecords
  
      // Convert JSON data to CSV using XLSX
      const ws = XLSX.utils.json_to_sheet(jsonData);
      const csv = XLSX.utils.sheet_to_csv(ws);
  
      // Define the path to save the file (e.g., on external storage or app's document directory)
      const filePath = `${RNFS.DownloadDirectoryPath}/report9.csv`; // You can use RNFS.DocumentDirectoryPath for app internal storage
  
      // Write the CSV file to the defined path
      await RNFS.writeFile(filePath, csv, 'utf8');
      console.log('File saved to:', filePath);
  
      // Show an alert to notify the user that the download was successful
      Alert.alert('Download Successful', `The report has been downloaded to ${filePath}`);
    } catch (error) {
      console.error('Error generating or saving the file:', error);
      Alert.alert('Download Failed', 'An error occurred while trying to download the report.');
    }
  };


//=========================================

  return (
    <TouchableOpacity onPress={downloadFile} style={styles.iconButton}>
      <Text style={{ color: '#007BFF', fontWeight: '700', fontSize: 15 }}>
        Download Report
      </Text>
      {/* Icon for download button */}
      <Text style={{ color: '#007BFF', fontSize: 30 }}>📥</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default DownloadButton;
