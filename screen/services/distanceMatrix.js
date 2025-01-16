import axios from 'axios';
export const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the earth in meters
    const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    return distance; // This will be in meters
};



export const getDistanceAndETA = async (lat1, lon1, lat2, lon2) => {
    const apiKey = 'AIzaSyCYccF8ckaqfq6uO_CuwnCxLiMdcOOT6XY'; // Replace with your actual API key
    const origin = `${lat1},${lon1}`;
    const destination = `${lat2},${lon2}`;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        // console.log("distanceMatrix -------:", response?.data.rows[0]);

        const data = response.data;

        if (data.rows[0].elements[0].status === "OK") {
            const distance = data.rows[0].elements[0].distance.text; // e.g., "8.1 km"
            const eta = data.rows[0].elements[0].duration.text;      // e.g., "15 mins"
            
            return { distance, eta };
        } else {
            throw new Error('No route found.');
        }
    } catch (error) {
        console.error("Error fetching data from Distance Matrix API:", error);
        return null;
    }
};



