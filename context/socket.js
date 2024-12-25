import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { devURL } from '../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
// Create the context
const SocketContext = createContext();
 
// Define the provider
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
 
    const getUserJWT = async () => {
        const jwt = await AsyncStorage.getItem('token');
        return jwt
    }
    
    useEffect(async () => {
        // Initialize the socket connection
        // const socket = io("http://your-server-url", {
        //     auth: {
            //       token: "your-authentication-token",
            //       userId: "your-user-id",
            //     },
            //   });
            const jwtToken = await getUserJWT()
            
            console.log('jwtToken------------',jwtToken)

            const newSocket = io(devURL, {
                auth: {
                    token: jwtToken,
                    userId: "rohit ------------",
                },
                transports: ["websocket"],
                
            }); 
            setSocket(newSocket);
            
            // Cleanup the connection when the component unmounts
            return () => {
                newSocket.disconnect();
            };
        }, []);
   
        
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
 
// Custom hook to use the socket instance
export const useSocket = () => {
    return useContext(SocketContext);
};