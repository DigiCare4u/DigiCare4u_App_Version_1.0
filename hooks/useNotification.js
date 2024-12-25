// hooks/useNotification.js
import { useState, useEffect } from 'react';

const useNotification = (socket) => {
  const [memberVerifiedNotification, setMemberVerifiedNotification] = useState({});
  const [bgRequset, setBgRequset] = useState()

const onMemberVerifiedNotification = ()=>{
  if (socket) {
    socket.on('onMemberVerified', (notification) => {
      // console.log('-------  (notification socket calling ....)  -----------',notification);

      setMemberVerifiedNotification(notification);
    });
  }
};

const bgRequsetNotification =()=>{
      
}

  useEffect(() => {
    onMemberVerifiedNotification();
  }, [socket]);

  const markAsRead = (notificationId) => {
    setMemberVerifiedNotification((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    ); 
  };

  return { 
    memberVerifiedNotification,
    onMemberVerifiedNotification,
     markAsRead };
};

export default useNotification;
