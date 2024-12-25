import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";


const Report = ({decodedToken}) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Running Report</Text>
                <TouchableOpacity style={styles.downloadButton}>
                    <Image source={{ uri: "https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png" }} style={{ height: 40, width: 40, borderRadius: 25, elevation: 5, marginRight: 15 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Report;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 2,
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
    detailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    detailCard: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    detailLabel: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#376ADA",
    },
    detailValue: {
        fontSize: 15,
        color: "#000",
        marginTop: 5,
    },
});
