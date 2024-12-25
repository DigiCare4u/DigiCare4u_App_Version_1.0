import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import MembersTeamList from "../MemberTeamList";
import { io } from "socket.io-client";
import { devURL } from "../../constants/endpoints";
import { initializeSocket, onEvent } from '../../services/socket';


const getMemberJWT =  async () =>{
        const jwt = await AsyncStorage.getItem('token');
        return jwt
};



const TeamMembers = ({ visible, setVisible, fetchLocalities }) => {
            const [socket_, setSocket_] = useState(null);
            const [members, setMembers] = useState([]);


    // useEffect(()=>{
    //     let socket ;

    //     // const initializeSocket = async() =>{
    //     //         const jwtToken = await getMemberJWT();
    //     // };


    //     initializeSocket(devURL)

    // }, [])

    const handle = (d) => {
 
        console.log('ddddddd', d);
    }
    // useEffect(() => {
 
    //     initializeSocket(devURL)
       
    //     // console.log("Socket Connected?", a);
    // }, [])
    // onEvent('user_66f673eaa447d313a6747f9a', handle)

    // useEffect(()=>{
    //     const socket = io(devURL);
    //     console.log('----------socket----------')
    //     console.log(socket.connected)
    // })


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
                        <Text style={styles.closeIndicator}>dsdddd</Text>
                    </TouchableOpacity>
                    <MembersTeamList
                        fetchLocalities={fetchLocalities}
                    />
                </SafeAreaView>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 0,  // Remove default margin to make it full width
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
        marginBottom: 17
    },
});

export default TeamMembers;
