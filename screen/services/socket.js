
import io from 'socket.io-client';
import AsyncStorage from "@react-native-async-storage/async-storage";
 
let socket = null;
const getUserJWT = async () => {
    const jwt = await AsyncStorage.getItem("token");
    return jwt;
};
 
// Initialize the socket connection
export const initializeSocket = async (serverUrl) => {
    if (!socket) {
        const jwtToken = await getUserJWT();
        // console.log('jwtToken ----',jwtToken);
 
        socket = io(serverUrl, {
            auth: {
                token: jwtToken,
                userId: "nischal -----------------r",
            },
            transports: ['websocket'], // Ensure WebSocket is used for better performance
        });
 
        socket.on('connect', () => {
            console.log('Connected to socket server');
        });
 
        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });
 
        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });
    }
};
 
// Emit events to the server
export const emitEvent = (event, data) => {
    if (socket) {
        socket.emit(event, data);
    } else {
        console.warn('Socket not initialized. Call initializeSocket() first.');
    }
};
 
// Listen for events from the server
export const onEvent = (event, callback) => {
    if (socket) {
        console.log(event,'--------------event')
        socket.on(event, callback);
    } else {
        console.log(event,'--------------event')
        console.warn('Socket not initialized. Call initializeSocket() first.');
    }
};
 
// Remove event listeners
export const offEvent = (event) => {
    if (socket) {
        socket.off(event);
    } else {
        console.warn('Socket not initialized. Call initializeSocket() first.');
    }
};
 
// Disconnect the socket
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('Socket disconnected');
    }
};