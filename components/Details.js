import { Text, View, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MoreReport from '../components/MoreReport'
import InsightTwo from "./Member/InsightTwo";

const Details = ({ decodedToken }) => {

    return (
        <View style={styles.container}>
            {/* Main Header Container */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Daily Insights</Text>
            </View>
            <View style={styles.textContainer}>
              <View>
                <TouchableOpacity onPress={() => console.log("This is not working wait for next upgrade")}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                    style={styles.profileImage}
                />
                </TouchableOpacity>
              </View>
                <Text style={styles.nameText}>{decodedToken?.data?.name}</Text>
                <Text style={styles.employeeIdText}>
                    <Text style={styles.nameNumber}>Number : {decodedToken?.data?.mobile}</Text></Text>
                <Text style={styles.nameTextz}>{decodedToken?.data?.email}</Text>
                {/* Daity report */}
                <View style={{ marginTop: 20 }}>
                </View>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Running Report</Text>

                </View>
            </View>
            {/* <MoreReport/> */}
            <InsightTwo/>
        </View>
    );
};

export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        position: "relative",
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    headerText: {
        fontSize: 24,
        color: "#376ADA",
        fontWeight: 'bold',
        paddingTop: 10,
        marginLeft: 10,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    headerText: {
        fontSize: 23,
        padding: 2,
        fontWeight: "bold",
        color: "#376ADA",
    },
    downloadButton: {
        padding: 5,
        borderRadius: 25,
        height: 40, width: 40,
    },
    downloadButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    profileImage: {
        width: 70, // Adjust size as needed
        height: 70, // Adjust size as needed
        borderRadius: 50, // Make it circular
        position: "absolute", // Position it absolutely
        left: '80%', // Center it horizontally
        top: -10,

    },
    textContainer: {
        padding: 15,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: "#FFF",
        // backgroundColor: "red",
    },
    nameText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: "#376ADA",
    },
    nameNumber:{
        fontSize: 14,
        fontWeight: 'bold',
        color: "#376ADA",
    },
    nameTextz: {
        fontSize: 15,
        fontWeight: 'bold',
        color: "#376ADA",
    },
    employeeIdText: {
        fontSize: 16,
        color: '#666',
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    tab: {
        flex: 1,
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "#e0e0e0",
        marginRight: 4,
    },
    activeTab: {
        backgroundColor: "#376ADA",
    },
    tabText: {
        fontSize: 16,
        color: "#000",
    },
    activeTabText: {
        color: "#fff",
    },
    contentContainer: {
        padding: 20,
        borderWidth: 1,
        borderColor: "#376ADA",
        borderRadius: 10,
    },
    contentText: {
        fontSize: 18,
    },
});
