import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MemberSideAssignmentReport from './MemberSideAssignmentReport'
import AttendanceModel from '../Modal/MemberModal/AttendanceModal'
import Icon from 'react-native-vector-icons/FontAwesome';  // Import the calendar icon from FontAwesome

const DetailMap = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [openModal, setOpenModal] = useState(false)

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const latitude = 26.8467;
  const longitude = 80.9462;

  const initialRegion = {
    latitude: latitude, // Latitude for Lucknow
    longitude: longitude, // Longitude for Lucknow
    latitudeDelta: 0.05, // Zoom level for a closer view of Lucknow
    longitudeDelta: 0.05, // Zoom level for a closer view of Lucknow
  };

  return (
    <>
      <View
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <MapView style={styles.map} initialRegion={initialRegion}>
          <Marker
            coordinate={{ latitude: 26.8467, longitude: 80.9462 }}
            title="Lucknow"
            description="Capital of Uttar Pradesh"
          />
        </MapView>
      </View>
      <MemberSideAssignmentReport />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10, // Added padding for spacing
          borderRadius: 10, // Rounded corners for the container
        }}
      >
        {/* Calendar Icon */}
        <Icon name="calendar" size={24} color="#4A90E2" style={{ marginRight: 10, }} />

        {/* Touchable Button */}
        <TouchableOpacity
          onPress={() => setOpenModal(true)}
          style={{
            flex: 1, // Makes the button take up remaining space
          }}
        >
          <Text
            style={{
              fontSize: 18,
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: "#4A90E2", // Softer blue for the button
              color: "white", // High contrast text
              borderRadius: 8, // Rounded corners
              textAlign: "center", // Centered text
              shadowColor: "#000", // Shadow for depth
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5, // Shadow for Android
            }}
          >
            Click to view your daily records
          </Text>
        </TouchableOpacity>
      </View>


      {/* Attendance Modal */}
      <AttendanceModel visible={openModal} setVisible={setOpenModal} />
    </>
  );
};

export default DetailMap;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
  },
  map: {
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    height: 299,
    borderRadius: 10,
    backgroundColor: "#fff"
  },
});
