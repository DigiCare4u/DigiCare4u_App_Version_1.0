import BackgroundActions from 'react-native-background-actions';
import GetLocation from 'react-native-get-location';

export const BackgroundManager = {
  start: async (taskFunction, options) => {
    try {
      if (!BackgroundActions.isRunning()) {
        await BackgroundActions.start(taskFunction, options);
      }
    } catch (error) {
      console.error("Error starting background task:", error);
    }
  },

  stop: async () => {
    try {
      if (BackgroundActions.isRunning()) {
        await BackgroundActions.stop();
      }
    } catch (error) {
      console.error("Error stopping background task:", error);
    }
  },

  isRunning: () => BackgroundActions.isRunning(),
};




export const runTask = async (taskName, taskParams) => {
    switch (taskName) {
      case 'fetchLocation':
        // Location fetching logic
        await fetchLocation();
        break;
  
      case 'sendNotification':
        // Notification logic
        await sendNotification(taskParams.message);
        break;
  
      default:
        console.warn("Unknown task:", taskName);
    }
  };
  
  // Example task function: Fetch location
  const fetchLocation = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 45000,
      });
      console.log("Fetched location___:", location?.accuracy);
      // Save to backend or state
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };
  
  // Example task function: Send notification
  const sendNotification = async (message) => {
    // Logic to trigger a notification
    console.log("Sending notification:", message);
  };
  


  export const optionsTemplate = (taskName, description, delay = 3600000) => ({
    taskName,
    taskTitle: `${taskName} Task`,
    taskDesc: description,
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: { delay },
    notifications: { silent: false },
  });
  