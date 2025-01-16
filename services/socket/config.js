import io from 'socket.io-client';
import AsyncStorage from "@react-native-async-storage/async-storage";

let socket = null;
const getUserJWT = async () => {
    const jwt = await AsyncStorage.getItem("token");
    return jwt;
};

export const initializeSocket = async (serverUrl) => {
    // console.log('_____serverUrl___ : ',serverUrl);

    if (!socket) {
        const jwtToken = await getUserJWT();

        socket = io(serverUrl, {
            auth: {
                token: jwtToken,
                userId: "rohit -------------",
            },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('Socket Connected ✅');
        });

        socket.on('disconnect', () => {
            // socket.on('myCustomEvent', (data) => {
            //     console.log('____ ⛔', data);

            // })

            console.log('Socket  Disconnected ⛔');

        });





        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });
    }
};

export const emitEvent = (event, data) => {
    if (socket) {
        socket.emit(event, data);
    } else {
        // console.warn('Socket not initialized. Call initializeSocket() first.');
    }
};

export const onEvent = (event, callback) => {
    if (socket) {
        // console.log('____event name ___',event);

        socket.on(event, callback);
    } else {
        // console.warn('Socket not initialized. Call initializeSocket() first.');
    }
};

export const offEvent = (event) => {
    if (socket) {
        socket.off(event);
    } else {
        // console.warn('Socket not initialized. Call initializeSocket() first.');
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('Socket disconnected');
    }
};