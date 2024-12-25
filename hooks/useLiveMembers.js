// hooks/useLiveMembers.js
import { useState, useEffect } from 'react';

const useLiveMembers = (socket) => {
  const [liveMembers, setLiveMembers] = useState({});

const onMe = ()=>{
  if (socket) {
    socket.on('iveMembers', (notification) => {
      // console.log('-------  (notification socket calling ....)  -----------',notification);

      setLiveMembers(notification);
    });
  }
}


  useEffect(() => {
    onMemberVerifiedNotification();
  }, [socket]);

  const markAsRead = (notificationId) => {
    setLiveMembers((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
  };

  return { 
    notifications,
    onMemberVerifiedNotification,
     markAsRead };
};

export default useLiveMembers;
