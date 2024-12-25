// hooks/useGeofence.js
import { useState, useEffect } from 'react';
import haversine from 'haversine-distance'; // Library to calculate distance between coordinates

const useGeofence = (targetLocation, radius) => {
  const [isWithinGeofence, setIsWithinGeofence] = useState(false);

  const checkGeofence = (currentLocation) => {
    if (!currentLocation || !targetLocation) return false;
    
    const distance = haversine(currentLocation, targetLocation);
    return distance <= radius;
  };

  const updateGeofenceStatus = (currentLocation) => {
    const withinGeofence = checkGeofence(currentLocation);
    setIsWithinGeofence(withinGeofence);
  };

  return { isWithinGeofence, updateGeofenceStatus };
};

export default useGeofence;
