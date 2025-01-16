import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Dimensions, RefreshControl } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import useFetchMember from "../hooks/useFetchMember";

const { width } = Dimensions.get("window");

const Report = () => {
  const { records, fetchTrackingRecords } = useFetchMember();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!records) {
      setIsRefreshing(true); // Start refreshing

      fetchTrackingRecords();
      setIsRefreshing(false); // Start refreshing

    }
  }, [fetchTrackingRecords]);


  // console.log('records', records[0]?.address);



  const renderItem = ({ item }) => (
    <View style={styles.rowContainer}>
      <View style={{ padding: 5, marginHorizontal: 10 }}>
        <Icon name="map-marker" size={40} color="#376ADA" />
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>
            <Text style={{ color: "#376ADA", fontWeight: "600" }}>Time: </Text>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
        <Text style={styles.locationLabel}>
          <Text style={{ color: "#376ADA", fontWeight: "600" }}>Location: </Text>
          {item?.preferredAddress || "Not available"}
        </Text>
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchTrackingRecords}
          />
        }
      />
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    paddingHorizontal: 5,
    paddingVertical: 10,
    height: 70,
    marginBottom: 10,
  },
  mapContainer: {
    width: width * 0.2, // Adjust width for smaller screens
    height: 90,
    borderRadius: 10,
    overflow: "hidden",
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
  timeContainer: {
    flex: 1,
    marginLeft: 3,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  timeLabel: {
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 5,
  },
  locationLabel: {
    fontSize: 13,
    color: "#555",
    paddingHorizontal: 5,
    marginTop: 5,
  },
});
