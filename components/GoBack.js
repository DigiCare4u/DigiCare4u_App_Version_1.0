import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from '@react-navigation/native'; 

export default function Goback() {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Image 
            source={{ uri: 'https://cdn1.iconfinder.com/data/icons/essential-29/24/arrow-ios-back-512.png' }} // Replace with your image URL
            style={{height:35, width:35}} 
          />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
 
});
