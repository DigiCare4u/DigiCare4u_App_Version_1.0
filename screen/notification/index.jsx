import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Goback from "../../components/GoBack";

const messages = [
    {
        id: '1',
        sender: 'John Doe',
        message: 'Hey! How are you doing today?',
        timestamp: '10:00 AM',
        avatar: 'https://via.placeholder.com/40',
    },
    {
        id: '2',
        sender: 'Alice Smith',
        message: 'Your appointment is confirmed for tomorrow.',
        timestamp: '09:45 AM',
        avatar: 'https://via.placeholder.com/40',
    },
    {
        id: '3',
        sender: 'David Johnson',
        message: 'Don’t forget to check your reminders.',
        timestamp: '09:30 AM',
        avatar: 'https://via.placeholder.com/40',
    },
    {
        id: '4',
        sender: 'Jane Doe',
        message: 'New updates are available for your app.',
        timestamp: 'Yesterday',
        avatar: 'https://via.placeholder.com/40',
    },
    {
        id: '5',
        sender: 'Alice Smith',
        message: 'You received a friend request from Alice.',
        timestamp: 'Last week',
        avatar: 'https://via.placeholder.com/40',
    },
];

export default function Notification({ navigation }) {
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.messageItem} onPress={() => alert('read message')}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.messageContent}>
                <Text style={styles.sender}>{item.sender}</Text>
                <Text style={styles.messageText}>{item.message}</Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Goback/>
                <Text style={styles.title}>Messages</Text>
            </View>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 14,
        backgroundColor: "#f8f9fa", 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#343a40',
    },
    messageList: {
        paddingBottom: 20,
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
        marginVertical: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },
    messageContent: {
        flex: 1,
    },
    sender: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#495057',
    },
    messageText: {
        fontSize: 14,
        color: '#6c757d',
    },
    timestamp: {
        fontSize: 12,
        color: '#adb5bd',
        marginLeft: 10,
    },
});
