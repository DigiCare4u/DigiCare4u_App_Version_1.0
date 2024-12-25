import BackgroundActions from 'react-native-background-actions';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const options = {
  taskName: 'Example',
  taskTitle: 'Example Task',
  taskDesc: 'This is an example task',
  taskIcon: {
    name: 'ic_launcher_round',
    type: 'mipmap',
    package: 'com.digicare',
  },
  color: '#ff00ff',
  linkingURI: 'example://chat', 
  parameters: {
    delay: 1000,
  },
};

const startBackgroundTask = async () => {
  await BackgroundActions.start(async taskData => {
    while (BackgroundActions.isRunning()) {
      console.log('Background task running');
      await sleep(taskData.delay);
    }
  }, options);

  // Optional: Stop task after some time
  await BackgroundActions.updateNotification({taskDesc: 'Updated Task'});
};

const stopBackgroundTask = async () => {
  await BackgroundActions.stop();
};

export {startBackgroundTask, stopBackgroundTask};
