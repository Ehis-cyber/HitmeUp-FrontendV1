import SmartyStreetsSDK from "smartystreets-javascript-sdk";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configure Smarty credentials
// Initialize ONCE
const credentials = new SmartyStreetsSDK.core.SharedCredentials(
    process.env.SMARTY_AUTH_ID, 
    process.env.SMARTY_AUTH_TOKEN);
const client = SmartyStreetsSDK.core.buildClient.internationalStreet(credentials); // For international addresses

export const geocodeLocation = async (address) => {
  try {
    const lookup = new SmartyStreetsSDK.internationalStreet.Lookup();
    lookup.country = "NG"; // Restrict to Nigeria
    lookup.address1 = address; // The address to geocode

    const result = await someGeocodeApi(address);

    if (result.length === 0) {
      throw new Error("location not found.");
    }
if (!result || !Array.isArray(result) || !result[0] || !result[0].metadata) {
    throw new Error("Invalid geocode response");
  }
    const addressData = result[0].metadata;
    return {
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      city: result[0].components.cityName,
      state: result[0].components.state,
    };
    
  } catch (error) {
    console.error("Error validating and geocoding address:", error);
    throw new Error("Failed to validate and geocode address.");
  }
};

export default client;