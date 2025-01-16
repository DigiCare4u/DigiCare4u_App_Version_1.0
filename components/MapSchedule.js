import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Loader from "./Loader";
import useLocation from "../hooks/useLocation";

const MapSchedule = (props) => {
  const [query, setQuery] = useState("");
  const [showText, setShowText] = useState("");
  const [places, setPlaces] = useState([]);
  const { location, error, getCurrentLocation } = useLocation();
  const mapRef = useRef(null); // Reference for the MapView
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (!location) {
      getCurrentLocation();
    }
  }, [getCurrentLocation]);

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
        const data = await response.json();

        setPlaces(data.features || []);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    } else {
      setPlaces([]);
    }
  };

  const handlePlaceSelect = (place) => {
    const newLocation = {
      latitude: place.center[1],
      longitude: place.center[0],
    };
    setSelectedLocation(newLocation);
    props.setSelectedLocationForAPI(newLocation);
    props.setQuery(place.place_name);
    setShowText(place.place_name);

    // Animate to the selected location
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...newLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000 // Duration in ms
      );
    }

    setPlaces([]);
  };

  const onMarkerDragEnd = (e) => {
    const newCoords = e.nativeEvent.coordinate;
    props.setSelectedLocationForAPI({
      latitude: newCoords.latitude,
      longitude: newCoords.longitude,
    });
    props.setQuery("customPlace");

    // Animate to the new marker position
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...newCoords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
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

      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: selectedLocation ? selectedLocation.latitude : 0.0,
            longitude: selectedLocation ? selectedLocation.longitude : 0.0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              draggable
              onDragEnd={onMarkerDragEnd}
            />
          )}
        </MapView>
      ) : (
        <Loader />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  suggestionsList: {
    position: "absolute",
    top: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 350,
    width: "100%",
    zIndex: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    overflow: "hidden",
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    color: "#376ADA",
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
    color: "#376ADA",
  },
});

export default MapSchedule;
