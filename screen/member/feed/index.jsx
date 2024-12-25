import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MemberImagesCollarge from '../../../components/Member/Channel/MemberImagesCollarge';

const MemberFeed = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Member Wall</Text>
      </View>
      <View>
      <MemberImagesCollarge/>
      </View>
    </SafeAreaView>
  );
};

export default MemberFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
  },
  headerText: {
    color: '#007ACC',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
