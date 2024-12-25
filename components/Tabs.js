import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DailyTransit from '../components/dailyTransit';

const Insights = ({ member, memberDetails }) => {
    const [activeTab, setActiveTab] = useState('1 Day'); // Default active tab

    const renderInsights = () => {
        switch (activeTab) {
            case '1 Day':
                return <Text style={styles.tabContent}>Insights for the last 24 hours...</Text>;
            case '7 Days':
                return <Text style={styles.tabContent}>Insights for the last 7 days...</Text>;
            case '1 Month':
                return <Text style={styles.tabContent}>Insights for the last month...</Text>;
                case 'Year':
                    return <Text style={styles.tabContent}>Insights for the Year</Text>;
            default:
                return null;
        }
    };

    // console.log('======member location======')
    // console.log(memberDetails)

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === '1 Day' && styles.activeTab]}
                    onPress={() => setActiveTab('1 Day')}
                >
                    <Text style={styles.tabText}>1 Day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === '7 Days' && styles.activeTab]}
                    onPress={() => setActiveTab('7 Days')}
                >
                    <Text style={styles.tabText}>7 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === '1 Month' && styles.activeTab]}
                    onPress={() => setActiveTab('1 Month')}
                >
                    <Text style={styles.tabText}>1 Month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Year' && styles.activeTab]}
                    onPress={() => setActiveTab('Year')}
                >
                    <Text style={styles.tabText}>Year</Text>
                </TouchableOpacity>
            </View>
            {/* <DailyTransit/> */}
            {/* <View style={styles.card}>
                <View style={styles.trackingContainer}>
                    <Text style={styles.trackingTitle}>Latest Tracking Info</Text>
                    <Text style={styles.trackingDetail}>
                        <Text style={styles.label}>Location:</Text> {member.latestTracking?.formattedAddress || 'Not Available'}
                    </Text>
                    <Text style={styles.trackingDetail}>
                        <Text style={styles.label}>Timestamp:</Text> {new Date(member.latestTracking?.timestamp).toLocaleString() || 'Not Available'}
                    </Text>
                    <Text style={styles.trackingDetail}>
                        <Text style={styles.label}>Address:</Text> {member.latestTracking?.formattedAddress || 'Not Available'}
                    </Text>
                </View>
            </View> */}
            {/* {renderInsights()} */}
        </View>
    );
};

export default Insights;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#376ADA',
        marginBottom: 10,
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#376ADA',
    },
    activeTab: {
        backgroundColor: '#376ADA',
        color: "white",
    },
    tabText: {
        color: '#376ADA',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    memberName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#376ADA',
    },
    memberEmail: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    memberMobile: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    trackingContainer: {
    },
    trackingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#376ADA',
        marginBottom: 10,
    },
    trackingDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        color: '#376ADA',
    },
    tabContent: {
        fontSize: 16,
        color: '#666',
        marginTop: 15,
    },
});
