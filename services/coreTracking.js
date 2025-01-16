import axios from 'axios';
import { devURL } from '../constants/endpoints';
import {
  getDistanceAndETA,
  getDistanceFromLatLonInMeters,
} from './util/distanceMatrix';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAddressFromCoordinates_v1, getAddressFromCoordinates_v2 } from './util/geoCoding';
//=======================================

export const updateLocationIfNeeded = async (
  latitude,
  longitude,
  prevLocation,
  locationDetails,
) => {
  console.log(' prevLocation :', prevLocation);

  let lat2 = latitude;
  let lon2 = longitude;

  // Calculate distance
  // const { distance } = await getDistanceAndETA(prevLocation[1], prevLocation[0], lat2, lon2);
  const distance = getDistanceFromLatLonInMeters(
    prevLocation[0],
    prevLocation[1],
    lat2,
    lon2,
  );
  // console.log('=======[coreTracking]========')
  console.log(' DISPLACEMENT :', distance);

  if (distance > 100) {
    // if (true) {
    try {
      console.log('----- location updatng [MapOne]................');

      const jwtToken = await AsyncStorage.getItem('token');

      const response = await axios.patch(
        `${devURL}/member/profile/location-update`,
        {
          latitude: lat2,
          longitude: lon2,
          locationDetails,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      console.log(
        ' -------------------------------- UPDATED !!!!! ------------------------------------- ..... ',
      );
      console.log(response.status);

      // setMemberProfileError(null); // Reset error state on successful update
    } catch (err) {
      // setMemberProfileError(err.message || "Failed to update location");
    } finally {
      // setMemberProfileLoader(false);
    }
    // await postLocationToDB(newLocation);
  }
};

export const updateLocationOnDisplacement = async liveLocation => {
  // console.log(' liveLocation :', liveLocation,);

  try {
    const geoCoded = await getAddressFromCoordinates_v1(prevLocation)
    // console.log('geoCoded',geoCoded.data.features[0].properties.name_preferred);
  
    // console.log(' locationDetails :', response.data?.features[0]?.properties?.context?.neighborhood?.name);
    
    let locationDetails = {
      preferredAddress: geoCoded.data?.features[0]?.properties?.name_preferred || null,
      address: geoCoded.data?.features[0]?.properties?.place_formatted || null,
      locality: geoCoded.data?.features[0]?.properties?.context?.locality?.name || null,
  
      street: geoCoded.data?.features[0]?.properties?.context?.street?.name || null,
  
      neighborhood: geoCoded.data?.features[0]?.properties?.context?.neighborhood?.name || 'Not Found',
      region: geoCoded.data?.features[0]?.properties?.context?.region?.name || null,
      district: geoCoded.data?.features[0]?.properties?.context?.district?.name || null,
      country: geoCoded.data?.features[0]?.properties?.context?.country?.name || null,
      postcode: geoCoded.data?.features[0]?.properties?.context?.postcode?.name || null,
    };
  
    const jwtToken = await AsyncStorage.getItem('token');
    // console.log('----- updateLocationOnDisplacement jwtToken  ................',jwtToken );

    const response = await axios.patch(
      `${devURL}/member/profile/location-update`,
      {
        latitude: location?.latitude,
        longitude: location?.longitude,
        locationDetails,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );

    // console.log(
    //   ' -------------------------------- UPDATED !!!!! ------------------------------------- ..... ',
    // );
    // console.log(response.status);

    // setMemberProfileError(null); // Reset error state on successful update
  } catch (err) {
    // setMemberProfileError(err.message || "Failed to update location");
  } finally {
    // setMemberProfileLoader(false);
  }
  // await postLocationToDB(newLocation);
};

//=======================================
export const updateLocationIfNeeded_bg = async (
  latitude,
  longitude,
  prevLocation,
  taskId
) => {
  console.log('prevLocation', prevLocation);
  console.log('longitude', longitude);
  console.log('latitude', latitude)

  // const geoCoded = await getAddressFromCoordinates_v1(prevLocation)
  // const geoCoded = await getAddressFromCoordinates_v1([longitude,longitude])
  const geoCoded = await getAddressFromCoordinates_v2(latitude,longitude)
  console.log('geoCoded', geoCoded.data?.features[0]?.properties?.place_formatted);

  // console.log(' locationDetails :', response.data?.features[0]?.properties?.context?.neighborhood?.name);
  let lat2 = latitude;
  let lon2 = longitude;
  let locationDetails = {
    preferredAddress: geoCoded.data?.features[0]?.properties?.name_preferred || null,
    address: geoCoded.data?.features[0]?.properties?.place_formatted || null,
    locality: geoCoded.data?.features[0]?.properties?.context?.locality?.name || null,

    street: geoCoded.data?.features[0]?.properties?.context?.street?.name || null,

    neighborhood: geoCoded.data?.features[0]?.properties?.context?.neighborhood?.name || 'Not Found',
    region: geoCoded.data?.features[0]?.properties?.context?.region?.name || null,
    district: geoCoded.data?.features[0]?.properties?.context?.district?.name || null,
    country: geoCoded.data?.features[0]?.properties?.context?.country?.name || null,
    postcode: geoCoded.data?.features[0]?.properties?.context?.postcode?.name || null,
  };

  // console.log(' locationDetails :', locationDetails);
  // Calculate distance
  // const { distance } = await getDistanceAndETA(prevLocation[1], prevLocation[0], lat2, lon2);
  const distance = getDistanceFromLatLonInMeters(
    prevLocation[0],
    prevLocation[1],
    lat2,
    lon2,
  );
  // console.log('=======[coreTracking]========')
  // console.log(' DISPLACEMENT :', distance);

  if (distance > 50) {
    // if (true) {
    try {
      // console.log('----- BG Updation...............');

      const jwtToken = await AsyncStorage.getItem('token');

      const response = await axios.patch(
        `${devURL}/member/profile/assignment-location-tracking`,
        {
          latitude: lat2,
          longitude: lon2,
          locationDetails,
          assignmentId:taskId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      console.log(
        ' -------------------------------- UPDATED !!!!! ------------------------------------- ..... ',
      );
      console.log(response.status);

      // setMemberProfileError(null); // Reset error state on successful update
    } catch (err) {
      // setMemberProfileError(err.message || "Failed to update location");
    } finally {
      // setMemberProfileLoader(false);
    }
    // await postLocationToDB(newLocation);
  }
};


//===============================================================

export const updateLocationIfNeeded_liveTracker = async (
  latitude,
  longitude,
  prevLocation,
) => {
  console.log('prevLocation', prevLocation);
  console.log('longitude', longitude);
  console.log('latitude', latitude)

  // const geoCoded = await getAddressFromCoordinates_v1(prevLocation)
  // const geoCoded = await getAddressFromCoordinates_v1([longitude,longitude])
  const geoCoded = await getAddressFromCoordinates_v2(latitude,longitude)
  console.log('geoCoded', geoCoded.data?.features[0]?.properties?.place_formatted);

  // console.log(' locationDetails :', response.data?.features[0]?.properties?.context?.neighborhood?.name);
  let lat2 = latitude;
  let lon2 = longitude;
  let addressDetails = {
    preferredAddress: geoCoded.data?.features[0]?.properties?.name_preferred || null,
    address: geoCoded.data?.features[0]?.properties?.place_formatted || null,
    locality: geoCoded.data?.features[0]?.properties?.context?.locality?.name || null,

    street: geoCoded.data?.features[0]?.properties?.context?.street?.name || null,

    neighborhood: geoCoded.data?.features[0]?.properties?.context?.neighborhood?.name || 'Not Found',
    region: geoCoded.data?.features[0]?.properties?.context?.region?.name || null,
    district: geoCoded.data?.features[0]?.properties?.context?.district?.name || null,
    country: geoCoded.data?.features[0]?.properties?.context?.country?.name || null,
    postcode: geoCoded.data?.features[0]?.properties?.context?.postcode?.name || null,
  };

  // console.log(' locationDetails :', locationDetails);
  // Calculate distance
  // const { distance } = await getDistanceAndETA(prevLocation[1], prevLocation[0], lat2, lon2);
  const distance = getDistanceFromLatLonInMeters(
    prevLocation[0],
    prevLocation[1],
    lat2,
    lon2,
  );
  // console.log('=======[coreTracking]========')
  console.log(' Live dosplacement  :', distance);

  if (distance > 20) {
    // if (true) {
    try {
      // console.log('----- BG Updation...............');

      const jwtToken = await AsyncStorage.getItem('token');

      const response = await axios.patch(
        `${devURL}/member/profile/live-location-tracking`,
        {
          latitude: lat2,
          longitude: lon2,
          addressDetails,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      console.log(
        ' -------------------------------- UPDATED !!!!! ------------------------------------- ..... ',
      );
      console.log(response.status);

      // setMemberProfileError(null); // Reset error state on successful update
    } catch (err) {
      // setMemberProfileError(err.message || "Failed to update location");
    } finally {
      // setMemberProfileLoader(false);
    }
    // await postLocationToDB(newLocation);
  }
};





const updateLocationIfNeeded_liveTracker_new = async (latitude, longitude, prevLocation, lastUpdateTime) => {
  const currentTime = new Date().getTime();
  const timeElapsed = (currentTime - lastUpdateTime) / 1000 / 60;  // in minutes

  console.log('prevLocation', prevLocation);
  console.log('longitude', longitude);
  console.log('latitude', latitude);
  
  // Get the current location details using the geocoding API
  const geoCoded = await getAddressFromCoordinates_v2(latitude, longitude);
  console.log('geoCoded', geoCoded.data?.features[0]?.properties?.place_formatted);

  // Extract address details
  let addressDetails = {
    preferredAddress: geoCoded.data?.features[0]?.properties?.name_preferred || null,
    address: geoCoded.data?.features[0]?.properties?.place_formatted || null,
    locality: geoCoded.data?.features[0]?.properties?.context?.locality?.name || null,
    street: geoCoded.data?.features[0]?.properties?.context?.street?.name || null,
    neighborhood: geoCoded.data?.features[0]?.properties?.context?.neighborhood?.name || 'Not Found',
    region: geoCoded.data?.features[0]?.properties?.context?.region?.name || null,
    district: geoCoded.data?.features[0]?.properties?.context?.district?.name || null,
    country: geoCoded.data?.features[0]?.properties?.context?.country?.name || null,
    postcode: geoCoded.data?.features[0]?.properties?.context?.postcode?.name || null,
  };

  // Calculate the distance between the current and previous location
  const distance = getDistanceFromLatLonInMeters(prevLocation[0], prevLocation[1], latitude, longitude);
  console.log('Live displacement:', distance);

  // Define adaptive thresholds based on user activity
  const movementThreshold = distance > (timeElapsed < 10 ? 20 : 50);  // If within 10 minutes, use 20 meters threshold
  const timeThreshold = timeElapsed >= 5; // Update every 5 minutes

  if (movementThreshold || timeThreshold) {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.patch(`${devURL}/member/profile/live-location-tracking`, {
        latitude,
        longitude,
        addressDetails,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log('Location updated successfully', response.status);
      lastUpdateTime = currentTime; // Update the time of last update
    } catch (err) {
      console.log('Error updating location:', err.message || 'Failed to update location');
    }
  }
};

