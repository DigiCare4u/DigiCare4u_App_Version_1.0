import axios from 'axios';
import { devURL } from '../constants/endpoints';
import { getDistanceAndETA, getDistanceFromLatLonInMeters } from '../services/distanceMatrix';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const updateLocationIfNeeded = async (latitude, longitude, prevLocation) => {

    console.log('prevLocation [coreTracking]---------', prevLocation[0]);

    // const { latitude: lat1, longitude: lon1 } = prevLocation;
    let lat2 = latitude
    let lon2 = longitude

    // Calculate distance
    // const { distance } = await getDistanceAndETA(prevLocation[1], prevLocation[0], lat2, lon2);
    const distance = getDistanceFromLatLonInMeters(prevLocation[0], prevLocation[1], lat2, lon2);
    console.log('=====[coreTracking]=======')
    console.log('distance ---------', distance);

    if (distance > 5) {
        try {
            console.log('----- updating location ................',);

            const jwtToken = await AsyncStorage.getItem('token');

            const response = await axios.patch(
                `${devURL}/member/profile/location-update`,
                {
                    latitude: lat2,
                    longitude: lon2
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
        // await postLocationToDB(newLocation);
    }
};
