import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useNavigation } from '@react-navigation/native';

const MemberHeader = ({ decodedToken }) => {
    const navigation = useNavigation();

    // console.log(decodedToken)
    return (
        <View>
            <View style={styles.header}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/456/456172.png' }} // Replace with your image URL
                        style={{ height: 25, width: 25 }}
                    />

                <Text style={styles.dashboardTitle}>{decodedToken?.data?.name}'s Dashboard</Text>

                <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3177/3177336.png' }} // Replace with your image URL
                        style={{ height: 25, width: 25, marginHorizontal: 5, }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default MemberHeader;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation:2,
        marginBottom:10,
    },
    headerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dashboardTitle: {
        color: '#376ADA',
        fontSize: 18,
        fontWeight: 'bold',
    },
})