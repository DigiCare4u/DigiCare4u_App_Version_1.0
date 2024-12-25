// hooks/useLocation.js
import { useState, useEffect } from 'react';
import GetLocation from 'react-native-get-location'; // Using `react-native-get-location` as per your stack

const useLocation = () => {
  const [location, setLocation] = useState(0.0);
  const [error, setError] = useState(null);

  const getCurrentLocation = async () => {
    try {

      // console.log('=====[useLocation]=======')
      
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 50000,
      });
      // console.log(' BG Fetched  ---------------------- :',locagtion?.latitude);
      setLocation(location);
      return location
    } catch (err) {
      setError(err.message);
    }
  };

  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);

  return { location, error, getCurrentLocation };
};

export default useLocation;
