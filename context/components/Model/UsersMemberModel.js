import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import UserMembers from "../UserMembers";
import { io } from "socket.io-client";
import { devURL } from "../../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socketService, { initializeSocket, offEvent, onEvent } from "../../socket/config";
import useFetchUser from "../../hooks/useFetchUser";
 
//====================================================
 
const getUserJWT = async () => {
    const jwt = await AsyncStorage.getItem("token");
    return jwt;
};
const UserMembersModal = ({ visible, setVisible }) => {
    //====================================================
    const { fetchUserProfileDetail, userProfile } = useFetchUser()
    const [loggedInUserId, setLoggedInUserId] = useState(userProfile._id)
 
    useEffect(() => {
        if (!userProfile) {
            fetchUserProfileDetail()
        }
    }, [fetchUserProfileDetail])
 
 
// console.log('userProfile',userProfile?._id);
 
    //====================================================
 
 
 
    const [liveMembers, setLiveMembers] = useState('')
    const [disconnectedMembers, setDisconnectedMembers] = useState('')
 
    const getLiveMembersSocket = async (id) => {
        console.log(`user_${id} --->user_${id}`,);
       
        onEvent(`user_${id}`, (data) => {
            console.log('Socket Members 🟢', data.name);
 
            setLiveMembers(data.id);
        });
 
    };
 
    const getDIsconnectedMembersSocket = async () => {
 
        onEvent(`disconnectedMembers`, (data) => {
            setDisconnectedMembers(data?.id)
            console.log('Disconnected Members 🔴', data?.name);
 
        });
 
    };
 
 
 
 
 
    useEffect(() => {
        getDIsconnectedMembersSocket()
 
    }, [getDIsconnectedMembersSocket]);
 
 
 
    useEffect(() => {
 
        if (userProfile?._id) { getLiveMembersSocket(userProfile?._id) }
        return () => {
            offEvent(`user_${userProfile._id}`);
            // disconnectSocket(); // Cleanup on unmount
        };
    }, [userProfile?._id]);
 
 
 
 
    // getDIsconnectedMembersSocket()
 
 
 
 
 
 
    return (
        <SafeAreaView style={styles.container}>
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                onBackdropPress={() => setVisible(false)}
                onBackButtonPress={() => setVisible(false)}
                style={styles.modal}
            >
                <SafeAreaView style={styles.modalContent}>
                    <TouchableOpacity onPress={() => setVisible(false)}>
                        <Text style={styles.closeIndicator}></Text>
                    </TouchableOpacity>
                    <UserMembers
                        setLiveMembers={setLiveMembers}
                        // liveMemberId={members?.[0]?.clientId}
                        liveMemberId={liveMembers}
                        disconnectedMembersId={disconnectedMembers}
                    />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};
 
const styles = StyleSheet.create({
    modal: {
        margin: 0, // Remove default margin to make it full width
        justifyContent: "flex-end",
    },
    modalContent: {
        height: "80%",
        backgroundColor: "#f2f2f2",
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
    },
    closeIndicator: {
        backgroundColor: "black",
        width: 220,
        height: 4,
        borderRadius: 9,
        marginVertical: 0,
        marginBottom: 17,
    },
});
 
export default UserMembersModal;