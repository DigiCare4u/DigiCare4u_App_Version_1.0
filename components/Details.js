import { Text, View, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
// import MoreReport from '../components/MoreReport'
import InsightTwo from "./Member/InsightTwo";

const Details = ({ decodedToken }) => {
    
    console.log('decodedToken====', decodedToken)

    return (
        <View style={styles.container}>
            {/* Main Header Container */}
            <View style={styles.textContainer}>
                <View>
                    <TouchableOpacity>
                        <Image
                            source={{
                                uri: decodedToken?.data?.images || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                            }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ marginHorizontal: 15 }}>

                    <Text style={styles.nameText}>Name : {decodedToken?.data?.name}</Text>
                    <Text style={styles.employeeIdText}>
                        <Text style={styles.nameNumber}>Mobile : {decodedToken?.data?.mobile}</Text></Text>
                    <Text style={styles.nameTextz}>Email : {decodedToken?.data?.email}</Text>
                </View>
            </View>
            {/* <MoreReport/> */}
            <InsightTwo />
        </View>
    );
};

export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    profileImage: {
        width: 60, // Adjust size as needed
        height: 60, // Adjust size as needed
        borderRadius: 50, // Make it circular
    },
    textContainer: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#FFF",
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    nameText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: "#376ADA",
    },
    nameNumber: {
        fontSize: 14,
        // fontWeight: 'bold',
        color: "#000",
    },
    nameTextz: {
        fontSize: 15,
        // fontWeight: 'bold',
        color: "#000",
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
