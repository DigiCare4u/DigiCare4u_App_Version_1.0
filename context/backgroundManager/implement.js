import React, { useEffect } from 'react';
import { BackgroundManager, optionsTemplate, runTask } from './manager';

const Imple = () => {
  console.log('impole -----------');

  const startTracking = async () => {
    const options = optionsTemplate(
      'fetchLocation',
      'Fetching user location every hour',
      3600 // 1 hour
    );

    await BackgroundManager.start(
      async (taskData) => {
        while (BackgroundManager.isRunning()) {
          await runTask('fetchLocation');
          await new Promise((resolve) => setTimeout(resolve, taskData.delay));
        }
      },
      options
    );
  };
  useEffect(() => {

    startTracking();

    return () => {
      BackgroundManager.stop();
    };
  }, []);

  return null; // Adjust this based on your UI
};

export default Imple;
