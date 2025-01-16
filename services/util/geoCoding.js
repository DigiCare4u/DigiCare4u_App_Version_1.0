import axios from "axios";

export const getAddressFromCoordinates_v1 = async ([latitude,longitude]) => {




    // console.log('latitude aaya____________ : ', latitude);
    const accessToken =
        'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ'; // Replace with your Mapbox token
    const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${accessToken}&limit=1`;

    try {
        const response = await axios.get(url);
        // console.log('response ________________ : ',response.data.features[0].properties.full_address);
        // console.log('response ________________ : ', response?.data?.features[0]?.properties?.context?.locality?.name);

        // if (response.data && response.data.features.length > 0) {
        if (response.data) {
            // setCountry(response.data.features[0].properties.context.country.name);
            // setLocationDetails(prevState => ({
            //   ...prevState,
            //   preferredAddress:
            //     response.data?.features[0]?.properties?.name_preferred || null,
            //   address:
            //     response.data?.features[0]?.properties?.place_formatted || null,
            //   street:
            //     response.data?.features[0]?.properties?.context?.street?.name ||
            //     null,
            //   neighborhood:
            //     response.data?.features[0]?.properties?.context?.neighborhood
            //       ?.name || 'Not Found',
            //   postcode:
            //     response.data?.features[0]?.properties?.context?.postcode?.name ||
            //     null,
            //   locality:
            //     response.data?.features[0]?.properties?.context?.locality?.name ||
            //     '',
            //   district:
            //     response.data?.features[0]?.properties?.context?.district?.name ||
            //     null,
            //   region:
            //     response.data?.features[0]?.properties?.context?.region?.name ||
            //     null,
            //   country:
            //     response.data?.features[0]?.properties?.context?.country?.name ||
            //     null,
            // }));

            return response
        } else {
            console.log('Address not found');
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        console.log('Error fetching address');
    }
};




export const getAddressFromCoordinates_v2 = async (latitude,longitude) => {




    // console.log('latitude aaya____________ : ', latitude);
    const accessToken =
        'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ'; // Replace with your Mapbox token
    const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${accessToken}&limit=1`;

    try {
        const response = await axios.get(url);
        // console.log('response ________________ : ',response.data.features[0].properties.full_address);
        // console.log('response ________________ : ', response?.data?.features[0]?.properties?.context?.locality?.name);

        // if (response.data && response.data.features.length > 0) {
        if (response.data) {
            // setCountry(response.data.features[0].properties.context.country.name);
            // setLocationDetails(prevState => ({
            //   ...prevState,
            //   preferredAddress:
            //     response.data?.features[0]?.properties?.name_preferred || null,
            //   address:
            //     response.data?.features[0]?.properties?.place_formatted || null,
            //   street:
            //     response.data?.features[0]?.properties?.context?.street?.name ||
            //     null,
            //   neighborhood:
            //     response.data?.features[0]?.properties?.context?.neighborhood
            //       ?.name || 'Not Found',
            //   postcode:
            //     response.data?.features[0]?.properties?.context?.postcode?.name ||
            //     null,
            //   locality:
            //     response.data?.features[0]?.properties?.context?.locality?.name ||
            //     '',
            //   district:
            //     response.data?.features[0]?.properties?.context?.district?.name ||
            //     null,
            //   region:
            //     response.data?.features[0]?.properties?.context?.region?.name ||
            //     null,
            //   country:
            //     response.data?.features[0]?.properties?.context?.country?.name ||
            //     null,
            // }));

            return response
        } else {
            console.log('Address not found');
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        console.log('Error fetching address');
    }
};
