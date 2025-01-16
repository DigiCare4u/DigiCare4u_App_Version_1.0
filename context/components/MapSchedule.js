import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity, Image } from "react-native";
import Mapbox, { MapView, Camera, MarkerView } from "@rnmapbox/maps";
import Icon from "react-native-vector-icons/FontAwesome";
import MapboxGL from '@rnmapbox/maps'; // React Native Mapbox
import Loader from "./Loader";
import useLocation from "../hooks/useLocation";

Mapbox.setAccessToken("sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ");

const MapSchedule = (props) => {
  const [query, setQuery] = useState("");
  const [showText, setShowText] = useState("");

  const [places, setPlaces] = useState([]);
  const { location, error, getCurrentLocation } = useLocation()

  useEffect(() => {
    if (!location) {
      getCurrentLocation();
    }
  }, [getCurrentLocation]);

  const [selectedLocation, setSelectedLocation] = useState(null);
  useEffect(() => {
    if (location) {
      setSelectedLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }, [location]);

  const searchPlaces = async (text) => {
    setShowText(text);

    if (text.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            text
          )}.json?access_token=sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ`
        );
        // console.log('data=============', response);
        const data = await response.json();

        // console.log('--------------MapSchedule-------------')

        setPlaces(data.features || []);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    } else {
      setPlaces([]);
    }
  };

  const handlePlaceSelect = (place) => {
    setSelectedLocation({
      latitude: place.center[1],
      longitude: place.center[0],
    });
    props.setSelectedLocationForAPI({
      latitude: place.center[1],
      longitude: place.center[0],
    });
    props.setQuery(place.place_name);
    setShowText(place.place_name);

    setPlaces([]);
  };


  // console.log('location ---------', location);
  // console.log('selectedLocation', selectedLocation);
  const onMarkerDragEnd = (e) => {
    console.log(e)
    const newCoords = e.geometry.coordinates;
    props.setSelectedLocationForAPI({
      latitude: newCoords[1],
      longitude: newCoords[0],
    });
    props.setQuery('customPlace');

    // console.log('New Marker Coordinates -----------------------------:', newCoords);
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        value={showText}
        onChangeText={searchPlaces}
        style={styles.searchBar}
        placeholder="Search location here..."
        placeholderTextColor="#376ADA"
      />

      {/* Places List */}
      {places.length > 0 && (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePlaceSelect(item)}>
              <Text style={styles.placeItem}>{item.place_name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}

      {location ? (<MapboxGL.MapView style={{
        flex: 1,
        backgroundColor: 'red',
        height: 300,
        width: "100%",

      }}
        // styleURL={MapboxGL.StyleURL.Street}
      >
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={
            [
              selectedLocation ? selectedLocation?.longitude : 0.0,
              selectedLocation ? selectedLocation?.latitude : 0.0,
            ]}

        />

        {/* Draggable Marker */}
        <MapboxGL.PointAnnotation
          id="marker"
          coordinate={[
            selectedLocation ? selectedLocation?.longitude : 0.0,
            selectedLocation ? selectedLocation?.latitude : 0.0,]}
          draggable={true}
          onDragEnd={onMarkerDragEnd}
        />
      </MapboxGL.MapView>) : <Loader />}



      {/* Map View */}
      {/* <MapView style={styles.map}>
        {selectedLocation && (
          <>
            <Camera
              zoomLevel={30}
              centerCoordinate={[selectedLocation.longitude, selectedLocation.latitude]}
            />
            <MarkerView
              draggable={true}
              coordinate={[selectedLocation.longitude, selectedLocation.latitude]}
            >
              <View style={styles.customMarker}>
                <Icon name="map-marker" size={28} color="#376ADA" style={styles.iconLeft} />
              </View>

            </MarkerView>
          </>
        )}
      </MapView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  searchBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  suggestionsList: {
    position: "absolute",
    top: 50, // Adjusted for the search bar's height
    backgroundColor: "#fff", // White background for suggestions
    borderRadius: 10, // Rounded corners for modern look
    maxHeight: 350,
    width: "100%",
    zIndex: 100, // Ensure it stays on top
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // iOS shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, // Subtle shadow
    shadowRadius: 4, // Softer shadow edges
    overflow: "hidden", // Hide any overflow content
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    color: "#376ADA", // Blue text color for suggestions
    fontSize: 16,
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 1,
    borderRadius: 10,
  },
  searchBar: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#376ADA",
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#376ADA", // Blue text color
  },
  memberImage: {
    height: 50,
    width: 50,
  }
});


export default MapSchedule;