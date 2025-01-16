import React, { useEffect, useState, useRef } from 'react';
import BackgroundService from 'react-native-background-actions';
import GetLocation from 'react-native-get-location';
import MemberMap from '../components/MapMember';
import { getDistanceAndETA, getDistanceFromLatLonInMeters } from './distanceMatrix';
import { devURL } from '../config/server';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BackgroundLocationAction = () => {
  const [location, setLocation] = useState({});
  const [memberProfile, setMemberProfile] = useState({});
  const memberProfileRef = useRef(memberProfile);

  // Update the ref whenever memberProfile changes
  useEffect(() => {
    memberProfileRef.current = memberProfile;
  }, [memberProfile]);

  // Fetch member profile and update the state and ref
  const fetchMemberProfile = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/member/profile`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
      });



      setMemberProfile(response?.data?.member);
    } catch (err) {
      console.error("Failed to fetch member profile:", err.message);
    }
  };

  // Helper sleep function for delay
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  // Background task function
  const locationTrackingTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;

    await new Promise(async (resolve) => {
      while (BackgroundService.isRunning()) {
        try {
          const location = await GetLocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 50000,
          });

          const currentMemberProfile = memberProfileRef.current;

          // console.log("location---------------:", currentMemberProfile?.location?.coordinates[0],
          //   currentMemberProfile?.location?.coordinates[1],
          //   location.latitude,
          //   location.longitude);
          let displacement = getDistanceFromLatLonInMeters(
            currentMemberProfile?.location?.coordinates[0],
            currentMemberProfile?.location?.coordinates[1],
            location.latitude,
            location.longitude
          );

          let data = await getDistanceAndETA(
            currentMemberProfile?.location?.coordinates[0],
            currentMemberProfile?.location?.coordinates[1],
            // 26.8542,
            // 80.9448,
            location.latitude,
            location.longitude
          )
          // console.log("data ---------- :", data);

          setLocation(location);
          // console.log("Displacement:", displacement);
          // console.log("distanceMatrix ---------- :", distance, eta);
          // if (displacement && displacement >= 0.00000) {
          if (true) {
            try {
              // console.log('----- updating location ................',);

              // setMemberProfileLoader(true);
              const jwtToken = await AsyncStorage.getItem('token');

              const response = await axios.patch(
                `${devURL}/member/profile/location-update`,
                {
                  latitude: location.latitude,
                  longitude: location.longitude
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwtToken}`,
                  },
                }
              );

              console.log('location updated !', response.status);

              // setMemberProfileError(null); // Reset error state on successful update
            } catch (err) {
              // setMemberProfileError(err.message || "Failed to update location");
            } finally {
              // setMemberProfileLoader(false);
            }
          }


        }
        catch (error) {

          console.error("Error fetching location in background:", error);
        }

        await sleep(delay);
      }
    });
  };

  // Background service options
  const options = {
    taskName: 'DigiCare4u Location Tracking',
    taskTitle: 'DigiCare4u Location Tracking',
    taskDesc: 'Tracking user location in the background',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
      delay: 5000, // Interval in milliseconds (1 minute)
    },
    linkingURI: 'yourAppScheme://home',
    notifications: {
      silent: false,
    },
  };

  useEffect(() => {
    startBackgroundLocationTracking();
    fetchMemberProfile();

    // Cleanup by stopping background tracking when the component unmounts
    // return () => {
    //   stopBackgroundLocationTracking();
    // };
  }, []);

  // Start background location tracking
  const startBackgroundLocationTracking = async () => {
    try {
      await BackgroundService.start(locationTrackingTask, options);
    } catch (error) {
      console.error("Error starting background location tracking:", error);
    }
  };

  // Stop background location tracking
  const stopBackgroundLocationTracking = async () => {
    try {
      await BackgroundService.stop();
    } catch (error) {
      console.error("Error stopping background location tracking:", error);
    }
  };

  return (
    <MemberMap
      latitude={location?.latitude}
      longitude={location?.longitude}
    />
  );
};

export default BackgroundLocationAction;
